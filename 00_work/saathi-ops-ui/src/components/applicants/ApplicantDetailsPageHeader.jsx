import React from 'react';
import styled from 'styled-components';
import DocumentStatus from '../customerDetails/DocumentStatus';

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
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

const ApplicantDetailsPageHeader = ({
  heading,
  subHeading,
  status,
  subHeadingComponent,
}) => {
  return (
    <Wrapper>
      <Left>
        <P $fontSize={'24px'} $fontWeight={'600'} $lineHeight={'normal'}>
          {heading}
        </P>
        <FlexContainer $alignItems="center">
          <P $fontSize={'16px'} $fontWeight={'400'} $lineHeight={'normal'}>
            {subHeading}
          </P>
          {subHeadingComponent ? subHeadingComponent : null}
          {status === 'ONBOARDED' ? <DocumentStatus status={status} /> : null}
        </FlexContainer>
      </Left>
    </Wrapper>
  );
};

export default ApplicantDetailsPageHeader;
