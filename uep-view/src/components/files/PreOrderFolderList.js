/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import search from 'static/images/svg/search.svg';
import read from 'static/images/read-eye.png';

import { createPreOrderBucketFolderActions, getPreOrderListAction, removePreOrderFolder } from 'actions/fileActions';
import { Breadcrumb } from 'antd';
import AddPreOrderDetails from 'components/preOrders/AddPreOrderDetails';
import React from 'react'
import { useState } from 'react';
import { useEffect } from 'react';
import { HiChevronRight } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux'
import Button from 'shared/Button';
import Loader from 'shared/Loader';
import folder from 'static/images/svg/folder.svg';
import deleteIcon from 'static/images/svg/delete-icon.svg';
import DeleteEventModal from 'shared/DeleteEventModal';
import EventFolderList from './EventFolderList';
import DetailEventList from './DetailEventList';
import { removeAllOrderFileAction } from 'actions/orderActions';
import DataTable from 'shared/DataTable';
import { ReactSVG } from 'react-svg';
import { Search } from '@material-ui/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function PreOrderFolderList(props,) {
    const { history, fileScroll } = props;
    const dispatch = useDispatch()
    const routeHistory = useHistory();
    const [ isOrderFiles, setIsOrderFiles ] = useState(false)
    const [ preOrderNumber, setPreOrderNumber ] = useState('')
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false)
    const [ folderId , setFolderId ] = useState()
    const [ folderName, setFolderName ] = useState('')
    const [ input, setInput ] = useState({});
    const [ inputError, setInputError ] = useState({});
    const [ isPreOrderFolderListPage, setIsPreOrderFolderListPage ] = useState(true)
    const [ isFolderListPage, setIsFolderListPage ] = useState(false)
    const [ isFileListPage, setIsFileListPage ] = useState(false)
    const [ isConfirmDeleteAll, setIsConfirmDeleteAll ] = useState(false)
    const [ searchValue, setSearchValue ] = useState('');
    const [ current, setCurrent ] = useState(1);
    const [ isCall, setIsCall ] = useState(false);
    const [ tableData, setTableData ] = useState([])
    const [ apiState, setAPIState ] = useState({ first_parameter: undefined , second_parameter: undefined  })
    // const totalPages = useSelector((state) => state.fileList.event_counts);
    useEffect(() => {
        dispatch(getPreOrderListAction()).then((res) => {
            setIsCall(!isCall);
        })
    }, [])

    const isLoading = useSelector((state) => state.applicationIsLoading);
    const preOrderFolderData = useSelector((state) => state.preOrderFolderList.pre_order_details)
    const preOrderFolderDataCount = useSelector((state) => state.preOrderFolderList.pre_orders_counts)
    const totalPages = useSelector((state) => state.preOrderFolderList.pre_orders_counts)
    const orderFolderDetails = useSelector((state) => state.orderFolderDetails);
    const ordered_folder_number = orderFolderDetails && orderFolderDetails.ordered_folder;
    useEffect(() => {
        if(preOrderFolderData){
            setTableData(preOrderFolderData)
        }
    })
    //Clearing data when switching to other routes
    useEffect(() => {
        // Listen for changes in the route
        const unListen = routeHistory.listen((location, action) => {
            if(location.pathname !== '/preorders'){
                dispatch(getPreOrderListAction())
            }
        });
        return () => {
            unListen();
        };
    }, [ history ]);
    const addPreOrderDetailsFunc = () => {
        setIsOrderFiles(!isOrderFiles)
    }

    const handleOrderFilesByOrderNumber = (id) => {
        setPreOrderNumber(id)
        setIsPreOrderFolderListPage(!isPreOrderFolderListPage)
        setIsFolderListPage(!isFolderListPage)
    }

    const preOrderListPageFunc = () => {
        setIsPreOrderFolderListPage(true);
        setIsFolderListPage(false);
        setIsFileListPage(false);
        dispatch(getPreOrderListAction(apiState.first_parameter, apiState.second_parameter));
        setCurrent(current);
    }

    const confirmDeletFunc = (data) => {
        setIsConfirmDelete(!isConfirmDelete);
        setFolderId(data.id);
        setPreOrderNumber(data.order_number);
        // setFolderName(data.folder_name)
    }

    const folderListFunc = () => {
        setIsFolderListPage(!isFolderListPage);
        setIsFileListPage(!isFileListPage);
    }

    const deleteAllFilesHandler = () => {
        dispatch(removePreOrderFolder(undefined, preOrderNumber, folderName))
        setIsConfirmDeleteAll(false)
        setCurrent(1);
        // folderListFunc();
    }

    const deleteFolderFunc = () => {
        const maxPage = totalPages % 10;
        const maxPage1 = tableData.length % 10;
        const isLastEvent =  maxPage1 === 1;
        if(isLastEvent){
            setCurrent(current-1)
        }
        setIsConfirmDelete(!isConfirmDelete)
        dispatch(removePreOrderFolder(folderId)).then(() => {
            // setCurrent(1);
            preOrderListPageFunc();
            const filterDataIndex = tableData.findIndex((res) => res.id === folderId);
            if(filterDataIndex !== -1){
                setTableData(tableData.splice(filterDataIndex, 1))
                if (searchValue === '') {
                    if(maxPage === 1 && tableData.length === 0 ){
                        dispatch(getPreOrderListAction(current-1, null)).then((res) => {
                            // setIsFilter(false)
                        })
                    }else{
                        dispatch(getPreOrderListAction(current, null)).then((res) => {
                            // setIsFilter(false)
                        })
                    }
                }
                else {
                    dispatch(getPreOrderListAction('search', searchValue)).then((res) => {
                        // setIsFilter(false)
                    })
                }
            }
        });
    }

    const handleClose = () => {
        setIsOrderFiles(false)
        setInputError({});
    }

    const confirmDeletAllFunc = () => {
        setIsConfirmDeleteAll(!isConfirmDeleteAll)
    }

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
                    dispatch(getPreOrderListAction(1, null))
                    setSearchValue('')
                    setCurrent(1)
                }
            })
            handleClose();
        }
    };
    const handleDetailEventLising = (data) => {
        setIsFolderListPage(!isFolderListPage)
        setIsFileListPage(!isFileListPage)
        // setIsDetailEventListPage(!isDetailEventListPage)
        // setFolderId(data.id)
        setFolderName(data.folder_name)
        // dispatch(fetchEventFoldersList([]))
    }
    // const handleSort = () => {
    //     setSearchValue("")
    // }
    const finalData = tableData;
    const columns = [
        {
            title: 'Order Number',
            dataIndex: '',
            key: 'order_number',
            width: '20%',
            render: (key) => {
                return (
                    <>
                        <a href  onClick={ () => handleOrderFilesByOrderNumber(key.order_number) }> {key.order_number} </a>
                    </>
                );
            },
        },
        {
            title: 'Email',
            dataIndex: 'email_id',
            key: 'email',
            width: '20%'
        },
        {
            title: 'Actions',
            dataIndex: '',
            width: '10%',
            render: (key) => {
                return (
                    <>
                        <img
                            src={ read }
                            alt="read"
                            width="22"
                            className="mx-2 icon-margin pointer"
                            onClick={ () => handleOrderFilesByOrderNumber(key.order_number) }
                        />
                        <img
                            src={ deleteIcon }
                            alt="read"
                            width="14"
                            className="mx-2 icon-margin pointer"
                            onClick={ () => confirmDeletFunc(key) }
                        />
                    </>
                );
            },
        }
    ]

    useEffect(() => {
        if(isCall){
            if(searchValue !== ''){
                const getData = setTimeout(() => {
                    dispatch(getPreOrderListAction('search', searchValue))
                    setAPIState({ first_parameter: 'search' , second_parameter: searchValue })
                    setCurrent(1);
                }, 1500)
                return () => clearTimeout(getData)
            } else {
                dispatch(getPreOrderListAction())
                setAPIState({ first_parameter: undefined , second_parameter: undefined })
                setSearchValue(searchValue)
                // setCurrent(1);
            }
        }
    }, [ searchValue ])

    const pageChange = (page) => {
        console.log('pageChange')
        setCurrent(page);
        if(searchValue.length === 0){
            dispatch(getPreOrderListAction(page, null));
            setAPIState({ first_parameter: page , second_parameter: null })
        }
    }

    const updateSearch = (event) => {
        setSearchValue(event.target.value.substr(0,100))
    }

    return (
        <>
            {
                isPreOrderFolderListPage && (
                    <>
                        <div className="event-header pb-3">
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="heading">Pre Order Files</div>
                                <div>
                                    <Button
                                        className="preorder-details-btn"
                                        handleSubmit={ () => addPreOrderDetailsFunc() }
                                        buttonName="Add Pre Order Details"
                                    />
                                </div>
                            </div>
                            <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                <Breadcrumb.Item>Pre Order</Breadcrumb.Item>
                            </Breadcrumb>
                        </div>
                        <div className="input-wrap d-flex flex-wrap py-3">
                            <div className="p-2 ps-0 position-relative">
                                <input
                                        className="search-box"
                                        type="search"
                                        name="eventSearchParam"
                                        placeholder="Order Number & Email"
                                        aria-label="Search"
                                        value = { searchValue || '' }
                                        onChange= { updateSearch }
                                    />
                                <ReactSVG src={ search } alt="search" className="search-icon" />
                            </div>
                        </div>
                            { isLoading && <div className="mt-5" ><Loader /></div> }
                            { !isLoading &&
                            <div className="data-table">
                                <DataTable
                                    columns={ columns }
                                    eventList={ tableData }
                                    // onChange={ handleSort }
                                    pageChange={ pageChange }
                                    current = { current }
                                    totalPages = { totalPages }
                                />
                            </div>
                        }

                        {/* <div className="event-folder-wrapper pt-4">
                                <div className="d-flex flex-wrap">
                                    {
                                        preOrderFolderData?.map((data) => (
                                            <div key={ data.order_number }>
                                                <div className="card pointer" onClick={ () => handleOrderFilesByOrderNumber(data.order_number) }>
                                                    <div className="card-header d-flex align-items-center" >
                                                        <div className="img-wrapper">
                                                            <img src={ folder } alt="folder-img" width="20" className="me-2" />
                                                        </div>
                                                        <div className="card-heading">{ data.order_number }</div>
                                                    </div>
                                                    <div className="card-body">
                                                        <p className="card-text">{ data.files_count } files</p>
                                                    </div>
                                                </div>
                                                <div className="action-wrapper">
                                                    <img
                                                        src={ deleteIcon }
                                                        alt="folder-img"
                                                        width="17"
                                                        className="pointer"
                                                        onClick={ () => confirmDeletFunc(data.id) } />
                                                </div>
                                            </div>
                                        ))
                                    }
                                    { (preOrderFolderData.length === 0) ? <><p className="m-auto mt-5">No data found</p></> : '' }
                                </div>
                        </div> */}
                    </>
                )
            }
            { isFolderListPage && (
                <EventFolderList
                    orderNumber = { preOrderNumber }
                    handleDetailEventLising = { handleDetailEventLising }
                    preOrderListPageFunc = { preOrderListPageFunc }
                    fileScroll = { fileScroll }
                    // orderDetailsFunc = { orderDetailsFunc }
                    // eventId = { event_id }
                />
            )}
            { isFileListPage && (
                <DetailEventList
                    orderNumber = { preOrderNumber }
                    preOrderListPageFunc = { preOrderListPageFunc }
                    // orderDetailsFunc = { orderDetailsFromFileListFunc }
                    folderListFunc = { folderListFunc }
                    deleteAllFilesHandler = { deleteAllFilesHandler }
                    setIsConfirmDeleteAll={ setIsConfirmDeleteAll }
                    confirmDeletAllFunc={ confirmDeletAllFunc }
                    isConfirmDeleteAll={ isConfirmDeleteAll }
                    folderName={ folderName }
                    fileScroll={ fileScroll }
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
            {isConfirmDelete && (
                <DeleteEventModal
                    isModalVisible={ isConfirmDelete }
                    handleClose={ confirmDeletFunc }
                    handleSubmit={ deleteFolderFunc }
                />
            )}
        </>
    )
}

export default PreOrderFolderList