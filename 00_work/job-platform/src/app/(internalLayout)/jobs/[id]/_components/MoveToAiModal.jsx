import CustomModal from "@/components/CustomModal";
import Svg from "@/components/Svg";
import MoveToAi from "@/assets/icons/common/moveToAi.svg";
import GreyCross from "@/assets/icons/common/greyCross.svg";
import { CREDIT_TO_FINALIZE } from "@/constants/payment";
import CustomCTA from "@/components/CustomCTA";

export default function MoveToAiModal({
  isMoveToAIRecruiterModalOpen,
  handleMoveToAIRecruiterModalClose,
  handleClick,
  employerCredits,
  numberOfCandidates = 0,
}) {
  return (
    <CustomModal
      zIndex={1300}
      isOpen={isMoveToAIRecruiterModalOpen}
      onClose={handleMoveToAIRecruiterModalClose}
      modalStyles={`max-w-full w-[340px] h-[360px] md:h-[420px] md:w-[560px] rounded-[20px] p-5 md:p-10 bg-white z-60 relative rounded-lg bg-white shadow-lg`}
    >
      <div className="absolute top-0 right-0 flex w-auto flex-row-reverse p-5">
        <button
          onClick={handleMoveToAIRecruiterModalClose}
          className="cursor-pointer"
        >
          <GreyCross />
        </button>
      </div>
      <div className="flex flex-col py-3 gap-2">
        <div className="flex flex-col w-full">
          <div className="flex justify-center items-center">
            <Svg
              width="84"
              height="84"
              viewBox="0 0 84 84"
              icon={<MoveToAi />}
            />
          </div>
          <span className="text-[#111111]  text-[18px] md:text-[32px] font-semibold flex text-center justify-center mt-3 md:mt-6 md:leading-9">
            Move {numberOfCandidates || ""} candidate
            {numberOfCandidates > 1 ? "s" : ""} <br /> to AI Recruiter?
          </span>
          <div className="mt-2 mb-4 flex justify-center">
            <span className="font-semibold bg-[linear-gradient(90deg,_#8F3AFF_0%,_#006AFF_100%)] text-white px-4 py-1 rounded-full text-sm">
              <div className="flex gap-2 justify-center items-center">
                <p>1 AI INTERVIEW</p>
                <p>→</p>
                <p>IN {CREDIT_TO_FINALIZE} CREDITS</p>
              </div>
            </span>
          </div>
          <span className="text-sm text-[#666] text-center">
            Credits will only be used after the AI interview is completed.
          </span>
        </div>

        <div className="block md:hidden">
          <CustomCTA
            backgroundImg="linear-gradient(270deg, #8E6218 0%, #F9DDAB 50%, #9C7228 100%)"
            width="100%"
            height="44px"
            hoverTextColor="#111"
            textColor="#111"
            fontSize="20px"
            fontWeight="600"
            title="Confirm"
            border="none"
            onClickFn={handleClick}
          />
        </div>
        <div className="w-full mt-5 justify-center hidden md:block">
          <CustomCTA
            backgroundImg="linear-gradient(270deg, #8E6218 0%, #F9DDAB 50%, #9C7228 100%)"
            width="480px"
            height="58px"
            hoverTextColor="#111"
            textColor="#111"
            fontSize="20px"
            fontWeight="700"
            title="Confirm"
            border="none"
            onClickFn={handleClick}
          />
        </div>
      </div>
    </CustomModal>
  );
}
