"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowLeft, ArrowRight, Check, ShieldCheck, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { createClient } from "@/lib/client";
import { toast } from "sonner";

export default function LoginSignupPage() {
  const router = useRouter();
  const supabase = createClient();

  const [pane, setPane] = useState<"login" | "signup" | "forgot">("login");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoadin g] = useState(false);
  
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [lga, setLga] = useState("");
  const [selectedSchoolId, setSelectedSchoolId] = useState<string>(""); // Now stores the UUID

  // State for schools from DB
  const [schools, setSchools] = useState<any[]>([]);

  useEffect(() => {
    async function fetchSchools() {
      const { data } = await supabase.from("programmes").select("id, name").eq("active", true);
      if (data) setSchools(data);
    }
    fetchSchools();
  }, [supabase]);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success("Welcome back!");
      router.push("/academy");
      router.refresh(); 
    } catch (error: any) {
      toast.error(error.message || "Failed to log in.");
      setLoading(false);
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedSchoolId) {
      toast.error("Please choose a school.");
      return;
    }
    setLoading(true);
    try {
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) throw authError;

      // 2. Insert into Students table with the programme_id
      if (authData.user) {
        const { error: dbError } = await supabase.from("students").insert([
          {
            name: `${firstName} ${lastName}`,
            email: email,
            phone: phone,
            lga: lga,
            programme_id: selectedSchoolId, // Link the school UUID
            status: "Active",
            cohort: "Week 28"
          }
        ]);
        if (dbError) throw dbError;
      }

      toast.success("Account created successfully!");
      router.push("/academy");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to sign up.");
      setLoading(false);
    }
  }

  // ... (Keep your existing JSX, but update the School Selector dropdown to use the `schools` state):
  
  // Inside the Signup form JSX, replace the hardcoded programmes map with:
  /*
  <div className="bg-white border border-ink/13 rounded-site p-4">
    <div className="mb-3">
      <h4 className="font-semibold text-sm">Choose your school</h4>
      <span className="font-mono text-[10px] text-slate">Pick one to start</span>
    </div>
    <div className="flex flex-wrap gap-2">
      {schools.map((s) => (
        <button 
          key={s.id} 
          type="button" 
          onClick={() => setSelectedSchoolId(s.id)}
          className={`flex items-center gap-1.5 text-xs px-3 py-2 rounded-site border transition-colors ${
            selectedSchoolId === s.id
              ? "bg-forest text-white border-forest"
              : "bg-paper text-ink border-ink/15 hover:border-orange"
          }`}
        >
          {selectedSchoolId === s.id && <Check className="w-3 h-3" />}
          {s.name}
        </button>
      ))}
    </div>
  </div>
  */
}