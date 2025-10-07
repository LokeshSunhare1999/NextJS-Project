import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { triggerNotifier } from 'shared/notifier';
import { getAccessToken } from 'utils/Helper';
import { applicationIsLoading, modalIsLoading } from './commonActions';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function fetchProducerListing(producerList) {
    return {
        type: 'FETCH_PRODUCERS_LISTING',
        producerList,
    };
}
export function fetchProducerProfileDetails(producerProfileDetails) {
    return {
        type: 'FETCH_PRODUCERS_PROFILE_DETAILS',
        producerProfileDetails,
    };
}

export function getProducerListing(page, value) {
    // const pageNo = page !== undefined ? page : 1
    // const apiUrl = REACT_APP_BASE_URL + 'producers/api/getAllProducers';
    // if(page === undefined || typeof page === 'number'){
    //     const pageNo = page !== undefined ? page : 1
    //     apiUrl = REACT_APP_BASE_URL + `producers/api/getProducerList?page=${ pageNo }&limit=${ 10 }`
    // } else if(page === 'search') {
    //     apiUrl = REACT_APP_BASE_URL + `producers/api/getProducerList?filter_type=${ 0 }&filter_text=${ value }`
    // }
    // else if(page === 'filter'){
    //     apiUrl = REACT_APP_BASE_URL + `producers/api/getProducerList?filter_type=${ 1 }&filter_text=${ value }`
    // }
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + 'producers/api/getAllProducers',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(fetchProducerListing(res.data))
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function getProducerList(page, value, sort_by='desc', sort_type = 'id') {
    console.log(page, value, sort_by, sort_type)
    // const pageNo = page !== undefined ? page : 1
    let apiUrl;
    if(page === undefined || typeof page === 'number'){
        const pageNo = page !== undefined ? page : 1
        apiUrl = REACT_APP_BASE_URL + `producers/api/getProducerList?page=${ pageNo }&limit=${ 10 }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    } else if(page === 'search') {
        apiUrl = REACT_APP_BASE_URL + `producers/api/getProducerList?filter_type=${ 0 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if(page === 'filter'){
        apiUrl = REACT_APP_BASE_URL + `producers/api/getProducerList?filter_type=${ 1 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
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
                dispatch(fetchProducerListing(res.data))
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function getProducerProfileAction(id) {
    return (dispatch) => {
        dispatch(modalIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `producers/api/getProducerProfile?producer_id=${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(modalIsLoading(false));
                dispatch(fetchProducerProfileDetails(res.data.producer_profile))
                return res;
            })
            .catch((error) => {
                dispatch(modalIsLoading(false));
                return error;
            });
    };
}

export function addProducerAction(data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'producers/api/addProducer',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(getProducerList())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Producer Successfully Created' : 'Producer Successfully Created')
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

export function updateProducerAction(id, data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `producers/api/updateProducerProfile/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                // dispatch(getProducerList())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Producer Successfully Updated' : 'Producer Successfully Updated')
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

export function removeProducerAction(id) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `producers/api/removeProducer/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                // dispatch(getProducerList())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Producer Successfully Deleted' : 'Producer Successfully Deleted')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}