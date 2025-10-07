/* eslint-disable default-case */
/* eslint-disable eqeqeq */
/* eslint-disable no-unused-vars */
/* eslint-disable computed-property-spacing */
/* eslint-disable array-bracket-spacing */
/* eslint-disable react/jsx-curly-spacing */
/* eslint-disable no-loop-func */
/* eslint-disable array-callback-return */

import {
    getStorage,
    ref,
    uploadBytesResumable,
} from 'firebase/storage';
import { app } from '../../app/firebase';

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useDropzone } from 'react-dropzone';
import 'static/style/files.scss'
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import closeIcon from 'static/images/svg/close-icon.svg'
import upload from 'static/images/svg/upload-up-arrow.svg'
import { uploadBulkFiles, saveFolderActions, getEventFoldersList, uploadBulkFilesByOrderNumber } from 'actions/fileActions';
import { img, thumb, thumbButton, thumbInner, thumbsContainer } from 'utils/Helper';
import { Button } from 'antd';
import ErrorMessage from 'shared/ErrorMessage';
import { getUserOrderedFoldersAction } from 'actions/orderActions';
import { triggerNotifier } from 'shared/notifier';
import ProgressBarModal from './ProgressBarModal';

function CreateNewFolder(props) {
    const video = {
        objectFit: 'cover',
    }
    const pageURL = window.location.pathname;
    const is_backend_upload = process.env.REACT_APP_IS_BACKEND_UPLOAD=='true'?true:false;
    const dispatch = useDispatch()
    const { handleClose, isModalVisible, eventId, eventCode, orderNumber, folderData } = props;
    const [folderName, setFolderName] = useState('');
    const [inputError, setInputError] = useState({});
    const isLoading = useSelector((state) => state.modalIsLoading);
    const [fetchedFolderName, setFetchedFolderName] = useState('');
    const [files, setFiles] = useState([]);
    const [progressBarArray, setProgressBarArray] = useState([])
    const [progressPercentage, setProgressPercentage] = useState(0)
    const [isModal, setIsModal] = useState(false)
    const [isDuplicateFolder, setIsDuplicateFolder] = useState(false)
    const [duplicateFolderErrorMessage, setDuplicateFolderErrorMessage] = useState(false)
    console.log('folderData', folderData);

    useEffect(() => () => {
        files.forEach(file => URL.revokeObjectURL(file.preview));
    }, [files]);
    console.log('files', files);
    useEffect(() => {
        setFolderName(fetchedFolderName)
        setDuplicateFolderErrorMessage(false)
        setIsDuplicateFolder(false)
    }, [fetchedFolderName])

    const MyUploader = () => {
        const { getRootProps, getInputProps } = useDropzone({
            accept: ['video/*', 'image/*'],
            onDrop: acceptedFiles => {
                setFiles(acceptedFiles.map(file => Object.assign(file)));
                console.log(acceptedFiles , 'acceptedFiles')
                setFetchedFolderName(acceptedFiles && acceptedFiles[0] && acceptedFiles[0].path.split('/')[0] ? acceptedFiles[0].path.split('/')[0] : acceptedFiles[0].path.split('/')[1])
            }
        });
        // const deleteHandler = (idx) => {
        //     const clickedImgIdx = files.splice(idx, 1);
        //     console.log(clickedImgIdx);
        //     const filteredImages = files.filter((image) => image !== idx);
        //     setFiles(filteredImages)
        // }
        // const thumbs = files.map((file, index) => (
        //     <div style={thumb} key={file.name}>
        //         <div style={thumbInner}>
        //             {
        //                 file.type === 'video/mp4' ? (
        //                     <>
        //                         <video src={file.preview} preload="metadata" alt="event-img" className="evt-img" style={video} />
        //                         <img src={closeIcon} alt="close" style={thumbButton} onClick={() => deleteHandler(index)} />
        //                     </>
        //                 )
        //                     :
        //                     (
        //                         <>
        //                             <img
        //                                 src={file.preview}
        //                                 style={img}
        //                                 alt="img"
        //                             />
        //                             <img src={closeIcon} alt="close" style={thumbButton} onClick={() => deleteHandler(index)} />
        //                         </>
        //                     )
        //             }
        //         </div>
        //     </div>
        // ));
        for (let i = 0; i < folderData.length; i++) {
            if(folderData[i]?.team_number == fetchedFolderName || folderData[i]?.folder_name == fetchedFolderName){
                setIsDuplicateFolder(true)
            }
        }
        console.log('isDuplicateFolder', isDuplicateFolder);
        return (
            <section className=" ">
                <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} webkitdirectory="" type="file" />
                    <div className="drag-wrapper">
                        <img src={upload} alt="upload-img" className="upload-img" />
                        <div className="upload-lbl">Browse <br />or <br />Drag and drop</div>
                    </div>
                </div>
                {/* <aside style={thumbsContainer}>
                    {thumbs}
                </aside> */}
            </section>
        );
    }
    const validate = () => {
        const errors = {};
        let isValid = true;
        if (folderName && folderName.length !== undefined) {
            if (folderName.length > 4 || folderName.length < 4) {
                isValid = false;
                errors.folderName = 'Folder name must contain 4 digits only';
            }
        }
        setInputError(errors);
        return isValid;
    }
    const handleChange = (event) => {
        setFolderName(event.target.value)
        setInputError({})
    }

    const modalHandler = (response, count) => {
        if(progressBarArray.length > count){
            progressBarArray.slice(0 , (count-progressBarArray));
        }
        setProgressPercentage((progressBarArray.length / count) * 100);
        if (progressBarArray.length == count) {
            setTimeout(() => {
                (pageURL === '/files' || pageURL === '/events') ? dispatch(getEventFoldersList(eventId)) : dispatch(getUserOrderedFoldersAction(orderNumber));
                handleClose()
                const message = response.message
                triggerNotifier({ type: 'success', message })
                setIsModal(false)
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
        const metadata = { cacheControl: 'public, no-cache' };
        const fileName = file.name.replace('thumb_', '');
        console.log(file, fileName, 'file info', path)
        if(fileName.includes('.mp4')){
            console.log('inside if')
            metadata['contentType'] = 'application/octet-stream';
        }
        const storageRef = ref(storage, path+'/'+fileName);
        const uploadTask = uploadBytesResumable(storageRef, file , metadata );
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
            }
        );
    }

    // Manage conditions for both upload from frontend or backend //
    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // --------------------------------------------------------------
    // --------------------------------------------------------------

    const modalHandler_backend = (response, count) => {
        setProgressPercentage((progressBarArray.length / count) * 100);
        if (progressBarArray.length == count) {
            setTimeout(() => {
                pageURL === '/files' || pageURL === '/events' ? dispatch(getEventFoldersList(eventId)) : dispatch(getUserOrderedFoldersAction(orderNumber));
                handleClose()
                const message = response.message
                triggerNotifier({ type: 'success', message })
                setIsModal(false)
            }, 1000);
        }
    }

    // console.log('orderNumber', orderNumber);
    // console.log('fetchedFolderName', fetchedFolderName);
    // console.log('eventCode', eventCode);
    // console.log('folderName', folderName);

    const apiCall_backend = (data, count) => {
        return new Promise((res, rej) => {
            dispatch(uploadBulkFilesByOrderNumber(data, orderNumber, fetchedFolderName, 1)).then(response => {
                if (response.statusCode == 200) {
                    res(response);
                    progressBarArray.push(1);
                    modalHandler_backend(response, count)
                } else {
                    apiCall_backend(data, count);
                }
            })
        });
    }
    const fileApiCall_backend = (data, count) => {
        return new Promise((res, rej) => {
            dispatch(uploadBulkFiles(data, eventCode, folderName)).then((response) => {
                if (response.statusCode == 200) {
                    res(response);
                    progressBarArray.push(1);
                    modalHandler_backend(response, count)
                } else {
                    fileApiCall_backend(data, count);
                }
            })
        });
    }
    // ===============================================================
    // ===============================================================
    // ===============================================================
    // ===============================================================
    // ===============================================================
    // ===============================================================
    // ===============================================================
    // ===============================================================

    const apiCall = async (data) => {
        if(isDuplicateFolder){
            //If Folder already exist
            setDuplicateFolderErrorMessage(true)
            return
        }else {
            //If new folder
            data.forEach((x) => {
                let tempOrderNo = orderNumber;
                if(pageURL === '/preorders') {
                    tempOrderNo = orderNumber.replaceAll(' ', '');
                    console.log(tempOrderNo, 'tempOrderNo')
                }
                handleUpload(x , '/orderfiles/'+tempOrderNo+'/'+fetchedFolderName, data.length);
            });
        }
    }

    const fileApiCall = (data) => {
        if(isDuplicateFolder){
            //If Folder already exist
            setDuplicateFolderErrorMessage(true)
            return
        }else {
            //If new folder
            data.forEach(x => {
                handleUpload(x , '/events/'+eventCode+'/' +folderName, data.length);
            });
        }
    }

    const handleSubmit = async () => {
        console.log('inside handle submit')
        var data = new FormData();
        for (const key of Object.keys(files)) {
            console.log('inside for')
            data.append('files', files[key])
        }
        if (files && files.length === 0) {
            console.log('if')
            const saveData = {
                event_id: eventId,
                file_details: [],
                folder_name: folderName
            }
            if (validate()) {
                dispatch(saveFolderActions(saveData))
                handleClose()
                setInputError({})
            }
        }
        else {
            if (pageURL === '/orders' || pageURL === '/preorders' || pageURL === '/customer-accounts' || pageURL === '/files' ||  pageURL === '/events')  {
                const chunked = []
                const size = 500;
                const incomingFiles = [];
                for (let i = 0; i < Object.keys(files).length; i++) {
                    incomingFiles.push(Object.values(files)[i])
                }
                if(!is_backend_upload){
                    console.log('frontend');
                    if(!isDuplicateFolder){
                        setIsModal(true)
                    }
                    let response;
                    if (pageURL === '/files' || pageURL === '/events') {
                        response = fileApiCall(incomingFiles);
                    } else {
                        response = apiCall(incomingFiles);
                    }
                } else {
                    console.log('Backend');
                    for (let i = 0; i < incomingFiles.length; i += size) {
                        chunked.push(incomingFiles.slice(i, i + size))
                    }
                    for (let i = 0; i < chunked.length; i++) {
                        const temp = chunked[i];
                        const data1 = new FormData();
                        for (let ind = 0; ind < temp.length; ind++) {
                            data1.append('files', temp[ind]);
                        }
                        setIsModal(true)
                        const count = chunked.length;
                        let response;
                        if (pageURL === '/files' || pageURL === '/events') {
                            response = fileApiCall_backend(data1, count);
                        } else {
                            response = apiCall_backend(data1, count);
                        }
                    }
                }

                // Comment start related to chunk
                // --------------------------------------
                // for (let i = 0; i < incomingFiles.length; i += size) {
                //     chunked.push(incomingFiles.slice(i, i + size))
                // }
                // for (let i = 0; i < chunked.length; i++) {
                //     const temp = chunked[i];
                //     // const data1 = new FormData();
                //     const data1 = [];
                //     for (let ind = 0; ind < temp.length; ind++) {
                //         // data1.append('files', temp[ind]);
                //         data1.push(temp[ind]);
                //     }
                //     setIsModal(true)
                //     const count = chunked.length;
                //     let response;
                //     if (pageURL === '/files') {
                //         response = fileApiCall(data1, count);
                //     } else {
                //         response = apiCall(data1, count);
                //     }
                // }
                // Comment end related to Chunk
                // ----------------------------------------
                // for (let i = 0; i < chunked.length; i++) {
                //     const temp = chunked[i];
                //     const data1 = new FormData();
                //     for (let ind = 0; ind < temp.length; ind++) {
                //         data1.append('files', temp[ind]);
                //     }
                //     setIsModal(true)
                //     const count = chunked.length;
                //     let response;
                //     if(pageURL === '/files'){
                //         response = await fileApiCall(data1);
                //     } else {
                //         response = await apiCall(data1);
                //     }
                //     progressBarArray.push(1);
                //     setProgressPercentage((progressBarArray.length / count) * 100);
                //     if (progressBarArray.length == count) {
                //         setTimeout(() => {
                //             pageURL === '/files' ? dispatch(getEventFoldersList(eventId)) : dispatch(getUserOrderedFoldersAction(orderNumber));
                //             handleClose()
                //             const message = response.message
                //             triggerNotifier({ type: 'success', message })
                //             setIsModal(false)
                //         }, 1000);
                //     }
                // }

                // const response  =  dispatch(uploadBulkFilesByOrderNumber(data1, orderNumber, fetchedFolderName, 1));
                // setIsModal(true)
                // const count = chunked.length;
                // const is_folder_upload = 1;
                // if (response.statusCode === 200) {
                //         progressBarArray.push(1)
                //         setProgressPercentage((progressBarArray.length/count)*100)
                //         if(progressBarArray.length == count)  {
                //             setTimeout(() => {
                //                 dispatch(getUserOrderedFoldersAction(orderNumber));
                //                 handleClose()
                //                 const message = res.message
                //                 triggerNotifier({ type: 'success', message })
                //                 setIsModal(false)
                //             }, 1000);
                //         }
                //     }
                // })
                // }
            }
            // else {
            //     const chunked = []
            //     const size = 500;
            //     const incomingFiles = []
            //     for (let i = 0; i < Object.keys(files).length; i++) {
            //         incomingFiles.push(Object.values(files)[i])
            //     }
            //     for (let i = 0; i < incomingFiles.length; i += size) {
            //         chunked.push(incomingFiles.slice(i, i + size))
            //     }
            //     for (let i = 0; i < chunked.length; i++) {
            //         const temp = chunked[i]
            //         const data1 = new FormData();
            //         for (let ind = 0; ind < temp.length; ind++) {
            //             data1.append('files', temp[ind]);
            //         }
            //         setIsModal(true)
            //         const count = chunked.length;
            //         dispatch(uploadBulkFiles(data1, eventCode, folderName)).then((res) => {
            //             if (res.statusCode === 200) {
            //                 progressBarArray.push(1)
            //                 setProgressPercentage((progressBarArray.length / count) * 100)
            //                 if (progressBarArray.length == count) {
            //                     setTimeout(() => {
            //                         dispatch(getEventFoldersList(eventId))
            //                         handleClose()
            //                         const message = res.message
            //                         triggerNotifier({ type: 'success', message })
            //                         setIsModal(false)
            //                     }, 1000);
            //                 }
            //             }
            //         })
            //     }
            // }
        }
    }
    console.log('pageURL', pageURL);
    return (
        <>
            <ModelViewLayoutContainer
                handleClose={handleClose}
                isModalVisible={isModalVisible}
                handleSubmit={handleSubmit}
                title="Create Folder"
                id='create-folder'
            >
                <div className="create-folder">
                    <div className="mt-2">
                        <span className="modal-label">Folder Name</span>
                        <div className="inputfield">
                            <input type="text" name="folderName" autoComplete='off' placeholder="Enter Folder Name" className="form-input" onChange={handleChange} value={folderName} disabled={(pageURL === '/orders' || pageURL === '/preorders' || pageURL === '/customer-accounts') ? true : false} />
                        </div>
                        {inputError.folderName && (
                            <ErrorMessage message={inputError.folderName || ''} />
                        )}
                    </div>
                    <div className="section-divider">
                        <span className="or-label">Or</span>
                    </div>
                    <MyUploader />
                    <span className='mt-2'>{files.length} items selected.</span><br />
                    { duplicateFolderErrorMessage ? <span className='text-danger'>Error: Duplicate folder name is not allowed.</span> : '' }
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
                                    onClick={handleSubmit}
                                    className="modal-add"
                                    data-bs-toggle="modal" data-bs-target="#staticBackdrop"
                                    disabled={ (window.location.pathname !== '/events' &&  window.location.pathname !== '/files') ? files.length == 0 : folderName.length === 0 ? true : false}
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
                    progressPercentage={progressPercentage}
                    isModalVisible={isModal}
                    handleClose={handleClose}
                />)
            }
        </>
    )
}

CreateNewFolder.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.bool,
    eventId: PropTypes.number,
    files: PropTypes.array,
    folderData: PropTypes.array,
    MyUploader: PropTypes.func,
    eventCode: PropTypes.string,
    orderNumber: PropTypes.string

}

export default CreateNewFolder
