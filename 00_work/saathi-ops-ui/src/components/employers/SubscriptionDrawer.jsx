import DisplayDrawer from '../common/DisplayDrawer';
import styled from 'styled-components';
import { zIndexValues } from '../../style';
import ICONS from '../../assets/icons';
import { RUPEE_SYMBOL } from '../../constants/details';
import CustomCTA from '../CustomCTA';
import { useEffect, useState } from 'react';
import { usePostCreditsPackageData } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';

const ContentSection = styled.div`
  margin: 20px 0 0 20px;
  display: flex;
  align-items: center;
  gap: 30px;
`;

const ButtonWrap = styled.div`
  margin: 40px 0 0 20px;
  display: flex;
  justify-content: center;
`;

const HorizontalContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
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

const P = styled.p`
  white-space: nowrap;
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => (props?.$fontSize ? props.$fontSize : '14px')};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const Box = styled.div`
  display: flex;
  background: ${(props) => (props.$selected ? '#E9E9FF' : '#fff')};
  color: ${(props) => (props.$selected ? '#141482' : '#666666')};
  font-size: 14px;
  line-height: 20px;
  font-weight: 600;
  border: 2px solid ${(props) => (props.$selected ? '#20247E' : '#bac8d3')};
  border-radius: 12px;
  gap: 8px;
  align-items: center;
  width: 220px;
  height: 60px;
  padding-left: 20px;
  cursor: pointer;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;

const Wrapper = styled.section`
  margin: 20px 0 0 20px;
  display: flex;
  flex-direction: column;
  width: 92%;
`;

const RowWrap = styled.div`
  display: flex;
  gap: 5px;
`;

const ViewRight = styled.div`
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #ffffff;
  padding: 0px 20px;
  cursor: pointer;
  border-radius: ${(props) => (props.actionOpen ? '8px 8px 0 0' : '8px')};
`;
const BorderLine = styled.div`
  width: 92%;
  height: 1px;
  background: #e5e5e5;
  margin: 20px 0 0 20px;
`;

const Rows = styled.div`
  display: flex;
  flex-direction: column;
  background: ${(props) => (props.selected ? 'red' : '#fff')};
  padding: 10px 0 0 20px;
  cursor: pointer;
`;

const Hrow = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
`;

const Seperate = styled.div`
  width: 95%;
  height: 1px;
  background: #e2e2e2;
  margin: 10px 0 10px 0;
`;
const ActionWrap = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
  padding-bottom: 20px;
  border-radius: 8px;
`;

