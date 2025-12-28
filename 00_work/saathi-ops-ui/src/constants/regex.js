export const REGEX = {
  CIN: /^[A-Z0-9]{21}$/i,
  GSTIN: /^[A-Z0-9]{15}$/i,
  PAN: /^[A-Z0-9]{10}$/i,
  LLPIN: /^[A-Z0-9-]{8}$/i,
  ADDRESS_LINE: /^[a-zA-Z0-9\s.,'-]*$/,
  PIN_CODE: /^\d{6}$/,
  NAME: /^[a-zA-Z\s]{1,30}$/,
  AADHAAR: /^\d{4} \d{4} \d{4}$/,
  AGE: /^(1[89]|[2-4][0-9]|50)$/,
};

// Replace Patterns
export const REPLACE_PATTERNS = {
  ALPHANUMERIC: /[^a-zA-Z0-9]/g,
  ALPHANUMERIC_WITH_PUNCTUATION: /[^a-zA-Z0-9\s.,'-]/g,
  NUMERIC: /[^0-9]/g,
  NON_DIGITS: /\D/g,
  AADHAAR_FORMAT: /(\d{4})(?=\d)/g,
  ALPHABETS: /[^a-zA-Z\s]/g,
  ALPHABETS_NO_SPACE: /[^a-zA-Z]/g,
};
