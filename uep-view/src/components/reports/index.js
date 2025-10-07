/* eslint-disable react-hooks/exhaustive-deps */
import React , { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import AuthLayoutContainer from 'shared/AuthLayoutContainer';
import TotalCounts from './TotalCounts';
import DataGraph from './DataGraph';
import { getAdminReports, getVisualReports } from 'actions/reportActions';

function Reports(props) {
    const dispatch = useDispatch()
    const { history } = props
    const [ isFilter, setIsFilter ] = useState(false)
    const [ isOptions, setIsOptions ] = useState({
        is_daily: 0,
        is_weekly: 0,
        is_monthly:0,
        is_yearly: 0,
    })
    const [ isPieOptions, setIsPieOptions ] = useState({
        year: 2022,
        quarter: 2,
    })
    const [ isFilterType, setIsFilterType ] = useState(0)
    const dashboardData = useSelector(state => state.dashboardData)
    const { graph_counts, report_counts }  = dashboardData
    const visualReportsData = useSelector(state => state.visualReportsData)
    const { visual_report_counts }  = visualReportsData

    useEffect(() => {
        const { is_daily, is_weekly, is_monthly, is_yearly } = isOptions
        const { year, quarter } = isPieOptions
        const data = {
            is_daily: is_daily,
            is_weekly: is_weekly,
            is_monthly:is_monthly,
            is_yearly: is_yearly,
            filter_type: isFilterType,
        }
        const lineData = {
            year: year ,
            quarter: quarter,
        }
        dispatch(getAdminReports(data))
        dispatch(getVisualReports(lineData))
    }, [ dispatch, isOptions, isFilterType ])
    const handleOpenDropDown = () => {
        setIsFilter(!isFilter)
    }
    const handleFilter = (type, filter) => {
        setIsFilterType(type)
        if (filter === 'isDaily'){
            setIsOptions({
                is_daily: 1,
                is_weekly: 0,
                is_monthly:0,
                is_yearly: 0,
            })
        }
        else if (filter === 'isWeekly'){
            setIsOptions({
                is_daily: 0,
                is_weekly: 1,
                is_monthly:0,
                is_yearly: 0,
            })
        }
        else if (filter === 'isMonthly'){
            setIsOptions({
                is_daily: 0,
                is_weekly: 0,
                is_monthly:1,
                is_yearly: 0,
            })
        }
        else {
            setIsOptions({
                is_daily: 0,
                is_weekly: 0,
                is_monthly:0,
                is_yearly: 1,
            })
        }

    }

    const handlePieFilter = (quarter, year) => {
        setIsPieOptions({
            year: year,
            quarter: quarter,
        })
        const lineData = {
            year: year,
            quarter: quarter,
        }
        dispatch(getVisualReports(lineData))
    }
    return (
        <AuthLayoutContainer history={ history }>
            <div className="dashboard-wrapper event-main">
                <div className=" dashboard-content">
                    <div className="row">
                        <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                            <TotalCounts reportCounts = { report_counts } />
                            <DataGraph graphCounts= { graph_counts } visualCounts= { visual_report_counts } handleOpenDropDown = { handleOpenDropDown } isFilter={ isFilter } handleFilter = { handleFilter } handlePieFilter = { handlePieFilter } />
                        </div>
                    </div>
                </div>
            </div>
        </AuthLayoutContainer>
    )
}
Reports.propTypes = {
    history: PropTypes.object,
};

export default Reports