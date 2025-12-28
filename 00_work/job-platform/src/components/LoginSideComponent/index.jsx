import JobReelsLogo from "@/assets/images/JobReelsLogo.svg";
import Cost from "@/assets/icons/common/cost.svg";
import Ai from "@/assets/icons/common/Ai.svg";
import Time from "@/assets/icons/common/time.svg";
import Increase from "@/assets/icons/common/increase.svg";
import Image from "next/image";

const authBenefits = [
  {
    icon: <Cost />,
    title: "Reduced Cost-to-Hire",
    // description: `Enhance visibility with walk-in and premium job post boosts.`
  },
  {
    icon: <Time />,
    title: "Reduced Time-to-Hire",
    // description: "Manage leads efficiently with ATS integration, CSV access, dashboard tracking, and WhatsApp alerts."
  },
  {
    icon: <Increase />,
    title: "Increase Productivity & Profits",
    // description: `Get AI-recommended candidates from our database matching to your job postings.`
  },
  {
    icon: <Ai />,
    title: (
      <>
        Discovery, Interviews, Scoring,
        <span className="block">& Recommendation - Powered by AI</span>
      </>
    ),
    // description: `Get AI-recommended candidates from our database matching to your job postings.`
  },
];

export default function LoginSideComponent() {
  return (
    <div className="flex flex-row h-full bgBase relative">
      <Image
        loading="eager"
        src="/assets/loginScreenBg.webp"
        alt="Login Background"
        fill
        priority={true}
        fetchPriority="high"
        objectFit="cover"
        sizes="(max-width: 768px) 20vw, 50vw"
        quality={20}
      />
      <div className="absolute inset-0 z-10">
        <div className="relative h-full w-full">
          <div className="absolute left-0 top-0 z-10 flex h-full w-full flex-col md:justify-center pl-6 md:pl-12">
            <div className="absolute top-8 left-12 hidden md:block">
              <JobReelsLogo />
            </div>

            <div className="flex flex-col">
              <div className="flex flex-col font-bold tracking-[-4px] gap-1 mt-10 lg:text-[64px] lg:leading-[44px] text-[72px] leading-[64px] uppercase">
                <span className="text-[#FFF]">HIRE</span>
                <span className="text-[#FFF]">FASTER,</span>
                <span className="text-[#FFF]">BETTER,</span>
                <span className="text-[#FFF]">&amp; EASIER</span>
              </div>

              <div className="my-2 self-stretch text-[#FFF] font-[Poppins] lg:text-[22px] font-normal lg:leading-[36px] text-lg leading-[28px]">
                <span className="block">Hire Verified & Trained </span>
                <span className="">"Saathi Certified" Candidates</span>
              </div>

              <div className="mt-4 flex flex-col lg:gap-2 gap-1.5 ">
                {authBenefits.map((item) => (
                  <div key={item.title} className="flex flex-col">
                    <div className="flex flex-row lg:gap-4 gap-3 ">
                      <div className="lg:h-10 lg:w-10 text-[#CBBBE6] h-8 w-8 ">
                        {item.icon}
                      </div>
                      <span className="lg:text-[18px] font-normal lg:leading-[28px] text-[#CBBBE6] mt-1 leading-[22px]">
                        {item.title}
                      </span>
                    </div>
                    <div className="ml-[56px] mr-[104px] lg:ml-[44px] lg:mr-[60px] ">
                      <span className="text-[16px] leading-[20px] text-[#CBBBE6] lg:text-xs lg:leading-[16px] ">
                        {item?.description}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="absolute bottom-6 left-12">
                <span className="text-small text-[#FFFFFFA3] lg:text-xs">
                  ©Saathi 2025. All rights reserved.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
