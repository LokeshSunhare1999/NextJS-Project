/* eslint-disable jsx-a11y/anchor-is-valid */
import React from 'react'
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer'
import download from 'static/images/svg/download-icon.svg'
import { Breadcrumb } from 'antd';
import { HiChevronRight } from 'react-icons/hi';
import deleteIcon from 'static/images/svg/delete-icon.svg';
import { useSelector } from 'react-redux';
import { monthDateYearFormat } from 'utils/Helper';
import Loader from 'shared/Loader';
import { saveAs } from 'file-saver';
function DetailFileModal(props) {
    const { handleClose, isModalVisible, fileId, confirmDeletFunc, handleSubmit, fileName  } = props;
    console.log("fileId--", fileId);
    const fileDetails = useSelector(state => state.fileDetails)
    const isLoading = useSelector((state) => state.modalIsLoading);
    const downloadImage = (url) => {
        if (fileDetails.file_type==='IMAGE' ){
            saveAs(url, fileDetails && fileDetails.file_name && fileDetails.file_name.replace(/^.*[\\/]/, '')) // Put your image url here.
        } else {
            const anchorElement = document.createElement('a');
            anchorElement.href = url;
            anchorElement.download = fileDetails && fileDetails.file_name && fileDetails.file_name.replace(/^.*[\\/]/, '');
            document.body.appendChild(anchorElement);
            anchorElement.click();
            document.body.removeChild(anchorElement);
            window.URL.revokeObjectURL(url);
        }
    };
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title={ fileDetails && fileDetails.file_name && fileDetails.file_name.replace(/^.*[\\/]/, '') }
            id='event-details'
        >
            {isLoading && <div className="d-flex justify-content-center align-items-center" style={ { width: '550px' } }><Loader  /></div> }
            {!isLoading &&
                <div className="content-wrapper">
                    {
                        fileDetails && fileDetails.file_type !== 'VIDEO' ?
                            <img src={ fileDetails && fileDetails.file_name } alt="event-img" className="event-img" /> :
                            <video src={ fileDetails && fileDetails.file_name } controls preload="metadata" alt="event-img" className="event-img" style={ { objectFit: 'fill' } } />
                    }
                    <div className="d-flex justify-content-between my-2">
                        <Breadcrumb className="text-start" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                            <Breadcrumb.Item>Events</Breadcrumb.Item>
                            <Breadcrumb.Item>Routines</Breadcrumb.Item>
                            <Breadcrumb.Item>Files</Breadcrumb.Item>
                            <Breadcrumb.Item>{ fileDetails && fileDetails.file_name &&  fileDetails.file_name.replace(/^.*[\\/]/, '') }</Breadcrumb.Item>
                        </Breadcrumb>
                        <div>
                            <a
                                // href="#"
                                download
                                rel="noreferrer"
                                onClick={ () => downloadImage(fileDetails && fileDetails.file_name) }
                            >
                                <img src={ download } alt="event-img" className="me-4 pointer" width="18" />
                            </a>
                            <img
                                src={ deleteIcon }
                                alt="event-img"
                                className="pointer"
                                width="14"
                                onClick={ () => confirmDeletFunc(fileId, fileName) }
                            />
                        </div>
                    </div>
                    <div className="row g-0">
                        {
                            (window.location.pathname !== '/orders' && window.location.pathname !== '/preorders') ? (
                                <div className="col-6">
                                    <span className="lbl">Download Count:</span>
                                    <span className="content">{ fileDetails && fileDetails.download_count }</span>
                                </div>
                            ) : ''
                        }
                    </div>
                    {
                        (window.location.pathname !== '/orders' && window.location.pathname !== '/preorders') ? (
                            <div className="row g-0 my-2">
                                <div className="col-12">
                                    <div className="lbl">Comments</div>
                                    <p className="content lineH20 mb-0">{ fileDetails && fileDetails.description }</p>
                                </div>
                            </div>
                        ) : ''
                    }
                    <div className="row g-0">
                        <div className="col-12">
                            <span className="lbl">Created On:</span>
                            <span className="content">{ monthDateYearFormat(fileDetails && fileDetails.created_datetime) }</span>
                        </div>
                    </div>
                </div>
            }
        </ModelViewLayoutContainer>
    )
}

DetailFileModal.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    fileId: PropTypes.number,
    confirmDeletFunc: PropTypes.func,
    handleSubmit: PropTypes.func
}

export default DetailFileModal
