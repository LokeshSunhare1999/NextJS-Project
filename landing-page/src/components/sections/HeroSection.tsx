// "use client";

// import Header from "@/components/layout/Header";
// import Image from "next/image";
// import { useState } from "react";

// export default function HeroSection() {
//   const [imageLoaded, setImageLoaded] = useState(false);
//   return (
//     <section id="hero" className="relative h-screen w-full flex flex-col items-center overflow-hidden bg-black mt-0 pt-0">
//       {/* Background image */}
//       <div className="absolute inset-0 bg-white z-0">
//         {/* <Image
//           src="/herobg.webp"
//           alt="Hero-bg"
//           fill
//           priority={true}
//           quality={75}
//           sizes="(max-width: 768px) 100vw, 100vw"
//           className="object-cover z-[-1]"
//         /> */}
//         <Image
//           src="/herobg.webp"
//           alt="Hero background"
//           fill
//           priority={true}
//           quality={60} // Reduced from 75
//           sizes="100vw"
//           className={`object-cover transition-opacity duration-500 ${
//             imageLoaded ? 'opacity-100' : 'opacity-0'
//           }`}
//           onLoad={() => setImageLoaded(true)}
//           placeholder="blur"
//           blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Xsl4jUEXmlsn/2Q=="
//         />
//       </div>

//       {/* Overlay gradient */}
//       <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />

//       {/* Header */}
//       <div className="w-full relative z-20">
//         <Header />
//       </div>

//       {/* Content */}
//       <div className="container flex-1 z-10 flex flex-col justify-center items-center text-white gap-3 sm:gap-5 pt-32 sm:pt-40">
//         <h1 className="text-4xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-2 sm:mb-3 text-center font-['helvetica']">
//           The Future of Hiring is Here
//         </h1>
//       </div>
//     </section>
//   );
// }

"use client";

import Header from "@/components/layout/Header";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const [showImage, setShowImage] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check if mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);

    // Delay image loading on mobile to prioritize text rendering
    const timer = setTimeout(() => {
      setShowImage(true);
    }, isMobile ? 800 : 100); // Longer delay on mobile

    return () => {
      window.removeEventListener('resize', checkMobile);
      clearTimeout(timer);
    };
  }, [isMobile]);

  return (
    <section id="hero" className="relative h-screen w-full flex flex-col items-center overflow-hidden bg-black mt-0 pt-0">
      {/* Mobile-optimized gradient background - always visible */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-purple-900 z-0" />
      
      {/* Conditional image loading */}
      {showImage && (
        <div className="absolute inset-0 z-[1]">
          <Image
            src="/herobg.webp"
            alt=""
            fill
            priority={false} // Changed to false for mobile
            quality={isMobile ? 40 : 60} // Much lower quality on mobile
            sizes={isMobile ? "100vw" : "100vw"}
            className="object-cover opacity-60"
            loading="lazy" // Lazy load to prioritize text
          />
        </div>
      )}

      {/* Overlay - higher z-index to ensure text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-[2]" />

      {/* Header - immediate render with high z-index */}
      <div className="w-full relative z-30">
        <Header />
      </div>

      {/* Content - immediate render with highest z-index */}
      <div className="container flex-1 z-40 flex flex-col justify-center items-center text-white gap-3 sm:gap-5 pt-32 sm:pt-40">
        <h1 className="text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-2 sm:mb-3 text-center font-sans tracking-tight leading-tight">
          The Future of Hiring is Here
        </h1>
      </div>
    </section>
  );
}