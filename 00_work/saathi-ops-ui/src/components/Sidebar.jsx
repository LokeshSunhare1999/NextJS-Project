import React from 'react';
import { NavLink as BaseNavLink } from 'react-router-dom';
import styled from 'styled-components';
import * as palette from '../style';
import PropTypes from 'prop-types';
import usePermission from '../hooks/usePermission';
import SidebarSubmenu from './common/SidebarSubmenu';
import { SIDEBAR_ITEMS } from '../constants/sidebar';

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${palette.zIndexValues.SIDEBAR};
  max-width: 260px;
  height: calc(100vh - 3.5rem);
  background-color: #ffffff;
  margin: 3.6rem 0 0 0;
  padding: 19px 16px 0px 16px;
  overflow-y: auto;
`;

const WrapperContainer = styled.div`
  width: 100%;
  height: auto;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
`;

const NavLink = styled(BaseNavLink)`
  width: 216px;
  height: 56px;
  display: flex;
  padding: 0px 0px 0px 16px;
  justify-content: start;
  align-items: center;
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 10px;
  gap: 17px;
  border: 1px solid #cdd4df;
  color: #000;

  &:hover {
    background-color: #cdd4df80;
  }

  &.active {
    background-color: #cdd4df80;
    border: 1px solid #141482;
    color: #141482;
  }
`;

const Img = styled.img`
  width: ${(props) => (props.width ? props.width : '36px')};
  height: ${(props) => (props.height ? props.height : '37px')};
`;

const P = styled.p`
  font-family: Poppins;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
`;

const EmptyDiv = styled.div`
  height: 30px;
`;

const Sidebar = () => {
  const { hasPermission, hasPermissionsArray } = usePermission();
  return (
    <Wrapper>
      <WrapperContainer>
        {SIDEBAR_ITEMS.map((item, index) => {
          if (item?.permission && !hasPermission(item.permission)) return null;
          if (item?.subItems?.length > 0) {
            if (
              item?.permissionsArray &&
              !hasPermissionsArray(item.permissionsArray)
            )
              return null;
            return <SidebarSubmenu item={item} key={`${item.text}-${index}`} />;
          }
          return (
            <NavLink
              to={item.to}
              exact={item.exact ?? null}
              key={`${item.text}-${index}`}
            >
              {({ isActive }) => (
                <>
                  <Img
                    src={isActive ? item.activeIcon : item.icon}
                    alt={item.alt}
                  />
                  <P>{item.text}</P>
                </>
              )}
            </NavLink>
          );
        })}
        <EmptyDiv />
      </WrapperContainer>
    </Wrapper>
  );
};
Sidebar.propTypes = {
  isActive: PropTypes.bool,
};

export default Sidebar;
