// components/sections/talk/talk-hero-section.tsx
"use client";

import { delay } from "@/lib/animation";

export function TalkHeroSection() {
  return (
    <section className="py-8 pb-14 bg-white border-b border-ink/8">
      <div className="max-w-site mx-auto px-8 grid lg:grid-cols-[1.05fr_0.95fr] gap-14 items-center">
        <div className="rise">
          <span className="font-mono text-[11.5px] tracking-widest text-orange block mb-4">A DIRECT LINE</span>
          <h1 className="font-display font-semibold text-[clamp(36px,4.2vw,56px)] leading-tight text-ink">
            Ask Abubakari <em className="text-forest not-italic">Anything</em>
          </h1>
          <p className="text-[17px] leading-relaxed text-slate max-w-[52ch] mt-5">
            No filters, no gatekeepers. Send your question straight to the campaign and Abubakari answers the ones that matter most to Edo North.
          </p>
          <div className="flex gap-3.5 mt-8 flex-wrap">
            <a href="#ask" className="inline-flex items-center gap-2 bg-orange text-white px-6 py-3.5 rounded-[34px] font-semibold text-[14.5px] hover:scale-110 hover:shadow-lg transition-all">
              ❓ Ask a Question
            </a>
            <a href="https://wa.me/2348012345678" className="inline-flex items-center gap-2 bg-[#25D366] text-white px-5 py-3.5 rounded-[34px] font-semibold text-[14.5px] border-2 border-[#25D366] hover:scale-110 hover:shadow-lg transition-all">
              💬 Ask on WhatsApp
            </a>
          </div>
        </div>

        <div className="bg-ink text-white rounded-site p-8 md:p-10 relative overflow-hidden rise" style={delay(160)}>
          <span className="absolute -top-6 left-5 font-display text-[150px] leading-none text-orange/18">"</span>
          <blockquote className="relative font-display font-medium text-[clamp(19px,2vw,23px)] leading-relaxed">
            Ask me the hard questions. A leader who won&apos;t take questions before the election won&apos;t listen after it.
          </blockquote>
          <div className="flex items-center gap-3.5 mt-7 pt-6 border-t border-white/14">
            <div className="w-13 h-13 rounded-full bg-forest flex items-center justify-center font-display text-xl text-white shrink-0">AA</div>
            <div>
              <strong className="block text-[15px]">Comr. Aruna Abubakari</strong>
              <span className="font-mono text-[11px] tracking-wide text-white/55">CANDIDATE · EDO NORTH 2027</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
