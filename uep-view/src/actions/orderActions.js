/* eslint-disable template-curly-spacing */
import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { triggerNotifier } from 'shared/notifier';
import { getAccessToken } from 'utils/Helper';
import { applicationIsLoading, modalIsLoading, sendFilesIsLoading, orderSectionIsLoading } from './commonActions';
// import { getCustomerProfileActions } from './customerActions';
import { fetchEventDescriptionList } from './fileActions';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function fetchOrderList(orderList) {
    return {
        type: 'FETCH_ORDER_LIST',
        orderList
    }
}
export function fetchOrderDetails(orderDetails) {
    return {
        type: 'FETCH_ORDER_DETAILS',
        orderDetails
    }
}
export function fetchOrderDetailsEmpty(orderDetails) {
    return {
        type: 'FETCH_ORDER_DETAILS_EMPTY',
        orderDetails
    }
}
export function fetchFileDetails(fileDetails) {
    return {
        type: 'FETCH_FILE_DETAILS',
        fileDetails
    }
}
export function fetchOrderFolderDetails(orderFolderDetails) {
    return {
        type: 'FETCH_ORDER_FOLDER_DETAILS',
        orderFolderDetails
    }
}
export function fetchOrderInvoiceDetails(orderInvoiceDetails) {
    return {
        type: 'FETCH_ORDER_INVOICE_DETAILS',
        orderInvoiceDetails
    }
}
export function fetchEventFoldersList(folderList) {
    return {
        type: 'FETCH_EVENT_FOLDER_LIST',
        folderList
    }
}

export function getOrderListActionV2(page, search_by, producer, created_on, status, sort_by, sort_type) {
    console.warn(page, search_by, producer, created_on, status, sort_by, sort_type, '---- getOrderListActionV2 API Parameters !>>>>>>!>>>>>>>>!>>>>>>>!--------');
    return (dispatch) => {
        dispatch(orderSectionIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + 'orders/api/getOrderList',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            },
            params:{
                page,
                limit:10,
                search_by,
                producer,
                created_on,
                status,
                sort_by,
                sort_type
            }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                console.log(res, '>>>>>>>>>>> getOrderListActionV2 API Response <<<<<<<<<<<<<<<<<');
                if (res.statusCode === 200) {
                    dispatch(orderSectionIsLoading(false))
                    dispatch(fetchOrderList(res.data))
                }
                return res
            })
            .catch((error) => {
                dispatch(orderSectionIsLoading(false))
                return error
            })
    }
}

export function getOrderListAction(page, filter_text, value , sort_by='desc', sort_type='date') {
    let apiUrl;
    console.log(page, filter_text, value , sort_by, sort_type);
    if (filter_text === undefined) {
        const pageNo = page !== undefined ? page : 1
        apiUrl = REACT_APP_BASE_URL + `orders/api/getOrderList?page=${pageNo}&limit=${10}&sort_by=${ sort_by }&sort_type=${ sort_type }`
    } else if (filter_text === 'search') {
        apiUrl = REACT_APP_BASE_URL + `orders/api/getOrderList?filter_type=${0}&filter_text=${value}&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    else if (filter_text === 'filter') {
        apiUrl = REACT_APP_BASE_URL + `orders/api/getOrderList?filter_type=${1}&filter_text=${value}&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: apiUrl,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                if (res.statusCode === 200) {
                    dispatch(applicationIsLoading(false))
                    dispatch(fetchOrderList(res.data))
                }
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                return error
            })
    }
}

export function getOrderDetailsAction(id) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            // url: REACT_APP_BASE_URL + `orders/api/getOrderDetails?order_number=${id}`,
            url: REACT_APP_BASE_URL + `orders/api/getOrderDetails`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            },
            params :{ order_number : id }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false))
                dispatch(fetchOrderDetails(res.data))
                return res
            })
            .catch((error) => {
                triggerNotifier({ type: 'error', message: error.message })
                dispatch(fetchOrderDetails({}));
                dispatch(applicationIsLoading(false));
                return error
            })
    }
}

