import axios from 'axios';
import { REACT_APP_BASE_URL } from 'config';
import { triggerNotifier } from 'shared/notifier';
import { encryptFunc, getAccessToken } from 'utils/Helper';
import { applicationIsLoading, orderIsLoading } from './commonActions';
import { decryptFunc } from '../utils/Helper';

export function fetchOrderList(orderList) {
    return {
        type: 'FETCH_ORDER_LIST',
        orderList
    };
}

// Reusable function for axios headers
const getAuthHeaders = () => ({
    Authorization: `Bearer ${ getAccessToken() }`,
    'Content-Type': 'application/json'
});

// Fetch order details by order number
// export function getOrderListActionV2(order_number) {
//     return (dispatch) => {
//         dispatch(orderSectionIsLoading(true));
//         return axios({
//             method: 'get',
//             url: `${ REACT_APP_BASE_URL }/orders/api/getOrderDetailByOrderNumber`,
//             headers: getAuthHeaders(),
//             params: { order_number }
//         })
//             .then((response) => {
//                 const res = decryptFunc(response.data);
//                 if (res.statusCode === 200) {
//                     dispatch(fetchOrderList(res.data));
//                 }
//                 dispatch(orderSectionIsLoading(false));
//                 return res;
//             })
//             .catch((error) => {
//                 triggerNotifier({ type: 'error', message: error.message });
//                 dispatch(orderSectionIsLoading(false));
//                 return error;
//             });
//     };
// }

// Fetch scanned order details
export function getScannedOrderListAction(order_number, setLoadedOrders) {
    const apiUrl = `${ REACT_APP_BASE_URL }orders/api/getOrderDetailByOrderNumber`;
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        dispatch(orderIsLoading(true));
        return axios({
            method: 'get',
            url: apiUrl,
            headers: getAuthHeaders(),
            params: {
                order_number,
            },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                console.log(res, '>>>>>>>>>>> getScannedOrderListAction API Response <<<<<<<<<<<<<<<<<');
                if (res.statusCode === 200) {
                    setLoadedOrders((prevOrders) => {
                        // Normalize data for comparison
                        const newOrders = res.data.order_details.map((order) => ({
                            ...order,
                            order_number: order.order_number.toString().trim(),
                        }));

                        // Check for duplicates
                        const isDuplicate = newOrders.some((newOrder) =>
                            prevOrders.some(
                                (existingOrder) =>
                                    existingOrder.order_number === newOrder.order_number
                            )
                        );

                        if (isDuplicate) {
                            // Trigger error notifier for duplicate order
                            triggerNotifier({
                                type: 'error',
                                message: `Order already exists: ${ order_number }`,
                            });
                            return prevOrders; // Do not update state if duplicate
                        }

                        // Add only unique orders to the state
                        return [ ...prevOrders, ...newOrders ];
                    });
                }

                dispatch(applicationIsLoading(false));
                dispatch(orderIsLoading(false));
                return res;
            })
            .catch((error) => {
                // Extract error message from the response
                const errorMessage = error.response?.data?.message || 'Something went wrong';
                console.warn(errorMessage, error.response);
                triggerNotifier({ type: 'error', message: errorMessage });
                dispatch(applicationIsLoading(false));
                dispatch(orderIsLoading(false));
                return error;
            });
    };
}

export function updateScannedOrderDetailsAction(data) {
    return (dispatch) => {
        dispatch(applicationIsLoading(true));
        return axios({
            method: 'put',
            url: `${ REACT_APP_BASE_URL }orders/api/updateOrderStatus`,
            headers: {
                Authorization: `Bearer ${ getAccessToken() }`,
                'content-type': 'application/json',
            },
            data: { data: { newData: encryptFunc(data) } },
        })
            .then((response) => {
                const res = decryptFunc(response.data);
                dispatch(applicationIsLoading(false));
                const message =
                   res.data?.message === 'Success'
                       ? data.complete_flag === 2
                           ? 'Orders marked as Completed successfully'
                           : 'Orders marked as Pending successfully'
                       : 'Order Successfully Updated';
                triggerNotifier({ type: 'success', message });
                return res;
            })
            .catch((error) => {
                dispatch(applicationIsLoading(false));
                const message =
                   error.response?.data?.message || 'An error occurred while updating the order status';
                triggerNotifier({ type: 'error', message });
                return error;
            });
    };
}