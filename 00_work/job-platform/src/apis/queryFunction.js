import { ENDPOINTS } from "./endpoints";

import apiMethod from "./apiMethod";

export const handlePostSendOtp = async (payload, options) => {
  return apiMethod("post", ENDPOINTS?.sendOtp(), payload, {
    Authorization: options?.guestToken ? `Bearer ${options?.guestToken}` : null,
  });
};

export const handlePostIdentity = async (payload) => {
  return apiMethod("post", ENDPOINTS?.postIdentity(), payload);
};

export const handlePostVerifyOtp = async (payload, options) => {
  return apiMethod("post", ENDPOINTS?.verifyOtp(), payload, {
    Authorization: options?.guestToken ? `Bearer ${options?.guestToken}` : null,
  });
};

export const handleGetEmployerJobs = async (options) => {
  const {
    employerId,
    jobStatus,
    pageNo,
    pageSize,
    jobCategory,
    jobLocation,
    brandName,
    sortParam,
  } = options;
  let url = `${ENDPOINTS.getEmployerJobs}?employerId=${employerId}`;
  if (jobStatus) {
    url += `&jobStatus=${jobStatus}`;
  }
  if (jobCategory) {
    url += `&jobCategory=${jobCategory}`;
  }
  if (jobLocation) {
    url += `&jobLocation=${jobLocation}`;
  }
  if (brandName) {
    url += `&brandName=${brandName}`;
  }
  if (sortParam) {
    url += `&sortParam=${sortParam}`;
  }

  return apiMethod("get", `${url}&pageNo=${pageNo}&pageSize=${pageSize}`);
};
export const handleGetJobById = async (id) => {
  return apiMethod("get", ENDPOINTS.getJobById(id));
};

export const handleGetJobApplications = async (jobId, options) => {
  const { status, pageNo, pageSize } = options;
  return apiMethod(
    "get",
    `${ENDPOINTS.getJobApplications(
      jobId
    )}?status=${status}&jobId=${jobId}&pageNo=${pageNo}&pageSize=${pageSize}`
  );
};

export const handlePutJobApplication = async (payload) => {
  const { customerJobId, jobId } = payload;
  return apiMethod(
    "put",
    `${ENDPOINTS.putJobApplication(jobId)}?customerJobId=${customerJobId}`,
    payload
  );
};

export const handleGetEmployerDetails = async (options) => {
  const { userId } = options;
  return apiMethod("get", `${ENDPOINTS.getEmployerDetails}?userId=${userId}`);
};

export const handlePostAddJob = async (payload) => {
  return apiMethod("post", ENDPOINTS.postAddJob(), payload, {
    "Content-Type": "application/json",
  });
};

export const handlePutAddJob = async (payload) => {
  return apiMethod("put", ENDPOINTS.postAddJob(), payload, {
    "Content-Type": "application/json",
  });
};

export const handleGetJobCategories = async () => {
  return apiMethod("get", ENDPOINTS.getJobCategories());
};

export const handlePostUploadToS3 = async (payload, signal, filePath, type) => {
  return apiMethod(
    "post",
    ENDPOINTS.uploadToS3(filePath, type),
    payload,
    {
      "Content-Type": "multipart/form-data",
    },
    {},
    signal
  );
};

export const handleGetGlobalEmployerData = async () => {
  return apiMethod("get", ENDPOINTS.getGlobalEmployerData);
};

export const handleGetCompanyDetails = async (options) => {
  const { documentNumber, documentType } = options;
  return apiMethod(
    "get",
    `${ENDPOINTS.getCompanyDetailsByDocumentNo}?documentType=${documentType}&documentNumber=${documentNumber}`
  );
};

export const handlePutUpdateEmployerStatus = async (employerId, payload) => {
  return apiMethod(
    "put",
    ENDPOINTS.putUpdateEmployerStatus(employerId),
    payload,
    {
      "Content-Type": "application/json",
    }
  );
};

export const handleGetPaymentStatus = async (id) => {
  return apiMethod(
    "get",
    `${ENDPOINTS?.getPaymentStatus(id)}?paymentgateway=juspay`
  );
};

