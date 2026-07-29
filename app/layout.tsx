import type { Metadata } from "next";
import { Fraunces, Work_Sans, IBM_Plex_Mono } from "next/font/google";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { IndexStrip } from "@/components/layout/index-strip";
import { Preloader } from "@/components/layout/preloader";
import { siteConfig } from "@/lib/site-config";
import "./globals.css";
import { ClientLayout } from "@/components/layout/client-layout";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  display: "swap",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: "500",
  variable: "--font-ibm-plex-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${siteConfig.name} — Edo North 2027`,
  description: siteConfig.description,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning data-scroll-behaviour="smooth">
      <body
        className={`${fraunces.variable} ${workSans.variable} ${ibmPlexMono.variable} is-loading antialiased`}
      >
        {children}
      </body>
    </html>
  );
}