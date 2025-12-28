import { useGetReferralHistory } from '../../apis/queryHooks';

const useCustomerReferralHistory = (id) => {
  const {
    data: customerReferralHistoryData,
    error: customerReferralHistoryError,
    isError: isCustomerReferralHistoryError,
  } = useGetReferralHistory(id, 'CUSTOMER');

  const errorCode = customerReferralHistoryError?.response?.status;

  const createTooltipArray = () => {
    let tooltipArray = [];
    customerReferralHistoryData?.txnHistory?.map((history) => {
      tooltipArray.push(history?.payoutDetails);
    });
    return tooltipArray;
  };

  const customerReferralHistoryDetails =
    customerReferralHistoryData?.txnHistory || [];
  const customerReferralHistoryHeaders =
    customerReferralHistoryData?.txnHistoryHeaders || [];

  const customerReferralHistoryTableHeaders = Array.from(
    customerReferralHistoryHeaders.map((item) => item?.value) || [],
  );

  const customerReferralHistoryKeys = Array.from(
    customerReferralHistoryHeaders.map((item) => item?.key) || [],
  );

  const customerReferralHistoryType = Array.from(
    customerReferralHistoryHeaders.map((item) => item?.type) || [],
  );

  function getValueFromItem(item, key) {
    if (key.includes('.')) {
      const keys = key.split('.');

      // Access the object using the keys
      let currentValue = item;
      for (let k of keys) {
        if (currentValue && k in currentValue) {
          currentValue = currentValue[k];
        } else {
          return undefined; // Return undefined if the key doesn't exist
        }
      }
      return currentValue;
    } else {
      // If there's no dot, return the value using the single key
      return item[key];
    }
  }

  function createData(item) {
    return (
      customerReferralHistoryKeys?.map((key) => {
        return getValueFromItem(item, key);
      }) || []
    );
  }

  const customerReferralHistoryRows =
    Array.from(
      customerReferralHistoryDetails?.map((item) => createData(item)),
    ) || [];

  return {
    customerReferralHistoryRows,
    customerReferralHistoryTableHeaders,
    customerReferralHistoryType,
    errorCode,
    isCustomerReferralHistoryError,
    createTooltipArray,
  };
};

export default useCustomerReferralHistory;
