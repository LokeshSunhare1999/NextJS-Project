import Svg from "@/components/Svg";
import WhiteInfo from "@/assets/icons/common/whiteInfo.svg";
import CustomCTA from "@/components/CustomCTA";
import Link from "next/link";

const NotEnoughCreditBanner = ({
  selectedCandidatesLength = 0,
  maxCandidatesToBeHired = 1,
}) => {
  if (selectedCandidatesLength <= maxCandidatesToBeHired) {
    return null;
  }

  return (
    <div
      style={{
        background: "linear-gradient(90deg, #E72F21 74.66%, #4701A9 90.89%)",
      }}
      className="flex items-center justify-between z-10 px-5 py-1 md:flex-row flex-col"
    >
      <div className="flex gap-2 items-start md:items-center">
        <Svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          className="flex-shrink-0"
          icon={<WhiteInfo />}
        />
        <span className="text-white text-[14px] font-medium">
          You can only finalise {maxCandidatesToBeHired} candidate. Add credits
          to finalise more.
        </span>
      </div>
      <div className="hidden md:block">
        <Link className="w-full" href={"/buy-credits"}>
          <CustomCTA
            width={"202px"}
            height="44px"
            title={"Add Credits"}
            textColor="#000000"
            hoverTextColor="#000000"
            fontSize="15px"
            lineHeight="28px"
            fontWeight="600"
            backgroundImg="linear-gradient(270deg, #8E6218 0%, #F9DDAB 50%, #9C7228 100%)"
          />
        </Link>
      </div>
      <div className="w-full mt-[10px] block md:hidden">
        <Link className="w-full" href={"/buy-credits"}>
          <CustomCTA
            width={"100%"}
            height="40px"
            title={"Add Credits"}
            textColor="#000000"
            hoverTextColor="#000000"
            fontSize="16px"
            lineHeight="28px"
            fontWeight="600"
            backgroundImg="linear-gradient(270deg, #8E6218 0%, #F9DDAB 50%, #9C7228 100%)"
          />
        </Link>
      </div>
    </div>
  );
};

export default NotEnoughCreditBanner;
