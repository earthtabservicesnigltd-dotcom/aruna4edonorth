"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Video, Loader2, Lock } from "lucide-react";

export default function LivePage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState<any>(null);
  const [liveSessions, setLiveSessions] = useState<any[]>([]);
  
  // Get today's day abbreviation (e.g., "Mon", "Tue")
  const todayString = new Date().toLocaleDateString('en-US', { weekday: 'short' });

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: stu } = await supabase.from("students").select("*").eq("email", user.email).single();
        if (stu) {
          setStudent(stu);
          
          // Fetch only live sessions for this cohort
          const { data: scheds } = await supabase
            .from("schedules")
            .select("*")
            .eq("programme_id", stu.programme_id)
            .eq("cohort", stu.cohort)
            .eq("is_live", true)
            .order("day_order", { ascending: true });
          
          setLiveSessions(scheds || []);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-orange" /></div>;
  }

  // Find today's session and upcoming sessions
  const todaySession = liveSessions.find(s => s.day_of_week === todayString);
  const upcomingSessions = liveSessions.filter(s => s.day_of_week !== todayString);

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">GOOGLE MEET</span>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Group days, capstone sessions, and graduation run live. Join links open here 10 minutes before start.
        </p>
      </div>

      {/* Today's Live Session Banner */}
      {todaySession ? (
        <div className="bg-white border border-orange/30 rounded-site p-5 flex items-center gap-4 flex-wrap shadow-sm">
          <div className="w-14 h-14 rounded-site bg-forest text-white flex flex-col items-center justify-center shrink-0">
            <strong className="font-display text-xl leading-none">{todaySession.day_of_week.toUpperCase()}</strong>
            <span className="font-mono text-[9px] mt-1">TODAY</span>
          </div>
          <div className="flex-1 min-w-[200px]">
            <h4 className="font-display font-semibold text-[16.5px] mb-1">{todaySession.title}</h4>
            <p className="text-[13px] text-slate">{student?.programme} · {todaySession.start_time} · Instructor-led</p>
          </div>
          
          {todaySession.meet_link ? (
            <a 
              href={todaySession.meet_link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-orange px-5 py-2.5 rounded-site font-semibold text-[14px] hover:bg-orange-dark transition-colors shrink-0"
            >
              Join Now <Video className="w-4 h-4" />
            </a>
          ) : (
            <span className="inline-flex items-center gap-2 px-4 py-2.5 border border-dashed border-ink/20 rounded-site font-mono text-[11px] text-slate shrink-0">
              <Lock className="w-3 h-3" /> Link opens 10 mins before
            </span>
          )}
        </div>
      ) : (
        <div className="bg-white border border-ink/10 rounded-site p-5 text-center text-slate text-[13.5px]">
          No live class scheduled for today. Check the upcoming sessions below.
        </div>
      )}

      {/* Upcoming Sessions List */}
      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="p-5 border-b border-ink/10">
          <h3 className="font-display font-semibold text-[18px]">Upcoming Sessions</h3>
        </div>
        <div className="p-5 space-y-4">
          {upcomingSessions.length === 0 ? (
            <p className="text-slate text-sm text-center py-4">No upcoming live sessions scheduled.</p>
          ) : (
            upcomingSessions.map((session) => (
              <div key={session.id} className="flex items-center gap-3 py-2 border-b border-ink/10 last:border-0">
                <span className="text-lg text-orange">🎥</span>
                <div className="flex-1">
                  <strong className="block text-[14px] text-ink">{session.title}</strong>
                  <span className="block text-[12px] text-slate">{session.day_of_week} · {session.start_time}</span>
                </div>
                <span className="font-mono text-[11px] text-slate">{session.day_of_week}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}