import React, { useState, useEffect, lazy, Suspense, useContext } from 'react';
import styled from 'styled-components';
import { setCookie, parseCookies, destroyCookie } from 'nookies';
import IMAGES from '../assets/images';
import ICONS from '../assets/icons';
import { useNavigate } from 'react-router-dom';
const TextInput = lazy(() => import('../components/TextInput'));
const CustomCTA = lazy(() => import('../components/CustomCTA'));
import { usePostIdentity, usePostVerifyPassword } from '../apis/queryHooks';
import { COOKIES_MAX_AGE, DEVICE_TYPES, USER_TYPE } from '../constants';
import { useSnackbar } from 'notistack';
import { UserContext } from '../context/UserContext';
import { v4 as uuidv4 } from 'uuid';
import useDeviceType from '../hooks/useDeviceType';

const Wrapper = styled.div`
  width: ${(props) =>
    props.$deviceType !== DEVICE_TYPES?.MOBILE
      ? 'calc(100vw - 188px)'
      : '100vw'};
  padding: ${(props) =>
    props.$deviceType !== DEVICE_TYPES?.MOBILE ? '0 68px 0 120px' : '0'};
  min-height: 100vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background-color: #182b3a;
  background-image: ${(props) =>
    props?.$deviceType !== DEVICE_TYPES?.MOBILE
      ? `url(${IMAGES?.AUTH_BG})`
      : ''};
  background-repeat: no-repeat;
  background-size: 100vw 100vh;
  font-family: Poppins;
`;

const LeftContent = styled.div`
  display: flex;
  flex-direction: column;
  width: 430px;
`;

const LeftHeader = styled.span`
  font-size: 40px;
  font-weight: 700;
  line-height: 60px;
  text-align: left;
  color: #fff;
`;

const LeftDescription = styled.span`
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  text-align: left;
  color: #fff;
`;

const RightContent = styled.form`
  width: ${(props) =>
    props.$deviceType !== DEVICE_TYPES?.MOBILE ? '459px' : '100%'};
  height: auto;
  padding: 60px;
  border-radius: 20px;
  background: #fff;
  display: flex;
  flex-direction: column;
`;

const RightHeader = styled.div`
  margin: 30px 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const FormTitle = styled.span`
  font-size: 40px;
  font-weight: 600;
  line-height: 44px;
  letter-spacing: -0.04em;
  color: #232323;
`;

const FormSubHeading = styled.span`
  font-size: 18px;
  font-weight: 400;
  line-height: 27px;
  color: #969696;
`;

const StyledImg = styled.img`
  width: ${(props) => props?.width};
  height: ${(props) => props?.height};
`;

const InputBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightFooter = styled.div`
  margin: 20px 0;
  display: flex;
  flex-direction: row;
  gap: 10px;
  font-size: 16px;
  font-weight: 500;
  line-height: 24px;
  text-align: left;
  color: #232323;
  align-items: center;
`;

const StyledCheckbox = styled.input`
  width: 18px;
  height: 18px;
