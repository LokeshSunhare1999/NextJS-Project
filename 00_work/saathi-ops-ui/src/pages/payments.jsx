import React, { Suspense, lazy, useState, useEffect } from 'react';
import Skeleton from '@mui/material/Skeleton';
import CustomCTA from '../components/CustomCTA';
import styleComponents from '../style/pageStyle';
import ICONS from '../assets/icons';
import {
  convertToCSV,
  downloadCSV,
  generateSearchParams,
} from '../utils/helper';
import { PAYMENT_PERMISSIONS } from '../constants/permissions';
import usePermission from '../hooks/usePermission';
import DisplayTable from '../components/DisplayTable';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { useGetAllPayments } from '../apis/queryHooks';
import usePaymentFilter from '../hooks/payments/usePaymentsFilters';

const FilterDrawer = lazy(() => import('../components/common/FilterDrawer'));

const SearchFilter = lazy(() => import('../components/SearchFilter'));

const DateFilter = lazy(() => import('../components/DateFilter'));

const Pagination = lazy(
  () => import('../components/atom/tableComponents/Pagination'),
);

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
  TopPageWrap,
  Details,
  TableDiv,
} = styleComponents();

const Payments = () => {
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
    paymentCheckboxes,
    handlePaymentCheckboxChange,
    clearFilters,
    handleApplyClick,
  } = usePaymentFilter(
    setTotalFiltersCount,
    setFilterKeys,
    setOpenFilterDrawer,
    navigate,
    searchParams,
    'payments',
    setCurrentPage,
  );

  const filterCheckboxes = [
    {
      fieldType: 'filter',
      fieldHeader: 'Payment Status',
      filterHeader: 'Payment Status',
      headerWeight: '500',
      checkboxes: paymentCheckboxes,
      handleCheckboxChange: handlePaymentCheckboxChange,
      filterClassname: { justifyContent: 'space-between' },
    },
  ];

  const {
    data: allPaymentsData,
    isLoading: isGetAllPaymentsLoading,
    isFetching: isGetAllPaymentsFetching,
    refetch: refetchAllPayments,
    isError: isGetAllPaymentsErr,
    error: getAllPaymentsErr,
  } = useGetAllPayments({
    searchId: filterParams.searchId,
    currentPage,
    itemsPerPage,
    fromDate: filterParams.fromDate,
    toDate: filterParams.toDate,
    filterKeys,
  });

  const paymentsHeaders = allPaymentsData?.headers || [];
  const incomingPayments = allPaymentsData?.payment || [];

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);
      const queryString = generateSearchParams(searchParams);
      navigate(`/payments?${queryString}`, { replace: true });
    }
  };

  const createData = (paymentDetails) => {
    return paymentsHeaders.map((item) => paymentDetails[item.key]);
  };

  const handleRowClick = (index) => {
    setUserType(incomingPayments[index]?.userType);
    navigate(
      `/payments/${incomingPayments[index]?._id}?userType=${incomingPayments[index]?.userType}&paymentType=${'incoming'}`, //paymentType for incoming payment details
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
    navigate(`/payments?${queryString}`, { replace: true });
  };

  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchById();
    }
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by Transaction/Order/Customer ID',
      width: '300px',
      setInput: setSearchID,
      enteredInput: searchId,
    },
  ];

  const handleDownload = () => {
    const formattedData = allPaymentsData?.payment?.map((item) => ({
      'Payment ID': item?._id,
      'Order ID': item?.orderId,
      'Payment Date': item?.paymentDate,
      'Customer ID': item?.typeId,
      'User Type': item?.userType,
      'Payment Method': item?.paymentApp,
      'Total Amount': `Rs. ${item?.amount}`,
      'Payment Status': item?.paymentStatus,
      'Txn Remarks': item?.pgRemarks,
    }));

    const fileName = 'payments.csv';
    const csv = convertToCSV(formattedData);
    downloadCSV(csv, fileName);
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
    setOpenDropdownBottom(!openDropdownBottom);
  };

  const handleDropdownBottom = () => {
    setOpenDropdownBottom(!openDropdownBottom);
    setOpenDropdown(!openDropdown);
  };

  const arrBtn = [
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#586276',
      onClick: (e) => e.stopPropagation(),
    },
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#586276',
      onClick: (e) => e.stopPropagation(),
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
    if (allPaymentsData) {
      setTotalItems(allPaymentsData?.totalPayments || 0);
    }
  }, [allPaymentsData]);

  useEffect(() => {
    if (isGetAllPaymentsErr) {
      enqueueSnackbar(
        `Error : ${getAllPaymentsErr?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [isGetAllPaymentsErr, allPaymentsData]);

  return (
    <Wrapper>
      <Top>
        <HeaderWrap>
          <Header>
            <HeaderTitle>All Payments</HeaderTitle>
            <HeaderDesc>{`Total Payments: ${totalItems}`}</HeaderDesc>
          </Header>
          <CustomCTA
            onClick={handleDownload}
            title={'Download Payments'}
            showIcon={false}
            color={'#FFF'}
            bgColor={'#141482'}
            border={'1px solid #CDD4DF'}
            isPermitted={hasPermission(PAYMENT_PERMISSIONS?.DOWNLOAD_PAYMENTS)}
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
                isLoading={isGetAllPaymentsLoading}
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
        </Suspense>

        <Suspense
          fallback={
            <AnimatedBox>
              {[...Array(5)].map((_, idx) => (
                <Skeleton animation="wave" height={70} key={idx} />
              ))}
            </AnimatedBox>
          }
        >
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
              pageType={'payments'}
            />
          </TopPageWrap>
          <Details>
            {paymentsHeaders?.length > 0 ? (
              <TableDiv>
                <DisplayTable
                  tableId={'incomingPayments'}
                  rows={incomingPayments?.map(createData)}
                  headers={paymentsHeaders?.map((item) => item.value)}
                  headersType={paymentsHeaders?.map((item) => item.type)}
                  showActionsPanel={false}
                  onClickFn={handleRowClick}
                  arrBtn={arrBtn}
                  actionIndex={actionIndex}
                  setActionIndex={setActionIndex}
                  actionOpen={actionOpen}
                  setActionOpen={setActionOpen}
                  setUserType={setUserType}
                  tableData={incomingPayments}
                  customProps={{ paymentType: 'incoming' }}
                />
              </TableDiv>
            ) : null}
          </Details>
          <FilterDrawer
            open={openFilterDrawer}
            toggleDrawer={setOpenFilterDrawer}
            totalFiltersCount={totalFiltersCount}
            handleApplyClick={handleApplyClick}
            clearFilters={clearFilters}
            filterCheckboxes={filterCheckboxes}
          />
        </Suspense>
      </Top>
      <Bottom>
        <Suspense
          fallback={
            <AnimatedBox>
              {[1].map((_, idx) => (
                <Skeleton animation="wave" height={70} key={idx} />
              ))}
            </AnimatedBox>
          }
        >
          <Pagination
            onShowSizeChange={onShowSizeChange}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
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
            pageType={'payments'}
          />
        </Suspense>
      </Bottom>
    </Wrapper>
  );
};

export default Payments;
