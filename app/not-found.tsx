import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-8 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-orange/[0.03] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[200px] h-[200px] bg-emerald/[0.03] rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

      <div className="text-center max-w-[520px] relative">
        {/* Large 404 with campaign styling */}
        <div className="mb-8">
          <span className="font-mono text-[13px] tracking-[0.18em] uppercase text-orange block mb-6">
            Edo North · 2027
          </span>
          <div className="flex items-center justify-center gap-4 mb-2">
            <span className="w-8 h-px bg-orange/40" />
            <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-orange/70">
              ERROR
            </span>
            <span className="w-8 h-px bg-orange/40" />
          </div>
          <h1 className="font-display font-semibold text-[clamp(80px,12vw,130px)] text-ink leading-none tracking-tight">
            404
          </h1>
        </div>

        {/* Message */}
        <h2 className="font-display font-semibold text-[clamp(22px,3vw,28px)] text-ink leading-tight mb-4">
          This page isn&apos;t on the ballot.
        </h2>
        <p className="text-[15.5px] text-slate leading-relaxed mb-3 max-w-[420px] mx-auto">
          The link you followed might have been moved, renamed, or it never existed in the first place. 
          Even the best campaigns lose a page sometimes.
        </p>
        <p className="text-[13.5px] text-slate/70 mb-10">
          Let&apos;s get you back on track.
        </p>

        {/* Action buttons */}
        <div className="flex gap-3.5 justify-center flex-wrap">
          <Link href="/" className="btn-solid">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Home
          </Link>
          <Link href="/contact" className="btn-ghost">
            Report a Broken Link
          </Link>
        </div>
      </div>
    </div>
  );
}
