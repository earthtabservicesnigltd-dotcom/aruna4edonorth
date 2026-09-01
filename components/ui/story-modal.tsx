"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, Calendar, Tag } from "lucide-react";

interface StoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  category?: string;
  date?: string;
  excerpt?: string;
  image_url?: string;
}

export function StoryModal({
  isOpen,
  onClose,
  title,
  category,
  date,
  excerpt,
  image_url,
}: StoryModalProps) {
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !title) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-white/35 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white rounded-site overflow-hidden shadow-2xl border border-ink/15 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-paper border-b border-ink/10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-wider text-orange uppercase font-semibold">
              {category || "News & Updates"}
            </span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close story"
            className="p-1.5 rounded-full text-slate hover:text-ink hover:bg-ink/8 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-5">
          {image_url && (
            <div className="relative aspect-[16/9] w-full rounded-site overflow-hidden bg-paper border border-ink/8">
              <Image
                src={image_url}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 700px"
                className="object-cover"
              />
            </div>
          )}

          <div className="flex items-center gap-4 text-slate text-xs font-mono">
            {date && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-orange" /> {date}
              </span>
            )}
            {category && (
              <span className="flex items-center gap-1">
                <Tag className="w-3.5 h-3.5 text-orange" /> {category}
              </span>
            )}
          </div>

          <h2 className="font-display font-semibold text-[24px] sm:text-[28px] leading-tight text-ink">
            {title}
          </h2>

          <div className="text-[15px] sm:text-[16px] leading-relaxed text-slate space-y-4">
            <p>{excerpt}</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-paper/60 border-t border-ink/8 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-ink text-white rounded-site font-semibold text-[13px] hover:bg-orange transition-colors"
          >
            Close Story
          </button>
        </div>
      </div>
    </div>
  );
}
