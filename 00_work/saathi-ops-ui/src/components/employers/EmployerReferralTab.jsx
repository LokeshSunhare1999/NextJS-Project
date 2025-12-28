import React, { useEffect, useState, lazy, Suspense, useRef } from 'react';
import styled from 'styled-components';
import { RUPEE_SYMBOL } from '../../constants/details';
import CustomCTA from '../CustomCTA';
import BoxLoader from '../common/BoxLoader';
import styleComponents from '../../style/pageStyle';
import SearchFilter from '../SearchFilter';
import ICONS from '../../assets/icons';
import usePermission from '../../hooks/usePermission';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../constants/permissions';
import ViewCandidateReferralEarningDrawer from './ViewCandidateReferralEarningDrawer';
import useEmployerReferrerDetails from '../../hooks/employer/useEmployerReferrerDetails';
import LinkCopyWrap from '../common/LinkCopyWrap';

const DisplayTable = lazy(() => import('../DisplayTable'));
const ViewEmployerReferralHistoryDrawer = lazy(
  () => import('./ViewEmployerReferralHistoryDrawer'),
);
const ViewEmployerReferralEarningDrawer = lazy(
  () => import('./ViewEmployerReferralEarningDrawer'),
);
const Pagination = lazy(
  () => import('../../components/atom/tableComponents/Pagination'),
);

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

const CustomWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;
const P = styled.p`
  color: ${(props) => props.$color};
  font-size: ${(props) => props?.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: normal;
  cursor: ${(props) => props.$cursor};

  &:hover {
    text-decoration: ${(props) => (props.$cursor ? 'underline' : 'none')};
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
  height: ${(props) => props?.$height || '80px'};
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
  gap: ${(props) => (props.$gap ? props.$gap : '10px')};
`;
const Img = styled.img`
  width: 16px;
  height: 16px;
`;

const SearchContainer = styled.div`
  margin: 20px 0;
`;
const TableDiv = styled.div`
  position: relative;
`;
const TotalDiv = styled.div`
  margin: 20px 0px;
  font-weight: 600;
  font-size: 16px;
  line-height: 24px;
`;

