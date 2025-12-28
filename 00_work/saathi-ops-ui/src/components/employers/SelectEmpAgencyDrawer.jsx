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
import SelectBox from '../common/SelectBox';
import ICONS from '../../assets/icons';
import { useNavigate } from 'react-router-dom';

const ContentSection = styled.div`
  width: 100%;
  margin: 20px 20px 0 20px;
`;

const HorizontalContainer = styled.div`
  display: flex;
`;

const Wrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  justify-content: flex-start; /* Change to center or space-around if needed */
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
  padding-top: 10px;
`;

const SelectEmpAgencyDrawer = ({
  open,
  toggleDrawer,
  handleSelectEmpAgency = () => {},
  clearFields = () => {},
  createAccObj,
  createAccErr,
  setCreateAccErr,
  setCreateAccObj,
  employersAgencyType,
  setEmployersAgencyType,
  employerDetails,
  setOpenCreateAccDrawer,
}) => {
  const navigate = useNavigate();

  const handleCloseDrawer = () => {
    toggleDrawer(false);
    setEmployersAgencyType((prev) =>
      prev.map((item) => ({ ...item, checked: false })),
    );
    clearFields();
  };
  const handleAgencySelect = (item) => {
    setEmployersAgencyType((employerAgency) =>
      employerAgency.map((employer) => {
        const isChecked = employer.key === item.key;
        if (isChecked) {
          handleFieldUpdate(
            { target: { value: employer.key } },
            'employersAgencyType',
          );
        }
        return { ...employer, checked: isChecked };
      }),
    );
    if (item.key === 'STAFFING_AGENCY' || item.key === 'FACILITY_MANAGEMENT') {
      setOpenCreateAccDrawer(true);
    } else {
      navigate(`/employers/add-employer?agencyType=${item.key}`);
    }
  };

  const handleFieldUpdate = (event, fieldName, subFieldName) => {
    switch (fieldName) {
      case 'companyName':
        setCreateAccObj({ ...createAccObj, companyName: event.target.value });
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

  return (
    <DisplayDrawer
      open={open}
      zIndex={zIndexValues.ADD_COURSE_DRAWER}
      headerContent={headerContent}
      handleCloseDrawer={handleCloseDrawer}
      showCancelCta={false}
      width="546px"
    >
      <HorizontalContainer>
        <ContentSection>
          <Wrapper>
            {employersAgencyType?.map((employer) => (
              <SelectBox
                key={employer.key}
                label={employer.value}
                icon={employer.icon}
                selected={employer.checked}
                onClick={() => handleAgencySelect(employer)}
              />
            ))}
          </Wrapper>
        </ContentSection>
      </HorizontalContainer>
    </DisplayDrawer>
  );
};

export default SelectEmpAgencyDrawer;
