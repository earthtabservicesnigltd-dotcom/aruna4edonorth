"use client";

import { programmeData } from "@/lib/programme-data";

export default function CertificatesPage() {
  // Mock data: Let's pretend the student earned these two
  const earnedCerts = ["estate", "digital"];

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">DIGITAL BADGES</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Certificates</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Earn a professional certificate for each programme you complete. Requirements: 80% attendance, all tasks submitted, and participation in the Saturday graduation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(programmeData).map(([key, p]) => {
          const earned = earnedCerts.includes(key);
          return (
            <div key={key} className={`bg-white border border-ink/10 rounded-site p-6 ${!earned ? 'opacity-70' : ''}`}>
              <div className="text-4xl mb-4">{earned ? '🏆' : '🔒'}</div>
              <div className="mb-4">
                {earned ? (
                  <span className="font-mono text-[10.5px] uppercase tracking-wide bg-emerald/10 text-emerald px-2.5 py-1 rounded-site">Earned</span>
                ) : (
                  <span className="font-mono text-[10.5px] uppercase tracking-wide bg-paper text-slate px-2.5 py-1 rounded-site border border-ink/10">Locked</span>
                )}
              </div>
              <h4 className="font-display font-semibold text-[17px] leading-tight mb-2">{p.cert}</h4>
              <p className="text-[13px] text-slate leading-relaxed mb-5">
                {earned ? "Completed the one-week intensive with full attendance and a submitted capstone." : "Complete the cohort with 80% attendance and a submitted capstone to unlock."}
              </p>
              <button className={`w-full py-3 rounded-site font-semibold text-[14px] transition-colors ${earned ? 'bg-orange text-white hover:bg-orange-dark' : 'border border-ink/10 text-ink hover:border-orange hover:text-orange'}`}>
                {earned ? 'Download PDF' : 'View Requirements'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}