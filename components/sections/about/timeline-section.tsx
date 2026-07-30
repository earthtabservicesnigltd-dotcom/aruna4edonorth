// components/sections/about/timeline-section.tsx
"use client";

import { SectionHead } from "../section-head";
import { delay } from "@/lib/animation";

const education = [
  {
    year: "2002",
    title: "University of Benin",
    role: "B.Sc. Public Administration",
    desc: "Graduated with a degree in Public Administration, where he first began analysing Nigeria's federal structure and its impact on local communities.",
  },
  {
    year: "2017",
    title: "University of Ibadan",
    role: "M.Sc. Development Studies",
    desc: "Completed a Master's degree in Development Studies, focused on rural community development and public financial management — often driving three hours after work to make evening lectures.",
  },
];

const career = [
  {
    year: "2006–2011",
    title: "Education Officer",
    role: "Etsako Local Government Education Authority",
    desc: "Audited enrolment figures ward by ward and designed a termly audit system that reduced reporting discrepancies by over 40%.",
  },
  {
    year: "2011–2015",
    title: "Ward Councillor",
    role: "Etsako Local Government",
    desc: "Won election as councillor and introduced quarterly public expenditure reports — among the first of their kind at that level of government.",
  },
  {
    year: "2015–2021",
    title: "Special Adviser, Rural Infrastructure",
    role: "Edo State Government",
    desc: "Moved contractors from advance-payment to milestone-based payments, raising project completion rates from 38% to 81%. Oversaw rehabilitation of 200+ km of feeder roads.",
  },
  {
    year: "2021–Present",
    title: "Chairman",
    role: "Edo North Community Development Coalition",
    desc: "Leads a citizen-led group that independently monitors constituency projects and publishes the biannual Constituency Project Report Card.",
  },
];

function TimelineColumn({ title, items }: { title: string; items: typeof education }) {
  return (
    <div>
      <h3 className="font-display font-semibold text-xl text-ink mb-6 border-b border-ink/10 pb-3">
        {title}
      </h3>
      <div className="space-y-0">
        {items.map((item, i) => (
          <div
            key={item.title}
            className="grid grid-cols-[50px_1fr] md:grid-cols-[90px_1fr] gap-4 md:gap-8 py-8 border-b border-ink/10 last:border-0"
          >
            <div className="text-center">
              <span className="w-4 h-4 rounded-full bg-orange inline-block border-2 border-white shadow-[0_0_0_1.5px_#F97316] relative z-10" />
              <span className="block font-mono text-xs text-ink font-semibold mt-2.5">{item.year}</span>
            </div>
            <div className="bg-white border border-ink/10 p-7 rounded-site hover:border-emerald hover:shadow-md transition-all">
              <h4 className="font-display font-semibold text-lg text-ink mb-1.5">{item.title}</h4>
              <span className="block font-mono text-[11.5px] text-orange tracking-wide mb-3">{item.role}</span>
              <p className="text-[14.5px] leading-relaxed text-slate">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TimelineSection() {
  return (
    <section className="py-20 bg-paper">
      <div className="max-w-site mx-auto px-8">
        <SectionHead
          number="HISTORY"
          title={<>Education &amp; <span className="accent">Career</span></>}
        />

        <div className="grid lg:grid-cols-2 gap-16">
          <TimelineColumn title="Education" items={education} />
          <TimelineColumn title="Career History" items={career} />
        </div>
      </div>
    </section>
  );
}
