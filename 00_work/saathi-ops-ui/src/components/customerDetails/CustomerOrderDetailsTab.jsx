import React, { useEffect, useState, lazy, Suspense } from 'react';
const DisplayTable = lazy(() => import('../DisplayTable'));
// import { useGetCustomerOrders } from '../../apis/queryHooks';
import useCustomerOrderDetails from '../../hooks/customer/useCustomerOrderDetails';
import BoxLoader from '../common/BoxLoader';

const CustomerOrderDetailsTab = ({ userId }) => {
  const {
    customerOrders,
    customerOrderHeaders,
    customerOrderTableHeaders,
    customerOrderKeys,
    customerOrderRows,
  } = useCustomerOrderDetails(userId);
  return (
    <Suspense fallback={<BoxLoader size={5} />}>
      {customerOrderHeaders?.length > 0 ? (
        <DisplayTable
          tableId={'customerOrderDetails'}
          rows={customerOrderRows}
          headers={customerOrderTableHeaders}
          headersType={Array.from(
            customerOrderHeaders?.map((item) => item.type),
          )}
          tableWidth={'100%'}
        />
      ) : (
        <BoxLoader size={5} />
      )}
    </Suspense>
  );
};

export default CustomerOrderDetailsTab;
