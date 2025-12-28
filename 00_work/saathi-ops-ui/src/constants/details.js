export const ADDRESS_MIN_LENGTH = 5;
export const ADDRESS_MAX_LENGTH = 100;

export const CITY_MIN_LENGTH = 3;
export const CITY_MAX_LENGTH = 28;

export const MIN_EXPERIENCE = 0;
export const MAX_EXPERIENCE = 40;

export const PIN_LENGTH = 6;

export const STATES_LIST = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
  'Andaman and Nicobar Islands',
  'Chandigarh',
  'Dadra and Nagar Haveli and Daman and Diu',
  'Lakshadweep',
  'Delhi',
  'Puducherry',
  'Ladakh',
  'Jammu and Kashmir',
];

export const TRUE_ID_DRAWER_STRUCTURE = {
  rating: 0,
  livePhotoUrl: '',
};

export const TRUE_ID_ERROR_STRUCTURE = {
  rating: false,
  livePhotoUrl: false,
};

export const DETAILS_DRAWER_STRUCTURE = {
  address: '',
  city: '',
  state: '',
  country: 'India',
  pin: '',
  experience: 0,
  introVideoLink: '',
  education: '',
};

export const DETAILS_ERROR_STRUCTURE = {
  address: false,
  city: false,
  state: false,
  pin: false,
  experience: false,
  education: false,
};

export const EDUCATION_DETAILS_LIST = [
  'No Formal Education',
  'Primary School (Class 1-5)',
  'Middle School (Class 6-8)',
  'Secondary School (Class 9-10)',
  'Higher Secondary (Class 11-12)',
  'Diploma (Polytechnic, Engineering, etc.)',
  'Undergraduate Degree',
  'Postgraduate Degree',
  'Ph.D.',
  'Others',
];
export const RUPEE_SYMBOL = '₹';

export const SALUTATIONS = ['Mr.', 'Mrs.', 'Miss'];

export const salutationMap = {
  MR: 'Mr.',
  MRS: 'Mrs.',
  MISS: 'Miss',
};

export const registrationTypeMap = {
  PROPRIETORSHIP: 'Proprietorship',
  LIMITED_LIABILITY_PARTNERSHIP: 'LLP',
  PARTNERSHIP: 'Partnership',
  PRIVATE_LIMITED: 'Pvt Ltd',
  PUBLIC_LIMITED: 'Public Limited',
  FREELANCER: 'Freelancer',
  OPC: 'OPC',
};

export const EMP_REG_TYPE = [
  'Public Limited',
  'Pvt Ltd',
  'LLP',
  'Partnership',
  'Proprietorship',
  'Freelancer',
  'OPC',
];

export const STATES_LIST_LV = [
  {
    label: 'Andaman and Nicobar Islands', // Union Territory
    value: 'Andaman and Nicobar Islands',
  },
  {
    label: 'Andhra Pradesh',
    value: 'Andhra Pradesh',
  },
  {
    label: 'Arunachal Pradesh',
    value: 'Arunachal Pradesh',
  },
  {
    label: 'Assam',
    value: 'Assam',
  },
  {
    label: 'Bihar',
    value: 'Bihar',
  },
  {
    label: 'Chandigarh', // Union Territory
    value: 'Chandigarh',
  },
  {
    label: 'Chhattisgarh',
    value: 'Chhattisgarh',
  },
  {
    label: 'Dadra and Nagar Haveli and Daman and Diu', // Union Territory
    value: 'Dadra and Nagar Haveli and Daman and Diu',
  },
  {
    label: 'Delhi', // Union Territory
    value: 'Delhi',
  },
  {
    label: 'Goa',
    value: 'Goa',
  },
  {
    label: 'Gujarat',
    value: 'Gujarat',
  },
  {
    label: 'Haryana',
    value: 'Haryana',
  },
  {
    label: 'Himachal Pradesh',
    value: 'Himachal Pradesh',
  },
  {
    label: 'Jammu and Kashmir', // Union Territory
    value: 'Jammu and Kashmir',
  },
  {
    label: 'Jharkhand',
    value: 'Jharkhand',
  },
  {
    label: 'Karnataka',
    value: 'Karnataka',
  },
  {
    label: 'Kerala',
    value: 'Kerala',
  },
  {
    label: 'Ladakh', // Union Territory
    value: 'Ladakh',
  },
  {
    label: 'Lakshadweep', // Union Territory
    value: 'Lakshadweep',
  },
  {
    label: 'Madhya Pradesh',
    value: 'Madhya Pradesh',
  },
  {
    label: 'Maharashtra',
    value: 'Maharashtra',
  },
  {
    label: 'Manipur',
    value: 'Manipur',
  },
  {
    label: 'Meghalaya',
    value: 'Meghalaya',
  },
  {
    label: 'Mizoram',
    value: 'Mizoram',
  },
  {
    label: 'Nagaland',
    value: 'Nagaland',
  },
  {
    label: 'Odisha',
    value: 'Odisha',
  },
  {
    label: 'Puducherry', // Union Territory
    value: 'Puducherry',
  },
  {
    label: 'Punjab',
    value: 'Punjab',
  },
  {
    label: 'Rajasthan',
    value: 'Rajasthan',
  },
  {
    label: 'Sikkim',
    value: 'Sikkim',
  },
  {
    label: 'Tamil Nadu',
    value: 'Tamil Nadu',
  },
  {
    label: 'Telangana',
    value: 'Telangana',
  },
  {
    label: 'Tripura',
    value: 'Tripura',
  },
  {
    label: 'Uttar Pradesh',
    value: 'Uttar Pradesh',
  },
  {
    label: 'Uttarakhand',
    value: 'Uttarakhand',
  },
  {
    label: 'West Bengal',
    value: 'West Bengal',
  },
];
