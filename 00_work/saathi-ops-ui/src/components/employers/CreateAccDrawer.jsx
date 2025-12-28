import React, { useState, useEffect } from 'react';
import DisplayDrawer from '../common/DisplayDrawer';
import styled from 'styled-components';
import { zIndexValues } from '../../style';
import DrawerInput from '../common/DrawerInput';
import CustomCTA from '../CustomCTA';
import { inputRangeCheck } from '../../utils/helper';
import {
  COMPANY_SIZE_MAX_LIMIT,
  EMPLOYER_DEFAULT_MIN,
  NUMERIC_PATTERN,
} from '../../constants/employer';

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

const CreateAccDrawer = ({
  open,
  toggleDrawer,
  handleCreateAccount = () => {},
  isEdit = false,
  clearFields = () => {},
  createAccObj,
  createAccErr,
  setCreateAccErr,
  setCreateAccObj,
  setIsCalculateEarningsVisible,
  employersAgencyType,
  setEmployersAgencyType,
}) => {
  const handleCloseDrawer = () => {
    toggleDrawer(false);
    setEmployersAgencyType((prev) =>
      prev.map((item) => ({ ...item, checked: false })),
    );

    clearFields();
  };

  const handleFieldUpdate = (event, fieldName, subFieldName) => {
    switch (fieldName) {
      case 'companyName':
        setCreateAccObj({
          ...createAccObj,
          companyName: event.target.value,
        });
        break;
      case 'companySize':
        setCreateAccObj({ ...createAccObj, companySize: event.target.value });
        break;
      case 'employersAgencyType':
        setCreateAccObj({
          ...createAccObj,
          employersAgencyType: event.target.value,
        });
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
        !NUMERIC_PATTERN.test(createAccObj?.companySize?.trim()) || sizeValid,
    };

    setCreateAccErr(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      handleCreateAccount();
      handleCloseDrawer();
    }
  };

  const footerContent = () => {
    return (
      <CustomCTA
        onClick={handleSaveClick}
        title={'Calculate Earnings'}
        color={'#FFF'}
        bgColor={'#141482'}
        border={'1px solid #CDD4DF'}
        disabled={
          createAccObj?.companyName == '' || !createAccObj?.employersAgencyType
        }
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
    </DisplayDrawer>
  );
};

export default CreateAccDrawer;
