import { useState } from 'react';
import {
  useGetAllPermissions,
  usePostUserPermission,
  usePutUserPermission,
  useDeleteUserPermission,
} from '../../apis/queryHooks';
import { getNestedProperty, textLengthCheck } from '../../utils/helper';
import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_DESCRIPTION_MIN_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
  PERMISSIONS_OBJ_STRUCTURE,
  PERMISSIONS_ERROR_STRUCTURE,
} from '../../constants/users';

const usePermissionsList = () => {
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [permissionSearch, setPermissionSearch] = useState('');
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [openAddPermission, setOpenAddPermission] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [permissionObj, setPermissionObj] = useState({
    ...PERMISSIONS_OBJ_STRUCTURE,
  });

  const [permissionObjError, setPermissionObjError] = useState({
    ...PERMISSIONS_ERROR_STRUCTURE,
  });

  const {
    data: allPermissionsResponse,
    refetch: refetchPermissionsData,
    isFetching: isFetchingAllPermissions,
  } = useGetAllPermissions({ permissionSearch });

  const allPermissionsData = allPermissionsResponse?.response || [];

  const permissionsArray = allPermissionsResponse?.headers || [];

  const { mutate: postUserPermissionMutate, status: postUserPermissionStatus } =
    usePostUserPermission();

  const { mutate: putUserPermissionMutate, status: putUserPermissionStatus } =
    usePutUserPermission(allPermissionsData?.[actionIndex]?._id);

  const {
    mutate: deleteUserPermissionMutate,
    status: deleteUserPermissionStatus,
  } = useDeleteUserPermission();

  const permissionHeaders = permissionsArray.map((item) => item?.value) || [];

  const permissionHeaderTypes =
    permissionsArray.map((item) => item?.type) || [];

  const permissionRows = allPermissionsData?.map((role) => createData(role));

  function createData(permission) {
    const permissionHeaderKeys = Array.from(
      permissionsArray.map((item) => item.key),
    );
    return permissionHeaderKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(permission, itemKey);
    });
  }

  const handleFieldUpdate = (e, fieldName) => {
    switch (fieldName) {
      case 'name':
        setPermissionObj({ ...permissionObj, name: e.target.value });
        break;

      case 'description':
        setPermissionObj({ ...permissionObj, description: e.target.value });
        break;

      case 'type':
        setPermissionObj({ ...permissionObj, type: e.target.value });
        break;

      case 'access':
        setPermissionObj({ ...permissionObj, access: e.target.value });
        break;
    }
  };

  const handleDeletePermission = () => {
    deleteUserPermissionMutate(allPermissionsData[actionIndex]?._id);
    setOpenDeletePop(false);
  };

  const handleEditPermission = (permission) => {
    setPermissionObj({
      ...permissionObj,
      name: permission?.name,
      description: permission?.description,
      type: permission?.type,
      access: permission?.access,
    });
  };

  const handleApplyClick = () => {
    const errorFields = {
      name: textLengthCheck(
        permissionObj?.name,
        ROLE_NAME_MAX_LENGTH,
        ROLE_NAME_MIN_LENGTH,
      ),
      description: textLengthCheck(
        permissionObj?.description,
        ROLE_DESCRIPTION_MAX_LENGTH,
        ROLE_DESCRIPTION_MIN_LENGTH,
      ),
      type: textLengthCheck(
        permissionObj?.type,
        ROLE_NAME_MAX_LENGTH,
        ROLE_NAME_MIN_LENGTH,
      ),
      access: textLengthCheck(
        permissionObj?.access,
        ROLE_NAME_MAX_LENGTH,
        ROLE_NAME_MIN_LENGTH,
      ),
    };
    if (
      JSON.stringify(errorFields) ===
      JSON.stringify(PERMISSIONS_ERROR_STRUCTURE)
    ) {
      const payload = {
        name: permissionObj?.name,
        description: permissionObj?.description,
        type: permissionObj?.type,
        access: permissionObj?.access,
      };
      if (isEdit) {
        putUserPermissionMutate(payload);
      } else {
        postUserPermissionMutate(payload);
      }
    } else {
      setPermissionObjError({
        ...permissionObjError,
        ...errorFields,
      });
    }
  };

  const clearFields = () => {
    setPermissionObjError({ ...PERMISSIONS_ERROR_STRUCTURE });
    setPermissionObj({ ...PERMISSIONS_OBJ_STRUCTURE });
  };

  const handleSearchByPermissionName = () => {
    refetchPermissionsData();
  };

  const handleEnterButton = (e) => {
    if (e.key === 'Enter') {
      handleSearchByPermissionName();
    }
  };

  return {
    allPermissionsData,
    openAddPermission,
    isEdit,
    permissionHeaders,
    permissionHeaderTypes,
    permissionRows,
    permissionObj,
    permissionObjError,
    postUserPermissionStatus,
    actionIndex,
    actionOpen,
    deleteUserPermissionStatus,
    putUserPermissionStatus,
    openDeletePop,
    permissionSearch,
    isFetchingAllPermissions,
    showActionsPanel,
    setShowActionsPanel,
    setPermissionSearch,
    handleSearchByPermissionName,
    handleEnterButton,
    setOpenDeletePop,
    handleDeletePermission,
    setOpenAddPermission,
    setIsEdit,
    handleFieldUpdate,
    handleApplyClick,
    clearFields,
    refetchPermissionsData,
    setActionIndex,
    setActionOpen,
    handleEditPermission,
    setPermissionObj,
    setPermissionObjError,
  };
};

export default usePermissionsList;
