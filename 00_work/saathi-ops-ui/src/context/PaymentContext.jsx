import React, { createContext, useEffect, useRef, useState } from 'react';
import { useGetAllPayments, useGetRefundPayments } from '../apis/queryHooks';

export const PaymentContext = createContext();

const PaymentProvider = ({ children }) => {
  const [paramsData, setParamsData] = useState({
    searchId: '',
    currentPage: 1,
    itemsPerPage: 10,
    fromDate: null,
    toDate: null,
    type: 'incoming',
    filterKeys: '',
  });

  const isMounted = useRef(false);
  const {
    data: allPaymentsData,
    isLoading: isGetAllPaymentsLoading,
    isFetching: isGetAllPaymentsFetching,
    refetch: refetchAllPayments,
    isError: isGetAllPaymentsErr,
    error: getAllPaymentsErr,
  } = useGetAllPayments(
    {
      searchId: paramsData.searchId,
      currentPage: paramsData.currentPage,
      itemsPerPage: paramsData.itemsPerPage,
      fromDate: paramsData.fromDate,
      toDate: paramsData.toDate,
      filterKeys: paramsData.filterKeys,
    },
    {
      enabled: false,
    },
  );
  const {
    data: refundPaymentsData,
    isLoading: isGetRefundPaymentsLoading,
    isFetching: isGetRefundPaymentsFetching,
    refetch: refetchRefundPayments,
    isError: isGetRefundPaymentsErr,
    error: getRefundPaymentsErr,
  } = useGetRefundPayments(
    {
      searchId: paramsData.searchId,
      currentPage: paramsData.currentPage,
      itemsPerPage: paramsData.itemsPerPage,
      fromDate: paramsData.fromDate,
      toDate: paramsData.toDate,
      filterKeys: paramsData.filterKeys,
    },
    { enabled: false },
  );

  const updateParams = (params) => {
    setParamsData({
      ...paramsData,
      searchId: params?.searchId || '',
      currentPage: params?.currentPage || 1,
      itemsPerPage: params?.itemsPerPage || 10,
      fromDate: params?.fromDate || null,
      toDate: params?.toDate || null,
      type: params?.type || paramsData.type,
      filterKeys: params?.filterKeys || '',
    });
  };
  const getPaymentsDataByType = (type, params = {}) => {
    updateParams({ ...params, type });
  };

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
    } else {
      switch (paramsData.type) {
        case 'incoming':
          refetchAllPayments();
          break;
        case 'refund':
          refetchRefundPayments();
          break;
        default:
          break;
      }
    }
  }, [paramsData]);

  return (
    <PaymentContext.Provider
      value={{
        incomingPaymentDetails: {
          allPaymentsData,
          isGetAllPaymentsLoading,
          isGetAllPaymentsErr,
          getAllPaymentsErr,
        },
        refundPaymentDetails: {
          refundPaymentsData,
          isGetRefundPaymentsLoading,
          isGetRefundPaymentsErr,
          getRefundPaymentsErr,
        },
        getPaymentsDataByType,
        paymentType: paramsData?.type,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export default PaymentProvider;
