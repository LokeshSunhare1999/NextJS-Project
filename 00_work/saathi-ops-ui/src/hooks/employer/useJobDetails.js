import { useGetJobCategories } from '../../apis/queryHooks';
import { genderPreference, jobTypes } from '../../constants/employer';
import { formatDate } from '../../utils/helper';

const useJobDetails = ({ jobDetails }) => {
  const { data: jobGlobalData } = useGetJobCategories();
  const jobCategories = jobGlobalData?.metaData?.JOB_CATEGORY || [];

  const getAddressComponent = (components, type) => {
    const component = components?.find((comp) => comp.types.includes(type));
    return component ? component.long_name : '';
  };

  const getCategoryValue = (categoryEnum) => {
    return jobCategories?.find((category) => category.key === categoryEnum)
      ?.value;
  };
  const parsedLocation = (addressComponent) => {
    return `${
      getAddressComponent(addressComponent, 'sublocality_level_1')
        ? `${getAddressComponent(addressComponent, 'sublocality_level_1')}, `
        : ''
    }${
      getAddressComponent(addressComponent, 'locality') ||
      getAddressComponent(addressComponent, 'administrative_area_level_1')
    }`;
  };

  const addressStr = `${jobDetails?.currentAddress?.address1 || ''} ${jobDetails?.currentAddress?.city || ''} ${jobDetails?.currentAddress?.state || ''} ${jobDetails?.currentAddress?.country || ''} ${jobDetails?.currentAddress?.pincode || ''}`;
  const experienceStr =
    jobDetails?.experience?.minExperience != null &&
    jobDetails?.experience?.maxExperience != null
      ? `${jobDetails?.experience?.minExperience} year${jobDetails?.experience?.minExperience > 1 ? 's' : ''} - ${`${jobDetails?.experience?.maxExperience} year${jobDetails?.experience?.maxExperience > 1 ? 's' : ''}`}`
      : `${jobDetails?.experience?.experienceRangeText}`;

  const agePrefStr =
    jobDetails?.agePreference?.maxAge != null &&
    jobDetails?.agePreference?.minAge != null
      ? `${jobDetails?.agePreference?.minAge} year${jobDetails?.agePreference?.minAge > 1 ? 's' : ''} - ${`${jobDetails?.agePreference?.maxAge} year${jobDetails?.agePreference?.maxAge > 1 ? 's' : ''}`}`
      : `${jobDetails?.agePreference?.agePreferenceRangeText}`;

  const salaryStr = jobDetails?.salaryRange?.minSalary
    ? `₹${jobDetails?.salaryRange?.minSalary} ${jobDetails?.salaryRange?.maxSalary ? `- ₹${jobDetails?.salaryRange?.maxSalary} ` : ''}`
    : '-----';

  const locationStr =
    Object.keys(jobDetails?.location || {}).length > 0
      ? parsedLocation(jobDetails?.location?.metaData)
      : '-----';
  const jobBasicDetail = {
    hiringFor: jobDetails?.jobEmployerName || '-----',
    jobTitle: jobDetails?.title || '-----',
    benefits:
      jobDetails?.benefits?.length > 0
        ? jobDetails?.benefits?.join(', ')
        : '-----',
    category: getCategoryValue(jobDetails?.category) || '-----',
    jobLocation: locationStr,
    numberOfOpenings: jobDetails?.noOfOpenings || '-----',
    'Min. Qualification': jobDetails?.minQualification || '-----',
    jobExpiryDate:
      formatDate(jobDetails?.jobExpiryDate, 'DD MMM YYYY') || '-----',
    lastUpdatedAt: formatDate(jobDetails?.updatedAt, 'DD MMM YYYY') || '-----',
    experience: experienceStr,
    workHours: jobDetails?.workHours || '-----',
    genderPreference:
      jobDetails?.genderPreference?.length > 0
        ? jobDetails?.genderPreference
            ?.map(
              (genderKey) =>
                genderPreference.find((gender) => gender.key === genderKey)
                  ?.value,
            )
            .filter(Boolean)
            .join(', ')
        : '-----',
    typeOfJob: jobTypes?.find((type) => type.key === jobDetails?.type)?.value,
    agePreference: agePrefStr,
    'Salary Range (₹)': jobDetails?.SalaryRangeText,
    recruiterName: jobDetails?.recruiterName,
    'Recruiter Ph no': jobDetails?.recruiterPhoneNumber?.[0],
    requirement:
      jobDetails?.requirements?.length > 0
        ? jobDetails?.requirements.join(', ')
        : '-----',
    video: jobDetails?.video,
    thumbnail: jobDetails?.jobThumbnail ? jobDetails?.jobThumbnail : 'pending',
    postedBy: jobDetails?.sourceType,
    autoShortlist: jobDetails?.autoShortList === true ? 'Yes' : 'No',
    description: jobDetails?.description || '-----',
    jobDescription: jobDetails?.jobDescriptionUrl,
    // interviewSheet: jobDetails?.interviewQuestionUrl || '-----',
    // promptSheet: jobDetails?.interviewPromptUrl || '-----',
  };

  if (jobDetails?.employer?.employersAgencyType !== 'RECRUITMENT_AGENCY') {
    delete jobBasicDetail?.hiringFor;
  }

  return {
    jobBasicDetail,
  };
};

export default useJobDetails;