export const handlePostCreateOrder = async (id, payload) => {
  return apiMethod("post", ENDPOINTS?.createOrder(id), payload);
};

export const handlePostCreatePayment = async (payload) => {
  return apiMethod(
    "post",
    `${ENDPOINTS?.createPayment()}?paymentgateway=juspay`,
    payload
  );
};

export const handlePostVerifyVPA = async (payload) => {
  return apiMethod(
    "post",
    `${ENDPOINTS?.verifyVPA()}?paymentgateway=juspay`,
    payload
  );
};

export const handleGetCreditActivityDetails = async (id, options) => {
  const { pageNo, pageSize } = options;
  return apiMethod(
    "get",
    `${ENDPOINTS?.creditActivityDetails(
      id
    )}&pageNo=${pageNo}&pageSize=${pageSize}`
  );
};

export const handleGetCreditsPackages = async () => {
  return apiMethod("get", ENDPOINTS?.getCreditsPackages());
};

export const handleGetEmployerSubscription = async () => {
  return apiMethod("get", ENDPOINTS?.getEmployerSubscription());
};

export const handlegetCityStateByPincode = async (pincode) => {
  return apiMethod("get", ENDPOINTS.getCityStateByPincode(pincode));
};
export const handlePutBulkStatusUpdate = async (payload) => {
  return apiMethod("put", ENDPOINTS?.putBulkStatusUpdate(), payload, {
    "Content-Type": "application/json",
  });
};

export const handleGetAvailableJobStatus = async (id) => {
  return apiMethod("get", ENDPOINTS?.getAvailableJobStatus(id));
};

export const handleGetAvailableJobCategories = async (id, options = {}) => {
  const { jobStatus, jobLocation, brandName } = options;

  const baseUrl = ENDPOINTS.getAvailableJobCategories(id);

  const params = new URLSearchParams();

  if (jobStatus) params.append("jobStatus", jobStatus);
  if (jobLocation) params.append("jobLocation", jobLocation);
  if (brandName) params.append("brandName", brandName);

  const url = `${baseUrl}?${params.toString()}`;

  return apiMethod("get", url);
};

export const handleGetAvailableJobLocations = async (id, options = {}) => {
  const { jobStatus, jobCategory, brandName } = options;

  const baseUrl = ENDPOINTS.getAvailableJobLocations(id);
  const params = new URLSearchParams();

  if (jobStatus) params.append("jobStatus", jobStatus);
  if (jobCategory) params.append("jobCategory", jobCategory);
  if (brandName) params.append("brandName", brandName);

  const url = `${baseUrl}?${params.toString()}`;

  return apiMethod("get", url);
};

export const handleGetAvailableBrandNames = async (id, options = {}) => {
  const { jobStatus, jobCategory, jobLocation } = options;

  const baseUrl = ENDPOINTS.getAvailableBrandNames(id);
  const params = new URLSearchParams();

  if (jobStatus) params.append("jobStatus", jobStatus);
  if (jobCategory) params.append("jobCategory", jobCategory);
  if (jobLocation) params.append("jobLocation", jobLocation);

  const url = `${baseUrl}?${params.toString()}`;

  return apiMethod("get", url);
};

export const handleGetFilteredJobs = async (id, options) => {
  const { jobStatus, jobLocation, jobCategory, brandName } = options || {};
  return apiMethod(
    "get",
    `${ENDPOINTS?.getFilteredJobs(
      id
    )}?jobStatus=${jobStatus}&jobLocation=${jobLocation}&jobCategory=${jobCategory}&brandName=${brandName}`
  );
};

export const handlePostDailyApplicationCount = async (payload) => {
  return apiMethod("post", ENDPOINTS.postDailyApplicationCount(), payload);
};

export const handleGetInvoicesData = async (id, options) => {
  const { pageNo, pageSize } = options;
  return apiMethod(
    "get",
    `${ENDPOINTS?.getInvoicesData(id)}?pageNo=${pageNo}&pageSize=${pageSize}`
  );
};
