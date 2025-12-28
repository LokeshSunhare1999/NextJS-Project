import React, { useContext } from 'react';
import { UserContext } from '../context/UserContext';

const usePermission = () => {
  const { user } = useContext(UserContext);

  function extractPermissions(roles) {
    return roles?.flatMap(
      (role) => role?.permissions?.map((permission) => permission.name), // Extracting permission name
    );
  }

  const userPermissions = extractPermissions(user?.userRoles);

  const hasPermission = (permission) => {
    return !userPermissions || userPermissions?.includes(permission);
  };

  const hasPermissionsArray = (permissionsArray) => {
    if (!userPermissions) return false;
    return permissionsArray.some((permission) =>
      userPermissions.includes(permission),
    );
  };

  return { hasPermission, hasPermissionsArray };
};

export default usePermission;
