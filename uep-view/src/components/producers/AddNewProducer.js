import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import ErrorMessage from 'shared/ErrorMessage';

function AddNewProducer(props) {
    const { handleClose, isModalVisible, handleSubmit, handleChange, input, inputError } = props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Add Producer"
            buttonCond={ true }
            id='add-producer'
        >
            <div className="add-customer">
                <div className="mt-2">
                    <span className="event-modal-label">Event Producer</span>
                    <div className="event-modal-detail">
                        <input type="text" name="event_producer" value={ input.event_producer } placeholder='Enter Event Producer' onChange={ handleChange } className="form-input"  />
                    </div>
                    {inputError.event_producer && (
                        <ErrorMessage message={ inputError.event_producer || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Event Producer Address</span>
                    <div className="event-modal-detail ml-1">
                        <input type="text" name="producer_address"  value={ input.producer_address }  placeholder='Enter Full Address' onChange={ handleChange } className="form-input"  />
                    </div>
                    {inputError.producer_address && (
                        <ErrorMessage message={ inputError.producer_address || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Contact Name</span>
                    <div className="event-modal-detail ml-1">
                        <input type="text" name="contact_name" value={ input.contact_name } onChange={ handleChange }  placeholder='Enter Full Name'  className="form-input"  />
                    </div>
                    {inputError.contact_name && (
                        <ErrorMessage message={ inputError.contact_name || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Contact Email</span>
                    <div className="event-modal-detail ml-1">
                        <input type="email" name="email_id" value={ input.email_id } onChange={ handleChange }  placeholder='Enter Email'  className="form-input"  />
                    </div>
                    {inputError.email_id && (
                        <ErrorMessage message={ inputError.email_id || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Contact Telephone</span>
                    <div className="event-modal-detail ml-1">
                        <input type="text" maxLength='14' name="phone_number" value={ input.phone_number } onChange={ handleChange }  placeholder='Enter Number' className="form-input"  />
                    </div>
                    {inputError.phone_number && (
                        <ErrorMessage message={ inputError.phone_number || '' } />
                    )}
                </div>
            </div>
        </ModelViewLayoutContainer>
    );
}

AddNewProducer.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleSubmit: PropTypes.func,
    handleChange: PropTypes.func,
    input: PropTypes.object,
    inputError: PropTypes.object,
    id: PropTypes.string
};

export default AddNewProducer;