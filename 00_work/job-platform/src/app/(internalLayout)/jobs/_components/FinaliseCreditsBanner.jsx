import Svg from "@/components/Svg";
import FinaliseIcon from "@/assets/icons/jobs/finaliseIcon.svg";
import CrossIcon from "@/assets/icons/common/blackCrossBox.svg";
import { useEffect, useState } from "react";

export default function FinaliseCreditsBanner({}) {
  const [finaliseBannerKey, setFinaliseBannerKey] = useState(false);
  const handleCrossClick = () => {
    setFinaliseBannerKey(false);
    localStorage?.setItem("finaliseBannerKey", "true");
  };
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !localStorage?.getItem("finaliseBannerKey")
    ) {
      setFinaliseBannerKey(true);
    }
  }, []);
  if (!finaliseBannerKey) return null;
  return (
    <div className="pt-2">
      <div className="w-full h-auto pl-5 p-4 flex items-center justify-between bgBase finaliseCreditsBannerBg relative rounded-[12px]">
        <div className={`flex justify-between items-center w-full`}>
          <div className="flex gap-4">
            <Svg
              width="44"
              height="44"
              viewBox="0 0 44 44"
              icon={<FinaliseIcon />}
            />
            <div className="flex flex-col gap-1">
              <p className="text-[16px] leading-[20px] font-semibold text-[#FFFFFF]">
                Finalize to view phone number
              </p>
              <p className="text-[12px] leading-[20px] font-normal text-[#D7D8F6]">
                20 credits are deducted for each candidate you finalize.
              </p>
            </div>
          </div>
          <div onClick={handleCrossClick}>
            <Svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              icon={<CrossIcon />}
              className="cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