`;

const labelClasses = {
  left: '58px',
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '27px',
  color: '#9A9A9A',
  // top: '0.9rem',
};

const labelFocusedClasses = {
  left: '10px',
  fontSize: '14px',
  fontWeight: '500',
  lineHeight: '21px',
  color: '#141482',
  top: '-0.6rem',
  padding: '0 4px',
};

const inputContainerClasses = {
  height: '59px',
  fontFamily: 'Poppins',
};

const inputClasses = {
  height: 'calc(100% - 35px)',
  padding: '17.5px 60px',
  borderFocus: '1.5px solid #141482',
  border: '1px solid #D9D9D9',
  borderRadius: '10px',
  fontSize: '18px',
  fontWeight: '400',
  lineHeight: '27px',
  color: '#232323',
};

const leftIconClass = {
  // top: '1.3rem',
  left: '16px',
  width: '21px',
  height: 'auto',
};

const rightIconClass = {
  right: '16px',
  width: '24px',
  height: 'auto',
};

function getOrSetLocalStorage(key) {
  try {
    // Attempt to read the UUID from local storage
    let uuid = localStorage.getItem(key);

    if (uuid) {
      // If it exists, parse and return it
      return JSON.parse(uuid);
    } else {
      // If it doesn't exist, generate a new UUID
      uuid = uuidv4();
      // Store the new UUID in local storage
      localStorage.setItem(key, JSON.stringify(uuid));
      return uuid;
    }
  } catch (error) {
    console.error('Error accessing local storage', error);
    return null;
  }
}

const AuthScreen = ({ token, setToken }) => {
  const deviceType = useDeviceType();
  const uuid = getOrSetLocalStorage('uuid');
  const cookies = parseCookies();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [maskPassword, setMaskPassword] = useState(true);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [guestToken, setGuestToken] = useState(cookies?.guestToken);
  const { setUser } = useContext(UserContext);

  const {
    mutateAsync: postIdentityMutation,
    data: postIdentityData,
    status: postIdentityStatus,
  } = usePostIdentity();

  const {
    mutateAsync: postVerifyPasswordMutation,
    data: postVerifyPasswordData,
    status: postVerifyPasswordStatus,
    error: postVerifyPasswordError,
  } = usePostVerifyPassword();

  useEffect(() => {
    if (cookies?.accessToken) {
      if (deviceType === DEVICE_TYPES?.MOBILE)
        navigate('/customers', { replace: true });
      else navigate('/', { replace: true });
    }
  }, []);

  useEffect(() => {
    if (postIdentityStatus === 'success') {
      setGuestToken(postIdentityData?.guestToken);
      setCookie(null, 'guestToken', postIdentityData?.guestToken, {
        maxAge: 60 * 60,
        path: '/',
      });
    }
  }, [postIdentityStatus]);

  useEffect(() => {
    if (postVerifyPasswordStatus === 'success') {
      setToken(postVerifyPasswordData?.identity?.accessToken);
      setUser(postVerifyPasswordData);
      sessionStorage.setItem(
        'selectedLanguage',
        postVerifyPasswordData?.langCode || 'en',
      );
      setCookie(null, 'userId', postVerifyPasswordData?._id, {
        maxAge: COOKIES_MAX_AGE,
        path: '/',
      });
      setCookie(
        null,
        'accessToken',
        postVerifyPasswordData?.identity?.accessToken,
        {
          maxAge: COOKIES_MAX_AGE,
          path: '/',
        },
      );

      setCookie(
        null,
        'refreshToken',
        postVerifyPasswordData?.identity?.refreshToken,
        {
          maxAge: COOKIES_MAX_AGE,
          path: '/',
        },
      );

      destroyCookie(null, 'guestToken');
      if (deviceType === DEVICE_TYPES?.MOBILE)
        navigate('/customers', { replace: true });
      else navigate('/', { replace: true });
    } else if (postVerifyPasswordStatus === 'error') {
      enqueueSnackbar('Invalid Email or Password', {
        variant: 'error',
      });
    }
  }, [postVerifyPasswordStatus]);

  const handlePasswordVisibilityClick = () => {
    setMaskPassword(!maskPassword);
  };

  const handleEmailFocus = async (e) => {
    e.preventDefault();
    if (!guestToken) await postIdentityMutation({ macAddress: uuid });
  };

  const handleSignIn = async (e) => {
    e.preventDefault();

    if (!guestToken) {
      const { guestToken: onSigninGuestToken } = await postIdentityMutation({
        macAddress: uuid,
      });
      setGuestToken(onSigninGuestToken);
      await postVerifyPasswordMutation({
        payload: {
          userContact: {
            phoneOrEmail: email,
            dialCode: '+91',
          },
          password: password,
          userType: USER_TYPE,
        },
        token: onSigninGuestToken,
      });
    } else
      await postVerifyPasswordMutation({
        payload: {
          userContact: {
            phoneOrEmail: email,
            dialCode: '+91',
          },
          password: password,
          userType: USER_TYPE,
        },
        token: guestToken || cookies?.guestToken,
      });
  };

  return (
    <Wrapper $deviceType={deviceType}>
      {deviceType !== DEVICE_TYPES?.MOBILE ? (
        <LeftContent>
          <LeftHeader>Saathi Admin Panel</LeftHeader>
          {/* <LeftDescription>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry.{' '}
          </LeftDescription> */}
        </LeftContent>
      ) : null}
      <RightContent $deviceType={deviceType} onSubmit={handleSignIn}>
        <StyledImg
          src={ICONS?.SAATHI_LOGO_NEW}
          alt={'Saathi Logo'}
          width={'202px'}
          height={'auto'}
        />
        <RightHeader>
          <FormTitle>Sign In</FormTitle>
          <FormSubHeading>
            Please enter details to continue to your account.
          </FormSubHeading>
        </RightHeader>
        <Suspense fallback={<div></div>}>
          <InputBlock>
            <TextInput
              ariaLabel="Email"
              type={'email'}
              name={'email'}
              placeholder={'Email'}
              value={email}
              setValue={setEmail}
              labelClasses={labelClasses}
              labelFocusedClasses={labelFocusedClasses}
              inputContainerClasses={inputContainerClasses}
              inputClasses={inputClasses}
              leftIconClass={leftIconClass}
              leftIcon={ICONS?.EMAIL}
              leftIconFocused={ICONS?.EMAIL_ACTIVE}
              onFocus={(e) => handleEmailFocus(e)}
            />

            <TextInput
              ariaLabel="Password"
              type={maskPassword ? 'password' : 'text'}
              placeholder={'Password'}
              value={password}
              setValue={setPassword}
              labelClasses={labelClasses}
              labelFocusedClasses={labelFocusedClasses}
              inputContainerClasses={inputContainerClasses}
              inputClasses={inputClasses}
              leftIconClass={leftIconClass}
              leftIcon={ICONS?.LOCK}
              leftIconFocused={ICONS?.LOCK_ACTIVE}
              showRightIcon={true}
              rightIconClass={rightIconClass}
              rightIcon={ICONS?.HIDE}
              rightIconActive={ICONS?.SHOW}
              handleRightIconClick={handlePasswordVisibilityClick}
            />
          </InputBlock>
          <RightFooter>
            <StyledCheckbox
              type="checkbox"
              checked={keepLoggedIn}
              onChange={() => setKeepLoggedIn(!keepLoggedIn)}
            />
            Keep me logged in
          </RightFooter>
          <CustomCTA
            type={'submit'}
            title={'Sign in'}
            bgColor={'#141482'}
            color={'#fff'}
            border={'none'}
            fontSize={'18px'}
            fontWeight={'700'}
            isLoading={postVerifyPasswordStatus === 'pending'}
            disabled={!(email && password)}
          />
        </Suspense>
      </RightContent>
    </Wrapper>
  );
};

export default AuthScreen;
