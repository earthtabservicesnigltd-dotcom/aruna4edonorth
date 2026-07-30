"use client";
import { HeroSection } from "@/components/sections/hero-section";
import { AboutSection } from "@/components/sections/about-section";
import { WhyRunningSection } from "@/components/sections/why-running-section";
import { ValuesSection } from "@/components/sections/values-section";
import { MediaHubSection } from "@/components/sections/media-hub-section";
import { GallerySection } from "@/components/sections/gallery-section";
import { TestimonialsSection } from "@/components/sections/testimonials-section";
import { VoxpopSection } from "@/components/sections/voxpop-section";
import { CtaBannerSection } from "@/components/sections/cta-banner-section";
import { InvolveSection } from "@/components/sections/involve-section";
import { useScrollReveal } from "@/hooks/use-scroll-reveal";

export default function HomePage() {
  useScrollReveal();

  return (
    <>
      <HeroSection />
      <AboutSection />
      <WhyRunningSection />
      <ValuesSection />
      <MediaHubSection />
      <GallerySection />
      <TestimonialsSection />
      <VoxpopSection />
      <CtaBannerSection />
      <InvolveSection />
    </>
  );
}