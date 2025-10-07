/* eslint-disable no-unused-vars */
import React from 'react'
import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import PropTypes from 'prop-types';
import { Breadcrumb } from 'antd';
import {
    createPreOrderBucketFolderActions,
    getEventFoldersList,
    getPreOrderListAction,
    preOrderSendLink,
    removeFolderAction,
    removeOrderedFolderAction,
    updateFolderAction
} from 'actions/fileActions'
import { HiChevronRight } from 'react-icons/hi';
import folder from 'static/images/svg/folder.svg';
import deleteIcon from 'static/images/svg/delete-icon.svg';
import deleteIconWhite from './../../static/images/svg/delete-icon-white.svg';
import edit from 'static/images/svg/edit.svg';
import Button from 'shared/Button';
import CreateNewFolder from './CreateNewFolder';
import EditFolder from './EditFolder';
import DeleteEventModal from 'shared/DeleteEventModal';
import Loader from 'shared/Loader';
import AddPreOrderDetails from 'components/preOrders/AddPreOrderDetails';
import DetailEventList from './DetailEventList';
import { getUserOrderedFoldersAction, removeAllOrderFileAction } from 'actions/orderActions';
import refresh from 'static/images/refresh.png'
import '../../static/style/orders.scss';
import { toast } from 'react-toastify';
import SendFilesModal from 'shared/SendFilesModal';
import {
    deleteObject,
    getStorage,
    listAll,
    ref,
} from 'firebase/storage';
import { app } from '../../app/firebase';
import ProgressBarModal from './ProgressBarModal';

