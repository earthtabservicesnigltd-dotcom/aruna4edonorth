// components/layout/client-layout.tsx
"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useScrollReveal();
  return <>{children}</>;
}
