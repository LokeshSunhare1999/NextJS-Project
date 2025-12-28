import { useState } from 'react';

export const COMPANY_NAME_MAX_LIMIT = 100;
export const EMPLOYER_DEFAULT_MIN = 1;
export const DELAY_TIME = 3000;
export const COMPANY_SIZE_MAX_LIMIT = 1000000;

export const NUMERIC_PATTERN = /^\d+$/;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const MAX_JOB_VIDEO_FILE_SIZE_MB = 100;
export const MAX_JOB_VIDEO_FILE_DURATION_SEC = 60;
export const DOMAIN_MAX_LENGTH = 255;
export const MAX_JOB_DOC_FILE_SIZE_MB = 10;
export const MAX_CHAR_LIMIT = 1000;

export const companyTypeList = [
  'Public Limited',
  'Pvt Ltd',
  'LLP',
  'Partnership',
  // 'Propreitership',
];
export const daysList = ['10 days', '15 days', '30 days'];
export const weeksList = ['1st week', '2nd week', '3rd week', '4th week'];
export const jobTypes = [
  { key: 'FULL_TIME', value: 'Full Time' },
  { key: 'PART_TIME', value: 'Part Time' },
  { key: 'REMOTE_FULL_TIME', value: 'Remote - Full Time' },
  { key: 'REMOTE_PART_TIME', value: 'Remote - Part Time' },
  { key: 'CONTRACT', value: 'Contract' },
  { key: 'GIG_WORK', value: 'Gig Work' },
];
export const genderPreference = [
  { key: 'MALE', value: 'Male' },
  { key: 'FEMALE', value: 'Female' },
  // { key: 'TRANSGENDER', value: 'Transgender' },
];
export const isAgeMinReq = ['Yes', 'No'];

export const JOB_STATUS_MAP = {
  IN_REVIEW: 'In-Review',
  PUBLISHED: 'Published',
  EXPIRED: 'Expired',
  PAUSED: 'Paused',
  REJECTED: 'Rejected',
};

export const daysListMap = {
  '10 days': 10,
  '15 days': 15,
  '30 days': 30,
};
export const weekListMap = {
  '1st week': 0,
  '2nd week': 1,
  '3rd week': 2,
  '4th week': 3,
};
export const companyTypeMap = {
  'Pvt Ltd': 'PRIVATE_LIMITED',
  LLP: 'LIMITED_LIABILITY_PARTNERSHIP',
  Partnership: 'PARTNERSHIP',
  Proprietorship: 'PROPRIETORSHIP',
  Freelancer: 'FREELANCER',
  OPC: 'OPC',
  'Public Limited': 'PUBLIC_LIMITED',
};

export const EMPLOYER_TAB_HEADERS = ['Profile', 'Referral', 'Staff'];
export const DIRECT_REC_AGENCY_TAB_HEADERS = ['Profile', 'Jobs', 'Payment'];
export const EMPLOYER_TAB_MAP = {
  profile: 0,
  referral: 1,
  staff: 2,
};
export const PAYOUT_REQUEST_TAB_HEADERS = [
  'Amount breakup',
  'Referral breakup',
];

export const emploerDetailsData = {
  firstName: 'Aman',
  lastName: 'Kumar',
  'Phone No.': '+91 98787XXXXX',
  emailId: 'aman.kumar@gmail.com',
  address: 'Noida Sector 27, B - Block, C - 72, Uttar Pradesh, - 201309',
  companyType: 'Pvt LTD',
  companyName: 'ABC Private Limited',
  createdOn: '12 June 2023',
  createdAt: '10:45 AM',
};

export const EMPLOYER_BUSINESS_VERIFICATION_WORKFLOW = {
  gst: {
    WORKFLOW: 'GST_VERIFICATION',
    STATUS_KEY: 'gstVerification',
    TYPE: 'GST',
  },
  llpin: {
    WORKFLOW: 'LLPIN_VERIFICATION',
    STATUS_KEY: 'llpinVerification',
    TYPE: 'LLPIN',
  },
  pan: {
    WORKFLOW: 'PAN_VERIFICATION',
    STATUS_KEY: 'panVerification',
    TYPE: 'PAN',
  },
  cin: {
    WORKFLOW: 'CIN_VERIFICATION',
    STATUS_KEY: 'cinVerification',
    TYPE: 'CIN',
  },
  aadhaar: {
    WORKFLOW: 'AADHAAR_VERIFICATION',
    STATUS_KEY: 'aadhaarVerification',
    TYPE: 'AADHAAR',
  },
};

export const BUSINESS_VERIFICATION_HEADERS = [
  'Verification Type',
  'Document No.',
  'Last Updated Date',
  'Verification Status',
];

export const BUSINESS_VERIFICATION_HEADERS_UPLOAD = [
  'Verification Type',
  'Document No.',
  'Uploaded File',
  'Last Updated Date',
  'Verification Status',
];

export const BUSINESS_VERIFICATION_HEADERS_TYPE = [
  'TEXT',
  'TEXT',
  'DATE_TIME',
  'DOCUMENT_VERIFICATION_TAG',
];

export const BUSINESS_VERIFICATION_HEADERS_TYPE_UPLOAD = [
  'TEXT',
  'TEXT',
  'UPLOADED_FILE',
  'DATE_TIME',
  'DOCUMENT_VERIFICATION_TAG',
];
export const BANK_HEADERS = [
  'Account Holder Name',
  'Bank Name',
  'Account no.',
  'Verification Status',
];

