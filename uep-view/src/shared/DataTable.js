import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'antd';

function DataTable(props) {
    const { columns, eventList, onChange , condKey, pageChange, current, totalPages, scrollX } = props

    const rowColorChange = (record) => {
        if (condKey) {
            return record?.is_active ? 'table-row-dark' : 'table-row-light'
        }
        else {
            return record?.is_active  ? 'table-row-dark' : 'table-row-light'
        }
    }
    return (
        <div className="d-flex flex-row">
            <Table className="table-responsive"
                columns={ columns }
                dataSource={ eventList }
                onChange={ onChange }
                rowClassName={ (record) => rowColorChange(record) }
                scroll= { scrollX ? { y: 410,  x: 3500 } : { y: 410 } }
                pagination={ {
                    pageSize: 10,
                    total: totalPages,
                    current: current,
                    onChange: (page) => {
                        pageChange(page);
                    },
                } }
            />
        </div>
    )
}
export function DataTableNoPagination(props) {
    const { columns, eventList, onChange , condKey, scrollX } = props

    const rowColorChange = (record) => {
        if (condKey) {
            return record?.is_active ? 'table-row-dark' : 'table-row-light'
        }
        else {
            return record?.is_active  ? 'table-row-dark' : 'table-row-light'
        }
    }
    return (
        <div className="d-flex flex-row">
            <Table className="table-responsive"
                columns={ columns }
                dataSource={ eventList }
                onChange={ onChange }
                rowClassName={ (record) => rowColorChange(record) }
                scroll= { scrollX ? { y: 610,  x: 3500 } : { y: 610 } }
                pagination={ false }
            />
        </div>
    )
}

DataTable.propTypes = {
    columns: PropTypes.array,
    eventList: PropTypes.array,
    condKey: PropTypes.string,
    handleTableManipulation: PropTypes.func,
    current: PropTypes.number,
    totalPages: PropTypes.number,
    pageChange: PropTypes.func,
    scrollX: PropTypes.bool,
}
DataTableNoPagination.propTypes = {
    columns: PropTypes.array,
    eventList: PropTypes.array,
    condKey: PropTypes.string,
    handleTableManipulation: PropTypes.func,
    current: PropTypes.number,
    totalPages: PropTypes.number,
    pageChange: PropTypes.func,
    scrollX: PropTypes.bool,
}

export default DataTable
