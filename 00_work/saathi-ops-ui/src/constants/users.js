export const USERS_MODULE = {
  USER_TAB_HEADERS: ['Users', 'Roles', 'Permissions'],
};

export const ROLE_NAME_MAX_LENGTH = 50;
export const ROLE_NAME_MIN_LENGTH = 2;
export const ROLE_DESCRIPTION_MAX_LENGTH = 500;
export const ROLE_DESCRIPTION_MIN_LENGTH = 15;

export const ROLES_OBJ_STRUCTURE = {
  name: '',
  description: '',
};

export const ROLES_ERROR_STRUCTURE = {
  name: false,
  description: false,
};

export const USERS_OBJ_STRUCTURE = {
  name: '',
  email: '',
  phone: '',
  userType: 'OPS',
};

export const USERS_ERROR_STRUCTURE = {
  name: false,
  email: false,
  phone: false,
  userType: false,
};

export const PERMISSIONS_OBJ_STRUCTURE = {
  name: '',
  description: '',
  type: '',
  access: '',
};

export const PERMISSIONS_ERROR_STRUCTURE = {
  name: false,
  description: false,
  type: false,
  access: false,
};

export const USER_TYPES = ['OPS'];
