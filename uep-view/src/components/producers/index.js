import React from 'react';
import PropTypes from 'prop-types';
import AuthLayoutContainer from 'shared/AuthLayoutContainer';
import ProducerListing from './ProducerListing';

function Producers(props) {
    const { history } = props
    return (
        <AuthLayoutContainer history={ history }>
            <ProducerListing />
        </AuthLayoutContainer>
    )
}
Producers.propTypes = {
    history: PropTypes.object,
};

export default Producers
