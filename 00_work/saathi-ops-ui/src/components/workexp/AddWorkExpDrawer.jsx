import React, { useState, useEffect, lazy } from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import CustomCTA from '../CustomCTA';
import { zIndexValues } from '../../style';

import {
  CITY_MAX_LIMIT,
  CITY_MIN_LIMIT,
  EMPLOYMENT_DESIGNATION_MIN_LIMIT,
  EMPLOYER_NAME_MIN_LIMIT,
  EMPLOYER_PHONE_MAX_LIMIT,
  EMPLOYER_PHONE_MIN_LIMIT,
  WORK_EXP_ERROR_STRUCTURE,
  EMPLOYMENT_DESIGNATION_CITY_MAX_LIMIT,
} from '../../constants/work-experience.js';

import PropTypes from 'prop-types';
import DropDownCategory from '../DropDownCategory';
import { DatePicker } from 'antd';
import { textLengthCheck } from '../../utils/helper';
import { usePutUpdateCustomer } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import { STATES_LIST } from '../../constants/details';

const StyledDrawer = styled(Drawer)`
  z-index: ${zIndexValues.EDIT_WORKEXP_DRAWER} !important;
`;

const DrawerWrapper = styled.div`
  width: 836px;
  min-height: 100%;
  height: auto;
  background: #f4f6fa;
  padding-top: 3.5rem;
  font-family: Poppins;
  position: relative;
`;
const Img = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;

const HeaderContainer = styled.section`
  height: auto;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #cdd4df;
`;

const StyledSpan = styled.span`
  color: ${(props) => props?.$color};
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '6px')};
`;

const HeaderBox = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.p`
  font-size: 24px;
  line-height: 36px;
  font-weight: 600;
  color: #000000;
`;

const HeaderClose = styled.img`
  width: 22px;
  height: auto;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  width: 100%;
  margin-top: 20px;
  background: #f4f6fa;
  box-sizing: border-box;
  padding: 0px 20px;
`;

const ContentSection = styled.div`
  margin-bottom: 12px;
  flex-basis: ${(props) => props.$flexBasis || '100%'};
  width: ${(props) => props.$width || '100%'};
  pointer-events: ${(props) => props.$pointerEvent || 'auto'};
  opacity: ${(props) => props?.$opacity || '1'};
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 10px 15px;
  border-radius: 8px;
  border: 1px solid #cdd4df;
  background: #fff;
  cursor: pointer;
  opacity: ${(props) => props?.$opacity || '1'};
  input::placeholder {
    color: ${(props) => props.$placeholderColor || '#bfbfbf'};
    font-size: ${(props) => props.$placeholderFontSize || '14px'};
  }

  .ant-picker-input input::placeholder {
    color: ${(props) => props.$placeholderColor || '#bfbfbf'} !important;
  }
`;

const FieldHeader = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #000;
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
  margin-bottom: ${(props) =>
    props.$marginBottom ? props.$marginBottom : '0px'};
`;

const TitleInput = styled.input`
  width: calc(100% - 40px);
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
  border: ${(props) => (props.$isError ? '1px solid red' : '')};
`;

const FooterContainer = styled.div`
  width: 100%;
  margin-top: 40px;
  padding-bottom: 20px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
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

const StyledCheckbox = styled.input`
  width: 24px;
  height: 24px;
  border: none;
  outline: none;
  border-radius: 4px;
  &:checked {
    accent-color: #4bae4f !important;
    color: #ffffff !important;
  }
`;

