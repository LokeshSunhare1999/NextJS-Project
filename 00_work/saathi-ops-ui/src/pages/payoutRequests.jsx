import { Skeleton } from '@mui/material';
import React, { lazy, Suspense, useEffect, useState, useRef } from 'react';
import CustomCTA from '../components/CustomCTA';
import styleComponents from '../style/pageStyle';
import { downloadPDF, getNestedProperty } from '../utils/helper';
import ICONS from '../assets/icons';
import usePermission from '../hooks/usePermission';
import { PAYOUT_PERMISSIONS } from '../constants/permissions';
import { useGetAllPayouts } from '../apis/queryHooks';
import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import { generateSearchParams } from '../utils/helper';
import usePayoutFilter from '../hooks/payoutRequest/usePayoutFilter';

const Pagination = lazy(
  () => import('../components/atom/tableComponents/Pagination'),
);
const DisplayTable = lazy(() => import('../components/DisplayTable'));
const FilterDrawer = lazy(() => import('../components/common/FilterDrawer'));
const PayoutRequestDrawer = lazy(
  () => import('../components/payouts/PayoutRequestDrawer'),
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
  Details,
  TopPageWrap,
  TableDiv,
} = styleComponents();

const PayoutRequests = () => {
  const isMounted = useRef(false);
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [totalPayouts, setTotalPayouts] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [openDropDownBottom, setOpenDropDownBottom] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [openPayoutDrawer, setOpenPayoutDrawer] = useState(false);
  const [totalFiltersCount, setTotalFiltersCount] = useState(0);
  const [filterKeys, setFilterKeys] = useState('');
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [payoutObj, setPayoutObj] = useState({});

  const {
    payoutCheckboxes,
    handleApplyClick,
    handlePayoutCheckboxChange,
    clearFilters,
  } = usePayoutFilter(
    setTotalFiltersCount,
    setFilterKeys,
    setOpenFilterDrawer,
    navigate,
    searchParams,
    setCurrentPage,
    setItemsPerPage
  );

  const filterCheckboxes = [
    {
      fieldType: 'filter',
      fieldHeader: 'Payout Status',
      filterHeader: 'Status',
      headerWeight: '500',
      checkboxes: payoutCheckboxes,
      handleCheckboxChange: handlePayoutCheckboxChange,
      filterClassname: { justifyContent: 'space-between', gap: '10px' },
    }
  ];

  const { data: allPayouts, refetch: refetchAllPayouts } = useGetAllPayouts({
    itemsPerPage: itemsPerPage,
    currentPage: currentPage,
    filterKeys: filterKeys,
  });

  useEffect(() => {
    if (allPayouts?.data) setTotalPayouts(allPayouts?.count);
  }, [allPayouts]);

  const headerValues = allPayouts?.headers?.map((item) => item.value) || [];
  const headerTypes = allPayouts?.headers?.map((item) => item.type) || [];

  function createData(payoutDetails) {
    const headerKeys = Array.from(allPayouts?.headers.map((item) => item.key));
    return headerKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(payoutDetails, itemKey);
    });
  }

  const rows = allPayouts?.data?.map((item) => createData(item)) || [];

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
      searchParams.set('itemsPerPage', pageSize);
      searchParams.set('currentPage', 1);

      const queryString = generateSearchParams(searchParams);
      navigate(`/payouts?${queryString}`, { replace: true });
    }
  };

  const handleDropDownBottom = () => {
    setOpenDropDownBottom(!openDropDownBottom);
  };

  const handleViewPayoutRequest = (e) => {
    e.stopPropagation();
    setPayoutObj(allPayouts?.data[actionIndex]);
    setOpenPayoutDrawer(true);
  };

  const handleRowClick = (index) => {
    if (!hasPermission(PAYOUT_PERMISSIONS?.UPDATE_PAYOUT_DETAILS)) return;
    setPayoutObj(allPayouts?.data[index]);
    setOpenPayoutDrawer(true);
  };
  const handleDownload = async (e, url, fileName) => {
    e.stopPropagation();
    if (!url) {
      console.error(`${fileName} URL not available`);
      return;
    }
    await downloadPDF(url, `${fileName}.pdf`);
  };

  const arrBtn = [
    {
      text: 'View Details',
      icon: ICONS.EYE,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleViewPayoutRequest,
      permission: PAYOUT_PERMISSIONS?.UPDATE_PAYOUT_DETAILS,
    },
    {
      text: 'Invoice',
      icon: ICONS.DOWNLOAD_GRAY,
      active: true,
      isVisible: allPayouts?.data[actionIndex]?.invoiceUrl,
      color: '#000',
      onClick: (e) =>
        handleDownload(e, allPayouts?.data[actionIndex]?.invoiceUrl, 'Invoice'),
      permission: PAYOUT_PERMISSIONS?.UPDATE_PAYOUT_DETAILS,
    },
    {
      text: 'Remittance',
      icon: ICONS.DOWNLOAD_GRAY,
      active: true,
      isVisible: allPayouts?.data[actionIndex]?.remittanceUrl,
      color: '#000',
      onClick: (e) =>
        handleDownload(
          e,
          allPayouts?.data[actionIndex]?.remittanceUrl,
          'Remittance',
        ),
      permission: PAYOUT_PERMISSIONS?.UPDATE_PAYOUT_DETAILS,
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
            <HeaderTitle>Payout Requests</HeaderTitle>
          </Header>
        </HeaderWrap>
        <Suspense fallback={<div></div>}>
          <SearchDiv>
            <SearchBox></SearchBox>
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
              {[1, 2, 3, 4, 5].map((item, idx) => {
                return <Skeleton animation="wave" height={70} key={idx} />;
              })}
            </AnimatedBox>
          }
        >
          <Details>
            <TableDiv>
              <DisplayTable
                tableId={'customersTable'}
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
                // onClickFn={handleRowClick}
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
            totalItems={totalPayouts}
            setTotalItems={setTotalPayouts}
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
            pageType={'payouts'}
          />
          <FilterDrawer
            open={openFilterDrawer}
            toggleDrawer={setOpenFilterDrawer}
            totalFiltersCount={totalFiltersCount}
            handleApplyClick={handleApplyClick}
            clearFilters={clearFilters}
            filterCheckboxes={filterCheckboxes}
          />
          <PayoutRequestDrawer
            open={openPayoutDrawer}
            toggleDrawer={setOpenPayoutDrawer}
            payoutObj={payoutObj}
            refetchAllPayouts={refetchAllPayouts}
          />
        </Suspense>
      </Bottom>
    </Wrapper>
  );
};

export default PayoutRequests;
