'use client'

import { useRef, useState, useEffect } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Smartphone } from 'lucide-react'

export interface CertificateData {
  certificate_id: string
  recipient_name: string
  certificate_title: string
  issued_at: string
  duration?: string
}

interface CertificateCardProps {
  cert: CertificateData
  showDownload?: boolean
}

export default function CertificateCard({ cert, showDownload = true }: CertificateCardProps) {
  const certRef = useRef<HTMLDivElement>(null)
  const [origin, setOrigin] = useState('')

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setOrigin(window.location.origin)
    }
  }, [])

  const issuedDate = new Date(cert.issued_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || origin || 'https://www.abubakariaruna4senate.com'
  const verifyUrl = `${siteUrl}/verify/certificate/${cert.certificate_id}`
  const durationText = cert.duration || '8 Weeks'

  // Clean title: remove any redundant "Professional Certificate in" prefix
  const cleanTitle = (cert.certificate_title || 'Programme')
    .replace(/^professional\s+certificate\s+in\s+/i, '')
    .replace(/^certificate\s+in\s+/i, '')
    .replace(/^professional\s+certificate\s+/i, '')
    .trim()

  // Dynamic font sizing for recipient name to guarantee clean single-line fit
  const nameLen = (cert.recipient_name || '').length
  const nameSize =
    nameLen > 32
      ? 'text-[15px] sm:text-[19px] md:text-[23px]'
      : nameLen > 22
      ? 'text-[18px] sm:text-[23px] md:text-[28px]'
      : 'text-[21px] sm:text-[28px] md:text-[34px]'

  async function downloadPDF() {
    if (!certRef.current) return
    const html2canvas = (await import('html2canvas-pro')).default
    const jsPDF = (await import('jspdf')).default

    const canvas = await html2canvas(certRef.current, {
      scale: 3,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#FAF8F5',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdfWidth = canvas.width / 3
    const pdfHeight = canvas.height / 3

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [pdfWidth, pdfHeight],
    })

    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${cert.certificate_id.replace(/\//g, '-')}.pdf`)
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-[1040px] mx-auto px-2 sm:px-4">
      
      {/* Certificate Outer Frame Container */}
      <div className="w-full rounded-xl shadow-2xl overflow-hidden border border-gray-300 bg-white">
        <div
          ref={certRef}
          className="relative w-full bg-[#FAF8F5] text-[#1E293B] font-sans flex flex-col justify-between overflow-hidden select-none"
          style={{ aspectRatio: '1.414 / 1', minHeight: '680px' }}
        >
          {/* ════════════════ PURE VECTOR BACKGROUND FRAME & WINGS (1024x724) ════════════════ */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-0"
            viewBox="0 0 1024 724"
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="goldRibbonGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#E6CF9B" />
                <stop offset="30%" stopColor="#C5A059" />
                <stop offset="70%" stopColor="#F9E2AF" />
                <stop offset="100%" stopColor="#9C772F" />
              </linearGradient>
            </defs>

            {/* ── Left Flared Wing ── */}
            <path
              d="M 0 724 L 0 190 C 16 260 52 380 94 498 C 120 573 147 638 187 724 Z"
              fill="#0A3C24"
            />
            <path
              d="M 0 724 L 0 280 C 14 340 40 430 72 535 C 97 610 128 670 162 724 Z"
              fill="#052818"
            />
            {/* Left Gold Ribbon Contour */}
            <path
              d="M 0 185 C 16 258 52 378 94 498 C 120 573 147 638 187 724 L 174 724 C 136 640 110 575 84 500 C 44 380 10 260 0 195 Z"
              fill="url(#goldRibbonGrad)"
            />

            {/* ── Right Flared Wing (Mirrored) ── */}
            <g transform="translate(1024, 0) scale(-1, 1)">
              <path
                d="M 0 724 L 0 190 C 16 260 52 380 94 498 C 120 573 147 638 187 724 Z"
                fill="#0A3C24"
              />
              <path
                d="M 0 724 L 0 280 C 14 340 40 430 72 535 C 97 610 128 670 162 724 Z"
                fill="#052818"
              />
              <path
                d="M 0 185 C 16 258 52 378 94 498 C 120 573 147 638 187 724 L 174 724 C 136 640 110 575 84 500 C 44 380 10 260 0 195 Z"
                fill="url(#goldRibbonGrad)"
              />
            </g>

            {/* ── Background Laurel Watermark ── */}
            <g opacity="0.045" fill="#0A3C24">
              <path d="M 120 500 C 95 440 68 360 68 260 C 68 160 110 80 170 15 C 150 40 140 80 140 130 C 115 105 75 105 60 140 C 45 175 70 210 98 220 C 70 235 45 260 45 295 C 45 330 85 350 110 360 C 85 385 70 420 85 455 Z" />
              <path d="M 170 55 C 140 80 128 118 142 155 C 170 128 198 90 198 55 Z" />
              <path d="M 132 165 C 100 190 92 228 115 265 C 148 238 160 200 150 165 Z" />
              <path d="M 120 270 C 88 295 80 332 108 370 C 140 342 148 305 135 270 Z" />
            </g>

            <g opacity="0.045" fill="#0A3C24" transform="translate(1024, 0) scale(-1, 1)">
              <path d="M 120 500 C 95 440 68 360 68 260 C 68 160 110 80 170 15 C 150 40 140 80 140 130 C 115 105 75 105 60 140 C 45 175 70 210 98 220 C 70 235 45 260 45 295 C 45 330 85 350 110 360 C 85 385 70 420 85 455 Z" />
              <path d="M 170 55 C 140 80 128 118 142 155 C 170 128 198 90 198 55 Z" />
              <path d="M 132 165 C 100 190 92 228 115 265 C 148 238 160 200 150 165 Z" />
              <path d="M 120 270 C 88 295 80 332 108 370 C 140 342 148 305 135 270 Z" />
            </g>

            {/* ── Double Gold Perimeter Borders ── */}
            <rect x="18" y="18" width="988" height="688" stroke="#C5A059" strokeWidth="1.5" />
            <rect x="25" y="25" width="974" height="674" stroke="#C5A059" strokeWidth="1" />

            {/* ── 4 Ornate Square Corner Filigree Brackets ── */}
            {/* Top Left */}
            <g transform="translate(18, 18)" stroke="#C5A059" fill="none">
              <rect x="2" y="2" width="12" height="12" strokeWidth="1.5" />
              <rect x="5.5" y="5.5" width="5" height="5" fill="#C5A059" />
              <path d="M 2 14 L 2 34" strokeWidth="1.5" />
              <path d="M 14 2 L 34 2" strokeWidth="1.5" />
              <path d="M 14 14 C 18 10 26 10 30 14 C 26 18 18 18 14 14 Z" fill="#C5A059" />
            </g>
            {/* Top Right */}
            <g transform="translate(1006, 18) scale(-1, 1)" stroke="#C5A059" fill="none">
              <rect x="2" y="2" width="12" height="12" strokeWidth="1.5" />
              <rect x="5.5" y="5.5" width="5" height="5" fill="#C5A059" />
              <path d="M 2 14 L 2 34" strokeWidth="1.5" />
              <path d="M 14 2 L 34 2" strokeWidth="1.5" />
              <path d="M 14 14 C 18 10 26 10 30 14 C 26 18 18 18 14 14 Z" fill="#C5A059" />
            </g>
            {/* Bottom Left */}
            <g transform="translate(18, 706) scale(1, -1)" stroke="#C5A059" fill="none">
              <rect x="2" y="2" width="12" height="12" strokeWidth="1.5" />
              <rect x="5.5" y="5.5" width="5" height="5" fill="#C5A059" />
              <path d="M 2 14 L 2 34" strokeWidth="1.5" />
              <path d="M 14 2 L 34 2" strokeWidth="1.5" />
              <path d="M 14 14 C 18 10 26 10 30 14 C 26 18 18 18 14 14 Z" fill="#C5A059" />
            </g>
            {/* Bottom Right */}
            <g transform="translate(1006, 706) scale(-1, -1)" stroke="#C5A059" fill="none">
              <rect x="2" y="2" width="12" height="12" strokeWidth="1.5" />
              <rect x="5.5" y="5.5" width="5" height="5" fill="#C5A059" />
              <path d="M 2 14 L 2 34" strokeWidth="1.5" />
              <path d="M 14 2 L 34 2" strokeWidth="1.5" />
              <path d="M 14 14 C 18 10 26 10 30 14 C 26 18 18 18 14 14 Z" fill="#C5A059" />
            </g>

            {/* Top Center Gold Chevron Ornament */}
            <g transform="translate(512, 25)" stroke="#C5A059" fill="none">
              <path d="M -20 0 L 0 9 L 20 0" strokeWidth="1.5" />
              <polygon points="0,11 -3,7 3,7" fill="#C5A059" stroke="none" />
            </g>
          </svg>

          {/* ════════════════ PURE DYNAMIC DOCUMENT FLOW (NO DEMO TEXT) ════════════════ */}
          <div className="relative z-10 h-full flex flex-col justify-between pt-5 sm:pt-6 pb-4 sm:pb-5 px-6 sm:px-14 md:px-20 text-center">
            
            {/* ──── 1. CREST & HEADER TITLES ──── */}
            <div className="flex flex-col items-center shrink-0">
              {/* Shield Logo */}
              <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 relative mb-0.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/36.png"
                  alt="Abubakari Aruna Institute"
                  className="w-full h-full object-contain"
                  crossOrigin="anonymous"
                />
              </div>

              {/* ABUBAKARI ARUNA INSTITUTE */}
              <h2 className="font-serif font-extrabold text-[#0A3C24] tracking-[0.18em] text-[15px] sm:text-[18px] md:text-[21px] uppercase mt-1 leading-none">
                ABUBAKARI ARUNA INSTITUTE
              </h2>

              {/* CERTIFICATE OF COMPLETION Sub-header */}
              <div className="flex items-center justify-center gap-2.5 mt-1.5 w-full max-w-sm">
                <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]" />
                <span className="text-[#C5A059] text-[8px] sm:text-[9.5px] font-bold tracking-[0.24em] uppercase">
                  ◆ &nbsp; CERTIFICATE OF COMPLETION &nbsp; ◆
                </span>
                <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]" />
              </div>

              {/* Symmetrical Scroll Flourish Glyphs */}
              <div className="text-[#C5A059] text-[9.5px] my-0.5 tracking-widest opacity-80 select-none">
                ❧ &nbsp; ❖ &nbsp; ❧
              </div>

              {/* Stately CERTIFICATE Header */}
              <h1 className="font-serif text-[#0A3C24] tracking-[0.16em] text-[32px] sm:text-[42px] md:text-[50px] font-normal leading-none uppercase mt-0.5">
                CERTIFICATE
              </h1>
              
              {/* — OF COMPLETION — */}
              <div className="flex items-center justify-center gap-3 w-full max-w-xs sm:max-w-sm mt-0.5">
                <div className="h-[1.5px] flex-1 bg-[#C5A059]" />
                <span className="text-[#C5A059] font-bold tracking-[0.3em] text-[10px] sm:text-[11.5px] uppercase">
                  OF COMPLETION
                </span>
                <div className="h-[1.5px] flex-1 bg-[#C5A059]" />
              </div>

              {/* Presentation Line */}
              <p className="text-gray-800 text-[12px] sm:text-[13.5px] font-medium mt-2">
                This certificate is proudly presented to
              </p>
            </div>

            {/* ──── 2. MIDDLE SECTION: REAL STUDENT NAME, REAL PROGRAMME & DEDICATION ──── */}
            <div className="flex flex-col items-center justify-center w-full my-auto py-0.5">
              
              {/* Real Student Name in Designated Space (Never overlaps, auto-scaled) */}
              <div className="my-0.5 sm:my-1 max-w-[85%] mx-auto flex items-center justify-center min-h-[28px] sm:min-h-[36px] px-2">
                <h2 className={`font-serif font-bold text-[#0A3C24] ${nameSize} tracking-[0.05em] uppercase leading-tight text-center line-clamp-1 truncate`}>
                  {cert.recipient_name}
                </h2>
              </div>

              {/* Gold Divider Line with Diamond Center */}
              <div className="flex items-center justify-center gap-2 my-1 w-full max-w-md">
                <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#C5A059]" />
                <span className="text-xs text-[#C5A059]">◆</span>
                <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#C5A059]" />
              </div>

              {/* Award sentence */}
              <p className="text-gray-600 text-[11px] sm:text-[12px] leading-tight max-w-lg mt-0.5">
                for successfully completing the requirements for the award of
              </p>
              <p className="text-gray-600 text-[11px] sm:text-[12px] leading-tight max-w-lg">
                the professional certificate in
              </p>

              {/* Real Enrolled Programme Title with flanked gold diamond arrow rules */}
              <div className="flex items-center justify-center gap-3 my-2 w-full max-w-2xl px-4">
                <div className="h-[1.5px] flex-1 bg-gradient-to-r from-transparent to-[#BA5D1E]" />
                <span className="text-xs text-[#BA5D1E]">◆</span>
                <h3 className="font-serif font-extrabold text-[#BA5D1E] text-[18px] sm:text-[23px] md:text-[26px] tracking-[0.08em] uppercase text-center shrink-0">
                  {cleanTitle}
                </h3>
                <span className="text-xs text-[#BA5D1E]">◆</span>
                <div className="h-[1.5px] flex-1 bg-gradient-to-l from-transparent to-[#BA5D1E]" />
              </div>

              {/* Dedication Statement citing Student's Real Name */}
              <p className="text-gray-600 text-[10px] sm:text-[11.5px] max-w-[600px] mx-auto text-center leading-relaxed">
                This certifies <strong className="text-gray-900 font-semibold">{cert.recipient_name}</strong>&apos;s commitment to learning, innovation, leadership, and personal development through the Abubakari Aruna Institute.
              </p>

              {/* 3-Column Metadata Pill Box */}
              <div className="w-full max-w-[550px] mx-auto mt-2.5 bg-white/95 border border-gray-300 rounded-xl py-2 px-3 sm:px-6 shadow-xs flex items-center justify-between text-center divide-x divide-gray-300">
                {/* Real Certificate Number */}
                <div className="flex-1 px-1 sm:px-3">
                  <p className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    CERTIFICATE NUMBER
                  </p>
                  <p className="text-[10px] sm:text-[11.5px] font-bold text-gray-900 font-mono mt-0.5 truncate">
                    {cert.certificate_id}
                  </p>
                </div>

                {/* Real Date Issued */}
                <div className="flex-1 px-1 sm:px-3">
                  <p className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    DATE ISSUED
                  </p>
                  <p className="text-[10px] sm:text-[11.5px] font-bold text-gray-900 mt-0.5">
                    {issuedDate}
                  </p>
                </div>

                {/* Real Duration */}
                <div className="flex-1 px-1 sm:px-3">
                  <p className="text-[8px] sm:text-[9px] font-bold text-gray-500 uppercase tracking-wider">
                    DURATION
                  </p>
                  <p className="text-[10px] sm:text-[11.5px] font-bold text-gray-900 mt-0.5">
                    {durationText}
                  </p>
                </div>
              </div>
            </div>

            {/* ──── 3. SEAL, AUTHENTIC SIGNATURE & LIVE QR CODE ROW ──── */}
            <div className="flex items-end justify-between w-full pt-1 pb-1 px-2 sm:px-6">
              
              {/* Left: Authentic Official Gold Embossed Seal Medallion */}
              <div className="flex flex-col items-center shrink-0 -mb-1">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/api/seal"
                    alt="Official Seal"
                    className="w-full h-full object-contain drop-shadow-md"
                  />
                </div>
              </div>

              {/* Center: Director Signature Block */}
              <div className="flex flex-col items-center text-center -mb-1">
                {/* Official Cursive Signature from User Image */}
                <div className="w-40 sm:w-48 h-10 sm:h-12 flex items-center justify-center -mb-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="/images/signature.png"
                    alt="Abubakari Aruna Signature"
                    className="h-full w-auto object-contain"
                  />
                </div>

                {/* Horizontal dividing line with center dot */}
                <div className="flex items-center justify-center gap-2 w-44 sm:w-56 mt-1">
                  <div className="h-[1px] flex-1 bg-gray-400" />
                  <div className="w-1.5 h-1.5 rounded-full bg-[#0A3C24]" />
                  <div className="h-[1px] flex-1 bg-gray-400" />
                </div>

                {/* Director Name & Title */}
                <p className="font-serif font-bold text-[#0A3C24] text-[13px] sm:text-[15px] leading-tight mt-1">
                  Hon. Abubakari Aruna
                </p>
                <p className="text-gray-500 text-[10px] sm:text-[11px] font-medium tracking-wide">
                  Director
                </p>

                {/* Symmetrical Bottom Flourish */}
                <div className="text-[#C5A059] text-[9px] mt-0.5 tracking-widest select-none">
                  ~ ❖ ~
                </div>
              </div>

              {/* Right: Real Verification QR Code */}
              <div className="flex flex-col items-center shrink-0 -mb-1">
                <div className="border border-gray-300 p-1.5 rounded-xl bg-white shadow-xs">
                  <QRCodeSVG
                    value={verifyUrl}
                    size={68}
                    fgColor="#0A3C24"
                    bgColor="#ffffff"
                    level="M"
                  />
                </div>
                {/* SCAN TO VERIFY Pill Badge */}
                <div className="bg-[#0A3C24] text-white px-2.5 py-1 rounded-full text-[8.5px] font-bold tracking-wider uppercase flex items-center gap-1 mt-1.5 shadow-xs">
                  <Smartphone className="w-2.5 h-2.5 text-[#C5A059]" />
                  <span>SCAN TO VERIFY</span>
                </div>
              </div>

            </div>

          </div>

        </div>
      </div>

      {/* Download PDF Action Button */}
      {showDownload && (
        <button
          onClick={downloadPDF}
          className="inline-flex items-center justify-center gap-2.5 bg-[#0A3C24] hover:bg-[#F97316] text-white font-bold px-8 py-3.5 rounded-xl transition-all shadow-lg text-sm uppercase tracking-wider w-full sm:w-auto mt-2 cursor-pointer"
        >
          <Download className="w-4 h-4" />
          Download Certificate (PDF)
        </button>
      )}
    </div>
  )
}