import { useEffect, useState } from 'react';
import {
  useDeleteUser,
  useGetAllRoles,
  useGetAllUsers,
  usePostAddUser,
  usePutUser,
} from '../../apis/queryHooks';
import {
  getNestedProperty,
  textLengthCheck,
  isValidEmail,
  isValidPhoneNumber,
  generateRandomString,
} from '../../utils/helper';
import {
  USERS_ERROR_STRUCTURE,
  USERS_OBJ_STRUCTURE,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from '../../constants/users';

const useUsersList = () => {
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [emailSearch, setEmailSearch] = useState('');
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [openAddUsers, setOpenAddUsers] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [userObj, setUserObj] = useState({ ...USERS_OBJ_STRUCTURE });
  const [userTypeCategoryOpen, setUserTypeCategoryOpen] = useState(false);
  const [openSizeDropdown, setOpenSizeDropdown] = useState(false);
  const [rolesCheckbox, setRolesCheckbox] = useState([]);
  const [userObjError, setUserObjError] = useState({
    ...USERS_ERROR_STRUCTURE,
  });

  const {
    data: allUsersResponse,
    refetch: refetchUsersData,
    isFetching: isGetAllUsersFetching,
  } = useGetAllUsers({
    currentPage,
    itemsPerPage,
    emailSearch,
  });

  const allUsersData = allUsersResponse?.response || [];

  const userHeaderArray = allUsersResponse?.headers || [];

  const { data: allRolesResponse } = useGetAllRoles();

  const allRolesData = allRolesResponse?.response || [];

  const {
    mutate: postAddUserMutate,
    status: postAddUserStatus,
    error: postAddUserError,
  } = usePostAddUser();

  const { mutate: putUserMutate, status: putUserStatus } = usePutUser(
    allUsersData?.[actionIndex]?.user?._id,
  );

  const { mutate: deleteUserMutate, status: deleteUserStatus } =
    useDeleteUser();

  const totalItems = allUsersResponse?.userCount || 0;

  const userHeaders = userHeaderArray.map((item) => item?.value) || [];

  const userHeaderTypes = userHeaderArray.map((item) => item?.type) || [];

  const userRows = allUsersData?.map((user) => createData(user));

  const rolesIndex = userHeaders.indexOf('User Roles');

  userRows?.map((user) => {
    user[rolesIndex] = [...new Set(user[rolesIndex]?.map((role) => role.name))];
  });

  useEffect(() => {
    if (allRolesData?.length) {
      // Check if allRolesData exists and has elements
      setRolesCheckbox((prevRolesCheckbox) => {
        const newRolesCheckbox = allRolesData.map((role) => ({
          key: role._id,
          value: role.name,
          checked: false,
        }));

        // Only update if data has changed
        if (
          JSON.stringify(prevRolesCheckbox) !== JSON.stringify(newRolesCheckbox)
        ) {
          return newRolesCheckbox;
        }

        return prevRolesCheckbox; // Avoid updating if the data hasn't changed
      });
    }
  }, [allRolesData]);

  const onShowSizeChange = (pageSize) => {
    if (itemsPerPage !== pageSize) {
      setCurrentPage(1);
      setItemsPerPage(pageSize);
    }
  };

  const handleOpenSizeDropdown = () => {
    setOpenSizeDropdown(!openSizeDropdown);
  };

  const handleRolesCheckbox = (value) => {
    setRolesCheckbox((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  function createData(users) {
    const usersHeaderKeys = Array.from(userHeaderArray.map((item) => item.key));
    return usersHeaderKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(users, itemKey);
    });
  }

  const handleFieldUpdate = (e, fieldName) => {
    switch (fieldName) {
      case 'name':
        setUserObj({ ...userObj, name: e.target.value });
        break;

      case 'email':
        setUserObj({ ...userObj, email: e.target.value });
        break;

      case 'phone':
        setUserObj({ ...userObj, phone: e.target.value });
        break;
    }
  };

  const handleEditUser = (user) => {
    const rolesNames = new Set(user?.user?.userRoles?.map((r) => r.name));

    const updatedRolesCheckboxes = rolesCheckbox?.map((roleCheckbox) => ({
      ...roleCheckbox,
      checked: rolesNames.has(roleCheckbox.value),
    }));

    setUserObj({
      ...userObj,
      name: user?.user?.name,
      email: user?.email,
      phone: user?.phoneNo,
      userType: user?.user?.userType,
    });
    setRolesCheckbox(updatedRolesCheckboxes);
  };

  const handleDeleteUser = () => {
    deleteUserMutate(allUsersData[actionIndex]?.user?._id);
    setOpenDeletePop(false);
  };

  const handleUserTypeCategorySelect = (cat) => {
    setUserObj({ ...userObj, userType: cat });
    setUserTypeCategoryOpen(!userTypeCategoryOpen);
  };

  const clearFields = () => {
    setUserObjError({ ...USERS_ERROR_STRUCTURE });
    setUserObj({ ...USERS_OBJ_STRUCTURE });
    setRolesCheckbox(
      rolesCheckbox?.map((role) => ({
        ...role,
        checked: false,
      })),
    );
  };

  const handleApplyClick = () => {
    const errorFields = {
      name: textLengthCheck(
        userObj?.name,
        ROLE_NAME_MAX_LENGTH,
        ROLE_NAME_MIN_LENGTH,
      ),
      email: !isValidEmail(userObj?.email),
      phone: !isValidPhoneNumber(userObj?.phone),
      userType: textLengthCheck(userObj?.userType),
    };
    if (JSON.stringify(errorFields) === JSON.stringify(USERS_ERROR_STRUCTURE)) {
      const payload = {
        userContact: {
          phoneNo: userObj?.phone,
          email: userObj?.email,
          dialCode: '+91',
        },
        password: generateRandomString(),
        timezone: 'Asia/Kolkata',
        userType: userObj?.userType,
        name: userObj?.name,
        userRoleIds: rolesCheckbox
          ?.filter((role) => role.checked)
          ?.map((role) => role.key),
      };
      if (isEdit) {
        putUserMutate({
          name: payload.name,
          userRoleIds: payload.userRoleIds,
        });
      } else {
        postAddUserMutate(payload);
      }
    } else {
      setUserObjError({
        ...userObjError,
        ...errorFields,
      });
    }
  };

  const handleSearchByEmail = () => {
    setCurrentPage(1);
    refetchUsersData();
  };

  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchByEmail();
    }
  };

  return {
    allUsersData,
    userHeaders,
    userHeaderTypes,
    userRows,
    openAddUsers,
    isEdit,
    userObj,
    userObjError,
    userTypeCategoryOpen,
    rolesCheckbox,
    postAddUserStatus,
    postAddUserError,
    putUserStatus,
    currentPage,
    itemsPerPage,
    openSizeDropdown,
    totalItems,
    actionIndex,
    actionOpen,
    deleteUserStatus,
    openDeletePop,
    emailSearch,
    isGetAllUsersFetching,
    showActionsPanel,
    setShowActionsPanel,
    setEmailSearch,
    setOpenDeletePop,
    handleDeleteUser,
    setActionIndex,
    setActionOpen,
    setOpenSizeDropdown,
    handleOpenSizeDropdown,
    setCurrentPage,
    setItemsPerPage,
    onShowSizeChange,
    setUserTypeCategoryOpen,
    setUserObjError,
    setUserObj,
    setIsEdit,
    setOpenAddUsers,
    handleFieldUpdate,
    handleUserTypeCategorySelect,
    clearFields,
    handleRolesCheckbox,
    handleApplyClick,
    refetchUsersData,
    handleEditUser,
    handleEnterButton,
    handleSearchByEmail,
  };
};

export default useUsersList;
