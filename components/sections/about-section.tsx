import Image from "next/image";
import { SectionHead } from "./section-head";
import { delay } from "@/lib/animation";

const credentials = [
  {
    title: "Executive Director",
    subtitle: "Touch Engineering Properties & Construction",
  },
  {
    title: "Edo North Senatorial Candidate",
    subtitle: "Committed to purposeful and people-centred representation",
  },
  {
    title: "Former Managing Director/CEO",
    subtitle: "City of Goshen Housing Development Company Limited",
  },
  {
    title: "Edo State Chairman",
    subtitle: "Real Estate Developers Association of Nigeria (REDAN)",
  },
  {
    title: "Former Business Manager",
    subtitle: "PHCN Benin Distribution Company",
  },
  {
    title: "Former Edo State Secretary",
    subtitle: "National Union of Electricity Employees (NUEE)",
  },
  {
    title: "ANAN Member",
    subtitle: "Nigerian College of Accountancy, Jos — 2009",
  },
  {
    title: "Advanced Diploma in Accounting",
    subtitle: "Obafemi Awolowo University, Ile-Ife",
  },
  {
    title: "National Diploma in Banking & Finance",
    subtitle: "Federal Polytechnic, Oko",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="py-25">
      <div className="max-w-site mx-auto px-8 about-grid items-start">
        <SectionHead
          number="PROFILE"
          title={<>Who Is <span className="accent">Abubakari</span></>}
          className="col-span-full"
        />

        {/* Left Sticky Photo Card */}
        <figure className="rise bg-white p-5 lg:sticky lg:top-28 self-start border border-ink/10 rounded-site shadow-xs">
          <Image
            src="/images/20.jpeg"
            alt="Comr. Aruna Abubakari"
            width={500}
            height={625}
            className="w-full rounded-site object-cover aspect-[4/5]"
            priority
          />
          <figcaption className="font-mono text-[11.5px] text-slate mt-3.5 text-center tracking-wide">
            Comr. Aruna Abubakari — Jagbe Ward, Etsako West LGA
          </figcaption>
        </figure>

        {/* Right Full Biography Content */}
        <div className="rise space-y-5 text-[16px] leading-[1.85] text-[#414c50]" style={delay(120)}>
          <p className="font-medium text-ink text-[17.5px] leading-relaxed first-letter:font-display first-letter:text-[56px] first-letter:font-bold first-letter:float-left first-letter:leading-[0.8] first-letter:mr-2.5 first-letter:mt-1.5 first-letter:text-forest">
            Comrade Aruna Abubakari is a community development advocate, entrepreneur, real estate developer, and public servant with over three decades of leadership experience spanning infrastructure development, housing, agriculture, electrification, and grassroots empowerment across Edo State.
          </p>

          <p>
            Born on 12th September 1974, he is an indigene of Jagbe Ward, Etsako West Local Government Area of Edo State, Nigeria. His journey has been defined by a commitment to community service, sustainable development, and improving the lives of the people.
          </p>

          <p>
            His professional career began with the Power Holding Company of Nigeria (PHCN), where he served in various capacities including Ughelli Power Generation Station, Benin Zonal Office, Sokponba Business District, and later as Business Manager of PHCN Benin Distribution Company. These roles provided him with extensive experience in power administration, project execution, and public service delivery.
          </p>

          <p>
            A strong advocate for workers&apos; welfare and responsible leadership, Comrade Aruna served in different capacities within the National Union of Electricity Employees (NUEE), eventually becoming Edo State Secretary, where he promoted integrity, transparency, and effective representation.
          </p>

          <p>
            Beyond the power sector, he has built a remarkable record in real estate, engineering, agriculture, and community development. As the Executive Director of Touch Engineering Properties and Construction, he has provided strategic leadership in housing, infrastructure, and property development projects.
          </p>

          <p>
            He also served as the Managing Director/Chief Executive Officer of City of Goshen Housing Development Company Limited and as Edo State Chairman of the Real Estate Developers Association of Nigeria (REDAN), contributing significantly to the growth of the real estate sector.
          </p>

          <p>
            With academic qualifications including membership of the Association of National Accountants of Nigeria (ANAN), an Advanced Diploma in Accounting from Obafemi Awolowo University, Ile-Ife, and a National Diploma in Banking and Finance from the Federal Polytechnic, Oko, he combines professional expertise with practical leadership experience.
          </p>

          <p className="font-semibold text-ink pt-1 text-[16.5px]">
            Today, as the Edo North Senatorial Candidate, Comrade Aruna Abubakari continues to champion purposeful leadership, economic empowerment, sustainable development, and effective representation for the people of Edo North.
          </p>

          {/* Key Credentials Grid - All 9 Records */}
          <div className="pt-6 border-t border-ink/10">
            <ul className="creds grid sm:grid-cols-2 gap-x-7 gap-y-5">
              {credentials.map((cred) => (
                <li key={cred.title}>
                  <strong>{cred.title}</strong>
                  <span className="text-[13px] text-slate block mt-0.5">{cred.subtitle}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}