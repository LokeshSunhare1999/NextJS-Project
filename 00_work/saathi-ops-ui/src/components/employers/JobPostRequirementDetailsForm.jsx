import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DrawerInput from '../common/DrawerInput';

import { genderPreference, isAgeMinReq } from '../../constants/employer';
import MultiSelectPill from '../common/MultiSelectPill';
import SelectableInputPill from '../common/SelectableInputPill';

const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 20px 0px;
  padding: 2px 16px 16px 16px;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  margin: ${(props) => props.$margin || '8px 0px 0px 0px'};
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const Span = styled.span`
  color: ${(props) => (props.$color ? 'red' : '#000')};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const ContentGrid = styled.div`
  margin: ${(props) => (props.$margin ? props.$margin : '10px 0px;')};
  display: flex;
  flex-direction: row;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: ${(props) => props.$gap || '16px'};
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(50% - 8px);
`;

const GridItemRow = styled(GridItem)`
  flex-direction: row;
  gap: 10px;
`;

const PillWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin: ${(props) => (props.$margin ? props.$margin : '10px 0px;')};
`;

const Pill = styled.button`
  padding: 5px 10px;
  border-radius: 25px;
  border: ${(props) =>
    props.isSelected
      ? '1px solid #004ff3'
      : props?.$isDisabled
        ? '1px solid #e9e9e9'
        : ' 1px solid #E9E9E9'};
  background-color: #fff;
  color: ${(props) =>
    props.isSelected ? '#004ff3' : props?.$isDisabled ? '#abb0ba' : ' #586276'};
  font-size: 14px;
  font-family: Poppins, sans-serif;
  cursor: ${(props) => (props?.$isDisabled ? 'not-allowed' : 'pointer')};
  outline: none;
  transition: all 0.3s ease;
`;

const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
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
const StyledDiv = styled.div`
  position: relative;
  height: ${(props) => (props.$height ? props.$height : '50px')};
  width: ${(props) => (props.$width ? props.$width : '100%')};
  margin: ${(props) => (props.$margin ? props.$margin : null)};
`;

const StyledSpan = styled.span`
  color: ${(props) => (props?.$isDisabled ? '#808080' : '#000')};
`;

