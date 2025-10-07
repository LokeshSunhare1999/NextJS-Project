/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable array-callback-return */
/* eslint-disable react/display-name */
import React,  { useEffect, useState } from 'react'
import PropTypes from 'prop-types';
import '../../static/style/files.scss';
import AuthLayoutContainer from 'shared/AuthLayoutContainer';
import { Breadcrumb } from 'antd';
import { HiChevronRight } from 'react-icons/hi';
import { ReactSVG } from 'react-svg';
import search from 'static/images/svg/search.svg';
import DataTable from 'shared/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import { getFileListingAction, fetchEventFoldersList, fetchEventDescriptionList, fetchFileList } from 'actions/fileActions';
import folder from 'static/images/svg/folder.svg';
import { SearchTableData } from 'utils/Helper';
import EventFolderList from './EventFolderList';
import DetailEventList from './DetailEventList';
import Loader from 'shared/Loader';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function Files(props) {
    const { history } = props
    const dispatch = useDispatch();
    const routeHistory = useHistory();
    // const handleTableManipulation = (pagination, filters, sorter, extra) => {
    //     console.log('params', pagination, filters, sorter, extra);
    // };
    const [ sortType, setSortType ] = useState('id');
    const [ sortBy, setSortBy ] = useState('desc');
    const [ selectedEventType, setSelectedEventType ] = useState('');
    const fileList = useSelector((state) => state.fileList.events_list)
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const [ searchValue, setSearchValue ] = useState('')
    const [ filterData, setFilterData ] = useState([])
    const [ eventId, setEventId ] = useState()
    const [ eventName, setEventName ] = useState()
    const [ eventCode, setEventCode ] = useState()
    const [ isFileListingPage, setIsFileListingPage ] = useState(true);
    const [ isEventFolderListingPage, setIsEventFolderListingPage ] = useState(false)
    const [ isDetailEventListPage, setIsDetailEventListPage ] = useState(false)
    const [ folderId, setFolderId ] = useState()
    const [ folderName, setFolderName ] = useState('')
    const [ selectedData, setSelectedData ] = useState(true)
    const [ apiState, setAPIState ] = useState({ first_parameter: undefined , second_parameter: null , sortBy: 'desc' , sortType: 'id' })
    const [ current, setCurrent ] = useState(1);
    const tableData = SearchTableData(fileList)
    const eventTypeList = []
    const [ isCall, setIsCall ] = useState(false)
    const totalPages = useSelector((state) => state.fileList.event_counts);
    fileList && fileList.map((data) => {
        return eventTypeList.push(data.event_mode_name)
    })
    // const uniqueEventTypeList = getUniqueArray(eventTypeList).map((eventType, idx) => {
    //     return <option key={ idx } value={ eventType } name={ eventType }>{eventType === "CHEER MODE" ? 'Cheer' : eventType === "DANCE MODE" ? 'Dance' : ''}</option>
    // })
    const eventListDescFunc = () => {
        setIsDetailEventListPage(false)
        setIsEventFolderListingPage(true)
        setIsFileListingPage(false)
        dispatch(fetchEventDescriptionList([]))
    }
    const fileListingFunc = () => {
        setIsDetailEventListPage(false)
        setIsEventFolderListingPage(false)
        setIsFileListingPage(true)
        dispatch(fetchEventFoldersList([]))
        dispatch(fetchEventDescriptionList([]))
        dispatch(getFileListingAction(undefined, null, sortBy , sortType));
    }
    const updateSearch = (event) => {
        setIsCall(true);
        setFilterData([]);
        setSelectedData(true);
        setSearchValue(event.target.value.substr(0,100))
        // if(event.target.value !== ''){
        //     const srarchValue = event.target.value;
        //     dispatch(getFileListingAction('search', srarchValue)).then((res) => {
        //         setFilterData(res.data.events_list);
        //     }) ;
        // } else {
        //     dispatch(getFileListingAction()).then((res) => {
        //         setFilterData(res.data.events_list);
        //     }) ;
        // }
    }
    useEffect(() => {
        if(isCall){
            setSelectedEventType('')
            if(searchValue !== ''){
                const getData = setTimeout(() => {
                    dispatch(getFileListingAction('search', searchValue, sortBy , sortType))
                    setCurrent(1);
                    setAPIState({ first_parameter:'search' , second_parameter: searchValue, sortBy: sortBy , sortType: sortType })
                }, 1500)
                return () => clearTimeout(getData)
            } else {
                dispatch(getFileListingAction(undefined, null, sortBy , sortType))
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                // setIsFilter(false)
                setCurrent(1);
            }
        }
    }, [ searchValue ])

    const handleDropDown = (event) => {
        setIsCall(false);
        setSearchValue('');
        const mode = event.target.value
        setSelectedEventType(mode)
        dispatch(getFileListingAction('filter', mode)).then((res) => {
            const temp = res.data.events_list.filter((data) => {
                return data.event_mode_name === event.target.value
            })
            setFilterData(temp)
            setSelectedData(false)
            setCurrent(1);
        }) ;
        setAPIState({ first_parameter: 'filter' , second_parameter: mode , sortBy: 'desc' , sortType: 'asc' })
    }

    const handlePageEventListingPage = (data) => {
        setEventId(data.id)
        setEventName(data.event_name)
        setEventCode(data.event_code)
        setIsFileListingPage(!isFileListingPage)
        dispatch(fetchFileList([]))
        setIsEventFolderListingPage(!isEventFolderListingPage)
    }

    const handleDetailEventLising = (data) => {
        setIsFileListingPage(!isFileListingPage)
        setIsDetailEventListPage(!isDetailEventListPage)
        setFolderId(data.id)
        setFolderName(data.folder_name)
        dispatch(fetchEventFoldersList([]))
    }

    const clearFilterFunc = () => {
        setFilterData([])
        setSelectedData(true)
        dispatch(getFileListingAction(undefined, null, sortBy , sortType));
        setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
        setCurrent(1);
    }
    //Clearing data when switching to other routes
    useEffect(() => {
        // Listen for changes in the route
        const unListen = routeHistory.listen((location, action) => {
            if(location.pathname !== '/files'){
                clearFilterFunc();
            }
        });
        return () => {
            unListen();
        };
    }, [ history ]);
    const folderListfunc = () => {
        // clearFilterFunc()
        setIsEventFolderListingPage(!isEventFolderListingPage)
        setIsFileListingPage(!isFileListingPage)
        dispatch(fetchEventFoldersList([]))
        dispatch(getFileListingAction(apiState.first_parameter, apiState.second_parameter, apiState.sortBy , apiState.sortType));
        setCurrent(current)
    }
    const goToEventListSection = () => {
        history.push('/events')
    }

    useEffect(() => {
        dispatch(getFileListingAction(undefined, null, sortBy , sortType)).then((res) => {
            setIsCall(!isCall);
        });
        dispatch(fetchEventFoldersList([]))
        dispatch(fetchEventDescriptionList([]))
        if(props.history.location.state !== undefined){
            const key = props.history.location.state
            handlePageEventListingPage(key)
        }

    },[ dispatch ])
    const pageChange = (page) => {
        setCurrent(page);
        if(selectedData && searchValue.length === 0){
            dispatch(getFileListingAction(page, null, sortBy , sortType));
            setAPIState({ first_parameter: page , second_parameter: null , sortBy: sortBy , sortType: sortType })
        }
    }

    // Handle all filter for sorting feature
    // --------------------------------------------
    const handleSortFilter = () => {
        let page = undefined;
        let value = null;
        if(selectedEventType !== '') {
            page = 'filter';
            value = selectedEventType;
        } else if (searchValue !== '') {
            page = 'search';
            value = searchValue;
        }
        return { page , value }
    }
    // ==========================================================================

    // Handle sorting feature in this function
    // -------------------------------------------------
    const handleSort = (pagination, filters, sorter, extra) => {
        let page = undefined;
        let value = null;

        const res = handleSortFilter();
        page = res.page;
        value = res.value;

        if (extra.action === 'sort' ) {
            console.log('params', pagination, filters, sorter, extra);
            setSortBy(sorter.order === 'ascend'?'desc':'asc');
            console.log(sortBy)
            setSortType(sorter.columnKey);
            setCurrent(1);
            dispatch(getFileListingAction(page , value , sorter.order === 'ascend'?'desc':'asc' , sorter.columnKey)).then((response) => {
                if(selectedEventType !== '' && searchValue !== ''){
                    setFilterData(response.data.events_list);
                }
            });
            setAPIState({ first_parameter: page , second_parameter: value , sortBy: sorter.order === 'ascend'?'desc':'asc' , sortType: sorter.columnKey })
        }
    }
    // ========================================================================================

    const finalData = filterData.length === 0 ? tableData : filterData
    const columns = [
        {
            title: 'Event Name',
            dataIndex: '',
            key: 'name',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'name' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '20%',
            render: (key) => {
                return (
                    <>
                        <a onClick = { () => handlePageEventListingPage(key) }> { key.event_name } </a>
                    </>
                );
            },
        },
        {
            title: 'Event code',
            dataIndex: 'event_code',
            key: 'event_code',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_code' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '20%',
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
            width: '20%',
            render: (key) => {
                const event_mode = key && key === "CHEER MODE" ? 'Cheer' : 'Dance';
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
            width: '20%',
        },
        {
            title: 'Actions',
            dataIndex: '',
            width: '10%',
            render: (key) => {
                return (
                    <>
                        <img
                            src={ folder }
                            alt="read"
                            width="22"
                            className="mx-2 icon-margin pointer"
                            onClick = { () => handlePageEventListingPage(key) }
                        />
                    </>
                );
            },
        }
    ]
    return (
        <AuthLayoutContainer history={ history }>
            <div className="file-page-wrapper" id='fileScroll'>
                <div className="page-wrapper event-page">
                    { isFileListingPage }
                    { isEventFolderListingPage }
                    { isDetailEventListPage }
                    {
                        isFileListingPage && !isEventFolderListingPage && !isDetailEventListPage && (
                            <>
                                <div className="event-header pb-3">
                                    <div className="heading">Files</div>
                                    <Breadcrumb className="text-start mt-3" separator= { (<HiChevronRight className="breadcrumb-arrow" />) }>
                                        <Breadcrumb.Item className="pointer" onClick={ () => goToEventListSection() }>Events</Breadcrumb.Item>
                                        <Breadcrumb.Item>Folders</Breadcrumb.Item>
                                    </Breadcrumb>
                                </div>
                                <div className="input-wrap d-flex flex-wrap py-3">
                                    <div className="p-2 ps-0 position-relative">
                                        <input
                                            className="search-box"
                                            type="search"
                                            name="eventSearchParam"
                                            placeholder="Event Name, Event Code"
                                            aria-label="Search"
                                            value = { searchValue || '' }
                                            onChange= { updateSearch }
                                        />
                                        <ReactSVG src={ search } alt="search" className="search-icon" />
                                    </div>
                                    <div className="p-2 position-relative t1">
                                        <select
                                            id="handleDropDown"
                                            className="search pr-select-arrow pointer"
                                            name="EventType"
                                            onChange={ handleDropDown }
                                        >
                                            {
                                                selectedData ?
                                                    <option value="" disabled selected>
                                                        Event Type
                                                    </option> : ''
                                            }
                                            {/* {uniqueEventTypeList} */}
                                            <option value={ 'DANCE' } name={ 'DANCE' }>Dance</option>
                                            <option value={ 'CHEER' } name={ 'CHEER' }>Cheer</option>
                                        </select>
                                        { selectedData }
                                    </div>
                                    <button
                                        type="button"
                                        className="modal-add clear-filter-btn"
                                        onClick ={ () => clearFilterFunc() }
                                        disabled= { selectedData }
                                    >Clear Filter</button>
                                </div>
                                <div className="data-table">
                                    { isLoading && <div className="mt-5" ><Loader /></div> }
                                    { !isLoading && <DataTable
                                        columns={ columns }
                                        eventList={ finalData }
                                        onChange={ handleSort }
                                        pageChange={ pageChange }
                                        current = { current }
                                        totalPages = { totalPages }
                                    />}
                                </div>
                            </>
                        )
                    }
                    {isEventFolderListingPage && !isFileListingPage && !isDetailEventListPage &&   (
                        <EventFolderList
                            folderListfunc= { folderListfunc }
                            eventId={ eventId }
                            eventName = { eventName }
                            history = { history }
                            eventCode= { eventCode }
                            handleDetailEventLising = { handleDetailEventLising }
                            fileScroll= { document.getElementById('fileScroll') }
                        />
                    )}
                    {isDetailEventListPage && (
                        <DetailEventList
                            eventListDescFunc = { eventListDescFunc }
                            fileListingFunc = { fileListingFunc }
                            eventId={ eventId }
                            folderName = { folderName }
                            eventCode = { eventCode }
                            eventName= { eventName }
                            history = { history }
                            folderId = { folderId }
                            fileScroll= { document.getElementById('fileScroll') }
                        />
                    )}
                </div>
            </div>
        </AuthLayoutContainer>
    )
}

Files.propTypes = {
    history: PropTypes.object,
};

export default Files
