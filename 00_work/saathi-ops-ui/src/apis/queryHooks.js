import { useMutation, useQuery } from '@tanstack/react-query';
import { QUERY_KEYS } from './queryKeys';
import {
  handleGetAllCourses,
  handlePostAddCourse,
  handleGetCourseDetails,
  handlePostUploadCsv,
  handlePostAddAssessment,
  handleGetAllCustomers,
  handleGetCustomerDetails,
  handlePutCourseModule,
  handlePutCourseSubModule,
  handlePutCourseAssessment,
  handlePutCourse,
  handleDeleteCourseAssessment,
  handleDeleteCourse,
  handleGetAllPayments,
  handleGetAllOrders,
  handleGetPaymnetDetails,
  handleGetOrderDetails,
  handleGetCustomerOrder,
  handleGetCustomerPayment,
  handleGetCustomerCourses,
  handlePostIdentity,
  handlePostVerifyPassword,
  handlePostUploadToS3,
  handlePostEditPsychWeightage,
  handleGetGlobalData,
  handleGetRefundPayments,
  handleGetRefundDetails,
  handleGetUserDetails,
  handlePutResetPassword,
  handlePutUpdateTrueId,
  handlePostSendSms,
  handlePutUpdateCustomer,
  handlePostRemarks,
  handlePutCustomerDetails,
  handleGetReferrerDetails,
  handleGetReferralHistory,
  handleGetAllUsers,
  handleGetAllRoles,
  handleGetAllPermissions,
  handlePostUserRole,
  handlePutUserRole,
  handleDeleteUserRole,
  handlePostAddUser,
  handlePutUser,
  handleDeleteUser,
  handlePostUserPermission,
  handlePutUserPermission,
  handleDeleteUserPermission,
  handleGetTestDetails,
  handlePostUploadTestCsv,
  handlePostAddTest,
  handleGetAllTests,
  handlePutEditTest,
  handlePutDeleteTest,
  handlePutUpdateTestAssessment,
  handleGetTestCategories,
  handleEmpReferralDetails,
  handleEmpReferralEarnDetails,
  handleEmpCandidateReferralEarnDetails,
  handleGetAllPayouts,
  handlePostChangePayoutStatus,
  handleEmployerDetails,
  handleEmployerDocPostRemarks,
  handlePutUpdateEmployerStatus,
  handleGetAllEmployer,
  handleGetAllStaff,
  handlePostAddEmployer,
  handleGetEarnings,
  handlePostInitiateRefund,
  handlePutPanDetails,
  handleUploadAndDeleteAgreement,
  handleGetPayoutDetails,
  handlePutTrueIDDetails,
  handleGetAllFieldAgents,
  handlegetCityStateByPincode,
  handleGetUserBasicDetails,
  handleGetJobCategories,
  handleGetCustomerDeviceInfo,
  handleGetCustomerLoggedInMobileInfo,
  handleGetCompanyDetails,
  handleGetEmployerJobs,
  handleGetAllJobs,
  handlePostAddJob,
  handlePutAddJob,
  handleWebsiteDomainCheck,
  handleGetGlobalEmployerData,
  handleGetJobById,
  handleGetApplicantDetails,
  handlePutApplicantStatus,
  handleGetApplications,
  handlePutCustomerUnblockStatus,
  handleDeviceUnblockStatus,
  handleGetGlobalDataByName,
  handleDownloadEmployerJobs,
  handlePutCustomerProfile,
  handleGetAllApplicants,
  handleGetAllInterviews,
  handleGetTrueIdStaticData,
  handleGetJobReelGlobalData,
  handlePostCreditsPackageData,
  handleGetSubscriptionData,
  handleGetLedgerData,
  handleGetAllCustomerApplications,
  handleGetAllCampaigns,
  handlePostCampaign,
  handlePostUploadCampaign,
  handleGetAutoSuggestedData,
} from './queryFunctions';

