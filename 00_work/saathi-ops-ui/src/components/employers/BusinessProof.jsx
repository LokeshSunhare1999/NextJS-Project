import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DrawerInput from '../common/DrawerInput';
import { EMP_REG_TYPE } from '../../constants/details';
import { MAX_LENGTHS } from '../../constants';
import { REPLACE_PATTERNS } from '../../constants/regex';
import { CircularProgress } from '@mui/material';
import BusinessDocumentUpload from './BusinessDocumentUpload';
import { DOMAIN_MAX_LENGTH } from '../../constants/employer';

const CustomerWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 98%;
  align-items: flex-start;
  border-radius: 10px;
  background-color: #fff;
  padding: 16px;
  margin-top: 15px;
`;

const ContentSection = styled.div`
  width: 99%;
  padding: 8px;
`;

const StyledHeader = styled.h2`
  font-size: 18px;
  font-family: 'Poppins', sans-serif;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
`;

const InputSection = styled.div`
  margin-top: 15px;
  width: 100%;
`;

const FlexContainer = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  gap: 20px;
  align-items: flex-start;
  justify-content: flex-start;
  margin-top: ${({ $marginTop }) => $marginTop || '0px'};
`;

const StyledDrawerInputContainer = styled.div`
  flex-basis: 50%;
  display: flex;
  flex-direction: column;
`;

const InputFieldWrapper = styled.div`
  width: 100%;
`;

const UploadButtonWrapper = styled.div`
  margin-top: 8px;
`;

