export const ENDPOINTS = Object.freeze({
  postIdentity: () => `/identity/api/v1/guest/`,
  sendOtp: () => `/user/api/v1/login/send/otp`,
  verifyOtp: () => `/user/api/v1/login/verify/otp`,
  getEmployerJobs: `/staffingAgency/api/v1/job`,
  getJobById: (id) => `/staffingAgency/api/v1/job/${id}`,
  getJobApplications: () =>
    `/staffingAgency/api/v1/job/employer/jobApplications`,
  putJobApplication: () => `/customer/api/v1/jobs/updateStatus`,
  getEmployerDetails: `/staffingAgency/api/v1/agency/userId`,
  getGlobalEmployerData: `/global/api/v1/data?name=EMPLOYER_CREATION_HEADERS`,
  getCompanyDetailsByDocumentNo: `/customer/api/v1/hyperverge/verifyDocument`,
  putUpdateEmployerStatus: (id) => `/staffingAgency/api/v1/?id=${id}`,
  getJobCategories: `/global/api/v1/data?name=JOB_CATEGORY_AND_SALARY_RANGES`,
  postAddJob: () => "/staffingAgency/api/v1/job",
  getJobCategories: () =>
    `/global/api/v1/data?name=JOB_CATEGORY_AND_SALARY_RANGES`,
  uploadToS3: (filePath, type) =>
    `/utils/api/v1/aws/uploadFile?filePath=${filePath}&type=${type}`,
  getPaymentStatus: (id) => `/payment/api/v1/paymentStatus/${id}`,
  createOrder: (id) => `/order/api/v1?userId=${id}`,
  createPayment: () => `/payment/api/v1/createPayment`,
  verifyVPA: () => `/payment/api/v1/verifyVPA`,
  creditActivityDetails: (id) =>
    `/staffingAgency/api/v1/employer/ledger?employerId=${id}`,
  getCreditsPackages: () => `/staffingAgency/api/v1/employer/packages`,
  getEmployerSubscription: () => `/subscription/api/v1/employer`,
  getCityStateByPincode: (pincode) =>
    `/utils/api/v1/stateCity?pincode=${pincode}`,
  putBulkStatusUpdate: () => `/customer/api/v1/jobs/bulkStatusUpdate`,
  getAvailableJobStatus: (id) =>
    `/staffingAgency/api/v1/job/employer/${id}/availableJobStatus`,
  getAvailableJobCategories: (id) =>
    `/staffingAgency/api/v1/job/employer/${id}/availableJobCategories`,
  getAvailableJobLocations: (id) =>
    `/staffingAgency/api/v1/job/employer/${id}/availableJobLocations`,
  getAvailableBrandNames: (id) =>
    `/staffingAgency/api/v1/job/employer/${id}/availableBrandNames`,
  postDailyApplicationCount: () =>
    "/staffingAgency/api/v1/job/employer/dailyApplicationCount",
  getInvoicesData: (id) => `/order/api/v1/invoice/employer/${id}`,
});
