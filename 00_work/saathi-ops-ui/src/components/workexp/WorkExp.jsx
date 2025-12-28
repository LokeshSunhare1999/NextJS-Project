import React, { useEffect, useState } from 'react';
import styleComponents from '../../style/pageStyle';
import ICONS from '../../assets/icons';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { useSnackbar } from 'notistack';
import { CircularProgress } from '@mui/material';
import WorkExpDetails from './WorkExpDetails';
import Remarks from '../common/Remarks';
import { usePostRemarks } from '../../apis/queryHooks';
import { scrollToTop } from '../../utils/helper';
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

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0px;
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

const WorkExp = ({
  customerData,
  employments,
  isCustomerDataFetching,
  customerDataError,
  isCustomerDataError,
  refetchCustomerData,
  workExpIndex,
  setShowWorkExperiencePage,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { id: customerId } = useParams();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const activeExperienceInfo = employments[workExpIndex];

  const {
    mutateAsync: postRemarks,
    status: postRemarksStatus,
    isError: isPostRemarksError,
    error: postRemarksError,
  } = usePostRemarks();

  useEffect(() => {
    scrollToTop();
  }, []);

  useEffect(() => {
    if (isCustomerDataError)
      enqueueSnackbar(
        `Failed to fetch details. error : ${customerDataError?.message}`,
        {
          variant: 'error',
        },
      );
  }, [isCustomerDataError]);

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
    setShowWorkExperiencePage(false);
  };

  const handlePostRemarks = async ({ message }) => {
    await postRemarks({
      customerId,
      remarks: {
        message,
        remarkType: 'EMPLOYMENTS',
        referenceId: activeExperienceInfo._id,
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

        <Left>
          <P $fontSize={'24px'} $fontWeight={'600'} $lineHeight={'normal'}>
            Work Experience{' '}
            {customerData?.name ? `(${customerData?.name})` : ''}
          </P>
        </Left>

        <WorkExpDetails workExpData={activeExperienceInfo} />
        <Remarks
          modalHeading="Add Saathi Remarks"
          modalPlaceholder="Enter your remarks here. "
          onSubmit={handlePostRemarks}
          postRemarksError={postRemarksError}
          remarks={activeExperienceInfo?.remarks || []}
          isError={isPostRemarksError}
          showText={false}
          showCloseIcon={false}
          permission={CUSTOMER_DETAILS_PERMISSIONS?.ADD_WORKEX_REMARKS}
        />
      </Top>
    </Wrapper>
  );
};

export default WorkExp;
