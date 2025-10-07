/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React from 'react';
import NotificationIcon from 'static/images/svg/notification.svg';
import 'static/style/dashboard.scss';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import Loader from 'shared/Loader';
import { useState } from 'react';

function Notifications(props) {
    const { getNotification, removeAllNotification } = props;
    const notificationData = useSelector(state => state.notificationData);
    const isLoading = useSelector(state => state.modalIsLoading)
    const [ isData, setIsData ] = useState(false);

    return (
        <div className="dropdown notification-wrapper">
            <img
                className="notify_icon pointer"
                src={ NotificationIcon }
                alt=""
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                onClick= { () => { getNotification(); setIsData(!isData) } }
            />
            { isData && <ul style={ {
                width: "350px",
                marginLeft: "-108px",
                borderRadius: 12,
                padding: 0,
                maxHeight: 350,
                overflow: "auto",
                position: "absolute",
                zIndex: 1000,
                /* display: none; */
                minWidth: "10rem",
                margin: 0,
                fontSize: "1rem",
                color: "#212529",
                textAlign: "left",
                listStyle: "none",
                backgroundColor: "#fff",
                backgroundClip: "padding-box",
                border: "1px solid rgba(0,0,0,.15)",
            } }>
                <div className="d-flex justify-content-between align-items-center card-header">
                    <h6 className="notify_heading">Notification</h6>
                    <button className="read_btn" onClick= { () => removeAllNotification() }>Clear All</button>
                </div>
                {isLoading && <div className="d-flex justify-content-center align-items-center notify-loader"><Loader  /></div> }
                {
                    !isLoading && notificationData.length > 0 ? notificationData.map((data, index) => (
                        <li key={ index }>
                            <a className="dropdown-item" href>
                                <span className="notify-content">
                                    { data.message }
                                </span>
                            </a>
                        </li>
                    ))
                        :  <div className='ant-empty ant-empty-normal'> <br/> <br/><span className="ant-empty-description">No Data</span> </div>
                }
            </ul>
            }
        </div>
    );
}

Notifications.propTypes = {
    getNotification: PropTypes.func,
    handleOpenDropDown: PropTypes.func
};

export default Notifications;
