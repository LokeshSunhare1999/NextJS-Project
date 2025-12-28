import moment from 'moment-timezone';
import {
  COURSE_MODULE,
  MAX_FILENAME_LENGTH,
  STATUS_KEYS,
  APP_NAME,
  APP_VERSION,
  SOURCE_TYPE,
} from '../constants';
import { v4 as uuidv4 } from 'uuid';
import { DISPOSABLE_MAILS } from '../constants/employer';
import axios from 'axios';
import { parseCookies } from 'nookies';

export function isEmpty(obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) return false;
  }
  return true;
}

export function inputRangeCheck(
  val,
  max = COURSE_MODULE?.DEFAULT_MAX,
  min = COURSE_MODULE?.DEFAULT_MIN,
) {
  if (val < min || val > max) return true;
  return false;
}

export function textLengthCheck(
  text,
  max = COURSE_MODULE?.DEFAULT_MAX,
  min = COURSE_MODULE?.DEFAULT_MIN,
) {
  if (text?.length <= min || text?.length > max || !text) return true;
  return false;
}

export function isValidHttpUrl(string) {
  let url;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === 'http:' || url.protocol === 'https:';
}

export function getNestedProperty(obj, path) {
  return path.split('.').reduce((acc, part) => {
    // Handle array notation in the path (e.g., orderItems[0])
    const match = part.match(/(\w+)\[(\d+)\]/);
    if (match) {
      const [, arrayProp, index] = match;
      return acc && acc[arrayProp] && acc[arrayProp][index];
    }
    return acc && acc[part];
  }, obj);
}

export function convertToCSV(data) {
  const array = [Object.keys(data[0])].concat(data);

  return array
    .map((row) => {
      return Object.values(row)
        .map((value) => {
          if (Array.isArray(value)) {
            return value.map((v) => JSON.stringify(v)).join('; ');
          }
          return typeof value === 'string' ? JSON.stringify(value) : value;
        })
        .toString();
    })
    .join('\n');
}

export function downloadCSV(csv, filename) {
  const csvFile = new Blob([csv], { type: 'text/csv' });
  const downloadLink = document.createElement('a');
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = 'none';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export async function downloadPDF(pdfUrl, filename) {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    const pdfBlob = await response.blob();

    const downloadLink = document.createElement('a');
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(pdfBlob);
    downloadLink.style.display = 'none';
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error('Error downloading PDF:', error.message);
  }
}

export function truncateFileName(fileName, maxLength = MAX_FILENAME_LENGTH) {
  if (fileName.length <= maxLength) {
    return fileName;
  }

  const partLength = Math.floor((maxLength - 3) / 2); // Subtract 3 for the ellipsis
  const start = fileName.substring(0, partLength);
  const end = fileName.substring(fileName.length - partLength);

  return `${start}...${end}`;
}

export function generateUploadFilePath(
  courseTitle = '',
  courseId = '',
  fileType,
) {
  // Get the first 3 letters of the course title in uppercase
  const titlePart = courseTitle?.toUpperCase();

  // Combine the parts with underscores
  const result = `${titlePart}_${courseId}_${fileType.toUpperCase()}`;

  return result;
}

export function extractStringAfterMediaType(url) {
  const mediaPattern = /(?:IMAGE|VIDEO|AUDIO|DOCUMENT)\/([^\/]*)$/;
  const match = url.match(mediaPattern);
  if (match && match[1]) {
    return match[1];
  }
  return url;
}
export function shortenStringAfterMediaType(url) {
  const filenamePattern = /\/([^\/]+)$/;
  const match = url.match(filenamePattern);
  if (match && match[1]) {
    return match[1];
  }
  return url;
}
export function shortenVideoLink(titleValue, shortenedLength) {
  const truncatedTitle =
    titleValue.length > shortenedLength
      ? `${titleValue.slice(0, shortenedLength)}...`
      : titleValue;
  return truncatedTitle;
}

