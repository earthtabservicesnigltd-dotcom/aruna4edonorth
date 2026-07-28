"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import {
  ArrowLeft,
  Download,
  Trash2,
  Pencil,
  Check,
  X,
  Camera,
} from "lucide-react";
import Link from "next/link";

const SKILL_OPTIONS = [
  { id: "media", label: "Media & Content" },
  { id: "canvassing", label: "Canvassing" },
  { id: "logistics", label: "Logistics" },
  { id: "digital", label: "Digital / Social" },
  { id: "mobilization", label: "Mobilization" },
  { id: "events", label: "Event Support" },
];

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

export default function VolunteerDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [volunteer, setVolunteer] = useState<Volunteer | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  // Edit form state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lga, setLga] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [status, setStatus] = useState("New");

  useEffect(() => {
    loadVolunteer();
  }, [params.id]);

  async function loadVolunteer() {
    const supabase = createClient();
    const { data } = await supabase
      .from("volunteers")
      .select("*")
      .eq("id", params.id)
      .single();
    if (data) {
      setVolunteer(data);
      setName(data.full_name);
      setEmail(data.email);
      setPhone(data.phone);
      setLga(data.lga);
      setSkills(data.skills || []);
      setStatus(data.status);
    }
    setLoading(false);
  }

  async function saveChanges() {
    if (!volunteer) return;
    const supabase = createClient();
    await supabase
      .from("volunteers")
      .update({ full_name: name, email, phone, lga, skills, status })
      .eq("id", volunteer.id);
    setEditing(false);
    loadVolunteer();
  }

  async function deleteVolunteer() {
    if (!confirm("Remove this volunteer permanently?")) return;
    const supabase = createClient();
    await supabase.from("volunteers").delete().eq("id", params.id);
    router.push("/admin/volunteers");
  }

  function toggleSkill(skillId: string) {
    setSkills((prev) =>
      prev.includes(skillId)
        ? prev.filter((s) => s !== skillId)
        : [...prev, skillId]
    );
  }

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-ink border-t-orange animate-spin mx-auto" />
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="py-20 text-center">
        <p className="text-slate">Volunteer not found.</p>
        <button onClick={() => router.push("/admin/volunteers")} className="text-orange font-semibold mt-3 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Volunteers
        </button>
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    New: "bg-orange/12 text-orange-dark",
    Contacted: "bg-blue/10 text-blue",
    Active: "bg-emerald/10 text-emerald",
  };

  return (
    <div>
      {/* Back + actions */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <button
          onClick={() => router.push("/admin/volunteers")}
          className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide uppercase text-slate hover:text-orange transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Volunteers
        </button>

        <div className="flex gap-2">
          <Link
            href={`/admin/volunteers/${volunteer.id}/id-card`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-orange text-white rounded-site font-semibold text-[13px] hover:bg-orange-dark transition-colors"
          >
            <Download className="w-4 h-4" /> ID Card
          </Link>
          {editing ? (
            <>
              <button
                onClick={saveChanges}
                className="inline-flex items-center gap-2 px-4 py-2 bg-emerald text-white rounded-site font-semibold text-[13px] hover:bg-forest transition-colors"
              >
                <Check className="w-4 h-4" /> Save
              </button>
              <button
                onClick={() => { setEditing(false); loadVolunteer(); }}
                className="inline-flex items-center gap-2 px-4 py-2 border border-ink/13 rounded-site font-semibold text-[13px] text-slate hover:bg-paper transition-colors"
              >
                <X className="w-4 h-4" /> Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-ink/13 rounded-site font-semibold text-[13px] text-ink hover:bg-paper transition-colors"
            >
              <Pencil className="w-4 h-4" /> Edit
            </button>
          )}
          <button
            onClick={deleteVolunteer}
            className="inline-flex items-center gap-2 px-4 py-2 border border-red/20 text-red rounded-site font-semibold text-[13px] hover:bg-red-soft transition-colors"
          >
            <Trash2 className="w-4 h-4" /> Delete
          </button>
        </div>
      </div>

      {/* Volunteer profile card */}
      <div className="bg-white border border-ink/10 rounded-site overflow-hidden">
        {/* Header area */}
        <div className="bg-ink text-white p-8 md:p-9 relative overflow-hidden">
          <div
            className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-[0.08]"
            style={{ background: "radial-gradient(circle, #F97316, transparent)" }}
          />
          <div className="relative z-10 flex items-center gap-6 flex-wrap">
            {/* Photo or initials */}
            <div className="w-[88px] h-[88px] rounded-full bg-forest border-2 border-orange/30 flex items-center justify-center text-[28px] font-display font-semibold overflow-hidden flex-shrink-0">
              {volunteer.photo_url ? (
                <img src={volunteer.photo_url} alt="" className="w-full h-full object-cover" />
              ) : (
                volunteer.full_name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()
              )}
            </div>
            <div>
              <div className="font-mono text-[10.5px] tracking-widest text-orange mb-1.5">
                VOLUNTEER PROFILE
              </div>
              <h2 className="font-display font-semibold text-[clamp(22px,3vw,30px)]">
                {volunteer.full_name}
              </h2>
              <div className="flex flex-wrap gap-4 mt-3 font-mono text-[12px] text-white/70">
                <span className="inline-flex items-center gap-1.5">
                  🆔 {volunteer.volunteer_id}
                </span>
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10.5px] font-bold ${
                  statusColors[volunteer.status] || "bg-white/10 text-white"
                }`}>
                  {volunteer.status}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  📅 {new Date(volunteer.created_at).toLocaleDateString("en-GB", {
                    day: "2-digit", month: "long", year: "numeric",
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-8 md:p-9">
          {editing ? (
            /* ---- EDIT MODE ---- */
            <div className="space-y-5 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5 font-semibold">Full Name</label>
                  <input value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] outline-none focus:border-orange" />
                </div>
                <div>
                  <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5 font-semibold">Email</label>
                  <input value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] outline-none focus:border-orange" />
                </div>
                <div>
                  <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5 font-semibold">Phone</label>
                  <input value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] outline-none focus:border-orange" />
                </div>
                <div>
                  <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5 font-semibold">LGA</label>
                  <input value={lga} onChange={(e) => setLga(e.target.value)}
                    className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] outline-none focus:border-orange" />
                </div>
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-2 font-semibold">Skills</label>
                <div className="flex flex-wrap gap-2">
                  {SKILL_OPTIONS.map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => toggleSkill(s.id)}
                      className={`px-3.5 py-2 rounded-site border text-[13px] transition-colors ${
                        skills.includes(s.id)
                          ? "bg-forest text-white border-forest"
                          : "bg-paper text-ink border-ink/15 hover:border-orange"
                      }`}
                    >
                      {skills.includes(s.id) && <Check className="w-3 h-3 inline mr-1" />}
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="font-mono text-[10.5px] uppercase text-slate block mb-1.5 font-semibold">Status</label>
                <select value={status} onChange={(e) => setStatus(e.target.value)}
                  className="px-3.5 py-2.5 border border-ink/13 rounded-site text-[14px] outline-none focus:border-orange bg-white">
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Active</option>
                </select>
              </div>
            </div>
          ) : (
            /* ---- VIEW MODE ---- */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
              <div>
                <h4 className="font-mono text-[10.5px] uppercase text-slate font-semibold mb-3 tracking-wide">
                  Contact Information
                </h4>
                <div className="space-y-3.5">
                  <div>
                    <span className="text-[12px] text-slate block">Email</span>
                    <span className="text-[14.5px] font-medium">{volunteer.email || "—"}</span>
                  </div>
                  <div>
                    <span className="text-[12px] text-slate block">Phone</span>
                    <span className="text-[14.5px] font-medium">{volunteer.phone}</span>
                  </div>
                  <div>
                    <span className="text-[12px] text-slate block">LGA</span>
                    <span className="text-[14.5px] font-medium">{volunteer.lga}</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-mono text-[10.5px] uppercase text-slate font-semibold mb-3 tracking-wide">
                  Skills & Areas
                </h4>
                <div className="flex flex-wrap gap-2">
                  {volunteer.skills?.length ? volunteer.skills.map((s) => {
                    const label = SKILL_OPTIONS.find((o) => o.id === s)?.label || s;
                    return (
                      <span key={s} className="inline-block text-[12px] font-medium bg-orange/8 text-orange-dark px-3 py-1.5 rounded-site border border-orange/12">
                        {label}
                      </span>
                    );
                  }) : (
                    <span className="text-[13.5px] text-slate">No skills listed</span>
                  )}
                </div>

                <h4 className="font-mono text-[10.5px] uppercase text-slate font-semibold mb-3 mt-8 tracking-wide">
                  Status
                </h4>
                <span className={`inline-block text-[12px] font-bold px-3 py-1.5 rounded-full ${
                  statusColors[volunteer.status] || "bg-line-soft text-slate"
                }`}>
                  {volunteer.status}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
