import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';
import { BiChevronLeft } from 'react-icons/bi';
import editWhite from '../static/images/svg/edit-white.svg'

const ModelViewLayoutContainer = ({
    children,
    title,
    history,
    handleClose,
    isModalVisible,
    handleSubmit,
    buttonCond,
    buttonUpload,
    buttonUpdate,
    buttonOk,
    buttonName1,
    buttonName2,
    buttonName3,
    buttonName4,
    isLogoutFlag,
    isDisabled,
    backButton,
    closePricingModalOpenDetailModal,
    isEdit,
    setIsEdit,
    id
}) => {
    return (
        <Modal
            title={ backButton ? <div className='d-flex align-items-center'> <div className='back-wrapper d-flex align-items-center' onClick={ closePricingModalOpenDetailModal } > <BiChevronLeft className='back-icon' /> <a href className='back-label'>Back</a> </div>{ title } </div> : title }
            className={
                id === 'view-modal' ? 'view-modal-wrapper' :
                    id === 'delete-modal' ? 'delete-modal-wrapper' :
                        id === 'sendLink-modal' ? 'sendLink-modal-wrapper' :
                            id === 'update-customer' ? 'update-customer-wrapper' :
                                id === 'add-staff' ? 'add-staff-wrapper' :
                                    id === 'update-staff' ? 'update-staff-wrapper' :
                                        id === 'add-producer' ? 'add-producer-wrapper' :
                                            id === 'update-producer' ? 'update-producer-wrapper' :
                                                id === 'view-producer' ? 'view-producer-wrapper' :
                                                    id === 'add-team' ? 'add-team-wrapper' :
                                                        id === 'create-folder' ? 'create-folder-wrapper' :
                                                            id === 'add-file' ? 'add-file-wrapper' :
                                                                id === 'add-image' ? 'add-file-image' :
                                                                    id === 'edit-folder' ? 'edit-folder-wrapper' :
                                                                        id === 'event-details' ? 'event-details-wrapper' :
                                                                            id === 'edit-file' ? 'edit-file-wrapper' :
                                                                                id === 'progress-bar' ? 'progress-bar-wrapper' :
                                                                                    id === 'edit-pre-order' ? 'edit-pre-order-wrapper' :
                                                                                        id === 'dynamic-pricing-modal' ? 'dynamic-pricing-modal-wrapper' :
                                                                                            id === 'add-customer' ? 'add-customer-wrapper' : 'w-fit-content' }
            centered={ id === 'view-modal' || id === 'delete-modal' || id === 'sendLink-modal' || id === 'add-customer' || id === 'add-staff' || id === 'update-staff' || id === 'view-producer' || id === 'add-team' || id === 'update-customer' || id === 'edit-folder' || id === 'create-folder' || id === 'edit-file' || id === 'add-file' || id === 'add-image' || id === 'dynamic-pricing-modal' || id === 'edit-pre-order' || id === 'progress-bar' }
            visible={ isModalVisible }
            onOk={ handleSubmit }
            onCancel={ handleClose }
            footer={
                buttonName1 && buttonName2 ? (
                    <div className="d-flex justify-content-center pb-3">
                        {' '}
                        <Button
                            key="submit"
                            type="primary"
                            onClick={ handleClose }
                            className="modal-cancel"
                        >
                            {buttonName1}
                        </Button>
                        {isLogoutFlag ? (
                            <Button
                                key="submit"
                                type="primary"
                                onClick={ handleSubmit }
                                className="modal-delete"
                            >
                                {buttonName3}
                            </Button>
                        ) : (
                            <Button
                                key="submit"
                                type="primary"
                                onClick={ handleSubmit }
                                className="modal-delete"
                            >
                                {buttonName2}
                            </Button>
                        )}
                    </div>
                ) : buttonCond ? (
                    [
                        <Button
                            key="submit"
                            type="primary"
                            onClick={ handleSubmit }
                            className="modal-add"
                        >
                            Add
                        </Button>,
                    ]
                ) :  buttonUpload ? (
                    [
                        <Button
                            key="submit"
                            type="primary"
                            onClick={ isEdit !== true ?  handleSubmit  : () => setIsEdit(false) }
                            className="modal-add"
                            disabled={ isDisabled }
                        >
                            { isEdit !== false ? (
                                <>
                                    <img src={ editWhite } alt="edit-img" width="16" className="me-2 mb-1 pointer" />
                                    Edit
                                </>
                            ) : (
                                <span>Upload</span>
                            )}
                        </Button>,
                    ]
                ) : buttonUpdate ? (
                    [
                        <Button
                            key="submit"
                            type="primary"
                            onClick={ handleSubmit }
                            className="modal-add"
                        >
                            Update
                        </Button>,
                    ]
                ) : buttonOk ? (
                    <div className='modal-div'>
                        <Button
                            key="submit"
                            type="primary"
                            onClick={ handleClose }
                            className="modal-ok"
                        >
                            {buttonName4}
                        </Button>
                    </div>
                ) : null
            }
        >
            {children}
        </Modal>
    );
};
ModelViewLayoutContainer.propTypes = {
    children: PropTypes.object,
    history: PropTypes.object,
    buttonCond: PropTypes.bool,
    buttonUpload: PropTypes.bool,
    buttonUpdate: PropTypes.bool,
    buttonOk: PropTypes.bool,
    isLogoutFlag: PropTypes.bool,
    buttonName1: PropTypes.string,
    buttonName2: PropTypes.string,
    buttonName3: PropTypes.string,
    buttonName4: PropTypes.string,
    buttonDeleteAll: PropTypes.bool,
    title: PropTypes.string,
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleSubmit: PropTypes.func,
    id: PropTypes.string,
    isDisabled: PropTypes.bool,
    isEdit: PropTypes.bool,
    setIsEdit: PropTypes.bool,
    backButton: PropTypes.bool,
    closePricingModalOpenDetailModal: PropTypes.func
};

export default ModelViewLayoutContainer;
