import React, { useEffect, useState } from 'react';
import { INFO_ICON_TEXT } from '../../constants';
import DrawerInput from '../common/DrawerInput';
import LocationInput from '../common/LocationInput';
import styled from 'styled-components';
import { REPLACE_PATTERNS } from '../../constants/regex';
import { useGetJobReelGlobalData } from '../../apis/queryHooks';
import DisplayDropdown from '../employers/DisplayDropdown';
import { CATEGORY_KNOWLEDGE_MAP } from '../../constants/jobs';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;
  border: 1px solid #f1f1f1;
  border-radius: 15px;
  padding: 5px 20px;
`;
const Wrap = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: -10px;
`;
const InputWrapper = styled.div`
  position: relative;
  left: 35%;
  width: 55%;
  margin-top: -5px;
  margin-bottom: 10px;
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
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

const BorderLine = styled.div`
  border-bottom: 1px solid #f1f1f1;
`;
const StyledSpan = styled.span`
  color: red;
  font-size: 10px;
  margin-top: -25px;
  font-style: italic;
`;

const P = styled.p`
  color: ${(props) => (props.$color ? props.$color : '#000')};
  font-weight: ${(props) => (props.$fontWeight ? props.$fontWeight : '400')};
  font-size: ${(props) => (props.$fontSize ? props.$fontSize : '12px')};
  margin: 5px 2px;
`;

const StyledPill = styled.div`
  color: #004ff3;
  border: 1px solid #004ff3;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  padding: 5px;
  gap: 4px;
  cursor: pointer;
`;

const Text = styled.span`
  color: #004ff3;
  font-family: Poppins, sans-serif;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  line-height: ${(props) => props.$lineHeight};
