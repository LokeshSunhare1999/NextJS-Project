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
import Button from 'shared/Button';
import CheckBox from 'shared/CustomCheck';
import {
    addStaffAction,
    getStaffListing,
    removeStaffAction,
    updateStaffAction,
    viewStaffDetailsAction,
} from 'actions/staffActions';
import { dateMonthYearFormat, SearchTableData } from 'utils/Helper';
import AddNewStaff from './AddNewStaff';
import EditStaff from './EditStaff';
import search from 'static/images/svg/search.svg';
import { ReactSVG } from 'react-svg';
import DeleteEventModal from 'shared/DeleteEventModal';
import { GoDotFill } from 'react-icons/go';
import moment from 'moment';
import { updateStatusType } from 'actions/commonActions';
import Loader from 'shared/Loader';
import { useCallback } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function StaffListing(props) {
    const { history } = props;
    const dispatch = useDispatch();
    const routeHistory = useHistory();
    const [ isCall, setIsCall ] = useState(false)
    useEffect(() => {
        dispatch(getStaffListing()).then((res) => {
            setIsCall(!isCall)
        });
    }, [ dispatch ]);
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const [ input, setInput ] = useState({});
    const [ inputError, setInputError ] = useState({});
    const [ editStaffInput, setEditStaffInput ] = useState({});
    const [ editStaffInputError, setEditStaffInputError ] = useState({});
    const [ isNewStaff, setNewStaff ] = useState(false);
    const [ isEditStaff, setEditStaff ] = useState(false);
    const [ staffId, setSatffId ] = useState('');
    const staffList = useSelector((state) => state.staffList.staff_list);
    const [ searchValue, setSearchValue ] = useState('');
    const [ filterData, setFilterData ] = useState([]);
    const [ filterDate, setFilterDate ] = useState('');
    const tableData = SearchTableData(staffList);
    const [ isFilter, setIsFilter ] = useState(false)
    const [ liveFilter, setLiveFilter ] = useState(false);
    const [ notLiveFilter, setNotLiveFilter ] = useState(false);
    const [ current, setCurrent ] = useState(1);
    const [ sortType, setSortType ] = useState('date');
    const [ sortBy, setSortBy ] = useState('desc');
    const [ filterType, setFilterType ] = useState(undefined)
    const [ filterVal, setFilterVal ] = useState(null)
    const [ isChangePage, setIsChangePage ] = useState(true);
    const [ apiState, setAPIState ] = useState({ first_parameter: undefined , second_parameter: null , sortBy: 'desc' , sortType: 'date' })
    const totalPages = useSelector((state) => state?.staffList?.staff_counts);
    //Clearing data when switching to other routes
    useEffect(() => {
        // Listen for changes in the route
        const unListen = routeHistory.listen((location, action) => {
            if(location.pathname !== '/staff'){
                dispatch(getStaffListing(undefined, null, sortBy, sortType))
            }
        });
        return () => {
            unListen();
        };
    }, [ history ]);
    const onToggleChange = (checked, key, type) => {
        const data = {
            id: key.id,
            status: checked ? 1 : 0,
        };
        dispatch(updateStatusType(parseInt(type), data)).then(()=>{
            dispatch(getStaffListing(apiState.first_parameter, apiState.second_parameter, apiState.sortBy, apiState.sortType)).then((res)=>{
                setFilterData(res.data.staff_list)
            })
        });
        setCurrent(current);
    };
    const handleClose = () => {
        setNewStaff(false);
        setInputError({});
    };
    const createStaffFunc = () => {
        setNewStaff(!isNewStaff);
    };
    const updateStaffFunc = (key) => {
        setSatffId(key.id);
        dispatch(viewStaffDetailsAction(key.id)).then((res) => {
            if (res  && res.statusCode === 200) {
                setEditStaffInput(res.data.staff_profile);
            }
        });
        setEditStaff(!isEditStaff);
    };
    const handleCloseUpdateModal = () => {
        setEditStaff(!isEditStaff);
        setEditStaffInputError({});
        setEditStaffInput({})
    };
    const confirmDeleteFunc = (key) => {
        setSatffId(key.id);
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
        dispatch(removeStaffAction(staffId)).then(() => {
            const filterDataIndex = filterData.findIndex((res) => res.id === staffId);
            const fullOrderTableDataIndex = tableData.findIndex((res) => res.id === staffId);
            if(filterDataIndex !== -1){
                // filterData.splice(filterDataIndex, 1);
                dispatch(getStaffListing(filterType, filterVal, sortBy, sortType)).then((res) => {
                    setFilterData(res.data.staff_list);
                    setIsFilter(true)
                    setIsChangePage(true);
                })
            }
            if(fullOrderTableDataIndex !== -1){
                tableData.splice(fullOrderTableDataIndex, 1);
                if (!isFilter && searchValue === '') {
                    if(maxPage === 1 && tableData.length === 0 ){
                        dispatch(getStaffListing(current-1, null, sortBy, sortType)).then((res) => {
                            setIsFilter(false)
                            setIsChangePage(true);
                        })
                    }else{
                        dispatch(getStaffListing(current, null, sortBy, sortType)).then((res) => {
                            setIsFilter(false)
                            setIsChangePage(true);
                        })
                    }
                }
                if (searchValue !== '') {
                    dispatch(getStaffListing(filterType, filterVal, sortBy, sortType)).then((res) => {
                        setIsFilter(false)
                        setIsChangePage(true);
                    })
                }
            }
        });
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'phone_number') {
            let obj = value;
            var numbers = obj.replace(/\D/g, ''),
                char = { 0: '(', 3: ') ', 6: '-' };
            obj = '';
            for (var i = 0; i < numbers.length; i++) {
                obj += (char[ i ] || '') + numbers[ i ];
            }
            setInput((prevState) => ({ ...prevState, [ name ]: obj }));
        } else {
            setInput((prevState) => ({ ...prevState, [ name ]: value }));
        }
        setInputError({});
    };
    const handleStaffChange = (event) => {
        const { name, value } = event.target;
        if (name === 'phone_number') {
            let obj = value;
            var numbers = obj.replace(/\D/g, ''),
                char = { 0: '(', 3: ') ', 6: '-' };
            obj = '';
            for (var i = 0; i < numbers.length; i++) {
                obj += (char[ i ] || '') + numbers[ i ];
            }
            setEditStaffInput((prevState) => ({ ...prevState, [ name ]: obj }));
        } else {
            setEditStaffInput((prevState) => ({ ...prevState, [ name ]: value }));
        }
        setEditStaffInputError({});
    };
    const validate = () => {
        const errors = {};
        let isValid = true;
        if (!input.full_name) {
            isValid = false;
            errors.full_name = 'Please enter name';
        }
        if (!input.email_id) {
            isValid = false;
            errors.email_id = 'Please enter email';
        }
        if (!input.phone_number) {
            isValid = false;
            errors.phone_number = 'Please enter phone number';
        }
        if (!input.user_role) {
            isValid = false;
            errors.user_role = 'Please select user role';
        }
        setInputError(errors);

        return isValid;
    };
    const validateEdit = () => {
        const errors = {};
        let isValid = true;
        if (!editStaffInput.full_name) {
            isValid = false;
            errors.full_name = 'Please enter name';
        }
        if (!editStaffInput.email_id) {
            isValid = false;
            errors.email_id = 'Please enter email';
        }
        if (!editStaffInput.phone_number) {
            isValid = false;
            errors.phone_number = 'Please enter phone number';
        }
        if (!editStaffInput.user_role) {
            isValid = false;
            errors.user_role = 'Please select user role';
        }
        setEditStaffInputError(errors);

        return isValid;
    };
    const handleUpdateStaff = () => {
        // const node = document.getElementById('live');
        // const notLiveNode = document.getElementById('not_live');
        // if (node.checked || notLiveNode.checked) {
        //     node.checked = false;
        //     notLiveNode.checked = false;
        // }
        const id = staffId;
        const data = {
            full_name: editStaffInput.full_name,
            email_id: editStaffInput.email_id,
            phone_number: editStaffInput.phone_number,
            user_role: editStaffInput.user_role,
        };
        if (validateEdit()) {
            dispatch(updateStaffAction(id, data));
            setInput({});
            setEditStaff(false);
            setIsChangePage(false);
            setIsFilter(false)
            setTimeout(() => {
                dispatch(getStaffListing(apiState.first_parameter, apiState.second_parameter, apiState.sortBy, apiState.sortType))
                setCurrent(current)
            }, 400);
        }
    };
    const handleSubmit = () => {
        const data = input;
        if (validate()) {
            setInput({});
            dispatch(addStaffAction(data));
            handleClose();
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
    const showAccountType = (role) => {
        return role === 0 ? 'Admin' : role === 2 ? 'Manager' : 'Staff';
    };

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
            dispatch(getStaffListing(undefined, null , sortBy , sortType))
            setFilterType(undefined)
            setFilterVal(null)
            setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
        }
        // setCurrent(1);
    };
    useEffect(() => {
        if(isCall){
            clearOtherFilter('all');
            if(searchValue === undefined){
                dispatch(getStaffListing(undefined, null , sortBy , sortType))
                setIsFilter(false)
                setIsChangePage(true);
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                setCurrent(1);
            } else if(searchValue !== '') {
                const getData = setTimeout(() => {
                    setIsFilter(false)
                    setIsChangePage(true);
                    setFilterType('search')
                    setFilterVal(searchValue)
                    setAPIState({ first_parameter: 'search' , second_parameter: searchValue , sortBy: sortBy , sortType: sortType })
                    dispatch(getStaffListing('search', searchValue, sortBy , sortType)).then((response) => {
                        setFilterData(response.data.staff_list)
                        setCurrent(1);
                    })
                }, 1500)
                return () => clearTimeout(getData)
            } else {
                dispatch(getStaffListing(undefined, null , sortBy , sortType))
                setIsFilter(false)
                setIsChangePage(true);
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                setCurrent(1);
            }
            // if(searchValue !== ''){
            //     const getData = setTimeout(() => {
            //         dispatch(getStaffListing('search', searchValue))
            //     }, 1500)
            //     return () => clearTimeout(getData)
            // } else {
            //     dispatch(getStaffListing())
            //     setIsFilter(false)
            // }
        }
    }, [ searchValue ])
    const handleDateSelect = (event, date) => {
        resetSearch();
        clearOtherFilter('date');
        if(date === ''){
            setFilterDate('')
            dispatch(getStaffListing(undefined , null , sortBy , sortType))
            setIsFilter(false)
            setIsChangePage(true);
            setFilterType(undefined)
            setFilterVal(null)
            setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
        } else {
            setFilterDate(date)
            dispatch(getStaffListing('filter', date, sortBy , sortType)).then((res) => {
                // const temp = res.data.staff_list.filter((data) => {
                //     return (
                //         moment(data.registration_datetime).format('MM/DD/YYYY') ===
                //     moment(date).format('MM/DD/YYYY')
                //     );
                // });
                setFilterData(res.data.staff_list);
                setIsFilter(true)
                setIsChangePage(true);
                setFilterType('filter')
                setFilterVal(date)
                setAPIState({ first_parameter: 'filter' , second_parameter: date , sortBy: sortBy , sortType: sortType })
            }) ;
        }
        setCurrent(1);
    };
    const pageChange = (page) => {
        setCurrent(page);
        if(searchValue === undefined){
            dispatch(getStaffListing(page, null , sortBy , sortType))
            setIsFilter(false)
            setIsChangePage(true);
            setAPIState({ first_parameter: page , second_parameter: null , sortBy: sortBy , sortType: sortType })
        } else if(!isFilter && searchValue?.length === 0 && isChangePage){
            dispatch(getStaffListing(page, null , sortBy , sortType));
            setAPIState({ first_parameter: page , second_parameter: null , sortBy: sortBy , sortType: sortType })
        }
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
                dispatch(getStaffListing(undefined , null , sortBy , sortType))
                // staffList && staffList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getStaffListing('filter', 1, sortBy , sortType)).then((res) => {
                    setFilterData(res.data.staff_list)
                    setIsFilter(true)
                    setIsChangePage(true);
                    setFilterType('filter')
                    setFilterVal(1)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 1 , sortBy: sortBy , sortType: sortType })
                });
                // staffList && staffList.map((data) => {
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
                dispatch(getStaffListing('filter', 0, sortBy , sortType)).then((res) => {
                    setFilterData(res.data.staff_list)
                    setIsFilter(true)
                    setIsChangePage(true);
                    setFilterType('filter')
                    setFilterVal(0)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 0 , sortBy: sortBy , sortType: sortType })
                });
                // staffList && staffList.map((data) => {
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
                dispatch(getStaffListing(undefined ,null , sortBy , sortType))
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                // staffList && staffList.map((data) => {
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
                dispatch(getStaffListing(undefined ,null , sortBy , sortType))
                // staffList && staffList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getStaffListing('filter', 0 , sortBy , sortType)).then((res) => {
                    setFilterData(res.data.staff_list)
                    setIsFilter(true)
                    setIsChangePage(true);
                    setFilterType('filter')
                    setFilterVal(0)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 0 , sortBy: sortBy , sortType: sortType })
                });
                // staffList && staffList.map((data) => {
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
                dispatch(getStaffListing('filter', 1 , sortBy , sortType)).then((res) => {
                    setFilterData(res.data.staff_list)
                    setIsFilter(true)
                    setIsChangePage(true);
                    setFilterType('filter')
                    setFilterVal(1)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 1 , sortBy: sortBy , sortType: sortType })
                });
                // staffList && staffList.map((data) => {
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
                dispatch(getStaffListing(undefined ,null , sortBy , sortType))
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                // staffList && staffList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(false)
            }
        }
        setCurrent(1);
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
            setFilterType('filter')
            setFilterVal(value)
            dispatch(getStaffListing(page , value , sorter.order === 'ascend'?'desc':'asc' , sorter.columnKey)).then((response) => {
                if(isFilter){
                    setFilterData(response.data.staff_list);
                }
            });
            setAPIState({ first_parameter: page , second_parameter: value , sortBy: sorter.order === 'ascend'?'desc':'asc' , sortType: sorter.columnKey })
        }
    }
    // ========================================================================================

    const finalData = !isFilter ? tableData : filterData
    const columns = [
        {
            title: 'Staff Name',
            dataIndex: 'full_name',
            width: '14%',
            sorter: true,
            key:'name',
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'name' ? sortBy==='asc'?'descend':'ascend' : null,
        },
        {
            title: 'Email Address',
            dataIndex: 'email_id',
            width: '18%',
            sorter: true,
            key:'email',
            showSorterTooltip: false,
            sortDirections: [ 'ascend', 'descend' , 'ascend' ],
            // defaultSortOrder: 'ascend',
            sortOrder: sortType === 'email' ? sortBy==='asc'?'descend':'ascend' : null,
        },
        {
            title: 'Telephone',
            dataIndex: 'phone_number',
            width: '14%',
            key:'phone',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'phone' ? sortBy==='asc'?'descend':'ascend' : null,
        },
        {
            title: 'Account Type',
            dataIndex: 'user_role',
            render: (key) => <>{showAccountType(key)}</>,
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            sortOrder: sortType === 'user_role' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '14%',
            showSorterTooltip: false,
            key:'user_role',
        },
        {
            title: 'Created On',
            dataIndex: 'registration_datetime',
            key:'date',
            // render: (key) => <>{moment(key).format('MM/DD/YYYY')}</>,
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            sortOrder: sortType === 'date' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '20%',
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
        },
        {
            title: 'Actions',
            dataIndex: '',
            width: '8%',
            render: (key) => {
                return (
                    <>
                        <img
                            src={ edit }
                            alt="edit"
                            onClick={ () => updateStaffFunc(key) }
                            width="20"
                            className="mx-2 pointer"
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
                        onChange={ (checked) => onToggleChange(checked, key, '6') }
                        checked={ key && key.is_active }
                        className={ key && key.is_active ? 'toggle-green' : 'toggle-red' }
                    />
                );
            },
        },
    ];
    return (
        <>
            <div className="event-main">
                <div className="page-wrapper staff-page">
                    <div className="event-header d-flex justify-content-between align-items-center">
                        <div className="heading">Staff</div>
                        <div>
                            <Button
                                className="create-btn"
                                handleSubmit={ () => createStaffFunc() }
                                buttonName="+ Add Staff"
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
                            <DatePicker
                                value={ filterDate ? moment(filterDate) : null }
                                className="input-search date-picker"
                                placeholder="Created On"
                                onChange={ handleDateSelect }
                            />
                        </div>
                        <div className="d-flex align-items-center p-2">
                            <CheckBox id="live" handleActive={ handleFilter } disabled={ notLiveFilter }/>
                            <GoDotFill className="active-icon" />
                            <span className="label mx-1">Active</span>
                        </div>
                        <div className="d-flex align-items-center p-2">
                            <CheckBox id="not_live" handleActive={ handleFilter } disabled={ liveFilter } />
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
            {isNewStaff && (
                <AddNewStaff
                    isModalVisible={ isNewStaff }
                    handleClose={ handleClose }
                    handleSubmit={ handleSubmit }
                    handleChange={ handleChange }
                    input={ input }
                    inputError={ inputError }
                />
            )}
            {isEditStaff && (
                <EditStaff
                    isModalVisible={ isEditStaff }
                    handleClose={ handleCloseUpdateModal }
                    handleSubmit={ handleUpdateStaff }
                    handleChange={ handleStaffChange }
                    editStaffInput={ editStaffInput }
                    inputError={ editStaffInputError }
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

StaffListing.propTypes = {
    history: PropTypes.object,
};

export default StaffListing;