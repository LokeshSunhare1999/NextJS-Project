export function fileList(state = [], action) {
    switch(action.type){
    case 'FETCH_FILE_LISTING':
        return action.fileList
    default:
        return state;
    }
}

export function folderList(state = [], action) {
    switch(action.type){
    case 'FETCH_EVENT_FOLDER_LIST':
        return action.folderList
    default:
        return state
    }
}

export function preOrderFolderList(state = [], action) {
    switch(action.type){
    case 'FETCH_PRE_ORDER_EVENT_FOLDER_LIST':
        return action.preOrderFolderList
    default:
        return state
    }
}

export function eventDesc(state = [], action) {
    switch(action.type){
    case 'FETCH_EVENT_DESCRIPTION_LIST':
        return action.eventDesc
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

export function stateDetails(state = [], action) {
    switch(action.type){
    case 'CLEAR_DETAILS_FROM_REDUX':
        return action.fileDetails
    default:
        return state
    }
}
