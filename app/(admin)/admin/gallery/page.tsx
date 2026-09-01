"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { createClient } from "@/lib/client";
import { Plus, X, Edit3, Trash2, Repeat, Search, Images, Eye } from "lucide-react";
import { toast } from "sonner";

interface GalleryItem {
  id: string;
  caption: string;
  alt_text: string;
  image_url: string;
  layout: "normal" | "tall" | "wide";
  order_num?: number;
  status: string;
  created_at?: string;
}

const DEFAULT_GALLERY: Omit<GalleryItem, "id">[] = [
  {
    image_url: "/images/22.jpg",
    alt_text: "Community visit, Auchi",
    caption: "Ward Visit — Auchi",
    layout: "tall",
    order_num: 1,
    status: "Published",
  },
  {
    image_url: "/images/27.jpeg",
    alt_text: "Town hall rally",
    caption: "Town Hall — Etsako West",
    layout: "normal",
    order_num: 2,
    status: "Published",
  },
  {
    image_url: "/images/28.jpeg",
    alt_text: "Youth meeting",
    caption: "Youth Desk Launch — Owan East",
    layout: "normal",
    order_num: 3,
    status: "Published",
  },
  {
    image_url: "/images/29.jpeg",
    alt_text: "Market association meeting",
    caption: "Market Association Meeting",
    layout: "wide",
    order_num: 4,
    status: "Published",
  },
  {
    image_url: "/images/30.jpeg",
    alt_text: "Health centre inspection",
    caption: "PHC Inspection — Ovia North-East",
    layout: "normal",
    order_num: 5,
    status: "Published",
  },
];

