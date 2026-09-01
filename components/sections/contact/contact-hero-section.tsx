// components/sections/contact/contact-hero-section.tsx
"use client";

import { delay } from "@/lib/animation";

const channels = [
  { icon: "📞", label: "Campaign Line", value: "+234 801 234 5678", href: "tel:+2348012345678" },
  { icon: "✉️", label: "Email", value: "hello@abubakariaruna4senate.com", href: "mailto:hello@abubakariaruna4senate.com" },
  { icon: "💬", label: "WhatsApp", value: "Message the field team", href: "https://wa.me/2348012345678" },
];

export function ContactHeroSection() {
  return (
    <section className="py-8 pb-14 bg-white border-b border-ink/8">
      <div className="max-w-site mx-auto px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div className="rise">
          <span className="font-mono text-[11.5px] tracking-widest text-orange block mb-4">GET IN TOUCH</span>
          <h1 className="font-display font-semibold text-[clamp(36px,4.2vw,58px)] leading-tight text-ink">
            Reach the Campaign <em className="text-forest not-italic">Directly</em>
          </h1>
          <p className="text-[17px] leading-relaxed text-slate max-w-[480px] mt-5">
            Whether you want to volunteer, raise an issue, invite the campaign to your community, or just ask a question — someone on the ground will read it.
          </p>
        </div>

        <div className="bg-ink text-white rounded-site overflow-hidden rise" style={delay(160)}>
          <span className="font-mono text-[11px] tracking-widest text-orange block px-5 pt-4 pb-2">FASTEST WAYS TO REACH US</span>
          {channels.map((ch) => (
            <a key={ch.label} href={ch.href} className="flex items-center gap-4 px-5 py-4 border-t border-white/10 hover:bg-white/4 hover:pl-6 transition-all group">
              <span className="text-xl text-orange shrink-0">{ch.icon}</span>
              <div>
                <span className="font-mono text-[10.5px] tracking-wider text-white/55 uppercase block mb-0.5">{ch.label}</span>
                <span className="text-[15px] text-white font-medium">{ch.value}</span>
              </div>
              <span className="ml-auto text-white/30 group-hover:text-orange transition-colors">↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
