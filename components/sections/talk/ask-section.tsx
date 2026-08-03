"use client";

import { useState } from "react";
import { SectionHead } from "../section-head";
import { delay } from "@/lib/animation";
import { createClient } from "@/lib/client";
import { siteConfig } from "@/lib/site-config";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const prompts = [
  "What will you do for youth in Edo North?",
  "How will you improve agriculture?",
  "What is your security plan?",
];

const steps = [
  { n: "1", title: "You ask", text: "Send your question here or on WhatsApp. Every submission is read by a real person." },
  { n: "2", title: "We sort", text: "Each week the team groups questions by theme and flags the ones on Edo North's mind." },
  { n: "3", title: "Abubakari answers", text: "Selected questions get a direct public answer, posted here and across our channels." },
];

export function AskSection() {
  const [name, setName] = useState("");
  const [lga, setLga] = useState("");
  const [contact, setContact] = useState("");
  const [question, setQuestion] = useState("");
  const [publicConsent, setPublicConsent] = useState(true);
  
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !contact || !question) {
      toast.error("Please fill in your name, contact, and question.");
      return;
    }

    setSending(true);
    try {
      const supabase = createClient();
      
      // Format body to include LGA and Consent since they aren't separate columns
      const formattedBody = `LGA: ${lga || "Not provided"}\nPublic Consent: ${publicConsent ? "Yes" : "No"}\n\nQuestion: ${question}`;
      
      const { error } = await supabase.from("messages").insert([
        {
          type: "Talk", // Now valid because of our SQL update in Step 1
          name: name,
          email: contact, // Storing email OR phone here safely
          body: formattedBody,
          read: false,
        },
      ]);

      if (error) throw error;

      setSubmitted(true);
      toast.success("Question sent successfully!");
    } catch (error: any) {
      console.error(error);
      toast.error("Failed to send question. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-22" id="ask">
      <div className="max-w-site mx-auto px-8">
        <SectionHead number="YOUR QUESTION" title={<>Send It <span className="accent">Straight Through</span></>} />

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-start">
          <div className="bg-white border border-ink/12 rounded-site p-10 rise">
            <h3 className="font-display font-semibold text-2xl mb-1.5">Ask a Question</h3>
            <span className="font-mono text-[11.5px] tracking-wide text-slate block mb-7">GOES DIRECTLY TO THE CAMPAIGN TEAM</span>

            {submitted ? (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-4 text-3xl">✅</div>
                <h3 className="font-display font-semibold text-2xl mb-2">Question Received!</h3>
                <p className="text-slate mb-6">Thank you, {name.split(" ")[0]}. Your question is now with the campaign team.</p>
                <button 
                  onClick={() => { setSubmitted(false); setName(""); setContact(""); setQuestion(""); setLga(""); }}
                  className="text-orange font-semibold underline text-sm"
                >
                  Ask another question
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <p className="font-mono text-[11px] tracking-wider uppercase text-slate mb-3">Not sure where to start? Tap a prompt</p>
                <div className="space-y-2.5 mb-7">
                  {prompts.map((p) => (
                    <button key={p} type="button" onClick={() => setQuestion(p)}
                      className="flex items-center gap-3 w-full text-left bg-paper border border-ink/12 text-ink text-[14.5px] px-4 py-3.5 rounded-site hover:border-orange hover:pl-5 transition-all"
                    >
                      <span className="text-orange">💬</span> {p}
                    </button>
                  ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Full Name</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ehizojie Osayande" required
                      className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors" />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">LGA / Ward</label>
                    <select value={lga} onChange={(e) => setLga(e.target.value)}
                      className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors bg-white">
                      <option value="">Select LGA (optional)</option>
                      <option>Akoko-Edo</option><option>Etsako Central</option><option>Etsako East</option>
                      <option>Etsako West</option><option>Owan East</option><option>Owan West</option>
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Email or Phone (so we can reply)</label>
                  <input type="text" value={contact} onChange={(e) => setContact(e.target.value)} placeholder="you@example.com  ·  +234" required
                    className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors" />
                </div>

                <div className="mb-4">
                  <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Your Question</label>
                  <textarea rows={4} value={question} onChange={(e) => setQuestion(e.target.value)} maxLength={600} placeholder="Ask Abubakari anything." required
                    className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors resize-vertical min-h-[130px]" />
                </div>

                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center gap-2 text-sm text-ink cursor-pointer">
                    <input type="checkbox" checked={publicConsent} onChange={(e) => setPublicConsent(e.target.checked)} className="accent-orange" /> Happy for this to be answered publicly
                  </label>
                  <span className="font-mono text-[11.5px] text-slate">{question.length}/600</span>
                </div>

                <button type="submit" disabled={sending}
                  className="w-full bg-orange text-white py-4 rounded-site font-semibold text-[15px] hover:bg-orange-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {sending ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                  ) : (
                    "Send My Question →"
                  )}
                </button>

                <p className="text-xs leading-relaxed text-slate mt-4">Questions may be edited for length and clarity. We never publish your contact details.</p>
              </form>
            )}
          </div>

          <div className="space-y-6 rise" style={delay(120)}>
            <div className="bg-ink text-white rounded-site p-8">
              <h4 className="font-display font-semibold text-lg flex items-center gap-2.5 mb-3">
                <span className="text-[#25D366] text-xl">💬</span> Prefer WhatsApp?
              </h4>
              <p className="text-sm text-white/62 leading-relaxed mb-4">Send a voice note or text straight to the field team.</p>
              <a href={`https://wa.me/${siteConfig.whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-white py-3.5 rounded-[34px] font-semibold text-sm hover:scale-105 transition-all">
                💬 Message on WhatsApp
              </a>
              <p className="font-mono text-[11px] tracking-wide text-white/45 text-center mt-4">REPLIES MON–SAT · 9AM–6PM WAT</p>
            </div>

            <div className="bg-paper rounded-site p-8">
              <h4 className="font-display font-semibold text-lg mb-2">How It Works</h4>
              <p className="text-sm text-slate mb-5">Three steps from your question to a real answer.</p>
              <div className="space-y-0">
                {steps.map((s) => (
                  <div key={s.n} className="flex gap-4 items-start py-4 border-b border-ink/15 last:border-0 first:pt-0">
                    <span className="font-display font-bold text-lg text-orange leading-none w-6 shrink-0">{s.n}</span>
                    <div>
                      <h6 className="font-semibold text-[14.5px] mb-0.5">{s.title}</h6>
                      <p className="text-[13.5px] leading-relaxed text-slate">{s.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}