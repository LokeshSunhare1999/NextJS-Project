import React, { lazy, Suspense, useEffect, useRef } from 'react';
import styleComponents from '../../style/pageStyle';
import Skeleton from '@mui/material/Skeleton';
import CustomCTA from '../CustomCTA';
import ICONS from '../../assets/icons';
import useRolesList from '../../hooks/users/useRolesList';
import { useSnackbar } from 'notistack';
import userTabStyles from '../../style/usersTabStyle';
import { USER_MANAGEMENT_PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';

const DisplayTable = lazy(() => import('../../components/DisplayTable'));
const AddRolesDrawer = lazy(() => import('./AddRolesDrawer'));
const GlobalPop = lazy(() => import('../../components/GlobalPop'));

const { AnimatedBox } = styleComponents();

const { Wrapper, HeaderDiv, StyledDiv, TableDiv } = userTabStyles();

const RolesList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = usePermission();
  const isMounted = useRef(false);
  const {
    allRolesData,
    openAddRoles,
    isEdit,
    rolesHeaders,
    rolesHeaderTypes,
    rolesRows,
    actionIndex,
    actionOpen,
    permissionsCheckbox,
    postUserRoleStatus,
    roleObj,
    roleObjError,
    putUserRoleStatus,
    openDeletePop,
    deleteUserRoleStatus,
    showActionsPanel,
    setShowActionsPanel,
    setOpenDeletePop,
    handleDeleteRole,
    refetchRolesData,
    handlePermissionsCheckbox,
    handleApplyClick,
    clearFields,
    setActionOpen,
    handleEditRole,
    handleFieldUpdate,
    setActionIndex,
    setIsEdit,
    setOpenAddRoles,
  } = useRolesList();

  useEffect(() => {
    if (postUserRoleStatus === 'success') {
      clearFields();
      setOpenAddRoles(false);
      refetchRolesData();
      enqueueSnackbar(`User role has been successfully added.`, {
        variant: 'success',
      });
    } else if (postUserRoleStatus === 'error') {
      enqueueSnackbar(`Failed to add user role`, {
        variant: 'error',
      });
    }
  }, [postUserRoleStatus]);

  useEffect(() => {
    if (putUserRoleStatus === 'success') {
      clearFields();
      setOpenAddRoles(false);
      refetchRolesData();
      enqueueSnackbar(`User role has been successfully updated.`, {
        variant: 'success',
      });
    } else if (putUserRoleStatus === 'error') {
      enqueueSnackbar(`Failed to update user role`, {
        variant: 'error',
      });
    }
  }, [putUserRoleStatus]);

  useEffect(() => {
    if (deleteUserRoleStatus === 'success') {
      refetchRolesData();
      enqueueSnackbar(`User role has been successfully deleted.`, {
        variant: 'success',
      });
    } else if (deleteUserRoleStatus === 'error') {
      enqueueSnackbar(`Failed to delete user role`, {
        variant: 'error',
      });
    }
  }, [deleteUserRoleStatus]);

  const handleAddRole = () => {
    setOpenAddRoles(true);
    setIsEdit(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setOpenAddRoles(true);
    setIsEdit(true);
    handleEditRole(allRolesData[actionIndex]);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpenDeletePop(true);
  };

  const arrBtn = [
    {
      text: 'Edit',
      icon: ICONS.PENCIL,
      active: true,
      isVisible: true,
      color: '#000',
      onClick: handleEditClick,
      permission: USER_MANAGEMENT_PERMISSIONS?.EDIT_USER_MANAGEMENT,
    },
    {
      text: 'Delete',
      icon: ICONS.DELETE_ICON,
      active: true,
      isVisible: true,
      color: '#DD4141',
      onClick: handleDeleteClick,
      permission: USER_MANAGEMENT_PERMISSIONS?.EDIT_USER_MANAGEMENT,
    },
  ];

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }

    if (arrBtn.length > 0) {
      const hasAnyPermission = arrBtn.some((btn) =>
        hasPermission(btn.permission),
      );
      setShowActionsPanel(hasAnyPermission);
    }
  }, [arrBtn]);

  return (
    <Wrapper>
      <HeaderDiv>
        <StyledDiv $width={'50%'}></StyledDiv>
        <StyledDiv $width={'50%'} $justifyContent={'flex-end'}>
          <CustomCTA
            onClick={handleAddRole}
            url={ICONS.PLUS}
            title={`Add Role`}
            showIcon={true}
            bgColor={'#677995'}
            color={'#FFF'}
            border={'none'}
            fontSize={'12px'}
            gap={'12px'}
          />
        </StyledDiv>
      </HeaderDiv>
      <Suspense
        fallback={
          <AnimatedBox>
            {[1, 2, 3, 4, 5].map((item, idx) => {
              return <Skeleton animation="wave" height={70} key={idx} />;
            })}
          </AnimatedBox>
        }
      >
        {/* DisplayTable component - make sure to add the TableDiv for positioning of the action menu */}
        <TableDiv>
          <DisplayTable
            tableId={'roles'}
            rows={rolesRows}
            headers={rolesHeaders}
            headersType={rolesHeaderTypes}
            showActionsPanel={showActionsPanel}
            tableWidth={'100%'}
            arrBtn={arrBtn}
            actionIndex={actionIndex}
            setActionIndex={setActionIndex}
            actionOpen={actionOpen}
            setActionOpen={setActionOpen}
            isActionBottom={true}
          />
        </TableDiv>
      </Suspense>
      <Suspense fallback={<div></div>}>
        <AddRolesDrawer
          open={openAddRoles}
          toggleDrawer={setOpenAddRoles}
          isEdit={isEdit}
          handleApplyClick={handleApplyClick}
          handleFieldUpdate={handleFieldUpdate}
          handlePermissionsCheckbox={handlePermissionsCheckbox}
          permissionsCheckbox={permissionsCheckbox}
          clearFields={clearFields}
          postUserRoleStatus={postUserRoleStatus}
          roleObj={roleObj}
          roleObjError={roleObjError}
          putUserRoleStatus={putUserRoleStatus}
        />
        {openDeletePop ? (
          <GlobalPop
            open={openDeletePop}
            setOpenDeletePop={setOpenDeletePop}
            title={'Delete Role'}
            heading={'Are you sure you want to delete this role?'}
            subHeading={'This action is permanent and cannot be undone.'}
            confirmText={'Delete'}
            cancelText={'Cancel'}
            handleDelete={handleDeleteRole}
          />
        ) : null}
      </Suspense>
    </Wrapper>
  );
};

export default RolesList;
