// components/sections/voxpop-section.tsx
"use client";

import { useEffect, useState } from "react";
import { SectionHead } from "./section-head";
import { MediaCard } from "./media-card";
import { VideoModal } from "@/components/ui/video-modal";
import { createClient } from "@/lib/client";

interface VoxpopItem {
  id?: string;
  image: string;
  alt: string;
  duration: string;
  quote: string;
  attribution: string;
  video_url?: string;
  delayMs: number;
}

export function VoxpopSection() {
  const [items, setItems] = useState<VoxpopItem[]>([]);
  const [activeVideo, setActiveVideo] = useState<{ url: string; title?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadVoxpop() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("voxpop")
          .select("*")
          .order("created_at", { ascending: true });

        if (!error && data && data.length > 0) {
          const published = data.filter(
            (v: any) => !v.status || v.status.toLowerCase() === "published"
          );
          setItems(
            published.map((v: any, idx: number) => ({
              id: v.id,
              image: v.image_url || "/images/14.png",
              alt: v.attribution,
              duration: v.duration || "01:30",
              quote: v.quote,
              attribution: v.attribution,
              video_url: v.video_url || undefined,
              delayMs: idx * 120,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading voxpop items:", err);
      } finally {
        setLoading(false);
      }
    }

    loadVoxpop();
  }, []);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section id="voxpop" className="py-25">
      <div className="max-w-site mx-auto px-8">
        <SectionHead
          number="IN THEIR WORDS"
          title={
            <>
              People of Edo North <span className="accent">Speak</span>
            </>
          }
        />

        <div className="voxpop-grid">
          {items.map((item) => (
            <MediaCard
              key={item.id || item.attribution}
              {...item}
              variant="voxpop"
              onPlay={
                item.video_url
                  ? (url, title) => setActiveVideo({ url, title: title || item.attribution })
                  : undefined
              }
            />
          ))}
        </div>
      </div>

      {/* Video Modal Popup */}
      <VideoModal
        isOpen={Boolean(activeVideo)}
        onClose={() => setActiveVideo(null)}
        videoUrl={activeVideo?.url}
        title={activeVideo?.title}
      />
    </section>
  );
}