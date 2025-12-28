import React, { lazy, useState, Suspense, useEffect } from 'react';
import BoxLoader from '../common/BoxLoader';
import styled from 'styled-components';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { USERS_MODULE } from '../../constants/users';

const UsersList = lazy(() => import('./UsersList'));
const RolesList = lazy(() => import('./RolesList'));
const PermissionsList = lazy(() => import('./PermissionsList'));

const Wrapper = styled.div`
  margin: 0px;
  padding: 0px;
`;

const StyledP = styled.p`
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize || '18px'};
  line-height: ${(props) => props.$lineHeight || '27px'};
  font-weight: ${(props) => props.$fontWeight || '600'};
  color: ${(props) => props.$color || '#000'};
`;

const UsersTabContainer = () => {
  const [selectedTab, setSelectedTab] = useState(0);

  const tabHeaders = USERS_MODULE?.USER_TAB_HEADERS;

  const handleChange = (event, newValue) => {
    setSelectedTab(newValue);
  };

  const tabComponents = {
    0: <UsersList />,
    1: <RolesList />,
    2: <PermissionsList />,
  };

  return (
    <Wrapper>
      <div
        style={{
          padding: '10px 0px',
        }}
      >
        <Tabs
          value={selectedTab}
          onChange={handleChange}
          textColor="inherit"
          TabIndicatorProps={{
            style: {
              backgroundColor: '#141482',
            },
          }}
          sx={{
            borderBottom: 1,
            borderBottomColor: '#CDD4DF',
          }}
        >
          {tabHeaders.map((item, idx) => {
            return (
              <Tab
                key={item}
                label={item}
                value={idx}
                sx={{
                  textTransform: 'none',
                  fontFamily: 'Poppins',
                  fontSize: '18px',
                  fontWeight: '500',
                  padding: '0px',
                  marginRight: '50px',
                  color: selectedTab === idx ? '#141482' : '#677995',
                }}
              />
            );
          })}
        </Tabs>
        <div
          style={{
            paddingTop: '20px',
          }}
        >
          <Suspense fallback={<BoxLoader size={5} />}>
            {tabComponents[selectedTab]}
          </Suspense>
        </div>
      </div>
    </Wrapper>
  );
};

export default UsersTabContainer;
