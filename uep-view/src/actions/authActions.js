import axios from 'axios';
import { triggerNotifier } from 'shared/notifier';
import { getAccessToken, removeAccessToken, setAccessToken } from 'utils/Helper';
import  { REACT_APP_BASE_URL }  from '../config';
import { applicationIsLoading } from './commonActions';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function isAuthenticated(bool) {
    return {
        type: 'IS_AUTHENTICATED',
        isAuthenticated: bool,
    };
}
export function isEmailRegistered(bool) {
    return {
        type: 'IS_EMAIL_REGISTERED',
        isEmailRegistered: bool,
    };
}
export function isOtpVerified(bool) {
    return {
        type: 'IS_OTP_VERIFIED',
        isOtpVerified: bool,
    };
}

export function adminLoginAction(data, history) {
    return function (dispatch){
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'admin/api/adminLogin',
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                setAccessToken(res.data.access_token)
                dispatch(isAuthenticated(true));
                history.push('/reports')
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function sendEmailAction(data, pageName) {
    return function (dispatch){
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'admin/api/sendAdminResetPasswordToken',
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(isEmailRegistered(true));
                if(pageName === 'resend'){
                    const message = res && (res.statusCode === 200 ? 'Your reset password token has been sent to your registered email id' : 'Your reset password token has been sent to your registered email id')
                    triggerNotifier({ type: 'success', message })
                }
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                dispatch(isEmailRegistered(false));
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function sendVerificationOtp(data) {
    return function (dispatch){
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'admin/api/verifyAdminResetPasswordToken',
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(isOtpVerified(true));
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                dispatch(isOtpVerified(false));
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function sendUpdatedPassword(data, history) {
    return function (dispatch){
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'admin/api/resetAdminPassword',
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                const message = res && res.data && (res.data.message || 'Password has been updated')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function adminLogoutAction(history) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'admin/api/adminLogout',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-Type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                removeAccessToken()
                history ? history.push('/') : window.location.href = '/';
                dispatch(isAuthenticated(false));
                return res.data;
            })
            .catch((error) => {
                return error;
            });
    };
}