import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';
import useEmployerReferralHistory from '../../hooks/employer/useEmployerReferralHistory';
const DisplayTable = lazy(() => import('../DisplayTable'));
import BoxLoader from '../common/BoxLoader';
import {
  REFERRAL_HEADERS,
  REFERRAL_HEADERS_TYPE,
} from '../../constants/employer';

const StyledDrawer = styled(Drawer)`
  z-index: ${zIndexValues?.VIEW_CUSTOMER_COURSE_DRAWER} !important;
`;

const DrawerWrapper = styled.div`
  width: 621px;
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

const StyledDiv = styled.div`
  display: ${(props) => props.$display ?? 'flex'};
  flex-direction: ${(props) => props.$flexDirection ?? 'column'};
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const ViewEmployerReferralEarningDrawer = ({ open, toggleDrawer, userId }) => {
  const {
    employerReferralHistoryRows,
    errorCode,
    isEmployerReferralHistoryError,
  } = useEmployerReferralHistory(userId, false); // id, type

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
            <StyledDiv>
              <StyledHeader
                $fontSize={'24px'}
                $lineHeight={'36px'}
                $fontWeight={'600'}
                $color={'#000'}
              >
                Total Amount Earned
              </StyledHeader>
              <StyledHeader
                $fontSize={'14px'}
                $lineHeight={'21px'}
                $fontWeight={'400'}
                $color={'#000'}
              >
                Referral Earning
              </StyledHeader>
            </StyledDiv>
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
            {!isEmployerReferralHistoryError ? (
              <Suspense fallback={<BoxLoader size={5} />}>
                <DisplayTable
                  tableId={'employerReferralHistoryTable'}
                  rows={employerReferralHistoryRows}
                  headers={REFERRAL_HEADERS}
                  headersType={REFERRAL_HEADERS_TYPE}
                  tableWidth={'100%'}
                  emptyDataMessage="There is no referral earning"
                  lastAlignRight={true}
                />
              </Suspense>
            ) : errorCode === 404 ? (
              <StyledHeader
                $fontSize={'16px'}
                $lineHeight={'24px'}
                $fontWeight={'400'}
                $color={'#000'}
                $margin={'20px 0 8px 0'}
              >
                There is no referral earning.
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

ViewEmployerReferralEarningDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  userId: PropTypes.string,
};

export default ViewEmployerReferralEarningDrawer;
