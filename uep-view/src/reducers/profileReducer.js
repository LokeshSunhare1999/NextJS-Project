export function showProfileSection(state = false, action) {
    switch(action.type) {
    case 'SHOW_PROFILE_SECTION':
        return action.showProfileSection
    default:
        return state;
    }
}
export function successProfileUpdate(state = false, action) {
    switch(action.type) {
    case 'FETCH_SUCCESS_PROFILE_UPDATE':
        return action.successProfileUpdate
    default:
        return state;
    }
}
export function profileDetails(state = [], action) {
    switch(action.type) {
    case 'FETCH_PROFILE_DETAILS':
        return action.profileDetails
    default:
        return state;
    }
}