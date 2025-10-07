import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import '../static/style/event.scss';
import { IoIosWarning } from 'react-icons/io';

function ResetEventModal(props) {
    const { handleClose, isModalVisible, handleSubmit } = props;

    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title=""
            buttonCond={ true }
            buttonName1="Cancel"
            buttonName2="Reset"
            buttonDeleteAll={ true }
            className="delete-modal"
            id="delete-modal"
        >
            <div className="text-center">
                <IoIosWarning
                    className=""
                    style={ { fontSize: 50, fill: '#17a2b8' } }
                />
                <p className="">
                    Are you sure you want to reset all orders to their default state?
                </p>
            </div>
        </ModelViewLayoutContainer>
    );
}

ResetEventModal.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleSubmit: PropTypes.func,
};

export default ResetEventModal;
