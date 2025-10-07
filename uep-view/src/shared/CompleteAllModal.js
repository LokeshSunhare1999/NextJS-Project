import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import '../static/style/event.scss';
import { ReactComponent as CompletedIcon } from '../static/images/svg/Completed.svg';
import { ReactComponent as PendingIcon } from '../static/images/svg/Pending.svg';

function CompleteEventModal(props) {
    const { handleClose, isModalVisible, handleSubmit, isCompleted } = props;

    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title=""
            buttonCond={ true }
            buttonName1="No"
            buttonName2="Yes"
            buttonDeleteAll={ true }
            className="delete-modal"
            id="delete-modal"
        >
            <div className="text-center">
                {isCompleted ? (
                    <CompletedIcon
                        className="pt-1"
                        style={ { fontSize: 60, fill: '#28a745' } }
                    />
                ) : (
                    <PendingIcon
                        className="pt-1"
                        style={ { fontSize: 60, fill: '#ffc107' } }
                    />
                )}
                <p className="pt-2">
                    Are you sure you want to {isCompleted ? 'complete all orders' : 'set all orders to pending'}?
                </p>
            </div>
        </ModelViewLayoutContainer>
    );
}

CompleteEventModal.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleSubmit: PropTypes.func,
    isCompleted: PropTypes.bool,
};

export default CompleteEventModal;
