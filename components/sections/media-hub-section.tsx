// components/sections/media-hub-section.tsx
"use client";

import { useEffect, useState } from "react";
import { SectionHead } from "./section-head";
import { MediaCard } from "./media-card";
import { VideoModal } from "@/components/ui/video-modal";
import { createClient } from "@/lib/client";

interface MediaItem {
  id?: string;
  image: string;
  alt: string;
  duration: string;
  tag: string;
  title: string;
  description: string;
  video_url?: string;
  delayMs: number;
}

export function MediaHubSection() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMedia() {
      try {
        const supabase = createClient();

        // Query dedicated 'media' table
        const { data, error } = await supabase
          .from("media")
          .select("*")
          .order("created_at", { ascending: false });

        if (!error && data && data.length > 0) {
          const published = data.filter(
            (m: any) => !m.status || m.status.toLowerCase() === "published"
          );
          setItems(
            published.map((m: any, idx: number) => ({
              id: m.id,
              image: m.image_url || "/images/20.jpeg",
              alt: m.title,
              duration: m.duration || "04:30",
              tag: (m.tag || "MEDIA").toUpperCase(),
              title: m.title,
              description: m.description || "",
              video_url: m.video_url || "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
              delayMs: idx * 120,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading media items:", err);
      } finally {
        setLoading(false);
      }
    }

    loadMedia();
  }, []);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section id="media" className="py-25 bg-paper">
      <div className="max-w-site mx-auto px-8">
        <SectionHead
          number="WATCH"
          title={
            <>
              Hear It From <span className="accent">Him Directly</span>
            </>
          }
        />
        <div className="media-grid">
          {items.map((item) => (
            <MediaCard
              key={item.id || item.title}
              {...item}
              onPlay={(url, title) => setActiveVideo({ url, title })}
            />
          ))}
        </div>
      </div>

      {/* In-page Video Modal Popup */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.url}
        title={activeVideo?.title}
      />
    </section>
  );
}