import React from 'react'
import dynamic from 'next/dynamic';
import { COMPANY_DATA, TESTIMONIALS_DATA } from "@/constants";
import CompanyCarouselComponent from './CompanyCarouselComponent';
const TestimonialCarouselComponent = dynamic(() => import("./TestimonialCarouselComponent"));

export default function TestimonialSection() {
  return (
    <section id="testimonials" className="bg-gradient-to-b from-[#070707] via-[#18181b] to-[#151A22] pb-4 md:py-20">
      <div className="container px-6 md:px-12 lg:px-10 space-y-3 flex flex-col items-center">
          <div id="testimonials-content" className="w-full text-2xl sm:text-5xl font-bold text-center pt-10">
            <span className="bg-gradient-to-r from-[#FFCD40] to-[#FFA01E] bg-clip-text text-transparent">
              Trusted by
            </span>{" "}
            <span className="text-white">
              Top Companies
            </span>
          </div>
          <div className="flex flex-col w-full items-center">
            <CompanyCarouselComponent testimonials={COMPANY_DATA}/>
            <TestimonialCarouselComponent testimonials={TESTIMONIALS_DATA}/>
          </div>
      </div>
    </section>
  );
}