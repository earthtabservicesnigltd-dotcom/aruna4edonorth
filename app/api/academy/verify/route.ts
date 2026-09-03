import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("id");

    if (!query) {
      return NextResponse.json({ error: "Certificate ID required" }, { status: 400 });
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const clean = decodeURIComponent(query).trim();
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

    let certRecord: any = null;
    let studentRecord: any = null;
    let programmeRecord: any = null;

    // 1. Direct match on certificate_id in certificates table
    const { data: certById } = await supabase
      .from("certificates")
      .select("*")
      .ilike("certificate_id", clean)
      .maybeSingle();

    if (certById) {
      certRecord = certById;
    }

    // 2. If valid UUID, check if query is student_id in certificates table
    if (!certRecord && isUUID) {
      const { data: certByStudent } = await supabase
        .from("certificates")
        .select("*")
        .eq("student_id", clean)
        .maybeSingle();

      if (certByStudent) {
        certRecord = certByStudent;
      }
    }

    // 3. Fallback: match certificate_id with wildcards
    if (!certRecord && clean.length >= 4) {
      const { data: certByLike } = await supabase
        .from("certificates")
        .select("*")
        .ilike("certificate_id", `%${clean}%`)
        .maybeSingle();

      if (certByLike) {
        certRecord = certByLike;
      }
    }

    // If certRecord was found, fetch its associated student & programme
    if (certRecord) {
      if (certRecord.student_id) {
        const { data: stu } = await supabase
          .from("students")
          .select("*")
          .eq("id", certRecord.student_id)
          .maybeSingle();
        studentRecord = stu;
      }

      const progId = certRecord.programme_id || studentRecord?.programme_id;
      if (progId) {
        const { data: prog } = await supabase
          .from("programmes")
          .select("*")
          .eq("id", progId)
          .maybeSingle();
        programmeRecord = prog;
      }
    } else {
      // 4. If not found in certificates table, see if the query references a student directly
      // E.g. Query might be UUID, or AAI-PROG-STUID where STUID is 8 chars, or a Student Name
      let matchedStudent: any = null;

      if (isUUID) {
        const { data: stu } = await supabase
          .from("students")
          .select("*")
          .eq("id", clean)
          .maybeSingle();
        matchedStudent = stu;
      }

      // Check if format is AAI-...-XXXXXXXX or MAI-...-XXXXXXXX
      if (!matchedStudent) {
        const parts = clean.split("-");
        const lastPart = parts[parts.length - 1];
        if (lastPart && lastPart.length === 8) {
          const { data: students } = await supabase
            .from("students")
            .select("*");
          matchedStudent = students?.find((s: any) =>
            s.id?.toLowerCase().startsWith(lastPart.toLowerCase())
          );
        }
      }

      // Check by student name
      if (!matchedStudent && clean.length >= 3) {
        const { data: stuByName } = await supabase
          .from("students")
          .select("*")
          .ilike("name", `%${clean}%`)
          .maybeSingle();
        matchedStudent = stuByName;
      }

      if (matchedStudent) {
        studentRecord = matchedStudent;
        if (matchedStudent.programme_id) {
          const { data: prog } = await supabase
            .from("programmes")
            .select("*")
            .eq("id", matchedStudent.programme_id)
            .maybeSingle();
          programmeRecord = prog;
        }

        const genCertId = clean.toUpperCase().startsWith("AAI-") || clean.toUpperCase().startsWith("MAI-")
          ? clean.toUpperCase()
          : `AAI-${(matchedStudent.programme_id ? matchedStudent.programme_id.slice(0, 4) : "PROG").toUpperCase()}-${matchedStudent.id.slice(0, 8).toUpperCase()}`;

        const issuedDate = new Date().toISOString();

        // Auto-upsert into certificates table so it's permanently stored
        try {
          const { data: upserted } = await supabase
            .from("certificates")
            .upsert(
              {
                student_id: matchedStudent.id,
                programme_id: matchedStudent.programme_id,
                certificate_id: genCertId,
                status: "Issued",
                created_at: issuedDate,
              },
              { onConflict: "certificate_id" }
            )
            .select()
            .maybeSingle();
          certRecord = upserted || {
            certificate_id: genCertId,
            student_id: matchedStudent.id,
            programme_id: matchedStudent.programme_id,
            status: "Issued",
            created_at: issuedDate,
          };
        } catch {
          certRecord = {
            certificate_id: genCertId,
            student_id: matchedStudent.id,
            programme_id: matchedStudent.programme_id,
            status: "Issued",
            created_at: issuedDate,
          };
        }
      }
    }

    if (!certRecord && !studentRecord) {
      return NextResponse.json(
        { found: false, message: "Certificate ID not found in the official academy records." },
        { status: 404 }
      );
    }

    const progTitle =
      programmeRecord?.name ||
      (programmeRecord?.cert ? programmeRecord.cert.replace(/^professional\s+certificate\s+in\s+/i, "") : "") ||
      "Academy Professional Programme";

    return NextResponse.json({
      found: true,
      certificate: {
        certificate_id: certRecord?.certificate_id || clean,
        student_id: studentRecord?.id || certRecord?.student_id,
        recipient_name: studentRecord?.name || "Graduated Student",
        certificate_title: progTitle,
        programme_name: programmeRecord?.name || progTitle,
        issued_at: certRecord?.created_at || new Date().toISOString(),
        duration: programmeRecord?.duration || "8 Weeks",
        status: certRecord?.status || "Issued",
        institution: "Abubakari Aruna Institute",
        lga: studentRecord?.lga || "Edo North",
        cohort: studentRecord?.cohort || "Week 28",
      },
    });
  } catch (err: any) {
    console.error("Certificate verify API error:", err);
    return NextResponse.json({ found: false, error: "Internal server error" }, { status: 500 });
  }
}
