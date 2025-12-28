"use client";
import React, { useEffect, useState } from "react";
import LocationInput from "@/components/LocationInput";
import FieldInput from "@/app/(internalLayout)/_components/FieldInput";
import CustomCTA from "@/components/CustomCTA";
import BadgeComponent from "@/components/BadgeComponent";
import MoneyBack from "@/assets/icons/account-info/MoneyBack.svg";
import { MAX_LENGTHS, YEAR_MEMBERSHIP_PRICE } from "@/constants";
import { triggerEvent } from "@/utils/events";
import { JOB_EVENTS } from "@/constants/eventEnums";
import { REPLACE_PATTERNS } from "@/constants/regex";
import { useGetCityStateByPincode } from "@/apis/queryHooks";

const AccountForm = ({
  userType,
  accountData,
  setAccountData,
  errors,
  setErrors,
  handleNavigate,
  updateEmployerStatus,
  employerSubscriptionData,
}) => {
  const [pincode, setPincode] = useState("");

  const {
    data: cityStateData,
    status: cityStateDataStatus,
    isFetching: cityStateDataFetching,
    refetch: cityStateDataRefetch,
  } = useGetCityStateByPincode(pincode);

  useEffect(() => {
    if (accountData?.pincode?.length === MAX_LENGTHS.PIN_CODE) {
      setPincode(accountData?.pincode);
      cityStateDataRefetch();
    } else {
      setAccountData((prev) => ({
        ...prev,
        city: "",
        state: "",
      }));
    }
  }, [accountData?.pincode]);

  useEffect(() => {
    if (!pincode) return;
    if (cityStateDataStatus === "success") {
      setAccountData((prev) => ({
        ...prev,
        city: cityStateData?.city || "",
        state: cityStateData?.state || "",
      }));
      setErrors((prevErrors) => ({
        ...prevErrors,
        pincode: "",
      }));
    } else if (cityStateDataStatus === "error") {
      setErrors((prevErrors) => ({
        ...prevErrors,
        pincode: "Invalid Pincode",
      }));
      setAccountData((prev) => ({
        ...prev,
        city: "",
        state: "",
      }));
    }
  }, [cityStateDataStatus, cityStateData, cityStateDataFetching]);

  const handleAddJobLocation = (newLocation) => {
    setAccountData((prevDetails) => ({
      ...prevDetails,
      location: newLocation,
    }));
    setErrors({ ...errors, location: "" });
  };

  const handleRemoveJobLocation = () => {
    setAccountData({ ...accountData, location: {} });
  };

  const handleFieldUpdate = (field, value) => {
    if (value?.length === 1) {
      triggerEvent(JOB_EVENTS?.EMPLOGIN_EMPNAME_ENTERED);
    }
    let validValue = value;
    if (field === "pincode") {
      validValue = validValue.replace(REPLACE_PATTERNS.NUMERIC, "");
      if (validValue.length > MAX_LENGTHS.PIN_CODE) {
        validValue = validValue.slice(0, MAX_LENGTHS.PIN_CODE);
      }
    }
    setAccountData((prev) => ({ ...prev, [field]: validValue }));
  };

  let isDisabled =
    accountData?.companyRegisteredName?.trim() === "" ||
    errors?.pincode ||
    !accountData?.state;
  // || Object.keys(accountData?.location)?.length === 0;

  const handleClick = () => {
    triggerEvent(JOB_EVENTS?.EMPLOGIN_MEMBERSHIPCTA_CLICK);
    handleNavigate();
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <FieldInput
          // isRequired
          label="Company Name"
          placeholder={`${
            userType == "Employer"
              ? "Enter Company Name"
              : "Enter Company name /Person Name"
          }`}
          value={accountData?.jobRole}
          handleChange={(value) =>
            handleFieldUpdate("companyRegisteredName", value)
          }
          isError={errors?.jobRole}
          errorText={errors?.jobRole}
          inputBg="#FFF"
          labelClasses="font-medium"
          className="bg-[#FFF] text-[#111]"
        />
        <FieldInput
          label="Registered Business Pincode"
          inputBg="#FFF"
          labelClasses="font-medium"
          className="bg-[#FFF] text-[#111]"
          placeholder={"Enter Registered Business Pincode"}
          handleChange={(value) => handleFieldUpdate("pincode", value)}
          value={accountData?.pincode}
          isError={errors?.pincode}
          errorText={errors?.pincode}
        />
      </div>
      <div className="text-xs text-[#32B237] font-medium -mt-2">
        {accountData?.city ? (
          <div>
            {accountData?.city}
            {accountData?.state ? `, ${accountData?.state}` : null}
          </div>
        ) : null}
      </div>

      {/* <div className="flex flex-col gap-[10px] mb-[20px]">
        <label className="text-sm font-medium text-[#111]">
          City
        </label>
        <LocationInput
          onLocationSelect={handleAddJobLocation}
          onLocationRemove={handleRemoveJobLocation}
          locationData={accountData?.location}
          error={errors?.location}
          isMandatory={false}
          inputBg="#FFF"
          placeholder="Enter City"
        // isDisabled={isFieldDisabled}
        />
      </div> */}
      <CustomCTA
        title={"Create Account"}
        onClickFn={handleClick}
        loading={
          updateEmployerStatus === "pending" ||
          updateEmployerStatus === "success"
        }
        disabled={isDisabled}
        fontSize="16px"
        fontWeight="400"
        width="100%"
        borderRadius="8px"
      />
    </div>
  );
};

export default AccountForm;
