// components/sections/about/about-hero-section.tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import { delay } from "@/lib/animation";

export function AboutHeroSection() {
  return (
    <section className="py-8 pb-14 bg-white border-b border-ink/8">
      <div className="max-w-site mx-auto px-8 grid lg:grid-cols-[1fr_1fr] gap-12 items-center">
        <div className="self-start">
          <nav className="font-mono text-[11.5px] tracking-wide text-slate mb-4">
            <Link href="/" className="text-orange hover:border-b border-orange">Home</Link>
            <span className="mx-2">/</span>
            <span>About</span>
          </nav>
          <h1 className="font-display font-semibold text-[clamp(36px,4.2vw,58px)] leading-tight text-ink tracking-tight">
            Who Is <em className="text-forest not-italic">Comr. Aruna Abubakari?</em>
          </h1>
          <p className="text-[17px] leading-relaxed text-slate max-w-[480px] mt-4">
            An indigene of Jagbe Ward, Etsako West LGA. A community development advocate, real estate developer, and former PHCN leader with over three decades of leadership experience across Edo State.
          </p>
        </div>
        <figure className="rise" style={delay(120)}>
          <Image
            src="/images/06.png"
            alt="Comr. Aruna Abubakari"
            width={500}
            height={625}
            className="w-full aspect-[4/5] object-cover rounded-site"
            style={{ maskImage: "linear-gradient(#fff 80%, transparent)" }}
            priority
          />
        </figure>
      </div>
    </section>
  );
}
