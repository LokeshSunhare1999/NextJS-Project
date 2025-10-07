import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { getAccessToken } from 'utils/Helper';
import { applicationIsLoading, modalIsLoading } from './commonActions';
import { triggerNotifier } from 'shared/notifier';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function fetchEventsListing(eventList) {
    return {
        type: 'FETCH_EVENT_LISTING',
        eventList,
    };
}
export function fetchEventDetails(eventDetails) {
    return {
        type: 'FETCH_EVENT_DETAILS',
        eventDetails,
    };
}
export function saveTeamDetails(teamDetails) {
    return {
        type: 'SAVE_TEAM_DETAILS',
        teamDetails,
    };
}
export function fetchDynamicPricing(dynamicPricing) {
    return {
        type: 'FETCH_DYNAMIC_PRICING',
        dynamicPricing,
    };
}
export function getEventsListingAction(page, value, sort_by='desc', sort_type='date') {
    // const pageNo = page !== undefined ? page : 1
    console.log(page, value, sort_by, sort_type)
    let apiUrl;
    if(page === undefined || typeof page === 'number'){
        const pageNo = page !== undefined ? page : 1
        apiUrl = REACT_APP_BASE_URL + `events/api/getEventList?page=${ pageNo }&limit=${ 10 }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    } else if(page === 'search') {
        apiUrl = REACT_APP_BASE_URL + `events/api/getEventList?filter_type=${ 0 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if(page === 'filter'){
        apiUrl = REACT_APP_BASE_URL + `events/api/getEventList?filter_type=${ 1 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
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
                dispatch(fetchEventsListing(res.data));
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function viewEventDetailsAction(id) {
    return (dispatch) => {
        dispatch(modalIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `events/api/getEventDetails?event_id=${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(modalIsLoading(false));
                dispatch(fetchEventDetails(res.data.event_detail))
                return res;
            })
            .catch((error) => {
                dispatch(modalIsLoading(false));
                return error;
            });
    };
}
export function addEventAccount(data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'events/api/addEvent',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                dispatch(applicationIsLoading(false));
                const res = decryptFunc(response.data);
                dispatch(getEventsListingAction())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Event Successfully Created' : 'Event Successfully Created')
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
export function updateEventDetails(data, id) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `events/api/updateEventDetail/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                // dispatch(getEventsListingAction())

                const message = res.data && res.data && (res.data.message === 'Success' ? 'Event Successfully Updated' : 'Event Successfully Updated')
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
export function removeEventAction(id) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `events/api/removeEvent/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                // dispatch(getEventsListingAction())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Event Deleted Successfully' : 'Event Deleted Successfully')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                const message = error.response && error.response.data && (error.response.data.message || '')
                triggerNotifier({ type: 'error', message })
                throw error;
                // return error;
            });
    };
}
export function getDynamicPriceAction(id) {
    return (dispatch) => {
        dispatch(modalIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `events/api/getDynamicPricing?event_id=${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(modalIsLoading(false));
                dispatch(fetchDynamicPricing(res.data.event_dynamic_price))
                return res;
            })
            .catch((error) => {
                dispatch(modalIsLoading(false));
                return error;
            });
    };
}
export function uploadCsvTeamEvent(data) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'events/api/readTeamDetailsCSV',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'multipart/form-data',
            },
            data: data,
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(saveTeamDetails(res.data.team_details))
                dispatch(getEventsListingAction())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'File Successfully Uploaded' : 'File Successfully Uploaded')
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

export function updateDynamicPricingAction(data){
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + 'events/api/updateDynamicPricing',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                // dispatch(getEventsListingAction())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Package Details Successfully Updated' : 'Package Details Successfully Updated')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function updateTeamDetailsAction(data){
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + '/events/api/updateEventTeamDetails',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Team Updated Successfully' : 'Team Updated Successfully')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                const message = error.response && error.response.data && (error.response.data.message || '')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function updateEventSyncStatusAction(id, data, current){
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `/events/api/updateEventSyncStatus/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = response.data;
                dispatch(applicationIsLoading(false));
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Updated Successfully' : 'Updated Successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(getEventsListingAction(current))
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                const message = error.response && error.response.data && (error.response.data.message || '')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function removeCheerEventTeam(id) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `events/api/removeCheerTeam/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                // dispatch(getEventsListingAction())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Cheer Team Deleted Successfully' : 'Cheer Team Deleted Successfully')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                const message = error.response && error.response.data && (error.response.data.message || '')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}
