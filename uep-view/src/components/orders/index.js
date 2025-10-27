/* eslint-disable no-unused-vars */
/* eslint-disable template-curly-spacing */
/* eslint-disable react/jsx-curly-spacing */
/* eslint-disable array-bracket-spacing */
/* eslint-disable computed-property-spacing */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/display-name */
/* eslint-disable array-callback-return */
import React, { useState } from 'react'
import PropTypes from 'prop-types';
import AuthLayoutContainer from 'shared/AuthLayoutContainer';
import '../../static/style/orders.scss';
import { ReactSVG } from 'react-svg';
import search from 'static/images/svg/search.svg';
import { DatePicker } from 'antd';
import { GoDotFill } from 'react-icons/go';
import CheckBox from 'shared/CustomCheck';
import DataTable from 'shared/DataTable';
import read from 'static/images/read-eye.png';
import deleteicon from 'static/images/delete.png';
import edit from 'static/images/svg/edit.svg';
import OrderDetails from './OrderDetails';
import EditPreOrder from './EditPreOrder';
import DeleteEventModal from 'shared/DeleteEventModal';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { fetchEventFoldersList, fetchOrderDetailsEmpty, getOrderDetailsAction, getOrderListAction, getOrderListActionV2, removeOrderAction, updatePreOrderAction } from 'actions/orderActions';
import Loader from 'shared/Loader';
import moment from 'moment';
import { dateMonthYearFormat, dateMonthYearFormatEnd, getUniqueArray, SearchTableData, eventCodesFormatter } from 'utils/Helper';

