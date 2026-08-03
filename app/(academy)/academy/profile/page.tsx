"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

export default function ProfilePage() {
  const supabase = createClient();
  const [student, setStudent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("students")
          .select("*")
          .eq("email", user.email)
          .single();
        if (data) setStudent(data);
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from("students")
        .update({
          name: student.name,
          phone: student.phone,
          lga: student.lga,
          programme: student.programme
        })
        .eq("email", student.email);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    }
  }

  if (loading) return <div className="py-20 text-center text-slate">Loading profile...</div>;
  if (!student) return <div className="py-20 text-center text-slate">No profile found.</div>;

  const initials = student.name ? student.name.split(" ").map((n: string) => n[0]).join("").slice(0, 2).toUpperCase() : "ST";

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">ACCOUNT</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">My Profile</h1>
      </div>

      <div className="grid lg:grid-cols-[1fr_1.6fr] gap-6 items-start">
        {/* Profile Card */}
        <div className="bg-white border border-ink/10 rounded-site p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-forest text-white flex items-center justify-center font-display text-3xl mx-auto mb-4">
            {initials}
          </div>
          <h3 className="font-display font-semibold text-xl">{student.name}</h3>
          <div className="font-mono text-[11px] text-slate tracking-wide mt-1 uppercase">
            {student.cohort} · {student.programme?.split(" ")[0]}
          </div>
          <button className="mt-6 w-full py-3 border border-ink/10 rounded-site text-[14px] font-semibold text-ink hover:border-orange hover:text-orange transition-colors">
            Change Photo
          </button>
        </div>

        {/* Edit Form */}
        <form onSubmit={handleSave} className="bg-white border border-ink/10 rounded-site p-8 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10.5px] uppercase tracking-wide text-slate block mb-2">Full Name</label>
              <input 
                value={student.name || ""} 
                onChange={(e) => setStudent({ ...student, name: e.target.value })}
                className="w-full px-4 py-3 border border-ink/10 rounded-site text-[14px] outline-none focus:border-orange transition-colors" 
              />
            </div>
            <div>
              <label className="font-mono text-[10.5px] uppercase tracking-wide text-slate block mb-2">Email Address</label>
              <input 
                value={student.email || ""} 
                disabled 
                className="w-full px-4 py-3 border border-ink/10 rounded-site text-[14px] outline-none bg-paper text-slate" 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="font-mono text-[10.5px] uppercase tracking-wide text-slate block mb-2">Phone Number</label>
              <input 
                value={student.phone || ""} 
                onChange={(e) => setStudent({ ...student, phone: e.target.value })}
                className="w-full px-4 py-3 border border-ink/10 rounded-site text-[14px] outline-none focus:border-orange transition-colors" 
              />
            </div>
            <div>
              <label className="font-mono text-[10.5px] uppercase tracking-wide text-slate block mb-2">LGA of Residence</label>
              <select 
                value={student.lga || ""} 
                onChange={(e) => setStudent({ ...student, lga: e.target.value })}
                className="w-full px-4 py-3 border border-ink/10 rounded-site text-[14px] outline-none focus:border-orange transition-colors bg-white"
              >
                <option>Etsako West</option><option>Akoko-Edo</option><option>Etsako Central</option>
                <option>Etsako East</option><option>Owan East</option><option>Owan West</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-mono text-[10.5px] uppercase tracking-wide text-slate block mb-2">Current Programme</label>
            <select 
              value={student.programme || ""} 
              onChange={(e) => setStudent({ ...student, programme: e.target.value })}
              className="w-full px-4 py-3 border border-ink/10 rounded-site text-[14px] outline-none focus:border-orange transition-colors bg-white"
            >
              <option>Estate Management</option><option>Agro-Allied</option><option>Entrepreneurship & Wealth Creation</option>
              <option>Digital Skills</option><option>Import & Export</option><option>Engineering Technology</option>
            </select>
          </div>

          <button type="submit" className="bg-orange text-white px-6 py-3 rounded-site font-semibold text-[14px] hover:bg-orange-dark transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}