export function getFileDetails(id) {
    return (dispatch) => {
        dispatch(modalIsLoading(true))
        return axios({
            method: 'get',
            // url: REACT_APP_BASE_URL + `files/api/getOrderedFileDetailsById?id=${id}`,
            url: REACT_APP_BASE_URL + `files/api/getOrderedFileDetailsById`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json',
            },
            params :{ id : id }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(modalIsLoading(false))
                dispatch(fetchFileDetails(res.data))
                return response
            })
            .catch((error) => {
                dispatch(modalIsLoading(false))
                return error
            })
    }
}

export function removeOrderFileAction(id, orderId) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `/orders/api/removeOrderedFile/${id}`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? 'File deleted successfully' : 'File deleted successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(applicationIsLoading(false));
                dispatch(getOrderDetailsAction(orderId))
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

export function removeOrderAction(id, userId) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        console.log('Delete Order triggered')
        // eslint-disable-next-line no-unreachable
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `/orders/api/removeOrder/${id}`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Order deleted successfully' : 'Order deleted successfully')
                triggerNotifier({ type: 'success', message })
                // dispatch(getOrderListAction())
                dispatch(applicationIsLoading(false));
                if(userId){
                    // dispatch(getCustomerProfileActions(userId))
                }
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

export function updatePreOrderAction(id, data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `orders/api/updatePreOrderDetail/${id}`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(getOrderListAction())
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Pre Order Successfully Updated' : 'Pre Order Successfully Updated')
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

export function updateOrderDetailsAction(data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `orders/api/updateOrderDetail/${data.order_number}`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Order Successfully Updated' : 'Order Successfully Updated')
                triggerNotifier({ type: 'success', message })
                // dispatch(getOrderListAction())
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

export function updatePackageStatusAction(data) {
    return (dispatch) => {
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `orders/api/updateEventPackageStatus/${data.event_package_id}`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && (res.data.message === 'Success' ? 'Package Status Successfully Updated' : 'Package Status Successfully Updated')
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

export function updateOrderStatusActione(data) {
    return (dispatch) => {
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `customers/api/updateCustomerOrderStatus/${data.order_number}`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && (res.data.message === 'Success' ? 'Order Status Successfully Updated' : 'Order Status Successfully Updated')
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

export function getOrderFolderByOrderNumberAction(id) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            // url: REACT_APP_BASE_URL + `files/api/getOrderedFolderByOrderNumber?order_number=${id}`,
            url: REACT_APP_BASE_URL + `files/api/getOrderedFolderByOrderNumber`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            },
            params :{ order_number : id }
        })
            .then((response) => {
                const res = decryptFunc(response.data.responseObj);
                dispatch(applicationIsLoading(false))
                dispatch(fetchOrderFolderDetails(res))
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                dispatch(fetchOrderFolderDetails({}))
                return error
            })
    }
}

export function getOrderFilesByOrderNumberAction(id, folder_name) {
    if(window.location.pathname === '/preorders'){
        id = id.replaceAll(' ', '');
    }
    console.log('getOrderFilesByOrderNumberAction', id, folder_name);
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            // url: REACT_APP_BASE_URL + `files/api/getOrderedFilesByOrderNumber?order_number=${id}&folder=${folder_name}`,
            url: REACT_APP_BASE_URL + `files/api/getOrderedFilesByOrderNumber`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            },
            params :{ order_number : id, folder : folder_name }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                console.log('res', res);
                dispatch(applicationIsLoading(false))
                dispatch(fetchEventDescriptionList(res.data.userBucketFilesDetails))
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                dispatch(fetchEventDescriptionList({}))
                return error
            })
    }
}

