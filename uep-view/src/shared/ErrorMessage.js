import React from 'react'
import PropTypes from 'prop-types';

function ErrorMessage(props) {
    const { message } = props
    return (
        <div className="text-danger mb-1 mt-1 font13 text-left">
            {message}
        </div>
    )
}
ErrorMessage.propTypes = {
    message: PropTypes.string,
};

export default ErrorMessage
