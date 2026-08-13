"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Calendar, FileText, Video, BadgeCheck, MessageCircle, Award, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";

const menuItems = [
  { href: "/academy", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/academy/courses", icon: BookOpen, label: "My Courses" },
  { href: "/academy/schedule", icon: Calendar, label: "Schedule" },
  { href: "/academy/assignments", icon: FileText, label: "Assignments" },
  { href: "/academy/live", icon: Video, label: "Live Classes" },
];

const communityItems = [
  { href: "/academy/certificates", icon: BadgeCheck, label: "Certificates" },
  { href: "/academy/discussions", icon: MessageCircle, label: "Discussions" },
  { href: "/academy/graduation", icon: Award, label: "Graduation" },
  { href: "/academy/profile", icon: User, label: "Profile" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ open, onClose }: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [student, setStudent] = useState<any>(null);
  const [badges, setBadges] = useState<Record<string, number>>({});

  useEffect(() => {
    async function loadProfileAndBadges() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: stu } = await supabase
        .from("students")
        .select("id, name, cohort, programme_id")
        .eq("email", user.email)
        .single();
        
      if (stu) setStudent(stu);

      if (stu) {
        // --- 1. MY COURSES BADGE ---
        // Counts ONLY 'unlocked' courses. If a programme is completed, 
        // there are 0 unlocked courses, so the badge disappears.
        const { count: activeCourses } = await supabase
          .from("student_progress")
          .select("*", { count: "exact", head: true })
          .eq("student_id", stu.id)
          .eq("status", "unlocked");
          
        // --- 2. ASSIGNMENTS BADGE ---
        // Counts assignments for their cohort minus what they've submitted.
        const { data: allAssignments } = await supabase
          .from("assignments")
          .select("id")
          .eq("programme_id", stu.programme_id)
          .eq("cohort", stu.cohort);
          
        const { data: submissions } = await supabase
          .from("assignment_submissions")
          .select("assignment_id")
          .eq("student_id", stu.id);
          
        const submittedIds = new Set(submissions?.map(s => s.assignment_id) || []);
        const pendingAssignments = (allAssignments || []).filter(a => !submittedIds.has(a.id)).length;

        // --- 3. SCHEDULE & LIVE CLASSES BADGE (Smart Notification) ---
        // Checks if there are ANY live classes scheduled for their cohort.
        const { data: liveSchedules } = await supabase
          .from("schedules")
          .select("id, created_at")
          .eq("cohort", stu.cohort)
          .eq("is_live", true);

        // To make it act like a notification, we check local storage to see 
        // when they last visited the schedule page. If there are live classes 
        // created AFTER their last visit, we show a badge.
        let newScheduleCount = 0;
        const lastVisitStr = localStorage.getItem("lastScheduleVisit");
        const lastVisit = lastVisitStr ? new Date(lastVisitStr) : new Date(0);
        
        if (liveSchedules) {
          newScheduleCount = liveSchedules.filter(s => new Date(s.created_at) > lastVisit).length;
        }

        // --- 4. CERTIFICATES BADGE ---
        const { count: certCount } = await supabase
          .from("certificates")
          .select("*", { count: "exact", head: true })
          .eq("student_id", stu.id)
          .eq("status", "Issued");

        setBadges({
          "/academy/courses": activeCourses || 0,
          "/academy/assignments": pendingAssignments || 0,
          "/academy/schedule": newScheduleCount || 0,
          "/academy/live": newScheduleCount || 0, // Links live classes to the same schedule update
          "/academy/certificates": certCount || 0,
        });
      }
    }
    loadProfileAndBadges();
  }, [pathname]);

  // When user clicks the Schedule or Live Classes link, update the local storage timestamp
  function handleNavClick(href: string) {
    if (href === "/academy/schedule" || href === "/academy/live") {
      localStorage.setItem("lastScheduleVisit", new Date().toISOString());
    }
    onClose();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login-signup");
  }

  const initials = student?.name 
    ? student.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() 
    : "ST";

  const renderNavItems = (items: any[]) => {
    return items.map((item) => {
      const Icon = item.icon;
      const active = pathname === item.href || (item.href !== "/academy" && pathname.startsWith(item.href));
      const badgeCount = badges[item.href];
      
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => handleNavClick(item.href)}
          className={cn(
            "flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-site text-[14.5px] transition-all",
            active ? "bg-orange text-white" : "text-white/78 hover:bg-white/5 hover:text-white hover:pl-4"
          )}
        >
          <Icon className="w-[18px] h-[18px] shrink-0" />
          <span className="flex-1">{item.label}</span>
          
          {/* Dynamic Smart Badges */}
          {badgeCount && badgeCount > 0 ? (
            <span className="font-mono text-[10px] bg-orange/20 text-orange px-1.5 py-0.5 rounded-full border border-orange/30">
              {badgeCount}
            </span>
          ) : null}
        </Link>
      );
    });
  };

  return (
    <aside className={cn(
      "w-[268px] bg-ink text-white flex flex-col shrink-0 fixed lg:sticky top-0 h-screen z-50 lg:z-auto transition-transform duration-500",
      open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
    )}>
      <div className="flex flex-col items-center justify-center py-5 border-b border-white/10">
        <Image src="/images/36.png" alt="Institute" width={50} height={50} />
        <div>
          <div className="font-display font-semibold text-base">Abubakari Aruna Institute</div>
          <div className="font-mono text-[9.5px] tracking-widest uppercase text-amber-400">Online Skills & Leadership</div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-0.5 overflow-y-auto">
        <span className="font-mono text-[10px] tracking-widest uppercase text-white/40 block px-3 pb-2 pt-4">Menu</span>
        {renderNavItems(menuItems)}
        
        <span className="font-mono text-[10px] tracking-widest uppercase text-white/40 block px-3 pb-2 pt-6">Community</span>
        {renderNavItems(communityItems)}
      </nav>

      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-forest flex items-center justify-center font-display text-base shrink-0">
            {initials}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[13.5px] font-semibold truncate">{student?.name || "Student"}</div>
            <div className="font-mono text-[10px] text-white/50">{student?.cohort || "COHORT · WK 28"}</div>
          </div>
          <button onClick={handleSignOut} className="text-white/50 hover:text-orange transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}