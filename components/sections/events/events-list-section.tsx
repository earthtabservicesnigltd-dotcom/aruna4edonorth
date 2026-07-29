"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { delay } from "@/lib/animation";

const categories = ["All", "Rallies", "Town Halls", "Community Visits", "Debates", "Door-to-Door"] as const;

interface EventItem {
  id: string;
  title: string;
  event_type: string;
  event_time: string;
  event_location: string;
  date: string;
  excerpt: string;
  rsvp_link: string;
}

export function EventsListSection() {
  const [active, setActive] = useState("All");
  const [events, setEvents] = useState<EventItem[]>([]);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("category", "Event")
        .eq("status", "Published")
        // .gte("date", new Date().toISOString().slice(0, 10))
        .order("date", { ascending: true });
      console.log('Events data:', data, "Error:", error)
      if (data) setEvents(data);
    }
    load();
  }, []);

  const filtered = active === "All" ? events : events.filter((e) => e.event_type === active);

  const month = (d: string) => new Date(d + "T00:00:00").toLocaleDateString("en-US", { month: "short" });
  const day = (d: string) => new Date(d + "T00:00:00").getDate();
  const year = (d: string) => new Date(d + "T00:00:00").getFullYear();

  const typeColor = (t: string) => {
    if (t === "Rallies") return "text-orange bg-orange/10";
    if (t === "Debates") return "text-ink bg-ink/8";
    return "text-forest bg-emerald/8";
  };

  return (
    <section className="pb-24">
      <div className="max-w-site mx-auto px-8">
        <div className="flex gap-2.5 flex-wrap pb-9 mb-11 border-b border-ink/10 rise" role="tablist">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
              className={`font-mono text-[11.5px] tracking-wide uppercase px-4 py-2 rounded-full border transition-colors ${
                active === cat
                  ? "bg-ink text-white border-ink"
                  : "bg-white text-slate border-ink/15 hover:border-orange hover:text-orange"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-5">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-slate">
              <span className="text-3xl block mb-3">📅</span>
              <p className="font-mono text-xs tracking-wide">No upcoming events. Check back soon.</p>
            </div>
          ) : (
            filtered.map((event) => (
              <div
                key={event.id}
                className="grid grid-cols-[110px_1fr_auto] gap-8 items-center border border-ink/12 rounded-site p-6 bg-white hover:-translate-y-1 hover:shadow-lg transition-all"
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
                    {event.event_type}
                  </span>
                  <h3 className="font-display font-semibold text-[21px] leading-tight text-ink mb-2.5">{event.title}</h3>
                  {event.excerpt && (
                    <p className="text-[13px] text-slate/70 mb-2 max-w-[500px]">{event.excerpt}</p>
                  )}
                  <div className="flex gap-5 text-[13.5px] text-slate flex-wrap">
                    <span>🕐 {event.event_time}</span>
                    <span>📍 {event.event_location}</span>
                  </div>
                </div>

                <div className="flex flex-col gap-2 min-w-[150px]">
                  <a href={event.rsvp_link || "#rsvp"} className="btn-solid text-center text-sm py-2.5 px-5">RSVP</a>
                  <a href="/volunteer" className="text-center text-xs font-semibold text-forest hover:text-orange transition-colors">🤝 Volunteer</a>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
