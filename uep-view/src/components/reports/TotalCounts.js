import React from 'react';
import PropTypes from 'prop-types';
import 'static/style/dashboard.scss';
import { numberWithCommas } from 'utils/Helper';

function TotalCounts(props) {
    const { reportCounts } = props
    const { completedOrders,
        pendingOrders,
        total_customers,
        total_events,
        total_sales_count } = reportCounts ? reportCounts[ 0 ] : ''
    return (
        <div className="row g-0">
            <h3 className="heading_report">Reports</h3>
            <div className="d-flex flex-wrap">
                <div className="dashboard_report_card">
                    <div className="card-body">
                        <h2 className="counts">{numberWithCommas(total_customers && total_customers.total_customers)}</h2>
                        <h5 className="count_name">Total Customers</h5>
                    </div>
                </div>

                <div className="dashboard_report_card">
                    <div className="card-body">
                        <h2 className="counts"> { numberWithCommas(total_sales_count && total_sales_count.total_sales) } </h2>
                        <h5 className="count_name">Total Orders</h5>
                    </div>
                </div>

                <div className="dashboard_report_card">
                    <div className="card-body">
                        <h2 className="counts">{numberWithCommas(completedOrders && completedOrders.completed_orders)}</h2>
                        <h5 className="count_name">Completed Orders</h5>
                    </div>
                </div>

                <div className="dashboard_report_card">
                    <div className="card-body">
                        <h2 className="counts">{numberWithCommas(pendingOrders && pendingOrders.pending_orders)}</h2>
                        <h5 className="count_name">Pending Orders</h5>
                    </div>
                </div>

                <div className="dashboard_report_card">
                    <div className="card-body">
                        <h2 className="counts"> { numberWithCommas(total_events && total_events.total_events) } </h2>
                        <h5 className="count_name">Events Created</h5>
                    </div>
                </div>

            </div>
        </div>
    );
}
TotalCounts.propTypes = {
    reportCounts: PropTypes.array,
};

export default TotalCounts;
