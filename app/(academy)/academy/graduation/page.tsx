"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2 } from "lucide-react";

export default function GraduationPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [runOfShow, setRunOfShow] = useState<any[]>([]);
  const [cohortName, setCohortName] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: stu } = await supabase.from("students").select("programme_id, cohort").eq("email", user.email).single();
        if (stu) {
          setCohortName(stu.cohort || "Cohort");
          // Fetch only Saturday schedule items
          const { data: satSched } = await supabase
            .from("schedules")
            .select("*")
            .eq("programme_id", stu.programme_id)
            .eq("cohort", stu.cohort)
            .eq("day_of_week", "Sat")
            .order("created_at", { ascending: true });
          
          setRunOfShow(satSched || []);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange" /></div>;
  }

  // Hardcoded awards (standard across cohorts)
  const awards = [
    "Best Capstone Project",
    "Most Innovative Solution",
    "Best Team Collaboration",
    "Best Project Presentation",
    "Outstanding Participant"
  ];

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">SATURDAY · {cohortName.toUpperCase()}</span>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          The week closes with live capstone presentations, facilitator feedback, and recognition of top performers before certificates are awarded.
        </p>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="p-5 border-b border-ink/10 flex items-center justify-between">
          <h3 className="font-display font-semibold text-[14px] md:text-[18px] whitespace-nowrap">Ceremony Run of Show</h3>
          <span className="font-mono text-[10.5px] uppercase tracking-wide bg-orange/12 text-orange-dark px-2.5 py-1 rounded-site">Sat 4:00 PM</span>
        </div>
        <div className="p-5 space-y-3">
          {runOfShow.length === 0 ? (
            <p className="text-slate text-sm text-center py-4">Graduation schedule has not been published yet.</p>
          ) : (
            runOfShow.map((item, i) => (
              <div key={item.id} className="flex gap-3 items-start text-[14px] text-ink">
                <span className="text-orange mt-1">●</span> 
                <div>
                  <span>{item.title}</span>
                  <span className="font-mono text-[10px] text-slate block">{item.start_time}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="p-5 border-b border-ink/10"><h3 className="font-display font-semibold text-[14px] md:text-[18px]">Weekly Awards</h3></div>
        <div className="p-5 grid md:grid-cols-2 gap-3">
          {awards.map((award, i) => (
            <div key={i} className="flex gap-3 items-center text-[14px] text-ink py-2 border-b border-ink/5 last:border-0">
              <span className="text-lg">🏆</span> {award}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}