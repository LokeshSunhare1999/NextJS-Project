import GreyCross from "@/assets/icons/common/greyCross.svg";
import TrustedIcon from "@/assets/icons/jobs/trustedIcon.svg";
import GreyLock from "@/assets/icons/common/greyLock.svg";
import GreySupoort from "@/assets/icons/common/greySupport.svg";
import JobsIcon from "@/assets/icons/jobs/modalJobsIcon.svg";
import CustomCTA from "@/components/CustomCTA";
import CustomModal from "@/components/CustomModal";
import Svg from "@/components/Svg";
import { useRouter } from "next/navigation";
import { useContext } from "react";
import { LoadingContext } from "@/providers/LoadingProvider";

export default function UpgradeModal({
  isUpgradeModalOpen,
  setIsUpgradeModalOpen,
}) {
  const router = useRouter();
  const { showLoading } = useContext(LoadingContext);
  const handleModalClose = () => {
    setIsUpgradeModalOpen(false);
  };
  const handleUnlockJobPostClick = () => {
    showLoading();
    router.push("/payment");
    setIsUpgradeModalOpen(false);
  };
  return (
    <CustomModal
      isOpen={isUpgradeModalOpen}
      onClose={handleModalClose}
      modalStyles={`w-[335px] h-[546px] max-w-[335px] md:w-[650px] rounded-10 bg-white  pt-3 pb-6 z-60 relative w-full md:max-w-[650px] rounded-[20px] shadow-lg upgradeModalBg `}
    >
      <div className="flex w-full flex-row-reverse px-6">
        <button onClick={handleModalClose}>
          <Svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            icon={<GreyCross />}
          />
        </button>
      </div>
      <div className="relative z-10 flex flex-col">
        <div className="flex justify-center md:my-5">
          <Svg
            width="144"
            height="131"
            viewBox="0 0 144 131"
            icon={<JobsIcon />}
          />
        </div>

        <p className="md:px-5 text-center text-[24px] leading[36px] md:text-[28px] md:leading[36px] font-semibold text-[#111111]">
          Upgrade & Post Unlimited Jobs
        </p>
        <p className="px-5 text-center text-[14px] leading[20px] font-normal text-[#333333]">
          Hire at scale and attract top talent
        </p>

        <div
          className="flex justify-center items-center md:mx-8 mx-2 rounded-[20px] mt-5 gap-20 md:gap-60 py-2 md:py-0 "
          style={{
            background: "linear-gradient(90.3deg, #8F3AFF 0%, #006AFF 100%)",
          }}
        >
          <div className="flex flex-col ml-2 text-[#FFFFFF]">
            <p className="text-[16px] leading[24px] font-semibold">
              Just ₹16/day
            </p>
            <p className="text-[12px] leading[18px] font-normal">
              Hire faster, smarter - for a full year.
            </p>
          </div>
          <div>
            <Svg
              width="88"
              height="68"
              viewBox="0 0 88 68"
              icon={<TrustedIcon />}
            />
          </div>
        </div>
        <div className="flex  justify-center mt-9 md:mt-15 md:gap-5 gap-8">
          <div className="flex-row flex gap-1 items-center">
            <Svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              icon={<GreyLock />}
            />
            <p className="text-[11px] md:text-[14px] leading-[18px] font-normal text-[#666666] opacity-90">
              Secure Payment
            </p>
          </div>
          <p className="border-r border-[1px] border-[#DDDDDD]"></p>

          <div className="flex-row flex gap-1 items-center">
            <Svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              icon={<GreySupoort />}
            />
            <p className="text-[11px] md:text-[14px] leading-[18px] font-normal text-[#666666] opacity-90">
              24x7 Support
            </p>
          </div>
        </div>
        <div className="flex md:flex-row flex-col border-t border-[#DDDDDD] md:mt-5 mt-3 px-6 justify-between items-center">
          <div className="flex items-center mt-3 md:mt-5">
            <p className="text-[28px] leading-[36px] font-normal text-[#111111]">
              ₹
            </p>
            <p className="text-[28px] leading-[36px] font-semibold text-[#111111]">
              5,900
            </p>
            <p className="text-[12px] md:text-[14px] leading-[18px] font-normal text-[#666666] ml-1">
              /yr (₹16 per day, billed yearly)
            </p>
          </div>
          <div className="flex justify-center mt-2 md:mt-5">
            <CustomCTA
              width={"100%"}
              height={"48px"}
              borderRadius="8px"
              title={"Upgrade to Unlimited"}
              fontWeight="600"
              fontSize="18px"
              lineHeight="26px"
              onClickFn={handleUnlockJobPostClick}
              border="none"
              backgroundColor="linear-gradient(90.3deg, #FFC01D 0%, #FFD955 49.16%, #FF9A01 100%)"
              hoverBgColor="linear-gradient(90.3deg, #FFC01D 0%, #FFD955 49.16%, #FF9A01 100%)"
              textColor="#111111"
              hoverTextColor="#111111"
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
