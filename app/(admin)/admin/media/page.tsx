"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/client";
import { Plus, X, Edit3, Trash2, Repeat, Play, Search, Film } from "lucide-react";
import { VideoModal } from "@/components/ui/video-modal";
import { toast } from "sonner";

interface MediaItem {
  id: string;
  title: string;
  tag: string;
  description: string;
  duration: string;
  image_url: string;
  video_url: string;
  status: string;
  created_at?: string;
}

const DEFAULT_VIDEOS = [
  {
    title: "Campaign Introduction Video",
    tag: "INTRODUCTION",
    description: "Meet Comr. Aruna Abubakari — his story, his record, and his plan for Edo North, in his own words.",
    image_url: "/images/20.jpeg",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "03:42",
    status: "Published",
  },
  {
    title: "“Why I Am Running”",
    tag: "SPEECH",
    description: "The full address delivered at Auchi Town Hall, setting out the case for a new direction in Edo North.",
    image_url: "/images/13.png",
    video_url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    duration: "07:15",
    status: "Published",
  },
];

const VIDEO_TAGS = ["INTRODUCTION", "SPEECH", "TOWN HALL", "INTERVIEW", "RALLY", "MEDIA FEATURES", "POLICY"];

export default function AdminMediaPage() {
  const [videos, setVideos] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [activePreview, setActivePreview] = useState<{ url: string; title?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form states
  const [title, setTitle] = useState("");
  const [tag, setTag] = useState("INTRODUCTION");
  const [videoUrl, setVideoUrl] = useState("");
  const [duration, setDuration] = useState("03:42");
  const [imageUrl, setImageUrl] = useState("/images/20.jpeg");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Published");

  useEffect(() => {
    loadVideos();
  }, []);

  async function loadVideos() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("media")
        .select("*")
        .order("created_at", { ascending: false });

      if (data) {
        setVideos(data);
      }
      if (error) {
        toast.error("Media table notice: " + error.message);
      }
    } catch (e: any) {
      toast.error("Failed to load media records");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingItem(null);
    setTitle("");
    setTag("INTRODUCTION");
    setVideoUrl("https://www.youtube.com/watch?v=");
    setDuration("04:30");
    setImageUrl("/images/20.jpeg");
    setDescription("");
    setStatus("Published");
    setShowForm(true);
  }

  function startEdit(item: MediaItem) {
    setEditingItem(item);
    setTitle(item.title || "");
    setTag(item.tag || "INTRODUCTION");
    setVideoUrl(item.video_url || "");
    setDuration(item.duration || "04:30");
    setImageUrl(item.image_url || "/images/20.jpeg");
    setDescription(item.description || "");
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
    if (!title || !videoUrl) {
      toast.error("Please enter a title and video URL");
      return;
    }

    const supabase = createClient();
    const mediaPayload = {
      title,
      tag,
      description,
      duration,
      image_url: imageUrl,
      video_url: videoUrl,
      status,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("media")
        .update(mediaPayload)
        .eq("id", editingItem.id);

      if (error) {
        toast.error("Error updating media: " + error.message);
        return;
      }
      toast.success("Media video updated successfully!");
    } else {
      const { error } = await supabase
        .from("media")
        .insert([mediaPayload]);

      if (error) {
        toast.error("Error saving media: " + error.message);
        return;
      }
      toast.success("Media video published!");
    }

    closeForm();
    loadVideos();
  }

  async function seedDefaultVideos() {
    const supabase = createClient();
    for (const v of DEFAULT_VIDEOS) {
      await supabase.from("media").insert([v]);
    }
    toast.success("Default media videos added!");
    loadVideos();
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === "Published" ? "Draft" : "Published";
    const supabase = createClient();
    const { error } = await supabase
      .from("media")
      .update({ status: next })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Video marked as ${next}`);
      loadVideos();
    }
  }

  async function deleteVideo(id: string) {
    if (!confirm("Are you sure you want to delete this video?")) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("media")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete video");
    } else {
      toast.success("Video deleted");
      loadVideos();
    }
  }

  const displayedVideos = videos.filter((v) =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (v.description && v.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
            Media Management
          </span>
          <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
            Hear It From Him Directly
          </h1>
          <p className="text-[13.5px] text-slate mt-1">
            Manage videos, candidate speeches, and interview recordings.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={seedDefaultVideos}
            className="flex items-center gap-1.5 px-3 py-2 border border-ink/15 text-slate rounded-site font-semibold text-[12.5px] hover:border-orange hover:text-orange transition-colors"
          >
            <Film className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            onClick={showForm ? closeForm : openCreateForm}
            className="flex items-center gap-2 px-3.5 py-2 bg-orange text-white rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? "Close Form" : "Add Video"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden mb-8">
        {/* Search & Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10 bg-paper/40">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
            <input
              type="text"
              placeholder="Search media videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-ink/13 rounded-site text-[13px] bg-white outline-none focus:border-orange"
            />
          </div>

          <span className="font-mono text-[11.5px] text-slate ml-2">
            {displayedVideos.length} video{displayedVideos.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <form onSubmit={handleSave} className="px-6 py-5 bg-paper border-b border-ink/10 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/8">
              <span className="font-display font-semibold text-[16px] text-ink">
                {editingItem ? `Edit Video: "${editingItem.title}"` : "Add New Media Video"}
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
                  Video Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Campaign Introduction Video or “Why I Am Running”"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Tag / Badge *
                </label>
                <select
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                >
                  {VIDEO_TAGS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Video Link (YouTube, Vimeo, MP4) *
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                  placeholder="https://www.youtube.com/watch?v=... or https://..."
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Duration (e.g. 03:42)
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 03:42 or 07:15"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Thumbnail Image
                </label>
                <div className="flex gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/20.jpeg or URL..."
                    className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setImageUrl(e.target.value);
                    }}
                    className="px-2.5 py-2.5 border border-ink/13 rounded-site text-[13px] bg-white text-slate outline-none"
                  >
                    <option value="">Presets...</option>
                    <option value="/images/20.jpeg">Image 20 (Intro Video)</option>
                    <option value="/images/13.png">Image 13 (Speech Video)</option>
                    <option value="/images/24.png">Image 24</option>
                    <option value="/images/25.png">Image 25</option>
                    <option value="/images/28.jpeg">Image 28</option>
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
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                  placeholder="Short overview of what the candidate discusses in this recording..."
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange resize-none"
                />
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-orange-dark shadow-sm transition-colors"
              >
                {editingItem ? "Update Video" : "Save & Publish Video"}
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

        {/* Video Table */}
        {loading ? (
          <div className="py-16 text-center text-slate">Loading media videos...</div>
        ) : displayedVideos.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl text-ink/20 mb-3">🎥</div>
            <div className="font-display font-semibold text-[15px] text-ink mb-1">
              No media videos yet
            </div>
            <div className="text-[12.5px] text-slate mb-4">
              Click &quot;Add Video&quot; or &quot;Reset Defaults&quot; to add your campaign videos.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="text-left font-mono text-[10.5px] tracking-wide uppercase text-slate font-semibold bg-paper border-b border-ink/10">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Video</th>
                  <th className="px-5 py-3">Tag</th>
                  <th className="px-5 py-3">Duration</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayedVideos.map((item, i) => {
                  const image = item.image_url || "/images/20.jpeg";
                  const playUrl = item.video_url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ";

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
                            onClick={() => setActivePreview({ url: playUrl, title: item.title })}
                            className="relative w-16 h-11 rounded overflow-hidden bg-paper shrink-0 border border-ink/10 cursor-pointer group"
                            title="Click to preview video"
                          >
                            <Image
                              src={image}
                              alt={item.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40">
                              <Play className="w-3.5 h-3.5 text-white fill-white" />
                            </span>
                          </div>
                          <div>
                            <div className="font-semibold text-[13.5px] text-ink line-clamp-1 max-w-[340px]">
                              {item.title}
                            </div>
                            {item.description && (
                              <div className="text-[11.5px] text-slate line-clamp-1 max-w-[340px]">
                                {item.description}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="inline-block font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full bg-forest/10 text-forest uppercase">
                          {item.tag || "VIDEO"}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[12px] text-slate whitespace-nowrap">
                        {item.duration || "—"}
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
                          <button
                            onClick={() => setActivePreview({ url: playUrl, title: item.title })}
                            className="p-1.5 text-slate hover:text-orange transition-colors"
                            title="Preview video playback"
                          >
                            <Play className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-slate hover:text-orange transition-colors"
                            title="Edit video"
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
                            onClick={() => deleteVideo(item.id)}
                            className="p-1.5 text-slate hover:text-red-600 transition-colors"
                            title="Delete video"
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

      {/* Video Lightbox Modal for Live Previews */}
      <VideoModal
        isOpen={Boolean(activePreview)}
        onClose={() => setActivePreview(null)}
        videoUrl={activePreview?.url}
        title={activePreview?.title}
      />
    </div>
  );
}
