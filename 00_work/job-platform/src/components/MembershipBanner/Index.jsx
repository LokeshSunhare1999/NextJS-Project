import React from "react";
import BannerStar from "@/assets/icons/common/bannerStar.svg";
import { SUBSCRIPTION_BENEFITS } from "@/constants/payment";

const MembershipBanner = ({
  title,
  icon,
  subString,
  actualPrice,
  loginPageTexts,
}) => {
  return (
    <div className="w-full h-[52px] py-2 px-4 flex items-center bgBase externalBannerBg relative">
      <div className="flex flex-row items-center pl-8">
        <span className="text-[14px] leading-[20px] text-white font-medium mr-1">
          {title}
        </span>
        <BannerStar />
        <div className="flex flex-row items-center gap-5 ml-[10px]">
          {SUBSCRIPTION_BENEFITS?.map((benefit, idx) => {
            return (
              <div
                key={benefit?.title}
                className="flex flex-row items-center gap-2"
              >
                {benefit?.icon}
                <span className="text-[#E0DAFC] text-[14px] leading-[20px] font-medium">
                  {loginPageTexts?.[idx]}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MembershipBanner;
