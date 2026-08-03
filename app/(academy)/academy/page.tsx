"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { ArrowRight, Video, CheckCircle, FileText, BadgeCheck, GraduationCap } from "lucide-react";

export default function AcademyDashboardPage() {
  const supabase = createClient();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: stuData } = await supabase
          .from("students")
          .select("name, programme, cohort")
          .eq("email", user.email)
          .single();
        if (stuData) setStudent(stuData);
      }
    }
    loadData();
  }, [supabase]);

  const stats = [
    { ico: GraduationCap, value: "1", label: "Active Cohort" },
    { ico: CheckCircle, value: "4/6", label: "Days Completed" },
    { ico: FileText, value: "82%", label: "Attendance" },
    { ico: BadgeCheck, value: "2", label: "Certificates Earned" },
  ];

  const progress = [
    { day: "MON", title: "Foundations of Estate Management", status: "done" },
    { day: "TUE", title: "Property Identification & Market Analysis", status: "done" },
    { day: "WED", title: "Property Management & Client Relations", status: "done" },
    { day: "THU", title: "Real Estate Development & Project Planning", status: "done" },
    { day: "FRI", title: "Capstone Project & Housing Solutions", status: "current" },
    { day: "SAT", title: "Presentation & Graduation", status: "upcoming" },
  ];

  const deadlines = [
    { ico: FileText, title: "Final Capstone Document", sub: "Estate Management", when: "Today" },
    { ico: GraduationCap, title: "Virtual Graduation", sub: "Cohort Wk 28", when: "Sat 4PM" },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Band */}
      <div className="bg-ink text-white rounded-site p-8 md:p-9 relative overflow-hidden">
        <div 
          className="absolute inset-0 pointer-events-none" 
          style={{ background: "radial-gradient(circle at 88% 15%, rgba(1,112,61,0.5), transparent 44%), radial-gradient(circle at 4% 96%, rgba(249,115,22,0.15), transparent 40%)" }} 
        />
        <div className="relative z-10 flex items-center justify-between gap-6 flex-wrap">
          <div>
            <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">FRIDAY · CAPSTONE PROJECT DAY</span>
            <h2 className="font-display font-semibold text-[24px] md:text-[32px] leading-tight">
              Welcome back, {student?.name?.split(" ")[0] || "Student"}
            </h2>
            <p className="text-[14.5px] text-white/72 mt-2 max-w-[52ch]">
              You&apos;re on Day 5 of the {student?.programme || "Estate Management"} cohort. Your capstone submission is due today, finish strong.
            </p>
          </div>
          <Link 
            href="/academy/courses" 
            className="inline-flex items-center gap-2 bg-orange px-5 py-3 rounded-site font-semibold text-[14px] hover:bg-orange-dark transition-colors shrink-0"
          >
            Resume Course <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.ico;
          return (
            <div key={s.label} className="bg-white border border-ink/10 rounded-site p-5">
              <div className="w-10 h-10 rounded-site bg-orange/10 text-orange flex items-center justify-center mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <strong className="block font-display font-semibold text-[28px] leading-none">{s.value}</strong>
              <span className="block text-[13px] text-slate mt-1.5">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid lg:grid-cols-[1.5fr_1fr] gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Today's Class */}
          <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
            <div className="p-5 border-b border-ink/10 flex items-center justify-between">
              <h3 className="font-display font-semibold text-[18px]">Today&apos;s Live Class</h3>
              <span className="font-mono text-[10.5px] uppercase tracking-wide bg-orange/12 text-orange-dark px-2.5 py-1 rounded-site">Live 10:00 AM</span>
            </div>
            <div className="p-5 flex items-center gap-4 flex-wrap">
              <div className="w-14 h-14 rounded-site bg-forest text-white flex flex-col items-center justify-center shrink-0">
                <strong className="font-display text-xl leading-none">FRI</strong>
                <span className="font-mono text-[9px] mt-1">DAY 5</span>
              </div>
              <div className="flex-1 min-w-[200px]">
                <h4 className="font-display font-semibold text-[16.5px] mb-1">Estate Development Strategy &amp; Community Housing Solutions</h4>
                <p className="text-[13px] text-slate">Capstone project development and final submission · Estate Management</p>
              </div>
              <Link 
                href="/academy/live" 
                className="inline-flex items-center gap-2 bg-orange px-5 py-2.5 rounded-site font-semibold text-[14px] hover:bg-orange-dark transition-colors shrink-0"
              >
                Join <Video className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Week Progress */}
          <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
            <div className="p-5 border-b border-ink/10 flex items-center justify-between">
              <h3 className="font-display font-semibold text-[18px]">This Week&apos;s Progress</h3>
              <Link href="/academy/courses" className="font-mono text-[11.5px] text-forest hover:text-orange transition-colors">
                View course
              </Link>
            </div>
            <div className="p-5">
              {progress.map((p) => (
                <div key={p.day} className="flex items-center gap-3.5 py-3 border-b border-ink/10 last:border-0">
                  {/* Checkmark Circle */}
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[13px] border-[1.5px] shrink-0 ${
                    p.status === 'done' ? 'bg-emerald text-white border-emerald' :
                    p.status === 'current' ? 'border-orange text-orange' : 'border-ink/10 text-transparent'
                  }`}>
                    {p.status === 'done' && <CheckCircle className="w-3.5 h-3.5" />}
                  </span>
                  
                  <span className="font-mono text-[11px] text-slate w-10 shrink-0">{p.day}</span>
                  <span className="text-[14px] font-medium flex-1">{p.title}</span>
                  
                  {p.status === 'done' && <span className="font-mono text-[10.5px] uppercase bg-emerald/10 text-emerald px-2 py-0.5 rounded-site">Done</span>}
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
              <h3 className="font-display font-semibold text-[18px]">Upcoming Deadlines</h3>
            </div>
            <div className="p-5">
              {deadlines.map((d) => {
                const Icon = d.ico;
                return (
                  <div key={d.title} className="flex items-center gap-3 py-3 border-b border-ink/10 last:border-0">
                    <Icon className="w-4 h-4 text-orange shrink-0" />
                    <div className="flex-1 min-w-0">
                      <strong className="block text-[14px]">{d.title}</strong>
                      <span className="block text-[12px] text-slate">{d.sub}</span>
                    </div>
                    <span className="font-mono text-[11px] text-slate ml-auto">{d.when}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Continue Learning */}
          <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
            <div className="p-5 border-b border-ink/10 flex items-center justify-between">
              <h3 className="font-display font-semibold text-[18px]">Continue Learning</h3>
              <Link href="/academy/courses" className="font-mono text-[11.5px] text-forest hover:text-orange transition-colors">
                All courses
              </Link>
            </div>
            <div className="p-5">
              <Link href="/academy/courses" className="block group">
                <div className="w-12 h-12 rounded-site bg-orange/10 text-orange flex items-center justify-center mb-3">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h4 className="font-display font-semibold text-[19px] mb-3">Estate Management</h4>
                <div className="h-1.5 bg-paper rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-orange rounded-full" style={{ width: "80%" }}></div>
                </div>
                <div className="flex justify-between font-mono text-[10.5px] text-slate mb-4">
                  <span>Day 5 of 6</span>
                  <span>80%</span>
                </div>
                <span className="inline-flex items-center gap-2 font-mono text-[11.5px] text-ink border-b border-orange pb-0.5 group-hover:text-orange group-hover:gap-3 transition-all">
                  Open course <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}