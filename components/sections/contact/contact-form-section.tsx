"use client";

import { useState } from "react";
import { createClient } from "@/lib/client";
import { SectionHead } from "../section-head";
import { delay } from "@/lib/animation";
import { Check, ArrowRight, Loader2 } from "lucide-react";

const topics = ["General Enquiry", "Volunteering", "Ward Issue", "Media / Press", "Event Invite"];

const lgas = ["Akoko-Edo", "Etsako Central", "Etsako East", "Etsako West", "Owan East", "Owan West", "Others outside Edo North"];

export function ContactFormSection() {
  const [activeTopic, setActiveTopic] = useState("General Enquiry");
  const [sending, setSending] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    lga: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);

    try {
      const supabase = createClient();
      await supabase.from("messages").insert([{
        type: "Contact",
        name: form.name,
        email: form.email,
        body: `Topic: ${activeTopic}\nPhone: ${form.phone}\nLGA: ${form.lga}\n\n${form.message}`,
      }]);
      setSubmitted(true);
    } catch (err) {
      alert("Something went wrong. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="py-22">
      <div className="max-w-site mx-auto px-8">
        <SectionHead number="SEND A MESSAGE" title={<>Tell Us What&apos;s on <span className="accent">Your Mind</span></>} />

        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-14 items-start">
          <form onSubmit={handleSubmit} className="bg-white border border-ink/12 rounded-site p-10 rise">
            {submitted ? (
              <div className="text-center py-8">
                <div className="w-14 h-14 rounded-full bg-emerald/10 text-emerald flex items-center justify-center mx-auto mb-4">
                  <Check className="w-7 h-7" />
                </div>
                <h3 className="font-display font-semibold text-xl mb-2">Message Sent</h3>
                <p className="text-sm text-slate">Thank you, {form.name.split(" ")[0]}. We typically respond within 48 hours.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display font-semibold text-2xl mb-1.5">Write to the Campaign</h3>
                <span className="font-mono text-[11.5px] tracking-wide text-slate block mb-7">WE REPLY WITHIN 48 HOURS</span>

                <div className="mb-4">
                  <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">What is this about?</label>
                  <div className="flex flex-wrap gap-2.5">
                    {topics.map((t) => (
                      <button key={t} type="button" onClick={() => setActiveTopic(t)}
                        className={`font-mono text-xs px-3.5 py-2 rounded-site border transition-colors ${
                          activeTopic === t ? "bg-forest text-white border-forest" : "bg-paper text-ink border-ink/15 hover:border-orange hover:text-orange"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Full Name</label>
                    <input type="text" required value={form.name} onChange={e => handleChange("name", e.target.value)}
                      placeholder="e.g. Ehizojie Osayande"
                      className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors" />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Email Address</label>
                    <input type="email" required value={form.email} onChange={e => handleChange("email", e.target.value)}
                      placeholder="you@example.com"
                      className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors" />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Phone Number</label>
                    <input type="tel" value={form.phone} onChange={e => handleChange("phone", e.target.value)}
                      placeholder="+234"
                      className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors" />
                  </div>
                  <div>
                    <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">LGA of Residence</label>
                    <select value={form.lga} onChange={e => handleChange("lga", e.target.value)}
                      className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors bg-white">
                      <option>Select LGA (optional)</option>
                      {lgas.map((o) => <option key={o}>{o}</option>)}
                    </select>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="font-mono text-[11px] tracking-wider uppercase text-slate block mb-2">Your Message</label>
                  <textarea required value={form.message} onChange={e => handleChange("message", e.target.value)}
                    rows={5} placeholder="Share the details. If it's a ward-level issue, mention your ward and town."
                    className="w-full px-4 py-3.5 border border-ink/18 rounded-site text-[14.5px] outline-none focus:border-orange transition-colors resize-vertical min-h-[130px]" />
                </div>

                <button type="submit" disabled={sending}
                  className="w-full bg-orange text-white py-4 rounded-site font-semibold text-[15px] hover:bg-orange-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-60">
                  {sending ? (
                    <>Sending... <Loader2 className="w-4 h-4 animate-spin" /></>
                  ) : (
                    <>Send Message <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>

                <p className="text-xs leading-relaxed text-slate mt-4">By sending this message you agree to be contacted by the campaign regarding your enquiry. We never share your details with third parties.</p>
              </>
            )}
          </form>

          <div className="space-y-6 rise" style={delay(120)}>
            <div className="bg-paper rounded-site p-8">
              <h4 className="font-display font-semibold text-lg mb-3.5">Constituency Office</h4>
              <div className="space-y-0">
                {[
                  { icon: "📍", title: "Address", text: "Aruna Campaign House\n14 Sapele Road, Auchi\nEtsako West, Edo State" },
                  { icon: "🕐", title: "Office Hours", text: "Mon – Fri · 9:00am – 5:00pm\nSat · 10:00am – 2:00pm" },
                  { icon: "✉️", title: "Email", text: "hello@arunaedonorth.ng", href: "mailto:hello@arunaedonorth.ng" },
                  { icon: "📞", title: "Phone", text: "+234 801 234 5678", href: "tel:+2348012345678" },
                ].map((item) => (
                  <div key={item.title} className="flex gap-3.5 items-start py-3.5 border-b border-ink/15 last:border-0 first:pt-0 last:pb-0">
                    <span className="text-lg text-orange shrink-0 mt-0.5">{item.icon}</span>
                    <div>
                      <h6 className="font-mono text-[10.5px] tracking-wider uppercase text-slate mb-1">{item.title}</h6>
                      {item.href ? (
                        <a href={item.href} className="text-sm text-ink hover:text-orange transition-colors whitespace-pre-line">{item.text}</a>
                      ) : (
                        <p className="text-sm text-ink whitespace-pre-line">{item.text}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-paper rounded-site p-8">
              <h4 className="font-display font-semibold text-lg mb-2">Follow the Campaign</h4>
              <p className="text-sm text-slate leading-relaxed mb-4">Daily updates from the field, town halls, and the road to 2027.</p>
              <div className="flex gap-3">
                {["facebook", "x", "instagram", "youtube"].map((s) => (
                  <a key={s} href="#" className="w-10 h-10 border border-ink/18 rounded-full flex items-center justify-center text-ink hover:bg-forest hover:text-white hover:border-forest hover:-translate-y-0.5 transition-all">
                    <span className="text-sm">{s === "facebook" ? "f" : s === "x" ? "𝕏" : s === "instagram" ? "📷" : "▶"}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
