import Job from "@/assets/icons/jobs/job.svg";
import JobActive from "@/assets/icons/jobs/jobActive.svg";
import AiRecruiter from "@/assets/icons/jobs/aiRecruiter.svg";
import UsersIcon from "@/assets/icons/jobs/usersIcon.svg";
import BillingIcon from "@/assets/icons/jobs/billingIcon.svg";
import HiresIcon from "@/assets/icons/jobs/hireIcon.svg";
import SettingsIcon from "@/assets/icons/jobs/settingsIcon.svg";
import HelpIcon from "@/assets/icons/jobs/helpIcon.svg";
import SidebarTag from "@/components/SidebarTag";

export const COMPANY_SIZE_MAX_LIMIT = 1000000;
export const EMPLOYER_DEFAULT_MIN = 1;
export const RUPEE_SYMBOL = "₹";
export const NUMBER = "number";
export const COOKIES_MAX_AGE = 24 * 60 * 60;
export const USER_TYPE = "EMPLOYER";
export const RESEND_OTP_TIMER = 30; // In Seconds
export const DOMAIN_MAX_LENGTH = 255;
export const DIRECT_EMPLOYER = "DIRECT_EMPLOYER";
export const RECRUITMENT_AGENCY = "RECRUITMENT_AGENCY";
export const NAME_MAX_LENGTH = 30;
export const BRAND_MAX_LENGTH = 50;
export const COMPANY_NAME_MAX_LENGTH = 100;
export const YEAR_MEMBERSHIP_PRICE = "₹5,000";
export const TNC_LINK = "https://terms.saathi.in/employer-tnc.html";
export const PRIVACY_POLICY_LINK =
  "https://terms.saathi.in/privacy-policy.html";
export const MIN_WIDTH_FOR_DESKTOP = 1100;
export const MIN_DAYS_FOR_BANNER = 7;
export const TITLE_OPTIONS = [
  {
    label: "Mr.",
    value: "Mr.",
  },
  {
    label: "Mrs.",
    value: "Mrs.",
  },
  {
    label: "Miss",
    value: "Miss",
  },
];

export const UPLOAD_TYPES = {
  image: "PDF, PNG, JPG, JPEG",
  document: "PDF, DOC, DOCX",
  spreadsheet: "XLS, XLSX, CSV",
};

export const salutationMap = {
  MR: "Mr.",
  MRS: "Mrs.",
  MISS: "Miss",
};

export const MAX_IMAGE_API_TIMER = 10 * 1000;
export const MAX_FILENAME_LENGTH = 15;

export const SIDEBAR_ITEMS = [
  {
    title: "Jobs",
    icon: <Job />,
    iconActive: <JobActive />,
    href: "/jobs",
  },
  // {
  //   title: "AI Recruiter",
  //   icon: <AiRecruiter />,
  //   href: "#",
  //   showTag: true,
  //   tag: <SidebarTag tag={"Coming Soon"} />,
  //   disabled: true,
  // },
  {
    title: "Users",
    icon: <UsersIcon />,
    href: "#",
    tag: <SidebarTag tag={"Coming Soon"} />,
    disabled: true,
  },
  {
    title: "Billing",
    icon: <BillingIcon />,
    href: "#",
    tag: <SidebarTag tag={"Coming Soon"} />,
    disabled: true,
  },
  {
    title: "Hires",
    icon: <HiresIcon />,
    href: "#",
    tag: <SidebarTag tag={"Coming Soon"} />,
    disabled: true,
  },
  {
    title: "Settings",
    icon: <SettingsIcon />,
    href: "#",
    tag: <SidebarTag tag={"Coming Soon"} />,
    disabled: true,
  },
];

export const BOTTOM_MENU = [
  {
    title: "Help & Support",
    icon: <HelpIcon />,
    href: "https://saathi-assist.freshdesk.com/support/solutions",
    target: "_blank",
    // tag: <SidebarTag tag={"Coming Soon"} />,
    // disabled: true,
  },
];

export const APPLICATION_STAGES = [
  {
    key: "applied",
    label: "Applications to Review",
    redirectTo: "0",
    pill: "JobReel",
    totalCountKey: "totalApplied",
    totalCountLabel: "Total Applications",
  },
  {
    key: "interview",
    label: "Interviews to Review",
    redirectTo: "1",
    pill: "Ai Recruiter",
    totalCountKey: "totalShortlisted",
    totalCountLabel: "Total Interviews",
  },
  { key: "hired", label: "Finalised", redirectTo: "2", pill: null },
];