export const useGetAllCourses = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_COURSES,
      options?.itemsPerPage,
      options?.currentPage,
    ],
    queryFn: () => handleGetAllCourses(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllCustomers = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_CUSTOMERS,
      options?.currentPage,
      options?.itemsPerPage,
      options?.searchId,
      options?.filterKeys,
    ],
    queryFn: () => handleGetAllCustomers(options),
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetAllApplicants = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_APPLICANTS],
    queryFn: () => handleGetAllApplicants(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllInterviews = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_INTERVIEWS],
    queryFn: () => handleGetAllInterviews(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePostAddCourse = () => {
  return useMutation({
    mutationFn: (payload) => handlePostAddCourse(payload),
  });
};

export const useGetCourseDetails = (id, langCode) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_COURSE_DETAILS],
    queryFn: () => handleGetCourseDetails(id, langCode),
    // enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePostUploadCsv = (id, langCode) => {
  return useMutation({
    mutationFn: (payload) => handlePostUploadCsv(payload, id, langCode),
  });
};

export const usePutCourse = (id, langCode) => {
  return useMutation({
    mutationFn: (payload) => handlePutCourse(payload, id, langCode),
  });
};

export const usePutCourseModule = (id, options = {}, langCode) => {
  return useMutation({
    mutationFn: (payload) => handlePutCourseModule(payload, id, langCode),
  });
};

export const usePutCourseSubModule = (id, options = {}, langCode) => {
  return useMutation({
    mutationFn: (payload) => handlePutCourseSubModule(payload, id, langCode),
  });
};

export const usePostAddAssessment = (langCode) => {
  return useMutation({
    mutationFn: (payload) => handlePostAddAssessment(payload, langCode),
  });
};

export const usePutCourseAssessment = (id, langCode) => {
  return useMutation({
    mutationFn: (payload) => handlePutCourseAssessment(payload, id, langCode),
  });
};

export const useDeleteCourseAssessment = (id) => {
  return useMutation({
    mutationFn: () => handleDeleteCourseAssessment(id),
  });
};

export const useDeleteCourse = () => {
  return useMutation({
    mutationFn: (id) => handleDeleteCourse(id),
  });
};

export const useGetAllPayments = (options, queryOptions) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_PAYMENTS,
      options?.fromDate,
      options?.toDate,
      options?.searchId,
      options?.currentPage,
      options?.itemsPerPage,
      options?.filterKeys,
    ],
    queryFn: () => handleGetAllPayments(options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: queryOptions?.enabled ?? true,
  });
};

export const useGetRefundPayments = (options, queryOptions) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_REFUND_PAYMENT,
      options?.fromDate,
      options?.toDate,
      options?.searchId,
      options?.currentPage,
      options?.itemsPerPage,
      options?.filterKeys,
    ],
    queryFn: () => handleGetRefundPayments(options),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: queryOptions?.enabled ?? true,
  });
};

export const useGetRefundPaymentDetails = (options) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REFUND_PAYMENT_DETAILS],
    queryFn: () => handleGetRefundDetails(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllOrders = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_ORDERS,
      options?.currentPage,
      options?.itemsPerPage,
      options?.searchId,
      options?.fromDate,
      options?.toDate,
      options?.filterKeys,
    ],
    queryFn: () => handleGetAllOrders(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetPaymentDetails = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PAYMENTS_DETAILS],
    queryFn: () => handleGetPaymnetDetails(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetOrderDetails = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ORDER_DETAILS],
    queryFn: () => handleGetOrderDetails(id),
    // enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetCustomerDetails = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CUSTOMER_DETAILS, id],
    queryFn: () => handleGetCustomerDetails(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetCustomerPayments = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CUSTOMER_PAYMENTS],
    queryFn: () => handleGetCustomerPayment(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetCustomerOrders = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CUSTOMER_ORDERS],
    queryFn: () => handleGetCustomerOrder(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetCustomerCourses = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CUSTOMER_COURSES],
    queryFn: () => handleGetCustomerCourses(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePostIdentity = () => {
  return useMutation({
    mutationFn: (payload) => handlePostIdentity(payload),
  });
};

export const usePostVerifyPassword = () => {
  return useMutation({
    mutationFn: ({ payload, token }) =>
      handlePostVerifyPassword(payload, token),
  });
};

export const usePostUploadToS3 = (filePath, type, bucket) => {
  return useMutation({
    mutationFn: ({ payload, signal }) =>
      handlePostUploadToS3(payload, signal, filePath, type, bucket),
  });
};

export const usePostEditPsychWeightage = () => {
  return useMutation({
    mutationFn: (payload) => handlePostEditPsychWeightage(payload),
  });
};

export const useGetGlobalData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GLOBAL_DATA],
    queryFn: () => handleGetGlobalData(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetGlobalDataByName = (name) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_GLOBAL_DATA_BY_NAME, name],
    queryFn: () => handleGetGlobalDataByName(name),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetUserDetails = (userId, token) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_DETAILS, userId],
    queryFn: () => handleGetUserDetails(userId, token),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!userId && !!token,
  });
};

