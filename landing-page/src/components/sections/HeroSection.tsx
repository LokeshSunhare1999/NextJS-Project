"use client";

import Header from "@/components/layout/Header";
import Image from "next/image";

export default function HeroSection() {
  return (
    <section id="hero" className="relative h-screen w-full flex flex-col items-center overflow-hidden bg-black mt-0 pt-0">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/herobg.webp"
          alt="Team working in futuristic hiring environment"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

      {/* Header */}
      <div className="w-full relative z-20">
        <Header />
      </div>

      {/* Content */}
      <div className="container h-full pb-20 md:pb-15 relative z-10 px-4 sm:px-6 flex flex-col justify-end items-center text-white gap-3 sm:gap-5 pt-64 sm:pt-64">
        <h1 className="text-4xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-2 sm:mb-3 text-center font-['helvetica']">
          The Future of Hiring is Here
        </h1>
      </div>
    </section>
  );
}
