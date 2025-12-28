import { useGetCustomerDeviceInfo } from '../../apis/queryHooks';

const useCustomerDeviceInfo = (userId) => {
  const {
    data: customerDeviceData,
    isLoading: customerDeviceDataLoading,
    isFetching: customerDeviceDataFetching,
    refetch: customerDeviceRefetch,
  } = useGetCustomerDeviceInfo(userId);

  const customerDevices = customerDeviceData?.user?.identities || [];
  const customerDeviceHeaders = customerDeviceData?.headers || [];
  const isCustomerBlocked = customerDeviceData?.isCustomerBlocked;
  const customerPhoneNo =
    customerDeviceData?.user?.loggedInUserContact?.phoneNo || '';

  const customerDeviceTableHeaders = Array.from(
    customerDeviceHeaders.map((item) => item?.value),
  );
  const customerDeviceKeys = Array.from(
    customerDeviceHeaders.map((item) => item?.key),
  );

  function createData(customerDevice) {
    return customerDeviceKeys.map((key) => customerDevice[key]);
  }

  const customerDeviceRows = Array.from(
    customerDevices.map((item) => createData(item)),
  );

  const customerDeviceHeadersType = Array.from(
    customerDeviceHeaders?.map((item) => item.type),
  );

  return {
    customerDevices,
    customerDeviceHeaders,
    customerDeviceHeadersType,
    customerDeviceTableHeaders,
    customerDeviceKeys,
    customerDeviceRows,
    isCustomerBlocked,
    customerPhoneNo,
    customerDeviceRefetch,
  };
};

export default useCustomerDeviceInfo;