function Orders(props) {
    const { history } = props
    const [ sortType, setSortType ] = useState('date');
    const [ sortBy, setSortBy ] = useState('desc');
    const dispatch = useDispatch()
    const routeHistory = useHistory();
    const [isCall, setIsCall] = useState(false)
    const handleTableManipulation = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const orderList = useSelector((state) => state.orderList)
    const isLoading = useSelector((state) => state.orderSectionIsLoading);
    const { full_order_details, pre_order_details, producer_names } = orderList;
    const [filterData, setFilterData] = useState([])
    const [preOrderFilter, setPreOrderFilter] = useState([])
    const [searchValue, setSearchValue] = useState('')
    const [isOrderListing, setIsOrderListing] = useState(true)
    const [isOrderDetails, setIsOrderDetails] = useState(false)
    const [isEditPreOrder, setIsEditPreOrder] = useState(false)
    const [isConfirmDelete, setIsConfirmDelete] = useState(false)
    const [orderId, setOrderId] = useState()
    const [orderStatus, setOrderStatus] = useState()
    const [removeOrderId, setRemoveOrderId] = useState()
    const [editPreOrderInput, setEditPreOrderInput] = useState({})
    const [editPreOrderInputError, setEditPreOrderInputError] = useState({})
    const [editOrderId, setEditOrderId] = useState()
    const [selectedData, setSelectedData] = useState(true)
    const [selectedPreOrderData, setSelectedPreOrderData] = useState(true)
    const [isFilter, setIsFilter] = useState(false)
    const [liveFilter, setLiveFilter] = useState(false);
    const [isDateFilter, setIsDateFilter] = useState(false)
    const [isDate, setIsDate] = useState('')
    const [notLiveFilter, setNotLiveFilter] = useState(false);
    const [current, setCurrent] = useState(1);
    const [current1, setCurrent1] = useState(1);
    const [isDropdownFilter, setIsDropdownFilter] = useState('')
    const [filterType, setFilterType] = useState(undefined)
    const [filterVal, setFilterVal] = useState(undefined)
    const [ apiState, setAPIState ] = useState({ first_parameter: undefined , second_parameter: undefined , third_parameter: undefined, sortBy: 'desc' , sortType: 'date' })
    var fullOrderTableData = SearchTableData(full_order_details);
    var preOrderTableData = SearchTableData(pre_order_details, searchValue);
    const totalPages = useSelector((state) => state?.orderList?.orders_counts);
    const totalPages1 = useSelector((state) => state?.orderList?.pre_order_count);

    const [searchByValue, setSearchByValue] = useState(null);
    const [searchBy, setSearchBy] = useState(null);
    const [producerFilter, setProducerFilter] = useState(null);
    const [createdOn, setCreatedOn] = useState(null);
    const [status, setStatus] = useState(null);
    const [isEditingShippingFee, setIsEditingShippingFee] = useState(false);
    const [shippingFee, setShippingFee] = useState('');

    const openOrderDetails = (data) => {
        setIsOrderListing(!isOrderListing)
        setIsOrderDetails(!isOrderDetails)
        setOrderId(data.order_number)
        localStorage.setItem('order_number', data.order_number);
        setOrderStatus(data.order_status)
    }
    const cancelOderDetailsHandler = () => {
        setIsOrderDetails(!isOrderDetails)
        setIsOrderListing(!isOrderListing)
        localStorage.removeItem('order_number');
    }
    const openEditPreOrder = (data) => {
        setIsEditPreOrder(!isEditPreOrder)
        setEditPreOrderInput(data)
        setEditOrderId(data.order_number)
    }
    const colseEditPreOrder = () => {
        setIsEditPreOrder(!isEditPreOrder)
        setEditPreOrderInputError({})
    }
    const confirmDeletFunc = (data) => {
        setIsConfirmDelete(!isConfirmDelete)
        setRemoveOrderId(data.order_number)
    }

    // useEffect(() => {
    //     dispatch(getOrderListActionV2(current, searchBy , producerFilter, createdOn,  status, sortBy, sortType)).then((res) => {
    //         console.log('res', res);
    //         setIsCall(!isCall)
    //     });
    //     localStorage.removeItem('order_number');
    //     dispatch(fetchEventFoldersList([]))
    // }, [dispatch])

    // ---------------------------------------------------------
    useEffect(()=>{
        console.log(current, searchBy , producerFilter, createdOn,  status, sortBy, sortType, '>>>>>>>>>>>>>>>>>>>> useEffect call API  <<<<<<<<<<<<<<<<<<');
        dispatch(getOrderListActionV2(current, searchBy , producerFilter, createdOn,  status, sortBy, sortType)).then(()=>{
            setIsCall(!isCall)
        });
        localStorage.removeItem('order_number');
        dispatch(fetchEventFoldersList([]))
    }, [dispatch, createdOn , searchBy, producerFilter, status, sortBy, sortType, current ])

    // This for refresh page with last added filters.
    // ================================================
    const refreshFilter = () => {
        dispatch(getOrderListActionV2(current, searchBy , producerFilter, createdOn,  status, sortBy, sortType));
    }

    const removeOrderFunc = () => {
        const maxPage = totalPages % 10;
        console.log(maxPage, 'MaxPage Last');
        const isLastEvent =  maxPage === 1;
        const pageCount = Math.ceil(totalPages/10);
        const checkIsLastPage = pageCount == current;
        setIsConfirmDelete(!isConfirmDelete);
        dispatch(removeOrderAction(removeOrderId)).then(() => {
            console.log(current , 'Current');
            if(isLastEvent && checkIsLastPage){
                console.log('Last');
                setCurrent(current-1)
            } else {
                dispatch(getOrderListActionV2(current, searchBy , producerFilter, createdOn,  status, sortBy, sortType));
            }
        });
    }
    useEffect(()=>{
        console.log(filterData, fullOrderTableData)
    }, [filterData, fullOrderTableData])
    const validateEdit = () => {
        const errors = {};
        let isValid = true;
        if (!editPreOrderInput.event_code) {
            isValid = false;
            errors.event_code = 'Please enter event code';
        }
        if (!editPreOrderInput.event_producer) {
            isValid = false;
            errors.event_producer = 'Please enter event producer';
        }
        if (!editPreOrderInput.event_name) {
            isValid = false;
            errors.event_name = 'Please enter event name';
        }
        if (!editPreOrderInput.full_name) {
            isValid = false;
            errors.full_name = 'Please enter customer name';
        }
        if (!editPreOrderInput.team_name) {
            isValid = false;
            errors.team_name = 'Please enter team name';
        }
        setEditPreOrderInputError(errors)
        return isValid;
    }
    const handlePreOrderChange = (event) => {
        const { name, value } = event.target;
        setEditPreOrderInput((prevState) => ({ ...prevState, [name]: value }));
        setEditPreOrderInputError({});
    };
    const handleUpdatePreOrder = () => {
        const id = editOrderId
        const data = {
            event_code: editPreOrderInput.event_code,
            contact_name: editPreOrderInput.event_producer,
            event_name: editPreOrderInput.event_name,
            full_name: editPreOrderInput.full_name,
            team_name: editPreOrderInput.team_name,
        }
        if (validateEdit()) {
            dispatch(updatePreOrderAction(id, data))
            setIsEditPreOrder(!isEditPreOrder)
        }
    }

    useEffect(() => {
        const getData = setTimeout(() => {
            if(searchByValue!==''){
                setSearchBy(searchByValue)
                setCurrent(1);
            } else {
                setSearchBy(null)
                setCurrent(1);
            }
        },1500);
        return () => clearTimeout(getData)
    }, [searchByValue]);

    const updateSearch = (event) => {
        const temp = event.target.value.substr(0, 100);
        setSearchByValue(temp);
    }

    const preorderUpdateSearch = (event) => {
        setSearchValue(event.target.value.substr(0, 100))
        if (event.target.value !== '') {
            setFilterType('search')
            const srarchValue = event.target.value;
            dispatch(getOrderListAction(current, 'search', srarchValue, sortBy, sortType)).then((res) => {
                setIsFilter(true)
                setFilterData(res.data.pre_order_details);
            });
        } else {
            setFilterType('')
            setIsFilter(false)
            setFilterData([])
            dispatch(getOrderListAction(undefined, undefined, undefined, sortBy, sortType))
        }

    }
    const placeByList = []
    producer_names && producer_names.map((data) => { return placeByList.push(data) })
    const uniqueplaceByList = getUniqueArray(placeByList).map((clientName, idx) => {
        return <option key={idx} value={clientName} name={clientName}>{clientName}</option>
    })
    const handleFullOrderDropDown = (event) => {
        const mode = event.target.value;
        setProducerFilter(mode);
        setSelectedData(false);
        setCurrent(1);
    }
    const clientNameList = []
    preOrderTableData && preOrderTableData.map((data) => {
        return clientNameList.push(data.event_producer)
    })
    const uniqueclientNameList = getUniqueArray(clientNameList).map((clientName, idx) => {
        return <option key={idx} value={clientName} name={clientName}>{clientName}</option>
    })

    const teamName = []
    preOrderTableData && preOrderTableData.map((data) => {
        return teamName.push(data.folder_name)
    })
    const uniqueTeamNameList = getUniqueArray(teamName).map((team_Name, idx) => {
        return <option key={idx} value={team_Name} name="team_name" >{team_Name}</option>
    })

    const handlePreOrderDropDown = (event) => {
        const mode = event.target.value
        dispatch(getOrderListAction(1, 'filter', mode, sortBy, sortType)).then((res) => {
            const temp = res.data.preOrderTableData.filter((data) => {
                return data.event_producer === event.target.value
            })
            setPreOrderFilter(temp)
            setSelectedPreOrderData(false)
            setIsFilter(true)
        });
    }
    const handleDateSelect = (event, date) => {
        if (date === '') {
            setCreatedOn(null);
        } else {
            setCreatedOn(date);
            setIsDate(date)
        }
        setCurrent(1);
    }
    const handleFilter = (event) => {
        if (event.target.id === 'live' && event.target.checked === true) {
            setStatus(true)
            setLiveFilter(true)
            setNotLiveFilter(false);
        } else if (event.target.id === 'live' && event.target.checked === false) {
            setStatus(null)
            setLiveFilter(false);
            setNotLiveFilter(false);
        } else if (event.target.id === 'not_live' && event.target.checked === true) {
            setStatus(false)
            setLiveFilter(false);
            setNotLiveFilter(true);
        } else if (event.target.id === 'not_live' && event.target.checked === false) {
            setStatus(null)
            setLiveFilter(false);
            setNotLiveFilter(false);
        }
        setCurrent(1);
    }

    const clearFilterFunc = () => {
        setSearchBy(null);
        setSearchByValue(null);
        setCreatedOn(null);
        setStatus(null);
        setProducerFilter(null);
        console.log(isFilter , fullOrderTableData , filterData);
        const node = document.getElementById('live');
        const notLiveNode = document.getElementById('not_live');
        if(node){
            node.checked= false;
        }
        if(notLiveNode){
            notLiveNode.checked = false;
        }
        setSelectedData(true);
        setLiveFilter(false);
        setNotLiveFilter(false);
        setSortBy('desc');
        setSortType('date');
    }
    const colseOderDetailsHandler = () => {
        dispatch(fetchOrderDetailsEmpty());
        dispatch(getOrderListActionV2(current, searchBy , producerFilter, createdOn,  status, sortBy, sortType)).then((res)=>{
            if(status){
                document.getElementById('live').checked = true
            } else if(status === false){
                document.getElementById('not_live').checked = true
            }
        });
        setIsOrderDetails(false)
        setIsOrderListing(true)
        localStorage.removeItem('order_number');
    }
    //Clearing data & filter when switching to other routes
    useEffect(() => {
        // Listen for changes in the route
        const unListen = routeHistory.listen((location, action) => {
            if(location.pathname !== '/orders'){
                dispatch(getOrderListActionV2(1, null , null, null,  null, 'desc', 'date'));
                clearFilterFunc();
            }
        });
        return () => {
            unListen();
        };
    }, [ history ]);
    const pageChange = (page) => {
        setCurrent(page);
    }
    const pageChange1 = (page) => {
        setCurrent1(page);
        if (isFilter && searchValue.length === 0) {
            dispatch(getOrderListAction(page, undefined, undefined,  sortBy, sortType));
            setAPIState({ first_parameter: page , second_parameter: undefined , third_parameter: undefined, sortBy: sortBy , sortType: sortType })
        }
    }
    useEffect(() => {
    // Fetch initial shipping fee from your API or state
    // This is a placeholder - replace with your actual API call
        const fetchShippingFee = async () => {
            try {
                // Replace with your actual API endpoint
                // const response = await api.getShippingFee();
                // setShippingFee(response.data.shippingFee);

                // For now, using a placeholder value
                setShippingFee('$10'); // update value
            } catch (error) {
                console.error('Error fetching shipping fee:', error);
            }
        };

        fetchShippingFee();
    }, []);

    // Add this function to handle updating the shipping fee
    const handleUpdateShippingFee = async () => {
        try {
            // Validate the shipping fee
            if (!shippingFee) {
                alert('Please enter a valid shipping fee');
                return;
            }

            // Replace with your actual API endpoint and payload structure
            // await api.updateShippingFee({ shippingFee: parseFloat(shippingFee) });

            // For demonstration, we'll just log the action
            console.log('Updating shipping fee to:', shippingFee);

            // Exit edit mode
            setIsEditingShippingFee(false);

            // Show success message
            alert('Shipping fee updated successfully!');
        } catch (error) {
            console.error('Error updating shipping fee:', error);
            alert('Failed to update shipping fee');
        }
    };

    const handleShippingFeeChange = (e) => {
        let value = e.target.value;

        // Allow only numbers and up to two decimals
        const priceRegex = /^\$?\d{0,9}(\.\d{0,2})?$/;

        // Always prefix with $
        if (value && !value.startsWith('$')) {
            value = '$' + value;
        }

        // If it matches our allowed pattern, update state
        if (priceRegex.test(value) || value === '' || value === '$') {
            setShippingFee(value);
        }
    };

    // Handle sorting feature in this function
    // -------------------------------------------------
    const handleSort = (pagination, filters, sorter, extra) => {
        if (extra.action === 'sort' ) {
            console.log('params', pagination, filters, sorter, extra);
            setSortBy(sorter.order === 'ascend'?'desc':'asc');
            console.log(sortBy)
            setSortType(sorter.columnKey);
            setCurrent(1);
        }
    }
    // ========================================================================================

    if(!isFilter == false){
        fullOrderTableData = []
    }
    const finalFullOrderData = !isFilter ? fullOrderTableData : filterData
    const finalPreOrderData = preOrderFilter.length === 0 ? preOrderTableData : preOrderFilter;
    const columns = [
        {
            title: 'Order ID',
            dataIndex: '',
            key: 'id',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'id' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '15%',
            render: (key) => {
                return (
                    <>
                        <a href onClick={() => openOrderDetails(key)}> {key.order_number} </a>
                    </>
                );
            },
        },
        {
            title: 'Event Code',
            dataIndex: 'event_codes',
            key: 'event_code',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_code' ? sortBy==='asc'?'descend':'ascend' : null,
            render: (key) => <>{eventCodesFormatter(key)}</>,
            width: '9%',
        },
        {
            title: 'Customer Account',
            dataIndex: 'full_name',
            key: 'name',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'name' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '13%',
        },
        {
            title: 'Location',
            dataIndex: 'state_name',
            key: 'location',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'location' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '8%',
        },
        {
            title: 'Order Type',
            dataIndex: 'order_mode_name',
            width: '9%',
        },
        {
            title: 'Package Count',
            dataIndex: 'package_quantity',
            key: 'package_count',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'package_count' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '11%',
        },
        {
            title: 'Digital',
            dataIndex: 'is_digital',
            width: '7%',
        },
        {
            title: 'Order Date',
            dataIndex: 'purchase_datetime',
            key: 'date',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'date' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '9%',
            // render: (key) => <>{dateMonthYearFormat(key)}</>,
        },
        {
            title: 'Client Name',
            dataIndex: 'event_producer',
            key: 'event_producer',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_producer' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '13%',
        },
        {
            title: 'Amount',
            dataIndex: 'price',
            render: (key) => <>{`${(key)}`} </>,
            width: '7%',
        },
        {
            title: 'Order Status',
            dataIndex: 'order_status',
            key: 'status',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'status' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '10%',
            render: (text, record) => (
                <div size="middle">
                    <span>{record.order_status === 1 ? <span className="order-status pending">(Pending)</span> : record.order_status === 2 ? <span className="order-status success">(Completed)</span> : record.order_status === 3 ? <span className="order-status success">(Shipped)</span> : ''}</span>
                </div>
            )
        },
        {
            title: 'Actions',
            dataIndex: '',
            align: 'left',
            width: '7%',
            render: (key) => {
                return (
                    <>
                        <img
                            src={read}
                            alt="read"
                            width="22"
                            className="me-2 icon-margin pointer"
                            onClick={() => openOrderDetails(key)}
                        />
                        <img
                            src={deleteicon}
                            alt="read"
                            width="14"
                            className="mx-2 icon-margin pointer"
                            onClick={() => confirmDeletFunc(key)}
                        />
                    </>
                );
            },
        }
    ]
    const preOrderColumns = [
        {
            title: 'Event Code',
            dataIndex: 'event_code',
            sorter: (a, b) => a && a.event_code && a.event_code.localeCompare(b && b.event_code),
            width: '12%',
        },
        {
            title: 'Event Producer',
            dataIndex: 'event_producer',
            sorter: (a, b) => a && a.event_producer && a.event_producer.localeCompare(b && b.event_producer),
            width: '12%',
        },
        {
            title: 'Event Name',
            dataIndex: 'event_name',
            sorter: (a, b) => a && a.event_name && a.event_name.localeCompare(b && b.event_name),
            width: '10%',
        },
        {
            title: 'Event Dates',
            dataIndex: '',
            sorter: {
                compare: (a, b) => a && a.start_date && a.start_date.localeCompare(b && b.start_date),
                multiple: 2,
            },
            width: '15%',
            render: (key) => <>{dateMonthYearFormat(key)} - {dateMonthYearFormatEnd(key)}</>,
        },
        {
            title: 'Customer Name',
            dataIndex: 'full_name',
            width: '10%',
            sorter: (a, b) => a && a.full_name && a.full_name.localeCompare(b && b.full_name),
        },
        {
            title: 'Team Name',
            dataIndex: 'folder_name',
            sorter: (a, b) => a && a.folder_name && a.folder_name.localeCompare(b && b.folder_name),
            width: '12%',
        },
        {
            title: 'Actions',
            dataIndex: '',
            align: 'center',
            width: '12%',
            render: (key) => {
                return (
                    <>
                        <img
                            src={edit}
                            alt="read"
                            width="22"
                            className="ms-5 icon-margin pointer"
                            onClick={() => openEditPreOrder(key)}
                        />
                        <img
                            src={deleteicon}
                            alt="read"
                            width="16"
                            className="ms-5 icon-margin pointer"
                            onClick={() => confirmDeletFunc(key)}
                        />
                    </>
                );
            },
        }
    ]
    return (
        <AuthLayoutContainer history={history} handleClose = { colseOderDetailsHandler } isOrderListing = {isOrderListing}>
            <div className="oders-page-wrapper" id='fileScroll'>
                <div className="page-wrapper event-page">
                    {
                        isOrderListing && <>
                            <div className="event-header pb-0">
                                <div className="heading">Orders</div>
                                <nav>
                                    <div className="nav nav-tabs" id="nav-tab" role="tablist">
                                        <button className="nav-link active full-order-tab" id="nav-full-tab" data-bs-toggle="tab" data-bs-target="#nav-full" type="button" role="tab" aria-controls="nav-full" aria-selected="true">Full Orders</button>
                                        {/* <button className="nav-link pre-order-tab" id="nav-pre-tab" data-bs-toggle="tab" data-bs-target="#nav-pre" type="button" role="tab" aria-controls="nav-pre" aria-selected="false">Pre Order</button> */}
                                    </div>
                                </nav>
                            </div>
                            <div className="tab-content" id="nav-tabContent">
                                <div className="tab-pane fade show active" id="nav-full" role="tabpanel" aria-labelledby="nav-full-tab">
                                    <div className="input-wrap d-flex flex-wrap py-3">
                                        <div className="p-2 ps-0 position-relative">
                                            <input
                                                className="search"
                                                type="search"
                                                name="orderIdSearchParam"
                                                placeholder="Order ID, Event ID"
                                                aria-label="Search"
                                                value={searchByValue || ''}
                                                onChange={updateSearch}
                                            />
                                            <ReactSVG src={search} alt="search" className="search-icon" />
                                        </div>
                                        <div className="p-2 position-relative t1">
                                            <select
                                                className="search pr-select-arrow pointer"
                                                name="EventType"
                                                onChange={handleFullOrderDropDown}
                                                value={ producerFilter }
                                            >
                                                {
                                                    selectedData ?
                                                        <option value="" disabled selected>
                                                            Placed By
                                                        </option> : ''
                                                }
                                                {uniqueplaceByList}
                                            </select>
                                        </div>
                                        <div className="p-2">
                                            <DatePicker id="dateP" className="input-search date-picker" value={ createdOn ? moment(createdOn) : null } placeholder="Created On" onChange={handleDateSelect} />
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <CheckBox id="live" handleActive={handleFilter}  disabled={notLiveFilter} />
                                            <GoDotFill className="active-icon" />
                                            <span className="label mx-1">Completed</span>
                                        </div>
                                        <div className="d-flex align-items-center p-2">
                                            <CheckBox id="not_live" handleActive={handleFilter}  disabled={liveFilter} />
                                            <GoDotFill className="inactive-icon" />
                                            <span className="label mx-1">Pending</span>
                                        </div>
                                        <button
                                            type="button"
                                            className="modal-add clear-filter-btn"
                                            onClick={() => clearFilterFunc()}
                                            disabled= { !searchBy && !producerFilter && !createdOn && status===null }
                                        >
                                            Clear Filter
                                        </button>
                                        <button
                                            type="button"
                                            className="modal-add clear-filter-btn"
                                            onClick={() => refreshFilter()}
                                        >
                                            Refresh
                                        </button>
                                        {/* Shipping Fee Component */}
                                        <div className="d-flex align-items-center p-2">
                                            {/* <label className="label me-2">Shipping Fee:</label> */}
                                            <div className="d-flex event-dropdown">
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    placeholder="Enter Shipping Fee"
                                                    className="input-field"
                                                    name="shippingFee"
                                                    disabled={!isEditingShippingFee}
                                                    value={shippingFee}
                                                    onChange={handleShippingFeeChange}
                                                />
                                                <span className="position-relative">
                                                    <select
                                                        className="form-control header_drop_down pointer price-dropdown-arrow"
                                                        name="currency"
                                                        disabled={true}
                                                    >
                                                        <option value="USD">USD</option>
                                                    </select>
                                                </span>
                                            </div>
                                            <button
                                                type="button"
                                                className="add-edit-btn edit-Shipping-btn"
                                                disabled={!shippingFee}
                                                onClick={isEditingShippingFee ? handleUpdateShippingFee : () => setIsEditingShippingFee(true)}
                                            >
                                                {isEditingShippingFee ? 'Update' : 'Edit'}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="data-table">
                                        {isLoading && <div className="mt-5" ><Loader /></div>}
                                        {!isLoading && <DataTable
                                            columns={columns}
                                            eventList={finalFullOrderData}
                                            onChange={handleSort}
                                            condKey='event-tbl'
                                            pageChange={pageChange}
                                            current={current}
                                            totalPages={totalPages}
                                        />}
                                    </div>
                                </div>
                                <div className="tab-pane fade preorder-panel" id="nav-pre" role="tabpanel" aria-labelledby="nav-pre-tab">
                                    <div className="input-wrap d-flex flex-wrap py-3">
                                        <div className="p-2 ps-0 position-relative">
                                            <input
                                                className="search"
                                                type="search"
                                                name="orderIdSearchParam"
                                                placeholder="Event Code, Title"
                                                aria-label="Search"
                                                value={searchValue || ''}
                                                onChange={preorderUpdateSearch}
                                            />
                                            <ReactSVG src={search} alt="search" className="search-icon" />
                                        </div>
                                        <div className="p-2 position-relative t1">
                                            <select
                                                className="search pr-select-arrow pointer"
                                                name="EventType"
                                                onChange={handlePreOrderDropDown}
                                            >
                                                {
                                                    selectedPreOrderData ?
                                                        <option value="" disabled selected>
                                                            Client Name
                                                        </option> : ''
                                                }
                                                {uniqueclientNameList}
                                            </select>
                                        </div>
                                        <button
                                            type="button"
                                            className="modal-add clear-filter-btn"
                                            onClick={() => clearFilterFunc()}
                                            disabled={preOrderFilter.length <= 0 }
                                        >
                                            Clear Filter
                                        </button>
                                    </div>
                                    <div className="data-table">
                                        {isLoading && <div className="mt-5" ><Loader /></div>}
                                        {!isLoading && <DataTable
                                            columns={preOrderColumns}
                                            eventList={finalPreOrderData}
                                            onChange={handleTableManipulation}
                                            pageChange={pageChange1}
                                            current={current1}
                                            totalPages={totalPages1}
                                        />}
                                    </div>
                                </div>
                            </div>
                        </>
                    }
                    {
                        isOrderDetails &&
                        <OrderDetails
                            handleClose={colseOderDetailsHandler}
                            cancelOderDetailsHandler={cancelOderDetailsHandler}
                            orderId={orderId}
                            orderStatus={orderStatus}
                            fileScroll = { document.getElementById('fileScroll') }
                        />
                    }
                    {
                        isEditPreOrder && (
                            <EditPreOrder
                                isModalVisible={isEditPreOrder}
                                handleClose={colseEditPreOrder}
                                editPreOrderInput={editPreOrderInput}
                                uniqueTeamNameList={uniqueTeamNameList}
                                inputError={editPreOrderInputError}
                                handleChange={handlePreOrderChange}
                                handleSubmit={handleUpdatePreOrder}
                            />
                        )
                    }
                    {isConfirmDelete && (
                        <DeleteEventModal
                            isModalVisible={isConfirmDelete}
                            handleClose={confirmDeletFunc}
                            handleSubmit={removeOrderFunc}
                        />
                    )}
                </div>
            </div>
        </AuthLayoutContainer>
    )
}
Orders.propTypes = {
    history: PropTypes.object,
};

export default Orders
