"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { Loader2, ArrowLeft, CheckCircle, Lock, PlayCircle, Award, Mail, Phone, MapPin, Users } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminStudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.studentId as string;
  const supabase = createClient();

  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [progress, setProgress] = useState<any[]>([]);
  const [certificates, setCertificates] = useState<any[]>([]);

  useEffect(() => {
    if (!studentId) return;
    fetchStudentData();
  }, [studentId]);

  async function fetchStudentData() {
    setLoading(true);

    // 1. Fetch Student Profile
    const { data: stuData, error: stuErr } = await supabase
      .from("students")
      .select("*")
      .eq("id", studentId)
      .single();

    if (stuErr || !stuData) {
      toast.error("Student not found");
      router.push("/admin/academy/students");
      return;
    }

    // 2. Fetch Programme Name separately
    let programmeName = "Unknown Programme";
    if (stuData.programme_id) {
      const { data: progData } = await supabase
        .from("programmes")
        .select("name")
        .eq("id", stuData.programme_id)
        .single();
        
      if (progData) programmeName = progData.name;
    }

    // Attach programme name to student object
    setStudent({ ...stuData, programme_name: programmeName });

    // 3. Fetch all courses for this student's programme
    const { data: courses } = await supabase
      .from("courses")
      .select("id, title, order")
      .eq("programme_id", stuData.programme_id)
      .order("order", { ascending: true });

    // 4. Fetch student progress
    const { data: progData } = await supabase
      .from("student_progress")
      .select("course_id, status, score, completed_at")
      .eq("student_id", studentId);

    // Merge courses with progress
    const mappedProgress = courses?.map(course => {
      const p = progData?.find(p => p.course_id === course.id);
      return {
        ...course,
        status: p?.status || 'locked',
        score: p?.score,
        completed_at: p?.completed_at
      };
    }) || [];
    setProgress(mappedProgress);

    // 5. Fetch certificates
    const { data: certs } = await supabase
      .from("certificates")
      .select("*")
      .eq("student_id", studentId);

    // Manually map programme names to certificates
    const mappedCerts = (certs || []).map(cert => {
      return { ...cert, programme_name: programmeName };
    });
    setCertificates(mappedCerts);

    setLoading(false);
  }

  if (loading || !student) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin/academy/students" className="inline-flex items-center gap-2 text-[12px] text-slate hover:text-orange mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Students
        </Link>
        <h1 className="font-display font-semibold text-[24px] text-ink">{student.name}</h1>
        <p className="text-[13.5px] text-slate mt-1">Student Profile & Academy Progress</p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column: Personal Info */}
        <div className="space-y-6">
          <div className="bg-white border border-ink/10 rounded-site p-6">
            <h3 className="font-display font-semibold text-[16px] text-ink mb-4 border-b border-ink/10 pb-3">Personal Info</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-slate mt-0.5" />
                <div>
                  <div className="font-mono text-[10px] uppercase text-slate">Email</div>
                  <div className="text-[13.5px] text-ink break-all">{student.email}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-slate mt-0.5" />
                <div>
                  <div className="font-mono text-[10px] uppercase text-slate">Phone</div>
                  <div className="text-[13.5px] text-ink">{student.phone || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-slate mt-0.5" />
                <div>
                  <div className="font-mono text-[10px] uppercase text-slate">LGA</div>
                  <div className="text-[13.5px] text-ink">{student.lga || "N/A"}</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="w-4 h-4 text-slate mt-0.5" />
                <div>
                  <div className="font-mono text-[10px] uppercase text-slate">Cohort</div>
                  <div className="text-[13.5px] text-ink">{student.cohort || "N/A"}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Certificates Card */}
          <div className="bg-white border border-ink/10 rounded-site p-6">
            <h3 className="font-display font-semibold text-[16px] text-ink mb-4 border-b border-ink/10 pb-3">Certificates</h3>
            {certificates.length === 0 ? (
              <p className="text-slate text-[13px] text-center py-4">No certificates earned yet.</p>
            ) : (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="flex items-center gap-3 p-3 bg-emerald/5 border border-emerald/20 rounded-site">
                    <Award className="w-5 h-5 text-emerald shrink-0" />
                    <div>
                      <div className="text-[13px] font-medium text-ink">{cert.programme_name}</div>
                      <div className="font-mono text-[10px] text-slate">{cert.certificate_id}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Course Progress */}
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-site p-6">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-4 border-b border-ink/10 pb-3">
            Course Progress: <span className="text-orange">{student.programme_name}</span>
          </h3>

          <div className="space-y-4">
            {progress.map((course) => (
              <div key={course.id} className="flex items-center gap-4 p-3 border border-ink/5 rounded-site">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
                  course.status === 'completed' ? 'bg-emerald/10 text-emerald' :
                  course.status === 'unlocked' ? 'bg-orange/10 text-orange' : 'bg-paper text-slate/40'
                }`}>
                  {course.status === 'completed' ? <CheckCircle className="w-5 h-5" /> : 
                   course.status === 'unlocked' ? <PlayCircle className="w-5 h-5" /> : 
                   <Lock className="w-4 h-4" />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="font-mono text-[10px] text-slate uppercase mb-0.5">Course {course.order}</div>
                  <div className="text-[13.5px] font-medium text-ink truncate">{course.title}</div>
                </div>

                <div className="text-right shrink-0">
                  {course.status === 'completed' ? (
                    <>
                      <div className="font-mono text-[10px] text-emerald uppercase">Completed</div>
                      {course.score && <div className="text-[12.5px] text-ink font-semibold">Score: {course.score}%</div>}
                    </>
                  ) : course.status === 'unlocked' ? (
                    <div className="font-mono text-[10px] text-orange uppercase">In Progress</div>
                  ) : (
                    <div className="font-mono text-[10px] text-slate uppercase">Locked</div>
                  )}
                </div>
              </div>
            ))}
            
            {progress.length === 0 && (
              <div className="text-center py-8 text-slate text-[13px]">No courses found for this programme.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}