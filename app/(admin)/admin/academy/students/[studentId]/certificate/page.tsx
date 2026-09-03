"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { ArrowLeft, Loader2, Award } from "lucide-react";
import Link from "next/link";
import CertificateCard, { CertificateData } from "@/components/CertificateCard";

export default function AdminStudentCertificatePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params?.studentId as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [programme, setProgramme] = useState<any>(null);
  const [certData, setCertData] = useState<CertificateData | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);

      // 1. Fetch student
      const { data: stuData } = await supabase
        .from("students")
        .select("*")
        .eq("id", studentId)
        .single();

      if (!stuData) {
        setLoading(false);
        return;
      }
      setStudent(stuData);

      // 2. Fetch programme
      let progData = null;
      if (stuData.programme_id) {
        const { data } = await supabase
          .from("programmes")
          .select("*")
          .eq("id", stuData.programme_id)
          .single();
        progData = data;
        setProgramme(data);
      }

      // 3. Fetch existing certificate if already issued
      let { data: certRecord } = await supabase
        .from("certificates")
        .select("*")
        .eq("student_id", studentId)
        .maybeSingle();

      const certificateId =
        certRecord?.certificate_id ||
        `AAI-${(stuData.programme_id ? stuData.programme_id.slice(0, 4) : "PROG").toUpperCase()}-${stuData.id.slice(0, 8).toUpperCase()}`;

      const issuedAt = certRecord?.created_at || new Date().toISOString();

      if (!certRecord) {
        try {
          await supabase.from("certificates").upsert({
            student_id: studentId,
            programme_id: stuData.programme_id,
            certificate_id: certificateId,
            status: "Issued",
            created_at: issuedAt,
          }, { onConflict: "certificate_id" });
        } catch (e) {
          console.warn("Could not auto-save certificate:", e);
        }
      }

      const programmeTitle = progData?.name || (progData?.cert ? progData.cert.replace(/^professional\s+certificate\s+in\s+/i, '') : "Estate Management");

      setCertData({
        certificate_id: certificateId,
        recipient_name: stuData.name || "Student Name",
        certificate_title: programmeTitle,
        issued_at: issuedAt,
        duration: progData?.duration || "8 Weeks",
      });

      setLoading(false);
    }

    if (studentId) {
      load();
    }
  }, [studentId, supabase]);

  if (loading) {
    return (
      <div className="py-20 text-center">
        <Loader2 className="w-8 h-8 text-orange animate-spin mx-auto mb-2" />
        <p className="text-slate text-sm font-medium">Generating certificate preview...</p>
      </div>
    );
  }

  if (!student || !certData) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate">Student or certificate data not found.</p>
        <button
          onClick={() => router.push("/admin/academy/students")}
          className="text-orange font-semibold mt-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Students
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-ink/10 pb-4">
        <div>
          <Link
            href={`/admin/academy/students/${studentId}`}
            className="inline-flex items-center gap-2 font-mono text-[11.5px] tracking-wide uppercase text-slate hover:text-orange transition-colors mb-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Student Profile
          </Link>
          <h1 className="font-display font-semibold text-2xl text-ink">
            Certificate Preview: <span className="text-orange">{student.name}</span>
          </h1>
          <p className="text-slate text-xs mt-0.5">
            Programme: {programme?.name || "General Academy Programme"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            href={`/verify/certificate/${certData.certificate_id}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-ink/15 rounded-xl text-xs font-semibold text-ink hover:border-orange hover:text-orange transition-colors bg-white shadow-xs"
          >
            <Award className="w-3.5 h-3.5" /> Verify Link
          </Link>
        </div>
      </div>

      {/* Render Certificate Card */}
      <div className="py-4">
        <CertificateCard cert={certData} showDownload={true} />
      </div>
    </div>
  );
}
