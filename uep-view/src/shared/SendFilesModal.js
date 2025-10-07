import React from 'react'
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import { Button } from 'antd';
import '../static/style/event.scss'

function SendFilesModal(props) {
    const { handleClose, isModalVisible, handleSubmit, isLogoutFlag } = props;
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title=""
            buttonOk = { true }
            buttonName4= 'OK'
            className="delete-modal"
            isLogoutFlag = { isLogoutFlag }
            id='sendLink-modal'
        >
            <div className="text-center" style={ { height:'40px' } }>
                <p className="mb-0">
                    Application is processing the order files. Files will be available for download in 10-15 minutes.
                </p>
            </div>
            <Button
                key="submit"
                type="primary"
                onClick={ handleClose }
                className="modal-cancel"
            ></Button>
        </ModelViewLayoutContainer>
    )
}

SendFilesModal.propTypes = {
    handleClose: PropTypes.func,
    addNewTeamFunc: PropTypes.func,
    isModalVisible: PropTypes.func,
    handleSubmit: PropTypes.func,
    isLogoutFlag: PropTypes.bool
};

export default SendFilesModal
