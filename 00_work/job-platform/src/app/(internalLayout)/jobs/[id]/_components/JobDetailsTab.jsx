"use client";
import DetailsContainer from "@/components/DetailsContainer/DetailsContainer";
import { formatDate, getJobCategories } from "@/utils/helpers";
import { useGetJobCategories } from "@/apis/queryHooks";
import { jobTypes } from "@/constants";
export default function JobDetailsTab({ jobData }) {
  const { data: jobGlobalData } = useGetJobCategories();
  const jobCategories = jobGlobalData?.metaData?.JOB_CATEGORY || [];

  const getCategoryValue = (categoryEnum) => {
    return jobCategories?.find((category) => category.key === categoryEnum)
      ?.value;
  };

  const agePrefStr =
    jobData?.agePreference?.maxAge != null &&
    jobData?.agePreference?.minAge != null
      ? `${jobData?.agePreference?.minAge} year${
          jobData?.agePreference?.minAge > 1 ? "s" : ""
        } - ${`${jobData?.agePreference?.maxAge} year${
          jobData?.agePreference?.maxAge > 1 ? "s" : ""
        }`}`
      : `${jobData?.agePreference?.agePreferenceRangeText}`;
  const experienceStr =
    jobData?.experience?.minExperience != null &&
    jobData?.experience?.maxExperience != null
      ? `${jobData?.experience?.minExperience} year${
          jobData?.experience?.minExperience > 1 ? "s" : ""
        } - ${`${jobData?.experience?.maxExperience} year${
          jobData?.experience?.maxExperience > 1 ? "s" : ""
        }`}`
      : `${jobData?.experience?.experienceRangeText}`;

  const salaryStr = jobData?.salaryRange?.minSalary
    ? `₹${jobData?.salaryRange?.minSalary} ${
        jobData?.salaryRange?.maxSalary
          ? `- ₹${jobData?.salaryRange?.maxSalary} `
          : ""
      }`
    : "-----";

  const jobDetailsdata = {
    "Job Role/Title": jobData?.title || "",
    benefits:
      jobData?.benefits?.length > 0 ? jobData?.benefits?.join(",") : "-----",
    category: getCategoryValue(jobData?.category) || "",
    jobLocation: jobData?.location?.locationName || "",
    numberOfOpenings: jobData?.noOfOpenings || "",
    "Min. Qualification": jobData?.minQualification || "",
    jobExpiryDate: formatDate(jobData?.jobExpiryDate) || "",
    experience: experienceStr || "",
    workHours: jobData?.workHours || "",
    genderPreference: jobData?.genderPreference || "",
    typeOfJob: jobTypes[jobData?.type] || "",
    agePreference: agePrefStr || "",
    salaryRange: salaryStr || "",
    requirement:
      jobData?.requirements?.length > 0
        ? jobData?.requirements.join(", ")
        : "-----",

    jobUpdateDate: formatDate(jobData?.updatedAt) || "",
    video: jobData?.video || "",
    description: jobData?.description || "",
  };
  return (
    <div className="py-5">
      <DetailsContainer detailsData={jobDetailsdata} />
    </div>
  );
}
