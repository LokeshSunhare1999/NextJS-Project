import { useGetJobCategories } from "@/apis/queryHooks";
import ShakaVideoPlayer from "@/components/ShakaPlayer";
import { jobTypes } from "@/constants";
import { formatDate, getCategoryValue } from "@/utils/helpers";

export const JobDetailsDrawer = ({ jobData }) => {
  const { data: jobGlobalData } = useGetJobCategories();

  const jobCategories = jobGlobalData?.metaData?.JOB_CATEGORY || [];

  const getCategoryValue = (categoryEnum) => {
    return jobCategories?.find((category) => category.key === categoryEnum)
      ?.value;
  };
  const salaryStr = jobData?.salaryRange?.minSalary
    ? `₹${jobData?.salaryRange?.minSalary} ${
        jobData?.salaryRange?.maxSalary
          ? `- ₹${jobData?.salaryRange?.maxSalary} `
          : ""
      }`
    : "-----";

  const agePrefStr =
    jobData?.agePreference?.maxAge != null &&
    jobData?.agePreference?.minAge != null
      ? `${jobData?.agePreference?.minAge} year${
          jobData?.agePreference?.minAge > 1 ? "s" : ""
        } - ${`${jobData?.agePreference?.maxAge} year${
          jobData?.agePreference?.maxAge > 1 ? "s" : ""
        }`}`
      : `${jobData?.agePreference?.agePreferenceRangeText || "-----"}`;

  const experienceStr =
    jobData?.experience?.minExperience != null &&
    jobData?.experience?.maxExperience != null
      ? `${jobData?.experience?.minExperience} year${
          jobData?.experience?.minExperience > 1 ? "s" : ""
        } - ${`${jobData?.experience?.maxExperience} year${
          jobData?.experience?.maxExperience > 1 ? "s" : ""
        }`}`
      : `${jobData?.experience?.experienceRangeText || "-----"}`;

  return (
    <div className="flex flex-col gap-3 ">
      <div className="p-3 rounded-lg bg-[#FFFFFF]  flex flex-col gap-3 ">
        <p className="text-[#000]">Job Video</p>
        <div className="text-[14px] font-normal flex justify-center items-center w-full">
          {jobData?.video ? (
            <div className="w-[60%] flex justify-center">
              <ShakaVideoPlayer videoLink={jobData?.video} />
            </div>
          ) : (
            <p className="text-[#606C85]"> No video available</p>
          )}
        </div>
      </div>
      <div className="flex flex-col gap-3 p-3 rounded-lg bg-[#FFFFFF] ">
        {jobData?.employerCategory === "RECRUITMENT_AGENCY" ? (
          <div className="flex-col text-[14px] font-normal">
            <p className="text-[#000]">Hiring For</p>
            <p className="text-[#606C85]">{jobData?.brandName || "-----"} </p>
          </div>
        ) : null}
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Job Role/Title</p>
          <p className="text-[#606C85]">{jobData?.title || "-----"} </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Category</p>
          <p className="text-[#606C85]">
            {getCategoryValue(jobData?.category) || "-----"}{" "}
          </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Recruiter Name</p>
          <p className="text-[#606C85]">{jobData?.recruiterName || "-----"} </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Recruiter Phone No.</p>
          <p className="text-[#606C85]">
            {jobData?.recruiterPhoneNumber?.[0] || "-----"}{" "}
          </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Number of openings</p>
          <p className="text-[#606C85]">{jobData?.noOfOpenings || "-----"} </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Job Expiry Date</p>
          <p className="text-[#606C85]">
            {formatDate(jobData?.jobExpiryDate) || "-----"}{" "}
          </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Work Hours</p>
          <p className="text-[#606C85]">{jobData?.workHours || "-----"} </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Type of Job</p>
          <p className="text-[#606C85]">
            {jobTypes[jobData?.type] || "-----"}{" "}
          </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Salary Range (₹)</p>
          <p className="text-[#606C85]">{salaryStr || "-----"} </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Description</p>
          <p className="text-[#606C85]">{jobData?.description || "-----"} </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Job Update Date</p>
          <p className="text-[#606C85]">
            {formatDate(jobData?.updatedAt || jobData?.createdAt) || "-----"}{" "}
          </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Benefits</p>
          <p className="text-[#606C85]">
            {jobData?.benefits?.length > 0
              ? jobData?.benefits?.join(",")
              : "-----"}{" "}
          </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Job Location</p>
          <p className="text-[#606C85]">
            {jobData?.location?.locationName || "-----"}{" "}
          </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Min. Qualification</p>
          <p className="text-[#606C85]">
            {jobData?.minQualification || "-----"}
          </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Experience</p>
          <p className="text-[#606C85]">{experienceStr || "-----"} </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Gender Preference</p>
          <p className="text-[#606C85]">
            {jobData?.genderPreference?.length > 0
              ? jobData?.genderPreference?.join(", ")
              : "-----"}
          </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Age Preference</p>
          <p className="text-[#606C85]">{agePrefStr || "-----"} </p>
        </div>
        <div className="flex-col text-[14px] font-normal">
          <p className="text-[#000]">Requirement</p>
          <p className="text-[#606C85]">
            {jobData?.requirements?.length > 0
              ? jobData?.requirements.join(", ")
              : "-----"}
          </p>
        </div>
      </div>
    </div>
  );
};
