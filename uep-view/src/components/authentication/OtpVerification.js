import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import UpdatePassword from './UpdatePassword';
import UnauthLayoutContainer from 'shared/LayoutContainer/UnauthLayoutContainer';
import Button from 'shared/Button';
import ErrorMessage from 'shared/ErrorMessage';
import { sendEmailAction, sendVerificationOtp } from 'actions/authActions';
import { maxLengthCheck } from 'utils/Helper';

const OtpVerification = (props) => {
    const { history, handleForgot } = props
    const dispatch = useDispatch();
    const [ isUpdatePassword, setIsUpdatePassword ] = useState(false);
    const [ otp, setIsOtp ] = useState('');
    const [ otpError, setIsOtpError ] = useState('');
    const { closeOtpScreen, emailValue } = props;
    const handleChangeOtp = (e) => {
        setIsOtp(e.target.value);
        setIsOtpError('');
    };
    const validate = () => {
        let isValid = true;
        if (!otp) {
            isValid = false;
            setIsOtpError('Please enter otp');
        }
        if (otp && otp.length !== 5) {
            isValid = false;
            setIsOtpError('Otp must be of 5 digit');
        }
        return isValid;
    };
    const handleUpdatepassword = () => {
        if (validate()) {
            const data = {
                reset_password_otp: otp,
                email_id: emailValue || '',
                user_role: 0,
            };
            dispatch(sendVerificationOtp(data)).then((res)=> {
                if (res && res.statusCode === 200 ){
                    setIsUpdatePassword(!isUpdatePassword);
                }
            })
        }
    };
    const resendOtpHandler = () => {
        const data = {
            email_id: emailValue,
            user_role: 0
        }
        dispatch(sendEmailAction(data, 'resend')).then((res)=> {
            if (res && res.statusCode === 200 ){
                console.log('res');
            }
        })
    }
    const content = <p>Please enter the one time password we sent on<br /> your email { emailValue } <a href className="link-otp">(change)</a></p>
    return (
        <>
            {!isUpdatePassword && (
                <UnauthLayoutContainer
                    formTitle= { content }
                    pageTitle="Please Enter OTP"
                >
                    <form className="login_form otp-section">
                        <div className="form-group d-flex align-items-center justify-content-center">
                            <input
                                type="number"
                                onChange={ handleChangeOtp }
                                onInput={ maxLengthCheck }
                                autoFocus
                                className="otp_text_field"
                                name="verification_otp"
                                autoComplete="off"
                                placeholder="-----"
                                data-dismiss="modal"
                                value={ otp || '' }
                                maxLength="5"
                            />
                        </div>
                        {otpError && <ErrorMessage message={ otpError || '' } />}
                        <Button
                            className="btn btn-primary btn-lg login_btn"
                            handleSubmit={ handleUpdatepassword }
                            buttonName="Next"
                        />
                        <div className="d-flex justify-content-between pt-2">
                            <a href onClick={ () => closeOtpScreen() } className="otp_option">
                                Go Back
                            </a>
                            <a href onClick={ () => resendOtpHandler() } className="otp_option">
                                {' '}
                                Resend OTP
                            </a>
                        </div>
                    </form>
                </UnauthLayoutContainer>
            )}
            {isUpdatePassword && <UpdatePassword emailValue={ emailValue } history ={ history } handleForgot = { handleForgot }/>}
        </>
    );
};

OtpVerification.propTypes = {
    closeOtpScreen: PropTypes.func,
    handleForgot: PropTypes.func,
    emailValue: PropTypes.string,
    history: PropTypes.object,
};

export default OtpVerification;
