import React, { useState } from 'react';

import styled from 'styled-components';
import DrawerInput from '../common/DrawerInput';
import LocationInput from '../common/LocationInput';
import {
  MAX_CHAR_LIMIT,
  MIN_QUALIFICATION_LIST,
} from '../../constants/employer';
import SelectableInputPill from '../common/SelectableInputPill';

const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 20px 0px;
  padding: 16px;
  border-radius: 10px;
`;
const StyledSpan = styled.span`
  color: ${(props) => (props?.$isDisabled ? '#808080' : '#000')};
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

const StyledInput = styled.input`
  position: ${(props) => (props.$position ? props.$position : 'relative')};
  z-index: ${(props) => (props.$zIndex ? props.$zIndex : 'auto')};
  left: ${(props) => (props.$left ? props.$left : '0')};
  top: ${(props) => (props.$top ? props.$top : '0')};
  width: ${(props) => (props.$width ? props.$width : 'calc(100% - 40px)')};
  height: 20px;
  margin-top: 10px;
  border-radius: 8px;
  color: #000000bf;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
  border: ${(props) => (props?.$isError ? '1px solid red' : '')};
  text-align: ${(props) => (props.$textAlign ? props.$textAlign : 'left')};
`;

const StyledButton = styled.button`
  position: ${(props) => (props?.$position ? props?.$position : 'relative')};
  top: ${(props) => (props?.$top ? props?.$top : null)};
  left: ${(props) => (props?.$left ? props?.$left : null)};
  right: ${(props) => (props?.$right ? props?.$right : null)};
  z-index: ${(props) => (props?.$zIndex ? props?.$zIndex : '3')};
  width: ${(props) => (props.$width ? props.$width : '20px')};
  font-size: 24px;
  line-height: 24px;
  color: #8c8c8c;
  background: transparent;
  border: none;
  cursor: pointer;
`;
const StyledDiv = styled.div`
  position: relative;
  height: ${(props) => (props.$height ? props.$height : '50px')};
  width: ${(props) => (props.$width ? props.$width : '100%')};
  margin: ${(props) => (props.$margin ? props.$margin : null)};
`;

const Span = styled.span`
  color: ${(props) => (props.$color ? 'red' : '#000')};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const StyledHeader = styled.p`
  font-family: Poppins;
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
  margin: ${(props) => props?.$margin};
  width: ${(props) => (props?.$width ? props?.$width : '100%')};
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: ${(props) => (props.$gap ? props.$gap : '10px')};
  opacity: ${(props) => (props.$opacity ? props.$opacity : '1')};
