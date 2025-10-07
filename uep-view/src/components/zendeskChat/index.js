import React from 'react'
import PropTypes from 'prop-types';
import AuthLayoutContainer from 'shared/AuthLayoutContainer'
import ZendeskList from './ZendeskList';

function Staff(props) {
    const { history } = props
    return (
        <AuthLayoutContainer history={ history }>
            <ZendeskList />
        </AuthLayoutContainer>
    )
}
Staff.propTypes = {
    history: PropTypes.object,
};

export default Staff