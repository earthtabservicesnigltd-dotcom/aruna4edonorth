// components/sections/volunteer/whos-in-section.tsx
"use client";

import { delay } from "@/lib/animation";

const volunteers = [
  { name: "Aisha M.", location: "Auchi, Etsako West", role: "🚶 Field Volunteer" },
  { name: "Ehizojie O.", location: "Fugar, Etsako Central", role: "🎥 Media Team" },
  { name: "Blessing I.", location: "Igarra, Akoko-Edo", role: "👥 Mobilization" },
  { name: "Godwin A.", location: "Uzairue, Etsako West", role: "💻 Digital / Social" },
  { name: "Ngozi E.", location: "Sabongida-Ora, Owan East", role: "📅 Event Support" },
  { name: "Ibrahim S.", location: "Jattu, Etsako East", role: "📦 Logistics" },
];

export function WhosInSection() {
  return (
    <section className="py-16 bg-[#f9fafb] border-t border-black/8">
      <div className="max-w-site mx-auto px-8">
        <div className="flex items-end justify-between flex-wrap gap-5 mb-10">
          <div>
            <span className="font-mono text-[11px] tracking-widest text-orange uppercase block mb-3.5">Live Sign-Up Feed</span>
            <h2 className="font-display font-semibold text-[clamp(26px,3vw,38px)] leading-tight whitespace-nowrap">
              Who&apos;s Already <span className="text-orange italic">Showing Up</span>
            </h2>
          </div>
          <div className="text-center md:text-right">
            <strong className="font-display text-[40px] text-orange block leading-none">1,248</strong>
            <span className="font-mono text-[11px] tracking-wider uppercase text-black/55 text-center">Volunteers Across 7 LGAs</span>
          </div>
        </div>

        <div className="overflow-hidden mask-image-[linear-gradient(90deg,transparent,#000_6%,#000_94%,transparent)] border-t border-b border-black/8">
          <div className="flex w-max gap-0 animate-[scroll_34s_linear_infinite] hover:[animation-play-state:paused]"
               style={{ animation: "scroll 34s linear infinite" } as React.CSSProperties}>
            {[...volunteers, ...volunteers].map((v, i) => (
              <div key={`${v.name}-${i}`} className="w-[280px] shrink-0 p-6 border-r border-black/8">
                <div className="flex items-center justify-between gap-2.5 mb-2">
                  <span className="font-display font-semibold text-[17px] text-[#111827]">{v.name}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-orange shadow-[0_0_0_0_rgba(249,115,22,0.6)] animate-ping" />
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] tracking-wide text-black/55 mb-2">
                  📍 {v.location}
                </div>
                <div className="text-sm text-black/75">{v.role}</div>
              </div>
            ))}
          </div>
        </div>

        <style jsx>{`
          @keyframes scroll {
            from { transform: translateX(0); }
            to { transform: translateX(-50%); }
          }
        `}</style>
      </div>
    </section>
  );
}
