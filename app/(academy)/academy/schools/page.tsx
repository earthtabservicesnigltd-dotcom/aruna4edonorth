"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { Building, TreePine, TrendingUp, Cpu, Package, Cog, ArrowRight, Lock, CheckCircle } from "lucide-react";

const iconMap: Record<string, any> = {
  "bi-building": Building,
  "bi-tree": TreePine,
  "bi-graph-up-arrow": TrendingUp,
  "bi-cpu": Cpu,
  "bi-box-seam": Package,
  "bi-gear-wide-connected": Cog,
};

export default function SchoolsPage() {
  const supabase = createClient();
  const [schools, setSchools] = useState<any[]>([]);
  const [studentProgrammeId, setStudentProgrammeId] = useState<string | null>(null);
  const [progress, setProgress] = useState<Record<string, string>>({}); // courseId -> status
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      // 1. Get Student & their enrolled school
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: stu } = await supabase.from("students").select("programme_id").eq("email", user.email).single();
        setStudentProgrammeId(stu?.programme_id || null);
      }

      // 2. Get All Schools & Courses
      const { data: progs } = await supabase.from("programmes").select("id, name, icon, blurb, cert, courses(id, title, slug, order)").eq("active", true);
      setSchools(progs || []);

      // 3. Get Student Progress
      if (user) {
        const { data: progData } = await supabase.from("student_progress").select("course_id, status").eq("student_id", user.id);
        const progMap: Record<string, string> = {};
        progData?.forEach(p => progMap[p.course_id] = p.status);
        setProgress(progMap);
      }
      setLoading(false);
    }
    fetchData();
  }, [supabase]);

  if (loading) return <div className="py-20 text-center text-slate">Loading schools...</div>;

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">6 CORE PROGRAMMES</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Academy Schools</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Complete all courses in your enrolled school to earn your certificate. You must follow the linear progression.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schools.map((school) => {
          const Icon = iconMap[school.icon] || Building;
          const isEnrolled = studentProgrammeId === school.id;
          
          // Find the next available course
          const sortedCourses = school.courses?.sort((a: any, b: any) => a.order - b.order) || [];
          const nextCourse = sortedCourses.find((c: any) => progress[c.id] !== 'completed');

          return (
            <div 
              key={school.id} 
              className={`bg-white border rounded-site p-6 flex flex-col transition-all ${
                isEnrolled ? "border-orange/40 shadow-md" : "border-ink/10 opacity-80"
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-site bg-orange/10 text-orange flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                {isEnrolled ? (
                  <span className="font-mono text-[10.5px] uppercase tracking-wide bg-orange/12 text-orange-dark px-2.5 py-1 rounded-site">Enrolled</span>
                ) : (
                  <span className="font-mono text-[10.5px] uppercase tracking-wide bg-paper text-slate px-2.5 py-1 rounded-site border border-ink/10">Not Enrolled</span>
                )}
              </div>

              <h3 className="font-display font-semibold text-[19px] leading-tight text-ink mb-2">{school.name}</h3>
              <p className="text-[13.5px] text-slate leading-relaxed mb-4 flex-1">{school.blurb}</p>

              {/* Course Roadmap Preview */}
              <div className="bg-paper rounded-site p-4 mb-4 space-y-2">
                {sortedCourses.map((c: any, i: number) => {
                  const status = progress[c.id] || 'locked';
                  return (
                    <div key={c.id} className="flex items-center gap-2.5 text-[12.5px]">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] ${
                        status === 'completed' ? 'bg-emerald text-white' :
                        status === 'unlocked' ? 'bg-orange text-white' : 'bg-white border border-ink/20 text-transparent'
                      }`}>
                        {status === 'completed' && <CheckCircle className="w-3 h-3" />}
                      </span>
                      <span className={`flex-1 ${status === 'locked' ? 'text-slate' : 'text-ink font-medium'}`}>{c.title}</span>
                      {status === 'locked' && <Lock className="w-3 h-3 text-slate/50" />}
                    </div>
                  );
                })}
              </div>

              {isEnrolled && nextCourse ? (
                <Link 
                  href={`/academy/courses/${nextCourse.slug}`}
                  className="inline-flex items-center gap-2 bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13.5px] hover:bg-orange-dark transition-colors mt-auto"
                >
                  Continue to {nextCourse.title} <ArrowRight className="w-4 h-4" />
                </Link>
              ) : isEnrolled && !nextCourse ? (
                <Link 
                  href="/academy/certificates"
                  className="inline-flex items-center gap-2 bg-emerald text-white px-5 py-2.5 rounded-site font-semibold text-[13.5px] hover:bg-forest transition-colors mt-auto"
                >
                  View Certificate <CheckCircle className="w-4 h-4" />
                </Link>
              ) : (
                <div className="text-center text-[12px] text-slate mt-auto">
                  <Lock className="w-3 h-3 inline mr-1" /> Enroll in this school to start
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}