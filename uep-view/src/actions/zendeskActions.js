/* eslint-disable quotes */
import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { getAccessToken } from 'utils/Helper';
import { triggerNotifier } from 'shared/notifier';
import { applicationIsLoading } from './commonActions';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function fetchZendeskDetails(zendeskDetails) {
    return {
        type: 'FETCH_ZENDESK_DETAILS',
        zendeskDetails,
    };
}

export function getZendeskDetails() {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `admin/api/getZendeskTicketList`,
            headers: {
                Authorization: `Bearer ${ sessionStorage.getItem('accessToken') }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data.responseObj);
                dispatch(applicationIsLoading(false));
                dispatch(fetchZendeskDetails(res.zendesk_tickets))
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function getZendeskImportantTicket(data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'admin/api/getZendeskImportantTicketList',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(getZendeskDetails())
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
