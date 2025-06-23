"use client";

// Importing layout components
import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";

import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/common/ScrollToTop";

const FastTrainSection = dynamic(() => import("@/components/sections/fasttrain/FastTrainSection"));
const Impact = dynamic(() => import("@/components/sections/Impact"));
const HeroSection = dynamic(() => import("@/components/sections/HeroSection"));
const SaathiEcosystem = dynamic(() => import("@/components/sections/SaathiEcosystem"));
const IdentityVerified2 = dynamic(() => import("@/components/sections/IdentityVerified/IdentityVerified"), { ssr: false });
const DownloadAndHireSection = dynamic(() => import("@/components/sections/DownloadAndHireSection"));
const JobReelContainer = dynamic(() => import("@/components/sections/Jobreels/JobReelContainer"));
const JobReelHeader = dynamic(() => import("@/components/sections/Jobreels/JobReelHeader"));
const IdentityVerifiedHeader = dynamic(() => import("@/components/sections/IdentityVerified/IdentityVerifiedHeader"));
const JobReelContainerMobile = dynamic(() => import("@/components/sections/Jobreels/JobReelContainerMobile"), { ssr: false });
const IdentityVerifiedMobile = dynamic(() => import("@/components/sections/IdentityVerified/IdentityVerifiedMobile"), { ssr: false });

// Main page component that serves as the landing page
export default function Home() {
  const [featureIndex, setFeatureIndex] = useState(0);
  const [identityIndex, setIdentityIndex] = useState(0);
  const featuresRef = useRef<HTMLDivElement>(null);
  const identityRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      // Feature carousel scroll logic
      if (featuresRef.current) {
        const scrollY = window.scrollY;
        const featuresSectionTop = featuresRef.current.offsetTop;
        const featuresSectionHeight = featuresRef.current.offsetHeight;

        // Calculate how far through the features section we've scrolled
        const scrollProgress = (scrollY - featuresSectionTop) / featuresSectionHeight;

        // Determine which feature to show based on scroll position
        if (scrollProgress < 0.25) {
          setFeatureIndex(0);
        } else if (scrollProgress < 0.5) {
          setFeatureIndex(1);
        } else if (scrollProgress < 0.75) {
          setFeatureIndex(2);
        } else if (scrollProgress <= 1) {
          setFeatureIndex(2);
        }
      }

      // Identity verified scroll logic
      if (identityRef.current) {
        const scrollY = window.scrollY;
        const identitySectionTop = identityRef.current.offsetTop;
        const identitySectionHeight = identityRef.current.offsetHeight;

        // Calculate how far through the identity section we've scrolled
        const scrollProgress = (scrollY - identitySectionTop) / identitySectionHeight;

        // Determine which identity to show based on scroll position
        if (scrollProgress < 0.25) {
          setIdentityIndex(0);
        } else if (scrollProgress < 0.5) {
          setIdentityIndex(1);
        } else if (scrollProgress < 0.75) {
          setIdentityIndex(2);
        } else if (scrollProgress <= 1) {
          setIdentityIndex(2);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  return (
    // Main container with minimum height of screen and white background
    <main className="min-h-screen bg-black">
      {/* Hero section for main banner/headline */}
      <section className="section-transition">
        <HeroSection />
      </section>

      <section className="section-transition block md:hidden">
        <JobReelHeader />
      </section>
      <section className="section-transition">
        <div className="hidden md:block">
          <JobReelContainer />
        </div>
        <div className="md:hidden">
          <JobReelContainerMobile selectedIndex={0} />
          <JobReelContainerMobile selectedIndex={1} />
          <JobReelContainerMobile selectedIndex={2} />
        </div>
      </section>

      {/* Section about fast train feature */}
      <FastTrainSection />

      {/* Identity Verified section with scroll effect */}
      <IdentityVerifiedHeader />

      <div className="hidden md:block">
        <IdentityVerified2 />
      </div>
      <div className="md:hidden">
        <IdentityVerifiedMobile />
      </div>

      {/* Section explaining the Saathi ecosystem */}
      <section className="" id="ecosystem">
        <SaathiEcosystem />
      </section>

      {/* Section for creators */}
      <section className="" id="impact">
        <Impact />
      </section>

      {/* Section for Download and Hire */}
      <section className="" id="download">
        <DownloadAndHireSection />
      </section>

      {/* Footer component */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
