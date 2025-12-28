"use client";
import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { CircularProgress } from "@mui/material";

import { MAX_LENGTHS } from "@/constants";
import { REPLACE_PATTERNS } from "@/constants/regex";
import BusinessDocumentUpload from "./BusinessDocumentUpload";

import FieldDropdown from "../../_components/FieldDropdown";
import FieldInput from "../../_components/FieldInput";
import { EmployerContext } from "@/providers/EmployerProvider";

const BusinessDetailsForm = ({
  data,
  setData,
  errors,
  setErrors,
  info,
  setInfo,
  globalData,
  documentNumber,
  setDocumentNumber,
  documentType,
  setDocumentType,
  companyData,
  isCompanyDataLoading,
  companyRegistrationType,
  employerId,
  isTryAgain,
}) => {
  const [availableDocumentTypes, setAvailableDocumentTypes] = useState([]);
  const [selectedDocumentType, setSelectedDocumentType] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isInitialized, setIsInitialized] = useState(false);
  const fieldConfig = globalData?.metaData?.COMPANY_TYPE_FIELD_CONFIG;
  const { employer, setEmployer } = useContext(EmployerContext);

  const findPrefilledDocumentType = (data, availableTypes) => {
    for (const docType of availableTypes) {
      if (data?.[docType.value]) {
        return docType.value;
      }
    }
    return null;
  };

  useEffect(() => {
    if (
      companyRegistrationType &&
      companyRegistrationType !== "Select" &&
      fieldConfig
    ) {
      const fields = fieldConfig[companyRegistrationType] || [];
      const documentTypeOptions = fields.map((field) => ({
        label: field.fieldHeader,
        value: field.fieldKey,
      }));
      setAvailableDocumentTypes(documentTypeOptions);

      if (!isInitialized && documentTypeOptions.length > 0) {
        const prefilledDocType = findPrefilledDocumentType(
          data,
          documentTypeOptions
        );

        if (prefilledDocType) {
          setSelectedDocumentType(prefilledDocType);
          setInputValue(data[prefilledDocType] || "");

          const maxLength = MAX_LENGTHS[prefilledDocType];
          const trimmedValue = (data[prefilledDocType] || "").replace(
            /\s/g,
            ""
          );

          if (trimmedValue.length === maxLength) {
            setDocumentNumber(data[prefilledDocType]);
            setDocumentType(prefilledDocType);
          }
        }
        setIsInitialized(true);
      }
    } else {
      setAvailableDocumentTypes([]);
      setIsInitialized(false);
    }
  }, [companyRegistrationType, fieldConfig, data, isInitialized]);

  useEffect(() => {
    if (selectedDocumentType && !isInitialized) {
      setInputValue(data?.[selectedDocumentType] || "");
      setDocumentNumber("");
      setDocumentType("");
    }
  }, [selectedDocumentType, data, isInitialized]);

  useEffect(() => {
    if (selectedDocumentType && inputValue) {
      const maxLength = MAX_LENGTHS[selectedDocumentType];
      const trimmedValue = inputValue.replace(/\s/g, "");

      if (trimmedValue.length === maxLength) {
        setDocumentType(selectedDocumentType);
        setDocumentNumber(inputValue);
      } else {
        setDocumentType("");
        setDocumentNumber("");
      }
    }
  }, [selectedDocumentType, inputValue]);

  useEffect(() => {
    if (isCompanyDataLoading && documentType) {
      setInfo((prevInfo) => ({
        ...prevInfo,
        [documentType]: <CircularProgress size={10} />,
      }));
    } else if (!isCompanyDataLoading) {
      setInfo((prevInfo) => ({
        ...prevInfo,
        [documentType]: null,
      }));
    }
  }, [isCompanyDataLoading, documentType]);

  const handleDocumentTypeChange = (value) => {
    // if (selectedDocumentType) {
    //   if (!isTryAgain) {
    //     setData((prev) => {
    //       const updatedData = { ...prev };
    //       // delete updatedData[selectedDocumentType];
    //       // delete updatedData[`${selectedDocumentType}Url`];
    //       return updatedData;
    //     });
    //   }
    // }

    setSelectedDocumentType(value);

    if (data[value]) {
      setInputValue(data[value]);
      setDocumentNumber(data[value]);
      setDocumentType(value);
    } else {
      setDocumentNumber("");
      setDocumentType("");
      setInputValue("");
    }
    setInfo({});
    setErrors({});
  };

  const handleInputChange = (e) => {
    if (!selectedDocumentType) return;

    const { value } = e.target | e;
    let validValue = value || e || "";
    let infoMessage = null;

    // Apply validation based on document type
    switch (selectedDocumentType) {
      case "CIN":
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHANUMERIC, "");
        if (validValue.length > MAX_LENGTHS.CIN) {
          validValue = validValue.slice(0, MAX_LENGTHS.CIN);
        }
        break;
      case "PAN":
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHANUMERIC, "");
        if (validValue.length > MAX_LENGTHS.PAN) {
          validValue = validValue.slice(0, MAX_LENGTHS.PAN);
        }
        break;
      case "LLPIN":
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHANUMERIC, "");
        if (validValue.length > 3) {
          validValue = `${validValue.slice(0, 3)}-${validValue.slice(3)}`;
        }
        if (validValue.length > MAX_LENGTHS.LLPIN) {
          validValue = validValue.slice(0, MAX_LENGTHS.LLPIN);
        }
        validValue = validValue.toUpperCase();
        break;
      case "GSTIN":
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHANUMERIC, "");
        if (validValue.length > MAX_LENGTHS.GSTIN) {
          validValue = validValue.slice(0, MAX_LENGTHS.GSTIN);
        }
        break;
      case "AADHAAR":
        validValue = validValue
          .replace(REPLACE_PATTERNS.NON_DIGITS, "")
          .slice(0, MAX_LENGTHS[selectedDocumentType]);
        validValue = validValue.replace(REPLACE_PATTERNS.AADHAAR_FORMAT, "$1 "); // Format Aadhaar as 4-4-4
        break;
      default:
        validValue = value;
        break;
    }

    setInputValue(validValue);
    setData((prev) => ({
      ...prev,
      [selectedDocumentType]: validValue,
    }));

    if (infoMessage) {
      setInfo((prevInfo) => ({
        ...prevInfo,
        [selectedDocumentType]: infoMessage,
      }));
    } else {
      setInfo((prevInfo) => ({
        ...prevInfo,
        [selectedDocumentType]: null,
      }));
    }
  };

  const getInputDetails = () => {
    if (!selectedDocumentType || !fieldConfig || !companyRegistrationType) {
      return {
        placeholder: "Select a document type first",
        label: "Document Number",
      };
    }

    const fields = fieldConfig[companyRegistrationType] || [];
    const selectedField = fields.find(
      (field) => field.fieldKey === selectedDocumentType
    );

    return {
      placeholder:
        selectedField?.fieldPlaceholder || `Enter ${selectedDocumentType}`,
      label: selectedField?.fieldHeader || "Document Number",
    };
  };

  const inputDetails = getInputDetails();

  const getUrlError = () => {
    if (!selectedDocumentType) return null;
    const urlKey = `${selectedDocumentType}Url`;
    return errors?.[urlKey];
  };

  if (!companyRegistrationType) return null;

  return (
    <div className="flex flex-col items-start rounded-lg border border-[#eee] bg-white p-3 md:p-5">
      <h2 className="text-lg font-semibold mb-4 text-[#000] font-poppins">
        Business Proof
      </h2>
      <div className="mt-4 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FieldDropdown
            isRequired
            label="Business ID Document"
            options={availableDocumentTypes}
            defaultValue="Select document type"
            value={selectedDocumentType || "Select document type"}
            className="w-full text-[#000]"
            isError={errors?.documentType}
            errorText="Document type is required"
            handleChange={handleDocumentTypeChange}
            inputBg={"#FFF"}
            disabled={availableDocumentTypes.length === 0}
          />

          {(selectedDocumentType || companyRegistrationType) && (
            <div className="col-span-1">
              <FieldInput
                isRequired
                label={inputDetails.placeholder}
                placeholder={inputDetails.placeholder}
                value={inputValue}
                inputBg={"#FFF"}
                labelClasses={"font-semibold"}
                isError={
                  errors?.[selectedDocumentType] || errors?.documentRequired
                }
                errorText={
                  errors?.[selectedDocumentType] || errors?.documentRequired
                }
                handleChange={handleInputChange}
                className="w-full text-[#000]"
              />
              {info?.[selectedDocumentType] && (
                <div className="text-xs right-3 text-green-600">
                  {info[selectedDocumentType]}
                </div>
              )}
            </div>
          )}
          <div className="flex flex-col gap-[10px]">
            <label className="text-sm font-semibold  text-[#000]">
              Upload {selectedDocumentType}
              <span className="text-red-500"> *</span>
            </label>
            <BusinessDocumentUpload
              fieldKey={selectedDocumentType}
              fieldUrlKey={`${selectedDocumentType}Url`}
              uploadTitle="Upload file"
              data={data}
              setData={setData}
              disabled={!selectedDocumentType}
              employerId={employerId}
            />
            {getUrlError() && (
              <div className="text-xs text-red-500 mt-[-5px]">
                {getUrlError()}
              </div>
            )}
            <div className="text-xs text-[#666] mt-[-5px]">
              Supports: doc, pdf, Max size 10MB
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailsForm;
