import { createServerSupabase } from "@/lib/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Award, Lock, ArrowRight } from "lucide-react";

export default async function CertificatesPage() {
  const supabase = await createServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login-signup");

  const { data: student } = await supabase
    .from("students")
    .select("id, name")
    .eq("email", user.email)
    .single();

  // 1. Fetch all programmes with their courses
  const { data: programmes } = await supabase
    .from("programmes")
    .select("id, name, blurb, courses(id)")
    .eq("active", true);

  // 2. Fetch student progress
  const { data: progressData } = await supabase
    .from("student_progress")
    .select("course_id, status")
    .eq("student_id", student?.id)
    .eq("status", "completed");

  // 3. Fetch earned certificates
  const { data: earnedCerts } = await supabase
    .from("certificates")
    .select("programme_id, certificate_id")
    .eq("student_id", student?.id)
    .eq("status", "Issued");

  const earnedCertMap = new Map(earnedCerts?.map(c => [c.programme_id, c.certificate_id]));
  const completedCourseIds = new Set(progressData?.map(p => p.course_id) || []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <p className="text-[13.5px] text-slate mt-1">Complete a programme to unlock and download your certificate.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes?.map((prog) => {
          const totalCourses = prog.courses?.length || 0;
          const completedCount = prog.courses?.filter((c: any) => completedCourseIds.has(c.id)).length || 0;
          const isComplete = totalCourses > 0 && completedCount === totalCourses;
          const certId = earnedCertMap.get(prog.id);

          return (
            <div key={prog.id} className={`bg-white border rounded-site p-6 flex flex-col items-center text-center ${isComplete ? 'border-emerald/30' : 'border-ink/10'}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${isComplete ? 'bg-emerald/10 text-emerald' : 'bg-paper text-slate/30'}`}>
                {isComplete ? <Award className="w-8 h-8" /> : <Lock className="w-7 h-7" />}
              </div>
              
              <h3 className="font-display font-semibold text-[16px] text-ink mb-1">{prog.name}</h3>
              <p className="text-[12px] text-slate mb-5 flex-1">{prog.blurb}</p>

              {isComplete ? (
                <Link 
                  href={`/academy/certificates/${prog.id}`} 
                  className="w-full inline-flex items-center justify-center gap-2 bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
                >
                  View Certificate <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <div className="w-full bg-paper border border-ink/10 text-slate/50 px-5 py-2.5 rounded-site font-semibold text-[13px] flex items-center justify-center gap-2 cursor-not-allowed">
                  <Lock className="w-4 h-4" /> Locked
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}