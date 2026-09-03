// components/sections/about/leadership-section.tsx
"use client";

import { SectionHead } from "../section-head";
import { delay } from "@/lib/animation";

const leadership = [
  { n: "01", title: "Power Administration & Grid Management", text: "Extensive leadership across Ughelli Power Generation, Sokponba, and as Business Manager of PHCN Benin Distribution Company." },
  { n: "02", title: "Labour Representation & Workers' Welfare", text: "Served as Edo State Secretary of NUEE, championing transparency, fair conditions, and responsible union leadership." },
  { n: "03", title: "Real Estate & Housing Development", text: "Led the Real Estate Developers Association of Nigeria (REDAN) in Edo State and served as MD/CEO of City of Goshen Housing Development Co." },
  { n: "04", title: "Infrastructure & Engineering Projects", text: "Executive Director at Touch Engineering Properties and Construction, directing key residential and infrastructure development." },
  { n: "05", title: "Financial Expertise & Professional Integrity", text: "Member of the Association of National Accountants of Nigeria (ANAN), integrating sound financial accountability with public service." },
  { n: "06", title: "Grassroots Development & Public Service", text: "Three decades of community advocacy, agricultural development, and empowerment initiatives across Jagbe Ward and Edo North." },
];

export function LeadershipSection() {
  return (
    <section className="py-20">
      <div className="max-w-site mx-auto px-8">
        <SectionHead
          number="LEADERSHIP"
          title={<>Experience &amp; <span className="accent">Impact</span></>}
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-0.5 bg-ink/10">
          {leadership.map((item, i) => (
            <div key={item.n} className="bg-white p-10 rise" style={delay(i * 60)}>
              <span className="font-mono text-[11px] text-orange tracking-wider">{item.n}</span>
              <h4 className="font-display font-semibold text-lg my-3.5 text-ink">{item.title}</h4>
              <p className="text-[14.5px] leading-relaxed text-slate">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
