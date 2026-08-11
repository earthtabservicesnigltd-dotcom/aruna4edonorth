"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const supabase = createClient();
  const [student, setStudent] = useState<any>(null);
  const [programmeName, setProgrammeName] = useState("Loading...");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProfile() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Fetch Student Profile
        const { data: stuData, error } = await supabase
          .from("students")
          .select("*")
          .eq("email", user.email)
          .single();
          
        if (error || !stuData) {
          setLoading(false);
          return;
        }
        
        setStudent(stuData);

        // 2. Fetch the Programme Name separately using programme_id
        if (stuData.programme_id) {
          const { data: progData } = await supabase
            .from("programmes")
            .select("name")
            .eq("id", stuData.programme_id)
            .single();
            
          if (progData) setProgrammeName(progData.name);
        } else {
          setProgrammeName("Not Assigned");
        }
      }
      setLoading(false);
    }
    loadProfile();
  }, [supabase]);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    try {
      // Only update editable fields to prevent breaking programme_id
      const { error } = await supabase
        .from("students")
        .update({
          name: student.name,
          phone: student.phone,
          lga: student.lga,
        })
        .eq("email", student.email);

      if (error) throw error;
      toast.success("Profile updated successfully!");
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile.");
    }
  }

  if (loading) return <div className="py-20 text-center flex justify-center"><Loader2 className="w-8 h-8 animate-spin text-orange" /></div>;
  if (!student) return <div className="py-20 text-center text-slate">No profile found.</div>;

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">ACCOUNT</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Edit Your Profile</h1>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSave} className="bg-white border border-ink/10 rounded-site p-6 md:p-8 space-y-5 shadow-sm">
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
              className="w-full px-4 py-3 border border-ink/10 rounded-site text-[14px] outline-none bg-paper text-slate cursor-not-allowed" 
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
              <option value="">Select LGA</option>
              <option>Etsako West</option>
              <option>Akoko-Edo</option>
              <option>Etsako Central</option>
              <option>Etsako East</option>
              <option>Owan East</option>
              <option>Owan West</option>
              <option>Outside Edo North</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-mono text-[10.5px] uppercase tracking-wide text-slate block mb-2">Current Programme</label>
          <select 
            value={programmeName}
            disabled
            className="w-full px-4 py-3 border border-ink/10 rounded-site text-[14px] outline-none bg-paper text-slate cursor-not-allowed"
          >
            <option>{programmeName}</option>
          </select>
          <p className="text-[11px] text-slate mt-1.5">Your programme is locked based on your enrollment. Contact admin if changes are needed.</p>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-orange text-white px-6 py-3 rounded-site font-semibold text-[14px] hover:bg-orange-dark transition-colors">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}