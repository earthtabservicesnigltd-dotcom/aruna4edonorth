// components/sections/about/timeline-section.tsx
"use client";

import { SectionHead } from "../section-head";
import { delay } from "@/lib/animation";

const education = [
  {
    badge: "OND",
    title: "National Diploma in Banking & Finance",
    institution: "Federal Polytechnic, Oko",
    desc: "Obtained a National Diploma in Banking and Finance, building a strong foundation in financial management, administration, and economic principles.",
  },
  {
    badge: "ADV. DIP",
    title: "Advanced Diploma in Accounting",
    institution: "Obafemi Awolowo University, Ile-Ife",
    desc: "Further developed his expertise in accounting, financial analysis, and administrative management through advanced professional training.",
  },
  {
    badge: "ANAN",
    title: "Association of National Accountants of Nigeria (ANAN)",
    institution: "Nigerian College of Accountancy, Jos — 2009",
    desc: "Became a member of ANAN after completing professional accounting training, strengthening his competence in financial management, accountability, and leadership.",
  },
];

const career = [
  {
    badge: "PHCN",
    title: "Power Holding Company of Nigeria (PHCN)",
    role: "Ughelli Power Generation Station & PHCN Benin Distribution Company",
    desc: "Began his professional career with the Power Holding Company of Nigeria, serving at Ughelli Power Generation Station, Benin Zonal Office, Sokponba Business District, and later as Business Manager, PHCN Benin Distribution Company. He gained extensive experience in power administration, utility management, project execution, and public service delivery.",
  },
  {
    badge: "NUEE",
    title: "National Union of Electricity Employees (NUEE)",
    role: "Labour Leadership (Edo State Secretary)",
    desc: "Served in various leadership positions within the National Union of Electricity Employees, including Chapter Treasurer, Chapter Vice Chairman, Chapter Chairman, and Edo State Secretary. His leadership focused on workers' welfare, transparency, and effective representation.",
  },
  {
    badge: "MD/CEO",
    title: "City of Goshen Housing Development Company Limited",
    role: "Managing Director & Chief Executive Officer",
    desc: "Served as Managing Director and Chief Executive Officer, providing leadership in housing and property development initiatives while contributing to the growth of real estate development projects.",
  },
  {
    badge: "REDAN",
    title: "Real Estate Developers Association of Nigeria (REDAN)",
    role: "Edo State Chairman",
    desc: "His contributions to the real estate sector earned him election as Edo State Chairman of REDAN, where he supported the advancement and development of the real estate industry in Edo State.",
  },
  {
    badge: "Director",
    title: "Touch Engineering Properties and Construction",
    role: "Executive Director",
    desc: "Provides strategic leadership in engineering, construction, real estate, and infrastructure development, overseeing projects that contribute to community growth and economic transformation.",
  },
  {
    badge: "Dev",
    title: "Community Development & Infrastructure",
    role: "Edo State Communities",
    desc: "Has contributed to community development through projects and initiatives involving electrification schemes, housing development, water supply projects, borehole installations, road infrastructure, agriculture, and grassroots empowerment.",
  },
];

interface TimelineProps {
  category: string;
  title: string;
  items: Array<{
    badge: string;
    title: string;
    institution?: string;
    role?: string;
    desc: string;
  }>;
}

function TimelineColumn({ category, title, items }: TimelineProps) {
  return (
    <div>
      <div className="border-b border-ink/10 pb-4 mb-6">
        <span className="font-mono text-[11px] font-bold uppercase tracking-widest text-orange block mb-1">
          {category}
        </span>
        <h3 className="font-display font-semibold text-2xl text-ink">
          {title}
        </h3>
      </div>

      <div className="space-y-6">
        {items.map((item, i) => (
          <div
            key={item.title}
            className="bg-white border border-ink/10 p-6 sm:p-7 rounded-site hover:border-orange hover:shadow-md transition-all relative overflow-hidden"
          >
            <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
              <span className="inline-block bg-orange/10 text-orange font-mono font-bold text-[11px] uppercase tracking-wider px-3 py-1 rounded-full border border-orange/20">
                {item.badge}
              </span>
              <span className="font-mono text-[11px] text-slate font-medium">
                {item.institution || item.role}
              </span>
            </div>

            <h4 className="font-display font-semibold text-lg text-ink mb-2">
              {item.title}
            </h4>

            <p className="text-[14.5px] leading-relaxed text-slate">
              {item.desc}
            </p>
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
          number="RECORD"
          title={<>Academic Background &amp; <span className="accent">Career History</span></>}
        />

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <TimelineColumn
            category="Academic Background"
            title="Education"
            items={education}
          />
          <TimelineColumn
            category="Track Record"
            title="Career History"
            items={career}
          />
        </div>
      </div>
    </section>
  );
}
