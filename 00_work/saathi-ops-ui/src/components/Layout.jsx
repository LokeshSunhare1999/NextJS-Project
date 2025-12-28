import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import styled from 'styled-components';
import useDeviceType from '../hooks/useDeviceType';
import { DEVICE_TYPES } from '../constants';

const Wrapper = styled.main`
  background-color: #f4f6fa;
  position: relative;
  width: 100%;
  // height: 100vh;
`;

const Layout = () => {
  const deviceType = useDeviceType();
  return (
    <Wrapper>
      <Header deviceType={deviceType} />
      {deviceType === DEVICE_TYPES?.MOBILE ? null : <Sidebar />}
      <Outlet />
    </Wrapper>
  );
};

export default Layout;
