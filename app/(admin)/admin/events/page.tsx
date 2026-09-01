"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/client";
import { Plus, X, Edit3, Trash2, Repeat, Search, CalendarDays, Star } from "lucide-react";
import { toast } from "sonner";

interface EventItem {
  id: string;
  title: string;
  event_type: string;
  event_time: string;
  event_location: string;
  date: string;
  excerpt?: string;
  image_url?: string;
  is_spotlight?: boolean;
  featured?: boolean;
  status: string;
  created_at?: string;
}

const EVENT_TYPES = ["Rallies", "Town Halls", "Community Visits", "Debates", "Door-to-Door"];

const DEFAULT_EVENTS: Omit<EventItem, "id">[] = [
  {
    title: "Edo North Grand Rally: A New Direction",
    event_type: "Rallies",
    event_time: "10:00 AM",
    event_location: "Auchi Township Stadium, Etsako West",
    date: "2026-07-18",
    excerpt: "Join Comr. Aruna Abubakari and thousands of supporters across Edo North for our largest rally yet.",
    image_url: "/images/34.png",
    is_spotlight: true,
    status: "Published",
  },
  {
    title: "Thousands Turn Out as Aruna Opens Etsako Town Hall Tour",
    event_type: "Town Halls",
    event_time: "10:00 AM",
    event_location: "Auchi Township Stadium, Etsako West",
    date: "2026-07-06",
    excerpt: "The campaign kicked off its seven-LGA listening tour in Auchi, drawing residents, market leaders, and youth groups.",
    image_url: "/images/25.png",
    status: "Published",
  },
  {
    title: "Youth Roundtable in Okpella Draws Record Attendance",
    event_type: "Town Halls",
    event_time: "02:00 PM",
    event_location: "Okpella Community Hall, Etsako East",
    date: "2026-07-02",
    excerpt: "Young entrepreneurs and students gathered to shape the campaign's job-creation agenda.",
    image_url: "/images/24.png",
    status: "Published",
  },
  {
    title: "Market Walk: Traders Voice Priorities in Auchi",
    event_type: "Community Visits",
    event_time: "09:00 AM",
    event_location: "Central Market, Auchi",
    date: "2026-06-24",
    excerpt: "A morning walk through Auchi's central market turned into an impromptu listening session.",
    image_url: "/images/29.jpeg",
    status: "Published",
  },
  {
    title: "School Visit Spotlights Rural Learning Gaps",
    event_type: "Community Visits",
    event_time: "11:30 AM",
    event_location: "Igarra Secondary School, Akoko Edo",
    date: "2026-06-12",
    excerpt: "A visit to a rural secondary school underscored the push for digital tools and teacher support.",
    image_url: "/images/33.jpeg",
    status: "Published",
  },
];

