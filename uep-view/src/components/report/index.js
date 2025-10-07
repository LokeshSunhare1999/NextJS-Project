/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable quotes */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AuthLayoutContainer from 'shared/AuthLayoutContainer'
import { ReactSVG } from 'react-svg';
import search from 'static/images/svg/search.svg';
import DataTable from 'shared/DataTable';
import { generateRepoertAction, getSalesReport } from 'actions/reportActions';
import { dateMonthYearFormat, dateMonthYearFormatEnd, getUniqueArray, SearchTableData } from 'utils/Helper';
import Loader from 'shared/Loader';
import { saveAs } from 'file-saver'
import { triggerNotifier } from 'shared/notifier';

function Report(props) {
    const dispatch = useDispatch()
    const { history } = props;
    const [ sortType, setSortType ] = useState('date');
    const [ sortBy, setSortBy ] = useState('desc');
    const [ selectedProducer, setSelectedProducer ] = useState('');
    const [ current, setCurrent ] = useState(1);
    const [ selectedData, setSelectedData ] = useState(true);
    const [ producerSelectedData, setProducerSelectedData ] = useState(true);
    const [ searchValue, setSearchValue ] = useState('');
    const [ isFilter, setIsFilter ] = useState(false);
    const [ filterData, setFilterData ] = useState([]);
    const [ isCall, setIsCall ] = useState(false)
    const [ isDropdownFilter, setIsDropdownFilter ] = useState('')
    const [ isDropdownFilter2, setIsDropdownFilter2 ] = useState('')
    const [ isProducerSelected, setIsProducerSelected ] = useState(true)
    const [ producerId, setProducerId ] = useState()
    const [ isClearEnable, setIsClearEnable ] = useState(true)
    const [ isEventCodeActive, setIsEventCodeActive ] = useState({})
    const [ isEventProducerActive, setIsEventProducerActive ] = useState({})
    const [ isReportBlank, setIsReportBlank ] = useState(false)

    const userRole = useSelector((state) => {
        return  state.profileDetails.user_role;
    });

    useEffect(() => {
        if(userRole === 0){
            dispatch(getSalesReport()).then((res) => {
                setIsCall(!isCall)
            });
        }
    }, [ dispatch, userRole ]);
    const totalPages = useSelector((state) => state?.SalesReport?.sales_report_count);
    const SalesReport = useSelector((state) => state?.SalesReport?.sales_report);
    const eventCodeList = useSelector((state) => state?.SalesReport?.event_codes);
    const producerList = useSelector((state) => state?.SalesReport?.producer_names);
    const isLoading = useSelector((state) => state?.applicationIsLoading);
    const tableData = SearchTableData(SalesReport);
    const uniqueEventList = getUniqueArray(eventCodeList).map((event, idx) => {
        return <option key={ idx } value={ event } name={ event }>{event}</option>
    })

    const producerNameList = getUniqueArray(producerList).map((producer, idx1) => {
        return <option key={ idx1 } value={ producer.id } name={ producer.id }>{producer.event_producer}</option>
    })

    // const handleTableManipulation = (pagination, filters, sorter, extra) => {
    //     console.log('params', pagination, filters, sorter, extra);
    // };

    // const updateSearch = (event) => {
    //     setSearchValue(event.target.value.substr(0, 100));
    // };

    // useEffect(() => {
    //     if(isCall){
    //         if(searchValue !== ''){
    //             const getData = setTimeout(() => {
    //                 dispatch(getSalesReport(current, 'search', searchValue))
    //             }, 1500)
    //             return () => clearTimeout(getData)
    //         } else {
    //             dispatch(getSalesReport())
    //             setIsFilter(false)
    //             setCurrent(1)
    //             setFilterData([])
    //         }
    //     }
    // }, [ searchValue ])

    const handleDropDown = (event) => {
        const mode = event.target.value
        setIsEventCodeActive({
            label: 'event-code',
            value: event.target.value
        })
        setIsDropdownFilter(mode)
        // dispatch(getSalesReport(1, 'event', mode)).then((res) => {
        //     const temp =  res.sales_report.filter((data) => {
        //         return data.event_code === event.target.value
        //     })
        //     setFilterData(temp)
        //     setSelectedData(false)
        //     setIsFilter(true)
        //     setCurrent(1);
        //     setIsClearEnable(false)
        // });
        if(Object.keys(isEventProducerActive).length !== 0){
            dispatch(getSalesReport(1, 'event', mode, isEventProducerActive, undefined , sortBy, sortType)).then((res) => {
                // const temp =  res.sales_report.filter((data) => {
                //     return data.event_code === event.target.value
                // })
                setFilterData(res.sales_report)
                setSelectedData(false)
                setIsFilter(true)
                setCurrent(1);
                setIsClearEnable(false)
            })
        } else {
            dispatch(getSalesReport(1, 'event', mode, undefined , sortBy , sortType)).then((res) => {
                // const temp =  res.sales_report.filter((data) => {
                //     return data.event_code === event.target.value
                // })
                setFilterData(res.sales_report)
                setSelectedData(false)
                setIsFilter(true)
                setCurrent(1);
                setIsClearEnable(false)
            })
        }
    }

    const handleProducerDropDown = (event1) => {
        const producer = event1.target.value;
        setIsEventProducerActive({
            label: 'producer-id',
            value: event1.target.value
        })
        setProducerId(producer)
        setIsProducerSelected(false)
        setIsDropdownFilter2(producer)
        if(Object.keys(isEventCodeActive).length !== 0){
            dispatch(getSalesReport(1, 'producer', producer, isEventCodeActive, sortBy , sortType)).then((res) => {
                setFilterData(res.sales_report)
                setProducerSelectedData(false)
                setIsFilter(true)
                setCurrent(1);
                setIsClearEnable(false)
                if(res.sales_report.length > 0){
                    setIsReportBlank(false)
                } else {
                    setIsReportBlank(true)
                }
            })
        } else {
            dispatch(getSalesReport(1, 'producer', producer, undefined , sortBy , sortType)).then((res) => {
                setFilterData(res.sales_report)
                setProducerSelectedData(false)
                setIsFilter(true)
                setCurrent(1);
                setIsClearEnable(false)
                if(res.sales_report.length > 0){
                    setIsReportBlank(false)
                } else {
                    setIsReportBlank(true)
                }
            })
        }
    }

    const clearFilterFunc = () => {
        dispatch(getSalesReport(undefined , undefined , undefined, undefined , sortBy , sortType))
        setFilterData([])
        setSelectedData(true)
        setProducerSelectedData(true)
        setIsFilter(false)
        setCurrent(1)
        setIsDropdownFilter('')
        setIsDropdownFilter2('')
        setIsProducerSelected(true)
        setIsClearEnable(true)
        setIsEventProducerActive({})
        setIsEventCodeActive({})
    }

    const pageChange = (page) => {
        setCurrent(page);
        if(Object.keys(isEventProducerActive)?.length !== 0 && Object.keys(isEventCodeActive)?.length !== 0){
            dispatch(getSalesReport(page, 'event', isDropdownFilter, isEventProducerActive, sortBy, sortType)).then((res) => {
                setFilterData(res.sales_report)
                setSelectedData(false)
                setIsFilter(true)
                if(res.sales_report?.length > 0){
                    setIsReportBlank(false)
                } else {
                    setIsReportBlank(true)
                }
            })
        }
        // else if(Object.keys(isEventCodeActive)?.length !== 0){
        //     dispatch(getSalesReport(1, 'producer', isDropdownFilter2, isEventCodeActive)).then((res) => {
        //         setFilterData(res.sales_report)
        //         setSelectedData(false)
        //         setIsFilter(true)
        //         if(res.sales_report?.length > 0){
        //             setIsReportBlank(false)
        //         } else {
        //             setIsReportBlank(true)
        //         }
        //     })
        // }
        else if (isDropdownFilter !== '') {
            dispatch(getSalesReport(page, 'event', isDropdownFilter, undefined , sortBy, sortType)).then((res) => {
                // const temp = res?.data?.full_order_details?.filter((data) => {
                //     return data.event_producer === isDropdownFilter
                // })
                setFilterData(res.sales_report)
                setSelectedData(false)
                setIsFilter(true)
            });
        } else if (isDropdownFilter2 !== '') {
            dispatch(getSalesReport(page, 'producer', isDropdownFilter2, undefined, sortBy , sortType)).then((res) => {
                // const temp = res?.data?.full_order_details?.filter((data) => {
                //     return data.event_producer === isDropdownFilter2
                // })
                setFilterData(res.sales_report)
                setProducerSelectedData(false)
                setIsFilter(true)
            });
        } else {
            dispatch(getSalesReport(page, undefined , undefined, undefined , sortBy, sortType));
        }
    }

    const generateReportFunc = () => {
        dispatch(generateRepoertAction(producerId))
    }

    // Handle all filter for sorting feature
    // --------------------------------------------
    const handleSortFilter = () => {
        let page = undefined;
        let filter_text = undefined;
        let isActive = undefined;
        let value = undefined;
        // if(Object.keys(isEventCodeActive).length !== 0){
        //     page = 1;
        //     filter_text = 'producer';
        //     value = isDropdownFilter2;
        //     isActive= isEventCodeActive;
        // } else if(Object.keys(isEventCodeActive).length === 0){
        //     page = 1;
        //     filter_text = 'producer';
        //     value = isDropdownFilter2;
        // } else if(Object.keys(isEventProducerActive).length !== 0) {
        //     page = 1;
        //     filter_text = 'event';
        //     value = isDropdownFilter;
        //     isActive= isEventProducerActive;
        // } else if(Object.keys(isEventProducerActive).length === 0) {
        //     page = 1;
        //     filter_text = 'event';
        //     value = isDropdownFilter;
        if(Object.keys(isEventProducerActive)?.length !== 0 && Object.keys(isEventCodeActive)?.length !== 0) {
            page = 1;
            filter_text = 'event';
            value = isDropdownFilter;
            isActive= isEventProducerActive;
        } else if (isDropdownFilter !== '') {
            page = 1;
            filter_text = 'event';
            value = isDropdownFilter;
        } else if (isDropdownFilter2 !== '') {
            page = 1;
            filter_text = 'producer';
            value = isDropdownFilter2;
        }
        return { page , filter_text, isActive, value }
    }
    // ==========================================================================

    // Handle sorting feature in this function
    // -------------------------------------------------
    const handleSort = (pagination, filters, sorter, extra) => {
        let page = undefined;
        let filter_text = undefined;
        let isActive = undefined;
        let value = undefined;
        if(isFilter){
            const res = handleSortFilter();
            page = res.page;
            filter_text = res.filter_text;
            isActive = res.isActive;
            value = res.value;
        }

        if (extra.action === 'sort' ) {
            console.log('params', pagination, filters, sorter, extra);
            setSortBy(sorter.order === 'ascend'?'desc':'asc');
            console.log(sortBy)
            setSortType(sorter.columnKey);
            setCurrent(1);
            dispatch(getSalesReport(page ,filter_text, value, isActive, sorter.order === 'ascend'?'desc':'asc' , sorter.columnKey)).then((response) => {
                console.log(response)
                if(isFilter){
                    console.log(response)
                    setFilterData(response.sales_report);
                }
            });
        }
    }
    // ========================================================================================

    // const columns = [
    //     {
    //         title: 'Event Code',
    //         dataIndex: '',
    //         key: 'event_code',
    //         sorter: true,
    //         sortDirections: [ 'ascend', 'descend', 'ascend' ],
    //         // defaultSortOrder: 'descend',
    //         showSorterTooltip: false,
    //         sortOrder: sortType === 'event_code' ? sortBy==='asc'?'descend':'ascend' : null,
    //         render: (key) => {
    //             return (
    //                 <>
    //                     <span> { key.event_code } </span>
    //                 </>
    //             );
    //         },
    //     },
    //     {
    //         title: 'Event Dates',
    //         dataIndex: '',
    //         render: (key) => <>{ key.start_date } - { key.end_date }</>,
    //         // render: (key) => <>{dateMonthYearFormat(key)} - {dateMonthYearFormatEnd(key)}</>,
    //         key: 'date',
    //         sorter: true,
    //         sortDirections: [ 'ascend', 'descend', 'ascend' ],
    //         // defaultSortOrder: 'descend',
    //         showSorterTooltip: false,
    //         sortOrder: sortType === 'date' ? sortBy==='asc'?'descend':'ascend' : null,
    //         width: '5%',
    //     },
    //     {
    //         title: 'Producer Name',
    //         dataIndex: '',
    //         key: 'event_producer',
    //         sorter: true,
    //         sortDirections: [ 'ascend', 'descend', 'ascend' ],
    //         // defaultSortOrder: 'descend',
    //         showSorterTooltip: false,
    //         sortOrder: sortType === 'event_producer' ? sortBy==='asc'?'descend':'ascend' : null,
    //         render: (key) => {
    //             return (
    //                 <span>{key.event_producer}</span>
    //             );
    //         },
    //     },
    //     {
    //         title: 'Total Sales',
    //         dataIndex: '',
    //         // sorter: (a, b) => a && a.total_sales && a.total_sales.localeCompare(b && b.total_sales),
    //         render: (key) => {
    //             return (
    //                 <span>${key.total_sales}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "1 8x10",
    //         title: 'Pkg 1',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 1 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: '1 5x7 / (4) Wallets',
    //         title: 'Pkg 2',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 0 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "1 8x10 / (1) 5x7 (4) Wallets & Keychain",
    //         title: 'Pkg 19',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 2 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "1 Digital File",
    //         title: 'Pkg 8',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 3 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "1 Double Sided Plexiglass Keychain",
    //         title: 'Pkg 5',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 4 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "1 Personalized Magazine Cover",
    //         title: 'Pkg 20',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 5 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "1 Personalized Photo Blanket",
    //         title: 'Pkg 6',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 6 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "1 Photo Digital File",
    //         title: 'Pkg 7',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 7 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "1 Video Digital File Free",
    //         title: 'Pkg 12',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 8 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "1-9 Routines",
    //         title: 'Pkg 14',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 9 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "10-25 Routines",
    //         title: 'Pkg 15',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 10 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "2 5x7",
    //         title: 'Pkg 3',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 11 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "26-50 Routines",
    //         title: 'Pkg 16',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 12 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "3 Different 4x6s From Same Routine",
    //         title: 'Pkg 4',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 13 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "51-75 Routines",
    //         title: 'Pkg 17',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 14 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "76 Routines Or More",
    //         title: 'Pkg 18',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 15 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "All Action Photos Of This Routine",
    //         title: 'Pkg 9',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 16 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "All Of The Action Photos",
    //         title: 'Pkg 13',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 17 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "All Of The Action Photos & Video",
    //         title: 'Pkg 11',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 18 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "HD Video",
    //         title: 'Pkg 10',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 19 ].package_purchase_count}</span>
    //             );
    //         },
    //     },
    //     {
    //         // title: "Video Only",
    //         title: 'Pkg 21',
    //         render: (key) => {
    //             return (
    //                 <span>{key.packages[ 20 ].package_purchase_count}</span>
    //             );
    //         },
    //     }
    // ];

    const uniquePackageLabels = Array.from(
        new Set(
            SalesReport?.map(report => report.packages).flat().map(pkg => pkg.package_label)
        )
    );
    const sortedPackageLabel = (a, b) => {
        const packageA = parseInt(a.match(/\d+/)[ 0 ]);
        const packageB = parseInt(b.match(/\d+/)[ 0 ]);
        return packageA - packageB;
    };
    uniquePackageLabels.sort(sortedPackageLabel);
    const packageLabelColumns = uniquePackageLabels.map(packageLabel => {
        return {
            title: packageLabel,
            dataIndex: packageLabel,
            key: packageLabel,
            render: (text, record) => {
                const packageData = record.packages.find(pkg => pkg.package_label === packageLabel);
                return <span>{packageData ? packageData.package_purchase_count : 0}</span>;
            },
        };
    });

    const staticColumns = [
        {
            title: 'Event Code',
            dataIndex: '',
            key: 'event_code',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'descend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_code' ? sortBy==='asc'?'descend':'ascend' : null,
            render: (key) => {
                return (
                    <>
                        <span> { key.event_code } </span>
                    </>
                );
            },
        },
        {
            title: 'Event Dates',
            dataIndex: '',
            render: (key) => <>{ key.start_date } - { key.end_date }</>,
            // render: (key) => <>{dateMonthYearFormat(key)} - {dateMonthYearFormatEnd(key)}</>,
            key: 'date',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'descend',
            showSorterTooltip: false,
            sortOrder: sortType === 'date' ? sortBy==='asc'?'descend':'ascend' : null,
            width: '5%',
        },
        {
            title: 'Producer Name',
            dataIndex: '',
            key: 'event_producer',
            sorter: true,
            sortDirections: [ 'ascend', 'descend', 'ascend' ],
            // defaultSortOrder: 'descend',
            showSorterTooltip: false,
            sortOrder: sortType === 'event_producer' ? sortBy==='asc'?'descend':'ascend' : null,
            render: (key) => {
                return (
                    <span>{key.event_producer}</span>
                );
            },
        },
        {
            title: 'Total Sales',
            dataIndex: '',
            // sorter: (a, b) => a && a.total_sales && a.total_sales.localeCompare(b && b.total_sales),
            render: (key) => {
                return (
                    <span>${key.total_sales}</span>
                );
            },
        },
    ];

    const columns = [ ...staticColumns, ...packageLabelColumns ];
    const finalData = !isFilter ? tableData : filterData
    return (
        <>
            <AuthLayoutContainer history={ history }>
                <div className="dashboard-wrapper event-main sales-report-page">
                    <div className=" dashboard-content">
                        <div className="event-header d-flex flex-column justify-content-start  ">
                            <div className="heading">Sales Reports</div>
                            {(userRole === 0) && <p className='text-start mb-0' style={ { color: '#7d86a9' } }>To generate sales report, please select producer name from drop-down and click on generate button.</p> }
                        </div>
                        {(userRole === 0) ?
                            <>
                                <div className="input-wrap d-flex flex-wrap py-3">
                                    {/* <div className="p-2 ps-0 position-relative">
                                <input
                                    className="search"
                                    type="search"
                                    name="patientSearchParam"
                                    value={ searchValue || '' }
                                    onChange={ updateSearch }
                                    placeholder="Producer Name"
                                    aria-label="Search"
                                    autoComplete='off'
                                />
                                <ReactSVG src={ search } alt="search" className="search-icon" />
                            </div> */}
                                    <div className="p-2 position-relative t1">
                                        <select
                                            className="search pr-select-arrow pointer"
                                            name="ProducerList"
                                            onChange={ handleProducerDropDown }
                                        >
                                            {
                                                producerSelectedData ?
                                                    <option value="" disabled selected>
                                                        Producer Name
                                                    </option> : ''
                                            }
                                            {producerNameList}
                                        </select>
                                    </div>
                                    <div className="p-2 position-relative t1">
                                        <select
                                            className="search pr-select-arrow pointer"
                                            name="EventCode"
                                            onChange={ handleDropDown }
                                        >
                                            {
                                                selectedData ?
                                                    <option value="" disabled selected>
                                                        Event Code
                                                    </option> : ''
                                            }
                                            {uniqueEventList}
                                        </select>
                                    </div>
                                    <button
                                        type="button"
                                        className="modal-add clear-filter-btn"
                                        onClick={ () => clearFilterFunc() }
                                        disabled={ isClearEnable }
                                    >
                                        Clear Filter
                                    </button>
                                    <button
                                        type="button"
                                        className="modal-add clear-filter-btn"
                                        onClick={ () => generateReportFunc() }
                                        disabled={ isProducerSelected || isReportBlank }
                                    >
                                        Generate
                                    </button>
                                </div>
                                <div className="data-table">
                                    {isLoading && <div className='mt-5'><Loader /></div> }
                                    {!isLoading && (
                                        <DataTable
                                            columns={ columns }
                                            onChange={ handleSort }
                                            eventList={ finalData }
                                            pageChange={ pageChange }
                                            current = { current }
                                            totalPages = { totalPages }
                                            scrollX = { true }
                                        />
                                    )}
                                </div>
                            </>
                            :
                            <div className='align-items-center d-flex justify-content-center' style={ { height: '70vh' } }>
                                {([ 1,2,3 ].includes(userRole)) && <h4>{'You do not have the required permission.'} </h4> }
                            </div>}
                    </div>
                </div>
            </AuthLayoutContainer>
        </>
    )
}

Report.propTypes = {
    history: PropTypes.object,
};

export default Report