import Svg from "@/components/Svg";
import MembershipIcon from "@/assets/icons/common/membershipIcon.svg";
import CustomCTA from "@/components/CustomCTA";
import {
  FREE_JOB_POST_LIMIT,
  RUPEE_SYMBOL,
  YEAR_MEMBERSHIP_PRICE,
} from "@/constants";

export default function FreeJobBanner({
  freeJobPostAvailable = FREE_JOB_POST_LIMIT,
  handleCtaClick,
  isSubscriptionActive = true,
  actualPrice = YEAR_MEMBERSHIP_PRICE,
}) {
  if (isSubscriptionActive) {
    return null;  
  }
  return (
    <div className="pt-2">
      <div className="w-full h-auto pl-5 p-5 flex items-center justify-between bgBase membershipBannerBg relative rounded-lg">
        <div className="w-[85%] flex items-center justify-between">
          <div className={`flex justify-between items-center w-full `}>
            <div className="flex gap-3">
              <Svg
                width="54"
                height="54"
                viewBox="0 0 54 54"
                icon={<MembershipIcon />}
              />

              <div className="flex flex-col gap-1">
                <p className="text-[20px] font-semibold text-[#FFFFFF]">
                  Post Unlimited Jobs for 12 Months
                </p>
                <p className="text-[14px] leading-[20px] font-medium text-[#D7D8F6]">
                  {freeJobPostAvailable} Free job posts left
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative greenBg w-[278px] h-[36px] flex text-[#35009A] pl-7">
            <div className="flex items-center">
              <p className="p-2 text-[20px] leading-[22px] font-semibold">
                {" "}
                {RUPEE_SYMBOL}
                {actualPrice}
                <sup>*</sup>{" "}
              </p>
              <p className="text-[10px] leading-[16px] font-semibold -ml-2">
                /yr only
              </p>
              <div className="relative whiteBg w-[118px] h-[16px] flex items-center">
                <p className="text-[10px] leading-[16px] font-semibold pl-2">
                  LIMITED PERIOD OFFER
                </p>
              </div>
            </div>
          </div>
          <div>
            <CustomCTA
              title="Upgrade to Unlimited"
              fontSize="16px"
              fontWeight="600"
              borderColor="#FFC01D"
              backgroundColor="#24008C"
              textColor="#FFC01D"
              border="2px solid"
              borderRadius="8px"
              hoverBgColor="#24008C"
              hoverBorderColor="#FFC01D"
              hoverTextColor="#FFC01D"
              onClickFn={handleCtaClick}
            />
            <div
              className="text-[10px] font-medium text-center bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #FFC01D 0%, #FFD955 49.16%, #FF9A01 100%)",
              }}
            >
              Get 100 AI Interviews FREE
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
