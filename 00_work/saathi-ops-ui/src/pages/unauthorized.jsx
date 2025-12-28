import React from 'react';
import styled from 'styled-components';

const Wrapper = styled.div`
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: 16px 40px;
  font-family: Poppins;
`;

const Header = styled.div`
  width: calc(100% - 0px);
  margin: 0px 0px 20px 0px;
  padding: 10px 0;
  display: flex;
  flex-direction: column;
`;

const HeaderTitle = styled.div`
  display: flex;
  flex-direction: column;
  color: #000;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
`;

const Unauthorized = () => {
  return (
    <Wrapper>
      <Header>
        <HeaderTitle>You are not authorized to visit this page</HeaderTitle>
      </Header>
    </Wrapper>
  );
};

export default Unauthorized;
