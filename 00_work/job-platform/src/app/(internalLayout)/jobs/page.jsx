"use client";
import {
  useGetEmployerJobs,
  usePostDailyApplicationCount,
} from "@/apis/queryHooks";
import { formatDate, scrollToTop } from "@/utils/helpers";
import JobCard from "./_components/JobCard";
import {
  Suspense,
  useContext,
  useEffect,
  useState,
  lazy,
  useCallback,
  useMemo,
} from "react";
import { EmployerContext } from "@/providers/EmployerProvider";
import ZeroJobsComponent from "./_components/ZeroJobsComponent";
import { useRouter } from "next/navigation";
import { Skeleton } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import CustomCTA from "@/components/CustomCTA";
import PlusIcon from "@/assets/icons/common/plusIcon.svg";
import {
  DEFAULT_PAGE_NO,
  DEFAULT_PAGE_SIZE,
  JOBS_SORT_OPTIONS,
} from "@/constants";
import { CONTACT_MAIL, MIN_CREDITS } from "@/constants/payment";
import PaymentBanner from "@/components/PaymentBanner";
import { LoadingContext } from "@/providers/LoadingProvider";
import Loader from "@/components/Loader";
import { usePathname } from "next/navigation";

const PendingBanner = lazy(() => import("./_components/PendingBanner"));
const RejectedBanner = lazy(() => import("./_components/RejectedBanner"));
const InreviewBanner = lazy(() => import("./_components/InreviewBanner"));
const VerifiedBanner = lazy(() => import("./_components/VerifiedBanner"));
const FiltersToolbar = lazy(() =>
  import("./_components/FiltersSubComponents/FiltersToolbar")
);
const Bottomsheet = lazy(() => import("@/components/BottomSheet"));
const FiltersToolbarControlsMweb = lazy(() =>
  import("./_components/FiltersSubComponents/FiltersToolbarControlsMweb")
);
const SortBottomSheetMweb = lazy(() =>
  import("./_components/FiltersSubComponents/SortBottomSheetMweb")
);
const FiltersToolbarBottomSheetMweb = lazy(() =>
  import("./_components/FiltersSubComponents/FiltersToolbarBottomSheetMweb")
);

// helper function
export const transformJobData = (data = []) =>
  data?.map((job) => {
    const address = job?.location?.subLocalityLevel1
      ? `${job?.location?.subLocalityLevel1}, ${
          job?.location?.administrativeAreaLevel1 || ""
        }`
      : `${job?.location?.locality || ""}, ${
          job?.location?.administrativeAreaLevel1 || ""
        }`;

    return {
      title: job?.title,
      status: job?.status,
      uniqueJobId: job?.uniqueJobId,
      location: address ? address : "-----",
      date: formatDate(job?.createdAt),
      minRange: job?.salaryRange?.minSalary,
      maxRange: job?.salaryRange?.maxSalary,
      type: job?.type,
      applied: job?.yetToShortlistCount ?? 0,
      noOfApplications: job?.noOfApplications ?? 0,
      interview:
        (job?.shortlistedCount ?? 0) +
        (job?.interviewCompletedCount ?? 0) +
        (job?.interviewLapsedCount ?? 0),
      hired: job?.finalisedCount ?? 0,
      jobId: job?._id,
      barStatus: job?.barStatus,
      totalApplied: job?.totalApplied ?? 0,
      totalShortlisted: job?.totalShortlisted ?? 0,
    };
  });

