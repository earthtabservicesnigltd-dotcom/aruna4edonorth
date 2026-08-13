'use client'

import { useRef, useState, useEffect } from 'react'
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

const CERT_WIDTH = 1000
const CERT_HEIGHT = 920 // Increased height for better spacing

export default function CertificateCard({ cert, showDownload = true }: CertificateCardProps) {
  const certRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function calculateScale() {
      const screenWidth = window.innerWidth - 48 
      if (screenWidth < CERT_WIDTH) {
        setScale(screenWidth / CERT_WIDTH)
      } else {
        setScale(1)
      }
    }
    calculateScale()
    window.addEventListener('resize', calculateScale)
    return () => window.removeEventListener('resize', calculateScale)
  }, [])

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
      scale: 3,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    })

    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'px',
      format: [canvas.width / 3, canvas.height / 3],
    })
    pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 3, canvas.height / 3)
    pdf.save(`${cert.certificate_id.replace(/\//g, '-')}.pdf`)
  }

  return (
    <div className="flex flex-col items-center gap-8">
      {/* Wrapper matched to scaled size */}
      <div
        className="rounded-xl shadow-2xl overflow-hidden bg-[#01381d] p-4"
        style={{
          width: CERT_WIDTH * scale,
          height: CERT_HEIGHT * scale,
        }}
      >
        {/* Certificate at full 1000px, visually scaled */}
        <div
          ref={certRef}
          style={{
            width: CERT_WIDTH,
            height: CERT_HEIGHT,
            transform: `scale(${scale})`,
            transformOrigin: 'top left',
          }}
          className="bg-white font-sans relative"
        >
          {/* Elegant Outer Matting + Gold Inner Border */}
          <div className="w-full h-full border-[12px] border-[#01381d] relative flex flex-col bg-white">
            <div className="absolute inset-4 border-[3px] border-[#D4AF37] pointer-events-none z-0"></div>
            
            {/* Subtle Watermark */}
            <div className="absolute inset-0 flex items-center justify-center z-0 opacity-[0.03] pointer-events-none">
              <Image src="/images/36.png" alt="Watermark" width={500} height={500} />
            </div>

            <div className="relative z-10 h-full flex flex-col px-20 py-14 text-center">
              {/* Header / Logo */}
              <div className="flex flex-col items-center mb-10">
                <div className="flex items-center justify-center mb-2">
                  <Image src="/images/36.png" alt="Abubakari Aruna Institute" width={70} height={70} className="object-contain mr-4" />
                  <div className="text-left border-l-2 border-[#D4AF37] pl-4">
                    <h1 className="text-2xl font-bold text-[#01381d] leading-none tracking-tight">Abubakari Aruna Institute</h1>
                    <p className="text-[#D4AF37] text-[10px] tracking-[0.3em] font-semibold mt-1 uppercase">Inspire • Reform • Impact</p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="mb-10">
                <p className="text-[#01381d] text-sm font-medium tracking-[0.2em] uppercase mb-3">Proudly Presented To</p>
                <h1 className="font-serif text-[36px] font-bold text-[#01381d] tracking-wide leading-none">
                  CERTIFICATE OF COMPLETION
                </h1>
                <div className="flex items-center justify-center gap-3 mt-5">
                  <div className="h-[2px] w-16 bg-[#D4AF37]" />
                  <div className="w-2 h-2 rotate-45 bg-[#D4AF37]"></div>
                  <div className="h-[2px] w-16 bg-[#D4AF37]" />
                </div>
              </div>

              {/* Recipient */}
              <div className="flex-grow flex flex-col items-center justify-center">
                <p
                  className="text-[#01381d] text-[56px] font-bold mb-2 leading-tight"
                  style={{ fontFamily: 'var(--font-dancing), cursive' }}
                >
                  {cert.recipient_name}
                </p>
                
                <div className="w-48 h-[1px] bg-[#01381d]/20 my-8"></div>

                <p className="text-gray-600 text-[14px] mb-4 max-w-xl mx-auto leading-relaxed">
                  In recognition of the successful completion of all required courses, assessments, and the capstone project for the
                </p>
                
                <p className="text-[#01381d] font-bold text-2xl mb-5 tracking-wide uppercase border-b border-[#D4AF37] pb-2 px-4">
                  {cert.certificate_title}
                </p>
                
                <p className="text-gray-500 text-[12px] max-w-lg mx-auto leading-relaxed italic">
                  &ldquo;This certificate signifies the recipient&apos;s dedication to continuous learning, leadership excellence, and service to society.&rdquo;
                </p>
              </div>

              {/* Signatures + QR */}
              <div className="flex items-end justify-between px-8 mt-10">
                {/* Left Signature */}
                <div className="text-center w-[200px]">
                  <p className="text-[#01381d] text-2xl mb-2" style={{ fontFamily: 'var(--font-dancing), cursive' }}>
                    Aruna Abubakari
                  </p>
                  <div className="border-t-2 border-[#01381d] pt-1.5">
                    <p className="text-[11px] font-bold text-[#01381d]">Comr. Aruna Abubakari</p>
                    <p className="text-[9px] text-[#D4AF37] font-semibold uppercase tracking-wider">Founder, MAI Academy</p>
                  </div>
                </div>

                {/* Center Gold Seal */}
                <div className="flex flex-col items-center mx-4">
                  <div className="w-24 h-24 rounded-full border-4 border-[#D4AF37] flex items-center justify-center bg-gradient-to-br from-[#FDF3E6] to-[#D4AF37] shadow-lg">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-[#01381d] leading-tight">ABUBAKARI<br />ARUNA<br />INSTITUTE</p>
                    </div>
                  </div>
                </div>

                {/* Right QR Code */}
                <div className="flex flex-col items-center w-[200px]">
                  <div className="bg-[#01381d] text-white text-[8px] font-bold px-3 py-1 rounded-t tracking-wider">SCAN TO VERIFY</div>
                  <div className="border-2 border-t-0 border-[#01381d] p-1.5 bg-white">
                    <QRCodeSVG value={verifyUrl} size={64} fgColor="#01381d" bgColor="#ffffff" />
                  </div>
                  <p className="text-[9px] text-gray-600 mt-1.5 font-mono font-semibold">
                    ID: {cert.certificate_id}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showDownload && (
        <button
          onClick={downloadPDF}
          className="flex items-center gap-2 bg-[#01381d] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#F97316] transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Certificate (PDF)
        </button>
      )}
    </div>
  )
}