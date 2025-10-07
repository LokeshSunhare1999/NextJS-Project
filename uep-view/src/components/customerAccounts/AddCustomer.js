import React from 'react';
import PropTypes from 'prop-types';
import 'static/style/customer.scss';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import ErrorMessage from 'shared/ErrorMessage';

function AddCustomer(props) {
    const { handleClose, isModalVisible, handleSubmit, handleChange, input, inputError } =
    props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Add Customer"
            buttonCond={ true }
            id='add-customer'
        >
            <div className="add-customer">
                <div>
                    <span className="event-modal-label">Name</span>
                    <div className="event-modal-detail">
                        <input
                            type="text"
                            className="form-input"
                            name="full_name"
                            onChange={ handleChange }
                            value={ input.full_name }
                            placeholder="Enter Full Name"
                        />
                    </div>
                    {inputError.full_name && (
                        <ErrorMessage message={ inputError.full_name || '' } />
                    )}
                </div>
                <div className="pt-3">
                    <span className="event-modal-label">Email</span>
                    <br />
                    <div className="event-modal-detail">
                        <input
                            type="email"
                            className="form-input"
                            name="email_id"
                            onChange={ handleChange }
                            value={ input.email_id }
                            placeholder="Enter Email"
                        />
                    </div>
                    {inputError.email_id && (
                        <ErrorMessage message={ inputError.email_id || '' } />
                    )}
                </div>
                <div className="pt-3">
                    <span className="event-modal-label">Telephone</span>
                    <br />
                    <div className="event-modal-detail">
                        <input
                            type="text"
                            className="form-input"
                            onChange={ handleChange }
                            name="phone_number"
                            value={ input.phone_number }
                            placeholder="Enter Number"
                            maxLength='14'
                        />
                    </div>
                    {inputError.phone_number && (
                        <ErrorMessage message={ inputError.phone_number || '' } />
                    )}
                </div>
            </div>
        </ModelViewLayoutContainer>
    );
}

AddCustomer.propTypes = {
    handleClose: PropTypes.func,
    handleChange: PropTypes.func,
    isModalVisible: PropTypes.func,
    handleSubmit: PropTypes.func,
    input: PropTypes.object,
    inputError: PropTypes.object,
    id: PropTypes.string
};

export default AddCustomer;