"use client";

import { Video } from "lucide-react";

export default function LivePage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">GOOGLE MEET</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Live Classes</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Group days (Tuesday and Thursday), the Friday capstone session, and the Saturday graduation all run live. Join links open here 10 minutes before start.
        </p>
      </div>

      <div className="bg-white border border-ink/10 rounded-site p-5 flex items-center gap-4 flex-wrap">
        <div className="w-14 h-14 rounded-site bg-forest text-white flex flex-col items-center justify-center shrink-0">
          <strong className="font-display text-xl leading-none">FRI</strong>
          <span className="font-mono text-[9px] mt-1">NOW</span>
        </div>
        <div className="flex-1 min-w-[200px]">
          <h4 className="font-display font-semibold text-[16.5px] mb-1">Capstone Project & Community Housing Solutions</h4>
          <p className="text-[13px] text-slate">Estate Management · 10:00 AM WAT · Instructor-led</p>
        </div>
        <a href="#" className="inline-flex items-center gap-2 bg-orange px-5 py-2.5 rounded-site font-semibold text-[14px] hover:bg-orange-dark transition-colors shrink-0">
          Join Now <Video className="w-4 h-4" />
        </a>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="p-5 border-b border-ink/10"><h3 className="font-display font-semibold text-[18px]">Upcoming Sessions</h3></div>
        <div className="p-5 space-y-4">
          <div className="flex items-center gap-3 py-2 border-b border-ink/10 last:border-0">
            <span className="text-lg text-orange">🎓</span>
            <div className="flex-1"><strong className="block text-[14px]">Capstone Presentations</strong><span className="block text-[12px] text-slate">Saturday · 12:00 PM</span></div>
            <span className="font-mono text-[11px] text-slate">Sat</span>
          </div>
          <div className="flex items-center gap-3 py-2">
            <span className="text-lg text-orange">🏆</span>
            <div className="flex-1"><strong className="block text-[14px]">Virtual Graduation & Awards</strong><span className="block text-[12px] text-slate">Saturday · 4:00 PM</span></div>
            <span className="font-mono text-[11px] text-slate">Sat</span>
          </div>
        </div>
      </div>
    </div>
  );
}