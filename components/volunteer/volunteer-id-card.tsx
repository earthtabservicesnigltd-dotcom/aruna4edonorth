// components/volunteer/volunteer-id-card.tsx
"use client";

import { useRef, useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Globe, Phone, Mail, Camera, Download } from "lucide-react";

interface VolunteerData {
  full_name: string;
  email: string;
  phone: string;
  lga: string;
  skills?: string[];
  volunteer_id: string;
  created_at?: string;
  photo_url?: string | null;
}

const skillMap: Record<string, string> = {
  media: "MEDIA & CONTENT",
  canvassing: "CANVASSING",
  logistics: "LOGISTICS",
  digital: "DIGITAL & SOCIAL",
  mobilization: "MOBILIZATION",
  events: "EVENT SUPPORT",
};

export function VolunteerIDCard({ volunteer }: { volunteer: VolunteerData }) {
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize photo with volunteer.photo_url if provided
  const [photo, setPhoto] = useState<string | null>(volunteer.photo_url || null);

  useEffect(() => {
    if (volunteer.photo_url) {
      setPhoto(volunteer.photo_url);
    }
  }, [volunteer.photo_url]);

  const fullName = (volunteer.full_name || "VOLUNTEER NAME").toUpperCase();
  const idNumber = (volunteer.volunteer_id || "AA/EDN/2027/0001").toUpperCase();

  // Determine display position
  const firstSkill = volunteer.skills?.[0];
  const position = firstSkill
    ? skillMap[firstSkill] || firstSkill.toUpperCase()
    : "VOLUNTEER";

  const [origin, setOrigin] = useState("");
  useEffect(() => {
    if (typeof window !== "undefined") {
      setOrigin(window.location.origin);
    }
  }, []);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || "https://www.abubakariaruna4senate.com";
  const verifyUrl = `${siteUrl}/verify/${idNumber.replace(/\//g, "-")}`;

  function handlePhotoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setPhoto(event.target.result);
      }
    };
    reader.readAsDataURL(file);
  }

  async function downloadCard(ref: React.RefObject<HTMLDivElement | null>, filename: string) {
    if (!ref.current) return;
    const html2canvas = (await import("html2canvas-pro")).default;
    const jsPDF = (await import("jspdf")).default;

    const canvas = await html2canvas(ref.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: null,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width / 3, canvas.height / 3],
    });
    pdf.addImage(imgData, "PNG", 0, 0, canvas.width / 3, canvas.height / 3);
    pdf.save(`${filename}.pdf`);
  }

  return (
    <div className="flex flex-col items-center gap-8 py-8 px-4 w-full">
      <div className="text-center">
        <h2 className="font-display text-3xl font-extrabold text-[#01381D] tracking-tight">
          OFFICIAL <span className="text-[#F97316]">VOLUNTEER ID</span>
        </h2>
        <p className="text-slate text-sm mt-1">
          Your photo is automatically placed in your card. You can also update it anytime below.
        </p>
      </div>

      {/* Hidden file input triggered by button or clicking photo */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handlePhotoUpload}
        className="hidden"
      />

      {/* Photo upload trigger button */}
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="cursor-pointer inline-flex items-center gap-2 bg-white border-2 border-[#F97316] text-[#01381D] font-bold rounded-xl px-5 py-2.5 hover:bg-[#F97316] hover:text-white transition-all shadow-sm group text-sm"
      >
        <Camera className="w-4 h-4 text-[#F97316] group-hover:text-white transition-colors" />
        <span>{photo ? "Change Card Photo" : "Upload Passport Photo"}</span>
      </button>

      {/* ── CARDS WRAPPER ── */}
      <div className="flex flex-col xl:flex-row gap-10 items-center justify-center w-full max-w-5xl">
        
        {/* ════════════════ FRONT CARD ════════════════ */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#01381D]/70 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
            Front Card
          </span>

          <div
            ref={frontRef}
            className="w-[350px] h-[560px] rounded-[28px] overflow-hidden shadow-2xl border border-gray-200/80 bg-white relative font-sans flex flex-col justify-between select-none"
            style={{ boxSizing: "border-box" }}
          >
            {/* Top SVG Header Swoosh */}
            <svg
              className="absolute top-0 left-0 w-full h-[125px] pointer-events-none z-0"
              viewBox="0 0 350 125"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Right orange swoosh curve */}
              <path
                d="M 170 0 C 235 25 315 50 350 115 L 350 0 Z"
                fill="#F97316"
              />
              {/* Dark forest green curved header */}
              <path
                d="M 0 0 L 350 0 L 350 30 C 305 16 235 18 175 32 C 105 48 55 76 0 76 Z"
                fill="#01381D"
              />
            </svg>

            {/* Upper Content: Photo + Headings */}
            <div className="relative z-10 pt-7 flex flex-col items-center w-full px-5">
              
              {/* Orange Rounded Photo Frame */}
              <div
                onClick={() => fileInputRef.current?.click()}
                title="Click to change photo"
                className="w-[155px] h-[155px] rounded-[24px] border-[3.5px] border-[#F97316] bg-[#F8FAFC] overflow-hidden relative cursor-pointer group shadow-sm flex items-center justify-center shrink-0"
              >
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photo}
                    alt="Volunteer"
                    className="w-full h-full object-cover rounded-[19px] transition-transform duration-300 group-hover:scale-105"
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-center p-3 text-gray-400 group-hover:text-[#F97316] transition-colors">
                    <Camera className="w-8 h-8 mb-1 opacity-70" />
                    <span className="text-[11px] font-bold tracking-wide">Upload Photo</span>
                  </div>
                )}
                {/* Subtle hover overlay */}
                <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-[19px]">
                  <span className="text-white text-xs font-semibold bg-[#01381D]/80 px-2 py-1 rounded">Change</span>
                </div>
              </div>

              {/* Candidate Name & Title */}
              <div className="text-center mt-3 w-full">
                <h3 className="text-[#01381D] font-black text-[20px] tracking-tight leading-none uppercase">
                  ABUBAKARI ARUNA
                </h3>
                
                {/* Orange For Senate with horizontal lines */}
                <div className="flex items-center justify-center gap-2 mt-1.5">
                  <div className="h-[2px] w-6 bg-[#F97316]" />
                  <span className="text-[#F97316] font-black text-[12px] tracking-[0.2em] uppercase leading-none">
                    FOR SENATE
                  </span>
                  <div className="h-[2px] w-6 bg-[#F97316]" />
                </div>

                <p className="text-[#01381D] font-bold text-[9.5px] tracking-[0.16em] uppercase mt-1 leading-none">
                  EDO NORTH SENATORIAL DISTRICT
                </p>
              </div>

              {/* Big Bold VOLUNTEER with Star */}
              <div className="text-center mt-3.5 w-full">
                <h1 className="text-[#01381D] font-black text-[32px] tracking-wider uppercase leading-none">
                  VOLUNTEER
                </h1>
                <div className="text-[#F97316] text-[16px] leading-none mt-1 select-none">
                  ★
                </div>
              </div>

              {/* Form details lines */}
              <div className="w-full px-4 space-y-2 mt-2.5">
                <div className="flex items-baseline border-b-[1.5px] border-gray-400/80 pb-0.5">
                  <span className="font-extrabold text-[#01381D] text-[11px] tracking-wider w-22 shrink-0">
                    NAME:
                  </span>
                  <span className="font-bold text-gray-900 text-[12px] truncate uppercase flex-1">
                    {fullName}
                  </span>
                </div>

                <div className="flex items-baseline border-b-[1.5px] border-gray-400/80 pb-0.5">
                  <span className="font-extrabold text-[#01381D] text-[11px] tracking-wider w-22 shrink-0">
                    ID NUMBER:
                  </span>
                  <span className="font-bold text-gray-900 text-[12px] tracking-wider truncate uppercase flex-1">
                    {idNumber}
                  </span>
                </div>

                <div className="flex items-baseline border-b-[1.5px] border-gray-400/80 pb-0.5">
                  <span className="font-extrabold text-[#01381D] text-[11px] tracking-wider w-22 shrink-0">
                    POSITION:
                  </span>
                  <span className="font-bold text-gray-900 text-[12px] truncate uppercase flex-1">
                    {position}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Swoosh & Website */}
            <div className="relative w-full h-[62px] mt-auto">
              {/* Bottom curves SVG */}
              <svg
                className="absolute bottom-0 left-0 w-full h-[62px] pointer-events-none z-0"
                viewBox="0 0 350 62"
                fill="none"
                preserveAspectRatio="none"
              >
                {/* Orange accent wave */}
                <path
                  d="M 0 32 C 80 10 240 40 350 20 L 350 28 C 240 48 80 18 0 40 Z"
                  fill="#F97316"
                />
                {/* Dark green bottom wave */}
                <path
                  d="M 0 36 C 90 15 250 44 350 25 L 350 62 L 0 62 Z"
                  fill="#01381D"
                />
              </svg>

              {/* Website Text */}
              <div className="absolute inset-0 flex items-center justify-center pt-3.5 z-10">
                <div className="flex items-center gap-1.5 text-white text-[10.5px] font-medium tracking-wide">
                  <Globe className="w-3.5 h-3.5 text-white/90" />
                  <span>www.abubakariaruna4senate.com</span>
                </div>
              </div>
            </div>

          </div>

          <button
            onClick={() => downloadCard(frontRef, `AA-ID-Front-${idNumber.replace(/\//g, "-")}`)}
            className="inline-flex items-center gap-2 bg-[#01381D] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#F97316] transition-colors text-sm shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Front
          </button>
        </div>

        {/* ════════════════ BACK CARD ════════════════ */}
        <div className="flex flex-col items-center gap-3">
          <span className="text-xs font-bold uppercase tracking-widest text-[#01381D]/70 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
            Back Card
          </span>

          <div
            ref={backRef}
            className="w-[350px] h-[560px] rounded-[28px] overflow-hidden shadow-2xl border border-gray-200/80 bg-white relative font-sans flex flex-col justify-between select-none"
            style={{ boxSizing: "border-box" }}
          >
            {/* Top Arch Shape SVG */}
            <svg
              className="absolute top-0 left-0 w-full h-[185px] pointer-events-none z-0"
              viewBox="0 0 350 185"
              fill="none"
              preserveAspectRatio="none"
            >
              {/* Dark green top background with center cutout */}
              <path
                d="M 0 0 L 350 0 L 350 65 C 270 148 80 148 0 65 Z"
                fill="#01381D"
              />
              {/* Orange arc contour */}
              <path
                d="M 0 65 C 80 148 270 148 350 65 L 350 72 C 270 156 80 156 0 72 Z"
                fill="#F97316"
              />
            </svg>

            {/* Circular Seal & Identification badge */}
            <div className="relative z-10 pt-4 flex flex-col items-center w-full px-5">
              {/* Official Seal Logo */}
              <div className="w-[136px] h-[136px] rounded-full overflow-hidden bg-white shadow-md border-2 border-white flex items-center justify-center p-0.5 shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/logo.png"
                  alt="Candidate Seal"
                  className="w-full h-full object-contain rounded-full"
                  crossOrigin="anonymous"
                />
              </div>

              {/* VOLUNTEER IDENTIFICATION Pill Badge */}
              <div className="mt-3">
                <div className="bg-[#01381D] text-white text-[10.5px] font-extrabold tracking-[0.12em] px-6 py-1.5 rounded-full uppercase shadow-xs">
                  VOLUNTEER IDENTIFICATION
                </div>
              </div>

              {/* Official statement */}
              <div className="mt-3.5 space-y-2 text-left w-full px-2">
                <p className="text-gray-800 text-[11.5px] font-medium leading-[1.45]">
                  This card identifies the bearer as an official volunteer for the Abubakari Aruna For Senate Campaign.
                </p>
                <p className="text-gray-800 text-[11.5px] font-medium leading-[1.45]">
                  The bearer is authorized to perform duties in support of the campaign.
                </p>
              </div>

              {/* Signature & QR Code Row */}
              <div className="w-full px-2 pt-2.5 flex items-end justify-between">
                {/* Left: Signature Block */}
                <div className="flex flex-col">
                  {/* Handwritten Candidate Signature */}
                  <div className="w-32 h-10 -mb-1">
                    <svg viewBox="0 0 160 48" className="w-full h-full text-[#01381D]" fill="none" stroke="currentColor">
                      <path
                        d="M 12 36 C 20 18 28 6 38 19 C 43 28 40 40 34 41 C 28 42 25 36 29 28 C 36 12 52 20 60 33 C 68 20 75 24 82 34 C 90 22 99 26 104 33 C 111 24 120 28 126 34 C 133 26 142 28 152 32"
                        strokeWidth="2.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M 18 42 Q 80 39 152 40"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="border-t border-[#01381D]/40 pt-1">
                    <p className="font-extrabold text-[#01381D] text-[12px] leading-tight">
                      Hon. Abubakari Aruna
                    </p>
                    <p className="text-[#F97316] font-bold text-[10px] tracking-wide leading-tight">
                      Senatorial Candidate
                    </p>
                  </div>
                </div>

                {/* Right: QR Code */}
                <div className="flex flex-col items-center">
                  <div className="border border-gray-300 p-1.5 rounded-xl bg-white shadow-xs">
                    <QRCodeSVG
                      value={verifyUrl}
                      size={68}
                      fgColor="#01381D"
                      bgColor="#ffffff"
                      level="M"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Contact + Slogan Strip */}
            <div className="relative z-10 mt-auto flex flex-col w-full">
              {/* Dark Green Contact Bar */}
              <div className="bg-[#01381D] text-white px-5 py-2.5 flex items-center justify-between">
                {/* Contact info list */}
                <div className="space-y-1 text-[9px] font-medium text-white/95">
                  <div className="flex items-center gap-1.5">
                    <Phone className="w-2.5 h-2.5 text-white/90 shrink-0" />
                    <span>0803 123 4567</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Mail className="w-2.5 h-2.5 text-white/90 shrink-0" />
                    <span>info@abubakariaruna4senate.com</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Globe className="w-2.5 h-2.5 text-white/90 shrink-0" />
                    <span>www.abubakariaruna4senate.com</span>
                  </div>
                </div>

                {/* Slogan */}
                <div className="text-right font-black text-[10.5px] leading-tight text-white tracking-wider">
                  <p>TOGETHER,</p>
                  <p>WE BUILD</p>
                  <p>EDO NORTH</p>
                </div>
              </div>

              {/* Bottom Orange Tagline Bar */}
              <div className="bg-[#F97316] py-1.5 text-center">
                <p className="text-white font-extrabold text-[9.5px] tracking-[0.16em] uppercase">
                  SERVICE &nbsp;•&nbsp; INTEGRITY &nbsp;•&nbsp; COMMITMENT
                </p>
              </div>
            </div>

          </div>

          <button
            onClick={() => downloadCard(backRef, `AA-ID-Back-${idNumber.replace(/\//g, "-")}`)}
            className="inline-flex items-center gap-2 bg-[#01381D] text-white font-bold px-6 py-2.5 rounded-xl hover:bg-[#F97316] transition-colors text-sm shadow-sm"
          >
            <Download className="w-4 h-4" /> Download Back
          </button>
        </div>

      </div>

      {/* Download Both Cards button */}
      <button
        onClick={async () => {
          const cleanId = idNumber.replace(/\//g, "-");
          await downloadCard(frontRef, `AA-ID-Front-${cleanId}`);
          await downloadCard(backRef, `AA-ID-Back-${cleanId}`);
        }}
        className="bg-[#F97316] text-white font-extrabold px-10 py-3.5 rounded-xl hover:bg-[#01381D] transition-all shadow-md uppercase tracking-wider text-sm inline-flex items-center gap-2.5 mt-2"
      >
        <Download className="w-5 h-5" />
        Download Both Cards (Front & Back)
      </button>
    </div>
  );
}
