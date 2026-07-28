"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Trash2, RefreshCw, Download, ExternalLink } from "lucide-react";
import Link from "next/link";

interface Volunteer {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  lga: string;
  skills: string[];
  photo_url: string | null;
  volunteer_id: string;
  status: string;
  created_at: string;
}

export default function AdminVolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVolunteers();
  }, []);

  async function loadVolunteers() {
    setLoading(true);
    const supabase = createClient();
    const { data } = await supabase
      .from("volunteers")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setVolunteers(data);
    setLoading(false);
  }

  async function updateStatus(id: string, status: string) {
    const supabase = createClient();
    await supabase.from("volunteers").update({ status }).eq("id", id);
    loadVolunteers();
  }

  async function deleteVolunteer(id: string) {
    if (!confirm("Remove this volunteer from the register?")) return;
    const supabase = createClient();
    await supabase.from("volunteers").delete().eq("id", id);
    loadVolunteers();
  }

  function statusChip(status: string) {
    const colors: Record<string, string> = {
      New: "bg-orange/12 text-orange-dark",
      Contacted: "bg-blue-soft text-blue",
      Active: "bg-emerald/10 text-emerald",
    };
    return colors[status] || "bg-line-soft text-slate";
  }

  return (
    <div>
      <div className="mb-5">
        <span className="font-mono text-[10.5px] tracking-widest uppercase text-orange block mb-1">
          Grassroots First
        </span>
        <h1 className="font-display font-semibold text-[clamp(21px,2.6vw,27px)]">
          Volunteer Register
        </h1>
        <p className="text-[13.5px] text-slate mt-1">
          Ward teams, town-hall staffing, and polling-day logistics across Edo North.
        </p>
      </div>

      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-ink/10">
          <h3 className="font-display font-semibold text-[16px]">
            Volunteers
            <span className="font-mono text-[11.5px] text-slate ml-2 font-normal">
              {volunteers.length} registered
            </span>
          </h3>
          <button
            onClick={loadVolunteers}
            className="flex items-center gap-2 px-3.5 py-2 bg-orange text-white rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-slate text-sm">Loading...</div>
        ) : volunteers.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-3xl text-ink/20 mb-3">👥</div>
            <div className="font-display font-semibold text-[15px] text-ink mb-1">
              No volunteers yet
            </div>
            <div className="text-[12.5px] text-slate">
              Sign-ups from the public site will appear here.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-left font-mono text-[10.5px] tracking-wide uppercase text-slate font-semibold bg-paper border-b border-ink/10">
                  <th className="px-5 py-3">#</th>
                  <th className="px-5 py-3">Name</th>
                  <th className="px-5 py-3">LGA</th>
                  <th className="px-5 py-3">Skills</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Volunteer ID</th>
                  <th className="px-5 py-3">Signed Up</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {volunteers.map((v, i) => (
                  <tr key={v.id} className="border-b border-ink/6 hover:bg-orange/[0.02]">
                    <td className="px-5 py-3.5 font-mono text-[12px] text-slate">
                      {String(i + 1).padStart(2, "0")}
                    </td>
                    <td className="px-5 py-3.5">
                    <Link href={`/admin/volunteers/${v.id}`} className="font-semibold text-[13.5px] hover:text-orange transition-colors">
                        {v.full_name}
                    </Link>
                    </td>
                    <td className="px-5 py-3.5 text-[13.5px]">{v.lga}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex flex-wrap gap-1">
                        {v.skills?.map((s) => (
                          <span
                            key={s}
                            className="inline-block text-[10px] font-mono bg-orange/8 text-orange-dark px-2 py-0.5 rounded-full"
                          >
                            {s}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[12px] text-slate">
                      <div>{v.phone}</div>
                      <div className="text-[11px]">{v.email}</div>
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[11px] text-orange font-semibold">
                      {v.volunteer_id}
                    </td>
                    <td className="px-5 py-3.5 font-mono text-[12px]">
                      {new Date(v.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-5 py-3.5">
                      <select
                        value={v.status}
                        onChange={(e) => updateStatus(v.id, e.target.value)}
                        className={`font-mono text-[11.5px] border border-ink/10 rounded-full px-2.5 py-1 bg-paper cursor-pointer ${statusChip(v.status)}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Active">Active</option>
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1">
                        <Link
                          href={`/admin/volunteers/${v.id}/id-card`}
                          className="p-1.5 text-slate hover:text-orange transition-colors"
                          title="Generate ID Card"
                        >
                          <Download className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => deleteVolunteer(v.id)}
                          className="p-1.5 text-slate hover:text-red-600 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
