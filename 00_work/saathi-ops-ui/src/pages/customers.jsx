import React, { Suspense, lazy, useEffect, useState } from 'react';
const SearchFilter = lazy(() => import('../components/SearchFilter'));
const DisplayTable = lazy(() => import('../components/DisplayTable'));
import CustomCTA from '../components/CustomCTA';
import { useSnackbar } from 'notistack';
import { useGetAllCustomers } from '../apis/queryHooks';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Skeleton from '@mui/material/Skeleton';
import ICONS from '../assets/icons';
import {
  convertToCSV,
  downloadCSV,
  generateSearchParams,
  getNestedProperty,
} from '../utils/helper';
import styleComponents from '../style/pageStyle';
import { CUSTOMER_PERMISSIONS } from '../constants/permissions';
import usePermission from '../hooks/usePermission';
import useDeviceType from '../hooks/useDeviceType';
import { DEVICE_TYPES } from '../constants';
import useCustomerFilter from '../hooks/customer/useCustomerFilter';
import { VERIFICATION_FILTER_SECTIONS } from '../constants/verification';
const Pagination = lazy(
  () => import('../components/atom/tableComponents/Pagination'),
);
const FilterDrawer = lazy(() => import('../components/common/FilterDrawer'));

const {
  Wrapper,
  Top,
  Bottom,
  HeaderWrap,
  Header,
  HeaderTitle,
  HeaderDesc,
  SearchDiv,
  SearchBox,
  AnimatedBox,
  Details,
  TopPageWrap,
} = styleComponents();

