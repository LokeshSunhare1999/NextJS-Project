import React from "react";

const FullWidthTextSection = () => {
  return (
    <section className="w-full bg-black py-4 px-5 md:px-20 w-full">
      <div className="w-full flex flex-col gap-2 md:gap-4 overflow-hidden">
        <h2 className="text-white font-regular text-lg md:text-3xl w-full text-center md:text-left pb-2 md:pb-4 md:px-0 px-2">
          Trusted by
        </h2>
        <h1 className="text-gray-800 font-bold text-7xl md:text-[250px] lg:text-[290px]leading-tight text-center md:text-left ">
            2,000,000+
          </h1>
      </div>
    </section>
  );
};

export default FullWidthTextSection; 