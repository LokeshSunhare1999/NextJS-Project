import { useGetCustomerOrders } from '../../apis/queryHooks';
import { getNestedProperty } from '../../utils/helper';
const useCustomerOrderDetails = (userId) => {
  const {
    data: customerOrderData,
    isLoading: customerOrderDataLoading,
    isFetching: customerOrderDataFetching,
  } = useGetCustomerOrders(userId);

  const customerOrders = customerOrderData?.order || [];
  const customerOrderHeaders = customerOrderData?.headers || [];

  const customerOrderTableHeaders = Array.from(
    customerOrderHeaders.map((item) => item?.value),
  );
  const customerOrderKeys = Array.from(
    customerOrderHeaders.map((item) => item?.key),
  );
  function createData(customerOrder) {
    const headerKeys = Array.from(customerOrderHeaders.map((item) => item.key));
    return headerKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(customerOrder, itemKey);
    });
  }

  const customerOrderRows = Array.from(
    customerOrders.map((item) => createData(item)),
  );
  return {
    customerOrders,
    customerOrderHeaders,
    customerOrderTableHeaders,
    customerOrderKeys,
    customerOrderRows,
  };
};
export default useCustomerOrderDetails;
