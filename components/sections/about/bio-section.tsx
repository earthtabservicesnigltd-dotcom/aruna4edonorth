// components/sections/about/bio-section.tsx
"use client";

import { SectionHead } from "../section-head";
import { delay } from "@/lib/animation";

export function BioSection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-site mx-auto px-8">
        <SectionHead
          number="BIOGRAPHY"
          title={<>Full <span className="accent">Biography</span></>}
        />

        <div className="space-y-6 w-full max-w-none text-slate text-[17px] leading-[1.9]">
          <p className="rise font-medium text-ink text-[19px] sm:text-[20px] leading-relaxed" style={delay(80)}>
            Comrade Aruna Abubakari is a community development advocate, entrepreneur, real estate developer, and public servant with over three decades of leadership experience spanning infrastructure development, housing, agriculture, electrification, and grassroots empowerment across Edo State.
          </p>

          <p className="rise" style={delay(120)}>
            Born on 12th September 1974, he is an indigene of Jagbe Ward, Etsako West Local Government Area of Edo State, Nigeria. His journey has been defined by a commitment to community service, sustainable development, and improving the lives of the people.
          </p>

          <p className="rise" style={delay(160)}>
            His professional career began with the Power Holding Company of Nigeria (PHCN), where he served in various capacities including Ughelli Power Generation Station, Benin Zonal Office, Sokponba Business District, and later as Business Manager of PHCN Benin Distribution Company. These roles provided him with extensive experience in power administration, project execution, and public service delivery.
          </p>

          <p className="rise" style={delay(200)}>
            A strong advocate for workers&apos; welfare and responsible leadership, Comrade Aruna served in different capacities within the National Union of Electricity Employees (NUEE), eventually becoming Edo State Secretary, where he promoted integrity, transparency, and effective representation.
          </p>

          <p className="rise" style={delay(240)}>
            Beyond the power sector, he has built a remarkable record in real estate, engineering, agriculture, and community development. As the Executive Director of Touch Engineering Properties and Construction, he has provided strategic leadership in housing, infrastructure, and property development projects.
          </p>

          <p className="rise" style={delay(280)}>
            He also served as the Managing Director/Chief Executive Officer of City of Goshen Housing Development Company Limited and as Edo State Chairman of the Real Estate Developers Association of Nigeria (REDAN), contributing significantly to the growth of the real estate sector.
          </p>

          <p className="rise" style={delay(320)}>
            With academic qualifications including membership of the Association of National Accountants of Nigeria (ANAN), an Advanced Diploma in Accounting from Obafemi Awolowo University, Ile-Ife, and a National Diploma in Banking and Finance from the Federal Polytechnic, Oko, he combines professional expertise with practical leadership experience.
          </p>

          <p className="rise font-semibold text-ink text-[18px] pt-4 border-t border-ink/10" style={delay(360)}>
            Today, as the Edo North Senatorial Candidate, Comrade Aruna Abubakari continues to champion purposeful leadership, economic empowerment, sustainable development, and effective representation for the people of Edo North.
          </p>
        </div>
      </div>
    </section>
  );
}
