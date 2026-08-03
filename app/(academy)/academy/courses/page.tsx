"use client";

import Link from "next/link";
import { programmeData } from "@/lib/programme-data";
import { Building, TreePine, TrendingUp, Cpu, Package, Cog, ArrowRight, CalendarDays, BadgeCheck, type LucideIcon } from "lucide-react";

// Map the string icons from your data file to actual Lucide components
const iconMap: Record<string, LucideIcon> = {
  building: Building,
  tree: TreePine,
  "graph-up-arrow": TrendingUp,
  cpu: Cpu,
  "box-seam": Package,
  "gear-wide-connected": Cog,
};

export default function CoursesPage() {
  return (
    <div className="space-y-8">
      {/* Page Head */}
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">6 CORE PROGRAMMES</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">My Courses</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Each programme is a one-week intensive, Monday to Saturday. Open any course to see the full daily breakdown, tasks, and certification requirements.
        </p>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(programmeData).map(([key, p]) => {
          const Icon = iconMap[p.icon] || Building; // Fallback to Building icon
          const isInProgress = p.progress > 0;

          return (
            <Link
              key={key}
              href={`/academy/courses/${key}`}
              className="bg-white border border-ink/10 rounded-site p-6 flex flex-col hover:-translate-y-1 hover:shadow-lg hover:border-ink/20 transition-all group"
            >
              {/* Top Section */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-site bg-orange/10 text-orange flex items-center justify-center">
                  <Icon className="w-6 h-6" />
                </div>
                {isInProgress ? (
                  <span className="font-mono text-[10.5px] uppercase tracking-wide bg-orange/12 text-orange-dark px-2.5 py-1 rounded-site">In progress</span>
                ) : (
                  <span className="font-mono text-[10.5px] uppercase tracking-wide bg-paper text-slate px-2.5 py-1 rounded-site border border-ink/10">Enrolled</span>
                )}
              </div>

              {/* Title & Blurb */}
              <h3 className="font-display font-semibold text-[19px] leading-tight text-ink mb-2">{p.name}</h3>
              <p className="text-[13.5px] text-slate leading-relaxed mb-4 flex-1">{p.blurb}</p>

              {/* Meta Info */}
              <div className="flex items-center gap-4 font-mono text-[11px] text-slate mb-4">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5" /> Mon–Sat
                </span>
                <span className="flex items-center gap-1.5">
                  <BadgeCheck className="w-3.5 h-3.5" /> Certificate
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 bg-paper rounded-full overflow-hidden mb-2">
                <div 
                  className="h-full bg-orange rounded-full transition-all" 
                  style={{ width: `${p.progress}%` }}
                ></div>
              </div>
              <div className="flex justify-between font-mono text-[10.5px] text-slate mb-4">
                <span>{p.dayLabel}</span>
                <span>{p.progress}%</span>
              </div>

              {/* Open Course Link */}
              <span className="inline-flex items-center gap-2 font-mono text-[11.5px] text-ink border-b border-orange pb-0.5 group-hover:text-orange group-hover:gap-3 transition-all self-start">
                Open course <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}