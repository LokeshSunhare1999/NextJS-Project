import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import 'static/style/customer.scss'
import ErrorMessage from 'shared/ErrorMessage';
import { useSelector } from 'react-redux';

function EditStaff(props) {
    const { handleClose, isModalVisible, handleSubmit, handleChange , editStaffInput, inputError } = props;
    const { full_name, email_id, user_role, phone_number } = editStaffInput
    const showAccountType = (role) => {
        return role === 0 ? 'Admin' : role === 2 ? 'Manager' : 'Staff';
    };
    const isLoading = useSelector((state) => state.modalIsLoading);
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Edit Staff"
            buttonCond={ true }
            id='update-staff'
        >
            <div className="add-customer">
                <div className="mt-2">
                    <span className="event-modal-label">Name</span>
                    <div className="event-modal-detail">
                        <input type="text" className="form-input" placeholder="Enter Full Name" name="full_name" defaultValue={ full_name } onChange ={ handleChange } />
                    </div>
                    {inputError.full_name && (
                        <ErrorMessage message={ inputError.full_name || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Email</span>
                    <div className="event-modal-detail ml-1">
                        <input type="email" className="form-input" placeholder="Enter Email" name="email_id" defaultValue={ email_id } onChange ={ handleChange } />
                    </div>
                    {inputError.email_id && (
                        <ErrorMessage message={ inputError.email_id || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Telephone</span>
                    <div className="event-modal-detail ml-1">
                        <input
                            type="text"
                            maxLength='14'
                            className="form-input"
                            name="phone_number"
                            placeholder="Enter Number"
                            value={ phone_number }
                            onChange= { handleChange }
                        />
                    </div>
                    {inputError.phone_number && (
                        <ErrorMessage message={ inputError.phone_number || '' } />
                    )}
                </div>
                <div className="mt-2 position-relative">
                    <span className="event-modal-label">Account Type</span>
                    <select
                        className="form-control header_drop_down acc-type-dropdown pointer"
                        name="user_role"
                        onChange={ handleChange }
                    >
                        <option name="user_role" selected={ showAccountType(user_role) }> {showAccountType(user_role)}</option>
                        {
                            isLoading &&
                            <option name="event_producer" value="" disabled selected>
                                Select account type
                            </option>
                        }
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

EditStaff.propTypes = {
    handleClose: PropTypes.func,
    handleChange: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleSubmit: PropTypes.func,
    editStaffInput: PropTypes.object,
    inputError: PropTypes.object,
    id: PropTypes.string
};

export default EditStaff;