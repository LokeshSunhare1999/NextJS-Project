import React, { lazy, Suspense } from 'react';
import styled from 'styled-components';
const DisplayTable = lazy(() => import('../DisplayTable'));
import useCustomerPayments from '../../hooks/customer/useCustomerPayments';
import BoxLoader from '../common/BoxLoader';
import PropTypes from 'prop-types';

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const CustomerPaymentDetailsTab = ({ userId }) => {
  const {
    customerPayments,
    customerPaymentHeaders,
    customerPaymentTableHeaders,
    customerPaymentKeys,
    customerPaymentRows,
  } = useCustomerPayments(userId);

  return (
    <Suspense fallback={<BoxLoader size={5} />}>
      {customerPaymentHeaders?.length > 0 ? (
        <DisplayTable
          tableId={'customerPaymentDetails'}
          rows={customerPaymentRows}
          headers={customerPaymentTableHeaders}
          headersType={Array.from(
            customerPaymentHeaders?.map((item) => item.type),
          )}
          tableWidth={'100%'}
          customProps={{ paymentType: 'incoming' }}
        />
      ) : (
        <BoxLoader size={5} />
      )}
    </Suspense>
  );
};
CustomerPaymentDetailsTab.propTypes = {
  userId: PropTypes.string.isRequired,
};

export default CustomerPaymentDetailsTab;
