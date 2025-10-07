import React from 'react'
import PropTypes from 'prop-types';

function Button(props) {
    const { buttonName, handleSubmit, onClick, className, imageParam, disable } = props
    return (
        <button type="button"  disabled={ disable } className={ className } onClick={ handleSubmit || onClick }>{imageParam}{buttonName}</button>
    )
}

Button.propTypes = {
    buttonName: PropTypes.string,
    imageParam: PropTypes.func,
    handleSubmit: PropTypes.func,
    onClick: PropTypes.func,
    className: PropTypes.string,
    disable: PropTypes.bool
}

export default Button
