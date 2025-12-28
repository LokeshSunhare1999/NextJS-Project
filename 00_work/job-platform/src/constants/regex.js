export const REGEX = {
  characters: /^[a-zA-Z]*$/,
  alphaNumeric: /^[a-zA-Z0-9]*$/,
  alphaNumericWithSpace: /^[a-zA-Z0-9 ]*$/,
  alphaNumericWithSpaceAndSpecial: /^[a-zA-Z0-9 !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/,
  email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  mobile: /^[0-9]{10}$/,
  alphabet: /^[a-zA-Z ]*$/,
  number: /^[0-9]*$/,
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

export const REGEX_DOCUMENT = {
  CIN: /^[A-Z0-9]{21}$/i,
  GSTIN: /^[A-Z0-9]{15}$/i,
  PAN: /^[A-Z0-9]{10}$/i,
  LLPIN: /^[A-Z0-9-]{8}$/i,
  ADDRESS_LINE: /^[a-zA-Z0-9\s.,'-]*$/,
  PIN_CODE: /^\d{6}$/,
  NAME: /^[a-zA-Z\s]{1,30}$/,
  AADHAAR: /^\d{4} \d{4} \d{4}$/,
};