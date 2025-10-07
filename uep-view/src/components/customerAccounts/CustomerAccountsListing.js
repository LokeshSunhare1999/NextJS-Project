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
import read from 'static/images/read-eye.png';
import deleteicon from 'static/images/delete.png';
import {
    addCustomerAccount,
    getCustomerAccountsActions,
    getCustomerProfileActions,
    removeCustomerAction,
    updateCustomerProfile,
} from 'actions/customerActions';
import Button from 'shared/Button';
import CheckBox from 'shared/CustomCheck';
import AddCustomer from './AddCustomer';
import { cityCountryFormatter, dateMonthYearFormat, SearchTableData } from 'utils/Helper';
import EditCustomer from './EditCustomer';
import ViewCustomer from './ViewCustomer';
import DeleteEventModal from 'shared/DeleteEventModal';
import { ReactSVG } from 'react-svg';
import search from 'static/images/svg/search.svg';
import { GoDotFill } from 'react-icons/go';
import moment from 'moment';
import { updateStatusType } from 'actions/commonActions';
import Loader from 'shared/Loader';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function CustomerAccountsListing(props) {
    const { history } = props;
    const dispatch = useDispatch();
    const routeHistory = useHistory();
    const [ isCall, setIsCall ] = useState(false)
    const [ sortType, setSortType ] = useState('date');
    const [ sortBy, setSortBy ] = useState('desc');
    const [ filterDate, setFilterDate ] = useState('');

    useEffect(() => {
        dispatch(getCustomerAccountsActions(undefined , null , sortBy , sortType)).then((res) => {
            setIsCall(!isCall)
        });
    }, [ dispatch ]);
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false);
    const [ isViewMode, setIsViewMode ] = useState(false);
    const [ isEdit, setIsEdit ] = useState(false);
    const [ isEditBtnToggle, setIsEditBtnToggle ] = useState(false);
    const [ input, setInput ] = useState({});
    const [ inputError, setInputError ] = useState({});
    const [ editCustomerInput, setEditCustomerInput ] = useState({});
    const [ editCustomerInputError, setEditCustomerInputError ] = useState({});
    const [ customerId, setCustomerId ] = useState('');
    const [ isAddCustomerModal, setIsAddCustomerModal ] = useState(false);
    const [ searchValue, setSearchValue ] = useState('');
    const accountList = useSelector((state) => {
        return state?.cusAccountList?.customer_list
        // state?.cusAccountList?.customer_list
    });
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const tableData = accountList;
    const [ filterData, setFilterData ] = useState([]);
    const [ isFilter, setIsFilter ] = useState(false)
    const [ liveFilter, setLiveFilter ] = useState(false);
    const [ notLiveFilter, setNotLiveFilter ] = useState(false);
    const [ current, setCurrent ] = useState(1);
    const [ filterType, setFilterType ] = useState(undefined)
    const [ filterVal, setFilterVal ] = useState(null)
    const [ isChangePage, setIsChangePage ] = useState(true);
    const [ apiState, setAPIState ] = useState({ first_parameter: undefined , second_parameter: null , sortBy: 'desc' , sortType: 'date' })
    const totalPages = useSelector((state) => state.cusAccountList.customer_counts)
    //Clearing data when switching to other routes
    useEffect(() => {
        // Listen for changes in the route
        const unListen = routeHistory.listen((location, action) => {
            if(location.pathname !== '/customer-accounts'){
                dispatch(getCustomerAccountsActions(undefined, null, sortBy, sortType))
            }
        });
        return () => {
            unListen();
        };
    }, [ history ]);
    const handleTableManipulation = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const onToggleChange = (checked, key, type) => {
        const data = {
            id: key.id,
            status: checked ? 1 : 0
        }
        dispatch(updateStatusType(parseInt(type), data)).then(()=>{
            dispatch(getCustomerAccountsActions(apiState.first_parameter, apiState.second_parameter, apiState.sortBy, apiState.sortType)).then((res)=>{
                setFilterData(res.data.customer_list)
            })
        });
        setCurrent(current);
    };
    const openViewMode = (key) => {
        setCustomerId(key.id)
        dispatch(getCustomerProfileActions(key.id)).then((res) => {
            if (res && res.statusCode === 200) {
                setEditCustomerInput(res.data);
            }
        });
        setIsViewMode(!isViewMode);
    };
    const handleClose = () => {
        setIsAddCustomerModal(!isAddCustomerModal);
        setInputError({})
    };
    const handleToggle = () => {
        setIsEditBtnToggle(!isEditBtnToggle)
    }
    const handleCustomerClose = () => {
        setIsViewMode(!isViewMode);
        setIsEditBtnToggle(false)
        setEditCustomerInput({})
        // setSearchValue('');
        dispatch(getCustomerAccountsActions(apiState.first_parameter, apiState.second_parameter, apiState.sortBy, apiState.sortType)).then(()=>{
            if (apiState.second_parameter == 1) {
                document.getElementById('live').checked = true
            }
            if(apiState.second_parameter == 0){
                document.getElementById('not_live').checked = true
            }
        });
        setCurrent(current)
    }
    const createCustomer = () => {
        setIsAddCustomerModal(!isAddCustomerModal);
    };
    const confirmDeleteFunc = (data) => {
        setCustomerId(data.id);
        setIsConfirmDelete(!isConfirmDelete);
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

    const deleteCustomerFunc = () => {
        const maxPage = totalPages % 10;
        const maxPage1 = filterData.length % 10;
        const isLastEvent =  maxPage1 === 1;
        if(isLastEvent){
            setCurrent(current-1)
        }
        setIsConfirmDelete(!isConfirmDelete);
        setIsViewMode(false);
        dispatch(removeCustomerAction(customerId)).then(() => {
            const filterDataIndex = filterData.findIndex((res) => res.id === customerId);
            const fullOrderTableDataIndex = tableData.findIndex((res) => res.id === customerId);
            if(filterDataIndex !== -1){
                dispatch(getCustomerAccountsActions(filterType, filterVal, sortBy, sortType)).then((res) => {
                    setFilterData(res.data.customer_list);
                    setIsFilter(true)
                    setIsChangePage(true)
                    if (apiState.second_parameter == 1) {
                        document.getElementById('live').checked = true
                    }
                    if(apiState.second_parameter == 0){
                        document.getElementById('not_live').checked = true
                    }
                })
                // }
            }
            if(fullOrderTableDataIndex !== -1){
                tableData.splice(fullOrderTableDataIndex, 1);
                if (!isFilter && searchValue === '') {
                    if(maxPage === 1 && tableData.length === 0 ){
                        dispatch(getCustomerAccountsActions(current-1, null, sortBy, sortType)).then((res) => {
                            setIsFilter(false)
                            setIsChangePage(true)
                            if (apiState.second_parameter == 1) {
                                document.getElementById('live').checked = true
                            }
                            if(apiState.second_parameter == 0){
                                document.getElementById('not_live').checked = true
                            }
                        })
                    }else{
                        dispatch(getCustomerAccountsActions(current, null, sortBy, sortType)).then((res) => {
                            setIsFilter(false)
                            setIsChangePage(true)
                            if (apiState.second_parameter == 1) {
                                document.getElementById('live').checked = true
                            }
                            if(apiState.second_parameter == 0){
                                document.getElementById('not_live').checked = true
                            }
                        })
                    }
                }
                if (searchValue !== '') {
                    dispatch(getCustomerAccountsActions(filterType, filterVal, sortBy, sortType)).then((res) => {
                        setIsFilter(false)
                        setIsChangePage(true)
                    })
                }
            }
        });
    };
    const editCustomerFunc = (key) => {
        setCustomerId(key.id)
        dispatch(getCustomerProfileActions(key.id)).then((res) => {
            if (res && res.statusCode === 200) {
                setEditCustomerInput(res.data.customer_info);
            }
        });
        setIsEdit(!isEdit);
    };
    const handleEditClose = () => {
        setIsEdit(false);
        setEditCustomerInputError({})
        setEditCustomerInput({})
    };
    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === 'phone_number'){
            let obj = value;
            var numbers = obj.replace(/\D/g, ''),
                char = { 0: '(', 3: ') ', 6: '-' };
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
    const handleEditCustomerChange = (event) => {
        const { name, value } = event.target;
        if (name === 'phone_number'){
            let obj = value;
            var numbers = obj.replace(/\D/g, ''),
                char ={ 0: '(', 3: ') ', 6: '-' };
            obj = '';
            for (var i = 0; i < numbers.length; i++) {
                obj += (char[ i ] || '') + numbers[ i ];
            }
            setEditCustomerInput((prevState) => ({ ...prevState, [ name ]: obj }));
        }
        else {
            setEditCustomerInput((prevState) => ({ ...prevState, [ name ]: value }));
        }
        setEditCustomerInputError({})
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
        setInputError(errors);

        return isValid;
    };
    const validateEdit = () => {
        const errors = {};
        let isValid = true;
        if (!editCustomerInput.full_name) {
            isValid = false;
            errors.full_name = 'Please enter name';
        }
        if (!editCustomerInput.phone_number) {
            isValid = false;
            errors.phone_number = 'Please enter phone number';
        }
        setEditCustomerInputError(errors);

        return isValid;
    };
    const addNewCustomerFunc = () => {
        const data = input;
        if (validate()) {
            dispatch(addCustomerAccount(data));
            setInput({})
            setIsAddCustomerModal(!isAddCustomerModal);
            setCurrent(1)
            setFilterDate('')
            setIsFilter(false)
            setIsChangePage(true)
            const node = document.getElementById('live');
            const notLiveNode = document.getElementById('not_live');
            if (node.checked || notLiveNode.checked) {
                node.checked = false;
                notLiveNode.checked = false;
            }
        }
    };
    const handleUpdateCustomer = () => {
        // const node = document.getElementById('live');
        // const notLiveNode = document.getElementById('not_live');
        // if (node.checked || notLiveNode.checked) {
        //     node.checked = false;
        //     notLiveNode.checked = false;
        // }
        const custId= customerId
        const data = {
            full_name: editCustomerInput.full_name,
            phone_number: editCustomerInput.phone_number,
            is_active: editCustomerInput.is_personalised === 'No' ? 0 : 1,
        }
        if (validateEdit()) {
            dispatch(updateCustomerProfile(custId, data));
            setIsFilter(false)
            setIsEdit(false)
            setIsChangePage(false)
            setTimeout(() => {
                setCurrent(current)
                dispatch(getCustomerAccountsActions(apiState.first_parameter, apiState.second_parameter, apiState.sortBy, apiState.sortType))
            }, 400);
        }
    };

    console.log("filterVal",filterVal);
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

    const updateSearch = (event) => {
        setIsCall(true)
        const { value } = event.target
        if(searchValue !== '' || searchValue !== undefined){
            const pattern = /^[+]*[(]{0,1}[0-9]{1,3}[)]{0,1}[-\s\./0-9]*$/g.test(value);
            if(pattern){
                setSearchValue(prevState=> ( normalizeInput(value, prevState) ))
            } else {
                setSearchValue(event.target.value.substr(0, 100))
            }
        } else {
            setFilterType(undefined)
            setFilterVal(null)
            dispatch(getCustomerAccountsActions(undefined , null , sortBy , sortType))
            setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
        }
        // setSearchValue(event.target.value.substr(0, 100));
        // setCurrent(1);
    };
    useEffect(() => {
        if(isCall){
            clearOtherFilter('all')
            if(searchValue === undefined){
                dispatch(getCustomerAccountsActions(undefined , null , sortBy , sortType))
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                setIsFilter(false)
                setIsChangePage(true)
                setFilterType(undefined)
                setFilterVal(null)
                setCurrent(1);
            } else if(searchValue !== '') {
                const getData = setTimeout(() => {
                    dispatch(getCustomerAccountsActions('search', searchValue,  sortBy , sortType))
                    setCurrent(1);
                    setIsFilter(false)
                }, 1500)
                setFilterType('search')
                setFilterVal(searchValue)
                setAPIState({ first_parameter: 'search' , second_parameter: searchValue , sortBy: sortBy , sortType: sortType })
                return () => clearTimeout(getData)
            } else {
                dispatch(getCustomerAccountsActions(undefined , null , sortBy , sortType))
                setIsFilter(false)
                setIsChangePage(true)
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                setCurrent(1);
            }
        }
    }, [ searchValue ])
    const handleDateSelect = (event, date) => {
        resetSearch();
        clearOtherFilter('date');
        // console.log(date, moment().format('HHMM-SS'))
        if(date === ''){
            setFilterDate('')
            dispatch(getCustomerAccountsActions(undefined , null , sortBy , sortType))
            setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
            setIsFilter(false)
            setIsChangePage(true)
            setFilterType(undefined)
            setFilterVal(null)
        } else {
            setFilterDate(date)
            dispatch(getCustomerAccountsActions('filter', date, sortBy , sortType)).then((res) => {
                // const temp =  res.data.customer_list.filter((data) => {
                //     return moment(data.registration_datetime).format('MM/DD/YYYY') === moment(date).format('MM/DD/YYYY')
                // })
                setFilterData(res.data.customer_list)
                setIsFilter(true)
                setIsChangePage(true)
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
                setIsChangePage(true)
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getCustomerAccountsActions(undefined , null , sortBy , sortType))
                // accountList && accountList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getCustomerAccountsActions('filter', 1, sortBy , sortType)).then((res) => {
                    setFilterData(res.data.customer_list)
                    setIsFilter(true)
                    setIsChangePage(true)
                    setFilterType('filter')
                    setFilterVal(1)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 1 , sortBy: sortBy , sortType: sortType })
                }) ;
                // accountList && accountList.map((data) => {
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
                dispatch(getCustomerAccountsActions('filter', 0,  sortBy , sortType)).then((res) => {
                    setFilterData(res.data.customer_list)
                    setIsFilter(true)
                    setIsChangePage(true)
                    setFilterType('filter')
                    setFilterVal(0)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 0 , sortBy: sortBy , sortType: sortType })
                }) ;
                // accountList && accountList.map((data) => {
                //     if (!data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                setIsFilter(false)
                setIsChangePage(true)
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getCustomerAccountsActions())
                // accountList && accountList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            }
        } else if (event.target.id === 'not_live' && event.target.checked === true) {
            setNotLiveFilter(true)
            if (liveFilter === true) {
                setIsFilter(false)
                setIsChangePage(true)
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getCustomerAccountsActions(undefined , null , sortBy , sortType))
                // accountList && accountList.map((data) => {
                //     tempArr.push(data)
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                dispatch(getCustomerAccountsActions('filter', 0, sortBy , sortType)).then((res) => {
                    setFilterData(res.data.customer_list)
                    setIsFilter(true)
                    setIsChangePage(true)
                    setFilterType('filter')
                    setFilterVal(0)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 0 , sortBy: sortBy , sortType: sortType })
                }) ;
                // accountList && accountList.map((data) => {
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
                dispatch(getCustomerAccountsActions('filter', 1, sortBy , sortType)).then((res) => {
                    setFilterData(res.data.customer_list)
                    setIsFilter(true)
                    setIsChangePage(true)
                    setFilterType('filter')
                    setFilterVal(1)
                    setAPIState({ first_parameter: 'filter' , second_parameter: 1 , sortBy: sortBy , sortType: sortType })
                }) ;
                // accountList && accountList.map((data) => {
                //     if (data.is_active){
                //         tempArr.push(data)
                //     }
                // })
                // setFilterData(tempArr)
                // setIsFilter(true)
            } else {
                setIsFilter(false)
                setIsChangePage(true)
                setFilterType(undefined)
                setFilterVal(null)
                setAPIState({ first_parameter: undefined , second_parameter: null , sortBy: sortBy , sortType: sortType })
                dispatch(getCustomerAccountsActions(undefined , null , sortBy , sortType))
                // accountList && accountList.map((data) => {
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
        if(searchValue === undefined){
            dispatch(getCustomerAccountsActions(page, null , sortBy , sortType))
            setIsFilter(false)
            setIsChangePage(true)
            setAPIState({ first_parameter: page , second_parameter: null , sortBy: sortBy , sortType: sortType })
        } else if(!isFilter && searchValue?.length === 0 && isChangePage){
            dispatch(getCustomerAccountsActions(page, null , sortBy , sortType));
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
            setFilterType('filter')
            setFilterVal(value)
            dispatch(getCustomerAccountsActions(page , value , sorter.order === 'ascend'?'desc':'asc' , sorter.columnKey)).then((response) => {
                if(isFilter){
                    setFilterData(response.data.customer_list);
                }
            });
            setAPIState({ first_parameter: page , second_parameter: value , sortBy: sorter.order === 'ascend'?'desc':'asc' , sortType: sorter.columnKey })
        }
    }
    // ========================================================================================

    const finalData = !isFilter ? tableData : filterData
    const columns = [
        {
            title: 'Customer Name',
            dataIndex: '',
            key: 'name',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'name' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '14%',
            render: (key) => {
                return (
                    <>
                        <a href onClick = { () => openViewMode(key) }> { key.full_name } </a>
                    </>
                );
            },
        },
        {
            title: 'Email Address',
            dataIndex: 'email_id',
            key: 'email',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'email' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '18%',
        },
        {
            title: 'Telephone',
            dataIndex: 'phone_number',
            key: 'phone',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'phone' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '11%',
        },
        {
            title: 'Location',
            dataIndex: 'state',
            key: 'location',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'location' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '8%',
        },
        {
            title: 'Shipping Address',
            dataIndex: '',
            render: (key) => <>{key.shipping_address}</>,
            sorter: true,
            key:'shipping_address',
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'shipping_address' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '16%',
        },
        {
            title: 'Created On',
            dataIndex: 'registration_datetime',
            key: 'date',
            // render: (key) => <> { moment(key).format('MM/DD/YYYY') }</>,
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'ascend',
            showSorterTooltip: false,
            sortOrder: sortType === 'date' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '10%',
        },
        {
            title: 'Actions',
            dataIndex: '',
            width: '11%',
            render: (key) => {
                return (
                    <>
                        <img
                            src={ read }
                            alt="read"
                            onClick={ () => openViewMode(key) }
                            width="22"
                            className="mx-2 pointer"
                        />
                        <img
                            src={ edit }
                            alt="edit"
                            onClick={ () => editCustomerFunc(key) }
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
                        onChange={ (checked) => onToggleChange(checked, key , '5') }
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
            {!isViewMode && (
                <div className="event-main">
                    <div className="page-wrapper customerList-page">
                        <div className="event-header d-flex justify-content-between align-items-center">
                            <div className="heading">Customers</div>
                            <div>
                                <Button
                                    className="create-btn"
                                    handleSubmit={ () => createCustomer() }
                                    buttonName="+ Add Customer"
                                />
                            </div>
                        </div>
                        <div className="d-flex input-wrap flex-wrap py-3">
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
                                <DatePicker className="input-search date-picker" value={ filterDate ? moment(filterDate) : null } placeholder="Created On" onChange ={ handleDateSelect }/>
                            </div>
                            <div className="d-flex align-items-center p-2">
                                <CheckBox id="live" handleActive = { handleFilter } disabled={ notLiveFilter } />
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
            )}
            {isAddCustomerModal && (
                <div className="event-detail-modal">
                    <AddCustomer
                        isModalVisible={ isAddCustomerModal }
                        handleClose={ handleClose }
                        handleChange={ handleChange }
                        handleSubmit={ addNewCustomerFunc }
                        input={ input }
                        inputError={ inputError }
                    />
                </div>
            )}
            {isEdit && (
                <div className="event-detail-modal">
                    <EditCustomer
                        isModalVisible={ isEdit }
                        handleClose={ handleEditClose }
                        editCustomerInput={ editCustomerInput }
                        handleEditCustomerChange={ handleEditCustomerChange }
                        handleSubmit={ handleUpdateCustomer }
                        editCustomerInputError={ editCustomerInputError }
                    />
                </div>
            )}
            {isViewMode && (
                <ViewCustomer
                    accountList={ accountList }
                    handleTableManipulation={ handleTableManipulation }
                    editCustomerInput={ editCustomerInput }
                    handleEditCustomerChange={ handleEditCustomerChange }
                    columns={ columns }
                    handleToggle = { handleToggle }
                    isEditBtnToggle = { isEditBtnToggle }
                    handleUpdateCustomer={ handleUpdateCustomer }
                    handleClose={ handleCustomerClose }
                    confirmDeleteCall={ confirmDeleteFunc }
                    customerId={ customerId }
                />
            )}
            {isConfirmDelete && (
                <DeleteEventModal
                    isModalVisible={ isConfirmDelete }
                    handleClose={ confirmDeleteFunc }
                    handleSubmit={ deleteCustomerFunc }
                />
            )}
        </>
    );
}

CustomerAccountsListing.propTypes = {
    history: PropTypes.object,
};

export default CustomerAccountsListing;