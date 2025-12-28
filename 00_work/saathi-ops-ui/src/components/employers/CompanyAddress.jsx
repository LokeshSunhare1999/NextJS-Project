import React from 'react';
import styled from 'styled-components';
import DrawerInput from '../common/DrawerInput';
import {
  SALUTATIONS,
  STATES_LIST,
  STATES_LIST_LV,
} from '../../constants/details';
import DisplayDropdown from './DisplayDropdown';
import { MAX_LENGTHS } from '../../constants';
import { REPLACE_PATTERNS } from '../../constants/regex';
import { useEffect } from 'react';

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

const CompanyAddress = ({ data, setData, errors, setErrors, setPincode }) => {
  // const [stateObj, setStateObj] = useState({});
  // useEffect(() => {
  //   setStateObj(
  //     { label: data?.state, value: data?.state } || {
  //       label: 'Select State',
  //       value: '',
  //     },
  //   );
  // }, [data?.state]);

  // const STATES_LIST_LV = globalData?.metaData?.STATES_LIST_LV;

  // const handleBlur = () => {
  //   if (data?.pincode?.length === MAX_LENGTHS.PIN_CODE) {
  //     setPincode(data?.pincode);
  //   }
  // };
  useEffect(() => {
    if (data?.pincode?.length === MAX_LENGTHS.PIN_CODE) {
      setPincode(data?.pincode);
    }
  }, [data?.pincode]);

  const handleChange = (e, field) => {
    let { value } = e.target;
    let validValue = value;
    let errorMessage = null;

    switch (field) {
      case 'address1':
      case 'address2':
        validValue = validValue.replace(
          REPLACE_PATTERNS.ALPHANUMERIC_WITH_PUNCTUATION,
          '',
        );

        break;

      // case 'city':
      //   validValue = validValue.replace(REPLACE_PATTERNS.ALPHABETS, '');
      // break;

      case 'pincode':
        validValue = validValue.replace(REPLACE_PATTERNS.NUMERIC, '');
        if (validValue.length > MAX_LENGTHS.PIN_CODE) {
          validValue = validValue.slice(0, MAX_LENGTHS.PIN_CODE);
        }
        break;

      default:
        break;
    }

    // Update state with valid value and handle errors
    setData((prev) => ({
      ...prev,
      [field]: validValue,
    }));

    if (errorMessage) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: errorMessage,
      }));
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [field]: null,
      }));
    }
  };

  // const handleStateSelect = (value) => {
  //   setStateObj(value);
  //   setData((prev) => ({
  //     ...prev,
  //     ['state']: value,
  //   }));
  // };

  return (
    <CustomerWrap>
      <ContentSection>
        <StyledHeader>Company Address</StyledHeader>
        <InputSection>
          {/* Row 1 */}
          <FlexContainer $gap="20px">
            <StyledDrawerInputContainer $flexBasis="50%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Address 1'}
                fieldValue={data?.address1}
                handleFieldChange={(e) => handleChange(e, 'address1')}
                fieldPlaceholder={'Enter address 1'}
                fieldError={errors?.address1}
                errorText={errors?.address1}
              />
            </StyledDrawerInputContainer>
            <StyledDrawerInputContainer $flexBasis="50%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Address 2'}
                fieldValue={data?.address2}
                handleFieldChange={(e) => handleChange(e, 'address2')}
                fieldPlaceholder={'Enter address 2'}
                fieldError={errors?.address2}
                errorText={errors?.address2}
              />
            </StyledDrawerInputContainer>
          </FlexContainer>

          {/* Row 2 */}
          <FlexContainer $gap="20px" $marginTop="16px">
            <StyledDrawerInputContainer $flexBasis="33%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'Pin Code'}
                fieldPlaceholder={'Enter pin code'}
                fieldValue={data?.pincode}
                handleFieldChange={(e) => handleChange(e, 'pincode')}
                fieldError={errors?.pincode}
                errorText={errors?.pincode}
                isManadatory={true}
              />
            </StyledDrawerInputContainer>
            <StyledDrawerInputContainer $flexBasis="33%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'City/District'}
                fieldValue={data?.city}
                handleFieldChange={(e) => handleChange(e, 'city')}
                fieldPlaceholder={'Enter city'}
                fieldError={errors?.city}
                errorText={errors?.city}
                isDisabled={true}
              />
            </StyledDrawerInputContainer>
            <StyledDrawerInputContainer $flexBasis="33%">
              <DrawerInput
                fieldType={'input'}
                fieldHeader={'State'}
                fieldValue={data?.state}
                handleFieldChange={(e) => handleChange(e, 'state')}
                fieldPlaceholder={'Enter state'}
                fieldError={errors?.state}
                errorText={errors?.state}
                isDisabled={true}
              />
            </StyledDrawerInputContainer>
            {/* <StyledDrawerInputContainer $flexBasis="33%">
              <DropDownConatiner>
                <Label>State</Label>
                <DisplayDropdown
                  options={STATES_LIST_LV}
                  label="State"
                  placeholder={'Select State'}
                  value={stateObj?.value || 'Select State'}
                  height={'42px'}
                  handleChangeFn={handleStateSelect}
                  placeholderColor={'#585858'}
                />
              </DropDownConatiner>
            </StyledDrawerInputContainer> */}
          </FlexContainer>
        </InputSection>
      </ContentSection>
    </CustomerWrap>
  );
};

export default CompanyAddress;
