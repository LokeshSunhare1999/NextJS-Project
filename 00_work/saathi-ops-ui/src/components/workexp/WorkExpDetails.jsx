import React from 'react';
import styled from 'styled-components';
import DetailsContainer from '../atom/tableComponents/DetailsContainer';

const Wrapper = styled.div`
  width: 100%;
  font-family: Poppins;
  margin-top: 20px;
`;
const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  margin-bottom: ${(props) =>
    props.$marginBottom ? props.$marginBottom : '0px'};
`;

const WorkExpDetails = ({ workExpData, pageRoute }) => {
  const detailsData = {
    company: workExpData?.employerName,
    designation: workExpData?.employmentDesignation,
    city: workExpData?.city,
    state: workExpData?.state,
    startDate: workExpData?.startDate,
    endDate: workExpData?.isCurrentEmployment
      ? 'Currently Working'
      : workExpData?.endDate,
    'Employer’s Cont. No. ': workExpData?.employerPhoneNo,
  };
  const workExpVerificationStatus = {
    employerVerificationStatus: workExpData?.verificationStatus,
    employerRating: workExpData?.rating,
    employerRemarks: workExpData?.employerRemark,
  };

  return (
    <Wrapper>
      <DetailsContainer detailsData={detailsData} title="Experience Details" />
      <Wrapper>
        <P
          $fontSize={'16px'}
          $fontWeight={'600'}
          $lineHeight={'normal'}
          $marginBottom="8px"
        >
          Verification Status
        </P>
        <DetailsContainer
          customProps={{ textWidth: '210px' }}
          detailsData={workExpVerificationStatus}
          showTitle={false}
          showGrid={false}
        />
      </Wrapper>
    </Wrapper>
  );
};

export default WorkExpDetails;