export const JOB_BAR_STATES = {
  PENDING: {
    bgColor: "#8196FF",
    message:
      "Business verification is in progress -we’ll notify you once it’s done",
    ctaText: "",
    showButton: false,
  },
  REJECTED: {
    bgColor: "#FF5656",
    message: "Your Business verification has been rejected",
    ctaText: "Try Again",
    showButton: true,
    route: "/account-verification?try-again=true",
  },
  NOT_INITIATED: {
    bgColor: "#FF5656",
    message:
      "Need Action: Your job post is not live yet. Complete your profile now to make it live",
    ctaText: "Verify account",
    showButton: true,
    route: "/account-verification",
  },
  NEED_ACTION_VIEW_VIDEO: {
    bgColor: "#FF5656",
    message: "Need Action : Verify the video to make your job live",
    ctaText: "View Video",
    showButton: true,
  },
  UPDATE: {
    bgColor: "#8196FF",
    message:
      "Update : Video creation in progress (Job video will be available in the next 4-6 hours)",
    ctaText: "",
    showButton: false,
  },
};

export const jobTypes = {
  FULL_TIME: "Full Time",
  PART_TIME: "Part Time",
  CONTRACT: "Contract",
  TEMPORARY: "Temporary",
  INTERNSHIP: "Internship",
};

export const jobApplicationsMap = {
  0: "APPLIED",
  1: "SHORTLISTED",
  3: "HIRED",
};

export const COMPANY_TYPE_LIST = [
  {
    label: "Public Limited",
    value: "Public Limited",
  },
  {
    label: "Pvt Ltd",
    value: "Pvt Ltd",
  },
  {
    label: "LLP",
    value: "LLP",
  },
  {
    label: "Partnership",
    value: "Partnership",
  },
  {
    label: "Proprietorship",
    value: "Proprietorship",
  },
  {
    label: "Freelancer",
    value: "Freelancer",
  },
  {
    label: "OPC",
    value: "OPC",
  },
];

export const EMP_REG_TYPE = [
  "Public Limited",
  "Pvt Ltd",
  "LLP",
  "Partnership",
  "Proprietorship",
  "Freelancer",
  "OPC",
];

export const EMPLOYER_TYPE_OPTIONS = [
  {
    label: "Employer",
    value: "DIRECT_EMPLOYER",
  },
  {
    label: "Rec. Agency",
    value: "RECRUITMENT_AGENCY",
  },
];

export const LOGO_TEXT = {
  INITIAL: "Upload Logo",
  PENDING: "Uploading",
  SUCCESS: "Change Logo",
};

export const ACCOUNT_FORM_DETAILS = {
  companyName: "",
  workEmail: "",
  title: "",
  firstName: "",
  brandName: "",
  companySize: "",
  // signUpPhoneNumber: '',
  // communicationPhoneNumber: '',
  companyLogoUrl: "",
  lastName: "",
  registrationType: "",
  employersAgencyType: "",
  companyWebsiteURL: "",
  CIN: "",
  GSTIN: "",
  LLPIN: "",
  PAN: "",
  AADHAAR: "",
  CINUrl: "",
  GSTINUrl: "",
  LLPINUrl: "",
  PANUrl: "",
  AADHAARUrl: "",
  address1: "",
  address2: "",
  pincode: "",
  city: "",
  state: "",
};
// need to update according to API payload
export const ACCOUNT_INFO = {
  companyRegisteredName: "",
  location: {},
  employersAgencyType: "",
  pincode: "",
  city: "",
  state: "",
};

export const MAX_LENGTHS = {
  CIN: 21,
  GSTIN: 15,
  PAN: 10,
  LLPIN: 8,
  AADHAAR: 12,
  ADDRESS: 30,
  PIN_CODE: 6,
  CITY: 30,
};
export const CURRENT_JOB_PAGE = 1;
export const JOBS_PER_PAGE = 10;

export const registrationTypeMap = {
  PROPRIETORSHIP: "Proprietorship",
  LIMITED_LIABILITY_PARTNERSHIP: "LLP",
  PARTNERSHIP: "Partnership",
  PRIVATE_LIMITED: "Pvt Ltd",
  FREELANCER: "Freelancer",
  OPC: "OPC",
  PUBLIC_LIMITED: "Public Limited",
};

export const companyTypeMap = {
  "Pvt Ltd": "PRIVATE_LIMITED",
  LLP: "LIMITED_LIABILITY_PARTNERSHIP",
  Partnership: "PARTNERSHIP",
  Proprietorship: "PROPRIETORSHIP",
  Freelancer: "FREELANCER",
  OPC: "OPC",
  "Public Limited": "PUBLIC_LIMITED",
};
export const INTERVIEW_TOTAL_SCORE = 500;
export const PROFILE_TOTAL_SCORE = 500;

export const jobTypesPills = [
  { value: "FULL_TIME", label: "Full Time" },
  { value: "PART_TIME", label: "Part Time" },
  { value: "REMOTE_FULL_TIME", label: "Remote - Full Time" },
  { value: "REMOTE_PART_TIME", label: "Remote - Part Time" },
  { value: "CONTRACT", label: "Contract" },
  { value: "GIG_WORK", label: "Gig Work" },
];

