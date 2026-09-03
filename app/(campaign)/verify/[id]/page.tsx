import { createServerSupabase } from "@/lib/server";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CheckCircle2, XCircle, ShieldCheck, ArrowLeft, Search, Calendar, MapPin, Award } from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

const skillMap: Record<string, string> = {
  media: "Media & Content",
  canvassing: "Canvassing",
  logistics: "Logistics",
  digital: "Digital / Social",
  mobilization: "Mobilization",
  events: "Event Support",
};

export default async function VerifyVolunteerPage({ params }: Props) {
  const { id } = await params;
  const clean = decodeURIComponent(id).trim();

  // If this identifier is an Academy certificate format, redirect to public certificate verification
  if (clean.toUpperCase().startsWith("AAI-") || clean.toUpperCase().startsWith("MAI-")) {
    redirect(`/verify/certificate/${encodeURIComponent(clean)}`);
  }

  const withSlashes = clean.replace(/-/g, "/");
  const withHyphens = clean.replace(/\//g, "-");
  const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(clean);

  const supabase = await createServerSupabase();

  let volunteer: any = null;

  // 1. Try exact and case-insensitive match on volunteer_id
  const candidates = Array.from(new Set([clean, withSlashes, withHyphens]));
  for (const val of candidates) {
    const { data, error } = await supabase
      .from("volunteers")
      .select("id, full_name, lga, skills, photo_url, volunteer_id, status, created_at")
      .ilike("volunteer_id", val)
      .maybeSingle();

    if (!error && data) {
      volunteer = data;
      break;
    }
  }

  // 2. If valid UUID, search by id column
  if (!volunteer && isUUID) {
    const { data, error } = await supabase
      .from("volunteers")
      .select("id, full_name, lga, skills, photo_url, volunteer_id, status, created_at")
      .eq("id", clean)
      .maybeSingle();

    if (!error && data) {
      volunteer = data;
    }
  }

  // 3. Fallback: search volunteer_id with wildcards
  if (!volunteer && clean.length >= 3) {
    const { data, error } = await supabase
      .from("volunteers")
      .select("id, full_name, lga, skills, photo_url, volunteer_id, status, created_at")
      .ilike("volunteer_id", `%${clean}%`)
      .maybeSingle();

    if (!error && data) {
      volunteer = data;
    }
  }

  const isVerified = !!volunteer;

  return (
    <div className="pt-28 pb-20 px-4 min-h-[80vh] flex flex-col items-center">
      <div className="max-w-xl w-full mx-auto">
        {/* Top Campaign Header */}
        <div className="text-center mb-8">
          <div className="w-18 h-18 mx-auto mb-3 rounded-full overflow-hidden border-2 border-orange/40 p-1 bg-white shadow-sm flex items-center justify-center">
            <Image
              src="/images/logo.png"
              alt="Campaign Badge"
              width={64}
              height={64}
              className="object-contain rounded-full"
            />
          </div>
          <h1 className="font-display font-extrabold text-2xl text-ink tracking-tight">
            Abubakari Aruna For Senate Campaign
          </h1>
          <p className="text-xs uppercase tracking-[0.2em] font-semibold text-orange mt-1">
            Official Volunteer Verification System
          </p>
        </div>

        {/* Verification Result Card */}
        {isVerified ? (
          <div className="bg-white border-2 border-emerald/30 rounded-site p-6 sm:p-8 shadow-xl overflow-hidden relative">
            {/* Status Header Badge */}
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

            {/* Volunteer Profile Header */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 pb-6 border-b border-ink/10">
              {/* Photo */}
              <div className="w-28 h-28 rounded-2xl border-[3px] border-orange overflow-hidden bg-gray-50 shrink-0 shadow-sm flex items-center justify-center relative">
                {volunteer.photo_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={volunteer.photo_url}
                    alt={volunteer.full_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-2">
                    <span className="text-3xl">👤</span>
                    <p className="text-[10px] text-gray-400 mt-1 font-bold">No Photo</p>
                  </div>
                )}
              </div>

              {/* Name & ID Details */}
              <div className="text-center sm:text-left flex-1">
                <span className="inline-block bg-orange/10 text-orange font-bold text-[10.5px] uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1">
                  Active Volunteer
                </span>
                <h2 className="font-display font-extrabold text-2xl text-ink leading-tight uppercase">
                  {volunteer.full_name}
                </h2>
                <p className="font-mono text-xs font-bold text-gray-700 tracking-wider mt-1">
                  ID: <span className="text-orange">{volunteer.volunteer_id}</span>
                </p>
                <p className="text-xs text-slate mt-1.5 flex items-center justify-center sm:justify-start gap-1">
                  <MapPin className="w-3.5 h-3.5 text-orange" />
                  <span>{volunteer.lga} LGA, Edo North</span>
                </p>
              </div>
            </div>

            {/* Credential Data Table */}
            <div className="py-5 space-y-3 border-b border-ink/10 text-xs">
              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5 text-orange" /> Area of Service
                </span>
                <span className="font-bold text-ink">
                  {volunteer.skills?.[0]
                    ? skillMap[volunteer.skills[0]] || volunteer.skills[0].toUpperCase()
                    : "General Volunteer"}
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-bold uppercase tracking-wider text-slate flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-orange" /> Registered Date
                </span>
                <span className="font-semibold text-ink">
                  {new Date(volunteer.created_at).toLocaleDateString("en-GB", {
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

            {/* Campaign Authorization Notice */}
            <div className="mt-5 p-3.5 bg-paper rounded-xl border border-ink/5">
              <p className="text-[11px] text-gray-700 leading-relaxed italic text-center">
                &ldquo;The bearer of this identification is authorized by the Abubakari Aruna Senatorial Campaign Organization to engage in mobilization and voter contact activities across Edo North.&rdquo;
              </p>
            </div>

            {/* Footer candidate sign-off */}
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
          /* Unverified / Not Found Card */
          <div className="bg-white border-2 border-red-200 rounded-site p-6 sm:p-8 shadow-xl text-center">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-9 h-9" />
            </div>
            <h2 className="font-display font-extrabold text-xl text-red-700 mb-2 uppercase tracking-wide">
              Invalid or Unregistered ID
            </h2>
            <p className="text-slate text-sm max-w-md mx-auto mb-6">
              We could not find an official volunteer record matching the scanned identifier:
            </p>

            <div className="bg-paper border border-ink/10 rounded-xl p-3 mb-6 inline-block max-w-full">
              <code className="font-mono font-bold text-xs text-ink break-all">
                {clean}
              </code>
            </div>

            <p className="text-xs text-gray-500 leading-relaxed mb-6">
              Please check that the ID was entered accurately, or verify that the volunteer has completed official registration.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/verify"
                className="inline-flex items-center justify-center gap-2 bg-ink text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange transition-colors text-sm"
              >
                <Search className="w-4 h-4" /> Verify Another ID
              </Link>
              <Link
                href="/volunteer"
                className="inline-flex items-center justify-center gap-2 bg-orange text-white font-bold px-5 py-2.5 rounded-xl hover:bg-orange-dark transition-colors text-sm"
              >
                Register as Volunteer
              </Link>
            </div>
          </div>
        )}

        {/* Back Link */}
        <div className="mt-8 text-center flex items-center justify-center gap-6 text-sm">
          <Link
            href="/verify"
            className="inline-flex items-center gap-1.5 text-slate hover:text-orange font-semibold transition-colors"
          >
            <Search className="w-4 h-4" /> Search Volunteer
          </Link>
          <span className="text-gray-300">•</span>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-slate hover:text-orange font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Campaign Home
          </Link>
        </div>
      </div>
    </div>
  );
}