export function secondsToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds}`;
}

// Helper function to convert UPPER_SNAKE_CASE to camelCase
export function toCamelCase(str) {
  return str
    .toLowerCase()
    .replace(/_([a-z])/g, (match, letter) => letter.toUpperCase());
}

export function convertCamelCaseToTitleCase(str) {
  // Insert a space before each capital letter and convert the whole string to lowercase
  const spacedStr = str.replace(/([A-Z])/g, ' $1').toLowerCase();

  // Capitalize the first letter of each word
  const titleCaseStr = spacedStr.replace(/\b\w/g, (char) => char.toUpperCase());

  return titleCaseStr;
}

export function upperSnakeToKebabCase(str) {
  // Convert the string to lower case and replace underscores with hyphens
  let kebabCaseStr = str?.toLowerCase()?.replace(/_/g, '-');

  // Capitalize the first letter of each word
  kebabCaseStr = kebabCaseStr
    ?.split('-')
    ?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))
    ?.join('-');

  return kebabCaseStr;
}

//Upper snake case to small kebab case
export function convertToKebabCase(str) {
  return str.toLowerCase().replace(/_/g, '-');
}

export function removeKeys(obj, keysToRemove) {
  const newObj = { ...obj };
  keysToRemove.forEach((key) => {
    delete newObj[key];
  });
  return newObj;
}

export function formatDate(dateString, format = 'DD MMM YYYY') {
  const date = moment(dateString);
  if (!date.isValid() || !dateString) {
    return '-----';
  }
  return date.tz('Asia/Kolkata').format(format);
}

export function camelToSnakeUpperCase(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1_$2').toUpperCase();
}
export function getValueBasedOnStatus(value, status, defaultValue = null) {
  if (status === STATUS_KEYS?.NOT_INITIATED) {
    return defaultValue;
  }
  return value;
}

export function capitalizeFirstLetter(str) {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

export function toTitleCase(str) {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
}

export function bytesToMegabytes(bytes) {
  const megabytes = bytes / (1024 * 1024);
  return megabytes;
}

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function findKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}
export const pluralize = (count, singular, plural) => {
  return count === 1 ? singular : plural;
};

export function isValidEmail(email) {
  if (!email?.trim()) return false;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) return false;

  return !email.includes('..');
}

export function isValidPhoneNumber(phoneNumber) {
  if (!phoneNumber.trim()) {
    return false;
  }
  // Regular expression to check for exactly 10 digits
  const phoneRegex = /^\d{10}$/;

  return phoneRegex.test(phoneNumber);
}

export function generateRandomString(length = 10) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}

export function generateAlphaNumericString(length = 10) {
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  const timestampPart = Date.now()
    .toString(36)
    .slice(-Math.floor(length / 2));

  const remainingLength = length - timestampPart.length;

  let randomString = '';
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return timestampPart + randomString;
}

export function getValueSuffix(level) {
  const lastDigit = level % 10;

  if (lastDigit === 1 && level !== 11) return `${level}\u02E2\u1D57`; // 1ˢᵗ
  if (lastDigit === 2 && level !== 12) return `${level}\u207F\u1D48`; // 2ⁿᵈ
  if (lastDigit === 3 && level !== 13) return `${level}\u02B3\u1D48`; // 3ʳᵈ

  return `${level}\u1D57\u02B0`; // th for all other numbers
}

export function generateSearchParams(searchParams) {
  return Array.from(searchParams.entries())
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join('&');
}

export function isValidCIN(cin) {
  if (!cin?.trim()) {
    return false;
  }

  // Regular expression for CIN validation
  const cinRegex = /^[A-Z0-9]{21}$/i;

  return cinRegex.test(cin);
}

export function isValidGSTIN(gstin) {
  if (!gstin?.trim()) {
    return false;
  }

  // Regular expression for GSTIN validation
  const gstinRegex = /^[A-Z0-9]{15}$/i;

  return gstinRegex.test(gstin);
}

export function isValidPAN(pan) {
  if (!pan?.trim()) {
    return false;
  }

  // Regular expression for PAN validation
  const panRegex = /^[A-Z0-9]{10}$/i;

  return panRegex.test(pan);
}

export function isValidLLPIN(llpin) {
  if (!llpin?.trim()) {
    return false;
  }

  // Regular expression for LLPIN validation
  const llpinRegex = /^[A-Z0-9]{7}$/i;

  return llpinRegex.test(llpin);
}

// Address Line Validation (Address Line 1 & 2)
export function isValidAddressLine(addressLine) {
  // Regex allows numbers, alphabets, spaces, and common punctuations
  const addressRegex = /^[a-zA-Z0-9\s.,'-]*$/;
  return addressRegex.test(addressLine);
}

// Validate Pin Code: exactly 6 numeric digits
export function isValidPinCode(pincode) {
  const pinCodeRegex = /^\d{6}$/;
  return pinCodeRegex.test(pincode);
}

// Validate Name: up to 30 alphabetic characters, allowing spaces for middle names
export function isValidName(name) {
  const nameRegex = /^[a-zA-Z\s]{1,30}$/;
  return nameRegex.test(name);
}

// Aadhaar format: 4 digits, space, 4 digits, space, 4 digits (e.g. 1234 5678 9012)
export const isValidAadhaar = (aadhaar) => {
  const aadhaarRegex = /^\d{4} \d{4} \d{4}$/;
  return aadhaarRegex.test(aadhaar);
};

export const isValidField = (value, regex) =>
  value?.trim() && regex.test(value);

export const isDisposableEmail = (email) => {
  const emailDomain = email?.split('@')?.[1];
  return DISPOSABLE_MAILS?.includes(emailDomain);
};

export const checkVideoDuration = (file, maxVideoduration) => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    const fileURL = URL.createObjectURL(file);

    video.src = fileURL;

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(fileURL);
      resolve(video.duration <= maxVideoduration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(fileURL);
      resolve(false);
    };
  });
};

export const axiosFetch = async (
  method,
  endpoint,
  data = null,
  additionalHeaders = {},
  config = {},
  signal = null,
  useAuth = true,
) => {
  const cookies = parseCookies();

  const headers = {
    'x-app-name': APP_NAME,
    'source-type': SOURCE_TYPE,
    'App-Version': APP_VERSION,
    Authorization: cookies?.accessToken ? `Bearer ${cookies.accessToken}` : '',
    'Content-Type': 'application/json',
  };

  if (!useAuth) {
    delete headers.Authorization;
  }

  try {
    const response = await axios({
      method,
      url: endpoint,
      data,
      headers,
      ...config,
      signal,
    });
    return response;
  } catch (error) {
    throw error;
  }
};
