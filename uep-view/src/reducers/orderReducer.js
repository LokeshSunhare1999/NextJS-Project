export function orderList(state = [], action){
    switch(action.type){
    case 'FETCH_ORDER_LIST':
        return action.orderList
    default:
        return state
    }
}
export function orderDetails(state = [], action){
    switch(action.type){
    case 'FETCH_ORDER_DETAILS':
        return action.orderDetails
    case 'FETCH_ORDER_DETAILS_EMPTY':
        return {
            ...state,
            orderDetails: {},
            event_packages: []
        };
    default:
        return state
    }
}
export function fileDetails(state = [], action) {
    switch(action.type){
    case 'FETCH_FILE_DETAILS':
        return action.fileDetails
    default:
        return state
    }
}
export function orderFolderDetails(state = [], action) {
    switch(action.type){
    case 'FETCH_ORDER_FOLDER_DETAILS':
        return action.orderFolderDetails
    default:
        return state
    }
}
export function orderInvoiceDetails(state = [], action) {
    switch(action.type){
    case 'FETCH_ORDER_INVOICE_DETAILS':
        return action.orderInvoiceDetails
    default:
        return state
    }
}