"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Bell, LogOut } from "lucide-react";
import { createClient } from "@/lib/client";

const titles: Record<string, string> = {
  "/academy": "Dashboard",
  "/academy/courses": "My Courses",
  "/academy/schedule": "Schedule",
  "/academy/assignments": "Assignments",
  "/academy/live": "Live Classes",
  "/academy/certificates": "Certificates",
  "/academy/discussions": "Discussions",
  "/academy/graduation": "Graduation",
  "/academy/profile": "My Profile",
};

interface Props {
  onToggleSidebar: () => void;
}

export function DashboardTopbar({ onToggleSidebar }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

  const title = titles[pathname] || "Dashboard";

  useEffect(() => {
    async function fetchNotifs() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Get student's programme ID
        const { data: stu } = await supabase
          .from("students")
          .select("programme_id")
          .eq("email", user.email)
          .single();
          
        // 2. Fetch all Sent notifications
        const { data: notifData } = await supabase
          .from("notifications")
          .select("*")
          .eq("status", "Sent")
          .order("created_at", { ascending: false });
          
        if (notifData) {
          // 3. Filter for "All Students" or their specific programme
          const filtered = notifData.filter(n => 
            n.audience === "All Students" || n.audience === stu?.programme_id
          );
          setNotifs(filtered);
        }
      }
    }
    fetchNotifs();
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login-signup");
  }

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-ink/10 px-6 md:px-8 py-4 flex items-center gap-5">
      <button onClick={onToggleSidebar} className="lg:hidden text-ink hover:text-orange transition-colors">
        <Menu className="w-5 h-5" />
      </button>

      <div className="flex-1 min-w-0">
        <h1 className="font-display font-semibold text-lg md:text-xl truncate">{title}</h1>
      </div>

      <div className="relative" ref={notifRef}>
        <button 
          onClick={() => setNotifOpen(!notifOpen)} 
          className="relative w-10 h-10 rounded-site border border-ink/10 flex items-center justify-center text-ink hover:border-orange hover:text-orange transition-colors shrink-0"
          aria-label="Notifications"
        >
          <Bell className="w-[17px] h-[17px]" />
          {notifs.length > 0 && (
            <span className="absolute top-2 right-2.5 w-1.5 h-1.5 rounded-full bg-orange border border-white" />
          )}
        </button>

        {notifOpen && (
          <div className="absolute top-full right-0 mt-3 w-[340px] max-w-[90vw] bg-white border border-ink/10 shadow-xl rounded-site z-50 overflow-hidden">
            <div className="flex justify-between items-center p-4 border-b border-ink/10">
              <h4 className="font-semibold text-[14.5px]">Notifications</h4>
              <button className="text-[12px] text-orange hover:underline">Mark all read</button>
            </div>
            <div className="max-h-[340px] overflow-y-auto">
              {notifs.length === 0 ? (
                <div className="p-6 text-center text-slate text-sm">You're all caught up! No new notifications.</div>
              ) : (
                notifs.map(n => (
                  <div key={n.id} className="flex gap-3 p-4 border-b border-ink/10 hover:bg-paper transition-colors">
                    <span className="w-8 h-8 rounded-full bg-orange/10 text-orange flex items-center justify-center shrink-0 text-sm">🔔</span>
                    <div>
                      <span className="block text-[13.5px] font-semibold text-ink">{n.title}</span>
                      <span className="block text-[12.5px] text-slate">{n.message}</span>
                      <span className="block text-[11px] text-slate/70 mt-1">{new Date(n.created_at).toLocaleString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <button 
        onClick={handleSignOut}
        className="hidden sm:inline-flex items-center gap-2 px-4 py-2 border border-ink/10 rounded-site bg-paper text-sm font-semibold text-ink hover:border-orange hover:text-orange transition-colors shrink-0"
      >
        <LogOut className="w-4 h-4" /> Sign Out
      </button>
    </header>
  );
}