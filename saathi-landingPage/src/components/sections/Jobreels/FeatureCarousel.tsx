"use client";
import { useEffect, useRef } from "react";
import Image from 'next/image';
import { JOB_REELS_FEATURES } from "@/constants";

type FeatureCarouselProps = {
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
};

export default function FeatureCarousel({ selectedIndex = 0, onIndexChange }: FeatureCarouselProps) {
  // Reference to the main section element
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle index change if controlled externally
  useEffect(() => {
    if (onIndexChange && typeof selectedIndex !== 'undefined') {
      onIndexChange(selectedIndex);
    }
  }, [selectedIndex, onIndexChange]);

  return (
    <div
      id="jobreels"
      ref={sectionRef}
      className="relative bg-black"
    >
      <section
        className="min-h-screen relative overflow-hidden bg-black"
      >
        <div className="absolute inset-0 flex flex-col justify-start px-2 sm:px-4 md:px-16 pt-2">
          <div
            className="mb-2 sm:mb-4 mt-1 sm:mt-4 md:mt-20 px-0 sm:px-4"
            style={{
              position: 'relative',
              zIndex: 50
            }}
          >
            <h1 className="pt-4 text-4xl sm:text-4xl md:text-6xl font-bold text-white text-center md:text-left font-['Helvetica']">
              <span>Job</span>
              <span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">Reels</span>
            </h1>
            <p className="text-gray-400 italic text-md sm:text-md md:text-[18px] py-1 text-center md:text-left font-['Helvetica']">The Instagram of Jobs</p>
            <div className="mt-3 md:mt-8 text-center md:text-left">
              <h2 className="text-white text-xl sm:text-3xl md:text-[40px] font-light leading-tight mb-4 md:mb-6 font-['Helvetica'] ">When Resumes meet Reels,<br />hiring happens instantly</h2>

            </div>
          </div>

          <div className="slider-container mx-auto flex flex-col md:grid md:grid-cols-2 gap-2 sm:gap-5 md:gap-0 items-center mt-0 sm:-mt-36 md:-mt-40">
            {/* Left Side - Feature Text */}
            <div className="relative min-h-[120px] sm:min-h-[300px] flex flex-col justify-center items-center md:items-end text-center md:text-left mt-6 md:mt-32 order-1 md:order-none w-full px-4">
              <div className="h-full flex items-center justify-center md:justify-end md:pr-4 w-full">
                {JOB_REELS_FEATURES.map((feature, index) => (
                  <div
                    key={feature.id}
                    className={`absolute w-full transition-all duration-500 linear bg-black ${selectedIndex === index
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 -translate-y-4 pointer-events-none'
                      }`}
                    style={{
                      willChange: 'transform, opacity',
                      transition: 'all 0.5s linear',
                      transitionDelay: '0.2s',
                      backgroundColor: 'black'
                    }}
                  >
                    <div className="w-full h-full flex flex-row items-start space-x-2 md:space-x-4 bg-black">
                      {/* Pagination dots for desktop only (vertical) */}
                      <div className="md:flex flex-col items-center justify-center space-y-4 mr-2 mt-3">
                        {JOB_REELS_FEATURES.map((_, dotIdx) => (
                          <div
                            key={`progress-${dotIdx}`}
                            className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedIndex === dotIdx
                              ? 'bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01]'
                              : 'bg-gray-600'
                              }`}
                            onClick={() => onIndexChange && onIndexChange(dotIdx)}
                            style={{ cursor: 'pointer' }}
                          />
                        ))}
                      </div>
                      {/* Feature text on the right */}
                      <div className="flex-1">
                        <h2 className="text-xl sm:text-3xl md:text-4xl font-regular text-white font-['Helvetica'] pb-2 md:pb-3">
                          {feature.title}
                        </h2>
                        <p className="text-md sm:text-base text-gray-400 mb-2 sm:mb-6 max-w-[280px] sm:max-w-none mx-auto md:mx-0 font-['Helvetica'] md:text-[18px] font-light italic leading-tight">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Side - Video Display */}
            <div className="relative h-full flex flex-col items-center justify-center md:justify-start md:pl-4 bg-black mt-6 md:-mt-64 order-2 md:order-none w-full px-4">
              <div className="relative w-full max-w-[240px] sm:max-w-[280px] md:max-w-[480px] aspect-[9/16] mx-auto overflow-hidden rounded-lg bg-black">
                {JOB_REELS_FEATURES.map((feature, index) => (
                  <div
                    key={`video-${feature.id}`}
                    className={`absolute inset-0 transition-all duration-500 linear bg-black ${selectedIndex === index
                      ? 'opacity-100 scale-100'
                      : 'opacity-0 scale-95 pointer-events-none'
                      }`}
                    style={{
                      willChange: 'transform, opacity, scale',
                      transition: 'all 0.5s linear',
                      transitionDelay: '0.2s',
                      backgroundColor: 'black'
                    }}
                  >
                    {feature.phoneImage.endsWith('.mp4') ? (
                      <video
                        className="w-full h-full object-contain max-w-[240px] sm:max-w-[280px] md:max-w-[480px] mx-auto"
                        autoPlay
                        loop
                        muted
                        playsInline
                      >
                        <source src={feature.phoneImage} type="video/mp4" />
                      </video>
                    ) : (
                      <Image
                        src={feature.phoneImage}
                        alt={typeof feature.title === 'string' ? feature.title : 'Feature Image'}
                        width={280} // fallback width (sm breakpoint)
                        height={497} // based on 9:16 aspect ratio (280 * 16 / 9)
                        className="w-full h-full object-contain max-w-[240px] sm:max-w-[280px] md:max-w-[480px] mx-auto"
                        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, 480px"
                        quality={75}
                        loading="lazy"
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}