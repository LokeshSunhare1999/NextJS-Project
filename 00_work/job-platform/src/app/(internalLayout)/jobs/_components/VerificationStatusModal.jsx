import CustomModal from "@/components/CustomModal";
import GreyCross from "@/assets/icons/common/greyCross.svg";
import PendingIcon from "@/assets/icons/common/pendingIcon.svg";
import Svg from "@/components/Svg";
import CustomCTA from "@/components/CustomCTA";

export default function VerificationStatusModal({
  isOpen,
  handleClose,
  handleClick,
  icon,
  heading,
  description,
  actionCtaText,
}) {
  return (
    <CustomModal
      zIndex={1300}
      isOpen={isOpen}
      onClose={handleClose}
      modalStyles={`max-w-full w-[320px] h-[350px] md:h-[358px] md:w-[580px] p-5 z-60 relative rounded-[20px] bg-white shadow-lg`}
    >
      <div>
        <div className="flex w-full flex-row-reverse cursor-pointer">
          <button onClick={handleClose}>
            {" "}
            <GreyCross />{" "}
          </button>
        </div>
        <div className="flex flex-col items-center text-center md:px-5">
          {icon && (
            <Svg
              width="100"
              height="100"
              viewBox="0 0 54 54"
              icon={icon}
              className={"h-[70px] w-[70px] md:h-[100px] md:w-[100px]"}
            />
          )}
          <div className="flex flex-col md:gap-2 mt-5 items-center pt-2">
            <p className="text-[20px] md:text-[32px] leading-[42px] text-[#111111] font-semibold">
              {heading}
            </p>
            <p className="text-[16px] leading-[24px] text-[#666666] font-normal">
              {description}
            </p>
          </div>
          <div className="pt-2 md:pt-0 my-4 flex w-full justify-center">
            <CustomCTA
              title={actionCtaText}
              fontSize="20px"
              fontWeight="600"
              backgroundColor="#141482"
              borderRadius="8px"
              hoverBgColor="#141482"
              width={"500px"}
              height="60px"
              onClickFn={handleClick}
            />
          </div>
        </div>
      </div>
    </CustomModal>
  );
}
