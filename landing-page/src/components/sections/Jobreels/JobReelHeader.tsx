import { ReactNode } from 'react';

interface JobReelHeaderProps {
  title?: ReactNode;
  subtitle?: string;
  description?: ReactNode;
  description2?: ReactNode;
}

export default function JobReelHeader({ 
  title = (
    <>
      <span>Job</span>
      <span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">Reels</span>
    </>
  ),
  subtitle = "The Instagram of Jobs",
  description = <><p>When Resumes meet Reels,</p><p> Hiring happens Instantly</p></>,
  description2 = <><p>POST.SWYP.MATCH.HIRE</p><p> Fast.Fun.Effortless</p></>
}: JobReelHeaderProps) {
  return (
    <div className="w-full bg-black h-fit flex ">
      <div className="pb-2 sm:pb-4 pt-1 sm:pt-4 md:pt-20 px-0 w-full "> 
        <div 
          className="text-center md:text-left w-full"
          style={{
            position: 'relative',
            zIndex: 50
          }}
        >
          <h1 className="text-4xl sm:text-4xl md:text-6xl font-bold text-white font-['Helvetica']">
            {title}
          </h1>
          <p className="text-gray-400 italic text-md sm:text-md md:text-[18px] py-1 font-['Helvetica']">
            {subtitle}
          </p>
          <div className="mt-1 md:mt-2">
            <h2 className="text-white text-2xl sm:text-3xl md:text-[40px] font-light leading-tight pb-4 md:pb-6 font-['Helvetica']">
              {description}
            </h2>
            <h4 className="text-gray-400 text-lg sm:text-xl md:text-[28px] font-medium leading-tight font-['Helvetica']  md:space-y-1">
              {description2}
            </h4>
          </div>
        </div>
      </div>
    </div>
  );
} 