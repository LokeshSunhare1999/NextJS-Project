import React from 'react'
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import '../static/style/event.scss'
import { IoIosWarning } from 'react-icons/io';

function DeleteEventModal(props) {
    const { handleClose, isModalVisible, handleSubmit, isLogoutFlag } = props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title=""
            buttonCond = { true }
            buttonName1 = 'Cancel'
            buttonName2 = 'Delete'
            buttonName3= 'Logout'
            buttonDeleteAll= { true }
            className="delete-modal"
            isLogoutFlag = { isLogoutFlag }
            id='delete-modal'
        >
            <div className="text-center">
                <IoIosWarning className="pt-1" style={ { fontSize: 60, color: '#F21810' } } />
                <p className="pt-3">
                    Are you sure you want to {isLogoutFlag ? 'Logout' :  'delete' }.
                </p>
            </div>
        </ModelViewLayoutContainer>
    )
}

DeleteEventModal.propTypes = {
    handleClose: PropTypes.func,
    addNewTeamFunc: PropTypes.func,
    isModalVisible: PropTypes.func,
    handleSubmit: PropTypes.func,
    isLogoutFlag: PropTypes.bool
};

export default DeleteEventModal
