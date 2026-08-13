"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LayoutDashboard, BookOpen, Calendar, FileText, Video, BadgeCheck, MessageCircle, Award, User, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/client";

const navItems = [
  { href: "/academy", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/academy/courses", icon: BookOpen, label: "My Courses" },
  { href: "/academy/schedule", icon: Calendar, label: "Schedule" },
  { href: "/academy/assignments", icon: FileText, label: "Assignments" },
  { href: "/academy/live", icon: Video, label: "Live Classes" },
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
  const [badges, setBadges] = useState<Record<string, number>>({}); // State for dynamic badges

  useEffect(() => {
    async function loadProfileAndBadges() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // 1. Get Student Profile
      const { data: stu } = await supabase
        .from("students")
        .select("id, name, cohort, programme_id")
        .eq("email", user.email)
        .single();
        
      if (stu) setStudent(stu);

      // 2. Calculate Badges
      if (stu && stu.programme_id) {
        // A. Courses Badge (Count of 'unlocked' courses)
        const { count: activeCourses } = await supabase
          .from("student_progress")
          .select("*", { count: "exact", head: true })
          .eq("student_id", stu.id)
          .eq("status", "unlocked");
          
        // B. Certificates Badge (Count of issued certificates)
        const { count: certCount } = await supabase
          .from("certificates")
          .select("*", { count: "exact", head: true })
          .eq("student_id", stu.id)
          .eq("status", "Issued");

        // C. Assignments Badge (Total assignments for cohort - submitted assignments)
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

        setBadges({
          "/academy/courses": activeCourses || 0,
          "/academy/assignments": pendingAssignments || 0,
          "/academy/certificates": certCount || 0,
        });
      }
    }
    loadProfileAndBadges();
  }, [pathname]); // Refetch when path changes to update badges if they complete something

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login-signup");
  }

  const initials = student?.name 
    ? student.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() 
    : "ST";

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
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = pathname === item.href || (item.href !== "/academy" && pathname.startsWith(item.href));
          const badgeCount = badges[item.href];
          
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={cn(
                "flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-site text-[14.5px] transition-all",
                active ? "bg-orange text-white" : "text-white/78 hover:bg-white/5 hover:text-white hover:pl-4"
              )}
            >
              <Icon className="w-[18px] h-[18px] shrink-0" />
              <span className="flex-1">{item.label}</span>
              
              {/* Only show the orange number badge if > 0. No green dots. */}
              {badgeCount && badgeCount > 0 ? (
                <span className="font-mono text-[10px] bg-orange/20 text-orange px-1.5 py-0.5 rounded-full border border-orange/30">
                  {badgeCount}
                </span>
              ) : null}
            </Link>
          );
        })}
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