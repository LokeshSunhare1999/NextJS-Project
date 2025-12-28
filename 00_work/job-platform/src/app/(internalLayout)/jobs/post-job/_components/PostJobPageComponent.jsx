"use client";

import { Suspense, useContext, lazy, useEffect } from "react";
import CustomCTA from "@/components/CustomCTA";
import {
  useGetEmployerDetails,
  useGetJobById,
  usePostAddJob,
  usePutAddJob,
} from "@/apis/queryHooks";
import useJobPostForm from "../_hooks/usePostJobForm";
import { useRouter, useSearchParams } from "next/navigation";
import { EmployerContext } from "@/providers/EmployerProvider";
import { useSnackbar } from "notistack";
import BackIcon from "@/assets/icons/common/backIcon.svg";
import usePostJobAdditionalDetails from "../_hooks/usePostJobAdditionalForm";
import HiringField from "./HiringField";
import { useInView } from "react-intersection-observer";
import { parseCookies } from "nookies";
import JobDetailsSection from "./JobDetailsSection";
import CompensationDetailsSection from "./CompensationDetailsSection";
import JobLocationSection from "./JobLocationSection";
import CandidateCriteriaSection from "./CandidateCriteriaSection";
import PocSection from "./PocSection";

const PendingBanner = lazy(() => import("../../_components/PendingBanner"));
const RejectedBanner = lazy(() => import("../../_components/RejectedBanner"));
const InreviewBanner = lazy(() => import("../../_components/InreviewBanner"));
const VerifiedBanner = lazy(() => import("../../_components/VerifiedBanner"));