export const BANK_HEADERS_TYPE = [
  'TEXT',
  'TEXT',
  'TEXT',
  'DOCUMENT_VERIFICATION_TAG',
];
export const AGREEMENT_HEADERS = ['Signing Status', 'Date'];

export const AGREEMENT_HEADERS_TYPE = ['TEXT', 'DATE_TIME'];

export const REFERRAL_HEADERS = ['Degree', 'Count', 'Earning'];

export const REFERRAL_HEADERS_TYPE = ['DEGREE', 'TEXT', 'AMOUNT'];
export const BUSINESS_VERIFICATION_LINKS = {
  GST: '',
};

export const BUSINESS_TYPES = {
  GST: 'GST',
  CIN: 'CIN',
  PAN: 'PAN',
  LLPIN: 'LLPIN',
  AADHAAR: 'AADHAAR',
};

export const BUSINESS_VERIFICATION_TEXTS = {
  gst: {
    TITLE: 'GST Verification',
    SUB_TITLE: 'GST Number Verification',
  },
  cin: {
    TITLE: 'CIN Verification',
    SUB_TITLE: 'CIN Status',
  },
  pan: {
    TITLE: 'PAN Verification',
    SUB_TITLE: 'PAN Status',
  },
  llpin: {
    TITLE: 'LLPIN Verification',
    SUB_TITLE: 'LLPIN Status',
  },
  aadhaar: {
    TITLE: 'AADHAAR Verification',
    SUB_TITLE: 'AADHAAR Status',
  },
};

export const TEST_OBJ_ERROR_STRUCTURE = {
  testName: false,
  testCategory: false,
};
export const DISPOSABLE_MAILS = [
  'mailinator.com',
  'yopmail.com',
  'guerrillamail.com',
  '10minutemail.com',
  'trashmail.com',
  'maildrop.cc',
  'temp-mail.org',
  'throwawaymail.com',
  'fakeinbox.com',
  'emailondeck.com',
];
export const MIN_QUALIFICATION_LIST = [
  '10th Pass',
  '12th Pass',
  'Graduate',
  'ITI',
  'Diploma',
  'Postgraduate',
  'Not Required',
];
export const agencyType = {
  DIRECT_EMPLOYER: 'Employer',
  RECRUITMENT_AGENCY: 'Rec. Agency',
  STAFFING_AGENCY: 'Staffing',
  FACILITY_MANAGEMENT: 'Facility',
};

export const agencyTypeStyles = {
  DIRECT_EMPLOYER: {
    bgColor: '#F8F6D9',
    textColor: '#E18B00',
  },
  RECRUITMENT_AGENCY: {
    bgColor: '#E4FFFA',
    textColor: '#008C72',
  },
  STAFFING_AGENCY: {
    bgColor: '#E5EDF9',
    textColor: '#0048AD',
  },
  FACILITY_MANAGEMENT: {
    bgColor: '#E5EDF9',
    textColor: '#0048AD',
  },
};

export const COMPANY_FORM_DETAILS = {
  companyName: '',
  workPhone: '',
  title: '',
  firstName: '',
  brandName: '',
  companySize: '',
  // signUpPhoneNumber: '',
  // communicationPhoneNumber: '',
  companyLogoUrl: '',
  lastName: '',
  registrationType: '',
  companyWebsiteURL: '',
  isAutoShortList: true,
  CIN: '',
  GSTIN: '',
  LLPIN: '',
  PAN: '',
  AADHAAR: '',
  CINUrl: '',
  GSTINUrl: '',
  LLPINUrl: '',
  PANUrl: '',
  AADHAARUrl: '',
  address1: '',
  address2: '',
  pincode: '',
  city: '',
  state: '',
};

export const APPLICATION_STATUS = {
  status:
    'APPLIED,SHORTLISTED,INTERVIEW_STARTED,INTERVIEW_LAPSED,INTERVIEW_COMPLETED,SCREENING_REJECTED,INTERVIEW_REJECTED,HIRED,ONBOARDED,INTERVIEW_UNDER_EVALUATION',
};

export const TYPE_CHECKBOXES = [
  {
    key: 'STAFFING_AGENCY',
    value: 'Staffing',
    checked: false,
  },
  { key: 'FACILITY_MANAGEMENT', value: 'Facility', checked: false },
  { key: 'RECRUITMENT_AGENCY', value: 'Recruitment Agency', checked: false },
  { key: 'DIRECT_EMPLOYER', value: 'Direct Employer', checked: false },
];
export const VERIFICATION_CHECKBOXES = [
  { key: 'VERIFIED', value: 'Verified', checked: false },
  { key: 'PENDING', value: 'Pending', checked: false },
  { key: 'REJECTED', value: 'Rejected', checked: false },
];
export const ACTIVATION_CHECKBOXES = [
  {
    key: 'ACTIVATED',
    value: 'Activated',
    checked: false,
  },
  {
    key: 'PENDING',
    value: 'Pending',
    checked: false,
  },
];

export const STAFF_CHECKBOXES = [
  { key: 'SIGNED_UP', value: 'Signed Up', checked: false },
  {
    key: 'PENDING',
    value: 'Verification Pending',
    checked: false,
  },
  { key: 'COMPLETED', value: 'True ID Created', checked: false },
];

export const DEFAULT_REF_BRANCH = 5;

export const LOGO_TEXT = {
  INITIAL: 'Upload Logo',
  PENDING: 'Uploading',
  SUCCESS: 'Change Logo',
};
