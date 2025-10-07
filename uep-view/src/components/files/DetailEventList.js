/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable react/no-unknown-property */
import React from 'react'
import { Breadcrumb } from 'antd';
import Button from 'shared/Button';
import { HiChevronRight } from 'react-icons/hi';
import deleteIcon from 'static/images/svg/delete-icon.svg';
import deleteIconWhite from './../../static/images/svg/delete-icon-white.svg';
import edit from 'static/images/svg/edit.svg';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFileDetails, getFileDetails, getEventDescriptionList, getPurchasedFileByFileId, removeFileAction, removeFileByFileIdAction, removeFolderAction } from 'actions/fileActions';
import PropTypes from 'prop-types';
import { useState } from 'react';
import DeleteEventModal from 'shared/DeleteEventModal';
import EditFile from './EditFile';
import CreateNewFile from './CreateNewFile';
import DetailFileModal from './DetailFileModal';
import { useDropzone } from 'react-dropzone';
import closeIcon from 'static/images/svg/close-icon.svg'
import upload from 'static/images/svg/upload-up-arrow.svg'
import Loader from 'shared/Loader';
import AddNewImages from './AddNewImages';
import { getOrderFilesByOrderNumberAction, removeAllOrderFileAction, sendPreOrderPurchasedFilesToUserAction } from 'actions/orderActions';
import SendFilesModal from 'shared/SendFilesModal';
import {
    getStorage,
    ref,
    deleteObject,
    listAll,
} from 'firebase/storage';
import { app } from '../../app/firebase';
import ProgressBarModal from './ProgressBarModal';
import _ from 'lodash';
function DetailEventList(props) {
    // eslint-disable-next-line react/prop-types
    const { backToOrder, folderId, eventListDescFunc, fileListingFunc, folderName, teamNumber, eventName, eventCode, eventId, orderNumber, orderDetailsFunc, deleteAllFilesHandler, isConfirmDeleteAll, setIsConfirmDeleteAll, confirmDeletAllFunc, preOrderNumber, preOrderListPageFunc , folderListFunc, history, goToEventSectionFunc, fileToOrderDetailsFunc, fileToFolderFunc, fileScroll } = props;
    const pageURL = window.location.pathname;
    const dispatch = useDispatch()
    useEffect(() => {
        if(pageURL === '/orders' || pageURL === '/preorders'){
            dispatch(getOrderFilesByOrderNumberAction(orderNumber, folderName))
        } else if(pageURL === '/customer-accounts'){
            dispatch(getOrderFilesByOrderNumberAction(orderNumber, folderName))
        } else {
            dispatch(getEventDescriptionList(folderId, eventId))
        }
    }, [ dispatch, folderId, eventId, orderNumber, pageURL, preOrderNumber, folderName ])

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        width: 375,
    }
    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '1px solid #CCCCCC',
        marginBottom: 8,
        marginRight: 7,
        width: 55,
        height: 55,
        boxSizing: 'border-box'
    }
    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden'
    }
    const img = {
        display: 'block',
        width: 55,
        height: 55,
    }
    const thumbButton = {
        position: 'absolute',
        background: '#00000000',
        color: '#ffffff',
        border: 0,
        cursor: 'pointer',
        marginTop: -9,
        marginLeft: 43,
        width: 16,
        height: 16,
    }
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false)
    const [ isConfirmDelete2, setIsConfirmDelete2 ] = useState(false)
    const [ isEditFile, setIsEditFile ] = useState(false)
    const [ isAddFile , setIsAddFile ] = useState(false)
    const [ isAddImage , setIsAddImage ] = useState(false)
    const [ isDetailEventModal , setIsDetailEventModal ] = useState(false)
    const [ editFileInfo , setEditFileInfo ] = useState({})
    const [ fileId , setFileId ] = useState([])
    const [ fileId2 , setFileId2 ] = useState([])
    const [ fileName , setfileName ] = useState([])
    const [ files, setFiles ] = useState([]);
    const [ isConfirm, setIsConfirm ] = useState(false);
    const [ selectedItems, setSelectedItems ] = useState([]);
    const [ selectedItems2, setSelectedItems2 ] = useState([]);
    const [ isModal, setIsModal ] = useState(false)
    const [ isModal2, setIsModal2 ] = useState(false)
    const [ progressPercentage, setProgressPercentage ] = useState(0)
    const [ progressPercentage2, setProgressPercentage2 ] = useState(0)
    const [ showDeleteText, setShowDeleteText ] = useState(true)
    const [ showDeleteBtn, setShowDeleteBtn ] = useState(true)
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ initialCurrentIndex, setInitialCurrentIndex ] = useState(0);
    const [ leftArrowPressed, setLeftArrowPressed ] = useState(false);
    const [ rightArrowPressed, setRightArrowPressed ] = useState(false);
    const [ upArrow, setUpArrow ] = useState(false);
    const [ upRightArrow, setUpRightArrow ] = useState(false);
    const [ downNotScrollFirst, setDownNotScrollFirst ] = useState(false);
    const [ upNotScrollFirst, setUpNotScrollFirst ] = useState(false);
    const [ rightNotScrollFirst, setRightNotScrollFirst ] = useState(false);
    const [ notSelFirstIndex, setNotSelFirstIndex ] = useState(true);
    const [ altSelect, setAltSelect ] = useState(false);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const isSendFiles = useSelector((state) => state.sendFilesIsLoading);
    const fileList = useSelector(state => state.eventDesc);
    const confirmDeletFunc = (id, file_url , file_name) => {
        // Commented below line as we have a issue when we cancel delete dialog box then all images get selected;
        // setFileId([ id ])
        // setSelectedItems([ file_url || file_name ])
        setIsConfirmDelete(!isConfirmDelete)
    }
    const confirmDeletFunc2 = (id, file_url , file_name) => {
        setFileId2([ id ])
        setSelectedItems2([ file_url || file_name ])
        setIsConfirmDelete2(!isConfirmDelete2)
    }
    const confirmDeletforOrder = (id, file_name) => {
        setFileId2([ id ])
        setSelectedItems2([ file_name ])
        setIsConfirmDelete2(!isConfirmDelete2)
    }
    const editFileFunc = (data) => {
        setIsEditFile(!isEditFile)
        setEditFileInfo(data)
    }
    const addFileFunc = () => {
        setIsAddFile(!isAddFile)
    }
    const addImagesFunc = () => {
        setIsAddImage(!isAddImage)
    }
    const fileDetailHandler = (id , file_name , file_url) => {
        setIsDetailEventModal(!isDetailEventModal)
        setFileId2([ id ])
        setfileName( file_url || file_name )
        window.location.pathname === '/orders' || window.location.pathname === '/preorders' ? dispatch(getPurchasedFileByFileId(id)) : window.location.pathname === '/customer-accounts' ? dispatch(getPurchasedFileByFileId(id)) : dispatch(getFileDetails(id, folderId, eventId))
    }
    const handleClose = () => {
        setIsEditFile(false)
        setIsAddFile(false)
        setIsAddImage(false)
        setIsDetailEventModal(false)
        dispatch(fetchFileDetails([]))
    }
    const deleteFileFunc2 = () => {
        setIsConfirmDelete(!isConfirmDelete)
        setIsDetailEventModal(!isDetailEventModal)
        const data = { order_number: orderNumber }
        const sendIdData = {
            file_ids: fileId
        };
        const sendIdDataById = {
            file_id: fileId
        };
        window.location.pathname === '/orders' || window.location.pathname === '/preorders'  ?
            dispatch(removeFileByFileIdAction(sendIdDataById, data,folderName))
            :  window.location.pathname === '/customer-accounts' ?
                dispatch(removeFileByFileIdAction(sendIdDataById, data, folderName))
                :
                dispatch(removeFileAction(sendIdData, folderId, eventId))
        setIsDetailEventModal(false)
        setIsEditFile(false)
    }
    const deleteFileFunc = () => {
        setIsConfirmDelete(!isConfirmDelete)
        setIsDetailEventModal(!isDetailEventModal)
        const sendIdData = {
            file_ids: fileId
        };
        dispatch(removeFileAction(sendIdData, folderId, eventId))
        setIsDetailEventModal(false)
        setIsEditFile(false)
    }
    const handleCloseModal = () => {
        setIsAddImage(false)
        setIsAddFile(false)
        if(window.location.pathname === '/orders' || window.location.pathname === '/preorders'){
            dispatch(getOrderFilesByOrderNumberAction(orderNumber, folderName))
        }
        if(window.location.pathname === '/customer-accounts'){
            dispatch(getOrderFilesByOrderNumberAction(orderNumber, folderName))
        }
        if(window.location.pathname === '/files'){
            // dispatch(getEventDescriptionList(folderId, eventId))
        }
    }
    const handleEventDetailsChange = () => {
        console.log('change');
    }
    const handleEventDetails = () => {
        console.log('submit');
    }
    const sendPreOrderPurchasedFilesFunc = (item) => {
        console.log(isSendFiles)
        const data = {
            order_number: item
        }
        setIsConfirm(!isConfirm);
        dispatch(sendPreOrderPurchasedFilesToUserAction(data))
    }
    const confirmSendFilesFunc = () => {
        setIsConfirm(!isConfirm);
    };
    const goToFileSectionFunc = () => {
        history.push('/files')
    }
    const MyUploader = () => {
        const { getRootProps, getInputProps } = useDropzone({
            accept: 'image/*',
            onDrop: acceptedFiles => {
                setFiles(acceptedFiles.map(file => Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })));
            }
        });
        const deleteHandler = (idx) => {
            const clickedImgIdx = files.splice(idx, 1);
            console.log(clickedImgIdx);
            const filteredImages = files.filter((image) => image !== idx);
            setFiles(filteredImages)
        }
        const thumbs = files.map((file, index) => (
            <div style={ thumb } key={ file.name }>
                <div style={ thumbInner }>
                    <img
                        src={ file.preview }
                        style={ img }
                        alt="img"
                    />
                    <img src= { closeIcon } alt="close" style={ thumbButton } onClick={ () => deleteHandler(index) } />
                </div>
            </div>
        ));
        return (
            <section className=" ">
                <div { ...getRootProps({ className: 'dropzone' }) }>
                    <input { ...getInputProps() } />
                    <div className="drag-wrapper">
                        <img src={ upload } alt="upload-img" className="upload-img" />
                        <div className="upload-lbl">Browse <br />or <br />Drag and drop</div>
                    </div>
                </div>
                <aside style={ thumbsContainer }>
                    {thumbs}
                </aside>
            </section>
        );
    }

    // ================ Alt Key Selection ====================
    // =======================================================
    const handleAltKeySelect = async (current_index) => {
        let prevSelectedElemIndex = 0;
        if(fileId.length > 0){
            const prevSelectedElem = fileId[ fileId.length - 1 ];
            prevSelectedElemIndex = await fileList.findIndex((element) => element.id === prevSelectedElem);
        }
        const selectedIds =  [ ...new Set(await fileList.slice(prevSelectedElemIndex , current_index+1).map((file) => file.id)) ];
        let selectedUrls = []
        if(window.location.pathname === '/orders' || window.location.pathname === '/preorders' || window.location.pathname === '/customer-accounts'){
            selectedUrls = [ ...new Set(await fileList.slice(prevSelectedElemIndex , current_index+1).map((file) => file?.file_name )) ];
        } else {
            selectedUrls = [ ...new Set(await fileList.slice(prevSelectedElemIndex , current_index+1).map((file) => file?.file_url )) ];
        }

        setSelectedItems([ ...new Set([ ...selectedItems, ...selectedUrls ]) ]);
        setFileId([ ...new Set([ ...fileId, ...selectedIds ]) ]);
        setInitialCurrentIndex(current_index)
        setCurrentIndex(current_index)
        setAltSelect(true)
    };
    // ------------------------------------------------------------
    // ------------------------------------------------------------

    const handleItemSelect = (e , file_url, id, index) => {
        if (selectedItems.includes(file_url)) {
            setSelectedItems(selectedItems.filter(item => item !== file_url));
            setCurrentIndex(0)
            setInitialCurrentIndex(0)
            setLeftArrowPressed(false)
            setRightArrowPressed(false)
            setUpArrow(false)
            setUpRightArrow(false)
            setDownNotScrollFirst(false)
            setUpNotScrollFirst(false)
            setRightNotScrollFirst(false)
            setNotSelFirstIndex(true)
        } else {
            setSelectedItems([ ...selectedItems, file_url ]);
            setCurrentIndex(index)
            setInitialCurrentIndex(index)
        }
        if (fileId.includes(id)) {
            setFileId(fileId.filter(item => item !== id));
            setCurrentIndex(0)
            setInitialCurrentIndex(0)
            setLeftArrowPressed(false)
            setRightArrowPressed(false)
            setUpArrow(false)
            setUpRightArrow(false)
            setDownNotScrollFirst(false)
            setUpNotScrollFirst(false)
            setRightNotScrollFirst(false)
            setNotSelFirstIndex(true)
        } else {
            setFileId([ ...fileId, id ]);
            setCurrentIndex(index)
            setInitialCurrentIndex(index)
        }
        if(window.location.pathname === '/orders' || window.location.pathname === '/preorders' || window.location.pathname === '/customer-accounts'){
            setShowDeleteBtn(true)
        }

        if(e.nativeEvent.shiftKey ){
            handleAltKeySelect(index);
            return;
        }
        // setCurrentIndex(index)
        // setInitialCurrentIndex(index)
    };

    const handleSelectAll = () => {
        if (selectedItems.length === fileList.length) {
            setSelectedItems([]);
            setFileId([]);
            setFileId2([]);
            setCurrentIndex(0);
            setInitialCurrentIndex(0);
            setLeftArrowPressed(false)
            setRightArrowPressed(false)
            setUpArrow(false)
            setUpRightArrow(false)
            setDownNotScrollFirst(false)
            setUpNotScrollFirst(false)
            setRightNotScrollFirst(false)
            setNotSelFirstIndex(true)
        } else {
            const allItemUrls = fileList.map(file => (file.file_url || file.file_name));
            const allItemIds = fileList.map(file => file.id);
            setSelectedItems(allItemUrls);
            setFileId(allItemIds);
        }
        if(window.location.pathname === '/orders' || window.location.pathname === '/preorders' || window.location.pathname === '/customer-accounts'){
            setShowDeleteBtn(false)
        }
    };

    useEffect(()=>{
        const deletedId = localStorage.getItem('deletedFileIds');
        if(deletedId){
            const parsedDeletedId = JSON.parse(deletedId);
            const data = { order_number: orderNumber };
            const sendIdData = { file_ids: parsedDeletedId };
            const sendIdDataById = { file_id: parsedDeletedId };
            window.location.pathname === '/orders' || window.location.pathname === '/preorders' ?
                dispatch(removeFileByFileIdAction(sendIdDataById, data, folderName))
                : window.location.pathname === '/customer-accounts' ?
                    dispatch(removeFileByFileIdAction(sendIdDataById, data, folderName))
                    :
                    dispatch(removeFileAction(sendIdData, folderId, eventId));
            localStorage.removeItem('deletedFileIds');
        }
    }, [])
    const handleDelete = async () => {
        if (selectedItems.length === 0) {
            return;
        }
        const storage = getStorage(app);
        const totalFilesToDelete = selectedItems.length;
        let filesDeleted = 0;
        const deletedFileIds = [];
        const deleteFile = async (item) => {
            const path = item.file_url || item.file_name;
            const storageRef = ref(storage, path);
            try {
                await deleteObject(storageRef);
                filesDeleted++;
                const progress = (filesDeleted / totalFilesToDelete) * 100;
                console.log(`File ${ item.file_name } deleted. Progress: ${ progress.toFixed(2) }%`);
                deletedFileIds.push(item.id);
                localStorage.setItem('deletedFileIds', JSON.stringify(deletedFileIds));
            } catch (error) {
                console.error(`Error deleting file ${ item.file_name }:`, error);
            }
        };
        setIsModal(true);
        const batchDeleteSize = 10;
        const selectedItemsCopy = [ ...selectedItems ];
        const deletePromises = [];
        while (selectedItemsCopy.length > 0) {
            const batch = selectedItemsCopy.splice(0, batchDeleteSize);
            deletePromises.push(
                Promise.all(batch.map(async (itemId) => {
                    const item = fileList.find((file) => (file.file_url || file.file_name) === itemId);
                    if (item) {
                        await deleteFile(item);
                    }
                }))
            );
        }
        setIsConfirmDelete(false);
        setSelectedItems([]);
        setCurrentIndex(0);
        setInitialCurrentIndex(0);
        await Promise.all(deletePromises);
        const data = { order_number: orderNumber };
        const sendIdData = { file_ids: fileId };
        const sendIdDataById = { file_id: fileId };
        setProgressPercentage(100);
        let msg = undefined;
        if (window.location.pathname === '/files' || window.location.pathname === '/events') {
            if (selectedItems?.length === fileList.length || selectedItems2.length === fileList.length) {
                msg = 'message'
            }
        }
        setTimeout(() => {
            window.location.pathname === '/orders' || window.location.pathname === '/preorders'
                ? dispatch(removeFileByFileIdAction(sendIdDataById, data, folderName))
                : window.location.pathname === '/customer-accounts'
                    ? dispatch(removeFileByFileIdAction(sendIdDataById, data, folderName))
                    : dispatch(removeFileAction(sendIdData, folderId, eventId, msg));
            setIsModal(false);
            localStorage.removeItem('deletedFileIds');
            setIsDetailEventModal(false);
            setIsEditFile(false);
            setIsConfirmDelete(false);
            setFileId([]);
            setFileId2([]);
        }, 1000);
        setTimeout(() => {
            const sendFolderData = {
                folder_id: folderId
            };
            if (window.location.pathname === '/files' || window.location.pathname === '/events') {
                if (selectedItems?.length === fileList.length || selectedItems2.length === fileList.length) {
                    dispatch(removeFolderAction(sendFolderData, eventId))
                    window.location.pathname === '/events' ? fileListingFunc() : eventListDescFunc()
                }
            }
        }, 1200);
    };

    const handleUploadFromAllBtn = async () => {
        if (selectedItems2.length === 0) {
            return;
        }
        const storage = getStorage(app);
        const totalFilesToDelete = selectedItems2.length;
        let filesDeleted = 0;
        const deleteFile = async (item) => {
            const path = item.file_url || item.file_name;
            const storageRef = ref(storage, path);
            try {
                await deleteObject(storageRef);
                filesDeleted++;
                const progress = (filesDeleted / totalFilesToDelete) * 100;
                setProgressPercentage2(progress);
                console.log(`File ${ item.file_name } deleted. Progress: ${ progress.toFixed(2) }%`);
            } catch (error) {
                console.error(`Error deleting file ${ item.file_name }:`, error);
            }
        };
        setIsModal(true);
        await Promise.all(selectedItems2.map(async (itemId) => {
            const item = fileList.find((file) => (file.file_url || file.file_name) === itemId);
            if (item) {
                await deleteFile(item);
            }
        }));
        setIsConfirmDelete2(false);
        let msg = undefined;
        if (window.location.pathname === '/files' || window.location.pathname === '/events') {
            if (selectedItems?.length === fileList.length || selectedItems2.length === fileList.length) {
                msg = 'message'
            }
        }
        setTimeout(() => {
            setIsModal(false);
            const data = { order_number: orderNumber };
            // const sendIdData = { file_ids: fileId };
            const sendIdData = { file_ids: fileId2.length == 0 ? fileId : fileId2 };
            const sendIdDataById = { file_id: fileId2 };
            window.location.pathname === '/orders' || window.location.pathname === '/preorders' ?
                dispatch(removeFileByFileIdAction(sendIdDataById, data, folderName))
                : window.location.pathname === '/customer-accounts' ?
                    dispatch(removeFileByFileIdAction(sendIdDataById, data, folderName))
                    :
                    dispatch(removeFileAction(sendIdData, folderId, eventId, msg));
            setIsDetailEventModal(false);
            setIsEditFile(false);
            setIsConfirmDelete2(false)
        }, 1000);
        setSelectedItems([]);
        setFileId([]);
        setFileId2([]);
        setCurrentIndex(0);
        setInitialCurrentIndex(0);
        setTimeout(() => {
            const sendFolderData = {
                folder_id: folderId
            };
            if (window.location.pathname === '/files' || window.location.pathname === '/events') {
                if (selectedItems?.length === fileList.length || selectedItems2.length === fileList.length) {
                    dispatch(removeFolderAction(sendFolderData, eventId))
                    window.location.pathname === '/events' ? fileListingFunc() : eventListDescFunc()
                }
            }
        }, 1200);
    };
    async function deleteAllFiles() {
        const allItemIds = fileList.map(file => file.id);
        const storage = getStorage(app);
        setIsModal(true);
        setProgressPercentage(0);
        let folderPath;
        if(teamNumber && teamNumber != undefined){
            folderPath = (pageURL === '/orders' || pageURL === '/customer-accounts' || pageURL === '/preorders') ? `/orderfiles/${ orderNumber }/${ teamNumber }` : `/events/${ eventCode }/${ folderName }`;
        }
        else{
            folderPath = (pageURL === '/orders' || pageURL === '/customer-accounts' || pageURL === '/preorders') ? `/orderfiles/${ orderNumber }/${ folderName }` : `/events/${ eventCode }/${ folderName }`;
        }
        const folderRef = ref(storage, folderPath);
        try {
            const items = await listAll(folderRef);
            const deletePromises = items.items.map(async (item) => {
                await deleteObject(item);
            });
            await Promise.all(deletePromises);
            console.log(`Folder "${ folderPath }" deleted successfully.`);
        } catch (error) {
            console.error(`Error deleting folder "${ folderPath }":`, error);
        }
        setProgressPercentage(100);
        setTimeout(() => {
            setIsModal(false);
            setIsConfirmDeleteAll(!isConfirmDeleteAll)
            const sendIdData = {
                folder_id: folderId || allItemIds
            };
            const sendIdOrderData = {
                order_number: orderNumber,
                folder_name: folderName
            };
            const sendIdDataById = { file_id: fileId2.length == 0 ? allItemIds : fileId2 };
            const data = { order_number: orderNumber };
            window.location.pathname === '/orders' || window.location.pathname === '/preorders' || window.location.pathname === '/customer-accounts'?
            // dispatch(removeAllOrderFileAction(sendIdOrderData, folderName))
                dispatch(removeFileByFileIdAction(sendIdDataById, data, folderName))
                :
                (dispatch(removeFolderAction(sendIdData, eventId)))
        }, 1000);
    }

    const handleItemSelectFromKeys = (fileUrl, id) => {
        if(!fileUrl || !id){
            return;
        }
        // // if you want to de-select the alt Selected file then remove the brackets of && condition
        // if ((selectedItems.includes(fileUrl) || fileId.includes(id)) && !altSelect) {
        //     setSelectedItems(selectedItems.filter(item => item !== fileUrl));
        //     setFileId(fileId.filter(item => item !== id));
        //     console.log("working >> 1");
        // } else {
        //     setSelectedItems([ ...selectedItems, fileUrl ]);
        //     setFileId([ ...fileId, id ]);
        //     console.log("working >> 2");
        // }

        // this code removing duplicate item from selectedItems and fileId
        const uniqueSelectedItems = new Set(selectedItems);
        const uniqueFileId = new Set(fileId);

        if ((uniqueSelectedItems.has(fileUrl) || uniqueFileId.has(id)) && !altSelect) {
            uniqueSelectedItems.delete(fileUrl);
            uniqueFileId.delete(id);
        } else {
            uniqueSelectedItems.add(fileUrl);
            uniqueFileId.add(id);
        }

        setSelectedItems([ ...uniqueSelectedItems ]);
        setFileId([ ...uniqueFileId ]);
    };

    const handleRowSelectFromKeys = (startIndex, endIndex, actionType, fileUrl, id) => {
        const selectedUrls = fileList.slice(startIndex, endIndex).map((file, index) => {
            return file?.file_url ? file?.file_url : file?.file_name;
        });
        const selectedIds = fileList.slice(startIndex, endIndex).map((file) => file.id);

        if (actionType === 'up') {
            const newSelectedItems = selectedUrls.filter(url => !selectedItems.includes(url));
            const newSelectedIds = selectedIds.filter(id => !fileId.includes(id));

            const updatedSelectedItems = selectedItems.filter(item => !selectedUrls.includes(item));
            const updatedFileId = fileId.filter(fileIdItem => !selectedIds.includes(fileIdItem));

            if (initialCurrentIndex === currentIndex) {
                // setSelectedItems([ ...selectedItems, ...newSelectedItems ]);
                // setFileId([ ...fileId, ...newSelectedIds ]);
                setSelectedItems([ ...updatedSelectedItems, ...newSelectedItems ]);
                setFileId([ ...updatedFileId, ...newSelectedIds ]);
            } else {
                setSelectedItems([ ...updatedSelectedItems, ...newSelectedItems ]);
                setFileId([ ...updatedFileId, ...newSelectedIds ]);
            }
        } else if (actionType === 'down') {
            const newSelectedItems = selectedUrls.filter(url => !selectedItems.includes(url));
            const newSelectedIds = selectedIds.filter(id => !fileId.includes(id));

            const updatedSelectedItems = selectedItems.filter(item => !selectedUrls.includes(item));
            const updatedFileId = fileId.filter(fileIdItem => !selectedIds.includes(fileIdItem));

            const isFirstItemSelected = fileList[ 0 ] === fileList[ startIndex ];
            if (initialCurrentIndex === currentIndex || rightArrowPressed) {
                setSelectedItems([ ...selectedItems, ...newSelectedItems ]);
                setFileId([ ...fileId, ...newSelectedIds ]);
            } else {
                if (isFirstItemSelected && notSelFirstIndex || altSelect) {
                    setSelectedItems([ ...selectedItems, ...newSelectedItems ]);
                    setFileId([ ...fileId, ...newSelectedIds ]);
                } else {
                    setSelectedItems([ ...updatedSelectedItems, ...newSelectedItems ]);
                    setFileId([ ...updatedFileId, ...newSelectedIds ]);
                }
            }
        }
    };
    const handleKeyDown = (e) => {
        const myElement = document.getElementById('filesContainer');
        const filesPerRow = parseInt(myElement.offsetWidth / 245);

        if (e.shiftKey && fileId.length === 0 && selectedItems.length === 0) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            // if (e.key === 'ArrowRight') {
                setCurrentIndex(0);
                setNotSelFirstIndex(true)
                handleItemSelectFromKeys(fileList[ 0 ].file_url ? fileList[ 0 ].file_url : fileList[ 0 ].file_name, fileList[ 0 ]?.id);
                fileScroll.scrollTo(0, fileScroll.scrollTop);
                if(selectedItems.length === 0 && fileId.length === 0){
                    setInitialCurrentIndex(fileList?.length)
                    if(upArrow){
                        setCurrentIndex(1);
                    }
                }
                return;
            }
        }

        if (e.shiftKey) {
            if (e.key === 'ArrowRight') {
                if (currentIndex < fileList.length - 1) {
                    // const nextIndex = currentIndex + 1;
                    const nextIndex = leftArrowPressed || upArrow ? currentIndex: currentIndex + 1;
                    setCurrentIndex(nextIndex);
                    if (initialCurrentIndex != nextIndex || altSelect) {
                        handleItemSelectFromKeys(fileList[ nextIndex ]?.file_url ? fileList[ nextIndex ]?.file_url : fileList[ nextIndex ]?.file_name, fileList[ nextIndex ]?.id);
                        if (window.location.pathname === '/orders' || window.location.pathname === '/preorders') {
                            rightNotScrollFirst ? fileScroll.scrollTo(0, fileScroll.scrollTop + 42) : fileScroll.scrollTo(0, fileScroll.scrollTop + 0);
                        }
                        else {
                            rightNotScrollFirst ? fileScroll.scrollTo(0, fileScroll.scrollTop + 46.8) : fileScroll.scrollTo(0, fileScroll.scrollTop + 0);
                        }
                        setLeftArrowPressed(false)
                        setRightArrowPressed(true)
                        setUpArrow(false)
                        setUpRightArrow(true)
                        setDownNotScrollFirst(false)
                        setUpNotScrollFirst(false)
                        setRightNotScrollFirst(true)
                        setNotSelFirstIndex(true)
                        setAltSelect(false)
                    }
                }
            } else if (e.key === 'ArrowLeft') {
                if (currentIndex !== null && currentIndex >= 0) {
                    // const prevIndex = currentIndex;
                    const prevIndex = leftArrowPressed || upArrow ? currentIndex-1 : currentIndex;
                    if (initialCurrentIndex != currentIndex || altSelect) {
                        handleItemSelectFromKeys(fileList[ prevIndex ]?.file_url ? fileList[ prevIndex ]?.file_url : fileList[ prevIndex ]?.file_name, fileList[ prevIndex ]?.id);
                        if (window.location.pathname === '/orders' || window.location.pathname === '/preorders') {
                            fileScroll.scrollTo(0, fileScroll.scrollTop - 42);
                        }
                        else {
                            fileScroll.scrollTo(0, fileScroll.scrollTop - 46.8);
                        }
                    }
                    setLeftArrowPressed(false)
                    setRightArrowPressed(false)
                    setUpArrow(false)
                    // setUpRightArrow(false)
                    setUpRightArrow(true)
                    setDownNotScrollFirst(false)
                    setUpNotScrollFirst(false)
                    setRightNotScrollFirst(false)
                    setNotSelFirstIndex(true)
                    setCurrentIndex(prevIndex - 1);
                    setAltSelect(false)
                }
            }
        }
        // for row selection
        if (e.shiftKey) {
            // if (e.key === 'ArrowDown' && fileList.length - 1 !== currentIndex) {
            if (e.key === 'ArrowDown') {
                if (currentIndex <= fileList.length - 1) {
                    // const nextIndex = currentIndex + filesPerRow;
                    const itemsInLastRow = fileList.length % filesPerRow || filesPerRow;
                    const isLastRow = (currentIndex + itemsInLastRow) > fileList.length - 1;
                    const nextIndex = isLastRow ? currentIndex + itemsInLastRow : currentIndex + filesPerRow;
                    handleRowSelectFromKeys(currentIndex, nextIndex, 'down');
                    setCurrentIndex(nextIndex);
                    // fileScroll.scrollTo(0, fileScroll.scrollTop+170);
                    if (window.location.pathname === '/orders' || window.location.pathname === '/preorders') {
                        downNotScrollFirst ? fileScroll.scrollTo(0, fileScroll.scrollTop + 210) : fileScroll.scrollTo(0, fileScroll.scrollTop + 50);
                    }
                    else {
                        downNotScrollFirst ? fileScroll.scrollTo(0, fileScroll.scrollTop + 234) : fileScroll.scrollTo(0, fileScroll.scrollTop + 50);
                    }
                    setLeftArrowPressed(true)
                    setRightArrowPressed(false)
                    setUpArrow(false)
                    setUpRightArrow(false)
                    setDownNotScrollFirst(true)
                    setUpNotScrollFirst(false)
                    setRightNotScrollFirst(false)
                    setNotSelFirstIndex(false)
                    // setAltSelect(true)
                    // }
                }
            } else if (e.key === 'ArrowUp') {
                if (currentIndex !== null && currentIndex >= 0) {
                    // const prevIndex = currentIndex>filesPerRow?currentIndex - filesPerRow : 0;
                    const prevIndex = upRightArrow ? currentIndex + 1 : (currentIndex > filesPerRow ? currentIndex - filesPerRow : 0);
                    // if (initialCurrentIndex !== currentIndex) {
                    handleRowSelectFromKeys(prevIndex, currentIndex, 'up' );
                    // }
                    setLeftArrowPressed(false)
                    setRightArrowPressed(false)
                    setUpArrow(true)
                    setCurrentIndex(prevIndex);
                    setUpRightArrow(false)
                    setDownNotScrollFirst(false)
                    setRightNotScrollFirst(false)
                    setNotSelFirstIndex(false)
                    // setAltSelect(true)
                    // fileScroll.scrollTo(0, fileScroll.scrollTop-200);
                    if (window.location.pathname === '/orders' || window.location.pathname === '/preorders') {
                        upNotScrollFirst ? fileScroll.scrollTo(0, fileScroll.scrollTop - 210) : fileScroll.scrollTo(0, fileScroll.scrollTop - 200);
                    }
                    else {
                        upNotScrollFirst ? fileScroll.scrollTo(0, fileScroll.scrollTop - 234) : fileScroll.scrollTo(0, fileScroll.scrollTop - 200);
                    }
                    setUpNotScrollFirst(true)
                }
            }
        }
    };

    const debouncedHandleKeyDown = _.debounce(handleKeyDown, 100);

    useEffect(() => {
        document.addEventListener('keydown', debouncedHandleKeyDown);
        return () => {
            document.removeEventListener('keydown', debouncedHandleKeyDown);
        };
    }, [ currentIndex, selectedItems, fileId, debouncedHandleKeyDown ]);

    return (
        <>
            <div className="event-files-desc-page">
                <div className="event-header pb-3">
                    <div className="d-flex justify-content-between align-items-center">
                        {
                            window.location.pathname === '/preorders' ? (
                                <div className="heading">Pre Order Files</div>
                            )
                                :
                                <div className="heading">Files</div>
                        }
                        <div className='d-flex'>
                            {selectedItems?.length > 0 && fileList.length > 0 ? <div className='d-flex align-items-center'>
                                <div className="select-all-checkbox align-items-center d-flex mt-1">
                                    <input
                                        style={ { opacity: 1, width: '20px', height: '20px', marginRight: '8px', backgroundColor: '#FFFFFFC7', zIndex: 2 } }
                                        type="checkbox"
                                        className="form-check-input mb-1 "
                                        checked={ selectedItems?.length === fileList.length || selectedItems2.length === fileList.length }
                                        onChange={ handleSelectAll }
                                    />
                                    Select All
                                </div>
                                {showDeleteBtn && <button
                                    disabled={ fileList.length <= 0 }
                                    className="create-btn me-3 d-flex align-items-center justify-content-center pointer"
                                    // buttonName="Delete All"
                                    onClick= { () => setIsConfirmDelete(true) }
                                    // onClick= { () => confirmDeletFunc() }
                                >
                                    <img
                                        src={ deleteIconWhite }
                                        alt="Trash"
                                        width="12"
                                        height="14"
                                        className="trash-icon me-2"
                                    />
                                    Delete
                                </button>}
                            </div> : ' '
                            }
                            { !showDeleteBtn || selectedItems?.length === 0 ?
                                window.location.pathname === '/orders' || window.location.pathname === '/preorders' || window.location.pathname === '/customer-accounts'  ? (
                                    <button
                                        disabled={ fileList.length <= 0 }
                                        className="create-btn me-3 d-flex align-items-center justify-content-center pointer"
                                        buttonName="Delete All"
                                        onClick= { () => confirmDeletAllFunc(folderName) }
                                        // onClick= { () => deleteAllFiles(folderName) }
                                    >
                                        <img
                                            src={ deleteIconWhite }
                                            alt="Trash"
                                            width="12"
                                            height="14"
                                            className="trash-icon me-2"
                                        />
                                        { selectedItems?.length === fileList.length || selectedItems2.length === fileList.length ? 'Delete' : 'Delete All' }
                                        {/* Delete All */}
                                    </button>
                                ) : ''
                                : '' }
                            <Button
                                className="create-btn me-3"
                                buttonName="+  Add Video"
                                handleSubmit= { () => addFileFunc() }
                            />
                            <Button
                                className="create-btn"
                                buttonName="+  Add Images"
                                handleSubmit= { () => addImagesFunc() }
                            />
                        </div>
                    </div>
                    <div className='d-flex justify-content-between align-items-center'>
                        {
                            window.location.pathname === '/orders' ? (
                                <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                    <Breadcrumb.Item className="pointer" onClick={ () => backToOrder() }>Orders</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" onClick={ () => orderDetailsFunc() }>Orders Details</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" onClick={ () => folderListFunc() }>{ folderName }</Breadcrumb.Item>
                                    <Breadcrumb.Item>{ orderNumber }</Breadcrumb.Item>
                                </Breadcrumb>
                            ) : window.location.pathname === '/preorders' ? (
                                <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                    <Breadcrumb.Item className="pointer" onClick={ () => preOrderListPageFunc() } >Pre Order</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" onClick={ () => folderListFunc() }>{ orderNumber }</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" >{ folderName }</Breadcrumb.Item>
                                </Breadcrumb>
                            ) : window.location.pathname === '/events' ? (
                                <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                    <Breadcrumb.Item className="pointer" onClick={ () => goToEventSectionFunc() }>Events</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" onClick={ () => goToFileSectionFunc() }>Folders</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" onClick={ () => fileListingFunc() }>{ eventName }</Breadcrumb.Item>
                                    <Breadcrumb.Item>{ folderName }</Breadcrumb.Item>
                                </Breadcrumb>
                            ) : window.location.pathname === '/customer-accounts' ? (
                                <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                    <Breadcrumb.Item className="pointer" onClick={ () => window.location.reload() }>Customers</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" onClick={ () => fileToOrderDetailsFunc() }>Order Details</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" onClick={ () => fileToFolderFunc() }>Folders</Breadcrumb.Item>
                                    <Breadcrumb.Item>{ folderName }</Breadcrumb.Item>
                                </Breadcrumb>
                            ) : (
                                <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                    <Breadcrumb.Item>Events</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" onClick={ () => fileListingFunc() }>Folders</Breadcrumb.Item>
                                    <Breadcrumb.Item className="pointer" onClick={ () => eventListDescFunc() }>{ eventName }</Breadcrumb.Item>
                                    <Breadcrumb.Item>{ folderName }</Breadcrumb.Item>
                                </Breadcrumb>
                            )
                        }
                    </div>
                </div>
                { isLoading && <div className="mt-5" ><Loader /></div> }
                { !isLoading &&
                    <div className="event-folder-wrapper pt-4">
                        <div className="d-flex flex-wrap" id='filesContainer'>
                            {
                                Array.from(fileList)?.map((file, index) => (
                                    <>
                                        <div key={ file.id } >
                                            <div className="card pointer" >
                                                <input
                                                    type="checkbox"
                                                    style={ { opacity: 1, width: '20px', height: '20px', marginLeft: '200px', marginTop: '10px', position: 'absolute', backgroundColor: '#FFFFFFC7', zIndex: 2 } }
                                                    className="form-check-input"
                                                    checked={ selectedItems.includes(file.file_url) || selectedItems.includes(file.file_name) }
                                                    onChange={ (event) => handleItemSelect(event , file.file_url ? file.file_url : file.file_name, file.id, index) }
                                                />
                                                <div onClick={ () => fileDetailHandler(file.id , file.file_name , file.file_url) }>
                                                    {
                                                        file.file_type !== 'VIDEO' ?
                                                            <img src={ file.file_url ? file.file_url+'?' : file.file_name } className="desc-img" alt="folder-img"/>

                                                            // <img src={ file.file_url ? file.file_url+'?' + performance.now() : file.file_name } alt="folder-img" className="desc-img"/>
                                                            :
                                                            <video src={ file.file_url ? file.file_url+'?' : file.file_name } preload="metadata" alt="folder-img" className="desc-vid" style={ { objectFit: 'fill' } }
                                                            // Do not Delete this it is for testing purpose after removing performance.now() video thumbnail fluctuation issue os resolve

                                                            // <video src={ file.file_url ? file.file_url+'?'+performance.now() : file.file_name } preload="metadata" alt="folder-img" className="desc-img" style={ { objectFit: 'fill' } }
                                                            />
                                                    }
                                                    <div className="card-body" style={ { paddingTop: 10 } }>
                                                        <div className="img-name my-1">{ file.file_name.replace(/^.*[\\/]/, '') }</div>
                                                        <div className="d-flex mb-2">
                                                            {
                                                                (window.location.pathname !== '/orders' && window.location.pathname !== '/preorders')  ? (
                                                                    <div>
                                                                        <span className="dwnld-lbl">Download Count:</span>
                                                                        <span className="dwnld-cnt">&nbsp;{ file.download_count }</span>
                                                                    </div>
                                                                ) : ''
                                                            }
                                                        </div>
                                                        <div className="d-flex">
                                                            <div className="event-date">
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="action-wrapper">
                                                {
                                                    (window.location.pathname !== '/orders' && window.location.pathname !== '/preorders' && window.location.pathname !== '/customer-accounts') ? (
                                                        <img
                                                            src={ edit }
                                                            alt="folder-img"
                                                            width="22"
                                                            className="me-3 pointer"
                                                            onClick={ () => editFileFunc(file) }
                                                        />
                                                    ) : ''
                                                }
                                                <img
                                                    src={ deleteIcon }
                                                    alt="folder-img"
                                                    width="17"
                                                    className="pointer"
                                                    onClick={ () => confirmDeletFunc2(file.id, file.file_url , file.file_name) }
                                                />
                                            </div>
                                        </div>
                                    </>
                                ))
                            }
                            { fileList.length === 0 ? <><p className="m-auto mt-5">No data found</p></> : '' }
                            { isConfirmDelete && (
                                <DeleteEventModal
                                    isModalVisible = { isConfirmDelete }
                                    handleClose = { confirmDeletFunc }
                                    handleSubmit={ () => handleDelete() }
                                />
                            )}
                            { isConfirmDelete2 && (
                                <DeleteEventModal
                                    isModalVisible = { isConfirmDelete2 }
                                    handleClose = { confirmDeletFunc2 }
                                    handleSubmit={ () => handleUploadFromAllBtn() }
                                />
                            )}
                            { isConfirmDeleteAll && (
                                <DeleteEventModal
                                    isModalVisible = { isConfirmDeleteAll }
                                    handleClose = { confirmDeletAllFunc }
                                    // handleSubmit={ deleteAllFilesHandler }
                                    handleSubmit={ deleteAllFiles }
                                    orderNumber={ orderNumber }
                                />
                            )}
                            { isEditFile && (
                                <EditFile
                                    isModalVisible = { isEditFile }
                                    handleClose = { handleClose }
                                    handleChange = { handleEventDetailsChange }
                                    handleSubmit = { handleEventDetails }
                                    editFileInfo = { editFileInfo }
                                    folderId = { folderId }
                                    confirmDeletFunc = { confirmDeletFunc }
                                    eventId = { eventId }
                                    folderName = { folderName }
                                    eventName = { eventName }
                                    fileList = { fileList }
                                />
                            )}
                            { isAddFile && (
                                <CreateNewFile
                                    isModalVisible = { isAddFile }
                                    handleClose = { handleClose }
                                    MyUploader={ MyUploader }
                                    files={ files }
                                    folderId = { folderId }
                                    eventId = { eventId }
                                    orderNumber = { orderNumber }
                                    handleCloseModal = { handleCloseModal }
                                    preOrderNumber={ preOrderNumber }
                                    eventCode = { eventCode }
                                    folderName = { folderName }
                                    teamNumber = { teamNumber }
                                    fileList = { fileList }
                                />
                            )}
                            { isAddImage && (
                                <AddNewImages
                                    isModalVisible = { isAddImage }
                                    handleClose = { handleClose }
                                    folderId = { folderId }
                                    orderNumber = { orderNumber }
                                    preOrderNumber={ preOrderNumber }
                                    handleCloseModal = { handleCloseModal }
                                    eventId = { eventId }
                                    eventCode = { eventCode }
                                    folderName = { folderName }
                                    teamNumber = { teamNumber }
                                    fileList = { fileList }
                                />
                            )}
                            { isDetailEventModal && (
                                <DetailFileModal
                                    isModalVisible = { isDetailEventModal }
                                    handleClose = { handleClose }
                                    fileId = { fileId2 }
                                    fileName = { fileName }
                                    confirmDeletFunc = { confirmDeletFunc2 }
                                    handleSubmit ={ deleteFileFunc }
                                />
                            )}
                            {isConfirm && (
                                <SendFilesModal
                                    isModalVisible={ isConfirm }
                                    handleClose={ confirmSendFilesFunc }
                                    handleSubmit={ sendPreOrderPurchasedFilesFunc }
                                    isLogoutFlag = { true }
                                />
                            )}
                            {
                                isModal && (<ProgressBarModal
                                    progressPercentage= { progressPercentage || progressPercentage2 }
                                    isModalVisible={ isModal }
                                    handleClose={ handleClose }
                                    showDeleteText = { showDeleteText }
                                />)
                            }
                            {
                                isModal2 && (<ProgressBarModal
                                    progressPercentage= { progressPercentage2 || progressPercentage }
                                    isModalVisible={ isModal2 }
                                    handleClose={ handleClose }
                                    showDeleteText = { showDeleteText }
                                />)
                            }
                        </div>
                    </div>
                }
            </div>
        </>
    )
}

DetailEventList.propstype = {
    history: PropTypes.object,
    folderId: PropTypes.number,
    eventListDescFunc : PropTypes.func,
    fileListingFunc : PropTypes.func,
    folderName: PropTypes.string,
    teamNumber: PropTypes.string,
    eventName: PropTypes.string,
    eventCode: PropTypes.string,
    eventId: PropTypes.number,
    ordered_folder_number: PropTypes.string,
    orderDetailsFunc: PropTypes.func,
    deleteAllFilesHandler: PropTypes.func,
    isConfirmDeleteAll: PropTypes.bool,
    confirmDeletAllFunc: PropTypes.func,
    preOrderNumber: PropTypes.string,
    preOrderFOlderListingFunc: PropTypes.func,
    confirmDeletAllPreOrderFilesFunc: PropTypes.func,
    folderListFunc: PropTypes.func,
    goToEventSectionFunc: PropTypes.func,
    fileToOrderDetailsFunc: PropTypes.func,
    fileToFolderFunc: PropTypes.func,
    preOrderListPageFunc: PropTypes.func,
    backToOrder: PropTypes.func
}

export default DetailEventList
