"use client";
import { STATISTICS } from "@/constants";
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

      {/* Content */}
      <div className="container h-full pb-4 md:pb-4 relative z-10 px-4 sm:px-6 flex flex-col justify-end items-center text-white gap-2 sm:gap-2 pt-32 sm:pt-64">
        {/* Main Heading */}
        <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-4xl lg:text-5xl xl:text-5xl font-bold leading-[100%] tracking-[-0.03em] text-center mb-2 sm:mb-3">
          India's Fastest Growing Workforce Hiring Platform
        </h1>

        {/* Tagline */}
        <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl font-thin italic leading-[100%] tracking-[0] text-center text-white mb-4 sm:mb-6">
          “Reel Banao, Naukri Paao”
        </p>

        {/* Statistics */}
        <div className="flex flex-wrap justify-center items-center gap-1 sm:gap-2 w-full max-w-6xl">
          {STATISTICS.map((stat, index) => (
            <>
            <div key={stat.label} className="flex items-center">
              {/* Statistic */}
              <div className="flex flex-col text-center px-1 sm:px-4">
                <span className="text-1xl sm:text-xl md:text-2xl lg:text-3xl font-bold text-yellow-400 mb-1">
                  {stat.value}
                </span>
                <span className="text-sm sm:text-xl md:text-2xl lg:text-3xl text-white/90 font-normal leading-[100%] tracking-[0] whitespace-nowrap">
                  {stat.label}
                </span>
              </div>
              </div>
              {/* Separator */}
              {index < STATISTICS.length - 1 ? (
                <div className="mx-2 sm:mx-4 hidden sm:block">
                  <Image
                    src="/images/Separator.svg"
                    alt="separator"
                    width={2}
                    height={10}
                    className="bg-white/20"
                  />
                </div>
              ): null}
          </>
          ))}
        </div>

        {/* Since date */}
        <p className="text-sm sm:text-base text-yellow-400/80 italic mt-4">
          (Since May 2025)
        </p>
      </div>
    </section>
  );
}
