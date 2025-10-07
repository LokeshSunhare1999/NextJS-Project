import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { triggerNotifier } from 'shared/notifier';
import { getAccessToken } from 'utils/Helper';
import { applicationIsLoading } from './commonActions';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function showProfileSection(bool) {
    return {
        type: 'SHOW_PROFILE_SECTION',
        showProfileSection: bool,
    };
}
export function fetchSuccessProfileUpdate(bool) {
    return {
        type: 'FETCH_SUCCESS_PROFILE_UPDATE',
        successProfileUpdate: bool,
    };
}
export function fetchProfileDetails(profileDetails) {
    return {
        type: 'FETCH_PROFILE_DETAILS',
        profileDetails,
    };
}

export function getAdminTransactions(startDate, endDate, physicianName, patientName) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + 'verifyAdminResetPasswordToken',
            headers: {
                Authorization: `Bearer ${ sessionStorage.getItem('accessToken') }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                return res.data;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function getProfileDetails() {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + 'admin/api/getAdminProfile',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(fetchProfileDetails(res.data))
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function updateProfileAction(data) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'admin/api/updateAdminProfile',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                if (data.is_profile_picture_upload === 0 ){
                    const message = res.data && res.data && (res.data.message === 'Success' ? 'Profile Successfully Updated' : 'Profile Successfully Updated')
                    triggerNotifier({ type: 'success', message })
                }
                dispatch(fetchSuccessProfileUpdate(true))
                dispatch(getProfileDetails())
                return res;
            })
            .catch((error) => {
                dispatch(fetchSuccessProfileUpdate(false))
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function addProfileImageAction(data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + 'admin/api/upload/file/users',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'multipart/form-data',
            },
            data: data,
        })
            .then((response) => {
                const res = response.data;
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Profile Successfully Updated' : 'Profile Successfully Updated')
                triggerNotifier({ type: 'success', message })
                dispatch(applicationIsLoading(false));
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