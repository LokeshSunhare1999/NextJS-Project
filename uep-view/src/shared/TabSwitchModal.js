import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import '../static/style/event.scss';
import { IoIosWarning } from 'react-icons/io';

function TabSwitchModal(props) {
    const { handleClose, isModalVisible, handleSubmit } = props;

    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title=""
            buttonCond={ true }
            buttonName1="No"
            buttonName2="Yes"
            buttonDeleteAll={ false }
            className="delete-modal"
            id="delete-modal"
        >
            <div className="text-center">
                <IoIosWarning
                    className=""
                    style={ { fontSize: 50, fill: '#ffc107' } }
                />
                <p className="-mt-2">
                    Your unsaved changes will be lost. Are you sure you want to leave this page?
                </p>
            </div>
        </ModelViewLayoutContainer>
    );
}

TabSwitchModal.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleSubmit: PropTypes.func,
};

export default TabSwitchModal;
