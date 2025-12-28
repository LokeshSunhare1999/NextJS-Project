import { ENDPOINTS } from './endpoints';
import moment from 'moment-timezone';
import apiMethod from './apiMethod';
import { parseCookies } from 'nookies';
import { removeKeys } from '../utils/helper';
import { APPLICATION_STATUS } from '../constants/employer';

const cookies = parseCookies();

export const handleGetAllCourses = async (options) => {
  const { currentPage, itemsPerPage, courseTitle, category, langCode } =
    options;
  let url = `${ENDPOINTS.getAllCourses}?pageNo=${currentPage - 1}&pageSize=${itemsPerPage}`;

  if (courseTitle) {
    url += `&search=${encodeURIComponent(courseTitle)}`;
  }

  if (category && category !== 'undefined' && category !== 'All Category') {
    url += `&category=${encodeURIComponent(category)}`;
  }

  if (langCode) {
    url += `&language=${langCode}`;
  }

  return apiMethod('get', url);
};

export const handlePostAddCourse = async (payload) => {
  return apiMethod('post', ENDPOINTS.postAddCourse, payload, {
    'Content-Type': 'application/json',
  });
};

export const handleGetCourseDetails = async (id, langCode) => {
  return apiMethod(
    'get',
    `${ENDPOINTS.courseDetails(id)}?language=${langCode}`,
  );
};

export const handlePostUploadCsv = async (payload, id, langCode) => {
  return apiMethod(
    'post',
    `${ENDPOINTS.uploadcsv(id)}?language=${langCode}`,
    payload,
    {
      'Content-Type': 'multipart/form-data',
    },
  );
};

