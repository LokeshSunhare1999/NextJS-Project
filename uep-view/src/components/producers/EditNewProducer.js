import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import ErrorMessage from 'shared/ErrorMessage';

function EditNewProducer(props) {
    const {
        handleClose,
        isModalVisible,
        handleSubmit,
        editProducerInput,
        handleChange,
        inputError
    } = props;
    const {
        contact_name,
        email_id,
        event_producer,
        phone_number,
        producer_address,
    } = editProducerInput;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Edit Producer"
            buttonCond={ true }
            id="update-producer"
        >
            <div className="add-customer">
                <div className="mt-2">
                    <span className="event-modal-label">Event Producer</span>
                    <div className="event-modal-detail">
                        <input
                            type="text"
                            name="event_producer"
                            defaultValue={ event_producer }
                            onChange={ handleChange }
                            placeholder="Enter Event Producer"
                            className="form-input"
                        />
                    </div>
                    {inputError.event_producer && (
                        <ErrorMessage message={ inputError.event_producer || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Event Producer Address</span>
                    <div className="event-modal-detail ml-1">
                        <input
                            type="text"
                            name="producer_address"
                            defaultValue={ producer_address }
                            placeholder="Enter Full Address"
                            className="form-input"
                            onChange={ handleChange }
                        />
                    </div>
                    {inputError.producer_address && (
                        <ErrorMessage message={ inputError.producer_address || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Contact Name</span>
                    <div className="event-modal-detail ml-1">
                        <input
                            type="text"
                            name="contact_name"
                            defaultValue={ contact_name }
                            placeholder="Enter Full Name"
                            className="form-input"
                            onChange={ handleChange }
                        />
                    </div>
                    {inputError.contact_name && (
                        <ErrorMessage message={ inputError.contact_name || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Contact Email</span>
                    <div className="event-modal-detail ml-1">
                        <input
                            type="email"
                            name="email_id"
                            defaultValue={ email_id }
                            placeholder="Enter Email"
                            className="form-input"
                            onChange={ handleChange }
                        />
                    </div>
                    {inputError.email_id && (
                        <ErrorMessage message={ inputError.email_id || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Contact Telephone</span>
                    <div className="event-modal-detail ml-1">
                        <input
                            type="text"
                            maxLength="12"
                            className="form-input"
                            name="phone_number"
                            placeholder="Enter Number"
                            value={ phone_number }
                            onChange={ handleChange }
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

EditNewProducer.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleSubmit: PropTypes.func,
    handleChange: PropTypes.func,
    editProducerInput: PropTypes.object,
    inputError: PropTypes.object,
    id: PropTypes.string,
};

export default EditNewProducer;