const TextArea = styled.textarea`
  border: 1px solid #cdd4df;
  border-radius: 10px;
  width: 100%;
  height: ${(props) => props?.$height};
  resize: none;
  box-sizing: border-box;
  font-family: Poppins;
  color: #606c85;
  padding: 8px;
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const StyledSpan = styled.span`
  color: ${(props) => props?.$color};
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
`;

export const transformPackages = (response) => {
  const result = {
    credits: [],
  };

  response?.packages?.forEach((pkg) => {
    if (pkg?.type === 'EMPLOYER_CREDITS') {
      result.credits.push({
        productId: pkg?.productId,
        price: pkg?.price,
        gst: pkg?.gst,
        gstAmount: pkg?.gstAmount,
        finalPrice: pkg?.finalPrice,
        credits: pkg?.credits,
        validityText: pkg?.validityText,
      });
    }
  });

  return result;
};

const SubsciptionDrawer = ({
  open,
  toggleDrawer,
  employerData,
  subscriptionData,
}) => {
  const [actionOpen, setActionOpen] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [remark, setRemark] = useState('');
  const [remarkError, setRemarkError] = useState(null);
  const { enqueueSnackbar } = useSnackbar();

  const {
    mutate: postCreditsPackageData,
    status: postCreditsPackageStatus,
    error: postCreditsPackageError,
  } = usePostCreditsPackageData();

  const subscriptionPackages = transformPackages(subscriptionData);

  useEffect(() => {
    if (postCreditsPackageStatus === 'success') {
      enqueueSnackbar('Your payment has been successfully added', {
        variant: 'success',
      });
    } else if (postCreditsPackageStatus === 'error') {
      if (postCreditsPackageError?.response?.data?.error?.message) {
        enqueueSnackbar(
          postCreditsPackageError?.response?.data?.error?.message,
          {
            variant: 'error',
          },
        );
      } else {
        enqueueSnackbar('Failed to purchase credits. Please try again.', {
          variant: 'error',
        });
      }
    }
  }, [postCreditsPackageStatus]);

  const checkRemark = () => {
    if (!remark?.trim()) {
      setRemarkError('Remarks cannot be empty or contain only spaces.');
      return false;
    } else if (remark.length < 15) {
      setRemarkError('Please limit the texts between 15 and 1000 characters.');
      return false;
    } else {
      setRemarkError(null);
      return true;
    }
  };

  const handleAddPayment = () => {
    if (!selectedPackage || !employerData?._id) return;
    const isValid = checkRemark();
    if (!isValid) return;
    postCreditsPackageData({
      employerId: employerData._id,
      productId: selectedPackage,
      payload: {
        remarks: remark,
      },
    });

    setRemark('');
    setRemarkError(null);
    handleCloseDrawer();
  };

  const handleActionClick = () => {
    setActionOpen(!actionOpen);
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
    setSelectedPackage(null);
    setActionOpen(true);
    setRemarkError(null);
  };

  const headerContent = () => (
    <StyledHeader
      $fontSize={'24px'}
      $lineHeight={'36px'}
      $fontWeight={'600'}
      $color={'#000'}
    >
      {employerData?.companyRegisteredName || '-----'}
    </StyledHeader>
  );

  const renderCreditRow = (data, index) => {
    return (
      <Rows
        key={index}
        onClick={() => setSelectedPackage(data?.productId)}
        $selected={true}
      >
        <HorizontalContainer>
          <P $fontSize={'20px'} $color="#2020CE" $fontWeight={600}>
            {data?.credits}
          </P>
          {selectedPackage === data?.productId ? (
            <Img height={'20px'} width={'20px'} src={ICONS.GREEN_TICK} />
          ) : null}
        </HorizontalContainer>

        <Hrow>
          <P $fontSize={'16px'} $fontWeight={600}>
            {RUPEE_SYMBOL}
            {data?.price}
          </P>
          <P $fontSize={'12px'} $fontWeight={400} $color="#666666">
            {data?.validityText} validity • Amounts Exclusive of GST
          </P>
        </Hrow>

        {index !== subscriptionPackages?.credits?.length - 1 && <Seperate />}
      </Rows>
    );
  };

  return (
    <DisplayDrawer
      open={open}
      handleCloseDrawer={handleCloseDrawer}
      zIndex={zIndexValues.ADD_COURSE_DRAWER}
      headerContent={headerContent}
      showCancelCta={false}
      width="550px"
    >
      <Wrapper>
        <ViewRight actionOpen={actionOpen} onClick={handleActionClick}>
          <P $fontSize={'14px'} $fontWeight={600}>
            Select credit package
          </P>
          <Img
            src={actionOpen ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}
            alt="arrowDown"
            width="14px"
            height="14px"
          />
        </ViewRight>
        {actionOpen && (
          <ActionWrap>
            {subscriptionPackages?.credits?.map((credit, index) =>
              renderCreditRow(credit, index),
            )}
          </ActionWrap>
        )}
      </Wrapper>

      <Wrapper>
        <RowWrap>
          <P $fontWeight={'600'}>Add Remarks</P>
          <StyledSpan
            $fontSize={'14px'}
            $lineHeight={'20px'}
            $fontWeight={'400'}
            $color={'#ED2F2F'}
          >
            *
          </StyledSpan>
        </RowWrap>
      </Wrapper>
      <Wrapper>
        <TextArea
          value={remark}
          onChange={(e) => {
            setRemark(e.target.value);
          }}
        />
        <ErrorBox>
          <P
            $color={'red'}
            $fontSize={'14px'}
            $fontWeight={'300'}
            $lineHeight={'normal'}
          >
            {remarkError}
          </P>
        </ErrorBox>
      </Wrapper>

      <ButtonWrap>
        <CustomCTA
          title={'Add Payment'}
          color={'#FFF'}
          bgColor={'#141482'}
          border={'1px solid #CDD4DF'}
          buttonWidth="90%"
          disabled={!selectedPackage}
          onClick={handleAddPayment}
        />
      </ButtonWrap>
    </DisplayDrawer>
  );
};

export default SubsciptionDrawer;
