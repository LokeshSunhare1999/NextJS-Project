import GreyCross from "@/assets/icons/common/greyCross.svg";
import RedCross from "@/assets/icons/jobs/redcross.svg";
import CustomCTA from "@/components/CustomCTA";
import CustomModal from "@/components/CustomModal";

export default function RejectApplicationModal({
  isRejectModalOpen,
  setIsRejectModalOpen,
  handleRejectNowClick,
  candidateName,
}) {
  const handleModalClose = () => {
    setIsRejectModalOpen(false);
  };
  return (
    <CustomModal
      isOpen={isRejectModalOpen}
      onClose={handleModalClose}
      modalStyles={`w-[432px] h-auto rounded-10 bg-white px-4 pt-3 pb-6 z-60 relative w-full max-w-md rounded-lg bg-white p-6 shadow-lg `}
    >
      <div className="flex w-full flex-row-reverse">
        <button onClick={handleModalClose}>
          {" "}
          <GreyCross />{" "}
        </button>
      </div>
      <div className="flex w-full flex-col items-center">
        <RedCross />
        <span className="mb-5 text-xl font-semibold leading-[30px] text-black text-center">
          Are you sure you want to reject <br />
          {candidateName}'s job application?
        </span>

        <div className="w-full flex flex-row items-center justify-center gap-5">
          <CustomCTA
            width={"94px"}
            height={"44px"}
            title="No"
            fontSize="16px"
            fontWeight="400"
            lineHeight="24px"
            onClickFn={handleModalClose}
            borderColor="#CDD4DF"
            backgroundColor="#FFFFFF"
            hoverBgColor="#FFFFFF"
            hoverBorderColor="#CDD4DF"
            textColor="#586275"
            hoverTextColor="#586275"
          />

          <CustomCTA
            width={"104px"}
            height={"44px"}
            title="Yes"
            fontSize="16px"
            fontWeight="400"
            lineHeight="24px"
            onClickFn={handleRejectNowClick}
            borderColor="#CDD4DF"
            backgroundColor="#F31919"
            hoverBgColor="#F31919"
            hoverBorderColor="#CDD4DF"
            textColor="#FFFFFF"
            hoverTextColor="#FFFFFF"
          />
        </div>
      </div>
    </CustomModal>
  );
}
