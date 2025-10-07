export function isAuthenticated(state = sessionStorage.accessToken ? true : false, action) {
    switch(action.type) {
    case 'IS_AUTHENTICATED':
        return action.isAuthenticated
    default:
        return state;
    }
}

export function isEmailRegistered(state = false, action) {
    switch(action.type) {
    case 'IS_EMAIL_REGISTERED':
        return action.isEmailRegistered
    default:
        return state;
    }
}

export function isOtpVerified(state = false, action) {
    switch(action.type) {
    case 'IS_OTP_VERIFIED':
        return action.isOtpVerified
    default:
        return state;
    }
}