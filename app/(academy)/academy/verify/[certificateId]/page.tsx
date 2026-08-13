import { createServerSupabase } from "@/lib/server";
import Link from "next/link";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

export default async function VerifyCertificatePage({ params }: { params: Promise<{ certificateId: string }> }) {
  const { certificateId } = await params;
  const supabase = await createServerSupabase();

  // Fetch the certificate and join student/programme data securely
  const { data: cert } = await supabase
    .from("certificates")
    .select(`
      certificate_id,
      created_at,
      students ( name ),
      programmes ( name )
    `)
    .eq("certificate_id", certificateId)
    .eq("status", "Issued")
    .single();

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center p-6">
      <div className="max-w-lg w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-ink text-white mb-4 font-bold text-xl">
            AA
          </div>
          <h1 className="font-display font-semibold text-2xl text-ink">Abubakari Aruna Institute</h1>
          <p className="text-slate text-sm mt-1">Certificate Verification System</p>
        </div>

        {cert ? (
          <div className="bg-white border border-emerald/20 rounded-site p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-5">
              <CheckCircle className="w-9 h-9" />
            </div>
            <h2 className="font-display font-semibold text-xl text-ink mb-2">Certificate Verified</h2>
            <p className="text-slate text-sm mb-6">
              This is to certify that the document is authentic and has been officially issued by the Abubakari Aruna Institute.
            </p>

            <div className="bg-paper rounded-site p-5 text-left space-y-3 border border-ink/5">
              <div className="flex justify-between items-center pb-3 border-b border-ink/10">
                <span className="font-mono text-[10px] uppercase text-slate tracking-wider">Recipient</span>
                {/* Added [0] because students is an array */}
                <span className="font-semibold text-ink text-sm">{cert.students?.[0]?.name || "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-ink/10">
                <span className="font-mono text-[10px] uppercase text-slate tracking-wider">Programme</span>
                {/* Added [0] because programmes is an array */}
                <span className="font-semibold text-ink text-sm text-right">{cert.programmes?.[0]?.name || "Unknown"}</span>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-ink/10">
                <span className="font-mono text-[10px] uppercase text-slate tracking-wider">Certificate ID</span>
                <span className="font-mono font-semibold text-ink text-xs">{cert.certificate_id}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-mono text-[10px] uppercase text-slate tracking-wider">Issue Date</span>
                <span className="font-semibold text-ink text-sm">
                  {new Date(cert.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-slate/60 mt-6 italic">
              If you believe this certificate was issued in error, please contact support@arunaedonorth.ng
            </p>
          </div>
        ) : (
          <div className="bg-white border border-red-200 rounded-site p-8 text-center shadow-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
              <XCircle className="w-9 h-9" />
            </div>
            <h2 className="font-display font-semibold text-xl text-ink mb-2">Invalid Certificate</h2>
            <p className="text-slate text-sm mb-6">
              We could not find a valid certificate matching the ID provided. Please check the ID and try again, or contact the institute for assistance.
            </p>
            <div className="bg-paper rounded-site p-3 text-left border border-ink/5">
              <span className="font-mono text-[10px] uppercase text-slate tracking-wider block mb-1">ID Scanned</span>
              <span className="font-mono font-semibold text-ink text-xs break-all">{certificateId}</span>
            </div>
          </div>
        )}

        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-slate hover:text-orange transition-colors text-sm font-medium">
            Go to Homepage <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}