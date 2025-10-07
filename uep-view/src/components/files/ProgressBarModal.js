/* eslint-disable eqeqeq */
import React from 'react'
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';

function ProgressBarModal(props) {
    const { progressPercentage, handleClose, isModalVisible, showDeleteText } = props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            id="progress-bar"
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Please do not close or refresh the page.</h5>
                        <p className="modal-title">{showDeleteText === true ? "Deletion" : "Uploading"} will be continue in the background, Incase you close the progress bar.</p>
                    </div>
                    <div className="modal-body">
                        <div className="progress" style={ { height: '20px' } }>
                            <div className="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" style={ { backgroundColor: '#FC13C4', width: `${ progressPercentage }%` } } aria-valuenow="25" aria-valuemin="0" aria-valuemax="100">{ progressPercentage == 100 ? `${ progressPercentage }%` : '' }</div>
                        </div>
                    </div>
                </div>
            </div>
        </ModelViewLayoutContainer>
    )
}

ProgressBarModal.propTypes = {
    progressPercentage: PropTypes.number,
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
}

export default ProgressBarModal