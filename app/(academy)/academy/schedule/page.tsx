"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2 } from "lucide-react";

export default function SchedulePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [scheduleData, setScheduleData] = useState<any[]>([]);
  const [cohortName, setCohortName] = useState("");

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        // 1. Get Student Profile
        const { data: student } = await supabase
          .from("students")
          .select("programme_id, cohort")
          .eq("email", user.email)
          .single();

        if (student) {
          setCohortName(student.cohort || "Current Cohort");
          
          // 2. Fetch Schedule for their programme and cohort
          const { data: schedItems } = await supabase
            .from("schedules")
            .select("*")
            .eq("programme_id", student.programme_id)
            .eq("cohort", student.cohort)
            .order("day_order", { ascending: true });

          if (schedItems && schedItems.length > 0) {
            // 3. Group by day_of_week
            const daysOrder = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            const grouped = daysOrder.map(day => {
              const events = schedItems.filter(s => s.day_of_week === day);
              if (events.length === 0) return null;
              
              return {
                day,
                type: events[0].type,
                events: events.map(e => ({
                  time: e.start_time,
                  title: e.title,
                  live: e.is_live
                }))
              };
            }).filter(Boolean) as any[];
            
            setScheduleData(grouped);
          }
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  // Determine today's abbreviation (e.g., "Mon", "Tue")
  const todayString = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">
          {cohortName.toUpperCase()}
        </span>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Every cohort follows the same rhythm: learn, collaborate, practise, build, prove, then graduate. All classes run on Google Meet.
        </p>
      </div>

      {scheduleData.length === 0 ? (
        <div className="bg-white border border-ink/10 rounded-site p-8 text-center">
          <p className="text-slate text-sm">
            The schedule for your cohort has not been published yet. Please check back later.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-2 bg-ink/10 border border-ink/10 rounded-site overflow-hidden">
          {scheduleData.map((d) => {
            const isToday = d.day === todayString;
            
            return (
              <div key={d.day} className="bg-white flex flex-col">
                <div className={`p-4 text-center border-b border-ink/10 ${isToday ? 'bg-ink' : 'bg-paper'}`}>
                  <strong className={`block font-display font-semibold text-[15px] ${isToday ? 'text-white' : 'text-ink'}`}>
                    {d.day}
                  </strong>
                  <span className={`font-mono text-[9.5px] tracking-wide uppercase ${isToday ? 'text-orange' : 'text-slate'}`}>
                    {d.type}
                  </span>
                </div>
                <div className="p-4 flex-1 space-y-3">
                  {d.events.map((e: any, i: number) => (
                    <div key={i} className={`p-3 rounded-site ${e.live ? 'bg-orange/10' : 'bg-paper'}`}>
                      <div className="font-mono text-[10px] text-orange tracking-wide">{e.time}</div>
                      <div className="text-[12.5px] font-medium mt-1 leading-tight text-ink">{e.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}