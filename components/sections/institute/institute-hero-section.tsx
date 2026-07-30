// components/sections/institute/institute-hero-section.tsx
"use client";

import Link from "next/link";
import { delay } from "@/lib/animation";

export function InstituteHeroSection() {
  return (
    <section className="bg-ink text-white py-8 pb-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(circle at 82% 18%, rgba(1,112,61,0.5), transparent 46%), radial-gradient(circle at 12% 96%, rgba(249,115,22,0.14), transparent 40%)"
        }}
      />
      <div className="max-w-site mx-auto px-8 relative z-10">
        <span className="font-mono text-[11.5px] tracking-widest text-orange block mb-5 rise">
          ONLINE SKILLS &amp; LEADERSHIP TRAINING PLATFORM
        </span>
        <h1 className="font-display font-semibold text-[clamp(38px,5vw,66px)] leading-tight max-w-[16ch] rise" style={delay(80)}>
          Practical Skills for a <em className="text-orange not-italic">Working Edo North</em>
        </h1>
        <p className="text-lg leading-relaxed text-white/72 max-w-[60ch] mt-6 rise" style={delay(160)}>
          Abubakari Aruna Institute equips Edo North citizens with employable, entrepreneurial, and leadership skills. Fully online, project based.
        </p>
        <div className="flex gap-2 lg:gap-3.5 mt-8 flex-wrap rise" style={delay(240)}>
          <Link href="/login-signup" className="inline-flex items-center gap-2 bg-orange text-white px-4 lg:px-7 py-4 rounded-site font-semibold text-[15px] hover:bg-orange-dark transition-colors">
            Enroll Now →
          </Link>
          <Link href="#programmes" className="inline-flex items-center gap-2 border border-white/30 text-white px-4 lg:px-7 py-4 rounded-site font-medium text-[15px] hover:border-orange hover:text-orange transition-colors">
            Explore Courses
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0.5 mt-14 bg-white/10 border border-white/10">
          {[
            { value: "6", label: "Core Disciplines" },
            { value: "6 Days", label: "Mon to Sat Cohort" },
            { value: "100%", label: "Online & Live" },
            { value: "Weekly", label: "Certificates & Badges" },
          ].map((s) => (
            <div key={s.label} className="bg-ink p-6 md:p-7 rise" style={delay(320)}>
              <strong className="block font-display font-semibold text-[32px] text-orange leading-none">{s.value}</strong>
              <span className="block font-mono text-[11px] tracking-wide text-white/60 mt-2.5 uppercase">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
