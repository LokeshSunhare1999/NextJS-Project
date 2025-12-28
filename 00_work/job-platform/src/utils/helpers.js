import {
  APP_NAME,
  APP_VERSION,
  MAX_FILENAME_LENGTH,
  SOURCE_TYPE,
} from "@/constants";
import moment from "moment-timezone";
import { destroyCookie } from "nookies";
import { v4 as uuidv4 } from "uuid";
import axios from "axios";
import { parseCookies } from "nookies";

export const isServer = typeof window === "undefined";

/* Parses headers from response to antd readable format */
export const parseTableHeaders = (headers = []) => {
  return Array.from(headers)?.map((header) => {
    return {
      title: header?.value,
      key: header?.key,
      dataIndex: header?.key,
      type: header?.type,
    };
  });
};

/* Access nested propert from object */
export const getNestedProperty = (obj, path) => {
  return path?.split(".").reduce((acc, curr) => {
    const match = curr.match(/(\w+)\[(\d+)\]/);
    if (match) {
      const [, arrayProp, index] = match;
      return acc && acc[arrayProp] && acc[arrayProp][index];
    }

    return acc && acc[curr];
  }, obj);
};

/* Creates an object with values only present in headers by getting them from data */
const createData = (data, headers) => {
  const headerKeys = Array.from(headers).map((header) => header.key);
  const parsedData = headerKeys.reduce((acc, curr) => {
    return { ...acc, [curr]: getNestedProperty(data, curr) };
  }, {});

  parsedData.id = data?._id || uuidv4(); // Ensure each row has a unique key
  return parsedData;
};

/* Converts table response to antd readable format (array of objects)  */
export const convertToTableData = (data = [], headers = []) => {
  return data.map((item) => createData(item, headers));
};

export function formatDate(dateString, format = "DD MMM YYYY") {
  const date = moment(dateString);
  if (!date.isValid() || !dateString) {
    return "-----";
  }
  return date.tz("Asia/Kolkata").format(format);
}

export const getOrSetLocalStorage = (key) => {
  if (isServer) return;

  let uuid = localStorage.getItem(key);

  if (uuid) {
    return JSON.parse(uuid);
  } else {
    uuid = uuidv4();
    localStorage.setItem(key, JSON.stringify(uuid));
    return uuid;
  }
};

export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

export const getCheckedKeysString = (checkBoxes) => {
  const checkedKeys = checkBoxes
    .filter((checkbox) => checkbox.checked)
    .map((checkbox) => checkbox.key);

  return checkedKeys.join(",");
};

export function textLengthCheck(text, max = 1000, min = 1) {
  if (text?.length < min || text?.length > max || !text) return true;
  return false;
}

export const getLocalStorage = (key) => {
  if (isServer) return null;

  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
};

export const setLocalStorage = (key, value) => {
  if (isServer) return;

  localStorage.setItem(key, JSON.stringify(value));
};
export const removeFromLocalStorage = (key) => {
  if (isServer) return;

  localStorage.removeItem(key);
};

export function validatePassword(password) {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\W).{8,}$/;

  return passwordRegex.test(password);
}

export function findKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value);
}

/*function to format the Resend OTP time*/
export const formatTime = (time) => {
  const parsedTime = Math.floor(time);
  const minutes = Math.floor(parsedTime / 60);
  const seconds = parsedTime % 60;

  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(seconds).padStart(2, "0");

  return `${formattedMinutes}:${formattedSeconds}`;
};

export const getLevelSuffix = (level) => {
  const lastDigit = level % 10;
  const lastTwoDigits = level % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return "th";
  }

  switch (lastDigit) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
};

export const truncateText = (text, maxLength) => {
  if (text?.length > maxLength) {
    return text.slice(0, maxLength) + "...";
  }
  return text;
};

export const transformJobCategoryData = (jobCategoryData) => {
  let allCategoryData = {};
  const jobCategoryMap = jobCategoryData.reduce((acc, category) => {
    if (category.jobCategory === "ALL_CATEGORY") {
      allCategoryData = category;
    }
    acc[category.jobCategory] = category;

    return acc;
  }, {});

  return { jobCategoryMap, allCategoryData };
};

export const transformRatings = (ratings) => {
  return ratings.reduce((acc, { count, min, max }) => {
    const key = max ? `${min}-${max}` : `${min}`;
    acc[key] = count;
    return acc;
  }, {});
};

export const getJobCategories = (jobCategoryData) => {
  return jobCategoryData.map(({ jobCategory }) => {
    const formattedText = jobCategory
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

    return {
      label: formattedText,
      value: formattedText,
    };
  });
};

export const getKeyByValue = (obj, value) => {
  return Object.keys(obj).find((key) => obj[key] === value) || null;
};

export const getTrimmedValue = (text, length) => {
  if (!text || typeof text !== "string") return "";
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
};

