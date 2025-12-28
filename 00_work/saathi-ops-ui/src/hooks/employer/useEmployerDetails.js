import { BUSINESS_TYPES, companyTypeMap } from '../../constants/employer';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../constants/permissions';
import {
  camelToSnakeUpperCase,
  convertToKebabCase,
  findKeyByValue,
  formatDate,
  toCamelCase,
} from '../../utils/helper';

const useEmployerDetails = ({
  employers,
  currentIndex,
  setPageRoute,
  setShowBusinessVerificationPage,
  hasPermission,
}) => {
  const getEmployerDataProperty = (property) => {
    return currentIndex?.[property];
  };

  const addressStr = `${currentIndex?.currentAddress?.address1 || ''} ${currentIndex?.currentAddress?.address2 || ''} ${currentIndex?.currentAddress?.city || ''} ${currentIndex?.currentAddress?.state || ''} ${currentIndex?.currentAddress?.country || ''} ${currentIndex?.currentAddress?.pincode || ''}`;

  const employeeBasicDetail = {
    nameTitle: currentIndex?.nameTitle,
    firstName: currentIndex?.firstName || '-----',
    companyType:
      findKeyByValue(companyTypeMap, currentIndex?.companyType) || '-----',
    lastName: currentIndex?.lastName?.split(' ')[0] || '-----',
    companySize: currentIndex?.companySize || 0,
    companyName: currentIndex?.companyRegisteredName || '-----',
    companySize: currentIndex?.companySize || '-----',
    'Phone No.': currentIndex?.phoneNo
      ? `+91 ${currentIndex?.phoneNo} `
      : '-----',
    createdOn: formatDate(currentIndex?.createdAt, 'DD MMMM YYYY') || '-----',
    emailId: currentIndex?.email ? `${currentIndex.email}` : '-----',
    brandName: currentIndex?.brandName ? `${currentIndex.brandName}` : '-----',
    address: addressStr?.trim()?.length > 4 ? addressStr : '-----',
    createdAt: formatDate(currentIndex?.createdAt, 'hh:mm A') || '-----',
    activationStatus: currentIndex?.activationStatus,
    businessCategory: currentIndex?.employersAgencyType,
    companyWebsiteUrl: currentIndex?.companyWebsiteUrl,
    companyLogoUrl: currentIndex?.companyLogoUrl,
    workEmail: currentIndex?.workEmail,
    isAutoShortList: currentIndex?.isAutoShortList,
  };
  if (
    currentIndex?.employersAgencyType === 'FACILITY_MANAGEMENT' ||
    currentIndex?.employersAgencyType === 'STAFFING_AGENCY'
  ) {
    delete employeeBasicDetail.nameTitle;
    delete employeeBasicDetail.companyWebsiteUrl;
    // delete employeeBasicDetail.companyLogoUrl;
    // delete employeeBasicDetail.firstName;
    // delete employeeBasicDetail.lastName;
  }

  const convertToBusinessData = (props) => {
    return props.reduce((acc, property) => {
      if (
        getEmployerDataProperty(BUSINESS_TYPES[property])
          ?.verificationStatus !== 'NOT_REQUIRED'
      ) {
        acc[property] = getEmployerDataProperty(BUSINESS_TYPES[property]);
      }
      return acc;
    }, {});
  };

  const businessVerificationData = convertToBusinessData(
    Object.keys(BUSINESS_TYPES),
  );

  const getFilteredKeys = () => {
    const companyType = employeeBasicDetail?.companyType;

    switch (companyType) {
      case 'Public Limited':
        return ['GST'];
      case 'Pvt Ltd':
        return ['CIN', 'GST', 'PAN'];
      case 'LLP':
        return ['LLPIN', 'GST', 'PAN'];
      case 'Partnership':
        return ['GST', 'PAN'];
      case 'Proprietorship':
        return ['GST', 'PAN', 'AADHAAR'];
      case 'Freelancer':
        return ['PAN', 'AADHAAR'];
      case 'OPC':
        return ['CIN', 'GST', 'PAN'];

      default:
        return Object.keys(BUSINESS_TYPES);
    }
  };

  const filteredBusinessVerificationData = Object.keys(businessVerificationData)
    .filter((key) => getFilteredKeys().includes(key))
    .reduce((acc, key) => {
      acc[key] = businessVerificationData[key];
      return acc;
    }, {});

  const businessVerificationRows = Object.keys(
    filteredBusinessVerificationData,
  ).map((key) => {
    const data = filteredBusinessVerificationData[key];
    const url = filteredBusinessVerificationData[key]?.url;

    return currentIndex?.employersAgencyType === 'FACILITY_MANAGEMENT' ||
      currentIndex?.employersAgencyType === 'STAFFING_AGENCY'
      ? [
          camelToSnakeUpperCase(key),
          data?.number || '-----',
          data?.lastUpdatedAt || '-----',
          data?.verificationStatus || '-----',
        ]
      : [
          camelToSnakeUpperCase(key),
          data?.number || '-----',
          url ? camelToSnakeUpperCase(key) : '',
          data?.lastUpdatedAt || '-----',
          data?.verificationStatus || '-----',
        ];
  });

  const handleRowClick = (index) => {
    if (!hasPermission(EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS))
      return;
    setShowBusinessVerificationPage(true);
    const selectedItem = Object.keys(filteredBusinessVerificationData).map(
      (item) => camelToSnakeUpperCase(item),
    )?.[index];

    setPageRoute(convertToKebabCase(BUSINESS_TYPES?.[selectedItem]));
  };

  const bankDetails = currentIndex?.bankDetails
    ? [
        [
          currentIndex.bankDetails.accountHolderName || '-----',
          currentIndex.bankDetails.bankName || '-----',
          currentIndex.bankDetails.accountNumber || '-----',
          currentIndex.bankDetails.verificationStatus || '-----',
        ],
      ]
    : [];

  const agreementDetails = currentIndex?.agreementDetails
    ? [
        [
          currentIndex?.agreementDetails.url ? 'Signed' : 'Not Signed',
          currentIndex?.agreementDetails.url
            ? formatDate(
                currentIndex.agreementDetails.updatedAt,
                'DD MMMM, YYYY hh:mm a',
              )
            : '---',
        ],
      ]
    : [];

  const agreementUrl = currentIndex?.agreementDetails?.url;
  return {
    employeeBasicDetail,
    handleRowClick,
    businessVerificationRows,
    bankDetails,
    agreementDetails,
    agreementUrl,
  };
};

export default useEmployerDetails;
