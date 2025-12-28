import React, { lazy, Suspense, useState, useEffect } from 'react';
import BoxLoader from '../common/BoxLoader';
import useEmployerJobs from '../../hooks/employer/useEmployerJobs';
import styled from 'styled-components';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ICONS from '../../assets/icons';
const DisplayTable = lazy(() => import('../DisplayTable'));
const Pagination = lazy(
  () => import('../../components/atom/tableComponents/Pagination'),
);
import { generateSearchParams } from '../../utils/helper';
import { PAGE_SOURCE } from '../../constants/job';
import useAllJobsFilter from '../../hooks/employer/useAllJobsFilter';
const FilterDrawer = lazy(() => import('../common/FilterDrawer'));

const Wrapper = styled.div`
  margin: 0px;
  padding: 0px;
  font-family: Poppins;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80vh;
`;
const TableDiv = styled.div`
  position: relative;
`;

const PaginationDiv = styled.div`
  margin-top: 20px;
`;

const EmployerJobsTab = ({
  employerId,
  openFilterDrawer,
  setOpenFilterDrawer,
  totalFiltersCount,
  setTotalFiltersCount,
  filterKeys,
  setFilterKeys,
  currentPage,
  setCurrentPage,
  itemsPerPage,
  setItemsPerPage,
  agencyType,
}) => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  // const [itemsPerPage, setItemsPerPage] = useState(10);
  // const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);

  const {
    statusCheckBoxes,
    jobPostedbyCheckBoxes,
    handleJobPostedbyCheckBoxesChange,
    handleJobStatusCheckBoxesChange,
    clearFilters,
    handleApplyClick,
  } = useAllJobsFilter(
    PAGE_SOURCE.EMPLOYER_JOBS,
    setTotalFiltersCount,
    setFilterKeys,
    setOpenFilterDrawer,
    navigate,
    employerId,
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
      filterHeader: 'Posted By',
      headerWeight: '500',
      checkboxes: jobPostedbyCheckBoxes,
      handleCheckboxChange: handleJobPostedbyCheckBoxesChange,
      filterClassname: { gap: '260px' },
    },
  ];

  const {
    employerJobTableHeaders,
    employerJobsHeaders,
    employerJobsRows,
    employerJobsData,
  } = useEmployerJobs({
    filterKeys,
    employerId,
    currentPage,
    itemsPerPage,
  });

  const createJobsDataArray = (data) => {
    let expiryDateArray = [];
    let yetToShortlistCountArray = [];
    data?.jobs?.map((item) => {
      expiryDateArray.push(item?.jobExpiryDate);
      yetToShortlistCountArray.push(item?.yetToShortlistCount);
    });
    return { expiryDateArray, yetToShortlistCountArray };
  };

  const { expiryDateArray, yetToShortlistCountArray } =
    createJobsDataArray(employerJobsData);

  useEffect(() => {
    setTotalItems(employerJobsData?.totalJobs || 10);
  }, [employerJobsData]);

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);

      const queryString = generateSearchParams(searchParams);
      navigate(`/employers/${employerId}?${queryString}`, {
        replace: true,
      });
    }
  };
  useEffect(() => {
    setCurrentPage(Number(searchParams.get('currentPage')) || 1);
    setItemsPerPage(Number(searchParams.get('itemsPerPage')) || 10);
  }, []);
  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const headerTypes = Array.from(
    employerJobsHeaders?.map((item) =>
      item.value === 'Video' ? 'VIDEO' : item.type,
    ),
  );
  const handleRowClick = (index) => {
    navigate(`/job/${employerJobsData?.jobs?.[index]._id}?agencyType=${agencyType}`);
  };

  const arrBtn = [
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: () => handleRowClick(actionIndex),
    },
  ];

  return (
    <Wrapper>
      <Suspense fallback={<BoxLoader size={5} />}>
        <TableDiv>
          {employerJobsHeaders?.length > 0 ? (
            <DisplayTable
              showActionsPanel
              tableId={'employerJobs'}
              rows={employerJobsRows}
              headers={employerJobTableHeaders}
              headersType={headerTypes}
              tableWidth={'100%'}
              emptyDataMessage="There are no Jobs"
              actionIndex={actionIndex}
              setActionIndex={setActionIndex}
              actionOpen={actionOpen}
              setActionOpen={setActionOpen}
              arrBtn={arrBtn}
              navigate={navigate}
              customProps={{
                jobExpiryDate: expiryDateArray,
                yetToShortlistCount: yetToShortlistCountArray,
                agencyType,
              }}
            />
          ) : (
            <BoxLoader size={5} />
          )}
        </TableDiv>

        <PaginationDiv>
          <Pagination
            onShowSizeChange={onShowSizeChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems}
            setTotalItems={setTotalItems}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            isBottom={true}
            setOpenDropdown={setOpenDropdown}
            openDropdown={openDropdown}
            handleDropdown={handleDropdown}
            searchParams={searchParams}
            navigate={navigate}
            pageType={`employers/${employerId}`}
          />
        </PaginationDiv>

        <FilterDrawer
          open={openFilterDrawer}
          toggleDrawer={setOpenFilterDrawer}
          totalFiltersCount={totalFiltersCount}
          handleApplyClick={handleApplyClick}
          clearFilters={clearFilters}
          filterCheckboxes={filterCheckboxes}
        />
      </Suspense>
    </Wrapper>
  );
};

export default EmployerJobsTab;
