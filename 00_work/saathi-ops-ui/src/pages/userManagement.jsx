import React, { useEffect, useState, lazy, Suspense } from 'react';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import { useNavigate } from 'react-router-dom';
const UsersTabContainer = lazy(
  () => import('../components/users/UsersTabContainer'),
);

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

const Left = styled.div`
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

const UserManagement = () => {
  const navigate = useNavigate();

  const handleLeftArrow = () => {
    navigate(-1);
  };
  return (
    <Wrapper>
      <Left onClick={() => handleLeftArrow()}>
        <Img
          src={ICONS.LEFT_ARROW_BLACK}
          alt="leftArrowBlack"
          width={'24px'}
          height={'24px'}
        />
      </Left>
      <Header>
        <HeaderTitle>User Management</HeaderTitle>
      </Header>
      <Suspense fallback={<div></div>}>
        <UsersTabContainer />
      </Suspense>
    </Wrapper>
  );
};

export default UserManagement;
