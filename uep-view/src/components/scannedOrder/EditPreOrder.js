import React from 'react'
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer'
import ErrorMessage from 'shared/ErrorMessage';

function EditPreOrder(props) {
    const { handleClose, isModalVisible, handleSubmit, editPreOrderInput, uniqueTeamNameList, inputError, handleChange } = props;
    const { event_code, event_producer, event_name, full_name, folder_name } = editPreOrderInput

    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Edit Pre Order"
            id='edit-pre-order'
            buttonUpdate={ true }
        >
            <div className="add-customer">
                <div className="mt-2">
                    <span className="event-modal-label">Event Code</span>
                    <div className="event-modal-detail">
                        <input type="text" name="event_code" autoComplete="off" placeholder='Enter Event Code' className="form-input" defaultValue={ event_code } onChange ={ handleChange } />
                    </div>
                    {inputError.event_code && (
                        <ErrorMessage message={ inputError.event_code || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Event Producer</span>
                    <div className="event-modal-detail">
                        <input type="text" name="event_producer" autoComplete="off" placeholder='Enter Event Producer' className="form-input" defaultValue={ event_producer } onChange ={ handleChange } />
                    </div>
                    {inputError.event_producer && (
                        <ErrorMessage message={ inputError.event_producer || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Event Name</span>
                    <div className="event-modal-detail">
                        <input type="text" name="event_name" autoComplete="off" placeholder='Enter Event Name' className="form-input" defaultValue= { event_name } onChange ={ handleChange } />
                    </div>
                    {inputError.event_name && (
                        <ErrorMessage message={ inputError.event_name || '' } />
                    )}
                </div>
                <div className="mt-2">
                    <span className="event-modal-label">Customer Name</span>
                    <div className="event-modal-detail">
                        <input type="text" name="full_name" autoComplete="off" placeholder='Enter Customer Name' className="form-input" defaultValue={ full_name } onChange ={ handleChange } />
                    </div>
                    {inputError.full_name && (
                        <ErrorMessage message={ inputError.full_name || '' } />
                    )}
                </div>
                <div className="mt-2 position-relative">
                    <span className="event-modal-label">Team Name</span>
                    <select
                        className="form-control header_drop_down position-relative acc-type-dropdown pointer"
                        name="team_name"
                        onChange ={ handleChange }
                    >
                        <option name="team_name" value={ folder_name } defaultValue={ folder_name } > { folder_name }</option>
                        { uniqueTeamNameList }
                    </select>
                    {inputError.team_name && (
                        <ErrorMessage message={ inputError.team_name || '' } />
                    )}
                </div>
            </div>
        </ModelViewLayoutContainer>
    )
}

EditPreOrder.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleSubmit: PropTypes.func,
    editPreOrderInput: PropTypes.object,
    uniqueTeamNameList:PropTypes.array,
    inputError: PropTypes.object,
    handleChange: PropTypes.func
}

export default EditPreOrder
