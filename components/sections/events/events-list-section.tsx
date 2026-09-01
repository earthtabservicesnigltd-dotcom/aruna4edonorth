// components/sections/events/events-list-section.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import Link from "next/link";
import { Loader2 } from "lucide-react";

interface EventItem {
  id: string;
  title: string;
  event_type: string;
  event_time: string;
  event_location: string;
  date: string;
  excerpt?: string;
  rsvp_link?: string;
  image_url?: string;
}

export function EventsListSection() {
  const [active, setActive] = useState("All");
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      try {
        const supabase = createClient();

        // 1. Try 'events' table
        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .order("date", { ascending: true });

        if (!eventsError && eventsData && eventsData.length > 0) {
          const published = eventsData.filter(
            (e: any) => !e.status || e.status.toLowerCase() === "published"
          );
          setEvents(published);
          setLoading(false);
          return;
        }

        // 2. Query 'posts' table
        const { data: postsData } = await supabase
          .from("posts")
          .select("*")
          .in("category", ["Events", "Event"])
          .order("date", { ascending: true });

        if (postsData && postsData.length > 0) {
          const published = postsData.filter(
            (p: any) => !p.status || p.status.toLowerCase() === "published"
          );
          setEvents(published);
        }
      } catch (err) {
        console.error("Error loading events list:", err);
      } finally {
        setLoading(false);
      }
    }

    loadEvents();
  }, []);

  const dynamicCategories = [
    "All",
    ...Array.from(new Set(events.map((e) => e.event_type).filter(Boolean))),
  ];

  const filtered =
    active === "All"
      ? events
      : events.filter((e) => (e.event_type || "").toLowerCase() === active.toLowerCase());

  const month = (d: string) => {
    try {
      return new Date(d.includes("T") ? d : d + "T00:00:00").toLocaleDateString("en-US", { month: "short" });
    } catch {
      return "";
    }
  };

  const day = (d: string) => {
    try {
      return new Date(d.includes("T") ? d : d + "T00:00:00").getDate();
    } catch {
      return "";
    }
  };

  const year = (d: string) => {
    try {
      return new Date(d.includes("T") ? d : d + "T00:00:00").getFullYear();
    } catch {
      return "";
    }
  };

  const typeColor = (t: string) => {
    if (t === "Rallies") return "text-orange bg-orange/10";
    if (t === "Debates") return "text-ink bg-ink/8";
    if (t === "Town Halls") return "text-forest bg-emerald/8";
    return "text-forest bg-emerald/8";
  };

  return (
    <section id="events-list" className="pb-24">
      <div className="max-w-site mx-auto px-8">
        {/* Filter Pills */}
        <div className="flex gap-2.5 flex-wrap pb-9 mb-11 border-b border-ink/10 rise in" role="tablist">
          {dynamicCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-mono text-[11.5px] tracking-wide uppercase px-4 py-2 rounded-full border transition-colors ${
                active.toLowerCase() === cat.toLowerCase()
                  ? "bg-ink text-white border-ink shadow-sm"
                  : "bg-white text-slate border-ink/15 hover:border-orange hover:text-orange"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center py-16 text-slate gap-3">
            <Loader2 className="w-5 h-5 animate-spin text-orange" />
            <span className="font-mono text-xs uppercase tracking-wider">Loading events...</span>
          </div>
        )}

        {!loading && (
          <div className="space-y-5">
            {filtered.length === 0 ? (
              <div className="text-center py-16 text-slate bg-paper/50 rounded-site border border-ink/8">
                <span className="text-3xl block mb-3">📅</span>
                <p className="font-mono text-xs tracking-wide">No upcoming events in this category. Check back soon.</p>
              </div>
            ) : (
              filtered.map((event) => (
                <div
                  key={event.id}
                  className="grid grid-cols-1 md:grid-cols-[110px_1fr_auto] gap-8 items-center border border-ink/12 rounded-site p-6 bg-white hover:-translate-y-1 hover:shadow-lg transition-all"
                >
                  <div className="text-center border-r border-ink/10 pr-6">
                    <span className="font-mono text-[11px] tracking-wider text-orange uppercase block">{month(event.date)}</span>
                    <span className="font-display font-bold text-[40px] leading-none text-ink block my-1">{day(event.date)}</span>
                    <span className="font-mono text-[11px] text-slate">{year(event.date)}</span>
                  </div>

                  <div>
                    <span className={`inline-flex items-center gap-1.5 font-mono text-[10px] tracking-wider uppercase px-2.5 py-1 rounded-full mb-3 ${typeColor(event.event_type)}`}>
                      {event.event_type === "Rallies" && "📢"}
                      {event.event_type === "Town Halls" && "💬"}
                      {event.event_type === "Community Visits" && "🏠"}
                      {event.event_type === "Debates" && "🎤"}
                      {event.event_type === "Door-to-Door" && "🚪"}
                      {event.event_type || "Event"}
                    </span>
                    <h3 className="font-display font-semibold text-[21px] leading-tight text-ink mb-2.5">{event.title}</h3>
                    {event.excerpt && (
                      <p className="text-[13.5px] leading-relaxed text-slate/80 mb-3 max-w-[580px]">{event.excerpt}</p>
                    )}
                    <div className="flex gap-5 text-[13.5px] text-slate flex-wrap font-medium">
                      <span>🕐 {event.event_time}</span>
                      <span>📍 {event.event_location}</span>
                    </div>
                  </div>

                  <Link
                    href="/volunteer"
                    className="w-full text-center font-body font-semibold text-[13.5px] px-6 py-3.5 rounded-site border-[1.5px] bg-orange text-white border-transparent hover:bg-orange-dark shadow-sm transition-colors"
                  >
                    🤝 Volunteer
                  </Link>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