const AddWorkExpDrawer = ({
  open,
  toggleDrawer,
  isEditWorkExp,
  workExpIndex,
  employments,
  customerId,
  customerName,
  refetchCustomerData,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const {
    mutateAsync: updateCustomerMutation,
    status: updateCustomerStatus,
    isError: isUpdateCustomerIdErr,
    error: updateCustomerErr,
  } = usePutUpdateCustomer();

  useEffect(() => {
    if (isUpdateCustomerIdErr) {
      enqueueSnackbar(
        `Failed to ${isEditWorkExp ? 'update' : 'add'} work experience. error : ${updateCustomerErr?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [isUpdateCustomerIdErr]);

  const [isStateDropdownOpen, setIsStateDropdownOpen] = useState(false);
  const [workExpFieldErr, setWorkExpFieldErr] = useState({
    ...WORK_EXP_ERROR_STRUCTURE,
  });
  const [expFormData, setExpFormData] = useState(
    isEditWorkExp ? employments?.[workExpIndex] : {},
  );

  useEffect(() => {
    if (isEditWorkExp) {
      setExpFormData(employments?.[workExpIndex]);
    } else {
      setExpFormData({
        employmentDesignation: '',
        employerName: '',
        city: '',
        employerPhoneNo: '',
        state: '',
        startDate: null,
        endDate: null,
        isCurrentEmployment: false,
      });
    }
  }, [workExpIndex, isEditWorkExp, open]);

  const handleSaveClick = async () => {
    if (isValidationError()) return;

    if (!expFormData?.isCurrentEmployment)
      expFormData.isCurrentEmployment = false;
    else expFormData.endDate = null;

    const filteredEmployments = employments?.filter(
      (emp) => emp._id !== expFormData._id,
    );

    await updateCustomerMutation({
      _id: customerId,
      employments: [...filteredEmployments, expFormData],
    });
    enqueueSnackbar(
      `Customer's work experience has been successfully ${isEditWorkExp ? 'updated' : 'added'}`,
      {
        variant: 'success',
      },
    );
    handleCloseClick();
    refetchCustomerData();
  };

  /* Order of error fields to be maintained acc to the error structurein constants */
  const isValidationError = () => {
    const startDate = expFormData?.startDate
      ? dayjs(expFormData.startDate)
      : null;
    const endDate = expFormData?.endDate ? dayjs(expFormData.endDate) : null;
    const isStartDateError = startDate && startDate.isAfter(dayjs());
    const isEndDateError = startDate && endDate && startDate.isAfter(endDate);

    const numericPattern = /^\d+$/;
    const errorFields = {
      employmentDesignation: textLengthCheck(
        expFormData?.employmentDesignation || '',
        EMPLOYMENT_DESIGNATION_CITY_MAX_LIMIT,
        EMPLOYMENT_DESIGNATION_MIN_LIMIT - 1,
      ),
      employerName: textLengthCheck(
        expFormData?.employerName || '',
        EMPLOYMENT_DESIGNATION_CITY_MAX_LIMIT,
        EMPLOYER_NAME_MIN_LIMIT - 1,
      ),
      city: textLengthCheck(
        expFormData?.city || '',
        CITY_MAX_LIMIT,
        CITY_MIN_LIMIT - 1,
      ),
      employerPhoneNo:
        textLengthCheck(
          expFormData?.employerPhoneNo || '',
          EMPLOYER_PHONE_MAX_LIMIT,
          EMPLOYER_PHONE_MIN_LIMIT - 1,
        ) || !numericPattern.test(expFormData?.employerPhoneNo),
      state: expFormData?.state ? false : true,
      startDate: isStartDateError || startDate === null,
      endDate: expFormData?.isCurrentEmployment
        ? false
        : isEndDateError || endDate === null,
    };

    setWorkExpFieldErr({ ...errorFields });
    return (
      JSON.stringify(errorFields) !== JSON.stringify(WORK_EXP_ERROR_STRUCTURE)
    );
  };

  const handleCloseClick = () => {
    setWorkExpFieldErr({
      ...WORK_EXP_ERROR_STRUCTURE,
    });

    toggleDrawer(false);
  };

  const handleCategorySelect = (cat) => {
    setExpFormData({ ...expFormData, state: cat });
    setIsStateDropdownOpen(false);
  };

  const handleFieldUpdate = (e, fieldName) => {
    switch (fieldName) {
      case 'employmentDesignation':
        setExpFormData({
          ...expFormData,
          employmentDesignation: e.target.value,
        });
        break;
      case 'employerName':
        setExpFormData({ ...expFormData, employerName: e.target.value });
        break;
      case 'city':
        setExpFormData({ ...expFormData, city: e.target.value });

        break;
      case 'employerPhoneNo':
        const numericPattern = /^\d+$/;
        if (numericPattern.test(e.target.value) || e.target.value === '')
          setExpFormData({
            ...expFormData,
            employerPhoneNo: e.target.value,
          });

        break;
    }
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={handleCloseClick}>
      <DrawerWrapper>
        <HeaderContainer>
          <HeaderBox>
            <Header>{isEditWorkExp ? 'Edit' : 'Add'} Work Experience</Header>

            <HeaderClose src={ICONS.CROSS_ICON} onClick={handleCloseClick} />
          </HeaderBox>
        </HeaderContainer>
        <ContentContainer>
          <ContentSection>
            <FieldHeader>
              Job Title{' '}
              <StyledSpan
                $fontSize={'16px'}
                $lineHeight={'24px'}
                $fontWeight={'400'}
                $color={'#ED2F2F'}
              >
                *
              </StyledSpan>
            </FieldHeader>
            <TitleInput
              placeholder="Enter customer's job title"
              type="text"
              value={expFormData?.employmentDesignation}
              onChange={(e) => handleFieldUpdate(e, 'employmentDesignation')}
              $isError={workExpFieldErr?.employmentDesignation}
            />
            {workExpFieldErr?.employmentDesignation && (
              <ErrorBox>
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {`Please limit the characters between ${EMPLOYMENT_DESIGNATION_MIN_LIMIT} and ${EMPLOYMENT_DESIGNATION_CITY_MAX_LIMIT}.`}
                </P>
              </ErrorBox>
            )}
          </ContentSection>

          <ContentSection>
            <FieldHeader>
              Company Name{' '}
              <StyledSpan
                $fontSize={'16px'}
                $lineHeight={'24px'}
                $fontWeight={'400'}
                $color={'#ED2F2F'}
              >
                *
              </StyledSpan>
            </FieldHeader>
            <TitleInput
              placeholder="Enter company name"
              type="text"
              value={expFormData?.employerName}
              onChange={(e) => handleFieldUpdate(e, 'employerName')}
              $isError={workExpFieldErr?.employerName}
            />
            {workExpFieldErr?.employerName && (
              <ErrorBox>
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {`Please limit the characters between ${EMPLOYER_NAME_MIN_LIMIT} and ${EMPLOYMENT_DESIGNATION_CITY_MAX_LIMIT}.`}
                </P>
              </ErrorBox>
            )}
          </ContentSection>

          <FlexContainer $justifyContent="space-between">
            <ContentSection>
              <FieldHeader>
                City{''}{' '}
                <StyledSpan
                  $fontSize={'16px'}
                  $lineHeight={'24px'}
                  $fontWeight={'400'}
                  $color={'#ED2F2F'}
                >
                  *
                </StyledSpan>
              </FieldHeader>
              <TitleInput
                placeholder="Enter customer's job city"
                type="text"
                value={expFormData?.city}
                onChange={(e) => handleFieldUpdate(e, 'city')}
                $isError={workExpFieldErr?.city}
              />
              {workExpFieldErr?.city && (
                <ErrorBox>
                  <P
                    $color={'red'}
                    $fontSize={'14px'}
                    $fontWeight={'300'}
                    $lineHeight={'normal'}
                  >
                    {`Please limit the characters between ${CITY_MIN_LIMIT} and ${CITY_MAX_LIMIT} characters. `}
                  </P>
                </ErrorBox>
              )}
            </ContentSection>
            <ContentSection>
              <FieldHeader>
                State{' '}
                <StyledSpan
                  $fontSize={'16px'}
                  $lineHeight={'24px'}
                  $fontWeight={'400'}
                  $color={'#ED2F2F'}
                >
                  *
                </StyledSpan>
              </FieldHeader>
              <DropDownCategory
                isBoxShadow
                isScrollable
                marginTop="10px"
                top="54px"
                category={expFormData?.state || "Select customer's job state"}
                handleCategorySelect={handleCategorySelect}
                categoryOpen={isStateDropdownOpen}
                setCategoryOPen={setIsStateDropdownOpen}
                listItem={STATES_LIST}
                isError={workExpFieldErr?.state}
              />
              {workExpFieldErr?.state && (
                <ErrorBox>
                  <P
                    $color={'red'}
                    $fontSize={'14px'}
                    $fontWeight={'300'}
                    $lineHeight={'normal'}
                  >
                    {`Please select the customer's state/UT of employment. `}
                  </P>
                </ErrorBox>
              )}
            </ContentSection>
          </FlexContainer>
          <ContentSection $width="50%">
            <FieldHeader>
              Employer's Contact Number{' '}
              <StyledSpan
                $fontSize={'16px'}
                $lineHeight={'24px'}
                $fontWeight={'400'}
                $color={'#ED2F2F'}
              >
                *
              </StyledSpan>
            </FieldHeader>
            <TitleInput
              placeholder="Employer's contact number"
              type="text"
              value={expFormData?.employerPhoneNo}
              onChange={(e) => handleFieldUpdate(e, 'employerPhoneNo')}
              $isError={workExpFieldErr?.employerPhoneNo}
            />
            {workExpFieldErr?.employerPhoneNo && (
              <ErrorBox>
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {`Please write a valid contact number between ${EMPLOYER_PHONE_MIN_LIMIT} and ${EMPLOYER_PHONE_MAX_LIMIT} digits.`}
                </P>
              </ErrorBox>
            )}
          </ContentSection>
          <FlexContainer $alignItems="center" $marginTop="20px">
            <StyledCheckbox
              type="checkbox"
              checked={expFormData?.isCurrentEmployment}
              onChange={(e) =>
                setExpFormData({
                  ...expFormData,
                  isCurrentEmployment: !expFormData?.isCurrentEmployment,
                  endDate: !expFormData?.isCurrentEmployment
                    ? null
                    : expFormData?.endDate,
                })
              }
            />
            Are you currently working here?
          </FlexContainer>
          <FlexContainer $flexDirection="column" $marginTop="20px" $gap="0px">
            <ContentSection $width="50%">
              <FieldHeader $marginBottom="8px">
                Start Date{' '}
                <StyledSpan
                  $fontSize={'16px'}
                  $lineHeight={'24px'}
                  $fontWeight={'400'}
                  $color={'#ED2F2F'}
                >
                  *
                </StyledSpan>
              </FieldHeader>
              <StyledDatePicker
                value={
                  expFormData?.startDate ? dayjs(expFormData?.startDate) : null
                }
                onChange={(date) => {
                  setExpFormData({ ...expFormData, startDate: date });
                }}
                disabledDate={false}
                placeholder="DD-MM-YYY"
                $placeholderColor="#606C8599"
                $placeholderFontSize="14px"
                suffixIcon={
                  <Img
                    src={ICONS.CALENDAR_ICON}
                    $width={'16px'}
                    $height={'16px'}
                    alt="from-date"
                  />
                }
              />
            </ContentSection>
            {workExpFieldErr?.startDate && (
              <ErrorBox $marginTop="0px">
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {`The start date should be lesser than or equal to the current date. `}
                </P>
              </ErrorBox>
            )}
          </FlexContainer>

          <FlexContainer $marginTop="8px" $flexDirection="column" $gap="0px">
            <ContentSection
              $width="50%"
              $pointerEvent={expFormData?.isCurrentEmployment ? 'none' : 'auto'}
              $opacity={expFormData?.isCurrentEmployment ? '0.5' : '1'}
            >
              <FieldHeader $marginBottom="8px">
                End Date{' '}
                <StyledSpan
                  $fontSize={'16px'}
                  $lineHeight={'24px'}
                  $fontWeight={'400'}
                  $color={'#ED2F2F'}
                >
                  *
                </StyledSpan>
              </FieldHeader>
              <StyledDatePicker
                value={
                  expFormData?.endDate ? dayjs(expFormData?.endDate) : null
                }
                onChange={(date) =>
                  setExpFormData({ ...expFormData, endDate: date })
                }
                placeholder="DD-MM-YYY"
                $placeholderColor="#606C8599"
                $placeholderFontSize="14px"
                $opacity={expFormData?.isCurrentEmployment ? '0.5' : '1'}
                suffixIcon={
                  <Img
                    src={ICONS.CALENDAR_ICON}
                    $width={'16px'}
                    $height={'16px'}
                    alt="from-date"
                  />
                }
              />
            </ContentSection>
            {workExpFieldErr?.endDate && (
              <ErrorBox $marginTop="0px">
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {`The end date should be greater than or equal to the start date. `}
                </P>
              </ErrorBox>
            )}
          </FlexContainer>

          <FooterContainer>
            <CustomCTA
              onClick={handleCloseClick}
              title={'Cancel'}
              color={'#586275'}
              bgColor={'#FFF'}
              border={'1px solid #CDD4DF'}
            />
            <CustomCTA
              onClick={handleSaveClick}
              title={isEditWorkExp ? 'Update' : 'Save'}
              color={'#FFF'}
              bgColor={'#141482'}
              isLoading={updateCustomerStatus === 'pending'}
              border={'1px solid #CDD4DF'}
            />
          </FooterContainer>
        </ContentContainer>
      </DrawerWrapper>
    </StyledDrawer>
  );
};
AddWorkExpDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  isEditWorkExp: PropTypes.bool,
  workExpIndex: PropTypes.number,
  employments: PropTypes.array,
  customerId: PropTypes.string,
  customerName: PropTypes.string,
  refetchCustomerData: PropTypes.func,
};
export default AddWorkExpDrawer;
