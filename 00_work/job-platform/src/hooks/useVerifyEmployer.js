import {
  BRAND_MAX_LENGTH,
  COMPANY_NAME_MAX_LENGTH,
  companyTypeMap,
  NAME_MAX_LENGTH,
} from "@/constants";
import { REGEX_DOCUMENT, REGEX } from "@/constants/regex";
import { isValidField, isValidEmail } from "@/utils/helpers";

const useVerifyEmployer = ({ employerData, setErrors, employerPhoneNo }) => {
  const validateFields = async () => {
    const newErrors = {};
    if (
      employerData?.workEmail?.trim() &&
      !isValidEmail(employerData?.workEmail)
    ) {
      newErrors.workEmail = "Invalid Work Email";
    }
    // Basic Details Validation
    if (!employerData?.companyName?.trim())
      newErrors.companyName = "Enter Company Name";
    if (employerData?.firstName?.trim()?.length > NAME_MAX_LENGTH)
      newErrors.firstName = "Please enter valid name within 30 characters";
    if (employerData?.lastName?.trim()?.length > NAME_MAX_LENGTH)
      newErrors.lastName = "Please enter valid name within 30 characters";
    if (employerData?.brandName?.trim()?.length > BRAND_MAX_LENGTH)
      newErrors.brandName =
        "Please enter valid brand name within 50 characters";
    if (employerData?.companyName?.trim()?.length > COMPANY_NAME_MAX_LENGTH)
      newErrors.companyName =
        "Please enter valid company name within 100 characters";
    if (!employerData?.workEmail?.trim()) {
      newErrors.workEmail = "Work email is required";
    } else if (!REGEX.email.test(employerData.workEmail.trim())) {
      newErrors.workEmail = "Please enter a valid email address";
    }
    // Business Proof Validation
    const hasAnyDoc =
      employerData?.CIN ||
      employerData?.GSTIN ||
      employerData?.PAN ||
      employerData?.LLPIN ||
      employerData?.AADHAAR;

    if (!hasAnyDoc) {
      newErrors.documentRequired = "Document number is required";
    }
    if (
      employerData?.CIN &&
      !isValidField(employerData.CIN, REGEX_DOCUMENT.CIN)
    ) {
      newErrors.CIN = "Invalid CIN";
    }

    if (
      employerData?.GSTIN &&
      !isValidField(employerData.GSTIN, REGEX_DOCUMENT.GSTIN)
    ) {
      newErrors.GSTIN = "Invalid GSTIN";
    }

    if (
      employerData?.PAN &&
      !isValidField(employerData.PAN, REGEX_DOCUMENT.PAN)
    ) {
      newErrors.PAN = "Invalid PAN";
    }

    if (
      employerData?.LLPIN &&
      !isValidField(employerData.LLPIN, REGEX_DOCUMENT.LLPIN)
    ) {
      newErrors.LLPIN = "Invalid LLPIN";
    }

    if (
      employerData?.AADHAAR &&
      !isValidField(employerData.AADHAAR, REGEX_DOCUMENT.AADHAAR)
    ) {
      newErrors.AADHAAR = "Invalid Aadhaar";
    }

    const hasAnyDocUrl =
      employerData?.CINUrl?.trim() ||
      employerData?.GSTINUrl?.trim() ||
      employerData?.PANUrl?.trim() ||
      employerData?.LLPINUrl?.trim() ||
      employerData?.AADHAARUrl?.trim();

    if (!hasAnyDocUrl) {
      if (employerData?.CIN && !employerData?.CINUrl?.trim()) {
        newErrors.CINUrl = "CIN document URL is required";
      }

      if (employerData?.GSTIN && !employerData?.GSTINUrl?.trim()) {
        newErrors.GSTINUrl = "GSTIN document URL is required";
      }

      if (employerData?.PAN && !employerData?.PANUrl?.trim()) {
        newErrors.PANUrl = "PAN document URL is required";
      }

      if (employerData?.LLPIN && !employerData?.LLPINUrl?.trim()) {
        newErrors.LLPINUrl = "LLPIN document URL is required";
      }

      if (employerData?.AADHAAR && !employerData?.AADHAARUrl?.trim()) {
        newErrors.AADHAARUrl = "Aadhaar document URL is required";
      }
    }
    setErrors(newErrors);

    return Object.keys(newErrors)?.length === 0;
  };

  const generateEmployerPayload = () => {
    const normalizedTitle = employerData.title?.toUpperCase().replace(".", "");
    const payload = {
      userContact: {
        email: employerData.workEmail,
        dialCode: "+91",
        phoneNo: employerPhoneNo,
      },
      // password: generateRandomString(),
      // appType: 'OPS',
      // userType: 'STAFFING_AGENCY',
      firstName: employerData.firstName,
      brandName: employerData.brandName,
      workEmail: employerData.workEmail,
      // companySize: employerData.companySize,
      // signUpPhoneNumber: employerPhoneNo,
      // communicationPhoneNumber: employerData.communicationPhoneNumber,
      companyLogoUrl: employerData.companyLogoUrl,
      nameTitle: normalizedTitle,
      lastName: employerData.lastName,
      employersAgencyType: employerData.employersAgencyType,
      companyRegisteredName: employerData.companyName,
      companyType: companyTypeMap[employerData.registrationType],
      GST: {
        number: employerData.GSTIN || "",
        url: employerData.GSTINUrl || "",
      },
      LLPIN: {
        number: employerData.LLPIN || "",
        url: employerData.LLPINUrl || "",
      },
      PAN: {
        number: employerData.PAN || "",
        url: employerData.PANUrl || "",
      },
      CIN: {
        number: employerData.CIN || "",
        url: employerData.CINUrl || "",
      },
      AADHAAR: {
        number: employerData.AADHAAR || "",
        url: employerData.AADHAARUrl || "",
      },
      // currentAddress: {
      //   address1: employerData.address1,
      //   address2: employerData.address2,
      //   pincode: employerData.pincode,
      //   city: employerData.city,
      //   state: employerData.state,
      // },
    };

    return payload;
  };

  return {
    generateEmployerPayload,
    validateFields,
  };
};

export default useVerifyEmployer;
