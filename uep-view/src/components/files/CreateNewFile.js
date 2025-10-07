/* eslint-disable computed-property-spacing */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
import {
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../app/firebase';
import { modalIsLoading } from 'actions/commonActions';
import React, { useEffect , useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { useDropzone } from 'react-dropzone';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import { getEventDescriptionList, uploadBulkFiles, uploadBulkFilesByOrderNumber } from 'actions/fileActions';
import closeIcon from 'static/images/svg/close-icon.svg'
import upload from 'static/images/svg/upload-up-arrow.svg'
import { thumb, thumbButton, thumbInner, thumbsContainer } from 'utils/Helper';
import { Button } from 'antd';
import { triggerNotifier } from 'shared/notifier';
import ProgressBarModal from './ProgressBarModal';
import { getOrderFilesByOrderNumberAction } from 'actions/orderActions';

function CreateNewFile(props) {
    const video = {
        objectFit: 'cover',
    }
    const dispatch = useDispatch()
    const pageURL = window.location.pathname;
    const is_backend_upload = process.env.REACT_APP_IS_BACKEND_UPLOAD=='true'?true:false;
    const { handleClose, isModalVisible, orderNumber, handleCloseModal, eventCode, folderName, teamNumber, eventId, folderId, fileList } = props;
    console.log('fileList', fileList);
    const isLoading = useSelector((state) => state.modalIsLoading);
    const [ files, setFiles ] = useState([]);
    const [ fileComment, setFilesComments ] = useState('');
    const [ isErrorMessage, setIsErrorMessage ] = useState('')
    const [ isModal, setIsModal ] = useState(false)
    const [ progressPercentage, setProgressPercentage ] = useState(0)
    const [ progressBarArray, setProgressBarArray ] = useState([])
    const [ isDuplicateFile, setIsDuplicateFile ] = useState(false)
    const [ duplicateFileErrorMessage, setDuplicateFileErrorMessage ] = useState(false)

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

    const singleVideoValidator = async (file) => {
        if(file.type === 'video/mp4' || file.type === 'video/mov' || file.type === 'video/wmv' || file.type === 'video/avi' || file.type === 'video/avchd' || file.type === 'video/mkv' || file.type === 'video/webm' || file.type === 'video/mpeg-2'){
            if(window.location.pathname === '/preorders' || window.location.pathname === '/orders' || window.location.pathname === '/customer-accounts') {
                accepted.push(file)
                setFiles(accepted.map(file1 => Object.assign(file1, {
                    preview: URL.createObjectURL(file1)
                })));
                setIsErrorMessage('')
                return
            } else {
                const duration = await getVideoDuration(file);
                if (Math.floor(duration) > maxDuration ) {
                    setIsErrorMessage('Video duration must be less than 30 sec.')
                    return
                }
                accepted.push(file)
                setFiles(accepted.map(file1 => Object.assign(file1, {
                    preview: URL.createObjectURL(file1)
                })));
                setIsErrorMessage('')
                return
            }
        }
    }

    const deleteHandler = (idx) => {
        const clickedImgIdx = files.splice(idx, 1);
        console.log(clickedImgIdx);
        const filteredImages = files.filter((image) => image !== idx);
        setFiles(filteredImages)
    }
    const thumbs = files.map((file, index) => (
        <div style={ thumb } key={ file.name }>
            <div style={ thumbInner }>
                <video src={ file.preview } preload="metadata" alt="event-img" className="evt-img" style={ video } />
                <img src= { closeIcon } alt="close" style={ thumbButton } onClick={ () => deleteHandler(index) } />
            </div>
        </div>
    ));

    const handleChange = (event) => {
        setFilesComments(event.target.value)
    }

    useEffect(() => {
        setIsDuplicateFile(false)
        setDuplicateFileErrorMessage(false)
        files.forEach(file => URL.revokeObjectURL(file.preview));
        for (let i = 0; i < fileList.length; i++) {
            for (let j = 0; j < files?.length; j++) {
                if(pageURL === '/orders' || pageURL === '/preorders' || pageURL === '/customer-accounts'){
                    if(fileList[i].original_file_name == files[j]?.name  || `thumb_${ fileList[i].original_file_name }` == files[j]?.name){
                        setIsDuplicateFile(true)
                    }
                } else if(pageURL === '/files' || pageURL === '/events'){
                    if(fileList[i].file_name == files[j]?.name  || `thumb_${ fileList[i].file_name }` == files[j]?.name){
                        setIsDuplicateFile(true)
                    }
                }
            }
        }
    }, [ files, fileList, isDuplicateFile, pageURL ]);

    const { getRootProps, getInputProps } = useDropzone({
        validator: singleVideoValidator,
        accept: 'video/*',
        multiple: false,
    });

    const modalHandler = (response, count) => {
        // if(progressBarArray.length > count) {
        //     progressBarArray.slice(0 , (count-progressBarArray));
        // }
        // setProgressPercentage((progressBarArray.length / count) * 100);
        if (progressBarArray.length == count) {
            setTimeout(() => {
                handleClose()
                const message = response.message;
                triggerNotifier({ type: 'success', message });
                setIsModal(false);
            }, 1000);
        }
    }

    // Timer which start till 10% loading.
    // const startIntervalProgressBar = (count) => {
    //     console.log('startIntervalProgressBar count', count);
    //     const temp = setInterval(() => {
    //         if(progressBarArray.length <= ((count/100)*10)) {
    //             progressBarArray.push(10);
    //             modalHandler({}, count);
    //         } else {
    //             window.clearInterval(temp);
    //         }
    //     }, 100);
    // }

    // Firebase
    // =====================================================
    // =====================================================

    // Upload image on firebase
    const handleUpload = async (file, path, count) => {
        dispatch(modalIsLoading(true));
        const storage = getStorage(app);
        const metadata = { cacheControl: 'public, no-cache' };
        const fileName = file.name.replace('thumb_', '');
        console.log(file, fileName, 'file info')
        if(fileName.includes('.mp4')){
            console.log('inside if')
            metadata['contentType'] = 'application/octet-stream';
        }
        console.log(metadata)
        const storageRef = ref(storage, path+'/'+fileName);
        const uploadTask = uploadBytesResumable(storageRef, file , metadata);
        // startIntervalProgressBar(count);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setProgressPercentage(progress);
            },
            (error) => {
                console.log(error);
            },
            () => {
                // Handle successful uploads on complete
                // progressBarArray.push(1);
                modalHandler({}, count);
                dispatch(modalIsLoading(false));
                handleCloseModal();
                (pageURL === '/files' || pageURL === '/events') ? dispatch(getEventDescriptionList(folderId, eventId)) : dispatch(getOrderFilesByOrderNumberAction(orderNumber, folderName));
            }
        );
    }
    // This function trigger upload of firebase
    const uploadCall = (base_folder , data, main_folder , sub_folder) => {
        if(isDuplicateFile){
            //If Video already exist
            setDuplicateFileErrorMessage(true)
            return
        }else {
            //If new Video
            const final_folder = teamNumber == undefined ? folderName : teamNumber
            data.forEach((x) => {
                handleUpload(x , '/'+base_folder+'/'+main_folder+'/'+final_folder, data.length);
            });
        }
    }
    // ====================================================================
    // ====================================================================

    const handleSubmit = () => {
        if(!is_backend_upload){
            if(window.location.pathname === '/orders' || window.location.pathname === '/preorders' || window.location.pathname === '/customer-accounts'){
                if(!isDuplicateFile){
                    setIsModal(true)
                }
                uploadCall( 'orderfiles', files, orderNumber, folderName)
            } else {
                if(!isDuplicateFile){
                    setIsModal(true)
                }
                uploadCall( 'events', files, eventCode, folderName)
            }
        } else {
            var data = new FormData();
            for (const key of Object.keys(files)) {
                data.append('files', files[ key ])
            }
            const is_folder_upload = 0;
            window.location.pathname === '/orders' || window.location.pathname === '/preorders'?
                dispatch(uploadBulkFilesByOrderNumber(data, orderNumber, folderName, is_folder_upload)).then((res) => {
                    if(res.statusCode === 200){
                        handleCloseModal()
                    }
                })
                :
                window.location.pathname === '/customer-accounts' ?
                    dispatch(uploadBulkFilesByOrderNumber(data, orderNumber, folderName, is_folder_upload)).then((res) => {
                        if(res.statusCode === 200){
                            handleCloseModal()
                        }
                    })
                    :
                    dispatch(uploadBulkFiles(data, eventCode, folderName)).then((res) => {
                        if(res.statusCode === 200 ){
                        // const saveData = {
                        //     event_folder_id: folderId,
                        //     file_details: res.data.filesArray,
                        //     file_description: fileComment,
                        // }
                        // dispatch(saveFilesActions(saveData, eventId))
                            handleClose()
                            handleCloseModal()
                        }
                    })
        }

    }

    return (
        <>
            <ModelViewLayoutContainer
                handleClose={ handleClose }
                isModalVisible={ isModalVisible }
                handleSubmit={ handleSubmit }
                title="Add Video"
                id='add-file'
            >
                <div className="edit-file">
                    <div className="mb-2 d-flex flex-column">
                        <span className="modal-label">Upload Video</span>
                        <section className=" ">
                            <div { ...getRootProps({ className: 'dropzone' }) }>
                                <input { ...getInputProps() }  />
                                <div className="drag-wrapper">
                                    <img src={ upload } alt="upload-img" className="upload-img" />
                                    <div className="upload-lbl">Browse <br />or <br />Drag and drop</div>
                                </div>
                            </div>
                            {/* <aside style={ thumbsContainer }>
                                {thumbs}
                            </aside> */}
                            <span className='mt-2'>{files.length} items selected.</span><br />
                            { duplicateFileErrorMessage ? <span className='text-danger'>Error: Duplicate file name is not allowed.</span> : '' }
                        </section>
                        { isErrorMessage ? (<span className='text-danger'>{ isErrorMessage }</span>) : '' }
                    </div>
                    {
                        (window.location.pathname !== '/orders' && window.location.pathname !== '/preorders') ? (
                            <div className="mt-2">
                                <span className="modal-label">Comments</span>
                                <div className="textareafield">
                                    <textarea rows="3" name="fileComment" placeholder="Enter file comments"  className="form-input" value={ fileComment } onChange ={ handleChange } />
                                </div>
                            </div>
                        ) : ''
                    }
                    <div className='text-end mt-3'>
                        {
                            isLoading ? (
                                <Button
                                    type="button"
                                    className="modal-add"
                                    disabled
                                >
                                    <span className="spinner-grow spinner-grow-sm" role="status" aria-hidden="true"></span>
                                    &nbsp;Uploading...
                                </Button>
                            ) : (
                                <Button
                                    key="submit"
                                    type="primary"
                                    onClick={ handleSubmit }
                                    className="modal-add"
                                    disabled={ files.length <= 0 }
                                >
                                    Upload
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

CreateNewFile.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    folderId: PropTypes.number,
    orderNumber: PropTypes.string,
    preOrderNumber: PropTypes.string,
    handleCloseModal: PropTypes.func,
    eventCode: PropTypes.string,
    folderName: PropTypes.string,
    teamNumber: PropTypes.string,
    fileList: PropTypes.array,
    eventId: PropTypes.number
}

export default CreateNewFile
