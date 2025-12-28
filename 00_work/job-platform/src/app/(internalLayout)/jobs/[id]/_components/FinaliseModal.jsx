import CustomModal from "@/components/CustomModal";
import Svg from "@/components/Svg";
import GreenTick from "@/assets/icons/common/greenTick.svg";
import GreyCross from "@/assets/icons/common/greyCross.svg";
import CustomCTA from "@/components/CustomCTA";

export default function FinaliseModal({
  isFinaliseModalOpen,
  handleFinaliseModalClose,
}) {
  return (
    <CustomModal
      zIndex={1300}
      isOpen={isFinaliseModalOpen}
      onClose={handleFinaliseModalClose}
      modalStyles={`w-[300px] h-[400px] md:h-[442px] md:w-[560px] rounded-[20px] bg-white p-2 md:p-10 z-60 relative rounded-lg bg-white shadow-lg`}
    >
      <div className="absolute top-0 right-0 flex w-auto flex-row-reverse p-5">
        <button onClick={handleFinaliseModalClose}>
          <GreyCross />
        </button>
      </div>
      <div className="flex flex-col py-3 gap-2">
        <div className="flex flex-col w-full">
          <div className="flex block justify-center items-center">
            <Svg
              width="84"
              height="84"
              viewBox="0 0 84 84"
              icon={<GreenTick />}
            />
          </div>
          <span className="text-[#111111] text-[18px] md:text-[30px] font-semibold flex text-center mt-8 justify-center leading-9">
            Candidate Finalised. Act Fast!
          </span>
          <div className="flex text-[#666666] text-[12px] md:text-[16px] justify-center gap-2 text-center mt-2">
            <span>
              You can now view their number. We've notified them and shared your
              contact.
            </span>
          </div>
          <div className="flex justify-center">
            <div className="flex justify-between gap-2 p-2 rounded-full bg-[#FFECA9] w-100 px-4 mt-3">
              <span className="flex items-center rounded-full bg-[#674e0f] text-[#fff3d3] p-2 text-[12px] font-semibold">
                NOTE
              </span>
              <span className="font-normal text-[10px] md:text-[12px] text-[#674e0f] ">
                We recommend reaching out to the candidate without delay and
                proceeding to extend your offer.
              </span>
            </div>
          </div>
        </div>

        <div className="w-full mt-5 flex justify-center">
          <CustomCTA
            backgroundImg="linear-gradient(90.3deg, #24008C 0%, #4C00AD 100%"
            width="480px"
            height="58px"
            hoverTextColor="#ffffff"
            textColor="#ffffff"
            fontSize="20px"
            fontWeight="700"
            title="Ok"
            border="none"
            onClickFn={handleFinaliseModalClose}
          />
        </div>
      </div>
    </CustomModal>
  );
}