export const usePutResetPassword = (token) => {
  return useMutation({
    mutationFn: (payload) => handlePutResetPassword(payload, token),
  });
};

export const usePostRemarks = () => {
  return useMutation({
    mutationFn: (payload) => handlePostRemarks(payload),
  });
};

export const usePutUpdateTrueId = () => {
  return useMutation({
    mutationFn: (payload) => handlePutUpdateTrueId(payload),
  });
};

export const usePostSendSms = () => {
  return useMutation({
    mutationFn: (payload) => handlePostSendSms(payload),
  });
};

export const usePutUpdateCustomer = () => {
  return useMutation({
    mutationFn: (payload) => handlePutUpdateCustomer(payload),
  });
};

export const usePutCustomerDetails = () => {
  return useMutation({
    mutationFn: (payload) => handlePutCustomerDetails(payload),
  });
};

export const useGetReferrerDetails = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REFERRER_DETAILS, id],
    queryFn: () => handleGetReferrerDetails(id),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetReferralHistory = (id, userType) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_REFERRAL_ORDER_HISTORY, id],
    queryFn: () => handleGetReferralHistory(id, userType),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetTestDetails = (id, langCode) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TEST_DETAILS, id],
    queryFn: () => handleGetTestDetails(id, langCode),
    // enabled: false,
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePostUploadTestCsv = (id, langCode) => {
  return useMutation({
    mutationFn: (payload) => handlePostUploadTestCsv(payload, id, langCode),
  });
};

export const usePostAddTest = () => {
  return useMutation({
    mutationFn: (payload) => handlePostAddTest(payload),
  });
};

export const useGetAllTests = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_TESTS,
      options?.itemsPerPage,
      options?.currentPage,
    ],
    queryFn: () => handleGetAllTests(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePutEditTest = (id, langCode) => {
  return useMutation({
    mutationFn: (payload) => handlePutEditTest(payload, id, langCode),
  });
};

export const usePutDeleteTest = () => {
  return useMutation({
    mutationFn: (id) => handlePutDeleteTest(id),
  });
};

export const useGetAllUsers = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_USERS,
      options?.itemsPerPage,
      options?.currentPage,
    ],
    queryFn: () => handleGetAllUsers(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePutUpdateTestAssessment = (langCode) => {
  return useMutation({
    mutationFn: (payload) => handlePutUpdateTestAssessment(payload, langCode),
  });
};

export const useGetAllRoles = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_ROLES],
    queryFn: () => handleGetAllRoles(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllPermissions = (options) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_PERMISSIONS],
    queryFn: () => handleGetAllPermissions(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePostUserRole = () => {
  return useMutation({
    mutationFn: (payload) => handlePostUserRole(payload),
  });
};

export const usePutUserRole = (id) => {
  return useMutation({
    mutationFn: (payload) => handlePutUserRole(payload, id),
  });
};

export const useDeleteUserRole = () => {
  return useMutation({
    mutationFn: (id) => handleDeleteUserRole(id),
  });
};

export const usePostAddUser = () => {
  return useMutation({
    mutationFn: (payload) => handlePostAddUser(payload),
  });
};

export const usePutUser = (id) => {
  return useMutation({
    mutationFn: (payload) => handlePutUser(payload, id),
  });
};

export const useDeleteUser = () => {
  return useMutation({
    mutationFn: (id) => handleDeleteUser(id),
  });
};

export const usePostUserPermission = () => {
  return useMutation({
    mutationFn: (payload) => handlePostUserPermission(payload),
  });
};

export const usePutUserPermission = (id) => {
  return useMutation({
    mutationFn: (payload) => handlePutUserPermission(payload, id),
  });
};

export const useDeleteUserPermission = () => {
  return useMutation({
    mutationFn: (id) => handleDeleteUserPermission(id),
  });
};

export const useGetTestCategories = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TEST_CATEGORIES],
    queryFn: () => handleGetTestCategories(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useEmpReferralDetails = (id, options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_EMP_REFERRAL,
      id,
      options?.currentPage,
      options?.itemsPerPage,
      options?.activeSearchKey,
    ],
    queryFn: () => handleEmpReferralDetails(id, options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};
export const useEmpReferralEarnDetails = (id, type) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_EMP_REFERRAL, id, type],
    queryFn: () => handleEmpReferralEarnDetails(id, type),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useEmpCandidateReferralEarnDetails = (id, candidateId, type) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_EMP_REFERRAL, id, candidateId, type],
    queryFn: () => handleEmpCandidateReferralEarnDetails(id, candidateId, type),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!candidateId,
  });
};

