"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/client";
import { Trash2, Repeat, Plus, X, Search, Star, Video, Edit3 } from "lucide-react";
import { toast } from "sonner";

interface Post {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  status: string;
  image_url?: string;
  video_url?: string;
  is_featured?: boolean;
  featured?: boolean;
  event_type?: string;
  event_time?: string;
  event_location?: string;
  rsvp_link?: string;
  created_at?: string;
}

const CATEGORIES = ["Press", "Events", "Statements", "Media Features", "News", "Event"];

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");

  // Form fields
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("Press");
  const [excerpt, setExcerpt] = useState("");
  const [date, setDate] = useState("");
  const [status, setStatus] = useState("Published");
  const [imageUrl, setImageUrl] = useState("/images/26.jpeg");
  const [videoUrl, setVideoUrl] = useState("");
  const [isFeatured, setIsFeatured] = useState(false);

  // Event-specific fields
  const [eventType, setEventType] = useState("Rallies");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [rsvpLink, setRsvpLink] = useState("");

  useEffect(() => {
    loadPosts();
  }, []);

  async function loadPosts() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("date", { ascending: false });
      if (data) {
        const campaignPosts = data.filter(
          (p: any) =>
            p.event_type !== "Video" &&
            p.event_type !== "INTRODUCTION" &&
            p.event_type !== "SPEECH"
        );
        setPosts(campaignPosts);
      }
      if (error) toast.error("Error loading posts: " + error.message);
    } catch (e: any) {
      toast.error("Failed to load posts");
    } finally {
      setLoading(false);
    }
  }

  function openNewPostForm() {
    setEditingPost(null);
    setTitle("");
    setCategory("Press");
    setExcerpt("");
    setDate(new Date().toISOString().slice(0, 10));
    setStatus("Published");
    setImageUrl("/images/26.jpeg");
    setVideoUrl("");
    setIsFeatured(false);
    setEventType("Rallies");
    setEventTime("");
    setEventLocation("");
    setRsvpLink("");
    setShowForm(true);
  }

  function startEditing(post: Post) {
    setEditingPost(post);
    setTitle(post.title || "");
    setCategory(post.category || "News");
    setExcerpt(post.excerpt || "");
    setDate(post.date ? post.date.slice(0, 10) : new Date().toISOString().slice(0, 10));
    setStatus(post.status || "Published");
    setImageUrl(post.image_url || "/images/26.jpeg");
    setVideoUrl(post.video_url || "");
    setIsFeatured(Boolean(post.is_featured || post.featured));
    setEventType(post.event_type || "Rallies");
    setEventTime(post.event_time || "");
    setEventLocation(post.event_location || "");
    setRsvpLink(post.rsvp_link || "");
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeForm() {
    setShowForm(false);
    setEditingPost(null);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    if (!title) return;

    const supabase = createClient();
    const isEvent = category === "Event" || category === "Events";

    if (isFeatured) {
      try {
        const query = editingPost
          ? supabase.from("posts").update({ is_featured: false }).neq("id", editingPost.id)
          : supabase.from("posts").update({ is_featured: false }).neq("id", "0");
        await query;
      } catch {}
    }

    const postPayload: any = {
      title,
      category,
      excerpt,
      date: date || new Date().toISOString().slice(0, 10),
      status,
      image_url: imageUrl,
      video_url: videoUrl || null,
      rsvp_link: isEvent ? rsvpLink : (videoUrl || null),
      is_featured: isFeatured,
      event_type: isEvent ? eventType : null,
      event_time: isEvent ? eventTime : null,
      event_location: isEvent ? eventLocation : null,
    };

    if (editingPost) {
      // UPDATE Existing Post
      let { error } = await supabase
        .from("posts")
        .update(postPayload)
        .eq("id", editingPost.id);

      if (error && (error.message?.includes("is_featured") || error.message?.includes("video_url"))) {
        if (error.message?.includes("is_featured")) delete postPayload.is_featured;
        if (error.message?.includes("video_url")) delete postPayload.video_url;
        const res = await supabase.from("posts").update(postPayload).eq("id", editingPost.id);
        error = res.error;
      }

      if (error) {
        toast.error("Error updating post: " + error.message);
        return;
      }

      toast.success("Post updated successfully!");
    } else {
      // INSERT New Post
      let { error } = await supabase.from("posts").insert([postPayload]);

      if (error && (error.message?.includes("is_featured") || error.message?.includes("video_url"))) {
        if (error.message?.includes("is_featured")) delete postPayload.is_featured;
        if (error.message?.includes("video_url")) delete postPayload.video_url;
        const res = await supabase.from("posts").insert([postPayload]);
        error = res.error;
      }

      if (error) {
        toast.error("Error creating post: " + error.message);
        return;
      }

      toast.success("Post created successfully!");
    }

    closeForm();
    loadPosts();
  }

  async function toggleFeatured(post: Post) {
    const supabase = createClient();
    const currentlyFeatured = post.is_featured || post.featured;
    const nextFeatured = !currentlyFeatured;

    try {
      if (nextFeatured) {
        try {
          await supabase.from("posts").update({ is_featured: false }).neq("id", post.id);
        } catch {}
      }

      const { error } = await supabase
        .from("posts")
        .update({ is_featured: nextFeatured })
        .eq("id", post.id);

      if (error) {
        const { error: altError } = await supabase
          .from("posts")
          .update({ featured: nextFeatured })
          .eq("id", post.id);

        if (altError) {
          toast.error("Could not set featured: " + error.message);
          return;
        }
      }

      toast.success(
        nextFeatured
          ? `⭐ Set "${post.title}" as Featured Story!`
          : `Removed "${post.title}" from Featured Story`
      );
      loadPosts();
    } catch (err: any) {
      toast.error("Error updating featured status");
    }
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === "Published" ? "Draft" : "Published";
    const supabase = createClient();
    const { error } = await supabase
      .from("posts")
      .update({ status: next })
      .eq("id", id);
    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Post marked as ${next}`);
      loadPosts();
    }
  }

  async function deletePost(id: string) {
    if (!confirm("Delete this post?")) return;
    const supabase = createClient();
    const { error } = await supabase.from("posts").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete post");
    } else {
      toast.success("Post deleted");
      loadPosts();
    }
  }

  const filteredPosts = posts.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.excerpt && p.excerpt.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCat =
      filterCategory === "All" ||
      p.category.toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
            Content Management
          </span>
          <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
            News &amp; Events
          </h1>
          <p className="text-[13.5px] text-slate mt-1">
            Create, edit, attach video links, and manage the <strong>Featured Story</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={showForm ? closeForm : openNewPostForm}
            className="flex items-center gap-2 px-3.5 py-2 bg-orange text-white rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? "Close Form" : "New Post"}
          </button>
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-5 py-4 border-b border-ink/10 bg-paper/40">
          <div className="flex items-center gap-2 flex-1 max-w-sm">
            <div className="relative w-full">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate" />
              <input
                type="text"
                placeholder="Search posts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 border border-ink/13 rounded-site text-[13px] bg-white outline-none focus:border-orange"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 border border-ink/13 rounded-site text-[13px] bg-white outline-none focus:border-orange"
            >
              <option value="All">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <span className="font-mono text-[11.5px] text-slate ml-2">
              {filteredPosts.length} of {posts.length} total
            </span>
          </div>
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <form onSubmit={handleSave} className="px-5 py-5 bg-paper border-b border-ink/10 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/8">
              <span className="font-display font-semibold text-[16px] text-ink">
                {editingPost ? `Edit Post: "${editingPost.title}"` : "Create New Post"}
              </span>
              <button
                type="button"
                onClick={closeForm}
                className="text-slate hover:text-ink text-[12px] font-mono"
              >
                ✕ Cancel
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="e.g. Campaign Introduction Video"
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Image Path / URL
                </label>
                <div className="flex gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="/images/20.jpeg or https://..."
                    className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setImageUrl(e.target.value);
                    }}
                    className="px-2 py-2.5 border border-ink/13 rounded-site text-[13px] bg-white text-slate outline-none"
                  >
                    <option value="">Choose preset...</option>
                    <option value="/images/20.jpeg">Image 20 (Intro Video)</option>
                    <option value="/images/13.png">Image 13 (Speech Video)</option>
                    <option value="/images/24.png">Image 24</option>
                    <option value="/images/25.png">Image 25 (Town hall)</option>
                    <option value="/images/26.jpeg">Image 26 (Vision)</option>
                    <option value="/images/27.jpeg">Image 27 (Power)</option>
                    <option value="/images/28.jpeg">Image 28 (TV)</option>
                    <option value="/images/29.jpeg">Image 29 (Market)</option>
                    <option value="/images/30.jpeg">Image 30 (Report)</option>
                    <option value="/images/31.jpeg">Image 31 (Radio)</option>
                    <option value="/images/32.jpeg">Image 32 (Safety)</option>
                    <option value="/images/33.jpeg">Image 33 (School)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Video Link (YouTube / Vimeo / MP4)
                </label>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Publish Date
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                >
                  <option>Published</option>
                  <option>Draft</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-orange focus:ring-orange accent-orange cursor-pointer"
                />
                <label htmlFor="isFeatured" className="text-[13px] font-semibold text-ink cursor-pointer flex items-center gap-1.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  Set as Featured / Spotlight Story
                </label>
              </div>

              <div className="lg:col-span-3">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Excerpt / Summary
                </label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  rows={2}
                  placeholder="Short overview of the update or video description..."
                  className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange resize-none"
                />
              </div>

              {/* Event-specific fields */}
              {(category === "Event" || category === "Events") && (
                <>
                  <div>
                    <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                      Event Type
                    </label>
                    <select
                      value={eventType}
                      onChange={(e) => setEventType(e.target.value)}
                      className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                    >
                      <option>Rallies</option>
                      <option>Town Halls</option>
                      <option>Community Visits</option>
                      <option>Debates</option>
                      <option>Door-to-Door</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                      Time / Duration
                    </label>
                    <input
                      type="text"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                      placeholder="e.g. 10:00 AM or 03:42"
                      className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                    />
                  </div>
                  <div className="lg:col-span-2">
                    <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                      Location
                    </label>
                    <input
                      type="text"
                      value={eventLocation}
                      onChange={(e) => setEventLocation(e.target.value)}
                      placeholder="e.g. Auchi Township Stadium"
                      className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                      RSVP / Action Link
                    </label>
                    <input
                      type="text"
                      value={rsvpLink}
                      onChange={(e) => setRsvpLink(e.target.value)}
                      placeholder="e.g. https://..."
                      className="w-full px-3 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-orange-dark shadow-sm transition-colors"
              >
                {editingPost ? "Update Post" : "Save Post"}
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

        {loading ? (
          <div className="py-16 text-center text-slate">Loading posts from database...</div>
        ) : filteredPosts.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl text-ink/20 mb-3">📰</div>
            <div className="font-display font-semibold text-[15px] text-ink mb-1">
              No posts found
            </div>
            <div className="text-[12.5px] text-slate mb-4">
              Click &quot;New Post&quot; above to create a post.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px]">
              <thead>
                <tr className="text-left font-mono text-[10.5px] tracking-wide uppercase text-slate font-semibold bg-paper border-b border-ink/10">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Post</th>
                  <th className="px-5 py-3">Category</th>
                  <th className="px-5 py-3">Video</th>
                  <th className="px-5 py-3">Featured</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPosts.map((p, i) => {
                  const image = p.image_url || "/images/26.jpeg";
                  const featured = p.is_featured || p.featured;
                  const hasVideo = Boolean(p.video_url || (p.rsvp_link && p.rsvp_link.startsWith("http")));

                  return (
                    <tr
                      key={p.id}
                      className={`border-b border-ink/6 hover:bg-orange/[0.02] transition-colors ${
                        featured ? "bg-amber-50/40" : ""
                      }`}
                    >
                      <td className="px-5 py-3.5 font-mono text-[12px] text-slate">
                        {String(i + 1).padStart(2, "0")}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-10 rounded overflow-hidden bg-paper shrink-0 border border-ink/10">
                            <Image
                              src={image}
                              alt={p.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div>
                            <div className="font-semibold text-[13.5px] text-ink line-clamp-1 max-w-[320px] flex items-center gap-2">
                              {p.title}
                            </div>
                            {p.excerpt && (
                              <div className="text-[11.5px] text-slate line-clamp-1 max-w-[320px]">
                                {p.excerpt}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                            p.category === "Events" || p.category === "Event"
                              ? "bg-emerald/10 text-forest"
                              : p.category === "Statements"
                              ? "bg-orange/12 text-orange-dark"
                              : "bg-ink/10 text-ink"
                          }`}
                        >
                          {p.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        {hasVideo ? (
                          <a
                            href={p.video_url || p.rsvp_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 font-mono text-[11px] text-orange hover:underline"
                            title="Open video link"
                          >
                            <Video className="w-3.5 h-3.5" /> Link
                          </a>
                        ) : (
                          <span className="text-slate/40 text-[12px]">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => toggleFeatured(p)}
                          className={`inline-flex items-center gap-1.5 font-mono text-[11px] font-semibold px-2.5 py-1 rounded-full transition-colors ${
                            featured
                              ? "bg-amber-100 text-amber-800 border border-amber-300 hover:bg-amber-200"
                              : "text-slate/60 hover:text-amber-600 hover:bg-amber-50"
                          }`}
                          title={featured ? "Currently Featured Story" : "Click to set as Featured"}
                        >
                          <Star className={`w-3.5 h-3.5 ${featured ? "fill-amber-500 text-amber-600" : "text-slate/40"}`} />
                          <span>{featured ? "Featured" : "Set"}</span>
                        </button>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-[12px] text-slate whitespace-nowrap">
                        {new Date(
                          p.date.includes("T") ? p.date : p.date + "T00:00:00"
                        ).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full ${
                            p.status === "Published"
                              ? "bg-emerald/10 text-emerald"
                              : "bg-line-soft text-slate"
                          }`}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => startEditing(p)}
                            className="p-1.5 text-slate hover:text-orange transition-colors"
                            title="Edit post"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => toggleStatus(p.id, p.status)}
                            className="p-1.5 text-slate hover:text-orange transition-colors"
                            title="Toggle publish status"
                          >
                            <Repeat className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deletePost(p.id)}
                            className="p-1.5 text-slate hover:text-red-600 transition-colors"
                            title="Delete post"
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
