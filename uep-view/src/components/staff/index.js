import React from 'react'
import PropTypes from 'prop-types';
import AuthLayoutContainer from 'shared/AuthLayoutContainer'
import StaffListing from './StaffListing';

function Staff(props) {
    const { history } = props
    return (
        <AuthLayoutContainer history={ history }>
            <StaffListing />
        </AuthLayoutContainer>
    )
}
Staff.propTypes = {
    history: PropTypes.object,
};

export default Staff
