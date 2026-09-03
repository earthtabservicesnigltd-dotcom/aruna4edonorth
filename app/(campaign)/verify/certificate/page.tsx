"use client";

import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search,
  CheckCircle2,
  XCircle,
  Loader2,
  QrCode,
  ShieldCheck,
  Award,
  Calendar,
  GraduationCap,
  Copy,
  Check,
  ExternalLink,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";

interface VerifiedCertificate {
  certificate_id: string;
  student_id: string;
  recipient_name: string;
  certificate_title: string;
  programme_name: string;
  issued_at: string;
  duration: string;
  status: string;
  institution: string;
  lga: string;
  cohort: string;
}

function PublicCertificateVerifyContent() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("id") || "");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    certificate?: VerifiedCertificate;
    error?: string;
  } | null>(null);

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
      const res = await fetch(`/api/academy/verify?id=${encodeURIComponent(clean)}`);
      const data = await res.json();

      if (res.ok && data.found && data.certificate) {
        setResult({ found: true, certificate: data.certificate });
      } else {
        setResult({
          found: false,
          error: data.message || "Certificate ID not found in the official public database.",
        });
      }
    } catch {
      setResult({
        found: false,
        error: "Unable to complete certificate verification. Please check your network connection.",
      });
    } finally {
      setLoading(false);
    }
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    performSearch(query);
  }

  function copyVerificationLink(certId: string) {
    const url = `${window.location.origin}/verify/certificate/${certId}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Verification link copied to clipboard!");
    setTimeout(() => setCopied(false), 2500);
  }

  return (
    <div className="pt-28 pb-20 px-4 min-h-[85vh] flex flex-col items-center">
      <div className="max-w-xl w-full mx-auto">
        {/* Top Header */}
        <div className="text-center mb-8">
          <div className="w-18 h-18 mx-auto mb-3 rounded-full overflow-hidden border-2 border-orange/40 p-1 bg-white shadow-sm flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Abubakari Aruna Institute Logo"
              width={64}
              height={64}
              className="object-contain rounded-full"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange/10 border border-orange/20 text-orange font-mono text-[11px] uppercase tracking-wider font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" /> Abubakari Aruna Institute
          </div>
          <h1 className="font-display font-extrabold text-3xl text-ink tracking-tight">
            Certificate Verification
          </h1>
          <p className="text-slate text-sm max-w-md mx-auto mt-2 leading-relaxed">
            Verify official academic credentials and graduation certificates issued by the Abubakari Aruna Institute (Edo North).
          </p>
        </div>

        {/* Public Switcher Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <Link
            href="/verify"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-ink/15 text-slate hover:text-orange hover:border-orange transition-colors"
          >
            Volunteer ID Verification
          </Link>
          <Link
            href="/verify/certificate"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#01381D] text-white shadow-xs transition-colors flex items-center gap-1.5"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Academy Certificate Verification
          </Link>
        </div>

        {/* Search Input Card */}
        <div className="bg-white border border-ink/10 rounded-site p-6 shadow-md mb-8">
          <form onSubmit={handleSearch} className="space-y-4">
            <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate">
              Enter Certificate ID Number or Student Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. AAI-ESTA-8C33996E or Student Name"
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
              <span>Scanning the QR code on any certificate opens its verified credential automatically.</span>
            </div>
          </form>
        </div>

        {/* Results */}
        {result && (
          <div className="transition-all">
            {result.found && result.certificate ? (
              <div className="bg-white border-2 border-emerald/40 rounded-site p-6 sm:p-8 shadow-xl relative overflow-hidden">
                {/* Verified Header Badge */}
                <div className="flex items-center gap-3 bg-emerald/10 border border-emerald/20 text-emerald-800 rounded-xl px-4 py-3 mb-6">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 shrink-0" />
                  <div>
                    <p className="font-black text-xs sm:text-sm tracking-wide uppercase text-emerald-900">
                      OFFICIAL CERTIFICATE — VERIFIED & AUTHENTIC
                    </p>
                    <p className="text-[11px] text-emerald-700 leading-tight">
                      This academic credential is authenticated in the official public database.
                    </p>
                  </div>
                </div>

                {/* Recipient & Programme Overview */}
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-ink/10">
                  <div className="w-20 h-20 rounded-2xl bg-[#01381D] text-white border-2 border-orange/40 shrink-0 shadow-sm flex items-center justify-center relative">
                    <GraduationCap className="w-10 h-10 text-orange" />
                  </div>

                  <div className="text-center sm:text-left flex-1">
                    <span className="inline-block bg-emerald/10 text-emerald-800 border border-emerald/20 font-bold text-[10.5px] uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                      Graduated Scholar • {result.certificate.cohort}
                    </span>
                    <h2 className="font-display font-extrabold text-2xl text-ink leading-tight uppercase">
                      {result.certificate.recipient_name}
                    </h2>
                    <p className="text-sm font-semibold text-orange mt-1">
                      {result.certificate.certificate_title}
                    </p>
                    <p className="font-mono text-xs font-bold text-gray-700 tracking-wider mt-1.5 flex items-center justify-center sm:justify-start gap-2">
                      <span>ID: <strong className="text-ink">{result.certificate.certificate_id}</strong></span>
                      <button
                        onClick={() => copyVerificationLink(result.certificate!.certificate_id)}
                        className="text-slate hover:text-orange transition-colors p-1"
                        title="Copy verification link"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </p>
                  </div>
                </div>

                {/* Credential Data Table */}
                <div className="py-5 space-y-3 border-b border-ink/10 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-orange" /> Programme Conferred
                    </span>
                    <span className="font-bold text-ink text-right max-w-[240px]">
                      {result.certificate.programme_name}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5 text-orange" /> Duration / Completion
                    </span>
                    <span className="font-semibold text-ink">
                      {result.certificate.duration}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-orange" /> Date of Issue
                    </span>
                    <span className="font-semibold text-ink">
                      {new Date(result.certificate.issued_at).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                      <ShieldCheck className="w-3.5 h-3.5 text-orange" /> Credential Status
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald/10 px-2 py-0.5 rounded-md">
                      Active & Officially Conferred
                    </span>
                  </div>
                </div>

                {/* Academic Authorization Notice */}
                <div className="mt-5 p-3.5 bg-paper rounded-xl border border-ink/5 text-center">
                  <p className="text-[11px] text-gray-700 leading-relaxed italic">
                    &ldquo;This credential certifies that the candidate has satisfactorily completed all academic coursework, practical assignments, and graduation requirements prescribed by the Abubakari Aruna Institute.&rdquo;
                  </p>
                </div>

                {/* Sign-off & Actions */}
                <div className="mt-6 pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-center sm:text-left">
                    <p className="text-[11px] font-bold text-ink uppercase tracking-wide">
                      ABUBAKARI ARUNA INSTITUTE
                    </p>
                    <p className="text-[10px] font-semibold text-orange tracking-widest uppercase">
                      Official Registrar • Directorate of Academic Programmes
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/verify/certificate/${encodeURIComponent(result.certificate.certificate_id)}`}
                      className="inline-flex items-center gap-1.5 bg-[#01381D] hover:bg-orange text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors shadow-xs"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> Full View
                    </Link>
                  </div>
                </div>
              </div>
            ) : (
              /* Unverified / Not Found Card */
              <div className="bg-white border-2 border-red-200 rounded-site p-6 sm:p-8 shadow-xl text-center">
                <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
                  <XCircle className="w-9 h-9" />
                </div>
                <h2 className="font-display font-extrabold text-xl text-red-700 mb-2 uppercase tracking-wide">
                  Invalid or Unregistered Certificate
                </h2>
                <p className="text-slate text-sm max-w-md mx-auto mb-6">
                  We could not find an official certificate record matching the query:
                </p>

                <div className="bg-paper border border-ink/10 rounded-xl p-3 mb-6 inline-block max-w-full">
                  <code className="font-mono font-bold text-xs text-ink break-all">
                    {query}
                  </code>
                </div>

                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  Please verify that the Certificate ID was entered correctly (e.g. AAI-XXXX-XXXXXXXX), or verify that the student has completed graduation.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={() => {
                      setResult(null);
                      setQuery("");
                    }}
                    className="inline-flex items-center justify-center gap-2 bg-ink text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange transition-colors text-sm"
                  >
                    <Search className="w-4 h-4" /> Try Another ID
                  </button>
                  <Link
                    href="/"
                    className="inline-flex items-center justify-center gap-2 border border-ink/15 text-ink font-semibold px-5 py-2.5 rounded-xl hover:bg-paper transition-colors text-sm"
                  >
                    Return Home
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

export default function PublicCertificateVerifyPortalPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-orange" />
        </div>
      }
    >
      <PublicCertificateVerifyContent />
    </Suspense>
  );
}
