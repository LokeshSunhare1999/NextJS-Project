import React, { useEffect } from 'react';
import styleComponents from '../../style/pageStyle';
import ICONS from '../../assets/icons';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import JobReelsVerificationResults from './JobReelsVerificationResults';
import JobReelsVerificationHeader from './JobReelsVerificationHeader';
import { CircularProgress } from '@mui/material';

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
  padding: ${(props) => props.$padding};
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

const JobReelsVerification = ({
  customerProfileData,
  customerData,
  isCustomerDataFetching,
  customerDataError,
  refetchCustomerData,
  refetchUserBasicDetails,
  setShowJobReelPage,
  jobReelsIndex,
  pageRoute,
  navigate,
  autoSuggestedJobreelData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id: customerId } = useParams();
  const jobReelData = [
    customerProfileData?.firstJobReelDetails,
    customerProfileData?.secondJobReelDetails,
  ];

  const activeJobReelInfo = jobReelData[jobReelsIndex ? jobReelsIndex : 0];
  const jobReelKey = jobReelsIndex === 0 ? '' : 'updated';
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
    setShowJobReelPage(false);
    navigate(-1);
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
        <JobReelsVerificationHeader
          customerData={customerData}
          customerId={customerId}
          customerProfileData={activeJobReelInfo}
        />

        <JobReelsVerificationResults
          customerProfileData={activeJobReelInfo}
          setShowJobReelPage={setShowJobReelPage}
          customerId={customerId}
          jobReelKey={jobReelKey}
          autoSuggestedJobreelData={autoSuggestedJobreelData}
        />
      </Top>
    </Wrapper>
  );
};
export default JobReelsVerification;
