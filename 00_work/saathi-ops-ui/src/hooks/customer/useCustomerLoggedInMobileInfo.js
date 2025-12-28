import { useGetCustomerLoggedInMobileInfo } from '../../apis/queryHooks';

const useCustomerLoggedInMobileInfo = (macAddress) => {
  const {
    data: customerLoggedInMobileData,
    isLoading: customerLoggedInMobileDataLoading,
    isFetching: customerLoggedInMobileDataFetching,
    refetch: customerLoggedInMobileRefetch,
  } = useGetCustomerLoggedInMobileInfo(macAddress);

  const customerLoggedInMobiles =
    customerLoggedInMobileData?.identityDetails || [];
  const customerLoggedInMobileHeaders =
    customerLoggedInMobileData?.headers || [];
  const isDeviceBlocked = customerLoggedInMobileData?.isDeviceBlocked;
  const customerLoggedInMobileTableHeaders = Array.from(
    customerLoggedInMobileHeaders.map((item) => item?.value),
  );
  const customerLoggedInMobileKeys = Array.from(
    customerLoggedInMobileHeaders.map((item) => item?.key),
  );

  function createData(customerLoggedInMobile) {
    return customerLoggedInMobileKeys.map((key) => customerLoggedInMobile[key]);
  }

  const customerLoggedInMobileRows = Array.from(
    customerLoggedInMobiles.map((item) => createData(item)),
  );

  const customerLoggedInMobileHeadersType = Array.from(
    customerLoggedInMobileHeaders?.map((item) => item.type),
  );

  return {
    customerLoggedInMobiles,
    customerLoggedInMobileHeaders,
    customerLoggedInMobileHeadersType,
    customerLoggedInMobileTableHeaders,
    customerLoggedInMobileKeys,
    customerLoggedInMobileRows,
    isDeviceBlocked,
    customerLoggedInMobileRefetch,
  };
};

export default useCustomerLoggedInMobileInfo;
