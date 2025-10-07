export function cusAccountList(state = [], action) {
    switch(action.type) {
    case 'FETCH_CUSTOMER_ACCOUNT_LISTING':
        return action.cusAccountList
    default:
        return state;
    }
}

export function orderHistory(state = [], action) {
    switch(action.type) {
    case 'FETCH_ORDER_HISTORY':
        return action.orderHistory
    default:
        return state;
    }
}
