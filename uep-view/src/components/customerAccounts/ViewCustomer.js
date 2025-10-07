/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable array-callback-return */
/* eslint-disable react/display-name */
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Avatar from 'react-avatar';
import DataTable from 'shared/DataTable';
import PropTypes from 'prop-types';
import { DatePicker } from 'antd';
import search from 'static/images/svg/search.svg';
import back from 'static/images/svg/back.svg';
import { ReactSVG } from 'react-svg';
import Button from 'shared/Button';
import { GoDotFill } from 'react-icons/go';
import CheckBox from 'shared/CustomCheck';
import read from 'static/images/read-eye.png';
import deleteicon from 'static/images/delete.png';
import editColor from 'static/images/svg/edit-color.svg'
import deleteColor from 'static/images/svg/delete-color.svg'
import { Radio } from 'antd';
import moment from 'moment';
import { dateMonthYearFormat, SearchTableData, packageDetailFormatter } from 'utils/Helper';
import DeleteEventModal from 'shared/DeleteEventModal';
import { removeOrderAction } from 'actions/orderActions';
import OrderDetails from 'components/orders/OrderDetails';
import { getCustomerProfileActions } from 'actions/customerActions';
import Loader from 'shared/Loader';
import { useEffect } from 'react';

function ViewCustomer(props) {
    const dispatch = useDispatch();
    const [ sortType, setSortType ] = useState('date');
    const [ sortBy, setSortBy ] = useState('desc');
    const [ filterDate, setFilterDate ] = useState('');
    const { handleTableManipulation, handleClose, editCustomerInput, handleEditCustomerChange, handleUpdateCustomer, handleToggle, isEditBtnToggle, confirmDeleteCall, customerId } = props;
    const [ searchValue, setSearchValue ] = useState('')
    const [ filterData, setFilterData ] = useState([])
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false);
    const [ orderId, setOrderId ] = useState()
    const [ isOrderDetails, setIsOrderDetails ] = useState(false)
    const [ isCustomerAccount, setIsCustomerAccount ] = useState(true)
    const [ orderStatus, setOrderStatus ] = useState()
    const [ isFilter, setIsFilter ] = useState(false)
    const [ liveFilter, setLiveFilter ] = useState(false);
    const [ notLiveFilter, setNotLiveFilter ] = useState(false);
    const [ current, setCurrent ] = useState(1);
    const [ isCall, setIsCall ] = useState(false)
    const [ filterType, setFilterType ] = useState(undefined)
    const [ filterVal, setFilterVal ] = useState(undefined)
    const [ apiState, setAPIState ] = useState({ first_parameter: undefined , second_parameter: undefined , third_parameter: undefined, sortBy: 'desc' , sortType: 'date' })

    const orderHistoryList = useSelector((state) => {
        return state?.orderHistory?.order_history
    });
    const totalPages = useSelector((state) => state?.orderHistory?.orders_counts);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const tableData = SearchTableData(orderHistoryList);
    const updateSearch = (event) => {
        setIsCall(true);
        setSearchValue(event.target.value.substr(0,100))
    }

    const resetSearch = () => {
        setIsCall(false);
        setSearchValue('');
    }

    const clearOtherFilter = (type) => {
        const liveNotLiveFilterCheck = () => {
            const node = document.getElementById('live');
            const notLiveNode = document.getElementById('not_live');
            if(node){
                node.checked= false;
            }
            if(notLiveNode){
                notLiveNode.checked = false;
            }
            setLiveFilter(false);
            setNotLiveFilter(false);
        }
        if(type === 'date') {
            liveNotLiveFilterCheck();
        } else if(type === 'live' || type === 'notLive' ) {
            setFilterDate('');
        } else if(type === 'all' ) {
            setFilterDate('');
            liveNotLiveFilterCheck();
        }
    }

    useEffect(() => {
        if(isCall){
            clearOtherFilter('all')
            if (searchValue !== '') {
                const getData = setTimeout(() => {
                    dispatch(getCustomerProfileActions(customerId, 'search', searchValue, sortType, sortBy))
                    setCurrent(1);
                    setIsFilter(false);
                    setAPIState({ first_parameter: customerId , second_parameter: 'search' , third_parameter: searchValue, sortBy: sortBy , sortType: sortType })
                }, 1500)
                return () => clearTimeout(getData)
            } else {
                dispatch(getCustomerProfileActions(customerId, undefined, undefined, sortBy , sortType))
                setCurrent(1)
                setIsFilter(false)
                setFilterData([])
                setAPIState({ first_parameter: customerId , second_parameter: undefined , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
            }
        }

    }, [ searchValue ])
    const showOrderStatus = (status) => {
        return status === 1 ? <span className="order-status pending">Pending</span> : <span className="order-status success">Completed</span>;
    };

    const handleFilter = (event) => {
        resetSearch();
        clearOtherFilter('live');
        // const tempArr = []
        setFilterData([])
        if (event.target.id === "live" && event.target.checked === true) {
            setLiveFilter(true)
            if (notLiveFilter === true) {
                setIsFilter(false)
                setFilterType(undefined);
                setFilterVal(undefined);
                dispatch(getCustomerProfileActions(customerId,  undefined, undefined, sortBy , sortType))
                setAPIState({ first_parameter: customerId , second_parameter: undefined , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
                // tableData && tableData.map((item, id) => {
                //     tempArr.push(item)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getCustomerProfileActions(customerId, 'filter', 2, sortBy , sortType)).then((res) => {
                    setFilterData(res.data.order_history)
                    setIsFilter(true)
                    setFilterType('filter');
                    setFilterVal(2);
                    setAPIState({ first_parameter: customerId , second_parameter: 'filter' , third_parameter: 2, sortBy: sortBy , sortType: sortType })
                }) ;
                // tableData && tableData.map((item, id) => {
                //     if (item.order_status === 2){
                //         tempArr.push(item)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            }
        } else if (event.target.id === "live" && event.target.checked === false) {
            setLiveFilter(false)
            if (notLiveFilter === true) {
                dispatch(getCustomerProfileActions(customerId, 'filter', 0, sortBy , sortType)).then((res) => {
                    setFilterData(res.data.order_history)
                    setIsFilter(true)
                    setFilterType('filter');
                    setFilterVal(0);
                }) ;
                setAPIState({ first_parameter: customerId , second_parameter: 'filter' , third_parameter: 0, sortBy: sortBy , sortType: sortType })
                // tableData && tableData.map((item, id) => {
                //     if (item.order_status === 1){
                //         tempArr.push(item)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                setIsFilter(false)
                setFilterType(undefined);
                setFilterVal(undefined);
                dispatch(getCustomerProfileActions(customerId, undefined, undefined, sortBy , sortType))
                setAPIState({ first_parameter: customerId , second_parameter: undefined , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
                // tableData && tableData.map((item, id) => {
                //     tempArr.push(item)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            }
        } else if (event.target.id === "not_live" && event.target.checked === true) {
            setNotLiveFilter(true)
            if (liveFilter === true) {
                setIsFilter(false)
                setFilterType(undefined);
                setFilterVal(undefined);
                dispatch(getCustomerProfileActions(customerId,  undefined, undefined, sortBy , sortType))
                setAPIState({ first_parameter: customerId , second_parameter: undefined , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
                // tableData && tableData.map((item, id) => {
                //     tempArr.push(item)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getCustomerProfileActions(customerId, 'filter', 1, sortBy , sortType)).then((res) => {
                    setFilterData(res.data.order_history)
                    setIsFilter(true)
                    setFilterType('filter');
                    setFilterVal(1);
                }) ;
                setAPIState({ first_parameter: customerId , second_parameter: 'filter' , third_parameter: 1, sortBy: sortBy , sortType: sortType })
                // tableData && tableData.map((item, id) => {
                //     if (item.order_status === 1){
                //         tempArr.push(item)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            }
        } else if (event.target.id === "not_live" && event.target.checked === false) {
            setNotLiveFilter(false)
            if (liveFilter === true) {
                dispatch(getCustomerProfileActions(customerId, 'filter',  undefined, sortBy , sortType)).then((res) => {
                    setFilterData(res.data.order_history)
                    setIsFilter(true)
                    setFilterType('filter');
                    setFilterVal(undefined);
                }) ;
                setAPIState({ first_parameter: customerId , second_parameter: 'filter' , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
                // tableData && tableData.map((item, id) => {
                //     if (item.order_status === 2){
                //         tempArr.push(item)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                setIsFilter(false)
                setFilterType(undefined);
                setFilterVal(undefined);
                dispatch(getCustomerProfileActions(customerId,  undefined, undefined, sortBy , sortType))
                setAPIState({ first_parameter: customerId , second_parameter: undefined , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
                // tableData && tableData.map((item, id) => {
                //     tempArr.push(item)
                // })
                // setFilterData(tempArr)
                // setIsFilter(false)
            }
        }
        setCurrent(1);
    }

    // const handleDateSelect = (event, date) => {
    //     const temp =  tableData && tableData.filter((item) => {
    //         return moment(item.purchase_datetime).format('MM/DD/YYYY') === moment(date).format('MM/DD/YYYY')
    //     })
    //     setFilterData(temp)
    // }
    const handleDateSelect = (event, date) => {
        resetSearch();
        clearOtherFilter('date');
        if(date === ''){
            setFilterDate('');
            dispatch(getCustomerProfileActions(customerId,  undefined, undefined, sortBy , sortType));
            setAPIState({ first_parameter: customerId , second_parameter: undefined , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
            setIsFilter(false);
            setFilterType(undefined);
            setFilterVal(undefined);
        } else {
            setFilterDate(date);
            dispatch(getCustomerProfileActions(customerId, 'filter', date)).then((res) => {
                // const temp =  res.data.order_history.filter((data) => {
                //     return moment(data.purchase_datetime).format('MM/DD/YYYY') === moment(date).format('MM/DD/YYYY')
                // })
                setFilterData(res.data.order_history)
                setIsFilter(true)
                setFilterType('filter');
                setFilterVal(date);
            }) ;
            setAPIState({ first_parameter: customerId , second_parameter: 'filter' , third_parameter: date, sortBy: sortBy , sortType: sortType })
        }
        setCurrent(1);
    }
    const confirmDeleteFunc = (key) => {
        setIsConfirmDelete(!isConfirmDelete);
        setOrderId(key.order_number)
    };
    const deleteOrderFunc = () => {
        // const maxPage = totalPages % 10;
        // const maxPage1 = filterData.length % 10;
        // const isLastEvent =  maxPage1 === 1;
        // if(isLastEvent){
        //     setCurrent(current-1)
        // }
        const cust_id = editCustomerInput?.customer_info?.id
        setIsConfirmDelete(!isConfirmDelete);
        // dispatch(getCustomerProfileActions(customerId,  undefined, undefined, sortBy , sortType));
        dispatch(removeOrderAction(orderId, cust_id)).then(() => {
            dispatch(getCustomerProfileActions(apiState.first_parameter, apiState.second_parameter, apiState.third_parameter,apiState.sortBy, apiState.sortType)).then((res) => {
                setFilterData(res.data.order_history)
                // setIsFilter(true)
                // setIsChangePage(true);
            }
            )
            // const filterDataIndex = filterData.findIndex((res) => res.order_number === orderId);
            // const fullOrderTableDataIndex = tableData.findIndex((res) => res.order_number === orderId);
            // if(filterDataIndex !== -1){
            //     dispatch(getCustomerProfileActions(customerId, filterType, filterVal, sortBy, sortType)).then((res) => {
            //         setFilterData(res.data.order_history)
            //         setIsFilter(true)
            //         // setIsChangePage(true)
            //         if (apiState.second_parameter == 1) {
            //             document.getElementById('live').checked = true
            //         }
            //         if(apiState.second_parameter == 0){
            //             document.getElementById('not_live').checked = true
            //         }
            //     })
            //     // }
            // }
            // if(fullOrderTableDataIndex !== -1){
            //     tableData.splice(fullOrderTableDataIndex, 1);
            //     if (!isFilter && searchValue === '') {
            //         if(maxPage === 1 && tableData.length === 0 ){
            //             dispatch(getCustomerProfileActions(customerId, current-1, null, sortBy, sortType)).then((res) => {
            //                 setIsFilter(false)
            //                 // setIsChangePage(true)
            //                 if (apiState.second_parameter == 1) {
            //                     document.getElementById('live').checked = true
            //                 }
            //                 if(apiState.second_parameter == 0){
            //                     document.getElementById('not_live').checked = true
            //                 }
            //             })
            //         }else{
            //             dispatch(getCustomerProfileActions(customerId, current, null, sortBy, sortType)).then((res) => {
            //                 setIsFilter(false)
            //                 // setIsChangePage(true)
            //                 if (apiState.second_parameter == 1) {
            //                     document.getElementById('live').checked = true
            //                 }
            //                 if(apiState.second_parameter == 0){
            //                     document.getElementById('not_live').checked = true
            //                 }
            //             })
            //         }
            //     }
            //     if (searchValue !== '') {
            //         dispatch(getCustomerProfileActions(customerId, filterType, filterVal, sortBy, sortType)).then((res) => {
            //             setIsFilter(false)
            //             // setIsChangePage(true)
            //         })
            //     }
            // }
        })
    };

    const orderDetailsPage = (info) => {
        setIsOrderDetails(!isOrderDetails)
        setIsCustomerAccount(!isCustomerAccount)
        setOrderId(info.order_number)
        setOrderStatus(orderStatus === undefined ? info.order_status : orderStatus === 1 ? 2 : orderStatus === 2 ? 1 : '')
    }
    const colseOderDetailsHandler = () => {
        dispatch(getCustomerProfileActions(apiState.first_parameter, apiState.second_parameter, apiState.third_parameter, apiState.sortBy, apiState.sortType)).then((res)=>{
            setFilterData(res.data.order_history);
            if (apiState.third_parameter == 2) {
                document.getElementById('live').checked = true
            }
            if(apiState.third_parameter == 1){
                document.getElementById('not_live').checked = true
            }
        });
        setIsOrderDetails(!isOrderDetails)
        setIsCustomerAccount(!isCustomerAccount)
    }

    // Handle all filter for sorting feature
    // --------------------------------------------
    const handleSortFilter = () => {
        let page = undefined;
        let value = null;
        const node = document.getElementById('live');
        const notLiveNode = document.getElementById('not_live');
        if (node && node.checked === true && notLiveFilter !== true) {
            page = 'filter';
            value = 2;
        } else if (node && node.checked === false && notLiveFilter === true) {
            page = 'filter';
            value = 0;
        } else if (notLiveNode && notLiveNode.checked === true && liveFilter !== true) {
            page = 'filter';
            value = 0;
        } else if (notLiveNode && notLiveNode.checked === false && liveFilter === true) {
            page = 'filter';
            value = 1;
        } else if (searchValue !== '') {
            page = 'search';
            value = searchValue;
        } else if (filterDate !== '') {
            page = 'filter';
            value = filterDate;
        }
        return { page , value }
    }
    // ==========================================================================

    // Handle sorting feature in this function
    // -------------------------------------------------
    const handleSort = (pagination, filters, sorter, extra) => {
        let page = undefined;
        let value = null;
        // if(isFilter){
        const res = handleSortFilter();
        page = res.page;
        value = res.value;
        // }
        if (extra.action === 'sort' ) {
            console.log('params', pagination, filters, sorter, extra);
            setSortBy(sorter.order === 'ascend'?'desc':'asc');
            console.log(sortBy)
            setSortType(sorter.columnKey);
            setCurrent(1);
            setFilterType(page);
            setFilterVal(value);
            dispatch(getCustomerProfileActions(customerId , page , value , sorter.order === 'ascend'?'desc':'asc' , sorter.columnKey)).then((response) => {
                console.log(response)
                if(isFilter){
                    console.log(response)
                    setFilterData(response.data.order_history);
                }
            });
            setAPIState({ first_parameter: customerId , second_parameter: page , third_parameter: value, sortBy: sorter.order === 'ascend'?'desc':'asc' , sortType: sorter.columnKey })
        }
    }
    // ========================================================================================
    console.log("!isFilter",!isFilter);
    const finalCustomerHistoryData = !isFilter ? tableData : filterData;
    const columns = [
        {
            title: 'Order Id',
            dataIndex: '',
            width: '10%',
            key:'id',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'id' ? sortBy==='asc'?'descend':'ascend' : null,
            render: (key) => {
                return (
                    <span className='highlight-text'>{key.order_number}</span>
                );
            },
        },
        {
            title: 'Order Date',
            dataIndex: 'purchase_datetime',
            width: '10%',
            // render: (key) => <>{dateMonthYearFormat(key)}</>,
            key:'date',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'date' ? sortBy==='asc'?'descend':'ascend' : null,
        },
        {
            title: 'Package Detail',
            dataIndex: '',
            width: '9%',
            render: (key) => <>{packageDetailFormatter(key)}</>,
        },
        {
            title: 'No. Of Files',
            dataIndex: 'no_of_files',
            width: '10%',
        },
        {
            title: 'Amount',
            dataIndex: '',
            width: '10%',
            render: (key) => {
                return (
                    <span> {`${ key.price }`}</span>
                );
            },
        },
        {
            title: 'Order Status',
            dataIndex: '',
            width: '10%',
            key:'status',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'status' ? sortBy==='asc'?'descend':'ascend' : null,
            render: (key) => {
                return (
                    <>
                        <div className="position-relative">
                            <div size="middle">
                                <span>{ showOrderStatus(key.order_status) }</span>
                            </div>
                        </div>
                    </>
                );
            },
        },
        {
            title: 'Actions',
            dataIndex: '',
            width: '8%',
            align: 'left',
            render: (key) => {
                return (
                    <>
                        <img
                            src={ read }
                            alt="read"
                            width="20"
                            className="mx-4 pointer"
                            onClick={ () => orderDetailsPage(key) }
                        />
                        <img
                            src={ deleteicon }
                            alt="deleteicon"
                            width="15"
                            className="mx-3 pointer"
                            onClick={ () => confirmDeleteFunc(key) }
                        />
                    </>
                );
            },
        },
    ];
    const pageChange = (page) => {
        setCurrent(page);
        if(searchValue === undefined){
            dispatch(getCustomerProfileActions(customerId, page, undefined, sortBy , sortType))
            setAPIState({ first_parameter: customerId , second_parameter: page , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
            setIsFilter(false)
            setFilterType(page);
            setFilterVal(undefined);
        } else if(!isFilter && searchValue?.length === 0){
            dispatch(getCustomerProfileActions(customerId, page,undefined, sortBy , sortType));
            setAPIState({ first_parameter: customerId , second_parameter: page , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
            setFilterType(page);
            setFilterVal(undefined);
        }
    }
    return (
        <div>
            {isCustomerAccount && (
                <div className="event-main">
                    <div className="page-wrapper view-customer">
                        <div className="profile-section">
                            <div className="heading col-12 d-flex justify-content-between">
                                Basic Details
                                <Button className="back-btn d-flex align-items-center"  buttonName='Back' handleSubmit = { handleClose }  imageParam= { <ReactSVG src={ back } className="move-back" /> }/>
                            </div>
                            <div className="row gx-0 mx-0 profile-sub-section">
                                <div className="col-1 upload-photo">
                                    <div className="avtar-alignment">
                                        <Avatar name={ editCustomerInput?.customer_info?.full_name } round={ true } size={ 95 } />
                                    </div>
                                    <div className="d-flex flex-column cust-id">
                                        <span className="customer-profile">Customer ID</span>
                                        <span className="customer-profile">{ editCustomerInput?.customer_info?.id }</span>
                                    </div>
                                </div>
                                <div className="col-10 form-input">
                                    <form>
                                        <div className="row">
                                            <div className="col-4">
                                                <div className="p-2 py-0">
                                                    <label className="text-label">Name</label>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="full_name"
                                                            placeholder="Enter Name"
                                                            defaultValue={ editCustomerInput?.customer_info?.full_name }
                                                            onChange={ handleEditCustomerChange }
                                                            className="text-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="p-2 ">
                                                    <label className="text-label">Email Address</label>
                                                    <div>
                                                        <input
                                                            type="email_id"
                                                            name="email_id"
                                                            placeholder="Enter Email Address"
                                                            disabled
                                                            defaultValue={ editCustomerInput?.customer_info?.email_id }
                                                            onChange={ handleEditCustomerChange }
                                                            className="text-input"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <div className="pe-2 pb-1 py-0 ps-4">
                                                    <label className="text-label">Telephone</label>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            name="phone_number"
                                                            placeholder="Enter Number"
                                                            defaultValue={ editCustomerInput?.customer_info?.phone_number }
                                                            onChange={ handleEditCustomerChange }
                                                            className="text-input"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="pe-2 pt-2 ps-4" onChange = { handleEditCustomerChange }>
                                                    <label className="text-label">Status</label>
                                                    <div>
                                                        <Radio.Group onChange = { handleEditCustomerChange }  name= 'status' value={ editCustomerInput?.customer_info?.is_active } >
                                                            <Radio
                                                                className="radio-btn"
                                                                value={ 1 }
                                                                id="Active"
                                                            />
                                                            <label
                                                                className="form-check-label radio-label pointer"
                                                                htmlFor="Active"
                                                            >
                                                                Active
                                                            </label>
                                                            <Radio
                                                                className="radio-btn"
                                                                value={ 0 }
                                                                id="Deactive"
                                                            />
                                                            <label
                                                                className="form-check-label radio-label pointer"
                                                                htmlFor="Deactive"
                                                            >
                                                                Deactive
                                                            </label>
                                                        </Radio.Group>
                                                    </div>
                                                </div>
                                            </div>
                                            {!isEditBtnToggle && <div className="col-4 text-end"><div className="btn-wrap">
                                                <Button className='save-btn' buttonName='Save' handleSubmit = { handleUpdateCustomer } />
                                                <Button className='cancel-btn' buttonName='Cancel' handleSubmit ={ handleToggle } />
                                            </div></div>}
                                            {isEditBtnToggle &&<div className="col-4 text-end"> <div className="btn-wrap d-flex justify-content-end">
                                                <Button className='edit-outline-btn edit-color d-flex align-items-center' buttonName='Edit' handleSubmit = { handleToggle } imageParam= { <img src={ editColor } alt="edit-img" className="edit-img" /> } />
                                                <Button className='delete-btn delete-color d-flex align-items-center' buttonName='Delete' handleSubmit ={ () => confirmDeleteCall(editCustomerInput?.customer_info) } imageParam= { <img src={ deleteColor } alt="delete-img" className="delete-img" /> } />
                                            </div> </div>}
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <div className="event-header d-flex justify-content-between align-items-center mt-5 py-0 cust-header">
                            <div className="heading">Customer History</div>
                        </div>
                        <div className="input-wrap d-flex flex-wrap pt-4 pb-4">
                            <div className="p-2 ps-0 position-relative">
                                <input
                                    className="search"
                                    type="search"
                                    name="patientSearchParam"
                                    value={ searchValue || '' }
                                    onChange={ updateSearch }
                                    placeholder="Order Id"
                                    aria-label="Search"
                                    autoComplete='off'
                                />
                                <ReactSVG src={ search } alt="search" className="search-icon" />

                            </div>
                            <div className="p-2">
                                <DatePicker className="input-search date-picker" value={ filterDate ? moment(filterDate) : null } placeholder="Created On" onChange ={ handleDateSelect } />
                            </div>
                            <div className="d-flex align-items-center p-2">
                                <CheckBox id="live" handleActive={ handleFilter } disabled={ notLiveFilter } />
                                <GoDotFill className="active-icon" />
                                <span className="label mx-1">Completed</span>
                            </div>
                            <div className="d-flex align-items-center p-2">
                                <CheckBox id="not_live" handleActive={ handleFilter } disabled={ liveFilter } />
                                <GoDotFill className="pending-icon" />
                                <span className="label mx-1">Pending</span>
                            </div>
                        </div>
                        {isLoading && <div className='mt-5'><Loader /></div> }
                        <div className="data-table">
                            {!isLoading && (
                                <DataTable
                                    columns={ columns }
                                    onChange={ handleSort }
                                    eventList={ finalCustomerHistoryData }
                                    pageChange={ pageChange }
                                    current = { current }
                                    totalPages = { totalPages }
                                />
                            )}
                        </div>
                        {isConfirmDelete && (
                            <DeleteEventModal
                                isModalVisible={ isConfirmDelete }
                                handleClose={ confirmDeleteFunc }
                                handleSubmit={ deleteOrderFunc }
                            />
                        )}
                    </div>
                </div>
            )}
            <div className="oders-page-wrapper" id='fileScroll'>
                <div className="page-wrapper event-page">
                    {isOrderDetails && (
                        <OrderDetails
                            orderId = { orderId }
                            orderStatus = { orderStatus }
                            handleClose = { colseOderDetailsHandler }
                            fileScroll = { document.getElementById('fileScroll') }
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
ViewCustomer.propTypes = {
    accountList: PropTypes.array,
    openViewMode: PropTypes.func,
    isEditBtnToggle: PropTypes.bool,
    handleToggle: PropTypes.func,
    editCustomerInput: PropTypes.object,
    handleEditCustomerChange: PropTypes.func,
    handleTableManipulation: PropTypes.func,
    handleUpdateCustomer: PropTypes.func,
    handleClose: PropTypes.func,
    confirmDeleteCall: PropTypes.func,
    customerId: PropTypes.number
};

export default ViewCustomer;
