import React, { Suspense, useEffect, useState } from 'react';
import styleComponents from '../../style/pageStyle';
import Skeleton from '@mui/material/Skeleton';
import ICONS from '../../assets/icons';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import VerificationResults from './VerificationResults';
import VerificationHeader from './VerificationHeader';
import useParseVerificationData from '../../hooks/useParseVerificationData';
import { CircularProgress } from '@mui/material';
import Remarks from '../common/Remarks';
import { usePostRemarks } from '../../apis/queryHooks';
import { VERIFICATION_PAGE_INFO } from '../../constants/verification';
import { CUSTOMER_DETAILS_PERMISSIONS } from '../../constants/permissions';

const { Top } = styleComponents();

const Wrapper = styled.div`
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: 16px 40px;
`;

const WhiteBox = styled.div`
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
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const FlexContainer = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
  align-items: ${(props) => (props.$alignItems ? props.$alignItems : 'center')};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  height: calc(100vh - 3.2rem);
`;

const VerificationPage = ({
  customerData,
  isCustomerDataFetching,
  customerDataError,
  isCustomerDataError,
  refetchCustomerData,
  setShowVerificationPage,
  pageRoute,
  setPageRoute,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id: customerId } = useParams();
  const { pageData, remarks = [] } = useParseVerificationData(
    customerData,
    pageRoute,
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const {
    mutateAsync: postRemarks,
    status: postRemarksStatus,
    isError: isPostRemarksError,
    error: postRemarksError,
  } = usePostRemarks();

  useEffect(() => {
    if (customerDataError?.message)
      enqueueSnackbar(
        `Failed to fetch details. error : ${customerDataError?.message}`,
        {
          variant: 'error',
        },
      );
  }, [customerDataError?.message]);

  if (isCustomerDataFetching) {
    return (
      <Wrapper>
        <FlexContainer $justifyContent="center" $alignItems="center">
          <CircularProgress sx={{ color: '#141482' }} size={36} />
        </FlexContainer>
      </Wrapper>
    );
  }

  const handleLeftArrow = () => {
    setShowVerificationPage(false);
    setPageRoute('');
  };

  const handlePostRemarks = async ({ message }) => {
    await postRemarks({
      customerId,
      remarks: {
        message,
        remarkType: VERIFICATION_PAGE_INFO[pageRoute]?.WORKFLOW,
      },
    });

    refetchCustomerData();
  };

  return (
    <Wrapper>
      <Top>
        <Header>
          <WhiteBox onClick={() => handleLeftArrow()}>
            <Img
              src={ICONS.LEFT_ARROW_BLACK}
              alt="leftArrowBlack"
              width={'24px'}
              height={'24px'}
            />
          </WhiteBox>
        </Header>
        <VerificationHeader
          pageRoute={pageRoute}
          customerId={customerId}
          isDropdownOpen={isDropdownOpen}
          setIsDropdownOpen={setIsDropdownOpen}
          verificationStatus={pageData?.verificationStatus}
          possibleStates={pageData?.possibleStates}
          refetchCustomerData={refetchCustomerData}
          showNotificationButton={pageData?.showNotificationButton && false}
        />

        <VerificationResults
          verificationData={pageData}
          pageRoute={pageRoute}
        />
        <Remarks
          onSubmit={handlePostRemarks}
          postRemarksError={postRemarksError}
          remarks={remarks}
          isError={isPostRemarksError}
          permission={CUSTOMER_DETAILS_PERMISSIONS?.ADD_VERIFICATION_REMARKS}
        />
      </Top>
    </Wrapper>
  );
};

export default VerificationPage;
