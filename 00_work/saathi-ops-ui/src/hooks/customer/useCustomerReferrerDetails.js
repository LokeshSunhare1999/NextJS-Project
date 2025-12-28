import { useEffect, useState } from 'react';
import { useGetReferrerDetails } from '../../apis/queryHooks';

const useCustomerReferrerDetails = (id) => {
  const {
    data: customerReferrerData,
    error: customerReferralHistoryError,
    isError: isCustomerReferralHistoryError,
  } = useGetReferrerDetails(id);
  const [customerReferrerRows, setCustomerReferrerRows] = useState([]);

  const errorCode = customerReferralHistoryError?.response?.status;
  const customerReferrerDetails = customerReferrerData?.data?.referees || [];

  const customerAmountEarned =
    customerReferrerData?.data?.totalAmountEarned || 0;
  const customerTotalAmountWithdrawn =
    customerReferrerData?.data?.totalAmountWithdrawn || 0;

  const customerWithdrawalAmount =
    customerReferrerData?.data?.referral?.walletBalance || 0;

  const customerLinkedWalletAmount =
    customerReferrerData?.data?.referral?.linkWalletBalance || 0;

  const customerLinkedWalletEarning =
    customerReferrerData?.data?.referral?.linkWalletEarnings || 0;

  const customerTotalWalletAmount =
    customerReferrerData?.data?.walletBalance || 0;

  const customerAvailableBonusAmount =
    customerReferrerData?.data?.bonusWallet || 0;

  const customerReferrerHeaders =
    customerReferrerData?.referralDetailsHeaders || [];

  const customerReferrerTableHeaders = Array.from(
    customerReferrerHeaders.map((item) => item?.value) || [],
  );
  const customerReferrerKeys = Array.from(
    customerReferrerHeaders.map((item) => item?.key) || [],
  );

  const customerReferrerType = Array.from(
    customerReferrerHeaders.map((item) => item?.type) || [],
  );

  const referrerRows =
    Array.from(customerReferrerDetails?.map((item) => createData(item))) || [];

  useEffect(() => {
    if (!isCustomerReferralHistoryError) setCustomerReferrerRows(referrerRows);
  }, [customerReferrerDetails]);

  function createData(item) {
    return customerReferrerKeys?.map((key) => item[key]) || [];
  }

  const searchByRefereeNameOrPhone = (searchString) => {
    if (searchString.trim() === '') {
      setCustomerReferrerRows(referrerRows);
      return;
    }

    const filteredReferrals = customerReferrerDetails?.filter(
      (referee) =>
        referee?.name
          ?.toLowerCase()
          ?.trim()
          ?.includes(searchString?.toLowerCase()?.trim()) ||
        referee?.phoneNo?.trim()?.includes(searchString?.trim()),
    );
    const filteredReferrerRows =
      Array.from(filteredReferrals?.map((item) => createData(item))) || [];
    setCustomerReferrerRows(filteredReferrerRows);
  };

  return {
    customerReferrerDetails,
    customerReferrerRows,
    customerReferrerTableHeaders,
    customerReferrerType,
    errorCode,
    isCustomerReferralHistoryError,
    searchByRefereeNameOrPhone,
    customerAmountEarned,
    customerWithdrawalAmount,
    customerLinkedWalletAmount,
    customerLinkedWalletEarning,
    customerTotalWalletAmount,
    customerAvailableBonusAmount,
    customerTotalAmountWithdrawn,
    setCustomerReferrerRows,
    createData,
  };
};

export default useCustomerReferrerDetails;
