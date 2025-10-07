/* eslint-disable template-curly-spacing */
import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { applicationIsLoading } from './commonActions';
import { decryptFunc } from '../utils/Helper';
import { triggerNotifier } from 'shared/notifier';

export function fetchReportsDetails(dashboardData) {
    return {
        type: 'FETCH_REPORTS_DETAILS',
        dashboardData,
    };
}

export function fetchVisualReportsDetails(visualReportsData) {
    return {
        type: 'FETCH_VISUAL_REPORTS_DETAILS',
        visualReportsData,
    };
}

export function fetchSalesReport(SalesReport) {
    return {
        type: 'FETCH_SALES_REPORT',
        SalesReport,
    };
}

export function getAdminReports(data) {
    const { is_daily, is_weekly, is_monthly, is_yearly, filter_type } = data
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `reports/api/getDashboardReports?is_daily=${is_daily}&is_weekly=${is_weekly}&is_monthly=${is_monthly}&is_yearly=${is_yearly}&filter_type=${filter_type}`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(fetchReportsDetails(res.data))
                return res.data;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function getVisualReports(lineData) {
    const { year, quarter } = lineData
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `/reports/api/getDashboardVisualReports?year=${year}&quarter=${quarter}`,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(fetchVisualReportsDetails(res.data))
                return res.data;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function getSalesReport(page, filter_text, value, isActive, sort_by='desc', sort_type='date') {
    let apiUrl;
    console.log(page, filter_text, value, isActive, sort_by, sort_type)
    if (filter_text === undefined) {
        const pageNo = page !== undefined ? page : 1
        apiUrl = REACT_APP_BASE_URL + `reports/api/getSalesReport?limit=${10}&page=${pageNo}&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if(isActive?.label === 'event-code'){
        apiUrl = REACT_APP_BASE_URL + `reports/api/getSalesReport?producer_id=${value}&event_code=${isActive.value}&limit=${10}&page=${page}&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if(isActive?.label === 'producer-id'){
        apiUrl = REACT_APP_BASE_URL + `reports/api/getSalesReport?event_code=${value}&producer_id=${isActive.value}&limit=${10}&page=${page}&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if (filter_text === 'producer') {
        apiUrl = REACT_APP_BASE_URL + `reports/api/getSalesReport?producer_id=${value}&limit=${10}&page=${page}&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if (filter_text === 'event') {
        apiUrl = REACT_APP_BASE_URL + `reports/api/getSalesReport?event_code=${value}&limit=${10}&page=${page}&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: apiUrl,
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(fetchSalesReport(res.data))
                return res.data;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                return error;
            });
    };
}

export function generateRepoertAction(producer_id) {
    return () => {
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `reports/api/exportSalesReport?producer_id=${producer_id}`,
            responseType: 'blob',
            headers: {
                Authorization: `Bearer ${sessionStorage.getItem('accessToken')}`,
                'Accept': 'application/pdf',
            },
        })
            .then((response) => {
                const url = URL.createObjectURL(response.data);
                window.open(url)
                const message = 'Your report will be downloaded in few minutes';
                triggerNotifier({ type: 'success', message })
            })
            .catch((error) => {
                const message = 'No report found';
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}