export const isAllCategory = (selectedJobCategory) =>
  selectedJobCategory === "ALL_CATEGORY";

export const maskEmail = (email) => {
  if (!email || !email.includes("@")) return email;

  const [user, domain] = email.split("@");
  return `xxxx@${domain}`;
};
export function isValidEmail(email) {
  if (!email?.trim()) return false;

  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  if (!emailRegex.test(email)) return false;

  return !email.includes("..");
}
export const maskPhoneNumber = (number, visibleDigits = 5, maskChar = "X") => {
  const str = number.toString();
  const visible = str.slice(0, visibleDigits);
  const masked = maskChar.repeat(str.length - visibleDigits);
  return `${visible} ${masked}`;
};

export function generateAlphaNumericString(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  const timestampPart = Date.now()
    .toString(36)
    .slice(-Math.floor(length / 2));

  const remainingLength = length - timestampPart.length;

  let randomString = "";
  for (let i = 0; i < remainingLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return timestampPart + randomString;
}

export const handleLogout = () => {
  const options = { path: "/" };
  destroyCookie(null, "accessToken", options);
  destroyCookie(null, "userId", options);
  destroyCookie(null, "employerId", options);
  destroyCookie(null, "guestToken", options);
  sessionStorage?.removeItem("orderId");
  sessionStorage?.removeItem("productId");
  window.location.replace("/login", options);
};

export function generateRandomString(length = 10) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?";
  let randomString = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters[randomIndex];
  }

  return randomString;
}

export const isValidField = (value, regex) =>
  value?.trim() && regex.test(value);
export function generateUploadFilePath(
  courseTitle = "",
  courseId = "",
  fileType
) {
  // Get the first 3 letters of the course title in uppercase
  const titlePart = courseTitle?.toUpperCase();

  // Combine the parts with underscores
  const result = `${titlePart}_${courseId}_${fileType.toUpperCase()}`;

  return result;
}

export function bytesToMegabytes(bytes) {
  const megabytes = bytes / (1024 * 1024);
  return megabytes;
}

export function truncateFileName(fileName, maxLength = MAX_FILENAME_LENGTH) {
  if (fileName?.length <= maxLength) {
    return fileName;
  }

  const partLength = Math.floor((maxLength - 3) / 2); // Subtract 3 for the ellipsis
  const start = fileName?.substring(0, partLength);
  const end = fileName?.substring(fileName?.length - partLength);

  return `${start}...${end}`;
}

export function extractStringAfterMediaType(url) {
  const mediaPattern = /(?:IMAGE|VIDEO|AUDIO|DOCUMENT)\/([^\/]*)$/;
  const match = url.match(mediaPattern);
  if (match && match[1]) {
    return match[1];
  }
  return url;
}

export const checkVideoDuration = (file, maxVideoduration) => {
  return new Promise((resolve) => {
    const video = document.createElement("video");
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

export const paywallRedirect = (employerData, router) => {
  if (!employerData?.companyRegisteredName) {
    router.replace("/account-info");
  } else {
    router.replace("/jobs");
  }
};

export function isEmpty(value) {
  // null or undefined
  if (value == null) return true;

  // boolean or number
  if (typeof value === "boolean" || typeof value === "number") return false;

  // string or array
  if (typeof value === "string" || Array.isArray(value))
    return value.length === 0;

  // Map or Set
  if (value instanceof Map || value instanceof Set) return value.size === 0;

  // plain object
  if (typeof value === "object") {
    return Object.keys(value).length === 0;
  }

  return false;
}

export const axiosFetch = async (
  endpoint,
  method,
  data = null,
  additionalHeaders = {},
  config = {},
  signal = null,
  useAuth = true
) => {
  const cookies = parseCookies();

  const headers = {
    "x-app-name": APP_NAME,
    "source-type": SOURCE_TYPE,
    "App-Version": APP_VERSION,
    Authorization: cookies?.accessToken ? `Bearer ${cookies.accessToken}` : "",
    "Content-Type": "application/json",
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

export function downloadCSV(csv, filename) {
  const csvFile = new Blob([csv], { type: "text/csv" });
  const downloadLink = document.createElement("a");
  downloadLink.download = filename;
  downloadLink.href = window.URL.createObjectURL(csvFile);
  downloadLink.style.display = "none";
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

export const isValidMobileNo = (value) => /^\d{0,10}$/.test(value);

export async function downloadPDF(pdfUrl, filename) {
  try {
    const response = await fetch(pdfUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch PDF: ${response.statusText}`);
    }
    const pdfBlob = await response.blob();

    const downloadLink = document.createElement("a");
    downloadLink.download = filename;
    downloadLink.href = window.URL.createObjectURL(pdfBlob);
    downloadLink.style.display = "none";
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  } catch (error) {
    console.error("Error downloading PDF:", error.message);
  }
}
