// app/events/page.tsx
"use client";

import { useScrollReveal } from "@/hooks/use-scroll-reveal";
import { EventsHeroSection } from "@/components/sections/events/events-hero-section";
import { SpotlightSection } from "@/components/sections/events/spotlight-section";
import { EventsListSection } from "@/components/sections/events/events-list-section";
import { EventsMapSection } from "@/components/sections/events/events-map-section";
import { EventsCtaSection } from "@/components/sections/events/events-cta-section";
import { ErrorBoundary } from "@/components/error-boundary";

export default function EventsPage() {
  useScrollReveal();

  return (
    <>
      <EventsHeroSection />
      <ErrorBoundary>
        <SpotlightSection/>                                           
      </ErrorBoundary>
      <EventsListSection />
      <EventsMapSection />
      <EventsCtaSection />
    </>
  );
}