export function getUserOrderedFoldersAction(id) {
    return (dispatch) => {
        if(window.location.pathname === '/preorders') {
            // eslint-disable-next-line no-param-reassign
            id = id.replaceAll(' ', '');
        }
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            // url: REACT_APP_BASE_URL + `files/api/getUserOrderedFolders?order_number=${id}`,
            url: REACT_APP_BASE_URL + `files/api/getUserOrderedFolders`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            },
            params :{ order_number : id }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false))
                dispatch(fetchEventFoldersList(res.data.ordered_folders))
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                dispatch(fetchEventDescriptionList({}))
                return error
            })
    }
}

export function sendPurchasedFilesToUserAction(data) {
    return (dispatch) => {
        dispatch(sendFilesIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'files/api/sendPurchasedFilesToUser',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = response.data
                const message = res && res.data && (res.data.statusCode === 200 ? 'Sent Email and Notification to User Successfully' : 'Sent Email and Notification to User Successfully')
                dispatch(sendFilesIsLoading(false))
                triggerNotifier({ type: 'success', message })
                return res
            })
            .catch((error) => {
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                dispatch(sendFilesIsLoading(false))
                triggerNotifier({ type: 'error', message })
                return error
            })
    }
}

export function sendPreOrderPurchasedFilesToUserAction(data) {
    return (dispatch) => {
        dispatch(sendFilesIsLoading(true));
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'files/api/sendPreOrderPurchasedFilesToUser',
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = response.data
                const message = res && res.data && (res.data.statusCode === 200 ? 'Sent Email and Notification to User Successfully' : 'Sent Email and Notification to User Successfully')
                dispatch(sendFilesIsLoading(false))
                triggerNotifier({ type: 'success', message })
                return res
            })
            .catch((error) => {
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                dispatch(sendFilesIsLoading(false))
                triggerNotifier({ type: 'error', message })
                return error
            })
    }
}

export function removeAllOrderFileAction(data, orderNumber) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            // url: REACT_APP_BASE_URL + `/files/api/removeAllPurchasedFiles/${order_number}`,
            url: REACT_APP_BASE_URL + `files/api/removeOrderedFolder`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Files deleted successfully' : 'Files deleted successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(applicationIsLoading(false));
                dispatch(getOrderFilesByOrderNumberAction(orderNumber))
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

export function sendEmailToAdminAction(data) {
    return (dispatch) => {
        return axios({
            method: 'get',
            // url: REACT_APP_BASE_URL + `/orders/api/sentInvoiceToAdmin?order_number=${data.order_number}&is_print=${data.is_print}`,
            url: REACT_APP_BASE_URL + `/orders/api/sentInvoiceToAdmin`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            },
            params :{ order_number : data.order_number,  is_print: data.is_print }
        })
            .then((response) => {
                const res = response.data;
                const message = res && (res.statusCode === 200 ? 'Email Sent Successfully' : 'Email Sent Successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(fetchOrderInvoiceDetails(res.data))
                return res
            })
            .catch((error) => {
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                dispatch(fetchOrderInvoiceDetails({}))
                triggerNotifier({ type: 'error', message })
                return error
            })
    }
}

export function sendInvoiceToAdminAction(data) {
    return (dispatch) => {
        return axios({
            method: 'get',
            // url: REACT_APP_BASE_URL + `/orders/api/sentInvoiceToAdmin?order_number=${data.order_number}&is_print=${data.is_print}`,
            url: REACT_APP_BASE_URL + `/orders/api/sentInvoiceToAdmin`,
            headers: {
                Authorization: `Bearer ${getAccessToken()}`,
                'content-type': 'application/json'
            },
            params :{ order_number : data.order_number,  is_print: data.is_print }
        })
            .then((response) => {
                const res = response.data;
                dispatch(fetchOrderInvoiceDetails(res.data))
                return res
            })
            .catch((error) => {
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                dispatch(fetchOrderInvoiceDetails({}))
                triggerNotifier({ type: 'error', message })
                return error
            })
    }
}
