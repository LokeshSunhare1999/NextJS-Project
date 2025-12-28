import PlaceMarker from "@/assets/icons/common/placeMarker.svg";
import Svg from "@/components/Svg";
import DocumentStatusPill from "@/components/DocumentStatusPill";
import { JOB_STATUS_MAP, jobTypes, RUPEE_SYMBOL } from "@/constants";
import { useContext } from "react";
import { EmployerContext } from "@/providers/EmployerProvider";
import ProfilePlaceholder from "@/assets/icons/common/profilePlaceholder.svg";
import ArrowBlack from "@/assets/icons/dashboard/arrowBlack.svg";
import InfoIcon from "@/assets/icons/common/info.svg";
import { Tooltip } from "@mui/material";
import CustomTooltip from "@/components/CustomTooltip";
import Link from "next/link";

const JobDetails = ({
  job,
  setIsDetailsDrawerOpen,
  dailyApplicationCount,
  dailyInterviewCompletedCount,
}) => {
  const { employer } = useContext(EmployerContext);

  const {
    title,
    status,
    uniqueJobId,
    location,
    date,
    minRange,
    maxRange,
    type,
    jobId,
  } = job;

  const handleClick = () => {
    setIsDetailsDrawerOpen(true);
  };

  const JobIDSection = () => {
    return (
      <>
        <p className="text-[#000000]">Job ID :</p>
        <p className="text-[#777777]">{uniqueJobId}</p>
      </>
    );
  };

  const JobLocation = () => {
    return (
      <>
        <Svg
          width="12"
          height="12"
          viewBox="0 0 12 12"
          icon={<PlaceMarker />}
        />
        {location}
      </>
    );
  };

  const JobDetailsLink = () => {
    return (
      <>
        <p className="text-[#141482]">Job Details</p>
        <Svg
          width="20"
          height="20"
          viewBox="0 0 20 20"
          icon={<ArrowBlack />}
          className={"-rotate-45"}
        />
      </>
    );
  };

  const renderPill = (count, label) => {
    return (
      <div className="bg-[#FFECA9] flex gap-1 px-2 py-1 rounded-[100px] justify-center flex-wrap cursor-pointer">
        <span className="font-bold">{count}</span>
        <span className="font-medium">
          New {label}
          {count > 1 ? "s" : ""} Today
        </span>
      </div>
    );
  };

  const renderDailyCount = () => {
    return (
      <div className="flex gap-2 text-[10px] leading-[18px] text-[#A38826] ">
        {dailyApplicationCount > 0 ? (
          <Link href={`/jobs/${jobId}?tab=0`}>
            {renderPill(dailyApplicationCount, "Application")}
          </Link>
        ) : null}
        {dailyInterviewCompletedCount > 0 ? (
          <Link href={`/jobs/${jobId}?tab=1`}>
            {renderPill(dailyInterviewCompletedCount, "Interview")}
          </Link>
        ) : null}
      </div>
    );
  };

  return (
    <div className="flex flex-col p-5 gap-2">
      <div className="flex justify-between">
        <div className="w-max flex gap-3 items-center cursor-pointer">
          {employer?.brandName ? (
            <>
              {employer?.companyLogoUrl ? (
                <img
                  src={employer?.companyLogoUrl}
                  alt="Company Logo"
                  width={32}
                  height={32}
                  className="rounded-full object-cover"
                />
              ) : (
                <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 33 32"
                  icon={<ProfilePlaceholder />}
                />
              )}{" "}
            </>
          ) : null}

          <p className="text-[14px] font-[600] text-[#000000] tracking-[-0.28px] leading-[20px]">
            {employer?.brandName}
          </p>
        </div>
        <div className=" hidden md:block">{renderDailyCount()}</div>
      </div>
      <div className="flex flex-col md:flex-row gap-1 md:gap-4 md:items-center">
        <div className="flex md:hidden items-center gap-2 font-[500] text-[14px]">
          <JobIDSection />
        </div>
        <div className="flex flex-row gap-4 items-center">
          <p className="text-[20px] font-[600] text-[#000000]">{title}</p>
          <DocumentStatusPill item={JOB_STATUS_MAP?.[status]} />
        </div>
        {status === "DRAFT" || status === "IN_REVIEW" ? (
          <div className="hidden md:block">
            <CustomTooltip
              title="Your job is under review, will be published in approximately 1 hour."
              placement="bottom"
            >
              <InfoIcon />
            </CustomTooltip>
          </div>
        ) : null}
      </div>
      <div className="md:hidden items-center flex gap-2 font-[500] text-[14px] text-[#777777]">
        <JobLocation />
      </div>
      <div className="flex gap-3 font-[500] text-[12px] md:text-[14px] text-[#777777] opacity-90">
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-2">
            <JobLocation />
          </div>
          <div className="hidden md:flex items-center gap-2 font-[500] text-[14px] ml-5">
            <JobIDSection />
            <span className="text-[#858585] mx-4">|</span>
          </div>
          <p>{date}</p>
          <span className="text-[#858585] mx-4">|</span>
          <p>
            {RUPEE_SYMBOL}
            {minRange === maxRange
              ? minRange
              : `${minRange} - ${RUPEE_SYMBOL}${maxRange}`}
          </p>
          <span className="text-[#858585] mx-4">|</span>
          <p>{jobTypes[type]}</p>
          <span className="hidden md:flex text-[#858585] mx-4">|</span>
          <div
            className="hidden md:flex items-center gap-2 font-[500] text-[14px] cursor-pointer"
            onClick={handleClick}
          >
            <JobDetailsLink />
          </div>
        </div>
      </div>
      <div
        className="flex md:hidden items-center gap-2 font-[500] text-[14px] cursor-pointer"
        onClick={handleClick}
      >
        <JobDetailsLink />
      </div>
      <div className="block md:hidden">{renderDailyCount()}</div>
    </div>
  );
};

export default JobDetails;
