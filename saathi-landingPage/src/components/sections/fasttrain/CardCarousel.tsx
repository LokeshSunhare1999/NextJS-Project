"use client";

import { useRef } from "react";
import Image from 'next/image';

type CardItem = {
  id: number;
  title: string;
  imageUrl: string;
  href: string;
};

interface CardCarouselProps {
  title: string;
  cards: CardItem[];
}

export default function CardCarousel({ title, cards }: CardCarouselProps) {
  const carouselRef = useRef<HTMLDivElement>(null);

  // Generate a color based on the card ID
  const getCardColor = (id: number) => {
    const colors = [
      'from-red-500 to-orange-500',
      'from-blue-500 to-purple-500',
      'from-green-500 to-emerald-500',
      'from-yellow-500 to-amber-500',
      'from-pink-500 to-rose-500',
      'from-indigo-500 to-violet-500',
    ];
    return colors[(id - 1) % colors.length];
  };

  return (
    <div className="w-full mx-auto scrollbar-hide">
      <h2 className="text-lg md:text-[28px] font-bold text-gray-500 mb-6">{title}</h2>
      
      <div className="relative">
        {/* Cards Container */}
        <div 
          ref={carouselRef}
          className="flex overflow-x-auto scrollbar-hide gap-4 md:gap-6 px-2 md:px-4 pb-4 justify-between"
          style={{ 
            scrollbarWidth: 'none', 
            msOverflowStyle: 'none', 
            WebkitOverflowScrolling: 'touch' as const 
          }}
        >
          {cards.map((card) => (
            <div 
              key={card.id}
              className="relative flex-shrink-0 group"
            >
              <div className="relative w-[140px] md:w-[220px] h-[180px] md:h-[300px] rounded-md overflow-hidden transition-transform duration-300 group-hover:scale-105">
                {/* Fallback gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${getCardColor(card.id)}`} />
                
                {/* Next.js Image with error handling */}
                <Image 
                  src={card.imageUrl} 
                  alt={card.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Keep the fallback gradient visible on error
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Big Number */}
                <div className="absolute bottom-0 left-0 text-[100px] font-bold text-white/40 leading-none pl-2">
                  {card.id}
                </div>
                
                {/* Title overlay */}
                <div className="absolute bottom-0 left-0 w-full p-4">
                  <h3 className="text-white font-medium text-sm md:text-base line-clamp-2">{card.title}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 