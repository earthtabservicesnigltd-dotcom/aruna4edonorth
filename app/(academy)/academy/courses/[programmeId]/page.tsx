"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { programmeData } from "@/lib/programme-data";
import { ArrowLeft, Building, TreePine, TrendingUp, Cpu, Package, Cog, CalendarDays, Video, BadgeCheck, CheckCircle2, Pencil, FileUp, Trophy, ChevronRight, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  building: Building,
  tree: TreePine,
  "graph-up-arrow": TrendingUp,
  cpu: Cpu,
  "box-seam": Package,
  "gear-wide-connected": Cog,
};

const days = [
  { key: "mon", label: "Mon" },
  { key: "tue", label: "Tue" },
  { key: "wed", label: "Wed" },
  { key: "thu", label: "Thu" },
  { key: "fri", label: "Fri" },
  { key: "sat", label: "Sat" },
] as const;

const CERT_REQS = [
  "Minimum of 80% attendance",
  "Completion of all individual assignments (Mon & Wed)",
  "Active participation in group activities (Tue & Thu)",
  "Successful submission of the capstone project (Fri)",
  "Participation in presentation and graduation (Sat)",
];

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programmeId = params.programmeId as string;
  const programme = programmeData[programmeId];

  // State for the active day tab
  const [activeDay, setActiveDay] = useState<typeof days[number]["key"]>("mon");

  if (!programme) {
    return (
      <div className="text-center py-20">
        <h2 className="font-display text-2xl mb-4">Course not found</h2>
        <Link href="/academy/courses" className="text-orange font-semibold hover:underline">
          &larr; Back to My Courses
        </Link>
      </div>
    );
  }

  const Icon = iconMap[programme.icon] || Building;
  const dayData = programme.days[activeDay];

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <button 
        onClick={() => router.push("/academy/courses")} 
        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wider uppercase text-slate hover:text-orange transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to My Courses
      </button>

      {/* Hero Header */}
      <div className="bg-ink text-white rounded-site p-8 md:p-9 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 90% 20%, rgba(1,112,61,0.45), transparent 45%)" }} />
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-site bg-orange/16 text-orange flex items-center justify-center mb-4">
            <Icon className="w-7 h-7" />
          </div>
          <h2 className="font-display font-semibold text-[clamp(24px,3vw,34px)] leading-tight max-w-[22ch]">
            {programme.name} Programme
          </h2>
          <div className="flex flex-wrap gap-5 mt-5 font-mono text-[11.5px] text-white/70">
            <span className="flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5 text-orange" /> 1-Week Intensive · Mon–Sat</span>
            <span className="flex items-center gap-2"><Video className="w-3.5 h-3.5 text-orange" /> Live + Recorded</span>
            <span className="flex items-center gap-2"><BadgeCheck className="w-3.5 h-3.5 text-orange" /> {programme.cert}</span>
          </div>
        </div>
      </div>

      {/* Day Tabs */}
      <div className="flex flex-wrap gap-2">
        {days.map((d) => (
          <button
            key={d.key}
            onClick={() => setActiveDay(d.key)}
            className={`px-4 py-3 rounded-site border transition-all min-w-[100px] text-left ${
              activeDay === d.key 
                ? "bg-ink border-ink text-white" 
                : "bg-white border-ink/10 hover:border-orange hover:-translate-y-0.5"
            }`}
          >
            <span className={`block font-mono text-[11px] tracking-wide ${activeDay === d.key ? 'text-orange' : 'text-slate'}`}>
              {d.label.toUpperCase()}
            </span>
            <span className={`block text-[13px] font-medium mt-1 ${activeDay === d.key ? 'text-white' : 'text-ink'}`}>
              {d.key === 'sat' ? 'Graduation' : d.key === 'fri' ? 'Capstone' : 'Class'}
            </span>
          </button>
        ))}
      </div>

      {/* Day Content */}
      <div className="bg-white border border-ink/10 rounded-site p-6 md:p-8">
        {activeDay !== 'sat' ? (
          <div>
            <h3 className="font-display font-semibold text-[22px] leading-tight mb-2">{dayData.title}</h3>
            <span className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wide text-orange mb-6">
              <FileUp className="w-3.5 h-3.5" /> {dayData.type}
            </span>

            <div className="grid md:grid-cols-[1.3fr_1fr] gap-6 items-start">
              {/* Core Learning */}
              <div className="border border-ink/10 rounded-site p-6">
                <h4 className="font-mono text-[11px] uppercase tracking-wide text-slate mb-4 pb-2 border-b border-ink/10">Core Learning</h4>
                <ul className="space-y-2">
                  {dayData.core?.map((c, i) => (
                    <li key={i} className="flex gap-3 items-start text-[14px] text-ink leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange mt-0.5 shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Task Box */}
              <div className="bg-paper rounded-site p-6">
                <h4 className="font-mono text-[11px] uppercase tracking-wide text-slate mb-4 pb-2 border-b border-ink/10">{dayData.taskType}</h4>
                <ul className="space-y-2 mb-6">
                  {dayData.task?.map((t, i) => (
                    <li key={i} className="flex gap-3 items-start text-[14px] text-ink leading-relaxed">
                      <Pencil className="w-3.5 h-3.5 text-forest mt-0.5 shrink-0" /> {t}
                    </li>
                  ))}
                </ul>
                <div className="flex gap-3 items-center pt-4 border-t border-ink/10">
                  <FileUp className="w-5 h-5 text-orange shrink-0" />
                  <div>
                    <span className="block font-mono text-[10px] uppercase tracking-wide text-slate">Output</span>
                    <span className="text-[14px] font-semibold text-ink">{dayData.output}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="font-display font-semibold text-[22px] leading-tight mb-2">Saturday · Presentation & Graduation</h3>
            <span className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-wide text-orange mb-6">
              <BadgeCheck className="w-3.5 h-3.5" /> {dayData.theme}
            </span>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div className="border border-ink/10 rounded-site p-6">
                <h4 className="font-mono text-[11px] uppercase tracking-wide text-slate mb-4 pb-2 border-b border-ink/10">Presentation Structure</h4>
                <ul className="space-y-2">
                  {dayData.present?.map((p, i) => (
                    <li key={i} className="flex gap-3 items-start text-[14px] text-ink leading-relaxed">
                      <ChevronRight className="w-4 h-4 text-orange mt-0.5 shrink-0" /> {p}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border border-ink/10 rounded-site p-6">
                <h4 className="font-mono text-[11px] uppercase tracking-wide text-slate mb-4 pb-2 border-b border-ink/10">Evaluation Criteria</h4>
                <ul className="space-y-2">
                  {dayData.criteria?.map((c, i) => (
                    <li key={i} className="flex gap-3 items-start text-[14px] text-ink leading-relaxed">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange mt-0.5 shrink-0" /> {c}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border border-ink/10 rounded-site p-6 mb-6">
              <h4 className="font-mono text-[11px] uppercase tracking-wide text-slate mb-4 pb-2 border-b border-ink/10">Weekly Awards</h4>
              <ul className="grid md:grid-cols-2 gap-3">
                {dayData.awards?.map((a, i) => (
                  <li key={i} className="flex gap-3 items-center text-[14px] text-ink">
                    <Trophy className="w-4 h-4 text-orange shrink-0" /> {a}
                  </li>
                ))}
              </ul>
            </div>

            {/* Certificate Band */}
            <div className="bg-forest text-white rounded-site p-6 md:p-8 grid md:grid-cols-[auto_1fr] gap-6 items-center relative overflow-hidden">
              <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(circle at 90% 30%, rgba(249,115,22,0.22), transparent 46%)" }} />
              <div className="relative z-10 w-20 h-20 rounded-full bg-white/12 flex items-center justify-center text-4xl">🏆</div>
              <div className="relative z-10">
                <span className="font-mono text-[11px] tracking-wide text-white/80 block mb-2">CERTIFICATION</span>
                <h3 className="font-display font-semibold text-[22px] mb-3">Abubakari Aruna Institute {programme.cert}</h3>
                <ul className="space-y-1.5">
                  {CERT_REQS.map((req, i) => (
                    <li key={i} className="flex gap-2 items-start text-[13.5px] text-white/90">
                      <CheckCircle2 className="w-3.5 h-3.5 text-orange mt-0.5 shrink-0" /> {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}