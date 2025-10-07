import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import PropTypes from 'prop-types';
import uepLogo from 'static/images/UepLogo.png';
import Notifications from './Notifications';
import { getProfileDetails } from 'actions/profileActions';
import DropdownIcon from 'static/images/svg/sort-down.svg';
import { adminLogoutAction } from 'actions/authActions';
import DeleteEventModal from 'shared/DeleteEventModal';
import 'static/style/dashboard.scss';
import { getNotificationDetails, removeNotification } from 'actions/notificationAction';

function DashboardHeader(props) {
    const { history } = props
    const dispatch = useDispatch();
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false);
    const profileDetails = useSelector(state => state.profileDetails)
    const userRole = useSelector((state) => {
        const role = state.profileDetails.user_role;
        if(role == 0){
            return 'Admin';
        } else if( role == 1){
            return 'Customer';
        } else if( role == 2){
            return 'Manager';
        } else {
            return 'Staff';
        }
    })
    useEffect(() => {
        dispatch(getProfileDetails())
    }, [ dispatch ]);
    const OpenProfile = () => {
        history.push('/profile')
    };
    const handleLogout = () => {
        setIsConfirmDelete(!isConfirmDelete);
        dispatch(adminLogoutAction(history))
    }
    const confirmDeleteFunc = () => {
        setIsConfirmDelete(!isConfirmDelete);
    };
    const getNotification = () => {
        dispatch(getNotificationDetails())
    };
    const removeAllNotification = () => {
        dispatch(removeNotification())
    };
    const { full_name , profile_picture } = profileDetails
    return (
        <div className="dashboard-header container">
            <nav className="navbar navbar-expand-lg auth-header fixed-top d-md-flex flex-wrap justify-content-between">
                <div className="container">
                    <div>
                        <a href className="navbar-brand">
                            <img
                                src={ uepLogo }
                                alt="logo"
                                className="uep-auth-logo"
                            />
                        </a>
                    </div>
                    <div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Notifications
                                getNotification = { getNotification }
                                removeAllNotification = { removeAllNotification }
                            />
                            <div className="dropdown d-flex align-items-center ms-4 update-profile-dropdown">
                                <div className="user me-3">
                                    <Avatar name={ full_name } size="36" round={ true } className="user_img" src={ profile_picture } />
                                </div>
                                <div className="d-block mt-3 bd-highlight me-2" style={ { height: '50px' } }>
                                    <div className="bd-highlight">
                                        <p className="profile-name"> {full_name} </p>
                                    </div>
                                    <div className="bd-highlight">
                                        {' '}
                                        <p className="profile-role"> {userRole} </p>
                                    </div>
                                </div>
                                <img
                                    src={ DropdownIcon }
                                    alt=""
                                    id="dropdownMenuButton1"
                                    data-bs-toggle="dropdown"
                                    className="mx-2 drop-arrow"
                                />
                                <ul
                                    className="dropdown-menu dropdown-menu-end p-2 profile-dropdown"
                                    aria-labelledby="dropdownMenuButton1"
                                >
                                    <li>
                                        <a href
                                            className="dropdown-item py-2 m-0 px-1"
                                            onClick={ () => OpenProfile() }
                                        >
                                            Update Profile
                                        </a>
                                    </li>
                                    <hr className="my-1 mx-0" />
                                    <li>
                                        <a href className="dropdown-item py-2 m-0 px-1" onClick={ () => confirmDeleteFunc() }>
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            {isConfirmDelete && (
                <DeleteEventModal
                    isModalVisible={ isConfirmDelete }
                    handleClose={ confirmDeleteFunc }
                    handleSubmit={ handleLogout }
                    isLogoutFlag = { true }
                />
            )}
        </div>
    );
}
DashboardHeader.propTypes = {
    history: PropTypes.object,
};
export default DashboardHeader;