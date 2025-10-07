/* eslint-disable no-use-before-define */
import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import 'static/style/event.scss'
import { monthDateYearFormat } from 'utils/Helper';

import Loader from 'shared/Loader';
import { useSelector } from 'react-redux';

const ViewEventDetails = (props) => {
    const { handleClose, isModalVisible, handleSubmit, eventDetails, } = props;
    const { event_producer, event_code, event_mode_id, event_name, is_internet_available, event_description, start_date, end_date, is_onsite_sale_available } = eventDetails
    const isLoading = useSelector((state) => state.modalIsLoading);
    return (
        <>
            <ModelViewLayoutContainer
                handleClose={ handleClose }
                isModalVisible={ isModalVisible }
                handleSubmit={ handleSubmit }
                title="Event Details"
                buttonCond= { false }
                className="add-event-modal"
                id='view-modal'
            >
                {isLoading && <div className="d-flex justify-content-center align-items-center" style={ { width: '402px', height: '150px' } }><Loader  /></div> }
                {!isLoading && <>
                    <div className="row mb-3">
                        <div className="col-6">
                            <div className="mt-2">
                                <span className="event-modal-label">Event Producer:</span>
                                <span className="event-modal-detail ml-1">{event_producer}</span>
                            </div>
                            <div className="mt-2">
                                <span className="event-modal-label">Event Code:</span>
                                <span className="event-modal-detail ml-1">{event_code}</span>
                            </div>
                        </div>
                        <div className="col-6">
                            <div className="mt-2">
                                <span className="event-modal-label">Event Type:</span>
                                <span className="event-modal-detail ml-1">{event_mode_id === 1 ? 'Dance' : 'Cheer'}</span>
                            </div>
                            <div className="mt-2">
                                <span className="event-modal-label">Event Title:</span>
                                <span className="event-modal-detail ml-1">{event_name}</span>
                            </div>
                        </div>
                        <div className="mt-2">
                            <span className="event-modal-label">Comments:</span>
                            <div className="event-modal-detail">{event_description}</div>
                        </div>
                        <div className="mt-2">
                            <span className="event-modal-label">Event Dates:</span>
                            <span className="event-modal-detail ml-1">{ monthDateYearFormat(start_date) } - {monthDateYearFormat(end_date) }</span>
                        </div>
                        <div className="mt-2">
                            <span className="event-modal-label">Internet :</span>
                            <span className="event-modal-detail ml-1">{is_internet_available ? 'Available' : 'Unavailable'}</span>
                        </div>
                    </div>
                    <div className="row mt-2">
                        <div className="col-6">
                            <span className="event-modal-label">Onsite Sales :</span>
                            <span className="event-modal-detail ml-1">{is_onsite_sale_available ? 'Yes' : 'No'}</span>
                        </div>
                        <div className="col-6">
                        </div>
                    </div>
                </>}
            </ModelViewLayoutContainer>
        </>
    );
};

ViewEventDetails.propTypes = {
    handleClose: PropTypes.func,
    addNewTeamFunc: PropTypes.func,
    isModalVisible: PropTypes.func,
    handleSubmit: PropTypes.func,
    eventDetails: PropTypes.array,
    id: PropTypes.string,
    eventId: PropTypes.number,
};

export default ViewEventDetails;