export const useGetAllPayouts = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_PAYOUTS,
      options?.itemsPerPage,
      options?.currentPage,
      options?.filterKeys,
    ],
    queryFn: () => handleGetAllPayouts(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetPayoutDetails = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_PAYOUT_DETAILS, id],
    queryFn: () => handleGetPayoutDetails(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useGetEmployerDetails = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_EMPLOYER_DETAILS, id],
    queryFn: () => handleEmployerDetails(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const useEmployerDocPostRemarks = () => {
  return useMutation({
    mutationFn: (payload) => handleEmployerDocPostRemarks(payload),
  });
};

export const usePutUpdateEmployerStatus = (employerId) => {
  return useMutation({
    mutationFn: (payload) => handlePutUpdateEmployerStatus(employerId, payload),
  });
};

export const useGetAllEmployer = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_EMPLOYER,
      options?.currentPage,
      options?.itemsPerPage,
      options?.searchId,
      options?.filterKeys,
    ],
    queryFn: () => handleGetAllEmployer(options),
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
    // enabled: false
  });
};
export const useGetAllJobs = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_JOBS,
      options?.currentPage,
      options?.itemsPerPage,
      options?.filterKeys,
    ],
    queryFn: () => handleGetAllJobs(options),
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
  });
};

export const useGetEmployerJobs = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_EMPLOYER_JOBS,
      options?.employerId,
      options?.itemsPerPage,
      options?.currentPage,
      options?.filterKeys,
    ],
    queryFn: () => handleGetEmployerJobs(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllStaff = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_STAFF,
      options?.currentPage,
      options?.itemsPerPage,
      options?.searchId,
      options?.filterKeys,
      options?.staffingAgencyId,
    ],
    queryFn: () => handleGetAllStaff(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetEarnings = (payload) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_EARNINGS],
    queryFn: () => handleGetEarnings(payload),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: false,
  });
};

export const usePostAddEmployer = () => {
  return useMutation({
    mutationFn: (payload) => handlePostAddEmployer(payload),
  });
};

export const usePostChangePayoutStatus = (id) => {
  return useMutation({
    mutationFn: (payload) => handlePostChangePayoutStatus(payload, id),
  });
};

export const usePostInitiateRefund = (id) => {
  return useMutation({
    mutationFn: (payload) => handlePostInitiateRefund(payload, id),
  });
};

export const usePutPanDetails = () => {
  return useMutation({
    mutationFn: (payload) => handlePutPanDetails(payload),
  });
};

export const useUploadAndDeleteAgreement = (id) => {
  return useMutation({
    mutationFn: (payload) => handleUploadAndDeleteAgreement(payload, id),
  });
};

