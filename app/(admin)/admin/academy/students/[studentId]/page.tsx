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
  
  // State for updating cohort
  const [newCohort, setNewCohort] = useState("");

  useEffect(() => {
    if (!studentId) return;
    fetchStudentData();
  }, [studentId]);

  async function fetchStudentData() {
    setLoading(true);

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

    let programmeName = "Unknown Programme";
    if (stuData.programme_id) {
      const { data: progData } = await supabase
        .from("programmes")
        .select("name")
        .eq("id", stuData.programme_id)
        .single();
        
      if (progData) programmeName = progData.name;
    }

    setStudent(stuData);
    setNewCohort(stuData.cohort || "Week 28"); // Initialize cohort input

    const { data: courses } = await supabase
      .from("courses")
      .select("id, title, order")
      .eq("programme_id", stuData.programme_id)
      .order("order", { ascending: true });

    const { data: progData } = await supabase
      .from("student_progress")
      .select("course_id, status, score, completed_at")
      .eq("student_id", studentId);

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

    const { data: certs } = await supabase
      .from("certificates")
      .select("*")
      .eq("student_id", studentId);

    const mappedCerts = (certs || []).map(cert => {
      return { ...cert, programme_name: programmeName };
    });
    setCertificates(mappedCerts);

    setLoading(false);
  }

  async function handleUpdateCohort() {
    const { error } = await supabase
      .from("students")
      .update({ cohort: newCohort })
      .eq("id", studentId);
      
    if (error) return toast.error("Failed to update cohort.");
    toast.success("Cohort updated successfully!");
    fetchStudentData(); // Refetch to show updated data
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
        {/* Left Column: Personal Info & Cohort Manager */}
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
            </div>
          </div>

          {/* Cohort Update Card */}
          <div className="bg-white border border-ink/10 rounded-site p-6">
            <h3 className="font-display font-semibold text-[16px] text-ink mb-4 border-b border-ink/10 pb-3">Cohort Manager</h3>
            <div className="flex items-start gap-3 mb-4">
              <Users className="w-4 h-4 text-slate mt-0.5" />
              <div className="flex-1">
                <div className="font-mono text-[10px] uppercase text-slate">Current Cohort</div>
                <div className="text-[13.5px] text-ink font-semibold">{student.cohort || "N/A"}</div>
              </div>
            </div>

            <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5">Change Cohort</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={newCohort} 
                onChange={(e) => setNewCohort(e.target.value)}
                placeholder="e.g. Week 29"
                className="flex-1 px-3 py-2 border border-ink/10 rounded-site text-[13.5px] bg-white outline-none focus:border-orange"
              />
              <button 
                onClick={handleUpdateCohort}
                className="bg-orange text-white px-4 py-2 rounded-site text-[12.5px] font-semibold hover:bg-orange-dark transition-colors"
              >
                Update
              </button>
            </div>
            <p className="text-[10.5px] text-slate mt-2 leading-relaxed">
              Changing the cohort will instantly update the schedules and assignments this student sees on their dashboard.
            </p>
          </div>

          {/* Certificates Card */}
          <div className="bg-white border border-ink/10 rounded-site p-6">
            <div className="flex items-center justify-between border-b border-ink/10 pb-3 mb-4">
              <h3 className="font-display font-semibold text-[16px] text-ink">Certificates</h3>
              <Link
                href={`/admin/academy/students/${studentId}/certificate`}
                className="font-mono text-[10.5px] uppercase tracking-wider text-orange hover:text-orange-dark font-semibold inline-flex items-center gap-1"
              >
                Preview
              </Link>
            </div>

            {certificates.length === 0 ? (
              <div className="text-center py-4 space-y-3">
                <p className="text-slate text-[13px]">No certificate record yet.</p>
                <Link
                  href={`/admin/academy/students/${studentId}/certificate`}
                  className="inline-flex items-center justify-center gap-1.5 w-full bg-orange/10 hover:bg-orange text-orange hover:text-white font-semibold py-2 px-3 rounded-site text-xs transition-colors"
                >
                  <Award className="w-3.5 h-3.5" /> Preview Student Certificate
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {certificates.map((cert) => (
                  <div key={cert.id} className="p-3 bg-emerald/5 border border-emerald/20 rounded-site space-y-2">
                    <div className="flex items-start gap-3">
                      <Award className="w-5 h-5 text-emerald shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <div className="text-[13px] font-semibold text-ink truncate">{cert.programme_name}</div>
                        <div className="font-mono text-[10px] text-slate">{cert.certificate_id}</div>
                      </div>
                    </div>
                    <Link
                      href={`/admin/academy/students/${studentId}/certificate`}
                      className="inline-flex items-center justify-center gap-1.5 w-full bg-[#01381D] hover:bg-orange text-white font-semibold py-1.5 px-3 rounded-site text-[11px] transition-colors"
                    >
                      <Award className="w-3 h-3" /> Preview & Download
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Course Progress */}
        <div className="lg:col-span-2 bg-white border border-ink/10 rounded-site p-6">
          <h3 className="font-display font-semibold text-[16px] text-ink mb-4 border-b border-ink/10 pb-3">
            Course Progress
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