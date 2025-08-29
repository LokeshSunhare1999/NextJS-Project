import React, { useRef } from 'react';
import Image from 'next/image';
import { EMPLOYER_BENEFITS, FEATURES, WORKER_BENEFITS } from '@/constants';

const sections = [
  {
    key: "trueid",
    heading: "Live on TrueID",
    title: (
      <>Live on Saathi <span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">TrueID</span></>
    ),
    content: (
      <>
        <div className="text-left text-xl sm:text-lg md:text-[28px] font-regular mt-2 mb-4 pl-5 text-gray-400">
          Live on <span className="text-white">True</span><span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span>
        </div>
        <ul className="space-y-4 sm:space-y-5 px-1">
          {FEATURES.map((f, i) => (
            <li key={i} className="flex flex-row items-center gap-2 md:gap-3 px-2">
              <span className="inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#FFC226] rounded-full flex items-center justify-center font-bold shrink-0">
                <Image src={['/assets/home/face_detection.svg', '/assets/home/id_card.svg', '/assets/home/legal_2.svg', '/assets/home/experience.svg'][i]} alt="icon" width={22} height={22}/>
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
        <div className="text-left text-xl sm:text-lg md:text-[28px] font-regular mt-2 mb-4 pl-5 text-gray-400">
          <span className="text-white">True</span><span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span> <span className="text-gray-400">for the Workforce</span>
        </div>
        <ul className="space-y-4 sm:space-y-5 px-1">
          {WORKER_BENEFITS.map((item, idx) => (
            <li key={idx} className="flex flex-row items-center gap-2 md:gap-3 px-2">
              <span className="inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#FFC226] rounded-full flex items-center justify-center font-bold shrink-0">
                <Image src={item.icon} alt="icon" width={24} height={24} />
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
        <div className="text-left text-xl sm:text-lg md:text-[28px] font-regular mt-2 mb-4 pl-5 text-gray-400">
          <span className="text-white">True</span><span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span> <span className="text-gray-400">for Recruiters</span>
        </div>
        <ul className="space-y-4 sm:space-y-5 px-1">
          {EMPLOYER_BENEFITS.map((item, idx) => (
            <li key={idx} className="flex flex-row items-center gap-2 md:gap-3 px-2">
              <span className="inline-block w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#FFC226] rounded-full flex items-center justify-center font-bold shrink-0">
                <Image src={item.icon} alt="icon" width={24} height={24} />
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

const IdentityVerifiedMobile: React.FC<{ showFrame?: boolean }> = ({ showFrame = false }) => {
  const stepsRef = useRef<HTMLDivElement>(null);
  const processWrapperRef = useRef<HTMLDivElement>(null);

  return (
    <section id="guide" className="transparent-bg block md:hidden">
      <div className="">
        <div className="" ref={processWrapperRef} data-animate="true">
          {/*Right Side*/}
          <div className="flex justify-center items-center">
            <Image
              src="/assets/home/identity1.webp"
              alt="Identity Verified"
              width={256}
              height={256}
              className="mx-auto w-64 h-auto"
              sizes="(max-width: 767px) 90vw, (max-width: 991px) 95vw, 940px"
            />
          </div>
          {/*Left Side*/}
          <div className="" ref={stepsRef} data-animate="true">
            {sections.map((step, index) => (
              <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300 mx-auto my-8 w-[280px]">
                <div className="p-0">
                  <div className="">
                    <div className="">
                      {step.content}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default IdentityVerifiedMobile; 