import React from 'react'
import PropTypes from 'prop-types';
import DashboardHeader from 'components/dashboard/DashboardHeader';
import SideBarNavigation from 'shared/SideBarNavigation';

const AuthLayoutContainer = ({
    children,
    history,
    handleClose,
    isOrderListing
}) => {
    return (
        <>
            <div className="dashboard-main-wrapper admin-dashboard">
                <DashboardHeader history={ history } />
                <SideBarNavigation history={ history } reviveOrderState = { handleClose } isOrderListing = { isOrderListing } />
                {children}
            </div>
        </>
    )
}
AuthLayoutContainer.propTypes = {
    children: PropTypes.object,
    isOrderListing: PropTypes.bool,
    history: PropTypes.object,
    handleClose: PropTypes.func,
};

export default AuthLayoutContainer
