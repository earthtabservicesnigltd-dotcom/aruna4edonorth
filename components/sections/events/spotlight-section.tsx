// components/sections/events/spotlight-section.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/client";
import { delay } from "@/lib/animation";

interface SpotlightEvent {
  id: string;
  title: string;
  event_type: string;
  event_time: string;
  event_location: string;
  date: string;
  excerpt?: string;
  image_url?: string;
  rsvp_link?: string;
  is_spotlight?: boolean;
  featured?: boolean;
}

const FALLBACK: SpotlightEvent = {
  id: "fallback",
  title: "Edo North Grand Rally: A New Direction",
  event_type: "Campaign Rally",
  event_time: "10:00 AM",
  event_location: "Auchi Township Stadium, Etsako West",
  date: "2026-07-18",
  excerpt: "Join Comr. Aruna Abubakari and thousands of supporters across Edo North for our largest rally yet.",
  image_url: "/images/34.png",
  rsvp_link: "#",
};

export function SpotlightSection() {
  const [event, setEvent] = useState<SpotlightEvent | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadSpotlight() {
      try {
        const supabase = createClient();

        // 1. Try dedicated 'events' table
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (!eventsError && eventsData && eventsData.length > 0) {
          const published = eventsData.filter(
            (e: any) => !e.status || e.status.toLowerCase() === "published"
          );
          const spotlight = published.find((e: any) => e.is_spotlight || e.featured);
          setEvent(spotlight || published[0] || null);
          return;
        }

        // 2. Query 'posts' table with Events category
        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .in("category", ["Events", "Event"])
          .order("date", { ascending: true });

        if (postsData && postsData.length > 0) {
          const published = postsData.filter(
            (e: any) => !e.status || e.status.toLowerCase() === "published"
          );
          const spotlight = published.find((e: any) => e.featured || e.is_spotlight || e.is_featured);
          setEvent(spotlight || published[0] || null);
        }
      } catch (e) {
        console.error("Spotlight event loading error:", e);
      } finally {
        setLoaded(true);
      }
    }

    loadSpotlight();
  }, []);

  const display = event || FALLBACK;

  const weekday = (d: string) => {
    try {
      return new Date(d.includes("T") ? d : d + "T00:00:00").toLocaleDateString("en-US", { weekday: "long" });
    } catch {
      return "";
    }
  };

  const fullDate = (d: string) => {
    try {
      return new Date(d.includes("T") ? d : d + "T00:00:00").toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return d;
    }
  };

  return (
    <section className="py-16 pb-10">
      <div className="max-w-site mx-auto px-8">
        <span className="font-mono text-[11px] tracking-widest text-orange mb-5 block rise in">Up Next</span>

        <div className="grid md:grid-cols-[0.9fr_1.1fr] bg-ink text-white rounded-site overflow-hidden rise in" style={delay(100)}>
          {/* Image side */}
          <div className="relative min-h-[260px] md:min-h-[420px] bg-field overflow-hidden">
            <Image
              src={display.image_url || "/images/34.png"}
              alt={display.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <span className="absolute top-4 left-4 font-mono text-[10.5px] tracking-wider uppercase text-white bg-orange/94 px-3 py-1.5 rounded-full shadow-md">
              {display.event_type || "Rallies"}
            </span>
          </div>

          {/* Text side */}
          <div className="p-8 md:p-12 flex flex-col justify-center">
            <span className="font-mono text-[11px] tracking-wider text-orange mb-4">Our Biggest Event Yet</span>
            <h2 className="font-display font-semibold text-[clamp(26px,2.8vw,38px)] leading-tight mb-6">
              {display.title}
            </h2>

            <div className="space-y-3.5 mb-8">
              {[
                { icon: "📅", label: "Date & Time", value: `${weekday(display.date)}, ${fullDate(display.date)} · ${display.event_time || "10:00 AM"}` },
                { icon: "📍", label: "Location", value: display.event_location || "Auchi, Edo North" },
                { icon: "👥", label: "Attendance", value: "Open to all · Free entry" },
              ].map((r) => (
                <div key={r.label} className="flex gap-3.5 items-start">
                  <span className="text-lg shrink-0">{r.icon}</span>
                  <div>
                    <span className="font-mono text-[10px] tracking-wider uppercase text-white/50 block mb-0.5">{r.label}</span>
                    <span className="text-[15.5px] text-white/92">{r.value}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3 flex-wrap">
              <a
                href="#events-list"
                className="inline-flex items-center gap-2 bg-orange text-white px-7 py-3.5 rounded-site font-semibold text-[14.5px] hover:bg-orange-dark border border-transparent shadow-sm transition-colors"
              >
                View All Events ↓
              </a>
              <a
                href="#map"
                className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-site font-semibold text-[14.5px] hover:border-orange hover:text-orange transition-colors"
              >
                View on Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
