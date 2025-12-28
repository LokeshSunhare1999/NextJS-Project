"use client";
import { useContext, useEffect, useState } from "react";
import BackIcon from "@/assets/icons/common/backIcon.svg";
import { useRouter, useSearchParams } from "next/navigation";
import RegistrationTypeForm from "./_components/RegistrationTypeForm";
import BasicDetailsForm from "./_components/BasicDetailsForm";
import BusinessDetailsForm from "./_components/BusinessDetailsForm";
import { ACCOUNT_FORM_DETAILS, registrationTypeMap } from "@/constants";
import {
  useGetCompanyDetailsByDocumentNo,
  useGetGlobalEmployerData,
  usePutUpdateEmployerStatus,
} from "@/apis/queryHooks";
import CustomCTA from "@/components/CustomCTA";
import { EmployerContext } from "@/providers/EmployerProvider";
import useVerifyEmployer from "@/hooks/useVerifyEmployer";
import { enqueueSnackbar } from "notistack";
import Svg from "@/components/Svg";
import { useInView } from "react-intersection-observer";
import { isEmpty } from "@/utils/helpers";

export default function Page() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const isTryAgain = searchParams.get("try-again");

  const [errors, setErrors] = useState({});
  const [employerData, setEmployerData] = useState(ACCOUNT_FORM_DETAILS);
  const [logoUrl, setLogoUrl] = useState("");
  const [info, setInfo] = useState({});
  const [documentNumber, setDocumentNumber] = useState("");
  const [documentType, setDocumentType] = useState("");
  const [isPrefilled, setIsPrefilled] = useState(false);

  const { ref: ctaRef, inView: isCtaInView } = useInView({
    threshold: 0.5,
  });
  const { setEmployer, employer } = useContext(EmployerContext);
  const employerId = employer?._id;
  const employerPhoneNo = employer?.phoneNo;
  const { data: globalData } = useGetGlobalEmployerData();
  const companyType = employer?.companyType;

  const {
    data: companyData,
    status: companyDataStatus,
    refetch: companyDataRefetch,
    isFetching: isCompanyDataLoading,
  } = useGetCompanyDetailsByDocumentNo({
    documentNumber,
    documentType,
  });

  const {
    mutateAsync: updateEmployerStatusMutation,
    status: updateEmployerStatus,
    error: updateEmployerStatusErr,
  } = usePutUpdateEmployerStatus(employerId);

  const { generateEmployerPayload, validateFields } = useVerifyEmployer({
    employerData,
    setEmployerData,
    setErrors,
    employerPhoneNo,
    companyDataRefetch,
    documentNumber,
    documentType,
  });

  const getRegistrationType = (companyType) => {
    return registrationTypeMap[companyType] || "";
  };
  useEffect(() => {
    router.prefetch("/jobs");
    if (!isEmpty(employer) && !isPrefilled) {
      const getDocumentInfo = (employer) => {
        const documents = ["CIN", "GSTIN", "PAN", "LLPIN", "AADHAAR"];
        for (const docType of documents) {
          if (employer[docType]?.number) {
            return {
              number: employer[docType].number,
              type: docType,
            };
          }
        }
        return { number: "", type: "" };
      };

      const docInfo = getDocumentInfo(employer);

      const prefillData = {
        ...ACCOUNT_FORM_DETAILS,
        companyName:
          employer.companyRegisteredName || employer.companyName || "",
        brandName: employer.brandName || "",
        workEmail: employer.workEmail || "",
        title: employer.nameTitle
          ? `${employer.nameTitle.charAt(0)}${employer.nameTitle
              .slice(1)
              .toLowerCase()}.`
          : "Mr.",
        firstName: employer.firstName || "",
        lastName: employer.lastName || "",
        employersAgencyType: employer.employersAgencyType || "",
        // registrationType: employer.companyType || '',
        registrationType: getRegistrationType(employer.companyType) || "",
        CIN: employer.CIN?.number || "",
        GSTIN: employer.GST?.number || employer.GSTIN?.number || "",
        PAN: employer.PAN?.number || "",
        LLPIN: employer.LLPIN?.number || "",
        AADHAAR: employer.AADHAAR?.number || "",
        CINUrl: employer.CIN?.url || "",
        GSTINUrl: employer.GST?.url || employer.GSTIN?.url || "",
        PANUrl: employer.PAN?.url || "",
        LLPINUrl: employer.LLPIN?.url || "",
        AADHAARUrl: employer.AADHAAR?.url || "",
        companyLogoUrl: employer.companyLogoUrl || "",
      };

      setEmployerData(prefillData);

      if (employer.companyLogoUrl) {
        setLogoUrl(employer.companyLogoUrl);
      }

      if (docInfo.number && docInfo.type) {
        setDocumentNumber(docInfo.number);
        setDocumentType(docInfo.type);
      }
      setIsPrefilled(!isPrefilled);
    }
  }, [employer, isPrefilled]);

  // useEffect(() => {
  //   if (employer?.verificationStatus === "VERIFIED") {
  //     router.push("/jobs");
  //   }
  // }, [employer?.verificationStatus]);

  useEffect(() => {
    if (employer?.companyRegisteredName) {
      setEmployerData((prev) => ({
        ...prev,
        companyName: employer.companyRegisteredName || "",
        employersAgencyType: employer.employersAgencyType || "",
      }));
    }
  }, [employer]);

  useEffect(() => {
    if (companyDataStatus === "success") {
      setEmployerData((prev) => ({
        ...prev,
      }));
      setInfo((prevInfo) => ({
        ...prevInfo,
        [documentType]: companyData?.[documentType.toLowerCase()]
          ? `Name as per document is "${companyData?.companyName}"`
          : prevInfo[documentType],
      }));
    }
  }, [companyDataStatus, companyData]);

  useEffect(() => {
    setEmployerData((prev) => ({
      ...prev,
      companyLogoUrl: logoUrl,
    }));
  }, [logoUrl]);

  useEffect(() => {
    if (updateEmployerStatus === "success") {
      setErrors({});
      enqueueSnackbar("Account details submitted successfully", {
        variant: "success",
      });
      router.push("/jobs");
    } else if (updateEmployerStatus === "error") {
      if (updateEmployerStatusErr?.response?.data?.error?.message) {
        enqueueSnackbar(
          updateEmployerStatusErr?.response?.data?.error?.message,
          {
            variant: "error",
          }
        );
      } else {
        enqueueSnackbar("Failed to verify account", {
          variant: "error",
        });
      }
    }
  }, [updateEmployerStatus]);

  const handleCreateEmployer = async () => {
    const isValidData = await validateFields(employerData, setErrors);
    if (isValidData) {
      const payload = generateEmployerPayload(employerData);
      updateEmployerStatusMutation(payload).then((res) => {
        setEmployer((prev) => ({
          ...prev,
          ...res,
        }));
      });
    } else if (!isValidData) {
      enqueueSnackbar(`Some fields are invalid. Please check and try again.`, {
        variant: "error",
      });
    }
  };

  const renderHeaderTitle = (verificationStatus) => {
    return verificationStatus === "NOT_INITIATED"
      ? "Almost there! Please verify your account."
      : "Business Details";
  };

  const renderFooterCta = () => {
    return (
      <div className="flex items-center gap-8">
        <p
          className="text-[#000000] text-[16px] font-semibold underline cursor-pointer"
          onClick={() => router.back()}
        >
          Cancel
        </p>
        <div className=" w-full md:w-[140px]">
          <CustomCTA
            onClickFn={handleCreateEmployer}
            title={"Save details"}
            fontSize={"16px"}
            color={"#FFF"}
            bgColor={"#141482"}
            border={"1px solid #CDD4DF"}
            borderRadius="10px"
            loading={updateEmployerStatus === "pending"}
            disabled={
              !employerData?.companyName ||
              !employerData?.registrationType ||
              !employerData?.workEmail ||
              isCompanyDataLoading
            }
            width={"100%"}
          />
        </div>
      </div>
    );
  };

  const companyRegistrationType = employerData?.registrationType;
  return (
    <div className="md:ml-[260px] mt-[78px] min-h-screen flex flex-col">
      <div className="md:hidden bg-white w-full h-15 top-[-60px] px-4 flex items-center gap-[10px]">
        <Svg
          icon={<BackIcon />}
          width="24"
          height="24"
          viewBox="0 0 24 24"
          onClick={() => router.back()}
        />
        <h1 className="text-black">
          {renderHeaderTitle(employer?.verificationStatus)}
        </h1>
      </div>
      <div className="md:px-5 md:py-5 md:bg-transparent p-4 bg-white">
        <div className="hidden md:flex flex-col">
          <div className="flex h-[54px] items-center">
            <button
              className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg bg-white"
              onClick={() => router.back()}
            >
              <BackIcon />
            </button>
          </div>
          <h1 className="text-[24px] font-semibold text-black my-2">
            {renderHeaderTitle(employer?.verificationStatus)}
          </h1>
        </div>
        <div className="flex flex-col gap-5">
          <RegistrationTypeForm
            data={employerData}
            setData={setEmployerData}
            errors={errors}
            setErrors={setErrors}
            employerPhoneNo={employerPhoneNo}
            companyType={companyType}
          />
          <BasicDetailsForm
            data={employerData}
            setData={setEmployerData}
            errors={errors}
            setErrors={setErrors}
            logoUrl={logoUrl}
            setLogoUrl={setLogoUrl}
            employerId={employerId}
          />
          <BusinessDetailsForm
            data={employerData}
            setData={setEmployerData}
            errors={errors}
            setErrors={setErrors}
            globalData={globalData}
            info={info}
            setInfo={setInfo}
            companyData={companyData}
            documentNumber={documentNumber}
            setDocumentNumber={setDocumentNumber}
            documentType={documentType}
            setDocumentType={setDocumentType}
            isCompanyDataLoading={isCompanyDataLoading}
            companyRegistrationType={companyRegistrationType}
            employerId={employerId}
            isTryAgain={isTryAgain}
          />
        </div>
        <div className="pt-2">
          <label className="text-sm text-[#586276] mt-2 w-content">
            <span className="text-red-500">* </span>
            Indicates a required field
          </label>
          <div ref={ctaRef} className="w-full flex md:mt-3 mt-8 justify-end">
            {renderFooterCta()}
          </div>
        </div>
      </div>
      {!isCtaInView ? (
        <div className="w-full fixed bottom-0 bg-white flex md:hidden mt-3 justify-end px-4 py-2">
          {renderFooterCta()}
        </div>
      ) : null}
    </div>
  );
}
