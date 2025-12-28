import React, { lazy, Suspense, useEffect, useRef } from 'react';
import styleComponents from '../../style/pageStyle';
import Skeleton from '@mui/material/Skeleton';
import CustomCTA from '../CustomCTA';
import ICONS from '../../assets/icons';
import { useSnackbar } from 'notistack';
import userTabStyles from '../../style/usersTabStyle';
import usePermissionsList from '../../hooks/users/usePermissionsList';
import usePermission from '../../hooks/usePermission';
import { USER_MANAGEMENT_PERMISSIONS } from '../../constants/permissions';

const DisplayTable = lazy(() => import('../../components/DisplayTable'));
const AddPermissionsDrawer = lazy(() => import('./AddPermissionsDrawer'));
const GlobalPop = lazy(() => import('../../components/GlobalPop'));
const SearchFilter = lazy(() => import('../../components/SearchFilter'));

const { AnimatedBox } = styleComponents();

const { Wrapper, HeaderDiv, StyledDiv, TableDiv } = userTabStyles();

const PermissionsList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = usePermission();
  const isMounted = useRef(false);
  const {
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
  } = usePermissionsList();

  useEffect(() => {
    if (postUserPermissionStatus === 'success') {
      clearFields();
      setOpenAddPermission(false);
      refetchPermissionsData();
      enqueueSnackbar(`User permission has been successfully added.`, {
        variant: 'success',
      });
    } else if (postUserPermissionStatus === 'error') {
      enqueueSnackbar(`Failed to add user permission`, {
        variant: 'error',
      });
    }
  }, [postUserPermissionStatus]);

  useEffect(() => {
    if (putUserPermissionStatus === 'success') {
      clearFields();
      setOpenAddPermission(false);
      refetchPermissionsData();
      enqueueSnackbar(`User permission has been successfully updated.`, {
        variant: 'success',
      });
    } else if (putUserPermissionStatus === 'error') {
      enqueueSnackbar(`Failed to update user permission`, {
        variant: 'error',
      });
    }
  }, [putUserPermissionStatus]);

  useEffect(() => {
    if (deleteUserPermissionStatus === 'success') {
      refetchPermissionsData();
      enqueueSnackbar(`User permission has been successfully deleted.`, {
        variant: 'success',
      });
    } else if (deleteUserPermissionStatus === 'error') {
      enqueueSnackbar(`Failed to delete user permission`, {
        variant: 'error',
      });
    }
  }, [deleteUserPermissionStatus]);

  const handleAddPermission = () => {
    setOpenAddPermission(true);
    setIsEdit(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setOpenAddPermission(true);
    setIsEdit(true);
    handleEditPermission(allPermissionsData[actionIndex]);
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

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by permission name',
      width: '270px',
      setInput: setPermissionSearch,
      enteredInput: permissionSearch,
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
        <StyledDiv $width={'50%'} $gap={'10px'}>
          {allPermissionsData?.length > 0 ? (
            <Suspense fallback={<div></div>}>
              <SearchFilter
                searchArr={searchArr}
                isFilter={false}
                onKeyPress={handleEnterButton}
              />
              <CustomCTA
                onClick={handleSearchByPermissionName}
                title={'Search'}
                showIcon={false}
                color={'#FFF'}
                bgColor={'#141482'}
                isLoading={isFetchingAllPermissions}
                border={'1px solid #CDD4DF'}
              />
            </Suspense>
          ) : null}
        </StyledDiv>
        <StyledDiv $width={'50%'} $justifyContent={'flex-end'}>
          <CustomCTA
            onClick={handleAddPermission}
            url={ICONS.PLUS}
            title={`Add Permission`}
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
            rows={permissionRows}
            headers={permissionHeaders}
            headersType={permissionHeaderTypes}
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
        <AddPermissionsDrawer
          open={openAddPermission}
          toggleDrawer={setOpenAddPermission}
          isEdit={isEdit}
          handleApplyClick={handleApplyClick}
          handleFieldUpdate={handleFieldUpdate}
          clearFields={clearFields}
          postUserPermissionStatus={postUserPermissionStatus}
          permissionObj={permissionObj}
          permissionObjError={permissionObjError}
          putUserPermissionStatus={putUserPermissionStatus}
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
            handleDelete={handleDeletePermission}
          />
        ) : null}
      </Suspense>
    </Wrapper>
  );
};

export default PermissionsList;
