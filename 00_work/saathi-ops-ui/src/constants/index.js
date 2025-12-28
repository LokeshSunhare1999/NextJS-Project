export const USER_TYPE = 'OPS';

export const MAX_FILENAME_LENGTH = 15;
export const MAX_IMAGE_API_TIMER = 10 * 1000;
export const MAX_VIDEO_API_TIMER = 6 * 60 * 1000;
export const COOKIES_MAX_AGE = 24 * 60 * 60;

export const SHORTENED_LENGTH = 13;

export const CAMPAIGN_TEMPLATE_URL =
  'https://saathi-prod-temp-bucket.s3.ap-south-1.amazonaws.com/campaign2-Sheet1.csv';

export const BENEFIT_STRUCTURE = {
  salaryBenefit: '',
  trainingCertificate: '',
  trainingReward: '',
};

export const COURSE_MODULE = {
  ASSESSMENT_CATEGORIES: [
    'COURSE_SUB_MODULE_LEVEL',
    'MID_COURSE_LEVEL',
    'END_COURSE_LEVEL',
  ],

  REWARD_STRUCTURE: [
    'certificateBenefits',
    'trophyBenefits',
    'badgeBenefits',
    'trainingBenefits',
  ],

  COURSE_OBJ_STRUCTURE: {
    courseTitle: '',
    courseDescription: '',
    courseCategory: '',
    price: {
      coursePrice: 0,
      displayPrice: 0,
    },
    salaryBenefit: '',
    courseIntroVideo: '',
    imageUrl: '',
    certificateBenefits: BENEFIT_STRUCTURE,
    trophyBenefits: BENEFIT_STRUCTURE,
    badgeBenefits: BENEFIT_STRUCTURE,
    trainingBenefits: BENEFIT_STRUCTURE,
  },

  COURSE_OBJ_ERROR_STRUCTURE: {
    courseTitle: false,
    courseDescription: false,
    courseCategory: false,
    coursePrice: false,
    displayPrice: false,
    salaryBenefit: false,
  },

  ASSESSMENT_OBJ_ERROR_STRUCTURE: {
    assessmentTitle: false,
    assessmentType: false,
    assessmentDescription: false,
  },

  QUESTION_TYPES: ['FUNCTIONAL', 'PSYCHOMETRIC'],

  OPTION_TYPES: {
    TEXT: 'TEXT',
    TEXT_IMAGE: 'TEXT_IMAGE',
  },

  PAGE_SIZE_OPTIUONS: [10, 20, 30, 40],

  TITLE_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 2000,
  COURSE_PRICE_MAX: 10000,
  DISPLAY_PRICE_MAX: 10000,

  DEFAULT_MAX: 500,
  DEFAULT_MIN: 0,

  PASSING_PERCENT: 0,
  DEFAULT_TIME_DIFF: 13,

  CERTIFICATE_TYPES: [
    { key: 4, value: 'LEVEL 1' },
    { key: 5, value: 'LEVEL 2' },
  ],

  DEFAULT_CERTIFICATE_TYPE: 9,
};

export const CUSTOMER_MODULE = {
  CUSTOMER_TAB_HEADERS: [
    'TrueID',
    'Applications',
    'Transactions',
    'Orders',
    'Training',
    'Referral',
    'Device',
  ],
};
export const CUSTOMERS_TAB_MAP = {
  trueid: 0,
  applications: 1,
  transactions: 2,
  orders: 3,
  training: 4,
  referral: 5,
  device: 6,
};

export const FILE_TYPES = {
  IMAGE: 'image',
  VIDEO: 'video',
  DOCUMENT: 'document',
  AUDIO: 'audio',
  CUSTOMER_VIDEO: 'customer_video',
};

export const PAYMENT_TAB_HEADERS = ['Incoming Payments', 'Refund Payments'];

export const USER_TYPE_CUSTOMER = 'CUSTOMER';

export const VIDEO_UPLOAD_STATUS = {
  IN_PROGRESS: 'IN_PROGRESS',
  COMPLETED: 'COMPLETED',
  FAILED: 'FAILED',
};

export const TEXT_MIN_SIZE = 10;

export const STATUS_KEYS = {
  NOT_INITIATED: 'NOT_INITIATED',
  PENDING: 'PENDING',
  VERIFIED: 'VERIFIED',
  REJECTED: 'REJECTED',
  OPS_VERIFIED: 'OPS_VERIFIED',
  OPS_REJECTED: 'OPS_REJECTED',
};

export const REMARKS_MIN_LIMIT = 15;
export const REMARKS_MAX_LIMIT = 1000;

export const MAX_INTRO_VIDEO_FILE_SIZE_MB = 150;
export const MAX_VIDEO_FILE_SIZE_MB = 500;

export const MAX_DOC_IMAGE_FILE_SIZE_MB = 10;

export const STATUS_VALUES = {
  NOT_INITIATED: 'Yet to Start',
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
};

export const USERS_MODULE = {
  USER_TAB_HEADERS: ['Users', 'Roles', 'Permissions'],
};

