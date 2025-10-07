/* eslint-disable array-callback-return */
import React from 'react'
import { Line } from 'react-chartjs-2';
import PropTypes from 'prop-types';

function EventDownloadsLineGraph(props) {
    const { lineGraphData } = props
    const labelArray = []
    const allDownloadData = []
    lineGraphData && lineGraphData.map((data)=>{
        labelArray.push(data.duration)
    })
    lineGraphData && lineGraphData.map((data)=>{
        allDownloadData.push( data.assets )
    })
    const state = {
        labels: labelArray,
        options: {
            tooltips: {
                callbacks: {
                    label: function(tooltipItems, data) {
                        return data.datasets[ tooltipItems.datasetIndex ].labels +': ' + tooltipItems.yLabel + ' $';
                    }
                }

            }
        },
        datasets: [
            {
                label: props.title,
                fill: false,
                lineTension: 0.5,
                backgroundColor: '#FE077C',
                borderColor: '#FE077C',
                borderWidth: 2,
                data: allDownloadData
            }
        ]
    }
    return (
        <Line
            data={ state }
            options={ {
                legend:{
                    display:false,
                }
            } }
        />
    )
}
EventDownloadsLineGraph.propTypes = {
    lineGraphData: PropTypes.array,
    handleOpenDropDown: PropTypes.func,
    isFilter: PropTypes.bool,
    title: PropTypes.string,
};
export default EventDownloadsLineGraph
