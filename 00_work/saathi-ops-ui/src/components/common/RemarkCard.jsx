import React from 'react';
import styled from 'styled-components';
import { VERIFICATION_STATUS_MAP } from '../../constants/verification';
import { formatDate } from '../../utils/helper';
import DocumentStatus from '../customerDetails/DocumentStatus';

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  color: ${(props) => (props.color ? props.color : '#000000')};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
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

const RemarkWrapper = styled.div`
  background-color: #ffffff;
  border-radius: 8px;
  width: calc(100% - 40px);
  padding: 20px;
  margin-top: 10px;
`;

const RemarkCard = ({
  remark,
  statusMap = VERIFICATION_STATUS_MAP?.CURRENT_STATES,
  showDate = true,
}) => {
  const remarkStatus = statusMap?.[remark?.remarkStatus];
  return (
    <RemarkWrapper>
      <FlexContainer $alignItems="center">
        <P $fontSize="14px" $fontWeight="600" $lineHeight="normal">
          {remark?.agentEmail}
        </P>
        {showDate ? (
          <P
            color="#606C85"
            $fontSize="14px"
            $fontWeight="400"
            $lineHeight="normal"
          >
            {formatDate(remark?.updatedAt, 'DD MMM YYYY - hh:mm a')}
          </P>
        ) : null}

        {remarkStatus ? (
          <>
            <P
              color="#606C85"
              $fontSize="14px"
              $fontWeight="400"
              $lineHeight="normal"
            >
              Action:
            </P>
            <DocumentStatus status={remark?.remarkStatus} />
          </>
        ) : null}
      </FlexContainer>
      <P
        color="#606C85"
        $fontSize="16px"
        $fontWeight="400"
        $lineHeight="normal"
        $marginTop="10px"
      >
        {remark?.message}
      </P>
    </RemarkWrapper>
  );
};

export default RemarkCard;
