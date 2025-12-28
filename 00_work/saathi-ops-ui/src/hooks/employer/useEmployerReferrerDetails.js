import { useEmpReferralDetails } from '../../apis/queryHooks';
import { getNestedProperty } from '../../utils/helper';

const useEmployerReferrerDetails = (id, options) => {
  const employeeUserIdArray = [];
  const {
    data: employerReferrerData,
    error: employerReferralHistoryError,
    isError: isEmployerReferralHistoryError,
  } = useEmpReferralDetails(id, options);

  const totalCount = employerReferrerData?.count || 0;

  const errorCode = employerReferralHistoryError?.response?.status;
  const employerReferrerDetails = employerReferrerData?.data || [];

  const employerAmountEarned = employerReferrerData?.totalAmountEarned || 0;

  const employerWithdrawalAmount =
    employerReferrerData?.totalAmountWithdrawn || 0;

  const availableBalance = employerReferrerData?.walletBalance || 0;

  const employerReferrerHeaders = employerReferrerData?.headers || [];

  const employerReferrerTableHeaders = Array.from(
    employerReferrerHeaders.map((item) => item?.value) || [],
  );

  const employerReferrerType = Array.from(
    employerReferrerHeaders.map((item) => item?.type) || [],
  );

  const employerReferrerRows =
    Array.from(employerReferrerDetails?.map((item) => createData(item))) || [];

  function createData(referralItem) {
    employeeUserIdArray.push(referralItem?.user);
    const headerKeys = Array.from(
      employerReferrerHeaders.map((item) => item.key),
    );
    return headerKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(referralItem, itemKey);
    });
  }

  return {
    employeeUserIdArray,
    employerReferrerRows,
    employerReferrerTableHeaders,
    employerReferrerType,
    errorCode,
    isEmployerReferralHistoryError,
    employerAmountEarned,
    employerWithdrawalAmount,
    totalCount,
    availableBalance,
  };
};

export default useEmployerReferrerDetails;