`;

const JobReelChecks = ({
  reelChecks,
  setReelChecks,
  checkboxGroups,
  setCheckboxGroups,
  errors,
  setErrors,
  shouldHideRest,
  customerProfileData,
  autoSuggestedJobreelData,
}) => {
  const { data: jobReelGlobalData } = useGetJobReelGlobalData();
  const [locationQuery, setLocationQuery] = useState('');
  const [preferredLocationQuery, setPreferredLocationQuery] = useState('');
  const JOB_CATEGORIES =
    jobReelGlobalData?.jobCategory?.map((item) => ({
      key: item.key,
      value: item.value,
      label: item.value,
    })) || [];

  const CATEGORY_KNOWLEDGE =
    jobReelGlobalData?.categoryKnowledgeData?.map((item) => ({
      key: item.key,
      value: item.key,
      label: CATEGORY_KNOWLEDGE_MAP[item.value],
    })) || [];

  const SKILLS =
    jobReelGlobalData?.skills?.map((item) => ({
      value: item,
      label: item,
    })) || [];

  const AVAILABILITY =
    jobReelGlobalData?.availability?.map((item) => ({
      value: item.key,
      label: item.value,
      checked: false,
    })) || [];

  const GENDER =
    jobReelGlobalData?.genderTypes?.map((item) => ({
      value: item.key,
      label: item.value,
      checked: false,
    })) || [];

  const CUSTOM_REJECTED_REASON =
    jobReelGlobalData?.customRejectedReason?.map((item) => ({
      value: item.key,
      label: item.value,
    })) || [];

  if (!JOB_CATEGORIES?.some((item) => item.value === 'others')) {
    JOB_CATEGORIES?.push({ label: 'others', value: 'others' });
  }

  if (!SKILLS?.some((item) => item.value === 'others')) {
    SKILLS?.push({ label: 'others', value: 'others' });
  }

  const handleFieldUpdate = (e, field) => {
    let value = e.target.value;

    switch (field) {
      case 'name':
        value = value.replace(REPLACE_PATTERNS.ALPHABETS, '');
        break;
      case 'gender':
      case 'age':
        value = value.replace(REPLACE_PATTERNS.NUMERIC, '');

        break;
      case 'minSalary':
      case 'maxSalary':
      case 'yoe':
        value = value.replace(REPLACE_PATTERNS.NUMERIC, '');
        break;
      case 'availability':
      case 'openToRelocation':
      case 'workFromHomePreference':
      case 'customRejectedMessage':
      default:
        break;
    }

    // Update the value in your state
    setReelChecks((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLocationSelect = (key, loc) => {
    setReelChecks((prev) => {
      const updated = {
        ...prev,
        [key]: loc,
      };

      return updated;
    });
  };

  const handleDropdownSelect = (field, selectedValue) => {
    const shouldClearOther =
      Array.isArray(selectedValue) && !selectedValue?.includes('others');
    const otherKey = `${field}Other`;
    if (shouldClearOther) {
      setReelChecks((prev) => ({
        ...prev,
        [otherKey]: '',
      }));
    }
    setReelChecks((prev) => ({
      ...prev,
      [field]: selectedValue,
    }));
  };

  const handleCheckboxChange = (groupKey, itemKey) => {
    const newReelChecks = { ...reelChecks };

    setCheckboxGroups((prevState) => {
      const updatedGroup = prevState[groupKey].map((item) => ({
        ...item,
        checked: item.value === itemKey,
      }));

      if (itemKey === 'No') {
        if (groupKey === 'name') newReelChecks.name = '';
        if (groupKey === 'age') newReelChecks.age = '';
        if (groupKey === 'location') newReelChecks.location = {};
        if (groupKey === 'preferredLocation')
          newReelChecks.preferredLocation = {};
        if (groupKey === 'yoe') newReelChecks.yoe = 0;
        if (groupKey === 'expType') {
          newReelChecks.expType = [];
          newReelChecks.expTypeOther = '';
        }
        if (groupKey === 'skillCategory') {
          newReelChecks.skillCategory = [];
          newReelChecks.skillCategoryOther = '';
        }
        if (groupKey === 'preferredJobType') {
          newReelChecks.preferredJobType = [];
          newReelChecks.preferredJobTypeOther = '';
        }
        if (groupKey === 'categoryKnowledge') {
          newReelChecks.categoryKnowledge = null;
          newReelChecks.categoryKnowledgeOther = '';
        }
        if (groupKey === 'salary') {
          newReelChecks.minSalary = '';
          newReelChecks.maxSalary = '';
        }
        if (groupKey === 'customRejected') {
          newReelChecks.customRejectedMessage = null;
        }
        setErrors({
          ...errors,
          [groupKey]: '',
        });
      }

      if (groupKey === 'preferredLocationOptions') {
        prevState.preferredLocationOptions.forEach((option) => {
          newReelChecks[option.key] = option.value === itemKey;
        });
      }
      if (groupKey === 'availability') {
        const selectedOption = prevState.availability.find(
          (option) => option.value === itemKey,
        );

        if (selectedOption) {
          newReelChecks.availability = selectedOption.key;
        }
      }
      if (groupKey === 'gender') {
        const selectedOption = prevState.gender.find(
          (option) => option.value === itemKey,
        );
        if (selectedOption) {
          newReelChecks.gender = selectedOption.key;
        }
      }

      return {
        ...prevState,
        [groupKey]: updatedGroup,
      };
    });

    setReelChecks(newReelChecks);
  };

  const handleExpBtnClick = (type) => {
    const exp =
      type === 'increment'
        ? ((parseFloat(reelChecks?.yoe) || 0) + 0.5).toFixed(1)
        : ((parseFloat(reelChecks?.yoe) || 0) - 0.5).toFixed(1);
    if (exp < 0) return;
    setReelChecks((prev) => ({
      ...prev,
      yoe: exp,
    }));
  };

  const renderOptionField = (
    key,
    label,
    infoIconText,
    isManadatory = false,
    showTooltip = true,
    showFieldHeader,
  ) => (
    <Wrap key={`${key}-${label}`}>
      <DrawerInput
        fieldType="option"
        checkboxes={checkboxGroups[key]}
        handleCheckboxChange={(itemKey) => handleCheckboxChange(key, itemKey)}
        infoTag={true}
        fieldHeader={label}
        fieldHeaderSize="14px"
        isManadatory={isManadatory}
        headerWidth="50%"
        showTooltip={showTooltip}
        infoTagText={infoIconText}
        fieldError={!!errors?.[key]}
        errorText={errors?.[key]}
        showFieldHeader={showFieldHeader}
      />
    </Wrap>
  );

  const renderConditionalInput = (
    key,
    placeholder,
    valueKey = key,
    errorText,
  ) =>
    checkboxGroups[key]?.find((opt) => opt.key === 'yes' && opt.checked) && (
      <>
        <InputWrapper key={`${key}-${placeholder}`}>
          <DrawerInput
            fieldType="input"
            showFieldHeader={false}
            fieldPlaceholder={placeholder}
            fieldValue={reelChecks[valueKey] || ''}
            handleFieldChange={(e) => handleFieldUpdate(e, valueKey)}
            errorText={errorText}
          />
        </InputWrapper>
        {key === 'name'
          ? renderAutoSuggestedData('name', autoSuggestedJobreelData?.name)
          : null}
      </>
    );

  const renderDropdownWithOther = (
    key,
    placeholder,
    list = [],
    valueKey = key,
    otherKey = `${key}Other`,
  ) => {
    const mode = ['expType', 'skillCategory', 'preferredJobType'].includes(key)
      ? 'multiple'
      : '';

    return (
      (key === 'customRejectedMessage' ||
        checkboxGroups[key]?.find(
          (opt) => opt.key === 'yes' && opt.checked,
        )) && (
        <>
          <InputWrapper key={key}>
            <DisplayDropdown
              value={reelChecks[valueKey]}
              placeholder={placeholder}
              handleChangeFn={(selectedValue) => {
                handleDropdownSelect(key, selectedValue);
              }}
              options={list.map((opt) => ({
                ...opt,
                value: opt.key || opt.value,
              }))}
              mode={mode}
              height={'auto'}
            />
            {['expType', 'skillCategory', 'preferredJobType'].includes(key) &&
              Array.isArray(reelChecks[valueKey]) &&
              reelChecks[valueKey].includes('others') && (
                <DrawerInput
                  fieldType="input"
                  showFieldHeader={false}
                  fieldValue={reelChecks[otherKey]}
                  handleFieldChange={(e) => handleFieldUpdate(e, otherKey)}
                  fieldPlaceholder={`Enter your ${placeholder.toLowerCase()}`}
                />
              )}
          </InputWrapper>
          {['expType', 'skillCategory', 'preferredJobType'].includes(key)
            ? renderAutoSuggestedData(key, autoSuggestedJobreelData?.[key])
            : null}
        </>
      )
    );
  };

  const renderAutoSuggestedData = (key, data) => {
    const handleClick = (value) => {
      if (key === 'location') {
        setLocationQuery(value);
        return;
      }
      if (key === 'preferredLocation') {
        setPreferredLocationQuery(value);
        return;
      }
      if (key === 'availability') {
        setCheckboxGroups((prevState) => ({
          ...prevState,
          [key]:
            prevState[key]?.map((item) => ({
              ...item,
              checked: item.key === value,
            })) || [],
        }));
      }
      if (
        key === 'skillCategory' ||
        key === 'preferredJobType' ||
        key === 'expType'
      ) {
        const otherKey = `${key}Other`;
        setReelChecks((prev) => ({
          ...prev,
          [key]: ['others'],
          [otherKey]: value,
        }));
      } else {
        setReelChecks((prev) => ({
          ...prev,
          [key]: value,
        }));
      }
    };
    if (!data || data.length === 0) return null;
    return (
      <InputWrapper>
        <P>Suggested values:</P>
        <FlexContainer $marginTop="12px">
          {data?.map((pill, index) => (
            <StyledPill key={`${pill}-${index}`}>
              <Text
                $fontSize={'10px'}
                $lineHeight={'normal'}
                onClick={() => handleClick(pill)}
              >
                {pill}
              </Text>
            </StyledPill>
          ))}
        </FlexContainer>
      </InputWrapper>
    );
  };

  return (
    <>
      <Container>
        {renderOptionField('nudity', 'Nudity', INFO_ICON_TEXT.NUDITY, true)}
        {renderOptionField(
          'vulgarity',
          'Bad Language / Vulgarity',
          INFO_ICON_TEXT.BAD_LANGUAGE,
          true,
        )}
        {renderOptionField(
          'noAudio',
          'Audio Not Present',
          INFO_ICON_TEXT.NO_AUDIO,
          true,
        )}
        {renderOptionField(
          'improperPosture',
          'Improper Posture',
          INFO_ICON_TEXT.POSTURE,
          true,
        )}
        {renderOptionField(
          'customRejected',
          'Others',
          INFO_ICON_TEXT.OTHER_REMARKS,
          true,
        )}

        {checkboxGroups.customRejected?.find(
          (opt) => opt.key === 'yes' && opt.checked,
        ) &&
          renderDropdownWithOther(
            'customRejectedMessage',
            'Select Reason',
            CUSTOM_REJECTED_REASON,
          )}
        {checkboxGroups.customRejected?.find(
          (opt) => opt.key === 'yes' && opt.checked,
        ) &&
          errors?.customRejectedMessage && (
            <StyledSpan>{errors.customRejectedMessage}</StyledSpan>
          )}
      </Container>
      {!shouldHideRest ? (
        <Container>
          {renderOptionField(
            'noVideo',
            'Video Not Present',
            INFO_ICON_TEXT.NO_VIDEO,
          )}
          <StyledSpan>
            {`* Selecting "yes" this will reject the reel`}
          </StyledSpan>
          <BorderLine />
          {renderOptionField('name', 'Name', INFO_ICON_TEXT.NAME, true)}
          {renderConditionalInput(
            'name',
            'Add full name',
            'name',
            'Full name is required.',
          )}
          <BorderLine />
          {renderOptionField('gender', 'Gender', INFO_ICON_TEXT.GENDER, true)}
          <BorderLine />

          {renderOptionField('age', 'Age', INFO_ICON_TEXT.AGE)}
          {checkboxGroups.age?.find(
            (opt) => opt.key === 'yes' && opt.checked,
          ) && (
            <>
              <InputWrapper>
                <DrawerInput
                  fieldType="input"
                  showFieldHeader={false}
                  fieldPlaceholder="Age is required"
                  fieldValue={reelChecks?.age || ''}
                  handleFieldChange={(e) => handleFieldUpdate(e, 'age')}
                />
              </InputWrapper>
              {renderAutoSuggestedData('age', autoSuggestedJobreelData?.age)}
            </>
          )}
          <BorderLine />

          {renderOptionField(
            'location',
            'User Location',
            INFO_ICON_TEXT.USER_LOCATION,
          )}
          {checkboxGroups.location?.find(
            (opt) => opt.key === 'yes' && opt.checked,
          ) && (
            <>
              <InputWrapper>
                <LocationInput
                  onLocationSelect={(loc) =>
                    handleLocationSelect('location', loc)
                  }
                  onLocationRemove={() => handleLocationSelect('location', {})}
                  locationData={reelChecks.location}
                  showHeader={false}
                  placeholderText="Current City/State"
                  locationQuery={locationQuery}
                  setLocationQuery={setLocationQuery}
                  inputId="location-input"
                />
              </InputWrapper>
              {renderAutoSuggestedData(
                'location',
                autoSuggestedJobreelData?.location,
              )}
            </>
          )}

          <BorderLine />

          {renderOptionField(
            'preferredLocation',
            'Preferred Job Location',
            INFO_ICON_TEXT.PREFERRED_JOB_LOCATION,
          )}
          {checkboxGroups.preferredLocation?.find(
            (opt) => opt.key === 'yes' && opt.checked,
          ) && (
            <>
              <InputWrapper>
                <LocationInput
                  onLocationSelect={(loc) =>
                    handleLocationSelect('preferredLocation', loc)
                  }
                  onLocationRemove={() =>
                    handleLocationSelect('preferredLocation', {})
                  }
                  locationData={reelChecks.preferredLocation}
                  showHeader={false}
                  placeholderText="Preferred City for Job"
                  locationQuery={preferredLocationQuery}
                  setLocationQuery={setPreferredLocationQuery}
                  inputId="preferred-location-input"
                />
                {renderOptionField(
                  'preferredLocationOptions',
                  null,
                  false,
                  false,
                  false,
                  false,
                )}
              </InputWrapper>
              {renderAutoSuggestedData(
                'preferredLocation',
                autoSuggestedJobreelData?.preferredLocation,
              )}
            </>
          )}

          <BorderLine />

          {renderOptionField(
            'yoe',
            'Experience (years)',
            INFO_ICON_TEXT.EXPERIENCE_YEARS,
          )}
          {checkboxGroups.yoe?.find(
            (opt) => opt.key === 'yes' && opt.checked,
          ) && (
            <>
              <InputWrapper>
                <DrawerInput fieldType={'children'} showFieldHeader={false}>
                  <StyledDiv $width={'265px'} $margin={'0 0 10px 0'}>
                    <StyledInput
                      value={reelChecks.yoe}
                      onChange={(e) => handleFieldUpdate(e, 'yoe')}
                      $width={'227px'}
                      $textAlign={'center'}
                      $position={'absolute'}
                      $zIndex={'2'}
                      $left={'0'}
                    />
                    <StyledButton
                      $position={'absolute'}
                      $left={'20px'}
                      $top={'40%'}
                      onClick={() => handleExpBtnClick('decrement')}
                    >
                      -
                    </StyledButton>
                    <StyledButton
                      $position={'absolute'}
                      $right={'20px'}
                      $top={'40%'}
                      onClick={() => handleExpBtnClick('increment')}
                    >
                      +
                    </StyledButton>
                  </StyledDiv>
                </DrawerInput>
              </InputWrapper>
              {renderAutoSuggestedData('yoe', autoSuggestedJobreelData?.yoe)}
            </>
          )}
          <BorderLine />

          {renderOptionField(
            'expType',
            'Experience Field',
            INFO_ICON_TEXT.EXPERIENCE_FIELD,
          )}
          {renderDropdownWithOther(
            'expType',
            'Type of Work Done',
            JOB_CATEGORIES,
          )}
          <BorderLine />

          {renderOptionField(
            'skillCategory',
            'Skill Category',
            INFO_ICON_TEXT.SKILL_CATEGORY,
          )}
          {renderDropdownWithOther('skillCategory', 'Skills', SKILLS)}
          <BorderLine />

          {renderOptionField(
            'preferredJobType',
            'Preferred Job Type',
            INFO_ICON_TEXT.PREFERRED_JOB_TYPE,
          )}
          {renderDropdownWithOther(
            'preferredJobType',
            'Preferred Job Type',
            JOB_CATEGORIES,
          )}

          <BorderLine />

          <>
            {renderOptionField(
              'categoryKnowledge',
              'Category Knowledge',
              INFO_ICON_TEXT.CATEGORY_KNOWLEDGE,
            )}
            {renderDropdownWithOther(
              'categoryKnowledge',
              'Know the Work Well?',
              CATEGORY_KNOWLEDGE,
            )}
            <BorderLine />
          </>

          {renderOptionField('salary', 'Salary', INFO_ICON_TEXT.SALARY)}
          {checkboxGroups.salary?.find(
            (opt) => opt.key === 'yes' && opt.checked,
          ) && (
            <InputWrapper>
              <FlexContainer>
                <GridItem>
                  <DrawerInput
                    fieldType="input"
                    showFieldHeader={false}
                    fieldPlaceholder="Minimum Salary"
                    fieldValue={reelChecks?.minSalary || ''}
                    handleFieldChange={(e) => handleFieldUpdate(e, 'minSalary')}
                  />
                </GridItem>
                <GridItem>
                  <DrawerInput
                    fieldType="input"
                    showFieldHeader={false}
                    fieldPlaceholder="Maximum Salary"
                    fieldValue={reelChecks?.maxSalary || ''}
                    handleFieldChange={(e) => handleFieldUpdate(e, 'maxSalary')}
                  />
                </GridItem>
              </FlexContainer>
            </InputWrapper>
          )}
          <BorderLine />
          {renderOptionField(
            'availability',
            'Availability',
            INFO_ICON_TEXT.AVAILABILITY,
            false,
            true,
          )}

          {renderAutoSuggestedData(
            'availability',
            autoSuggestedJobreelData?.availability,
          )}
        </Container>
      ) : null}
    </>
  );
};

export default JobReelChecks;
