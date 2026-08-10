import Link from "next/link";

export function HeroSection() {
  return (
    <section className="py-20 pb-12 bg-white">
      <div className="max-w-site mx-auto px-8 grid lg:grid-cols-[1.15fr_0.85fr] gap-16 items-end">
        <div>
          <h1 className="rise font-display font-semibold text-[clamp(42px,5.4vw,74px)] leading-[1.04] text-ink tracking-tight">
            A New Direction<br />for Edo North
          </h1>
          <p className="rise hero-sub mt-6 max-w-[480px] text-[17px] leading-relaxed text-slate" style={{ "--d": "120ms" } as React.CSSProperties}>
            <strong>Leadership. Accountability. Progress.</strong>
          </p>
          <div className="rise mt-9 flex gap-3.5 flex-wrap" style={{ "--d": "220ms" } as React.CSSProperties}>
            <Link href="/volunteer" className="btn-solid">Join the Movement</Link>
            <Link href="/manifesto" className="btn-ghost">Read Manifesto</Link>
          </div>
        </div>

        <div className="rise bg-ink rounded-site p-8 text-white" style={{ "--d": "320ms" } as React.CSSProperties}>
          <span className="font-mono text-[11px] text-orange tracking-widest block mb-3.5">CANDIDATE PROFILE</span>
          <h3 className="font-display text-[26px] font-semibold mb-4">Comr. Aruna Abubakari</h3>
          <p className="text-[14.5px] leading-relaxed text-white/75">
            Senate Candidate, Edo North Senatorial District
          </p>
          <div className="flex justify-between border-t border-white/18 mt-5 pt-4">
            {[
              { value: "18", label: "YEARS IN PUBLIC SERVICE" },
              { value: "07", label: "LOCAL GOVT AREAS COVERED" },
              { value: "240K+", label: "RESIDENTS REPRESENTED" },
            ].map((stat) => (
              <div key={stat.label}>
                <strong className="font-display text-[26px] text-orange block">{stat.value}</strong>
                <span className="font-mono text-[10px] text-white/65 tracking-wide">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}