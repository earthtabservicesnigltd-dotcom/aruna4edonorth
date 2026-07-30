"use client";

import { useState } from "react";
import { SectionHead } from "../section-head";
import { delay } from "@/lib/animation";
import { createClient } from "@/lib/client";
import { Loader2, CheckCircle } from "lucide-react";
import { toast } from "sonner";

const amounts = [2500, 5000, 10000, 25000, 50000, 100000];
const lgas = ["Akoko-Edo", "Etsako Central", "Etsako East", "Etsako West", "Owan East", "Owan West", "Others outside Edo North"];

export function GiveSection() {
  const [selected, setSelected] = useState(5000);
  const [custom, setCustom] = useState("");
  const [frequency, setFrequency] = useState("once");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [lga, setLga] = useState("");
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const amount = custom ? Number(custom) : selected;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !reference || amount < 100) return;

    setSubmitting(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.from("donations").insert([{
        donor: fullName,
        email,
        phone,
        lga: lga || null,
        amount,
        frequency,
        reference,
        method: "Bank Transfer",
        status: "Pending",
        date: new Date().toISOString().slice(0, 10),
      }]);

      if (error) throw error;
      setSubmitted(true);
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please try again.");
      console.error("Donation insert error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-22" id="give">
      <div className="max-w-site mx-auto px-8">
        {/* === SUCCESS SCREEN === */}
        <div className={submitted ? "block" : "hidden"}>
          <SectionHead number="THANK YOU" title={<>Donation <span className="accent">Submitted</span></>} />
          <div className="max-w-[600px] mx-auto text-center bg-white border border-ink/12 rounded-site p-12 rise">
            <CheckCircle className="w-16 h-16 text-emerald mx-auto mb-5" />
            <h3 className="font-display font-semibold text-2xl mb-2">Your donation has been recorded!</h3>
            <p className="text-slate mb-6">
              We&apos;ll confirm your transfer once it reflects in the campaign account. You&apos;ll receive a confirmation email shortly.
            </p>
            <div className="bg-paper rounded-site p-2 text-left space-y-2.5 text-sm mb-6">
              <div className="flex flex-col lg:flex-row justify-between"><span className="text-slate">Amount:</span><span className="font-semibold">₦{amount.toLocaleString()}</span></div>
              <div className="flex flex-col lg:flex-row justify-between"><span className="text-slate">Reference:</span><span className="font-mono text-xs">{reference}</span></div>
              <div className="flex flex-col lg:flex-row justify-between"><span className="text-slate">Status:</span><span className="text-amber font-semibold">Pending Confirmation</span></div>
            </div>
            <button onClick={() => setSubmitted(false)}
              className="text-orange font-semibold underline text-sm">
              Submit another donation
            </button>
          </div>
        </div>

        {/* === FORM SCREEN === */}
        <div className={submitted ? "hidden" : "block"}>
          <SectionHead number="CONTRIBUTE" title={<>Make a <span className="accent">Contribution</span></>} />

          <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-start">
            <form onSubmit={handleSubmit} className="bg-white border border-ink/12 rounded-site p-10 rise">
              <h3 className="font-display font-semibold text-2xl mb-1.5">Choose Your Amount</h3>
              <span className="font-mono text-[11.5px] tracking-wide text-slate block mb-7">ALL AMOUNTS IN NAIRA (₦)</span>

              {/* Frequency toggle */}
              <div className="flex border border-ink/15 rounded-site overflow-hidden mb-7">
                {["once", "monthly"].map((f) => (
                  <button key={f} type="button" onClick={() => setFrequency(f)}
                    className={`flex-1 py-3 text-sm font-medium transition-colors ${
                      frequency === f ? "bg-ink text-white" : "bg-white text-slate"
                    }`}
                  >
                    {f === "once" ? "One-time" : "Monthly"}
                  </button>
                ))}
              </div>

              {/* Amount grid */}
              <div className="grid grid-cols-3 gap-2.5 mb-4">
                {amounts.map((a) => (
                  <button key={a} type="button" onClick={() => { setSelected(a); setCustom(""); }}
                    className={`font-mono text-sm font-medium py-3.5 rounded-site border transition-colors ${
                      selected === a && !custom ? "bg-forest text-white border-forest" : "bg-paper text-ink border-ink/15 hover:border-orange hover:text-orange"
                    }`}
                  >
                    ₦{a.toLocaleString()}
                  </button>
                ))}
              </div>

              {/* Custom amount */}
              <div className="relative mb-7">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-mono text-sm text-slate">₦</span>
                <input type="number" value={custom} onChange={(e) => { setCustom(e.target.value); setSelected(0); }}
                  placeholder="Enter a custom amount" min={100}
                  className="w-full pl-8 pr-4 py-3.5 border border-ink/18 rounded-site font-mono text-[15px] outline-none focus:border-orange transition-colors"
                />
              </div>

              {/* Personal details */}
              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Full Name <span className="text-orange">*</span></label>
                  <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                    placeholder="e.g. Ehizojie Osayande"
                    className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Email Address <span className="text-orange">*</span></label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors" />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Phone Number <span className="text-orange">*</span></label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                    placeholder="+234"
                    className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors" />
                </div>
                <div>
                  <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">LGA of Residence</label>
                  <select value={lga} onChange={e => setLga(e.target.value)}
                    className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors bg-white">
                    <option value="">Select LGA (optional)</option>
                    {lgas.map((l) => <option key={l}>{l}</option>)}
                  </select>
                </div>
              </div>

              {/* Transaction reference */}
              <div className="mb-6 p-4 bg-amber/10 border border-amber/25 rounded-site">
                <p className="text-sm font-semibold text-ink mb-3">📸 After your transfer, enter the details below:</p>
                <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Transaction Reference <span className="text-orange">*</span></label>
                <input type="text" required value={reference} onChange={e => setReference(e.target.value)}
                  placeholder="e.g. GTB-1234567890 or your bank's reference"
                  className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors" />
                <p className="text-xs text-amber mt-2">⚠️ Don&apos;t send money and leave — submit this form so we can track your donation!</p>
              </div>

              <button type="submit" disabled={submitting || amount < 100}
                className="w-full bg-orange text-white py-4 rounded-site font-semibold text-[13px] lg:text-[15px] hover:bg-orange-dark transition-colors whitespace-nowrap disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Securing Payment...</>
                ) : (
                  <>Continue to Secure Payment →</>
                )}
              </button>

              <p className="text-xs leading-relaxed text-slate mt-4">Contributions are voluntary and not tax-deductible. By donating you confirm you are a Nigerian citizen in line with INEC regulations.</p>
            </form>

            {/* Sidebar — bank details */}
            <div className="space-y-6 rise" style={delay(120)}>
              <div className="bg-paper rounded-site p-8">
                <h4 className="font-display font-semibold text-lg mb-2">Direct Bank Transfer</h4>
                <p className="text-sm text-slate mb-4">Prefer to transfer directly? Use the campaign&apos;s official account.</p>
                {[
                  { label: "Account Name", value: "Friends of Aruna Abubakari Cttee" },
                  { label: "Bank", value: "GTBank Plc" },
                  { label: "Account Number", value: "0123456789" },
                  { label: "Sort Code", value: "058-152-036" },
                ].map((b) => (
                  <div key={b.label} className="flex justify-between py-2.5 border-b border-ink/15 last:border-0 text-[13.5px]">
                    <span className="text-slate">{b.label}</span>
                    <span className="font-mono font-semibold text-ink">{b.value}</span>
                  </div>
                ))}
              </div>

              <div className="bg-paper rounded-site p-8">
                <h4 className="font-display font-semibold text-lg mb-4">Other Ways to Give</h4>
                <div className="space-y-4">
                  {[
                    { icon: "📱", title: "USSD Transfer", text: "Dial *737# and follow the prompts to send directly." },
                    { icon: "🏢", title: "Visit the Constituency Office", text: "14 Sapele Road, Benin City — give in person." },
                    { icon: "👥", title: "Host a Fundraiser", text: "Organize a small gathering — we'll help you plan it." },
                  ].map((o) => (
                    <div key={o.title} className="flex gap-3.5 items-start">
                      <span className="text-lg text-orange shrink-0">{o.icon}</span>
                      <div>
                        <h6 className="font-display font-semibold text-[15px] mb-0.5">{o.title}</h6>
                        <p className="text-[13.5px] text-slate leading-relaxed">{o.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
