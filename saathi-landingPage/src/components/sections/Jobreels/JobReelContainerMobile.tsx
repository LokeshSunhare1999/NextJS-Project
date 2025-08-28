"use client";
import {  useEffect, useRef, useCallback, memo } from "react";
import Image from 'next/image';
import { JOB_REELS_FEATURES } from "@/constants";

type FeatureCarouselProps = {
  selectedIndex?: number;
  onIndexChange?: (index: number) => void;
};

// Memoize the component to prevent unnecessary re-renders
const JobReelContainerMobile = memo(function JobReelContainerMobile({ 
  selectedIndex = 0, 
  onIndexChange 
}: FeatureCarouselProps) {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Memoize the index change handler
  const handleIndexChange = useCallback((index: number) => {
    onIndexChange?.(index);
  }, [onIndexChange]);

  // Only run this effect when absolutely necessary
  useEffect(() => {
    if (onIndexChange && typeof selectedIndex !== 'undefined') {
      handleIndexChange(selectedIndex);
    }
  }, [selectedIndex, handleIndexChange, onIndexChange]);

  // Optimize the feature rendering
  const renderFeatureContent = useCallback((feature: typeof JOB_REELS_FEATURES[0], index: number) => {
    const isActive = selectedIndex === index;
    const transitionStyles = {
      willChange: isActive ? 'transform, opacity, scale' : undefined,
      transition: 'all 0.5s ease-out', // Using ease-out for smoother animations
      transitionDelay: '0.1s' // Reduced delay
    };

    return (
      <div
        key={`video-${feature.id}`}
        className={`absolute inset-0 ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={transitionStyles}
      >
        {feature.phoneImage.endsWith('.mp4') ? (
          <video
            className="w-full h-full object-contain max-w-[240px] sm:max-w-[280px] mx-auto"
            autoPlay={isActive} // Only autoplay when active
            loop
            muted
            playsInline
            preload="none" // Don't preload all videos
          >
            <source src={feature.phoneImage} type="video/mp4" />
          </video>
        ) : (
          <Image
            src={feature.phoneImage}
            alt={typeof feature.title === 'string' ? feature.title : 'Feature'}
            width={240}
            height={427}
            className="object-contain mx-auto w-full h-full"
            quality={70} // Slightly reduced quality
            priority={index < 2} // Only prioritize first 2 images
            loading={index < 2 ? 'eager' : 'lazy'}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        )}
      </div>
    );
  }, [selectedIndex]);

  // Memoize feature text rendering
  const renderFeatureText = useCallback((feature: typeof JOB_REELS_FEATURES[0], index: number) => {
    const isActive = selectedIndex === index;
    const transitionStyles = {
      willChange: isActive ? 'transform, opacity' : undefined,
      transition: 'all 0.5s ease-out',
      transitionDelay: '0.1s'
    };

    return (
      <div
        key={feature.id}
        className={`absolute w-full ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}
        style={transitionStyles}
      >
        <div className="w-full h-full flex flex-col items-center space-y-4">
          
          {/* Bullet Points Section */}
          {feature.bulletPoints && (
            <div className="w-full max-w-[260px] mx-auto space-y-2">
              {feature.bulletPoints.map((point, pointIndex) => (
                <div key={pointIndex} className="flex items-center text-left">
                  <div className="flex-shrink-0 mr-2">
                    <Image
                      src="/images/reelIcon.svg"
                      alt="bullet"
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                  </div>
                  <span className="text-white font-['Helvetica'] text-xs sm:text-sm font-light leading-tight">
                    {point}
                  </span>
                </div>
              ))}
              
              {/* Pricing section */}
              <div className="mt-4 pt-2 border-t border-gray-700">
                <h4 className="text-white font-['Helvetica'] text-xs sm:text-sm font-medium mb-1 uppercase tracking-wider text-center">
                  ANNUAL SUBSCRIPTION OF ₹5,000 ONLY
                </h4>
                <p className="text-gray-400 font-['Helvetica'] text-xs sm:text-sm font-light text-center">
                  Unlimited Job Posts
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }, [selectedIndex]);

  return (
    <div
      id="jobreels"
      ref={sectionRef}
      className="relative bg-black backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300 mx-auto my-8 w-[300px] md:hidden h-fit"
    >
      <section className="relative overflow-hidden">
        <div className="inset-0 flex flex-col justify-start px-2 sm:px-4 py-2">
          <div className="slider-container mx-auto flex flex-col sm:gap-3 items-center mt-0">
            {/* Video Display */}
            <div className="relative h-full flex flex-col items-center justify-center bg-black mt-4 w-full px-4">
              <div className="relative w-full max-w-[200px] sm:max-w-[220px] aspect-[9/16] mx-auto overflow-hidden rounded-lg bg-black">
                {JOB_REELS_FEATURES.map((feature, index) => renderFeatureContent(feature, index))}
              </div>
            </div>

            {/* Feature Text with Bullet Points */}
            <div className="relative min-h-[280px] sm:min-h-[320px] flex flex-col justify-start items-center text-center mt-2 w-full px-3 overflow-visible">
              <div className="h-full flex items-start justify-center w-full">
                {JOB_REELS_FEATURES.map((feature, index) => renderFeatureText(feature, index))}
              </div>
            </div>

            {/* Pagination dots - keeping hidden as in original */}
            <div className="hidden flex flex-row items-center justify-center space-x-4 w-full mt-2 mb-2">
              {JOB_REELS_FEATURES.map((_, dotIdx) => (
                <div
                  key={`progress-mobile-${dotIdx}`}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${selectedIndex === dotIdx
                      ? 'bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01]'
                      : 'bg-gray-600'
                    }`}
                  onClick={() => handleIndexChange(dotIdx)}
                  style={{ cursor: 'pointer' }}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
});

export default JobReelContainerMobile;