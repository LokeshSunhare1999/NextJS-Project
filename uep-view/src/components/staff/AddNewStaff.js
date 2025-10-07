import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import 'static/style/customer.scss'
import ErrorMessage from 'shared/ErrorMessage';

function AddNewStaff(props) {
    const { handleClose, isModalVisible, handleSubmit, handleChange, input, inputError } =
    props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Add Staff"
            buttonCond={ true }
            id='add-staff'
        >
            <div className="add-customer">
                <div className="mt-2">
                    <span className="event-modal-label">Name</span>
                    <div className="event-modal-detail">
                        <input type="text" name="full_name" placeholder="Enter Full Name" value={ input.full_name } onChange={ handleChange } className="form-input" />
                    </div>
                    {inputError.full_name && (
                        <ErrorMessage message={ inputError.full_name || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Email</span>
                    <div className="event-modal-detail ml-1">
                        <input type="email" name="email_id" placeholder="Enter Email" value={ input.email_id } onChange={ handleChange } className="form-input" />
                    </div>
                    {inputError.email_id && (
                        <ErrorMessage message={ inputError.email_id || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Telephone</span>
                    <div className="event-modal-detail ml-1">
                        <input type="text" maxLength='14' name="phone_number" placeholder="Enter Number" value={ input.phone_number } onChange={ handleChange } className="form-input" />
                    </div>
                    {inputError.phone_number && (
                        <ErrorMessage message={ inputError.phone_number || '' } />
                    )}
                </div>
                <div className="mt-2 position-relative">
                    <span className="event-modal-label">Account Type</span>
                    <select
                        className="form-control header_drop_down position-relative acc-type-dropdown pointer"
                        name="user_role"
                        onChange={ handleChange }
                        required
                    >
                        <option name="event_producer" value="" disabled selected >
                            Select Account Type
                        </option>
                        <option name="user_role" value="0">
                            Admin
                        </option>
                        <option name="user_role" value="2">
                            Manager
                        </option>
                        <option name="user_role" value="3">
                            Staff
                        </option>
                    </select>
                </div>
                {inputError.user_role && (
                    <ErrorMessage message={ inputError.user_role || '' } />
                )}
            </div>
        </ModelViewLayoutContainer>
    );
}

AddNewStaff.propTypes = {
    handleClose: PropTypes.func,
    handleChange: PropTypes.func,
    input: PropTypes.object,
    inputError: PropTypes.object,
    isModalVisible: PropTypes.bool,
    handleSubmit: PropTypes.func,
    id: PropTypes.string
};

export default AddNewStaff;