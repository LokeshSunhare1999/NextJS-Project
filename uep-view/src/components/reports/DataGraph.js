/* eslint-disable react/prop-types */
/* eslint-disable no-shadow */
/* eslint-disable quotes */
import React from 'react';
import { useState } from "react";
import PropTypes from 'prop-types';
import 'static/style/dashboard.scss';
import EventPieChart from './EventPieChart';
import EventDownloadsLineGraph from './EventDownloadsLineGraph';
import dots from 'static/images/svg/three-dots.svg'

function DataGraph(props) {
    const { graphCounts, visualCounts, handleFilter, handlePieFilter, handleOpenDropDown } = props
    const monthlyOrdersRevenue = graphCounts &&  graphCounts[ 0 ] && graphCounts[ 0 ].monthlyOrdersRevenue
    const monthlyOrdersPlaced = graphCounts &&  graphCounts[ 0 ] && graphCounts[ 0 ].monthlyOrdersPlaced
    const eventDownloadDetails = graphCounts &&  graphCounts[ 0 ] && graphCounts[ 0 ].events
    const totalSalesReportCount = graphCounts && graphCounts[ 0 ] && graphCounts[ 0 ].totalSalesReportCount
    const totalOrdersRevenue =  graphCounts && graphCounts[ 0 ] && graphCounts[ 0 ].totalOrdersRevenue
    const events_created = graphCounts && graphCounts[ 0 ] && graphCounts[ 0 ].events_created
    const [ ordersFilter, setOrdersFilter ] = useState('Monthly');
    const [ revenueFilter, setRevenueFilterFilter ] = useState('Monthly');
    const [ eventFilter, setEventFilter ] = useState('Monthly');
    const [ quarter, setQuarter ] = useState(2);
    const [ year, setYear ] = useState(2022);

    const handleQuarterChange = (quarter) => {
        setQuarter(quarter)
        handlePieFilter(quarter ,year);
    }
    const handleYearChange = (year) => {
        setYear(year)
        handlePieFilter(quarter ,year);
    }
    return (
        <>
            <h3 className="heading_visual_report">Visual Reports</h3>
            <div className="row g-0">
                <div className="col-xl-5 col-lg-5 col-md-12 col-sm-12 col-12 ">
                    <div className='pirChart-wrapper'>
                        <div className='d-flex align-items-center justify-content-between mb-2'>
                            <div className='heading_quarterly_report'>Quarterly Revenue Report</div>
                            <div style={ { width: 100, display: 'flex', justifyContent: 'space-between',marginTop:15, margin:15 } }>
                                <div className="dropdown notification-wrapper">
                                    <img src={ dots } alt="three-dots" className='dots' id="dropdownMenuButton1" data-bs-toggle="dropdown"/>
                                    <ul className="dropdown-menu arrow-up" aria-labelledby="dropdownMenuButton1">
                                        <li>
                                            <a className="dropdown-item" onClick={ () => { handleYearChange( 2021 ); } } href >
                                                2021
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" onClick={ () => { handleYearChange( 2022 ); } } href>
                                                2022
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" onClick={ () => { handleYearChange( 2023 ); } } href>
                                                2023
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" onClick={ () => { handleYearChange( 2024 ); } } href>
                                                2024
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="dropdown notification-wrapper">
                                    <img src={ dots } alt="three-dots" className='dots' id="dropdownMenuButton1" data-bs-toggle="dropdown"/>
                                    <ul className="dropdown-menu arrow-up" aria-labelledby="dropdownMenuButton1">
                                        <li>
                                            <a className="dropdown-item" onClick={ () => { handleQuarterChange( 1 ); } } href >
                                                1
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" onClick={ () => { handleQuarterChange( 2 ); } } href>
                                                2
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" onClick={ () => { handleQuarterChange( 3 ); } } href>
                                                3
                                            </a>
                                        </li>
                                        <li>
                                            <a className="dropdown-item" onClick={ () => { handleQuarterChange( 4 ); } } href>
                                                4
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div style={ { width: '350px' } }><EventPieChart visualCountsData = { visualCounts } /></div>
                    </div>
                </div>
                <div className="col-xl-7 col-lg-7 col-md-12 col-sm-12 col-12">
                    <div className="row ms-2 mb-4">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <div className='lineChart-wrapper'>
                                <div className='d-flex align-items-center justify-content-between mb-2'>
                                    <div className='heading'>{ordersFilter} Orders Placed</div>
                                    <div className="dropdown notification-wrapper" onClick={ () => handleOpenDropDown() }>
                                        <img src={ dots } alt="three-dots" className='dots' id="dropdownMenuButton1" data-bs-toggle="dropdown"/>
                                        <ul className="dropdown-menu arrow-up" aria-labelledby="dropdownMenuButton1">
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(5, 'isDaily'); setOrdersFilter( "Daily" ); setRevenueFilterFilter( "Monthly"); setEventFilter( "Monthly"); } } href >
                                                    Daily
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(5, 'isWeekly'); setOrdersFilter( "Weekly" ); setRevenueFilterFilter( "Monthly"); setEventFilter( "Monthly"); }  } href>
                                                    Weekly
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(5, 'isMonthly'); setOrdersFilter( "Monthly" ); setRevenueFilterFilter( "Monthly"); setEventFilter( "Monthly"); } } href>
                                                    Monthly
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(5, 'isYearly'); setOrdersFilter( "Yearly" ); setRevenueFilterFilter( "Monthly"); setEventFilter( "Monthly"); } } href>
                                                    Yearly
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='px-2'>
                                    <EventDownloadsLineGraph lineGraphData = { totalSalesReportCount ? totalSalesReportCount : monthlyOrdersPlaced  } isVideoDown = { true } title ='' />
                                </div>
                            </div>
                        </div>
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <div className='lineChart-wrapper'>
                                <div className='d-flex align-items-center justify-content-between mb-2'>
                                    <div className='heading'>{revenueFilter} Orders Revenue</div>
                                    <div className="dropdown notification-wrapper">
                                        <img src={ dots } alt="three-dots" className='dots' id="dropdownMenuButton1" data-bs-toggle="dropdown"/>
                                        <ul className="dropdown-menu arrow-up" aria-labelledby="dropdownMenuButton1">
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(7, 'isDaily'); setRevenueFilterFilter( 'Daily' ); setOrdersFilter( "Monthly" ); setEventFilter( "Monthly"); } } href >
                                                    Daily
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(7, 'isWeekly'); setRevenueFilterFilter( 'Weekly' ); setOrdersFilter( "Monthly" ); setEventFilter( "Monthly"); } } href>
                                                    Weekly
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(7, 'isMonthly'); setRevenueFilterFilter( 'Monthly' ); setOrdersFilter( "Monthly" ); setEventFilter( "Monthly"); } } href>
                                                    Monthly
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(7, 'isYearly'); setRevenueFilterFilter( 'Yearly' ); setOrdersFilter( "Monthly" ); setEventFilter( "Monthly"); } } href>
                                                    Yearly
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='px-2'>
                                    <EventDownloadsLineGraph lineGraphData = { totalOrdersRevenue ? totalOrdersRevenue : monthlyOrdersRevenue } isImageDown = { true } title ='' />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row ms-2 mb-4">
                        <div className="col-xl-6 col-lg-6 col-md-6 col-sm-12 col-12">
                            <div className='lineChart-wrapper'>
                                <div className='d-flex align-items-center justify-content-between mb-2'>
                                    <div className='heading'>{eventFilter} Events Created</div>
                                    <div className="dropdown notification-wrapper">
                                        <img src={ dots } alt="three-dots" className='dots' id="dropdownMenuButton1" data-bs-toggle="dropdown"/>
                                        <ul className="dropdown-menu arrow-up" aria-labelledby="dropdownMenuButton1">
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(3 ,'isDaily'); setEventFilter( 'Daily' ); setRevenueFilterFilter( 'Monthly' ); setOrdersFilter( "Monthly" ); } } href >
                                                    Daily
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(3,'isWeekly'); setEventFilter( 'Weekly' ); setRevenueFilterFilter( 'Monthly' ); setOrdersFilter( "Monthly" ); } } href>
                                                    Weekly
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(3 ,'isMonthly'); setEventFilter( 'Monthly' ); setRevenueFilterFilter( 'Monthly' ); setOrdersFilter( "Monthly" ); } } href>
                                                    Monthly
                                                </a>
                                            </li>
                                            <li>
                                                <a className="dropdown-item" onClick={ () => { handleFilter(3, 'isYearly'); setEventFilter( 'Yearly' ); setRevenueFilterFilter( 'Monthly' ); setOrdersFilter( "Monthly" ); } } href>
                                                    Yearly
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                                <div className='px-2'>
                                    <EventDownloadsLineGraph lineGraphData = { events_created ? events_created : eventDownloadDetails  } isEventDown = { true } title =''/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
DataGraph.propTypes = {
    graphCounts: PropTypes.array,
    handleFilter: PropTypes.func,
    handlePieFilter: PropTypes.func,
    handleOpenDropDown: PropTypes.func
};
export default DataGraph;
