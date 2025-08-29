import React from 'react';
import '../../../../public/styles/IdentityVerified.css';
import '../../../../public/styles/MobileScreenStyles.css';
import { EMPLOYER_BENEFITS, FEATURES, IDENTITY_MOCKUP_IMAGES, WORKER_BENEFITS } from '@/constants';
import Image from 'next/image';

const sections = [
  {
    key: "trueid",
    heading: "Live on TrueID",
    title: (
      <><div className=''>Live on Saathi <span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">TrueID</span></div></>
    ),
    content: (
      <>
        <div className="text-left text-xl sm:text-lg md:text-[28px] font-regular mt-2 mb-8 pl-5 text-gray-400">
          Live on <span className="text-white">True</span><span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span>
        </div>
        <ul className="space-y-4 sm:space-y-5 px-1">
          {FEATURES.map((f, i) => (
            <li key={i} className="flex flex-row items-center gap-2 md:gap-3 px-2 ">
              <span className="inline-block w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#FFC226] rounded-full flex items-center justify-center font-bold shrink-0">
                <Image
                  src={['/assets/home/face_detection.svg', '/assets/home/id_card.svg', '/assets/home/legal_2.svg', '/assets/home/experience.svg'][i]}
                  alt="icon"
                  width={28}
                  height={28}
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  loading="lazy"
                />
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-bold text-md sm:text-sm md:text-lg text-[#FFC226] text-left block break-words">
                  {f.title}
                </span>
                <div className="text-gray-200 text-md sm:text-sm md:text-base font-regular text-left break-words whitespace-normal">
                  {f.desc}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
    image: '/assets/home/identity1.webp'
  },
  {
    key: "worker",
    heading: "TrueID for the Workforce",
    title: null,
    content: (
      <>
        <div className="text-left text-xl sm:text-lg md:text-[28px] font-regular mt-2 mb-8 pl-5 text-gray-400">
          <span className="text-white">True</span><span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span> <span className="text-gray-400">for the Workforce</span>
        </div>
        <ul className="space-y-4 sm:space-y-5 px-1">
          {WORKER_BENEFITS.map((item, idx) => (
            <li key={idx} className="flex flex-row items-center gap-2 md:gap-3 px-2">
              <span className="inline-block w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#FFC226] rounded-full flex items-center justify-center font-bold shrink-0">
                <Image
                  src={item.icon}
                  alt="icon"
                  width={28}
                  height={28}
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  loading="lazy"
                />
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-regular text-md sm:text-sm md:text-[18px] text-white text-left block break-words">
                  {item.title} <span className="text-[#FFC226]">{item.desc}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
    image: '/assets/home/identity1.webp'
  },
  {
    key: "employer",
    heading: "TrueID for Recruiters",
    title: null,
    content: (
      <>
        <div className="text-left text-xl sm:text-lg md:text-[28px] font-regular mt-2 mb-8 pl-5 text-gray-400">
          <span className="text-white">True</span><span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span> <span className="text-gray-400">for Recruiters</span>
        </div>
        <ul className="space-y-4 sm:space-y-5 px-1">
          {EMPLOYER_BENEFITS.map((item, idx) => (
            <li key={idx} className="flex flex-row items-center gap-2 md:gap-3 px-2">
              <span className="inline-block w-8 h-8 sm:w-8 sm:h-8 md:w-10 md:h-10 bg-[#FFC226] rounded-full flex items-center justify-center font-bold shrink-0">
                <Image
                  src={item.icon}
                  alt="icon"
                  width={28}
                  height={28}
                  className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7"
                  loading="lazy"
                />
              </span>
              <div className="flex-1 min-w-0">
                <span className="font-regular text-md sm:text-sm md:text-[18px] text-white text-left block break-words">
                  {item.title} <span className="text-[#FFC226]">{item.desc}</span>
                </span>
              </div>
            </li>
          ))}
        </ul>
      </>
    ),
    image: '/assets/home/identity1.webp'
  },
];

const IdentityVerified: React.FC<{ showFrame?: boolean }> = ({ showFrame = false }) => {
  return (
    <section id="guide" className="transparent-bg pb-16 pt-6">
      <div className="w-full max-w-7xl mx-auto px-4 md:px-8">
        
        {/* Desktop Layout */}
        <div className="hidden md:block">
          <div className="flex flex-row gap-12 items-start">
            {/* Left Content */}
            <div className="flex-1">
              {/* First section - Full width */}
              <div className="mb-14">
                {sections[0].content}
              </div>
              
              {/* Second and third sections - 50/50 split */}
              <div className="flex flex-row gap-8">
                <div className="flex-1">
                  {sections[1].content}
                </div>
                <div className="flex-1">
                  {sections[2].content}
                </div>
              </div>
            </div>

            {/* Right Image - Smaller size */}
            <div className="flex justify-center" style={{ width: '320px' }}>
              <div className="w-full max-w-xs">
                {showFrame ? (
                  <div className="relative">
                    <div className="relative">
                      <Image
                        src={IDENTITY_MOCKUP_IMAGES[0].src}
                        alt="TrueID App"
                        width={240}
                        height={480}
                        className="w-full h-auto"
                        sizes={IDENTITY_MOCKUP_IMAGES[0].sizes}
                        loading="lazy"
                      />
                    </div>
                    <Image
                      src="/images/frame.svg"
                      alt="iPhone Frame"
                      width={256}
                      height={512}
                      className="absolute inset-0 w-full h-auto pointer-events-none"
                      loading="lazy"
                    />
                  </div>
                ) : (
                  <Image
                    src={IDENTITY_MOCKUP_IMAGES[0].src}
                    alt="TrueID App"
                    width={220}
                    height={400}
                    className="w-full h-auto"
                    sizes={IDENTITY_MOCKUP_IMAGES[0].sizes}
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="md:hidden">
          {sections.map((section, index) => (
            <div key={index} className="mb-12">
              <div className="mb-8">
                {section.content}
              </div>
              
              <div className="flex justify-center">
                <div className="w-64 sm:w-72">
                  <Image
                    src={IDENTITY_MOCKUP_IMAGES[0].src}
                    alt={`TrueID Feature ${index + 1}`}
                    width={280}
                    height={500}
                    className="w-full h-auto"
                    sizes={IDENTITY_MOCKUP_IMAGES[0].sizes}
                    loading="lazy"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default IdentityVerified;