export const handlePutCourse = async (payload, id, langCode) => {
  return apiMethod(
    'put',
    `${ENDPOINTS.courseDetails(id)}?language=${langCode}`,
    payload,
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handlePutCourseModule = async (payload, id, langCode) => {
  return apiMethod(
    'put',
    `${ENDPOINTS.editCourseModule(id)}?language=${langCode}`,
    removeKeys(payload, ['videoStatus']),
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handlePutCourseSubModule = async (payload, id, langCode) => {
  return apiMethod(
    'put',
    `${ENDPOINTS.editCourseSubModule(id)}?language=${langCode}`,
    payload,
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handlePostAddAssessment = async (payload, langCode) => {
  return apiMethod(
    'post',
    `${ENDPOINTS.courseAssessment}?language=${langCode}`,
    payload,
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handlePutCourseAssessment = async (payload, id, langCode) => {
  return apiMethod(
    'put',
    `${ENDPOINTS.editCourseAssessment(id)}?language=${langCode}`,
    payload,
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handleDeleteCourseAssessment = async (id, langCode) => {
  return apiMethod(
    'delete',
    `${ENDPOINTS.editCourseAssessment(id)}?language=${langCode}`,
    {},
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handleDeleteCourse = async (id, langCode) => {
  return apiMethod(
    'delete',
    `${ENDPOINTS.courseDetails(id)}?language=${langCode}`,
    {},
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handleGetAllPayments = async (options) => {
  const { searchId, currentPage, itemsPerPage, fromDate, toDate, filterKeys } =
    options;
  let url = `${ENDPOINTS.getAllPayments}?pageNo=${currentPage - 1}&pageSize=${itemsPerPage}&searchId=${searchId}${filterKeys?.length > 0 ? filterKeys : ''}`;

  if (fromDate) {
    url += `&fromDate=${fromDate.startOf('day').toISOString()}`;
  }
  if (toDate) {
    const today = moment().startOf('day').format('YYYY-MM-DD');
    const selectedDate = toDate.format('YYYY-MM-DD');

    if (today?.split('-')?.join('') === selectedDate?.split('-')?.join('')) {
      let todayDate = new Date();
      url += `&toDate=${todayDate.toISOString()}`;
    } else {
      url += `&toDate=${toDate.endOf('day').toISOString()}`;
    }
  }

  return apiMethod('get', url);
};
export const handleGetRefundPayments = async (options) => {
  const { searchId, currentPage, itemsPerPage, fromDate, toDate, filterKeys } =
    options;
  let url = `${ENDPOINTS.getRefundPayments}?pageNo=${currentPage - 1}&pageSize=${itemsPerPage}&searchId=${searchId}${filterKeys?.length > 0 ? filterKeys : ''}`;

  if (fromDate) {
    url += `&fromDate=${fromDate.startOf('day').toISOString()}`;
  }
  if (toDate) {
    const today = moment().startOf('day').format('YYYY-MM-DD');
    const selectedDate = toDate.format('YYYY-MM-DD');

    if (today?.split('-')?.join('') === selectedDate?.split('-')?.join('')) {
      let todayDate = new Date();
      url += `&toDate=${todayDate.toISOString()}`;
    } else {
      url += `&toDate=${toDate.endOf('day').toISOString()}`;
    }
  }

  return apiMethod('get', url);
};

export const handleGetAllOrders = async (options) => {
  const { searchId, currentPage, itemsPerPage, fromDate, toDate, filterKeys } =
    options;
  let url = `${ENDPOINTS.getAllOrders}?pageNo=${currentPage - 1}&pageSize=${itemsPerPage}&searchId=${searchId}${filterKeys?.length > 0 ? filterKeys : ''}`;

  if (fromDate) {
    url += `&fromDate=${fromDate.startOf('day').toISOString()}`;
  }
  if (toDate) {
    const today = moment().startOf('day').format('YYYY-MM-DD');
    const selectedDate = toDate.format('YYYY-MM-DD');

    if (today?.split('-')?.join('') === selectedDate?.split('-')?.join('')) {
      let todayDate = new Date();
      url += `&toDate=${todayDate.toISOString()}`;
    } else {
      url += `&toDate=${toDate.endOf('day').toISOString()}`;
    }
  }

  return apiMethod('get', url);
};

export const handleGetPaymnetDetails = async (options) => {
  return apiMethod(
    'get',
    `${ENDPOINTS.paymentDetails(options?.id)}?userType=${options?.userType}`,
  );
};

export const handleGetRefundDetails = async (options) => {
  return apiMethod(
    'get',
    `${ENDPOINTS.refundPaymentDetails(options?.id)}?userType=${options?.userType}`,
  );
};

export const handleGetOrderDetails = async (options) => {
  return apiMethod(
    'get',
    `${ENDPOINTS.getOrderDetails(options?.id)}?userType=${options?.userType}`,
  );
};

export const handleGetAllCustomers = async (options) => {
  const { searchId, currentPage, itemsPerPage, filterKeys } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getAllCustomers}?pageNo=${currentPage}&pageSize=${itemsPerPage}&searchId=${searchId}${filterKeys?.length > 0 ? filterKeys : ''}`,
  );
};

export const handleGetAllApplicants = async () => {
  return apiMethod(
    'get',
    `${ENDPOINTS.getAllApplicants}?bioDataReels=true&pageSize=100`,
  );
};

export const handleGetAllInterviews = async () => {
  return apiMethod('get', `${ENDPOINTS.getAllInterviews}?pageSize=100`);
};

export const handleGetCustomerDetails = async (id) => {
  return apiMethod('get', ENDPOINTS.customerDetails(id));
};

export const handleGetCustomerPayment = async (id) => {
  return apiMethod('get', ENDPOINTS.getCustomerPayments(id));
};

export const handleGetCustomerCourses = async (id) => {
  return apiMethod('get', ENDPOINTS.getCustomerCourses(id));
};

export const handleGetCustomerOrder = async (id) => {
  return apiMethod('get', ENDPOINTS.getCustomerOrders(id));
};

export const handlePostIdentity = async (payload) => {
  return apiMethod('post', ENDPOINTS.postIdentity, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePostVerifyPassword = async (payload, token) => {
  return apiMethod('post', ENDPOINTS.postVerifyPassword, payload, {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });
};

export const handlePostUploadToS3 = async (
  payload,
  signal,
  filePath,
  type,
  bucket,
) => {
  return apiMethod(
    'post',
    ENDPOINTS.uploadToS3(filePath, type, bucket),
    payload,
    {
      'Content-Type': 'multipart/form-data',
    },
    {},
    signal,
  );
};

export const handlePostEditPsychWeightage = async (payload) => {
  return apiMethod('post', ENDPOINTS.postEditPsychWeightage, payload, {
    'Content-Type': 'application/json',
  });
};

export const handleGetGlobalData = async () => {
  return apiMethod('get', ENDPOINTS.getGlobalData);
};

export const handleGetGlobalDataByName = async (name) => {
  return apiMethod('get', ENDPOINTS.getGlobalDataByName(name));
};

export const handleGetUserDetails = async (userId, token) => {
  return apiMethod(
    'get',
    ENDPOINTS.getUserDetails(userId),
    {},
    {
      Authorization: `Bearer ${token}`,
    },
  );
};

export const handlePutResetPassword = async (payload, token) => {
  return apiMethod('put', ENDPOINTS.putResetPassword, payload, {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  });
};

export const handlePostRemarks = async (payload) => {
  return apiMethod('post', ENDPOINTS.postRemarks, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePutUpdateTrueId = async (payload) => {
  return apiMethod('put', ENDPOINTS.putUpdateTrueId, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePostSendSms = async (payload) => {
  return apiMethod('post', ENDPOINTS.postSendSms, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePutUpdateCustomer = async (payload) => {
  return apiMethod('put', ENDPOINTS.putUpdateCustomer, payload, {
    'Content-Type': 'application/json',
  });
};
export const handlePutCustomerDetails = async (payload) => {
  return apiMethod('put', ENDPOINTS.putCustomerDetails, payload, {
    'Content-Type': 'application/json',
  });
};

export const handleGetReferrerDetails = async (id) => {
  return apiMethod('get', ENDPOINTS.getReferrerDetails(id));
};

export const handleGetReferralHistory = async (id, userType) => {
  return apiMethod('get', ENDPOINTS.getReferralHistory(id, userType));
};

export const handleGetTestDetails = async (id, langCode) => {
  return apiMethod(
    'get',
    `${ENDPOINTS.getTestDetails(id)}?language=${langCode}`,
  );
};

export const handlePostUploadTestCsv = async (payload, id, langCode) => {
  return apiMethod(
    'post',
    `${ENDPOINTS.uploadTestCsv(id)}?language=${langCode}`,
    payload,
    {
      'Content-Type': 'multipart/form-data',
    },
  );
};

export const handlePostAddTest = async (payload) => {
  return apiMethod('post', ENDPOINTS.postAddTest, payload, {
    'Content-Type': 'application/json',
  });
};

export const handleGetAllTests = async (options) => {
  const { currentPage, itemsPerPage, langCode } = options;
  let url = `${ENDPOINTS.getAllTests}?pageNo=${currentPage - 1}&pageSize=${itemsPerPage}`;
  if (langCode) {
    url += `&language=${langCode}`;
  }

  // if (courseTitle) {
  //   url += `&search=${encodeURIComponent(courseTitle)}`;
  // }

  // if (category && category !== 'undefined' && category !== 'All Category') {
  //   url += `&category=${encodeURIComponent(category)}`;
  // }
  return apiMethod('get', url);
};

export const handlePutEditTest = async (payload, id, langCode) => {
  return apiMethod(
    'put',
    `${ENDPOINTS.putOrDeleteTest(id)}?language=${langCode}`,
    payload,
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handlePutDeleteTest = async (id) => {
  return apiMethod(
    'delete',
    ENDPOINTS.putOrDeleteTest(id),
    {},
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handlePutUpdateTestAssessment = async (payload, langCode) => {
  return apiMethod(
    'put',
    `${ENDPOINTS.putUpdateTestAssessment}?language=${langCode}`,
    payload,
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handleGetAllUsers = async (options) => {
  const { currentPage, itemsPerPage, emailSearch } = options;
  let url = `${ENDPOINTS.getAllUsers}?page=${currentPage - 1}&limit=${itemsPerPage}&userType=OPS`;

  if (emailSearch) {
    url += `&email=${emailSearch}`;
  }
  return apiMethod('get', url);
};

export const handleGetAllRoles = async () => {
  return apiMethod('get', ENDPOINTS.getAllRoles);
};

export const handleGetAllPermissions = async (options) => {
  const { permissionSearch } = options;

  let url = `${ENDPOINTS.getAllPermissions}`;
  if (permissionSearch) {
    url += `?name=${permissionSearch}`;
  }
  return apiMethod('get', url);
};

export const handlePostUserRole = async (payload) => {
  return apiMethod('post', ENDPOINTS.postUserRole, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePutUserRole = async (payload, id) => {
  return apiMethod('put', ENDPOINTS.putOrDeleteUserRole(id), payload, {
    'Content-Type': 'application/json',
  });
};

export const handleDeleteUserRole = async (id) => {
  return apiMethod(
    'delete',
    ENDPOINTS.putOrDeleteUserRole(id),
    {},
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handlePostAddUser = async (payload) => {
  return apiMethod('post', ENDPOINTS.postAddUser, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePutUser = async (payload, id) => {
  return apiMethod('put', ENDPOINTS.putUpdateUser(id), payload, {
    'Content-Type': 'application/json',
  });
};

export const handleDeleteUser = async (id) => {
  return apiMethod(
    'delete',
    ENDPOINTS.deleteUser(id),
    {},
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handlePostUserPermission = async (payload) => {
  return apiMethod('post', ENDPOINTS.postUserPermission, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePutUserPermission = async (payload, id) => {
  return apiMethod('put', ENDPOINTS.putOrDeleteUserPermission(id), payload, {
    'Content-Type': 'application/json',
  });
};

export const handleDeleteUserPermission = async (id) => {
  return apiMethod(
    'delete',
    ENDPOINTS.putOrDeleteUserPermission(id),
    {},
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handleGetTestCategories = async () => {
  return apiMethod('get', ENDPOINTS.getTestCategories);
};

export const handleEmpReferralDetails = async (id, options) => {
  const { currentPage, itemsPerPage, activeSearchKey } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getEmpReferrerDetails(id)}&page=${currentPage - 1}&limit=${itemsPerPage}&phoneNo=${activeSearchKey}`,
  );
};

export const handleEmpReferralEarnDetails = async (id, type) => {
  return apiMethod('get', ENDPOINTS.getEmpReferrerEarnDetails(id, type));
};
export const handleEmpCandidateReferralEarnDetails = async (
  id,
  candidateId,
  type,
) => {
  return apiMethod(
    'get',
    ENDPOINTS.getEmpCandidateReferrerEarnDetails(id, candidateId, type),
  );
};

export const handleGetAllPayouts = async (options) => {
  const { currentPage, itemsPerPage, filterKeys } = options;
  let url = `${ENDPOINTS.getAllPayouts}?page=${currentPage}&limit=${itemsPerPage}${filterKeys?.length > 0 ? filterKeys : ''}`;

  return apiMethod('get', url);
};

export const handleGetPayoutDetails = async (id) => {
  return apiMethod('get', ENDPOINTS.getPayoutDetails(id));
};

export const handlePostChangePayoutStatus = async (payload, id) => {
  return apiMethod('post', ENDPOINTS.changePayoutStatus(id), payload, {
    'Content-Type': 'application/json',
  });
};

export const handleEmployerDetails = async (id) => {
  return apiMethod('get', ENDPOINTS.getEmployerDetails(id));
};

export const handleEmployerDocPostRemarks = async (payload) => {
  return apiMethod('post', ENDPOINTS.employerDocPostRemarks, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePutUpdateEmployerStatus = async (employerId, payload) => {
  return apiMethod(
    'put',
    ENDPOINTS.putUpdateEmployerStatus(employerId),
    payload,
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handleGetAllEmployer = async (options) => {
  const { currentPage, itemsPerPage, searchId, filterKeys } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getAllEmployer}?pageNo=${currentPage}&pageSize=${itemsPerPage}&searchId=${searchId}${filterKeys?.length > 0 ? filterKeys : ''}`,
  );
};

export const handleGetAllStaff = async (options) => {
  const { searchId, currentPage, itemsPerPage, filterKeys, staffingAgencyId } =
    options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getAllStaff}?staffingAgencyId=${staffingAgencyId}&pageNo=${currentPage}&pageSize=${itemsPerPage}&searchId=${searchId}${filterKeys?.length > 0 ? filterKeys : ''}`,
  );
};
export const handleGetAllJobs = async (options) => {
  const { currentPage, itemsPerPage, filterKeys } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getEmployerJobs}?pageNo=${currentPage}&pageSize=${itemsPerPage}${filterKeys?.length > 0 ? filterKeys : ''}`,
  );
};
export const handleGetEmployerJobs = async (options) => {
  const { currentPage, itemsPerPage, filterKeys, employerId } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getEmployerJobs}?employerId=${employerId}&pageNo=${currentPage}&pageSize=${itemsPerPage}${filterKeys?.length > 0 ? filterKeys : ''}`,
  );
};

export const handleGetEarnings = async (payload) => {
  const { companySize, branch } = payload;
  return apiMethod(
    'get',
    `${ENDPOINTS.getEarnings}?companySize=${companySize}&branch=${branch}`,
  );
};

export const handlePostAddEmployer = async (payload) => {
  return apiMethod('post', ENDPOINTS.postAddUser, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePostInitiateRefund = async (payload, id) => {
  return apiMethod('post', ENDPOINTS.postInitiateRefund(id), payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePutPanDetails = async (payload) => {
  return apiMethod('post', ENDPOINTS.putPanDetails, payload, {
    'Content-Type': 'application/json',
  });
};

export const handleUploadAndDeleteAgreement = async (payload, id) => {
  return apiMethod('put', ENDPOINTS.putUpdateEmployerStatus(id), payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePutTrueIDDetails = async (payload) => {
  return apiMethod('put', ENDPOINTS.trueIDDetails, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePostAddJob = async (payload) => {
  return apiMethod('post', ENDPOINTS.postAddJob, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePutAddJob = async (payload) => {
  return apiMethod('put', ENDPOINTS.postAddJob, payload, {
    'Content-Type': 'application/json',
  });
};

export const handleWebsiteDomainCheck = async (domain) => {
  return apiMethod('get', ENDPOINTS.getWebsiteDomainVerification(domain));
};

export const handleGetGlobalEmployerData = async () => {
  return apiMethod('get', ENDPOINTS.getGlobalEmployerData);
};

export const handleGetJobById = async (id) => {
  return apiMethod('get', ENDPOINTS.getJobById(id));
};

export const handleGetJobCategories = async () => {
  return apiMethod('get', ENDPOINTS.getJobCategories);
};

export const handleGetApplicantDetails = async (id) => {
  return apiMethod('get', ENDPOINTS.getApplicantDetails(id));
};

export const handlePutApplicantStatus = async (id, payload) => {
  return apiMethod('put', ENDPOINTS.putApplicantStatus(id), payload, {
    'Content-Type': 'application/json',
  });
};

export const handleGetApplications = async (options) => {
  const { currentPage, itemsPerPage, jobId, filterKeys } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getAllApplications}?jobId=${jobId}&pageNo=${currentPage}&pageSize=${itemsPerPage}&status=${APPLICATION_STATUS.status}${filterKeys?.length > 0 ? filterKeys : ''}`,
  );
};

export const handleGetAllFieldAgents = async () => {
  return apiMethod(
    'get',
    `${ENDPOINTS.getAllUsers}?userReferrence=FIELD_AGENT`,
  );
};

export const handlegetCityStateByPincode = async (pincode) => {
  return apiMethod('get', ENDPOINTS.getCityStateByPincode(pincode));
};

export const handleGetCompanyDetails = async (options) => {
  const { documentNumber, documentType } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getCompanyDetailsByDocumentNo}?documentType=${documentType}&documentNumber=${documentNumber}`,
  );
};

export const handleGetUserBasicDetails = async (id) => {
  return apiMethod('get', ENDPOINTS.getUserBasicDetails(id));
};

export const handleGetCustomerDeviceInfo = async (userId) => {
  return apiMethod('get', ENDPOINTS.getCustomerDeviceInfo(userId));
};

export const handleGetCustomerLoggedInMobileInfo = async (macAddress) => {
  return apiMethod('get', ENDPOINTS.getCustomerLoggedInMobileInfo(macAddress));
};

export const handlePutCustomerUnblockStatus = async (payload) => {
  return apiMethod('put', ENDPOINTS.putCustomerUnblockStatus, payload, {
    'Content-Type': 'application/json',
  });
};

export const handleDeviceUnblockStatus = async (payload) => {
  return apiMethod('put', ENDPOINTS.putDeviceUnblockStatus, payload, {
    'Content-Type': 'application/json',
  });
};

export const handleDownloadEmployerJobs = async (options) => {
  const { currentPage, itemsPerPage, filterKeys, employerId, downloadCsv } =
    options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getEmployerJobs}?employerId=${employerId}&pageNo=${currentPage}&pageSize=${itemsPerPage}&csvFile=${downloadCsv}${filterKeys?.length > 0 ? filterKeys : ''}`,
  );
};

export const handlePutCustomerProfile = async (payload) => {
  return apiMethod('put', ENDPOINTS.putUpdateCustomerProfile, payload, {
    'Content-Type': 'application/json',
  });
};

export const handleGetTrueIdStaticData = async () => {
  return apiMethod('get', ENDPOINTS.getTrueIdStaticData);
};

export const handleGetJobReelGlobalData = async () => {
  return apiMethod('get', ENDPOINTS.getJobReelGlobalData);
};

export const handlePostCreditsPackageData = async (
  employerId,
  productId,
  payload,
) => {
  return apiMethod(
    'post',
    ENDPOINTS.postCreditsPackageData(employerId, productId),
    payload,
    {
      'Content-Type': 'application/json',
    },
  );
};

export const handleGetSubscriptionData = async () => {
  return apiMethod('get', ENDPOINTS.getSubscriptionData);
};

export const handleGetLedgerData = async (options) => {
  const { currentPage, itemsPerPage, employerId } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getLedgerData}?employerId=${employerId}&pageNo=${currentPage}&pageSize=${itemsPerPage}`,
  );
};

export const handleGetAllCustomerApplications = async (options) => {
  const { currentPage, itemsPerPage, customerId } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.getAllCustomerApplications}?customerId=${customerId}&pageNo=${currentPage}&pageSize=${itemsPerPage}&status=${APPLICATION_STATUS.status}`,
  );
};

export const handleGetAllCampaigns = async (options) => {
  const { currentPage, itemsPerPage } = options;
  return apiMethod(
    'get',
    `${ENDPOINTS.campaignDetails}?pageNo=${currentPage}&pageSize=${itemsPerPage}`,
  );
};

export const handlePostCampaign = async (payload) => {
  return apiMethod('post', ENDPOINTS.campaignDetails, payload, {
    'Content-Type': 'application/json',
  });
};

export const handlePostUploadCampaign = async (payload) => {
  return apiMethod('post', ENDPOINTS.uploadCampaignsCsv, payload, {
    'Content-Type': 'multipart/form-data',
  });
};

export const handleGetAutoSuggestedData = async (jobreelId) => {
  return apiMethod('get', ENDPOINTS.getAutoSuggestedData(jobreelId));
};
