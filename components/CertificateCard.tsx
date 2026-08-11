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

const CERT_WIDTH = 900
const CERT_HEIGHT = 820 

export default function CertificateCard({ cert, showDownload = true }: CertificateCardProps) {
  const certRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function calculateScale() {
      const screenWidth = window.innerWidth - 32 
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

  const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://arunaedonorth.ng').replace(/\/$/, '')
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
    <div className="flex flex-col items-center gap-6">
      {/* Wrapper matched to scaled size */}
      <div
        className="rounded-xl shadow-xl overflow-hidden"
        style={{
          width: CERT_WIDTH * scale,
          height: CERT_HEIGHT * scale,
        }}
      >
        {/* Certificate at full 900px, visually scaled */}
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
          {/* Vibrant Outer Border */}
          <div className="w-full h-full border-[12px] border-[#F97316] relative flex flex-col bg-gradient-to-br from-white via-[#FFFFF8] to-[#FDF3E6]">
            
            {/* Decorative Background Elements */}
            <div className="absolute top-0 right-0 w-[400px] h-[400px] rounded-bl-[100%] bg-[#F97316]/5 z-0"></div>
            <div className="absolute bottom-0 left-0 w-[300px] h-[300px] rounded-tr-[100%] bg-[#015B2D]/5 z-0"></div>
            
            {/* Inner subtle frame */}
            <div className="absolute inset-4 border border-[#015B2D]/20 rounded-lg pointer-events-none z-0"></div>

            <div className="relative z-10 h-full flex flex-col px-14 py-10 text-center">
              {/* Header / Logo */}
              <div className="flex flex-col items-center mb-8">
                <div className="flex items-center justify-center mb-2">
                  <Image src="/images/36.png" alt="Abubakari Aruna Institute" width={80} height={80} className="object-contain mr-3" />
                  <div className="text-left border-l-2 border-[#015B2D] pl-3">
                    <h1 className="text-2xl font-bold text-[#015B2D] leading-none">Abubakari Aruna Institute</h1>
                    <p className="text-[#F97316] text-[9px] tracking-[0.3em] font-semibold mt-1">INSPIRE • REFORM • IMPACT</p>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="mb-8">
                <p className="text-[#015B2D] text-sm font-medium tracking-widest uppercase mb-2">Proudly Presented To</p>
                <h1 className="font-serif text-[42px] font-extrabold text-[#015B2D] tracking-wide leading-none">
                  CERTIFICATE OF COMPLETION
                </h1>
                <div className="flex items-center justify-center gap-4 mt-4">
                  <div className="h-[3px] w-24 bg-[#F97316] rounded-full" />
                  <div className="h-[3px] w-3 bg-[#F97316] rounded-full" />
                </div>
              </div>

              {/* Recipient */}
              <div className="flex-grow flex flex-col items-center justify-center">
                <p
                  className="text-[#01381D] text-[52px] font-bold mb-2 leading-tight"
                  style={{ fontFamily: 'var(--font-dancing), cursive' }}
                >
                  {cert.recipient_name}
                </p>
                
                <div className="w-40 h-[2px] bg-[#015B2D]/30 my-6"></div>

                <p className="text-gray-600 text-[13px] mb-3 max-w-xl mx-auto">
                  In recognition of the successful completion of all required courses, assessments, and the capstone project for the
                </p>
                
                <p className="text-[#F97316] font-extrabold text-2xl mb-4 tracking-wide uppercase">
                  {cert.certificate_title}
                </p>
                
                <p className="text-gray-500 text-[11px] max-w-lg mx-auto leading-relaxed italic">
                  &ldquo;This certificate signifies the recipient&apos;s dedication to continuous learning, leadership excellence, and service to society through the Abubakari Aruna Institute platform.&rdquo;
                </p>
              </div>

              {/* Meta row */}
              <div className="grid grid-cols-3 gap-4 mt-8 mb-6">
                {[
                  { label: 'Certificate ID', value: cert.certificate_id },
                  { label: 'Date Issued', value: issuedDate },
                  { label: 'Duration', value: cert.duration },
                ].map((item, i) => (
                  <div key={i} className="text-center bg-white/60 backdrop-blur-sm border border-[#015B2D]/10 rounded-lg py-2.5 px-2 shadow-sm">
                    <div className="text-[#F97316] text-[9px] font-bold mb-1 uppercase tracking-wider">
                      {item.label}
                    </div>
                    <p className="text-[11px] font-bold text-[#015B2D] truncate">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Signatures + QR */}
              <div className="flex items-end justify-between px-6">
                <div className="text-center w-[200px]">
                  <p className="text-[#015B2D] text-xl mb-1" style={{ fontFamily: 'var(--font-dancing), cursive' }}>
                    Aruna Abubakari
                  </p>
                  <div className="border-t-2 border-[#015B2D]/20 pt-1.5">
                    <p className="text-[10px] font-bold text-[#015B2D]">Comr. Aruna Abubakari</p>
                    <p className="text-[9px] text-[#F97316] font-semibold">Founder, Abubakari Aruna Institute</p>
                  </div>
                </div>

                {/* Official Seal */}
                <div className="flex flex-col items-center mx-4">
                  <div className="w-20 h-20 rounded-full border-4 border-[#F97316] flex items-center justify-center bg-gradient-to-br from-[#FDF3E6] to-[#F97316] shadow-lg">
                    <div className="text-center">
                      <p className="text-[8px] font-black text-[#015B2D] leading-tight">ABUBAKARI<br />ARUNA<br />INSTITUTE</p>
                    </div>
                  </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center w-[200px]">
                  <div className="bg-[#015B2D] text-white text-[8px] font-bold px-3 py-1 rounded-t tracking-wider">SCAN TO VERIFY</div>
                  <div className="border-2 border-t-0 border-[#015B2D] p-1.5 bg-white">
                    <QRCodeSVG value={verifyUrl} size={64} fgColor="#015B2D" bgColor="#ffffff" />
                  </div>
                  <p className="text-[7px] text-gray-500 mt-1.5 text-center max-w-[100px] leading-tight">
                    arunaedonorth.ng<br />/academy/verify
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
          className="flex items-center gap-2 bg-[#F97316] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-[#015B2D] transition-colors shadow-md"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
          Download Certificate (PDF)
        </button>
      )}
    </div>
  )
}