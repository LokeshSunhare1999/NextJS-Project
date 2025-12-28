import React from "react";
import { PRIVACY_POLICY_LINK, TNC_LINK } from "@/constants";
import { triggerEvent } from "@/utils/events";
import { JOB_EVENTS } from "@/constants/eventEnums";
import { isValidMobileNo } from "@/utils/helpers";

export default function AuthComponent({
  handleSignIn,
  phoneNumber,
  setPhoneNumber,
  title,
  description,
  phoneError = "",
  inputLabel = "",
  instructionsMsg,
  className,
  buttonTitle,
  handleForgetPassword,
  showRememberMe = false,
  showForgetPassword = false,
  showNumberFiled = false,
  showPassword = false,
  showConfirmPassword = false,
  btnDisabled = true,
  emailDisabled = false,
  isBtnLoading = false,
  showTnc = false,
}) {
  const handlePhoneNumber = (value) => {
    if (!isValidMobileNo(value)) return;
    if (value?.length === 10) {
      triggerEvent(JOB_EVENTS?.EMPLOGIN_PHNNUM_ENTERED, {
        phone_number: value,
      });
    }
    setPhoneNumber(value);
  };

  const handleTAndCClick = () => {
    window.open(TNC_LINK);
    triggerEvent(JOB_EVENTS?.EMPLOGIN_TANDC_CLICK);
  };
  const handlePrivacyPolicyClick = () => {
    window.open(PRIVACY_POLICY_LINK);
    triggerEvent(JOB_EVENTS?.EMPLOGIN_PRIVPOLICY_CLICK);
  };

  const handleSubmit = (e) => {
    handleSignIn(e);
    triggerEvent(JOB_EVENTS?.EMPLOGIN_SENDOTP_CLICK);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`${className} flex w-full h-[450px] flex-col items-center justify-center bg-white md:p-16 p-8 rounded-[20px]`}
    >
      <div className="flex w-full flex-col ">
        <span className="mb-8 text-[28px] font-semibold leading-[32px] tracking-[-0.01em] text-[#000]">
          {title}
        </span>
        {/* <span className="mb-8 text-[18px] leading-[28px] text-[#646464] font-medium">
          {description}
        </span> */}
        <div className="flex w-full flex-col gap-5">
          {inputLabel && (
            <div className="text-[#111] text-sm font-medium mb-[-10px] capitalize leading-none">
              {inputLabel}
            </div>
          )}
          {showNumberFiled ? (
            <div className="relative w-full">
              <input
                value={phoneNumber}
                onChange={(e) => handlePhoneNumber(e.target.value)}
                type="number"
                placeholder="Enter Contact Number"
                className={`rounded-lg w-full border-[1px] px-[60px] text-sm  focus:outline-0 h-[52px] text-[#000000] placeholder:text-[14px] placeholder:font-normal placeholder:text-[#A6A6A6] ${
                  phoneError ? "border-[#FF4747]" : "border-[#A6A6A6]"
                } focus:border-[2px] focus:border-[#111]`}
              />
              <div className="absolute top-[12px] left-[16px] flex gap-1 items-center bg-gray-200 py-1 pl-1 pr-2 rounded-md">
                {/* <Svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 20"
                  icon={<TelephoneIcon />}
                /> */}
                <span className="text-sm text-[#454545]">+91</span>
              </div>
              {phoneError && (
                <span className="text-[#FF4747] text-sm mt-[-10px]">
                  {phoneError}
                </span>
              )}
            </div>
          ) : null}
          {showForgetPassword ? (
            <div className="flex flex-row items-center justify-between">
              <div className="flex flex-row items-center gap-[10px]">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  value="rememberMe"
                  className="h-7 w-7 border-[1.6px] border-[#5C5C5C]"
                />
                <label
                  htmlFor="rememberMe"
                  className="text-[16px] font-medium leading-[28px] text-[#646464]"
                >
                  Keep me logged in
                </label>
              </div>
              <span
                onClick={handleForgetPassword}
                className="cursor-pointer text-right text-[16px] font-semibold leading-[24px] text-[#141482] underline"
              >
                Forgot Password?
              </span>
            </div>
          ) : null}
          <button
            type="submit"
            className={`flex h-[54px] w-full flex-row items-center justify-center rounded-[10px] bg-[#20247E] text-[18px] font-semibold leading-[28px] tracking-[-0.01em] text-white ${
              btnDisabled ? "cursor-not-allowed bg-[#BAC8D3]" : "cursor-pointer"
            }`}
            disabled={btnDisabled}
          >
            {isBtnLoading ? (
              <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-white" />
            ) : (
              buttonTitle
            )}
          </button>
          {showTnc ? (
            <div className="w-full text-[14px] leading-[21px] text-[#666] text-center mt-2">
              By continuing you agree to{" "}
              <span
                onClick={() => handleTAndCClick()}
                className="cursor-pointer underline"
              >
                T&C
              </span>{" "}
              and{" "}
              <span
                onClick={() => handlePrivacyPolicyClick()}
                className="cursor-pointer underline"
              >
                Privacy Policy
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </form>
  );
}
