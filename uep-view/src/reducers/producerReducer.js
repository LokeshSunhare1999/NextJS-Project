export function producerList(state = [], action) {
    switch(action.type) {
    case 'FETCH_PRODUCERS_LISTING':
        return action.producerList
    default:
        return state;
    }
}
export function producerProfileDetails(state = [], action) {
    switch(action.type) {
    case 'FETCH_PRODUCERS_PROFILE_DETAILS':
        return action.producerProfileDetails
    default:
        return state;
    }
}