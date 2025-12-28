import { useGetPayoutDetails } from '../../apis/queryHooks';
import { RUPEE_SYMBOL } from '../../constants/details';
import { getValueSuffix } from '../../utils/helper';

const usePayoutRequest = (id) => {
  const {
    data: payoutData,
    isLoading: isPayoutDataLoading,
    isError: isPayoutDataError,
    error: payoutDataError,
    refetch: refetchPayoutData,
  } = useGetPayoutDetails(id);

  const errorCode = payoutDataError?.response?.status;
  const AmountBreakupDetails = payoutData?.invoice;
  const referralBreakoutDetails = payoutData?.referralBreakup || [];
  const bankAccountDetails = payoutData?.staffingAgency?.bankDetails;

  function createData(item) {
    const { amountForLevel, level, totalAmountEarned, userCount } = item;
    const suffix = getValueSuffix(parseInt(level));
    return [
      `${suffix}(${RUPEE_SYMBOL} ${amountForLevel})`,
      userCount,
      totalAmountEarned,
    ];
  }

  const referralBreakupData =
    Array.from(referralBreakoutDetails?.map((item) => createData(item))) || [];

  const bankAccountData = [
    {
      label: 'Account Holder Name',
      value: bankAccountDetails?.accountHolderName || '-----',
    },
    {
      label: 'Bank Name',
      value: bankAccountDetails?.bankName || '-----',
    },
    {
      label: 'Account No.',
      value: bankAccountDetails?.accountNumber
        ? `XXXXXXXXXXXX${bankAccountDetails?.accountNumber.slice(-4)}`
        : '-----',
    },
    {
      label: 'IFSC Code',
      value: bankAccountDetails?.ifscCode || '-----',
    },
  ];

  const amountBreakupData = AmountBreakupDetails
    ? [
        {
          label: 'Base Amount',
          value: `₹ ${AmountBreakupDetails?.baseAmount ?? '-----'}`,
          color: '#666666',
          fontWeight: 400,
        },
        ...(AmountBreakupDetails?.gstDetails?.cgst
          ? [
              {
                label: `CGST @ ${AmountBreakupDetails?.gstDetails?.cgstPercentage}%`,
                value: `(+) ₹ ${AmountBreakupDetails?.gstDetails?.cgst}`,
                color: '#666666',
                fontWeight: 400,
              },
            ]
          : []),
        ...(AmountBreakupDetails?.gstDetails?.sgst
          ? [
              {
                label: `SGST @ ${AmountBreakupDetails?.gstDetails?.sgstPercentage}%`,
                value: `(+) ₹ ${AmountBreakupDetails?.gstDetails?.sgst}`,
                color: '#666666',
                fontWeight: 400,
              },
            ]
          : []),
        ...(AmountBreakupDetails?.gstDetails?.igst
          ? [
              {
                label: `IGST @ ${AmountBreakupDetails?.gstDetails?.igstPercentage}%`,
                value: `(+) ₹ ${AmountBreakupDetails?.gstDetails?.igst}`,
                color: '#666666',
                fontWeight: 400,
              },
            ]
          : []),
        {
          label: 'Total Amount',
          value: `₹ ${AmountBreakupDetails?.totalAmount ?? '-----'}`,
          color: '#000000',
          fontWeight: 400,
        },
        ...(AmountBreakupDetails?.tdsRate
          ? [
              {
                label: `TDS @ ${AmountBreakupDetails?.tdsRate}%`,
                value: `(-) ₹ ${AmountBreakupDetails?.tdsAmount}`,
                color: '#666666',
                fontWeight: 400,
              },
            ]
          : []),
        {
          label: 'Amount Payable',
          value: `₹ ${AmountBreakupDetails?.payableAmount ?? '-----'}`,
          color: '#000000',
          fontWeight: 600,
        },
      ]
    : [];

  return {
    payoutData,
    errorCode,
    amountBreakupData,
    referralBreakupData,
    bankAccountData,
    refetchPayoutData,
  };
};

export default usePayoutRequest;
