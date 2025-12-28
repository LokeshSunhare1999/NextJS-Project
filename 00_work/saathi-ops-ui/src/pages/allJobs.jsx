import { Skeleton } from '@mui/material';
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import CustomCTA from '../components/CustomCTA';
import styleComponents from '../style/pageStyle';
import ICONS from '../assets/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetAllJobs } from '../apis/queryHooks';
import { PAGE_SOURCE } from '../constants/job';
const Pagination = lazy(
  () => import('../components/atom/tableComponents/Pagination'),
);
const DisplayTable = lazy(() => import('../components/DisplayTable'));
import { generateSearchParams } from '../utils/helper';
import useAllJobsFilter from '../hooks/employer/useAllJobsFilter';
const FilterDrawer = lazy(() => import('../components/common/FilterDrawer'));

const HeaderWrap = styled.div`
  width: calc(100% - 80px);
  margin: 0px 60px 20px 40px;
  padding: 10px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Details = styled.div`
  width: calc(100% - 40px);
  margin: 50px 40px;
`;
const { Wrapper, Top, Bottom, TableDiv, Header, HeaderTitle, HeaderRight } =
  styleComponents();
const AllJobs = () => {
  const isMounted = useRef(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showActionsPanel, setShowActionsPanel] = useState(true);
  const [totalJobs, setTotalJobs] = useState(0);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [totalFiltersCount, setTotalFiltersCount] = useState(0);
  const [filterKeys, setFilterKeys] = useState('');
  const [jobsTableHeaderData, setJobsTableHeaderData] = useState([]);
  const [jobsData, setJobsData] = useState([]);

  const {
    statusCheckBoxes,
    categoryCheckboxes,
    jobPostedbyCheckBoxes,
    handleCategoryCheckboxesChange,
    handleJobPostedbyCheckBoxesChange,
    handleJobStatusCheckBoxesChange,
    clearFilters,
    handleApplyClick,
  } = useAllJobsFilter(
    PAGE_SOURCE.ALL_JOBS,
    setTotalFiltersCount,
    setFilterKeys,
    setOpenFilterDrawer,
    navigate,
    null,
    searchParams,
    setCurrentPage,
    setItemsPerPage,
  );

  const filterCheckboxes = [
    {
      fieldType: 'filter',
      filterHeader: 'Job Status',
      headerWeight: '500',
      checkboxes: statusCheckBoxes,
      handleCheckboxChange: handleJobStatusCheckBoxesChange,
      filterClassname: { justifyContent: 'space-between' },
    },
    {
      fieldType: 'filter',
      filterHeader: 'Category',
      headerWeight: '500',
      checkboxes: categoryCheckboxes,
      handleCheckboxChange: handleCategoryCheckboxesChange,
      filterClassname: { justifyContent: 'space-between' },
    },
  ];

  const {
    data: allJobsData,
    isLoading: allJobsDataLoading,
    isFetching: allJobsDataFetching,
  } = useGetAllJobs({ currentPage, itemsPerPage, filterKeys });

  const headerKeys = Array.from(jobsTableHeaderData.map((item) => item.key));
  function createData(jobDetails) {
    return headerKeys?.map((item) => jobDetails[item]);
  }
  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };
  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);
      const queryString = generateSearchParams(searchParams);
      navigate(`/all-jobs?${queryString}`, { replace: true });
    }
  };
  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    const jobId = allJobsData?.jobs[actionIndex]?._id;
    navigate(`/job/${jobId}`);
  };

  const handleRowClick = (index) => {
    const jobId = allJobsData?.jobs[index]?._id;
    navigate(`/job/${jobId}`);
  };

  useEffect(() => {
    if (!allJobsDataLoading) {
      setJobsTableHeaderData(allJobsData?.headers?.metaData || []);
      setJobsData(allJobsData?.jobs || []);
      setTotalJobs(allJobsData?.totalJobs || 0);
    }
  }, [allJobsDataLoading, allJobsDataFetching, allJobsData]);

  const tableHeaders = Array.from(
    jobsTableHeaderData.map((item) => item.value),
  );
  const headerTypes = Array.from(
    jobsTableHeaderData.map((item) =>
      item.key === 'employerCategory' ? 'AGENCY' : item.type,
    ),
  );

  const rows = Array.from(jobsData.map((item) => createData(item)));

  const arrBtn = [
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#586276',
      onClick: handleViewDetailsClick,
    },
  ];

  const createJobsExpiryDateArray = (data) => {
    let expiryDateArray = [];
    data?.jobs?.map((item) => {
      expiryDateArray.push(item?.jobExpiryDate);
    });
    return expiryDateArray;
  };

  return (
    <Wrapper>
      <Top>
        <HeaderWrap>
          <Header>
            <HeaderTitle>All Jobs</HeaderTitle>
          </Header>

          <HeaderRight>
            {' '}
            <CustomCTA
              onClick={() => setOpenFilterDrawer(true)}
              url={ICONS.FILTER}
              title={`Filter (${totalFiltersCount ?? ''}) `}
              showIcon={true}
              bgColor={'#677995'}
              color={'#FFF'}
              border={'none'}
              fontSize={'12px'}
              gap={'12px'}
            />
          </HeaderRight>
        </HeaderWrap>
        <Suspense fallback={<div></div>}>
          <Details>
            <TableDiv>
              <DisplayTable
                tableId={'allJobsTable'}
                rows={rows}
                headers={tableHeaders}
                headersType={headerTypes}
                showActionsPanel={showActionsPanel}
                arrBtn={arrBtn}
                actionIndex={actionIndex}
                setActionIndex={setActionIndex}
                actionOpen={actionOpen}
                setActionOpen={setActionOpen}
                arrBtnRight={'80px'}
                navigate={navigate}
                onClickFn={handleRowClick}
                customProps={{
                  jobExpiryDate: createJobsExpiryDateArray(allJobsData),
                }}
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
            totalItems={totalJobs}
            setTotalItems={setTotalJobs}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            arrowBg={'#fff'}
            isFlexColumn={false}
            isBottom={true}
            setOpenDropdown={setOpenDropdown}
            openDropdown={openDropdown}
            handleDropdown={handleDropdown}
            searchParams={searchParams}
            navigate={navigate}
            pageType={'all-jobs'}
          />
          <FilterDrawer
            open={openFilterDrawer}
            toggleDrawer={setOpenFilterDrawer}
            totalFiltersCount={totalFiltersCount}
            handleApplyClick={handleApplyClick}
            clearFilters={clearFilters}
            filterCheckboxes={filterCheckboxes}
          />
        </Suspense>
      </Bottom>
    </Wrapper>
  );
};
export default AllJobs;
