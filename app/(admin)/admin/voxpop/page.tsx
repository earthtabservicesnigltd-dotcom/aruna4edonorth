"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/client";
import { Plus, X, Edit3, Trash2, Repeat, Play, Search, MessageSquareQuote } from "lucide-react";
import { VideoModal } from "@/components/ui/video-modal";
import { toast } from "sonner";

interface VoxpopItem {
  id: string;
  quote: string;
  attribution: string;
  duration: string;
  image_url: string;
  video_url?: string;
  status: string;
  created_at?: string;
}

const DEFAULT_VOXPOPS = [
  {
    image_url: "/images/14.png",
    duration: "01:20",
    quote: "What I want from a senator is a working skills desk, not a rally.",
    attribution: "Comfort Aigbe — Trader, Owan East",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "Published",
  },
  {
    image_url: "/images/07.png",
    duration: "01:45",
    quote: "His plan is the first one with a payment schedule attached to it.",
    attribution: "Blessing Erhabor — Head Teacher, Etsako West",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "Published",
  },
  {
    image_url: "/images/05.png",
    duration: "02:05",
    quote: "He was the only official who came back to check on the borehole.",
    attribution: "Osaze Igbinedion — Community Leader, Ovia North-East",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    status: "Published",
  },
];

export default function AdminVoxpopPage() {
  const [items, setItems] = useState<VoxpopItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<VoxpopItem | null>(null);
  const [activePreview, setActivePreview] = useState<{ url: string; title?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form fields
  const [quote, setQuote] = useState("");
  const [attribution, setAttribution] = useState("");
  const [duration, setDuration] = useState("01:30");
  const [imageUrl, setImageUrl] = useState("/images/14.png");
  const [videoUrl, setVideoUrl] = useState("");
  const [status, setStatus] = useState("Published");

  useEffect(() => {
    loadVoxpops();
  }, []);

  async function loadVoxpops() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("voxpop")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setItems(data);
      }
      if (error) {
        toast.error("Voxpop table notice: " + error.message);
      }
    } catch (e: any) {
      toast.error("Failed to load voxpop records");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingItem(null);
    setQuote("");
    setAttribution("");
    setDuration("01:30");
    setImageUrl("/images/14.png");
    setVideoUrl("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
    setStatus("Published");
    setShowForm(true);
  }

  function startEdit(item: VoxpopItem) {
    setEditingItem(item);
    setQuote(item.quote || "");
    setAttribution(item.attribution || "");
    setDuration(item.duration || "01:30");
    setImageUrl(item.image_url || "/images/14.png");
    setVideoUrl(item.video_url || "");
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
    if (!quote || !attribution) {
      toast.error("Please provide both a quote and citizen attribution");
      return;
    }

    const supabase = createClient();
    const payload = {
      quote,
      attribution,
      duration,
      image_url: imageUrl,
      video_url: videoUrl || null,
      status,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("voxpop")
        .update(payload)
        .eq("id", editingItem.id);

      if (error) {
        toast.error("Error updating quote: " + error.message);
        return;
      }
      toast.success("Citizen quote updated successfully!");
    } else {
      const { error } = await supabase
        .from("voxpop")
        .insert([payload]);

      if (error) {
        toast.error("Error saving quote: " + error.message);
        return;
      }
      toast.success("Citizen quote published!");
    }

    closeForm();
    loadVoxpops();
  }

  async function seedDefaults() {
    const supabase = createClient();
    for (const v of DEFAULT_VOXPOPS) {
      await supabase.from("voxpop").insert([v]);
    }
    toast.success("Default citizen quotes added!");
    loadVoxpops();
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === "Published" ? "Draft" : "Published";
    const supabase = createClient();
    const { error } = await supabase
      .from("voxpop")
      .update({ status: next })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Marked as ${next}`);
      loadVoxpops();
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Are you sure you want to delete this quote?")) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("voxpop")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete quote");
    } else {
      toast.success("Quote deleted");
      loadVoxpops();
    }
  }

  const displayed = items.filter(
    (i) =>
      i.quote.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.attribution.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
            Citizen Testimonials
          </span>
          <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
            People of Edo North Speak
          </h1>
          <p className="text-[13.5px] text-slate mt-1">
            Manage citizen quotes, audio/video voxpop testimonials, and community feedback.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={seedDefaults}
            className="flex items-center gap-1.5 px-3 py-2 border border-ink/15 text-slate rounded-site font-semibold text-[12.5px] hover:border-orange hover:text-orange transition-colors"
          >
            <MessageSquareQuote className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            onClick={showForm ? closeForm : openCreateForm}
            className="flex items-center gap-2 px-3.5 py-2 bg-orange text-white rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? "Close Form" : "Add Quote"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden mb-8">
        {/* Search Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 bg-paper/40">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input
              type="text"
              placeholder="Search quotes or citizen names..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-ink/13 rounded-site text-[13px] bg-white outline-none focus:border-orange"
            />
          </div>

          <span className="font-mono text-[11.5px] text-slate ml-2">
            {displayed.length} quote{displayed.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <form onSubmit={handleSave} className="px-6 py-5 bg-paper border-b border-ink/10 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/8">
              <span className="font-display font-semibold text-[16px] text-ink">
                {editingItem ? "Edit Citizen Voice" : "Add Citizen Quote / Voice"}
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
              <div className="lg:col-span-3">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Citizen Quote *
                </label>
                <textarea
                  value={quote}
                  onChange={(e) => setQuote(e.target.value)}
                  required
                  rows={2}
                  placeholder="e.g. What I want from a senator is a working skills desk, not a rally."
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange resize-none"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Attribution (Name, Role / Location) *
                </label>
                <input
                  value={attribution}
                  onChange={(e) => setAttribution(e.target.value)}
                  required
                  placeholder="e.g. Comfort Aigbe — Trader, Owan East"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Duration (e.g. 01:20)
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 01:20"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Citizen Photo
                </label>
                <div className="flex gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/14.png or URL..."
                    className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setImageUrl(e.target.value);
                    }}
                    className="px-2.5 py-2.5 border border-ink/13 rounded-site text-[13px] bg-white text-slate outline-none"
                  >
                    <option value="">Presets...</option>
                    <option value="/images/14.png">Image 14 (Trader)</option>
                    <option value="/images/07.png">Image 07 (Teacher)</option>
                    <option value="/images/05.png">Image 05 (Leader)</option>
                    <option value="/images/24.png">Image 24 (Youth)</option>
                    <option value="/images/29.jpeg">Image 29 (Market)</option>
                  </select>
                </div>
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

              <div className="lg:col-span-3">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Video Link (Optional for Popup Playback)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... (optional)"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-orange-dark shadow-sm transition-colors"
              >
                {editingItem ? "Update Quote" : "Save & Publish Quote"}
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

        {/* Quotes Table */}
        {loading ? (
          <div className="py-16 text-center text-slate">Loading citizen quotes...</div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl text-ink/20 mb-3">🗣️</div>
            <div className="font-display font-semibold text-[15px] text-ink mb-1">
              No citizen voices added yet
            </div>
            <div className="text-[12.5px] text-slate mb-4">
              Click &quot;Add Quote&quot; or &quot;Reset Defaults&quot; to populate.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="text-left font-mono text-[10.5px] tracking-wide uppercase text-slate font-semibold bg-paper border-b border-ink/10">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Citizen / Quote</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Video</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((item, i) => {
                  const image = item.image_url || "/images/14.png";
                  const hasVideo = Boolean(item.video_url);

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-ink/6 hover:bg-orange/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono text-[12px] text-slate">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <div
                            onClick={() =>
                              hasVideo
                                ? setActivePreview({ url: item.video_url!, title: item.attribution })
                                : undefined
                            }
                            className={`relative w-14 h-12 rounded-full overflow-hidden bg-paper shrink-0 border border-ink/10 ${
                              hasVideo ? "cursor-pointer group" : ""
                            }`}
                            title={hasVideo ? "Click to play testimonial" : undefined}
                          >
                            <Image
                              src={image}
                              alt={item.attribution}
                              fill
                              className="object-cover"
                            />
                            {hasVideo && (
                              <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40">
                                <Play className="w-3 h-3 text-white fill-white" />
                              </span>
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-[13.5px] text-ink line-clamp-1 max-w-[380px]">
                              &ldquo;{item.quote}&rdquo;
                            </div>
                            <div className="text-[11.5px] font-mono text-orange">
                              {item.attribution}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[12px] text-slate whitespace-nowrap">
                        {item.duration || "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        {hasVideo ? (
                          <button
                            onClick={() =>
                              setActivePreview({ url: item.video_url!, title: item.attribution })
                            }
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-orange hover:underline"
                          >
                            <Play className="w-3 h-3 fill-orange" /> Play
                          </button>
                        ) : (
                          <span className="text-slate/40 text-[12px]">—</span>
                        )}
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
                        <div className="flex items-center justify-end gap-1.5">
                          {hasVideo && (
                            <button
                              onClick={() =>
                                setActivePreview({ url: item.video_url!, title: item.attribution })
                              }
                              className="p-1.5 text-slate hover:text-orange transition-colors"
                              title="Preview testimonial video"
                            >
                              <Play className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-slate hover:text-orange transition-colors"
                            title="Edit quote"
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
                            onClick={() => deleteItem(item.id)}
                            className="p-1.5 text-slate hover:text-red-600 transition-colors"
                            title="Delete quote"
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

      {/* Lightbox Modal */}
      <VideoModal
        isOpen={Boolean(activePreview)}
        onClose={() => setActivePreview(null)}
        videoUrl={activePreview?.url}
        title={activePreview?.title}
      />
    </div>
  );
}
