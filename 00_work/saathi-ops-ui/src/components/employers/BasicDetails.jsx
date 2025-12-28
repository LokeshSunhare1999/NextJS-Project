import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DrawerInput from '../common/DrawerInput';
import { SALUTATIONS } from '../../constants/details';
import { REPLACE_PATTERNS } from '../../constants/regex';
import { EMPLOYER_TYPES } from '../../constants/job';

// Styled Components
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
  flex-direction: ${({ $flexDirection }) => $flexDirection || 'row'};
  gap: ${({ $gap }) => $gap || '8px'};
  align-items: ${({ $alignItems }) => $alignItems || 'flex-start'};
  justify-content: ${({ $justifyContent }) => $justifyContent || 'flex-start'};
  margin-top: ${({ $marginTop }) => $marginTop || '0px'};
`;

const StyledDrawerInputContainer = styled.div`
  flex-basis: ${({ $flexBasis }) => $flexBasis || '100%'};
  display: flex;
  flex-direction: column;
`;

const GridItem = styled.div`
display: flex;
flex-direction: column;
width: calc(50% - 8px);
`;

const GridItemRow = styled(GridItem)`
  flex-direction: row;
  gap: 10px;
  margin-top: 16px;
`;
const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 24px;
  height: 24px;
  border: 1px solid #dbdbdb;
  outline: none;
  border-radius: 6px;
  appearance: none;
  background-color: #fff;
  cursor: ${(props) => (props?.$isDisabled ? 'not-allowed' : 'pointer')};
  display: inline-block;
  position: relative;
  transition: background-color 0.2s ease;

  &:checked {
    background-color: #007bff;
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 5px;
    border: solid #fff;
    border-width: 0 0px 2px 2px;
    transform: translate(-50%, -60%) rotate(-47deg);
  }
`;
const StyledSpan = styled.span`
  color: ${(props) => (props?.$isDisabled ? '#808080' : '#000')};
`;

