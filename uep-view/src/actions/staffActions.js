import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { triggerNotifier } from 'shared/notifier';
import { getAccessToken } from 'utils/Helper';
import { applicationIsLoading, modalIsLoading } from './commonActions';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function fetchStaffListing(staffList) {
    return {
        type: 'FETCH_STAFF_LISTING',
        staffList,
    };
}
export function getStaffListing(page, value ,sort_by='desc', sort_type='date') {
    // const pageNo = page !== undefined ? page : 1
    console.log(page, value ,sort_by, sort_type);
    let apiUrl;
    if(page === undefined || typeof page === 'number'){
        const pageNo = page !== undefined ? page : 1
        apiUrl = REACT_APP_BASE_URL + `staffs/api/getStaffList?page=${ pageNo }&limit=${ 10 }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    } else if(page === 'search') {
        apiUrl = REACT_APP_BASE_URL + `staffs/api/getStaffList?filter_type=${ 0 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if(page === 'filter'){
        apiUrl = REACT_APP_BASE_URL + `staffs/api/getStaffList?filter_type=${ 1 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: apiUrl,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(fetchStaffListing(res.data))
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function viewStaffDetailsAction(id) {
    return (dispatch) => {
        dispatch(modalIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `staffs/api/getStaffProfile?staff_id=${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(modalIsLoading(false));
                return res;
            })
            .catch((error) => {
                dispatch(modalIsLoading(false));
                return error;
            });
    };
}

export function addStaffAction(data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'staffs/api/addStaff',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(getStaffListing())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Staff Successfully Created' : 'Staff Successfully Created')
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
export function updateStaffAction(id , data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `staffs/api/updateStaffProfile/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                // dispatch(getStaffListing())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Staff Successfully Updated' : 'Staff Successfully Updated')
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

export function removeStaffAction(id) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `staffs/api/removeStaff/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                // dispatch(getStaffListing())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Staff Successfully Deleted' : 'Staff Successfully Deleted')
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