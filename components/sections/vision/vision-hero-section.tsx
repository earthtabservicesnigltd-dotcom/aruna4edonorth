// components/sections/vision/vision-hero-section.tsx
"use client";

import { delay } from "@/lib/animation";

export function VisionHeroSection() {
  return (
    <section className="py-8 pb-14 bg-white border-b border-ink/8">
      <div className="max-w-site mx-auto px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div className="rise">
          <h1 className="font-display font-semibold text-[clamp(36px,4.2vw,58px)] leading-tight text-ink tracking-tight">
            Vision for <em className="text-forest not-italic">Edo North</em>
          </h1>
          <p className="text-[17px] leading-relaxed text-slate max-w-[480px] mt-5">
            I envision an Edo North that is not defined by its challenges, but by its potential. A model of inclusive development, opportunity, and dignity, where every citizen can live, work, and thrive with pride.
          </p>
        </div>

        <div className="bg-ink text-white rounded-site p-9 rise" style={delay(160)}>
          <span className="font-mono text-[11px] tracking-widest text-orange block mb-4">SIX AGENDAS</span>
          <ol className="space-y-0">
            {[
              "A Future for Our Youth",
              "Education That Transforms Lives",
              "Modern Infrastructure for Growth",
              "Agriculture & Economic Prosperity",
              "Peaceful and Secure Communities",
              "People-Centered Governance",
            ].map((item, i) => (
              <li key={item} className="flex gap-3.5 items-baseline py-3 border-b border-white/14 last:border-0 text-[14.5px] text-white/85">
                <span className="font-mono text-xs text-orange shrink-0">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
