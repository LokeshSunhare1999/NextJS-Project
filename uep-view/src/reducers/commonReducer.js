export function applicationIsLoading(state = false, action) {
    switch (action.type) {
    case 'APPLICATION_IS_LOADING':
        return action.isLoading;
    default:
        return state;
    }
}

export function orderIsLoading(state = false, action) {
    switch (action.type) {
    case 'ORDER_IS_LOADING':
        return action.isLoading;
    default:
        return state;
    }
}

export function orderSectionIsLoading(state = false, action) {
    switch (action.type) {
    case 'ORDER_SECTION_IS_LOADING':
        return action.isLoading;
    default:
        return state;
    }
}

export function modalIsLoading(state = false, action) {
    switch (action.type) {
    case 'MODAL_IS_LOADING':
        return action.isLoading;
    default:
        return state;
    }
}

export function sendFilesIsLoading(state = false, action) {
    switch (action.type) {
    case 'SEND_FILES_IS_LOADING':
        return action.isLoading;
    default:
        return state;
    }
}