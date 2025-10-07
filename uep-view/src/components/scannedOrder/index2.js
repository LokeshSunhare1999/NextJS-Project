// code for order scanner with webcam

// import React, { useState } from 'react';
// import AuthLayoutContainer from 'shared/AuthLayoutContainer';
// import { DataTableNoPagination } from 'shared/DataTable';
// import Button from 'shared/Button';
// import CompleteEventModal from 'shared/CompleteAllModal';
// import ErrorModal from 'shared/ErrorMessage';
// import { getScannedOrderListAction, updateScannedOrderDetailsAction } from 'actions/scannedorderActions';
// import { useDispatch, useSelector } from 'react-redux';
// import QuaggaScanner from './QuaggaScanner';
// import { triggerNotifier } from 'shared/notifier';
// import ResetEventModal from 'shared/ResetEventModal';
// import { useEffect } from 'react';
// import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
// import TabSwitchModal from 'shared/TabSwitchModal';

// function ScannedOrders(props) {
//     const { history } = props;
//     const dispatch = useDispatch();
//     const routeHistory = useHistory();
//     const [ loadedOrders, setLoadedOrders ] = useState([]);
//     const [ isConfirmComplete, setIsConfirmComplete ] = useState(false);
//     const [ isConfirmPending, setIsConfirmPending ] = useState(false);
//     const [ isScanning, setIsScanning ] = useState(false);
//     const [ showError, setShowError ] = useState(false);
//     const [ isConfirmReset, setIsConfirmReset ] = useState(false);
//     const orderIsLoading = useSelector((state) => state.orderIsLoading);
//     const [ showNavigationModal, setShowNavigationModal ] = useState(false);
//     const [ nextRoute, setNextRoute ] = useState(null);

//     const columns = [
//         { title: 'Order ID', dataIndex: 'order_number', key: 'id', width: '13%' },
//         { title: 'Event Code', dataIndex: 'event_codes', key: 'event_code', width: '12%', render: (codes) => codes.join(', ') },
//         { title: 'Customer Account', dataIndex: 'full_name', key: 'name', width: '13%' },
//         { title: 'Location', dataIndex: 'state_name', key: 'location', width: '8%' },
//         { title: 'Order Type', dataIndex: 'order_mode_name', width: '9%' },
//         { title: 'Package Count', dataIndex: 'package_quantity', key: 'package_count', width: '11%' },
//         { title: 'Order Date', dataIndex: 'purchase_datetime', key: 'date', width: '9%' },
//         { title: 'Client Name', dataIndex: 'event_producer', key: 'event_producer', width: '13%' },
//         { title: 'Amount', dataIndex: 'price', width: '7%' },
//     ];

//     const startScanningOrders = () => setIsScanning(true);

//     const handleOrderScanned = async (orderId) => {
//         if (!orderIsLoading) {
//             console.warn('Scanned Order ID:', orderId);
//             try {
//                 await dispatch(getScannedOrderListAction(orderId, setLoadedOrders));
//             } catch (error) {
//                 console.error('Order Not Found:', error);
//                 setShowError(true);
//             }
//         }
//     };

//     const confirmCompleteAll = () => {
//         if (loadedOrders.length === 0) {
//             triggerNotifier({ type: 'error', message: 'No orders to mark as completed.' });
//             return;
//         }
//         setIsConfirmComplete(true);
//     };

//     const confirmPendingAll = () => {
//         if (loadedOrders.length === 0) {
//             triggerNotifier({ type: 'error', message: 'No orders to mark as pending.' });
//             return;
//         }
//         setIsConfirmPending(true);
//     };

//     const confirmResetAll = () => {
//         if (loadedOrders.length === 0) {
//             triggerNotifier({ type: 'error', message: 'No orders to reset.' });
//             return;
//         }
//         setIsConfirmReset(true);
//     };

//     const handleCompleteAll = () => {
//         const orderIds = loadedOrders.map((order) => order.id);
//         dispatch(updateScannedOrderDetailsAction({ order_ids: orderIds, complete_flag: 2 }))
//             .then(() => {
//                 setLoadedOrders([]);
//                 setIsScanning(false);
//                 setIsConfirmComplete(false);
//             })
//             .catch((error) => console.error('Error marking orders as completed:', error));
//     };

//     const handlePendingAll = () => {
//         const orderIds = loadedOrders.map((order) => order.id);
//         dispatch(updateScannedOrderDetailsAction({ order_ids: orderIds, complete_flag: 1 }))
//             .then(() => {
//                 setLoadedOrders([]);
//                 setIsScanning(false);
//                 setIsConfirmPending(false);
//             })
//             .catch((error) => console.error('Error marking orders as pending:', error));
//     };

