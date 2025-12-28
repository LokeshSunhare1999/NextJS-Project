import React, { Suspense, lazy, useContext } from 'react';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGetOrderDetails, usePostInitiateRefund } from '../apis/queryHooks';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';
import CustomCTA from '../components/CustomCTA';
import { useSnackbar } from 'notistack';
import RemarksModal from '../components/common/RemarksModal';
import { ModalContext } from '../context/ModalProvider';
import DocumentStatus from '../components/customerDetails/DocumentStatus';
import { RUPEE_SYMBOL } from '../constants/details';
import usePermission from '../hooks/usePermission';
import { ORDER_PERMISSIONS } from '../constants/permissions';
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
  width: ${(props) => props.width};
  height: ${(props) => props.height};
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
  flex-direction: row;
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  gap: 16px;
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
`;

const FlexContainer = styled.div`
  font-family: Poppins;
  width: ${(props) => (props.$width ? props.$width : 'fit-content')};
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => (props.$gap ? props.$gap : '8px')};
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

const PaymentWrap = styled(CustomerWrap)`
  margin-top: 20px;
`;

const P = styled.p`
  color: ${(props) => props.color};
  font-size: ${(props) => props.fontSize};
  font-style: normal;
  font-weight: ${(props) => props.fontWeight};
  line-height: ${(props) => props.lineHeight};
`;

const AnimatedBox = styled(Box)`
  width: calc(100% - 55px);
`;

const OrdersDetails = () => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const location = useLocation();
  const { enqueueSnackbar } = useSnackbar();
  const orderID = location.pathname.substring(8, location.pathname.length);
  const userTypeParams = location.search.substring(10, location.search.length);
  const { displayModal, updateModal } = useContext(ModalContext);

  const {
    data: orders,
    isLoading: isOrderDetailsLoading,
    status: orderDataStatus,
    refetch: refetchOrderDetails,
  } = useGetOrderDetails({ id: orderID, userType: userTypeParams });
  const { mutateAsync: postInitiateRefund } = usePostInitiateRefund(orderID);
  const orderData = orders?.order;
  const customerData = orders?.customer;
  const orderDataModified = {
    orderID: `${orderData?._id}`,
    // orderRating: `${orderData?.orderRating}`,
    // orderName: `${orderData?.orderName}`,
    // platformOrder: `${orderData?.platformOrder}`,
    orderDate: `${orderData?.orderDate}`,
    courseID: `${orderData?.orderItems?.[0]?.productId}`,
    orderStatus: `${orderData?.orderStatus}`,
  };

  const orderStatusTag = orderData?.orderStatus;

  const customerDataModified = {
    customerID: `${orderData?.typeId}`,
    customerName: `${customerData?.name}`,
    saathiID: `${customerData?.saathiId}`,
    // email: `${customerData?.email}`,
    mobileNo: `${customerData?.primaryContact?.dialCode} ${customerData?.primaryContact?.phoneNo}`,
    billingAdd: `${customerData?.trueId?.aadhaar?.address1}`,
  };

  const paymentsDataModified = {
    paymentID: `${orderData?.paymentId}`,
    // paymentMethod: `${coursesPayments?.paymentMethod}`,
    // paymentStatus: `${coursesPayments?.paymentStatus}`,
    paymentDateTime: `${orderData?.orderDate}`,
    totalAmount: `${orderData?.orderAmount}`,
  };

  const handleLeftArrow = () => {
    navigate(-1);
  };
  const handleRefundSubmit = (comment) => {
    postInitiateRefund({ reason: comment })
      .then((res) => {
        enqueueSnackbar('Refund initiated successfully', {
          variant: 'success',
        });
        refetchOrderDetails();
      })
      .catch((err) => {
        if (err?.response?.data?.error?.message) {
          enqueueSnackbar(err?.response?.data?.error?.message, {
            variant: 'error',
          });
        } else enqueueSnackbar('Something went wrong', { variant: 'error' });
      });
  };
  const handleInitiateRefund = () => {
    displayModal(
      <RemarksModal
        text="Enter your Reason for Refund:"
        heading="Initiate Refund"
        placeholder="Enter your comment here..."
        showSubheading="true"
        subheading={`Refund Amount: ${RUPEE_SYMBOL} ${orderData?.orderAmount}`}
        onSubmit={handleRefundSubmit}
        customProps={{
          status: 'VERIFIED',
          heading: { $marginBottom: '5px', $fontWeight: '600' },
          subheading: { $marginBottom: '5px', $fontSize: '14px' },
          textArea: { $height: '124px' },
        }}
        primaryCtaText="Refund"
        primaryCtaBgColor="#141482;"
      />,
    );
  };

  return (
    <Wrapper>
      <LeftArrow>
        <Left onClick={() => handleLeftArrow()}>
          <Img
            src={ICONS.LEFT_ARROW_BLACK}
            alt="leftArrowBlack"
            width={'24px'}
            height={'24px'}
          />
        </Left>
      </LeftArrow>
      <Header>
        <FlexContainer
          $alignItems="center"
          $justifyContent="space-between"
          $width="100%"
        >
          <FlexContainer $flexDirection="column" $gap="0px">
            <HeaderTitle>
              Order Details <DocumentStatus status={orderStatusTag} />
            </HeaderTitle>
            <HeaderDesc>{`Order ID: ${orderID}`}</HeaderDesc>
          </FlexContainer>

          <CustomCTA
            title="Initiate Refund"
            color={'#FFF'}
            bgColor={'#141482'}
            border={'1px solid #CDD4DF'}
            fontSize={'12px'}
            fontWeight="400"
            onClick={handleInitiateRefund}
            isPermitted={hasPermission(ORDER_PERMISSIONS?.UPDATE_ORDERS)}
            disabled={!orders?.refundEligibility}
          />
        </FlexContainer>
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
          title={'Order Details'}
          detailsData={orderDataModified}
        />
      </Suspense>
      <PaymentWrap>
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
          />
        </Suspense>
      </PaymentWrap>
      <PaymentWrap>
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
            title={'Payment Details'}
            detailsData={paymentsDataModified}
            customProps={{ paymentType: 'incoming' }}
          />
        </Suspense>
      </PaymentWrap>
    </Wrapper>
  );
};

export default OrdersDetails;
