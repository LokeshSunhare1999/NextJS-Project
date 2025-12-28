import { CREDIT_TO_FINALIZE } from "@/constants/payment";
import React from "react";

const PricingHeaders = ({
  showIcon = true,
  title = "Power Up with Credits",
  description = "Use credits to finalize candidates and view their contact details ",
  interviewCost = CREDIT_TO_FINALIZE,
}) => {
  return (
    <div>
      <div className="flex flex-col gap-4 justify-between items-center">
        {showIcon ? (
          <div className="rounded-full w-12 h-12 md:h-16 md:w-16 flex items-center justify-center text-2xl font-bold text-black mb-2 border-[2px] border-[#8E6218] bg-[linear-gradient(302deg,_#8E6218_-43.67%,_#F9DDAB_26.17%,_#9C7228_96.01%)]">
            C
          </div>
        ) : null}
        <div className="text-3xl font-semibold text-center w-full text-[#000000]">
          {title}
        </div>
      </div>
      <p className="text-center mt-1 text-[#111]">{description}</p>
      <div className="mt-2 mb-4 flex justify-center">
        <span className="font-semibold bg-[linear-gradient(90deg,_#8F3AFF_0%,_#006AFF_100%)] text-white px-4 py-1 rounded-full text-sm">
          <div className="flex gap-2 justify-center items-center">
            <p>FINALIZE 1 CANDIDATE</p>
            <p>→</p>
            <p>IN {interviewCost} CREDITS</p>
          </div>
        </span>
      </div>
    </div>
  );
};

export default PricingHeaders;
