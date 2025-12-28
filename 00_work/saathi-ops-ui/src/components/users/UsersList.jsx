import React, { lazy, Suspense, useEffect, useRef } from 'react';
import styleComponents from '../../style/pageStyle';
import Skeleton from '@mui/material/Skeleton';
import CustomCTA from '../CustomCTA';
import ICONS from '../../assets/icons';
import { useSnackbar } from 'notistack';
import userTabStyles from '../../style/usersTabStyle';
import useUsersList from '../../hooks/users/useUsersList';
import { USER_MANAGEMENT_PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';

const DisplayTable = lazy(() => import('../../components/DisplayTable'));
const AddUsersDrawer = lazy(() => import('./AddUsersDrawer'));
const GlobalPop = lazy(() => import('../../components/GlobalPop'));
const Pagination = lazy(
  () => import('../../components/atom/tableComponents/Pagination'),
);
const SearchFilter = lazy(() => import('../../components/SearchFilter'));

const { AnimatedBox } = styleComponents();

const { Wrapper, HeaderDiv, StyledDiv, TableDiv, TopPageWrap } =
  userTabStyles();

const UsersList = () => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    allUsersData,
    userHeaderTypes,
    userHeaders,
    userRows,
    openAddUsers,
    isEdit,
    userObj,
    userObjError,
    userTypeCategoryOpen,
    rolesCheckbox,
    setUserTypeCategoryOpen,
    postAddUserStatus,
    postAddUserError,
    putUserStatus,
    currentPage,
    itemsPerPage,
    totalItems,
    openSizeDropdown,
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
    setOpenAddUsers,
    setIsEdit,
    handleFieldUpdate,
    handleUserTypeCategorySelect,
    clearFields,
    handleRolesCheckbox,
    handleApplyClick,
    refetchUsersData,
    handleEditUser,
    handleEnterButton,
    handleSearchByEmail,
  } = useUsersList();

  const isMounted = useRef(false);
  const { hasPermission } = usePermission();

  useEffect(() => {
    if (postAddUserStatus === 'success') {
      clearFields();
      setOpenAddUsers(false);
      refetchUsersData();
      enqueueSnackbar(`User has been successfully added.`, {
        variant: 'success',
      });
    } else if (postAddUserStatus === 'error') {
      if (postAddUserError?.response?.data?.error?.message) {
        enqueueSnackbar(postAddUserError?.response?.data?.error?.message, {
          variant: 'error',
        });
      } else {
        enqueueSnackbar(`Failed to add user`, {
          variant: 'error',
        });
      }
    }
  }, [postAddUserStatus]);

  useEffect(() => {
    if (putUserStatus === 'success') {
      clearFields();
      setOpenAddUsers(false);
      refetchUsersData();
      enqueueSnackbar(`User has been successfully updated.`, {
        variant: 'success',
      });
    } else if (putUserStatus === 'error') {
      enqueueSnackbar(`Failed to update user`, {
        variant: 'error',
      });
    }
  }, [putUserStatus]);

  useEffect(() => {
    if (deleteUserStatus === 'success') {
      refetchUsersData();
      enqueueSnackbar(`User has been successfully deleted.`, {
        variant: 'success',
      });
    } else if (deleteUserStatus === 'error') {
      enqueueSnackbar(`Failed to delete user`, {
        variant: 'error',
      });
    }
  }, [deleteUserStatus]);

  const handleAddUser = () => {
    setOpenAddUsers(true);
    setIsEdit(false);
  };

  const handleEditClick = (e) => {
    e.stopPropagation();
    setOpenAddUsers(true);
    setIsEdit(true);
    handleEditUser(allUsersData?.[actionIndex]);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setOpenDeletePop(true);
  };

  const searchArr = [
    {
      id: 1,
      placeHolder: 'Search by user email',
      width: '270px',
      setInput: setEmailSearch,
      enteredInput: emailSearch,
    },
  ];

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
        <StyledDiv $width={'50%'} $gap={'10px'}>
          <Suspense fallback={<div></div>}>
            <SearchFilter
              searchArr={searchArr}
              isFilter={false}
              onKeyPress={handleEnterButton}
            />
            <CustomCTA
              onClick={handleSearchByEmail}
              title={'Search'}
              showIcon={false}
              color={'#FFF'}
              bgColor={'#141482'}
              isLoading={isGetAllUsersFetching}
              border={'1px solid #CDD4DF'}
            />
          </Suspense>
        </StyledDiv>
        <StyledDiv $width={'50%'} $justifyContent={'flex-end'}>
          <CustomCTA
            onClick={handleAddUser}
            url={ICONS.PLUS}
            title={`Add User`}
            showIcon={true}
            bgColor={'#677995'}
            color={'#FFF'}
            border={'none'}
            fontSize={'12px'}
            gap={'12px'}
          />
        </StyledDiv>
      </HeaderDiv>
      <Suspense>
        <TopPageWrap>
          <Pagination
            isBackground={false}
            onShowSizeChange={onShowSizeChange}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            setItemsPerPage={setItemsPerPage}
            arrowBg={'#fff'}
            isFlexColumn={true}
            isBottom={false}
            setOpenDropdown={setOpenSizeDropdown}
            openDropdown={openSizeDropdown}
            handleDropdown={handleOpenSizeDropdown}
          />
        </TopPageWrap>
      </Suspense>
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
            tableId={'users'}
            rows={userRows}
            headers={userHeaders}
            headersType={userHeaderTypes}
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
        <AddUsersDrawer
          open={openAddUsers}
          toggleDrawer={setOpenAddUsers}
          isEdit={isEdit}
          handleApplyClick={handleApplyClick}
          handleFieldUpdate={handleFieldUpdate}
          handleUserTypeCategorySelect={handleUserTypeCategorySelect}
          handleRolesCheckbox={handleRolesCheckbox}
          rolesCheckbox={rolesCheckbox}
          clearFields={clearFields}
          postAddUserStatus={postAddUserStatus}
          userObj={userObj}
          userObjError={userObjError}
          userTypeCategoryOpen={userTypeCategoryOpen}
          setUserTypeCategoryOpen={setUserTypeCategoryOpen}
          putUserStatus={putUserStatus}
        />
        {openDeletePop ? (
          <GlobalPop
            open={openDeletePop}
            setOpenDeletePop={setOpenDeletePop}
            title={'Delete User'}
            heading={'Are you sure you want to delete this user?'}
            subHeading={'This action is permanent and cannot be undone.'}
            confirmText={'Delete'}
            cancelText={'Cancel'}
            handleDelete={handleDeleteUser}
          />
        ) : null}
      </Suspense>
    </Wrapper>
  );
};

export default UsersList;
