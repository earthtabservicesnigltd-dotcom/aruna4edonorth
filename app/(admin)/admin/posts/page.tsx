"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Trash2, Repeat, Plus, X } from "lucide-react";

interface Post {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  status: string;
  event_type: string;
  event_time: string;
  event_location: string;
  rsvp_link: string;
  created_at: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Post fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Event");
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Published");

  // Event-specific fields
  const [eventType, setEventType] = useState("Rallies");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [rsvpLink, setRsvpLink] = useState("");

  useEffect(() => { loadPosts(); }, []);

  async function loadPosts() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase.from("posts").select("*").order("date", { ascending: false });
    if (data) setPosts(data);
    setLoading(false);
  }

  async function addPost(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;

    const supabase = createClient();
    const { error } = await supabase.from("posts").insert([{
      title,
      category,
      excerpt,
      date: date || new Date().toISOString().slice(0, 10),
      status,
      event_type: category === "Event" ? eventType : null,
      event_time: category === "Event" ? eventTime : null,
      event_location: category === "Event" ? eventLocation : null,
      rsvp_link: category === "Event" ? rsvpLink : null,
    }]);

    if (error) {
      alert("Error: " + error.message);
      return;
    }

    setTitle("");
    setExcerpt("");
    setDate("");
    setEventType("Rallies");
    setEventTime("");
    setEventLocation("");
    setRsvpLink("");
    setShowForm(false);
    loadPosts();
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === "Published" ? "Draft" : "Published";
    const supabase = createClient();
    await supabase.from("posts").update({ status: next }).eq("id", id);
    loadPosts();
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const supabase = createClient();
    await supabase.from("posts").delete().eq("id", id);
    loadPosts();
  }

  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">Content</span>
        <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">News &amp; Events</h1>
        <p className="text-[13.5px] text-slate mt-1">Draft and publish updates for the campaign site.</p>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h3 className="font-display font-semibold text-[16px]">
            Posts <span className="font-mono text-[11.5px] text-slate ml-2 font-normal">{posts.length} total</span>
          </h3>
          <button onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-3.5 py-2 bg-orange text-white rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors">
            <Plus className="w-3.5 h-3.5" /> New Post
          </button>
        </div>

        {showForm && (
          <form onSubmit={addPost} className="px-5 py-4 bg-paper border-b border-ink/10">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-3">
              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} required
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange" />
              </div>
              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange">
                  <option>News</option>
                  <option>Event</option>
                </select>
              </div>
              <div className="lg:col-span-3">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Excerpt</label>
                <textarea value={excerpt} onChange={e => setExcerpt(e.target.value)} rows={2}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange resize-none" />
              </div>

              {/* Event-specific fields */}
              {category === "Event" && (
                <>
                  <div>
                    <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Event Type</label>
                    <select value={eventType} onChange={e => setEventType(e.target.value)}
                      className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange">
                      <option>Rallies</option>
                      <option>Town Halls</option>
                      <option>Community Visits</option>
                      <option>Debates</option>
                      <option>Door-to-Door</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Time</label>
                    <input type="text" value={eventTime} onChange={e => setEventTime(e.target.value)}
                      placeholder="e.g. 10:00 AM"
                      className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange" />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Location</label>
                    <input type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)}
                      placeholder="e.g. Auchi Township Stadium"
                      className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange" />
                  </div>
                  <div>
                    <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">RSVP Link</label>
                    <input type="text" value={rsvpLink} onChange={e => setRsvpLink(e.target.value)}
                      placeholder="e.g. https://..."
                      className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange" />
                  </div>
                </>
              )}

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange" />
              </div>
              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">Status</label>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button type="submit" className="bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-orange-dark">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-ink/13 px-5 py-2.5 rounded-site text-[13px] font-semibold text-slate hover:bg-paper">Cancel</button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="py-16 text-center text-slate">Loading...</div>
        ) : posts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl text-ink/20 mb-3">📰</div>
            <div className="font-display font-semibold text-[15px] text-ink mb-1">No posts yet</div>
            <div className="text-[12.5px] text-slate">Create the first news or event post.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px]">
              <thead>
                <tr className="text-left font-mono text-[10.5px] tracking-wide uppercase text-slate font-semibold bg-paper border-b border-ink/10">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Title</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Type</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {posts.map((p, i) => (
                  <tr key={p.id} className="border-b border-ink/6 hover:bg-orange/[0.02]">
                    <td className="px-5 py-3.5 font-mono text-[12px] text-slate">{String(i+1).padStart(2,'0')}</td>
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-[13.5px]">{p.title}</div>
                      {p.excerpt && <div className="text-[11.5px] text-slate mt-0.5 max-w-[320px] truncate">{p.excerpt}</div>}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                        p.category === "Event" ? "bg-orange/12 text-orange-dark" : "bg-emerald/10 text-emerald"
                      }`}>{p.category}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-slate">
                      {p.event_type || "—"}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[12px]">
                      {new Date(p.date).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-block font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                        p.status === "Published" ? "bg-emerald/10 text-emerald" : "bg-line-soft text-slate"
                      }`}>{p.status}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <button onClick={() => toggleStatus(p.id, p.status)}
                          className="p-1.5 text-slate hover:text-orange transition-colors" title="Toggle publish">
                          <Repeat className="w-4 h-4" />
                        </button>
                        <button onClick={() => deletePost(p.id)}
                          className="p-1.5 text-slate hover:text-red-600 transition-colors" title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
