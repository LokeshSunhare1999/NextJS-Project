"use client";
import { useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import { getOrSetLocalStorage, handleLogout } from "@/utils/helpers";
import { setCookie, parseCookies, destroyCookie } from "nookies";
import AuthComponent from "@/components/AuthComponent";
import {
  useGetEmployerDetails,
  usePostIdentity,
  usePostSendOtp,
  usePostVerifyOtp,
} from "@/apis/queryHooks";
import { COOKIES_MAX_AGE, USER_TYPE } from "@/constants";
import OtpComponent from "@/components/OtpComponent/OtpComponent";
import { EmployerContext } from "@/providers/EmployerProvider";
import { triggerEvent } from "@/utils/events";
import { JOB_EVENTS } from "@/constants/eventEnums";

const LoginClientComponent = () => {
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const uuid = getOrSetLocalStorage("uuid");
  const cookies = parseCookies();

  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [otp, setOtp] = useState("");
  const [otpErr, setOtpErr] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [guestToken, setGuestToken] = useState(cookies?.guestToken);
  const { setEmployer, employer } = useContext(EmployerContext);
  const [storedUserId, setStoredUserId] = useState(null);

  const {
    data: employerData,
    status: employerStatus,
    refetch: refetchEmployerData,
  } = useGetEmployerDetails({
    userId: storedUserId,
    enabled: !!storedUserId,
  });

  const {
    mutateAsync: postIdentityMutation,
    data: postIdentityData,
    status: postIdentityStatus,
  } = usePostIdentity();

  const {
    mutateAsync: sendOtp,
    isError: isSendOtpError,
    status: sendOtpStatus,
    error: sendOtpError,
  } = usePostSendOtp();

  const {
    mutateAsync: verifyOtp,
    isError: isVerifyOtpError,
    error: verifyOtpError,
    status: verifyOtpStatus,
    data: verifyOtpData,
  } = usePostVerifyOtp();

  useEffect(() => {
    if (cookies?.accessToken) {
      handleLogout();
    }
  }, []);

  useEffect(() => {
    if (!!storedUserId) {
      refetchEmployerData();
    }
  }, [storedUserId]);

  useEffect(() => {
    if (employerStatus === "success") {
      setEmployer(employerData);
      setCookie(null, "employerId", employerData?._id, {
        maxAge: COOKIES_MAX_AGE,
        path: "/",
      });
      const redirectUrl = sessionStorage?.getItem("redirectUrl");
      if (redirectUrl) {
        sessionStorage?.removeItem("redirectUrl");
        router.push(redirectUrl);
      } else if (!employerData?.companyRegisteredName) {
        router.push("/account-info");
      } else {
        router.push("/jobs");
      }
    }
  }, [employerStatus]);

  useEffect(() => {
    if (postIdentityStatus === "success") {
      setGuestToken(postIdentityData?.guestToken);
      setCookie(null, "guestToken", postIdentityData?.guestToken, {
        maxAge: COOKIES_MAX_AGE,
        path: "/",
      });
    }
  }, [postIdentityStatus]);

  useEffect(() => {
    if (verifyOtpStatus === "success" && verifyOtpData) {
      router.prefetch("/jobs");
      router.prefetch("/account-info");
      setEmployer(verifyOtpData);
      const newAccessToken = verifyOtpData?.identity?.accessToken;
      const userId = verifyOtpData?._id;

      setCookie(null, "accessToken", newAccessToken, {
        maxAge: COOKIES_MAX_AGE,
        path: "/",
      });
      setCookie(null, "userId", userId, {
        maxAge: COOKIES_MAX_AGE,
        path: "/",
      });
      setPhoneError("");
      // setPhoneNumber("");
      setOtpErr("");
      destroyCookie(null, "guestToken");
      setStoredUserId(userId);
    }
  }, [verifyOtpStatus, verifyOtpData]);
  const generateGuestToken = async (e) => {
    const postIdentityData = await postIdentityMutation({ macAddress: uuid });
    setGuestToken(postIdentityData?.guestToken);
    return postIdentityData?.guestToken;
  };

  const handleSendOtp = async (e) => {
    e?.preventDefault();
    if (phoneNumber.length !== 10) {
      setPhoneError("Enter a valid mobile number");
      return;
    }
    setPhoneError("");

    const generatedGuestToken = await generateGuestToken();

    sendOtp({
      phoneNo: phoneNumber,
      dialCode: "+91",
      guestToken: generatedGuestToken,
    })
      .then((response) => {
        setPhoneError("");
        setIsOtpSent(true);
        const message =
          response?.data?.error?.message || "OTP sent successfully";
        enqueueSnackbar(message, { variant: "success" });
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.message || "Some error occurred";
        enqueueSnackbar(message, { variant: "error" });
      });
  };

  const handleVerifyOtpClick = async () => {
    if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
      setOtpErr("Please enter correct OTP");
      return;
    }
    triggerEvent(JOB_EVENTS?.EMPLOGIN_SUBMITOTP_CLICK);
    verifyOtp({
      phoneNo: phoneNumber,
      otp: otp,
      dialCode: "+91",
      userType: USER_TYPE,
      guestToken,
    })
      .then((response) => {
        setEmployer(response);
      })
      .catch((err) => {
        const message =
          err?.response?.data?.error?.message || "Some error occurred";
        if (err?.response?.data?.error?.code === "INVALID_OTP") {
          triggerEvent(JOB_EVENTS?.EMPLOGIN_WRONGOTP);
        }
        setOtpErr(message);
      });
  };

  const isBtnDisabled =
    !phoneNumber ||
    postIdentityStatus === "pending" ||
    sendOtpStatus === "pending";
  const isBtnLoading =
    postIdentityStatus === "pending" || sendOtpStatus === "pending";

  return (
    <div className="mt-[120px] md:mt-0">
      {!isOtpSent ? (
        <AuthComponent
          handleSignIn={handleSendOtp}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          buttonTitle={"Send OTP"}
          title={"Sign in to your account with:"}
          inputLabel={"Contact Number"}
          description={"Hire top talent in minutes with Saathi"}
          btnDisabled={isBtnDisabled}
          isBtnLoading={isBtnLoading}
          showNumberFiled
          showRememberMe
          showTnc={true}
          phoneError={phoneError}
        />
      ) : (
        <OtpComponent
          setIsOtpSent={setIsOtpSent}
          isOtpSent={isOtpSent}
          otp={otp}
          setOtp={setOtp}
          phoneNumber={phoneNumber}
          buttonTitle={"Verify & Proceed"}
          verifyOtp={handleVerifyOtpClick}
          sendOtp={handleSendOtp}
          otpErr={otpErr}
          btnDisabled={
            !otp ||
            verifyOtpStatus === "pending" ||
            verifyOtpStatus === "success"
          }
          setOtpErr={setOtpErr}
          isLoading={verifyOtpStatus === "pending"}
          verifyOtpStatus={verifyOtpStatus}
        />
      )}
    </div>
  );
};

export default LoginClientComponent;
