/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable array-callback-return */
/* eslint-disable react/display-name */
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import DataTable from 'shared/DataTable';
import chaticon from 'static/images/chat.png';
import isChaticon from 'static/images/isChat.png';
import { Switch } from 'antd';
import { getZendeskDetails, getZendeskImportantTicket } from 'actions/zendeskActions';
import Loader from 'shared/Loader';
import Button from 'shared/Button';
import refresh from 'static/images/refresh.png'
import moment from 'moment';

function ZendeskList(props) {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getZendeskDetails());
    }, [ dispatch ]);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const zendeskDataList = useSelector((state) => state.zendeskDetails);
    const tableData = zendeskDataList

    const handleTableManipulation = (pagination, filters, sorter, extra) => {
        console.log('params', pagination, filters, sorter, extra);
    };
    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }
    const addFlag = (checked, key) => {
        const data = {
            zendesk_ticket_id: key.ticket_id,
            is_important: key.is_important === 1 ? 0 : 1
        }
        dispatch(getZendeskImportantTicket(data))
    }

    const pageChange = () => {

    }

    const finalData =  tableData
    const columns = [
        {
            title: 'ID',
            dataIndex: '',
            sorter: (a, b) => a && a.id && a.id.localeCompare(b && b.id),
            width: '14%',
            render: (key) => {
                return (
                    key.is_important === 1 ? <span style={ { color: "#FE077C" } }>{key.ticket_id}</span> : <span>{key.ticket_id}</span>
                );
            },
        },
        {
            title: 'Name',
            dataIndex: '',
            sorter: (a, b) => a && a.id && a.id.localeCompare(b && b.id),
            width: '18%',
            render: (key) => {
                return (
                    key.is_important === 1 ? <span style={ { color: "#FE077C" } }>{key.name}</span> : <span>{key.name}</span>
                );
            },
        },
        {
            title: 'Subject',
            dataIndex: '',
            sorter: {
                compare: (a,b) => a && a.subject && a.subject.localeCompare(b && b.subject),
                multiple: 2,
            },
            width: '14%',
            render: (key) => {
                return (
                    key.is_important === 1 ? <span style={ { color: "#FE077C" } }>{key.subject}</span> : <span>{key.subject}</span>
                );
            },

        },
        {
            title: 'Status',
            dataIndex: '',
            sorter: (a, b) => a && a.status.toString() && a.status.toString().localeCompare(b && b.status),
            width: '14%',
            render: (key) => {
                return (
                    key.is_important === 1 ? <span style={ { color: "#FE077C" } }>{key.status}</span> : <span>{key.status}</span>
                );
            },
        },
        {
            title: 'Created On',
            dataIndex: '',
            sorter: {
                compare: (a, b) => a && a.created_at  && a.created_at.localeCompare(b && b.created_at),
                multiple: 2,
            },
            width: '14%',
            render: (key) => {
                return (
                    key.is_important === 1 ? <span style={ { color: "#FE077C" } }>{ key.created_at }</span> : <span>{ key.created_at }</span>
                );
            },
        },
        {
            title: 'Chat',
            dataIndex: '',
            align: 'center',
            width: '12%',
            render: (key) => {
                return (
                    <>
                        <img
                            src={ key.is_important === 1 ? isChaticon : chaticon }
                            alt="read"
                            width="20"
                            className="mx-2 icon-margin pointer"
                            onClick={ () => openInNewTab('https://uepinc.zendesk.com/agent/dashboard') }
                        />
                    </>
                );
            },
        },
        {
            title: 'Important Message',
            dataIndex: '',
            align: 'center',
            width: '12%',
            render: (key) => {
                return (
                    <Switch
                        onChange={ (checked) => addFlag(checked, key) }
                        checked={ key && key.is_important }
                        className={
                            key && key.is_live ? 'toggle-green' : 'toggle-red'
                        }
                    />
                );
            },
        }
    ];
    return (
        <>
            <div className="event-main">
                <div className="page-wrapper staff-page">
                    <div className="event-header d-flex justify-content-between align-items-center">
                        <div className="heading">Zendesk</div>
                        <div>
                            <Button
                                className="create-btn"
                                handleSubmit={ () => dispatch(getZendeskDetails()) }
                                buttonName="Refresh"
                                imageParam= { <img src={ refresh } alt="edit-img" className="edit-img" /> }
                            />
                        </div>
                    </div>
                    {isLoading && <div className='mt-5'><Loader /></div> }
                    <div className="data-table">
                        {!isLoading && (
                            <DataTable
                                columns={ columns }
                                onChange={ handleTableManipulation }
                                pageChange={ pageChange }
                                eventList={ finalData }
                            />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

ZendeskList.propTypes = {
    history: PropTypes.object,
};

export default ZendeskList;