export default function AdminGalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Form fields
  const [caption, setCaption] = useState("");
  const [altText, setAltText] = useState("");
  const [imageUrl, setImageUrl] = useState("/images/22.jpg");
  const [layout, setLayout] = useState<"normal" | "tall" | "wide">("normal");
  const [orderNum, setOrderNum] = useState(1);
  const [status, setStatus] = useState("Published");

  useEffect(() => {
    loadGallery();
  }, []);

  async function loadGallery() {
    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase
        .from("gallery")
        .select("*")
        .order("order_num", { ascending: true });

      if (data) {
        setItems(data);
      }
      if (error) {
        toast.error("Gallery table notice: " + error.message);
      }
    } catch (e: any) {
      toast.error("Failed to load gallery items");
    } finally {
      setLoading(false);
    }
  }

  function openCreateForm() {
    setEditingItem(null);
    setCaption("");
    setAltText("");
    setImageUrl("/images/22.jpg");
    setLayout("normal");
    setOrderNum(items.length + 1);
    setStatus("Published");
    setShowForm(true);
  }

  function startEdit(item: GalleryItem) {
    setEditingItem(item);
    setCaption(item.caption || "");
    setAltText(item.alt_text || "");
    setImageUrl(item.image_url || "/images/22.jpg");
    setLayout(item.layout || "normal");
    setOrderNum(item.order_num || 1);
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
    if (!caption || !imageUrl) {
      toast.error("Please provide a caption and image");
      return;
    }

    const supabase = createClient();
    const payload = {
      caption,
      alt_text: altText || caption,
      image_url: imageUrl,
      layout,
      order_num: Number(orderNum) || 1,
      status,
    };

    if (editingItem) {
      const { error } = await supabase
        .from("gallery")
        .update(payload)
        .eq("id", editingItem.id);

      if (error) {
        toast.error("Error updating photo: " + error.message);
        return;
      }
      toast.success("Gallery photo updated successfully!");
    } else {
      const { error } = await supabase
        .from("gallery")
        .insert([payload]);

      if (error) {
        toast.error("Error saving photo: " + error.message);
        return;
      }
      toast.success("Gallery photo published!");
    }

    closeForm();
    loadGallery();
  }

  async function seedDefaults() {
    const supabase = createClient();
    for (const item of DEFAULT_GALLERY) {
      await supabase.from("gallery").insert([item]);
    }
    toast.success("Default gallery photos added!");
    loadGallery();
  }

  async function toggleStatus(id: string, current: string) {
    const next = current === "Published" ? "Draft" : "Published";
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery")
      .update({ status: next })
      .eq("id", id);

    if (error) {
      toast.error("Failed to update status");
    } else {
      toast.success(`Photo marked as ${next}`);
      loadGallery();
    }
  }

  async function deleteItem(id: string) {
    if (!confirm("Are you sure you want to delete this gallery photo?")) return;
    const supabase = createClient();
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", id);

    if (error) {
      toast.error("Failed to delete photo");
    } else {
      toast.success("Photo deleted");
      loadGallery();
    }
  }

  const displayed = items.filter(
    (i) =>
      i.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (i.alt_text && i.alt_text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
            Photo Management
          </span>
          <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
            Visits, Rallies &amp; Meetings
          </h1>
          <p className="text-[13.5px] text-slate mt-1">
            Manage on-the-ground photos, ward visit galleries, and community meeting snapshots.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={seedDefaults}
            className="flex items-center gap-1.5 px-3 py-2 border border-ink/15 text-slate rounded-site font-semibold text-[12.5px] hover:border-orange hover:text-orange transition-colors"
          >
            <Images className="w-3.5 h-3.5" /> Reset Defaults
          </button>

          <button
            onClick={showForm ? closeForm : openCreateForm}
            className="flex items-center gap-2 px-3.5 py-2 bg-orange text-white rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
          >
            {showForm ? <X className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            {showForm ? "Close Form" : "Add Photo"}
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
              placeholder="Search photo captions or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 border border-ink/13 rounded-site text-[13px] bg-white outline-none focus:border-orange"
            />
          </div>

          <span className="font-mono text-[11.5px] text-slate ml-2">
            {displayed.length} photo{displayed.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Create / Edit Form */}
        {showForm && (
          <form onSubmit={handleSave} className="px-6 py-5 bg-paper border-b border-ink/10 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-ink/8">
              <span className="font-display font-semibold text-[16px] text-ink">
                {editingItem ? "Edit Photo Details" : "Add New Gallery Photo"}
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
                  Caption / Title *
                </label>
                <input
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required
                  placeholder="e.g. Ward Visit — Auchi"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Location / Alt Text
                </label>
                <input
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder="e.g. Community visit, Auchi"
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                />
              </div>

              <div className="lg:col-span-2">
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Photo Path / URL *
                </label>
                <div className="flex gap-2">
                  <input
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    required
                    placeholder="/images/22.jpg or https://..."
                    className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                  />
                  <select
                    onChange={(e) => {
                      if (e.target.value) setImageUrl(e.target.value);
                    }}
                    className="px-2.5 py-2.5 border border-ink/13 rounded-site text-[13px] bg-white text-slate outline-none"
                  >
                    <option value="">Presets...</option>
                    <option value="/images/22.jpg">Image 22 (Auchi Visit)</option>
                    <option value="/images/27.jpeg">Image 27 (Town Hall)</option>
                    <option value="/images/28.jpeg">Image 28 (Youth Meeting)</option>
                    <option value="/images/29.jpeg">Image 29 (Market Meeting)</option>
                    <option value="/images/30.jpeg">Image 30 (PHC Inspection)</option>
                    <option value="/images/24.png">Image 24</option>
                    <option value="/images/25.png">Image 25</option>
                    <option value="/images/26.jpeg">Image 26</option>
                    <option value="/images/31.jpeg">Image 31</option>
                    <option value="/images/32.jpeg">Image 32</option>
                    <option value="/images/33.jpeg">Image 33</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Grid Style (Mosaic Span)
                </label>
                <select
                  value={layout}
                  onChange={(e) => setLayout(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] bg-white outline-none focus:border-orange"
                >
                  <option value="normal">Normal (1x1)</option>
                  <option value="tall">Tall (Spans 2 Rows)</option>
                  <option value="wide">Wide (Spans 2 Columns)</option>
                </select>
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1">
                  Display Order
                </label>
                <input
                  type="number"
                  value={orderNum}
                  onChange={(e) => setOrderNum(Number(e.target.value))}
                  min={1}
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
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-orange text-white px-5 py-2.5 rounded-site font-semibold text-[13px] hover:bg-orange-dark shadow-sm transition-colors"
              >
                {editingItem ? "Update Photo" : "Save & Publish Photo"}
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

        {/* Gallery Table */}
        {loading ? (
          <div className="py-16 text-center text-slate">Loading gallery photos...</div>
        ) : displayed.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl text-ink/20 mb-3">🖼️</div>
            <div className="font-display font-semibold text-[15px] text-ink mb-1">
              No gallery photos added yet
            </div>
            <div className="text-[12.5px] text-slate mb-4">
              Click &quot;Add Photo&quot; or &quot;Reset Defaults&quot; to populate the gallery.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="text-left font-mono text-[10.5px] tracking-wide uppercase text-slate font-semibold bg-paper border-b border-ink/10">
                  <th className="px-5 py-3">Order</th>
                  <th className="px-5 py-3">Photo / Caption</th>
                  <th className="px-5 py-3">Location</th>
                  <th className="px-5 py-3">Grid Layout</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {displayed.map((item, i) => {
                  const image = item.image_url || "/images/22.jpg";

                  return (
                    <tr
                      key={item.id}
                      className="border-b border-ink/6 hover:bg-orange/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5 font-mono text-[12px] text-slate">
                        #{item.order_num || i + 1}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3.5">
                          <a
                            href={image}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative w-16 h-12 rounded overflow-hidden bg-paper shrink-0 border border-ink/10 group block"
                            title="Click to view full photo"
                          >
                            <Image
                              src={image}
                              alt={item.caption}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                            <span className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                              <Eye className="w-3.5 h-3.5 text-white" />
                            </span>
                          </a>
                          <div>
                            <div className="font-semibold text-[13.5px] text-ink line-clamp-1 max-w-[340px]">
                              {item.caption}
                            </div>
                            <div className="text-[11.5px] font-mono text-slate">
                              {item.image_url}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate">
                        {item.alt_text || "—"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-block font-mono text-[10.5px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            item.layout === "tall"
                              ? "bg-purple-100 text-purple-800"
                              : item.layout === "wide"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-ink/8 text-ink"
                          }`}
                        >
                          {item.layout || "normal"}
                        </span>
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
                            onClick={() => startEdit(item)}
                            className="p-1.5 text-slate hover:text-orange transition-colors"
                            title="Edit photo details"
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
                            title="Delete photo"
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
