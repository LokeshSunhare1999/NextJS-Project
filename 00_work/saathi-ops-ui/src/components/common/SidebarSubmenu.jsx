import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import { NavLink as BaseNavLink } from 'react-router-dom';
import usePermission from '../../hooks/usePermission';

const SubMenu = styled.div`
  font-family: Poppins;
  cursor: pointer;
  width: 200px;
  height: ${(props) => (props.isOpen ? 'auto' : '40px')};
  display: flex;
  flex-direction: column;
  padding: 11px 16px;
  text-decoration: none;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid #cdd4df;
  color: #000;

  //   &:hover {
  //     background-color: #cdd4df80;
  //   }

  //   &.active {
  //     background-color: #cdd4df80;
  //     border: 1px solid #141482;
  //     color: #141482;
  //   }
`;

const Img = styled.img`
  width: ${(props) => (props.width ? props.width : '36px')};
  height: ${(props) => (props.height ? props.height : '37px')};
`;

const P = styled.p`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
`;

const SubMenuWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SubMenuHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  gap: 17px;
`;

const SubMenuList = styled.div`
  margin: 12px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const SubMenuItem = styled(BaseNavLink)`
  width: 196px;
  height: 29px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-radius: 6px;
  background: transparent;
  font-size: 12px;
  line-height: 18px;
  color: #9b9b9b;
  text-decoration: none;
  gap: 6px;

  &.active {
    background-color: #f5f5f5;
    color: #141482;
  }
`;

const SidebarSubmenu = ({ item }) => {
  const { hasPermission } = usePermission();
  const [isOpen, setIsOpen] = useState(false);
  const pathname = window.location.pathname;
  const subItemPaths = item?.subItems?.map((subItem) => subItem.to);

  useEffect(() => {
    if (subItemPaths?.some((item) => pathname?.includes(item))) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [pathname]);
  return (
    <SubMenu isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
      <SubMenuWrapper>
        <SubMenuHeader>
          <Img src={item.icon} alt={item.alt} />
          <P>{item.text}</P>
        </SubMenuHeader>
        <Img
          src={ICONS?.SIDEBAR_DOWN}
          width={'14px'}
          height={'14px'}
          alt="down"
        />
      </SubMenuWrapper>
      {isOpen ? (
        <SubMenuList>
          {item?.subItems?.map((subItem, index) => {
            if (subItem?.permission && !hasPermission(subItem.permission))
              return null;
            return (
              <SubMenuItem
                to={subItem.to}
                exact={subItem.exact ?? null}
                key={`${subItem.text}-${index}`}
              >
                {({ isActive }) => (
                  <>
                    <Img
                      src={isActive ? subItem?.activeIcon : subItem?.icon}
                      width={'29px'}
                      height={'29px'}
                      alt={subItem?.alt}
                    />
                    {subItem?.text}
                  </>
                )}
              </SubMenuItem>
            );
          })}
        </SubMenuList>
      ) : null}
    </SubMenu>
  );
};

export default SidebarSubmenu;
