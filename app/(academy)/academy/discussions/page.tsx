"use client";

export default function DiscussionsPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">PEER LEARNING</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Discussions</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Your Tuesday and Thursday group channels live here. Keep the conversation going between live sessions.
        </p>
      </div>

      <div className="bg-white border border-ink/10 rounded-site p-5 space-y-4">
        <div className="flex items-center gap-3 py-3 border-b border-ink/10 last:border-0">
          <span className="text-lg text-orange">👥</span>
          <div className="flex-1"><strong className="block text-[14px]">Group 3 · Estate Management</strong><span className="block text-[12px] text-slate">Capstone: Auchi affordable housing</span></div>
          <span className="font-mono text-[11px] text-slate">4 new</span>
        </div>
        <div className="flex items-center gap-3 py-3 border-b border-ink/10 last:border-0">
          <span className="text-lg text-orange">💬</span>
          <div className="flex-1"><strong className="block text-[14px]">General Cohort Wk 28</strong><span className="block text-[12px] text-slate">Announcements & Q&A</span></div>
          <span className="font-mono text-[11px] text-slate">12 new</span>
        </div>
        <div className="flex items-center gap-3 py-3">
          <span className="text-lg text-orange">💡</span>
          <div className="flex-1"><strong className="block text-[14px]">Instructor Office Hours</strong><span className="block text-[12px] text-slate">Ask the facilitator</span></div>
          <span className="font-mono text-[11px] text-slate">Open</span>
        </div>
      </div>
    </div>
  );
}