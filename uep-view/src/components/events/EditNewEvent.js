/* eslint-disable no-debugger */
/* eslint-disable quotes */
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
import PropTypes from 'prop-types';
import AddTeamEvent from './AddTeamEvent';
import { DatePicker } from 'antd';
import Upload from 'static/images/svg/upload.svg';
import { saveTeamDetails, updateEventDetails, uploadCsvTeamEvent, viewEventDetailsAction, updateTeamDetailsAction, removeCheerEventTeam } from 'actions/eventActions';
import { ReactSVG } from 'react-svg';
import { singleDateFormat } from 'utils/Helper';
import { getProducerListing } from 'actions/producerActions';
import { Radio } from 'antd';
import Loader from 'shared/Loader';
import moment from 'moment';
import ErrorMessage from 'shared/ErrorMessage';
import search from 'static/images/svg/search.svg';
import { SearchTableData } from 'utils/Helper';
import deleteicon from 'static/images/delete.png';
import DeleteEventModal from 'shared/DeleteEventModal';
import { triggerNotifier } from 'shared/notifier';
import { applicationIsLoading } from '../../actions/commonActions';
import { useMemo } from 'react';
function EditNewEvent(props) {
    const dispatch = useDispatch();
    const defaultField = [
        {
            team_number: '',
            team_name: ''
        }
    ];
    const { handleCloseEditEvent,  eventId, setCurrent, current } = props;
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [ isKiosk, setIsKiosk ] = useState(false);
    const [ input, setInput ] = useState({});
    const [ editEventInput, setEditEventInput ] = useState({});
    const [ startDate, setStartdate ] = useState();
    const [ endDate, setEndDate ] = useState();
    const producerList = useSelector((state) => state.producerList.producer_list);
    const teamDetails = useSelector((state) => state.teamDetails);
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const isLoadingNew = useSelector((state) => state.applicationIsLoading);
    const [ addTeam, setAddTeam ] = useState(defaultField)
    const [ inputError, setInputError ] = useState({});
    const [ teamData, setTeamData ] = useState([]);
    const [ searchValue, setSearchValue ] = useState('');
    const [ teamId, setTeamId ] = useState('');
    const [ isConfirmDelete, setIsConfirmDelete ] = useState(false);
    const [ producerId, setProducerId ] = useState()
    const [ selectedFile, setSelectedFile ] = useState(null);
    const [ existingImageName, setExistingImageName ] = useState("");
    const [ deleteUrl, setDeleteUrl ] = useState("");
    useEffect(() => {
        dispatch(viewEventDetailsAction(eventId)).then((res)=> {
            if (res && res.statusCode === 200 ){
                setEditEventInput(res.data.event_detail)
                setStartdate(res.data.event_detail.start_date)
                setEndDate(res.data.event_detail.end_date)
                setTeamData(res.data.event_detail.team_details)
                setProducerId(res.data.event_detail.producer_id);
            }
        })
        dispatch(getProducerListing());
    }, [ dispatch, eventId ]);
    useEffect(()=>{
        const imageURL = editEventInput?.event_ad_url;
        if(imageURL){
            setTimeout(() => {
                const url = new URL(imageURL);
                const pathname = url.pathname;
                const pathSegments = pathname.split('/');
                const encodedImageName = pathSegments[ pathSegments.length - 1 ];
                const imageName = decodeURIComponent(encodedImageName);
                const fileName = imageName.split('%2F').pop();
                const parts = fileName.split('/');
                const newFileName = parts[ parts.length - 1 ];
                setExistingImageName(newFileName)
            }, 100)
        }
    }, [ dispatch, editEventInput ])
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
    const prodList =
    producerList &&
    producerList.sort().map((data, index) => (
        <option name="event_producer" key={ index } value={ data.producer_id }>
            {data.event_producer}
        </option>
    ));
    const handleKioskMode = (event) => {
        editEventInput[ event.target.name ] = event.target.value;
        setIsKiosk(!isKiosk);
    };
    const addNewTeamFunc = () => {
        setIsModalVisible(true);
    };
    const handleClose = () => {
        setIsModalVisible(false);
        setAddTeam([
            {
                team_number: '',
                team_name: ''
            }
        ])
    };
    const handleStartDate = (date, dateString) => {
        setStartdate(dateString);
    };
    const handleEndDate = (date, dateString) => {
        setEndDate(dateString);
    };
    const confirmDeleteFunc = (data) => {
        setTeamId(data);
        setIsConfirmDelete(!isConfirmDelete);
    };
    const deleteEventFunc = () => {
        setIsConfirmDelete(!isConfirmDelete);
        dispatch(removeCheerEventTeam(teamId)).then((resp) => {
            if(resp.statusCode === 200) {
                dispatch(viewEventDetailsAction(eventId)).then((res)=> {
                    if (res && res.statusCode === 200 ){
                        setEditEventInput(res.data.event_detail)
                        setStartdate(res.data.event_detail.start_date)
                        setEndDate(res.data.event_detail.end_date)
                        setTeamData(res.data.event_detail.team_details)
                    }
                })
                dispatch(getProducerListing());
            }
        });
    };
    const handleChange = (event) => {
        const { name, value, type, files } = event.target;
        if(name === 'event_producer'){
            setProducerId(value)
        }
        if (type === 'file'){
            var data = new FormData();
            data.append('files', files[ 0 ]);
            dispatch(uploadCsvTeamEvent(data))
        }
        setEditEventInput((prevState) => ({
            ...prevState,
            [ name ]: value,
        }));
        setInput((prevState) => ({
            ...prevState,
            [ name ]: value,
        }));
        setInputError({})
    };
    const validate = () => {
        const errors = {};
        let isValid = true;
        if (editEventInput && editEventInput.event_code === '') {
            isValid = false;
            errors.error_event_code = 'Please enter event code';
        }
        if(editEventInput && editEventInput.event_code.length > 6 ) {
            isValid = false;
            errors.error_event_code = 'Event code must contain 6 characters only';
        } else if(editEventInput && editEventInput.event_code.length < 6) {
            isValid = false;
            errors.error_event_code = 'Event code must contain 6 characters only';
        }
        if (editEventInput && editEventInput.event_name === '') {
            isValid = false;
            errors.error_event_title = 'Please enter event title';
        }
        if(input.act_number && input.act_number.length !== undefined) {
            if(input.act_number.length > 4 || input.act_number.length < 4) {
                isValid = false;
                errors.error_act_number = 'Act no must contain 4 digits only';
            }
        }
        setInputError(errors);
        return isValid;
    };
    const updateEventFunc = (downloadURL) => {
        for(let i=0; i< teamDetails.length; i++) {
            teamDetails[ i ].team_name =  teamDetails[ i ].team_name.toString()
            teamDetails[ i ].team_number =  teamDetails[ i ].team_number.toString()
        }
        const {
            event_code,
            event_name,
            event_description,
            is_internet_available,
            is_onsite_sale_available,
            is_active,
            event_mode_id,
            act_number,
            // event_producer,
            // producer_id,
            id,
            is_free,
            event_ad_url,
        } = editEventInput;
        const data = {
            event_code: event_code,
            event_name: event_name,
            event_description: event_description === null ? '' : event_description,
            is_internet_available: is_internet_available ? 1 : 0,
            is_onsite_sale_available: is_onsite_sale_available,
            is_active: is_active,
            start_date: singleDateFormat(startDate),
            end_date: singleDateFormat(endDate),
            // producer_id: event_producer ? parseInt(producer_id) : producer_id,
            producer_id: producerId,
            event_mode_id: event_mode_id,
            act_number: Array.isArray(act_number)  ? "" : act_number ? act_number.toString() : "",
            team_details: addTeam && addTeam[ 0 ] && addTeam[ 0 ].team_name === '' ? teamDetails : addTeam,
            // event_ad_url: downloadURL ?  downloadURL : event_ad_url ? event_ad_url : "",
            // event_ad_url: deleteUrl !== "" ? "" : downloadURL ? downloadURL : event_ad_url ? event_ad_url : "",
            event_ad_url: downloadURL ? downloadURL : deleteUrl !== "" ? "" : event_ad_url ? event_ad_url : "",
            is_free: is_free === 1 ? "1" : "0",
        };
        if (validate()) {
            dispatch(updateEventDetails(data, id))
            setTimeout(()=>{
                setInput({})
                setCurrent(1)
                handleCloseEditEvent(current)
            },300)
        }
        if(event_mode_id === 2 && teamData.length > 0) {
            const apiData = {
                event_id: eventId,
                event_team_details: teamData
            }
            dispatch(updateTeamDetailsAction(apiData))
        }
    };
    const handleUpdate = (item) => e => {
        const newArr = [ ...teamData ];
        item[ e.target.name ] = e.target.value;
        setTeamData(newArr)
    };

    const updateSearch = (event) => {
        setSearchValue(event.target.value.substr(0,100))
    }

    const handleRemoveFile = async () => {
        if (editEventInput?.event_ad_url) {
            const storage = getStorage(app);
            const imageRef = ref(storage, editEventInput?.event_ad_url);
            try {
                await deleteObject(imageRef);
                setEditEventInput({ ...editEventInput, event_ad_url: null });
                // triggerNotifier({ type: 'success', message: 'Advertisement removed successfully' });
            } catch (error) {
                console.error('Error deleting image:', error);
                // triggerNotifier({ type: 'error', message: 'Advertisement removed successfully' });
            }
        }
        setSelectedFile(null);
        setExistingImageName("")
        // setEditEventInput({ ...editEventInput, event_ad_url: "" });
    };
    const handleUpload = async () => {
        if(selectedFile){
            dispatch(applicationIsLoading(true));
            setDeleteUrl("")
            const storage = getStorage(app);
            const staticImageName = editEventInput?.event_code + '-Ad';
            const fileName = `${ staticImageName }.${ selectedFile.name.split('.').pop() }`;
            // const fileName = selectedFile.name.replace('thumb_', '');
            const path = '/Event-Ad/' + editEventInput?.event_code;
            const existingImageURL = editEventInput?.event_ad_url;
            const metadata = { cacheControl: 'public, no-cache' };
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
                    dispatch(applicationIsLoading(true));
                    const date = new Date();
                    console.log(date);
                    const downloadURL = await getDownloadURL(storageRef);
                    setEditEventInput({ ...editEventInput, event_ad_url: downloadURL });
                    setTimeout(() => {
                        if(downloadURL){
                            updateEventFunc(downloadURL)
                        }
                    }, 100);
                }
            );
        }else if(deleteUrl){
            handleRemoveFile()
            setTimeout(() => {
                updateEventFunc()
            }, 100);
        }
        else{
            updateEventFunc()
        }
    };
    const handleFileChange = (event) => {
        const file = event.target.files[ 0 ];
        setSelectedFile(file);
        if (!file) {
            return;
        }
        const allowedImageFormats = [ '.jpg', '.jpeg', '.png' ];
        const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
        if (allowedImageFormats.includes(fileExtension)) {
            // const path = '/Event-Ad/' + editEventInput?.event_code;
            // handleUpload(file, path, editEventInput?.event_ad_url);
        } else {
            triggerNotifier({ type: 'error', message: 'Please upload a valid image file.' })
            setSelectedFile(null);
        }
    };
    const handleSetUrl = () =>{
        const storage = getStorage(app);
        const imageRef = ref(storage, editEventInput?.event_ad_url);
        setDeleteUrl(imageRef)
        setSelectedFile(null);
        setExistingImageName("")
        // setEditEventInput({ ...editEventInput, event_ad_url: "" });
        const inputFile = document.getElementById('AdUploadImage');
        if (inputFile) {
            inputFile.value = '';
        }
    }
    const dateFormat = 'MM/DD/YYYY';
    const { event_code, event_description , event_name, is_internet_available, event_mode_id, is_active, is_onsite_sale_available, event_producer, producer_id, team_details, is_free } = editEventInput
    const { error_event_title, error_event_code } = inputError
    // const tableData = SearchTableData(team_details, searchValue)
    const tableData = useMemo(() => SearchTableData(team_details, searchValue), [ team_details, searchValue ]);

    return (
        <div>
            <div className="create-event edit-event-page">
                <div className="event-header d-flex flex-wrap justify-content-between align-items-center">
                    <div className="heading">Edit Event</div>
                    <div className="d-flex">
                        <div className="">
                            <Button
                                className="btn btn-primary btn-lg cancel_btn"
                                handleSubmit={ () => handleCloseEditEvent() }
                                buttonName="Cancel"
                            />
                        </div>
                        <div className="">
                            <Button
                                className="btn btn-primary btn-lg save_btn"
                                // handleSubmit={ () => updateEventFunc() }
                                handleSubmit={ () => handleUpload() }
                                buttonName="Update"
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
                                        type="search"
                                        name="event_code"
                                        defaultValue={ event_code }
                                        placeholder="Event Code"
                                        className="input-field"
                                        onChange={ handleChange }
                                    />
                                </div>
                                {error_event_code && (
                                    <ErrorMessage message={ error_event_code || '' } />
                                )}
                            </div>
                            <div className="mb-3 d-flex flex-column">
                                <label className="new-event-label mb-1">Event Title*</label>
                                <div className="new-event-field">
                                    <input
                                        type="text"
                                        name="event_name"
                                        defaultValue={ event_name }
                                        placeholder="Event Title"
                                        className="input-field"
                                        onChange={ handleChange }
                                    />
                                </div>
                                {error_event_title && (
                                    <ErrorMessage message={ error_event_title || '' } />
                                )}
                            </div>
                            <div className="mb-3 d-flex flex-column">
                                <label className="new-event-label mb-1">Comments</label>
                                <div className="new-event-comment">
                                    <textarea
                                        name="event_description"
                                        defaultValue={ event_description }
                                        placeholder="Enter Event Comments"
                                        className="input-field"
                                        onChange={ handleChange }
                                    />
                                </div>
                            </div>
                            <div className="d-flex align-items-center mt-3 mb-4">
                                <label className="internet-check">Internet Connection?*</label>
                                <Radio.Group onChange={ handleChange } name= 'is_internet_available' value={ is_internet_available } >
                                    <div className="d-flex">
                                        <div className="radio-options">
                                            <Radio
                                                className="radio-btn"
                                                value={ 1 }
                                                id="Yes-internet-option"
                                            />
                                            <label
                                                className="form-check-label radio-label pointer"
                                                htmlFor="Yes-internet-option"
                                            >
                                                Yes
                                            </label>
                                        </div>
                                        <div className="radio-options">
                                            <Radio
                                                className="radio-btn"
                                                value={ 0 }
                                                id="No-internet-option"
                                            />
                                            <label
                                                className="form-check-label radio-label pointer"
                                                htmlFor="No-internet-option"
                                            >
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </Radio.Group>
                            </div>
                            <div className="d-flex align-items-center mt-3 mb-4">
                                <label className="internet-check">OnSite Sales Available?*</label>
                                <Radio.Group onChange={ handleChange } name= 'is_onsite_sale_available' value={ is_onsite_sale_available } >
                                    <div className="d-flex">
                                        <div className="radio-options">
                                            <Radio
                                                className="radio-btn"
                                                value={ 1 }
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
                                                value={ 0 }
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
                            <div className="d-flex align-items-center mt-3 mb-4">
                                <label className="internet-check">Event Status*</label>
                                <Radio.Group onChange={ handleChange } name='is_active' value ={ is_active } >
                                    <div className="d-flex">
                                        <div className="radio-options d-flex">
                                            <Radio
                                                className="radio-btn"
                                                value={ 1 }
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
                                                value={ 0 }
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
                        </div>
                        <div className="col-4 text-start">
                            <div className="mb-3 d-flex flex-column">
                                <label className="new-event-label mb-1">Select Date*</label>
                                <div className="d-flex flex-wrap justify-content-between date-wrap">
                                    <DatePicker
                                        className="input-search"
                                        placeholder="Start Date"
                                        onChange={ handleStartDate }
                                        value={ moment(startDate) }
                                        format={ dateFormat }
                                    />
                                    <DatePicker
                                        className="input-search"
                                        placeholder="End Date"
                                        onChange={ handleEndDate }
                                        value={ moment(endDate) }
                                        format={ dateFormat }
                                    />
                                </div>
                            </div>
                            <div className="mb-3 d-flex flex-column position-relative">
                                <label className="new-event-label mb-1 w-100">Event Producer*</label>
                                <span className="">
                                    <select
                                        className="form-control producer pointer prducer-select-arrow"
                                        name="event_producer"
                                        onChange={ handleChange }
                                    >
                                        <option defaultValue ={ event_producer ? producer_id : 'select' } >{event_producer}</option>
                                        {prodList}
                                    </select>
                                </span>
                            </div>
                            <div className="d-flex align-items-center mt-4 mt-3 mb-3" onChange={ handleKioskMode }>
                                <label className="internet-check">Select Kiosk Mode*</label>
                                <Radio.Group  onChange={ handleChange } value={ event_mode_id }  name="event_mode_id">
                                    <div className="d-flex">
                                        <div className="radio-options d-flex justify-content-center">
                                            <Radio
                                                className="radio-btn"
                                                value={ 1 }
                                                name="event_mode_id"
                                                onChange={ handleChange }
                                                id="Dance"
                                                disabled={ event_mode_id === 2 }
                                            />
                                            <label
                                                className="form-check-label radio-label pointer"
                                                htmlFor="Dance"
                                            >
                                                Dance
                                            </label>
                                        </div>
                                        <div className="radio-options d-flex justify-content-center">
                                            <Radio
                                                className="radio-btn"
                                                value={ 2 }
                                                name="event_mode_id"
                                                onChange={ handleChange }
                                                defaultChecked
                                                id="Cheer"
                                                disabled={ event_mode_id === 1 }
                                            />
                                            <label
                                                className="form-check-label radio-label pointer"
                                                htmlFor="Cheer"
                                            >
                                                Cheer
                                            </label>
                                        </div>
                                    </div>
                                </Radio.Group>
                            </div>
                            {event_mode_id === 2 && (
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
                                <Radio.Group  onChange={ handleChange } value={ is_free } name="is_free">
                                    <div className="d-flex mt-3">
                                        <div className="radio-options d-flex justify-content-start">
                                            <Radio
                                                className="radio-btn"
                                                value={ 1 }
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
                                                value={ 0 }
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
                            </div>
                            <div className="align-items-center mt-4 mb-3" >
                                <label className="internet-check w-100">Upload an Advertisement</label>
                                <div className="d-flex mt-2 align-items-center position-relative">
                                    <ReactSVG src={ Upload } className="uploadIcon pointer" />
                                    <div className='d-flex align-items-center'>
                                        {event_code?.length > 5 ?
                                            <>
                                                <input id="AdUploadImage" name="csvfile" className="csv-upload" type="file" accept=".jpg, .jpeg, .png" onChange={ handleFileChange } />
                                                <span className="upload">
                                                    { selectedFile === null || selectedFile === undefined ? "Upload Image" : selectedFile?.name }
                                                </span>
                                                { (selectedFile !== null && existingImageName === "" && selectedFile === undefined) || selectedFile ? (
                                                    <span className="cross-icon ccc" onClick={ handleSetUrl }>
                                                        &#10005;
                                                    </span>
                                                ) : null }
                                            </>
                                            :
                                            <>
                                                <span className={ input.event_code?.length > 5 ? "upload pointer" : "uploadAdvertisement" }>
                                                    {selectedFile === null ? "Upload Image" : selectedFile?.name}
                                                </span>
                                            </>
                                        }
                                    </div>
                                </div>
                                <div className='d-flex align-items-center'>
                                    <span className="uploadImg">
                                        {selectedFile === null ? (existingImageName === "" ? "" : existingImageName) : ""}
                                    </span>
                                    { selectedFile === null && existingImageName !== "" && (
                                        <span className="cross-icon abc" onClick={ handleSetUrl }>
                                            &#10005;
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* modal start */}
                        {event_mode_id === 2 &&
                            <div className="col-4 text-start" >
                                <div className="search-box">
                                    <input
                                        className="search"
                                        type="search"
                                        name="eventSearchParam"
                                        placeholder="Team No., Team Name"
                                        aria-label="Search"
                                        value = { searchValue || '' }
                                        onChange= { updateSearch }
                                    />
                                    <ReactSVG src={ search } alt="search" className="search-icon" />
                                </div>
                                <div className='add-event-team-modal' id='dynamic-pricing-modal'>
                                    <div className="team-modal-wrapper">
                                        <div className="row g-0">
                                            <div className="col-4">
                                                <label className="ps-3">Team No.</label>
                                            </div>
                                            <div className="col-4">
                                                <label>Team Name</label>
                                            </div>
                                        </div>
                                        {tableData && tableData.length !== 0 ?
                                            <>
                                                {
                                                    tableData && tableData.map((item, index) => (
                                                        <div className="team-name px-2" key={ item.event_folder_id }>
                                                            <div className="row g-0 py-2 d-flex align-items-center">
                                                                <div className="col-4">
                                                                    <div className="d-flex number-filed float-start">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Enter Team Number"
                                                                            className="number-input"
                                                                            name="team_number"
                                                                            defaultValue={ item.team_number }
                                                                            onChange={ handleUpdate(item) }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-7">
                                                                    <div className="d-flex name-filed float-start w-100">
                                                                        <input
                                                                            type="text"
                                                                            placeholder="Enter Team Name"
                                                                            className="name-input m-0"
                                                                            name="team_name"
                                                                            defaultValue={ item.team_name }
                                                                            onChange={ handleUpdate(item) }
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="col-1">
                                                                    <img
                                                                        src={ deleteicon }
                                                                        alt="deleteicon"
                                                                        onClick={ () => confirmDeleteFunc(item.event_folder_id) }
                                                                        width="15"
                                                                        className="mx-2 icon-margin pointer"
                                                                    />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))
                                                }
                                            </>
                                            :
                                            <div className='ant-empty ant-empty-normal'>
                                                <span className="ant-empty-description">No Data</span>
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        }
                        {/* modal end */}
                    </div>
                </div>}
            </div>
            {isConfirmDelete && (
                <DeleteEventModal
                    isModalVisible={ isConfirmDelete }
                    handleClose={ confirmDeleteFunc }
                    handleSubmit={ deleteEventFunc }
                />
            )}
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
    )
}
EditNewEvent.propTypes = {
    handleCloseEditEvent: PropTypes.object,
    eventId: PropTypes.string,
    eventDate: PropTypes.object,
    handleCloseDynamicModal: PropTypes.func,
    closeDynamicAndOpenDetailModal: PropTypes.func
};
export default EditNewEvent
