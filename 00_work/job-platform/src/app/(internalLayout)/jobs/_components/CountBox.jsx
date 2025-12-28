import Svg from "@/components/Svg";
import GreyArrow from "@/assets/icons/common/greyArrow.svg";
import { useRouter } from "next/navigation";
import DocumentStatusPill from "@/components/DocumentStatusPill";
import { useContext } from "react";
import { LoadingContext } from "@/providers/LoadingProvider";

const CountBox = ({
  count = 0,
  text = "",
  job,
  tabIndex,
  disabled,
  pill,
  totalCount,
  totalCountLabel,
}) => {
  const router = useRouter();
  const { showLoading } = useContext(LoadingContext);

  const handleClick = () => {
    if (disabled) return;
    showLoading();
    router.push(`/jobs/${job.jobId}?tab=${tabIndex}`);
  };
  return (
    <div
      className={`border border-[#EFEFEF] rounded-[10px] w-full md:w-[240px] ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <div className="p-4">
        <div className="flex flex-col font-[500]" onClick={handleClick}>
          <div className="flex items-center gap-3">
            <p className="text-[#000000] text-[20px]">{count}</p>
            <Svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              icon={<GreyArrow />}
            />
          </div>
          <div className="flex items-center gap-2">
            <p className="text-[12px] text-[#666666] opacity-90">{text}</p>
            {pill ? (
              <p>
                <DocumentStatusPill item={pill} />
              </p>
            ) : null}
          </div>
        </div>
      </div>
      {totalCountLabel?.trim()?.length ? (
        <div className="flex gap-1 text-[12px] font-medium text-[#111111] leading-[18px] bg-[#F1F4F6] py-1 justify-center">
          <span> {totalCountLabel} </span>
          <span>{totalCount} </span>
        </div>
      ) : null}
    </div>
  );
};

export default CountBox;
