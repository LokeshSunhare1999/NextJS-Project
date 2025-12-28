import React, { useState, useContext } from 'react';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import { zIndexValues } from '../style';
import ActionButton from './ActionButton';
import { destroyCookie, parseCookies } from 'nookies';
import { Navigate, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { UserContext } from '../context/UserContext';
import { DEVICE_TYPES } from '../constants';

const Wrapper = styled.section`
  position: fixed;
  top: 0;
  z-index: ${zIndexValues.HEADER};
  height: 61px;
  width: calc(100% - 40px);
  background-color: #ffffff;
  box-shadow: 0 10px 30px #523f690d;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 30px 0px 20px;
`;

const Left = styled.div`
  margin: ${(props) =>
    props.$deviceType === DEVICE_TYPES?.MOBILE
      ? '6px 0px 0px 6px'
      : '6px 0px 0px 62px'};
`;

const HoriBar = styled.div`
  padding: 0px 20px 0px 20px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const View = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  gap: 10px;
`;

const ViewLeft = styled.p`
  font-family: Poppins;
  font-size: 12px;
  font-weight: 400;
  line-height: 21px;
  text-align: left;
`;
const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
`;
const ViewRight = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
`;

const Profile = styled.div`
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 10px;

  padding-left: 0px;
  gap: 16px;
`;

const Header = ({ deviceType }) => {
  const [actionOpen, setActionOpen] = useState(false);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const triggerLogout = () => {
    // Delete access token and navigate to login page
    destroyCookie(null, 'accessToken');
    destroyCookie(null, 'refreshToken');
    destroyCookie(null, 'userId');
    sessionStorage?.removeItem('selectedLanguage');
    navigate('/login');
  };
  const handleActionClick = () => {
    setActionOpen(!actionOpen);
  };

  const handleResetPassword = () => {
    setActionOpen(false);
    navigate('/reset-password');
  };

  const arrBtn = [
    {
      text: 'Reset Password',
      icon: ICONS.USER,
      active: true,
      isVisible: true,
      color: '#000',
      iconHeight: '16px',
      iconWidth: '16px',
      onClick: () => handleResetPassword(),
    },
    {
      text: 'Log Out',
      icon: ICONS.LOG_OUT,
      active: true,
      isVisible: true,
      color: '#000',
      iconHeight: '16px',
      iconWidth: '16px',
      onClick: triggerLogout,
    },
  ];
  return (
    <Wrapper>
      <Left $deviceType={deviceType}>
        <Img
          src={ICONS.SAATHI_LOGO_NEW}
          alt="Saathi_Logo"
          width="104.78px"
          height="44px"
        />
      </Left>
      <Right>
        {/* <View>
          <ViewLeft>Viewing as: </ViewLeft>
          <ViewRight>
            <ViewLeft>Admin</ViewLeft>
            <Img
              src={ICONS.ARROW_DOWN}
              alt="arrowDown"
              width="14px"
              height="14px"
            />
          </ViewRight>
        </View> */}
        {/* <HoriBar>|</HoriBar> */}

        <Profile onClick={() => handleActionClick()}>
          <Img src={ICONS.USER} alt="user" width="16px" height="16px" />
          <ViewRight>
            <ViewLeft>
              {user?.loggedInUserContact?.email || 'OPS USER'}
            </ViewLeft>
            <Img
              src={actionOpen ? ICONS.ARROW_UP : ICONS.ARROW_DOWN}
              alt="arrowDown"
              width="14px"
              height="14px"
            />
          </ViewRight>
          {actionOpen ? (
            <ActionButton
              arrBtn={arrBtn}
              setActionOpen={setActionOpen}
              isLast
              width="150px"
              fontSize="12px"
              top="40px"
              left="-8px"
              right="10px"
            />
          ) : null}
        </Profile>
      </Right>
    </Wrapper>
  );
};
Header.propTypes = {
  user: PropTypes.object,
  actionOpen: PropTypes.bool,
  setActionOpen: PropTypes.func,
  triggerLogout: PropTypes.func,
  handleActionClick: PropTypes.func,
  handleResetPassword: PropTypes.func,
  arrBtn: PropTypes.arrayOf(
    PropTypes.shape({
      text: PropTypes.string,
      icon: PropTypes.string,
      active: PropTypes.bool,
      isVisible: PropTypes.bool,
      color: PropTypes.string,
      iconHeight: PropTypes.string,
      iconWidth: PropTypes.string,
      onClick: PropTypes.func,
    }),
  ),
};

export default Header;
