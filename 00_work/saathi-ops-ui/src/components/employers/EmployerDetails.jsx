import React, { useEffect, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import { useSnackbar } from 'notistack';

const EmployerDetailsTab = lazy(() => import('./EmployerDetailsTabs'));
import {
  useDownloadEmployerJobs,
  useGetEmployerDetails,
  usePutUpdateEmployerStatus,
} from '../../apis/queryHooks';
import BusinessVerificationPage from './BusinessVerificationPage';
import DirectAndRecEmployerTab from './DirectAndRecEmployerTab';
import CustomCTA from '../CustomCTA';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';
import { agencyType, agencyTypeStyles } from '../../constants/employer';
import { JOB_TAB, PAYMENT_TAB } from '../../constants';
import DocumentStatus from '../customerDetails/DocumentStatus';
import DropDownCategory from '../DropDownCategory';
import GlobalPop from '../GlobalPop';
import { formatDate } from '../../utils/helper';
const CustomerPageHeader = lazy(
  () => import('../customerDetails/CustomerPageHeader'),
);

const Wrapper = styled.div`
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: 16px 40px;
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

const HeaderRight = styled.div`
  margin: 10px 0px 0px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`;

const HeaderWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor || '#f0f0f0'};
  color: ${({ textColor }) => textColor || '#333'};
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  border: 1px solid ${({ borderColor }) => borderColor || '#dcdcdc'};
  font-family: Poppins;
`;

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Reduce the gap between elements */
  flex-wrap: nowrap; /* Prevent wrapping */
`;

const ProfileStatus = styled.div`
  font-family: Poppins;
  display: flex;
  flex-direction: column;
`;

const ProfileHeader = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  font-size: 14px;
  align-items: center;
  margin: 0 0 5px 0;
  font-weight: 500;
`;
const ValidTillBox = styled.div`
  display: flex;
  flex-direction: row;
  background: #0071f2;
  color: #ffffff;
  padding: 8px;
  font-size: 14px;
  font-weight: 500;
  border-radius: 8px;
`;

const EmployerDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const { id } = useParams();
  const { hasPermission } = usePermission();
  const employerId = location.pathname.substring(11, location.pathname.length);
  const [showBusinessVerificationPage, setShowBusinessVerificationPage] =
    useState(false);
  const [pageRoute, setPageRoute] = useState('');

  /** For Direct Employers and Rec. Agency */
  const [searchParams] = useSearchParams();
  const [selectedTab, setSelectedTab] = useState(0);
  const currentTab = searchParams.get('tab');
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [totalFiltersCount, setTotalFiltersCount] = useState(0);
  const [filterKeys, setFilterKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [downloadCsv, setDownloadCsv] = useState(false);
  const [isActivationDropdownOpen, setIsActivationDropdownOpen] =
    useState(false);
  const [isActivationPopupOpen, setIsActivationPopupOpen] = useState(false);
  const {
    data: employerJobsData,
    isLoading: employerJobsDataLoading,
    isFetching: employerJobsDataFetching,
    refetch,
  } = useDownloadEmployerJobs({
    employerId,
    currentPage,
    itemsPerPage,
    filterKeys,
    downloadCsv,
  });
  const {
    mutateAsync: updateEmployerStatusMutation,
    status: updateEmployerStatusStatus,
    isError: isUpdateEmployerStatusErr,
    error: updateEmployerStatusErr,
  } = usePutUpdateEmployerStatus(employerId);

  useEffect(() => {
    if (employerJobsData?.fileLink) {
      window.open(employerJobsData?.fileLink, '_blank');
      setDownloadCsv(false);
    }
  }, [employerJobsData?.fileLink]);

  const downloadTemplate = async () => {
    setDownloadCsv(true);
    refetch();
  };

  const {
    data: employerData,
    isLoading: isEmployerDataLoading,
    isFetching: isEmployerDataFetching,
    isError: isEmployerDataError,
    error: employerDataError,
    refetch: refetchEmployerData,
  } = useGetEmployerDetails(employerId);

  useEffect(() => {
    setSelectedTab(0);
  }, [id]);

  useEffect(() => {
    if (currentTab === JOB_TAB) {
      setSelectedTab(1);
      return;
    } else if (currentTab === PAYMENT_TAB) {
      setSelectedTab(2);
      return;
    }
    setSelectedTab(0);
  }, [currentTab]);

  useEffect(() => {
    if (isEmployerDataError) {
      enqueueSnackbar('Error while fetching employer details', {
        variant: 'error',
      });
    }
  }, [isEmployerDataError]);

  const handleLeftArrow = () => {
    navigate(-1);
  };

  const handleAddNewJob = (index) => {
    if (!hasPermission(EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS))
      return;
    sessionStorage?.removeItem('jobId');
    navigate(
      `/employers/${employerId}/add-job?agencyType=${employerData?.employersAgencyType}`,
      {
        state: {
          employerName: employerData?.companyRegisteredName,
        },
      },
    );
  };

  if (showBusinessVerificationPage) {
    return (
      <BusinessVerificationPage
        employerData={employerData}
        setShowBusinessVerificationPage={setShowBusinessVerificationPage}
        isEmployerDataLoading={isEmployerDataLoading}
        isEmployerDataFetching={isEmployerDataFetching}
        employerDataError={employerDataError}
        refetchEmployerData={refetchEmployerData}
        pageRoute={pageRoute}
        setPageRoute={setPageRoute}
      />
    );
  }

  const handleActivationStatus = () => {
    updateEmployerStatusMutation({
      activationStatus: 'ACTIVATED',
    })
      .then(() => {
        enqueueSnackbar('Employer profile activated successfully.', {
          variant: 'success',
        });
        refetchEmployerData();
      })
      .catch(() => {
        enqueueSnackbar('Something went wrong', { variant: 'error' });
      })
      .finally(() => {
        setIsActivationPopupOpen(false);
      });
  };

  const employerTypeCheck =
    employerData?.employersAgencyType === 'DIRECT_EMPLOYER' ||
    employerData?.employersAgencyType === 'RECRUITMENT_AGENCY';

  return (
    <Wrapper>
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
        <HeaderWrap>
          <FlexWrapper>
            <div>
              <CustomerPageHeader
                heading={employerData?.companyRegisteredName ?? '-----'}
                subHeading={`Company ID: ${employerData?.uniqueAgencyId ?? '-----'}`}
              />
            </div>
            <StatusPill
              bgColor={
                agencyTypeStyles[employerData?.employersAgencyType]?.bgColor ||
                '#f0f0f0'
              }
              textColor={
                agencyTypeStyles[employerData?.employersAgencyType]
                  ?.textColor || '#333'
              }
              borderColor={
                agencyTypeStyles[employerData?.employersAgencyType]?.bgColor ||
                '#dcdcdc'
              }
            >
              {agencyType[employerData?.employersAgencyType]}
            </StatusPill>
          </FlexWrapper>
          {selectedTab === 1 ? (
            <HeaderRight>
              <CustomCTA
                onClick={() => setOpenFilterDrawer(true)}
                url={ICONS.FILTER}
                disabled={!employerJobsData?.totalJobs}
                title={`Filter (${totalFiltersCount ?? ''})`}
                showIcon={true}
                bgColor={'#677995'}
                color={'#FFF'}
                border={'none'}
                fontSize={'12px'}
                gap={'12px'}
              />
              <CustomCTA
                onClick={downloadTemplate}
                title="Download"
                showIcon={true}
                color="#141482"
                bgColor="#ffffff"
                border="1px solid #141482"
                url={ICONS.DOWNLOAD}
                // isPermitted={hasPermission(COURSE_MODULE_PERMISSIONS?.DOWNLOAD_TEMPLATE)}
              />
              <CustomCTA
                onClick={handleAddNewJob}
                title="New Job"
                showIcon={true}
                color="#FFF"
                bgColor="#141482"
                border="1px solid #CDD4DF"
                disabled={
                  !hasPermission(
                    EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
                  )
                }
              />
            </HeaderRight>
          ) : selectedTab === 2 ? null : employerTypeCheck ? (
            <HeaderRight>
              <ProfileStatus>
                <ProfileHeader>
                  Profile Status:
                  <DocumentStatus status={employerData?.activationStatus} />
                </ProfileHeader>
                {employerData?.activationStatus !== 'ACTIVATED' ? (
                  <DropDownCategory
                    isBoxShadow
                    border="1px solid #677995"
                    top="42px"
                    category="Choose Status"
                    handleCategorySelect={() => setIsActivationPopupOpen(true)}
                    categoryOpen={isActivationDropdownOpen}
                    setCategoryOPen={setIsActivationDropdownOpen}
                    listItem={['ACTIVATE']}
                  />
                ) : null}
              </ProfileStatus>
            </HeaderRight>
          ) : null}
        </HeaderWrap>
      </Suspense>
      <Suspense fallback={<div></div>}>
        {employerTypeCheck ? (
          <DirectAndRecEmployerTab
            currentIndex={employerData}
            employerDataLoading={isEmployerDataLoading}
            employerDataFetching={isEmployerDataFetching}
            employerDataError={isEmployerDataError}
            refetchEmployerData={refetchEmployerData}
            setShowBusinessVerificationPage={setShowBusinessVerificationPage}
            setPageRoute={setPageRoute}
            selectedTab={selectedTab}
            setSelectedTab={setSelectedTab}
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
            agencyType={employerData?.employersAgencyType}
          />
        ) : (
          <EmployerDetailsTab
            currentIndex={employerData}
            employerDataLoading={isEmployerDataLoading}
            employerDataFetching={isEmployerDataFetching}
            employerDataError={isEmployerDataError}
            refetchEmployerData={refetchEmployerData}
            setShowBusinessVerificationPage={setShowBusinessVerificationPage}
            setPageRoute={setPageRoute}
          />
        )}
        {isActivationPopupOpen ? (
          <GlobalPop
            setOpenDeletePop={setIsActivationPopupOpen}
            title={'Confirm Action: Activated'}
            subHeading={'Profile Status will be changed to Activated'}
            btnTitle={'Activate'}
            btnBgColor={'#32B237'}
            handleDelete={handleActivationStatus}
          />
        ) : null}
      </Suspense>
    </Wrapper>
  );
};

export default EmployerDetails;
