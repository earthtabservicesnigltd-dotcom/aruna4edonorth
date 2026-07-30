// components/sections/donate/donate-hero-section.tsx
"use client";

import { delay } from "@/lib/animation";

export function DonateHeroSection() {
  return (
    <section className="py-8 pb-14 bg-white border-b border-ink/8">
      <div className="max-w-site mx-auto px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div className="rise">
          <h1 className="font-display font-semibold text-[clamp(36px,4.2vw,58px)] leading-tight text-ink tracking-tight">
            Fuel a Campaign Built on <em className="text-forest not-italic">Accountability</em>
          </h1>
          <p className="text-[17px] leading-relaxed text-slate max-w-[480px] mt-5">
            Every naira given to this campaign is tracked, reported, and published. Your support keeps this a people-funded movement.
          </p>
        </div>

        <div className="bg-ink text-white rounded-site p-9 rise" style={delay(160)}>
          <span className="font-mono text-[11px] tracking-widest text-orange block mb-4">WHY YOUR GIFT MATTERS</span>
          {[
            { label: "Average grassroots gift", value: "₦5,400" },
            { label: "Gifts from Edo North indigenes", value: "82%" },
            { label: "Spent directly on outreach", value: "91%" },
          ].map((s) => (
            <div key={s.label} className="flex justify-between items-baseline py-4 border-b border-white/14 last:border-0">
              <span className="text-[13.5px] text-white/70">{s.label}</span>
              <strong className="font-display text-[26px] text-orange">{s.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
