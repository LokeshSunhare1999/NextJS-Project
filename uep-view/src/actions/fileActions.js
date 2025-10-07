/* eslint-disable quotes */
import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { getAccessToken } from 'utils/Helper';
import { applicationIsLoading, modalIsLoading } from './commonActions';
import { triggerNotifier } from 'shared/notifier';
import { getOrderFilesByOrderNumberAction, getUserOrderedFoldersAction } from './orderActions';
import { encryptFunc, decryptFunc } from '../utils/Helper';

export function fetchFileList(fileList){
    return {
        type: 'FETCH_FILE_LISTING',
        fileList,
    };
}

export function fetchEventFoldersList(folderList){
    return {
        type: 'FETCH_EVENT_FOLDER_LIST',
        folderList
    }
}

export function fetchPreOrderEventFoldersList(preOrderFolderList){
    return {
        type: 'FETCH_PRE_ORDER_EVENT_FOLDER_LIST',
        preOrderFolderList
    }
}

export function fetchEventDescriptionList(eventDesc){
    return {
        type: 'FETCH_EVENT_DESCRIPTION_LIST',
        eventDesc
    }
}

export function fetchFileDetails(fileDetails){
    return {
        type: 'FETCH_FILE_DETAILS',
        fileDetails
    }
}

export function createFolder(folderData){
    return {
        type: 'CREATE_FOLDER',
        folderData
    }
}

export function clearDetailsFromRedux(fileDetails){
    return {
        type: 'CLEAR_DETAILS_FROM_REDUX',
        fileDetails
    }
}

export function getFileListingAction(page, value , sort_by='desc' , sort_type='asc') {
    let apiUrl;
    console.log(page, value, sort_by, sort_type );
    if(page === undefined || typeof page === 'number'){
        const pageNo = page !== undefined ? page : 1
        apiUrl = REACT_APP_BASE_URL + `events/api/getEventList?page=${ pageNo }&limit=${ 10 }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    } else if(page === 'search') {
        apiUrl = REACT_APP_BASE_URL + `events/api/getEventList?filter_type=${ 0 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    } else if(page === 'filter'){
        apiUrl = REACT_APP_BASE_URL + `events/api/getEventList?filter_type=${ 1 }&filter_text=${ value }&sort_by=${ sort_by }&sort_type=${ sort_type }`
    }
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: apiUrl,
            headers: {
                Authorization: `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json'
            }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false))
                dispatch(fetchFileList(res.data))
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                return error
            })
    }
}

export function getEventFoldersList(id) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `files/api/getEventFoldersList?event_id=${ id }`,
            headers: {
                Authorization: `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json'
            }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false))
                dispatch(fetchEventFoldersList(res.data.folders_list))
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                return error
            })
    }
}

export function getPreOrderListAction(page , value) {
    let apiUrl;
    console.log(page, value);
    if(page === undefined || typeof page === 'number'){
        const pageNo = page !== undefined ? page : 1
        apiUrl = REACT_APP_BASE_URL + `files/api/getPreOrderFoldersList?page=${ pageNo }&limit=${ 10 }`
    } else if(page === 'search'){
        apiUrl = REACT_APP_BASE_URL + `files/api/getPreOrderFoldersList?filter_type=${ 0 }&filter_text=${ value }`
    }

    return(dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: apiUrl ,
            headers: {
                Authorization: `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json'
            }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                console.log(res, 'res')
                dispatch(applicationIsLoading(false))
                dispatch(fetchPreOrderEventFoldersList(res.data))
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                return error
            })
    }
}

export function getEventDescriptionList(id, eventId){
    console.log('id, eventId', id, eventId);
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `files/api/getFilesList?event_folder_id=${ id }&event_id=${ eventId }`,
            headers: {
                Authorization: `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json'
            }
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                console.log('res', res);
                dispatch(applicationIsLoading(false))
                dispatch(fetchEventDescriptionList(res.data.files_list))
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                return error
            })
    }
}

export function removeFileAction(id, folderId, eventId, msg) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `files/api/removeFile`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(id) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                if(msg !== 'message'){
                    const message = res.data && res.data && (res.data.message === 'Success' ? 'File deleted successfully' : 'File deleted successfully')
                    triggerNotifier({ type: 'success', message })
                }
                dispatch(applicationIsLoading(false));
                dispatch(getEventDescriptionList(folderId, eventId))
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

