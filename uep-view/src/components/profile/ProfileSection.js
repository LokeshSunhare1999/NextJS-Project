import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import ChangePassword from './ChangePassword';
import { addProfileImageAction, getProfileDetails, showProfileSection, updateProfileAction } from 'actions/profileActions';
import ErrorMessage from 'shared/ErrorMessage';

function ProfileSection() {
    const dispatch = useDispatch();
    const [ input, setInput ] = useState({});
    const [ inputError, setInputError ] = useState({});
    const profileDetails = useSelector(state => state.profileDetails)
    useEffect(() => {
        dispatch(getProfileDetails()).then((res) => {
            if (res && res.statusCode === 200) {
                setInput(res.data);
            }
        });
    }, [ dispatch ]);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setInput({ ...input, [ name ]: value });
        setInputError(false)
    };
    const validate = () => {
        const errors = {};
        let isValid = true;
        if (!input.full_name) {
            isValid = false;
            errors.full_name = 'Please enter name';
        }
        if (!input.current_password) {
            isValid = false;
            errors.current_password = 'Please enter current password';
        }
        if (!input.new_password) {
            isValid = false;
            errors.new_password = 'Please enter new password';
        }
        if (!input.confirm_password) {
            isValid = false;
            errors.confirm_password = 'Please confirm password';
        }
        if (
            typeof input.new_password !== 'undefined' &&
            typeof input.confirm_password !== 'undefined'
        ) {
            if (input.new_password !== input.confirm_password) {
                isValid = false;
                errors.confirm_password = 'Password not matched';
            }
        }
        setInputError(errors);

        return isValid;
    };
    const handleUpdate = () => {
        const { full_name, current_password, new_password } = input
        const data = {
            full_name: full_name || '',
            current_password: current_password || '',
            new_password: new_password  || '',
            profile_picture: profileDetails.profile_picture || '',
            is_profile_picture_upload: 0
        }
        if (validate()) {
            dispatch(updateProfileAction(data));
            setInput({})
        }
    };
    const handleBack = () => {
        dispatch(showProfileSection(false))
    }
    const uploadImage = (event) => {
        input[ event.target.name ] = event.target.files[ 0 ];
        var data = new FormData();
        data.append('file', input.profile_picture);
        dispatch(addProfileImageAction(data)).then((res)=>{
            if (res.statusCode === 200 ){
                const newData = {
                    full_name: '',
                    current_password: '',
                    new_password:  '',
                    profile_picture: res.data.file_name.split('/')[ 1 ],
                    is_profile_picture_upload: 1
                }
                dispatch(updateProfileAction(newData));
            }
        })
    }

    const { full_name , profile_picture } = profileDetails
    return (
        <div className="event-main profile-section">
            <div className="page-wrapper">
                <div className="heading col-12">Profile</div>
                <div className="row gx-0 mx-0 mb-5 profile-sub-section">
                    <div className="col-1 upload-photo">
                        <div className="avtar-alignment">
                            <Avatar name={ full_name } round={ true } size={ 90 } src={ profile_picture } />
                        </div>
                        <div className="position-relative">
                            <span className="change-profile"> Change Profile Image</span>
                            <input type='file' name="profile_picture" onChange ={ (event) => uploadImage(event) } className="file-upload" />
                        </div>
                    </div>
                    <div className="col-10 form-input">
                        <form>
                            <div className="row bd-highlight">
                                <div className="col-4">
                                    <div className="bd-highlight">
                                        <label className="text-label">Name</label>
                                        <input
                                            type="text"
                                            name="full_name"
                                            placeholder="Enter Name"
                                            defaultValue={ input.full_name }
                                            onChange={ handleChange }
                                            className="text-input mb-1"
                                        />
                                    </div>
                                    {inputError.email && (
                                        <ErrorMessage message={ inputError.full_name || '' } />
                                    )}
                                </div>
                            </div>
                            <div className="row bd-highlight">
                                <div className="col-4">
                                    <div className="bd-highlight">
                                        <label className="text-label">Email Address</label>
                                        <input
                                            type="email_id"
                                            name="email_id"
                                            disabled
                                            defaultValue={ profileDetails && profileDetails.email_id }
                                            onChange={ handleChange }
                                            className="text-input"
                                        />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                <ChangePassword
                    handleChange={ handleChange }
                    handleUpdate={ handleUpdate }
                    input={ input }
                    inputError={ inputError }
                    handleBack={ handleBack }
                />
            </div>
        </div>
    );
}

export default ProfileSection;
