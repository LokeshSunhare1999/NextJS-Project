import {
  useGetJobCategories,
  useGetUserBasicDetails,
} from '../../apis/queryHooks';
import { genderPreference } from '../../constants/employer';
import {
  VERIFICATION_LINKS,
  VERIFICATION_STATUS_KEYS,
  VERIFICATION_TYPES,
} from '../../constants/verification';
import {
  toCamelCase,
  convertCamelCaseToTitleCase,
  convertToKebabCase,
  formatDate,
  camelToSnakeUpperCase,
  toTitleCase,
  capitalizeFirstLetter,
} from '../../utils/helper';

const useCustomerDetails = (
  userInfo,
  setPageRoute,
  setWorkExpIndex,
  setJobReelsIndex,
  setShowVerificationPage,
  setShowWorkExperiencePage,
  setShowJobReelPage,
  navigate,
) => {
  const customerId = userInfo?._id;
  const { data: userBasicDetails } = useGetUserBasicDetails(userInfo?._id);
  const { data: jobGlobalData } = useGetJobCategories();

  const jobCategories = jobGlobalData?.metaData?.JOB_CATEGORY || [];

  const getCategoryValue = (categoryEnum) => {
    return jobCategories?.find((category) => category?.key === categoryEnum)
      ?.value;
  };
  const educationOptionsValues = userInfo?.educationOptions?.map(
    (item) => item.value,
  );
  const educationOptionsKeys = userInfo?.educationOptions?.map(
    (item) => item.key,
  );

  const convertEducationLevel = (value) => {
    if (!value) return '-----';
    const index = educationOptionsKeys?.indexOf(value);
    if (index !== -1) {
      return educationOptionsValues[index];
    } else {
      return '-----';
    }
  };

  const formatMobileNumber = (contact) => {
    if (contact?.dialCode && contact?.phoneNo) {
      return `${contact.dialCode} ${contact.phoneNo}`;
    }
    return '-----';
  };
  const employeeData = {
    Name: userInfo?.name || '-----',
    userCreationDate:
      formatDate(userInfo?.createdAt, 'DD-MMM-YYYY, h:mm a') || '-----',
    mobileNo: formatMobileNumber(userInfo?.primaryContact) || '-----',
    dateOfBirth: formatDate(userInfo?.trueId?.aadhaar?.dateOfBirth) || '-----',

    customerType: userInfo?.trueId?.customerType || '-----',
    'Total Exp (in years) ': userInfo?.noOfYearOfExperience?.toString() || '0',
    trueID: userInfo?.saathiId || '-----',
    introVideo: userInfo?.introVideoLink,
    customerID: userInfo?._id,
    highestEducation:
      convertEducationLevel(userInfo?.highestEducation?.degree) || '-----',
    aadhaarNumber: userInfo?.trueId?.aadhaar?.number || '-----',
    drivingLicenseNo: userInfo?.trueId?.drivingLicense?.number || '-----',
    jobTitle: userInfo?.defaultEmploymentName || '-----',
    'Current Add.': userInfo?.currentAddress
      ? `${userInfo?.currentAddress?.address} ${userInfo?.currentAddress?.city} ${userInfo?.currentAddress?.state} ${userInfo?.currentAddress?.country} ${userInfo?.currentAddress?.pincode}`
      : '-----',
    'Permanent Add.': userInfo?.trueId?.aadhaar?.address1
      ? toTitleCase(userInfo?.trueId?.aadhaar?.address1)
      : '-----',
    referredBy: userInfo?.parentCustomer?._id || '-----',
  };

  const trueIdData = {
    rating: userInfo?.trueId?.rating || 0,
    livePhotoUrl: userInfo?.trueId?.liveness?.photoUrl,
  };

  const getTrueIdProperty = (property) =>
    userInfo?.trueId?.[toCamelCase(property)];

  const convertToVerificationData = (props) => {
    return props.reduce((acc, property) => {
      if (
        getTrueIdProperty(VERIFICATION_STATUS_KEYS[property]) !== 'NOT_REQUIRED'
      ) {
        acc[toCamelCase(property)] = getTrueIdProperty(property);
      }
      return acc;
    }, {});
  };

  const verificationData = convertToVerificationData(
    Object.keys(VERIFICATION_TYPES),
  );

  const handleRowClick = (index) => {
    setShowVerificationPage(true);
    const selectedItem = Object.keys(verificationData).map((item) =>
      camelToSnakeUpperCase(item),
    )?.[index];

    setPageRoute(convertToKebabCase(VERIFICATION_LINKS?.[selectedItem]));
  };

  const handleWorkExpRowClick = (index) => {
    setWorkExpIndex(index);
    setShowWorkExperiencePage(true);
  };
  const handleJobReelsRowClick = (index) => {
    setJobReelsIndex(index);
    navigate(`/customers/${customerId}?jobReel=${index}`);
  };

  const workExpData = userInfo?.employments || [];

  const workExpRows = workExpData?.map((data) => {
    return [
      data?.employerName,
      data?.employmentDesignation,
      data?.startDate,
      data?.isCurrentEmployment ? 'Currently Working' : data?.endDate,
      data?.rating,
      data?.verificationStatus,
    ];
  });

  const verificationRows = Object.keys(verificationData).map((key) => {
    const data = verificationData[key];

    return [
      key === 'pan' ? 'PAN' : convertCamelCaseToTitleCase(key),
      data?.updatedAt,
      data?.verificationStatus,
    ];
  });

  const jobReelData = [
    userBasicDetails?.firstJobReelDetails,
    userBasicDetails?.secondJobReelDetails,
  ];

  const jobReelsDataRows = Object.keys(jobReelData)?.map((key) => {
    const data = jobReelData[key];
    return [
      data?.customerBioDataVideo,
      data?.createdAt,
      data?.updatedAt,
      data?.customerBioDataVideoVerificationStatus,
    ];
  });

  function createTooltipArray(verificationData) {
    const toolTipArray = Object.keys(verificationData).map((key) => {
      const data = verificationData[key];
      return data?.remarks?.length > 0 ? ['Remarks Available'] : [];
    });

    return toolTipArray;
  }

  const workExpHeaders = userInfo?.employmentDetailsHeaders;

  const jobCategoriesArr = userBasicDetails?.userDetails?.jobCategory?.map(
    (item) => getCategoryValue(item) || item,
  );
  const userEnteredBasicDetails = {
    name: userBasicDetails?.userDetails?.name,
    age: `${userBasicDetails?.userDetails?.age} years`,
    gender: genderPreference.find(
      (gender) => gender.key === userBasicDetails?.userDetails?.gender,
    )?.value,
    location: `${userBasicDetails?.userDetails?.userLocation?.[0]?.placeSuggestion?.title ? userBasicDetails?.userDetails?.userLocation?.[0]?.placeSuggestion?.title : ''}${userBasicDetails?.userDetails?.userLocation?.[0]?.placeSuggestion?.description ? `, ${userBasicDetails?.userDetails?.userLocation?.[0]?.placeSuggestion?.description}` : ''}`,
    jobCategories: jobCategoriesArr?.join(', '),
  };

  return {
    employeeData,
    trueIdData,
    verificationRows,
    jobReelsDataRows,
    verificationData,
    workExpHeaders,
    workExpRows,
    workExpData,
    userEnteredBasicDetails,
    createTooltipArray,
    handleRowClick,
    handleWorkExpRowClick,
    handleJobReelsRowClick,
  };
};

export default useCustomerDetails;
