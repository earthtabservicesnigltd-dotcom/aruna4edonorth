// components/sections/manifesto/manifesto-hero-section.tsx
"use client";

import { useEffect, useState } from "react";
import { delay } from "@/lib/animation";
import { Download, FileText } from "lucide-react";
import { createClient } from "@/lib/client";

export function ManifestoHeroSection() {
  const [fileUrl, setFileUrl] = useState("/uploads/manifesto.pdf");
  const [fileName, setFileName] = useState("Aruna-Abubakari-Manifesto.pdf");

  useEffect(() => {
    async function loadManifestoLink() {
      try {
        const supabase = createClient();
        const { data } = await supabase
          .from("documents")
          .select("*")
          .eq("id", "manifesto")
          .maybeSingle();

        if (data && data.file_url) {
          setFileUrl(data.file_url);
          setFileName(data.file_name || "Aruna-Abubakari-Manifesto.pdf");
        }
      } catch (err) {
        console.error("Error loading manifesto link:", err);
      }
    }

    loadManifestoLink();
  }, []);

  return (
    <section className="py-8 pb-14 bg-white border-b border-ink/8">
      <div className="max-w-site mx-auto px-8 grid lg:grid-cols-[1.1fr_0.9fr] gap-12 items-center">
        <div className="rise in">
          <h1 className="font-display font-semibold text-[clamp(36px,4.2vw,58px)] leading-tight text-ink tracking-tight">
            A New Direction <em className="text-forest not-italic">for Edo North</em>
          </h1>
          <p className="text-[17px] leading-relaxed text-slate max-w-[480px] mt-5">
            I present this manifesto as a solemn commitment to serve with integrity, accountability, and purpose. This is a promise of a new direction.
          </p>
          <a
            href={fileUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 bg-orange text-white px-7 py-3.5 rounded-site font-semibold text-[14.5px] mt-6 hover:bg-orange-dark shadow-sm transition-colors"
          >
            <FileText className="w-4 h-4" /> Download Full Manifesto (PDF)
          </a>
        </div>

        <div className="bg-ink text-white rounded-site p-9 rise in" style={delay(160)}>
          <span className="font-mono text-[11px] tracking-widest text-orange block mb-4">SIX PILLARS</span>
          <ol className="space-y-0">
            {[
              "Youth Empowerment & Job Creation",
              "Education & Human Capital Development",
              "Infrastructure & Rural Development",
              "Agriculture & Economic Empowerment",
              "Security & Community Safety",
              "Accountability & Representation",
            ].map((item, i) => (
              <li key={item} className="flex gap-3.5 items-baseline py-3 border-b border-white/14 last:border-0 text-[14.5px] text-white/85">
                <span className="font-mono text-xs text-orange shrink-0">{String(i + 1).padStart(2, "0")}</span>
                {item}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
