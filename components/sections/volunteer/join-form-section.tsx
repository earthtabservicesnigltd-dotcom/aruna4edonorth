"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { VolunteerIDCard } from "@/components/volunteer/volunteer-id-card";

const skillOptions = [
  { id: "media", icon: "🎥", label: "Media & Content" },
  { id: "canvassing", icon: "🚶", label: "Canvassing" },
  { id: "logistics", icon: "📦", label: "Logistics" },
  { id: "digital", icon: "💻", label: "Digital / Social" },
  { id: "mobilization", icon: "👥", label: "Mobilization" },
  { id: "events", icon: "📅", label: "Event Support" },
];

interface FormData {
  full_name: string;
  phone: string;
  email: string;
  lga: string;
  skills: string[];
  photo_url?: string | null;
}

export function JoinFormSection() {
  const [step, setStep] = useState<"form" | "review" | "card">("form");
  const [formData, setFormData] = useState<FormData>({
    full_name: "",
    phone: "",
    email: "",
    lga: "",
    skills: [],
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [volunteerData, setVolunteerData] = useState<any>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null!);
  const sectionRef = useRef<HTMLElement>(null!);

  // Scroll to the section when step changes
  useEffect(() => {
    if (sectionRef.current) {
      sectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [step]);

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleSkill = (skillId: string) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.includes(skillId)
        ? prev.skills.filter((s) => s !== skillId)
        : [...prev.skills, skillId],
    }));
  };

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      toast.error("Photo is too large. Maximum size is 2MB.");
      e.target.value = "";
      setPhoto(null);
      setPhotoPreview(null);
      return;
    }
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  const handleReview = (e: React.FormEvent) => {
    e.preventDefault();
    setFormData((prev) => ({ ...prev, photo_url: photoPreview }));
    setStep("review");
  };

  const goBackToForm = () => {
    setStep("form");
    if (!photoPreview && formData.photo_url) {
      setPhotoPreview(formData.photo_url);
    }
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    setDialogOpen(false);
    try {
      let photoBase64 = "";
      if (photo) {
        const reader = new FileReader();
        photoBase64 = await new Promise((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(photo);
        });
      }
      const response = await fetch("/api/volunteers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, photoBase64 }),
      });
      if (!response.ok) throw new Error("Submission failed");
      const result = await response.json();
      setVolunteerData({ ...result.volunteer, photo_url: photoPreview });
      setStep("card");
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const show = (s: string) => (step === s ? "block" : "hidden");

  return (
    <section ref={sectionRef} className="py-20 pb-25" id="join-form">
      <div className="max-w-site mx-auto px-8">
        {/* === ID CARD === */}
        <div className={show("card")}>
          {volunteerData && (
            <div>
              <div className="text-center mb-8">
                <span className="text-5xl block mb-4">🎉</span>
                <h2 className="font-display text-[clamp(26px,3vw,36px)] font-semibold mb-2">
                  You&apos;re Officially a Volunteer!
                </h2>
                <p className="text-slate max-w-[500px] mx-auto">
                  Download your ID card below.
                </p>
              </div>
              <VolunteerIDCard volunteer={volunteerData} />
            </div>
          )}
        </div>

        {/* === REVIEW === */}
        <div className={show("review")}>
          <button
            onClick={goBackToForm}
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-wide uppercase text-slate mb-6 hover:text-orange hover:gap-3 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Edit Information
          </button>

          <div className="max-w-[600px] mx-auto">
            <h2 className="font-display font-semibold text-[clamp(26px,3vw,36px)] mb-2">
              Review Your Details
            </h2>
            <p className="text-slate mb-8">
              Please confirm your information before generating your ID card.
            </p>

            <div className="bg-white border border-ink/12 rounded-site p-8 space-y-5 mb-8">
              {photoPreview && (
                <div className="flex justify-center pb-4 border-b border-ink/10 mb-2">
                  <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-ink">
                    <Image
                      src={photoPreview}
                      alt="Your photo"
                      width={80}
                      height={80}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              {[
                { label: "Full Name", value: formData.full_name },
                { label: "Phone Number", value: formData.phone },
                { label: "Email Address", value: formData.email },
                { label: "LGA of Residence", value: formData.lga },
                {
                  label: "Skills",
                  value: formData.skills
                    .map((s) => {
                      const sk = skillOptions.find((o) => o.id === s);
                      return sk ? `${sk.icon} ${sk.label}` : s;
                    })
                    .join(", "),
                },
              ].map((field) => (
                <div
                  key={field.label}
                  className="flex justify-between items-center py-3 border-b border-ink/10 last:border-0"
                >
                  <span className="font-mono text-[10.5px] tracking-wider uppercase text-slate">
                    {field.label}
                  </span>
                  <span className="text-sm font-medium text-ink text-right max-w-[60%]">
                    {field.value}
                  </span>
                </div>
              ))}
            </div>

            <Button
              onClick={() => setDialogOpen(true)}
              disabled={submitting}
              className="w-full bg-orange hover:bg-orange-dark text-white py-6 text-base font-semibold"
            >
              {submitting ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
              ) : (
                <>✓ Confirm & Generate ID Card</>
              )}
            </Button>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle className="font-display text-xl">
                  Confirm Submission
                </DialogTitle>
                <DialogDescription>
                  Are you sure all your information is correct?
                </DialogDescription>
              </DialogHeader>
              <div className="bg-paper rounded-site p-4 text-sm space-y-2">
                <p><strong>Name:</strong> {formData.full_name}</p>
                <p><strong>Phone:</strong> {formData.phone}</p>
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>LGA:</strong> {formData.lga}</p>
              </div>
              <DialogFooter className="gap-2">
                <Button variant="outline" onClick={() => setDialogOpen(false)}>
                  Go Back
                </Button>
                <Button
                  onClick={handleConfirm}
                  className="bg-orange hover:bg-orange-dark text-white"
                >
                  Yes, Submit & Generate Card
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* === FORM === */}
        <div className={show("form")}>
          <div className="grid md:grid-cols-[0.85fr_1.15fr] border border-ink/12 rounded-site overflow-hidden rise">
            <div className="bg-ink text-white p-10 md:p-12 flex flex-col justify-center">
              <span className="font-mono text-[11px] tracking-widest text-orange mb-4 block">
                Sign Up
              </span>
              <h2 className="font-display font-semibold text-[clamp(26px,2.8vw,36px)] leading-tight mb-5">
                Ready to <span className="text-orange italic">Get Involved?</span>
              </h2>
              <p className="text-[15px] leading-relaxed text-white/72 mb-7">
                Fill in your details and tell us how you&apos;d like to help.
              </p>
              <ul className="space-y-3">
                {[
                  "No experience needed, just commitment",
                  "Flexible roles that fit your schedule",
                  "Be part of a district-wide movement",
                ].map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 items-start text-[14.5px] text-white/85"
                  >
                    <span className="text-orange shrink-0">✓</span> {item}
                  </li>
                ))}
              </ul>
            </div>

            <form onSubmit={handleReview} className="bg-white p-10 md:p-12">
              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="font-mono text-[10.5px] tracking-wider uppercase text-slate block mb-2">
                    Full Name <span className="text-orange">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aisha Momoh"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    className="w-full px-4 py-3.5 border border-ink/20 rounded-site text-[15px] text-ink outline-none focus:border-orange transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10.5px] tracking-wider uppercase text-slate block mb-2">
                    Phone Number <span className="text-orange">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. 0803 000 0000"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full px-4 py-3.5 border border-ink/20 rounded-site text-[15px] text-ink outline-none focus:border-orange transition-colors"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="font-mono text-[10.5px] tracking-wider uppercase text-slate block mb-2">
                    Email Address <span className="text-orange">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="you@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full px-4 py-3.5 border border-ink/20 rounded-site text-[15px] text-ink outline-none focus:border-orange transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10.5px] tracking-wider uppercase text-slate block mb-2">
                    LGA of Residence <span className="text-orange">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Etsako West"
                    value={formData.lga}
                    onChange={(e) => handleInputChange("lga", e.target.value)}
                    className="w-full px-4 py-3.5 border border-ink/20 rounded-site text-[15px] text-ink outline-none focus:border-orange transition-colors"
                  />
                </div>
              </div>

              {/* Photo Upload */}
              <div className="flex flex-col items-center gap-3 pb-6 mb-4 border-b border-ink/10">
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-36 h-36 rounded-full border-4 border-dashed border-orange flex items-center justify-center cursor-pointer hover:border-orange/80 transition-colors overflow-hidden bg-gray-50"
                >
                  {photoPreview ? (
                    <Image
                      src={photoPreview}
                      alt="Preview"
                      width={144}
                      height={144}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="text-center">
                      <div className="text-3xl">📷</div>
                      <p className="text-xs text-gray-400 mt-1">Upload Photo</p>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  Passport photo • JPG, PNG or WebP • Max 2MB
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>

              <span className="font-mono text-[10.5px] tracking-wider uppercase text-slate block mb-3">
                Your Skills
              </span>
              <div className="grid grid-cols-2 gap-2.5 mb-7">
                {skillOptions.map((s) => {
                  const selected = formData.skills.includes(s.id);
                  return (
                    <label
                      key={s.id}
                      className={`flex items-center gap-2.5 px-3.5 py-3 border rounded-site cursor-pointer transition-colors ${
                        selected
                          ? "border-forest bg-emerald/6 font-semibold"
                          : "border-ink/20 hover:border-orange"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => toggleSkill(s.id)}
                        className="sr-only"
                      />
                      <span className="text-base">{s.icon}</span>
                      <span className="text-sm">{s.label}</span>
                      {selected && (
                        <Check className="w-3.5 h-3.5 ml-auto text-forest" />
                      )}
                    </label>
                  );
                })}
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-orange text-white py-4 rounded-site font-semibold text-[15.5px] hover:bg-orange-dark transition-colors flex items-center justify-center gap-2.5 disabled:opacity-60"
              >
                {submitting ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Processing...</>
                ) : (
                  <>👍 Review & Generate ID Card</>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
