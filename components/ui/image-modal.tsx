"use client";

import { useEffect } from "react";
import Image from "next/image";
import { X, ZoomIn } from "lucide-react";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc?: string;
  caption?: string;
  alt?: string;
}

export function ImageModal({ isOpen, onClose, imageSrc, caption, alt }: ImageModalProps) {
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

  if (!isOpen || !imageSrc) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={caption || "Photo Viewer"}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-white/35 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-site overflow-hidden shadow-2xl border border-ink/15 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-paper border-b border-ink/10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] tracking-wider text-orange uppercase font-semibold">
              Photo Viewer
            </span>
            {caption && <span className="text-slate/40 text-xs">·</span>}
            {caption && (
              <h3 className="font-display font-semibold text-[15px] sm:text-[16px] text-ink truncate max-w-[400px]">
                {caption}
              </h3>
            )}
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-full text-slate hover:text-ink hover:bg-ink/6 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Image Display */}
        <div className="relative w-full aspect-[4/3] sm:aspect-[16/10] max-h-[72vh] bg-paper/40 overflow-hidden flex items-center justify-center">
          <Image
            src={imageSrc}
            alt={alt || caption || "Gallery photo"}
            fill
            priority
            sizes="(max-width: 1200px) 100vw, 1200px"
            className="object-contain"
          />
        </div>

        {/* Footer with Caption */}
        {caption && (
          <div className="px-5 py-3 bg-white border-t border-ink/8 flex items-center justify-between">
            <span className="font-display font-medium text-[14px] text-ink">
              {caption}
            </span>
            <span className="font-mono text-[10.5px] text-slate">
              {alt && alt !== caption ? alt : "Visits, Rallies & Meetings"}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
