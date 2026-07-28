"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import Link from "next/link";
import { Users, DollarSign, Mail, Newspaper } from "lucide-react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    volunteers: 0,
    activeVolunteers: 0,
    donations: 0,
    donationTotal: 0,
    unreadMessages: 0,
    publishedPosts: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const supabase = createClient();

      const { count: volunteers } = await supabase
        .from("volunteers").select("*", { count: "exact", head: true });

      const { count: activeVol } = await supabase
        .from("volunteers").select("*", { count: "exact", head: true })
        .eq("status", "Active");

      const { data: donations } = await supabase
        .from("donations").select("amount, status");

      const { count: unread } = await supabase
        .from("messages").select("*", { count: "exact", head: true })
        .eq("read", false);

      const { count: published } = await supabase
        .from("posts").select("*", { count: "exact", head: true })
        .eq("status", "Published");

      const total = donations
        ?.filter((d) => d.status === "Received")
        .reduce((sum, d) => sum + Number(d.amount), 0) || 0;

      setStats({
        volunteers: volunteers || 0,
        activeVolunteers: activeVol || 0,
        donations: donations?.length || 0,
        donationTotal: total,
        unreadMessages: unread || 0,
        publishedPosts: published || 0,
      });
    }
    loadStats();
  }, []);

  const cards = [
    {
      label: "Volunteers",
      value: stats.volunteers,
      sub: `${stats.activeVolunteers} active`,
      icon: Users,
      href: "/admin/volunteers",
      color: "orange",
    },
    {
      label: "Donations Received",
      value: `₦${stats.donationTotal.toLocaleString()}`,
      sub: `${stats.donations} total records`,
      icon: DollarSign,
      href: "/admin/donations",
      color: "orange",
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      sub: "in inbox",
      icon: Mail,
      href: "/admin/messages",
      color: "orange",
    },
    {
      label: "Published Posts",
      value: stats.publishedPosts,
      sub: "live on site",
      icon: Newspaper,
      href: "/admin/posts",
      color: "orange",
    },
  ];

  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
          Overview
        </span>
        <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
          Dashboard
        </h1>
        <p className="text-[13.5px] text-slate mt-1">
          Campaign accountability metrics at a glance.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="bg-white border border-ink/10 rounded-site p-4.5 border-t-[3px] border-orange hover:shadow-md transition-shadow"
            >
              <div className="w-[34px] h-[34px] rounded bg-orange/10 text-orange flex items-center justify-center mb-3">
                <Icon className="w-4 h-4" />
              </div>
              <div className="font-mono text-[10px] tracking-wide uppercase text-slate font-semibold">
                {card.label}
              </div>
              <div className="font-display font-semibold text-[25px] text-ink mt-1.5">
                {card.value}
              </div>
              <div className="text-[11px] text-emerald font-semibold mt-1">
                {card.sub}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