export function removeFolderAction(id, eventId) {
    console.log("id", id );
    console.log("eventId", eventId );
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `files/api/removeFolder`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(id) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Folder deleted successfully' : 'Folder deleted successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(applicationIsLoading(false));
                dispatch(getEventFoldersList(eventId))
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

export function removeOrderedFolderAction(data, orderNumber) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `files/api/removeOrderedFolder`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Folder deleted successfully' : 'Folder deleted successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(applicationIsLoading(false));
                dispatch(getUserOrderedFoldersAction(orderNumber))
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

export function removePreOrderFolder(orderId, orderNumber=undefined,  folderName=undefined) {
    let apiUrl;
    let deleteMessage;
    if(folderName === undefined && orderNumber === undefined) {
        apiUrl = REACT_APP_BASE_URL + `files/api/removePreOrderFolder/${ orderId }`
        deleteMessage = 'Order deleted successfully';
    } else {
        apiUrl = REACT_APP_BASE_URL + `files/api/removePreOrderedFolder/${ orderNumber }/${ folderName }`
        deleteMessage = 'Files deleted successfully';
    }
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        // return new Promise((res, rej)=>{
        //     setTimeout(() => {
        //         dispatch(applicationIsLoading(false));
        //         res({})
        //     }, 1500);
        // })
        return axios({
            method: 'delete',
            url: apiUrl,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? deleteMessage : deleteMessage)
                triggerNotifier({ type: 'success', message })
                dispatch(applicationIsLoading(false));
                // dispatch(fetchEventDescriptionList([]));
                // dispatch(getPreOrderListAction());
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

export function updateFolderAction(id, data){
    return(dispatch) => {
        dispatch(applicationIsLoading(true))
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `files/api/updateFolderDetails/${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Folder updated successfully' : 'Folder updated successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(applicationIsLoading(false))
                dispatch(getEventFoldersList())
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                return error
            })
    }
}
export function getFileDetails(id, folderId, eventId){
    return (dispatch) => {
        dispatch(modalIsLoading(true))
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `files/api/getFileDetailsById?file_id=${ id }&event_folder_id=${ folderId }&event_id=${ eventId }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            }
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

export function uploadBulkFiles(data, eventCode, folderName,){
    const event_code =  eventCode !== undefined ? eventCode : " ";
    const folder_name = folderName !== undefined ? folderName : " ";
    return (dispatch) => {
        dispatch(modalIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `admin/api/bulkUpload/file/events/${ event_code }/${ folder_name }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-Type': 'multipart/form-data',
            },
            data: data,
        })
            .then((response) => {
                const res = response.data
                dispatch(modalIsLoading(false));
                dispatch(createFolder(res.data))
                return res;
            })
            .catch((error) => {
                dispatch(modalIsLoading(false));
                return error;
            });
    };
}

export function saveFilesActions(data, eventId) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'files/api/saveFile',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(getEventDescriptionList(data.event_folder_id, eventId))
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Files uploaded successfully' : 'Files uploaded successfully')
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

export function updateFilesAction(data, fileId, folderId, eventId){
    return(dispatch) => {
        dispatch(applicationIsLoading(true))
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `files/api/updateFileDetails/${ fileId }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? 'File updated successfully' : 'File updated successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(applicationIsLoading(false))
                dispatch(getEventDescriptionList(folderId, eventId))
                return res
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false))
                return error
            })
    }
}

export function saveFolderActions(data) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'files/api/addFolder',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(getEventFoldersList(data.event_id))
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Folder uploaded successfully' : 'Folder uploaded successfully')
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

export function uploadBulkFilesByOrderNumber(data, order_number, folder_name, is_folder_upload){
    return (dispatch) => {
        dispatch(modalIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `admin/api/bulkUpload/file/orderfiles/${ order_number }/${ folder_name }/${ is_folder_upload }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-Type': 'multipart/form-data',
            },
            data: data,
        })
            .then((response) => {
                const res = response.data;
                dispatch(modalIsLoading(false));
                return res;
            })
            .catch((error) => {
                // if(error.response.data.statusCode !== 500 && error.response.data.statusCode !== 503 ) {
                //     const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                //     triggerNotifier({ type: 'error', message })
                //     dispatch(modalIsLoading(false));
                // }
                return error;
            });
    };
}

export function uploadBulkFilesByPreOrderNumber(data, order_number){
    return (dispatch) => {
        dispatch(modalIsLoading(true));
        return axios({
            method: 'put',
            url: REACT_APP_BASE_URL + `admin/api/bulkUpload/file/orderfiles/${ order_number }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-Type': 'multipart/form-data',
            },
            data: data
        })
            .then((response) => {
                const res = response.data
                const message = response && response.data && (response.data.statusCode === 200 ? 'File uploaded successfully' : 'File uploaded successfully')
                triggerNotifier({ type: 'success', message })
                dispatch(getOrderFilesByOrderNumberAction(order_number))
                dispatch(modalIsLoading(false));
                return res;
            })
            .catch((error) => {
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                dispatch(modalIsLoading(false));
                return error;
            });
    };
}

export function removeFileByFileIdAction(id, data, folderName) {
    console.log('id, data, folderName', id, data, folderName)
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'delete',
            url: REACT_APP_BASE_URL + `files/api/removeFileByFileId`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(id) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                dispatch(getOrderFilesByOrderNumberAction(data.order_number, folderName))
                const message = res.data && res.data && (res.data.message === 'Success' ? 'File deleted successfully' : 'File deleted successfully')
                triggerNotifier({ type: 'success', message })
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error.response.data;
            });
    };
}

export function getPurchasedFileByFileId(id){
    return (dispatch) => {
        dispatch(modalIsLoading(true))
        return axios({
            method: 'get',
            url: REACT_APP_BASE_URL + `files/api/getPurchasedFileByFileId?file_id=${ id }`,
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            }
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

export function createPreOrderBucketFolderActions(data) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'files/api/createPreOrderBucketFolder',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                const message = res.data && res.data && (res.data.message === 'Success' ? 'Folder created successfully' : 'Folder created successfully')
                triggerNotifier({ type: 'success', message })
                // dispatch(getEventFoldersList(data.event_id))
                return res;
            })
            .catch((error) => {
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}

export function importReportsActions(data) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'orders/api/importKioskOrders',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: data,
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false))
                const message = res.data && res.data && (res.data.message === 'Success' ? 'File uploaded successfully' : 'File uploaded successfully')
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

export function preOrderSendLink(order_number) {
    return (dispatch) => {
        return axios({
            method: 'post',
            url: REACT_APP_BASE_URL + 'files/api/sendPreOrderPurchasedFiles',
            headers: {
                Authorization:  `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc({ order_number }) } },
        })
            .then((response) => {
                console.log(response);
                const message = response && response.data && (response.data.statusCode === 200 ? 'Sent Email and Notification to User Successfully' : 'Sent Email and Notification to User Successfully')
                triggerNotifier({ type: 'success', message })
                return response;
            })
            .catch((error) => {
                const message = error.response && error.response.data && (error.response.data.message || 'Invalid Credentials')
                triggerNotifier({ type: 'error', message })
                return error;
            });
    };
}