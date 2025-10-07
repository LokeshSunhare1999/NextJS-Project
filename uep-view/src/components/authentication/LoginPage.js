/* eslint-disable quotes */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { adminLoginAction } from 'actions/authActions';
import Button from 'shared/Button';
import ErrorMessage from 'shared/ErrorMessage';
import UnauthLayoutContainer from 'shared/LayoutContainer/UnauthLayoutContainer';
import ForgotPassword from './ForgotPassword';
import Cookies from 'js-cookie'
import show from 'static/images/show.png';
import invisible from 'static/images/invisible.png';

const LoginPage = (props) => {
    const { history } = props
    const dispatch = useDispatch()
    const [ isForgotPage, setIsForgotPage ] = useState(false);
    const [ inputField, setInputField ] = useState({
        email: '',
        password: '',
    });
    const [ inputFieldError, setInputFieldError ] = useState({});
    const [ isRememberMe, setIsRememberMe ] = useState(false)
    const [ isRevealPwd, setIsRevealPwd ] = useState(false);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const getCookiesData = () => {
        const uEmail = Cookies.get('uName' );
        const uPassword = Cookies.get('uPassword' );
        setInputField({ 'email': uEmail, 'password' : uPassword });
    }
    useEffect(() => {
        getCookiesData()
    },[])

    const handleForgot = () => {
        setIsForgotPage(!isForgotPage);
    };

    const handleChange = (e) => {
        setInputField({ ...inputField, [ e.target.name ]: e.target.value });
        setInputFieldError({});
    };
    const setcookies = (event) => {
        setIsRememberMe(event.target.checked)
    }
    const validate = () => {
        const errors = {};
        let isValid = true;
        if (!inputField.email) {
            isValid = false;
            errors.email = 'Please enter email';
        }
        if (typeof inputField.email !== 'undefined') {
            const pattern = new RegExp(
                /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
            );
            if (!pattern.test(inputField.email)) {
                isValid = false;
                errors.email = 'Please enter valid email address';
            }
        }
        if (!inputField.password) {
            isValid = false;
            errors.password = 'Please enter password';
        }
        setInputFieldError(errors);
        return isValid;
    };
    const handleSignIn = (e) => {
        const data = {
            email_id: inputField.email,
            password: inputField.password,
            user_role: 0
        }
        if (validate()) {
            if(isRememberMe){
                Cookies.set('uName', inputField.email, { path: 'https://stg-admin.uepviewer.com/' })
                Cookies.set('uPassword', inputField.password, { path: 'https://stg-admin.uepviewer.com/' })
                dispatch(adminLoginAction(data, history))
            } else {
                dispatch(adminLoginAction(data, history))
            }
        }
    };
    return (
        <>
            {!isForgotPage && (
                <UnauthLayoutContainer
                    formTitle="Please enter your email id and password"
                    pageTitle="Login"
                >
                    <form className="login_form">
                        <div className="form-group">
                            <input
                                className="form-control form-control-lg login_field"
                                value={ inputField.email || '' }
                                onChange={ handleChange }
                                type="email"
                                name="email"
                                placeholder="Email"
                                autoComplete="off"
                            />
                        </div>
                        {inputFieldError.email && (
                            <ErrorMessage message={ inputFieldError.email || '' } />
                        )}
                        <div className="eye-btn-box">
                            <input
                                className="form-control form-control-lg login_field"
                                value={ inputField.password || '' }
                                name="password"
                                onChange={ handleChange }
                                type={ isRevealPwd ? "text" : "password" }
                                placeholder="Password"
                                autoComplete="off"
                            />
                            <img
                                src={ isRevealPwd ? show : invisible }
                                alt="" width="20" className="mx-2 pointer eye-btn"
                                onClick={ () => setIsRevealPwd(prevState => !prevState) }
                            />
                        </div>
                        {inputFieldError.password && (
                            <ErrorMessage message={ inputFieldError.password || '' } />
                        )}
                        <div className="d-flex justify-content-between align-items-center pt-4 pb-4">
                            <a href onClick={ handleForgot } className="footer_link">
                                Forgot Password?
                            </a>
                            <div className="d-flex align-items-center">
                                <input
                                    type="checkbox"
                                    value="lsRememberMe"
                                    id="rememberMe"
                                    className="check pointer"
                                    onClick={ (event) => setcookies(event) }
                                />{' '}
                                <label htmlFor="rememberMe" className="remember_link">Remember me?</label>
                            </div>
                        </div>
                        <Button
                            className="btn btn-primary btn-lg login_btn pointer"
                            handleSubmit={ handleSignIn }
                            buttonName="LOGIN"
                            disable={ isLoading }
                        />
                    </form>
                </UnauthLayoutContainer>
            )}
            {isForgotPage && <ForgotPassword  history = { history } handleForgot ={ handleForgot }/>}
        </>
    );
};
LoginPage.propTypes = {
    history: PropTypes.object,
};

export default LoginPage;
