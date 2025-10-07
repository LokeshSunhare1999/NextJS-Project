import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import ModelViewLayoutContainer from 'shared/ModelViewLayoutContainer'
import { Radio } from 'antd';
import { getDynamicPriceAction, updateDynamicPricingAction  } from 'actions/eventActions';
import Loader from 'shared/Loader';
import { useSelector } from 'react-redux';

function DynamicPricingModal(props) {
    const dispatch = useDispatch()
    const isLoading = useSelector((state) => state.modalIsLoading);
    const { isModalVisible, handleClose, eventId, closeDynamicAndOpenDetailModal } = props
    const [ dynamicPriceData, setDynamicPriceData ] = useState([])
    const [ isEdit, setIsEdit ] = useState(true)
    const [ validationErrors, setValidationErrors ] = useState({});
    const [ priceValidationErrors, setPriceValidationErrors ] = useState({});
    useEffect(() => {
        dispatch(getDynamicPriceAction (eventId)).then((res) => {
            if (res && res.statusCode === 200) {
                const trimmedPriceData = res.data.event_dynamic_price.map((item) => ({
                    event_package_id: item.event_package_id,
                    routine_name: item.routine_name.trim(),
                    price: item.price.trim(),
                    is_personalised: item.is_personalised,
                    package_label: item.package_label,
                }));
                setDynamicPriceData(trimmedPriceData);
            }
        });
    }, [ dispatch, eventId ])

    const handleChange = (index) => e => {
        const newArr = [ ...dynamicPriceData ];
        newArr[ index ][ e.target.name ] = e.target.value;
        setDynamicPriceData(newArr)
    };
    const handleRoutineNameChange = (index) => (e) => {
        const trimmedValue = e.target.value.trim();
        const newArr = [ ...dynamicPriceData ];
        newArr[ index ].routine_name = e.target.value;
        setDynamicPriceData(newArr);
        if (trimmedValue === '') {
            setValidationErrors({
                ...validationErrors,
                [ index ]: 'Product name cannot be empty',
            });
        }
        // else if (e.target.value.startsWith(' ')) {
        //     setValidationErrors({
        //         ...validationErrors,
        //         [ index ]: 'Product name cannot start with a space',
        //     });
        // }
        else {
            setValidationErrors({
                ...validationErrors,
                [ index ]: undefined,
            });
        }
    };
    const handlePriceChange = (index) => (e) => {
        const trimmedValue = e.target.value.trim();
        const newArr = [ ...dynamicPriceData ];
        newArr[ index ].price = e.target.value;
        const priceRegex = /^\$.*\d/;
        setDynamicPriceData(newArr);
        if (trimmedValue === '') {
            setPriceValidationErrors({
                ...priceValidationErrors,
                [ index ]: 'Price cannot be empty',
            });
        } else if (!priceRegex.test(trimmedValue)) {
            setPriceValidationErrors({
                ...priceValidationErrors,
                [ index ]: 'Pricing must contain number after "$" sign',
            });
        }
        else {
            setPriceValidationErrors({
                ...priceValidationErrors,
                [ index ]: undefined,
            });
        }
    };

    console.log('dynamicPriceData :>> ', dynamicPriceData);
    const handleSubmit = () => {
        const hasValidationErrors = Object.values(validationErrors).some((error) => error !== undefined);
        const hasPriceValidationErrors = Object.values(priceValidationErrors).some((error) => error !== undefined);
        if (!hasValidationErrors && !hasPriceValidationErrors) {
            const finalDynamicPriceData = dynamicPriceData.map((item) => ({
                ...item,
                routine_name: item.routine_name.trim(),
                price: item.price.trim()
            }));
            setIsEdit(true)
            const data = {
                price_details: finalDynamicPriceData
            }
            dispatch(updateDynamicPricingAction(data))
            handleClose()
        }
    }
    return (
        <ModelViewLayoutContainer
            handleClose={ handleClose }
            isModalVisible={ isModalVisible }
            handleSubmit={ handleSubmit }
            title="Event Dynamic Pricing"
            buttonUpload= { true }
            backButton= { false }
            className="add-event-modal"
            id='dynamic-pricing-modal'
            closePricingModalOpenDetailModal={ closeDynamicAndOpenDetailModal }
            isEdit = { isEdit }
            setIsEdit = { setIsEdit }
        >
            <div className="modal-wrapper">
                <div className="row g-0">
                    <div className="col-2">
                        <label className="ps-2">Products</label>
                    </div>
                    <div className="col-4">
                        <label className="">Descriptions</label>
                    </div>
                    <div className="col-2">
                        <label>Personalised</label>
                    </div>
                    <div className="col-4">
                        <label className="ms-4">Pricing</label>
                    </div>
                </div>
                {isLoading && <div className="d-flex justify-content-center align-items-center" style={ { height: '150px' } }><Loader  /></div> }
                { !isLoading &&
                    <>
                        {
                            dynamicPriceData.map((item, index) => (
                                <div className="pricing-body px-2" key={ item.id }>
                                    <div className="row g-0 py-2 d-flex align-items-center">
                                        <div className="col-2">
                                            <label className="m-0 pe-2 prod-name" >{ item.package_label }</label>
                                        </div>
                                        <div className="col-4">
                                            { isEdit && <label className="m-0 pe-2 prod-name" >{ item.routine_name }</label>}
                                            {!isEdit && <input
                                                type="text"
                                                // placeholder="Enter routine name"
                                                className="description m-0 pe-2"
                                                name="routine_name"
                                                value={ item.routine_name }
                                                onChange={ handleRoutineNameChange(index) }
                                            />}
                                            {validationErrors[ index ] && (
                                                <small className="text-danger">{validationErrors[ index ]}</small>
                                            )}
                                        </div>
                                        <div className="col-2">
                                            <Radio.Group name ='is_personalised' disabled={ isEdit } value={ item.is_personalised } onChange={ handleChange(index) } >
                                                <div className="d-flex flex-column">
                                                    <div className="radio-options">
                                                        <Radio
                                                            className="radio-btn"
                                                            value={ 1 }
                                                            id="Yes"
                                                        />
                                                        <label
                                                            className="form-check-label radio-label m-0 pointer"
                                                            htmlFor="Yes"
                                                        >
                                                            Yes
                                                        </label>
                                                    </div>
                                                    <div className="radio-options">
                                                        <Radio
                                                            className="radio-btn"
                                                            value={ 0 }
                                                            id="No"
                                                        />
                                                        <label
                                                            className="form-check-label radio-label m-0 pointer"
                                                            htmlFor="No"
                                                        >
                                                            No
                                                        </label>
                                                    </div>
                                                </div>
                                            </Radio.Group>
                                        </div>
                                        <div className="col-4 d-grid">
                                            <div className="d-flex event-dropdown float-end">
                                                <input
                                                    type="text"
                                                    placeholder="Enter amount"
                                                    className="input-field"
                                                    name="price"
                                                    disabled={ isEdit }
                                                    defaultValue={ item.price.trim() }
                                                    onChange={ handlePriceChange(index) }
                                                />
                                                <span className="position-relative">
                                                    <select
                                                        className="form-control header_drop_down pointer price-dropdown-arrow"
                                                        name="isToday"
                                                        disabled={ isEdit }
                                                    >
                                                        <option name="currency" defaultValue="currency">
                                                            USD
                                                        </option>
                                                    </select>
                                                </span>
                                            </div>
                                            {priceValidationErrors[ index ] && (
                                                <small className="text-danger">{priceValidationErrors[ index ]}</small>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </>
                }
            </div>
        </ModelViewLayoutContainer>
    )
}
DynamicPricingModal.propTypes = {
    isModalVisible: PropTypes.bool,
    handleClose: PropTypes.func,
    id: PropTypes.string,
    eventId: PropTypes.string,
    closeDynamicAndOpenDetailModal: PropTypes.func
};

export default DynamicPricingModal
