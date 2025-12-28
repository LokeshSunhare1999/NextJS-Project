import Svg from "../Svg";
import RightArrow from "@/assets/icons/common/rightShift.svg";

const TextPill = ({ text, rewardId }) => {
  const handleClick = () => {
    if (rewardId) {
      window.open(
        `${process.env.NEXT_PUBLIC_WEBAPP_URL}/rewards?rewardId=${rewardId}`
      );
    }
  };
  return (
    <div
      className="flex cursor-pointer items-center gap-1 text-[#111111] text-[12px] font-medium px-2 py-1 border rounded-[100px] border-[#EBEBEB]"
      onClick={handleClick}
    >
      <span>{text}</span>
      <Svg width="10" height="10" viewBox="0 0 10 10" icon={<RightArrow />} />
    </div>
  );
};

export default TextPill;
