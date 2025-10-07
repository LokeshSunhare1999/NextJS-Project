/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
/* eslint-disable template-curly-spacing */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable array-callback-return */
/* eslint-disable react/display-name */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { DatePicker, Switch } from 'antd';
import DataTable from 'shared/DataTable';
import edit from 'static/images/svg/setting.svg';
import deleteicon from 'static/images/delete.png';
import read from 'static/images/read-eye.png';
import { addProducerAction, getProducerProfileAction, updateProducerAction, removeProducerAction, getProducerList } from 'actions/producerActions';
import Button from 'shared/Button';
import CheckBox from 'shared/CustomCheck';
import ViewProducerDetails from './ViewProducerDetails';
import AddNewProducer from './AddNewProducer';
import EditNewProducer from './EditNewProducer';
import search from 'static/images/svg/search.svg';
import { ReactSVG } from 'react-svg';
import DeleteEventModal from 'shared/DeleteEventModal';
import { GoDotFill } from 'react-icons/go';
import { SearchTableData } from 'utils/Helper';
import moment from 'moment';
import { updateStatusType } from 'actions/commonActions';
import Loader from 'shared/Loader';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function ProducerListing(props) {
    const { history } = props;
    const dispatch = useDispatch();
    const routeHistory = useHistory();
    const [ sortType, setSortType ] = useState('id');
    const [ sortBy, setSortBy ] = useState('desc');
    const [ filterDate, setFilterDate ] = useState('');
    const [ isCall, setIsCall ] = useState(false)
    useEffect(() => {
        dispatch(getProducerList(undefined, null ,sortBy , sortType )).then((res) => {
            setIsCall(!isCall);
        });
    }, [ dispatch ]);
    const [ input, setInput ] = useState({});
    const [ inputError, setInputError ] = useState({});
    const [ editProducerInput, setEditProducerInput ] = useState({});
    const [ editProducerInputError, setEditProducerInputError ] = useState({});
    const [ producerId, setProducerId ] = useState('');
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const [ isViewMode, setIsViewMode ] = useState(false);
    const [ isNewProducer, setIsNewProducer ] = useState(false);
    const [ isEditProducer, setIsEditProducer ] = useState(false);
    const producerList = useSelector((state) => state.producerList.producer_list);
    const producerProfileDetails = useSelector((state) => state.producerProfileDetails);
    const [ searchValue, setSearchValue ] = useState('');
    const [ filterData, setFilterData ] = useState([]);
    const tableData = SearchTableData(producerList);
    const [ isFilter, setIsFilter ] = useState(false)
    const [ liveFilter, setLiveFilter ] = useState(false);
    const [ notLiveFilter, setNotLiveFilter ] = useState(false);
    const [ current, setCurrent ] = useState(1);
    const [ filterType, setFilterType ] = useState(undefined)
    const [ filterVal, setFilterVal ] = useState(null)
    const [ isChangePage, setIsChangePage ] = useState(true);
    const [ apiState, setAPIState ] = useState({ first_parameter: undefined , second_parameter: null , sortBy: 'desc' , sortType: 'id' })
    const totalPages = useSelector((state) => state?.producerList?.producers_counts)
    //Clearing data when switching to other routes
    useEffect(() => {
        // Listen for changes in the route
        const unListen = routeHistory.listen((location, action) => {
            if(location.pathname !== '/producers'){
                dispatch(getProducerList(undefined, null, sortBy, sortType))
            }
        });
        return () => {
            unListen();
        };
    }, [ history ]);
    const normalizeInput = (value, previousValue) => {
        if (!value) return value;
        const currentValue = value.replace(/[^\d]/g, '');
        const cvLength = currentValue.length;

        if (!previousValue || value.length > previousValue.length) {
            if (cvLength < 4) return currentValue;
            if (cvLength < 7) return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3)}`;
            return `(${currentValue.slice(0, 3)}) ${currentValue.slice(3, 6)}-${currentValue.slice(6, 10)}`;
        }
    };

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

    const updateSearch = (event) => {
        setIsCall(true);
        const { value } = event.target
        if(searchValue !== '' || searchValue !== undefined){
            const pattern = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(value);
            if(pattern){
                setSearchValue(prevState=> ( normalizeInput(value, prevState) ))
            } else {
                setSearchValue(event.target.value.substr(0, 100))
            }
        } else {
            dispatch(getProducerList(undefined, null ,sortBy , sortType ))
            setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
        }
        // setCurrent(1);
    };
    useEffect(() => {
        if(isCall){
            clearOtherFilter('all')
            if(searchValue === undefined){
                dispatch(getProducerList(undefined, null ,sortBy , sortType ))
                setIsFilter(false)
                setIsChangePage(true);
                setFilterData([])
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                setCurrent(1);
            } else if(searchValue !== '') {
                setIsFilter(false)
                setFilterType('search')
                setFilterVal(searchValue)
                setAPIState({ first_parameter: 'search' , second_parameter: searchValue , sortBy: sortBy , sortType: sortType })
                const getData = setTimeout(() => {
                    dispatch(getProducerList('search', searchValue ,sortBy , sortType ))
                    setCurrent(1);
                }, 1500)
                return () => clearTimeout(getData)
            } else {
                dispatch(getProducerList(undefined, null ,sortBy , sortType ))
                setIsFilter(false)
                setIsChangePage(true);
                setFilterData([])
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                setCurrent(1);
            }
            // if(searchValue !== ''){
            //     const getData = setTimeout(() => {
            //         dispatch(getProducerList('search', searchValue))
            //     }, 1500)
            //     return () => clearTimeout(getData)
            // } else {
            //     dispatch(getProducerList())
            //     setIsFilter(false)
            //     setFilterData([])
            // }
        }
    }, [ searchValue ])
    const handleTableManipulation = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const onToggleChange = (checked, key, type) => {
        const data = {
            id: key.producer_id,
            status: checked ? 1 : 0
        }
        dispatch(updateStatusType(parseInt(type), data)).then(()=>{
            dispatch(getProducerList(apiState.first_parameter, apiState.second_parameter, apiState.sortBy, apiState.sortType)).then((res)=>{
                setFilterData(res.data.producer_list)
            })
        });
        setCurrent(current);
    };
    const openViewModeFunc = (key) => {
        const producer_id = key.producer_id
        dispatch(getProducerProfileAction(producer_id))
        setIsViewMode(!isViewMode);
    };
    const createProducer = () => {
        setIsNewProducer(!isNewProducer);
        setInputError({})
    };
    const handleCloseEditModal = () => {
        setIsEditProducer(!isEditProducer)
        setInputError({})
        setEditProducerInput({})
    }
    const handleProducerChange = (event) => {
        const { name, value } = event.target;
        if (name === 'phone_number'){
            let obj = value;
            var numbers = obj.replace(/\D/g, ''),
                char ={ 0: '(', 3: ') ', 6: '-' };
            obj = '';
            for (var i = 0; i < numbers.length; i++) {
                obj += (char[ i ] || '') + numbers[ i ];
            }
            setEditProducerInput((prevState) => ({ ...prevState, [ name ]: obj }));
        }
        else {
            setEditProducerInput((prevState) => ({ ...prevState, [ name ]: value }));
        }
        setEditProducerInputError({})
    };
    const UpdateProducerFunc = (key) => {
        setProducerId(key.producer_id)
        dispatch(getProducerProfileAction(key.producer_id)).then((res) => {
            if (res && res.statusCode === 200) {
                setEditProducerInput(res.data.producer_profile);
            }
        });
        setIsEditProducer(!isEditProducer);
    };
    const confirmDeleteFunc = (key) => {
        setProducerId(key.producer_id)
        setIsConfirmDelete(!isConfirmDelete);
    };
    const deleteEventFunc = () => {
        const maxPage = totalPages % 10;
        const maxPage1 = filterData.length % 10;
        const isLastEvent =  maxPage1 === 1;
        if(isLastEvent){
            setCurrent(current-1)
        }
        setIsConfirmDelete(!isConfirmDelete);
        dispatch(removeProducerAction(producerId)).then(() => {
            const filterDataIndex = filterData.findIndex((res) => res.producer_id === producerId);
            const fullOrderTableDataIndex = tableData.findIndex((res) => res.producer_id === producerId);
            if(filterDataIndex !== -1){
                // filterData.splice(filterDataIndex, 1);
                dispatch(getProducerList(filterType, filterVal, sortBy, sortType)).then((res) => {
                    setFilterData(res.data.producer_list);
                    setIsFilter(true)
                    setIsChangePage(true);
                })
            }
            if(fullOrderTableDataIndex !== -1){
                tableData.splice(fullOrderTableDataIndex, 1);
                if (!isFilter && searchValue === '') {
                    if(maxPage === 1 && tableData.length === 0 ){
                        dispatch(getProducerList(current-1, null, sortBy, sortType)).then((res) => {
                            setIsFilter(false)
                            setIsChangePage(true);
                        })
                    }else{
                        dispatch(getProducerList(current, null, sortBy, sortType)).then((res) => {
                            setIsFilter(false)
                            setIsChangePage(true);
                        })
                    }
                }
                if (searchValue !== '') {
                    dispatch(getProducerList(filterType, filterVal, sortBy, sortType)).then((res) => {
                        setIsFilter(false)
                        setIsChangePage(true);
                    })
                }
            }
        });
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'phone_number'){
            let obj = value;
            var numbers = obj.replace(/\D/g, ''),
                char ={ 0: '(', 3: ') ', 6: '-' };
            obj = '';
            for (var i = 0; i < numbers.length; i++) {
                obj += (char[ i ] || '') + numbers[ i ];
            }
            setInput((prevState) => ({ ...prevState, [ name ]: obj }));
        }
        else {
            setInput((prevState) => ({ ...prevState, [ name ]: value }));
        }
        setInputError({})
    };
    const validate = () => {
        const errors = {};
        let isValid = true;
        if (!input.contact_name) {
            isValid = false;
            errors.contact_name = 'Please contact name';
        }
        if (!input.email_id) {
            isValid = false;
            errors.email_id = 'Please enter email';
        }
        if (!input.phone_number) {
            isValid = false;
            errors.phone_number = 'Please enter phone number';
        }
        if (!input.event_producer) {
            isValid = false;
            errors.event_producer = 'Please enter event producer ';
        }
        if (!input.producer_address) {
            isValid = false;
            errors.producer_address = 'Please enter producer address';
        }
        setInputError(errors);

        return isValid;
    };
    const handleSubmit = () => {
        const data = input
        if (validate()) {
            dispatch(addProducerAction(data))
            setIsNewProducer(!isNewProducer)
            setInput({})
            setCurrent(1)
            setFilterDate('')
            setIsFilter(false)
            setIsChangePage(true);
            const node = document.getElementById('live');
            const notLiveNode = document.getElementById('not_live');
            if (node.checked || notLiveNode.checked) {
                node.checked = false;
                notLiveNode.checked = false;
            }
        }
    };
    const validateEdit = () => {
        const errors = {};
        let isValid = true;
        if (!editProducerInput.contact_name) {
            isValid = false;
            errors.contact_name = 'Please contact name';
        }
        if (!editProducerInput.email_id) {
            isValid = false;
            errors.email_id = 'Please enter email';
        }
        if (!editProducerInput.phone_number) {
            isValid = false;
            errors.phone_number = 'Please enter phone number';
        }
        if (!editProducerInput.event_producer) {
            isValid = false;
            errors.event_producer = 'Please enter event producer ';
        }
        if (!editProducerInput.producer_address) {
            isValid = false;
            errors.producer_address = 'Please enter producer address';
        }
        setEditProducerInputError(errors);

        return isValid;
    };
    const handleUpdateProducer = () => {
        // const node = document.getElementById('live');
        // const notLiveNode = document.getElementById('not_live');
        // if (node.checked || notLiveNode.checked) {
        //     node.checked = false;
        //     notLiveNode.checked = false;
        // }
        const id = producerId
        const { contact_name, email_id, event_producer, phone_number, producer_address } = editProducerInput
        const data = {
            contact_name: contact_name,
            email_id: email_id,
            phone_number: phone_number,
            event_producer: event_producer,
            producer_address: producer_address,
        }
        if (validateEdit()) {
            dispatch(updateProducerAction(id, data))
            setEditProducerInput({})
            setIsEditProducer(false)
            setIsFilter(false)
            setIsChangePage(false);
            setTimeout(() => {
                dispatch(getProducerList(apiState.first_parameter, apiState.second_parameter, apiState.sortBy, apiState.sortType))
                setCurrent(current)
            }, 400);
        }
    }
    const handleDateSelect = (event, date) => {
        resetSearch();
        clearOtherFilter('date');
        if(date === ''){
            setFilterDate('')
            dispatch(getProducerList(undefined, null ,sortBy , sortType ))
            setIsFilter(false)
            setIsChangePage(true);
            setFilterType(undefined)
            setFilterVal(null)
            setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
        } else {
            setFilterDate(date)
            dispatch(getProducerList('filter', date, sortBy , sortType )).then((res) => {
                console.log(res)
                const temp =  res.data.producer_list.filter((data) => {
                    return moment(data.created_datetime).format('MM/DD/YYYY') === moment(date).format('MM/DD/YYYY')
                })
                console.log(temp)
                setFilterData(temp)
                setIsFilter(true)
                setIsChangePage(true);
                setFilterType('filter')
                setFilterVal(date)
                setAPIState({ first_parameter: 'filter' , second_parameter: date , sortBy: sortBy , sortType: sortType })
            }) ;
        }
        setCurrent(1);
    }
    const handleFilter = (event) => {
        resetSearch();
        clearOtherFilter('live');
        // const tempArr = []
        setFilterData([])
        if (event.target.id === 'live' && event.target.checked === true) {
            setLiveFilter(true)
            if (notLiveFilter === true) {
                setIsFilter(false)
                setIsChangePage(true);
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getProducerList(undefined, null ,sortBy , sortType ))
                // producerList && producerList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getProducerList('filter', 1, sortBy , sortType )).then((res) => {
                    setFilterData(res.data.producer_list)
                    setIsFilter(true)
                    setIsChangePage(true);
                    setFilterType('filter')
                    setFilterVal(1)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 1 , sortBy: sortBy , sortType: sortType })
                });
                // producerList && producerList.map((data) => {
                //     if (data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            }
        } else if (event.target.id === 'live' && event.target.checked === false) {
            setLiveFilter(false)
            if (notLiveFilter === true) {
                dispatch(getProducerList('filter', 0  ,sortBy , sortType )).then((res) => {
                    setFilterData(res.data.producer_list)
                    setIsFilter(true)
                    setIsChangePage(true);
                    setFilterType('filter')
                    setFilterVal(0)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 0 , sortBy: sortBy , sortType: sortType })
                });
                // producerList && producerList.map((data) => {
                //     if (!data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                setIsFilter(false)
                setIsChangePage(true);
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getProducerList(undefined, null ,sortBy , sortType ))
                // producerList && producerList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            }
        } else if (event.target.id === 'not_live' && event.target.checked === true) {
            setNotLiveFilter(true)
            if (liveFilter === true) {
                setIsFilter(false)
                setIsChangePage(true);
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getProducerList(undefined, null ,sortBy , sortType ))
                // producerList && producerList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getProducerList('filter', 0, sortBy , sortType )).then((res) => {
                    setFilterData(res.data.producer_list)
                    setIsFilter(true)
                    setIsChangePage(true);
                    setFilterType('filter')
                    setFilterVal(0)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 0 , sortBy: sortBy , sortType: sortType })
                });
                // producerList && producerList.map((data) => {
                //     if (!data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            }
        } else if (event.target.id === 'not_live' && event.target.checked === false) {
            setNotLiveFilter(false)
            if (liveFilter === true) {
                dispatch(getProducerList('filter', 1)).then((res) => {
                    setFilterData(res.data.producer_list)
                    setIsFilter(true)
                    setIsChangePage(true);
                    setFilterType('filter')
                    setFilterVal(1)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 1 , sortBy: sortBy , sortType: sortType })
                });
                // producerList && producerList.map((data) => {
                //     if (data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                setIsFilter(false)
                setIsChangePage(true);
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getProducerList(undefined, null ,sortBy , sortType ))
                // producerList && producerList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(false)
            }
        }
        setCurrent(1);
    }

    const pageChange = (page) => {
        setCurrent(page);
        // dispatch(getProducerList(page));
        if(searchValue === undefined){
            dispatch(getProducerList(page, null ,sortBy , sortType ))
            setIsFilter(false)
            setIsChangePage(true);
            setAPIState({ first_parameter: page , second_parameter: null , sortBy: sortBy , sortType: sortType })
        } else if(!isFilter && searchValue?.length === 0 && isChangePage){
            dispatch(getProducerList(page, null ,sortBy , sortType ));
            setAPIState({ first_parameter: page , second_parameter: null , sortBy: sortBy , sortType: sortType })
        }
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
            dispatch(getProducerList(page , value , sorter.order === 'ascend'?'desc':'asc' , sorter.columnKey)).then((response) => {
                if(isFilter){
                    setFilterData(response.data.producer_list);
                }
            });
            setAPIState({ first_parameter: page , second_parameter: value , sortBy: sorter.order === 'ascend'?'desc':'asc' , sortType: sorter.columnKey })
        }
    }
    // ========================================================================================

    const finalData = !isFilter ? tableData : filterData
    const columns = [
        {
            title: 'Event Producer',
            dataIndex: 'event_producer',
            key: 'event_producer',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_producer' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '15%',

        },
        {
            title: 'Producer ID',
            dataIndex: 'producer_id',
            key: 'id',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'id' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '10%',
        },
        {
            title: 'Event Count',
            dataIndex: '',
            key: 'event_count',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_count' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '10%',
            render: (key) => {
                return (
                    <span className='highlight-text underline'>{ key.event_count }</span>
                );
            },
        },
        {
            title: 'Contact Name',
            dataIndex: 'contact_name',
            key: 'name',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'name' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '12%',
        },
        {
            title: 'Contact Email',
            dataIndex: 'email_id',
            key:'email',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'email' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '16%',
        },
        {
            title: 'Contact Telephone',
            dataIndex: 'phone_number',
            key:'phone',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'phone' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '20%',
        },
        {
            title: 'Actions',
            dataIndex: '',
            width: '13%',
            render: (key) => {
                return (
                    <>
                        <img
                            src={ read }
                            alt="read"
                            onClick={ () => openViewModeFunc(key) }
                            width="22"
                            className="mx-2 pointer"
                        />
                        <img
                            src={ edit }
                            alt="edit"
                            onClick={ () => UpdateProducerFunc(key) }
                            width="20"
                            className="mx-3 pointer"
                        />
                        <img
                            src={ deleteicon }
                            alt="deleteicon"
                            onClick={ () => confirmDeleteFunc(key) }
                            width="15"
                            className="mx-2 pointer"
                        />
                    </>
                );
            },
        },
        {
            title: 'Status',
            dataIndex: '',
            width: '8%',
            render: (key) => {
                return (
                    <Switch
                        onChange={ (checked) => onToggleChange(checked, key , '7') }
                        checked={ key && key.is_active }
                        className={
                            key && key.is_active ? 'toggle-green' : 'toggle-red'
                        }
                    />
                );
            },
        },
    ];
    return (
        <>
            <div className="event-main">
                <div className="page-wrapper producer-page">
                    <div className="event-header d-flex justify-content-between align-items-center">
                        <div className="heading">Producers</div>
                        <div>
                            <Button
                                className="create-btn"
                                handleSubmit={ () => createProducer() }
                                buttonName="+ Add Producer"
                            />
                        </div>
                    </div>
                    <div className="d-flex input-wrap py-3">
                        <div className="p-2 ps-0 position-relative">
                            <input
                                className="search"
                                type="search"
                                name="patientSearchParam"
                                value={ searchValue || '' }
                                onChange={ updateSearch }
                                placeholder="Name, Email, Tel"
                                aria-label="Search"
                                autoComplete='off'
                            />
                            <ReactSVG src={ search } alt="search" className="search-icon" />
                        </div>
                        <div className="p-2">
                            <DatePicker className="input-search date-picker" value={ filterDate ? moment(filterDate) : null } placeholder="Created On" onChange ={ handleDateSelect } />
                        </div>
                        <div className="d-flex align-items-center p-2">
                            <CheckBox id="live" handleActive = { handleFilter } disabled={ notLiveFilter }/>
                            <GoDotFill className="active-icon" />
                            <span className="label mx-1">Active</span>
                        </div>
                        <div className="d-flex align-items-center p-2">
                            <CheckBox id="not_live" handleActive = { handleFilter } disabled={ liveFilter }/>
                            <GoDotFill className="inactive-icon" />
                            <span className="label mx-1">Inactive</span>
                        </div>
                    </div>
                    {isLoading && <div className='mt-5'><Loader /></div> }
                    <div className="data-table">
                        {!isLoading && (
                            <DataTable
                                columns={ columns }
                                onChange={ handleSort }
                                eventList={ finalData }
                                pageChange={ pageChange }
                                current = { current }
                                totalPages = { totalPages }
                            />
                        )}
                    </div>
                </div>
            </div>
            {isViewMode && (
                <ViewProducerDetails
                    isModalVisible={ isViewMode }
                    handleClose={ openViewModeFunc }
                    producerProfileDetails={ producerProfileDetails }
                />
            )}
            {isNewProducer && (
                <AddNewProducer
                    isModalVisible={ isNewProducer }
                    input={ input }
                    handleClose={ createProducer }
                    handleSubmit={ handleSubmit }
                    handleChange={ handleChange }
                    inputError ={ inputError }
                />
            )}
            {isEditProducer && (
                <EditNewProducer
                    isModalVisible={ isEditProducer }
                    handleClose={ handleCloseEditModal }
                    handleSubmit={ handleUpdateProducer }
                    editProducerInput = { editProducerInput }
                    handleChange = { handleProducerChange }
                    inputError ={ editProducerInputError }
                />
            )}
            {isConfirmDelete && (
                <DeleteEventModal
                    isModalVisible={ isConfirmDelete }
                    handleClose={ confirmDeleteFunc }
                    handleSubmit={ deleteEventFunc }
                />
            )}
        </>
    );
}

ProducerListing.propTypes = {
    history: PropTypes.object,
};

export default ProducerListing;