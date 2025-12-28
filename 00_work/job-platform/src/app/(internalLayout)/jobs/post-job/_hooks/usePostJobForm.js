import { useState, useEffect } from "react";
import { useGetJobCategories } from "@/apis/queryHooks";

const initialJobState = {
  jobRole: "",
  category: "",
  noOfOpenings: "",
  jobExpiryDate: "",
  workHours: "",
  typeOfJob: "",
  genderPreference: [],
  isAgePreferenceRequired: false,
  minAge: null,
  maxAge: null,
  minSalary: "",
  maxSalary: "",
  isWeeklyPayoutAvailable: false,
  requirements: [],
  description: "",
  benefits: [],
  minQualification: "",
  minExp: null,
  maxExp: null,
  noMandatoryExperience: false,
  location: {},
  jobDescriptionUrl: "",
  salaryType: [],
  jobEmployerName: "",
  jobEmployerLogo: "",
  isFixedSalary: false,
  recruiterName: "",
  recruiterPhoneNumber: "",
};

const useJobPostForm = (isEditMode, jobData) => {
  const [jobDetails, setJobDetails] = useState(initialJobState);
  const [errors, setErrors] = useState({});
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState("");

  const { data: jobGlobalData } = useGetJobCategories();
  const jobCategories = jobGlobalData?.metaData?.JOB_CATEGORY || [];
  const mapResponseToFormDetails = (jobData) => ({
    jobRole: jobData?.title || "",
    benefits: jobData?.benefits?.length > 0 ? jobData?.benefits : [],
    category: jobData?.category || "",
    location: jobData?.location ? jobData?.location : {},
    noOfOpenings: jobData?.noOfOpenings || "",
    minQualification: jobData?.minQualification || "",
    jobExpiryDate: jobData?.jobExpiryDate || "",
    minExp: jobData?.experience?.minExperience,
    maxExp: jobData?.experience?.maxExperience,
    noMandatoryExperience: jobData?.experience?.noMandatoryExperience || false,
    minAge: jobData?.agePreference?.minAge,
    maxAge: jobData?.agePreference?.maxAge,
    isAgePreferenceRequired: jobData?.agePreference?.isAgePreferenceRequired,
    isWeeklyPayoutAvailable: jobData?.salaryRange?.weeklyPayout || false,
    minSalary: jobData?.salaryRange?.minSalary || "",
    maxSalary: jobData?.salaryRange?.maxSalary || "",
    salaryType:
      jobData?.salaryRange?.salaryType?.length > 0
        ? jobData?.salaryRange?.salaryType
        : [],
    workHours: jobData?.workHours || "",
    genderPreference:
      jobData?.genderPreference?.length > 0 ? jobData?.genderPreference : [],
    typeOfJob: jobData?.type || "",
    requirements:
      jobData?.requirements?.length > 0 ? jobData?.requirements : [],
    description: jobData?.description || "",
    status: jobData?.status || "",
    jobEmployerName: jobData?.jobEmployerName || "",
    jobEmployerLogo: jobData?.jobEmployerLogo || "",
    jobDescriptionUrl: jobData?.jobDescriptionUrl || "",
    recruiterName: jobData?.recruiterName || "",
    recruiterPhoneNumber: jobData?.recruiterPhoneNumber?.[0] || "",
  });

  useEffect(() => {
    if (jobDescriptionUrl) {
      setJobDetails((prev) => ({
        ...prev,
        jobDescriptionUrl: jobDescriptionUrl,
      }));
    }
  }, [jobDescriptionUrl]);

  const validateField = (field, value, currentJobDetails) => {
    switch (field) {
      case "jobRole":
        if (!value?.trim()) return "Job title is required.";
        if (value.trim().length > 35)
          return "Job title should be within 35 characters";
        return "";

      case "category":
        return value ? "" : "Category is required.";

      case "typeOfJob":
        return value ? "" : "Type of job is required.";

      case "minSalary": {
        const min = parseInt(currentJobDetails.minSalary);
        const max = parseInt(currentJobDetails.maxSalary);
        if (currentJobDetails.isFixedSalary && !currentJobDetails.minSalary)
          return "Salary is required.";
        
        if (!currentJobDetails.minSalary) return "Min Salary is required.";

        if (
          !currentJobDetails.isFixedSalary &&
          currentJobDetails.minSalary &&
          currentJobDetails.maxSalary &&
          !isNaN(min) &&
          !isNaN(max) &&
          min > max
        ) {
          return "Min. salary should be less than max. salary.";
        }

        return "";
      }

      case "maxSalary": {
        if (!currentJobDetails.isFixedSalary && !currentJobDetails.maxSalary) {
          return "Max Salary is required.";
        }

        return "";
      }

      case "jobExpiryDate":
        return value ? "" : "Please select a valid date";

      case "location":
        return Object.keys(currentJobDetails?.location || {}).length > 0
          ? ""
          : "Location is required.";

      default:
        return "";
    }
  };

  const validateForm = (currentJobDetails) => {
    const fieldsToValidate = [
      "jobRole",
      "category",
      "typeOfJob",
      "minSalary",
      "maxSalary",
      "jobExpiryDate",
      "location",
    ];

    const newErrors = {};

    fieldsToValidate.forEach((field) => {
      const value = currentJobDetails[field];
      const error = validateField(field, value, currentJobDetails);
      newErrors[field] = error;
    });

    setErrors(newErrors);
    const isError = Object.values(newErrors).some((msg) => msg !== "");
    return !isError;
  };

  const getFormattedPayload = (employerId, jobId) => {
    let formattedJobExpiryDate;
    if (jobDetails.jobExpiryDate) {
      formattedJobExpiryDate = new Date(jobDetails.jobExpiryDate).toISOString();
    }

    return {
      ...(jobId && { jobId }),
      employer: employerId,
      title: jobDetails?.jobRole,
      category: jobDetails?.category,
      location: jobDetails?.location,
      workHours: jobDetails?.workHours,
      type: jobDetails?.typeOfJob,
      description: jobDetails?.description,
      benefits: [...jobDetails?.benefits],
      experience: {
        minExperience: jobDetails?.minExp,
        maxExperience: jobDetails?.maxExp,
        noMandatoryExperience: jobDetails?.noMandatoryExperience,
      },
      minQualification: jobDetails?.minQualification,
      salaryRange: {
        minSalary: jobDetails?.minSalary,
        maxSalary: jobDetails?.maxSalary,
        weeklyPayout: jobDetails?.isWeeklyPayoutAvailable,
        salaryType: jobDetails?.salaryType,
      },
      noOfOpenings: Number(jobDetails?.noOfOpenings),
      genderPreference: [...jobDetails?.genderPreference],
      requirements: jobDetails?.requirements,
      jobExpiryDate: formattedJobExpiryDate,
      agePreference: {
        minAge: jobDetails?.minAge ? Number(jobDetails?.minAge) : null,
        maxAge: jobDetails?.maxAge ? Number(jobDetails?.maxAge) : null,
        isAgePreferenceRequired: jobDetails?.isAgePreferenceRequired,
      },
      noOfApplications: 0,
      jobExpiryDate: formattedJobExpiryDate,
      jobEmployerName: jobDetails?.jobEmployerName,
      jobEmployerLogo: jobDetails?.jobEmployerLogo,
      jobDescriptionUrl: jobDetails?.jobDescriptionUrl,
      recruiterName: jobDetails?.recruiterName,
      recruiterPhoneNumber: [jobDetails?.recruiterPhoneNumber],
    };
  };

  const handleFieldUpdate = (field, value) => {
    if (
      (field === "minSalary" || field === "maxSalary") &&
      !/^\d{0,5}$/.test(value)
    )
      return;
    const currentJobDetails = { ...jobDetails, [field]: value };
    if (field === "minSalary" && jobDetails?.isFixedSalary) {
      const minSalaryErr = validateField(
        "minSalary",
        jobDetails?.minSalary,
        currentJobDetails
      );

      setErrors((prev) => ({
        ...prev,
        minSalary: minSalaryErr,
      }));
      setJobDetails((prev) => ({
        ...prev,
        minSalary: value,
        maxSalary: value,
      }));
      return;
    }

    /** Check for errors min minSalary everytime maxSalary is changed */
    if (field === "maxSalary") {
      const minSalaryErr = validateField(
        "minSalary",
        jobDetails?.minSalary,
        currentJobDetails
      );
      const maxSalaryErr = validateField("maxSalary", value, currentJobDetails);
      setErrors((prev) => ({
        ...prev,
        minSalary: minSalaryErr,
        maxSalary: maxSalaryErr,
      }));
      setJobDetails((prev) => ({
        ...prev,
        maxSalary: value,
      }));
      return;
    }

    const error = validateField(field, value, currentJobDetails);

    setErrors((prev) => ({ ...prev, [field]: error }));

    setJobDetails(currentJobDetails);
  };
  useEffect(() => {
    if (isEditMode && jobData) {
      const preFilledJobData = mapResponseToFormDetails(jobData);
      setJobDetails(preFilledJobData);
      setSelectedPill([preFilledJobData.typeOfJob]);
    }
  }, [isEditMode, jobData]);

  return {
    jobDetails,
    setJobDetails,
    errors,
    setErrors,
    validateForm,
    validateField,
    getFormattedPayload,
    jobCategories,
    jobDescriptionUrl,
    setJobDescriptionUrl,
    handleFieldUpdate,
  };
};

export default useJobPostForm;
