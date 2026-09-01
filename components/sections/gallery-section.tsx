// components/sections/gallery-section.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { SectionHead } from "./section-head";
import { delay } from "@/lib/animation";
import { createClient } from "@/lib/client";

interface GalleryPhoto {
  id?: string;
  src: string;
  alt: string;
  cap: string;
  tall?: boolean;
  wide?: boolean;
  delayMs: number;
}

export function GallerySection() {
  const [items, setItems] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadGallery() {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from("gallery")
          .select("*")
          .order("order_num", { ascending: true });

        if (!error && data && data.length > 0) {
          const published = data.filter(
            (g: any) => !g.status || g.status.toLowerCase() === "published"
          );
          setItems(
            published.map((g: any, idx: number) => ({
              id: g.id,
              src: g.image_url || "/images/22.jpg",
              alt: g.alt_text || g.caption,
              cap: g.caption,
              tall: g.layout === "tall",
              wide: g.layout === "wide",
              delayMs: idx * 80,
            }))
          );
        }
      } catch (err) {
        console.error("Error loading gallery photos:", err);
      } finally {
        setLoading(false);
      }
    }

    loadGallery();
  }, []);

  if (!loading && items.length === 0) {
    return null;
  }

  return (
    <section id="gallery" className="py-25">
      <div className="max-w-site mx-auto px-8">
        <SectionHead
          number="ON THE GROUND"
          title={
            <>
              Visits, <span className="accent">Rallies &amp; Meetings</span>
            </>
          }
        />

        <div className="gallery-grid">
          {items.map((item) => (
            <a
              key={item.id || item.cap}
              href={item.src}
              target="_blank"
              rel="noopener noreferrer"
              className={`gallery-item rise ${item.tall ? "tall" : ""} ${item.wide ? "wide" : ""}`}
              style={delay(item.delayMs)}
            >
              <Image
                src={item.src}
                alt={item.alt}
                width={600}
                height={450}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="gallery-cap">{item.cap}</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}