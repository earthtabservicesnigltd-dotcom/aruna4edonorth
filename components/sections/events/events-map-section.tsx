// components/sections/events/events-map-section.tsx
"use client";

import { delay } from "@/lib/animation";

export function EventsMapSection() {
  return (
    <section className="pb-24 rise" id="map">
      <div className="max-w-site mx-auto px-8">
        <div className="mb-8">
          <span className="font-mono text-[11px] tracking-widest text-orange uppercase block mb-3">Event Map</span>
          <h2 className="font-display font-semibold text-[clamp(26px,3vw,38px)] text-ink">
            Find Events <span className="text-forest italic">Near You</span>
          </h2>
          <p className="text-[15px] text-slate mt-3 max-w-[560px] leading-relaxed">
            All seven LGAs: Etsako West, Etsako Central, Etsako East, Owan West, Owan East, Akoko Edo, and Ovia South-West.
          </p>
        </div>

        <div className="w-full h-[450px] overflow-hidden rounded-site">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.0!2d5.6!3d6.3!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNsKwMTgnMDAuMCJOIDXCsDM2JzAwLjAiRQ!5e0!3m2!1sen!2sng!4v1"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            title="Campaign Office Map"
          />
        </div>
      </div>
    </section>
  );
}
