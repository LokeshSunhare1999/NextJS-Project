import { ReactNode } from 'react';

interface IdentityVerifiedHeaderProps {
  title?: ReactNode;
  subtitle?: string;
  description?: ReactNode;
}

export default function IdentityVerifiedHeader({ 
  title = (
    <>
      Saathi True<span className="bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent">ID</span>
    </>
  ),
  subtitle = "LinkedIn of the Workforce",
  description = <div className="text-center text-gray-400 text-xl sm:text-lg md:text-[40px] font-regular pb-6 md:pb-10 max-w-5xl md:leading-none">A single automated snapshot of  authenticated details redefining
                <span className=" text-white"> Worker-Employer</span> trust metrics</div>
}: IdentityVerifiedHeaderProps) {
  return (
    <div className="w-full bg-black h-fit flex ">
      <div className="mb-2 sm:mb-4 mt-1 sm:mt-4 md:mt-20 px-0 sm:px-4 w-full md:px-16">
        <div 
          className="text-center md:text-left w-full"
          style={{
            position: 'relative',
            zIndex: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <h1 className="text-4xl sm:text-4xl md:text-6xl font-bold text-white font-['Helvetica']">
            {title}
          </h1>
          <p className="text-gray-400 italic text-md sm:text-md md:text-[18px] py-1 font-['Helvetica']">
            {subtitle}
          </p>
          <div className="pt-1 md:pt-2">
            <h2 className="text-white text-center text-2xl sm:text-3xl md:text-[40px] font-light pb-4 md:pb-6 font-['Helvetica']">
              {description}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
} 