import React, { useState, lazy, Suspense, useEffect, useContext } from 'react';
import styleComponents from '../style/pageStyle';
import styled from 'styled-components';
import ICONS from '../assets/icons';
import TextInput from '../components/TextInput';
import CustomCTA from '../components/CustomCTA';
import { usePutResetPassword } from '../apis/queryHooks';
import { parseCookies, setCookie } from 'nookies';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';
import { COOKIES_MAX_AGE } from '../constants';

const { Wrapper, Top, HeaderWrap, HeaderTitle } = styleComponents();

const ContentContainer = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: auto;
  border-radius: 10px;
  width: calc(100% - 80px);
  margin: 0px 40px 20px 40px;
  padding: 20px 0;
  background: #fff;
`;

const ContentSection = styled.div`
  margin-bottom: 20px;
  width: 50%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const FieldHeader = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #000;
`;

const FooterContainer = styled.div`
  width: 90%;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
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
  width: '70%',
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

const ResetPassword = ({ token, setToken }) => {
  const cookies = parseCookies();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [maskPassword, setMaskPassword] = useState(true);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [maskConfirmPassword, setMaskConfirmPassword] = useState(true);
  const { setUser } = useContext(UserContext);

  const {
    mutateAsync: resetPasswordMutate,
    status: resetPasswordStatus,
    data: resetPasswordData,
  } = usePutResetPassword(token);

  useEffect(() => {
    if (resetPasswordStatus === 'success') {
      enqueueSnackbar('Password changed successfully!', {
        variant: 'success',
      });
      setToken(resetPasswordData?.identity?.accessToken);
      setUser(resetPasswordData);
      setCookie(null, 'userId', resetPasswordData?._id, {
        maxAge: COOKIES_MAX_AGE,
        path: '/',
      });
      setCookie(null, 'accessToken', resetPasswordData?.identity?.accessToken, {
        maxAge: COOKIES_MAX_AGE,
        path: '/',
      });
      setCookie(
        null,
        'refreshToken',
        resetPasswordData?.identity?.refreshToken,
        {
          maxAge: COOKIES_MAX_AGE,
          path: '/',
        },
      );
      navigate('/');
    } else if (resetPasswordStatus === 'error') {
      enqueueSnackbar('Reset password failed!', {
        variant: 'error',
      });
    }
  }, [resetPasswordStatus]);

  const handleSaveClick = (e) => {
    e.preventDefault();
    if (password.length < 8) {
      enqueueSnackbar('Password should be atleast 8 characters long', {
        variant: 'error',
      });
    } else if (confirmPassword !== password) {
      enqueueSnackbar('Passwords do not match!', {
        variant: 'error',
      });
    } else {
      resetPasswordMutate({
        newPassword: password,
        userId: cookies?.userId,
      }).then((response) =>
        sessionStorage.setItem('selectedLanguage', response?.langCode || 'en'),
      );
    }
  };

  return (
    <Wrapper>
      {' '}
      <Top>
        <HeaderWrap $alignItems={'start'}>
          <HeaderTitle>Reset Password</HeaderTitle>{' '}
        </HeaderWrap>
        <ContentContainer onSubmit={handleSaveClick}>
          <ContentSection>
            <FieldHeader>New Password:</FieldHeader>
            <TextInput
              ariaLabel="New Password"
              type={maskPassword ? 'password' : 'text'}
              placeholder={'New Password'}
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
              handleRightIconClick={() => setMaskPassword(!maskPassword)}
            />
          </ContentSection>
          <ContentSection>
            <FieldHeader>Confirm Password:</FieldHeader>
            <TextInput
              ariaLabel="Confirm Password"
              type={maskConfirmPassword ? 'password' : 'text'}
              placeholder={'Confirm Password'}
              value={confirmPassword}
              setValue={setConfirmPassword}
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
              handleRightIconClick={() =>
                setMaskConfirmPassword(!maskConfirmPassword)
              }
            />
          </ContentSection>
          <FooterContainer>
            <CustomCTA
              type={'submit'}
              title={'Save'}
              isLoading={resetPasswordStatus === 'pending'}
              color={'#FFF'}
              bgColor={'#141482'}
              border={'1px solid #CDD4DF'}
            />
          </FooterContainer>
        </ContentContainer>
      </Top>
    </Wrapper>
  );
};

export default ResetPassword;
