/* eslint-disable quotes */
/* eslint-disable no-unused-expressions */
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    getStorage,
    ref,
    uploadBytesResumable,
    getDownloadURL,
    deleteObject,
} from 'firebase/storage';
import { app } from '../../app/firebase';
import Button from 'shared/Button';
import { Radio } from 'antd';
import PropTypes from 'prop-types';
import AddTeamEvent from './AddTeamEvent';
import { DatePicker } from 'antd';
import Upload from 'static/images/svg/upload.svg';
import { ReactSVG } from 'react-svg';
import { addEventAccount, saveTeamDetails, uploadCsvTeamEvent } from 'actions/eventActions';
import { singleDateFormat } from 'utils/Helper';
import { getProducerListing } from 'actions/producerActions';
import ErrorMessage from 'shared/ErrorMessage';
import { triggerNotifier } from 'shared/notifier';
import Loader from 'shared/Loader';
import { applicationIsLoading } from '../../actions/commonActions';

function AddNewEvent(props) {
    const dispatch = useDispatch();
    const { createEventFunc, createNewEventFunc } = props;
    const defaultField = [
        {
            team_number: "",
            team_name: ""
        }
    ];
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ isKiosk, setIsKiosk ] = useState(false);
    const [ input, setInput ] = useState({});
    const [ inputError, setInputError ] = useState({});
    const [ startDate, setStartdate ] = useState('');
    const [ endDate, setEndDate ] = useState('');
    const producerList = useSelector((state) => state.producerList.producer_list);
    const teamDetails = useSelector((state) => state.teamDetails);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const isLoadingNew = useSelector((state) => state.applicationIsLoading);
    const [ addTeam, setAddTeam ] = useState(defaultField)
    const [ selectedFile, setSelectedFile ] = useState(null);
    useEffect(() => {
        dispatch(getProducerListing());
    }, [ dispatch ]);
    const deleteTeamHandler = (tnumber) => {
        const newTeam = [ ...addTeam ]
        const index = addTeam.findIndex((team) => team.team_number === tnumber )
        newTeam.splice(index, 1)
        setAddTeam(newTeam)
    }
    const TeamChangehandler = event => {
        const tempTeam = [ ...addTeam ];
        tempTeam[ event.target.dataset.id ][ event.target.name ] = event.target.value;
        setAddTeam(tempTeam);
    };
    const handleAddTeamFunc = () => {
        saveTeamDetails(addTeam);
        setIsModalVisible(false);
    };
    const handleSearch = () => {
        setAddTeam(prevCosts => [ ...prevCosts, { team_number: '', team_name: '' } ]);
    }
    const prodList = producerList && producerList.map((data, index) => (
        <option name="event_producer" key={ index } value={ data.producer_id }>
            {data.event_producer}
        </option>
    ));
    const handleKioskMode = (event) => {
        input[ event.target.name ] = event.target.value;
        setIsKiosk(!isKiosk);
    };
    const addNewTeamFunc = () => {
        setIsModalVisible(true);
    };

    const handleClose = () => {
        setIsModalVisible(false);
        setAddTeam([
            {
                team_number: "",
                team_name: ""
            }
        ])
    };
    const handleStartDate = (date, dateString) => {
        setStartdate(dateString);
    };
    const handleEndDate = (date, dateString) => {
        setEndDate(dateString);
    };
    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        if (type === 'file'){
            var data = new FormData();
            data.append('files', files[ 0 ]);
            dispatch(uploadCsvTeamEvent(data))
        }
        setInput((prevState) => ({
            ...prevState,
            [ name ]: value,
        }));
        setInputError({})
    };

    const validate = () => {
        const errors = {};
        let isValid = true;
        if (!input.event_code) {
            isValid = false;
            errors.event_code = 'Please enter event code';
        }
        if(input.event_code && input.event_code.length > 6 ) {
            isValid = false;
            errors.event_code = 'Event code must contain 6 characters only';
        } else if(input.event_code && input.event_code.length < 6) {
            isValid = false;
            errors.event_code = 'Event code must contain 6 characters only';
        }
        if (!input.event_title) {
            isValid = false;
            errors.event_title = 'Please enter event title';
        }
        if (!input.is_onsite_sale_available) {
            isValid = false;
            errors.is_onsite_sale_available = 'Please select sales availability';
        }
        if (!input.is_active) {
            isValid = false;
            errors.is_active = 'Please select event status';
        }
        if (!startDate) {
            isValid = false;
            errors.startDate = 'Please select start date';
        }
        if (!endDate) {
            isValid = false;
            errors.endDate = 'Please select end date';
        }
        if (!input.event_producer) {
            isValid = false;
            errors.event_producer = 'Please enter event producer';
        }
        if(input.act_number && input.act_number.length !== undefined) {
            if(input.act_number.length > 4 || input.act_number.length < 4) {
                isValid = false;
                errors.act_number = 'Act no must contain 4 digits only';
            }
        }

        setInputError(errors);

        return isValid;
    };
    const addEventFunc = (downloadURL) => {
        for(let i=0; i< teamDetails.length; i++) {
            teamDetails[ i ].team_name =  teamDetails[ i ].team_name.toString()
            teamDetails[ i ].team_number =  teamDetails[ i ].team_number.toString()
        }
        const {
            event_code,
            event_title,
            event_description,
            is_internet_available,
            is_onsite_sale_available,
            is_active,
            event_mode_id,
            act_number,
            event_producer,
            is_free,
            imageURL
        } = input;
        const data = {
            event_code: event_code,
            event_name: event_title,
            event_description: event_description,
            is_internet_available: is_internet_available === 'Yes' ? 1 : 0,
            is_onsite_sale_available: is_onsite_sale_available === 'Yes' ? 1 : 0,
            is_active: is_active === 'Yes' ? 1 : 0,
            start_date: singleDateFormat(startDate),
            end_date: singleDateFormat(endDate),
            producer_id: event_producer,
            event_mode_id: !event_mode_id ? 1 :  event_mode_id === 'Dance' ? 1 : 2,
            act_number: act_number ? act_number :  '',
            team_details: addTeam && addTeam[ 0 ] && addTeam[ 0 ].team_name === '' ? teamDetails : addTeam,
            // event_ad_flag: imageURL !== "" ? "1" : "0",
            event_ad_url: imageURL || downloadURL,
            is_free: is_free === 'Yes' ? "1" : "0"
        };
        if (validate()) {
            dispatch(addEventAccount(data)).then((res)=> {
                if(res && res.statusCode === 200 ){
                    dispatch(saveTeamDetails([]));
                    setInput({});
                    createNewEventFunc();
                }
            })
        }
    };
    const handleUpload = async () => {
        if(selectedFile){
            dispatch(applicationIsLoading(true));
            const storage = getStorage(app);
            const staticImageName = input?.event_code + '-Ad';
            const fileName = `${ staticImageName }.${ selectedFile.name.split('.').pop() }`;
            // const fileName = selectedFile.name.replace('thumb_', '');
            const metadata = { cacheControl: 'public, no-cache' };
            const path = '/Event-Ad/' + input?.event_code;
            const existingImageURL = input.imageURL;
            if (fileName.includes('.mp4')) {
                metadata[ 'contentType' ] = 'application/octet-stream';
            }
            const storageRef = ref(storage, path + '/' + fileName);
            if (existingImageURL) {
                const existingImageRef = ref(storage, existingImageURL);
                try {
                    await deleteObject(existingImageRef);
                } catch (error) {
                    console.error('Error deleting existing image:', error);
                }
            }
            const uploadTask = uploadBytesResumable(storageRef, selectedFile, metadata);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    // const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                },
                (error) => {
                    console.log(error);
                },
                async () => {
                    const date = new Date();
                    console.log(date);
                    const downloadURL = await getDownloadURL(storageRef);
                    setInput({ ...input, imageURL: downloadURL });
                    setTimeout(() => {
                        if(downloadURL){
                            addEventFunc(downloadURL)
                        }
                    }, 100);
                }
            );
        }
        else{
            addEventFunc()
        }
    };

    const handleFileChange = (event) => {
        const file = event.target.files[ 0 ];
        if (!file) {
            return;
        }
        const allowedImageFormats = [ '.jpg', '.jpeg', '.png' ];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        if (allowedImageFormats.includes(fileExtension)) {
            // const path = '/Event-Ad/' + input?.event_code;
            // handleUpload(file, path, input.imageURL);
            setSelectedFile(file);
        } else {
            triggerNotifier({ type: 'error', message: 'Please upload a valid image file.' });
        }
    };
    const handleRemoveFile = async () => {
        if (input.imageURL) {
            const storage = getStorage(app);
            const imageRef = ref(storage, input.imageURL);
            try {
                await deleteObject(imageRef);
                setInput({ ...input, imageURL: null });
                // triggerNotifier({ type: 'success', message: 'Advertisement removed successfully' });
            } catch (error) {
                console.error('Error deleting image:', error);
                // triggerNotifier({ type: 'error', message: 'Error removing advertisement' });
            }
        }
        setSelectedFile(null);
        const inputFile = document.getElementById('AdUploadImage');
        if (inputFile) {
            inputFile.value = '';
        }
    };
    const dateFormat = 'MM/DD/YYYY';
    const { event_title, event_code , is_onsite_sale_available, is_active , event_producer, is_free } = inputError
    return (
        <div>
            <div className="create-event">
                <div className="event-header d-flex flex-wrap justify-content-between align-items-center">
                    <div className="heading">Create Event</div>
                    <div className="d-flex">
                        <div className="">
                            <Button
                                className="btn btn-primary btn-lg cancel_btn"
                                handleSubmit={ () => createEventFunc() }
                                buttonName="Cancel"
                            />
                        </div>
                        <div className="">
                            <Button
                                className="btn btn-primary btn-lg save_btn"
                                // handleSubmit={ () => addEventFunc() }
                                handleSubmit={ () => handleUpload() }
                                buttonName="Save"
                            />
                        </div>
                    </div>
                </div>
                {isLoadingNew && <div className='mt-5'><Loader /></div> }
                {!isLoading && <div className="create-event-container">
                    <div className="row g-0">
                        <div className="col-4 text-start mb-5">
                            <div className="mb-3 d-flex flex-column">
                                <label className="new-event-label mb-1">Event Code*</label>
                                <div className="new-event-field">
                                    <input
                                        type="text"
                                        name="event_code"
                                        value={ input.event_code }
                                        placeholder="Event Code"
                                        className="input-field"
                                        autoComplete='off'
                                        onChange={ handleChange }
                                    />
                                </div>
                                {event_code && (
                                    <ErrorMessage message={ event_code || '' } />
                                )}
                            </div>
                            <div className="mb-3 d-flex flex-column">
                                <label className="new-event-label mb-1">Event Title*</label>
                                <div className="new-event-field">
                                    <input
                                        type="text"
                                        name="event_title"
                                        value={ input.event_title }
                                        placeholder="Event Title"
                                        className="input-field"
                                        autoComplete='off'
                                        onChange={ handleChange }
                                    />
                                </div>
                                {event_title && (
                                    <ErrorMessage message={ event_title || '' } />
                                )}
                            </div>
                            <div className="mb-3 d-flex flex-column">
                                <label className="new-event-label mb-1">Comments</label>
                                <div className="new-event-comment">
                                    <textarea
                                        name="event_description"
                                        value={ input.event_description }
                                        placeholder="Enter Event Comments"
                                        className="input-field rounded"
                                        onChange={ handleChange }
                                        maxLength='500'
                                    />
                                </div>
                            </div>
                            <div className="mt-3 mb-4">
                                <div className="d-flex align-items-center">
                                    <label className="internet-check">Internet Connection?*</label>
                                    <Radio.Group onChange={ handleChange } name= 'is_internet_available'>
                                        <div className="d-flex">
                                            <div className="radio-options">
                                                <Radio
                                                    className="radio-btn"
                                                    value="Yes"
                                                    name="is_internet_available"
                                                    id="Yes-option"
                                                />
                                                <label
                                                    className="form-check-label radio-label pointer"
                                                    htmlFor="Yes-option"
                                                >
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="radio-options">
                                                <Radio
                                                    className="radio-btn"
                                                    value="No"
                                                    name="is_internet_available"
                                                    id="No-option"
                                                />
                                                <label
                                                    className="form-check-label radio-label pointer"
                                                    htmlFor="No-option"
                                                >
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </Radio.Group>
                                </div>

                            </div>

                            <div className="mt-3 mb-4">
                                <div className="d-flex align-items-center">
                                    <label className="internet-check">OnSite Sales Available?*</label>
                                    <Radio.Group onChange={ handleChange } name= 'is_onsite_sale_available'>
                                        <div className="d-flex">
                                            <div className="radio-options">
                                                <Radio
                                                    className="radio-btn"
                                                    value="Yes"
                                                    name="is_onsite_sale_available"
                                                    id="Yes-option1"
                                                />
                                                <label
                                                    className="form-check-label radio-label pointer"
                                                    htmlFor="Yes-option1"
                                                >
                                                    Yes
                                                </label>
                                            </div>
                                            <div className="radio-options">
                                                <Radio
                                                    className="radio-btn"
                                                    value="No"
                                                    name="is_onsite_sale_available"
                                                    id="No-option1"
                                                />
                                                <label
                                                    className="form-check-label radio-label pointer"
                                                    htmlFor="No-option1"
                                                >
                                                    No
                                                </label>
                                            </div>
                                        </div>
                                    </Radio.Group>
                                </div>
                                {is_onsite_sale_available && (
                                    <ErrorMessage message={ is_onsite_sale_available || '' } />
                                )}
                            </div>
                            <div className="mt-3 mb-4">
                                <div className="d-flex align-items-center">
                                    <label className="internet-check">Event Status*</label>
                                    <Radio.Group onChange={ handleChange } name='is_active' >
                                        <div className="d-flex">
                                            <div className="radio-options d-flex">
                                                <Radio
                                                    className="radio-btn"
                                                    value="Yes"
                                                    name="is_active"
                                                    id="Active-option"
                                                />
                                                <label
                                                    className="form-check-label radio-label pointer"
                                                    htmlFor="Active-option"
                                                >
                                                    Active
                                                </label>
                                            </div>
                                            <div className="radio-options d-flex">
                                                <Radio
                                                    className="radio-btn"
                                                    value="No"
                                                    name="is_active"
                                                    id="Inactive-option"
                                                />
                                                <label
                                                    className="form-check-label radio-label pointer"
                                                    htmlFor="Inactive-option"
                                                >
                                                    Inactive
                                                </label>
                                            </div>
                                        </div>
                                    </Radio.Group>
                                </div>
                                {is_active && (
                                    <ErrorMessage message={ is_active || '' } />
                                )}
                            </div>
                        </div>
                        <div className="col-4 text-start">
                            <div className="mb-3 d-flex flex-column">
                                <label className="new-event-label mb-1">Select Date*</label>
                                <div className="d-flex flex-wrap justify-content-between date-wrap">
                                    <DatePicker
                                        className="input-search"
                                        placeholder="Start Date"
                                        onChange={ handleStartDate }
                                        format={ dateFormat }
                                    />
                                    <DatePicker
                                        className="input-search"
                                        placeholder="End Date"
                                        onChange={ handleEndDate }
                                        format={ dateFormat }
                                    />
                                </div>
                                <div className="d-flex">
                                    <div className="me-2">
                                        {!startDate && (
                                            <ErrorMessage message={ inputError.startDate || '' } />
                                        )}
                                    </div>
                                    <div className="ms-5">
                                        {!endDate && (
                                            <ErrorMessage message={ inputError.endDate || '' } />
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="mb-3 d-flex flex-column position-relative">
                                <label className="new-event-label mb-1">Event Producer*</label>
                                <span className="">
                                    <select
                                        className="form-control producer pointer prducer-select-arrow"
                                        name="event_producer"
                                        onChange={ handleChange }
                                        required
                                    >
                                        <option name="event_producer" value="" disabled selected >
                                            Select
                                        </option>
                                        {prodList}
                                    </select>
                                </span>
                            </div>
                            {event_producer && (
                                <ErrorMessage message={ event_producer || '' } />
                            )}
                            <div className="d-flex align-items-center mt-4 mt-3 mb-3" onChange={ handleKioskMode }>
                                <label className="internet-check">Select Kiosk Mode*</label>
                                <Radio.Group  onChange={ handleChange } defaultValue='Dance' name="event_mode_id">
                                    <div className="d-flex">
                                        <div className="radio-options d-flex justify-content-center">
                                            <Radio
                                                className="radio-btn"
                                                value="Dance"
                                                name="event_mode_id"
                                                id="Dance-option"
                                            />
                                            <label
                                                className="form-check-label radio-label pointer"
                                                htmlFor="Dance-option"
                                            >
                                                Dance
                                            </label>
                                        </div>
                                        <div className="radio-options d-flex justify-content-center">
                                            <Radio
                                                className="radio-btn"
                                                value="Cheer"
                                                name="event_mode_id"
                                                defaultChecked
                                                id="Cheer-option"
                                            />
                                            <label
                                                className="form-check-label radio-label pointer"
                                                htmlFor="Cheer-option"
                                            >
                                                Cheer
                                            </label>
                                        </div>
                                    </div>
                                </Radio.Group>
                            </div>
                            {isKiosk && (
                                <div className="d-flex flex-wrap justify-content-between align-items-center date-wrap mt-3">
                                    <button className="add-btn" onClick={ addNewTeamFunc }>
                                        + Add Teams
                                    </button>
                                    <div className="d-flex align-items-center pointer position-relative">
                                        <ReactSVG src={ Upload } className="uploadIcon" />
                                        <input id="profileImage" name="csvfile" className="csv-upload" type="file" onChange={ handleChange }/>
                                        <span className="upload">
                                            Upload .xlsx
                                        </span>
                                    </div>
                                </div>
                            )}
                            <div className="align-items-center mt-5 mb-3">
                                <label className="internet-check w-100">Mark Event as Free</label>
                                <Radio.Group  onChange={ handleChange } defaultValue='No' name="is_free">
                                    <div className="d-flex mt-3">
                                        <div className="radio-options d-flex justify-content-start">
                                            <Radio
                                                className="radio-btn"
                                                value="Yes"
                                                name="is_free"
                                                id="Yes-option2"
                                            />
                                            <label
                                                className="form-check-label radio-label pointer"
                                                htmlFor="Yes-option2"
                                            >
                                                Yes
                                            </label>
                                        </div>
                                        <div className="radio-options d-flex justify-content-start">
                                            <Radio
                                                className="radio-btn"
                                                value="No"
                                                name="is_free"
                                                defaultChecked
                                                id="No-option2"
                                            />
                                            <label
                                                className="form-check-label radio-label pointer"
                                                htmlFor="No-option2"
                                            >
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </Radio.Group>
                                {is_free && (
                                    <ErrorMessage message={ is_free || '' } />
                                )}
                            </div>
                            <div className="align-items-center mt-4 mb-3" >
                                <label className="internet-check w-100">Upload an Advertisement</label>
                                <div className="d-flex mt-2 align-items-center position-relative">
                                    <ReactSVG src={ Upload } className={ input.event_code?.length > 5 ? "uploadIcon pointer" :  "adUploadIcon" } />
                                    <div className='d-flex'>
                                        {input.event_code?.length > 5 ?
                                            <>
                                                <input id="AdUploadImage" name="csvfile" className="csv-upload" type="file" accept=".jpg, .jpeg, .png" onChange={ handleFileChange }/>
                                                <span className="upload pointer">
                                                    {selectedFile == null ? "Upload Image" : selectedFile?.name }
                                                </span>
                                            </>
                                            :
                                            <>
                                                <span className={ input.event_code?.length > 5 ? "upload pointer" : "uploadAdvertisement" }>
                                                    {selectedFile == null ? "Upload Image" : selectedFile?.name }
                                                </span>
                                            </>}
                                    </div>
                                    { selectedFile && (
                                        <span className="cross-icon" onClick={ handleRemoveFile }>
                                            &#10005;
                                        </span>
                                    ) }
                                </div>
                            </div>
                        </div>
                        <div className="col-4"></div>
                    </div>
                </div>}
            </div>
            {isModalVisible && (
                <AddTeamEvent
                    isModalVisible={ isModalVisible }
                    handleSubmit={ handleAddTeamFunc }
                    handleClose={ handleClose }
                    TeamChangehandler = { TeamChangehandler }
                    deleteTeamHandler = { deleteTeamHandler }
                    handleSearch = { handleSearch }
                    addTeam = { addTeam }
                />
            )}
        </div>
    );
}
AddNewEvent.propTypes = {
    createEventFunc: PropTypes.func,
    history: PropTypes.object,
    handleCloseDynamicModal: PropTypes.func,
    closeDynamicAndOpenDetailModal: PropTypes.func
};

export default AddNewEvent;
