"use client";
import { useRef } from "react";
import CompanyCard from "./CompanyCard";

interface CompanyItem {
  id: string;
  companyURL: string;
}

interface CompanyCarouselProps {
  testimonials: CompanyItem[];
}

export default function CompanyCarouselComponent({ testimonials }: CompanyCarouselProps) {
  const tickerRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full overflow-hidden pt-5 pb-5">
      <div className="relative overflow-hidden">
        <div
          ref={tickerRef}
          className="flex animate-company-ticker"
          style={{
            willChange: 'transform',
            width: 'fit-content'
          }}
        >
          {/* Original items */}
          {testimonials.map((company) => (
            <CompanyCard
              key={`original-${company.id}`}
              company={company}
            />
          ))}

          {/* Duplicate items for seamless loop */}
          {testimonials.map((company) => (
            <CompanyCard
              key={`duplicate-${company.id}`}
              company={company}
              isDuplicate={true}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes company-ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-company-ticker {
          animation: company-ticker 20s linear infinite;
        }

        .animate-company-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}