const StyledInput = styled.input`
  position: ${(props) => (props.$position ? props.$position : 'relative')};
  z-index: ${(props) => (props.$zIndex ? props.$zIndex : 'auto')};
  left: ${(props) => (props.$left ? props.$left : '0')};
  top: ${(props) => (props.$top ? props.$top : '0')};
  width: ${(props) => (props.$width ? props.$width : 'calc(100% - 40px)')};
  height: 20px;
  margin-top: ${(props) => (props.$margin ? props.$margin : '10px')};
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

const JobPostRequirementDetailsForm = ({
  jobDetails,
  setJobDetails,
  selectedGenders,
  setSelectedGenders,
  errors,
  setErrors,
}) => {
  const [isAgeMinReqSelected, setIsAgeMinReqSelected] = useState(
    jobDetails?.minAge || false,
  );
  useEffect(() => {
    setIsAgeMinReqSelected(!!(jobDetails?.minAge || jobDetails?.maxAge));
  }, [jobDetails?.minAge, jobDetails?.maxAge]);

  const [requirement, setRequirement] = useState('');

  const handleFieldUpdate = (field, value) => {
    if (field === 'minAge' || field === 'maxAge') {
      if (/^\d{0,2}$/.test(value)) {
        setJobDetails((prev) => ({
          ...prev,
          [field]: value,
        }));
      }
    } else {
      if (/^\d{0,6}$/.test(value)) {
        setJobDetails((prev) => ({ ...prev, [field]: value }));
      }
    }
  };

  const handleAddReq = () => {
    if (!requirement.trim()) {
      return;
    }
    if (requirement.trim()?.length > 500) {
      setErrors((prev) => ({
        ...prev,
        requirements: 'Requirement should not exceed 500 characters',
      }));
      return;
    }
    const commaSeparatedRequirements = requirement?.split(/[\n\r,]+/);

    const parsedRequirements = commaSeparatedRequirements?.filter(
      (item) => item !== '' && item !== ' ',
    );
    setJobDetails({
      ...jobDetails,
      requirements: [...jobDetails.requirements, ...parsedRequirements],
    });
    setErrors((prev) => ({ ...prev, requirements: '' }));

    setRequirement('');
  };

  const handleRemoveRequirements = (index) => {
    const updatedRequirements = jobDetails.requirements.filter(
      (item, i) => i !== index,
    );
    setJobDetails({ ...jobDetails, requirements: updatedRequirements });
  };

  const handleUpdateAge = (field, type) => {
    setJobDetails((prev) => {
      const currentValue = parseFloat(prev[field] || 0, 10);
      let updatedValue;
      if (type === 'increment') {
        updatedValue = Math.min(99, currentValue + 1);
      } else {
        updatedValue = Math.max(0, currentValue - 1);
      }
      if (updatedValue > 99 || updatedValue < 0) {
        return prev;
      }
      return { ...prev, [field]: updatedValue };
    });
  };

  const handleAgePreferenceClick = (option) => {
    setIsAgeMinReqSelected(option === 'Yes');
    setJobDetails((prev) => ({
      ...prev,
      isAgePreferenceRequired: option === 'Yes',
    }));
    if (option === 'No') {
      handleFieldUpdate('minAge', '');
      handleFieldUpdate('maxAge', '');
    }
    setErrors((prev) => ({ ...prev, minAge: '', maxAge: '' }));
  };

  return (
    <Wrapper>
      <ContentGrid $margin={'10px 0px 0px 0px'}>
        <GridItem>
          <MultiSelectPill
            title="Gender Preference?"
            options={genderPreference}
            selectedOptions={selectedGenders}
            setSelectedOptions={setSelectedGenders}
            isMultiselect={true}
            isMandatory={false}
          />
        </GridItem>
      </ContentGrid>
      <FlexContainer $flexDirection="column">
        <FlexContainer $margin={'0px'} $flexDirection="column" $gap="0px">
          <FlexContainer $alignItems="center">
            <P
              $fontSize={'16px'}
              $fontWeight={'400'}
              $lineHeight={'24px'}
              $margin="0px"
            >
              Age Preference?{' '}
            </P>
            {isAgeMinReqSelected ? (
              <Span style={{ color: 'red' }}>*</Span>
            ) : null}
          </FlexContainer>
          <PillWrapper $margin={'10px 0px 0px 0px'}>
            {isAgeMinReq.map((option) => (
              <Pill
                key={option}
                isSelected={isAgeMinReqSelected === (option === 'Yes')}
                onClick={() => handleAgePreferenceClick(option)}
              >
                {option}
              </Pill>
            ))}
          </PillWrapper>
        </FlexContainer>
        {isAgeMinReqSelected ? (
          <ContentGrid $margin={'0px'} $justifyContent="flex-start">
            <DrawerInput fieldType={'children'} showFieldHeader={false}>
              <StyledDiv $width={'265px'} $margin={'0px'}>
                <StyledInput
                  $isError={errors?.minAge}
                  value={jobDetails?.minAge}
                  placeholder="Minimum Year"
                  onChange={(e) => handleFieldUpdate('minAge', e.target.value)}
                  $width={'227px'}
                  $textAlign={'center'}
                  $position={'absolute'}
                  $zIndex={'2'}
                  $left={'0'}
                  $marginTop={'0px'}
                ></StyledInput>
                <StyledButton
                  $position={'absolute'}
                  $left={'20px'}
                  $width={'15px'}
                  $top={'40%'}
                  onClick={() => handleUpdateAge('minAge', 'decrement')}
                >
                  -
                </StyledButton>
                <StyledButton
                  $position={'absolute'}
                  $right={'20px'}
                  $width={'15px'}
                  $top={'40%'}
                  onClick={() => handleUpdateAge('minAge', 'increment')}
                >
                  +
                </StyledButton>
              </StyledDiv>
            </DrawerInput>

            <DrawerInput fieldType={'children'} showFieldHeader={false}>
              <StyledDiv $width={'265px'} $margin={'0 0 10px 0'}>
                <StyledInput
                  $isError={errors?.minAge}
                  value={jobDetails?.maxAge}
                  placeholder="Maximum Year"
                  onChange={(e) => handleFieldUpdate('maxAge', e.target.value)}
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
                  onClick={() => handleUpdateAge('maxAge', 'decrement')}
                >
                  -
                </StyledButton>
                <StyledButton
                  $position={'absolute'}
                  $right={'20px'}
                  $width={'15px'}
                  $top={'40%'}
                  onClick={() => handleUpdateAge('maxAge', 'increment')}
                >
                  +
                </StyledButton>
              </StyledDiv>
            </DrawerInput>
          </ContentGrid>
        ) : (
          ''
        )}
        {errors.minAge ? (
          <Span
            $fontSize={'14px'}
            $fontWeight={'300'}
            $lineHeight={'normal'}
            $color={'red'}
          >
            {errors.minAge}
          </Span>
        ) : (
          ''
        )}
      </FlexContainer>
      <FlexContainer $flexDirection="column" $gap="0px">
        <P
          $fontSize={'16px'}
          $fontWeight={'400'}
          $lineHeight={'24px'}
          $margin="0px"
        >
          Salary Range <Span style={{ color: 'red' }}>*</Span>
        </P>

        <FlexContainer>
          <GridItem>
            <DrawerInput
              fieldType={'input'}
              showFieldHeader={false}
              fieldError={errors?.minSalary}
              errorText={errors?.minSalary}
              fieldPlaceholder={'Minimum'}
              fieldValue={jobDetails?.minSalary || ''}
              handleFieldChange={(e) =>
                handleFieldUpdate('minSalary', e.target.value)
              }
              isManadatory={true}
            />
          </GridItem>
          <GridItem>
            <DrawerInput
              fieldType={'input'}
              showFieldHeader={false}
              fieldError={errors?.maxSalary}
              errorText={errors?.maxSalary}
              fieldPlaceholder={'Maximum'}
              fieldValue={jobDetails?.maxSalary || ''}
              handleFieldChange={(e) =>
                handleFieldUpdate('maxSalary', e.target.value)
              }
            />
          </GridItem>
        </FlexContainer>
      </FlexContainer>
      <FlexContainer $alignItems="center" $marginTop="0px">
        <GridItemRow>
          <StyledCheckbox
            checked={jobDetails?.isWeeklyPayoutAvailable || false}
            onChange={(e) =>
              setJobDetails((prev) => ({
                ...prev,
                isWeeklyPayoutAvailable: e.target.checked,
              }))
            }
          />
          <StyledSpan>Weekly Payout Available</StyledSpan>
        </GridItemRow>
        <GridItemRow>
          <StyledCheckbox
            checked={jobDetails?.autoShortList}
            onChange={(e) =>
              setJobDetails((prev) => ({
                ...prev,
                autoShortList: e.target.checked,
              }))
            }
          />
          <StyledSpan>Enable Auto Shortlist</StyledSpan>
        </GridItemRow>
      </FlexContainer>

      <SelectableInputPill
        header="Requirements"
        placeholder="Add Requirement"
        selectedPills={jobDetails?.requirements}
        currentValue={requirement}
        inputContainerWidth="calc(50% - 8px)"
        onChange={(value) => setRequirement(value)}
        error={errors?.requirements}
        onAdd={() => handleAddReq()}
        onRemove={(index) => {
          handleRemoveRequirements(index);
        }}
        isInput={false}
      />
    </Wrapper>
  );
};

export default JobPostRequirementDetailsForm;
