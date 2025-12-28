import {
  handleGetEmployerJobs,
  handleGetJobApplications,
  handleGetJobById,
  handlePostIdentity,
  handlePostSendOtp,
  handlePostVerifyOtp,
  handlePutJobApplication,
  handleGetJobCategories,
  handleGetEmployerDetails,
  handleGetGlobalEmployerData,
  handleGetCompanyDetails,
  handlePutUpdateEmployerStatus,
  handlePostAddJob,
  handlePutAddJob,
  handlePostUploadToS3,
  handleGetPaymentStatus,
  handlePostCreateOrder,
  handlePostCreatePayment,
  handlePostVerifyVPA,
  handleGetCreditActivityDetails,
  handleGetCreditsPackages,
  handleGetEmployerSubscription,
  handlegetCityStateByPincode,
  handlePutBulkStatusUpdate,
  handleGetAvailableJobStatus,
  handleGetAvailableJobCategories,
  handleGetAvailableJobLocations,
  handleGetAvailableBrandNames,
  handleGetFilteredJobs,
  handlePostDailyApplicationCount,
  handleGetInvoicesData,
} from "./queryFunction";

import { useMutation, useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";

export const usePostVerifyOtp = () => {
  return useMutation({
    mutationFn: (payload) =>
      handlePostVerifyOtp(
        {
          userContact: {
            phoneNo: payload?.phoneNo,
            otp: payload?.otp,
            dialCode: "+91",
          },
          staffingAgencyId: payload?.staffingAgencyId,
          userType: payload?.userType,
        },
        {
          guestToken: payload?.guestToken,
        }
      ),
  });
};

export const usePostSendOtp = () => {
  return useMutation({
    mutationFn: (payload) =>
      handlePostSendOtp(
        { phoneNo: payload?.phoneNo, dialCode: "+91" },
        { guestToken: payload?.guestToken }
      ),
  });
};

export const usePostIdentity = (queryOptions) => {
  return useMutation({
    mutationFn: (payload) => handlePostIdentity(payload),
  });
};

export const useGetEmployerJobs = (options) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_EMPLOYER_JOBS, options],
    queryFn: () => handleGetEmployerJobs(options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!options?.employerId,
  });
};

export const useGetJobById = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_JOB_BY_ID],
    queryFn: () => handleGetJobById(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useGetJobApplications = (jobId, options) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_JOB_APPLICATIONS, jobId, options],
    queryFn: () => handleGetJobApplications(jobId, options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!jobId,
  });
};

export const usePutJobApplication = () => {
  return useMutation({
    mutationFn: (payload) => handlePutJobApplication(payload),
  });
};

export const useGetJobCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_JOB_CATEGORIES],
    queryFn: () => handleGetJobCategories(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetEmployerDetails = (options) => {
  const { userId, enabled = true } = options || {};
  return useQuery({
    queryKey: [QUERY_KEYS.GET_EMPLOYER_DETAILS, userId],
    queryFn: () => handleGetEmployerDetails(options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: enabled,
  });
};

export const useGetGlobalEmployerData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GLOBAL_EMPLOYER_DATA],
    queryFn: () => handleGetGlobalEmployerData(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetCompanyDetailsByDocumentNo = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_COMPANY_DETAILS,
      options?.documentNumber,
      options?.documentType,
    ],
    queryFn: () => handleGetCompanyDetails(options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!(options?.documentNumber && options?.documentType),
  });
};
export const usePutUpdateEmployerStatus = (employerId) => {
  return useMutation({
    mutationFn: (payload) => handlePutUpdateEmployerStatus(employerId, payload),
  });
};
export const usePostAddJob = () => {
  return useMutation({
    mutationFn: (payload) => handlePostAddJob(payload),
  });
};

export const usePutAddJob = () => {
  return useMutation({
    mutationFn: (payload) => handlePutAddJob(payload),
  });
};

export const usePostUploadToS3 = (filePath, type) => {
  return useMutation({
    mutationFn: ({ payload, signal }) =>
      handlePostUploadToS3(payload, signal, filePath, type),
  });
};

export const useGetPaymentStatus = (id, queryOptions) => {
  return useQuery({
    queryKey: [QUERY_KEYS?.GET_PAYMENT_STATUS, id],
    queryFn: () => handleGetPaymentStatus(id),
    retry: false,
    enabled: queryOptions?.enabled ?? true,
  });
};

export const usePostCreateOrder = () => {
  return useMutation({
    mutationFn: ({ id, payload }) => handlePostCreateOrder(id, payload),
  });
};

export const usePostCreatePayment = () => {
  return useMutation({
    mutationFn: (payload) => handlePostCreatePayment(payload),
  });
};

export const usePostVerifyVPA = () => {
  return useMutation({
    mutationFn: (payload) => handlePostVerifyVPA(payload),
  });
};

export const useGetCreditActivityDetails = (id, options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_CREDIT_ACTIVITY_DETAILS,
      id,
      options?.pageNo,
      options?.pageSize,
    ],
    queryFn: () => handleGetCreditActivityDetails(id, options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useGetCreditsPackages = () => {
  return useQuery({
    queryKey: [QUERY_KEYS?.GET_CREDITS_PACKAGES],
    queryFn: () => handleGetCreditsPackages(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetEmployerSubscription = () => {
  return useQuery({
    queryKey: [QUERY_KEYS?.GET_EMPLOYER_SUBSCRIPTION],
    queryFn: () => handleGetEmployerSubscription(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetCityStateByPincode = (pincode) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CITY_STATE, pincode],
    queryFn: () => handlegetCityStateByPincode(pincode),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!pincode,
  });
};
export const usePutBulkStatusUpdate = () => {
  return useMutation({
    mutationFn: (payload) => handlePutBulkStatusUpdate(payload),
  });
};

export const useGetAvailableJobStatus = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_AVAILABLE_JOB_STATUS],
    queryFn: () => handleGetAvailableJobStatus(id),
    retry: false,
    enabled: !!id,
    refetchOnWindowFocus: false,
  });
};

export const useGetAvailableJobCategories = (employerId, options) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_AVAILABLE_JOB_CATEGORIES, options],
    queryFn: () => handleGetAvailableJobCategories(employerId, options),
    retry: false,
    enabled: !!employerId,
    refetchOnWindowFocus: false,
  });
};

export const useGetAvailableJobLocations = (employerId, options) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_AVAILABLE_JOB_LOCATIONS, options],
    queryFn: () => handleGetAvailableJobLocations(employerId, options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!employerId,
  });
};

export const useGetAvailableBrandNames = (employerId, options) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_AVAILABLE_BRAND_NAMES, options],
    queryFn: () => handleGetAvailableBrandNames(employerId, options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!employerId,
  });
};

export const useGetFilteredJobs = (employerId, options) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_FILTERED_JOBS, options],
    queryFn: () => handleGetFilteredJobs(employerId, options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!employerId,
  });
};

export const usePostDailyApplicationCount = () => {
  return useMutation({
    mutationFn: (payload) => handlePostDailyApplicationCount(payload),
  });
};

export const useGetInvoicesData = (id, options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_INVOICES_DATA,
      id,
      options?.pageNo,
      options?.pageSize,
    ],
    queryFn: () => handleGetInvoicesData(id, options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};
