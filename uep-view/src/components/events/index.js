/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable quotes */
/* eslint-disable array-callback-return */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'static/style/common.scss';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';
import AuthLayoutContainer from 'shared/AuthLayoutContainer';
import { DatePicker, Switch } from 'antd';
import edit from 'static/images/svg/setting.svg';
import dollar from 'static/images/dollar.png'
import deleteicon from 'static/images/delete.png';
import {
    fetchEventDetails,
    getDynamicPriceAction,
    getEventsListingAction,
    removeEventAction,
    viewEventDetailsAction,
    updateEventSyncStatusAction,
    saveTeamDetails,
} from 'actions/eventActions';
import { getFileListingAction, fetchEventFoldersList, fetchEventDescriptionList } from 'actions/fileActions';
import Button from 'shared/Button';
import AddNewEvent from './AddNewEvent';
import DynamicPricingModal from './DynamicPricingModal';
import CheckBox from 'shared/CustomCheck';
import DataTable from 'shared/DataTable';
import { dateMonthYearFormat, dateMonthYearFormatEnd, getUniqueArray, SearchTableData } from 'utils/Helper';
import 'static/style/event.scss';
import DeleteEventModal from 'shared/DeleteEventModal';
import search from 'static/images/svg/search.svg';
import { ReactSVG } from 'react-svg';
import Loader from 'shared/Loader';
import EditNewEvent from './EditNewEvent';
import { GoDotFill } from 'react-icons/go';
import moment from 'moment';
import { updateStatusType } from 'actions/commonActions';
import EventFolderList from 'components/files/EventFolderList';
import DetailEventList from 'components/files/DetailEventList';
import '../../static/style/files.scss';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
// import { useCallback } from 'react';

