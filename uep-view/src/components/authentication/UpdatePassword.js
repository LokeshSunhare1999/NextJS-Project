import React, { useState } from 'react';
import { useDispatch } from 'react-redux'
import PropTypes from 'prop-types';
import { sendUpdatedPassword } from 'actions/authActions';
import Button from 'shared/Button'
import ErrorMessage from 'shared/ErrorMessage'
import UnauthLayoutContainer from 'shared/LayoutContainer/UnauthLayoutContainer'

const UpdatePassword = (props) => {
    const { history, handleForgot } = props
    const dispatch = useDispatch()
    const [ inputPassword, setInputPassword ] = useState({
        password: '',
        confirmPassword: ''
    })
    const [ inputPasswordError, setInputPasswordError ] = useState({})
    const handleChangePassword = (e) => {
        setInputPassword( { ...inputPassword, [ e.target.name ]: e.target.value } )
        setInputPasswordError({})
    }
    const validate = () => {
        const errors = {};
        let isValid = true;
        if (!inputPassword.password) {
            isValid = false;
            errors.password = 'Please enter password';
        }
        if (!inputPassword.confirmPassword) {
            isValid = false;
            errors.confirmPassword = 'Please confirm your password';
        }
        if (inputPassword.password !== inputPassword.confirmPassword){
            isValid = false;
            errors.confirmPassword = 'Password not matching';
        }
        setInputPasswordError(errors)
        return isValid;
    }
    const SubmitPassword = () => {
        if(validate()){
            const data = {
                email_id: props.emailValue,
                password: inputPassword.password,
                user_role: 0
            }
            dispatch(sendUpdatedPassword(data, history))
            setTimeout(() => {
                handleForgot()
            }, 300)
        }
    }
    return (
        <UnauthLayoutContainer formTitle=' Please enter your new password' pageTitle='Update Password'>
            <form className="login_form">
                <div className="form-group">
                    <input className="form-control form-control-lg login_field" onChange={ handleChangePassword }  type="password" value={ inputPassword.password || '' } name='password' placeholder=" Enter New Password" autoComplete="off"/>
                </div>
                {inputPasswordError.password && <ErrorMessage  message = { inputPasswordError.password || '' }/>}
                <div className="form-group">
                    <input className="form-control form-control-lg login_field" onChange={ handleChangePassword } type="password" value={ inputPassword.confirmPassword || '' } name='confirmPassword' placeholder="Confirm Password" autoComplete="off"/>
                </div>
                {inputPasswordError.confirmPassword && <ErrorMessage message ={ inputPasswordError.confirmPassword || '' }/>}
                <Button className='btn btn-primary btn-lg login_btn mt-4 mb-3' handleSubmit={ SubmitPassword } buttonName='Submit' />
            </form>
        </UnauthLayoutContainer>
    )
}
UpdatePassword.propTypes = {
    emailValue: PropTypes.string,
    history: PropTypes.object,
    handleForgot: PropTypes.func
};

export default UpdatePassword