export default function Page() {
  const pathname = usePathname();
  const { employer } = useContext(EmployerContext);
  const { showLoading } = useContext(LoadingContext);
  const [showLoader, setShowLoader] = useState(true);
  const [visibleJobs, setVisibleJobs] = useState([]);
  const [pageNo, setPageNo] = useState(DEFAULT_PAGE_NO);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isSortByOpen, setIsSortByOpen] = useState(false);
  const [allJobsData, setAllJobsData] = useState([]);

  const [globalFilters, setGlobalFilters] = useState({
    jobStatus: "",
    jobLocation: [],
    jobCategory: [],
    brandName: [],
  });
  const [activeSortKey, setActiveSortKey] = useState(
    JOBS_SORT_OPTIONS[0]?.value
  );
  const [dailyAppCountsArray, setDailyAppCountsArray] = useState([]);
  const router = useRouter();
  const pageSize = DEFAULT_PAGE_SIZE;

  const {
    data: employerJobsData,
    isLoading: employerJobsDataLoading,
    isFetching: employerJobsDataFetching,
    refetch: refetchEmployerJobsData,
  } = useGetEmployerJobs({
    employerId: employer?._id,
    pageNo: pageNo,
    pageSize: pageSize,
    jobStatus: globalFilters?.jobStatus,
    jobCategory: globalFilters?.jobCategory?.join(","),
    brandName: globalFilters?.brandName?.join(","),
    jobLocation: globalFilters?.jobLocation?.join(":"),
    sortParam: activeSortKey,
  });

  const { mutateAsync: dailyAppCountMutate } = usePostDailyApplicationCount();

  const isJobsListEmpty = visibleJobs.length === 0;
  const hasMoreJobs = employerJobsData?.totalJobs > pageNo * pageSize;

  /** For comparing if global filters have actually changed or not,
   * as whenever we click the same filter again a new object is returned resulting in changed reference */
  const filterKeys = useMemo(
    () => JSON.stringify(globalFilters),
    [globalFilters]
  );

  useEffect(() => {
    let isTriggered = false;
    let throttleTimer = null;
    const handleScroll = () => {
      if (employerJobsDataFetching || !hasMoreJobs || isTriggered) return;
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        const scrollTop =
          window.pageYOffset || document.documentElement.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = window.innerHeight;
        const scrollPercentage =
          (scrollTop / (scrollHeight - clientHeight)) * 100;

        if (scrollPercentage >= 75 && !isTriggered) {
          isTriggered = true;
          setPageNo((prev) => prev + 1);
        }
        throttleTimer = null;
      }, 200);
    };
    if (!employerJobsDataFetching && hasMoreJobs) {
      isTriggered = false;
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);

      if (throttleTimer) {
        clearTimeout(throttleTimer);
      }
    };
  }, [employerJobsDataFetching, hasMoreJobs]);

  useEffect(() => {
    scrollToTop();
    setVisibleJobs([]);

    /** Prefetch if there is a valid entry point */
    if (employerJobsData && employerJobsData?.totalJobs === 0) {
      router.prefetch("/jobs/first-job");
    }
  }, []);

  /** Redirect to first job page if no jobs and no filters applied */
  useEffect(() => {
    if (
      employerJobsData &&
      employerJobsData?.totalJobs === 0 &&
      globalFilters?.jobStatus === "" &&
      globalFilters?.jobLocation.length == 0 &&
      globalFilters?.jobCategory.length == 0 &&
      globalFilters?.brandName.length == 0
    ) {
      router.push("/jobs/first-job");
    }
  }, [employerJobsData, router]);

  useEffect(() => {
    if (employerJobsDataFetching) {
      setShowLoader(true);
    }
  }, [employerJobsDataFetching]);

  useEffect(() => {
    setPageNo(DEFAULT_PAGE_NO);
    setVisibleJobs([]);
    setAllJobsData([]);
  }, [filterKeys]);

  useEffect(() => {
    if (!employerJobsData) return;

    const transformedJobs = transformJobData(employerJobsData.jobs);

    /** Checking on the basis of page number(set in above UE), as visible jobs will still have stale values  */
    if (pageNo === DEFAULT_PAGE_NO) {
      setVisibleJobs(transformedJobs);
    } else {
      const newJobs = transformedJobs.filter(
        (job) => !visibleJobs.some((j) => j.jobId === job.jobId)
      );
      if (newJobs.length) {
        setVisibleJobs((prev) => [...prev, ...newJobs]);
      }
    }

    setShowLoader(false);
  }, [employerJobsData, pageNo]);

  useEffect(() => {
    if (employerJobsData) {
      setAllJobsData((prev) => [...prev, ...employerJobsData?.jobs]);
      const allJobsIds = employerJobsData?.jobs?.map((job) => job._id);
      dailyAppCountMutate({
        jobIds: allJobsIds,
        employerId: employer?._id,
      })
        .then((res) => {
          setDailyAppCountsArray((prev) => [...prev, ...res]);
        })
        .catch((err) => {});
    }
  }, [employerJobsData, employer]);

  const updateQueryParams = (filters) => {
    const params = new URLSearchParams();

    if (filters.jobStatus) params.set("jobStatus", filters.jobStatus);
    if (filters.jobLocation?.length)
      params.set("jobLocation", filters.jobLocation.join(":"));
    if (filters.jobCategory?.length)
      params.set("jobCategory", filters.jobCategory.join(","));
    if (filters.brandName?.length)
      params.set("brandName", filters.brandName.join(","));
    if (filters.sortBy) params.set("sortBy", filters.sortBy);

    router.push(`${pathname}?${params.toString()}`);
  };

  const handleCloseFiltersBottomSheet = useCallback(() => {
    setIsFiltersOpen(false);
  }, []);

  const handleCloseSortByBottomSheet = useCallback(() => {
    setIsSortByOpen(false);
  }, []);

  const handleAddNewJobClick = () => {
    showLoading();
    router.push("/jobs/post-job");
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
    <div className="mt-[60px] md:ml-[260px] md:mt-[78px] min-h-screen flex flex-col">
      {employer?.isCreditsPurchased && employer?.creditBalance < MIN_CREDITS ? (
        <>
          <PaymentBanner credits={employer?.creditBalance} />
          <br />
        </>
      ) : null}
      <Suspense fallback={<div></div>}>
        <div className="flex flex-col px-5">
          {renderVerificationBanner(employer?.verificationStatus)}
        </div>
      </Suspense>

      <div className="w-full h-full px-5 pt-5">
        <div className="flex h-[54px] justify-between items-center  border-b border-[#E5E5E5] pb-6">
          <div className="font-bold text-[24px] text-[#000000]">
            All Jobs ({employerJobsData?.totalJobs ?? 0})
          </div>

          {!isJobsListEmpty ? (
            <CustomCTA
              title="Add New Job"
              fontSize="16px"
              fontWeight="400"
              leftIcon={<PlusIcon />}
              onClickFn={handleAddNewJobClick}
            />
          ) : null}
        </div>
        <div className="pt-6 hidden md:block">
          <Suspense fallback={<div></div>}>
            <FiltersToolbar
              setGlobalFilters={setGlobalFilters}
              setActiveSortKey={setActiveSortKey}
              updateQueryParams={updateQueryParams}
              activeSortKey={activeSortKey}
              employerId={employer?._id}
            />
          </Suspense>
        </div>
        <div className="pt-6 md:hidden block">
          <Suspense fallback={<div></div>}>
            <FiltersToolbarControlsMweb
              setIsFiltersOpen={setIsFiltersOpen}
              setIsSortByOpen={setIsSortByOpen}
              activeSortKey={activeSortKey}
              employerId={employer?._id}
            />
          </Suspense>
        </div>

        <Suspense fallback={<div></div>}>
          <Bottomsheet
            isOpen={isFiltersOpen}
            onClose={() => handleCloseFiltersBottomSheet()}
          >
            <FiltersToolbarBottomSheetMweb
              activeSortKey={activeSortKey}
              setGlobalFilters={setGlobalFilters}
              handleCloseFiltersBottomSheet={handleCloseFiltersBottomSheet}
              refetchEmployerJobsData={refetchEmployerJobsData}
              updateQueryParams={updateQueryParams}
              employerId={employer?._id}
            />
          </Bottomsheet>
        </Suspense>
        <Suspense fallback={<div></div>}>
          <Bottomsheet
            isOpen={isSortByOpen}
            onClose={() => handleCloseSortByBottomSheet()}
          >
            <SortBottomSheetMweb
              setActiveSortKey={setActiveSortKey}
              activeSortKey={activeSortKey}
              selectedFilters={globalFilters}
              updateQueryParams={updateQueryParams}
              handleCloseSortByBottomSheet={handleCloseSortByBottomSheet}
              employerId={employer?._id}
            />
          </Bottomsheet>
        </Suspense>
        {(showLoader || employerJobsDataLoading) &&
        pageNo === DEFAULT_PAGE_NO ? (
          <Loader />
        ) : isJobsListEmpty ? (
          <ZeroJobsComponent
            mail={CONTACT_MAIL}
            phoneNo={"8800504742"}
            updateQueryParams={updateQueryParams}
            setGlobalFilters={setGlobalFilters}
            globalFilters={globalFilters}
          />
        ) : (
          <>
            {visibleJobs?.map((job, index) => (
              <JobCard
                key={job.jobId}
                job={job}
                jobData={allJobsData?.[index]}
                dailyApplicationCount={
                  dailyAppCountsArray?.find((item) => item.jobId === job.jobId)
                    ?.applied
                }
                dailyInterviewCompletedCount={
                  dailyAppCountsArray?.find((item) => item.jobId === job.jobId)
                    ?.interviewCompleted
                }
              />
            ))}

            {hasMoreJobs && (
              <div className="flex justify-center">
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 48 }} spin />}
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