`;

const FlexContainer = styled.div`
  font-family: Poppins;
  width: ${(props) => (props.$width ? props.$width : '100%')};
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => (props.$gap ? props.$gap : '8px')};
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;
const JobPostInfoSection = ({
  jobDetails,
  setJobDetails,
  errors,
  setErrors,
  educationQualificationList,
}) => {
  const [currentBenefit, setCurrentBenefit] = useState('');
  const [qualificationDropDownOpen, setQualificationDropDownOpen] =
    useState(false);

  const handleAddBenfit = () => {
    if (!currentBenefit.trim()) return;
    if (currentBenefit.trim()?.length > MAX_CHAR_LIMIT) {
      setErrors((prev) => ({
        ...prev,
        benefits: `Benefits should not exceed ${MAX_CHAR_LIMIT} characters`,
      }));
      return;
    }
    const commaSeparatedBenefits = currentBenefit.split(',');
    const parsedBenefits = commaSeparatedBenefits.filter(
      (item) => item !== '' && item !== ' ',
    );

    setJobDetails({
      ...jobDetails,
      benefits: [...jobDetails.benefits, ...parsedBenefits],
    });
    setErrors((prev) => ({ ...prev, benefits: '' }));

    setCurrentBenefit('');
  };
  const handleRemoveBenefit = (index) => {
    const updatedBenefits = jobDetails.benefits.filter(
      (item, i) => i !== index,
    );
    setJobDetails({ ...jobDetails, benefits: updatedBenefits });
  };
  const minQualificationList =
    educationQualificationList?.map((category) => category?.value) || [];

  const handleMinQualificationSelect = (value) => {
    const qualificationEnum = educationQualificationList?.find(
      (qualification) => qualification.value === value,
    )?.key;

    setJobDetails({ ...jobDetails, minQualification: qualificationEnum });
    setQualificationDropDownOpen(false);
  };

  const getMinQualificationValue = (key) => {
    const minQualification = educationQualificationList?.find(
      (minQualification) => minQualification.key === key,
    );
    return minQualification?.value;
  };

  const handleFieldUpdate = (e, field) => {
    if (field === 'minExp' || field === 'maxExp') {
      if (/^\d{0,2}$/.test(e.target.value)) {
        setJobDetails((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
      }
    } else setJobDetails({ ...jobDetails, [field]: e.target.value });
  };

  const handleUpdateExp = (field, type) => {
    if (jobDetails?.noMandatoryExperience) return;
    setJobDetails((prev) => {
      const currentValue = parseFloat(prev[field] || 0, 10);
      let updatedValue;
      if (type === 'increment') {
        updatedValue = Math.min(99, currentValue + 0.5);
      } else {
        updatedValue = Math.max(0, currentValue - 0.5);
      }
      if (updatedValue > 99 || updatedValue < 0) {
        return prev;
      }
      return { ...prev, [field]: updatedValue };
    });
  };

  const handleAddJobLocation = (newLocation) => {
    setJobDetails((prevDetails) => ({
      ...prevDetails,
      location: newLocation,
    }));
    setErrors({ ...errors, location: '' });
  };

  const handleRemoveJobLocation = () => {
    setJobDetails({ ...jobDetails, location: {} });
  };

  const handleNoMandatoryExpClick = (checked, field) => {
    setJobDetails({ ...jobDetails, [field]: checked, minExp: '', maxExp: '' });
    setErrors({ ...errors, minExp: '' });
  };

  return (
    <Wrapper>
      <FlexContainer $flexDirection="column" $gap="20px">
        <FlexContainer $flexDirection="column" $gap="0px">
          <DrawerInput
            fieldType={'inputArea'}
            fieldHeader="Description"
            fieldPlaceholder={'Add a description'}
            fieldValue={jobDetails?.description}
            handleFieldChange={(e) => handleFieldUpdate(e, 'description')}
          />
        </FlexContainer>
        <SelectableInputPill
          header="Benefits"
          placeholder="Add Benefits"
          selectedPills={jobDetails?.benefits}
          currentValue={currentBenefit}
          inputContainerWidth="calc(50% - 8px)"
          error={errors?.benefits}
          onChange={(value) => setCurrentBenefit(value)}
          onAdd={() => handleAddBenfit()}
          onRemove={(index) => {
            handleRemoveBenefit(index);
          }}
        />
        <LocationInput
          onLocationSelect={handleAddJobLocation}
          onLocationRemove={handleRemoveJobLocation}
          locationData={jobDetails?.location}
          error={errors?.location}
        />
        <FlexContainer $gap="0px" $flexDirection="column">
          <DrawerInput
            fieldType={'dropdown'}
            fieldHeader="Min. Qualification"
            fieldValue={
              getMinQualificationValue(jobDetails?.minQualification) ||
              `Select minimum qualification`
            }
            handleDropDownSelect={(value) =>
              handleMinQualificationSelect(value)
            }
            dropDownList={minQualificationList}
            dropDownOpen={qualificationDropDownOpen}
            handleDropDownOpen={setQualificationDropDownOpen}
            isDropDownScrollable={true}
          />
        </FlexContainer>
        <FlexContainer $flexDirection="column" $gap="0px">
          <StyledHeader>Experience</StyledHeader>
          <FlexContainer $gap="16px">
            <DrawerInput fieldType={'children'} showFieldHeader={false}>
              <StyledDiv $width={'265px'} $margin={'0 0 10px 0'}>
                <StyledInput
                  $isError={errors?.minExp}
                  value={jobDetails?.minExp}
                  placeholder="Minimum Year"
                  disabled={jobDetails?.noMandatoryExperience}
                  onChange={(e) => handleFieldUpdate(e, 'minExp')}
                  $width={'227px'}
                  $textAlign={'center'}
                  $position={'absolute'}
                  $zIndex={'2'}
                  $left={'0'}
                ></StyledInput>
                <StyledButton
                  $position={'absolute'}
                  $left={'20px'}
                  $width={'15px'}
                  $top={'40%'}
                  onClick={() => handleUpdateExp('minExp', 'decrement')}
                >
                  -
                </StyledButton>
                <StyledButton
                  $position={'absolute'}
                  $right={'20px'}
                  $width={'15px'}
                  $top={'40%'}
                  onClick={() => handleUpdateExp('minExp', 'increment')}
                >
                  +
                </StyledButton>
              </StyledDiv>
            </DrawerInput>
            <DrawerInput fieldType={'children'} showFieldHeader={false}>
              <StyledDiv $width={'265px'} $margin={'0 0 10px 0'}>
                <StyledInput
                  value={jobDetails?.maxExp}
                  placeholder="Maximum Year"
                  disabled={jobDetails?.noMandatoryExperience}
                  onChange={(e) => handleFieldUpdate(e, 'maxExp')}
                  $width={'227px'}
                  $textAlign={'center'}
                  $position={'absolute'}
                  $zIndex={'2'}
                  $left={'0'}
                ></StyledInput>
                <StyledButton
                  $position={'absolute'}
                  $left={'20px'}
                  $width={'15px'}
                  $top={'40%'}
                  onClick={() => handleUpdateExp('maxExp', 'decrement')}
                >
                  -
                </StyledButton>
                <StyledButton
                  $position={'absolute'}
                  $right={'20px'}
                  $width={'15px'}
                  $top={'40%'}
                  onClick={() => handleUpdateExp('maxExp', 'increment')}
                >
                  +
                </StyledButton>
              </StyledDiv>
            </DrawerInput>
          </FlexContainer>
          {errors?.minExp ? (
            <Span
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
              $color={'red'}
            >
              {errors?.minExp}
            </Span>
          ) : (
            ''
          )}
        </FlexContainer>
        <FlexContainer $alignItems="center">
          <StyledCheckbox
            checked={jobDetails?.noMandatoryExperience}
            onChange={(e) =>
              handleNoMandatoryExpClick(
                e.target.checked,
                'noMandatoryExperience',
              )
            }
          />
          <StyledSpan>No Mandatory exp</StyledSpan>
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  );
};

export default JobPostInfoSection;
