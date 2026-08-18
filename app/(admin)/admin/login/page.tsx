"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client"; // Kept your import path
import Image from "next/image";
import { Eye, EyeOff, ArrowRight, User, Key } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError("Invalid credentials. Try again.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  // Helper to fill demo creds
  function fillDemoCreds() {
    setEmail("admin@arunacampaign.com");
    setPassword("edonorth2027");
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 -mt-[72px] bg-[#08150d]"
      style={{
        background:
          "radial-gradient(circle at 20% 20%, rgba(249,115,22,0.22), transparent 28%), radial-gradient(circle at 80% 30%, rgba(1,112,61,0.35), transparent 30%), radial-gradient(circle at 50% 85%, rgba(255,255,255,0.08), transparent 25%), linear-gradient(135deg, #03100a, #071b11 45%, #0c2214)",
      }}
    >
      <div className="w-full max-w-[980px] grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-8 items-center relative z-10">
        
        {/* Left Brand Section (Hidden on mobile) */}
        <div className="text-white max-w-[460px] hidden lg:block animate-[fadeUp_0.9s_ease_both]">
          <div className="w-[84px] h-[84px] rounded-3xl bg-white/10 border border-white/10 flex items-center justify-center overflow-hidden shadow-2xl mb-5 relative">
            <div className="absolute inset-[-30%] bg-[linear-gradient(120deg,transparent_40%,rgba(255,255,255,0.35),transparent_60%)] animate-[shine_4s_linear_infinite]"></div>
            <Image src="/images/logo.png" alt="DICO Logo" width={60} height={60} className="relative z-10 object-contain" />
          </div>
          <h1 className="font-display text-[clamp(30px,4vw,50px)] leading-[1.08] font-bold tracking-tight text-[#f8f9fb] drop-shadow-lg">
            Admin Portal
          </h1>
          <p className="text-sm text-white/80 mt-2.5 max-w-[34ch]">
            Comr. Aruna Abubakari · Edo North 2027
          </p>
        </div>

        {/* Right Login Card */}
        <div className="w-full max-w-[420px] bg-white/96 backdrop-blur-md rounded-3xl p-8 shadow-2xl border border-white/40 mx-auto animate-[popIn_0.85s_ease_both]">
          
          {/* Card Header */}
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="font-display text-[22px] text-ink font-semibold">Secure Access</h2>
            <span className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-forest bg-forest/10 border border-forest/20 px-2.5 py-1.5 rounded-full">
              Campaign Control
            </span>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block font-mono text-[10.5px] font-semibold uppercase tracking-wider text-slate mb-2">
                Email Address
              </label>
              <div className="flex items-center gap-2.5 bg-paper border border-ink/10 rounded-2xl px-3.5 transition-all focus-within:border-orange focus-within:ring-4 focus-within:ring-orange/10 focus-within:-translate-y-0.5">
                <User className="text-orange-dark text-[15px] shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@arunacampaign.com"
                  required
                  className="w-full py-3 bg-transparent text-ink outline-none text-[14.5px] placeholder:text-slate/50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block font-mono text-[10.5px] font-semibold uppercase tracking-wider text-slate mb-2">
                Passphrase
              </label>
              <div className="flex items-center gap-2.5 bg-paper border border-ink/10 rounded-2xl px-3.5 transition-all focus-within:border-orange focus-within:ring-4 focus-within:ring-orange/10 focus-within:-translate-y-0.5">
                <Key className="text-orange-dark text-[15px] shrink-0" />
                <input
                  type={showPass ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full py-3 bg-transparent text-ink outline-none text-[14.5px] placeholder:text-slate/50"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="text-slate hover:text-orange transition-colors"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-red-600 text-[12.5px] text-center animate-[shake_0.35s_ease]">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl bg-gradient-to-br from-orange to-orange-dark text-white font-bold text-[14px] shadow-[0_12px_28px_rgba(249,115,22,0.28)] hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(249,115,22,0.34)] hover:brightness-105 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Signing in..." : "Enter the Panel"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>

          {/* Demo Credentials Box */}
          {/* <div className="mt-5 bg-paper border border-ink/10 rounded-2xl p-4">
            <div className="font-mono text-[10.5px] font-bold uppercase tracking-wider text-orange-dark mb-2.5 flex items-center gap-1.5">
              <Key className="h-3 w-3" /> Demo Credentials
            </div>
            <div className="flex items-center justify-between gap-2 py-1">
              <span className="text-[12px] text-slate">Email</span>
              <code className="font-mono text-[12px] bg-white border border-ink/10 rounded-md px-2 py-1 text-ink">
                admin@arunacampaign.com
              </code>
            </div>
            <div className="flex items-center justify-between gap-2 py-1">
              <span className="text-[12px] text-slate">Passphrase</span>
              <code className="font-mono text-[12px] bg-white border border-ink/10 rounded-md px-2 py-1 text-ink">
                edonorth2027
              </code>
            </div>
            <button
              onClick={fillDemoCreds}
              className="w-full mt-3 border border-orange text-orange font-semibold text-[12px] py-2 rounded-xl hover:bg-orange hover:text-white transition-colors"
            >
              Fill in for me
            </button>
            <p className="text-[11px] text-slate mt-3 leading-relaxed">
              This is a front-end demo. Ensure this admin user exists in your Supabase Auth dashboard.
            </p>
          </div> */}

        </div>
      </div>
    </div>
  );
}