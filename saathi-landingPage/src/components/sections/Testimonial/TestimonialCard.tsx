import Image from 'next/image';
import React from 'react';

interface TestimonialItem {
  id: string;
  role: string;
  company: string;
  testimonial: string;
}

interface TestimonialCardProps {
  testimonial: TestimonialItem;
  isDuplicate?: boolean;
  isHovering: string | null;
  isMobile: boolean;
  handleCardHover: (id: string, isHovering: boolean) => void;
}

const TestimonialCard = ({
  testimonial,
  isDuplicate = false,
  isHovering,
  isMobile,
  handleCardHover,
}: TestimonialCardProps) => (
  <div
    key={`${isDuplicate ? "duplicate" : "original"}-${testimonial.id}`}
    className={`relative flex-shrink-0 mx-2 transition-all duration-300 ${
      isHovering === testimonial.id
        ? "w-[384px] md:w-[400px] h-[250px] md:h-[250px] md:z-10 md:scale-105"
        : "w-[300px] md:w-[385px] h-[210px] md:h-[210px]"
    }`}
    onMouseEnter={() => !isMobile && handleCardHover(testimonial.id, true)}
    onMouseLeave={() => !isMobile && handleCardHover(testimonial.id, false)}
  >
    <div className="w-full h-full relative rounded-2xl overflow-hidden bg-[#000000] shadow-lg hover:shadow-xl transition-all duration-300 hover:rounded-2xl">
      {/* Company Header */}
      {/* removed `border-b` and made it `relative` to anchor the separator */}
      <div className="px-6 pt-4 pb-4 relative">
        <div className="flex m-1">
          <h3 className="bg-gradient-to-r from-[#FFCD40] to-[#FFA01E] bg-clip-text text-transparent font-medium text-lg mr-1">
            {testimonial.company}
          </h3>
          <h3 className="text-[#FFFFFF] font-medium text-lg">{testimonial.role}</h3>
        </div>

        {/* Quote Icon */}
        <div className="absolute top-4 right-6 z-10">
          <svg
            className="w-10 h-10 text-white transform rotate-180"
            fill="currentColor"
            viewBox="0 0 30 22"
          >
            <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-10zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
          </svg>
        </div>

        {/* Separator image as the bottom border */}
        <Image
          src="/images/horizontalSeparator.svg"
          alt="separator"
          width={150}
          height={1}
          className="pointer-events-none select-none absolute bottom-0 left-6 right-6 w-[180px] h-auto"
        />
      </div>

      {/* Testimonial Content */}
      <div className="p-6 flex-1 flex items-start justify-start">
        <div className="w-full">
          <p
            className={`text-white font-normal text-base leading-6 tracking-normal ${
              isHovering === testimonial.id ? "text-base" : "text-base line-clamp-6"
            }`}
          >
            {testimonial.testimonial}
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default TestimonialCard;