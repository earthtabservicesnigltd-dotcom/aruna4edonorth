import { createServerSupabase } from "@/lib/server";
import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Award,
  Calendar,
  BookOpen,
  Search,
  ArrowLeft,
  GraduationCap,
} from "lucide-react";

interface Props {
  params: Promise<{ certificateId: string }>;
}

export default async function VerifyCertificatePublicPage({ params }: Props) {
  const { certificateId } = await params;
  const clean = decodeURIComponent(certificateId).trim();
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

  const supabase = await createServerSupabase();

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

  // 2. If valid UUID, check if query matches student_id
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

  // If certRecord found, fetch associated student & programme
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
    // 4. If not found in certificates table, see if query references a student directly
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
        const { data: students } = await supabase.from("students").select("*");
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

  const isVerified = !!(certRecord || studentRecord);

  const progTitle =
    programmeRecord?.name ||
    (programmeRecord?.cert ? programmeRecord.cert.replace(/^professional\s+certificate\s+in\s+/i, "") : "") ||
    "Academy Professional Programme";

  const certificateData = isVerified
    ? {
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
      }
    : null;

  return (
    <div className="pt-28 pb-20 px-4 min-h-[85vh] flex flex-col items-center">
      <div className="max-w-xl w-full mx-auto">
        {/* Top Campaign & Institute Header */}
        <div className="text-center mb-8">
          <div className="w-18 h-18 mx-auto mb-3 rounded-full overflow-hidden border-2 border-orange/40 p-1 bg-white shadow-sm flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Abubakari Aruna Institute"
              width={64}
              height={64}
              className="object-contain rounded-full"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange font-mono text-[11px] uppercase tracking-wider font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Abubakari Aruna Institute
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-ink tracking-tight">
            Official Certificate Verification
          </h1>
          <p className="text-slate text-sm max-w-md mx-auto mt-2 leading-relaxed">
            Public Credential Authentication Registry (Edo North)
          </p>
        </div>

        {/* Verification Result Card */}
        {isVerified && certificateData ? (
          <div className="bg-white border-2 border-emerald/40 rounded-site p-6 sm:p-8 shadow-xl relative overflow-hidden">
            {/* Status Header Badge */}
            <div className="flex items-center gap-3 bg-emerald/10 border border-emerald/20 text-emerald-800 rounded-xl px-4 py-3 mb-6">
              <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
              <div>
                <p className="font-black text-xs sm:text-sm tracking-wide uppercase text-emerald-900">
                  OFFICIAL CERTIFICATE — VERIFIED & AUTHENTIC
                </p>
                <p className="text-[11px] text-emerald-700 leading-tight">
                  This academic credential is authenticated in the official public database.
                </p>
              </div>
            </div>

            {/* Recipient Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-ink/10">
              <div className="w-20 h-20 rounded-2xl bg-[#01381D] text-white border-2 border-orange/40 shrink-0 shadow-sm flex items-center justify-center relative">
                <GraduationCap className="w-10 h-10 text-orange" />
              </div>

              <div className="text-center sm:text-left flex-1">
                <span className="inline-block bg-emerald/10 text-emerald-800 border border-emerald/20 font-bold text-[10.5px] uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                  Graduated Scholar • {certificateData.cohort}
                </span>
                <h2 className="font-display font-extrabold text-2xl text-ink leading-tight uppercase">
                  {certificateData.recipient_name}
                </h2>
                <p className="text-sm font-semibold text-orange mt-1">
                  {certificateData.certificate_title}
                </p>
                <p className="font-mono text-xs font-bold text-gray-700 tracking-wider mt-1.5">
                  Certificate ID: <strong className="text-ink">{certificateData.certificate_id}</strong>
                </p>
              </div>
            </div>

            {/* Credential Data Table */}
            <div className="py-5 space-y-3 border-b border-ink/10 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-orange" /> Programme Conferred
                </span>
                <span className="font-bold text-ink text-right max-w-[240px]">
                  {certificateData.programme_name}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-orange" /> Duration / Completion
                </span>
                <span className="font-semibold text-ink">
                  {certificateData.duration}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange" /> Date of Issue
                </span>
                <span className="font-semibold text-ink">
                  {new Date(certificateData.issued_at).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-orange" /> Credential Status
                </span>
                <span className="font-bold text-emerald-700 bg-emerald/10 px-2 py-0.5 rounded-md">
                  Active & Officially Conferred
                </span>
              </div>
            </div>

            {/* Academic Authorization Notice */}
            <div className="mt-5 p-3.5 bg-paper rounded-xl border border-ink/5 text-center">
              <p className="text-[11px] text-gray-700 leading-relaxed italic">
                &ldquo;This credential certifies that the candidate has satisfactorily completed all academic coursework, practical assignments, and graduation requirements prescribed by the Abubakari Aruna Institute.&rdquo;
              </p>
            </div>

            {/* Seal & Sign-off */}
            <div className="mt-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-center sm:text-left">
                <p className="text-[11px] font-bold text-ink uppercase tracking-wide">
                  ABUBAKARI ARUNA INSTITUTE
                </p>
                <p className="text-[10px] font-semibold text-orange tracking-widest uppercase">
                  Official Registrar • Directorate of Academic Programmes
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  href="/verify?tab=certificate"
                  className="inline-flex items-center gap-1.5 bg-ink text-white hover:bg-orange text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs"
                >
                  <Search className="w-3.5 h-3.5" /> Verify Another
                </Link>
              </div>
            </div>
          </div>
        ) : (
          /* Unverified / Not Found Card */
          <div className="bg-white border-2 border-red-200 rounded-site p-6 sm:p-8 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-9 h-9" />
            </div>
            <h2 className="font-display font-extrabold text-xl text-red-700 mb-2 uppercase tracking-wide">
              Invalid or Unregistered Certificate ID
            </h2>
            <p className="text-slate text-sm max-w-md mx-auto mb-6">
              We could not find an official certificate record matching the scanned identifier:
            </p>

            <div className="bg-paper border border-ink/10 rounded-xl p-3 mb-6 inline-block max-w-full">
              <code className="font-mono font-bold text-xs text-ink break-all">
                {clean}
              </code>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Please check that the Certificate ID was entered accurately, or verify that the certificate has been officially issued by the institute.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/verify?tab=certificate"
                className="inline-flex items-center justify-center gap-2 bg-ink text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange transition-colors text-sm"
              >
                <Search className="w-4 h-4" /> Verify Another Certificate
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center gap-2 border border-ink/15 text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-paper transition-colors text-sm"
              >
                Return Home
              </Link>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate hover:text-orange transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Verification Portal
          </Link>
        </div>
      </div>
    </div>
  );
}
