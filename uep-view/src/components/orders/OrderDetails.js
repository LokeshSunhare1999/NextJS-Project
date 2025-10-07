/* eslint-disable no-multiple-empty-lines */
/* eslint-disable no-trailing-spaces */
/* eslint-disable react/jsx-key */
/* eslint-disable react/jsx-indent */
/* eslint-disable indent */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
import React, { useState } from 'react'
import Button from 'shared/Button';
import PropTypes from 'prop-types';
import { ReactSVG } from 'react-svg';
import back from 'static/images/svg/back.svg';
import '../../static/style/orders.scss';
import { Radio } from 'antd';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getOrderDetailsAction, getOrderFolderByOrderNumberAction, removeAllOrderFileAction, sendPurchasedFilesToUserAction, updateOrderDetailsAction, updatePackageStatusAction, sendInvoiceToAdminAction, sendEmailToAdminAction, getUserOrderedFoldersAction  } from 'actions/orderActions';
import { dateMonthYearFormat } from 'utils/Helper';
import Loader from 'shared/Loader';
import folder from 'static/images/svg/folder.svg';
import DetailEventList from 'components/files/DetailEventList';
import SendFilesModal from 'shared/SendFilesModal';
import EventFolderList from 'components/files/EventFolderList';

function OrderDetails(props) {
    const { handleClose, cancelOderDetailsHandler, orderId, orderStatus, fileScroll } = props;
    const dispatch = useDispatch()
    const [ comments, setComments ] = useState('')
    useEffect(() => {
        const fetchData = async () => {
          try {
            await dispatch(getOrderFolderByOrderNumberAction(orderId));
            
            const res = await dispatch(getOrderDetailsAction(orderId));

            if (res?.data?.order_details?.comments) {
              setComments(res.data.order_details.comments);
            }
            // setEditOrderInput({ order_number: orderId });
          } catch (error) {
            console.error("Error loading order data:", error);
          }
        };
        
        fetchData();
      }, [ dispatch, orderId ]);
    const [ isFileListPage, setIsFileListPage ] = useState(false)
    const [ isFolderListPage, setIsFolderListPage ] = useState(false)
    const [ isOrderDetailsPage, setIsOrderDetailsPage ] = useState(true)
    const [ isConfirmDeleteAll, setIsConfirmDeleteAll ] = useState(false)
    const [ isConfirm, setIsConfirm ] = useState(false);
    const [ folderName, setFolderName ] = useState()
    const [ teamNumber, setTeamNumber ] = useState()
    const [ orderNumber, setOrderNumber ] = useState('')
    const orderDetails = useSelector((state) => state?.orderDetails)
    const isLoading = useSelector((state) => state.applicationIsLoading);
    const isSendFiles = useSelector((state) => state.sendFilesIsLoading);
    const orderFolderDetails = useSelector((state) => state.orderFolderDetails);
    const [ editOrderInput, setEditOrderInput ] = useState({ order_number: orderId });
    const [ orderFolderName, setOrderFolderName ] = useState([ '' ])
    const [ orderTeamNumber, setOrderTeamNumber ] = useState('')
    // const [ shouldRenderPackages, setShouldRenderPackages ] = useState(false);
    if(orderDetails.order_details) {
        var { order_number, full_name, email_id, state_name, city_name, phone_number, price, user_id, event_id } = orderDetails.order_details;
    }
    console.log("orderDetails",orderDetails);
    const packageArray = orderDetails?.event_packages;
    console.log("packageArray",packageArray);
    const filesArray = orderDetails.event_packages;
    const ordered_folder_number = orderFolderDetails && orderFolderDetails.ordered_folder;
    console.log(filesArray);
    const handleChange = (event) => {
        const { name, value } = event.target;
        setEditOrderInput((prevState) => ({
            ...prevState,
            [ name ]: value,
        }));
    };
    const packageStatusHandler = (event, eventData) => {
        const { value } = event.target;
        const data = {
            event_package_id: eventData.event_package_id,
            event_package_status: parseInt(value),
            is_automated_order_req: false,
        }
        dispatch(updatePackageStatusAction(data)).then((res) => {
            if(res.statusCode === 200){
                dispatch(getOrderDetailsAction(ordered_folder_number))
                setEditOrderInput({ order_number: orderId })
            }
        })
    }
    const updateOrder = () => {
        dispatch(updateOrderDetailsAction(editOrderInput))
        handleClose()
    }
    const fileListPageHandler = (data) => {
        setIsFolderListPage(!isFolderListPage)
        setIsOrderDetailsPage(!isOrderDetailsPage)
        setOrderNumber(data.ordered_folder)
    }
    const orderDetailsFunc = () => {
        setIsFolderListPage(!isFolderListPage)
        setIsOrderDetailsPage(!isOrderDetailsPage)
        dispatch(getOrderDetailsAction(orderId))
        dispatch(getOrderFolderByOrderNumberAction(orderId))
    }
    const folderListFunc = () => {
        setIsFolderListPage(!isFolderListPage)
        setIsFileListPage(!isFileListPage)
        dispatch(getUserOrderedFoldersAction(ordered_folder_number));
    }
    const orderDetailsFromFileListFunc = () => {
        setIsFileListPage(!isFileListPage)
        setIsOrderDetailsPage(!isOrderDetailsPage)
        dispatch(getOrderDetailsAction(orderId))
        dispatch(getOrderFolderByOrderNumberAction(orderId))
    }
    const handleDetailEventLising = (data) => {
        console.log(data, 'data')
        setIsFileListPage(!isFileListPage)
        setIsFolderListPage(!isFolderListPage)
        // setIsDetailEventListPage(!isDetailEventListPage)
        // setFolderId(data.id)
        console.log('data?.team_number', data?.team_number);
        // setFolderName(data?.team_number === undefined ? data.folder_name : data.team_number);
        setFolderName(data.folder_name);
        setTeamNumber(data?.team_number)
        if(data.orderTeamNumber) {
            setOrderTeamNumber(data.orderTeamNumber);
        }
        // dispatch(fetchEventFoldersList([]))
    }
    console.log('folderName ==>', folderName);
    console.log('teamNumber ==>', teamNumber);
    const sendPurchasedFilesToUserHandler = (orderNum, userId) => {
        console.log(isSendFiles)
        const data = {
            user_id: userId,
            order_number: orderNum
        }
        setIsConfirm(!isConfirm);
        dispatch(sendPurchasedFilesToUserAction(data));
    }
    const confirmSendFilesFunc = () => {
        setIsConfirm(!isConfirm);
    };
    const confirmDeletAllFunc = (folder_name) => {
        setOrderFolderName([ folder_name ])
        setIsConfirmDeleteAll(!isConfirmDeleteAll)
    }
    const deleteAllFilesHandler = () => {
        const sendIdOrderData = {
            order_number: ordered_folder_number,
            folder_name: orderFolderName
        };
        dispatch(removeAllOrderFileAction(sendIdOrderData, ordered_folder_number))
        setIsConfirmDeleteAll(false)
    }
    const folderToOrderDetailsFunc = () => {
        setIsFolderListPage(!isFolderListPage)
        setIsOrderDetailsPage(!isOrderDetailsPage)
    }
    const fileToOrderDetailsFunc = () => {
        setIsFileListPage(!isFileListPage)
        setIsOrderDetailsPage(!isOrderDetailsPage)
    }
    const fileToFolderFunc = () => {
        setIsFileListPage(!isFileListPage)
        setIsFolderListPage(!isFolderListPage)
    }
    const sendInvoice = (orderNumber1, is_print) => {
        if(is_print === 0) {
            const data = {
                order_number: orderNumber1,
                is_print : is_print
            }
            dispatch(sendEmailToAdminAction(data));
        }
        else {
            const data = {
                order_number: orderNumber1,
                is_print : is_print
            }
            dispatch(sendInvoiceToAdminAction(data)).then((res)=> {
                if (res && res.statusCode === 200 ){
                    const invoice = res.data && res.data.uploadedFileUrl
                    window.open(invoice, '_blank');
                }
            })
        }

    }
    
    // useEffect(() => {
    //   const timeoutId = setTimeout(() => {
    //     setShouldRenderPackages(true);
    //   }, 1500);
    //   return () => clearTimeout(timeoutId);
    // }, [ ]);
    return (
        <>
            {isOrderDetailsPage && (
                <div className="event-header pb-0 d-flex justify-content-between box-shadow-none">
                    <div className="heading">Orders</div>
                    <Button className="back-btn d-flex align-items-center"  buttonName='Back'  handleSubmit = { handleClose }  imageParam= { <ReactSVG src={ back } className="move-back" /> } />
                </div>)
            }
            { isLoading && isOrderDetailsPage && <div className="mt-5" ><Loader /></div> }
            { !isLoading && isOrderDetailsPage && <div className="mt-3 px-3 profile-sub-section order-details">
                <fieldset className='order-details'></fieldset>
                <div className="row gx-0 mx-0 ">
                    <div className="col-5 col-xxl-5 col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12">
                        <div className="d-flex py-2 text-start">
                            <label className="lbl txt-font">Order ID:&nbsp;</label>
                            <span className="value txt-font"> { order_number }</span>
                        </div>
                        <div className="d-flex py-2 text-start">
                            <label className="lbl txt-font">Customer Name:&nbsp;</label>
                            <span className="value txt-font">{ full_name }</span>
                        </div>
                        <div className="d-flex py-2 text-start">
                            <label className="lbl txt-font">Customer Email:&nbsp;</label>
                            <span className="value txt-font">{ email_id }</span>
                        </div>
                        <div className="d-flex py-2 text-start">
                            <label className="lbl txt-font">Customer Location:&nbsp;</label>
                            <span className="value txt-font">{ city_name },&nbsp;{ state_name }</span>
                        </div>
                        <div className="d-flex py-2 text-start">
                            <label className="lbl txt-font">Customer Telephone:&nbsp;</label>
                            <span className="value txt-font">{ phone_number && phone_number.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') }</span>
                        </div>
                        <div className="d-flex py-2 text-start">
                            <label className="lbl txt-font">Order Status:&nbsp;&nbsp;&nbsp;</label>
                            <Radio.Group
                                onChange={ handleChange }
                                name='order_status'
                                value={ (orderDetails && orderDetails.order_details && orderDetails.order_details.order_status) !== undefined ? orderDetails.order_details.order_status : orderStatus === 1 ? 1 : 2 }
                            >
                                <div className="d-flex">
                                    <div className="radio-options">
                                        <Radio
                                            className="radio-btn"
                                            value={ 1 }
                                            id="Pending"
                                            disabled={ orderStatus !== 1  || orderDetails?.order_details?.order_status !== 1 }
                                        />
                                        <label
                                            className="form-check-label radio-label pointer"
                                            htmlFor="Pending"
                                        >
                                            Pending
                                        </label>
                                    </div>
                                    <div className="radio-options">
                                        <Radio
                                            className="radio-btn"
                                            value={ 2 }
                                            id="Completed"
                                            disabled={ orderStatus !== 2 || orderDetails?.order_details?.order_status !== 2 }
                                        />
                                        <label
                                            className="form-check-label radio-label pointer"
                                            htmlFor="Completed"
                                        >
                                            Completed
                                        </label>
                                    </div>
                                </div>
                            </Radio.Group>
                        </div>
                        <div className="d-flex py-2 text-start">
                            <label className="lbl txt-font">Order Total:&nbsp;</label>
                            <span className="color-value">${ price }</span>
                        </div>
                        <div className="d-flex py-2 text-start">
                            <label className="lbl txt-font">Comments:&nbsp;</label>
                            <textarea rows="3" placeholder="Enter comments" className="text-area box-shadow-none" name='comments' onChange={ handleChange } defaultValue={ comments } ></textarea>
                        </div>
                        <div className="details-order-file-section d-flex py-2 text-start">
                            <button className="cancel-btn page-btn me-3 btn-box" onClick = { handleClose } >Cancel</button>
                            <button className={ editOrderInput?.comments == undefined ? "page-btn update-btn-disabled me-3" : "page-btn update-btn me-3" } disabled={ editOrderInput?.comments == undefined } onClick={ () => updateOrder() } >Update</button>
                        </div>
                    </div>
                    <div className="col-5 col-xxl-5 col-xl-5 col-lg-5 col-md-12 col-sm-12 col-xs-12">
                        <div className="d-flex py-2 text-start">
                            <label className="lbl txt-font">Order Date:&nbsp;</label>
                            <span className="value txt-font">{ orderDetails && orderDetails.order_details && orderDetails.order_details.purchase_datetime && (orderDetails.order_details.purchase_datetime) }</span>
                        </div>
                        <div className="details-order-file-section text-start">
                            <div className="d-flex align-items-center mb-2">
                                <label className="order-file-lbl">Order Files</label>
                            </div>

                            <div>
                                {
                                    orderFolderDetails && orderFolderDetails.ordered_folder !== undefined ? (
                                        <div className="d-flex flex-wrap">
                                            <div className="card pointer" onClick={ () => fileListPageHandler(orderFolderDetails) }>
                                                <div className="card-header d-flex align-items-center" >
                                                    <div className="img-wrapper">
                                                        <img src={ folder } alt="folder-img" width="20" className="me-2" />
                                                    </div>
                                                    <div className="card-heading">{ orderFolderDetails && orderFolderDetails.ordered_folder }</div>
                                                </div>
                                                <div className="card-body">
                                                    <p className="card-text">
                                                        <br />
                                                        {/* { orderFolderDetails && orderFolderDetails.no_of_files } files */}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : ''
                                }
                                <div className=" d-flex py-2 text-start">
                                    {
                                        orderFolderDetails && orderFolderDetails.ordered_folder !== undefined ? (
                                            <button className="page-btn update-btn" onClick={ () => sendPurchasedFilesToUserHandler(order_number, user_id) }>Send Links</button>
                                        ) : ''
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-2 col-xxl-2 col-xl-2 col-lg-2 col-md-12 col-sm-12 col-xs-12">
                        <div className="d-flex justify-content-between">
                            <div className="pointer ms-3 d-flex" id="print" onClick={ () => sendInvoice(order_number, 1) } >
                                <div className='print-icon-BW'></div>
                                <div className='print-icon-CF'></div>
                                <span>Print</span>
                            </div>
                            <div className="pointer d-flex" onClick={ () => sendInvoice(order_number, 0) }>
                                <div className='email-icon-BW'></div>
                                <div className='email-icon-CF'></div>
                                <span>Email</span>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="mt-5" />
                <div className="pricing-table-container">
                    <div className="d-flex py-2 text-start">
                        <label className="lbl txt-font">Order Details: </label>
                    </div>
                    <div className="card text-start pricing-table">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th className='ps-3'>Image</th>
                                    <th className='ps-3' >Package</th>
                                    <th className='ps-3'>Pricing</th>
                                    <th className='ps-3'>Studio Name</th>
                                    <th className='ps-3'>Routine Detail</th>
                                    <th className='ps-3'>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                            { packageArray && packageArray?.map((item, index) => (
                                <tr>
                                    <td style = { { maxWidth:'300px', overflowX:'auto' } } className='px-2' >
                                        <div className='d-flex p-0 m-0'>
                                        
                                            { item && item.files.map((dataItem, idx) => (
                                                <div className='col px-2 d-flex '>
                                                    <div className='img-box p-0 m-0' key={ idx }>
                                                        {  dataItem.file_type !== 'VIDEO' ?
                                                            <img src={ dataItem.file_url } alt="folder-img" className="desc-img" style={ { objectFit: 'fill' } } /> :
                                                            <video src={ dataItem.file_url } preload="metadata" alt="folder-img" className="desc-video" style={ { objectFit: 'fill' } } /> }
                                                        <label style = { { maxWidth:'120px' } }  className="img-label">{ dataItem.file_name } </label>
                                                    </div>
                                                </div>
                                                    
                                                )) }
                                            </div>                                    
                                    </td>
                                    <td style={ { maxWidth:'150px' } } className='ps-3'>{ item.routine_name }  </td>
                                    <td style={ { maxWidth:'150px' } } className='ps-3 table_price'> { item.price } </td>
                                    <td style={ { maxWidth:'150px' } } className='ps-3'>{ item.studio_name } </td>
                                    <td style={ { maxWidth:'150px' } } className='ps-3'><div className='pe-2' style={ { height: '120px', overflowY:'auto' } }> { item.act_or_team_details } </div></td>
                                    <td style={ { maxWidth:'100px' } } className='ps-3'>
                                        <Radio.Group
                                            onChange={ (e) => packageStatusHandler(e, item) }
                                            name="order_status"
                                            value={ item.delivery_status }
                                            >
                                            <div className="">
                                                <div className="radio-options">
                                                <Radio className="radio-btn" value={ 1 } id="Pending" />
                                                <span className="form-check-label radio-label pointer" htmlFor="Pending">
                                                    Pending
                                                </span>
                                                </div>
                                                <div className="radio-options">
                                                <Radio className="radio-btn" value={ 2 } id="Completed" />
                                                <span style={ { fontWeight:'200' } } 
                                                    className="form-check-label radio-label pointer"
                                                    htmlFor="Completed"
                                                >
                                                    Completed
                                                </span>
                                                </div>
                                            </div>
                                            </Radio.Group>
                                    </td>                                   
                                </tr>
                                )) }                                                               
                            </tbody>
                        </table>
                    </div>                 
                </div>
            </div>
            }
            { isFileListPage && (
                <DetailEventList
                    backToOrder = { handleClose }
                    orderNumber = { ordered_folder_number }
                    orderDetailsFunc = { orderDetailsFromFileListFunc }
                    folderListFunc = { folderListFunc }
                    deleteAllFilesHandler = { deleteAllFilesHandler }
                    setIsConfirmDeleteAll={ setIsConfirmDeleteAll }
                    confirmDeletAllFunc={ confirmDeletAllFunc }
                    isConfirmDeleteAll={ isConfirmDeleteAll }
                    folderName={ folderName }
                    teamNumber={ teamNumber }
                    fileToOrderDetailsFunc={ fileToOrderDetailsFunc }
                    fileToFolderFunc={ fileToFolderFunc }
                    fileScroll={ fileScroll }
                />
            )}
            { isFolderListPage && (
                <EventFolderList
                    orderNumber = { orderNumber }
                    backToOrder = { handleClose }
                    handleDetailEventLising = { handleDetailEventLising }
                    orderDetailsFunc = { orderDetailsFunc }
                    eventId = { event_id }
                    folderToOrderDetailsFunc={ folderToOrderDetailsFunc }
                    fileScroll={ fileScroll }
                    // deleteAllFilesHandler = { deleteAllFilesHandler }
                    // setIsConfirmDeleteAll={ setIsConfirmDeleteAll }
                    // confirmDeletAllFunc={ confirmDeletAllFunc }
                    // isConfirmDeleteAll={ isConfirmDeleteAll }
                />
            )}
            {isConfirm && (
                <SendFilesModal
                    isModalVisible={ isConfirm }
                    handleClose={ confirmSendFilesFunc }
                    handleSubmit={ sendPurchasedFilesToUserHandler }
                    isLogoutFlag = { true }
                />
            )}
        </>
    )
}

OrderDetails.propTypes = {
    handleClose: PropTypes.func,
    orderId: PropTypes.string,
    orderStatus: PropTypes.number
}

export default OrderDetails