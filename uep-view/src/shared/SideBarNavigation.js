import React from 'react';
import { useState } from 'react'
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import { showProfileSection } from 'actions/profileActions';
import ImportReport from 'components/files/ImportReport';

function SideBarNavigation(props) {
    const { history , reviveOrderState, isOrderListing } = props
    console.log('history????', history);
    const dispatch = useDispatch()
    const [ isNewFolder, setNewFolder ] = useState(false);
    const [ isSelected, setIsSelected ] = useState(false);
    const userRole = useSelector((state) => {
        return  state.profileDetails.user_role;
    });
    const handleReports = () => {
        dispatch(showProfileSection(false))
        history.push('/reports')
    }
    const pathUrl = window.location.pathname
    const addFolderFunc = () => {
        setNewFolder(!isNewFolder);
    }
    const handlePath = (path) => {
        history.push(path);
    }
    const handleClose = () => {
        setNewFolder(false);
        setIsSelected(false);
        handlePath('/orders');
    }
    return (
        <div className="nav-left-sidebar sidebar-dark admin-dashboard">
            <div className="menu-list">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className=" navbar-collapse" id="navbarNav">
                        <ul className="navbar-nav flex-column">
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handleReports() }
                                    className = { pathUrl === '/reports' ? 'active nav-link d-flex align-items-center colored-img reports-color' : 'nav-link d-flex align-items-center colored-img reports-color' } >
                                    <span className="sidebar_icon black-img reports-BW"></span>
                                    <label className="pointer">Reports</label>
                                </a>
                            </li>
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handlePath('/files') }
                                    className = { pathUrl === '/files' ? 'active nav-link d-flex align-items-center colored-img files-color' : 'nav-link d-flex align-items-center colored-img files-color' } >
                                    <span className="sidebar_icon black-img files-BW"></span>
                                    <label className="pointer">Files</label>
                                </a>
                            </li>
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handlePath('/events') }
                                    className = { pathUrl === '/events' ? 'active nav-link d-flex align-items-center colored-img events-color' : 'nav-link d-flex align-items-center colored-img events-color' } >
                                    <span className="sidebar_icon black-img events-BW"></span>
                                    <label className="pointer">Events</label>
                                </a>
                            </li>
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handlePath('/customer-accounts') }
                                    className = { pathUrl === '/customer-accounts' ? 'active nav-link d-flex align-items-center colored-img customer-color' : 'nav-link d-flex align-items-center colored-img customer-color' } >
                                    <span className="sidebar_icon black-img customer-BW"></span>
                                    <label className="pointer">Customer Accounts</label>
                                </a>
                            </li>
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handlePath('/staff') }
                                    className = { pathUrl === '/staff' ? 'active nav-link d-flex align-items-center colored-img staff-color' : 'nav-link d-flex align-items-center colored-img staff-color' } >
                                    <span className="sidebar_icon black-img staff-BW"></span>
                                    <label className="pointer">Staff</label>
                                </a>
                            </li>
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handlePath('/producers') }
                                    className = { pathUrl === '/producers' ? 'active nav-link d-flex align-items-center colored-img producer-color' : 'nav-link d-flex align-items-center colored-img producer-color' } >
                                    <span className="sidebar_icon black-img producer-BW"></span>
                                    <label className="pointer">Producers</label>
                                </a>
                            </li>
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  () =>  (pathUrl === '/orders' && !isOrderListing) ? reviveOrderState() : handlePath('/orders') }
                                    className = { pathUrl === '/orders' ? 'active nav-link d-flex align-items-center colored-img order-color' : 'nav-link d-flex align-items-center colored-img order-color' } >
                                    <span className="sidebar_icon black-img order-BW"></span>
                                    <label className="pointer">Orders</label>
                                </a>
                            </li>
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handlePath('/preorders') }
                                    className = { pathUrl === '/preorders' ? 'active nav-link d-flex align-items-center colored-img order-color' : 'nav-link d-flex align-items-center colored-img order-color' } >
                                    <span className="sidebar_icon black-img order-BW"></span>
                                    <label className="pointer">Pre Order</label>
                                </a>
                            </li>
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handlePath('/order-scanner') }
                                    className = { pathUrl === '/order-scanner' ? 'active nav-link d-flex align-items-center colored-img order-color' : 'nav-link d-flex align-items-center colored-img order-color' } >
                                    <span className="sidebar_icon black-img order-BW"></span>
                                    <label className="pointer">Order Scanner</label>
                                </a>
                            </li>
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handlePath('/zendesk-chat') }
                                    className = { pathUrl === '/zendesk-chat' ? 'active nav-link d-flex align-items-center colored-img zendesk-color' : 'nav-link d-flex align-items-center colored-img zendesk-color' } >
                                    <span className="sidebar_icon black-img zendesk-BW"></span>
                                    <label className="pointer">Zendesk Chat</label>
                                </a>
                            </li>
                            {userRole === 0 &&
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>handlePath('/report') }
                                    className = { pathUrl === '/report' ? 'active nav-link d-flex align-items-center colored-img sales-report-color' : 'nav-link d-flex align-items-center colored-img sales-report-color' } >
                                    <span className="sidebar_icon black-img sales-report-BW"></span>
                                    <label className="pointer">Sales Reports</label>
                                </a>
                            </li>}
                            <li className="nav-item text-left">
                                <a href
                                    onClick={  ()=>addFolderFunc() }
                                    className = { isNewFolder ? 'active nav-link d-flex align-items-center colored-img import-file-icon-color' : 'nav-link d-flex align-items-center colored-img import-file-icon-color' } >
                                    <span className="sidebar_icon_import black-img import-file-icon-BW"></span>
                                    <label className="pointer">Import Orders</label>
                                </a>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
            { isNewFolder && (
                <ImportReport
                    isModalVisible={ isNewFolder }
                    handleClose={ handleClose }
                    isSelected={ isSelected }
                    setIsSelected={ setIsSelected }
                />
            )}
        </div>
    )
}
SideBarNavigation.propTypes = {
    history: PropTypes.object,
    reviveOrderState: PropTypes.func,
    isOrderListing: PropTypes.bool,
};

export default SideBarNavigation
