import React from 'react';
import PropTypes from 'prop-types';
import ProfileSection from 'components/profile';
import 'static/style/dashboard.scss';
import AuthLayoutContainer from 'shared/AuthLayoutContainer';
function AdminDashboard(props) {
    return (
        <AuthLayoutContainer history ={ props.history }>
            <ProfileSection history = { props.history } />
        </AuthLayoutContainer>
    );
}

AdminDashboard.propTypes = {
    isOpen: PropTypes.bool,
    history: PropTypes.object,
};

export default AdminDashboard;
