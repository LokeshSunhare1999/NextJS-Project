import React, { Suspense, lazy, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
const SearchFilter = lazy(() => import('../components/SearchFilter'));
const DisplayTable = lazy(() => import('../components/DisplayTable'));
import Skeleton from '@mui/material/Skeleton';
import ICONS from '../assets/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGetAllOrders } from '../apis/queryHooks';
import CustomCTA from '../components/CustomCTA';
import {
  getNestedProperty,
  convertToCSV,
  downloadCSV,
  generateSearchParams,
} from '../utils/helper';
import { useSnackbar } from 'notistack';
import styleComponents from '../style/pageStyle';

import { ORDER_PERMISSIONS } from '../constants/permissions';
import usePermission from '../hooks/usePermission';
import useOrderFilter from '../hooks/orders/useOrderFilters';

const DateFilter = lazy(() => import('../components/DateFilter'));
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

const Orders = () => {
  dayjs.extend(utc);
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const { enqueueSnackbar } = useSnackbar();
  const [searchParams] = useSearchParams();

  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState();
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [orders, setOrders] = useState([]);
  const [ordersHeaders, setOrdersHeaders] = useState([]);
  const [searchId, setSearchID] = useState('');
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openDropdownBottom, setOpenDropdownBottom] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [userType, setUserType] = useState('');
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [totalFiltersCount, setTotalFiltersCount] = useState(0);
  const [filterKeys, setFilterKeys] = useState('');

  const [filterParams, setFilterParams] = useState({
    searchId: '',
    fromDate: null,
    toDate: null,
  });

  const {
    orderCheckboxes,
    handleOrderCheckboxChange,
    clearFilters,
    handleApplyClick,
    orderTypeCheckboxes,
    handleOrderTypeCheckboxes,
  } = useOrderFilter(
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
      fieldHeader: 'Order Status',
      filterHeader: 'Order Status',
      headerWeight: '500',
      checkboxes: orderCheckboxes,
      handleCheckboxChange: handleOrderCheckboxChange,
      filterClassname: { justifyContent: 'space-between', gap: '10px' },
    },
    {
      fieldType: 'filter',
      filterHeader: 'Order Type',
      headerWeight: '500',
      checkboxes: orderTypeCheckboxes,
      handleCheckboxChange: handleOrderTypeCheckboxes,
      filterClassname: { justifyContent: 'space-between', gap: '10px' },
    },
  ];
  const {
    data: allOrdersData,
    isLoading: isGetAllOrdersLoading,
    isFetching: isGetAllOrdersFetching,
    refetch: refetchAllOrders,
    status: getAllOrdersStatus,
    isError: isGetAllOrdersErr,
    error: getAllOrdersErr,
  } = useGetAllOrders({
    searchId: filterParams?.searchId,
    currentPage,
    itemsPerPage,
    fromDate: filterParams?.fromDate,
    toDate: filterParams?.toDate,
    filterKeys,
  });

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);
      const queryString = generateSearchParams(searchParams);
      navigate(`/orders?${queryString}`, { replace: true });
    }
  };

  function createData(courseDetails) {
    const headerKeys = Array.from(ordersHeaders.map((item) => item.key));
    return headerKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(courseDetails, itemKey);
    });
  }

  const handleRowClick = (index) => {
    setUserType(orders[index]?.userType);
    navigate(
      `/orders/${orders[index]?._id}?userType=${orders[index]?.userType}`,
    );
  };

  const handleSearchById = () => {
    setCurrentPage(1);
    setFilterParams({ searchId, fromDate, toDate });
    if (!!searchId) {
      searchParams.set('searchId', searchId);
    }
    if (!searchId) {
      searchParams.delete('searchId');
    }
    if (!!fromDate) {
      searchParams.set('fromDate', encodeURIComponent(fromDate));
    }
    if (!fromDate) {
      searchParams.delete('fromDate');
    }
    if (!!toDate) {
      searchParams.set('toDate', encodeURIComponent(toDate));
    }
    if (!toDate) {
      searchParams.delete('toDate');
    }
    searchParams.set('currentPage', 1);
    const queryString = generateSearchParams(searchParams);
    navigate(`/orders?${queryString}`, { replace: true });
  };

  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchById();
    }
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
    setOpenDropdownBottom(!openDropdownBottom);
  };

  const handleDropdownBottom = () => {
    setOpenDropdownBottom(!openDropdownBottom);
    setOpenDropdown(!openDropdown);
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by Order/Customer ID',
      width: '260px',
      setInput: setSearchID,
      enteredInput: searchId,
    },
  ];

  const arrBtn = [
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#586276',
      onClick: (e) => {
        e.stopPropagation();
      },
    },
    {
      text: 'Delete',
      icon: ICONS.DELETE_ICON,
      active: true,
      isVisible: true,
      color: '#DD4141',
      onClick: (e) => {
        e.stopPropagation();
      },
    },
  ];

  useEffect(() => {
    let searchId = '';
    let fromDate = null;
    let toDate = null;
    if (searchParams.get('searchId')) {
      setSearchID(searchParams.get('searchId'));
      searchId = searchParams.get('searchId');
    }
    if (!searchParams.get('searchId')) {
      setSearchID('');
      searchId = '';
    }
    if (searchParams.get('fromDate')) {
      const fromDateVal = dayjs(
        decodeURIComponent(searchParams.get('fromDate')),
      );

      if (fromDateVal.isValid()) {
        setFromDate(fromDateVal);
        fromDate = fromDateVal;
      }
    }
    if (!searchParams.get('fromDate')) {
      setFromDate(null);
      fromDate = null;
    }
    if (searchParams.get('toDate')) {
      const toDateVal = dayjs(decodeURIComponent(searchParams.get('toDate')));
      if (toDateVal.isValid()) {
        setToDate(toDateVal);
        toDate = toDateVal;
      }
    }
    if (!searchParams.get('toDate')) {
      setToDate(null);
      toDate = null;
    }
    setFilterParams({ searchId, fromDate, toDate });
    setCurrentPage(Number(searchParams.get('currentPage')) || 1);
    setItemsPerPage(Number(searchParams.get('itemsPerPage')) || 10);
  }, []);

  useEffect(() => {
    if (!isGetAllOrdersLoading || !isGetAllOrdersFetching) {
      setOrders(allOrdersData?.orders || []);
      setOrdersHeaders(allOrdersData?.headers || []);
      setTotalItems(allOrdersData?.totalOrders || 0);
    }
  }, [isGetAllOrdersLoading, isGetAllOrdersFetching, allOrdersData]);

  useEffect(() => {
    if (isGetAllOrdersErr) {
      enqueueSnackbar(
        `Error : ${getAllOrdersErr?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [isGetAllOrdersErr, allOrdersData]);

  const handleDownload = () => {
    const formattedData = allOrdersData?.orders?.map((item) => ({
      'Order ID': item._id,
      'Order Date': item.orderDate,
      'Customer ID': item.typeId,
      'Course ID': item?.orderItems[0]?.productId,
      'Order Status': item.orderStatus,
      'User Type': item.userType,
      'Total Amount': `Rs. ${item.orderAmount}`,
      'Platform Type': item.sourceType,
    }));
    const csv = convertToCSV(formattedData);
    downloadCSV(csv, 'orders.csv');
  };

  return (
    <Wrapper>
      <Top>
        <HeaderWrap>
          <Header>
            <HeaderTitle>All Orders</HeaderTitle>
            <HeaderDesc>{`Total Orders: ${totalItems}`}</HeaderDesc>
          </Header>
          <CustomCTA
            onClick={handleDownload}
            title={'Download Orders'}
            showIcon={false}
            color={'#FFF'}
            bgColor={'#141482'}
            border={'1px solid #CDD4DF'}
            url={ICONS.DOWNLOAD}
            isPermitted={hasPermission(ORDER_PERMISSIONS?.DOWNLOAD_ORDERS)}
          />
        </HeaderWrap>
        <Suspense fallback={<div></div>}>
          <SearchDiv>
            <SearchBox>
              <SearchFilter
                searchArr={searchArr}
                isFilter={false}
                onKeyPress={handleEnterButton}
              />
              <DateFilter
                fromDate={fromDate}
                setFromDate={setFromDate}
                toDate={toDate}
                setToDate={setToDate}
                searchParams={searchParams}
                navigate={navigate}
              />
              <CustomCTA
                onClick={handleSearchById}
                title={'Search'}
                showIcon={false}
                color={'#FFF'}
                bgColor={'#141482'}
                isLoading={isGetAllOrdersFetching}
                border={'1px solid #CDD4DF'}
              />
            </SearchBox>
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
          </SearchDiv>
          <TopPageWrap>
            <Pagination
              isBackground={false}
              onShowSizeChange={onShowSizeChange}
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              setTotalItems={setTotalItems}
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
              pageType={'orders'}
            />
          </TopPageWrap>
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
            <DisplayTable
              tableId={'ordersTable'}
              rows={Array.from(orders?.map((item) => createData(item)))}
              headers={Array.from(ordersHeaders?.map((item) => item.value))}
              headersType={Array.from(ordersHeaders?.map((item) => item.type))}
              showActionsPanel={false}
              onClickFn={handleRowClick}
              arrBtn={arrBtn}
              actionIndex={actionIndex}
              setActionIndex={setActionIndex}
              actionOpen={actionOpen}
              setActionOpen={setActionOpen}
              setUserType={setUserType}
              tableData={orders}
            />
          </Details>
        </Suspense>
      </Top>

      <Bottom>
        <Suspense
          fallback={
            <AnimatedBox>
              {[1].map((item, idx) => {
                return <Skeleton animation="wave" height={70} key={idx} />;
              })}
            </AnimatedBox>
          }
        >
          <Pagination
            onShowSizeChange={onShowSizeChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems}
            setTotalItems={setTotalItems}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            arrowBg={'#ebeff6'}
            isFlexColumn={false}
            isBottom={true}
            setOpenDropdown={setOpenDropdownBottom}
            openDropdown={openDropdownBottom}
            handleDropdown={handleDropdownBottom}
            searchParams={searchParams}
            navigate={navigate}
            pageType={'orders'}
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

export default Orders;
