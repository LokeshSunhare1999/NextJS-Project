import React, { lazy, useState, Suspense, useEffect } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import BoxLoader from '../common/BoxLoader';
import {
  CUSTOMER_MODULE,
  DEVICE_TYPES,
  CUSTOMERS_TAB_MAP,
} from '../../constants';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import usePermission from '../../hooks/usePermission';
import {
  CUSTOMER_DETAILS_PERMISSIONS,
  CUSTOMER_PERMISSIONS,
} from '../../constants/permissions';
import CustomerDeviceTab from './CustomerDeviceTab';
const CustomerInfoTab = lazy(() => import('./CustomerInfoTab'));
const CustomerPaymentDetailsTab = lazy(
  () => import('./CustomerPaymentDetailsTab'),
);
const CustomerCoursesDetailsTab = lazy(
  () => import('./CustomerCoursesDetailsTab'),
);
const CustomerOrderDetailsTab = lazy(() => import('./CustomerOrderDetailsTab'));
const CustomerReferalTab = lazy(() => import('./CustomerReferalTab'));
const CustomerApplicationsTab = lazy(() => import('./CustomerApplicationsTab'));

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

const CustomerDetailsTabs = ({
  userData,
  userDataLoading,
  isUserDataError,
  setPageRoute,
  setWorkExpIndex,
  setJobReelsIndex,
  setShowVerificationPage,
  setShowWorkExperiencePage,
  setShowJobReelPage,
  refetchCustomerData,
  deviceType,
}) => {
  const { hasPermission } = usePermission();
  const { id } = useParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const [totalPurchasedCourses, setTotalPurchasedCourses] = useState(0);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentTab = searchParams.get('tab')?.toLowerCase() ?? 'trueid';

  useEffect(() => {
    const tabIndex =
      CUSTOMERS_TAB_MAP[currentTab] !== undefined
        ? CUSTOMERS_TAB_MAP[currentTab]
        : 0;

    setSelectedTab(deviceType !== DEVICE_TYPES?.DESKTOP ? 5 : tabIndex);
  }, [deviceType, id, currentTab]);

  const getFilteredTabHeaders = (hasPermission) => {
    return CUSTOMER_MODULE?.CUSTOMER_TAB_HEADERS.filter((_, index) => {
      switch (index) {
        case 0:
          return hasPermission(CUSTOMER_DETAILS_PERMISSIONS.VIEW_BASIC_DETAILS);
        case 1:
          return hasPermission(CUSTOMER_DETAILS_PERMISSIONS.VIEW_BASIC_DETAILS);
        case 2:
          return hasPermission(CUSTOMER_PERMISSIONS.VIEW_PAYMENT_DETAILS);
        case 3:
          return hasPermission(CUSTOMER_PERMISSIONS.VIEW_ORDER_DETAILS);
        case 4:
          return hasPermission(CUSTOMER_PERMISSIONS.VIEW_COURSES_DETAILS);
        case 5:
          return hasPermission(CUSTOMER_PERMISSIONS.VIEW_REFERAL_DETAILS);
        case 6:
          return hasPermission(CUSTOMER_PERMISSIONS.VIEW_REFERAL_DETAILS);
        default:
          return false;
      }
    });
  };

  const tabHeaders = isUserDataError
    ? []
    : getFilteredTabHeaders(hasPermission);

  const handleChange = (event, newValue) => {
    const currentTabName = tabHeaders[newValue].toLowerCase();
    navigate(`/customers/${id}?tab=${currentTabName}`);
    setSelectedTab(newValue);
  };

  const tabComponents = [
    hasPermission(CUSTOMER_DETAILS_PERMISSIONS.VIEW_BASIC_DETAILS) && (
      <CustomerInfoTab
        userInfo={userData}
        setPageRoute={setPageRoute}
        setWorkExpIndex={setWorkExpIndex}
        setJobReelsIndex={setJobReelsIndex}
        setShowVerificationPage={setShowVerificationPage}
        setShowWorkExperiencePage={setShowWorkExperiencePage}
        setShowJobReelPage={setShowJobReelPage}
        refetchCustomerData={refetchCustomerData}
        navigate={navigate}
      />
    ),
    hasPermission(CUSTOMER_DETAILS_PERMISSIONS.VIEW_BASIC_DETAILS) && (
      <CustomerApplicationsTab userData={userData} />
    ),
    hasPermission(CUSTOMER_PERMISSIONS.VIEW_PAYMENT_DETAILS) && (
      <CustomerPaymentDetailsTab userId={userData?.userId || ''} />
    ),
    hasPermission(CUSTOMER_PERMISSIONS.VIEW_ORDER_DETAILS) && (
      <CustomerOrderDetailsTab userId={userData?.userId || ''} />
    ),
    hasPermission(CUSTOMER_PERMISSIONS.VIEW_COURSES_DETAILS) && (
      <CustomerCoursesDetailsTab
        customerId={userData?._id || ''}
        setTotalPurchasedCourses={setTotalPurchasedCourses}
      />
    ),
    hasPermission(CUSTOMER_PERMISSIONS.VIEW_REFERAL_DETAILS) && (
      <CustomerReferalTab
        userId={userData?.userId || ''}
        deviceType={deviceType}
        customerId={userData?._id || ''}
      />
    ),
    hasPermission(CUSTOMER_PERMISSIONS.VIEW_REFERAL_DETAILS) && (
      <CustomerDeviceTab userId={userData?.userId || ''} />
    ),
  ].filter(Boolean);

  return (
    <Wrapper>
      <div
        style={{
          padding: '10px 0px',
        }}
      >
        {/* {selectedTab === 3 ? (
          <StyledP>Total Purchased Courses: {totalPurchasedCourses}</StyledP>
        ) : null} */}
        {deviceType === DEVICE_TYPES?.DESKTOP ? (
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
        ) : null}
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

CustomerDetailsTabs.propTypes = {
  userData: PropTypes.object,
  userDataLoading: PropTypes.bool,
  isUserDataError: PropTypes.bool,
  setPageRoute: PropTypes.func,
  setShowVerificationPage: PropTypes.func,
};

export default CustomerDetailsTabs;
