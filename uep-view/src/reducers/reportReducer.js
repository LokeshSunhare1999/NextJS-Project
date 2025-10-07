export function dashboardData(state = [], action) {
    switch(action.type) {
    case 'FETCH_REPORTS_DETAILS':
        return action.dashboardData
    default:
        return state;
    }
}

export function notificationData(state = [], action) {
    switch(action.type) {
    case 'FETCH_NOTIFICATION_DETAILS':
        return action.notificationData
    default:
        return state;
    }
}

export function visualReportsData(state = [], action) {
    switch(action.type) {
    case 'FETCH_VISUAL_REPORTS_DETAILS':
        return action.visualReportsData
    default:
        return state;
    }
}

export function SalesReport(state = [], action) {
    switch(action.type) {
    case 'FETCH_SALES_REPORT':
        return action.SalesReport
    default:
        return state;
    }
}