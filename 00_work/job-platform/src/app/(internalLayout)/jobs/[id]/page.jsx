"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetJobApplications, useGetJobById } from "@/apis/queryHooks";
import BackIcon from "@/assets/icons/common/backIcon.svg";
import Download from "@/assets/icons/staff/download.svg";
import LocationIcon from "@/assets/icons/jobs/location.svg";
import JobTabs from "./_components/JobTabs";
import JobReelsTab from "./_components/JobReelsTab";
import { Suspense, use, useContext, useEffect, useState, lazy } from "react";
import JobDetailsTab from "./_components/JobDetailsTab";
import AiRecruiterTab from "./_components/AiRecruiterTab";
import FinalTab from "./_components/FinalTab";
import { axiosFetch, downloadCSV, scrollToTop } from "@/utils/helpers";
import CustomCTA from "@/components/CustomCTA";
import { EmployerContext } from "@/providers/EmployerProvider";

const FinaliseCreditsBanner = lazy(() =>
  import("../_components/FinaliseCreditsBanner")
);
const PendingBanner = lazy(() => import("../_components/PendingBanner"));
const RejectedBanner = lazy(() => import("../_components/RejectedBanner"));
const InreviewBanner = lazy(() => import("../_components/InreviewBanner"));
const VerifiedBanner = lazy(() => import("../_components/VerifiedBanner"));

export default function Page({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const currentTab = parseInt(tabParam ?? "0");
  const { employer } = useContext(EmployerContext);

  const [activeTab, setActiveTab] = useState(currentTab);

  const { data: jobData, refetch: refetchJobData } = useGetJobById(id);
  const items = [
    {
      key: "1",
      label: "Job Reels",
      children: <JobReelsTab refetchJobData={refetchJobData} />,
      count: jobData?.yetToShortlistCount ?? 0,
    },
    {
      key: "2",
      label: "AI Recruiter",
      children: <AiRecruiterTab refetchJobData={refetchJobData} />,
      count:
        (jobData?.shortlistedCount ?? 0) +
        (jobData?.interviewCompletedCount ?? 0) +
        (jobData?.interviewLapsedCount ?? 0),
    },
    {
      key: "3",
      label: "Final",
      children: <FinalTab />,
      count: jobData?.finalisedCount ?? 0,
    },
    // {
    //   key: "4",
    //   label: "Job Details",
    //   children: <JobDetailsTab jobData={jobData} />,
    // },
  ];

  const exportButton = () => {
    return (
      <>
        {activeTab === 2 && jobData?.finalisedCount ? (
          <CustomCTA
            title="Export"
            width={"100%"}
            textColor="#FFFFFF"
            onClickFn={handleExportClickFn}
            borderRadius="8px"
            leftIcon={<Download />}
          />
        ) : null}
      </>
    );
  };

  const totalApplications =
    jobData?.yetToShortlistCount +
    jobData?.shortlistedCount +
    jobData?.interviewCompletedCount +
    jobData?.finalisedCount +
    jobData?.interviewLapsedCount;

  useEffect(() => {
    /** Will get prefetched once as browser will cache the first time, and later, on every tab change it will serve from cache */
    for (let tab in items) {
      router.prefetch(`/jobs/${id}?tab=${tab}`);
    }
    setActiveTab(currentTab);
    scrollToTop();
    refetchJobData();
  }, [currentTab]);

  const handleExportClickFn = async () => {
    try {
      const response = await axiosFetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/staffingAgency/api/v1/job/employer/shortlistcsv/${id}`,
        "GET"
      );
      downloadCSV(response?.data, "finalised_applications.csv");
    } catch (error) {
      console.error("Failed to fetch CSV", error);
    }
  };
  const renderVerificationBanner = (status) => {
    switch (status) {
      case "NOT_INITIATED":
        return <PendingBanner />;
      case "REJECTED":
        return <RejectedBanner />;
      case "PENDING":
        return <InreviewBanner />;
      case "VERIFIED":
        return <VerifiedBanner />;
      default:
        return null;
    }
  };

  return (
    <div className="md:ml-[260px] mt-[60px] md:mt-[78px] px-5 pt-5 relative">
      <Suspense fallback={<div></div>}>
        <div className="flex flex-col">
          {renderVerificationBanner(employer?.verificationStatus)}
          {activeTab === 1 ? <FinaliseCreditsBanner /> : null}
        </div>
      </Suspense>
      <header>
        <button
          className="mt-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-white"
          onClick={() => router.back()}
        >
          <BackIcon />
        </button>
        <h1 className="text-[24px] font-semibold text-black mt-[14.5px]">
          {jobData
            ? `${jobData?.title + " - Applications(" + totalApplications + ")"}`
            : "-----"}
        </h1>
        <div className="flex flex-row items-center gap-2 mt-[2px]">
          <LocationIcon />
          <h2 className="text-[16px] font-normal text-[#606C85]">
            {jobData?.location?.administrativeAreaLevel1}
          </h2>
        </div>
      </header>
      <div className="flex justify-between border-b-[1px] border-b-[#CDD4DF] ">
        <JobTabs
          items={items}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          jobId={jobData?._id || ""}
        />
        <div className="hidden md:block">{exportButton()}</div>
      </div>
      <div className="block md:hidden mt-3">{exportButton()}</div>
      {items[activeTab]?.children}
    </div>
  );
}
