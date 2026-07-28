"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import { ArrowLeft } from "lucide-react";
import { VolunteerIDCard } from "@/components/volunteer/volunteer-id-card";

interface VolunteerData {
  full_name: string;
  email: string;
  phone: string;
  lga: string;
  skills: string[];
  photo_url: string | null;
  volunteer_id: string;
  created_at: string;
}

export default function VolunteerIDCardPage() {
  const params = useParams();
  const router = useRouter();
  const [volunteer, setVolunteer] = useState<VolunteerData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const supabase = createClient();
      const { data } = await supabase
        .from("volunteers")
        .select("*")
        .eq("id", params.id)
        .single();
      if (data) setVolunteer(data);
      setLoading(false);
    }
    load();
  }, [params.id]);

  if (loading) {
    return (
      <div className="py-16 text-center">
        <div className="w-8 h-8 rounded-full border-2 border-ink border-t-orange animate-spin mx-auto" />
      </div>
    );
  }

  if (!volunteer) {
    return (
      <div className="py-16 text-center">
        <p className="text-slate">Volunteer not found.</p>
        <button
          onClick={() => router.push("/admin/volunteers")}
          className="text-orange font-semibold mt-4 inline-flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Volunteers
        </button>
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={() => router.push("/admin/volunteers")}
        className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide uppercase text-slate mb-5 hover:text-orange transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" /> Back to Volunteers
      </button>

      <VolunteerIDCard volunteer={volunteer} />
    </div>
  );
}
