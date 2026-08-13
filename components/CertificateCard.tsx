'use client'

import { useRef } from 'react'
import { QRCodeSVG } from 'qrcode.react'
import Image from 'next/image'

export interface CertificateData {
  certificate_id: string
  recipient_name: string
  certificate_title: string
  issued_at: string
  duration: string
}

interface CertificateCardProps {
  cert: CertificateData
  showDownload?: boolean
}

export default function CertificateCard({ cert, showDownload = true }: CertificateCardProps) {
  const certRef = useRef<HTMLDivElement>(null)

  const issuedDate = new Date(cert.issued_at).toLocaleDateString('en-GB', {
    day: '2-digit', month: 'long', year: 'numeric',
  })

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://mai4senate.com').replace(/\/$/, '')
  const verifyUrl = `${siteUrl}/academy/verify/${cert.certificate_id}`

  async function downloadPDF() {
    if (!certRef.current) return
    const html2canvas = (await import('html2canvas-pro')).default
    const jsPDF = (await import('jspdf')).default

    const canvas = await html2canvas(certRef.current, {
      scale: 3, // High resolution for PDF
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
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
    <div className="flex flex-col items-center gap-6 w-full">
      <div className="w-full max-w-[1000px] rounded-xl shadow-2xl overflow-hidden">
        
        {/* Adjusted Aspect Ratio to 1.2 / 1 for extra height */}
        <div 
          ref={certRef} 
          className="relative w-full bg-white font-sans border border-[#01381d] flex flex-col overflow-hidden"
          style={{ aspectRatio: '1.2 / 1' }}
        >
          {/* Thin Gold Inner Border */}
          <div className="absolute inset-1.5 sm:inset-3 md:inset-4 border sm:border-2 md:border-[3px] border-[#D4AF37] pointer-events-none z-0"></div>
          
          {/* Subtle Watermark */}
          <div className="absolute inset-0 flex items-center justify-center z-0 opacity-[0.03] pointer-events-none p-4">
            <Image src="/images/36.png" alt="Watermark" width={500} height={500} className="w-1/2 max-w-[300px] h-auto" />
          </div>

          {/* Content Wrapper */}
          <div className="relative z-10 h-full flex flex-col justify-between p-4 sm:p-6 md:p-12 text-center">
            
            {/* ============ TOP SECTION ============ */}
            <div className="flex flex-col items-center shrink-0">
              <div className="flex items-center justify-center mb-1">
                <Image src="/images/36.png" alt="Abubakari Aruna Institute" width={50} height={50} className="object-contain mr-2 w-6 h-6 sm:w-10 sm:h-10 md:w-[50px] md:h-[50px]" />
                <div className="text-left border-l border-[#D4AF37] pl-2">
                  <h1 className="font-bold text-[#01381d] leading-none tracking-tight text-[8px] sm:text-lg md:text-2xl">Abubakari Aruna Institute</h1>
                  <p className="text-[#D4AF37] tracking-[0.3em] font-semibold mt-1 uppercase text-[4px] sm:text-[8px] md:text-[10px]">Inspire • Reform • Impact</p>
                </div>
              </div>
              
              <p className="text-[#01381d] font-medium tracking-[0.2em] uppercase mt-2 mb-1 text-[5px] sm:text-xs md:text-sm">Proudly Presented To</p>
              <h1 className="font-serif font-bold text-[#01381d] tracking-wide leading-none text-[10px] sm:text-2xl md:text-4xl">
                CERTIFICATE OF COMPLETION
              </h1>
              <div className="flex items-center justify-center gap-1.5 mt-2">
                <div className="h-px sm:h-[2px] w-4 sm:w-12 md:w-16 bg-[#D4AF37]" />
                <div className="w-1 h-1 sm:w-2 sm:h-2 rotate-45 bg-[#D4AF37]"></div>
                <div className="h-px sm:h-[2px] w-4 sm:w-12 md:w-16 bg-[#D4AF37]" />
              </div>
            </div>

            {/* ============ MIDDLE SECTION ============ */}
            <div className="flex flex-col items-center justify-center w-full py-1 sm:py-2">
              <p
                className="text-[#01381d] font-bold mb-1 leading-tight text-base sm:text-4xl md:text-6xl"
                style={{ fontFamily: 'var(--font-dancing), cursive' }}
              >
                {cert.recipient_name}
              </p>
              
              <div className="w-12 sm:w-32 md:w-48 h-px bg-[#01381d]/20 my-1 sm:my-4 md:my-6"></div>

              <p className="text-gray-600 mb-1 max-w-[85%] sm:max-w-md md:max-w-xl mx-auto leading-relaxed text-[6px] sm:text-xs md:text-sm">
                In recognition of the successful completion of all required courses, assessments, and the capstone project for the
              </p>
              
              <p className="text-[#01381d] font-bold tracking-wide uppercase border-b border-[#D4AF37] pb-1 px-2 text-[8px] sm:text-xl md:text-3xl">
                {cert.certificate_title}
              </p>
              
              <p className="text-gray-500 max-w-xs sm:max-w-sm md:max-w-lg mx-auto leading-relaxed italic mt-2 text-[5px] sm:text-[10px] md:text-xs">
                &ldquo;This certificate signifies the recipient&apos;s dedication to continuous learning, leadership excellence, and service to society.&rdquo;
              </p>
            </div>

            {/* ============ BOTTOM SECTION ============ */}
            <div className="flex items-end justify-between gap-4 sm:gap-8 md:gap-12 w-full shrink-0 px-2 sm:px-6 mb-4 sm:mb-8 md:mb-10">
              
              {/* Left Signature */}
              <div className="text-left w-1/4 sm:w-[200px]">
                <p className="text-[#01381d] mb-0.5 text-[8px] sm:text-xl md:text-2xl truncate" style={{ fontFamily: 'var(--font-dancing), cursive' }}>
                  Aruna Abubakari
                </p>
                <div className="border-t border-[#01381d] pt-0.5">
                  <p className="font-bold text-[#01381d] text-[4px] sm:text-[10px] md:text-[11px] leading-tight">Comr. Aruna Abubakari</p>
                  <p className="text-[#D4AF37] font-semibold uppercase tracking-wider text-[3px] sm:text-[8px] md:text-[9px]">Founder, MAI Academy</p>
                </div>
              </div>

              {/* Center Gold Seal */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-7 h-7 sm:w-16 sm:h-16 md:w-24 md:h-24 rounded-full border-[1px] sm:border-2 md:border-4 border-[#D4AF37] flex items-center justify-center bg-gradient-to-br from-[#FDF3E6] to-[#D4AF37] shadow-lg">
                  <div className="text-center">
                    <p className="font-black text-[#01381d] leading-tight text-[3px] sm:text-[7px] md:text-[8px]">ABUBAKARI<br />ARUNA<br />INSTITUTE</p>
                  </div>
                </div>
              </div>

              {/* Right QR Code */}
              <div className="flex flex-col items-center w-1/4 sm:w-[200px]">
                <div className="bg-[#01381d] text-white font-bold px-1 py-0.5 rounded-t tracking-wider text-[3px] sm:text-[8px]">SCAN TO VERIFY</div>
                
                <div className="relative w-7 h-7 sm:w-16 sm:h-16 md:w-16 md:h-16 border border-[#01381d] bg-white overflow-hidden">
                  <div className="absolute top-0 left-0 origin-top-left scale-[0.4375] sm:scale-100">
                    <QRCodeSVG value={verifyUrl} size={64} fgColor="#01381d" bgColor="#ffffff" />
                  </div>
                </div>
                
                <p className="text-gray-600 mt-0.5 font-mono font-semibold text-[3px] sm:text-[8px] md:text-[9px] break-all w-full text-center">
                  ID: {cert.certificate_id}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDownload && (
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-[#01381d] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#F97316] transition-colors shadow-md w-full sm:w-auto justify-center"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Certificate (PDF)
        </button>
      )}
    </div>
  )
}