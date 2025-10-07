/* eslint-disable quotes */
/* eslint-disable array-callback-return */
/* eslint-disable react/prop-types */
import React from 'react';
import { Pie } from 'react-chartjs-2';
import PropTypes from 'prop-types';

function EventPieChart(props) {
    const { visualCountsData } = props
    const labelArray = []
    const allData = []

    if(visualCountsData && visualCountsData[ 0 ].year_based_quaterly_data) {
        visualCountsData[ 0 ].year_based_quaterly_data.map((data)=>{
            labelArray.push("   " + data.Month)
        })
        visualCountsData[ 0 ].year_based_quaterly_data.map((data)=>{
            allData.push(data.assets)
        })
    } else if (visualCountsData && visualCountsData[ 0 ].current_quater_revenue) {
        visualCountsData[ 0 ].current_quater_revenue.map((data)=>{
            labelArray.push("   " + data.Month)
        })
        visualCountsData[ 0 ].current_quater_revenue.map((data)=>{
            allData.push(data.assets)
        })
    }

    const state = {
        labels: labelArray,
        datasets: [
            {
                backgroundColor: [
                    '#6EB1E1',
                    '#71D456',
                    '#F0582F',
                ],
                hoverBackgroundColor: [
                    '#6EB1E1',
                    '#71D456',
                    '#F0582F',
                ],
                borderWidth: 15,
                hoverBorderWidth: 0,
                data: allData,
                label: 'Quarterly Revenue Report'
            },
        ],
    };
    return (
        <div>
            <Pie
                data={ state }
                options={ {
                    title:{
                        display:true,
                        text:'Average Rainfall per month',
                        fontSize:20
                    },
                    legend:{
                        display:true
                    } } }
            />
        </div>
    );
}
EventPieChart.prototype = {
    visualCountsData: PropTypes.array,
};
export default EventPieChart;
