import React, { useEffect, useState, lazy, Suspense, useRef } from 'react';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import {
  useGetAutoSuggestedData,
  useGetUserBasicDetails,
} from '../apis/queryHooks';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
const CustomerDetailsTabs = lazy(
  () => import('../components/customerDetails/CustomerDetailsTabs'),
);
import { useGetCustomerDetails } from '../apis/queryHooks';
import useDeviceType from '../hooks/useDeviceType';
import { DEVICE_TYPES } from '../constants';
const WorkExp = lazy(() => import('../components/workexp/WorkExp'));
const CustomerPageHeader = lazy(
  () => import('../components/customerDetails/CustomerPageHeader'),
);
const VerificationPage = lazy(
  () => import('../components/verification/VerificationDetails'),
);
const JobReelsVerificationPage = lazy(
  () => import('../components/verification/JobReelsVerification'),
);

const Wrapper = styled.div`
  margin: ${(props) =>
    props?.$deviceType === DEVICE_TYPES?.MOBILE
      ? '61px 0 0 0px'
      : '61px 0 0 265px'};
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: ${(props) =>
    props?.$deviceType === DEVICE_TYPES?.MOBILE ? '16px 20px' : '16px 40px'};
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  display: inline-flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const CustomerDetails = () => {
  const deviceType = useDeviceType();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const [showVerificationPage, setShowVerificationPage] = useState(false);
  const [showWorkExperiencePage, setShowWorkExperiencePage] = useState(false);
  const [showJobReelPage, setShowJobReelPage] = useState(false);
  const [pageRoute, setPageRoute] = useState('');
  const [workExpIndex, setWorkExpIndex] = useState(null);
  const [jobReelsIndex, setJobReelsIndex] = useState(0);
  const [jobreelId, setJobReelId] = useState(null);
  const customerId = location.pathname.substring(11, location.pathname.length);
  const isMounted = useRef(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const jobReelValue = searchParams.get('jobReel');

    if (jobReelValue !== null) {
      const index = parseInt(jobReelValue, 10);
      if (!isNaN(index)) {
        setJobReelsIndex(index);
        setShowJobReelPage(true);
      }
    }
  }, [searchParams]);

  const {
    data: customerData,
    isLoading: isCustomerDataLoading,
    isFetching: isCustomerDataFetching,
    isError: isCustomerDataError,
    error: customerDataError,
    refetch: refetchCustomerData,
  } = useGetCustomerDetails(customerId);

  const {
    data: userBasicDetails,
    isLoading: isUserBasicDetailsLoading,
    isFetching: isUserBasicDetailsFetching,
    isError: isUserBasicDetailsError,
    error: userBasicDetailsError,
    refetch: refetchUserBasicDetails,
  } = useGetUserBasicDetails(customerId);

  const { data: autoSuggestedJobreelData } = useGetAutoSuggestedData(jobreelId);

  useEffect(() => {
    jobReelsIndex === 0
      ? setJobReelId(userBasicDetails?.jobReelId)
      : setJobReelId(userBasicDetails?.updatedJobReelId);
  }, [userBasicDetails, jobReelsIndex]);

  useEffect(() => {
    if (isCustomerDataError) {
      enqueueSnackbar('Error while fetching customer details', {
        variant: 'error',
      });
    }
  }, [isCustomerDataError]);

  const handleLeftArrow = () => {
    navigate(-1);
  };
  if (showJobReelPage) {
    return (
      <JobReelsVerificationPage
        customerData={customerData}
        customerProfileData={userBasicDetails}
        isCustomerDataFetching={isCustomerDataFetching}
        customerDataError={customerDataError}
        isCustomerDataError={isCustomerDataError}
        refetchCustomerData={refetchCustomerData}
        refetchUserBasicDetails={refetchUserBasicDetails}
        setShowJobReelPage={setShowJobReelPage}
        pageRoute={pageRoute}
        setPageRoute={setPageRoute}
        navigate={navigate}
        jobReelsIndex={jobReelsIndex}
        autoSuggestedJobreelData={autoSuggestedJobreelData}
      />
    );
  }

  if (showVerificationPage) {
    return (
      <Suspense fallback={<div></div>}>
        <VerificationPage
          customerData={customerData}
          isCustomerDataFetching={isCustomerDataFetching}
          customerDataError={customerDataError}
          isCustomerDataError={isCustomerDataError}
          refetchCustomerData={refetchCustomerData}
          setShowVerificationPage={setShowVerificationPage}
          pageRoute={pageRoute}
          setPageRoute={setPageRoute}
        />
      </Suspense>
    );
  }

  if (showWorkExperiencePage) {
    return (
      <Suspense fallback={<div></div>}>
        <WorkExp
          customerData={customerData}
          employments={customerData?.employments}
          workExpIndex={workExpIndex}
          isCustomerDataFetching={isCustomerDataFetching}
          customerDataError={customerDataError}
          isCustomerDataError={isCustomerDataError}
          refetchCustomerData={refetchCustomerData}
          setShowWorkExperiencePage={setShowWorkExperiencePage}
        />
      </Suspense>
    );
  }
  return (
    <Wrapper $deviceType={deviceType}>
      <Header>
        <Left onClick={() => handleLeftArrow()}>
          <Img
            src={ICONS.LEFT_ARROW_BLACK}
            alt="leftArrowBlack"
            width={'24px'}
            height={'24px'}
          />
        </Left>
      </Header>
      <Suspense fallback={<div></div>}>
        <CustomerPageHeader
          heading={customerData?.name ? customerData?.name : '-----'}
          subHeading={`Customer ID: ${customerData?._id ? customerData?._id : '-----'}`}
        />
      </Suspense>
      <Suspense fallback={<div></div>}>
        <CustomerDetailsTabs
          userData={customerData}
          userDataLoading={isCustomerDataLoading}
          isUserDataError={isCustomerDataError}
          setPageRoute={setPageRoute}
          setWorkExpIndex={setWorkExpIndex}
          setShowVerificationPage={setShowVerificationPage}
          setShowWorkExperiencePage={setShowWorkExperiencePage}
          setShowJobReelPage={setShowJobReelPage}
          refetchCustomerData={refetchCustomerData}
          deviceType={deviceType}
          setJobReelsIndex={setJobReelsIndex}
        />
      </Suspense>
    </Wrapper>
  );
};

export default CustomerDetails;
