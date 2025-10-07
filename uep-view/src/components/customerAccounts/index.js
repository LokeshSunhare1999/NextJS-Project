import React from 'react'
import PropTypes from 'prop-types';
import AuthLayoutContainer from 'shared/AuthLayoutContainer';
import CustomerAccountsListing from './CustomerAccountsListing';
function CustomerAccounts(props) {
    const { history } = props
    return (
        <AuthLayoutContainer history={ history }>
            <CustomerAccountsListing />
        </AuthLayoutContainer>
    )
}

CustomerAccounts.propTypes = {
    history: PropTypes.object,
};

export default CustomerAccounts
