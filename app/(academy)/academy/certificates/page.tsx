"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/client";
import { Loader2, Award, Lock, X } from "lucide-react";
import CertificateCard, { CertificateData } from "@/components/CertificateCard"; // Adjust path if needed

export default function CertificatesPage() {
  const supabase = createClient();
  const [loading, setLoading] = useState(true);
  const [programmes, setProgrammes] = useState<any[]>([]);
  const [earnedCerts, setEarnedCerts] = useState<any[]>([]);
  const [activeCert, setActiveCert] = useState<CertificateData | null>(null);
  const [studentName, setStudentName] = useState("");

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // 1. Get Student Profile (including their name)
        const { data: student } = await supabase
          .from("students")
          .select("id, name")
          .eq("email", user.email)
          .single();
          
        if (student) setStudentName(student.name);

        // 2. Get All Programmes
        const { data: progs } = await supabase
          .from("programmes")
          .select("id, name, blurb, cert")
          .eq("active", true)
          .order("name");
          
        setProgrammes(progs || []);

        // 3. Get Student's Earned Certificates
        if (student) {
          const { data: certs } = await supabase
            .from("certificates")
            .select("*")
            .eq("student_id", student.id);
          
          setEarnedCerts(certs || []);
        }
      }
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  if (loading) {
    return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-orange" /></div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <span className="font-mono text-[11px] tracking-widest text-orange block mb-2">DIGITAL BADGES</span>
        <h1 className="font-display font-semibold text-[clamp(24px,3vw,32px)] leading-tight text-ink">Certificates</h1>
        <p className="text-[14.5px] text-slate mt-2 max-w-[70ch] leading-relaxed">
          Earn a professional certificate for each programme you complete. Requirements: 80% attendance, all tasks submitted, and participation in the Saturday graduation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programmes.map((p) => {
          const earnedCert = earnedCerts.find(c => c.programme_id === p.id);
          const earned = !!earnedCert;

          return (
            <div key={p.id} className={`bg-white border rounded-site p-6 flex flex-col ${earned ? 'border-emerald/30 shadow-md' : 'border-ink/10 opacity-70'}`}>
              <div className="mb-4 flex items-start justify-between">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${earned ? 'bg-emerald/10 text-emerald' : 'bg-paper text-slate/40'}`}>
                  {earned ? <Award className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>
                <span className={`font-mono text-[10.5px] uppercase tracking-wide px-2.5 py-1 rounded-site ${earned ? 'bg-emerald/10 text-emerald' : 'bg-paper text-slate border border-ink/10'}`}>
                  {earned ? "Earned" : "Locked"}
                </span>
              </div>
              
              <h4 className="font-display font-semibold text-[17px] leading-tight mb-2 text-ink">{p.cert || `${p.name} Certificate`}</h4>
              <p className="text-[13px] text-slate leading-relaxed mb-5 flex-1">
                {earned ? "Click below to view and download your official certificate." : "Complete the cohort with 80% attendance and a submitted capstone to unlock."}
              </p>

              <button 
                onClick={() => {
                  if (earnedCert) {
                    setActiveCert({
                      certificate_id: earnedCert.certificate_id,
                      recipient_name: studentName,
                      certificate_title: p.name,
                      issued_at: earnedCert.created_at || new Date().toISOString(),
                      duration: "1 Week Intensive"
                    });
                  }
                }}
                className={`w-full py-3 rounded-site font-semibold text-[14px] transition-colors mt-auto ${earned ? 'bg-orange text-white hover:bg-orange-dark' : 'border border-ink/10 text-ink hover:border-orange hover:text-orange'}`}
              >
                {earned ? 'View Certificate' : 'View Requirements'}
              </button>
            </div>
          );
        })}
      </div>

      {/* Certificate Viewer Modal */}
      {activeCert && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" onClick={() => setActiveCert(null)}>
          <div className="relative max-w-5xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={() => setActiveCert(null)} 
              className="absolute -top-4 -right-4 z-50 bg-white text-ink rounded-full p-2 shadow-lg hover:bg-orange hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <CertificateCard cert={activeCert} />
          </div>
        </div>
      )}
    </div>
  );
}