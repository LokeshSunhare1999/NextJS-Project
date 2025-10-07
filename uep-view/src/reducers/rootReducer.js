import { combineReducers } from 'redux';
import { isAuthenticated, isEmailRegistered, isOtpVerified } from './authReducer'
import { applicationIsLoading, modalIsLoading, sendFilesIsLoading,orderSectionIsLoading, orderIsLoading } from './commonReducer'
import { showProfileSection, successProfileUpdate, profileDetails } from './profileReducer'
import { eventList, eventDetails, teamDetails } from './eventReducer'
import { producerList, producerProfileDetails } from './producerReducer'
import { staffList } from './staffReducer'
import { cusAccountList, orderHistory } from './customerReducer'
import { fileList, folderList, preOrderFolderList, eventDesc, fileDetails } from './fileReducer'
import { orderList, orderDetails, orderFolderDetails, orderInvoiceDetails } from './orderReducer';
import { dashboardData, notificationData, visualReportsData, SalesReport } from './reportReducer';
import { zendeskDetails } from './zendeskReducer';

export default combineReducers({
    orderIsLoading,
    applicationIsLoading,
    modalIsLoading,
    sendFilesIsLoading,
    orderSectionIsLoading,
    cusAccountList,
    orderHistory,
    dashboardData,
    notificationData,
    eventList,
    eventDetails,
    isAuthenticated,
    isEmailRegistered,
    isOtpVerified,
    isProfileSection : showProfileSection,
    producerList,
    producerProfileDetails,
    profileDetails,
    staffList,
    successProfileUpdate,
    teamDetails,
    fileList,
    folderList,
    preOrderFolderList,
    eventDesc,
    fileDetails,
    orderList,
    orderDetails,
    orderFolderDetails,
    orderInvoiceDetails,
    visualReportsData,
    zendeskDetails,
    SalesReport
});
