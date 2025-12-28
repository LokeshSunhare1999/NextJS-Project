import React, { useEffect, useState } from 'react';
import DisplayDrawer from '../common/DisplayDrawer';
import styled from 'styled-components';
import { zIndexValues } from '../../style';
import DrawerInput from '../common/DrawerInput';
import CustomCTA from '../CustomCTA';
import {
  COMPANY_SIZE_MAX_LIMIT,
  DEFAULT_REF_BRANCH,
  EMPLOYER_DEFAULT_MIN,
  NUMERIC_PATTERN,
  companyTypeList,
} from '../../constants/employer';
import { inputRangeCheck } from '../../utils/helper';
import { useGetEarnings } from '../../apis/queryHooks';
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

const EditEmployerDetailsDrawer = ({
  open,
  toggleDrawer,
  handleUpdateEmployerDetails = () => {},
  employeeBasicDetail,
  updateEmployerStatusStatus,
  editAccObj,
  setEditAccObj,
  editAccErr,
  setEditAccErr,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [categoryOpen, setCategoryOPen] = useState(false);

  useEffect(() => {
    setEditAccObj({
      companyName: employeeBasicDetail?.companyName,
      companySize: employeeBasicDetail?.companySize,
      companyType: employeeBasicDetail?.companyType,
      brandName:
        employeeBasicDetail?.brandName !== '-----'
          ? employeeBasicDetail?.brandName
          : '',
    });
  }, [open]);

  const fetchEarningsAndTrigger = async () => {
    try {
      const earningsData = await queryClient.fetchQuery({
        queryKey: [QUERY_KEYS?.GET_EARNINGS],
        queryFn: () =>
          handleGetEarnings({
            companySize: editAccObj?.companySize,
            branch: DEFAULT_REF_BRANCH,
          }),
      });
      handleUpdateEmployerDetails(earningsData?.weeklyEarnings[3]);
    } catch (error) {
      enqueueSnackbar('Error in fetching potential earnings', {
        variant: 'error',
      });
    }
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
    setEditAccErr();
  };

  const handleFieldUpdate = (event, fieldName, subFieldName) => {
    switch (fieldName) {
      case 'companyName':
        setEditAccObj({ ...editAccObj, companyName: event.target.value });
        break;
      case 'companySize':
        setEditAccObj({ ...editAccObj, companySize: event.target.value });
        break;
      case 'brandName':
        setEditAccObj({ ...editAccObj, brandName: event.target.value });
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
        Edit Employer Details
      </StyledHeader>
    );
  };

  const handleSaveClick = () => {
    const sizeValid = inputRangeCheck(
      editAccObj?.companySize,
      COMPANY_SIZE_MAX_LIMIT,
      EMPLOYER_DEFAULT_MIN,
    );
    const newErrors = {
      companyName: !editAccObj?.companyName,
      companySize: !NUMERIC_PATTERN.test(editAccObj?.companySize) || sizeValid,
    };

    setEditAccErr(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);

    if (!hasErrors) {
      fetchEarningsAndTrigger();
    }
  };
  const footerContent = () => {
    return (
      <CustomCTA
        onClick={handleSaveClick}
        title={'Save'}
        color={'#FFF'}
        bgColor={'#141482'}
        border={'1px solid #CDD4DF'}
        disabled={updateEmployerStatusStatus === 'pending'}
      />
    );
  };

  const handleCategorySelect = (cat) => {
    setEditAccObj({ ...editAccObj, companyType: cat });
    setCategoryOPen(!categoryOpen);
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
            fieldError={editAccErr?.companyName}
            fieldPlaceholder={'Enter Company Name'}
            fieldValue={editAccObj?.companyName}
            handleFieldChange={(e) => handleFieldUpdate(e, 'companyName')}
            isManadatory={true}
            errorText={`* Enter Company Name`}
          />
        </ContentSection>
        <ContentSection>
          <DrawerInput
            fieldType={'input'}
            fieldHeader={'Company Size'}
            fieldError={editAccErr?.companySize}
            fieldPlaceholder={'Enter Company Size'}
            fieldValue={editAccObj?.companySize}
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
            fieldHeader={'Brand Name'}
            fieldError={editAccErr?.brandName}
            fieldPlaceholder={'Enter brand name'}
            fieldValue={editAccObj?.brandName}
            handleFieldChange={(e) => handleFieldUpdate(e, 'brandName')}
            errorText={'* Enter a brand name'}
          />
        </ContentSection>
        <ContentSection>
          <DrawerInput
            isManadatory={false}
            fieldType={'dropdown'}
            fieldHeader={'Company Type'}
            fieldError={editAccErr?.companyType}
            fieldValue={editAccObj?.companyType || 'Select company type'}
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

export default EditEmployerDetailsDrawer;
