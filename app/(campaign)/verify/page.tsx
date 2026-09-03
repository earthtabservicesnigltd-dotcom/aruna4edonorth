"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Search, CheckCircle2, XCircle, Loader2, QrCode, ShieldCheck, MapPin, Award, Calendar, RefreshCw, GraduationCap } from "lucide-react";

interface VerifiedVolunteer {
  id: string;
  volunteer_id: string;
  full_name: string;
  lga: string;
  skills: string[];
  photo_url: string | null;
  status: string;
  created_at: string;
}

const skillMap: Record<string, string> = {
  media: "Media & Content",
  canvassing: "Canvassing",
  logistics: "Logistics",
  digital: "Digital / Social",
  mobilization: "Mobilization",
  events: "Event Support",
};

function VerifyPortalContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("id") || "");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ found: boolean; volunteer?: VerifiedVolunteer; error?: string } | null>(null);

  useEffect(() => {
    const initialId = searchParams.get("id");
    if (initialId) {
      setQuery(initialId);
      performSearch(initialId);
    }
  }, [searchParams]);

  async function performSearch(idToSearch: string) {
    const clean = idToSearch.trim();
    if (!clean) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`/api/volunteers/verify?id=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (res.ok && data.found && data.volunteer) {
        setResult({ found: true, volunteer: data.volunteer });
      } else {
        setResult({
          found: false,
          error: data.message || "Volunteer ID not found in the official campaign database.",
        });
      }
    } catch {
      setResult({
        found: false,
        error: "Unable to complete verification. Please check your internet connection.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    performSearch(query);
  }

  return (
    <div className="pt-28 pb-20 px-4 min-h-[80vh] flex flex-col items-center">
      <div className="max-w-xl w-full mx-auto">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="w-18 h-18 mx-auto mb-3 rounded-full overflow-hidden border-2 border-orange/40 p-1 bg-white shadow-sm flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Campaign Logo"
              width={64}
              height={64}
              className="object-contain rounded-full"
            />
          </div>
          <h1 className="font-display font-extrabold text-3xl text-ink tracking-tight">
            Volunteer Verification
          </h1>
          <p className="text-slate text-sm max-w-md mx-auto mt-2 leading-relaxed">
            Verify official volunteer identification credentials for the Abubakari Aruna For Senate Campaign (Edo North).
          </p>
        </div>

        {/* Verification Category Switcher */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Link
            href="/verify"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-ink text-white shadow-xs transition-colors"
          >
            Volunteer ID Verification
          </Link>
          <Link
            href="/verify/certificate"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-ink/15 text-slate hover:text-orange hover:border-orange transition-colors flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Academy Certificate Verification
          </Link>
        </div>

        {/* Search Input Card */}
        <div className="bg-white border border-ink/10 rounded-site p-6 shadow-md mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate">
              Enter Volunteer ID Number or Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. AA-VOL-BFDAF1C2 or AA/EDN/2027/0001"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                required
                className="flex-1 px-4 py-3 border border-ink/20 rounded-xl text-sm font-mono text-ink placeholder:text-gray-400 focus:outline-none focus:border-orange transition-colors"
              />
              <button
                type="submit"
                disabled={loading}
                className="bg-orange hover:bg-orange-dark text-white font-bold px-6 py-3 rounded-xl transition-colors text-sm flex items-center gap-2 disabled:opacity-60 shadow-sm shrink-0"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Verify</span>
              </button>
            </div>
            <div className="flex items-center gap-2 text-[11px] text-gray-500 pt-1">
              <QrCode className="w-4 h-4 text-orange shrink-0" />
              <span>Scanning the QR code on the back of any ID card opens its verified credential automatically.</span>
            </div>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="transition-all">
            {result.found && result.volunteer ? (
              <div className="bg-white border-2 border-emerald/40 rounded-site p-6 sm:p-8 shadow-xl relative overflow-hidden">
                {/* Verified Header Badge */}
                <div className="flex items-center gap-3 bg-emerald/10 border border-emerald/20 text-emerald-800 rounded-xl px-4 py-3 mb-6">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-black text-xs sm:text-sm tracking-wide uppercase text-emerald-900">
                      OFFICIAL VOLUNTEER — VERIFIED
                    </p>
                    <p className="text-[11px] text-emerald-700 leading-tight">
                      This identity is authenticated in the official 2027 campaign database.
                    </p>
                  </div>
                </div>

                {/* Profile row */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-ink/10">
                  <div className="w-28 h-28 rounded-2xl border-[3.5px] border-orange overflow-hidden bg-gray-50 shrink-0 shadow-sm flex items-center justify-center">
                    {result.volunteer.photo_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={result.volunteer.photo_url}
                        alt={result.volunteer.full_name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="text-center p-2">
                        <span className="text-3xl">👤</span>
                        <p className="text-[10px] text-gray-400 mt-1 font-bold">No Photo</p>
                      </div>
                    )}
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <span className="inline-block bg-orange/10 text-orange font-bold text-[10.5px] uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                      Active Volunteer
                    </span>
                    <h2 className="font-display font-extrabold text-2xl text-ink leading-tight uppercase">
                      {result.volunteer.full_name}
                    </h2>
                    <p className="font-mono text-xs font-bold text-gray-700 tracking-wider mt-1">
                      ID: <span className="text-orange">{result.volunteer.volunteer_id}</span>
                    </p>
                    <p className="text-xs text-slate mt-1.5 flex items-center justify-center sm:justify-start gap-1">
                      <MapPin className="w-3.5 h-3.5 text-orange" />
                      <span>{result.volunteer.lga} LGA, Edo North</span>
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="py-5 space-y-3 border-b border-ink/10 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-orange" /> Area of Service
                    </span>
                    <span className="font-bold text-ink">
                      {result.volunteer.skills?.[0]
                        ? skillMap[result.volunteer.skills[0]] || result.volunteer.skills[0].toUpperCase()
                        : "General Volunteer"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange" /> Registered Date
                    </span>
                    <span className="font-semibold text-ink">
                      {new Date(result.volunteer.created_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-orange" /> Validity Period
                    </span>
                    <span className="font-bold text-emerald-700">Valid for 2027 Election</span>
                  </div>
                </div>

                {/* Campaign statement */}
                <div className="mt-5 p-3.5 bg-paper rounded-xl border border-ink/5">
                  <p className="text-[11px] text-gray-700 leading-relaxed italic text-center">
                    &ldquo;The bearer of this identification is authorized by the Abubakari Aruna Senatorial Campaign Organization to engage in mobilization and voter contact activities across Edo North.&rdquo;
                  </p>
                </div>

                {/* Footer sign off */}
                <div className="mt-5 text-center pt-2">
                  <p className="text-[11px] font-bold text-ink uppercase tracking-wide">
                    COMR. ABUBAKARI ARUNA
                  </p>
                  <p className="text-[10px] font-semibold text-orange tracking-widest uppercase">
                    Senatorial Candidate • African Democratic Congress (ADC)
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white border-2 border-red-200 rounded-site p-6 sm:p-8 shadow-xl text-center">
                <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-3">
                  <XCircle className="w-8 h-8" />
                </div>
                <h3 className="font-display font-extrabold text-lg text-red-700 uppercase tracking-wide mb-1">
                  ID Not Found
                </h3>
                <p className="text-slate text-xs mb-4">
                  {result.error || "No official campaign volunteer matches this ID."}
                </p>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  <button
                    onClick={() => setResult(null)}
                    className="inline-flex items-center justify-center gap-1.5 bg-ink text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-orange transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Try Another ID
                  </button>
                  <Link
                    href="/volunteer"
                    className="inline-flex items-center justify-center bg-orange text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-orange-dark transition-colors"
                  >
                    Register as Volunteer
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function VolunteerVerifyPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-28 pb-20 text-center min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-orange animate-spin" />
        </div>
      }
    >
      <VerifyPortalContent />
    </Suspense>
  );
}
