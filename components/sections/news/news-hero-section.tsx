// components/sections/news/news-hero-section.tsx
export function NewsHeroSection() {
  return (
    <section className="py-8 pb-12 bg-white border-b border-ink/8">
      <div className="max-w-site mx-auto px-8">
        <h1 className="font-display font-semibold text-[clamp(36px,4.2vw,58px)] leading-tight text-ink rise">
          News &amp; <em className="text-forest not-italic">Updates</em>
        </h1>
        <p className="text-[17px] leading-relaxed text-slate max-w-[560px] mt-4 rise" style={{ "--d": "120ms" } as React.CSSProperties}>
          Campaign news, press releases, media appearances, and coverage from across Edo North. Straight from the field.
        </p>
      </div>
    </section>
  );
}
