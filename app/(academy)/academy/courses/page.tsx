"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { Building, TreePine, TrendingUp, Cpu, Package, Cog, ArrowRight, Lock, CheckCircle, PlayCircle, Loader2 } from "lucide-react";
import { toast } from "sonner";

const iconMap: Record<string, any> = {
  "bi-building": Building,
  "bi-tree": TreePine,
  "bi-graph-up-arrow": TrendingUp,
  "bi-cpu": Cpu,
  "bi-box-seam": Package,
  "bi-gear-wide-connected": Cog,
};

export default function SchoolsPage() {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [activeSchool, setActiveSchool] = useState<any>(null);
  const [otherSchools, setOtherSchools] = useState<any[]>([]);
  const [progress, setProgress] = useState<Record<string, string>>({});
  const [nextCourse, setNextCourse] = useState<any>(null);
  const [isCurrentProgComplete, setIsCurrentProgComplete] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: stu } = await supabase
          .from("students")
          .select("id, programme_id")
          .eq("email", user.email)
          .single();

        if (stu) setStudentId(stu.id);

        const { data: progs } = await supabase
          .from("programmes")
          .select("id, name, icon, blurb, cert, courses(id, title, order)")
          .eq("active", true);

        const progMap: Record<string, string> = {};
        if (stu) {
          const { data: progData } = await supabase
            .from("student_progress")
            .select("course_id, status")
            .eq("student_id", stu.id);
          progData?.forEach(p => progMap[p.course_id] = p.status);
        }
        setProgress(progMap);

        if (progs) {
          if (stu?.programme_id) {
            const active = progs.find(p => p.id === stu.programme_id);
            const others = progs.filter(p => p.id !== stu.programme_id);
            
            if (active) {
              const sortedCourses = active.courses?.sort((a: any, b: any) => a.order - b.order) || [];
              const completedCount = sortedCourses.filter((c: any) => progMap[c.id] === 'completed').length;
              const isComplete = sortedCourses.length > 0 && completedCount === sortedCourses.length;
              
              setIsCurrentProgComplete(isComplete);
              
              // If complete, next course is null. If not, find the unlocked one.
              const next = isComplete ? null : (sortedCourses.find(c => progMap[c.id] === 'unlocked') || sortedCourses.find(c => progMap[c.id] !== 'completed'));
              setNextCourse(next);
              setActiveSchool({ ...active, sortedCourses });
            }
            setOtherSchools(others);
          } else {
            setOtherSchools(progs);
          }
        }
      }
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  async function handleSwitchProgramme(progId: string, firstCourseId?: string) {
    if (!studentId) return;
    setLoading(true);
    
    const { error } = await supabase
      .from("students")
      .update({ programme_id: progId })
      .eq("id", studentId);
      
    if (error) {
      toast.error("Failed to switch programme.");
      setLoading(false);
      return;
    }
    
    if (firstCourseId) {
      await supabase
        .from("student_progress")
        .upsert({
          student_id: studentId,
          course_id: firstCourseId,
          status: 'unlocked',
          lesson_completed: false,
        }, { onConflict: "student_id,course_id" });
        
      router.push(`/academy/courses/${firstCourseId}`);
    } else {
      router.refresh();
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
      </div>
    );
  }

  const completedCount = activeSchool?.sortedCourses?.filter((c: any) => progress[c.id] === 'completed').length || 0;
  const totalCourses = activeSchool?.sortedCourses?.length || 0;
  const progressPercent = totalCourses > 0 ? (completedCount / totalCourses) * 100 : 0;

  return (
    <div className="space-y-10">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">MY LEARNING PATH</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Academy Schools</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Follow your linear progression to complete your programme and earn your certificate.
        </p>
      </div>

      {/* Active School Roadmap */}
      {activeSchool ? (
        <div className="bg-white border border-ink/10 rounded-site overflow-hidden shadow-sm">
          <div className="bg-ink text-white p-6 md:p-8 relative overflow-hidden">
            <div 
              className="absolute inset-0 pointer-events-none opacity-40" 
              style={{ background: "radial-gradient(circle at 90% 10%, rgba(249,115,22,0.3), transparent 50%)" }} 
            />
            <div className="relative z-10 flex items-start gap-5 flex-wrap justify-between">
              <div className="flex items-start gap-5 flex-1 min-w-[200px]">
                <div className="w-14 h-14 rounded-site bg-orange/20 text-orange flex items-center justify-center shrink-0">
                  {(() => {
                    const Icon = iconMap[activeSchool.icon] || Building;
                    return <Icon className="w-7 h-7" />;
                  })()}
                </div>
                <div>
                  <span className="font-mono text-[10.5px] uppercase tracking-widest text-orange block mb-1">
                    {isCurrentProgComplete ? "Programme Completed" : "Enrolled Programme"}
                  </span>
                  <h2 className="font-display font-semibold text-[22px] md:text-[26px] leading-tight">{activeSchool.name}</h2>
                  <p className="text-[13.5px] text-white/70 mt-1 max-w-[60ch]">{activeSchool.blurb}</p>
                </div>
              </div>
              
              <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-col items-end gap-3">
                <div className="w-full md:w-[200px]">
                  <div className="flex justify-between font-mono text-[10.5px] text-white/60 mb-1.5">
                    <span>PROGRESS</span>
                    <span>{completedCount}/{totalCourses} COURSES</span>
                  </div>
                  <div className="w-full h-2 bg-white/15 rounded-full overflow-hidden">
                    <div className="h-full bg-orange rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
                  </div>
                </div>
                
                {isCurrentProgComplete ? (
                  <Link 
                    href="/academy/certificates" 
                    className="inline-flex items-center gap-2 bg-emerald text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-forest transition-colors"
                  >
                    View Certificate <CheckCircle className="w-4 h-4" />
                  </Link>
                ) : nextCourse && (
                  <Link 
                    href={`/academy/courses/${nextCourse.id}`}
                    className="inline-flex items-center gap-2 bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
                  >
                    {completedCount > 0 ? "Continue Programme" : "Start Programme"} <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>

          {/* Course Timeline */}
          <div className="p-6 md:p-8">
            <div className="relative pl-8 space-y-6">
              <div className="absolute left-[14px] top-2 bottom-2 w-[2px] bg-ink/10" />

              {activeSchool.sortedCourses.map((course: any, index: number) => {
                const status = progress[course.id] || (index === 0 ? 'unlocked' : 'locked');
                
                return (
                  <div key={course.id} className="relative">
                    <div className={`absolute -left-8 top-0 w-[30px] h-[30px] rounded-full flex items-center justify-center border-[2px] bg-white z-10 ${
                      status === 'completed' ? 'border-emerald text-emerald' :
                      status === 'unlocked' ? 'border-orange text-orange' : 'border-ink/20 text-slate/40'
                    }`}>
                      {status === 'completed' ? <CheckCircle className="w-4 h-4" /> : 
                       status === 'unlocked' ? <PlayCircle className="w-4 h-4" /> : 
                       <Lock className="w-3.5 h-3.5" />}
                    </div>

                    <div className={`flex items-center justify-between gap-4 flex-wrap pt-1 ${status === 'locked' ? 'opacity-60' : ''}`}>
                      <div className="flex-1 min-w-[200px]">
                        <span className="font-mono text-[10.5px] text-slate uppercase tracking-wide">Course {course.order}</span>
                        <h4 className="font-display font-semibold text-[16px] text-ink leading-tight">{course.title}</h4>
                        {status === 'completed' && <span className="font-mono text-[10px] text-emerald mt-1 block">Completed</span>}
                        {status === 'unlocked' && nextCourse?.id === course.id && (
                          <span className="font-mono text-[10px] text-orange mt-1 block">In Progress</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white border border-ink/10 rounded-site p-8 text-center">
          <p className="text-slate text-sm">You are not enrolled in a programme yet. Choose one below to start.</p>
        </div>
      )}

      {/* Other Available Schools */}
      {otherSchools.length > 0 && (
        <div>
          <h3 className="font-mono text-[11px] tracking-widest text-slate uppercase mb-4">Other Available Schools</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {otherSchools.map((school) => {
              const Icon = iconMap[school.icon] || Building;
              const sortedCourses = school.courses?.sort((a: any, b: any) => a.order - b.order) || [];
              const cCount = sortedCourses.filter((c: any) => progress[c.id] === 'completed').length;
              const tCourses = sortedCourses.length;
              const isCompleted = cCount === tCourses && tCourses > 0;
              const firstCourse = sortedCourses[0];
              
              return (
                <div key={school.id} className="bg-white border border-ink/10 rounded-site p-5 flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-site bg-paper text-slate flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    {isCompleted && <CheckCircle className="w-4 h-4 text-emerald ml-auto" />}
                  </div>
                  <h4 className="font-display font-semibold text-[16px] text-ink leading-tight mb-1">{school.name}</h4>
                  <p className="text-[12.5px] text-slate leading-relaxed line-clamp-2 mb-4 flex-1">{school.blurb}</p>
                  
                  {isCompleted ? (
                    <Link href="/academy/certificates" className="w-full bg-paper border border-ink/10 text-slate hover:bg-ink/10 py-2 rounded-site font-semibold text-[12.5px] transition-colors flex items-center justify-center gap-2">
                      View Certificate <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  ) : isCurrentProgComplete ? (
                    <button 
                      onClick={() => handleSwitchProgramme(school.id, firstCourse?.id)}
                      className="w-full bg-orange text-white hover:bg-orange-dark py-2 rounded-site font-semibold text-[12.5px] transition-colors flex items-center justify-center gap-2"
                    >
                      Enroll Now <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <div className="w-full bg-paper border border-ink/10 text-slate/50 py-2 rounded-site font-semibold text-[12.5px] flex items-center justify-center gap-2 cursor-not-allowed">
                      <Lock className="w-3.5 h-3.5" /> Locked
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}