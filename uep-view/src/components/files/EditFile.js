/* eslint-disable computed-property-spacing */
/* eslint-disable eqeqeq */
/* eslint-disable array-bracket-spacing */
/* eslint-disable no-unused-vars */
/* eslint-disable array-callback-return */
import {
    deleteObject,
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../app/firebase';
import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer'
import { useDropzone } from 'react-dropzone';
import { uploadBulkFiles, updateFilesAction, removeFileAction, getEventDescriptionList } from 'actions/fileActions';
import { Button } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { triggerNotifier } from 'shared/notifier';
import ProgressBarModal from './ProgressBarModal';

function EditFile(props) {
    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    };
    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        width: 90,
        height: 90,
        boxSizing: 'border-box'
    };
    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    };
    const img = {
        display: 'block',
        width: '90px',
        height: '90px',
        borderRadius: '5px',
        objectFit: 'cover',
        objectPosition: 'top'
    };
    const video = {
        objectFit: 'cover',
    }

    const dispatch = useDispatch()
    const pageURL = window.location.pathname;
    const { handleClose, isModalVisible, handleChange, confirmDeletFunc, editFileInfo, folderId, eventId, folderName, fileList } = props;
    const is_backend_upload = process.env.REACT_APP_IS_BACKEND_UPLOAD =='true'?true:false;
    const { file_name, file_type } = editFileInfo
    const [ selectedFile, setSelectedFile ] = useState([]);
    const isLoading = useSelector((state) => state.modalIsLoading);
    const [ isErrorMessage, setIsErrorMessage ] = useState('')
    const [ fileId, setFileId ] = useState(editFileInfo?.id)
    const [isModal, setIsModal] = useState(false)
    const [progressPercentage, setProgressPercentage] = useState(0)
    const [ isDuplicateFile, setIsDuplicateFile ] = useState(false)
    const [ duplicateFileErrorMessage, setDuplicateFileErrorMessage ] = useState(false)
    console.log('editFileInfo', editFileInfo);
    console.log('selectedFileInfo', selectedFile);

    useEffect(() => () => {
        setIsDuplicateFile(false)
        setDuplicateFileErrorMessage(false)
        selectedFile.forEach(file => URL.revokeObjectURL(file.preview));
    }, [ selectedFile, fileList, isDuplicateFile ]);
    const maxDuration = 30;
    const accepted = [];

    const getVideoDuration = (file) => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const media = new Audio(reader.result);
            media.onloadedmetadata = () => resolve(media.duration);
        };
        reader.readAsDataURL(file);
        reader.onerror = (error) => reject(error);
    });

    useEffect(() => {
        setIsDuplicateFile(false)
        setDuplicateFileErrorMessage(false)
        for (let i = 0; i < fileList.length; i++) {
            for (let j = 0; j < selectedFile.length; j++) {
                if(pageURL === '/orders' || pageURL === '/preorders' || pageURL === '/customer-accounts'){
                    if(fileList[i].original_file_name == selectedFile[j]?.name  || `thumb_${ fileList[i].original_file_name }` == selectedFile[j]?.name){
                        setIsDuplicateFile(true)
                    }
                }
                else if(pageURL === '/files' || pageURL === '/events'){
                    if((fileList[i].file_name == selectedFile[j]?.name  || `thumb_${ fileList[i].file_name }` == selectedFile[j]?.name) && selectedFile[j].name !== editFileInfo?.file_name){
                        setIsDuplicateFile(true);
                    }
                }
            }
        }
    }, [ selectedFile, fileList, isDuplicateFile, pageURL]);

    const singleVideoValidator = async (file) => {
        if(file.type === 'video/mp4' || file.type === 'video/mov' || file.type === 'video/wmv' || file.type === 'video/avi' || file.type === 'video/avchd' || file.type === 'video/mkv' || file.type === 'video/webm' || file.type === 'video/mpeg-2'){
            const duration = await getVideoDuration(file);
            if (Math.floor(duration) > maxDuration ) {
                setIsErrorMessage('Video duration must be less than 30 sec.')
                return
            }
            accepted.push(file)
            setSelectedFile(accepted.map(data => Object.assign(data, {
                preview: URL.createObjectURL(data)
            })));
            setIsErrorMessage('')
            return
        }
        if(file.type === 'image/jpeg' || file.type === 'image/png' ){
            accepted.push(file)
            setSelectedFile(accepted.map(data => Object.assign(data, {
                preview: URL.createObjectURL(data)
            })));
            setIsErrorMessage('')
            return
        }
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'video/*, image/*',
        validator: singleVideoValidator,
        multiple: false,
    });

    const thumbs = selectedFile.map(file => (
        <div style={ thumb } key={ file.name }>
            <div style={ thumbInner }>
                {
                    file.type.charAt(0) !== 'v' ? (
                        <img
                            src={ file.preview }
                            style={ img }
                            alt='img'
                        />
                    ) : (
                        <video src={ file.preview } preload="metadata" alt="event-img" className="evt-img" style={ video } />
                    )
                }
            </div>
        </div>
    ));

    const modalHandler = (response, count) => {
        if (progressPercentage === 100) {
            setTimeout(() => {
                handleClose()
                const message = response.message;
                triggerNotifier({ type: 'success', message });
                setIsModal(false);
            }, 1000);
        }
    }

    const handleUpload = async (file, path, count) => {
        console.log("path",path);
        const oldFileData = fileList.find((x) => x.id == fileId);
        console.log(oldFileData, 'oldFileData' , file)
        const storage = getStorage(app);
        const fileName = file.name.replace('thumb_', '');
        const metadata = { cacheControl: 'public, no-cache' };
        console.log(file, fileName, 'file info');
        if(fileName.includes('.mp4')){
            console.log('inside if');
            metadata['contentType'] = 'application/octet-stream';
        }
        const storageRef = ref(storage, path+'/'+fileName);
        const uploadTask = uploadBytesResumable(storageRef, file , metadata);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgressPercentage(progress);
                console.log('progress', progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                if(oldFileData.file_name !== file.name) {
                    const oldStorageRef = ref(storage, path + '/' + oldFileData.file_name);
                    deleteObject(oldStorageRef)
                        .then(() => {
                            console.log('Old file deleted successfully.');
                        })
                        .catch((error) => {
                            console.error('Error deleting old file:', error);
                        });
                    const sendIdData = {
                        file_ids: [ fileId ]
                    };
                    dispatch(removeFileAction(sendIdData, folderId, eventId, 'message'))
                }
                modalHandler({}, count);
                handleClose()
                dispatch(getEventDescriptionList(folderId, eventId))
            }
        );
    }

    const apiCall = async (data) => {
        if(isDuplicateFile){
            //If Video already exist
            setDuplicateFileErrorMessage(true)
            return
        }else {
            console.log('temp')
            //If new Video
            console.log(data)
            data.forEach((x) => {
                handleUpload(x , '/events/'+ editFileInfo.event_code +'/'+ folderName, data.length);
            });
        }
    }

    const handleSubmit = () => {
        var data = new FormData();
        for (const key of Object.keys(selectedFile)) {
            data.append('files', selectedFile[ key ])
        }
        if(!is_backend_upload){
            //upload by firebase
            if(!isDuplicateFile){
                setIsModal(true)
            }
            apiCall(data);
        } else {
            //upload by backend API
            dispatch(uploadBulkFiles(data)).then((res) => {
                if(res.statusCode === 200 ){
                    const saveData = {
                        file_name: res.data.filesArray[ 0 ].file_name,
                        file_type: res.data.filesArray[ 0 ].file_type
                    }
                    if(res.data && res.data.filesArray[ 0 ].file_name) {
                        const file_id = editFileInfo.id
                        dispatch(updateFilesAction(saveData, file_id, folderId,  eventId))
                        handleClose()
                    }
                }
            }) ;
        }
    }

    const deleteEventFile = (id, fileURL) => {
        confirmDeletFunc(id, fileURL)
    }

    return (
        <>
            <ModelViewLayoutContainer
                handleClose={ handleClose }
                isModalVisible={ isModalVisible }
                handleSubmit={ handleSubmit }
                title="Edit File"
                id='edit-file'
            >
                <div className="edit-file">
                    <div className="mt-2">
                        <span className="modal-label">File Name</span>
                        <div className="inputfield disabled-field">
                            <input
                                type="text"
                                name="file_name"
                                placeholder="Enter File Name"
                                className="form-input"
                                onChange={ handleChange }
                                disabled
                                value={ thumbs.length === 0 ? (file_name.split('\\').pop().split('/').pop()).split('.').slice(0, -1).join('.') : (thumbs[ 0 ].key.split('\\').pop().split('/').pop()).split('.').slice(0, -1).join('.') }
                            />
                        </div>
                    </div>
                    <div className="mt-2">
                        <span className="modal-label">Image</span>
                        <div className="d-flex align-items-center justify-content-between">
                            <div className="d-flex align-items-center">
                                {/* {
                                    (thumbs.length === 0 && file_type !== 'VIDEO' ) ?
                                        <img src={ editFileInfo.file_url } alt="evt-img" className="evt-img" /> :
                                        (thumbs.length === 0 && file_type === 'VIDEO' ) ?
                                            <video src={ editFileInfo.file_url } preload="metadata" alt="event-img" className="evt-img" style={ { objectFit: 'cover' } }> </video> :
                                            <aside style={ thumbsContainer }>
                                                {thumbs}
                                            </aside>
                                } */}
                                {
                                    thumbs.length === 0 ?
                                        <h5 className="evt-img-name mb-0 ms-2">{ file_name.replace(/^.*[\\/]/, '') }</h5> :
                                        <h5 className="evt-img-name mb-0 ms-2">{ thumbs[ 0 ].key.replace(/^.*[\\/]/, '') }</h5>
                                }
                            </div>
                            <div className="evt-actions">
                                <span { ...getRootProps({ className: 'dropzone' }) }>
                                    <input { ...getInputProps() } />
                                    <span className="pointer" >Change</span>
                                </span>
                                <span className="mx-1">|</span>
                                <span className="pointer" onClick={ () => deleteEventFile(editFileInfo.id, editFileInfo.file_url) }>Remove</span>
                            </div>
                        </div>
                        { isErrorMessage ? (<span className='text-danger'>{ isErrorMessage }</span>) : '' }<br />
                        { duplicateFileErrorMessage ? <span className='text-danger'>Error: Duplicate file name is not allowed.</span> : '' }
                    </div>
                    <div className='text-end mt-3'>
                        {
                            isLoading ? (
                                <Button
                                    type="button"
                                    className="modal-add"
                                    disabled
                                >
                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    &nbsp;Updating...
                                </Button>
                            ) : (
                                <Button
                                    key="submit"
                                    type="primary"
                                    onClick={ handleSubmit }
                                    className="modal-add"
                                    disabled= { selectedFile.length <= 0 }
                                >
                                    Update
                                </Button>
                            )
                        }
                    </div>
                </div>
            </ModelViewLayoutContainer>
            {
                isModal && (<ProgressBarModal
                    progressPercentage= { progressPercentage }
                    isModalVisible={ isModal }
                    handleClose={ handleClose }
                />)
            }
        </>
    )
}

EditFile.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    handleChange: PropTypes.func,
    editFileInfo: PropTypes.object,
    folderId: PropTypes.number,
    confirmDeletFunc: PropTypes.func,
    eventId: PropTypes.number,
    folderName: PropTypes.string,
    fileList: PropTypes.array
}

export default EditFile
