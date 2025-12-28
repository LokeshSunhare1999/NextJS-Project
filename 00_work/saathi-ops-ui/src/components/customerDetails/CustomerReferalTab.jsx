import React, { useEffect, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import { RUPEE_SYMBOL } from '../../constants/details';
import CustomCTA from '../CustomCTA';
import useCustomerReferrerDetails from '../../hooks/customer/useCustomerReferrerDetails';
const DisplayTable = lazy(() => import('../DisplayTable'));
const ViewReferralHistoryDrawer = lazy(
  () => import('./ViewReferralHistoryDrawer'),
);
const Pagination = lazy(
  () => import('../../components/atom/tableComponents/Pagination'),
);
const FilterDrawer = lazy(() => import('../common/FilterDrawer'));

import BoxLoader from '../common/BoxLoader';
import styleComponents from '../../style/pageStyle';
import SearchFilter from '../SearchFilter';
import { DEVICE_TYPES } from '../../constants';
import ICONS from '../../assets/icons';
import useCustomerReferralFilter from '../../hooks/customer/useCustomerReferralFilter';
import { useNavigate, useSearchParams } from 'react-router-dom';

const { SearchDiv, SearchBox } = styleComponents();

const StyledHeader = styled.p`
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
  margin: ${(props) => props?.$margin};
  width: ${(props) => (props?.$width ? props?.$width : '100%')};
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: ${(props) => (props.$gap ? props.$gap : '10px')};
  opacity: ${(props) => (props.$opacity ? props.$opacity : '1')};
`;
const Wrapper = styled.div`
  margin: 0px;
  padding: 0px;
  font-family: Poppins;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 80vh;
`;
const P = styled.p`
  color: ${(props) => props.$color};
  font-size: ${(props) => props?.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => (props.$lineHeight ? props.$lineHeight : 'normal')};
  cursor: ${(props) => props.$cursor};

  &:hover {
    text-decoration: underline;
  }
`;
const Referralcard = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: left;
  gap: 20px;
`;

const FixedHeightContainer = styled.div`
  margin-bottom: 20px;
`;

const Card = styled.div`
  width: ${(props) => props?.$width};
  height: ${(props) => props?.$height || 'auto'};
  border-radius: 10px;
  padding: 10px;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
  color: #606c85;
  background-color: #fff;
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  align-items: ${(props) => (props.$alignItems ? props.$alignItems : 'center')};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: ${(props) => (props.$gap ? props.$gap : '0')};
`;
const Img = styled.img`
  width: 16px;
  height: 16px;
`;

const SearchContainer = styled.div`
  margin-top: 20px;
`;

const StyledSpan = styled.span`
  color: ${(props) => props?.$color};
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
`;

const CustomerReferalTab = ({ userId, deviceType, customerId }) => {
  const [openWithdrawDrawer, setOpenWithdrawDrawer] = useState(false);
  const [searchId, setSearchID] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [openFilterDrawer, setOpenFilterDrawer] = useState(false);
  const [totalFiltersCount, setTotalFiltersCount] = useState(0);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const {
    customerReferrerDetails,
    customerReferrerRows,
    customerReferrerTableHeaders,
    customerReferrerType,
    errorCode,
    isCustomerReferralHistoryError,
    searchByRefereeNameOrPhone,
    customerAmountEarned,
    customerWithdrawalAmount,
    customerLinkedWalletAmount,
    customerLinkedWalletEarning,
    customerTotalWalletAmount,
    customerAvailableBonusAmount,
    customerTotalAmountWithdrawn,
    setCustomerReferrerRows,
    createData,
  } = useCustomerReferrerDetails(userId);

  const {
    referralLevelCheckboxes,
    handleReferralLeveCheckboxChange,
    clearFilters,
    handleApplyClick,
    milestoneCheckboxes,
    handleMilestoneCheckboxes,
    filteredData,
  } = useCustomerReferralFilter(
    customerReferrerDetails,
    setTotalFiltersCount,
    setOpenFilterDrawer,
    setCurrentPage,
    searchParams,
    customerId,
    navigate,
  );

  const filterCheckboxes = [
    {
      fieldType: 'filter',
      fieldHeader: 'Referee List Filter',
      filterHeader: 'Referral Level',
      headerWeight: '500',
      checkboxes: referralLevelCheckboxes,
      handleCheckboxChange: handleReferralLeveCheckboxChange,
      filterClassname: { gap: '70px' },
    },
    {
      fieldType: 'filter',
      filterHeader: 'Milestone',
      headerWeight: '500',
      checkboxes: milestoneCheckboxes,
      handleCheckboxChange: handleMilestoneCheckboxes,
      filterClassname: { justifyContent: 'space-between', gap: '50px' },
    },
  ];

  useEffect(() => {
    if (filteredData) {
      const filteredReferrerRows =
        Array.from(filteredData?.map((item) => createData(item))) || [];
      setCustomerReferrerRows(filteredReferrerRows);
    }
  }, [filteredData]);

  const totalItems = customerReferrerRows?.length;

  const toggleDrawer = (newOpen) => {
    setOpenWithdrawDrawer(newOpen);
  };

  const handleSearchById = () => {
    searchByRefereeNameOrPhone(searchId);
  };

  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchById();
    }
  };

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
    }
  };

  const handleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by Referee name/phone no',
      width: deviceType === DEVICE_TYPES?.MOBILE ? '200px' : '270px',
      setInput: setSearchID,
      enteredInput: searchId,
    },
  ];

  function createTooltipArray(customerReferrerDetails) {
    const toolTipArray = [];
    customerReferrerDetails?.forEach((referee, index) => {
      const toolTipObj = [];

      if (referee?.bonusReferralAmount > 0) {
        toolTipObj.push(
          `Referral Earning - ₹ ${referee?.organicReferralAmount}`,
        );
        toolTipObj.push(`Bonus Amount - ₹ ${referee?.bonusReferralAmount}`);
      }

      toolTipArray[index] = toolTipObj;
    });
    return toolTipArray;
  }

  return (
    <Wrapper>
      <FixedHeightContainer>
        {!isCustomerReferralHistoryError ? (
          <>
            <Referralcard>
              <Card
                $width="492px"
                $flexDirection="column"
                $alignItems="center"
                $justifyContent="center"
              >
                <Card
                  $width="100%"
                  $flexDirection="row"
                  $alignItems="center"
                  $justifyContent="space-between"
                >
                  <StyledSpan>Total Amount Earned </StyledSpan>
                  <StyledSpan $color="#000000">
                    {RUPEE_SYMBOL} {customerAmountEarned}
                  </StyledSpan>
                </Card>
                <Card
                  $width="100%"
                  $flexDirection="row"
                  $alignItems="center"
                  $justifyContent="space-between"
                >
                  <StyledSpan>Total Amount Withdrawn </StyledSpan>
                  <StyledSpan $color="#000000">
                    {RUPEE_SYMBOL} {customerTotalAmountWithdrawn}
                  </StyledSpan>
                </Card>

                <Card
                  $width="100%"
                  $flexDirection="row"
                  $alignItems="center"
                  $justifyContent="space-between"
                >
                  <StyledSpan>Available Bonus Amount</StyledSpan>
                  <StyledSpan $color="#000000">
                    {RUPEE_SYMBOL} {customerAvailableBonusAmount}
                  </StyledSpan>
                </Card>
              </Card>

              <Card
                $width="492px"
                $flexDirection="column"
                $alignItems="center"
                $justifyContent="center"
              >
                <Card
                  $width="100%"
                  $flexDirection="row"
                  $alignItems="center"
                  $justifyContent="space-between"
                >
                  <StyledSpan>Wallet Balance </StyledSpan>
                  <StyledSpan $color="#000000">
                    {RUPEE_SYMBOL} {customerWithdrawalAmount}
                  </StyledSpan>
                </Card>
                <Card
                  $width="100%"
                  $flexDirection="row"
                  $alignItems="center"
                  $justifyContent="space-between"
                >
                  <StyledSpan>Linked Wallet Earnings</StyledSpan>
                  <StyledSpan $color="#000000">
                    {RUPEE_SYMBOL} {customerLinkedWalletEarning}
                  </StyledSpan>
                </Card>

                <Card
                  $width="100%"
                  $flexDirection="row"
                  $alignItems="center"
                  $justifyContent="space-between"
                >
                  <StyledSpan>Total Balance to Withdraw</StyledSpan>
                  <StyledSpan $color="#000000">
                    {RUPEE_SYMBOL} {customerTotalWalletAmount}
                  </StyledSpan>
                </Card>

                {deviceType !== DEVICE_TYPES?.MOBILE ? (
                  <Card
                    $width="100%"
                    $flexDirection="row"
                    $alignItems="center"
                    $justifyContent="space-between"
                  >
                    <P
                      $fontSize="14px"
                      $fontWeight="500"
                      $cursor="pointer"
                      onClick={() => toggleDrawer(true)}
                    >
                      View Withdrawn History
                    </P>
                    <div />
                  </Card>
                ) : null}
              </Card>
            </Referralcard>

            <SearchContainer>
              <SearchDiv $marginLeft="0px">
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
                    border={'1px solid #CDD4DF'}
                    url={ICONS?.SEARCH_ICON}
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
            </SearchContainer>
            <StyledHeader
              $fontSize="16px"
              $lineHeight="24px"
              $fontWeight="600"
              $color="#000"
              $margin="20px 0 8px 0"
            >
              Referee List
            </StyledHeader>
            <Suspense fallback={<BoxLoader size={5} />}>
              {customerReferrerTableHeaders?.length > 0 ? (
                <DisplayTable
                  tableId={'customerReferrerTable'}
                  rows={customerReferrerRows?.slice(
                    (currentPage - 1) * itemsPerPage,
                    itemsPerPage * currentPage,
                  )}
                  headers={customerReferrerTableHeaders}
                  headersType={customerReferrerType}
                  tableWidth={'100%'}
                  emptyDataMessage="There is no referee"
                  statusRemarks={createTooltipArray(customerReferrerDetails)}
                />
              ) : (
                <BoxLoader size={5} />
              )}
              <ViewReferralHistoryDrawer
                open={openWithdrawDrawer}
                toggleDrawer={toggleDrawer}
                userId={userId}
              />
            </Suspense>
          </>
        ) : errorCode === 404 ? (
          <StyledHeader
            $fontSize="14px"
            $lineHeight="21px"
            $fontWeight="400"
            $color="#606C85"
          >
            The customer hasn’t bought membership, so he isn’t eligible for
            referrals.
          </StyledHeader>
        ) : (
          <StyledHeader
            $fontSize="14px"
            $lineHeight="21px"
            $fontWeight="400"
            $color="#606C85"
          >
            Something went wrong
          </StyledHeader>
        )}
      </FixedHeightContainer>

      <Pagination
        onShowSizeChange={onShowSizeChange}
        setCurrentPage={setCurrentPage}
        currentPage={currentPage}
        totalItems={totalItems}
        itemsPerPage={itemsPerPage}
        setItemsPerPage={setItemsPerPage}
        arrowBg={'#ebeff6'}
        isFlexColumn={false}
        isBottom={true}
        setOpenDropdown={setOpenDropdown}
        openDropdown={openDropdown}
        handleDropdown={handleDropdown}
      />
      <FilterDrawer
        open={openFilterDrawer}
        toggleDrawer={setOpenFilterDrawer}
        totalFiltersCount={totalFiltersCount}
        handleApplyClick={handleApplyClick}
        clearFilters={clearFilters}
        filterCheckboxes={filterCheckboxes}
      />
    </Wrapper>
  );
};

export default CustomerReferalTab;
