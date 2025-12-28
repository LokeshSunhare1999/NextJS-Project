import React, { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';
import CustomCTA from '../CustomCTA';
import DrawerInput from '../common/DrawerInput';
import DisplayDrawer from '../common/DisplayDrawer';
import { downloadPDF, formatDate } from '../../utils/helper';
import { RUPEE_SYMBOL } from '../../constants/details';
import DocumentStatus from '../customerDetails/DocumentStatus';
import { usePostChangePayoutStatus } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import PayoutRequestDetailsTabs from './PayoutRequestDetailsTabs';
import usePermission from '../../hooks/usePermission';
import DownloadInvoiceDropdown from './DownloadInvoiceDropdown';
import BankAccountDetails from './BankAccountDetails';
import usePayoutRequest from '../../hooks/payoutRequest/usePayoutRequest';
import Icon from '../../assets/icons/index';

const ContentSection = styled.div`
  display: flex;
  margin: ${(props) => (props.$margin ? props.$margin : '20px 0 16px 20px')};
  border-radius: ${(props) => (props.$borderRadius ? props.$borderRadius : '')};
  background-color: ${(props) =>
    props.$backGroundColor ? props.$backGroundColor : ''};
  padding: ${(props) => (props.$padding ? props.$padding : '')};
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => props.$gap ?? null};
`;

const UpperBox = styled.div`
  padding: 16px 20px;
  display: flex;
  gap: 8px;
  flex-direction: column;
`;

const UpperBoxHead = styled.div`
  color: #000;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
`;

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

const StyleDownload = styled.p`
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
  margin: ${(props) => props?.$margin};
  width: ${(props) => (props?.$width ? props?.$width : '100%')};
  display: flex;
  cursor: pointer;
  align-items: center;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: ${(props) => (props.$gap ? props.$gap : '10px')};
  opacity: ${(props) => (props.$opacity ? props.$opacity : '1')};
`;

const StyledField = styled.div`
  width: ${(props) => props.$width || '50%'};
  font-size: ${(props) => props.$fontSize || '16px'};
  line-height: ${(props) => props.$lineHeight || '24px'};
  font-weight: ${(props) => props.$fontWeight || 400};
  color: ${(props) => props.$color || '#000'};
`;

const StyledCheckbox = styled.input.attrs({ type: 'checkbox' })`
  width: 24px;
  height: 24px;
  border: 1px solid black;
  outline: none;
  border-radius: 4px;
  appearance: none;
  background-color: #fff;
  cursor: pointer;
  display: inline-block;
  position: relative;
  transition: background-color 0.2s ease;

  &:checked {
    background-color: #4bae4f;
  }

  &:checked::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 10px;
    height: 5px;
    border: solid #fff;
    border-width: 0 0px 2px 2px;
    transform: translate(-50%, -60%) rotate(-47deg);
  }
`;
const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
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
const DrawerIcon = styled.div`
  position: absolute;
  right: 10px;
  padding: 12px 0px 0px 0px;
`;

const PayoutRequestDrawer = ({
  open,
  toggleDrawer,
  payoutObj,
  refetchAllPayouts,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = usePermission();
  const [comment, setComment] = useState('');
  const [commentError, setCommentError] = useState(false);
  const [isRemarkVisible, setIsRemarkVisible] = useState(false);

  const {
    payoutData,
    errorCode,
    amountBreakupData,
    referralBreakupData,
    bankAccountData,
    refetchPayoutData,
  } = usePayoutRequest(payoutObj?._id);

  const { mutate: mutateChangePayoutStatus, status: changePayoutStatus } =
    usePostChangePayoutStatus(payoutData?.staffingAgency?._id);

  const handleCloseDrawer = () => {
    setComment('');
    setCommentError(false);
    setIsRemarkVisible(false);
    refetchAllPayouts();
    refetchPayoutData();
    toggleDrawer();
  };

  const handleChangeStatus = (status) => {
    if (!comment) {
      setCommentError(true);
      return;
    } else {
      setCommentError(false);
      mutateChangePayoutStatus({
        status,
        remark: comment,
        isRemarkVisible,
      });
    }
  };

  useEffect(() => {
    if (changePayoutStatus === 'success') {
      enqueueSnackbar('Payout status updated successfully', {
        variant: 'success',
      });
      handleCloseDrawer();
    } else if (changePayoutStatus === 'error') {
      enqueueSnackbar('Something went wrong, Please try again later', {
        variant: 'error',
      });
      handleCloseDrawer();
    }
  }, [changePayoutStatus]);

  const handleDownload = async (url, fileName) => {
    if (!url) {
      console.error(`${fileName} URL not available`);
      return;
    }

    try {
      await downloadPDF(url, `${fileName}.pdf`);
    } catch (error) {
      console.error('Failed to download PDF:', error);
    }
  };

  const headerContent = () => {
    return (
      <>
        <StyledHeader
          $fontSize={'24px'}
          $lineHeight={'36px'}
          $fontWeight={'600'}
          $color={'#000'}
        >
          Payout Request
        </StyledHeader>
        {payoutData?.invoiceUrl && (
          <StyleDownload
            $fontSize={'14px'}
            $lineHeight={'21px'}
            $fontWeight={'500'}
            $justifyContent={'end'}
            $margin={'0px 8px'}
            $color={'#3B2B8C'}
            onClick={() => handleDownload(payoutData?.invoiceUrl, 'Invoice')}
          >
            <img src={Icon.DOWNLOAD} alt="" />
            <u>Download Invoice</u>
          </StyleDownload>
        )}
      </>
    );
  };

  return (
    <DisplayDrawer
      open={open}
      handleCloseDrawer={handleCloseDrawer}
      headerContent={headerContent}
      zIndex={zIndexValues?.PAYMENT_FILTER_DRAWER}
      showFooter={false}
      width="534px"
    >
      <ContentSection>
        <StyledField $fontWeight={500}>Request ID</StyledField>
        <StyledField $color={'#5D5D5D'}>{payoutData?._id}</StyledField>
      </ContentSection>

      <ContentSection>
        <StyledField $fontWeight={500}>Company Name</StyledField>
        <StyledField $color={'#5D5D5D'}>
          {payoutData?.staffingAgency?.companyRegisteredName ?? '-----'}
        </StyledField>
      </ContentSection>

      <ContentSection>
        <StyledField $fontWeight={500}>Request Created On</StyledField>
        <StyledField $color={'#5D5D5D'}>
          {formatDate(payoutData?.createdAt, 'hh:mm A, DD MMM YYYY')}
        </StyledField>
      </ContentSection>

      {payoutData?.status === 'PENDING' ? (
        <ContentSection>
          <StyledField $fontWeight={500}>Amount available</StyledField>
          <StyledField $color={'#5D5D5D'}>
            {RUPEE_SYMBOL} {payoutData?.invoice?.totalAmount}
          </StyledField>
        </ContentSection>
      ) : null}
      {payoutData?.status === 'PENDING' ? (
        <ContentSection>
          <StyledField $fontWeight={500}>Amount to be processed</StyledField>
          <StyledField $color={'#5D5D5D'}>
            {RUPEE_SYMBOL} {payoutData?.invoice?.totalAmount}
          </StyledField>
        </ContentSection>
      ) : null}

      {payoutData?.status !== 'PENDING' ? (
        <ContentSection>
          <StyledField $fontWeight={500}>Request Processed On</StyledField>
          <StyledField $color={'#5D5D5D'}>
            {formatDate(payoutData?.updatedAt, 'hh:mm A, DD MMM YYYY')}
          </StyledField>
        </ContentSection>
      ) : null}

      {payoutData?.status === 'VERIFIED' ? (
        <ContentSection>
          <StyledField $fontWeight={500}>Amount Processed</StyledField>
          <StyledField $color={'#5D5D5D'}>
            {RUPEE_SYMBOL} {payoutData?.amount}
          </StyledField>
        </ContentSection>
      ) : null}

      {/* {payoutData?.status !== 'PENDING' ? ( */}
      <>
        <ContentSection>
          <StyledField $fontWeight={500}>Status</StyledField>
          <StyledField>
            <DocumentStatus status={payoutData?.status} />
          </StyledField>
        </ContentSection>

        <ContentSection>
          <StyledField $fontWeight={500}>Comment</StyledField>
          <StyledField $color={'#5D5D5D'}>
            {payoutData?.remark ?? '-----'}
          </StyledField>
        </ContentSection>
      </>
      {/* ) : null} */}

      <UpperBox>
        <Suspense fallback={<div></div>}>
          <PayoutRequestDetailsTabs
            currentIndex={payoutData}
            amountBreakupData={amountBreakupData}
            referralBreakupData={referralBreakupData}
          />
        </Suspense>
      </UpperBox>

      <UpperBox>
        <DownloadInvoiceDropdown invoiceUrl={payoutData?.invoiceUrl} />
      </UpperBox>

      <UpperBox>
        <UpperBoxHead>
          Amount to be credited in below mentioned Bank Account
        </UpperBoxHead>
        <BankAccountDetails bankAccountData={bankAccountData} />
      </UpperBox>

      {payoutData?.status === 'PENDING' ? (
        <>
          <ContentSection
            $flexDirection={'column'}
            $backGroundColor={'#FFFFFF'}
            $padding={'20px'}
            $borderRadius={'10px'}
            $margin={'16px 20px 16px 20px'}
          >
            <DrawerInput
              fieldType={'inputArea'}
              fieldHeader={'Add Comment'}
              fieldError={commentError}
              fieldPlaceholder={'Add a comment for record keeping'}
              fieldValue={comment}
              handleFieldChange={(e) => setComment(e.target.value)}
              isManadatory={true}
              errorText={`* Comment is required.`}
            />
            <FlexContainer $alignItems="center" $marginTop="20px">
              <StyledCheckbox
                checked={isRemarkVisible}
                onChange={(e) => setIsRemarkVisible(e.target.checked)}
              />
              Visible to Customer
            </FlexContainer>
          </ContentSection>
          <ContentSection
            $gap={'20px'}
            $borderRadius={'10px'}
            $margin={'20px 20px 16px 20px'}
            $padding={'0px 0px 20px 0px'}
          >
            <CustomCTA
              title="Reject"
              bgColor={'#fff'}
              border={'1px solid #ED2F2F'}
              color={'#ED2F2F'}
              height={'48px'}
              buttonWidth={'calc(50% - 10px)'}
              onClick={() => handleChangeStatus('REJECTED')}
            />
            <CustomCTA
              title="Approve"
              bgColor={'#11B535'}
              border={'1px solid #11B535'}
              color={'#fff'}
              buttonWidth={'calc(50% - 10px)'}
              onClick={() => handleChangeStatus('VERIFIED')}
            />
          </ContentSection>
        </>
      ) : null}
    </DisplayDrawer>
  );
};
PayoutRequestDrawer.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func,
};
export default PayoutRequestDrawer;
