"use client";
import Image from "next/image";

const SaathiEcosystem = () => {
  return (
    <div id="ecosystem" className="w-full h-full flex flex-col bg-[#070707] items-center gap-7  border-t border-[#19181f] py-10 px-5 md:px-20">
      <div className="flex h-full flex-col items-center mt-10 mb-2">
        <h2 className="text-center text-4xl md:text-[58px] font-semibold tracking-tight bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent leading-tight">
          <span className="text-white">Saathi</span> Ecosystem
        </h2>
      </div>

      <div className="flex justify-center w-full gap-4">
        <img
          src="/images/identityImg.webp"
          alt="mobile-1"
          className="max-h-[150px] md:max-h-[420px] mt-1 md:-mt-4"
          loading="lazy"
        />
        <img
          src="/images/skillingImg.webp"
          alt="mobile-2"
          className="z-10 max-h-[150px] md:max-h-[400px] relative"  
          loading="lazy"
        />
         <img
          src="/images/jobs.webp"
          alt="mobile-3"
          className="z-10 max-h-[150px] md:max-h-[400px] relative"
          loading="lazy"
        />
        <img
          src="/images/community.webp"
          alt="mobile-4"
          className="max-h-[150px] md:max-h-[420px] mt-1 md:-mt-4"
          loading="lazy"
        />
      </div>

      <p className="pt-5 max-w-[95%] text-gray-400 text-center  text-xl md:text-[40px] font-medium leading-tight tracking-[-0.8px] ">
      An AI-powered mobile ecosystem <span className="text-white">transforming our workforce </span>with digital verified identities, skilling and certification, jobs and communities.
      </p>
    </div>
  );
};

export default SaathiEcosystem; 