export const DEVICE_TYPES = {
  MOBILE: 'mobile',
  TABLET: 'tablet',
  DESKTOP: 'desktop',
};

export const ACCEPT_TYPE = {
  IMAGE: 'image/*',
  VIDEO: 'video/*',
  AUDIO: 'audio/*',
  DOCUMENT: 'application/pdf',
  CSV: '.csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel',
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

export const JOB_TAB = 'jobs';
export const PROFILE_TAB = 'profile';
export const PAYMENT_TAB = 'payment';

export const INCOMING_PAYMENT_FILTERS = [
  { key: 'COMPLETED', value: 'Completed', checked: false },
  { key: 'PENDING', value: 'Pending', checked: false },
  { key: 'FAILED', value: 'Failed', checked: false },
  { key: 'CANCELLED', value: 'Cancelled', checked: false },
];

export const REFUND_PAYMENT_FILTERS = [
  { key: 'COMPLETED', value: 'Completed', checked: false },
  { key: 'PENDING', value: 'Pending', checked: false },
  { key: 'FAILED', value: 'Failed', checked: false },
];

export const languageData = [
  {
    language: 'English',
    langCode: 'en',
    initial: 'A',
  },
  {
    language: 'हिंदी (Hindi)',
    langCode: 'hi',
    initial: 'अ',
  },
  {
    language: 'मराठी (Marathi)',
    langCode: 'mr',
    initial: 'म',
  },
  {
    language: 'বাংলা (Bangla)',
    langCode: 'bn',
    initial: 'ক',
  },
  {
    language: 'தமிழ் (Tamil)',
    langCode: 'ta',
    initial: 'ஏ',
  },
  {
    language: 'తెలుగు (Telugu)',
    langCode: 'te',
    initial: 'ఎ',
  },
  {
    language: 'ಕನ್ನಡ (Kannada)',
    langCode: 'kn',
    initial: 'ಎ',
  },
];

export const CATEGORY_KNOWLEDGE_MAP = {
  'Not So Skilled': 'NOT_SO_SKILLED',
  'Medium Skilled': 'MEDIUM_SKILLED',
  'Fully Skilled': 'FULLY_SKILLED',
};

export const INFO_ICON_TEXT = {
  NUDITY: 'Is there any nudity present in the video?',
  BAD_LANGUAGE: 'Did the person use any bad or abusive words?',
  NO_VIDEO: 'Was the person not available in the video',
  NO_AUDIO: 'Is there no audio in the video',
  POSTURE: 'Is the person in an informal posture?',
  OTHER_REMARKS: 'For Ad-hoc Observations',
  NAME: 'Did the person clearly say their name?',
  GENDER: 'What is the gender of the individual?',
  AGE: 'Did the person clearly say their age?',
  USER_LOCATION: 'Did the person mention where they live?',
  PREFERRED_JOB_LOCATION: 'Did the person say where they want to work?',
  EXPERIENCE_YEARS: 'Did the person mention how many years they’ve worked?',
  EXPERIENCE_FIELD: 'Did the person say what kind of work they’ve done?',
  SKILL_CATEGORY: 'Did the person say what skill or job they’re good at?',
  PREFERRED_JOB_TYPE: 'Did the person say what kind of job they want?',
  CATEGORY_KNOWLEDGE:
    'Does the person seem to know about the skills he/she mentioned?',
  SALARY: 'Did the person mention how much salary they are expecting?',
  AVAILABILITY: 'By when can the person join?',
};

export const RATING_CHECKS = [
  {
    key: 'videoVisibility',
    label: 'Video Visibility',
    options: [
      'No video at all (black screen)',
      'Face not visible at all',
      'Very difficult to see face',
      'Face is somewhat visible',
      'Face is mostly clear and visible',
      'Face is clearly visible',
    ],
  },
  {
    key: 'audioClarity',
    label: 'Audio Clarity',
    options: [
      'No sound',
      'Very hard to hear',
      'Can hear only some words',
      'Can hear with some effort',
      'Can hear clearly most of the time',
      'Very clear and easy to hear',
    ],
  },
  {
    key: 'speakingFluency',
    label: 'Speaking Fluency',
    options: [
      'No talking',
      'Hard to understand',
      'Talks very little or with long pauses',
      'Can understand, speaks a little',
      'Speaks well with small mistakes',
      'Speaks clearly and confidently',
    ],
  },
  {
    key: 'attire',
    label: 'Attire / Etiquette',
    options: [
      'Very messy look, no effort',
      'Untidy or careless look',
      'Casual but made little effort',
      'Casual but neat',
      'Looks neat and put together',
      'Looks very neat and respectful',
    ],
  },
  {
    key: 'cameraStability',
    label: 'Camera Stability',
    options: [
      'Camera not working or always shaking',
      'Very shaky, face not visible',
      'Often moves, hard to see',
      'Sometimes shaky but okay',
      'Mostly stable, face seen well',
      'Very stable and easy to see face',
    ],
  },
];

export const SOURCE_TYPE = 'EMPLOYER';
export const APP_VERSION = '1';
export const APP_NAME = 'saathi';
