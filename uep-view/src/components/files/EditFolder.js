import React from 'react'
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer'
import ErrorMessage from 'shared/ErrorMessage';

function EditFolder(props) {
    const { handleClose, isModalVisible, handleChange, handleSubmit, editFolderInfo, inputFolderNameError } = props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Edit Folder"
            id='edit-folder'
            buttonUpload={ true }
        >
            <div className="edit-folder">
                <div className="mt-2">
                    <span className="modal-label">Folder Name</span>
                    <div className="inputfield">
                        <input
                            type="text"
                            name="full_name"
                            placeholder="Enter Folder Name"
                            className="form-input"
                            onChange={ handleChange }
                            defaultValue={ editFolderInfo }
                        />
                    </div>
                    {inputFolderNameError.editFolderInfo && (
                        <ErrorMessage message={ inputFolderNameError.editFolderInfo || '' } />
                    )}
                </div>
            </div>
        </ModelViewLayoutContainer>
    )
}

EditFolder.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleChange: PropTypes.func,
    handleSubmit: PropTypes.func,
    editFolderInfo: PropTypes.string,
    inputFolderNameError: PropTypes.object
}

export default EditFolder
