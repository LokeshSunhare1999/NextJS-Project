import React, { useEffect, useState } from 'react';
import DisplayDrawer from '../common/DisplayDrawer';
import styled from 'styled-components';
import { zIndexValues } from '../../style';
import DrawerInput from '../common/DrawerInput';
import CustomCTA from '../CustomCTA';
import {
  inputRangeCheck,
  isDisposableEmail,
  isValidEmail,
} from '../../utils/helper';
import {
  COMPANY_SIZE_MAX_LIMIT,
  companyTypeList,
  DELAY_TIME,
  EMPLOYER_DEFAULT_MIN,
  NUMERIC_PATTERN,
} from '../../constants/employer';
import { useSnackbar } from 'notistack';
import { useQueryClient } from '@tanstack/react-query';
import { QUERY_KEYS } from '../../apis/queryKeys';
import { handleGetEarnings } from '../../apis/queryFunctions';

const ContentSection = styled.div`
  width: 100%;
  margin: 20px 20px 0 20px;
`;

const HorizontalContainer = styled.div`
  display: flex;
`;

const StyledHeader = styled.p`
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

const CreateAccDrawerNext = ({
  open,
  toggleDrawer,
  handleCreateNewAccount = () => {},
  isEdit = false,
  clearFields = () => {},
  createAccObj,
  createAccErr,
  setCreateAccErr,
  setCreateAccObj,
  setIsCalculateEarningsVisible,
  referralPerPerson,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [categoryOpen, setCategoryOPen] = useState(false);
  const [isCreateCalled, setIsCreateCalled] = useState(false);

  const handleCloseDrawer = () => {
    toggleDrawer(false);

    clearFields();
  };

  const handleFieldUpdate = (event, fieldName, subFieldName) => {
    switch (fieldName) {
      case 'email':
        setCreateAccObj({ ...createAccObj, email: event.target.value });
        break;
      case 'companyName':
        setCreateAccObj({ ...createAccObj, companyName: event.target.value });
        break;
      case 'companySize':
        setCreateAccObj({ ...createAccObj, companySize: event.target.value });
        break;
    }
  };

  const headerContent = () => {
    return (
      <StyledHeader
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        New Account
      </StyledHeader>
    );
  };

  const handleSaveClick = () => {
    const sizeValid = inputRangeCheck(
      createAccObj?.companySize,
      COMPANY_SIZE_MAX_LIMIT,
      EMPLOYER_DEFAULT_MIN,
    );
    const newErrors = {
      companyName: !createAccObj?.companyName?.trim(),
      companySize:
        !NUMERIC_PATTERN.test(createAccObj?.companySize) || sizeValid,
      email:
        !isValidEmail(createAccObj?.email) ||
        isDisposableEmail(createAccObj?.email),
    };

    setCreateAccErr(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      fetchEarningsAndTrigger();
    }
  };

  const fetchEarningsAndTrigger = async () => {
    try {
      const earningsData = await queryClient.fetchQuery({
        queryKey: [QUERY_KEYS.GET_EARNINGS],
        queryFn: () =>
          handleGetEarnings({
            companySize: createAccObj?.companySize,
            branch: referralPerPerson,
          }),
      });
      setCreateAccObj({
        ...createAccObj,
        potentialEarnings: earningsData?.weeklyEarnings[3],
      });
      handleCreateNewAccount(earningsData?.weeklyEarnings[3]);
    } catch (error) {
      enqueueSnackbar('Error in fetching potential earnings', {
        variant: 'error',
      });
    }
  };

  const handleCategorySelect = (cat) => {
    setCreateAccObj({ ...createAccObj, companyType: cat });
    setCategoryOPen(!categoryOpen);
  };

  const handleThrottledCreate = () => {
    if (isCreateCalled) return;

    handleSaveClick();
    setIsCreateCalled(true);

    setTimeout(() => {
      setIsCreateCalled(false);
    }, DELAY_TIME);
  };

  const footerContent = () => {
    return (
      <CustomCTA
        onClick={handleThrottledCreate}
        title={'Create Account'}
        color={'#FFF'}
        bgColor={'#141482'}
        border={'1px solid #CDD4DF'}
        disabled={createAccObj?.email == ''}
        isLoading={isCreateCalled}
      />
    );
  };

  return (
    <DisplayDrawer
      open={open}
      handleCloseDrawer={handleCloseDrawer}
      zIndex={zIndexValues.ADD_COURSE_DRAWER}
      headerContent={headerContent}
      footerContent={footerContent}
    >
      <HorizontalContainer>
        <ContentSection>
          <DrawerInput
            fieldType={'input'}
            fieldHeader={'Company Name'}
            fieldError={createAccErr?.companyName}
            fieldPlaceholder={'Enter Company Name'}
            fieldValue={createAccObj?.companyName}
            handleFieldChange={(e) => handleFieldUpdate(e, 'companyName')}
            isManadatory={true}
            errorText={`* Enter Company Name`}
          />
        </ContentSection>
        <ContentSection>
          <DrawerInput
            fieldType={'input'}
            fieldHeader={'Company Size'}
            fieldError={createAccErr?.companySize}
            fieldPlaceholder={'Enter Company Size'}
            fieldValue={createAccObj?.companySize}
            handleFieldChange={(e) => handleFieldUpdate(e, 'companySize')}
            isManadatory={true}
            errorText={`* Company Size must be in the range of ${EMPLOYER_DEFAULT_MIN} to ${COMPANY_SIZE_MAX_LIMIT}.`}
          />
        </ContentSection>
      </HorizontalContainer>

      <HorizontalContainer>
        <ContentSection>
          <DrawerInput
            fieldType={'input'}
            fieldHeader={'Email ID'}
            fieldError={createAccErr?.email}
            fieldPlaceholder={'Enter email id'}
            fieldValue={createAccObj?.email}
            handleFieldChange={(e) => handleFieldUpdate(e, 'email')}
            isManadatory={true}
            errorText={'* Enter a valid Email'}
          />
        </ContentSection>
        <ContentSection>
          <DrawerInput
            isManadatory={false}
            fieldType={'dropdown'}
            fieldHeader={'Company Type'}
            fieldError={createAccErr?.companyType}
            fieldValue={createAccObj?.companyType || 'Select company type'}
            handleDropDownSelect={handleCategorySelect}
            dropDownOpen={categoryOpen}
            handleDropDownOpen={setCategoryOPen}
            dropDownList={companyTypeList}
          />
        </ContentSection>
      </HorizontalContainer>
    </DisplayDrawer>
  );
};

export default CreateAccDrawerNext;
