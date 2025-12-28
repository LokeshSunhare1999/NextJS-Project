"use client";
import React, { useEffect } from "react";
import {
  DIRECT_EMPLOYER,
  EMPLOYER_TYPE_OPTIONS,
  TITLE_OPTIONS,
} from "@/constants";

import LogoUpload from "./LogoUpload";
import { REPLACE_PATTERNS } from "@/constants/regex";
import { Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import FieldDropdown from "../../_components/FieldDropdown";
import FieldInput from "../../_components/FieldInput";

const BasicDetailsForm = ({
  data,
  setData,
  errors,
  logoUrl,
  setLogoUrl,
  employerId,
}) => {
  useEffect(() => {
    if (!data?.title) {
      setData((prev) => ({
        ...prev,
        title: "Mr.",
      }));
    }
  }, []);

  const handleChange = (e, field) => {
    let validValue = e || "";

    if (!!e?.target?.value) {
      validValue = e.target.value || "";
    }

    switch (field) {
      case "firstName":
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHABETS, "");
        break;
      case "lastName":
        validValue = validValue.replace(
          REPLACE_PATTERNS.ALPHABETS_NO_SPACE,
          ""
        );
        break;
      case "brandName":
      case "companyName":
        validValue = validValue.replace(
          REPLACE_PATTERNS.ALPHANUMERIC_WITH_PUNCTUATION,
          ""
        );
        break;
      case "companySize":
        validValue = validValue.replace(REPLACE_PATTERNS.NUMERIC, "");
        break;
      default:
        break;
    }

    setData((prev) => ({
      ...prev,
      [field]: validValue,
    }));
  };

  return (
    <div className="rounded-lg bg-white border border-[#eee] p-3 md:p-5">
      <div className="flex flex-col">
        <div className="flex flex-col gap-5">
          <span className="text-lg font-medium text-[#000]">Basic Details</span>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FieldInput
              disabled
              label="Company Legal Name"
              placeholder="Enter Company Name"
              className="basis-1/3 text-[#000]"
              value={data?.companyName}
              isError={errors?.companyName}
              errorText="Company name is required"
              inputBg={"#FFF"}
              labelClasses={"font-semibold"}
              handleChange={(e) => handleChange(e, "companyName")}
            />

            <LogoUpload
              initialIcon={logoUrl}
              loadingIcon={
                <Spin
                  indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
                />
              }
              setImage={setLogoUrl}
              imageUrl={logoUrl}
              maxFileSizeInMB={5}
              employerId={employerId}
            />

            <FieldInput
              label="Brand Name"
              placeholder="Enter brand Name"
              className="basis-1/3 text-[#000]"
              value={data?.brandName}
              isError={errors?.brandName}
              errorText="Brand name is required"
              inputBg={"#FFF"}
              labelClasses={"font-semibold"}
              isInfo={true}
              infoText={
                "Enter the name Job seekers know your business by. It can be different from your legal name"
              }
              handleChange={(e) => handleChange(e, "brandName")}
            />

            <FieldInput
              isRequired
              label="Work Email"
              placeholder="Enter work email"
              className="basis-[50%] text-[#000]"
              value={data?.workEmail}
              isError={errors?.workEmail}
              errorText="Enter valid work email"
              inputBg={"#FFF"}
              labelClasses={"font-semibold"}
              isInfo={true}
              infoText={
                "Use your official company email. This will be used for all communications"
              }
              handleChange={(e) => handleChange(e, "workEmail")}
            />

            <div className="col-span-1">
              <FieldDropdown
                isRequired
                label="Employer Type"
                options={EMPLOYER_TYPE_OPTIONS}
                defaultValue={DIRECT_EMPLOYER}
                value={data?.employersAgencyType || "Select employer type"}
                className="w-full"
                isError={errors?.employerType}
                errorText="Employer type is required"
                handleChange={(e) => handleChange(e, "employersAgencyType")}
                inputBg={"#FFF"}
              />
            </div>
            <div className="col-span-1"></div>

            <div className="flex gap-4">
              <FieldDropdown
                label="Title"
                options={TITLE_OPTIONS}
                defaultValue={TITLE_OPTIONS[0]?.value}
                className="w-[100px] text-[#000]"
                inputBg={"#FFF"}
                handleChange={(e) => handleChange(e, "title")}
              />
              <div className="flex-1">
                <FieldInput
                  label="First Name"
                  placeholder="Enter user first name"
                  className="basis-[45%] text-[#000]"
                  isError={errors?.firstName}
                  errorText="Please enter valid name within 30 characters"
                  value={data?.firstName}
                  inputBg={"#FFF"}
                  labelClasses={"font-semibold"}
                  handleChange={(e) => handleChange(e, "firstName")}
                />
              </div>
            </div>
            <FieldInput
              label="Last Name"
              placeholder="Enter user last name"
              className="basis-[55%] text-[#000]"
              value={data?.lastName}
              isError={errors?.lastName}
              errorText="Please enter valid name within 30 characters"
              inputBg={"#FFF"}
              labelClasses={"font-semibold"}
              handleChange={(e) => handleChange(e, "lastName")}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BasicDetailsForm;
