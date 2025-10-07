import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { triggerNotifier } from 'shared/notifier';
import { getAccessToken } from 'utils/Helper';
import { applicationIsLoading, modalIsLoading } from './commonActions';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function fetchCustomerAcctountListing(cusAccountList) {
    return {
        type: 'FETCH_CUSTOMER_ACCOUNT_LISTING',
        cusAccountList,
    };
}

export function fetchCustomerOrderHistory(orderHistory) {
    return {
        type: 'FETCH_ORDER_HISTORY',
        orderHistory,
    };
}

export function getCustomerAccountsActions(page, value, sort_by='desc', sort_type='date') {
    // const pageNo = page !== undefined ? page : 1
    console.log(page, value , sort_by  , sort_type);
    let apiUrl;
    if(page === undefined || typeof page === 'number'){
        const pageNo = page !== undefined ? page : 1
        apiUrl = REACT_APP_BASE_URL + `customers/api/getCustomerList?page=${ pageNo }&limit=${ 10 }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    } else if(page === 'search') {
        apiUrl = REACT_APP_BASE_URL + `customers/api/getCustomerList?filter_type=${ 0 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if(page === 'filter'){
        apiUrl = REACT_APP_BASE_URL + `customers/api/getCustomerList?filter_type=${ 1 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
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
                dispatch(fetchCustomerAcctountListing(res.data))
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function getCustomerProfileActions(id, page, value, sort_by='desc' , sort_type='date') {
    console.log(id, page, value,  sort_by  , sort_type);
    let apiUrl;
    if(page === undefined || typeof page === 'number'){
        const pageNo = page !== undefined ? page : 1
        // &limit=${ 10 }&sort_by=${ sort_by }&sort_type=${ sort_type }
        apiUrl = REACT_APP_BASE_URL + `customers/api/getCustomerProfile?customer_id=${ id }&page=${ pageNo }&limit=${ 10 }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    } else if(page === 'search') {
        apiUrl = REACT_APP_BASE_URL + `customers/api/getCustomerProfile?customer_id=${ id }&filter_type=${ 0 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if(page === 'filter'){
        apiUrl = REACT_APP_BASE_URL + `customers/api/getCustomerProfile?customer_id=${ id }&filter_type=${ 1 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    return (dispatch) => {
        dispatch(modalIsLoading(true));
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
                dispatch(modalIsLoading(false));
                dispatch(applicationIsLoading(false));
                dispatch(fetchCustomerOrderHistory(res.data))
                return res;
            })
            .catch((error) => {
                dispatch(modalIsLoading(false));
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function addCustomerAccount(data) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'customers/api/AddCustomer',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(getCustomerAccountsActions())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Customer Account Successfully Created' : 'Customer Account Successfully Created')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function updateCustomerProfile(id,data) {
    return (dispatch) => {
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `customers/api/updateCustomerProfile/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                // dispatch(getCustomerAccountsActions())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Customer Successfully Updated' : 'Customer Successfully Updated')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function removeCustomerAction(id) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `customers/api/removeCustomer/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                // dispatch(getCustomerAccountsActions())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Customer Successfully Deleted' : 'Customer Successfully Deleted')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function removeOrderAction(id, custId) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `/orders/api/removeOrder/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Order Successfully Removed' : 'Order Successfully Removed')
                triggerNotifier({ type: 'success', message })
                dispatch(applicationIsLoading(false));
                dispatch(getCustomerProfileActions(custId))
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