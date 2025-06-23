// "use client";

// import Header from "@/components/layout/Header";
// import Image from "next/image";

// export default function HeroSection() {
//   return (
//     <section id="hero" className="relative h-screen w-full flex flex-col items-center overflow-hidden bg-black mt-0 pt-0">
//       {/* Background image */}
//       <div className="absolute inset-0 bg-white z-0">
//         <Image
//           src="/herobg.webp"
//           alt="Hero-bg"
//           fill
//           priority={true}
//           quality={75}
//           sizes="(max-width: 768px) 100vw, 100vw"
//           className="object-cover z-[-1]"
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
import { useState } from "react";

export default function HeroSection() {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <section id="hero" className="relative h-screen w-full flex flex-col items-center overflow-hidden bg-black mt-0 pt-0">
      {/* Immediate background color to prevent layout shift */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-800" />
      
      {/* Background image with optimized loading */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/herobg.webp"
          alt="Hero background"
          fill
          priority={true}
          quality={60} // Reduced from 75
          sizes="100vw"
          className={`object-cover transition-opacity duration-500 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          placeholder="blur"
          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R+Xsl4jUEXmlsn/2Q=="
        />
      </div>

      {/* Overlay gradient - only show when image is loaded or immediately for text visibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30 z-5" />

      {/* Header - render immediately */}
      <div className="w-full relative z-20">
        <Header />
      </div>

      {/* Content - render immediately with high z-index */}
      <div className="container flex-1 z-10 flex flex-col justify-center items-center text-white gap-3 sm:gap-5 pt-32 sm:pt-40">
        <h1 className="text-4xl xs:text-2xl sm:text-3xl md:text-5xl lg:text-7xl font-bold mb-2 sm:mb-3 text-center font-['helvetica']">
          The Future of Hiring is Here
        </h1>
      </div>
    </section>
  );
}