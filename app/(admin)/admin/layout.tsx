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
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Volunteers", href: "/admin/volunteers", icon: Users },
  { label: "Donations", href: "/admin/donations", icon: DollarSign },
  { label: "Messages", href: "/admin/messages", icon: Mail },
  { label: "News & Events", href: "/admin/posts", icon: Newspaper },
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

  // Clock tick
  useEffect(() => {
    const tick = () => setClock(new Date().toLocaleString("en-GB", {
      weekday: "short", hour: "2-digit", minute: "2-digit",
      day: "2-digit", month: "short", year: "numeric",
    }));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Auth check
  useEffect(() => {
    if (isLoginPage) {
      setLoading(false);
      return;
    }

    const supabase = createClient();
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) {
        router.push("/admin/login");
        setLoading(false);
        return;
      }

      console.log("Session user email:", session.user.email);
      console.log("Session user metadata:", session.user.app_metadata, session.user.user_metadata);


      // Check admin_users table
      const { data: admin, error } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", session.user.email)
        .maybeSingle();

       console.log("Admin check result:", admin, error); 

      if (!admin) {
        await supabase.auth.signOut();
        router.push("/admin/login");
        setLoading(false);
        return;
      }

      setSession(session);
      setIsAdmin(true);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!session) {
        router.push("/admin/login");
        return;
      }
      const { data: admin } = await supabase
        .from("admin_users")
        .select("email")
        .eq("email", session.user.email)
        .maybeSingle();
      if (!admin) {
        await supabase.auth.signOut();
        router.push("/admin/login");
        return;
      }
      setSession(session);
      setIsAdmin(true);
    });

    return () => listener?.subscription.unsubscribe();
  }, [isLoginPage]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
  }

  if (isLoginPage) return <>{children}</>;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-paper">
        <div className="w-12 h-12 rounded-full border-2 border-ink border-t-orange animate-spin" />
      </div>
    );
  }

  if (!session || !isAdmin) return null;

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
        <nav className="flex-1 py-3 px-3 space-y-0.5">
          <p className="font-mono text-[10px] tracking-widest uppercase text-white/40 px-3 py-2">Campaign</p>
          {NAV_ITEMS.map((item) => {
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
          })}
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