export const usePutTrueIDDetails = () => {
  return useMutation({
    mutationFn: (payload) => handlePutTrueIDDetails(payload),
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

export const useGetWebsiteDomainCheck = (domain) => {
  const trimmedDomain = domain?.trim();
  return useQuery({
    queryKey: [QUERY_KEYS.GET_WEBSITE_DOMAIN_CHECK, trimmedDomain],
    queryFn: () => handleWebsiteDomainCheck(trimmedDomain),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!trimmedDomain,
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

export const useGetJobById = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_JOB_BY_ID],
    queryFn: () => handleGetJobById(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
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

export const useGetApplicantDetails = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_APPLICANT_DETAILS, id],
    queryFn: () => handleGetApplicantDetails(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
  });
};

export const usePutApplicantStatus = (id) => {
  return useMutation({
    mutationFn: (payload) => handlePutApplicantStatus(id, payload),
  });
};
export const useGetApplication = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_APPLICATIONS,
      options?.jobId,
      options?.itemsPerPage,
      options?.currentPage,
      options?.filterKeys,
    ],
    queryFn: () => handleGetApplications(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllFieldAgents = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_ALL_FIELD_AGENTS],
    queryFn: () => handleGetAllFieldAgents(),
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

export const useGetUserBasicDetails = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_USER_BASIC_DETAILS, id],
    queryFn: () => handleGetUserBasicDetails(id),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!id,
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
  });
};

export const useGetCustomerDeviceInfo = (userId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CUSTOMER_DEVICE_INFO, userId],
    queryFn: () => handleGetCustomerDeviceInfo(userId),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!userId,
  });
};

export const useGetCustomerLoggedInMobileInfo = (macAddress) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_CUSTOMER_LOGGED_IN_MOBILE_INFO, macAddress],
    queryFn: () => handleGetCustomerLoggedInMobileInfo(macAddress),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePutCustomerUnblockStatus = () => {
  return useMutation({
    mutationFn: (payload) => handlePutCustomerUnblockStatus(payload),
  });
};

export const usePutDeviceUnblockStatus = () => {
  return useMutation({
    mutationFn: (payload) => handleDeviceUnblockStatus(payload),
  });
};

export const useDownloadEmployerJobs = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.DOWNLOAD_EMPLOYER_JOBS,
      options?.employerId,
      options?.itemsPerPage,
      options?.currentPage,
      options?.filterKeys,
      options?.downloadCsv,
    ],
    queryFn: () => handleDownloadEmployerJobs(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePutUpdateCustomerProfile = () => {
  return useMutation({
    mutationFn: (payload) => handlePutCustomerProfile(payload),
  });
};

export const useGetTrueIdStaticData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_TRUEID_STATIC_DATA],
    queryFn: () => handleGetTrueIdStaticData(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetJobReelGlobalData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_JOBREEL_GLOBAL_DATA],
    queryFn: () => handleGetJobReelGlobalData(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const usePostCreditsPackageData = () => {
  return useMutation({
    mutationFn: ({ employerId, productId, payload }) =>
      handlePostCreditsPackageData(employerId, productId, payload),
  });
};

export const useGetSubscriptionData = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_SUBSCRIPTION_DATA],
    queryFn: () => handleGetSubscriptionData(),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetLedgerData = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_LEDGER_DATA,
      options?.employerId,
      options?.itemsPerPage,
      options?.currentPage,
    ],
    queryFn: () => handleGetLedgerData(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllCustomerApplications = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.GET_ALL_CUSTOMER_APPLICATIONS,
      options?.customerId,
      options?.itemsPerPage,
      options?.currentPage,
    ],
    queryFn: () => handleGetAllCustomerApplications(options),
    retry: false,
    refetchOnWindowFocus: false,
  });
};

export const useGetAllCampaigns = (options) => {
  return useQuery({
    queryKey: [
      QUERY_KEYS.CAMPAIGN_DETAILS,
      options?.currentPage,
      options?.itemsPerPage,
    ],
    queryFn: () => handleGetAllCampaigns(options),
    retry: false,
    refetchOnWindowFocus: false,
    ...options,
    // enabled: false
  });
};

export const usePostCampaign = () => {
  return useMutation({
    mutationFn: (payload) => handlePostCampaign(payload),
  });
};

export const usePostUploadCampaign = () => {
  return useMutation({
    mutationFn: (payload) => handlePostUploadCampaign(payload),
  });
};

export const useGetAutoSuggestedData = (jobreelId) => {
  return useQuery({
    queryKey: [QUERY_KEYS.GET_AUTO_SUGGESTED_DATA],
    queryFn: () => handleGetAutoSuggestedData(jobreelId),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: !!jobreelId,
  });
};