// React Component
const BasicDetails = ({ data, setData, errors, isEditMode }) => {
  const [titleOpen, setTitleOpen] = useState(false);
  const [title, setTitle] = useState(data?.title || 'Mr.');
  const [employerTypeOpen, setEmployerTypeOpen] = useState(false);

  const handleChange = (e, field) => {
    const { value } = e.target;
    let validValue = value || '';
    switch (field) {
      case 'firstName':
        validValue = validValue.replace(REPLACE_PATTERNS.ALPHABETS, '');
        break;
      case 'lastName':
        validValue = validValue.replace(
          REPLACE_PATTERNS.ALPHABETS_NO_SPACE,
          '',
        );
        break;
      case 'brandName':
        validValue = validValue.replace(
          REPLACE_PATTERNS.ALPHANUMERIC_WITH_PUNCTUATION,
          '',
        );
        break;
      case 'companySize':
        // case 'signUpPhoneNumber':
        // case 'communicationPhoneNumber':
        validValue = validValue.replace(REPLACE_PATTERNS.NUMERIC, '');
        break;
      default:
        validValue = value;
        break;
    }

    setData((prev) => ({
      ...prev,
      [field]: validValue,
    }));
  };

  useEffect(() => {
    if (data?.title) {
      setTitle(data?.title);
    }
  }, [data?.title]);

  const handleTitleSelect = (value) => {
    setTitle(value);
    setData((prev) => ({
      ...prev,
      ['title']: value,
    }));
    setTitleOpen(false);
  };

  const handleEmployerTypeSelect = (value) => {
    const typeEnum = EMPLOYER_TYPES.find(
      (employerType) => employerType.value === value,
    )?.key;
    setData((prev) => ({
      ...prev,
      employersAgencyType: typeEnum,
    }));
    setEmployerTypeOpen(false);
  };

  const getEmployerTypeValue = (key) => {
    const employerType = EMPLOYER_TYPES.find(
      (employerType) => employerType.key === key,
    );
    return employerType?.value;
  };

  const allEmployerTypes = EMPLOYER_TYPES.map((type) => type?.value) || [];

  return (
    <CustomerWrap>
      <ContentSection>
        <StyledHeader>Basic Details</StyledHeader>
        <InputSection>
          <FlexContainer $gap="10px">
            <StyledDrawerInputContainer $flexBasis="50%">
              <DrawerInput
                fieldType={'dropdown'}
                fieldHeader={'Employer Type'}
                dropDownList={allEmployerTypes}
                dropDownOpen={employerTypeOpen}
                handleDropDownOpen={setEmployerTypeOpen}
                handleDropDownSelect={handleEmployerTypeSelect}
                fieldValue={
                  getEmployerTypeValue(data?.employersAgencyType) ||
                  'Select EmployerType'
                }
              />
            </StyledDrawerInputContainer>
            <StyledDrawerInputContainer $flexBasis="50%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Work Email'}
                fieldValue={data?.workEmail}
                handleFieldChange={(e) => handleChange(e, 'workEmail')}
                fieldPlaceholder={'Enter work email'}
                isManadatory={true}
                fieldError={errors?.workEmail}
                errorText={errors?.workEmail}
              />
            </StyledDrawerInputContainer>
          </FlexContainer>
          {/* Row 1: Company Name and Work Phone */}
          <FlexContainer $gap="20px">
            <StyledDrawerInputContainer $flexBasis="50%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Company Legal Name'}
                fieldValue={data?.companyName}
                handleFieldChange={(e) => handleChange(e, 'companyName')}
                fieldPlaceholder={'Enter registered company name'}
                isManadatory={true}
                fieldError={errors?.companyName}
                errorText={errors?.companyName}
              />
            </StyledDrawerInputContainer>
            <StyledDrawerInputContainer $flexBasis="50%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Work Phone'}
                fieldValue={data?.workPhone}
                handleFieldChange={(e) => handleChange(e, 'workPhone')}
                fieldPlaceholder={'Enter work phone number'}
                isManadatory={true}
                fieldError={errors?.workPhone}
                errorText={errors?.workPhone}
                isDisabled={isEditMode}
              />
            </StyledDrawerInputContainer>
          </FlexContainer>
          {/* Row 2 Brand Name and Company Size*/}
          <FlexContainer $gap="20px" $marginTop="16px">
            <StyledDrawerInputContainer $flexBasis="50%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Brand Name'}
                fieldValue={data?.brandName}
                handleFieldChange={(e) => handleChange(e, 'brandName')}
                fieldPlaceholder={'Enter Brand name'}
                fieldError={errors?.brandName}
                errorText={errors?.brandName}
              />
            </StyledDrawerInputContainer>
            <StyledDrawerInputContainer $flexBasis="50%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Company Size'}
                fieldValue={data?.companySize}
                handleFieldChange={(e) => handleChange(e, 'companySize')}
                fieldPlaceholder={'Enter Company Size'}
                fieldError={errors?.companySize}
                errorText={errors?.companySize}
              />
            </StyledDrawerInputContainer>
          </FlexContainer>
          {/* Row 2.1 Signup Phn no and communication Phn no*/}
          {/* <FlexContainer $gap="20px" $marginTop="16px">
            <StyledDrawerInputContainer $flexBasis="100%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Signup Phone No'}
                fieldValue={data?.signUpPhoneNumber}
                handleFieldChange={(e) => handleChange(e, 'signUpPhoneNumber')}
                fieldPlaceholder={'Enter Signup Number'}
                fieldError={errors?.signUpPhoneNumber}
                errorText={errors?.signUpPhoneNumber}
              />
            </StyledDrawerInputContainer>
            <StyledDrawerInputContainer $flexBasis="100%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Communication Phone No'}f
                fieldValue={data?.communicationPhoneNumber}
                handleFieldChange={(e) => handleChange(e, 'communicationPhoneNumber')}
                fieldPlaceholder={'Enter Communication Number'}
                fieldError={errors?.communicationPhoneNumber}
                errorText={errors?.communicationPhoneNumber}
              />
            </StyledDrawerInputContainer>
          </FlexContainer> */}
          {/* Row 3: Salutation, First Name, and Last Name */}
          <FlexContainer $gap="20px" $marginTop="16px">
            <StyledDrawerInputContainer $flexBasis="50%">
              <FlexContainer $gap="20px">
                <StyledDrawerInputContainer $flexBasis="0%">
                  <DrawerInput
                    fieldType={'dropdown'}
                    fieldHeader={'Title'}
                    dropDownList={SALUTATIONS}
                    dropDownOpen={titleOpen}
                    handleDropDownOpen={setTitleOpen}
                    handleDropDownSelect={handleTitleSelect}
                    fieldValue={title}
                  />
                </StyledDrawerInputContainer>
                <StyledDrawerInputContainer $flexBasis="100%">
                  <DrawerInput
                    fieldType={'input'}
                    fieldHeader={'First Name'}
                    fieldPlaceholder={'Enter Recruiter/User First Name'}
                    fieldValue={data?.firstName}
                    handleFieldChange={(e) => handleChange(e, 'firstName')}
                    fieldError={errors?.firstName}
                    errorText={errors?.firstName}
                  />
                </StyledDrawerInputContainer>
              </FlexContainer>
            </StyledDrawerInputContainer>

            {/* Wrapper for Last Name */}
            <StyledDrawerInputContainer $flexBasis="50%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Last Name'}
                fieldValue={data?.lastName}
                handleFieldChange={(e) => handleChange(e, 'lastName')}
                fieldPlaceholder={'Enter Recruiter/User Last Name'}
                fieldError={errors?.lastName}
                errorText={errors?.lastName}
              />
            </StyledDrawerInputContainer>
          </FlexContainer>
          <GridItemRow>
            <StyledCheckbox
              checked={!!data?.isAutoShortList}
              onChange={(e) =>
                setData((prev) => ({
                  ...prev,
                  isAutoShortList: e.target.checked,
                }))
              }
            />
            <StyledSpan>Enable Auto Shortlist</StyledSpan>
          </GridItemRow>
        </InputSection>
      </ContentSection>
    </CustomerWrap>
  );
};

export default BasicDetails;
