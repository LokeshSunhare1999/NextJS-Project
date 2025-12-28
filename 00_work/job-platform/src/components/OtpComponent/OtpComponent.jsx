import OtpField from "../OtpField/OtpField";
import { RESEND_OTP_TIMER } from "@/constants/index";
import useTimer from "@/hooks/useTimer";
import { useState } from "react";
import BackIcon from "@/assets/icons/common/backIcon.svg";
import Svg from "@/components/Svg";
import { triggerEvent } from "@/utils/events";
import { JOB_EVENTS } from "@/constants/eventEnums";

const OtpComponent = ({
  phoneNumber,
  otp,
  setOtp,
  buttonTitle = "",
  isLoading,
  btnDisabled,
  verifyOtp,
  sendOtp,
  isOtpSent,
  setIsOtpSent,
  otpErr,
  setOtpErr,
  verifyOtpStatus,
}) => {
  const [canResendOtp, setCanResendOtp] = useState(false);
  const currentTime = useTimer({
    initialTime: RESEND_OTP_TIMER,
    isRunning: !canResendOtp,
    onFinish: () => setCanResendOtp(true),
  });

  const handleChangeClick = () => {
    setIsOtpSent(false);
    setOtpErr("");
  };

  const handleResendOtpClick = () => {
    triggerEvent(JOB_EVENTS.EMPLOGIN_RESENDOTP_CLICK);
    setCanResendOtp(false);
    setOtpErr("");
    sendOtp();
  };

  const handleEnterBtn = () => {
    verifyOtp();
  };

  const handleOtpChange = (value) => {
    if (value.length === 4) {
      triggerEvent(JOB_EVENTS.EMPLOGIN_ENTEROTP);
    }
  };

  return (
    <div className="flex max-w-[475px] md:max-w-[540px] h-[auto] flex-col p-8 md:p-[60px] bg-white rounded-[20px]">
      <div
        className="flex gap-4 cursor-pointer align-center mb-8"
        onClick={() => {
          handleChangeClick();
        }}
      >
        <Svg
          width="32"
          height="32"
          viewBox="0 0 26 16"
          icon={<BackIcon stroke="#000" strokeWidth="1" />}
        />
        <span className="text-[28px] font-semibold cursor-pointer text-[#111]">
          OTP Verification
        </span>
      </div>
      {/* <span className="text-[34px] font-semibold mt-10 text-[#000]">
        Verify OTP
      </span> */}
      <div className="text-[14px] font-normal text-[#666]">
        Enter 4-digit OTP sent to &nbsp;
        <span className="text-[14px] font-semibold text-[#000]">
          +91 {phoneNumber}
        </span>
      </div>

      <div className="flex justify-center flex-col mx-[-8px]">
        <OtpField
          value={otp}
          setValue={setOtp}
          inputBorderColor={
            otpErr
              ? "#FF4E42"
              : "#DEDEE0" && verifyOtpStatus === "success"
              ? "#4CD964"
              : "#DEDEE0"
          }
          inputBgColor="#FFF"
          inputBorderRadius="10px"
          onEnterPress={handleEnterBtn}
          customOnChange={(value) => handleOtpChange(value)}
        />
      </div>

      {otpErr ? (
        <span className="text-sm text-[#FF4747] font-normal">{otpErr}</span>
      ) : null}

      <button
        onClick={verifyOtp}
        type="submit"
        className={`flex h-[54px] w-full mt-5 mb-8 flex-row items-center justify-center rounded-[10px] bg-[#20247E] text-[18px] font-semibold leading-[21.6px] tracking-[-0.01em] text-white ${
          btnDisabled ? "cursor-not-allowed bg-[#BAC8D3]" : "cursor-pointer"
        }`}
        disabled={btnDisabled}
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-white" />
        ) : (
          buttonTitle
        )}
      </button>

      {canResendOtp ? (
        <div className="text-[#666666] text-sm font-medium text-center">
          Did not receive the OTP yet?
          <span
            className="text-[#111111] mt-2 text-sm underline font-medium cursor-pointer ml-1"
            onClick={handleResendOtpClick}
          >
            Resend
          </span>
        </div>
      ) : (
        <div className="flex flex-row justify-center">
          <span className="mt-1 text-sm text-[#494949] font-normal text-center">
            Did not receive the OTP yet? Resend in &nbsp;
          </span>
          <span className="mt-1 text-sm text-[#111111] font-medium">
            {currentTime} sec
          </span>
        </div>
      )}
    </div>
  );
};

export default OtpComponent;
