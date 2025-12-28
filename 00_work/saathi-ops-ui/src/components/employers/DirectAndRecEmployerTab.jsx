import React, { lazy, useState, Suspense, useEffect } from 'react';
import styled from 'styled-components';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BoxLoader from '../common/BoxLoader';
import {
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import usePermission from '../../hooks/usePermission';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../constants/permissions';
import { DIRECT_REC_AGENCY_TAB_HEADERS } from '../../constants/employer';
import DEandRAProfile from './DEandRAProfile';

import EmployerJobsTab from './EmployerJobsTab';
import { JOB_TAB, PAYMENT_TAB, PROFILE_TAB } from '../../constants';
import EmployerPaymentTab from './EmployerPaymentTab';

const Wrapper = styled.div`
  margin: 0px;
  padding: 0px;
`;

const StyledP = styled.p`
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize || '18px'};
  line-height: ${(props) => props.$lineHeight || '27px'};
  font-weight: ${(props) => props.$fontWeight || '600'};
  color: ${(props) => props.$color || '#000'};
`;

const DirectAndRecEmployerTab = ({
  currentIndex,
  setPageRoute,
  setShowBusinessVerificationPage,
  employerDataLoading,
  employerDataFetching,
  employerDataError,
  refetchEmployerData,
  selectedTab,
  setSelectedTab,
  openFilterDrawer,
  setOpenFilterDrawer,
  totalFiltersCount,
  setTotalFiltersCount,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  filterKeys = '',
  setFilterKeys,
  agencyType,
}) => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  // const type = searchParams.get('type');
  const tabHeaders = DIRECT_REC_AGENCY_TAB_HEADERS;

  const handleChange = (event, newValue) => {
    const currentTabName = tabHeaders[newValue].toLowerCase();
    if (currentTabName === JOB_TAB) {
      navigate(`/employers/${id}?tab=${currentTabName}${filterKeys}`);
    } else if (currentTabName === PROFILE_TAB) {
      navigate(`/employers/${id}?tab=${currentTabName}`);
    } else if (currentTabName === PAYMENT_TAB) {
      navigate(`/employers/${id}?tab=${currentTabName}`);
    }

    setSelectedTab(newValue);
  };
  const tabComponents = [
    hasPermission(EMPLOYER_MODULE_PERMISSIONS.VIEW_PROFILE_DETALILS) && (
      <DEandRAProfile
        currentIndex={currentIndex}
        setShowBusinessVerificationPage={setShowBusinessVerificationPage}
        setPageRoute={setPageRoute}
        refetchEmployerData={refetchEmployerData}
      />
    ),
    <EmployerJobsTab
      employerId={currentIndex?._id}
      openFilterDrawer={openFilterDrawer}
      setOpenFilterDrawer={setOpenFilterDrawer}
      totalFiltersCount={totalFiltersCount}
      setTotalFiltersCount={setTotalFiltersCount}
      filterKeys={filterKeys}
      setFilterKeys={setFilterKeys}
      currentPage={currentPage}
      setCurrentPage={setCurrentPage}
      itemsPerPage={itemsPerPage}
      setItemsPerPage={setItemsPerPage}
      agencyType={agencyType}
    />,
    <EmployerPaymentTab employerId={currentIndex?._id} />,
  ].filter(Boolean);

  return (
    <Wrapper>
      <div
        style={{
          padding: '10px 0px',
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#141482',
            },
          }}
          sx={{
            borderBottom: 1,
            borderBottomColor: '#CDD4DF',
          }}
        >
          {tabHeaders.map((item, idx) => {
            return (
              <Tab
                key={item}
                label={item}
                value={idx}
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  fontSize: '18px',
                  fontWeight: '500',
                  padding: '0px',
                  marginRight: '50px',
                  color: selectedTab === idx ? '#141482' : '#677995',
                }}
              />
            );
          })}
        </Tabs>
        <div
          style={{
            paddingTop: '20px',
          }}
        >
          <Suspense fallback={<BoxLoader size={5} />}>
            {tabComponents[selectedTab]}
          </Suspense>
        </div>
      </div>
    </Wrapper>
  );
};

export default DirectAndRecEmployerTab;