const PostJobPageComponent = ({ isFirstJob = false }) => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get("jobId");
  const isEditMode = Boolean(jobId);

  const { data: jobData } = useGetJobById(jobId);
  const { ref: ctaRef, inView: isCtaInView } = useInView({
    threshold: 0.5,
  });
  const { mutateAsync: addAddJobMutation, status: addJobStatus } =
    usePostAddJob();
  const { mutateAsync: editJobMutation, status: editJobStatus } =
    usePutAddJob();
  const { employer, setEmployer } = useContext(EmployerContext);
  const employerId = employer?._id;
  const cookies = parseCookies();
  const {
    jobDetails,
    setJobDetails,
    errors,
    setErrors,
    validateForm,
    getFormattedPayload,
    jobDescriptionUrl,
    setJobDescriptionUrl,
    jobCategories,
    validateField,
    handleFieldUpdate: jobFieldsHandleUpdate,
  } = useJobPostForm(isEditMode, jobData);

  const {
    currentBenefit,
    setCurrentBenefit,
    handleAddBenefit,
    handleRemoveBenefit,
    requirement,
    setRequirement,
    handleAddRequirement,
    handleRemoveRequirement,
    isAgeMinReqSelected,
    validateAdditionalDetails,
    handleFieldUpdate: additionalJobFieldsHandleUpdate,
    handleAgePreferenceClick,
    handleQualificationsSelect,
    handleNoMandatoryExpClick,
  } = usePostJobAdditionalDetails({
    jobDetails,
    setJobDetails,
    errors,
    setErrors,
  });


  const {
    data: employerData,
    refetch,
    status: employerStatus,
  } = useGetEmployerDetails({
    userId: cookies?.userId,
    enabled: false,
  });

  useEffect(() => {
    router.prefetch(`/jobs`);
  }, []);

  const handlePostJobClick = async () => {
    const isMainFormValid = validateForm(jobDetails);
    const isAdditionalDetailsValid = validateAdditionalDetails(jobDetails);

    if (!isMainFormValid || !isAdditionalDetailsValid) {
      enqueueSnackbar("Please check errors in the fields", {
        variant: "error",
      });
      return;
    }
    if (sessionStorage?.removeItem("paymentSuccess")) {
      sessionStorage?.removeItem("paymentSuccess");
    }
    const payload = getFormattedPayload(employerId, jobId);

    try {
      if (isEditMode) {
        await editJobMutation(payload);
        router.push(`/jobs`);
      } else {
        const response = await addAddJobMutation(payload);
        const employerData = await refetch();
        setEmployer(employerData?.data);

        router.push(`/jobs`);
      }
    } catch (error) {
      enqueueSnackbar("Error saving job", { variant: "error" });
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
    <div className="mt-[60px] md:ml-[260px] md:mt-[78px] min-h-screen flex flex-col">
      <Suspense fallback={<div></div>}>
        <div className="flex flex-col px-5">
          {renderVerificationBanner(employer?.verificationStatus)}
        </div>
      </Suspense>
      {/* 
      <div className="md:hidden bg-white w-full h-15 top-[-60px] px-4 flex items-center gap-[10px]">
        <Svg
          icon={<BackIcon />}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          onClick={() => router.back()}
        />
        <h1 className="text-[#111111]">
          {isFirstJob ? "Post your first job" : "Post a New Job"}
        </h1>
      </div> */}
      <div className="md:px-5 md:py-5">
        <div className="hidden md:flex flex-col">
          {!isFirstJob ? (
            <div className="flex h-[54px] items-center">
              <button
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-white"
                onClick={() => router.back()}
              >
                <BackIcon />
              </button>
            </div>
          ) : null}

          <h1 className="text-[24px] font-semibold mb-5 my-2 text-[#111111]">
            {isFirstJob ? "Post your first job" : "Post a New Job"}
          </h1>
        </div>

        {employer?.employersAgencyType === "RECRUITMENT_AGENCY" ? (
          <HiringField
            jobDetails={jobDetails}
            setJobDetails={setJobDetails}
            errors={errors}
            employerId={employerId}
          />
        ) : null}

        <JobDetailsSection
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
          setJobDescriptionUrl={setJobDescriptionUrl}
          jobDescriptionUrl={jobDescriptionUrl}
          jobCategories={jobCategories}
          errors={errors}
          setErrors={setErrors}
          handleFieldUpdate={jobFieldsHandleUpdate}
        />

        <CompensationDetailsSection
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
          errors={errors}
          setErrors={setErrors}
          currentBenefit={currentBenefit}
          setCurrentBenefit={setCurrentBenefit}
          handleAddBenefit={handleAddBenefit}
          handleRemoveBenefit={handleRemoveBenefit}
          requirement={requirement}
          setRequirement={setRequirement}
          handleAddRequirement={handleAddRequirement}
          handleRemoveRequirement={handleRemoveRequirement}
          handleFieldUpdate={jobFieldsHandleUpdate}
        />
        <JobLocationSection
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
          validateField={validateField}
          errors={errors}
          setErrors={setErrors}
          handleFieldUpdate={jobFieldsHandleUpdate}
        />

        <CandidateCriteriaSection
          jobDetails={jobDetails}
          errors={errors}
          handleAgePreferenceClick={handleAgePreferenceClick}
          handleQualificationsSelect={handleQualificationsSelect}
          handleNoMandatoryExpClick={handleNoMandatoryExpClick}
          isAgeMinReqSelected={isAgeMinReqSelected}
          handleFieldUpdate={additionalJobFieldsHandleUpdate}
        />

        <PocSection
          jobDetails={jobDetails}
          errors={errors}
          handleFieldUpdate={jobFieldsHandleUpdate}
        />

        <div className="bg-white pt-2 px-6 md:bg-transparent">
          <label className="text-sm text-[#586276]">
            <span className="text-red-500">* </span>Indicates a required field
          </label>

          <div ref={ctaRef} className="w-full flex md:mt-3 mt-8 justify-end">
            <div className=" w-full md:w-[120px]">
              <CustomCTA
                title="Submit Job"
                onClickFn={() => handlePostJobClick()}
                loading={
                  addJobStatus === "pending" || editJobStatus === "pending"
                }
                disabled={
                  addJobStatus === "pending" || editJobStatus === "pending"
                }
                fontSize="16px"
                fontWeight="400"
                width="100%"
              />
            </div>
          </div>
        </div>
      </div>
      {!isCtaInView ? (
        <div className="w-full fixed bottom-0 bg-white flex md:hidden mt-3 justify-end px-4 py-2">
          <div className=" w-full md:w-[100px]">
            <CustomCTA
              title="Submit Job"
              onClickFn={() => handlePostJobClick()}
              loading={
                addJobStatus === "pending" || editJobStatus === "pending"
              }
              disabled={
                addJobStatus === "pending" || editJobStatus === "pending"
              }
              fontSize="16px"
              fontWeight="400"
              width="100%"
            />
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default PostJobPageComponent;
