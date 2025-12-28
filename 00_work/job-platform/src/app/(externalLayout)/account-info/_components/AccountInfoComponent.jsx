"use client";
import React, { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import LoginSideComponent from "@/components/LoginSideComponent";
import { EmployerContext } from "@/providers/EmployerProvider";
import SelectAccount from "./SelectAccount";
import {
  ACCOUNT_INFO,
  DIRECT_EMPLOYER,
  RECRUITMENT_AGENCY,
  YEAR_MEMBERSHIP_PRICE,
  LOGIN_BANNER_BENEFITS,
  LOGIN_BANNER_HEADER,
} from "@/constants";
import MembershipBanner from "@/components/MembershipBanner/Index";
import {
  usePutUpdateEmployerStatus,
  useGetEmployerSubscription,
} from "@/apis/queryHooks";
import { parseCookies } from "nookies";
import ExternalHeader from "@/components/ExternalHeader";
import MwebMembershipBanner from "@/components/MwebMembershipBanner";

export default function AccountInfoComponent() {
  const { enqueueSnackbar } = useSnackbar();
  const cookies = parseCookies();
  const router = useRouter();
  const [errors, setErrors] = useState({});
  const [accountData, setAccountData] = useState(ACCOUNT_INFO || {});
  const [userType, setUserType] = useState(null);
  const { setEmployer, employer } = useContext(EmployerContext);
  const employerId = employer?._id;

  // const {
  //   data: employerData,
  //   status: employerStatus,
  //   refetch: refetchEmployerData,
  // } = useGetEmployerDetails({
  //   userId: cookies?.userId,
  //   enabled: false,
  // });

  const { data: employerSubscriptionData } = useGetEmployerSubscription();

  const {
    mutateAsync: updateEmployerStatusMutation,
    status: updateEmployerStatus,
    error: updateEmployerStatusErr,
  } = usePutUpdateEmployerStatus(employerId);

  const validateForm = () => {
    const newErrors = {};
    if (!accountData?.companyRegisteredName) {
      newErrors.companyRegisteredName = "Company legal name is required.";
    }

    // if (
    //   !accountData?.location ||
    //   Object.keys(accountData?.location)?.length === 0
    // ) {
    //   newErrors.location = "Location is required.";
    // }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const getFormattedPayload = () => {
    return {
      location: accountData?.location,
      companyRegisteredName: accountData?.companyRegisteredName,
      employersAgencyType:
        userType == "Employer" ? DIRECT_EMPLOYER : RECRUITMENT_AGENCY,
      currentAddress: {
        address1: "",
        address2: "",
        pincode: accountData?.pincode,
        city: accountData?.city,
        state: accountData?.state,
      },
    };
  };

  const mapResponseToFormDetails = (data) => ({
    companyRegisteredName: data?.companyRegisteredName || "",
    location: data?.location ? data?.location : {},
    pincode: data?.pincode || "",
    city: data?.city || "",
    state: data?.state || "",
  });

  useEffect(() => {
    router.prefetch("/account-setup");
    if (accountData) {
      const preFilledJobData = mapResponseToFormDetails(accountData);
      setAccountData(preFilledJobData);
    }
  }, []);

  const handleNavigate = async () => {
    const isValid = validateForm();
    if (!isValid) {
      enqueueSnackbar("Please fill required fields", { variant: "error" });
      return;
    }
    // Call API if needed with payload
    const payload = getFormattedPayload(employerId, null);
    updateEmployerStatusMutation(payload).then((res) => {
      const subscriptionItem = employer?.subscriptionItem;
      setEmployer({
        subscriptionItem,
        ...res,
      });
      router.push("/account-setup");
    });
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-auto">
      <div className="w-full h-[650px] md:h-screen md:w-1/3 md:block md:min-w-[400px] lg:min-w-[500px] flex-shrink-0 mt-18 md:mt-0">
        <LoginSideComponent />
      </div>
      <div className="md:w-2/3 w-full relative flex h-[750px] md:min-h-screen flex-col justify-center items-center">
        <div className="top-0 w-full absolute flex items-center justify-center hidden md:block">
          <MembershipBanner
            title={LOGIN_BANNER_HEADER}
            actualPrice={employerSubscriptionData?.actualPrice}
            loginPageTexts={LOGIN_BANNER_BENEFITS}
          />
        </div>
        <div className="top-0 z-10 w-full absolute flex flex-col items-center justify-center md:hidden">
          <ExternalHeader />
          <div className="w-full md:hidden">
            <MwebMembershipBanner
              title={employerSubscriptionData?.metaData?.loginPageHeader}
              actualPrice={employerSubscriptionData?.actualPrice}
              loginPageTexts={
                employerSubscriptionData?.metaData?.loginPageTexts
              }
            />
          </div>
        </div>
        <div className="mt-[180px] md:mt-0 w-full">
          <SelectAccount
            accountData={accountData}
            setAccountData={setAccountData}
            errors={errors}
            setErrors={setErrors}
            userType={userType}
            setUserType={setUserType}
            handleNavigate={handleNavigate}
            updateEmployerStatus={updateEmployerStatus}
            employerSubscriptionData={employerSubscriptionData}
          />
        </div>
      </div>
    </div>
  );
}
