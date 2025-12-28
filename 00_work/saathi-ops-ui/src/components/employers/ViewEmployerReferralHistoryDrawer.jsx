import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';
import useCustomerReferralHistory from '../../hooks/customer/useCustomerReferralHistory';
const DisplayTable = lazy(() => import('../DisplayTable'));
import BoxLoader from '../common/BoxLoader';
import { referralWithdrawDetails } from '../../mockData';
import { useGetReferralHistory } from '../../apis/queryHooks';

const StyledDrawer = styled(Drawer)`
  z-index: ${zIndexValues?.VIEW_CUSTOMER_COURSE_DRAWER} !important;
`;

const DrawerWrapper = styled.div`
  width: 836px;
  min-height: 100%;
  height: auto;
  background: #f4f6fa;
  padding-top: 3.5rem;
  font-family: Poppins;
  position: relative;
`;

const HeaderContainer = styled.section`
  height: auto;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #cdd4df;
`;

const HeaderBox = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ContentContainer = styled.div`
  width: 100%;
  border-bottom: ${(props) => props?.$borderBottom};
`;

const ContentSection = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 16px 20px;
`;

const StyledHeader = styled.p`
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
  margin: ${(props) => props?.$margin};
  width: ${(props) => props?.$width};
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: 10px;
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const ViewEmployerReferralHistoryDrawer = ({ open, toggleDrawer, userId }) => {
  const {
    data: historyData,
    isError: isHistoryError,
    error: historyError,
  } = useGetReferralHistory(userId, 'STAFFING_AGENCY');

  const referralHeaders = historyData?.txnHistoryHeaders?.map(
    (item) => item?.value,
  );
  const referralHeaderTypes = historyData?.txnHistoryHeaders?.map(
    (item) => item?.type,
  );

  function getValueFromItem(item, key) {
    if (key.includes('.')) {
      const keys = key.split('.');

      // Access the object using the keys
      let currentValue = item;
      for (let k of keys) {
        if (currentValue && k in currentValue) {
          currentValue = currentValue[k];
        } else {
          return undefined; // Return undefined if the key doesn't exist
        }
      }
      return currentValue;
    } else {
      // If there's no dot, return the value using the single key
      return item[key];
    }
  }

  function createData(candidateDetails) {
    const headerKeys = Array.from(
      historyData?.txnHistoryHeaders?.map((item) => item.key),
    );
    return headerKeys?.map((item) => {
      return getValueFromItem(candidateDetails, item);
    });
  }

  const errorCode = historyError?.response?.status;

  const handleCloseDrawer = () => {
    toggleDrawer(false);
  };

  return (
    <StyledDrawer
      PaperProps={{
        sx: {
          backgroundColor: '#f4f6fa',
        },
      }}
      anchor="right"
      open={open}
      onClose={handleCloseDrawer}
    >
      <DrawerWrapper>
        <HeaderContainer>
          <HeaderBox>
            <StyledHeader
              $fontSize={'24px'}
              $lineHeight={'36px'}
              $fontWeight={'600'}
              $color={'#000'}
            >
              Withdraw History
            </StyledHeader>
            <StyledImg
              src={ICONS.CROSS_ICON}
              width={'22px'}
              height={'auto'}
              alt={'close-drawer'}
              onClick={handleCloseDrawer}
            />
          </HeaderBox>
        </HeaderContainer>
        <ContentContainer>
          <ContentSection>
            {!isHistoryError ? (
              <Suspense fallback={<BoxLoader size={5} />}>
                {referralHeaders?.length > 0 ? (
                  <DisplayTable
                    tableId={'employerReferralHistoryTable'}
                    rows={historyData?.txnHistory?.map((item) =>
                      createData(item),
                    )}
                    headers={referralHeaders}
                    headersType={referralHeaderTypes}
                    tableWidth={'100%'}
                    emptyDataMessage="There is no withdrawal history"
                  />
                ) : (
                  <BoxLoader size={5} />
                )}
              </Suspense>
            ) : errorCode === 404 ? (
              <StyledHeader
                $fontSize={'16px'}
                $lineHeight={'24px'}
                $fontWeight={'400'}
                $color={'#000'}
                $margin={'20px 0 8px 0'}
              >
                There is no withdrawal history.
              </StyledHeader>
            ) : (
              <StyledHeader
                $fontSize={'16px'}
                $lineHeight={'24px'}
                $fontWeight={'400'}
                $color={'#000'}
                $margin={'20px 0 8px 0'}
              >
                Something went wrong
              </StyledHeader>
            )}
          </ContentSection>
        </ContentContainer>
      </DrawerWrapper>
    </StyledDrawer>
  );
};

ViewEmployerReferralHistoryDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

export default ViewEmployerReferralHistoryDrawer;
