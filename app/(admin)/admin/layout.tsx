"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/client";
import {
  LayoutDashboard,
  Users,
  DollarSign,
  Mail,
  Newspaper,
  LogOut,
  Menu,
  GraduationCap,
  BookOpen,
  CalendarDays,
  ClipboardList,
  Link2,
  Bell,
  Video,
  MessageSquareQuote,
  Images,
  FileText,
} from "lucide-react";

const CAMPAIGN_NAV = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users },
  { label: "Donations", href: "/admin/donations", icon: DollarSign },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "News & Updates", href: "/admin/posts", icon: Newspaper },
  { label: "Campaign Events", href: "/admin/events", icon: CalendarDays },
  { label: "Media & Videos", href: "/admin/media", icon: Video },
  { label: "People Speak", href: "/admin/voxpop", icon: MessageSquareQuote },
  { label: "Visits & Photos", href: "/admin/gallery", icon: Images },
  { label: "Manifesto (PDF)", href: "/admin/manifesto", icon: FileText },
];

const ACADEMY_NAV = [
  { label: "Academy Home", href: "/admin/academy", icon: GraduationCap },
  { label: "Students", href: "/admin/academy/students", icon: Users },
  { label: "Courses", href: "/admin/academy/courses", icon: BookOpen },
  { label: "Schedules", href: "/admin/academy/schedules", icon: CalendarDays },  
  { label: "Assignments", href: "/admin/academy/assignments", icon: ClipboardList },
  { label: "Cohort Links", href: "/admin/academy/links", icon: Link2 },
  { label: "Notifications", href: "/admin/academy/notifications", icon: Bell }, 
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [clock, setClock] = useState("");

  const isLoginPage = pathname === "/admin/login";

  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString("en-GB", {
      weekday: "short", hour: "2-digit", minute: "2-digit",
      day: "2-digit", month: "short", year: "numeric",
    }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    let isMounted = true;
    const supabase = createClient();

    async function checkAdmin(currentSession: any) {
      if (!currentSession) {
        if (isMounted) {
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
          router.push("/admin/login");
        }
        return;
      }

      try {
        const { data: admin, error } = await supabase
          .from("admin_users")
          .select("email")
          .eq("email", currentSession.user?.email)
          .maybeSingle();

        if (!isMounted) return;

        if (error || !admin) {
          try {
            await supabase.auth.signOut();
          } catch {}
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
          router.push("/admin/login");
          return;
        }

        setSession(currentSession);
        setIsAdmin(true);
        setLoading(false);
      } catch (err) {
        console.error("Auth check error:", err);
        if (isMounted) setLoading(false);
      }
    }

    // Initial check
    supabase.auth.getSession().then(({ data: { session } }) => {
      checkAdmin(session);
    }).catch(() => {
      if (isMounted) setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_OUT" || !session) {
        if (isMounted) {
          setSession(null);
          setIsAdmin(false);
          setLoading(false);
          router.push("/admin/login");
        }
        return;
      }

      if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        checkAdmin(session);
      }
    });

    return () => {
      isMounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, [isLoginPage]);

  async function handleSignOut() {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
    } catch {}
    router.push("/admin/login");
  }

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper -mt-[72px]">
        <div className="w-12 h-12 rounded-full border-2 border-ink border-t-orange animate-spin" />
      </div>
    );
  }

  if (!session || !isAdmin) return null;

  const renderNavItems = (items: any[]) => {
    return items.map((item) => {
      const Icon = item.icon;
      const active = pathname === item.href;
      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => setSidebarOpen(false)}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-site text-[13.5px] font-medium transition-all ${
            active
              ? "bg-orange text-white"
              : "text-white/78 hover:bg-white/6 hover:text-white hover:pl-4"
          }`}
        >
          <Icon className="w-[16px] h-[16px]" />
          {item.label}
        </Link>
      );
    });
  };

  return (
    <div className="min-h-screen flex -mt-[72px]">
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 w-[250px] h-screen bg-ink text-white flex flex-col transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/12">
          <div className="w-[38px] h-[38px] rounded-full bg-ink border-2 border-orange flex items-center justify-center font-display font-semibold text-[13.5px] relative flex-shrink-0">
            AA
            <span className="absolute inset-[3px] border border-dashed border-white/35 rounded-full" />
          </div>
          <div>
            <div className="font-display font-semibold text-[14px]">Abubakari Admin</div>
            <div className="font-mono text-[9.5px] tracking-wide uppercase text-orange">Campaign + Institute</div>
          </div>
        </div>
        
        <nav className="flex-1 py-3 px-3 space-y-0.5 overflow-y-auto">
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 px-3 py-2">Campaign</p>
          {renderNavItems(CAMPAIGN_NAV)}
          
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 px-3 pt-4 pb-2">Academy</p>
          {renderNavItems(ACADEMY_NAV)}
        </nav>
        
        <div className="px-4 py-4 border-t border-white/12">
          <div className="flex items-center gap-3">
            <div className="w-[38px] h-[38px] rounded-full bg-forest flex items-center justify-center font-display text-[14.5px] flex-shrink-0">
              {session.user?.email?.[0]?.toUpperCase() || "A"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">
                {session.user?.email?.split("@")[0] || "Admin"}
              </div>
              <div className="font-mono text-[9.5px] text-white/50 tracking-wide">ADMIN</div>
            </div>
            <button onClick={handleSignOut} className="text-white/55 hover:text-orange transition-colors">
              <LogOut className="w-[16px] h-[16px]" />
            </button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="sticky top-0 z-30 bg-white border-b border-ink/10 px-6 lg:px-8 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-ink text-[21px]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h2 className="font-display font-semibold text-[18px] text-ink">Admin Dashboard</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-[12px] font-semibold text-ink">{session.user?.email || "Admin"}</div>
              <div className="font-mono text-[10px] text-slate">{clock}</div>
            </div>
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3.5 py-2 border border-ink/10 rounded-site bg-paper text-[13px] font-semibold text-ink hover:border-orange hover:text-orange transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}