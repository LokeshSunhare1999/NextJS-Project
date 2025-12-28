import { useState, useEffect } from 'react';
import { useGetJobCategories } from '../../apis/queryHooks';
import { MIN_AGE } from '../../constants/job';

const initialJobState = {
  jobRole: '',
  category: '',
  noOfOpenings: '',
  jobExpiryDate: '',
  workHours: '',
  typeOfJob: '',
  genderPreference: [],
  isAgePreferenceRequired: false,
  minAge: null,
  maxAge: null,
  minSalary: '',
  maxSalary: '',
  isWeeklyPayoutAvailable: false,
  requirements: [],
  description: '',
  benefits: [],
  minQualification: '',
  minExp: null,
  maxExp: null,
  noMandatoryExperience: false,
  location: {},
  autoShortList: true,
};

const useJobPostForm = (isEditMode, jobData, agencyType) => {
  const [jobDetails, setJobDetails] = useState(initialJobState);
  const [errors, setErrors] = useState({});
  const [selectedPill, setSelectedPill] = useState([]);
  const [selectedGenders, setSelectedGenders] = useState([]);

  const { data: jobGlobalData } = useGetJobCategories();
  const jobCategories = jobGlobalData?.metaData?.JOB_CATEGORY || [];

  const mapResponseToFormDetails = (jobData) => ({
    jobRole: jobData?.title || '',
    benefits: jobData?.benefits?.length > 0 ? jobData?.benefits : [],
    category: jobData?.category || '',
    location: jobData?.location ? jobData?.location : {},
    noOfOpenings: jobData?.noOfOpenings || '',
    minQualification: jobData?.minQualification || '',
    jobExpiryDate: jobData?.jobExpiryDate || '',
    minExp: jobData?.experience?.minExperience,
    maxExp: jobData?.experience?.maxExperience,
    noMandatoryExperience: jobData?.experience?.noMandatoryExperience || false,
    minAge: jobData?.agePreference?.minAge,
    maxAge: jobData?.agePreference?.maxAge,
    isWeeklyPayoutAvailable: jobData?.salaryRange?.weeklyPayout || false,
    minSalary: jobData?.salaryRange?.minSalary || '',
    maxSalary: jobData?.salaryRange?.maxSalary || '',
    workHours: jobData?.workHours || '',
    genderPreference:
      jobData?.genderPreference?.length > 0 ? jobData?.genderPreference : [],
    typeOfJob: jobData?.type || '',
    requirements:
      jobData?.requirements?.length > 0 ? jobData?.requirements : [],
    description: jobData?.description || '',
    status: jobData?.status || '',
    jobEmployerName: jobData?.jobEmployerName || '',
    jobEmployerLogo: jobData?.jobEmployerLogo || '',
    autoShortList: jobData?.autoShortList ?? false,
  });

  const validateForm = () => {
    const newErrors = {};

    if (!jobDetails.jobRole?.trim())
      newErrors.jobRole = 'Job title is required.';
    if (!jobDetails.category) newErrors.category = 'Category is required.';
    if (jobDetails.noOfOpenings && isNaN(jobDetails.noOfOpenings)) {
      newErrors.noOfOpenings = 'Number of openings should be a number.';
    }
    if (!selectedPill?.length) newErrors.typeOfJob = 'Type of job is required.';
    if (!jobDetails.minSalary) {
      newErrors.minSalary = 'Min Salary is required.';
    }
    if (!jobDetails.maxSalary) newErrors.maxSalary = 'Max Salary is required.';
    if (jobDetails.jobRole?.trim()?.length > 35)
      newErrors.jobRole = 'Job title should be within 35 characters';
    if (
      jobDetails?.isAgePreferenceRequired &&
      !jobDetails.minAge &&
      !jobDetails.maxAge
    ) {
      newErrors.minAge = 'Provide Age.';
    }

    // Compare min-max validations
    if (
      jobDetails.minSalary &&
      jobDetails.maxSalary &&
      parseInt(jobDetails.minSalary) > parseInt(jobDetails.maxSalary)
    ) {
      newErrors.minSalary = 'Min. salary should be less than max. salary.';
    }
    if (
      parseInt(jobDetails.minAge) < MIN_AGE ||
      parseInt(jobDetails.maxAge) < MIN_AGE
    ) {
      newErrors.minAge = 'Age should be ' + MIN_AGE + ' or above';
    }
    if (parseInt(jobDetails.minAge) >= parseInt(jobDetails.maxAge)) {
      newErrors.minAge = 'Min. age should be less than max. age.';
    }

    if (parseFloat(jobDetails.minExp) >= parseFloat(jobDetails.maxExp)) {
      newErrors.minExp = 'Min. experience should be less than max experience';
    }

    if (!jobDetails?.jobExpiryDate) {
      newErrors.jobExpiryDate = 'Job expiry date is required.';
    }

    // if (agencyType === 'RECRUITMENT_AGENCY' && !jobDetails?.jobEmployerName) {
    //   newErrors.jobEmployerName = 'Hiring for field is required.';
    // }

    if (Object.keys(jobDetails?.location)?.length === 0) {
      newErrors.location = 'Location is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
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
      type: selectedPill[0],
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
      },
      noOfOpenings: Number(jobDetails?.noOfOpenings),
      genderPreference: selectedGenders,
      requirements: jobDetails?.requirements,
      agePreference: {
        minAge: jobDetails?.minAge ? Number(jobDetails?.minAge) : null,
        maxAge: jobDetails?.maxAge ? Number(jobDetails?.maxAge) : null,
        isAgePreferenceRequired: jobDetails?.isAgePreferenceRequired,
      },
      noOfApplications: 0,
      jobExpiryDate: formattedJobExpiryDate,
      jobEmployerName: jobDetails?.jobEmployerName,
      jobEmployerLogo: jobDetails?.jobEmployerLogo,
      autoShortList: jobDetails?.autoShortList,
    };
  };

  useEffect(() => {
    if (isEditMode && jobData) {
      const preFilledJobData = mapResponseToFormDetails(jobData);
      setJobDetails(preFilledJobData);
      setSelectedPill([preFilledJobData.typeOfJob]);
      setSelectedGenders(preFilledJobData.genderPreference);
    }
  }, [isEditMode, jobData]);

  return {
    jobDetails,
    setJobDetails,
    errors,
    setErrors,
    selectedPill,
    setSelectedPill,
    selectedGenders,
    setSelectedGenders,
    validateForm,
    getFormattedPayload,
    jobCategories,
  };
};

export default useJobPostForm;
