import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  font-family: 'Poppins';
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const BigBox = styled.div`
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  background: #fff;
`;

const HeadWrapper = styled.div`
  padding: 2px 2px 0px 2px;
`;

const Head = styled.div`
  border-radius: 9px 9px 0px 0px;
  background: #f4f6fa;
  padding: 8px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeadP = styled.p`
  color: #000;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const ContBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 30px 20px 30px;
`;

const ContHead = styled.p`
  color: rgba(0, 0, 0, 0.75);
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const ContP = styled.p`
  color: rgba(0, 0, 0, 0.75);
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
`;

const CommunicationTab = () => {
    return (
      <Wrapper>
        <BigBox>
          <HeadWrapper>
            <Head>
              <HeadP>Customer ID 123456</HeadP>
              <HeadP>20 May 2023 - 10 : 45 AM</HeadP>
            </Head>
          </HeadWrapper>
          <ContBox>
            <ContHead>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </ContHead>
            <ContP>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. Lorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the
              1500s, when an unknown printer took a galley of type and scrambled
              it to make a type specimen book.
            </ContP>
          </ContBox>
        </BigBox>
        <BigBox>
          <HeadWrapper>
            <Head>
              <HeadP>Customer ID 123456</HeadP>
              <HeadP>20 May 2023 - 10 : 45 AM</HeadP>
            </Head>
          </HeadWrapper>
          <ContBox>
            <ContHead>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </ContHead>
            <ContP>
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry. Lorem Ipsum has been the industry's standard dummy text
              ever since the 1500s, when an unknown printer took a galley of
              type and scrambled it to make a type specimen book. Lorem Ipsum is
              simply dummy text of the printing and typesetting industry. Lorem
              Ipsum has been the industry's standard dummy text ever since the
              1500s, when an unknown printer took a galley of type and scrambled
              it to make a type specimen book.
            </ContP>
          </ContBox>
        </BigBox>
      </Wrapper>
    );
}

export default CommunicationTab;
