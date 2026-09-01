"use client";

import Image from "next/image";
import { Play } from "lucide-react";
import { delay } from "@/lib/animation";

interface MediaCardProps {
  image: string;
  alt: string;
  duration?: string;
  tag?: string;
  title?: string;
  description?: string;
  quote?: string;
  attribution?: string;
  delayMs?: number;
  variant?: "media" | "voxpop";
  videoUrl?: string;
  video_url?: string;
  onPlay?: (url: string, title?: string) => void;
}

export function MediaCard({
  image,
  alt,
  duration,
  tag,
  title,
  description,
  quote,
  attribution,
  delayMs = 0,
  variant = "media",
  videoUrl,
  video_url,
  onPlay,
}: MediaCardProps) {
  const link = videoUrl || video_url;

  const handlePlayClick = (e: React.MouseEvent) => {
    if (onPlay && link) {
      e.preventDefault();
      onPlay(link, title);
    }
  };

  return (
    <div
      className={`rise in bg-white group ${variant === "voxpop" ? "voxpop-card" : "media-card"}`}
      style={delay(delayMs)}
    >
      <div
        className="media-thumb relative overflow-hidden cursor-pointer"
        onClick={link && onPlay ? handlePlayClick : undefined}
      >
        <Image
          src={image || "/images/20.jpeg"}
          alt={alt || title || "Video thumbnail"}
          width={640}
          height={360}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        <button
          type="button"
          onClick={handlePlayClick}
          className="play-btn"
          aria-label={`Play ${title ?? "video"}`}
        >
          <Play className="w-6 h-6 fill-current" />
        </button>

        {duration && <span className="media-duration">{duration}</span>}
      </div>

      {variant === "media" ? (
        <div className="p-7 pb-8 flex flex-col flex-1">
          {tag && <span className="media-tag self-start mb-2">{tag}</span>}
          {title && (
            <h4 className="font-display font-semibold text-[22px] mb-2.5 text-ink">
              {link && onPlay ? (
                <button
                  type="button"
                  onClick={handlePlayClick}
                  className="text-left hover:text-orange transition-colors"
                >
                  {title}
                </button>
              ) : (
                title
              )}
            </h4>
          )}
          {description && (
            <p className="text-[14.5px] leading-relaxed text-slate flex-1">
              {description}
            </p>
          )}
          {link && (
            <button
              type="button"
              onClick={handlePlayClick}
              className="inline-flex items-center gap-2 font-semibold text-sm text-orange hover:gap-3 transition-all self-start mt-4"
            >
              Watch Video →
            </button>
          )}
        </div>
      ) : (
        <div className="px-6 py-5 pb-7">
          {quote && (
            <p className="font-display italic text-[15px] leading-relaxed text-ink mb-3.5">
              &ldquo;{quote}&rdquo;
            </p>
          )}
          {attribution && (
            <span className="font-mono text-[10.5px] tracking-wide text-slate">
              {attribution}
            </span>
          )}
        </div>
      )}
    </div>
  );
}