//     const handleReset = () => {
//         setLoadedOrders([]);
//         setIsScanning(false);
//         setIsConfirmReset(false);
//     };

//     const handleCloseComplete = () => setIsConfirmComplete(false);
//     const handleClosePending = () => setIsConfirmPending(false);
//     const handleCloseError = () => setShowError(false);
//     const handleCloseReset = () => setIsConfirmReset(false);

//     const handleNavigationConfirm = () => {
//         setShowNavigationModal(false);
//         setLoadedOrders([]);
//         // routeHistory.push(nextRoute);
//         window.location.href = nextRoute;
//         console.warn('routeHistory <<<<<line116', nextRoute);
//     };

//     const handleNavigationCancel = () => {
//         setShowNavigationModal(false);
//     };

//     useEffect(() => {
//         const unListen = routeHistory.listen((location) => {
//             if (loadedOrders.length > 0 && location.pathname !== '/order-scanner') {
//                 setNextRoute(location.pathname);
//                 setShowNavigationModal(true);
//                 history.push('/order-scanner');
//             }
//         });
//         return () => {
//             unListen();
//         };
//     }, [ history, loadedOrders, routeHistory ]);
//     return (
//         <AuthLayoutContainer history={ history }>
//             <div className="oders-page-wrapper" id="fileScroll">
//                 <div className="page-wrapper event-page">
//                     <div className="event-header pb-3">
//                         <div className="heading border-bottom pb-4">Order Scanner</div>
//                         <div className="d-flex justify-content-between gap-2 my-3 mx-2 pt-3">
//                             {!isScanning ? (
//                                 <Button
//                                     onClick={ startScanningOrders }
//                                     className="btn btn-primary scanner-btnn w-20 text-nowrap"
//                                     buttonName="Scan Orders"
//                                 />
//                             ) : (
//                                 <>
//                                     <div className="d-flex gap-3">
//                                         <Button
//                                             onClick={ confirmCompleteAll }
//                                             className="btn btn-primary scanner-btnn flex-grow-1 text-nowrap"
//                                             buttonName="Complete All"
//                                         />
//                                         <Button
//                                             onClick={ confirmPendingAll }
//                                             className="btn btn-primary scanner-btnn flex-grow-1 text-nowrap"
//                                             buttonName="Pending All"
//                                         />
//                                     </div>
//                                     <Button
//                                         onClick={ confirmResetAll }
//                                         className="btn btn-secondary scanner-btnn text-nowrap"
//                                         buttonName="Reset"
//                                     />
//                                 </>
//                             )}
//                         </div>

//                         {isScanning && (
//                             <div
//                                 className="webcam-container"
//                                 style={ {
//                                     position: 'absolute',
//                                     right: '25px',
//                                     bottom: '35%',
//                                     width: '100px',
//                                     height: '100px',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     justifyContent: 'center',
//                                     zIndex: 200,
//                                 } }
//                             >
//                                 <QuaggaScanner handleOrderScanned={ handleOrderScanned } />
//                             </div>
//                         )}
//                     </div>
//                     <div className="data-table" style={ {  marginTop: isScanning ? '230px' : '0px' } }>
//                         <DataTableNoPagination columns={ columns } eventList={ loadedOrders } />
//                     </div>
//                 </div>
//             </div>

//             {isConfirmComplete && (
//                 <CompleteEventModal
//                     isModalVisible={ isConfirmComplete }
//                     handleClose={ handleCloseComplete }
//                     handleSubmit={ handleCompleteAll }
//                     isCompleted={ true }
//                 />
//             )}
//             {isConfirmPending && (
//                 <CompleteEventModal
//                     isModalVisible={ isConfirmPending }
//                     handleClose={ handleClosePending }
//                     handleSubmit={ handlePendingAll }
//                     isCompleted={ false }
//                 />
//             )}
//             {showError && (
//                 <ErrorModal
//                     isModalVisible={ showError }
//                     handleClose={ handleCloseError }
//                     message="Order ID not found. Please start scanning again."
//                 />
//             )}
//             {isConfirmReset && (
//                 <ResetEventModal
//                     isModalVisible={ isConfirmReset }
//                     handleClose={ handleCloseReset }
//                     handleSubmit={ handleReset }
//                 />
//             )}

//             {showNavigationModal && (
//                 <TabSwitchModal
//                     isModalVisible={ showNavigationModal }
//                     handleClose={ handleNavigationCancel }
//                     handleSubmit={ handleNavigationConfirm }
//                 />
//             )}
//         </AuthLayoutContainer>
//     );
// }

// export default ScannedOrders;
