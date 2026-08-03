"use client";

export default function GraduationPage() {
  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">SATURDAY · COHORT WEEK 28</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Graduation & Awards</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          The week closes with live capstone presentations, facilitator feedback, and recognition of top performers before certificates are awarded.
        </p>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="p-5 border-b border-ink/10 flex items-center justify-between">
          <h3 className="font-display font-semibold text-[18px]">Ceremony Run of Show</h3>
          <span className="font-mono text-[10.5px] uppercase tracking-wide bg-orange/12 text-orange-dark px-2.5 py-1 rounded-site">Sat 4:00 PM</span>
        </div>
        <div className="p-5 space-y-3">
          {["Opening remarks", "Group capstone presentations", "Facilitators' feedback", "Recognition of outstanding participants and teams", "Certificate presentation", "Graduation address & closing remarks"].map((item, i) => (
            <div key={i} className="flex gap-3 items-start text-[14px] text-ink">
              <span className="text-orange mt-1">●</span> {item}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="p-5 border-b border-ink/10"><h3 className="font-display font-semibold text-[18px]">Weekly Awards</h3></div>
        <div className="p-5 grid md:grid-cols-2 gap-3">
          {["Best Estate Development Project", "Best Property Management Strategy", "Most Innovative Real Estate Solution", "Best Team Collaboration", "Best Project Presentation", "Outstanding Participant"].map((award, i) => (
            <div key={i} className="flex gap-3 items-center text-[14px] text-ink py-2 border-b border-ink/5 last:border-0">
              <span className="text-lg text-orange">🏆</span> {award}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}