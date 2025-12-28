import { useGetLedgerData } from '../../apis/queryHooks';
import { getNestedProperty } from '../../utils/helper';

const useEmployerPayment = ({ employerId, currentPage, itemsPerPage }) => {
  const {
    data: employerPaymentData,
    isLoading: employerPaymentDataLoading,
    isFetching: employerPaymentDataFetching,
  } = useGetLedgerData({
    employerId,
    currentPage,
    itemsPerPage,
  });

  const employerPayments = employerPaymentData?.ledgerData || [];

  const employerPaymentsHeaders = employerPaymentData?.headers || [];

  const employerPaymentTableHeaders = Array.from(
    employerPaymentsHeaders.map((item) => item?.value),
  );
  const employerPaymentKeys = Array.from(
    employerPaymentsHeaders.map((item) => item?.key),
  );

  function createData(employerJobs) {
    const headerKeys = Array.from(
      employerPaymentsHeaders.map((item) => item.key),
    );
    return headerKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(employerJobs, itemKey);
    });
  }
  const employerPaymentRows = Array.from(
    employerPayments.map((item) => createData(item)),
  );

  return {
    employerPayments,
    employerPaymentTableHeaders,
    employerPaymentsHeaders,
    employerPaymentKeys,
    employerPaymentRows,
    employerPaymentData,
    employerPaymentDataFetching,
  };
};

export default useEmployerPayment;
