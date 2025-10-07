import React from 'react';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer';
import { useSelector } from 'react-redux';
import Loader from 'shared/Loader';

function ViewProducerDetails(props) {
    const { handleClose, isModalVisible, handleSubmit, producerProfileDetails } =
    props;
    const {
        contact_name,
        email_id,
        event_producer,
        phone_number,
        producer_address,
    } = producerProfileDetails;
    const isLoading = useSelector((state) => state.modalIsLoading);
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="View Producer"
            buttonCond={ false }
            id='view-producer'
        >
            {isLoading && <div className="d-flex justify-content-center align-items-center" style={ { height: '187px' } }><Loader  /></div> }
            {!isLoading &&
                <div className="row g-0">
                    <div className="col-12">
                        <div className="row g-0 mb-3">
                            <div className="col-6">
                                <div className="producer-title">Event Producer:</div>
                            </div>
                            <div className="col-6">
                                <span className="event-modal-detail ml-1">{event_producer}</span>
                            </div>
                        </div>
                        <div className="row g-0 my-3">
                            <div className="col-6">
                                <div className="producer-title">Contact Name:</div>
                            </div>
                            <div className="col-6">
                                <span className="event-modal-detail ml-1">{contact_name}</span>
                            </div>
                        </div>
                        <div className="row g-0 my-3">
                            <div className="col-6">
                                <div className="producer-title">Contact Email:</div>
                            </div>
                            <div className="col-6">
                                <span className="event-modal-detail ml-1">{email_id}</span>
                            </div>
                        </div>
                        <div className="row g-0 my-3">
                            <div className="col-6">
                                <div className="producer-title">Contact Telephone:</div>
                            </div>
                            <div className="col-6">
                                <span className="event-modal-detail ml-1">{phone_number}</span>
                            </div>
                        </div>
                        <div className="row g-0 my-2">
                            <div className="col-6">
                                <span className="producer-title">Contact Address:</span>
                            </div>
                            <div className="col-6">
                                <span className="event-modal-detail ml-1">{producer_address}</span>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </ModelViewLayoutContainer>
    );
}

ViewProducerDetails.propTypes = {
    handleClose: PropTypes.func,
    isModalVisible: PropTypes.func,
    handleSubmit: PropTypes.func,
    producerProfileDetails: PropTypes.array,
    id: PropTypes.string
};

export default ViewProducerDetails;
