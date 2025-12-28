import { useGetCustomerPayments } from '../../apis/queryHooks';

const useCustomerPayments = (userId) => {
  const {
    data: customerPaymentData,
    isLoading: customerPaymentDataLoading,
    isFetching: customerPaymentDataFetching,
  } = useGetCustomerPayments(userId);

  const customerPayments = customerPaymentData?.payment || [];
  const customerPaymentHeaders = customerPaymentData?.headers || [];

  const customerPaymentTableHeaders = Array.from(
    customerPaymentHeaders?.map((item) => item?.value),
  );
  const customerPaymentKeys = Array.from(
    customerPaymentHeaders?.map((item) => item?.key),
  );

  function createData(courseDetails) {
    return customerPaymentKeys?.map((item) => courseDetails[item]);
  }

  const customerPaymentRows = Array.from(
    customerPayments.map((item) => createData(item)),
  );
  return {
    customerPayments,
    customerPaymentHeaders,
    customerPaymentTableHeaders,
    customerPaymentKeys,
    customerPaymentRows,
  };
};
export default useCustomerPayments;
