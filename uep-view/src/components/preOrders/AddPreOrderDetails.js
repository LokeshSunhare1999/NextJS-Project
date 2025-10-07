import React from 'react'
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer'
import ErrorMessage from 'shared/ErrorMessage';

function AddPreOrderDetails(props) {
    const { handleClose, isModalVisible, handleChange, inputError, handleSubmit } = props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Add Pre Order Details"
            id='add-staff'
            buttonCond={ true }
        >
            <div className="add-customer">
                <div className="mt-2">
                    <span className="event-modal-label">Email</span>
                    <div className="event-modal-detail ml-1">
                        <input
                            type="email"
                            name="email_id"
                            placeholder="Enter Email"
                            onChange={ handleChange }
                            className="form-input"
                        />
                    </div>
                    {inputError.email_id && (
                        <ErrorMessage message={ inputError.email_id || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Pre Order Number</span>
                    <div className="event-modal-detail">
                        <input
                            type="text"
                            name="pre_order_number"
                            placeholder="Enter Pre Order Number"
                            onChange={ handleChange }
                            className="form-input"
                        />
                    </div>
                    {inputError.pre_order_number && (
                        <ErrorMessage message={ inputError.pre_order_number || '' } />
                    )}
                </div>
            </div>
        </ModelViewLayoutContainer>
    )
}

AddPreOrderDetails.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleChange: PropTypes.func,
    inputError: PropTypes.object,
    handleSubmit: PropTypes.func,
};

export default AddPreOrderDetails