const Customers = () => {
  const deviceType = useDeviceType();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = usePermission();
  const [searchParams] = useSearchParams();

  const [customerTableHeadersData, setCustomerTableHeadersData] = useState([]);
  const [customerData, setCustomerData] = useState([]);
  const [totalCustomers, setTotalCustomers] = useState(0);
  const [searchId, setSearchID] = useState('');
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDropDownBottom, setOpenDropDownBottom] = useState(false);
  const [activeSearchKey, setActiveSearchKey] = useState('');
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [totalFiltersCount, setTotalFiltersCount] = useState(0);
  const [filterKeys, setFilterKeys] = useState('');

  const {
    verificationCheckboxes,
    workExCheckboxes,
    trueIdCheckboxes,
    customerTypeCheckboxes,
    jobReelStatusCheckboxes,
    jobApplicationCheckboxes,
    handleWorkExCheckboxChange,
    handleTrueIdCheckboxChange,
    handleVerificationCheckboxChange,
    handleCustomerTypeCheckboxChange,
    handleJobReelStatusCheckboxChange,
    handleJobApplicationStatusCheckboxChange,
    clearFilters,
    handleApplyClick,
  } = useCustomerFilter(
    setTotalFiltersCount,
    setFilterKeys,
    setOpenFilterDrawer,
    navigate,
    searchParams,
    setCurrentPage,
  );

  const filterCheckboxes = [
    {
      fieldType: 'filter',
      fieldHeader: 'Work-ex Status',
      filterHeader: 'Work-ex Status',
      headerWeight: '500',
      checkboxes: workExCheckboxes,
      handleCheckboxChange: handleWorkExCheckboxChange,
      filterClassname: { justifyContent: 'space-between' },
    },

    ...Object.values(VERIFICATION_FILTER_SECTIONS).map((type, typeIndex) => {
      return {
        filterHeader: type,
        fieldHeader: 'Verification Type',
        showFieldHeader: typeIndex === 0,
        checkboxes: verificationCheckboxes[typeIndex],
        handleCheckboxChange: (value) =>
          handleVerificationCheckboxChange(value, typeIndex),
        filterClassname: { justifyContent: 'space-between' },
      };
    }),
    // {
    //   fieldType: 'filter',
    //   filterHeader: 'Job Reel Status',
    //   headerWeight: '500',
    //   checkboxes: jobReelStatusCheckboxes,
    //   handleCheckboxChange: handleJobReelStatusCheckboxChange,
    // },
    // {
    //   fieldType: 'filter',
    //   filterHeader: 'Job Application Status',
    //   headerWeight: '500',
    //   checkboxes: jobApplicationCheckboxes,
    //   handleCheckboxChange: handleJobApplicationStatusCheckboxChange,
    //   filterClassname: { gap: '150px' },
    // },

    {
      fieldType: 'filter',
      fieldHeader: 'True ID Status',
      filterHeader: 'True ID Status',
      headerWeight: '500',
      checkboxes: trueIdCheckboxes,
      handleCheckboxChange: handleTrueIdCheckboxChange,
      filterClassname: { gap: '150px' },
    },
    {
      fieldType: 'filter',
      fieldHeader: 'Customer Type',
      filterHeader: 'Customer Type',
      headerWeight: '500',
      checkboxes: customerTypeCheckboxes,
      handleCheckboxChange: handleCustomerTypeCheckboxChange,
      filterClassname: { gap: '170px' },
    },
  ];

  const {
    data: allCustomersData,
    isLoading: allCustomersDataLoading,
    isFetching: allCustomersDataFetching,
    isError: isAllCustomersDataError,
    error: allCustomersDataError,
    refetch: refetchAllCustomers,
  } = useGetAllCustomers({
    searchId: activeSearchKey,
    currentPage,
    itemsPerPage,
    filterKeys,
  });

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
    setOpenDropDownBottom(!openDropDownBottom);
  };

  const handleDropDownBottom = () => {
    setOpenDropdown(!openDropdown);
    setOpenDropDownBottom(!openDropDownBottom);
  };

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);
      const queryString = generateSearchParams(searchParams);
      navigate(`/customers?${queryString}`, { replace: true });
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

    navigate(`/customers?${queryString}`, { replace: true });
  };

  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchById();
    }
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by Customer ID/Mobile Number',
      width: deviceType === DEVICE_TYPES?.MOBILE ? '200px' : '270px',
      setInput: setSearchID,
      enteredInput: searchId,
    },
  ];

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

  useEffect(() => {
    if (!allCustomersDataLoading) {
      setCustomerTableHeadersData(allCustomersData?.headers || []);
      setCustomerData(allCustomersData?.response || []);
      setTotalCustomers(allCustomersData?.totalCustomers || 0);
    }
  }, [allCustomersDataLoading, allCustomersDataFetching, allCustomersData]);

  useEffect(() => {
    if (allCustomersDataError?.response?.data?.error?.message) {
      enqueueSnackbar(allCustomersDataError?.response?.data?.error?.message, {
        variant: 'error',
      });
    }
  }, [isAllCustomersDataError, allCustomersDataError]);

  const tableHeaders = Array.from(
    customerTableHeadersData.map((item) => item.value),
  );
  const headerKeys = Array.from(
    customerTableHeadersData.map((item) => item.key),
  );

  function createData(userDetails) {
    const headerKeys = Array.from(
      customerTableHeadersData.map((item) => item.key),
    );
    return headerKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(userDetails, itemKey);
    });
  }

  const rows = Array.from(customerData.map((item) => createData(item)));

  const createTooltipArray = (customers) => {
    let tooltipArray = [];

    customers?.map((customer) => {
      const statuses = {
        aadhaarVerificationStatus: customer?.aadhaarVerificationStatus,
        drivingLicenseVerificationStatus:
          customer?.drivingLicenseVerificationStatus,
        faceMatchWithAadhaarVerificationStatus:
          customer?.faceMatchWithAadhaarVerificationStatus,
        faceMatchWithDrivingLicenseVerificationStatus:
          customer?.faceMatchWithDrivingLicenseVerificationStatus,
        livePhotoVerificationStatus: customer?.livePhotoVerificationStatus,
        panVerificationStatus: customer?.panVerificationStatus,
      };
      const groupedStatuses = Object.entries(statuses).reduce(
        (acc, [key, value]) => {
          if (!acc[value]) {
            acc[value] = [];
          }
          acc[value].push(key);
          return acc;
        },
        {},
      );
      tooltipArray.push(groupedStatuses);
    });

    return tooltipArray;
  };

  const handleRowClick = (index) => {
    navigate(`/customers/${customerData[index]?._id}`);
  };

  const handleDownload = () => {
    const formattedData = allCustomersData?.response?.map((item) => ({
      'Customer ID': item._id,
      'Mobile Number': `${item?.primaryContact?.dialCode} ${item?.primaryContact?.phoneNo}`,
      Courses: item.noOfCoursePurchased,
      'True ID Status': item.trueIdVerificationStatus,
      'True ID': item.saathiId,
      'Platform Type': item.sourceType,
    }));
    const csv = convertToCSV(formattedData);
    downloadCSV(csv, 'customers.csv');
  };

  return (
    <Wrapper $deviceType={deviceType}>
      <Top>
        {deviceType !== DEVICE_TYPES?.MOBILE ? (
          <HeaderWrap>
            <Header>
              <HeaderTitle>All Customers</HeaderTitle>
              <HeaderDesc>Total Customers: {totalCustomers}</HeaderDesc>
            </Header>
            <CustomCTA
              onClick={handleDownload}
              title={'Download Customers'}
              showIcon={false}
              color={'#FFF'}
              bgColor={'#141482'}
              border={'1px solid #CDD4DF'}
              url={ICONS.DOWNLOAD}
              isPermitted={hasPermission(
                CUSTOMER_PERMISSIONS?.DOWNLOAD_CUSTOMERS,
              )}
            />
          </HeaderWrap>
        ) : null}
        <Suspense fallback={<div></div>}>
          <SearchDiv
            $marginLeft={deviceType === DEVICE_TYPES?.MOBILE ? '20px' : '40px'}
            $deviceType={deviceType}
          >
            <SearchBox>
              <SearchFilter
                searchArr={searchArr}
                isFilter={false}
                onKeyPress={handleEnterButton}
                showIcon={deviceType !== DEVICE_TYPES?.MOBILE}
              />
              <CustomCTA
                onClick={handleSearchById}
                title={deviceType === DEVICE_TYPES?.MOBILE ? '' : 'Search'}
                showIcon={deviceType === DEVICE_TYPES?.MOBILE}
                color={'#FFF'}
                bgColor={'#141482'}
                isLoading={allCustomersDataFetching}
                border={'1px solid #CDD4DF'}
                url={ICONS?.SEARCH_ICON}
              />
            </SearchBox>
            {deviceType !== DEVICE_TYPES?.MOBILE ? (
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
            ) : null}
          </SearchDiv>
          {deviceType !== DEVICE_TYPES?.MOBILE ? (
            <TopPageWrap>
              <Pagination
                isBackground={false}
                onShowSizeChange={onShowSizeChange}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
                totalItems={totalCustomers}
                setTotalItems={setTotalCustomers}
                itemsPerPage={itemsPerPage}
                setItemsPerPage={setItemsPerPage}
                arrowBg={'#fff'}
                isFlexColumn={true}
                isBottom={false}
                setOpenDropdown={setOpenDropdown}
                openDropdown={openDropdown}
                handleDropdown={handleDropdown}
                searchParams={searchParams}
                navigate={navigate}
                pageType={'customers'}
              />
            </TopPageWrap>
          ) : null}
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
          <Details $deviceType={deviceType}>
            {deviceType !== DEVICE_TYPES?.DESKTOP &&
            activeSearchKey?.length === 0 ? null : (
              <DisplayTable
                tableId={'customersTable'}
                highlightRow={true}
                rows={rows}
                headers={tableHeaders}
                showActionsPanel={false}
                headersType={Array.from(
                  customerTableHeadersData?.map((item) => item.type),
                )}
                onClickFn={handleRowClick}
                statusRemarks={createTooltipArray(customerData)}
                navigate={navigate}
              />
            )}
          </Details>
        </Suspense>
      </Top>
      <Bottom>
        <Suspense fallback={<div></div>}>
          {deviceType !== DEVICE_TYPES?.DESKTOP &&
          activeSearchKey?.length === 0 ? null : (
            <Pagination
              onShowSizeChange={onShowSizeChange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalCustomers}
              setTotalItems={setTotalCustomers}
              itemsPerPage={itemsPerPage}
              setItemsPerPage={setItemsPerPage}
              arrowBg={'#fff'}
              isFlexColumn={false}
              isBottom={true}
              setOpenDropdown={setOpenDropDownBottom}
              openDropdown={openDropDownBottom}
              handleDropdown={handleDropDownBottom}
              searchParams={searchParams}
              navigate={navigate}
              pageType={'customers'}
            />
          )}

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

export default Customers;
