export function staffList(state = [], action) {
    switch(action.type) {
    case 'FETCH_STAFF_LISTING':
        return action.staffList
    default:
        return state;
    }
}