"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Users, BookOpen, CalendarDays, GraduationCap } from "lucide-react";
import Link from "next/link";

export default function AcademyAdminDashboard() {
  const supabase = createClient();
  const [stats, setStats] = useState({ students: 0, programmes: 0, courses: 0, schedules: 0 });

  useEffect(() => {
    async function loadStats() {
      const { count: students } = await supabase.from("students").select("*", { count: "exact", head: true });
      const { count: programmes } = await supabase.from("programmes").select("*", { count: "exact", head: true }).eq("active", true);
      const { count: courses } = await supabase.from("courses").select("*", { count: "exact", head: true });
      const { count: schedules } = await supabase.from("schedules").select("*", { count: "exact", head: true });
      
      setStats({
        students: students || 0,
        programmes: programmes || 0,
        courses: courses || 0,
        schedules: schedules || 0,
      });
    }
    loadStats();
  }, [supabase]);

  const cards = [
    { label: "Total Students", value: stats.students, icon: Users, href: "/admin/academy/students", color: "orange" },
    { label: "Active Programmes", value: stats.programmes, icon: GraduationCap, href: "/admin/academy/courses", color: "forest" },
    { label: "Total Courses", value: stats.courses, icon: BookOpen, href: "/admin/academy/courses", color: "orange" },
    { label: "Schedule Items", value: stats.schedules, icon: CalendarDays, href: "/admin/academy/schedules", color: "forest" },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display font-semibold text-[22px] text-ink">Academy Management</h1>
        <p className="text-[13.5px] text-slate mt-1">Manage students, programmes, courses, and weekly schedules.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-ink/10 rounded-site p-5 hover:border-orange/40 hover:shadow-sm transition-all"
            >
              <div className={`w-10 h-10 rounded-site flex items-center justify-center mb-3 ${
                card.color === "orange" ? "bg-orange/10 text-orange" : "bg-forest/10 text-forest"
              }`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="font-display font-semibold text-[26px] text-ink leading-none">{card.value}</div>
              <div className="text-[12.5px] text-slate mt-1.5">{card.label}</div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}