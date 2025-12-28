export const EMPLOYMENT_DESIGNATION_MIN_LIMIT = 2;
export const EMPLOYMENT_DESIGNATION_CITY_MAX_LIMIT = 50;
export const EMPLOYER_NAME_MIN_LIMIT = 3;
export const CITY_MIN_LIMIT = 3;
export const CITY_MAX_LIMIT = 28;
export const EMPLOYER_PHONE_MIN_LIMIT = 8;
export const EMPLOYER_PHONE_MAX_LIMIT = 15;

export const RATING_LIST = ['1', '2', '3', '4', '5'];

/* Order of keys to be maintained */
export const WORK_EXP_ERROR_STRUCTURE = {
  employmentDesignation: false,
  employerName: false,
  city: false,
  employerPhoneNo: false,
  state: false,
  startDate: false,
  endDate: false,
};

export const WORK_EXP_VERIFICATION_ERR_STRUCT = {
  status: false,
  rating: false,
  empRemarks: false,
  opsRemarks: false,
};

export const REMARK_ERR_STRUCT = { remarks: false };
