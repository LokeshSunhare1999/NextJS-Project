import React, { useState, useEffect, lazy, Suspense, useRef } from 'react';
import styled from 'styled-components';
import BoxLoader from '../common/BoxLoader';
import ICONS from '../../assets/icons';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { generateSearchParams } from '../../utils/helper';
import CustomCTA from '../CustomCTA';
import { useGetAllStaff } from '../../apis/queryHooks';
import { enqueueSnackbar } from 'notistack';
import useStaffFilter from '../../hooks/employer/useStaffFilters';
const FilterDrawer = lazy(() => import('../common/FilterDrawer'));
const DisplayTable = lazy(() => import('../DisplayTable'));
const SearchFilter = lazy(() => import('../SearchFilter'));
const Pagination = lazy(() => import('../atom/tableComponents/Pagination'));

const TableDiv = styled.div`
  position: relative;
`;

const TopDiv = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const SearchDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
`;

const PaginationDiv = styled.div`
  margin-top: 20px;
`;

const EmployerStaffTab = () => {
  const isMounted = useRef(false);
  const { id: staffingAgencyId } = useParams();
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [staffData, setStaffData] = useState([]);
  const [totalStaff, setTotalStaff] = useState(0);
  const [staffTableHeadersData, setstaffTableHeadersData] = useState([]);
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [searchId, setSearchID] = useState('');
  const [activeSearchKey, setActiveSearchKey] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [totalFiltersCount, setTotalFiltersCount] = useState(0);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [filterKeys, setFilterKeys] = useState('');

  const {
    staffCheckboxes,
    handleStaffCheckboxChange,
    handleApplyClick,
    clearFilters,
  } = useStaffFilter(
    setTotalFiltersCount,
    setFilterKeys,
    setOpenFilterDrawer,
    searchParams,
    navigate,
    staffingAgencyId,
    setCurrentPage,
  );

  const filterCheckboxes = [
    {
      fieldType: 'filter',
      fieldHeader: 'Verification Status',
      filterHeader: 'Verification Status',
      headerWeight: '500',
      checkboxes: staffCheckboxes,
      handleCheckboxChange: handleStaffCheckboxChange,
      filterClassname: { justifyContent: 'space-between' },
    },
  ];

  const {
    data: allStaffData,
    isLoading: allStaffDataLoading,
    isFetching: allStaffDataFetching,
    isError: isAllStaffDataError,
    error: allStaffDataError,
  } = useGetAllStaff({
    staffingAgencyId: staffingAgencyId,
    searchId: activeSearchKey,
    currentPage,
    itemsPerPage,
    filterKeys,
  });

  useEffect(() => {
    if (!allStaffDataLoading || !allStaffDataFetching) {
      setstaffTableHeadersData(allStaffData?.headers || []);
      setStaffData(allStaffData?.customers || []);
      setTotalStaff(allStaffData?.totalCustomers || 0);
    }
  }, [allStaffDataLoading, allStaffDataFetching, allStaffData]);

  useEffect(() => {
    if (allStaffDataError?.response?.data?.error?.message) {
      enqueueSnackbar(allStaffDataError?.response?.data?.error?.message, {
        variant: 'error',
      });
    } else if (allStaffDataError) {
      enqueueSnackbar('Failed to get staff data', { variant: 'error' });
    }
  }, [isAllStaffDataError, allStaffDataError]);
  const staffHeaders = Array.from(
    staffTableHeadersData?.map((item) => item.value),
  );

  const staffHeaderTypes = Array.from(
    staffTableHeadersData?.map((item) => item.type),
  );

  function createData(candidateDetails) {
    const headerKeys = Array.from(
      staffTableHeadersData?.map((item) => item.key),
    );
    return headerKeys?.map((item) => candidateDetails[item] ?? '-----');
  }

  const handleRowClick = (index) => {
    navigate(`/customers/${allStaffData?.customers?.[index]?._id}`);
  };

  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    navigate(`/customers/${allStaffData?.customers?.[actionIndex]?._id}`);
  };

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
    }
  };

  const handleSearchById = () => {
    setCurrentPage(1);
    setActiveSearchKey(searchId);
    if (!!searchId) {
      searchParams.set('searchId', searchId);
    } else {
      searchParams.delete('searchId');
    }
    searchParams.set('currentPage', 1);
    const queryString = generateSearchParams(searchParams);
    navigate(`/employers/${staffingAgencyId}?${queryString}`, {
      replace: true,
    });
  };
  useEffect(() => {
    if (searchParams.get('searchId')) {
      setSearchID(searchParams.get('searchId'));
      setActiveSearchKey(searchParams.get('searchId'));
    }
    if (!searchParams.get('searchId')) {
      setActiveSearchKey('');
      setSearchID('');
    }
    setCurrentPage(Number(searchParams.get('currentPage')) || 1);
    setItemsPerPage(Number(searchParams.get('itemsPerPage')) || 10);
  }, []);
  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchById();
    }
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by Candidate ID/Phone Number',
      width: '280px',
      setInput: setSearchID,
      enteredInput: searchId,
    },
  ];

  const arrBtn = [
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewDetailsClick,
      permission: EMPLOYER_MODULE_PERMISSIONS?.VIEW_STAFF_DETAILS,
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

  const rows = allStaffData?.customers?.map((item) => createData(item));
  return (
    <>
      <TopDiv>
        <SearchDiv>
          <SearchFilter
            searchArr={searchArr}
            isFilter={false}
            onKeyPress={handleEnterButton}
          />
          <CustomCTA
            onClick={handleSearchById}
            title={'Search'}
            showIcon={false}
            color={'#FFF'}
            bgColor={'#141482'}
            // isLoading={allCustomersDataFetching}
            border={'1px solid #CDD4DF'}
          />
        </SearchDiv>
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
      </TopDiv>
      <Suspense fallback={<BoxLoader size={5} />}>
        <TableDiv>
          {!(allStaffDataLoading || allStaffDataFetching) ? (
            <DisplayTable
              tableId={'employer-staff'}
              rows={rows}
              headers={staffHeaders}
              headersType={staffHeaderTypes}
              showActionsPanel={showActionsPanel}
              tableWidth={'100%'}
              actionIndex={actionIndex}
              setActionIndex={setActionIndex}
              actionOpen={actionOpen}
              setActionOpen={setActionOpen}
              arrBtn={arrBtn}
              onClickFn={handleRowClick}
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
            totalItems={totalStaff}
            setTotalItems={setTotalStaff}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            arrowBg={'#ebeff6'}
            isFlexColumn={false}
            isBottom={true}
            setOpenDropdown={setOpenDropdown}
            openDropdown={openDropdown}
            handleDropdown={handleDropdown}
            isBackground={false}
            searchParams={searchParams}
            navigate={navigate}
            pageType={`employers/${staffingAgencyId}`}
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
    </>
  );
};

export default EmployerStaffTab;
