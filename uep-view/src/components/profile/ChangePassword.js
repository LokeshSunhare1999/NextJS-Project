import React from 'react'
import PropTypes from 'prop-types';
import ErrorMessage from 'shared/ErrorMessage';
import Button from 'shared/Button';

function ChangePassword(props) {
    const { handleChange , input, inputError, handleUpdate, handleBack } = props
    return (
        <>
            <div className="profile-section">
                <span className="heading col-12">Change Password</span>
                <div className="row profile-sub-section m-0">
                    <div className="col-12 form-input">
                        <form>
                            <div className='row'>
                                <div className="col-4">
                                    <label className="text-label w-100">Current Password</label>
                                    <input type="text" placeholder="Enter Current Password" className="text-input" name="current_password" value={ input.current_password || '' } onChange={ handleChange } style = { { width:'323px' } } />
                                    {inputError.current_password && (
                                        <ErrorMessage message={ inputError.current_password || '' } />
                                    )}
                                </div>
                            </div>
                            <div className='row'>
                                <div className="d-flex flex-row">
                                    <div className="d-flex flex-column mt-3">
                                        <label className="text-label">New Password</label>
                                        <input type="text" placeholder="Enter New Password"  className="text-input" name="new_password" value={ input.new_password || '' } onChange={ handleChange } style = { { width:'323px' } }/>
                                        {inputError.new_password && (
                                            <ErrorMessage message={ inputError.new_password || '' } />
                                        )}
                                    </div>
                                    <div className="d-flex flex-column mt-3 ms-5">
                                        <label className="text-label">Confirm Password</label>
                                        <input type="text" placeholder="Enter Confirm Password" className="text-input" name="confirm_password" value={ input.confirm_password || '' } onChange={ handleChange } style = { { width:'323px' } }/>
                                        {inputError.confirm_password && (
                                            <ErrorMessage message={ inputError.confirm_password || '' } />
                                        )}
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                    <div className="btn-card">
                        <Button
                            className="cancel-btn"
                            buttonName="Cancel"
                            handleSubmit ={ handleBack }
                        />
                        <Button
                            className="update-btn"
                            buttonName="Update"
                            handleSubmit={ handleUpdate }
                        />
                    </div>
                </div>
            </div>
        </>
    )
}
ChangePassword.propTypes = {
    handleChange: PropTypes.func,
    input: PropTypes.object,
    inputError: PropTypes.object,
    handleUpdate: PropTypes.func,
    handleBack: PropTypes.func
}

export default ChangePassword
