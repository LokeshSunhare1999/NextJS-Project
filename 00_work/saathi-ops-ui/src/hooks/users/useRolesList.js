import { useState, useEffect } from 'react';
import {
  useGetAllRoles,
  useGetAllPermissions,
  usePostUserRole,
  usePutUserRole,
  useDeleteUserRole,
} from '../../apis/queryHooks';
import { getNestedProperty, textLengthCheck } from '../../utils/helper';
import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_DESCRIPTION_MIN_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
  ROLES_OBJ_STRUCTURE,
  ROLES_ERROR_STRUCTURE,
} from '../../constants/users';

const useRolesList = () => {
  const [permissionSearch, setPermissionSearch] = useState('');
  const [showActionsPanel, setShowActionsPanel] = useState(false);
  const [openDeletePop, setOpenDeletePop] = useState(false);
  const [actionIndex, setActionIndex] = useState('');
  const [actionOpen, setActionOpen] = useState(false);
  const [openAddRoles, setOpenAddRoles] = useState(false);
  const [permissionsCheckbox, setPermissionsCheckbox] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [roleObj, setRoleObj] = useState({ ...ROLES_OBJ_STRUCTURE });

  const [roleObjError, setRoleObjError] = useState({
    ...ROLES_ERROR_STRUCTURE,
  });

  const { data: allRolesResponse, refetch: refetchRolesData } =
    useGetAllRoles();

  const allRolesData = allRolesResponse?.response || [];

  const rolesHeader = allRolesResponse?.headers || [];

  const { data: allPermissionsResponse } = useGetAllPermissions({
    permissionSearch,
  });

  const allPermissionsData = allPermissionsResponse?.response || [];

  const { mutate: postUserRoleMutate, status: postUserRoleStatus } =
    usePostUserRole();

  const { mutate: putUserRoleMutate, status: putUserRoleStatus } =
    usePutUserRole(allRolesData?.[actionIndex]?._id);

  const { mutate: deleteUserRoleMutate, status: deleteUserRoleStatus } =
    useDeleteUserRole();

  const handlePermissionsCheckbox = (value) => {
    setPermissionsCheckbox((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const rolesHeaders = rolesHeader.map((item) => item?.value) || [];

  const rolesHeaderTypes = rolesHeader.map((item) => item?.type) || [];

  const rolesRows = allRolesData?.map((role) => createData(role));

  const permissionsIndex = rolesHeaders.indexOf('Permissions');

  rolesRows?.map((role) => {
    role[permissionsIndex] = [
      ...new Set(role[permissionsIndex]?.map((permission) => permission.name)),
    ];
  });

  useEffect(() => {
    setPermissionsCheckbox(
      allPermissionsData?.map((permission) => ({
        key: permission,
        value: permission.name,
        checked: false,
      })),
    );
  }, [allPermissionsData]);

  function createData(roles) {
    const rolesHeaderKeys = Array.from(rolesHeader.map((item) => item.key));
    return rolesHeaderKeys.map((item) => {
      const itemKey = item.replace(/['"]+/g, '');
      return getNestedProperty(roles, itemKey);
    });
  }

  const handleFieldUpdate = (e, fieldName) => {
    switch (fieldName) {
      case 'name':
        setRoleObj({ ...roleObj, name: e.target.value });
        break;

      case 'description':
        setRoleObj({ ...roleObj, description: e.target.value });
        break;
    }
  };

  const handleDeleteRole = () => {
    deleteUserRoleMutate(allRolesData[actionIndex]?._id);
    setOpenDeletePop(false);
  };

  const handleEditRole = (role) => {
    const permissionNames = new Set(role?.permissions?.map((p) => p.name));

    const updatedPermissionsCheckboxes = permissionsCheckbox?.map(
      (permissionCheckbox) => ({
        ...permissionCheckbox,
        checked: permissionNames.has(permissionCheckbox.value),
      }),
    );

    setRoleObj({
      ...roleObj,
      name: role?.name,
      description: role?.description,
    });
    setPermissionsCheckbox(updatedPermissionsCheckboxes);
  };

  const handleApplyClick = () => {
    const errorFields = {
      name: textLengthCheck(
        roleObj?.name,
        ROLE_NAME_MAX_LENGTH,
        ROLE_NAME_MIN_LENGTH,
      ),
      description: textLengthCheck(
        roleObj?.description,
        ROLE_DESCRIPTION_MAX_LENGTH,
        ROLE_DESCRIPTION_MIN_LENGTH,
      ),
    };
    if (JSON.stringify(errorFields) === JSON.stringify(ROLES_ERROR_STRUCTURE)) {
      const payload = {
        name: roleObj?.name,
        description: roleObj?.description,
        permissions: permissionsCheckbox
          .filter((permission) => permission.checked)
          .map((permission) => permission.key),
      };
      if (isEdit) {
        putUserRoleMutate(payload);
      } else {
        postUserRoleMutate(payload);
      }
    } else {
      setRoleObjError({
        ...roleObjError,
        ...errorFields,
      });
    }
  };

  const clearFields = () => {
    setRoleObjError({ ...ROLES_ERROR_STRUCTURE });
    setRoleObj({ ...ROLES_OBJ_STRUCTURE });
    setPermissionsCheckbox(
      permissionsCheckbox.map((permission) => ({
        ...permission,
        checked: false,
      })),
    );
  };

  return {
    allRolesData,
    openAddRoles,
    isEdit,
    rolesHeaders,
    rolesHeaderTypes,
    rolesRows,
    permissionsCheckbox,
    postUserRoleStatus,
    actionIndex,
    actionOpen,
    roleObj,
    roleObjError,
    deleteUserRoleStatus,
    putUserRoleStatus,
    openDeletePop,
    showActionsPanel,
    setShowActionsPanel,
    setOpenDeletePop,
    handleDeleteRole,
    setOpenAddRoles,
    setIsEdit,
    handleFieldUpdate,
    handlePermissionsCheckbox,
    handleApplyClick,
    clearFields,
    refetchRolesData,
    setActionIndex,
    setActionOpen,
    handleEditRole,
    setRoleObj,
    setRoleObjError,
  };
};

export default useRolesList;