function Events(props) {
    const dispatch = useDispatch();
    const routeHistory = useHistory();
    const [ sortType, setSortType ] = useState('date');
    const [ sortBy, setSortBy ] = useState('desc');
    const [ filterDate, setFilterDate ] = useState('');
    const [ selectedProducer, setSelectedProducer ] = useState('');
    const [ isNewEventPage, setIsNewEventPage ] = useState(false);
    const [ isViewMode, setIsViewMode ] = useState(false);
    const [ isEditMode, setIsEditMode ] = useState(false);
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false);
    const [ isDynamicPriceModal, setIsDynamicPriceModal ] = useState(false);
    const [ searchValue, setSearchValue ] = useState('');
    const [ filterData, setFilterData ] = useState([]);
    const [ eventId, setEventId ] = useState('');
    const [ eventCode, setEventCode ] = useState('');
    const [ eventName, setEventName ] = useState()
    const [ folderId, setFolderId ] = useState()
    const [ folderName, setFolderName ] = useState('')
    const [ selectedData, setSelectedData ] = useState(true)
    const [ isFilter, setIsFilter ] = useState(false)
    const [ checked, setChecked ] = useState(false);
    const [ liveFilter, setLiveFilter ] = useState(false);
    const [ notLiveFilter, setNotLiveFilter ] = useState(false);
    const [ isFileListingPage, setIsFileListingPage ] = useState(false);
    const [ isDetailEventListPage, setIsDetailEventListPage ] = useState(false)
    const [ current, setCurrent ] = useState(1);
    const [ isCall, setIsCall ] = useState(false)
    const [ filterType, setFilterType ] = useState(undefined)
    const [ filterVal, setFilterVal ] = useState(null)
    const [ apiState, setAPIState ] = useState({ first_parameter: undefined , second_parameter: null , sortBy: 'desc' , sortType: 'date' })
    const { history } = props;
    useEffect(() => {
        dispatch(getEventsListingAction(undefined, null, sortBy, sortType)).then((res) => {
            setIsCall(!isCall)
        });
    }, [ dispatch ]);
    const eventList = useSelector((state) => state.eventList.events_list);
    const totalPages = useSelector((state) => state.eventList.event_counts);
    const eventDetails = useSelector((state) => state.eventDetails);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const tableData = SearchTableData(eventList);
    const producerList = useSelector((state) => state.eventList.producer_names);
    // eventList && eventList.map((data) => {
    //     producerList.sort((a, b) => a.localeCompare(b))
    //     return producerList.push(data.event_producer)
    // })
    const uniqueProducerList = getUniqueArray(producerList).map((producer, idx) => {
        return <option key={ idx } value={ producer } name={ producer }>{producer}</option>
    })
    const pageChange = (page) => {
        setCurrent(page);
        if(selectedData && searchValue.length === 0 && !isFilter){
            dispatch(getEventsListingAction(page, null, sortBy, sortType));
            setAPIState({ first_parameter: page , second_parameter: null , sortBy: sortBy , sortType: sortType })
        }
    }
    const onToggleChange = (checked, key, type) => {
        if(type === '3') {
            const data = { event_id: key.id, is_file_sync: checked ? 0 : 1 }
            dispatch(updateEventSyncStatusAction(key.id, data,current));
        } else {
            const data = { id: key.id, status: checked ? 1 : 0 }
            dispatch(updateStatusType(parseInt(type), data)).then(()=>{
                dispatch(getEventsListingAction(apiState.first_parameter, apiState.second_parameter, apiState.sortBy, apiState.sortType)).then((res)=>{
                    setFilterData(res.data.events_list)
                })
            });
            setCurrent(current);
        }
    };
    const openViewMode = (data) => {
        dispatch(viewEventDetailsAction(data.id));
        setIsViewMode(!isViewMode);
        setEventId(data.id)
    };
    const handleClose = () => {
        setIsViewMode(false);
        dispatch(fetchEventDetails({}))
    };
    const createEventFunc = () => {
        dispatch(saveTeamDetails([])); // For Empty team detail which is filled during file upload
        setIsNewEventPage(!isNewEventPage);
    };
    const handleEditEvent = (key) => {
        setEventId(key.id);
        setIsEditMode(!isEditMode);
    };
    const confirmDeleteFunc = (data) => {
        setEventId(data.id);
        setIsConfirmDelete(!isConfirmDelete);
    };
    const deleteEventFunc = () => {
        const maxPage = tableData?.length/10;
        const maxPage1 = filterData.length % 10;
        const isLastEvent =  maxPage1 === 1;
        if(isLastEvent){
            setCurrent(current-1)
        }
        setIsConfirmDelete(!isConfirmDelete);
        dispatch(removeEventAction(eventId)).then(() => {
            const filterDataIndex = filterData.findIndex((res) => res.id === eventId);
            const fullOrderTableDataIndex = tableData.findIndex((res) => res.id === eventId);
            if(filterDataIndex !== -1){
                // filterData.splice(filterDataIndex, 1);
                // if(isLastEvent && filterDataIndex === filterData.length ){
                dispatch(getEventsListingAction(filterType, filterVal, sortBy, sortType)).then((res) => {
                    setFilterData(res.data.events_list);
                    setIsFilter(true)
                })
                // }
            }
            if(fullOrderTableDataIndex !== -1){
                tableData.splice(fullOrderTableDataIndex, 1);
                if (!isFilter && searchValue === '') {
                    if(maxPage === 0.1 && tableData.length === 0 ){
                        dispatch(getEventsListingAction(current-1, null, sortBy, sortType)).then((res) => {
                            setIsFilter(false)
                        })
                    }else{
                        dispatch(getEventsListingAction(current, null, sortBy, sortType)).then((res) => {
                            setIsFilter(false)
                        })
                    }
                }
                if (searchValue !== '') {
                    dispatch(getEventsListingAction(filterType, filterVal, sortBy, sortType)).then((res) => {
                        setIsFilter(false)
                    })
                }
            }
        }).catch((error) => {
            console.error("API error:", error);
        });
    };

    const updateSearch = (event) => {
        setIsCall(true);
        setSearchValue(event.target.value.substr(0, 100));
    };

    const resetSearch = () => {
        setIsCall(false);
        setSearchValue('');
    }

    const clearOtherFilter = (filterType) => {
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
        if(filterType === 'producer'){
            setFilterDate('');
            liveNotLiveFilterCheck();
        } else if(filterType === 'date') {
            setSelectedProducer('');
            liveNotLiveFilterCheck();
            setSelectedData(true);
        } else if(filterType === 'live' || filterType === 'notLive' ) {
            setSelectedProducer('');
            setSelectedData(true);
            setFilterDate('');
        } else if(filterType === 'all' ) {
            setSelectedProducer('');
            setSelectedData(true);
            setFilterDate('');
            liveNotLiveFilterCheck();
        }
    }

    useEffect(() => {
        if(isCall){
            setIsFilter(false)
            if(searchValue !== ''){
                const getData = setTimeout(() => {
                    dispatch(getEventsListingAction('search', searchValue, sortBy, sortType))
                    setFilterType('search')
                    setFilterVal(searchValue)
                    setCurrent(1);
                    setAPIState({ first_parameter: 'search' , second_parameter: searchValue , sortBy: sortBy , sortType: sortType })
                    clearOtherFilter('all')
                }, 1500)
                return () => clearTimeout(getData)
            } else {
                dispatch(getEventsListingAction(undefined, null, sortBy, sortType))
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                setIsFilter(false)
                setFilterType(undefined)
                setFilterVal(null)
                setCurrent(1);
            }
        }
    }, [ searchValue ])

    const handleDropDown = (event) => {
        resetSearch();
        clearOtherFilter('producer')
        const mode = event.target.value
        setSelectedProducer(mode);
        dispatch(getEventsListingAction('filter', mode,  sortBy, sortType)).then((res) => {
            const temp =  res.data.events_list.filter((data) => {
                return data.event_producer === event.target.value
            })
            setFilterDate('')
            setFilterData(temp)
            setSelectedData(false)
            setIsFilter(true)
            setCurrent(1);
            setFilterType('filter')
            setFilterVal(mode)
        }) ;
        setAPIState({ first_parameter: 'filter' , second_parameter: mode , sortBy: sortBy , sortType: sortType })
    }
    const handleDateSelect = (event, date) => {
        resetSearch();
        clearOtherFilter('date')
        if(date === ''){
            setFilterDate('')
            dispatch(getEventsListingAction(undefined, null, sortBy, sortType))
            setIsFilter(false)
            setFilterType(undefined)
            setFilterVal(null)
            setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
        } else {
            setFilterDate(date)
            dispatch(getEventsListingAction('filter', date,  sortBy, sortType)).then((res) => {
                // const temp =  res.data.events_list.filter((data) => {
                //     return moment(data.start_date).format('MM/DD/YYYY') === moment(date).format('MM/DD/YYYY')
                // })
                setFilterData(res.data.events_list)
                setIsFilter(true)
                setFilterType('filter')
                setFilterVal(date)
                setAPIState({ first_parameter: 'filter' , second_parameter: date , sortBy: sortBy , sortType: sortType })
            }) ;
        }
        setCurrent(1);
    }
    const clearFilterFunc = () => {
        const node = document.getElementById('live');
        const notLiveNode = document.getElementById('not_live');
        if(node){
            node.checked= false;
        }
        if(notLiveNode){
            notLiveNode.checked = false;
        }
        setFilterData([])
        setSelectedData(true)
        setIsFilter(false)
        setCurrent(1);
        setLiveFilter(false);
        setNotLiveFilter(false);
        setFilterDate('')
        dispatch(getEventsListingAction(undefined, null, sortBy, sortType))
        setFilterType(undefined)
        setFilterVal(null)
        setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
    }
    const handleCloseEditEvent = () => {
        dispatch(getEventsListingAction(apiState.first_parameter, apiState.second_parameter, apiState.sortBy, apiState.sortType)).then((response)=>{
            if(isFilter){
                console.log(response, 'Response')
                setFilterData(response.data.events_list);
            }
            if (apiState.second_parameter == 1) {
                document.getElementById('live').checked = true
            }
            if(apiState.second_parameter == 0){
                document.getElementById('not_live').checked = true
            }
        });
        // dispatch(getEventsListingAction(undefined, null, sortBy, sortType));
        setIsEditMode(!isEditMode);
        setCurrent(current)
    };
    const createNewEventFunc = () => {
        setIsNewEventPage(!isNewEventPage);
        dispatch(getEventsListingAction())
        clearFilterFunc()
    };
    //Clearing data when switching to other routes
    useEffect(() => {
        // Listen for changes in the route
        const unListen = routeHistory.listen((location, action) => {
            if(location.pathname !== '/events'){
                clearFilterFunc();
            }
        });
        return () => {
            unListen();
        };
    }, [ history ]);
    const handleFilter = (event) => {
        clearOtherFilter('live');
        resetSearch();
        setChecked((c) => !c)
        // const tempArr = []
        setFilterData([])
        if (event.target.id === "live" && event.target.checked === true) {
            setLiveFilter(true)
            if (notLiveFilter === true) {
                setIsFilter(false)
                setFilterType(undefined)
                setFilterVal(null)
                dispatch(getEventsListingAction(undefined, null, sortBy, sortType))
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                // eventList && eventList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getEventsListingAction('filter', 1, sortBy, sortType)).then((res) => {
                    // const tempArr =  res.data.events_list.filter((data) => {
                    //     return data.is_active === 1
                    // })
                    setAPIState({ first_parameter: 'filter' , second_parameter: 1 , sortBy: sortBy , sortType: sortType })
                    setFilterData(res.data.events_list)
                    setIsFilter(true)
                    setFilterType('filter')
                    setFilterVal(1)
                });
                // eventList && eventList.map((data) => {
                //     if (data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            }
        } else if (event.target.id === "live" && event.target.checked === false) {
            setLiveFilter(false)
            if (notLiveFilter === true) {
                dispatch(getEventsListingAction('filter', 0, sortBy, sortType)).then((res) => {
                    // const tempArr =  res.data.events_list.filter((data) => {
                    //     return data.is_active === 1
                    // })
                    setAPIState({ first_parameter: 'filter' , second_parameter: 0 , sortBy: sortBy , sortType: sortType })
                    setFilterData(res.data.events_list)
                    setIsFilter(true)
                    setFilterType('filter')
                    setFilterVal(0)
                });
                // eventList && eventList.map((data) => {
                //     if (!data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                setIsFilter(false)
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getEventsListingAction(undefined, null, sortBy, sortType))
                // eventList && eventList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
            }
        } else if (event.target.id === "not_live" && event.target.checked === true) {
            setNotLiveFilter(true)
            if (liveFilter === true) {
                setIsFilter(false)
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getEventsListingAction(undefined, null, sortBy, sortType))
                // eventList && eventList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getEventsListingAction('filter', 0, sortBy, sortType)).then((res) => {
                    // const tempArr =  res.data.events_list.filter((data) => {
                    //     return data.is_active !== 1
                    // })
                    setAPIState({ first_parameter: 'filter' , second_parameter: 0 , sortBy: sortBy , sortType: sortType })
                    setFilterData(res.data.events_list)
                    setIsFilter(true)
                    setFilterType('filter')
                    setFilterVal(0)
                }) ;
                // eventList && eventList.map((data) => {
                //     if (!data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            }
        } else if (event.target.id === "not_live" && event.target.checked === false) {
            setNotLiveFilter(false)
            if (liveFilter === true) {
                dispatch(getEventsListingAction('filter', 1, sortBy, sortType)).then((res) => {
                    setAPIState({ first_parameter: 'filter' , second_parameter: 1 , sortBy: sortBy , sortType: sortType })
                    setFilterData(res.data.events_list)
                    setIsFilter(true)
                    setFilterType('filter')
                    setFilterVal(1)
                });
                // eventList && eventList.map((data) => {
                //     if (data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                setIsFilter(false)
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getEventsListingAction(undefined, null, sortBy, sortType))
                // eventList && eventList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(false)
            }
        }
        setCurrent(1);
    }
    console.log("!isFilter",!isFilter);
    console.log("tableData",tableData);
    console.log("filterData",filterData);
    const finalData = !isFilter ? tableData : filterData
    const handleDynamicPricingFunc = () => {
        setIsDynamicPriceModal(!isDynamicPriceModal)
        const id = eventId
        dispatch(getDynamicPriceAction(id))
    }
    const handleCloseDynamicModal = () => {
        setIsDynamicPriceModal(!isDynamicPriceModal)
        setIsViewMode(false)
    }
    const closeDynamicAndOpenDetailModal = () => {
        setIsDynamicPriceModal(!isDynamicPriceModal)
        setIsViewMode(true);
    }
    const eventDetailsPage = (info) => {
        setIsFileListingPage(true)
        setIsDetailEventListPage(false)
        setIsNewEventPage(false)
        setIsEditMode(false)
        setEventId(info.id)
        setEventCode(info.event_code)
        setEventName(info.event_name)
    }
    const handleDetailEventLising = (data) => {
        setIsFileListingPage(false)
        setIsDetailEventListPage(true)
        setFolderId(data.id)
        setFolderName(data.folder_name)
        dispatch(fetchEventFoldersList([]))
    }
    const eventListDescFunc = () => {
        setIsDetailEventListPage(false)
        setIsFileListingPage(false)
        dispatch(fetchEventDescriptionList([]))
    }
    const fileListingFunc = () => {
        setIsDetailEventListPage(false)
        setIsFileListingPage(true)
        dispatch(fetchEventFoldersList([]))
        dispatch(fetchEventDescriptionList([]))
        dispatch(getFileListingAction());
    }
    const closeEventDetailsHandler = () => {
        setIsFileListingPage(false)
        setIsNewEventPage(true)
        setIsEditMode(true)
    }
    const goToEventSectionFunc = () => {
        setIsDetailEventListPage(false)
        setIsFileListingPage(false)
        setIsEditMode(false)
        setIsNewEventPage(false)
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
            value = 1;
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
        } else if (selectedProducer !== '') {
            page = 'filter';
            value = selectedProducer;
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
            dispatch(getEventsListingAction(page , value , sorter.order === 'ascend'?'desc':'asc' , sorter.columnKey)).then((response) => {
                if(isFilter){
                    console.log(response, 'Response')
                    setFilterData(response.data.events_list);
                }
            });
            setAPIState({ first_parameter: page , second_parameter: value , sortBy: sorter.order === 'ascend'?'desc':'asc' , sortType: sorter.columnKey })
        }
    }
    // ========================================================================================

    const columns = [
        {
            title: 'Event Code',
            dataIndex: '',
            key: 'event_code',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_code' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '9%',
            render: (key) => {
                return (
                    <>
                        <a href className='highlight-text' onClick={ () => eventDetailsPage(key) }> { key.event_code } </a>
                    </>
                );
            },
        },
        {
            title: 'Event Title',
            dataIndex: '',
            key: 'name',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'name' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '10%',
            render: (key) => {
                return (
                    <span>{key.event_name}</span>
                );
            },
        },
        {
            title: 'Event Type',
            dataIndex: 'event_mode_name',
            key: 'event_type',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_type' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '7%',
            render: (key) => {
                const event_mode = key && key === 'CHEER MODE' ? 'Cheer' : 'Dance';
                return (
                    <>{ event_mode }</>
                );
            },
        },
        {
            title: 'Producer',
            dataIndex: 'event_producer',
            key: 'event_producer',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_producer' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '12%',
        },
        {
            title: 'Onsite Sales',
            dataIndex: 'is_onsite_sale_available',
            key: 'onsite',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'onsite' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '7.5%',
            render: (key) => {
                const onsite_sale = key && key === 1 ? 'Yes' : 'No';
                return (
                    <>{ onsite_sale }</>
                );
            },
        },
        {
            title: 'Event Dates',
            dataIndex: '',
            render: (key) => <>{ key.start_date } - { key.end_date }</>,
            key: 'date',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'date' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '12%',
        },
        {
            title: 'Internet',
            dataIndex: '',
            width: '5%',
            align: 'left',
            render: (key) => {
                return (
                    <Switch
                        onChange={ (checked) => onToggleChange(checked, key , '1') }
                        checked={ key && key.is_internet_available }
                        className={
                            key && key.is_internet_available ? 'toggle-green' : 'toggle-red'
                        }
                    />
                );
            },
        },
        {
            title: 'Kiosk',
            dataIndex: '',
            width: '5%',
            align: 'left',
            render: (key) => {
                return (
                    <Switch
                        onChange={ (checked) => onToggleChange(checked, key, '2') }
                        checked={ key && key.is_kiosk_mode }
                        className={
                            key && key.is_kiosk_mode ? 'toggle-green' : 'toggle-red'
                        }
                    />
                );
            },
        },
        {
            title: 'Active',
            dataIndex: '',
            width: '4%',
            align: 'left',
            render: (key) => {
                return (
                    <Switch
                        onChange={ (checked) => onToggleChange(checked, key, '0') }
                        checked={ key && key.is_active }
                        className={
                            key && key.is_active ? 'toggle-green' : 'toggle-red'
                        }
                    />
                );
            },
        },
        // {
        //     title: 'Sync',
        //     dataIndex: '',
        //     width: '4%',
        //     align: 'left',
        //     render: (key) => {
        //         return (
        //             <Switch
        //                 onChange={ (checked) => onToggleChange(checked, key, '3') }
        //                 checked={ key && key.is_file_sync === 0 }
        //                 className={
        //                     key && key.is_file_sync ? 'toggle-red' : 'toggle-green'
        //                 }
        //             />
        //         );
        //     },
        // },
        {
            title: 'Actions',
            dataIndex: '',
            align: 'center',
            width: '10%',
            render: (key) => {
                return (
                    <>
                        <img
                            src={ dollar }
                            alt="read"
                            onClick={ () => openViewMode(key) }
                            width="17"
                            className="mx-2 icon-margin pointer"
                        />
                        <img
                            src={ edit }
                            alt="edit"
                            onClick={ () => handleEditEvent(key) }
                            width="20"
                            className="mx-2 icon-margin pointer"
                        />
                        <img
                            src={ deleteicon }
                            alt="deleteicon"
                            onClick={ () => confirmDeleteFunc(key) }
                            width="15"
                            className="mx-2 icon-margin pointer"
                        />
                    </>
                );
            },
        },
    ];

    return (
        <AuthLayoutContainer history={ history }>
            <div className="event-main"  id='fileScroll'>
                <div className="page-wrapper event-page eventList-page">
                    {!isNewEventPage && !isEditMode && !isFileListingPage && !isDetailEventListPage &&  (
                        <>
                            <div className="event-header d-flex justify-content-between align-items-center">
                                <div className="heading">Events</div>
                                <div className="">
                                    <Button
                                        className="create-btn"
                                        handleSubmit={ () => createEventFunc() }
                                        buttonName="+ Create Event"
                                    />
                                </div>
                            </div>
                            <div className="input-wrap d-flex flex-wrap py-3">
                                <div className="p-2 ps-0 position-relative">
                                    <input
                                        className="search"
                                        type="search"
                                        name="patientSearchParam"
                                        value={ searchValue || '' }
                                        onChange={ updateSearch }
                                        placeholder="Event Code, Title"
                                        aria-label="Search"
                                        autoComplete='off'
                                    />
                                    <ReactSVG src={ search } alt="search" className="search-icon" />
                                </div>
                                <div className="p-2 position-relative t1">
                                    <select
                                        id='producer_name_list'
                                        className="search pr-select-arrow pointer"
                                        name="producerName"
                                        onChange={ handleDropDown }
                                    >
                                        {
                                            selectedData ?
                                                <option value="" disabled selected>
                                                    Producer Name
                                                </option> : ''
                                        }
                                        {uniqueProducerList}
                                    </select>
                                </div>
                                <div className="p-2 position-relative">
                                    <select
                                        disabled
                                        className="input-search preorder-select-arrow pointer"
                                        name="isToday"
                                    >
                                        <option value="" disabled selected>Pre Order</option>
                                        {/* <option name="isToday" value="today">
                                            po1
                                        </option> */}
                                    </select>
                                </div>
                                <div className="p-2">
                                    <DatePicker className="input-search date-picker" value={ filterDate ? moment(filterDate) : null } placeholder="Created On" onChange ={ handleDateSelect }
                                    />
                                </div>
                                <div className="d-flex align-items-center p-2">
                                    <CheckBox checked={ checked } id="live" handleActive = { handleFilter } disabled={ notLiveFilter }/>
                                    <GoDotFill className="active-icon" />
                                    <span className="label mx-1">Live</span>
                                </div>
                                <div className="d-flex align-items-center p-2">
                                    <CheckBox id="not_live" handleActive = { handleFilter } disabled={ liveFilter }/>
                                    <GoDotFill className="inactive-icon" />
                                    <span className="label mx-1">Not Live</span>
                                </div>
                                <button
                                    type="button"
                                    className="modal-add clear-filter-btn"
                                    onClick ={ () => clearFilterFunc() }
                                    disabled= { selectedData && filterDate === '' && liveFilter!== true && notLiveFilter !== true  }
                                >
                                    Clear Filter
                                </button>
                            </div>
                            {isLoading && <div className='mt-5'><Loader /></div> }
                            <div className="data-table">
                                {!isLoading && (
                                    <DataTable
                                        columns={ columns }
                                        onChange={ handleSort }
                                        eventList={ finalData }
                                        condKey='event-tbl'
                                        pageChange={ pageChange }
                                        current = { current }
                                        totalPages = { totalPages }
                                    />
                                )}
                            </div>
                        </>
                    )}
                    {isNewEventPage && <AddNewEvent
                        createEventFunc={ createEventFunc }
                        createNewEventFunc={ createNewEventFunc }
                        handleDynamicPricingFunc = { handleDynamicPricingFunc }
                        isDynamicPriceModal = { isDynamicPriceModal }
                        handleCloseDynamicModal ={ handleCloseDynamicModal }
                        eventId = { eventId }
                        closeDynamicAndOpenDetailModal = { closeDynamicAndOpenDetailModal }
                        history = { history } />}
                    {isEditMode && (
                        <EditNewEvent
                            handleCloseEditEvent={ handleCloseEditEvent }
                            eventId={ eventId }
                            history ={ history }
                            handleDynamicPricingFunc = { handleDynamicPricingFunc }
                            isDynamicPriceModal = { isDynamicPriceModal }
                            handleCloseDynamicModal ={ handleCloseDynamicModal }
                            closeDynamicAndOpenDetailModal = { closeDynamicAndOpenDetailModal }
                            current = { current }
                            setCurrent = { setCurrent }
                        />
                    )}
                    {isFileListingPage && (
                        <EventFolderList
                            eventId = { eventId }
                            eventCode = { eventCode }
                            eventName = { eventName }
                            history = { history }
                            isFileListingPage = { isFileListingPage }
                            handleClose = { closeEventDetailsHandler }
                            handleDetailEventLising = { handleDetailEventLising }
                            goToEventSectionFunc={ goToEventSectionFunc }
                            fileScroll={ document.getElementById('fileScroll') }
                        />
                    )}
                    {isDetailEventListPage && (
                        <DetailEventList
                            eventListDescFunc = { eventListDescFunc }
                            fileListingFunc = { fileListingFunc }
                            goToEventSectionFunc={ goToEventSectionFunc }
                            eventId={ eventId }
                            folderName = { folderName }
                            eventCode = { eventCode }
                            eventName= { eventName }
                            history = { history }
                            folderId = { folderId }
                            fileScroll={ document.getElementById('fileScroll') }
                        />
                    )}
                </div>
            </div>
            {isViewMode && (
                <div className="event-detail-modal">
                    <DynamicPricingModal
                        isModalVisible={ isViewMode }
                        handleClose={ handleClose }
                        eventDetails={ eventDetails }
                        eventId = { eventId }
                        current = { current }
                        setCurrent = { setCurrent }
                    />
                </div>
            )}
            {isConfirmDelete && (
                <DeleteEventModal
                    isModalVisible={ isConfirmDelete }
                    handleClose={ confirmDeleteFunc }
                    handleSubmit={ deleteEventFunc }
                />
            )}
        </AuthLayoutContainer>
    );
}
Events.propTypes = {
    history: PropTypes.object,
};
export default Events;