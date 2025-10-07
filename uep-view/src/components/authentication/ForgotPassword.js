import React, { useState } from 'react'
import { sendEmailAction } from 'actions/authActions'
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types';
import Button from 'shared/Button'
import ErrorMessage from 'shared/ErrorMessage'
import UnauthLayoutContainer from 'shared/LayoutContainer/UnauthLayoutContainer'
import OtpVerification from './OtpVerification'

const ForgotPassword = (props) => {
    const { history, handleForgot } = props
    const dispatch = useDispatch()
    const [ isOtpPage, setIsOtpPage ] = useState(false)
    const [ emailValue, setEmailValue ] = useState('')
    const [ emailValueError, setEmailValueError ] = useState('')
    const handleEmailValue = (e) => {
        setEmailValue(e.target.value)
        setEmailValueError('')
    }
    const validate = () => {
        let isValid = true;
        if (!emailValue) {
            isValid = false;
            setEmailValueError('Please enter email')
        }
        if (typeof emailValue !== 'undefined') {
            const pattern = new RegExp(
                /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
            );
            if (!pattern.test(emailValue)) {
                isValid = false;
                setEmailValueError('Please enter valid email address')
            }
        }
        return isValid;
    }
    const handleOtp = () => {
        if(validate()){
            const data = {
                email_id: emailValue,
                user_role: 0
            }
            dispatch(sendEmailAction(data)).then((res)=> {
                if (res && res.statusCode === 200 ){
                    setIsOtpPage(!isOtpPage)
                }
            })
        }
    }
    const closeOtpScreen = () => {
        setIsOtpPage(!isOtpPage)
    }

    return (
        <>
            {!isOtpPage && <UnauthLayoutContainer formTitle='Please enter your email id.' pageTitle='Forgot Password'>
                <form className="login_form">
                    <div className="form-group">
                        <input className="form-control form-control-lg login_field" onChange={  handleEmailValue } name='emailValue' value = { emailValue || '' } type="email"  placeholder="Email" autoComplete="off"/>
                    </div>
                    {emailValueError && <ErrorMessage message={ emailValueError } />}
                    <Button className='btn btn-primary btn-lg login_btn mt-4' handleSubmit={ handleOtp } buttonName='NEXT' />
                </form>
            </UnauthLayoutContainer>}
            {isOtpPage && <OtpVerification closeOtpScreen={ closeOtpScreen } emailValue ={ emailValue } history = { history } handleForgot = { handleForgot }/>}
        </>
    )
}
ForgotPassword.propTypes = {
    history: PropTypes.object,
    handleForgot: PropTypes.func
};

export default ForgotPassword
