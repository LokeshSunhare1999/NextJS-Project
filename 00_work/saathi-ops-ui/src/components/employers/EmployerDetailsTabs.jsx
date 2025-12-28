import React, { lazy, useState, Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BoxLoader from '../common/BoxLoader';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import usePermission from '../../hooks/usePermission';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../constants/permissions';
import {
  EMPLOYER_TAB_HEADERS,
  EMPLOYER_TAB_MAP,
} from '../../constants/employer';
import EmployerProfile from './EmployerProfile';
import { generateSearchParams } from '../../utils/helper';

const EmployerStaffTab = lazy(() => import('./EmployerStaffTab'));
const EmployerReferralTab = lazy(() => import('./EmployerReferralTab'));

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

const EmployerDetailsTab = ({
  currentIndex,
  setPageRoute,
  setShowBusinessVerificationPage,
  employerDataLoading,
  employerDataFetching,
  employerDataError,
  refetchEmployerData,
}) => {
  const { hasPermission } = usePermission();
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentTab = searchParams.get('tab')?.toLowerCase() ?? 'profile';
  useEffect(() => {
    const tabIndex =
      EMPLOYER_TAB_MAP[currentTab] !== undefined
        ? EMPLOYER_TAB_MAP[currentTab]
        : 0;

    setSelectedTab(tabIndex);
  }, [id, currentTab]);

  const getFilteredTabHeaders = (hasPermission) => {
    return EMPLOYER_TAB_HEADERS.filter((_, index) => {
      switch (index) {
        case 0:
          return hasPermission(
            EMPLOYER_MODULE_PERMISSIONS.VIEW_PROFILE_DETALILS,
          );
        case 1:
          return hasPermission(
            EMPLOYER_MODULE_PERMISSIONS.VIEW_REFERRAL_DETAILS,
          );
        case 2:
          return hasPermission(EMPLOYER_MODULE_PERMISSIONS.VIEW_STAFF_DETAILS);
        default:
          return false;
      }
    });
  };

  const tabHeaders = getFilteredTabHeaders(hasPermission);

  const handleChange = (event, newValue) => {
    const currentTabName = tabHeaders[newValue].toLowerCase();
    navigate(`/employers/${id}?tab=${currentTabName}`);
    setSelectedTab(newValue);
  };

  const tabComponents = [
    hasPermission(EMPLOYER_MODULE_PERMISSIONS.VIEW_PROFILE_DETALILS) && (
      <EmployerProfile
        currentIndex={currentIndex}
        setShowBusinessVerificationPage={setShowBusinessVerificationPage}
        setPageRoute={setPageRoute}
        refetchEmployerData={refetchEmployerData}
      />
    ),
    hasPermission(EMPLOYER_MODULE_PERMISSIONS.VIEW_REFERRAL_DETAILS) && (
      <EmployerReferralTab
        userId={currentIndex?.user}
        referralLink={currentIndex?.referralLink}
      />
    ),
    hasPermission(EMPLOYER_MODULE_PERMISSIONS.VIEW_STAFF_DETAILS) && (
      <EmployerStaffTab />
    ),
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

export default EmployerDetailsTab;
