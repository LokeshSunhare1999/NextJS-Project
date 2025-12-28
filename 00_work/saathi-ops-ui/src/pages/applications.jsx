import { Skeleton } from '@mui/material';
import { lazy, Suspense, useEffect, useState, useRef } from 'react';
import {
  useAsyncError,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import styleComponents from '../style/pageStyle';
import { getNestedProperty } from '../utils/helper';
import ICONS from '../assets/icons';
import usePermission from '../hooks/usePermission';
import { EMPLOYER_MODULE_PERMISSIONS } from '../constants/permissions';
import { useGetApplication } from '../apis/queryHooks';
import styled from 'styled-components';
import CustomerPageHeader from '../components/customerDetails/CustomerPageHeader';
import FilterDrawer from '../components/common/FilterDrawer';
import CustomCTA from '../components/CustomCTA';
import useApplicationFilters from '../components/applications/useApplicationFilters';
import ApplicantVideoDrawer from '../components/employers/ApplicantVideoDrawer';

const Pagination = lazy(
  () => import('../components/atom/tableComponents/Pagination'),
);
const DisplayTable = lazy(() => import('../components/DisplayTable'));

const {
  Wrapper,
  Top,
  Bottom,
  HeaderWrap,
  Header,
  AnimatedBox,
  Details,
  TableDiv,
} = styleComponents();

const WhiteBox = styled.div`
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
const DetailWrapper = styled.div`
  padding: 0px 40px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CTAWrapper = styled.div`
  flex-shrink: 0;
`;

const Applications = () => {
  const isMounted = useRef(false);
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { jobId } = useParams();
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropDownBottom, setOpenDropDownBottom] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [totalFiltersCount, setTotalFiltersCount] = useState(0);
  const [filterKeys, setFilterKeys] = useState('');
  const [biodataVideoDrawer, setBiodataVideoDrawer] = useState(false);
  const [interviewVideoDrawer, setInterviewVideoDrawer] = useState(false);
  const [applicantName, setApplicantName] = useState('');
  const [applicantScreeningStatus, setApplicantScreeningStatus] = useState('');
  const [applicantInterviewStatus, setApplicantInterviewStatus] = useState('');

  const handleLeftArrow = () => {
    navigate(-1);
  };

  const { data: allApplications, refetch: refetchApplicantData } =
    useGetApplication({
      jobId,
      itemsPerPage: itemsPerPage,
      currentPage: currentPage,
      filterKeys,
    });

  const {
    screeningStatusCheckboxes,
    finalStatusCheckboxes,
    interviewStatusCheckboxes,
    handleScreeningStatusCheckboxChange,
    handleFinalStatusCheckboxChange,
    handleInterviewStatusCheckboxChange,
    clearFilters,
    handleApplyClick,
  } = useApplicationFilters(
    setTotalFiltersCount,
    setFilterKeys,
    setOpenFilterDrawer,
    navigate,
    searchParams,
    setCurrentPage,
    setItemsPerPage,
    jobId,
  );

  const applicantBiodataVideoLink =
    allApplications?.customerJobApplications?.[actionIndex]?.bioDataVideoLink;
  const applicantInterviewVideoLink =
    allApplications?.customerJobApplications?.[actionIndex]?.interviewVideoLink;

  useEffect(() => {
    if (allApplications?.noOfApplications)
      setTotalItems(allApplications?.noOfApplications);
  }, [allApplications]);

  const headerValues =
    allApplications?.headers?.map((item) => item.value) || [];
  const headerTypes = allApplications?.headers?.map((item) => item.type) || [];

  function createData(applicationsDetails) {
    const headerKeys = Array.from(
      allApplications?.headers.map((item) => item.key),
    );
    return headerKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(applicationsDetails, itemKey);
    });
  }

  const rows =
    allApplications?.customerJobApplications?.map((item) => createData(item)) ||
    [];

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
    }
  };

  const handleDropDownBottom = () => {
    setOpenDropDownBottom(!openDropDownBottom);
  };

  const handleViewApplication = (e) => {
    e.stopPropagation();
    navigate(
      `/applications/${allApplications?.customerJobApplications?.[actionIndex]?._id}`,
    );
  };

  const handleRowClick = (index) => {
    navigate(
      `/applications/${allApplications?.customerJobApplications?.[index]?._id}`,
    );
  };

  const handleViewBiodataVideo = (e) => {
    e.stopPropagation();
    setApplicantName(
      allApplications?.customerJobApplications?.[actionIndex]?.name || '',
    );
    setApplicantScreeningStatus(
      allApplications?.customerJobApplications?.[actionIndex]?.applicationStatus
        ?.screeningStatus?.status || '',
    );

    setBiodataVideoDrawer(true);
  };

  const handleViewInterviewVideo = (e) => {
    e.stopPropagation();
    setApplicantName(
      allApplications?.customerJobApplications?.[actionIndex]?.name || '',
    );
    setApplicantInterviewStatus(
      allApplications?.customerJobApplications?.[actionIndex]?.applicationStatus
        ?.finalStatus?.status || '',
    );

    setInterviewVideoDrawer(true);
  };

  const arrBtn = [
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewApplication,
      permission: EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
    },
    {
      text: 'View Biodata Video',
      icon: ICONS.VIDEO_THUMBNAIL_GRAY,
      active: true,
      isVisible: !!applicantBiodataVideoLink,
      color: '#000',
      onClick: handleViewBiodataVideo,
      permission: EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
    },
    {
      text: 'View Interview Video',
      icon: ICONS.VIDEO_THUMBNAIL_GRAY,
      active: true,
      isVisible: !!applicantInterviewVideoLink,
      color: '#000',
      onClick: handleViewInterviewVideo,
      permission: EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
    },
  ];

  const filterCheckboxes = [
    {
      fieldType: 'filter',
      fieldHeader: 'Screening Status',
      filterHeader: 'Screening Status',
      headerWeight: '500',
      checkboxes: screeningStatusCheckboxes,
      handleCheckboxChange: handleScreeningStatusCheckboxChange,
    },
    {
      fieldType: 'filter',
      fieldHeader: 'Final Status',
      filterHeader: 'Final Status',
      headerWeight: '500',
      checkboxes: finalStatusCheckboxes,
      handleCheckboxChange: handleFinalStatusCheckboxChange,
    },
    {
      fieldType: 'filter',
      fieldHeader: 'Interview Status',
      filterHeader: 'Interview Status',
      headerWeight: '500',
      checkboxes: interviewStatusCheckboxes,
      handleCheckboxChange: handleInterviewStatusCheckboxChange,
    },
  ];

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (arrBtn.length > 0) {
      const hasAnyPermission = arrBtn.some((btn) =>
        hasPermission(btn.permission),
      );

      setShowActionsPanel(hasAnyPermission);
    }
  }, [arrBtn, hasPermission]);

  return (
    <Wrapper>
      <Top>
        <HeaderWrap>
          <Header>
            <WhiteBox onClick={() => handleLeftArrow()}>
              <Img
                src={ICONS.LEFT_ARROW_BLACK}
                alt="leftArrowBlack"
                width={'24px'}
                height={'24px'}
              />
            </WhiteBox>
          </Header>
        </HeaderWrap>
        <Suspense fallback={<div></div>}>
          <DetailWrapper>
            <CustomerPageHeader
              heading={
                allApplications?.title
                  ? allApplications?.title + ' - Applications'
                  : '-----'
              }
              // subHeading={`Job ID ${jobId} - Total: ${totalItems ?? '-----'}`}
              subHeading={`Total: ${totalItems ?? '-----'}`}
            />
            <CTAWrapper>
              <CustomCTA
                onClick={() => setOpenFilterDrawer(true)}
                url={ICONS.FILTER}
                title={`Filter (${totalFiltersCount ?? ''})`}
                showIcon={true}
                bgColor={'#677995'}
                color={'#FFF'}
                border={'none'}
                fontSize={'12px'}
                gap={'12px'}
              />
            </CTAWrapper>
          </DetailWrapper>
        </Suspense>
        <Suspense
          fallback={
            <AnimatedBox>
              {[1, 2, 3, 4, 5].map((item, idx) => {
                return <Skeleton animation="wave" height={70} key={idx} />;
              })}
            </AnimatedBox>
          }
        >
          <Details>
            <TableDiv>
              <DisplayTable
                tableId={'applicationTable'}
                highlightRow={true}
                rows={rows}
                headers={headerValues}
                showActionsPanel={showActionsPanel}
                headersType={headerTypes}
                tableWidth={'95%'}
                arrBtn={arrBtn}
                actionIndex={actionIndex}
                setActionIndex={setActionIndex}
                actionOpen={actionOpen}
                setActionOpen={setActionOpen}
                onClickFn={handleRowClick}
                arrBtnRight={'95px'}
              />
            </TableDiv>
          </Details>
        </Suspense>
      </Top>
      <Bottom>
        <Suspense fallback={<div></div>}>
          <Pagination
            onShowSizeChange={onShowSizeChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems}
            setTotalItems={setTotalItems}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            arrowBg={'#fff'}
            isFlexColumn={false}
            isBottom={true}
            setOpenDropdown={setOpenDropDownBottom}
            openDropdown={openDropDownBottom}
            handleDropdown={handleDropDownBottom}
          />
        </Suspense>
      </Bottom>
      <FilterDrawer
        open={openFilterDrawer}
        toggleDrawer={setOpenFilterDrawer}
        totalFiltersCount={totalFiltersCount}
        handleApplyClick={handleApplyClick}
        clearFilters={clearFilters}
        filterCheckboxes={filterCheckboxes}
      />
      <Suspense fallback={<div></div>}>
        {biodataVideoDrawer || interviewVideoDrawer ? (
          <ApplicantVideoDrawer
            open={biodataVideoDrawer || interviewVideoDrawer}
            toggleDrawer={() => {
              biodataVideoDrawer
                ? setBiodataVideoDrawer(false)
                : setInterviewVideoDrawer(false);
            }}
            headerTitle={
              biodataVideoDrawer
                ? `${applicantName}’s Biodata Video`
                : `${applicantName}’s Interview Video`
            }
            videoLink={
              biodataVideoDrawer
                ? applicantBiodataVideoLink
                : applicantInterviewVideoLink
            }
            applicationStatus={
              biodataVideoDrawer
                ? allApplications?.customerJobApplications?.[actionIndex]
                    ?.applicationStatus?.screeningStatus?.status
                : allApplications?.customerJobApplications?.[actionIndex]
                    ?.applicationStatus?.finalStatus?.status
            }
            applicantId={
              allApplications?.customerJobApplications?.[actionIndex]?._id
            }
            type={biodataVideoDrawer ? 'BIODATA_VIDEO' : 'INTERVIEW_VIDEO'}
            refetchApplicantData={refetchApplicantData}
            remarks={
              allApplications?.customerJobApplications?.[actionIndex]?.remarks
            }
            showRemarksSection={true}
          />
        ) : null}
      </Suspense>
    </Wrapper>
  );
};

export default Applications;
