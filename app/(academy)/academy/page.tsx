"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { ArrowRight, CheckCircle, FileText, BadgeCheck, GraduationCap, Loader2 } from "lucide-react";

export default function AcademyDashboardPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [currentCourse, setCurrentCourse] = useState<any>(null);
  const [progressList, setProgressList] = useState<any[]>([]);
  const [stats, setStats] = useState([
    { ico: GraduationCap, value: "0", label: "Active Cohort" },
    { ico: CheckCircle, value: "0/0", label: "Days Completed" },
    { ico: FileText, value: "0%", label: "Attendance" },
    { ico: BadgeCheck, value: "0", label: "Certificates Earned" },
  ]);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 1. Fetch Student Profile
        const { data: stuData } = await supabase
          .from("students")
          .select("id, name, programme, programme_id, cohort")
          .eq("email", user.email)
          .single();

        if (stuData) {
          setStudent(stuData);

          // 2. Fetch Courses for the Student's Programme
          const { data: courses } = await supabase
            .from("courses")
            .select("id, title, order")
            .eq("programme_id", stuData.programme_id)
            .order("order", { ascending: true });

          // 3. Fetch Student Progress
          const { data: progData } = await supabase
            .from("student_progress")
            .select("course_id, status")
            .eq("student_id", stuData.id);

          // 4. Fetch Certificates Count
          const { count: certCount } = await supabase
            .from("certificates")
            .select("*", { count: "exact", head: true })
            .eq("student_id", stuData.id);

          // Calculate Statistics
          const completedDays = progData?.filter(p => p.status === "completed").length || 0;
          const totalCourses = courses?.length || 0;
          const attendance = totalCourses > 0 ? Math.round((completedDays / totalCourses) * 100) : 0;

          setStats([
            { ico: GraduationCap, value: "1", label: "Active Cohort" },
            { ico: CheckCircle, value: `${completedDays}/${totalCourses}`, label: "Days Completed" },
            { ico: FileText, value: `${attendance}%`, label: "Attendance" },
            { ico: BadgeCheck, value: `${certCount || 0}`, label: "Certificates Earned" },
          ]);

          // Map Progress for UI
          const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT"];
          const mappedProgress = courses?.map((course, index) => {
            const progress = progData?.find(p => p.course_id === course.id);
            let status = "upcoming"; // locked
            
            if (progress?.status === "completed") {
              status = "done";
            } else if (progress?.status === "unlocked") {
              status = "current";
            } else {
              // If it's the first course, or the previous one is completed, it's current
              const prevCourse = index > 0 ? courses[index - 1] : null;
              const prevProgress = prevCourse ? progData?.find(p => p.course_id === prevCourse.id) : null;
              if (index === 0 || prevProgress?.status === "completed") {
                status = "current";
              }
            }

            return {
              id: course.id,
              day: daysOfWeek[index] || `DAY ${index + 1}`,
              title: course.title,
              status
            };
          }) || [];

          setProgressList(mappedProgress);

          // Find current course
          const current = mappedProgress.find(p => p.status === "current") || mappedProgress.find(p => p.status === "upcoming");
          if (current) {
            setCurrentCourse(courses?.find(c => c.id === current.id));
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
      </div>
    );
  }

  // Dynamic Deadlines based on current course
  const deadlines = [
    { ico: FileText, title: `${currentCourse?.title || "Current Course"}`, sub: student?.programme || "Programme", when: "Today" },
    { ico: GraduationCap, title: "Virtual Graduation", sub: student?.cohort || "Cohort", when: "Sat 4PM" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Band */}
      <div className="bg-ink text-white rounded-site p-6 md:p-9 relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ background: "radial-gradient(circle at 88% 15%, rgba(1,112,61,0.5), transparent 44%), radial-gradient(circle at 4% 96%, rgba(249,115,22,0.15), transparent 40%)" }} 
        />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex-1">
            <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">
              {student?.cohort?.toUpperCase() || "COHORT"} · {currentCourse ? "CONTINUE LEARNING" : "WELCOME"}
            </span>
            <h2 className="font-display font-semibold text-[22px] md:text-[32px] leading-tight">
              Welcome back, {student?.name?.split(" ")[0] || "Student"}
            </h2>
            <p className="text-[13.5px] md:text-[14.5px] text-white/72 mt-2 max-w-[52ch]">
              {currentCourse 
                ? `You are currently on "${currentCourse.title}". Keep up the momentum and finish strong.`
                : `Welcome to your ${student?.programme || "Academy"} dashboard. Click below to start your first course.`
              }
            </p>
          </div>
          <Link 
            href={currentCourse ? `/academy/courses/${currentCourse.id}` : "/academy/courses"} 
            className="inline-flex items-center justify-center gap-2 bg-orange px-5 py-3 rounded-site font-semibold text-[14px] hover:bg-orange-dark transition-colors shrink-0 w-full sm:w-auto"
          >
            {currentCourse ? "Resume Course" : "Start Course"} <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.ico;
          return (
            <div key={s.label} className="bg-white border border-ink/10 rounded-site p-4 md:p-5">
              <div className="w-9 h-9 md:w-10 md:h-10 rounded-site bg-orange/10 text-orange flex items-center justify-center mb-3">
                <Icon className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <strong className="block font-display font-semibold text-[22px] md:text-[28px] leading-none">{s.value}</strong>
              <span className="block text-[12px] md:text-[13px] text-slate mt-1.5">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Class */}
          <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
            <div className="p-5 border-b border-ink/10 flex items-center justify-between">
              <h3 className="font-display font-semibold text-[16px] md:text-[18px]">Today&apos;s Focus</h3>
              <span className="font-mono text-[10.5px] uppercase tracking-wide bg-orange/12 text-orange-dark px-2.5 py-1 rounded-site">Active</span>
            </div>
            <div className="p-5 flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-site bg-forest text-white flex items-center justify-center shrink-0">
                <strong className="font-display text-xl leading-none">★</strong>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-display font-semibold text-[15px] md:text-[16.5px] mb-1 truncate">
                  {currentCourse?.title || "No active course"}
                </h4>
                <p className="text-[12px] md:text-[13px] text-slate">{student?.programme || "Programme"} · Lesson & Assessment</p>
              </div>
              {currentCourse && (
                <Link 
                  href={`/academy/courses/${currentCourse.id}/learn`} 
                  className="inline-flex items-center justify-center gap-2 bg-orange px-5 py-2.5 rounded-site font-semibold text-[13px] md:text-[14px] hover:bg-orange-dark transition-colors shrink-0 w-full sm:w-auto"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>

          {/* Week Progress */}
          <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
            <div className="p-5 border-b border-ink/10 flex items-center justify-between">
              <h3 className="font-display font-semibold text-[16px] md:text-[18px]">This Week&apos;s Progress</h3>
              <Link href="/academy/courses" className="font-mono text-[11.5px] text-forest hover:text-orange transition-colors">
                View course
              </Link>
            </div>
            <div className="p-5">
              {progressList.length === 0 && (
                <p className="text-slate text-sm text-center py-4">No courses found for your programme.</p>
              )}
              {progressList.map((p) => (
                <div key={p.id} className="flex items-center gap-3.5 py-3 border-b border-ink/10 last:border-0">
                  {/* Checkmark Circle */}
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[13px] border-[1.5px] shrink-0 ${
                    p.status === 'done' ? 'bg-emerald text-white border-emerald' :
                    p.status === 'current' ? 'border-orange text-orange' : 'border-ink/10 text-transparent'
                  }`}>
                    {p.status === 'done' && <CheckCircle className="w-3.5 h-3.5" />}
                  </span>
                  
                  <span className="font-mono text-[11px] text-slate w-10 shrink-0">{p.day}</span>
                  <span className="text-[13px] md:text-[14px] font-medium flex-1 truncate">{p.title}</span>
                  
                  {p.status === 'done' && <span className="hidden sm:inline-block font-mono text-[10.5px] uppercase bg-emerald/10 text-emerald px-2 py-0.5 rounded-site">Done</span>}
                  {p.status === 'current' && <span className="font-mono text-[10.5px] uppercase bg-orange/12 text-orange-dark px-2 py-0.5 rounded-site">Today</span>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Deadlines */}
          <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
            <div className="p-5 border-b border-ink/10">
              <h3 className="font-display font-semibold text-[16px] md:text-[18px]">Upcoming Deadlines</h3>
            </div>
            <div className="p-5">
              {deadlines.map((d, i) => {
                const Icon = d.ico;
                return (
                  <div key={i} className="flex items-center gap-3 py-3 border-b border-ink/10 last:border-0">
                    <Icon className="w-4 h-4 text-orange shrink-0" />
                    <div className="flex-1 min-w-0">
                      <strong className="block text-[13px] md:text-[14px] truncate">{d.title}</strong>
                      <span className="block text-[11px] md:text-[12px] text-slate">{d.sub}</span>
                    </div>
                    <span className="font-mono text-[10.5px] md:text-[11px] text-slate ml-auto shrink-0">{d.when}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue Learning */}
          {currentCourse && (
            <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
              <div className="p-5 border-b border-ink/10 flex items-center justify-between">
                <h3 className="font-display font-semibold text-[16px] md:text-[18px]">Continue Learning</h3>
                <Link href="/academy/courses" className="font-mono text-[11.5px] text-forest hover:text-orange transition-colors">
                  All courses
                </Link>
              </div>
              <div className="p-5">
                <Link href={`/academy/courses/${currentCourse.id}`} className="block group">
                  <div className="w-11 h-11 md:w-12 md:h-12 rounded-site bg-orange/10 text-orange flex items-center justify-center mb-3">
                    <GraduationCap className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <h4 className="font-display font-semibold text-[17px] md:text-[19px] mb-3 truncate">{student?.programme || "Programme"}</h4>
                  
                  {/* Calculate Progress */}
                  {(() => {
                    const completed = Number(stats[1].value.split('/')[0]);
                    const total = Number(stats[1].value.split('/')[1]);
                    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0;
                    return (
                      <>
                        <div className="h-1.5 bg-paper rounded-full overflow-hidden mb-2">
                          <div className="h-full bg-orange rounded-full" style={{ width: `${percentage}%` }}></div>
                        </div>
                        <div className="flex justify-between font-mono text-[10.5px] text-slate mb-4">
                          <span>Course {completed} of {total}</span>
                          <span>{percentage}%</span>
                        </div>
                      </>
                    );
                  })()}
                  
                  <span className="inline-flex items-center gap-2 font-mono text-[11.5px] text-ink border-b border-orange pb-0.5 group-hover:text-orange group-hover:gap-3 transition-all">
                    Open course <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}