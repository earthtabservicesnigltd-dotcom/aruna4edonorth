// components/sections/manifesto/manifesto-cta-section.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { delay } from "@/lib/animation";
import { createClient } from "@/lib/client";
import { FileText } from "lucide-react";

export function ManifestoCtaSection() {
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
    <section className="py-22 text-center bg-paper/40 border-t border-ink/8">
      <div className="max-w-site mx-auto px-8">
        <h2 className="font-display font-semibold text-[clamp(28px,3.4vw,42px)] text-ink max-w-[720px] mx-auto mb-4 leading-tight rise in">
          Together, We Can Build <span className="text-forest italic">a New Edo North</span>
        </h2>
        <p className="text-base text-slate max-w-[560px] mx-auto mb-8 leading-relaxed rise in" style={delay(100)}>
          Edo North deserves leadership that understands its people and fights for its progress. This is our mission.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap rise in" style={delay(200)}>
          <a
            href={fileUrl}
            download={fileName}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-orange text-white px-7 py-3.5 rounded-site font-semibold text-[14px] hover:bg-orange-dark shadow-sm transition-colors"
          >
            <FileText className="w-4 h-4" /> Download Full Manifesto (PDF)
          </a>
          <Link
            href="/donate"
            className="inline-flex items-center gap-2 border border-ink/20 text-ink px-7 py-3.5 rounded-site font-semibold text-[14px] hover:border-orange hover:text-orange transition-colors"
          >
            Support the Campaign
          </Link>
        </div>
        <p className="mt-8 text-sm text-slate rise in" style={delay(280)}>
          <strong className="font-display text-[17px] text-ink">Abubakar Aruna</strong><br />
          ADC – Edo North Senatorial Candidate<br />
          <em className="text-orange">&ldquo;People First. Progress Always.&rdquo;</em>
        </p>
      </div>
    </section>
  );
}
