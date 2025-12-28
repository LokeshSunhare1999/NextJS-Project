import React, { useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';

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

const Right = styled.div`
  display: flex;
  width: fit-content;
  align-items: center;
  flex-shrink: 0;
  cursor: pointer;
  position: relative;
  gap: 20px;
  align-items: flex-start;
`;

const ChatButton = styled.div`
  display: flex;
  padding: 10px 16px;
  align-items: center;
  gap: 12px;
  border-radius: 10px;
  border: 1px solid #141482;
  background: #fff;
  color: #141482;
  font-family: Poppins;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const Img = styled.img`
  width: 16px;
  height: 16px;
`;

const CustomerPageHeader = ({ heading, subHeading, arrBtn }) => {
  const [actionOpen, setActionOpen] = useState(false);
  return (
    <Wrapper>
      <Left>
        <P $fontSize={'24px'} $fontWeight={'600'} $lineHeight={'normal'}>
          {heading}
        </P>
        <P $fontSize={'16px'} $fontWeight={'400'} $lineHeight={'normal'}>
          {subHeading}
        </P>
      </Left>
      <Right>
        {/* <ChatButton>
          <Img src={ICONS.MESSAGE_ICON} alt="chat" />
          Chat
        </ChatButton>
        <ChatButton>
          <Img src={ICONS.CALL_ICON} alt="call" />
          Call
        </ChatButton> */}
      </Right>
    </Wrapper>
  );
};

export default CustomerPageHeader;
