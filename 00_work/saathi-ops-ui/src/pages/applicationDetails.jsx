import React, { useEffect } from 'react';
import styleComponents from '../style/pageStyle';
import { useNavigate, useParams } from 'react-router-dom';
import ICONS from '../assets/icons';
import DetailsContainer from '../components/atom/tableComponents/DetailsContainer';
import styled from 'styled-components';
import ApplicantDetailsPageHeader from '../components/applicants/ApplicantDetailsPageHeader';
import IdContainer from '../components/atom/tableComponents/IdContainer';
import Remarks from '../components/common/Remarks';
import UpdateStatusBar from '../components/applicants/UpdateStatusBar';
import {
  useGetApplicantDetails,
  usePutApplicantStatus,
} from '../apis/queryHooks';
import { useParseApplicantDetails } from '../hooks/applicants/useParseApplicantDetails';
import { APPLICANT_STATUS_CURRENT_STATES } from '../constants/jobs';
import { scrollToTop } from '../utils/helper';

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Wrapper = styled.div`
  font-family: 'Poppins';
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

const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Reduce the gap between elements */
  flex-wrap: nowrap; /* Prevent wrapping */
`;
const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: 8px;
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;
const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor || '#f0f0f0'};
  color: ${({ textColor }) => textColor || '#333'};
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  border: 1px solid ${({ borderColor }) => borderColor || '#dcdcdc'};
  font-family: Poppins;
`;
const CountBoxWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
`;
const HeaderWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const { Top } = styleComponents();

const ApplicantDetails = () => {
  const navigate = useNavigate();

  const { applicantId } = useParams();

  const { data: applicantData, refetch: refetchApplicantData } =
    useGetApplicantDetails(applicantId);
  const { mutateAsync: updateStatus, error: updateStatusError } =
    usePutApplicantStatus(applicantId);
  const { applicantBioData, jobStatus, statusMap } =
    useParseApplicantDetails(applicantData);

  const handleLeftArrow = () => {
    navigate(-1);
  };

  useEffect(() => {
    scrollToTop();
  }, []);
  const handlePostRemarks = async ({ message }) => {
    updateStatus({
      remarks: {
        message,
      },
    }).then((res) => {
      refetchApplicantData();
    });
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
        <HeaderWrap>
          <FlexWrapper>
            <ApplicantDetailsPageHeader
              heading={applicantBioData?.name}
              subHeading={`True ID:`}
              subHeadingComponent={
                <IdContainer
                  item={applicantData?.customerDetails?.trueId?._id}
                />
              }
              status={jobStatus}
            />
          </FlexWrapper>
        </HeaderWrap>

        <FlexContainer $marginTop="20px">
          <DetailsContainer showTitle={false} detailsData={applicantBioData} />
        </FlexContainer>
      </Top>
      {Object.keys(statusMap || {})?.map((item) => {
        if (
          statusMap[item]?.nextPossibleStates?.length > 0 ||
          statusMap[item]?.status
        )
          return (
            <UpdateStatusBar
              refetchApplicantData={refetchApplicantData}
              statusDetails={statusMap[item]}
              statusKey={item}
              employerDetails={applicantData?.employerDetails?.[0]}
            />
          );
      })}
      <Remarks
        onSubmit={handlePostRemarks}
        postRemarksError={updateStatusError}
        remarks={applicantData?.remarks}
        isError={false}
        modalHeading="Add Comment"
        modalText="Comment"
        modalPlaceholder="Enter your comment here"
        title="Employer Comments"
        ctaTitle="Add Comments"
        emptyPlaceholder="No Comments Added"
        successMsg="You successfully added a comment"
        errorMsg="Failed to post comment"
        statusMap={APPLICANT_STATUS_CURRENT_STATES}
      />
    </Wrapper>
  );
};

export default ApplicantDetails;
