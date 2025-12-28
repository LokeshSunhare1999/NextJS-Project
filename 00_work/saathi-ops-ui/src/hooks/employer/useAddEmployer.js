import { registrationTypeMap, salutationMap } from '../../constants/details';
import {
  COMPANY_SIZE_MAX_LIMIT,
  companyTypeMap,
  DOMAIN_MAX_LENGTH,
  EMPLOYER_DEFAULT_MIN,
} from '../../constants/employer';
import { REGEX } from '../../constants/regex';
import {
  generateRandomString,
  isDisposableEmail,
  isValidEmail,
  isValidField,
  isValidPhoneNumber,
} from '../../utils/helper';

const useAddEmployer = ({
  employerData,
  setEmployerData,
  domain,
  checkDomainDataRefetch,
  pincode,
  cityStateDataRefetch,
  setErrors,
  agencyType,
  employerDetailsData,
}) => {
  const mapResponseToFormDetails = (response) => {
    return {
      workEmail: response?.workEmail || '',
      companyName: response?.companyRegisteredName || '',
      workPhone: response?.phoneNo || '',
      title: response?.nameTitle
        ? salutationMap[response?.nameTitle]
        : salutationMap['MR'],
      firstName: response?.firstName || '',
      lastName: response?.lastName || '',
      brandName: response?.brandName || '',
      companySize: response?.companySize || '',
      // signUpPhoneNumber: response?.signUpPhoneNumber || '',
      // communicationPhoneNumber: response?.communicationPhoneNumber || '',
      companyLogoUrl: response?.companyLogoUrl || '',

      registrationType: response?.companyType
        ? registrationTypeMap[response?.companyType]
        : 'Select',
      companyWebsiteURL: response?.companyWebsiteUrl || '', // Assuming not provided in the response
      isAutoShortList: response?.isAutoShortList,
      CIN:
        response?.CIN?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.CIN?.number || '',
      CINUrl:
        response?.CIN?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.CIN?.url || '',
      GSTIN:
        response?.GST?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.GST?.number || '',
      GSTINUrl:
        response?.GST?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.GST?.url || '',
      LLPIN:
        response?.LLPIN?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.LLPIN?.number || '',
      LLPINUrl:
        response?.LLPIN?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.LLPIN?.url || '',
      PAN:
        response?.PAN?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.PAN?.number || '',
      PANUrl:
        response?.PAN?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.PAN?.url || '',
      AADHAAR:
        response?.AADHAAR?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.AADHAAR?.number || '',
      AADHAARUrl:
        response?.AADHAAR?.verificationStatus === 'NOT_INITIATED'
          ? ''
          : response?.AADHAAR?.url || '',
      employersAgencyType: response?.employersAgencyType || '',
      address1: response?.currentAddress?.address1 || '',
      address2: response?.currentAddress?.address2 || '',
      pincode: response?.currentAddress?.pincode || '',
      city: response?.currentAddress?.city || '',
      state: response?.currentAddress?.state || '',
    };
  };
  const validateFields = async () => {
    const newErrors = {};

    // Basic Details Validation

    if (
      employerData?.workEmail?.trim() &&
      !isValidEmail(employerData?.workEmail)
    ) {
      newErrors.workEmail = 'Invalid Work Email';
    }
    if (!employerData?.companyName?.trim())
      newErrors.companyName = 'Enter Company Name';
    if (employerData?.firstName?.trim()?.length > 30)
      newErrors.firstName = 'Please enter valid name within 30 characters';
    if (employerData?.lastName?.trim()?.length > 30)
      newErrors.lastName = 'Please enter valid name within 30 characters';
    if (employerData?.brandName?.trim()?.length > 50)
      newErrors.brandName =
        'Please enter valid brand name within 50 characters';
    // if (employerData?.signUpPhoneNumber?.trim() &&
    //     employerData?.signUpPhoneNumber?.trim()?.length !== 10)
    //   newErrors.signUpPhoneNumber =
    //     'Please enter valid Signup Phone No.';
    // if (employerData?.communicationPhoneNumber?.trim() &&
    //     employerData?.communicationPhoneNumber?.trim()?.length !== 10)
    //   newErrors.communicationPhoneNumber =
    //    'Please enter valid Communication Phone No.';
    if (
      employerData?.companySize &&
      (employerData?.companySize > COMPANY_SIZE_MAX_LIMIT ||
        employerData?.companySize < EMPLOYER_DEFAULT_MIN)
    )
      newErrors.companySize = `Company Size must be in the range of ${EMPLOYER_DEFAULT_MIN} to ${COMPANY_SIZE_MAX_LIMIT}.`;
    if (employerData?.companyName?.trim()?.length > 100)
      newErrors.companyName =
        'Please enter valid company name within 100 characters';
    if (!employerData?.workPhone || !employerData?.workPhone?.trim()?.length)
      newErrors.workPhone = 'Enter valid phone no';
    if (
      employerData?.workPhone &&
      employerData?.workPhone?.trim()?.length &&
      !isValidPhoneNumber(employerData?.workPhone)
    )
      newErrors.workPhone = 'Invalid phone no';

    // Business Proof Validation

    if (employerData?.CIN && !isValidField(employerData.CIN, REGEX.CIN)) {
      newErrors.CIN = 'Invalid CIN';
    }

    if (employerData?.GSTIN && !isValidField(employerData.GSTIN, REGEX.GSTIN)) {
      newErrors.GSTIN = 'Invalid GSTIN';
    }

    if (employerData?.PAN && !isValidField(employerData.PAN, REGEX.PAN)) {
      newErrors.PAN = 'Invalid PAN';
    }

    if (employerData?.LLPIN && !isValidField(employerData.LLPIN, REGEX.LLPIN)) {
      newErrors.LLPIN = 'Invalid LLPIN';
    }

    if (
      employerData?.AADHAAR &&
      !isValidField(employerData.AADHAAR, REGEX.AADHAAR)
    ) {
      newErrors.AADHAAR = 'Invalid Aadhaar';
    }
    if (!employerData?.pincode) {
      newErrors.pincode = 'Enter Pin Code';
    }

    if (
      employerData?.pincode &&
      !isValidField(employerData.pincode, REGEX.PIN_CODE)
    ) {
      newErrors.pincode = 'Invalid Pin Code';
    }

    if (domain) {
      if (employerData?.companyWebsiteURL?.trim()?.length > DOMAIN_MAX_LENGTH) {
        newErrors.companyWebsiteURL = `Please enter valid url within ${DOMAIN_MAX_LENGTH} characters`;
      } else {
        const domainDataCheck = await checkDomainDataRefetch();

        if (
          domainDataCheck?.data?.isValid === 'false' ||
          domainDataCheck?.isError
        ) {
          newErrors.companyWebsiteURL =
            'Invalid website. Please enter a valid URL.';
        }
      }
    }
    if (pincode && isValidField(pincode, REGEX.PIN_CODE)) {
      const cityStateData = await cityStateDataRefetch();
      if (cityStateData?.isError) {
        newErrors.pincode = 'Invalid Pincode';
      } else {
        if (cityStateData?.data) {
          setEmployerData((prev) => ({
            ...prev,
            city: cityStateData?.data?.city,
            state: cityStateData?.data?.state,
          }));
        }
      }
    }

    if (employerData?.address1?.trim()?.length > 30) {
      newErrors.address1 = 'Please enter valid address within 30 characters';
    }
    if (employerData?.address2?.trim()?.length > 30) {
      newErrors.address2 = 'Please enter valid address within 30 characters';
    }
    if (employerData?.city?.trim()?.length > 30) {
      newErrors.city = 'Please enter valid city name within 30 characters';
    }

    setErrors(newErrors);

    return Object.keys(newErrors)?.length === 0;
  };

  const generateEmployerPayload = () => {
    const normalizedTitle = employerData.title?.toUpperCase().replace('.', '');
    const payload = {
      userContact: {
        phoneNo: employerData.workPhone,
        dialCode: '+91',
      },
      workEmail: employerData.workEmail,
      appType: 'OPS',
      userType: 'EMPLOYER',
      firstName: employerData.firstName,
      brandName: employerData.brandName,
      companySize: employerData.companySize,
      // signUpPhoneNumber: employerData.signUpPhoneNumber,
      // communicationPhoneNumber: employerData.communicationPhoneNumber,
      companyLogoUrl: employerData.companyLogoUrl,
      nameTitle: normalizedTitle,
      lastName: employerData.lastName,
      companyWebsiteUrl: employerData.companyWebsiteURL,
      employersAgencyType: agencyType || employerData?.employersAgencyType,
      companyRegisteredName: employerData.companyName,
      companyType: companyTypeMap[employerData.registrationType],
      isAutoShortList: !!employerData?.isAutoShortList,
      GST: {
        number: employerData.GSTIN,
        url: employerData.GSTINUrl,
      },
      LLPIN: {
        number: employerData.LLPIN,
        url: employerData.LLPINUrl,
      },
      PAN: {
        number: employerData.PAN,
        url: employerData.PANUrl,
      },
      CIN: {
        number: employerData.CIN,
        url: employerData.CINUrl,
      },
      AADHAAR: {
        number: employerData.AADHAAR,
        url: employerData.AADHAARUrl,
      },
      currentAddress: {
        address1: employerData.address1,
        address2: employerData.address2,
        pincode: employerData.pincode,
        city: employerData.city,
        state: employerData.state,
      },
    };

    return payload;
  };

  return {
    mapResponseToFormDetails,
    generateEmployerPayload,
    validateFields,
  };
};

export default useAddEmployer;
