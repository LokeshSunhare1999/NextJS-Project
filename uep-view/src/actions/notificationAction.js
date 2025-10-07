import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { modalIsLoading } from './commonActions';
import { decryptFunc } from '../utils/Helper';
import { triggerNotifier } from 'shared/notifier';

export function fetchNotificationDetails(notificationData) {
    return {
        type: 'FETCH_NOTIFICATION_DETAILS',
        notificationData,
    };
}

export function getNotificationDetails() {
    return (dispatch) => {
        dispatch(modalIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + 'notification/api/getAdminTimelineNotifications',
            headers: {
                Authorization: `Bearer ${ sessionStorage.getItem('accessToken') }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(modalIsLoading(false));
                dispatch(fetchNotificationDetails(res.data.timeline_notifiactions))
                return res;
            })
            .catch((error) => {
                dispatch(modalIsLoading(false));
                return error;
            });
    };
}

export function removeNotification() {
    return (dispatch) => {
        dispatch(modalIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + 'notification/api/removeAdminNotifications',
            headers: {
                Authorization: `Bearer ${ sessionStorage.getItem('accessToken') }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(modalIsLoading(false));
                const message = res.data && res.data && (res.data.message === 'Success' ? 'All notification removed successfully' : 'All notification removed successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(getNotificationDetails())
                return res;
            })
            .catch((error) => {
                dispatch(modalIsLoading(false));
                return error;
            });
    };
}