export const genderPreference = [
  { value: "MALE", label: "Male" },
  { value: "FEMALE", label: "Female" },
];

export const minQualificationsEnums = [
  { key: "10th Pass", value: "10th Pass" },
  { key: "12th Pass", value: "12th Pass" },
  { key: "Graduate", value: "Graduate" },
  { key: "ITI", value: "ITI" },
  { key: "Diploma", value: "Diploma" },
  { key: "Postgraduate", value: "Postgraduate" },
  { key: "Not Required", value: "Not Required" },
];
export const MIN_AGE = 14;
export const MAX_AGE = 99;

export const ageRequiredOptions = [
  { label: "Yes", value: "Yes" },
  { label: "No", value: "No" },
];

export const FILE_TYPES = {
  IMAGE: "image",
  VIDEO: "video",
  DOCUMENT: "document",
  AUDIO: "audio",
  CUSTOMER_VIDEO: "customer_video",
};

export const BENEFITS_LENGTH = 30;
export const REQUIREMENTS_LENGTH = 500;

export const JOB_STATUS_MAP = {
  DRAFT: "Draft",
  IN_REVIEW: "In-Review",
  PUBLISHED: "Published",
  EXPIRED: "Expired",
  PAUSED: "Paused",
  REJECTED: "Rejected",
};

export const DEFAULT_PAGE_SIZE = 20;
export const DEFAULT_PAGE_NO = 1;

export const ACCEPT_TYPES = {
  DOCUMENT: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  IMAGE: [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "image/gif",
    "image/svg+xml",
  ],
};

export const CREDIT_ACTIVITY_HEADERS = [
  {
    key: "date",
    label: "Date",
  },
  {
    key: "txnId",
    label: "Transaction Id",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "referenceId",
    label: "Reference",
  },
  {
    key: "transactionType",
    label: "Transaction Type",
  },
  {
    key: "value",
    label: "Value",
  },
  {
    key: "balance",
    label: "Balance",
  },
];

export const CREDIT_ACTIVITY_HEADERS_MWEB = [
  {
    key: "date",
    label: "Date",
  },
  {
    key: "txnId",
    label: "Transaction Id",
  },
  {
    key: "balance",
    label: "Balance",
  },
  {
    key: "description",
    label: "Description",
  },
  {
    key: "referenceId",
    label: "Reference",
  },
  {
    key: "transactionType",
    label: "Transaction Type",
  },
  {
    key: "value",
    label: "Value",
  },
];
export const SALARY_TYPES = [
  { label: "Incentive", value: "INCENTIVE" },
  { label: "Bonus", value: "BONUS" },
];

export const FREE_JOB_POST_LIMIT = 5;
export const LOGIN_BANNER_HEADER = "What you get";
export const LOGIN_BANNER_BENEFITS = [
  "Unlimited Job Posts",
  "Finalize 50 Candidates for Free",
];

export const SOURCE_TYPE = "EMPLOYER";
export const APP_VERSION = "1";
export const APP_NAME = "saathi";

export const BENEFITS = [
  { key: "Food", value: "Food" },
  { key: "Insurance", value: "Insurance" },
  { key: "Mobile Allowance", value: "Mobile Allowance" },
  { key: "Cab", value: "Cab" },
  { key: "Annual Bonus", value: "Annual Bonus" },
  { key: "Petrol Allowance", value: "Petrol Allowance" },
  { key: "Weekly Payout", value: "Weekly Payout" },
];

export const REQUIREMENTS = [
  { key: "Cycle", value: "Cycle" },
  { key: "Bike", value: "Bike" },
  { key: "Driving License", value: "Driving License" },
  { key: "Aadhaar Card", value: "Aadhaar Card" },
  { key: "PAN Card", value: "PAN Card" },
  { key: "Gun License", value: "Gun License" },
];

export const SALARY_OPTIONS = [
  { label: "Salary Range", value: "range" },
  { label: "Fixed Salary", value: "fixed" },
];

export const JOBS_SORT_OPTIONS = [
  { label: "Latest Jobs First", value: "LATEST_JOBS_FIRST" },
  { label: "Most Applications Pending", value: "MOST_APPLICATIONS_PENDING" },
  { label: "Most Interviews Done", value: "MOST_INTERVIEWS_DONE" },
  { label: "Most Candidates Finalized", value: "MOST_CANDIDATES_FINALISED" },
];

export const JOBS_FILTER_TABS = [
  {
    label: "Job Status",
    value: "JOB_STATUS",
  },
  {
    label: "Job Location",
    value: "JOB_LOCATION",
  },
  {
    label: "Job Category",
    value: "JOB_CATEGORY",
  },
  {
    label: "Brand Name",
    value: "BRAND_NAME",
  },
];
