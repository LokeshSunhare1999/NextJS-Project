import { useEffect, useState } from "react";
import {
  BENEFITS_LENGTH,
  MAX_AGE,
  MIN_AGE,
  REQUIREMENTS_LENGTH,
} from "@/constants";

const usePostJobAdditionalDetails = ({
  jobDetails,
  setJobDetails,
  errors,
  setErrors,
}) => {
  const [jobDescriptionUrl, setJobDescriptionUrl] = useState("");
  const [currentBenefit, setCurrentBenefit] = useState("");
  const [requirement, setRequirement] = useState("");
  const [isAgeMinReqSelected, setIsAgeMinReqSelected] = useState(
    jobDetails?.isAgePreferenceRequired || false
  );

  useEffect(() => {
    setIsAgeMinReqSelected(jobDetails?.isAgePreferenceRequired);
  }, [jobDetails?.isAgePreferenceRequired]);

  const handleFieldUpdate = (field, value) => {
    if (
      (field === "minExp" ||
        field === "maxExp" ||
        field === "minAge" ||
        field === "maxAge") &&
      !/^\d*$/.test(value)
    )
      return;

    const currentJobDetails = { ...jobDetails, [field]: value };
    if (field === "maxExp") {
      const minExpErr = validateAdditionalField(
        "minExp",
        jobDetails?.minExp,
        currentJobDetails
      );
      const maxExpErr = validateAdditionalField(
        "maxExp",
        value,
        currentJobDetails
      );
      setErrors((prev) => ({
        ...prev,
        minExp: minExpErr,
        maxExp: maxExpErr,
      }));
      setJobDetails((prev) => ({
        ...prev,
        maxExp: value,
      }));
      return;
    }

    if (field === "maxAge") {
      const minAgeErr = validateAdditionalField(
        "minAge",
        jobDetails?.minAge,
        currentJobDetails
      );
      const maxAgeErr = validateAdditionalField(
        "maxAge",
        value,
        currentJobDetails
      );
      setErrors((prev) => ({
        ...prev,
        minAge: minAgeErr,
        maxAge: maxAgeErr,
      }));
      setJobDetails((prev) => ({
        ...prev,
        maxAge: value,
      }));
      return;
    }

    const error = validateAdditionalField(field, value, currentJobDetails);
    setErrors((prev) => ({ ...prev, [field]: error }));

    setJobDetails(currentJobDetails);
    return;
  };

  const handleAddBenefit = () => {
    if (!currentBenefit.trim()) return;
    if (currentBenefit.trim().length > BENEFITS_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        benefits: "Benefits should not exceed 30 characters",
      }));
      return;
    }
    const parsed = currentBenefit
      .split(",")
      .filter((item) => item.trim() !== "");

    setJobDetails((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ...parsed],
    }));
    setErrors((prev) => ({ ...prev, benefits: "" }));
    setCurrentBenefit("");
  };

  const handleRemoveBenefit = (index) => {
    setJobDetails((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index),
    }));
  };

  const handleAddRequirement = () => {
    if (!requirement.trim()) return;
    if (requirement.trim().length > REQUIREMENTS_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        requirements: "Requirement should not exceed 500 characters",
      }));
      return;
    }
    const parsed = requirement.split(/[\n\r,]+/).filter((item) => item.trim());
    setJobDetails((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ...parsed],
    }));
    setErrors((prev) => ({ ...prev, requirements: "" }));
    setRequirement("");
  };

  const handleRemoveRequirement = (index) => {
    setJobDetails((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index),
    }));
  };

  const handleAgePreferenceClick = (option) => {
    const selected = option === "Yes";
    setIsAgeMinReqSelected(selected);
    setJobDetails((prev) => ({
      ...prev,
      isAgePreferenceRequired: selected,
    }));
    if (!selected) {
      setJobDetails((prev) => ({
        ...prev,
        minAge: "",
        maxAge: "",
      }));
    }
    setErrors((prev) => ({ ...prev, minAge: "", maxAge: "" }));
  };

  const handleQualificationsSelect = (value) => {
    handleFieldUpdate("minQualification", value);
  };

  const handleNoMandatoryExpClick = () => {
    setJobDetails((prev) => ({
      ...prev,
      noMandatoryExperience: !prev.noMandatoryExperience,
      // minExp: "",
      // maxExp: "",
    }));
    setErrors((prev) => ({
      ...prev,
      // minExp: "",
      // maxExp: "",
    }));
  };

  const validateAdditionalField = (field, value, currentJobDetails) => {
    switch (field) {
      case "genderPreference":
        if (!value || value.length === 0)
          return "Gender preference is required.";
        return "";

      case "noOfOpenings":
        if (!value || value.trim() === "")
          return "Number of vacancies is required.";
        return "";

      case "workHours":
        if (!value || value.trim() === "") return "Work hours are required.";
        return "";

      case "minExp": {
        const minExp = parseFloat(currentJobDetails.minExp);
        const maxExp = parseFloat(currentJobDetails.maxExp);

        if (!currentJobDetails.noMandatoryExperience) {
          if (
            !currentJobDetails.minExp ||
            currentJobDetails.minExp.trim() === ""
          ) {
            return "Minimum experience is required.";
          }

          if (
            currentJobDetails.minExp &&
            currentJobDetails.maxExp &&
            !isNaN(minExp) &&
            !isNaN(maxExp) &&
            minExp >= maxExp
          ) {
            return "Min. experience should be less than max experience";
          }
        }

        return "";
      }

      case "maxExp": {
        if (
          !currentJobDetails.noMandatoryExperience &&
          (!currentJobDetails.maxExp || currentJobDetails.maxExp.trim() === "")
        ) {
          return "Maximum experience is required.";
        }

        return "";
      }

      case "minAge": {
        const minAge = parseInt(currentJobDetails.minAge);
        const maxAge = parseInt(currentJobDetails.maxAge);

        if (currentJobDetails.isAgePreferenceRequired) {
          if (!currentJobDetails.minAge && !currentJobDetails.maxAge) {
            return "Provide Age.";
          }

          if (!isNaN(minAge) && minAge < MIN_AGE) {
            return `Age should be ${MIN_AGE} or above`;
          }

          if (!isNaN(minAge) && minAge > MAX_AGE) {
            return `Age should be ${MAX_AGE} or less`;
          }

          if (!isNaN(minAge) && !isNaN(maxAge) && minAge >= maxAge) {
            return "Min. age should be less than max. age.";
          }
        }

        return "";
      }

      case "maxAge": {
        const maxAge = parseInt(currentJobDetails.maxAge);

        if (!isNaN(maxAge) && maxAge > MAX_AGE) {
          return `Age should be ${MAX_AGE} or less`;
        }

        if (!isNaN(maxAge) && maxAge < MIN_AGE)
          return `Age should be ${MIN_AGE} or above`;
        return "";
      }

      case "recruiterPhoneNumber": {
        if (value?.trim().length > 0 && value?.trim().length !== 10)
          return "Recruiter phone number must be 10 digits.";
        return "";
      }

      default:
        return "";
    }
  };

  const validateAdditionalDetails = (currentJobDetails) => {
    const fieldsToValidate = [
      "genderPreference",
      "noOfOpenings",
      "workHours",
      "minExp",
      "maxExp",
      "minAge",
      "maxAge",
      "recruiterPhoneNumber",
      "recruiterName",
    ];

    const newErrors = {};

    fieldsToValidate.forEach((field) => {
      const value = currentJobDetails[field];
      const error = validateAdditionalField(field, value, currentJobDetails);
      newErrors[field] = error;
    });

    setErrors((prev) => ({ ...prev, ...newErrors }));
    const isError = Object.values(newErrors).some((msg) => msg !== "");
    return !isError;
  };

  return {
    currentBenefit,
    setCurrentBenefit,
    requirement,
    setRequirement,
    isAgeMinReqSelected,
    handleFieldUpdate,
    handleAddBenefit,
    handleRemoveBenefit,
    handleAddRequirement,
    handleRemoveRequirement,
    handleAgePreferenceClick,
    handleQualificationsSelect,
    jobDescriptionUrl,
    setJobDescriptionUrl,
    handleNoMandatoryExpClick,
    validateAdditionalDetails,
    validateAdditionalField,
  };
};

export default usePostJobAdditionalDetails;