function EventFolderList(props) {
    const { backToOrder , eventId, eventName, folderListfunc, preOrderListPageFunc,  handleDetailEventLising, history, eventCode, ordered_folder_number, orderNumber, orderDetailsFunc, goToEventSectionFunc, folderToOrderDetailsFunc, fileScroll } = props
    const dispatch = useDispatch()
    const [ isNewFolder, setNewFolder ] = useState(false)
    const [ isEditFolder, setEditFolder ] = useState(false)
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false)
    const [ isOrderFiles, setIsOrderFiles ] = useState(false)
    const [ folderId , setFolderId ] = useState([])
    const [ folderName, setFolderName ] = useState([])
    const [ editFolderInfo, setEditFolderInfo ] = useState();
    const [ isConfirm, setIsConfirm ] = useState(false);
    // const [ preOrderNumber, setPreOrderNumber ] = useState('')
    const [ deletePreOrderNumber, setDeletePreOrderNumber ] = useState([ '' ])
    // const [ isDetailEventListPage, setIsDetailEventListPage ] = useState(false)
    const [ isEventFolderListPage, setIsEventFolderListPage ] = useState(true)
    const [ input, setInput ] = useState({});
    const [ inputError, setInputError ] = useState({});
    const [ inputFolderNameError, setInputFolderNameError ] = useState({});
    const [ isConfirmPreOrderDeleteAll, setIsConfirmPreOrderDeleteAll ] = useState(false)
    const [ eventID , setEventID ] = useState()
    const [ doNotShowCheck , setDoNotShowCheck ] = useState(false)
    const [ isModal, setIsModal ] = useState(false)
    const [ progressPercentage, setProgressPercentage ] = useState(0)
    const [ currentIndex, setCurrentIndex ] = useState(0);
    const [ initialCurrentIndex, setInitialCurrentIndex ] = useState(0);
    const [ leftArrowPressed, setLeftArrowPressed ] = useState(false);
    const [ rightArrowPressed, setRightArrowPressed ] = useState(false);
    const [ upArrow, setUpArrow ] = useState(false);
    const [ upRightArrow, setUpRightArrow ] = useState(false);
    const [ notSelFirstIndex, setNotSelFirstIndex ] = useState(true);
    const [ downNotScrollFirst, setDownNotScrollFirst ] = useState(false);
    const [ altSelect, setAltSelect ] = useState(false);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const pageURL = window.location.pathname;
    useEffect(() => {
        if(pageURL === '/orders' || pageURL === '/customer-accounts' || pageURL === '/preorders'){
            dispatch(getUserOrderedFoldersAction(orderNumber));
        } else if(pageURL !== '/events'){
            dispatch(getEventFoldersList(eventId));
        } else {
            dispatch(getEventFoldersList(eventId));
        }
        setEventID(eventId);
    }, [ dispatch, eventId, pageURL, ordered_folder_number, orderNumber ])

    const folderData = useSelector((state) => state.folderList)
    // console.log('folderData', folderData);

    // useEffect(() => {
    //     const idsToRemove = folderData
    //         .filter(item => item.files_count === 0)
    //         .map(item => item.id);

    //     if (idsToRemove.length > 0) {
    //         const sendIdData = {
    //             folder_id: idsToRemove
    //         };
    //         dispatch(removeFolderAction(sendIdData, eventId));
    //     }
    // }, [ dispatch, eventId, folderData ]);

    // const preOrderFolderData = useSelector((state) => state.preOrderFolderList)
    const addFolderFunc = () => {
        setNewFolder(!isNewFolder)
    }
    const refreshHandler = () => {
        if(pageURL === '/orders' || pageURL === '/preorders' || pageURL === '/customer-accounts'){
            dispatch(getUserOrderedFoldersAction(orderNumber));
            setFolderId([])
            setFolderName([])
            setCurrentIndex(0);
            setInitialCurrentIndex(0);
        } else if(pageURL !== '/events'){
            dispatch(getEventFoldersList(eventId));
            setFolderId([])
            setFolderName([])
            setCurrentIndex(0);
            setInitialCurrentIndex(0);
        } else{
            dispatch(getEventFoldersList(eventID));
            setFolderId([])
            setFolderName([])
            setCurrentIndex(0);
            setInitialCurrentIndex(0);
        }
    }
    const editFolderFunc = (data) => {
        setEditFolder(!isEditFolder)
        setFolderId(data.id)
        setEditFolderInfo(data.folder_name)
    }
    const handleClose = () => {
        setNewFolder(false)
        setEditFolder(false)
        setIsOrderFiles(false)
        setInputError({});
        setIsConfirmPreOrderDeleteAll(false)
        setFolderId([])
        setFolderName([])
        setCurrentIndex(0);
        setInitialCurrentIndex(0);
    }
    const confirmDeletFunc = (data) => {
        setIsConfirmDelete(!isConfirmDelete)
        setFolderId([ data.id ])
        setFolderName([ data.team_number ? data.team_number : data.folder_name ])
        setDoNotShowCheck(true)
    }
    const confirmDeletFuncReturn = (data) => {
        setIsConfirmDelete(!isConfirmDelete)
        // setFolderId([ data.id ])
        // setFolderName([ data.folder_name ])
    }
    const deleteFolderFunc = () => {
        const sendIdData = {
            folder_id: folderId
        };
        const sendIdOrderData = {
            order_number: orderNumber,
            folder_name: folderName
        };
        window.location.pathname === '/orders' || window.location.pathname === '/preorders' ?
            (dispatch(removeOrderedFolderAction(sendIdOrderData, orderNumber)))
            :
            window.location.pathname === '/customer-accounts' ?
                (dispatch(removeOrderedFolderAction(sendIdOrderData, orderNumber))).then((res) => {
                    if(res.statusCode === 200){
                        folderToOrderDetailsFunc()
                    }
                })
                :
                (dispatch(removeFolderAction(sendIdData, eventId)))
        setIsConfirmDelete(!isConfirmDelete)
        setFolderId([])
        setFolderName([]);
        setCurrentIndex(0);
        setInitialCurrentIndex(0);
    }
    const validateFolderName = () => {
        const errors = {};
        let isValid = true;
        if(editFolderInfo && editFolderInfo.length !== undefined) {
            if(editFolderInfo.length > 4 || editFolderInfo.length < 4) {
                isValid = false;
                errors.editFolderInfo = 'Folder name must contain 4 digits only';
            }
        }
        setInputFolderNameError(errors);
        return isValid;
    }
    const handleFolderChange = (event) => {
        setEditFolderInfo(event.target.value)
        setInputFolderNameError({})
    }
    const handleUpdateFolder = () => {
        const id = folderId;
        const folder_name = editFolderInfo;
        const data = {
            folder_id: id,
            folder_name: folder_name
        }
        if (validateFolderName()) {
            dispatch(updateFolderAction(id, data))
            handleClose();
        }
    }
    // const preOrderFOlderListingFunc = () => {
    //     setIsDetailEventListPage(!isDetailEventListPage)
    //     setIsEventFolderListPage(!isEventFolderListPage)
    //     dispatch(getPreOrderListAction())
    // }
    const preOrderHandleChange = (event) => {
        const { name, value } = event.target;
        setInput((prevState) => ({ ...prevState, [ name ]: value }));
        setInputError({});
    };
    const validate = () => {
        const errors = {};
        let isValid = true;
        if (!input.pre_order_number) {
            isValid = false;
            errors.pre_order_number = 'Please enter pre order number';
        }
        if (!input.email_id) {
            isValid = false;
            errors.email_id = 'Please enter email';
        }
        setInputError(errors);
        return isValid;
    };
    const preOrderHandleSubmit = () => {
        const data = input;
        if (validate()) {
            setInput({});
            dispatch(createPreOrderBucketFolderActions(data)).then((res) => {
                if(res.statusCode === 200){
                    dispatch(getPreOrderListAction())
                }
            })
            handleClose();
        }
    };
    const confirmDeletAllPreOrderFilesFunc = (id) => {
        setDeletePreOrderNumber([ id ])
        setIsConfirmPreOrderDeleteAll(!isConfirmPreOrderDeleteAll)
    }
    const deleteAllPreOrdersFilesFunc = () => {
        const sendIdOrderData = {
            order_number: deletePreOrderNumber,
            folder_name: folderName
        };
        dispatch(removeAllOrderFileAction(sendIdOrderData, orderNumber))
        handleClose()
    }
    const goToFileSectionFunc = () => {
        history.push('/files')
    }

    const sendLinkPreOrder = () => {
        if(orderNumber) {
            setIsConfirm(!isConfirm);
            dispatch(preOrderSendLink(orderNumber));
        } else {
            toast.error('Missing order number')
        }

    }
    const confirmSendFilesFunc = () => {
        setIsConfirm(!isConfirm);
    };

    // ================ Alt Key Selection ====================
    // =======================================================
    const handleAltKeySelect = async (current_index) => {
        let prevSelectedElemIndex = 0;
        if(folderId.length > 0){
            const prevSelectedElem = folderId[ folderId.length - 1 ];
            prevSelectedElemIndex = await folderData.findIndex((element) => element.id === prevSelectedElem);
            console.log(prevSelectedElem , prevSelectedElemIndex ,current_index,    'prevSelectedElemIndex ==========>');
        }
        const selectedUrls = [ ...new Set(await folderData.slice(prevSelectedElemIndex , current_index+1).map((file) => file?.team_number ? file?.team_number : file.folder_name)) ];
        const selectedIds =  [ ...new Set(await folderData.slice(prevSelectedElemIndex , current_index+1).map((file) => file.id)) ];
        console.log(folderData , 'folder Data ====>' , selectedUrls, 'Selected Urls' , selectedIds , 'SelectedIds', current_index);

        setFolderName([ ...new Set([ ...folderName, ...selectedUrls ]) ]);
        setFolderId([ ...new Set([ ...folderId, ...selectedIds ]) ]);
        setInitialCurrentIndex(current_index)
        setCurrentIndex(current_index)
        setAltSelect(true)
    };
    // ------------------------------------------------------------
    // ------------------------------------------------------------

    const handleItemSelect = (e, id, folder_name, index, folderData) => {
        if (folderId.includes(id)) {
            setFolderId(folderId.filter(item => item !== id));
            setFolderName(folderName.filter(name => name !== folder_name));
            setInitialCurrentIndex(0)
            setCurrentIndex(0)
            setLeftArrowPressed(false)
            setRightArrowPressed(false)
            setUpArrow(false)
            setUpRightArrow(false)
            setNotSelFirstIndex(true)
            setDownNotScrollFirst(false)
        } else {
            setFolderId([ ...folderId, id ]);
            setFolderName([ ...folderName, folder_name ]);
            setInitialCurrentIndex(index)
            setCurrentIndex(index)
        }
        setDoNotShowCheck(false);
        if(e.nativeEvent.shiftKey ){
            handleAltKeySelect(index);
            return;
        }
    };

    const handleSelectAll = () => {
        if (folderId.length === folderData.length) {
            setFolderId([]);
            setFolderName([]);
            setCurrentIndex(0);
            setInitialCurrentIndex(0);
            setLeftArrowPressed(false)
            setRightArrowPressed(false)
            setUpArrow(false)
            setUpRightArrow(false)
            setNotSelFirstIndex(true)
            setDownNotScrollFirst(false)
        } else {
            const allItemIds = folderData.map(file => file.id);
            setFolderId(allItemIds);
            // const allFolderNames = folderData.map(file => file.hasOwnProperty("team_number") ?  file.team_number : file.folder_name);
            const allFolderNames = folderData.map(file => {
                if(file.team_number){
                    return  file.team_number
                }
                else{
                    return  file.folder_name
                }
            })
            setFolderName(allFolderNames);
            // file[ "team_number" ] ?  file.team_number : file.folder_name);
        }
        setDoNotShowCheck(false)
    };
    async function deleteFolder() {
        const storage = getStorage(app);
        setIsModal(true);
        setProgressPercentage(0);
        const totalFoldersToDelete = folderName.length;
        let foldersDeleted = 0;
        for await (const folder of folderName) {
            if (folder.length === 0) {
                continue;
            }
            foldersDeleted++;
            const progressPercentage = (foldersDeleted / totalFoldersToDelete) * 90;
            setProgressPercentage(progressPercentage);
            const folderPath = (pageURL === '/orders' || pageURL === '/customer-accounts' || pageURL === '/preorders') ? `/orderfiles/${ orderNumber }/${ folder }` : `/events/${ eventCode }/${ folder }`;
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
        }
        setProgressPercentage(100);
        setTimeout(() => {
            setIsModal(false);
            setIsConfirmDelete(!isConfirmDelete)
            const sendIdData = {
                folder_id: folderId
            };
            const sendIdOrderData = {
                order_number: orderNumber,
                folder_name: folderName
            };
            window.location.pathname === '/orders' || window.location.pathname === '/preorders' ?
                (dispatch(removeOrderedFolderAction(sendIdOrderData, orderNumber)))
                :
                window.location.pathname === '/customer-accounts' ?
                    (dispatch(removeOrderedFolderAction(sendIdOrderData, orderNumber))).then((res) => {
                        // Comment these line why? => (when we delete any folder it was redirected to order detail page)
                        // if(res.statusCode === 200){
                        //     folderToOrderDetailsFunc()
                        // }
                    })
                    :
                    (dispatch(removeFolderAction(sendIdData, eventId)))
            setFolderId([])
            setFolderName([]);
            setCurrentIndex(0);
            setInitialCurrentIndex(0);
            setDoNotShowCheck(false);
        }, 1000);
    }

    const handleItemSelectFromKeys = (foldersName, id) => {
        if(!foldersName || !id){
            return;
        }
        // if you want to de-select the alt Selected Folder then remove the brackets of && condition
        // if (folderName.includes(foldersName) || folderId.includes(id) && !altSelect) {
        //     setFolderName(folderName.filter(item => item !== foldersName));
        //     setFolderId(folderId.filter(item => item !== id));
        // } else {
        //     setFolderName([ ...folderName, foldersName ]);
        //     setFolderId([ ...folderId, id ]);
        // }

        // this code removing duplicate item from folderName and folderId
        const uniqueSelectedFolderName = new Set(folderName);
        const uniqueFolderId = new Set(folderId);

        if ((uniqueSelectedFolderName.has(foldersName) || uniqueFolderId.has(id)) && !altSelect) {
            uniqueSelectedFolderName.delete(foldersName);
            uniqueFolderId.delete(id);
        } else {
            uniqueSelectedFolderName.add(foldersName);
            uniqueFolderId.add(id);
        }

        setFolderName([ ...uniqueSelectedFolderName ]);
        setFolderId([ ...uniqueFolderId ]);
    };
    const handleRowSelectFromKeys = (startIndex, endIndex, actionType, fileUrl, id) => {
        const selectedUrls = folderData.slice(startIndex, endIndex).map((file, index) => {
            return file?.team_number ? file?.team_number : file.folder_name;
        });
        const selectedIds = folderData.slice(startIndex, endIndex).map((file) => file.id);

        if (actionType === 'up') {
            const newSelectedItems = selectedUrls.filter(url => !folderName.includes(url));
            const newSelectedIds = selectedIds.filter(id => !folderId.includes(id));

            const updatedSelectedItems = folderName.filter(item => !selectedUrls.includes(item));
            const updatedFileId = folderId.filter(fileIdItem => !selectedIds.includes(fileIdItem));

            if (initialCurrentIndex === currentIndex) {
                // setFolderName([ ...folderName, ...newSelectedItems ]);
                // setFolderId([ ...folderId, ...newSelectedIds ]);
                setFolderName([ ...updatedSelectedItems, ...newSelectedItems ]);
                setFolderId([ ...updatedFileId, ...newSelectedIds ]);
            } else {
                setFolderName([ ...updatedSelectedItems, ...newSelectedItems ]);
                setFolderId([ ...updatedFileId, ...newSelectedIds ]);
            }
        } else if (actionType === 'down') {
            const newSelectedItems = selectedUrls.filter(url => !folderName.includes(url));
            const newSelectedIds = selectedIds.filter(id => !folderId.includes(id));

            const updatedSelectedItems = folderName.filter(item => !selectedUrls.includes(item));
            const updatedFileId = folderId.filter(fileIdItem => !selectedIds.includes(fileIdItem));

            const isFirstItemSelected = folderData[ 0 ] === folderData[ startIndex ];

            if (initialCurrentIndex === currentIndex || rightArrowPressed) {
                setFolderName([ ...folderName, ...newSelectedItems ]);
                setFolderId([ ...folderId, ...newSelectedIds ]);
            } else {
                if (isFirstItemSelected && notSelFirstIndex || altSelect) {
                    // Do not update folderId and folderName if folderData[0] is equal to folderData[startIndex]
                    setFolderName([ ...folderName, ...newSelectedItems ]);
                    setFolderId([ ...folderId, ...newSelectedIds ]);
                } else {
                    setFolderName([ ...updatedSelectedItems, ...newSelectedItems ]);
                    setFolderId([ ...updatedFileId, ...newSelectedIds ]);
                }
            }
        }
    };

    const handleKeyDown = async (e) => {
        const myElement = document.getElementById('folderContainer');
        const filesPerRow = parseInt(myElement.offsetWidth / 245);

        if (e.shiftKey && folderName.length === 0 && folderId.length === 0) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
                // if (e.key === 'ArrowRight') {
                setCurrentIndex(0);
                setNotSelFirstIndex(true)
                // handleItemSelectFromKeys(folderData[ 0 ]?.team_number || folderData[ 0 ]?.folder_name, folderData[ 0 ]?.id);
                handleItemSelectFromKeys(folderData[ 0 ]?.team_number ? folderData[ 0 ]?.team_number : folderData[ 0 ]?.folder_name, folderData[ 0 ]?.id);
                fileScroll.scrollTo(0, fileScroll.scrollTop);
                if(folderId.length === 0 && folderName.length === 0){
                    setInitialCurrentIndex(folderData?.length)
                    if(upArrow){
                        setCurrentIndex(1);
                    }
                }
                return;
            }
        }

        if (e.shiftKey) {
            console.log(e, 'shift-1',  e);
            if (e.key === 'ArrowRight') {
                if (currentIndex < folderData.length - 1) {
                    // const nextIndex = currentIndex + 1;
                    const nextIndex = leftArrowPressed || upArrow ? currentIndex: currentIndex + 1;
                    setCurrentIndex(nextIndex);
                    if (initialCurrentIndex !== nextIndex || altSelect) {
                        handleItemSelectFromKeys(folderData[ nextIndex ]?.team_number ? folderData[ nextIndex ]?.team_number : folderData[ nextIndex ]?.folder_name, folderData[ nextIndex ]?.id);
                        // data.team_number ? data.team_number : data.folder_name
                        fileScroll.scrollTo(0, fileScroll.scrollTop+38);
                        setLeftArrowPressed(false)
                        setRightArrowPressed(true)
                        setUpArrow(false)
                        setUpRightArrow(true)
                        setNotSelFirstIndex(true)
                        setDownNotScrollFirst(false)
                        setAltSelect(false)
                    }
                }
            } else if (e.key === 'ArrowLeft') {
                if (currentIndex !== null && currentIndex >= 0) {
                    // const prevIndex = currentIndex;
                    const prevIndex = leftArrowPressed || upArrow ? currentIndex-1 : currentIndex;
                    if(initialCurrentIndex != currentIndex || altSelect){
                        handleItemSelectFromKeys(folderData[ prevIndex ]?.team_number ? folderData[ prevIndex ]?.team_number  : folderData[ prevIndex ]?.folder_name , folderData[ prevIndex ]?.id);
                        fileScroll.scrollTo(0, fileScroll.scrollTop-38);
                    }
                    setLeftArrowPressed(false)
                    setRightArrowPressed(false)
                    setUpArrow(false)
                    setUpRightArrow(true)
                    setNotSelFirstIndex(true)
                    setDownNotScrollFirst(false)
                    setCurrentIndex(prevIndex - 1);
                    setAltSelect(false)
                }
            }
        }
        // for row selection
        if (e.shiftKey) {
            // if (e.key === 'ArrowDown' && folderData.length - 1 !== currentIndex) {
            if (e.key === 'ArrowDown') {
                if (currentIndex <= folderData.length - 1) {
                    // const nextIndex = currentIndex + filesPerRow;
                    const itemsInLastRow = folderData.length % filesPerRow || filesPerRow;
                    const isLastRow = (currentIndex + itemsInLastRow) > folderData.length - 1;
                    const nextIndex = isLastRow ? currentIndex + itemsInLastRow : currentIndex + filesPerRow;

                    handleRowSelectFromKeys(currentIndex, nextIndex, 'down');
                    setCurrentIndex(nextIndex);
                    // fileScroll.scrollTo(0, fileScroll.scrollTop+140);
                    downNotScrollFirst ? fileScroll.scrollTo(0, fileScroll.scrollTop+187) : fileScroll.scrollTo(0, fileScroll.scrollTop+50);
                    setLeftArrowPressed(true)
                    setRightArrowPressed(false)
                    setUpArrow(false)
                    setUpRightArrow(false)
                    setNotSelFirstIndex(false)
                    setDownNotScrollFirst(true)
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
                    setNotSelFirstIndex(false)
                    setDownNotScrollFirst(false)
                    // setAltSelect(true)
                    // fileScroll.scrollTo(0, fileScroll.scrollTop-140);
                    fileScroll.scrollTo(0, fileScroll.scrollTop-187);
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
    }, [ currentIndex, folderName, folderId, debouncedHandleKeyDown ]);
    return (
        <>
            {
                isEventFolderListPage && (
                    <>
                        <div className="event-header pb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="heading">Files</div>
                                <div>
                                    <div className='d-flex align-items-center'>
                                        {(folderId.length > 0 || folderName.length > 0) && !doNotShowCheck ? <div className='d-flex align-items-center'>
                                            <div className="select-all-checkbox align-items-center d-flex mt-1">
                                                <input
                                                    style={ { opacity: 1, width: '20px', height: '20px', marginRight: '8px', backgroundColor: '#FFFFFFC7', zIndex: 2 } }
                                                    type="checkbox"
                                                    className="form-check-input mb-1 "
                                                    checked={ folderId.length === folderData.length || folderName.length === folderData.length }
                                                    onChange={ handleSelectAll }
                                                />
                                                <p className="mb-0">Select All</p>
                                            </div>
                                            <button
                                                disabled={ folderData.length <= 0 }
                                                className="create-btn d-flex align-items-center justify-content-center pointer"
                                                // buttonName="Delete All"
                                                onClick= { () => setIsConfirmDelete(true) }
                                                // onClick= { () => confirmDeletFunc(folderData) }
                                            >
                                                <img
                                                    src={ deleteIconWhite }
                                                    alt="Trash"
                                                    width="12"
                                                    height="14"
                                                    className="trash-icon me-2"
                                                />
                                                Delete
                                            </button>
                                        </div> : ' '
                                        }
                                        { window.location.pathname === '/preorders' && <Button
                                            className="create-btn"
                                            handleSubmit={ () => sendLinkPreOrder(orderNumber) }
                                            buttonName="Send Link"
                                            // imageParam= { <img src={ refresh } alt="edit-img" className="edit-img" /> }
                                        /> }
                                        <Button
                                            className="create-btn"
                                            handleSubmit={ () => refreshHandler() }
                                            buttonName="Refresh"
                                            imageParam= { <img src={ refresh } alt="edit-img" className="edit-img" /> }
                                        />
                                        <Button
                                            className="create-btn"
                                            handleSubmit={ () => addFolderFunc() }
                                            buttonName="+ Add Folder"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className='d-flex justify-content-between align-items-center'>
                                {
                                    window.location.pathname === '/preorders' ? (
                                        <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                            <Breadcrumb.Item onClick={ () => preOrderListPageFunc() } className="pointer" >Pre Order</Breadcrumb.Item>
                                            <Breadcrumb.Item className="pointer" >{ orderNumber }</Breadcrumb.Item>
                                        </Breadcrumb>
                                    ) :
                                        window.location.pathname === '/orders' ? (
                                            <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                                <Breadcrumb.Item className="pointer" onClick={ () => backToOrder() }>Orders</Breadcrumb.Item>
                                                <Breadcrumb.Item className="pointer" onClick={ () => orderDetailsFunc() }>Orders Details</Breadcrumb.Item>
                                                <Breadcrumb.Item>Folders</Breadcrumb.Item>
                                            </Breadcrumb>
                                        ) :
                                            window.location.pathname === '/events' ? (
                                                <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                                    <Breadcrumb.Item className="pointer" onClick={ () => goToEventSectionFunc() }>Events</Breadcrumb.Item>
                                                    <Breadcrumb.Item className="pointer" onClick={ () => goToFileSectionFunc() }>Folders</Breadcrumb.Item>
                                                    <Breadcrumb.Item>{ eventName }</Breadcrumb.Item>
                                                </Breadcrumb>
                                            ) :
                                                window.location.pathname === '/customer-accounts' ? (
                                                    <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                                        <Breadcrumb.Item className="pointer" onClick={ () => window.location.reload() }>Customers</Breadcrumb.Item>
                                                        <Breadcrumb.Item className="pointer" onClick={ () => folderToOrderDetailsFunc() }>Order Details</Breadcrumb.Item>
                                                        <Breadcrumb.Item className="pointer" >Folders</Breadcrumb.Item>
                                                    </Breadcrumb>
                                                )
                                                    :
                                                    (
                                                        <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                                            <Breadcrumb.Item>Events</Breadcrumb.Item>
                                                            <Breadcrumb.Item className="pointer" onClick={ () => folderListfunc() }>Folders</Breadcrumb.Item>
                                                            <Breadcrumb.Item>{ eventName }</Breadcrumb.Item>
                                                        </Breadcrumb>
                                                    )
                                }
                            </div>
                        </div>
                        { isLoading && <div className="mt-5" ><Loader /></div> }
                        { !isLoading &&
                            <div className="event-folder-wrapper pt-4">
                                <div className="d-flex flex-wrap" id='folderContainer'>
                                    {
                                        folderData.map((data, index) => (
                                            <div key={ data.id } className="position-relative" >
                                                <input
                                                    type="checkbox"
                                                    style={ { opacity: 1, width: '20px', height: '20px', marginLeft: '80px', marginTop: '14px', position: 'absolute', backgroundColor: '#FFFFFFC7', zIndex: 2 } }
                                                    className="form-check-input"
                                                    checked={ folderId.includes(data.id) && !doNotShowCheck }
                                                    onChange={ (event) => handleItemSelect(event , data.id,  data?.team_number ? data?.team_number : data.folder_name, index) }
                                                />
                                                <div className="card pointer" onClick={ () => handleDetailEventLising(data) }>
                                                    <div className="card-header d-flex align-items-center" >
                                                        <div className="img-wrapper">
                                                            <img src={ folder } alt="folder-img" width="20" className="me-2" />
                                                        </div>
                                                        <div className="card-heading">{ data.folder_name }</div>
                                                    </div>
                                                    <div className="card-body">
                                                        <p className="card-text">{ data.files_count } files</p>
                                                    </div>
                                                </div>
                                                <div className="action-wrapper">
                                                    {/* {
                                                        (window.location.pathname !== '/orders' && window.location.pathname !== '/preorders' && window.location.pathname !== '/customer-accounts') ? (
                                                            <img
                                                                src={ edit }
                                                                alt="folder-img"
                                                                width="22"
                                                                className="me-3 pointer"
                                                                onClick={ () => editFolderFunc(data) }
                                                            />
                                                        ) : ''
                                                    } */}
                                                    <img
                                                        src={ deleteIcon }
                                                        alt="folder-img"
                                                        width="17"
                                                        className="pointer"
                                                        onClick={ () => confirmDeletFunc(data) } />
                                                </div>
                                            </div>
                                        ))
                                    }
                                    { (folderData.length === 0) ? <><p className="m-auto mt-5">No data found</p></> : '' }
                                </div>
                            </div>
                        }
                    </>
                )
            }
            { isNewFolder && (
                <CreateNewFolder
                    isModalVisible={ isNewFolder }
                    handleClose={ handleClose }
                    eventId = { eventId }
                    eventCode= { eventCode }
                    orderNumber={ orderNumber }
                    folderData={ folderData }
                />
            )}
            { isEditFolder && (
                <EditFolder
                    isModalVisible={ isEditFolder }
                    handleClose={ handleClose }
                    handleChange={ handleFolderChange }
                    handleSubmit={ handleUpdateFolder }
                    editFolderInfo= { editFolderInfo }
                    inputFolderNameError={ inputFolderNameError }
                />
            )}
            {isConfirmDelete && (
                <DeleteEventModal
                    isModalVisible={ isConfirmDelete }
                    handleClose={ confirmDeletFuncReturn }
                    // handleSubmit={ deleteFolderFunc }
                    handleSubmit={ deleteFolder }
                />
            )}
            {isConfirmPreOrderDeleteAll && (
                <DeleteEventModal
                    isModalVisible={ isConfirmPreOrderDeleteAll }
                    handleClose={ confirmDeletAllPreOrderFilesFunc }
                    handleSubmit={ deleteAllPreOrdersFilesFunc }
                />
            )}
            {isOrderFiles && (
                <AddPreOrderDetails
                    isModalVisible={ isOrderFiles }
                    handleClose={ handleClose }
                    handleChange={ preOrderHandleChange }
                    handleSubmit={ preOrderHandleSubmit }
                    inputError={ inputError }
                />
            )}
            {/* {isDetailEventListPage && (pageURL === '/preorders') && (
                <DetailEventList
                    history = { history }
                    preOrderNumber={ preOrderNumber }
                    preOrderFOlderListingFunc={ preOrderFOlderListingFunc }
                    confirmDeletAllPreOrderFilesFunc={ confirmDeletAllPreOrderFilesFunc }
                />
            )} */}
            {isConfirm && (
                <SendFilesModal
                    isModalVisible={ isConfirm }
                    handleClose={ confirmSendFilesFunc }
                    // handleSubmit={ sendLinkPreOrder }
                    isLogoutFlag={ true }
                />
            )}

            {
                isModal && (<ProgressBarModal
                    progressPercentage={ progressPercentage }
                    isModalVisible={ isModal }
                    handleClose={ handleClose }
                    showDeleteText={ true }
                />)
            }
        </>
    )
}

EventFolderList.propTypes = {
    eventId : PropTypes.number,
    eventName : PropTypes.string,
    folderListfunc : PropTypes.func,
    handleDetailEventLising : PropTypes.func,
    history: PropTypes.object,
    eventCode: PropTypes.string,
    ordered_folder_number: PropTypes.string,
    orderNumber: PropTypes.string,
    orderDetailsFunc: PropTypes.func,
    backToOrder: PropTypes.func,
    goToEventSectionFunc: PropTypes.func,
    folderToOrderDetailsFunc: PropTypes.func,
    preOrderListPageFunc: PropTypes.func
}
export default EventFolderList
