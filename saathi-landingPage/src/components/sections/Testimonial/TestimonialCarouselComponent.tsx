"use client";

import { useState, useRef, useEffect } from "react";
import TestimonialCard from "./TestimonialCard";

interface TestimonialItem {
  id: string;
  role: string;
  company: string;
  testimonial: string;
}

interface TestimonialCarouselProps {
  testimonials: TestimonialItem[];
}

export default function TestimonialCarouselComponent({ testimonials }: TestimonialCarouselProps) {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const handleCardHover = (id: string, isHovering: boolean) => {
    if (isMobile) return; // Don't handle hover on mobile
    setIsHovering(isHovering ? id : null);
  };

  return (
    <div className="w-full overflow-hidden py-5">
      <div className="relative overflow-hidden">
        <div
          ref={tickerRef}
          className="flex animate-ticker"
          style={{
            willChange: 'transform',
            width: 'fit-content'
          }}
        >
          {/* Original items */}
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={`original-${testimonial.id}`}
              testimonial={testimonial}
              isHovering={isHovering}
              isMobile={isMobile}
              handleCardHover={handleCardHover}
            />
          ))}

          {/* Duplicate items for seamless loop */}
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={`duplicate-${testimonial.id}`}
              testimonial={testimonial}
              isDuplicate={true}
              isHovering={isHovering}
              isMobile={isMobile}
              handleCardHover={handleCardHover}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          animation: ticker 40s linear infinite;
        }

        .animate-ticker:hover {
          animation-play-state: paused;
        }

        .line-clamp-4 {
          display: -webkit-box;
          -webkit-line-clamp: 4;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}