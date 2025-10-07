export function eventList(state = [], action) {
    switch(action.type) {
    case 'FETCH_EVENT_LISTING':
        return action.eventList
    default:
        return state;
    }
}
export function eventDetails(state = [], action) {
    switch(action.type) {
    case 'FETCH_EVENT_DETAILS':
        return action.eventDetails
    default:
        return state;
    }
}

export function teamDetails(state = [], action) {
    switch(action.type) {
    case 'SAVE_TEAM_DETAILS':
        return action.teamDetails
    default:
        return state;
    }
}
