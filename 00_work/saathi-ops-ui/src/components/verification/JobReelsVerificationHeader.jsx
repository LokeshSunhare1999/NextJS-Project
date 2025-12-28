import React from 'react';
import DocumentStatus from '../customerDetails/DocumentStatus';
import IdContainer from '../atom/tableComponents/IdContainer';
import styled from 'styled-components';


const Wrapper = styled.div``;
const FlexContainer = styled.div`
  width: ${(props) => (props.$width ? props.$width : '100%')};
  display: flex;
  gap: ${(props) => (props.$gap ? props.$gap : '8px')};
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  align-items: ${(props) => (props.$alignItems ? props.$alignItems : 'center')};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  border-left: ${(props) => props.$borderLeft};

  padding-left: ${(props) => props.$paddingLeft || '8px'};
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0px;
`;
const CopyBtn = styled.div`
  border: 1px solid #141482;
  padding: 10px 16px;
  border-radius: 10px;
  background-color: #ffffff;
`;

const Img = styled.img`
  width: ${(props) => props?.$width};
  height: ${(props) => props?.$height};
  cursor: pointer;
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

const JobReelsVerificationHeader = ({
  customerData,
  customerId,
  customerProfileData,
}) => {
  return (
    <Wrapper>
      <Left>
        <P $fontSize={'24px'} $fontWeight={'600'} $lineHeight={'normal'}>
          {customerData?.name || '-----'}
        </P>
        <P $fontSize={'16px'} $fontWeight={'400'} $lineHeight={'normal'}>
          Customer ID: <IdContainer item={customerId} />
        </P>
      </Left>
      <FlexContainer $justifyContent="space-between">
        <FlexContainer>
          <P $fontSize={'16px'} $fontWeight={'600'} $lineHeight={'normal'}>
            JobReel
          </P>
          <FlexContainer>
            <P $borderLeft={'2px solid #D9D9D9'} $paddingLeft={'8px'}>
              Current Status
            </P>
            <DocumentStatus
              status={
                customerProfileData?.customerBioDataVideoVerificationStatus
              }
            />
          </FlexContainer>
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  );
};

export default JobReelsVerificationHeader;
