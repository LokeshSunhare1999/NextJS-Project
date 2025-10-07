import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { getAccessToken } from 'utils/Helper';
// import { getCustomerAccountsActions } from './customerActions';
// import { getEventsListingAction } from './eventActions';
// import { getProducerList } from './producerActions';
// import { getStaffListing } from './staffActions';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function applicationIsLoading(bool) {
    return {
        type: 'APPLICATION_IS_LOADING',
        isLoading: bool,
    };
}

export function orderIsLoading(bool) {
    return {
        type: 'ORDER_IS_LOADING',
        isLoading: bool,
    };
}
export function orderSectionIsLoading(bool) {
    return {
        type: 'ORDER_SECTION_IS_LOADING',
        isLoading: bool,
    };
}

export function modalIsLoading(bool) {
    return {
        type: 'MODAL_IS_LOADING',
        isLoading: bool,
    };
}

export function sendFilesIsLoading(bool) {
    return {
        type: 'SEND_FILES_IS_LOADING',
        isLoading: bool,
    };
}

export function updateStatusType(api_type, data) {
    return (dispatch) => {
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `admin/api/commonApiForStatusUpdate/${ api_type }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                // dispatch(getEventsListingAction())
                // dispatch(getCustomerAccountsActions())
                // dispatch(getStaffListing())
                // dispatch(getProducerList())
                return res;
            })
            .catch((error) => {
                return error;
            });
    };
}