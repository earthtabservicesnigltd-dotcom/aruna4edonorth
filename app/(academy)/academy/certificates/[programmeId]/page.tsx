import { createServerSupabase } from "@/lib/server";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import CertificateCard, { CertificateData } from "@/components/CertificateCard";

export default async function CertificateViewPage({ params }: { params: Promise<{ programmeId: string }> }) {
  const { programmeId } = await params;
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login-signup");

  const { data: student } = await supabase
    .from("students")
    .select("id, name")
    .eq("email", user.email)
    .single();

  // 1. Fetch Programme Details
  const { data: programme } = await supabase
    .from("programmes")
    .select("name, cert")
    .eq("id", programmeId)
    .single();

  if (!programme) notFound();

  // 2. Fetch Courses for this programme
  const { data: courses } = await supabase
    .from("courses")
    .select("id")
    .eq("programme_id", programmeId);

  // 3. Verify Completion
  const { data: completedCourses } = await supabase
    .from("student_progress")
    .select("course_id")
    .eq("student_id", student?.id)
    .in("course_id", courses?.map(c => c.id) || [])
    .eq("status", "completed");

  const isComplete = courses && completedCourses && courses.length === completedCourses.length;

  if (!isComplete) {
    redirect("/academy/certificates");
  }

  // 4. Fetch or Generate Certificate Record
  let { data: certRecord } = await supabase
    .from("certificates")
    .select("certificate_id, created_at")
    .eq("student_id", student?.id)
    .eq("programme_id", programmeId)
    .single();

  let certId = certRecord?.certificate_id;
  let issuedAt = certRecord?.created_at;

  // If they completed it but don't have a cert record yet, create one on the fly
  if (!certId) {
    // Clean, guaranteed unique ID format: MAI-PROGID-STUID
    certId = `MAI-${programmeId.slice(0, 8).toUpperCase()}-${student?.id.slice(0, 8).toUpperCase()}`;
    issuedAt = new Date().toISOString();
    
    await supabase.from("certificates").upsert({
      student_id: student?.id,
      programme_id: programmeId,
      certificate_id: certId,
      status: "Issued",
      created_at: issuedAt
    }, { onConflict: "student_id,programme_id" });
  }

  // 5. Map the database data to your CertificateCard interface
  const programmeTitle = programme.name || (programme.cert ? programme.cert.replace(/^professional\s+certificate\s+in\s+/i, '') : "Programme");

  const certData: CertificateData = {
    certificate_id: certId,
    recipient_name: student?.name || "Student",
    certificate_title: programmeTitle,
    issued_at: issuedAt || new Date().toISOString(),
    duration: (programme as any)?.duration || "8 Weeks"
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 py-8">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <Link href="/academy/certificates" className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-slate hover:text-orange transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Certificates
        </Link>
      </div>

      {/* Render the Client Component */}
      <CertificateCard cert={certData} showDownload={true} />
    </div>
  );
}