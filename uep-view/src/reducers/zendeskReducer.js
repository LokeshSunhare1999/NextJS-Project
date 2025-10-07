export function zendeskDetails(state = [], action) {
    switch(action.type) {
    case 'FETCH_ZENDESK_DETAILS':
        return action.zendeskDetails
    default:
        return state;
    }
}
