import React from 'react';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';
import CustomCTA from '../CustomCTA';
import DisplayDrawer from '../common/DisplayDrawer';
import DrawerInput from '../common/DrawerInput';
import {
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
  USER_TYPES,
} from '../../constants/users';
import userTabStyles from '../../style/usersTabStyle';

const { StyledHeader, ContentSection } = userTabStyles();

const AddUsersDrawer = ({
  open,
  toggleDrawer,
  isEdit = false,
  userObj,
  userObjError,
  handleFieldUpdate,
  userTypeCategoryOpen,
  rolesCheckbox,
  postAddUserStatus,
  putUserStatus,
  setUserTypeCategoryOpen,
  handleUserTypeCategorySelect,
  clearFields,
  handleRolesCheckbox,
  handleApplyClick,
}) => {
  const handleCloseDrawer = () => {
    toggleDrawer();
    clearFields();
  };

  const filterClassname = {
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '5px',
  };

  const headerContent = () => {
    return (
      <StyledHeader
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        {isEdit ? 'Edit User' : 'Add User'}
      </StyledHeader>
    );
  };

  const footerContent = () => {
    return (
      <>
        <CustomCTA
          onClick={handleApplyClick}
          title={'Save'}
          color={'#FFF'}
          bgColor={'#141482'}
          border={'1px solid #CDD4DF'}
          isLoading={
            postAddUserStatus === 'pending' || putUserStatus === 'pending'
          }
        />
      </>
    );
  };

  return (
    <DisplayDrawer
      open={open}
      handleCloseDrawer={handleCloseDrawer}
      headerContent={headerContent}
      footerContent={footerContent}
      zIndex={zIndexValues?.CUSTOMER_FILTER_DRAWER}
    >
      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'User Name'}
          fieldError={userObjError?.name}
          fieldPlaceholder={'Enter user name'}
          fieldValue={userObj?.name}
          handleFieldChange={(e) => handleFieldUpdate(e, 'name')}
          isManadatory={true}
          errorText={`* User name is required and should be between ${ROLE_NAME_MIN_LENGTH} & ${ROLE_NAME_MAX_LENGTH} characters.`}
        />
      </ContentSection>
      {!isEdit ? (
        <>
          <ContentSection>
            <DrawerInput
              fieldType={'input'}
              fieldHeader={'User Email'}
              fieldError={userObjError?.email}
              fieldPlaceholder={'Enter user email'}
              fieldValue={userObj?.email}
              handleFieldChange={(e) => handleFieldUpdate(e, 'email')}
              isManadatory={true}
              errorText={`* User email is required and should be a valid one.`}
            />
          </ContentSection>
          <ContentSection>
            <DrawerInput
              fieldType={'input'}
              fieldHeader={'User Phone'}
              fieldError={userObjError?.phone}
              fieldPlaceholder={'Enter user phone'}
              fieldValue={userObj?.phone}
              handleFieldChange={(e) => handleFieldUpdate(e, 'phone')}
              isManadatory={true}
              errorText={`* User phone is required and should be a valid one.`}
            />
          </ContentSection>
          <ContentSection>
            <DrawerInput
              isManadatory={true}
              fieldType={'dropdown'}
              fieldHeader={'User Type'}
              fieldError={userObjError?.userType}
              errorText={'* User Type  is required.'}
              fieldValue={userObj?.userType || 'Select User Type'}
              handleDropDownSelect={handleUserTypeCategorySelect}
              dropDownOpen={userTypeCategoryOpen}
              handleDropDownOpen={setUserTypeCategoryOpen}
              dropDownList={USER_TYPES}
              isDropDownDisabled={true}
            />
          </ContentSection>
        </>
      ) : null}
      <ContentSection>
        <DrawerInput
          fieldType="filter"
          fieldHeader="Add Roles"
          filterHeader="Roles List"
          headerWeight="400"
          filterClassname={filterClassname}
          checkboxes={rolesCheckbox}
          handleCheckboxChange={handleRolesCheckbox}
        />
      </ContentSection>
    </DisplayDrawer>
  );
};

AddUsersDrawer.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  isEdit: PropTypes.bool,
  userObj: PropTypes.object,
  userObjError: PropTypes.object,
  handleFieldUpdate: PropTypes.func,
  userTypeCategoryOpen: PropTypes.bool,
  rolesCheckbox: PropTypes.array,
  postAddUserStatus: PropTypes.string,
  putUserStatus: PropTypes.string,
  setUserTypeCategoryOpen: PropTypes.func,
  handleUserTypeCategorySelect: PropTypes.func,
  clearFields: PropTypes.func,
  handleRolesCheckbox: PropTypes.func,
  handleApplyClick: PropTypes.func,
};

export default AddUsersDrawer;
