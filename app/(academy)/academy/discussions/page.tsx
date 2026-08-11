"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2 } from "lucide-react";

export default function DiscussionsPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [links, setLinks] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: student } = await supabase
          .from("students")
          .select("programme_id, cohort")
          .eq("email", user.email)
          .single();

        if (student) {
          const { data: linkData } = await supabase
            .from("cohort_links")
            .select("*")
            .eq("programme_id", student.programme_id)
            .eq("cohort", student.cohort)
            .order("created_at", { ascending: true });
          
          setLinks(linkData || []);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">PEER LEARNING</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Discussions & Comms</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Connect with your cohort, coordinate capstone projects, and ask questions during instructor office hours.
        </p>
      </div>

      {links.length === 0 ? (
        <div className="bg-white border border-ink/10 rounded-site p-8 text-center">
          <p className="text-slate text-sm">No communication links have been added for your cohort yet. Please check back later.</p>
        </div>
      ) : (
        <div className="bg-white border border-ink/10 rounded-site p-5 space-y-4">
          {links.map((c) => (
            <div key={c.id} className="flex items-center gap-3 py-3 border-b border-ink/10 last:border-0">
              <span className="text-lg">{c.icon || '💬'}</span>
              <div className="flex-1">
                <strong className="block text-[14px] text-ink">{c.title}</strong>
                <span className="block text-[12px] text-slate">{c.description}</span>
              </div>
              <a 
                href={c.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="font-mono text-[11px] bg-orange/10 text-orange-dark px-3 py-1.5 rounded-site hover:bg-orange hover:text-white transition-colors"
              >
                Open Link
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}