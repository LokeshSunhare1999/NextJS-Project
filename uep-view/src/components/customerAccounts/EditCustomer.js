import React from 'react'
import PropTypes from 'prop-types'
import 'static/style/event.scss'
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import ErrorMessage from 'shared/ErrorMessage';

function EditCustomer(props) {
    const { handleClose, isModalVisible, handleSubmit, editCustomerInput, handleEditCustomerChange, editCustomerInputError } = props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Edit Customer"
            buttonUpdate= { true }
            id='update-customer'
        >
            <div className="add-customer">
                <div>
                    <span className="event-modal-label">Name</span>
                    <br />
                    <div className="event-modal-detail">
                        <input
                            type="text"
                            className="form-input"
                            name="full_name"
                            placeholder="Enter Full Name"
                            onChange= { handleEditCustomerChange }
                            defaultValue={ editCustomerInput.full_name }
                        />
                    </div>
                    {editCustomerInputError.full_name && (
                        <ErrorMessage message={ editCustomerInputError.full_name || '' } />
                    )}
                </div>
                <div className="pt-3">
                    <span className="event-modal-label">Email</span>
                    <br />
                    <div className="event-modal-detail disabled-field">
                        <input
                            type="email"
                            className="form-input"
                            name="email_id"
                            disabled
                            placeholder="Enter Email"
                            defaultValue={ editCustomerInput.email_id }
                            onChange= { handleEditCustomerChange }
                        />
                    </div>
                    {editCustomerInputError.email_id && (
                        <ErrorMessage message={ editCustomerInputError.email_id || '' } />
                    )}
                </div>
                <div className="pt-3">
                    <span className="event-modal-label">Telephone</span>
                    <br />
                    <div className="event-modal-detail">
                        <input
                            type="text"
                            maxLength='14'
                            className="form-input"
                            name="phone_number"
                            placeholder="Enter Number"
                            value={ editCustomerInput.phone_number }
                            onChange= { handleEditCustomerChange }
                        />
                    </div>
                    {editCustomerInputError.phone_number && (
                        <ErrorMessage message={ editCustomerInputError.phone_number || '' } />
                    )}
                </div>
            </div>
        </ModelViewLayoutContainer>
    )
}

EditCustomer.propTypes = {
    handleClose: PropTypes.func,
    editCustomerInput: PropTypes.object,
    editCustomerInputError: PropTypes.object,
    isModalVisible: PropTypes.func,
    handleSubmit: PropTypes.func,
    handleEditCustomerChange: PropTypes.func,
    id: PropTypes.string
}

export default EditCustomer