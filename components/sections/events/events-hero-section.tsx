// components/sections/events/events-hero-section.tsx
"use client";

export function EventsHeroSection() {
  return (
    <section className="py-8 pb-12 bg-white border-b border-ink/8">
      <div className="max-w-site mx-auto px-8">
        <h1 className="font-display font-semibold text-[clamp(36px,4.2vw,58px)] leading-tight text-ink rise">
          Campaign <em className="text-forest not-italic">Events</em>
        </h1>
        <p className="text-[17px] leading-relaxed text-slate max-w-[560px] mt-4 rise" style={{ "--d": "120ms" } as React.CSSProperties}>
          Rallies, town halls, community visits, debates, and door-to-door mobilization across all seven LGAs. Find one near you.
        </p>
      </div>
    </section>
  );
}
