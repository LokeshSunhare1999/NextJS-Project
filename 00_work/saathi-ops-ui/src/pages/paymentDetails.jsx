import React, { Suspense, lazy } from 'react';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import {
  useGetPaymentDetails,
  useGetRefundPaymentDetails,
} from '../apis/queryHooks';
const DetailsContainer = lazy(
  () => import('../components/atom/tableComponents/DetailsContainer'),
);

const Wrapper = styled.div`
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: 16px 40px;
  font-family: Poppins;
`;

const LeftArrow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Left = styled.div`
  display: inline-flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
`;

const Img = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;

const Header = styled.div`
  width: calc(100% - 0px);
  margin: 0px 0px 20px 0px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const HeaderDesc = styled.span`
  width: auto;
  font-size: 16px;
  ont-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const CustomerWrap = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  margin-top: 20px;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.l$ineHeight};
`;

const AnimatedBox = styled(Box)`
  width: calc(100% - 55px);
`;

const PaymentsDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryString = location.search;
  const urlParams = new URLSearchParams(queryString);
  const paymentID = location.pathname.includes("refund") 
  ? location.pathname.substring(8, location.pathname.length) 
  : location.pathname.substring(10, location.pathname.length);
  const userTypeParams = urlParams.get('userType');
  const paymentType = urlParams.get('paymentType');

  const {
    data: payments,
    status: paymentDataStatus,
    isLoading: ispaymentDataLoading,
    isFetching: ispaymentDataFetching,
    refetch: refetchpaymentDetails,
    isError: isGetpaymentDetailErr,
    error: getpaymentDetailErr,
  } = paymentType === 'incoming'
    ? useGetPaymentDetails({ id: paymentID, userType: userTypeParams })
    : useGetRefundPaymentDetails({ id: paymentID, userType: userTypeParams });

  let paymentsDataModified = {},
    customerDataModified = {};

  if (paymentType === 'incoming') {
    const paymentData = payments?.payment;
    const customerData = payments?.customer;

    customerDataModified = {
      customerID: `${paymentData?.typeId}`,
      customerName: `${customerData?.name}`,
      trueID: `${customerData?.saathiId}`,
      // email: `${customerData?.email}`,
      mobileNo: `${customerData?.primaryContact?.dialCode} ${customerData?.primaryContact?.phoneNo}`,
    };

    paymentsDataModified = {
      orderID: `${paymentData?.orderId}`,
      paymentTime: `${paymentData?.paymentDate}`,
      'PA Name': `${paymentData?.paymentGateway}`,
      totalAmount: `${paymentData?.amount}`,
      'PA Txn ID': `${paymentData?.uniqueOrderId}`,
      txnRemarks: `${paymentData?.pgRemarks}`,
      paymentStatus: `${paymentData?.paymentStatus}`,
    };
  } else {
    const paymentData = payments?.refund;
    const customerData = payments?.customer;
    customerDataModified = {
      customerID: `${paymentData?.typeId}`,
      customerName: `${customerData?.name}`,
      trueID: `${customerData?.saathiId}`,
      mobileNo: `${customerData?.primaryContact?.dialCode} ${customerData?.primaryContact?.phoneNo}`,
    };

    paymentsDataModified = {
      orderID: `${paymentData?._id}`,
      refundTime: `${paymentData?.createdAt}`,
      'PA Name': `${paymentData?.paymentGateway}`,
      totalAmount: `${paymentData?.refundAmount}`,
      'PA Txn ID': `${paymentData?.uniqueRequestId}`,
      txnRemarks: `${paymentData?.pgRemarks}`,
      refundStatus: `${paymentData?.status}`,
    };
  }
  const handleLeftArrow = () => {
    navigate(-1);
  };

  return (
    <Wrapper>
      <LeftArrow>
        <Left onClick={() => handleLeftArrow()}>
          <Img
            src={ICONS.LEFT_ARROW_BLACK}
            alt="leftArrowBlack"
            $width={'24px'}
            $height={'24px'}
          />
        </Left>
      </LeftArrow>
      <Header>
        <HeaderTitle>
          {paymentType === 'incoming' ? 'Payment Details' : 'Refund Details'}{' '}
        </HeaderTitle>
        <HeaderDesc>{`${paymentType === 'incoming' ? 'Payment ID' : 'Refund Order ID'} ${paymentID}`}</HeaderDesc>
      </Header>
      <Suspense
        fallback={
          <AnimatedBox>
            {[1, 2, 3, 4, 5].map((item, idx) => {
              return <Skeleton animation="wave" height={70} key={idx} />;
            })}
          </AnimatedBox>
        }
      >
        <DetailsContainer
          title={
            paymentType === 'incoming' ? 'Payment Details' : 'Refund Details'
          }
          customProps={{ paymentType: paymentType }}
          detailsData={paymentsDataModified}
          userType={userTypeParams}
        />
      </Suspense>
      <CustomerWrap>
        <Suspense
          fallback={
            <AnimatedBox>
              {[1, 2, 3, 4, 5].map((item, idx) => {
                return <Skeleton animation="wave" height={70} key={idx} />;
              })}
            </AnimatedBox>
          }
        >
          <DetailsContainer
            title={'Customer Details'}
            detailsData={customerDataModified}
            customProps={{ paymentType: paymentType }}
            userType={userTypeParams}
          />
        </Suspense>
      </CustomerWrap>
    </Wrapper>
  );
};

export default PaymentsDetails;
