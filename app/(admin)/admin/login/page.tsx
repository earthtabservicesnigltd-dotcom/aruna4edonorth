"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/client";
import Image from "next/image";
import { Eye, EyeOff, ArrowRight } from "lucide-react";

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

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6 -mt-[72px]"
      style={{
        background:
          "radial-gradient(circle at 88% 15%, rgba(1,112,61,0.55), transparent 46%), radial-gradient(circle at 6% 92%, rgba(249,115,22,0.18), transparent 42%), #01381D",
      }}
    >
      <div className="w-full max-w-[420px] bg-white rounded-site shadow-2xl p-9 pt-8 border-t-[4px] border-orange text-center">
        <div className="w-[60px] h-[60px] mx-auto mb-4 rounded-full bg-ink border-2 border-orange flex items-center justify-center font-display font-semibold text-lg text-white relative">
          AA
          <span className="absolute inset-[5px] border border-dashed border-white/35 rounded-full" />
        </div>

        <h1 className="font-display font-semibold text-[22px] text-ink mt-1">Admin Panel</h1>
        <p className="font-mono text-[11px] tracking-wide uppercase text-slate mb-7">
          Comr. Aruna Abubakari · Edo North 2027
        </p>

        <form onSubmit={handleLogin} className="text-left space-y-4">
          <div>
            <label className="font-mono text-[10.5px] font-semibold tracking-wide uppercase text-slate block mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="aruna@gmail.com"
              required
              className="w-full px-3.5 py-2.5 border border-ink/13 rounded-site text-[14.5px] bg-paper text-ink outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
            />
          </div>

          <div>
            <label className="font-mono text-[10.5px] font-semibold tracking-wide uppercase text-slate block mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full px-3.5 py-2.5 pr-10 border border-ink/13 rounded-site text-[14.5px] bg-paper text-ink outline-none focus:border-orange focus:ring-2 focus:ring-orange/10 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate hover:text-orange"
              >
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-600 text-[12.5px] -mt-2">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange text-white py-3 rounded-site font-semibold text-[14px] hover:bg-orange-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Enter the Panel"}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* <div className="mt-5 text-left bg-paper border border-ink/10 rounded-site p-4">
          <p className="font-mono text-[10.5px] font-bold tracking-wide uppercase text-orange-dark mb-2">
            <i className="bi bi-key" /> Demo Credentials
          </p>
          <div className="flex items-center justify-between gap-2 py-1">
            <span className="text-[12px] text-slate">Email</span>
            <code className="font-mono text-[12.5px] bg-white border border-ink/10 rounded px-2 py-0.5">
              admin@arunacampaign.com
            </code>
          </div>
          <div className="flex items-center justify-between gap-2 py-1">
            <span className="text-[12px] text-slate">Password</span>
            <code className="font-mono text-[12.5px] bg-white border border-ink/10 rounded px-2 py-0.5">
              edonorth2027
            </code>
          </div>
          <p className="text-[11px] text-slate mt-2 leading-relaxed">
            First, create this admin user in your Supabase Auth dashboard (Authentication → Users → Invite user) with the email <strong>admin@campaign.ng</strong> and password <strong>edonorth2027</strong>.
          </p>
        </div> */}
      </div>
    </div>
  );
}