export default function AdminEventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<EventItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  // Form fields
  const [title, setTitle] = useState("");
  const [eventType, setEventType] = useState("Rallies");
  const [date, setDate] = useState("");
  const [eventTime, setEventTime] = useState("10:00 AM");
  const [eventLocation, setEventLocation] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/34.png");
  const [isSpotlight, setIsSpotlight] = useState(false);
  const [status, setStatus] = useState("Published");

  useEffect(() => {
    loadEvents();
  }, []);

  async function loadEvents() {
    setLoading(true);
    try {
      const supabase = createClient();

      // 1. Try dedicated 'events' table
      const { data: eventsTableData, error: eventsError } = await supabase
        .from("events")
        .select("*")
        .order("date", { ascending: true });

      if (!eventsError && eventsTableData && eventsTableData.length > 0) {
        setEvents(eventsTableData);
        setLoading(false);
        return;
      }

      // 2. Query 'posts' table where category IN ('Events', 'Event')
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .in("category", ["Events", "Event"])
        .order("date", { ascending: true });

      if (postsData) {
        setEvents(postsData);
      }
    } catch (e: any) {
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingItem(null);
    setTitle("");
    setEventType("Rallies");
    setDate(new Date().toISOString().slice(0, 10));
    setEventTime("10:00 AM");
    setEventLocation("");
    setExcerpt("");
    setImageUrl("/images/34.png");
    setIsSpotlight(false);
    setStatus("Published");
    setShowForm(true);
  }

  function startEdit(item: EventItem) {
    setEditingItem(item);
    setTitle(item.title || "");
    setEventType(item.event_type || "Rallies");
    setDate(item.date ? item.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
    setEventTime(item.event_time || "10:00 AM");
    setEventLocation(item.event_location || "");
    setExcerpt(item.excerpt || "");
    setImageUrl(item.image_url || "/images/34.png");
    setIsSpotlight(Boolean(item.is_spotlight || item.featured));
    setStatus(item.status || "Published");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowForm(false);
    setEditingItem(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title || !date || !eventLocation) {
      toast.error("Please fill in title, date, and location");
      return;
    }

    const supabase = createClient();

    // If setting as spotlight, reset others first
    if (isSpotlight) {
      try {
        await supabase
          .from("posts")
          .update({ featured: false })
          .in("category", ["Events", "Event"]);
      } catch {}
    }

    const postPayload = {
      title,
      category: "Events",
      event_type: eventType,
      date,
      event_time: eventTime,
      event_location: eventLocation,
      excerpt,
      image_url: imageUrl,
      status,
      featured: isSpotlight,
    };

    const { error } = editingItem
      ? await supabase.from("posts").update(postPayload).eq("id", editingItem.id)
      : await supabase.from("posts").insert([postPayload]);

    if (error) {
      toast.error("Error saving event: " + error.message);
      return;
    }

    toast.success(editingItem ? "Event updated successfully!" : "Event scheduled & published!");
    closeForm();
    loadEvents();
  }

  async function toggleSpotlight(item: EventItem) {
    const supabase = createClient();
    const currentSpotlight = Boolean(item.featured || item.is_spotlight);
    const next = !currentSpotlight;

    try {
      if (next) {
        // Reset all other events' featured flag first
        await supabase
          .from("posts")
          .update({ featured: false })
          .in("category", ["Events", "Event"]);
      }

      // Update the selected post
      const { error } = await supabase
        .from("posts")
        .update({ featured: next })
        .eq("id", item.id);

      if (error) {
        toast.error("Error updating spotlight: " + error.message);
        return;
      }

      toast.success(
        next ? `⭐ Set "${item.title}" as Spotlight Event!` : `Removed "${item.title}" from Spotlight`
      );
      loadEvents();
    } catch (err: any) {
      toast.error("Failed to update spotlight status");
    }
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === "Published" ? "Draft" : "Published";
    const supabase = createClient();

    let { error } = await supabase.from("events").update({ status: next }).eq("id", id);
    if (error) {
      await supabase.from("posts").update({ status: next }).eq("id", id);
    }

    toast.success(`Event marked as ${next}`);
    loadEvents();
  }

  async function deleteEvent(id: string) {
    if (!confirm("Are you sure you want to delete this event?")) return;
    const supabase = createClient();
    let { error } = await supabase.from("events").delete().eq("id", id);
    if (error) {
      await supabase.from("posts").delete().eq("id", id);
    }
    toast.success("Event deleted");
    loadEvents();
  }

  async function seedDefaults() {
    const supabase = createClient();
    for (const ev of DEFAULT_EVENTS) {
      let { error } = await supabase.from("events").insert([ev]);
      if (error) {
        await supabase.from("posts").insert([
          {
            ...ev,
            category: "Events",
            featured: ev.is_spotlight,
          },
        ]);
      }
    }
    toast.success("Default campaign events added!");
    loadEvents();
  }

  const filtered = events.filter((e) => {
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.event_location && e.event_location.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesType = typeFilter === "All" || e.event_type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
            Events Management
          </span>
          <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
            Campaign Events &amp; Rallies
          </h1>
          <p className="text-[13.5px] text-slate mt-1">
            Schedule town halls, campaign rallies, community visits, and debates. Set the spotlight event.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={seedDefaults}
            className="flex items-center gap-1.5 px-3 py-2 border border-ink/15 text-slate rounded-site font-semibold text-[12.5px] hover:border-orange hover:text-orange transition-colors"
          >
            <CalendarDays className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            onClick={showForm ? closeForm : openCreateForm}
            className="flex items-center gap-2 px-3.5 py-2 bg-orange text-white rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? "Close Form" : "New Event"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden mb-8">
        {/* Search & Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-ink/10 bg-paper/40">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input
              type="text"
              placeholder="Search event title or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-ink/13 rounded-site text-[13px] bg-white outline-none focus:border-orange"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-1.5 border border-ink/13 rounded-site text-[13px] bg-white outline-none focus:border-orange"
            >
              <option value="All">All Event Types</option>
              {EVENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <span className="font-mono text-[11.5px] text-slate ml-2">
              {filtered.length} of {events.length} total
            </span>
          </div>
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <form onSubmit={handleSave} className="px-6 py-5 bg-paper border-b border-ink/10 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/8">
              <span className="font-display font-semibold text-[16px] text-ink">
                {editingItem ? `Edit Event: "${editingItem.title}"` : "Schedule New Campaign Event"}
              </span>
              <button
                type="button"
                onClick={closeForm}
                className="text-slate hover:text-ink text-[12px] font-mono"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Event Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Edo North Grand Rally: A New Direction"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Event Type *
                </label>
                <select
                  value={eventType}
                  onChange={(e) => setEventType(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                >
                  {EVENT_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Event Date *
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Time / Schedule (e.g. 10:00 AM) *
                </label>
                <input
                  type="text"
                  value={eventTime}
                  onChange={(e) => setEventTime(e.target.value)}
                  required
                  placeholder="e.g. 10:00 AM"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                >
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Location (Venue &amp; LGA) *
                </label>
                <input
                  value={eventLocation}
                  onChange={(e) => setEventLocation(e.target.value)}
                  required
                  placeholder="e.g. Auchi Township Stadium, Etsako West"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Event Banner Image
                </label>
                <div className="flex gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/34.png"
                    className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setImageUrl(e.target.value);
                    }}
                    className="px-2 py-2.5 border border-ink/13 rounded-site text-[13px] bg-white text-slate outline-none"
                  >
                    <option value="">Presets...</option>
                    <option value="/images/34.png">Image 34 (Stadium Rally)</option>
                    <option value="/images/25.png">Image 25 (Town Hall)</option>
                    <option value="/images/24.png">Image 24 (Youth Hall)</option>
                    <option value="/images/29.jpeg">Image 29 (Market Visit)</option>
                    <option value="/images/33.jpeg">Image 33 (School Visit)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 lg:col-span-3">
                <input
                  type="checkbox"
                  id="isSpotlight"
                  checked={isSpotlight}
                  onChange={(e) => setIsSpotlight(e.target.checked)}
                  className="w-4 h-4 rounded text-orange focus:ring-orange accent-orange cursor-pointer"
                />
                <label htmlFor="isSpotlight" className="text-[13px] font-semibold text-ink cursor-pointer flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Set as Spotlight / &quot;Our Biggest Event Yet&quot; Banner
                </label>
              </div>

              <div className="lg:col-span-3">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Event Description / Summary
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Key talking points, speakers, and details for participants..."
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-orange-dark shadow-sm transition-colors"
              >
                {editingItem ? "Update Event" : "Schedule & Publish Event"}
              </button>
              <button
                type="button"
                onClick={closeForm}
                className="border border-ink/13 px-5 py-2.5 rounded-site text-[13px] font-semibold text-slate hover:bg-paper"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Events Table */}
        {loading ? (
          <div className="py-16 text-center text-slate">Loading campaign events...</div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl text-ink/20 mb-3">📅</div>
            <div className="font-display font-semibold text-[15px] text-ink mb-1">
              No events scheduled yet
            </div>
            <div className="text-[12.5px] text-slate mb-4">
              Click &quot;New Event&quot; or &quot;Reset Defaults&quot; to schedule your campaign tour.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="text-left font-mono text-[10.5px] tracking-wide uppercase text-slate font-semibold bg-paper border-b border-ink/10">
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Event</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Spotlight</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => {
                  const spotlight = Boolean(item.is_spotlight || item.featured);
                  const image = item.image_url || "/images/34.png";

                  return (
                    <tr
                      key={item.id}
                      className={`border-b border-ink/6 hover:bg-orange/[0.02] transition-colors ${
                        spotlight ? "bg-amber-50/40" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5 font-mono text-[12px] text-ink whitespace-nowrap">
                        {new Date(
                          item.date.includes("T") ? item.date : item.date + "T00:00:00"
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                        <div className="text-[11px] text-slate font-sans">{item.event_time}</div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded overflow-hidden bg-paper shrink-0 border border-ink/10">
                            <Image
                              src={image}
                              alt={item.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-[13.5px] text-ink line-clamp-1 max-w-[300px]">
                              {item.title}
                            </div>
                            {item.excerpt && (
                              <div className="text-[11.5px] text-slate line-clamp-1 max-w-[300px]">
                                {item.excerpt}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                            item.event_type === "Rallies"
                              ? "bg-orange/12 text-orange-dark"
                              : item.event_type === "Town Halls"
                              ? "bg-emerald/10 text-forest"
                              : "bg-ink/10 text-ink"
                          }`}
                        >
                          {item.event_type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[12.5px] text-slate max-w-[200px] truncate">
                        📍 {item.event_location}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleSpotlight(item)}
                          className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            spotlight
                              ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                              : "text-slate/60 hover:text-amber-600 hover:bg-amber-50"
                          }`}
                          title={spotlight ? "Currently Spotlight Event" : "Click to set as Spotlight"}
                        >
                          <Star className={`w-3.5 h-3.5 ${spotlight ? "fill-amber-500 text-amber-600" : "text-slate/40"}`} />
                          <span>{spotlight ? "Spotlight" : "Set"}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                            item.status === "Published"
                              ? "bg-emerald/10 text-emerald"
                              : "bg-line-soft text-slate"
                          }`}
                        >
                          {item.status || "Published"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-slate hover:text-orange transition-colors"
                            title="Edit event"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleStatus(item.id, item.status || "Published")}
                            className="p-1.5 text-slate hover:text-orange transition-colors"
                            title="Toggle publish status"
                          >
                            <Repeat className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteEvent(item.id)}
                            className="p-1.5 text-slate hover:text-red-600 transition-colors"
                            title="Delete event"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
