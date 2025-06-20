import React from "react";
import Image from "next/image";

const LargeCards = () => {
  return (
    <div className="flex flex-col md:flex-row gap-5 w-full h-full">
      {/* Card 1 */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl w-full h-full md:h-[150px] shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row items-center h-full">
          {/* Image part */}
          <div className="w-full md:w-1/3 flex items-center justify-center p-4">
            <Image
              src="/images/Certificate.webp"
              alt="Certificate Icon"
              width={128}
              height={128}
              className="object-contain w-28 h-28 md:w-32 md:h-32"
              loading="lazy"
              priority={false}
            />
          </div>
          {/* Content part */}
          <div className="w-full md:w-2/3 p-4 flex flex-col justify-center text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-regular text-white mb-2 font-['Helvetica']">
              Saathi Certificate
            </h3>
            <div className="space-y-1">
              <p className="text-md md:text-md text-gray-400 italic font-['Helvetica']">
                <span className="block md:inline">The new Gold Standard in</span>
                <span className="block md:inline"> Digital Skilling</span>
              </p>
              <p className="text-md md:text-md text-gray-400 italic font-['Helvetica']">
                delivers credibility with proof of skills and knowledge
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl w-full h-full md:h-[150px] shadow-lg border border-gray-700 hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col md:flex-row items-center h-full">
          {/* Image part */}
          <div className="w-full md:w-1/3 flex items-center justify-center p-4 sm:pt-2">
            <Image
              src="/images/rating.webp"
              alt="Rating Icon"
              width={128}
              height={128}
              className="object-contain w-28 h-28 md:w-32 md:h-32"
              loading="lazy"
              priority={false}
            />
          </div>
          {/* Content part */}
          <div className="w-full md:w-2/3 p-4 flex flex-col justify-center text-center md:text-left">
            <h3 className="text-xl md:text-2xl font-regular text-white mb-2 font-['Helvetica']">
              Saathi Rating
            </h3>
            <div className="space-y-1">
              <p className="text-md md:text-md text-gray-400 italic font-['Helvetica']">
                The single-glance metric of capability and suitability
              </p>
              <p className="text-md md:text-md text-gray-400 italic font-['Helvetica']">
                includes skill grading, KYC, psychometrics, and past employer ratings
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LargeCards; 