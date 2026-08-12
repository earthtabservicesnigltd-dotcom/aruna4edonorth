"use client";

import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react"; // Added icons for the hamburger menu

interface LessonContentProps {
  html: string;
  title: string;
}

export function LessonContent({ html, title }: LessonContentProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string }[]>([]);
  const [activeId, setActiveId] = useState("");
  const [isTocOpen, setIsTocOpen] = useState(false); // State for mobile drawer

  useEffect(() => {
    if (!html) return;
    
    // Extract h2 tags for the Table of Contents
    const matches = [...html.matchAll(/<h2 id="([^"]+)">(.*?)<\/h2>/g)];
    const extracted = matches.map(m => ({ 
      id: m[1], 
      text: m[2].replace(/<[^>]+>/g, '') // Strip any inner HTML tags from the text
    }));
    
    setHeadings(extracted);
    if (extracted.length > 0) setActiveId(extracted[0].id);
  }, [html]);

  useEffect(() => {
    if (!headings.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible.length > 0 && visible[0].target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-10% 0px -60% 0px",
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    headings.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [headings]);

  function scrollToHeading(id: string) {
    setActiveId(id);
    setIsTocOpen(false); // Close the mobile drawer when a link is clicked

    const target = document.getElementById(id);
    if (!target) return;

    const offset = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top: offset, behavior: "smooth" });
  }

  return (
    <div className="max-w-5xl mx-auto flex gap-8 items-start relative">
      {/* Desktop Table of Contents Sidebar */}
      {headings.length > 0 && (
        <aside className="hidden lg:block w-56 shrink-0 sticky top-8 self-start">
          <nav className="bg-white border border-ink/10 rounded-site p-4 max-h-[calc(100vh-6rem)] overflow-y-auto">
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest text-slate mb-3">
              On This Page
            </p>
            <div className="flex flex-col gap-1 pr-2">
              {headings.map(h => {
                const isActive = activeId === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => scrollToHeading(h.id)}
                    className={[
                      'text-left text-[12px] leading-snug transition-all duration-200 rounded-site px-2 py-1.5 w-full cursor-pointer',
                      isActive
                        ? 'text-orange font-semibold bg-orange/10 border-l-2 border-orange pl-3'
                        : 'text-slate hover:text-orange hover:bg-paper border-l-2 border-transparent',
                    ].join(' ')}
                  >
                    {h.text}
                  </button>
                )
              })}
            </div>
          </nav>
        </aside>
      )}

      {/* Main Lesson Content Area */}
      <div className="flex-1 min-w-0 bg-white border border-ink/10 rounded-site p-7 pb-24 lg:pb-7">
        <h1 className="font-display font-semibold text-[24px] text-ink mb-6">{title}</h1>
        
        <div 
          className="text-[15px] text-slate leading-[1.7] max-w-none
                     [&>h2]:font-display [&>h2]:font-semibold [&>h2]:text-[22px] [&>h2]:text-ink [&>h2]:mt-10 [&>h2]:mb-4 [&>h2]:pb-2 [&>h2]:border-b [&>h2]:border-ink/10 [&>h2]:scroll-mt-24
                     [&>h3]:font-display [&>h3]:font-semibold [&>h3]:text-[18px] [&>h3]:text-ink [&>h3]:mt-8 [&>h3]:mb-3
                     [&>p]:mb-4
                     [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:mb-4 [&>ul]:space-y-2
                     [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:mb-4 [&>ol]:space-y-2
                     [&>strong]:font-semibold [&>strong]:text-ink
                     [&>li]:text-slate"
          dangerouslySetInnerHTML={{ __html: html || "<p>Lesson content coming soon.</p>" }} 
        />
      </div>

      {/* Mobile Floating Hamburger Button */}
      {headings.length > 0 && (
        <button 
          onClick={() => setIsTocOpen(true)}
          className="lg:hidden fixed bottom-6 right-6 z-40 bg-orange text-white p-4 rounded-full shadow-lg flex items-center gap-2 hover:bg-orange-dark transition-colors"
          aria-label="Open Table of Contents"
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Slide-out Drawer */}
      {isTocOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsTocOpen(false)}
          />
          
          {/* Drawer Panel */}
          <aside className="relative w-80 max-w-[80vw] bg-white h-full p-6 overflow-y-auto shadow-xl flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <p className="font-mono text-[11px] font-bold uppercase tracking-widest text-slate">
                On This Page
              </p>
              <button 
                onClick={() => setIsTocOpen(false)} 
                className="text-slate hover:text-ink p-1"
                aria-label="Close Table of Contents"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="flex flex-col gap-1">
              {headings.map(h => {
                const isActive = activeId === h.id;
                return (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => scrollToHeading(h.id)}
                    className={[
                      'text-left text-[14px] leading-snug transition-all duration-200 rounded-site px-3 py-2.5 w-full cursor-pointer',
                      isActive
                        ? 'text-orange font-semibold bg-orange/10 border-l-2 border-orange pl-4'
                        : 'text-slate hover:text-orange hover:bg-paper border-l-2 border-transparent',
                    ].join(' ')}
                  >
                    {h.text}
                  </button>
                )
              })}
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}