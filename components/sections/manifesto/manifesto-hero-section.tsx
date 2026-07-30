// components/sections/manifesto/manifesto-hero-section.tsx
"use client";

import Link from "next/link";
import { delay } from "@/lib/animation";

export function ManifestoHeroSection() {
  return (
    <section className="py-8 pb-14 bg-white border-b border-ink/8">
      <div className="max-w-site mx-auto px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div className="rise">
          <h1 className="font-display font-semibold text-[clamp(36px,4.2vw,58px)] leading-tight text-ink tracking-tight">
            A New Direction <em className="text-forest not-italic">for Edo North</em>
          </h1>
          <p className="text-[17px] leading-relaxed text-slate max-w-[480px] mt-5">
            I present this manifesto as a solemn commitment to serve with integrity, accountability, and purpose. This is a promise of a new direction.
          </p>
          <Link
            href="#"
            className="inline-flex items-center gap-2 bg-orange text-white px-7 py-3.5 rounded-site font-semibold text-[14.5px] mt-4 hover:bg-ink transition-colors"
          >
            📄 Download Full Manifesto (PDF)
          </Link>
        </div>

        <div className="bg-ink text-white rounded-site p-9 rise" style={delay(160)}>
          <span className="font-mono text-[11px] tracking-widest text-orange block mb-4">SIX PILLARS</span>
          <ol className="space-y-0">
            {[
              "Youth Empowerment & Job Creation",
              "Education & Human Capital Development",
              "Infrastructure & Rural Development",
              "Agriculture & Economic Empowerment",
              "Security & Community Safety",
              "Accountability & Representation",
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