const EmployerReferralTab = ({ userId, referralLink }) => {
  const isMounted = useRef(false);
  const { hasPermission } = usePermission();

  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [actionOpen, setActionOpen] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [openWithdrawDrawer, setOpenWithdrawDrawer] = useState(false);
  const [openRefferalEarningDrawer, setOpenRefferalEarningDrawer] =
    useState(false);
  const [
    openCandidateReferralEarningDrawer,
    setOpenCandidateReferralEarningDrawer,
  ] = useState(false);
  const [searchId, setSearchID] = useState('');
  const [activeSearchKey, setActiveSearchKey] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [candidateId, setCandidateId] = useState('');
  const [candidateName, setCandidateName] = useState('');

  const {
    employeeUserIdArray,
    employerReferrerRows,
    employerReferrerTableHeaders,
    employerReferrerType,
    errorCode,
    isEmployerReferralHistoryError,
    employerAmountEarned,
    totalCount,
    availableBalance,
  } = useEmployerReferrerDetails(userId, {
    currentPage,
    itemsPerPage,
    activeSearchKey,
  });

  const totalItems = totalCount;

  const toggleWithdrawDrawer = (newOpen) => {
    setOpenWithdrawDrawer(newOpen);
  };

  const toggleReferralEarningDrawer = (newOpen) => {
    setOpenRefferalEarningDrawer(newOpen);
  };

  const toggleCandidateReferralEarningDrawer = (newOpen) => {
    setOpenCandidateReferralEarningDrawer(newOpen);
  };

  const handleSearchById = () => {
    setActiveSearchKey(searchId);
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

  const handleViewDetailsClick = (e) => {
    e.stopPropagation();
    setCandidateName(employerReferrerRows?.[actionIndex]?.[1]);
    setCandidateId(employeeUserIdArray[actionIndex]);
    toggleCandidateReferralEarningDrawer(true);
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by Phone Number',
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
      permission: EMPLOYER_MODULE_PERMISSIONS?.VIEW_CANDIDATE_REFERRAL_DETAILS,
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
      <FixedHeightContainer>
        {!isEmployerReferralHistoryError ? (
          <>
            <Referralcard>
              <Card $width="492px">
                <Card
                  $flexDirection="column"
                  $gap="8px"
                  $justifyContent="center"
                  $alignItems={'flex-start'}
                >
                  <P
                    $fontSize={'16px'}
                    $fontWeight={'600'}
                    $color={'#606C85'}
                    $lineHeight={'24px'}
                  >
                    Available Balance
                  </P>

                  <P
                    $fontSize="14px"
                    $fontWeight="500"
                    $lineHeight="20px"
                    $color={'#606C85'}
                    $cursor="pointer"
                    onClick={() => toggleWithdrawDrawer(true)}
                  >
                    View Withdrawal History
                  </P>
                </Card>
                <P
                  $fontSize={'22px'}
                  $fontWeight={'600'}
                  $color={'#000'}
                  $lineHeight={'33px'}
                >
                  {RUPEE_SYMBOL} {availableBalance}
                </P>
              </Card>
              <Card $width="351px">
                <Card
                  $flexDirection="column"
                  $gap="8px"
                  $justifyContent="center"
                  $alignItems={'flex-start'}
                >
                  <P
                    $fontSize={'16px'}
                    $fontWeight={'600'}
                    $color={'#606C85'}
                    $lineHeight={'24px'}
                  >
                    Total Amount Earned{' '}
                  </P>

                  <P
                    $fontSize="14px"
                    $fontWeight="500"
                    $lineHeight="20px"
                    $color={'#606C85'}
                    $cursor="pointer"
                    onClick={() => toggleReferralEarningDrawer(true)}
                  >
                    View Referral Earning
                  </P>
                </Card>
                <P
                  $fontSize={'22px'}
                  $fontWeight={'600'}
                  $color={'#000'}
                  $lineHeight={'33px'}
                >
                  {RUPEE_SYMBOL} {employerAmountEarned}
                </P>
              </Card>
              {referralLink ? (
                <CustomWrap>
                  <P
                    $fontSize={'16px'}
                    $fontWeight={'600'}
                    $color={'#000000'}
                    $lineHeight={'24px'}
                  >
                    Referral Link{' '}
                  </P>
                  <Card $height={'45px'} $width={'363px'}>
                    <LinkCopyWrap link={referralLink} />
                  </Card>
                </CustomWrap>
              ) : null}
            </Referralcard>
            <SearchContainer>
              <SearchDiv $marginLeft="0px">
                <SearchBox>
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
                    border={'1px solid #CDD4DF'}
                  />
                </SearchBox>
              </SearchDiv>
            </SearchContainer>
            <Suspense fallback={<BoxLoader size={5} />}>
              <TotalDiv>Total: {totalCount}</TotalDiv>
              {employerReferrerTableHeaders?.length > 0 ? (
                <TableDiv>
                  <DisplayTable
                    tableId={'employerReferralTable'}
                    rows={employerReferrerRows}
                    headers={employerReferrerTableHeaders}
                    headersType={employerReferrerType}
                    tableWidth={'100%'}
                    emptyDataMessage="There is no referee"
                    showActionsPanel={showActionsPanel}
                    actionOpen={actionOpen}
                    setActionOpen={setActionOpen}
                    actionIndex={actionIndex}
                    setActionIndex={setActionIndex}
                    arrBtn={arrBtn}
                  />
                </TableDiv>
              ) : (
                <BoxLoader size={5} />
              )}
              <ViewEmployerReferralHistoryDrawer
                open={openWithdrawDrawer}
                toggleDrawer={toggleWithdrawDrawer}
                userId={userId}
              />
              <ViewEmployerReferralEarningDrawer
                userId={userId}
                open={openRefferalEarningDrawer}
                toggleDrawer={toggleReferralEarningDrawer}
              />
              <ViewCandidateReferralEarningDrawer
                userId={userId}
                open={openCandidateReferralEarningDrawer}
                toggleDrawer={toggleCandidateReferralEarningDrawer}
                candidateId={candidateId}
                candidateName={candidateName ?? '-----'}
              />
            </Suspense>
          </>
        ) : errorCode === 404 ? (
          <>
            <Referralcard>
              <Card $width="492px">
                <Card
                  $flexDirection="column"
                  $gap="8px"
                  $justifyContent="center"
                  $alignItems={'flex-start'}
                >
                  <P
                    $fontSize={'16px'}
                    $fontWeight={'600'}
                    $color={'#606C85'}
                    $lineHeight={'24px'}
                  >
                    Available Balance
                  </P>
                </Card>
                <P
                  $fontSize={'22px'}
                  $fontWeight={'600'}
                  $color={'#000'}
                  $lineHeight={'33px'}
                >
                  {RUPEE_SYMBOL} {availableBalance}
                </P>
              </Card>
              <Card $width="351px">
                <Card
                  $flexDirection="column"
                  $gap="8px"
                  $justifyContent="center"
                  $alignItems={'flex-start'}
                >
                  <P
                    $fontSize={'16px'}
                    $fontWeight={'600'}
                    $color={'#606C85'}
                    $lineHeight={'24px'}
                  >
                    Total Amount Earned{' '}
                  </P>
                </Card>
                <P
                  $fontSize={'22px'}
                  $fontWeight={'600'}
                  $color={'#000'}
                  $lineHeight={'33px'}
                >
                  {RUPEE_SYMBOL} {employerAmountEarned}
                </P>
              </Card>
            </Referralcard>
            <StyledHeader
              $fontSize="16px"
              $lineHeight="24px"
              $fontWeight="400"
              $color="#000000"
              $justifyContent="center"
              $margin={'40px 0'}
            >
              No staff has purchased training.
            </StyledHeader>
          </>
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
        isBackground={false}
      />
    </Wrapper>
  );
};

export default EmployerReferralTab;
