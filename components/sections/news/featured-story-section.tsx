// components/sections/news/featured-story-section.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Play } from "lucide-react";
import { delay } from "@/lib/animation";
import { createClient } from "@/lib/client";
import { VideoModal } from "@/components/ui/video-modal";

interface FeaturedPost {
  id: string;
  title: string;
  category: string;
  excerpt: string;
  date: string;
  image_url?: string;
  image?: string;
  video_url?: string;
  read_time?: string;
  is_video?: boolean;
}

function formatDate(dateStr: string) {
  try {
    const d = new Date(dateStr.includes("T") ? dateStr : dateStr + "T00:00:00");
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

export function FeaturedStorySection() {
  const [featured, setFeatured] = useState<FeaturedPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const supabase = createClient();
        
        // Fetch all posts ordered by date descending
        const { data, error } = await supabase
          .from("posts")
          .select("*")
          .order("date", { ascending: false });

        if (!error && data && data.length > 0) {
          const published = data.filter(
            (p) => !p.status || p.status.toLowerCase() === "published"
          );
          const candidates = published.length > 0 ? published : data;

          const item =
            candidates.find(
              (p) =>
                p.is_featured === true ||
                p.featured === true ||
                p.is_featured === "true" ||
                p.is_featured === 1
            ) || candidates[0];

          if (item) {
            setFeatured({
              id: item.id,
              title: item.title,
              category: item.category || "Events",
              excerpt: item.excerpt || "",
              date: item.date || new Date().toISOString().slice(0, 10),
              image_url: item.image_url || item.image || "/images/25.png",
              video_url: item.video_url || item.rsvp_link || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              read_time: item.read_time || "4 min read",
              is_video:
                item.category === "Events" ||
                item.category === "Media Features" ||
                Boolean(item.is_video) ||
                Boolean(item.video_url),
            });
          }
        }
      } catch (err) {
        console.error("Error loading featured story:", err);
      } finally {
        setLoading(false);
      }
    }

    loadFeatured();
  }, []);

  if (loading) {
    return (
      <section className="py-16 pb-10">
        <div className="max-w-site mx-auto px-8">
          <div className="h-64 bg-paper/60 animate-pulse rounded-site border border-ink/8" />
        </div>
      </section>
    );
  }

  if (!featured) {
    return null;
  }

  const imageSrc = featured.image_url || featured.image || "/images/25.png";
  const displayDate = formatDate(featured.date);

  return (
    <section className="py-16 pb-10">
      <div className="max-w-site mx-auto px-8">
        <span className="font-mono text-[11px] tracking-widest text-orange mb-5 block rise in">
          Latest Story
        </span>

        <div
          className="grid md:grid-cols-[1.15fr_0.85fr] border border-ink/12 rounded-site overflow-hidden rise in"
          style={delay(100)}
        >
          <div
            onClick={featured.is_video ? () => setIsVideoOpen(true) : undefined}
            className={`relative min-h-[260px] md:min-h-[380px] bg-paper group overflow-hidden ${
              featured.is_video ? "cursor-pointer" : ""
            }`}
          >
            <Image
              src={imageSrc}
              alt={featured.title}
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {featured.is_video && (
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="w-16 h-16 rounded-full bg-orange/92 text-white flex items-center justify-center pl-0.5 shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-6 h-6 fill-current" />
                </span>
              </span>
            )}
          </div>

          <div className="p-8 md:p-11 flex flex-col justify-center">
            <span className="inline-flex items-center gap-1.5 font-mono text-[10.5px] tracking-wider uppercase text-forest bg-emerald/8 px-3 py-1.5 rounded-full mb-4 self-start">
              {featured.is_video ? "📺 " : "📰 "} {featured.category}
            </span>
            <h2 className="font-display font-semibold text-[clamp(24px,2.6vw,34px)] leading-tight text-ink mb-4">
              {featured.title}
            </h2>
            <p className="text-[15.5px] leading-relaxed text-slate mb-5">
              {featured.excerpt}
            </p>
            <div className="flex gap-3.5 font-mono text-[11px] tracking-wide text-slate mb-6">
              <span>📅 {displayDate}</span>
              <span>🕐 {featured.read_time || "4 min read"}</span>
            </div>
            {featured.is_video ? (
              <button
                type="button"
                onClick={() => setIsVideoOpen(true)}
                className="inline-flex items-center gap-2 font-semibold text-sm text-orange hover:gap-3 transition-all self-start"
              >
                Watch video →
              </button>
            ) : (
              <a
                href="#"
                className="inline-flex items-center gap-2 font-semibold text-sm text-orange hover:gap-3 transition-all self-start"
              >
                Read the full story →
              </a>
            )}
          </div>
        </div>
      </div>

      {/* Video Popup Modal */}
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
        videoUrl={featured.video_url}
        title={featured.title}
      />
    </section>
  );
}