const BusinessProof = ({
  data,
  setData,
  errors,
  setErrors,
  info,
  setInfo,
  globalData,
  handleBlur,
  checkDomainData,
  isCheckDomainDataLoading,
  checkDomainDataError,
  domain,
  documentNumber,
  setDocumentNumber,
  documentType,
  setDocumentType,
  companyData,
  isCompanyDataLoading,
}) => {
  const [typeOpen, setTypeOpen] = useState(false);
  const [type, setType] = useState(data?.registrationType || 'Select');
  const fieldConfig = globalData?.metaData?.COMPANY_TYPE_FIELD_CONFIG;

  useEffect(() => {
    if (data?.GSTIN?.length === MAX_LENGTHS?.GSTIN) {
      setDocumentType('GSTIN');
      setDocumentNumber(data?.GSTIN);
    }
  }, [data?.GSTIN]);

  useEffect(() => {
    if (data?.PAN?.length === MAX_LENGTHS?.PAN) {
      setDocumentType('PAN');
      setDocumentNumber(data?.PAN);
    }
  }, [data?.PAN]);

  useEffect(() => {
    if (data?.CIN?.length === MAX_LENGTHS?.CIN) {
      setDocumentType('CIN');
      setDocumentNumber(data?.CIN);
    }
  }, [data?.CIN]);

  useEffect(() => {
    if (data?.LLPIN?.length === MAX_LENGTHS?.LLPIN) {
      setDocumentType('LLPIN');
      setDocumentNumber(data?.LLPIN);
    }
  }, [data?.LLPIN]);

  useEffect(() => {
    if (data?.registrationType) {
      setType(data?.registrationType);
    }
  }, [data?.registrationType]);

  useEffect(() => {
    if (!domain?.trim()) {
      setErrors((prev) => ({
        ...prev,
        companyWebsiteURL: '',
      }));
      return;
    }
    if (domain?.length > DOMAIN_MAX_LENGTH) {
      setErrors((prev) => ({
        ...prev,
        companyWebsiteURL: `Please enter valid url within ${DOMAIN_MAX_LENGTH} characters`,
      }));
      return;
    }

    if (!isCheckDomainDataLoading && checkDomainData) {
      setErrors((prev) => ({
        ...prev,
        companyWebsiteURL:
          checkDomainData.isValid === 'false'
            ? 'Invalid website. Please enter a valid URL.'
            : '',
      }));
    } else if (checkDomainDataError) {
      setErrors((prev) => ({
        ...prev,
        companyWebsiteURL: 'Invalid website. Please enter a valid URL.',
      }));
    }
  }, [domain, checkDomainData, isCheckDomainDataLoading]);

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

  const handleChange = (e, field) => {
    const { value } = e.target;
    let validValue = value || '';
    let infoMessage = null;

    switch (field) {
      case 'CIN':
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHANUMERIC, '');
        if (validValue.length > MAX_LENGTHS.CIN) {
          validValue = validValue.slice(0, MAX_LENGTHS.CIN);
        }
        break;
      case 'PAN':
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHANUMERIC, '');
        if (validValue.length > MAX_LENGTHS.PAN) {
          validValue = validValue.slice(0, MAX_LENGTHS.PAN);
        }
        break;

      case 'LLPIN':
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHANUMERIC, '');
        if (validValue.length > 3) {
          validValue = `${validValue.slice(0, 3)}-${validValue.slice(3)}`;
        }
        if (validValue.length > MAX_LENGTHS.LLPIN) {
          validValue = validValue.slice(0, MAX_LENGTHS.LLPIN);
        }

        validValue = validValue.toUpperCase();
        break;

      case 'GSTIN':
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHANUMERIC, '');
        if (validValue.length > MAX_LENGTHS.GSTIN) {
          validValue = validValue.slice(0, MAX_LENGTHS.GSTIN);
        }
        break;

      case 'AADHAAR':
        validValue = validValue
          .replace(REPLACE_PATTERNS.NON_DIGITS, '')
          .slice(0, MAX_LENGTHS[field]);

        validValue = validValue.replace(REPLACE_PATTERNS.AADHAAR_FORMAT, '$1 '); // Format Aadhaar as 4-4-4
        break;

      default:
        validValue = value;
        break;
    }

    setData((prev) => ({
      ...prev,
      [field]: validValue,
    }));

    if (infoMessage) {
      setInfo((prevInfo) => ({
        ...prevInfo,
        [field]: infoMessage,
      }));
    } else {
      setInfo((prevInfo) => ({
        ...prevInfo,
        [field]: null,
      }));
    }
  };

  const handleTypeSelect = (value) => {
    const currentFields = fieldConfig?.[value] || [];
    const currentFieldKeys = currentFields.map((field) => field.fieldKey);

    const previousFields = fieldConfig?.[type] || [];
    const previousFieldKeys = previousFields.map((field) => field.fieldKey);

    setType(value);
    setData((prev) => ({
      ...prev,
      registrationType: value,
    }));
    setTypeOpen(false);

    previousFieldKeys.forEach((fieldKey) => {
      if (!currentFieldKeys.includes(fieldKey)) {
        setData((prev) => ({
          ...prev,
          [fieldKey]: '',
        }));
        setErrors((prev) => ({
          ...prev,
          [fieldKey]: '',
        }));
      }
    });
  };

  const getFormFieldsForType = (type) => {
    const fields = fieldConfig?.[type] || [];

    return fields?.map((field) => {
      return (
        <StyledDrawerInputContainer key={field.fieldKey}>
          {/* Input Field */}
          <InputFieldWrapper>
            <DrawerInput
              fieldType="input"
              fieldHeader={field.fieldHeader}
              fieldValue={data?.[field.fieldKey]}
              handleFieldChange={(e) => handleChange(e, field.fieldKey)}
              fieldPlaceholder={field.fieldPlaceholder}
              fieldError={errors?.[field.fieldKey]}
              errorText={errors?.[field.fieldKey]}
              infoTagText={data?.[field.fieldKey] && info?.[field.fieldKey]}
              infoTag={info?.[field.fieldKey]}
            />
          </InputFieldWrapper>

          {/* Document Upload */}
          <UploadButtonWrapper>
            <BusinessDocumentUpload
              fieldKey={field.fieldKey}
              fieldUrlKey={`${field.fieldKey}Url`}
              uploadTitle="Upload"
              data={data}
              setData={setData}
            />
          </UploadButtonWrapper>
        </StyledDrawerInputContainer>
      );
    });
  };

  const fieldRows = getFormFieldsForType(type);

  // Group fields into rows of 2
  const groupedRows = [];
  for (let i = 0; i < fieldRows.length; i += 2) {
    groupedRows.push(fieldRows.slice(i, i + 2));
  }

  return (
    <CustomerWrap>
      <ContentSection>
        <StyledHeader>Business Proof</StyledHeader>
        <InputSection>
          {/* Row 1 */}
          <FlexContainer>
            <StyledDrawerInputContainer>
              <DrawerInput
                fieldType="dropdown"
                fieldHeader="Registration Type"
                dropDownList={EMP_REG_TYPE}
                dropDownOpen={typeOpen}
                handleDropDownOpen={setTypeOpen}
                handleDropDownSelect={handleTypeSelect}
                fieldValue={type}
              />
            </StyledDrawerInputContainer>

            <StyledDrawerInputContainer>
              <DrawerInput
                fieldType="input"
                fieldHeader="Company Website's URL"
                fieldValue={data?.companyWebsiteURL}
                handleFieldChange={(e) => handleChange(e, 'companyWebsiteURL')}
                fieldPlaceholder="Enter company website link"
                fieldError={errors?.companyWebsiteURL}
                errorText={errors?.companyWebsiteURL}
                onBlurInput={handleBlur}
              />
            </StyledDrawerInputContainer>
          </FlexContainer>

          {/* Dynamic Rows for Document Uploads */}
          {groupedRows.map((row, rowIndex) => (
            <FlexContainer $marginTop="16px" key={rowIndex}>
              {row}
            </FlexContainer>
          ))}
        </InputSection>
      </ContentSection>
    </CustomerWrap>
  );
};

export default BusinessProof;

BusinessProof.propTypes = {
  data: PropTypes.object,
  setData: PropTypes.func,
  errors: PropTypes.object,
  setErrors: PropTypes.func,
  globalData: PropTypes.object,
  handleBlur: PropTypes.func,
  checkDomainData: PropTypes.func,
  isCheckDomainDataLoading: PropTypes.bool,
  checkDomainDataError: PropTypes.object,
  domain: PropTypes.string,
};
