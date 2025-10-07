/* eslint-disable computed-property-spacing */
/* eslint-disable no-loop-func */
/* eslint-disable no-undef */
/* eslint-disable eqeqeq */
/* eslint-disable array-bracket-spacing */
/* eslint-disable no-unused-vars */
import {
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../app/firebase';

import React, { useEffect , useState } from 'react'
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer'
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux'
import { useDropzone } from 'react-dropzone';
import { uploadBulkFiles, saveFilesActions, uploadBulkFilesByOrderNumber, uploadBulkFilesByPreOrderNumber, getEventDescriptionList } from 'actions/fileActions';
import closeIcon from 'static/images/svg/close-icon.svg'
import upload from 'static/images/svg/upload-up-arrow.svg'
import { img, thumb, thumbButton, thumbInner, thumbsContainer } from 'utils/Helper';
import { Button } from 'antd';
import { triggerNotifier } from 'shared/notifier';
import ProgressBarModal from './ProgressBarModal';
import { getOrderFilesByOrderNumberAction, getUserOrderedFoldersAction } from 'actions/orderActions';

function AddNewImages(props) {
    const dispatch = useDispatch()
    const pageURL = window.location.pathname;
    const is_backend_upload = process.env.REACT_APP_IS_BACKEND_UPLOAD=='true'?true:false;
    const { handleClose, isModalVisible, folderId, eventId, orderNumber, handleCloseModal, preOrderNumber, eventCode, folderName, teamNumber, fileList } = props;
    const [ isLoading, setIsLoading ] = useState(false);
    const [ files, setFiles ] = useState([]);
    const [ fileComment, setFilesComments ] = useState('');
    const [progressBarArray, setProgressBarArray] = useState([])
    const [progressPercentage, setProgressPercentage] = useState(0)
    const [isModal, setIsModal] = useState(false)
    const [isDuplicateFolder, setIsDuplicateFolder] = useState(false)
    const [duplicateFolderErrorMessage, setDuplicateFolderErrorMessage] = useState(false)
    // const deleteHandler = (idx) => {
    //     const clickedImgIdx = files.splice(idx, 1);
    //     console.log(clickedImgIdx);
    //     const filteredImages = files.filter((image) => image !== idx);
    //     setFiles(filteredImages)
    // }
    // const thumbs = files.map((file, index) => (
    //     <div style={ thumb } key={ file.name }>
    //         <div style={ thumbInner }>
    //             <img
    //                 src={ file.preview }
    //                 style={ img }
    //                 alt=''
    //             />
    //             <img src= { closeIcon } alt="close" style={ thumbButton } onClick={ () => deleteHandler(index) } />
    //         </div>
    //     </div>
    // ));
    const handleChange = (event) => {
        setFilesComments(event.target.value)
    }

    const { getRootProps, getInputProps } = useDropzone({
        accept: 'image/*',
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file)));
            setIsDuplicateFolder(false)
            setDuplicateFolderErrorMessage(false)
            // setFiles(acceptedFiles.map(file => Object.assign(file, {
            //     preview: URL.createObjectURL(file)
            // })));
        }
    });

    useEffect(() => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
        for (let i = 0; i < fileList.length; i++) {
            for (let j = 0; j < files?.length; j++) {
                if(pageURL === '/orders' || pageURL === '/preorders' || pageURL === '/customer-accounts'){
                    if(fileList[i].original_file_name == files[j]?.name  || `thumb_${ fileList[i].original_file_name }` == files[j]?.name){
                        setIsDuplicateFolder(true)
                    }
                } else if(pageURL === '/files' || pageURL === '/events'){
                    if(fileList[i].file_name == files[j]?.name  || `thumb_${ fileList[i].file_name }` == files[j]?.name){
                        setIsDuplicateFolder(true)
                    }
                }
            }
        }
    }, [ files, fileList, isDuplicateFolder, pageURL ]);

    const modalHandler = (response, count) => {
        if(progressBarArray.length > count) {
            progressBarArray.slice(0 , (count-progressBarArray));
        }
        setProgressPercentage((progressBarArray.length / count) * 100);
        if (progressBarArray.length == count) {
            setTimeout(() => {
                (pageURL === '/files' || pageURL === '/events') ? dispatch(getEventDescriptionList(folderId, eventId)) : dispatch(getOrderFilesByOrderNumberAction(orderNumber, folderName));
                handleClose()
                const message = response.message;
                triggerNotifier({ type: 'success', message });
                setIsModal(false);
            }, 1000);
        }
    }

    // Timer which start till 10% loading.
    const startIntervalProgressBar = (count) => {
        const temp = setInterval(() => {
            if(progressBarArray.length <= ((count/100)*10)) {
                progressBarArray.push(1);
                modalHandler({}, count);
            } else {
                window.clearInterval(temp);
            }
        }, 100);
    }

    // Upload image on firebase
    const handleUpload = async (file, path, count) => {
        const storage = getStorage(app);
        const fileName = file.name.replace('thumb_', '');
        const metadata = { cacheControl: 'public, no-cache' };
        console.log(file, fileName, 'file info');
        if(fileName.includes('.mp4')){
            console.log('inside if');
            metadata['contentType'] = 'application/octet-stream';
        }
        const storageRef = ref(storage, path+'/'+fileName);
        const uploadTask = uploadBytesResumable(storageRef, file ,metadata);
        startIntervalProgressBar(count);
        uploadTask.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            },
            (error) => {
                console.log(error);
            },
            () => {
                // Handle successful uploads on complete
                progressBarArray.push(1);
                modalHandler({}, count);
                const date = new Date();
                console.log(date);
            }
        );
    }

    const uploadCall = (base_folder , data, main_folder , sub_folder) => {
        console.log('base_folder , data, main_folder , sub_folder', base_folder , data, main_folder , sub_folder);
        if(isDuplicateFolder){
            //If Image already exist
            setDuplicateFolderErrorMessage(true)
            return
        }else {
            //If new Images
            data.forEach((x) => {
                handleUpload(x , '/'+base_folder+'/'+main_folder+'/'+sub_folder, data.length);
            });
        }
    }

    // File upload trigger from Backend
    // ==========================================
    // ==========================================
    const handleSubmit_backend = () => {
        console.log('Backend API Calling ===============================> ')
        setIsLoading(true)
        const chunked = []
        const size = 5;
        const incominFiles = []
        for (let i=0; i < Object.keys(files).length; i++ ) {
            incominFiles.push(Object.values(files)[ i ])
        }
        for (let i = 0;  i < incominFiles.length; i += size) {
            chunked.push(incominFiles.slice(i, i + size))
        }
        for (let i = 0; i <  chunked.length; i++) {
            const temp = chunked[ i ]
            const data = new FormData();
            for (let ind = 0; ind <  temp.length; ind++) {
                data.append('files',temp[ ind ]);
            }
            setIsModal(true)
            const count = chunked.length;
            const is_folder_upload = 0;
            console.log('Chunked Length ===============================> ', chunked)
            window.location.pathname === '/orders' || window.location.pathname === '/preorders' ?
                dispatch(uploadBulkFilesByOrderNumber( data, orderNumber, teamNumber, is_folder_upload)).then((res) => {
                    if(res.statusCode === 200){
                        progressBarArray.push(1)
                        setProgressPercentage((progressBarArray.length/count)*100)
                        if(progressBarArray.length == count)  {
                            setTimeout(() => {
                                handleCloseModal()
                                setIsLoading(false)
                                const message = res.message
                                triggerNotifier({ type: 'success', message })
                                setIsModal(false)
                            }, 1000);
                        }
                    }
                })
                :
                window.location.pathname === '/customer-accounts' ?
                    dispatch(uploadBulkFilesByOrderNumber(data, orderNumber, teamNumber, is_folder_upload)).then((res) => {
                        if(res.statusCode === 200){
                            progressBarArray.push(1)
                            setProgressPercentage((progressBarArray.length/count)*100)
                            if(progressBarArray.length == count)  {
                                setTimeout(() => {
                                    handleCloseModal()
                                    setIsLoading(false)
                                    const message = res.message
                                    triggerNotifier({ type: 'success', message })
                                    setIsModal(false)
                                }, 1000);
                            }
                        }
                    })
                    :
                    dispatch(uploadBulkFiles(data, eventCode, folderName)).then((res) => {
                        if(res.statusCode === 200){
                            progressBarArray.push(1)
                            setProgressPercentage((progressBarArray.length/count)*100)
                            if(progressBarArray.length == count)  {
                                setTimeout(() => {
                                    handleClose()
                                    handleCloseModal()
                                    const message = res.message
                                    triggerNotifier({ type: 'success', message })
                                    setIsModal(false)
                                }, 1000);
                            }
                        }
                    })
        }
    }
    // =====================================================================================
    // =====================================================================================
    // =====================================================================================

    const handleSubmit = () => {
        if(is_backend_upload){
            handleSubmit_backend();
        } else {
            const incominFiles = []
            for (let i=0; i < Object.keys(files).length; i++ ) {
                incominFiles.push(Object.values(files)[ i ])
            }
            if(!isDuplicateFolder){
                setIsLoading(true)
                setIsModal(true)
            }
            const count = incominFiles.length;
            const folder_name = teamNumber == undefined ? folderName : teamNumber;
            window.location.pathname === '/orders' || window.location.pathname === '/preorders' ?
                uploadCall( 'orderfiles', incominFiles ,orderNumber, folder_name )
                :
                window.location.pathname === '/customer-accounts' ?
                    uploadCall( 'orderfiles',  incominFiles ,orderNumber ,folder_name )
                    :
                    uploadCall( 'events', incominFiles ,eventCode, folder_name )
        }
    }

    return (
        <>
            <ModelViewLayoutContainer
                handleClose={ handleClose }
                isModalVisible={ isModalVisible }
                handleSubmit={ handleSubmit }
                title="Add Images"
                id='add-image'
            >
                <div className="edit-file">
                    <div className="mb-2 d-flex flex-column">
                        <span className="modal-label">Upload Images</span>
                        <section className="">
                            <div { ...getRootProps({ className: 'dropzone' }) }>
                                <input { ...getInputProps() } />
                                <div className="drag-wrapper">
                                    <img src={ upload } alt="upload-img" className="upload-img" />
                                    <div className="upload-lbl">Browse <br />or <br />Drag and drop</div>
                                </div>
                            </div>
                            {/* <aside style={ thumbsContainer }>
                                {thumbs}
                            </aside> */}
                        </section>
                    </div>
                    {
                        (window.location.pathname !== '/orders' && window.location.pathname !== '/preorders') ? (
                            <div className="mt-2">
                                <span className="modal-label">Comments</span>
                                <div className="textareafield">
                                    <textarea rows="3" name="fileComment" placeholder="Enter file comments" maxLength='500'  className="form-input" value={ fileComment } onChange ={ handleChange } />
                                </div>
                            </div>
                        ) : ''
                    }
                    <span className='mt-2'>{files.length} items selected.</span><br />
                    { duplicateFolderErrorMessage ? <span className='text-danger'>Error: Duplicate Image name is not allowed.</span> : '' }
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

AddNewImages.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    folderId: PropTypes.number,
    orderNumber: PropTypes.string,
    fileList: PropTypes.array,
    handleCloseModal: PropTypes.func,
    teamNumber: PropTypes.string,
    preOrderNumber: PropTypes.string,
    eventCode: PropTypes.string,
    folderName: PropTypes.string,
    eventId: PropTypes.number,
}

export default AddNewImages
