export const VERIFICATION_HEADERS = [
  'Verification Types',
  'Last Updated Date',
  'Verification Status',
];

export const VERIFICATION_HEADERS_TYPE = [
  'TEXT',
  'DATE_TIME',
  'DOCUMENT_VERIFICATION_TAG',
];

export const VERIFICATION_TEXTS = {
  'live-photo': {
    TITLE: 'Live Photo Verification',
    SUB_TITLE: 'Live Photo Status',
    HEADER_STRING: 'Share a live photo verification link',
  },
  'aadhaar-verify': {
    TITLE: 'Aadhaar Card Verification',
    SUB_TITLE: 'Aadhaar Card Status',
    HEADER_STRING: 'Share an Aadhar verification link',
  },
  'aadhaar-live-photo': {
    TITLE: 'Aadhaar Card & Live Photo Verification',
    SUB_TITLE: 'Aadhaar Card & Live Photo Status',
    HEADER_STRING: 'Share an Aadhar verification link',
  },
  'dl-verify': {
    TITLE: 'Driving License Verification',
    SUB_TITLE: 'Driving License Status',
    HEADER_STRING: 'Share a DL verification link',
  },
  'dl-live-photo': {
    TITLE: 'Driving License & Live Photo Verification',
    SUB_TITLE: 'Driving License & Live Photo Status',
    HEADER_STRING: 'Share a DL verification link',
  },
  'pan-verify': {
    TITLE: 'PAN Card Verification',
    SUB_TITLE: 'PAN Card Status',
    HEADER_STRING: 'Share a Pan Card verification link',
    DOC_URL: 'panUrl',
  },
};

export const VERIFICATION_TYPES = {
  LIVENESS: 'LIVENESS',
  AADHAAR: 'AADHAAR',
  FACE_MATCH_WITH_AADHAAR: 'FACE_MATCH_WITH_AADHAAR',
  DRIVING_LICENSE: 'DRIVING_LICENSE',
  FACE_MATCH_WITH_DRIVING_LICENSE: 'FACE_MATCH_WITH_DRIVING_LICENSE',
  PAN: 'PAN',
};

export const VERIFICATION_STATUS_KEYS = {
  AADHAAR: 'AADHAAR_VERIFICATION_STATUS',
  DRIVING_LICENSE: 'DRIVING_LICENSE_VERIFICATION_STATUS',
  LIVENESS: 'LIVENESS_VERIFICATION_STATUS',
  FACE_MATCH_WITH_AADHAAR: 'FACE_MATCH_WITH_AADHAAR_STATUS',
  FACE_MATCH_WITH_DRIVING_LICENSE: 'FACE_MATCH_WITH_DRIVING_LICENSE_STATUS',
  PAN: 'PAN_VERIFICATION_STATUS',
};

export const VERIFICATION_MODULE = {
  VERIFICATION_STATUS: ['Verify', 'Reject'],
};

export const VERIFICATION_PAGE_INFO = {
  'live-photo': {
    WORKFLOW: 'LIVE_PHOTO_VERIFICATION',
    STATUS_KEY: 'liveness',
  },
  'aadhaar-verify': {
    WORKFLOW: 'AADHAAR_VERIFICATION',
    STATUS_KEY: 'aadhaar',
  },
  'aadhaar-live-photo': {
    WORKFLOW: 'AADHAAR_LIVE_PHOTO_VERIFICATION',
    STATUS_KEY: 'faceMatchWithAadhaar',
  },
  'dl-verify': {
    WORKFLOW: 'DL_VERIFICATION',
    STATUS_KEY: 'drivingLicense',
  },
  'dl-live-photo': {
    WORKFLOW: 'DL_LIVE_PHOTO_VERIFICATION',
    STATUS_KEY: 'faceMatchWithDrivingLicense',
  },
  'pan-verify': {
    WORKFLOW: 'PAN_VERIFICATION',
    STATUS_KEY: 'pan',
  },
};

export const VERIFICATION_STATUS_MAP = {
  POSSIBLE_STATES: {
    OPS_REJECTED: 'Reject',
    OPS_VERIFIED: 'Verify',
    REJECTED: 'Reject',
    VERIFIED: 'Verify',
  },
  CURRENT_STATES: {
    OPS_REJECTED: 'Rejected',
    OPS_VERIFIED: 'Verified',
    NOT_INITIATED: 'Not Initiated',
    PENDING: 'Pending',
    VERIFIED: 'Verified',
    REJECTED: 'Rejected',
  },
};

export const VERIFICATION_LINKS = {
  AADHAAR: 'AADHAAR_VERIFY',
  DRIVING_LICENSE: 'DL_VERIFY',
  LIVENESS: 'LIVE_PHOTO',
  FACE_MATCH_WITH_AADHAAR: 'AADHAAR_LIVE_PHOTO',
  FACE_MATCH_WITH_DRIVING_LICENSE: 'DL_LIVE_PHOTO',
  PAN: 'PAN_VERIFY',
};

export const VERIFICATION_FILTER_SECTIONS = {
  livePhotoVerificationStatus: 'Live Photo Verification Status',
  aadhaarVerificationStatus: 'Aadhaar Card Verification Status',
  faceMatchWithAadhaarVerificationStatus:
    'Aadhaar Card and Live Photo Verification Status',
  drivingLicenseVerificationStatus: 'Driving License Verification Status',
  faceMatchWithDrivingLicenseVerificationStatus:
    'Driving License and Live Photo Verification Status',
  panVerificationStatus: 'Pan Verification Status',
};
