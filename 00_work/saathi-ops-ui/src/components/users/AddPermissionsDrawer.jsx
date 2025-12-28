import React from 'react';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';
import CustomCTA from '../CustomCTA';
import DisplayDrawer from '../common/DisplayDrawer';
import DrawerInput from '../common/DrawerInput';
import {
  ROLE_DESCRIPTION_MAX_LENGTH,
  ROLE_DESCRIPTION_MIN_LENGTH,
  ROLE_NAME_MAX_LENGTH,
  ROLE_NAME_MIN_LENGTH,
} from '../../constants/users';
import userTabStyles from '../../style/usersTabStyle';

const { StyledHeader, ContentSection } = userTabStyles();

const AddPermissionsDrawer = ({
  open,
  toggleDrawer,
  isEdit = false,
  handleFieldUpdate,
  handleApplyClick,
  clearFields,
  postUserPermissionStatus,
  permissionObj,
  permissionObjError,
  putUserPermissionStatus,
}) => {
  const handleCloseDrawer = () => {
    toggleDrawer();
    clearFields();
  };

  const headerContent = () => {
    return (
      <StyledHeader
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        {isEdit ? 'Edit Permission' : 'Add Permission'}
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
            postUserPermissionStatus === 'pending' ||
            putUserPermissionStatus === 'pending'
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
          fieldHeader={'Permission Name'}
          fieldError={permissionObjError?.name}
          fieldPlaceholder={'Enter permission name'}
          fieldValue={permissionObj?.name}
          handleFieldChange={(e) => handleFieldUpdate(e, 'name')}
          isManadatory={true}
          errorText={`* Permission name is required and should be between ${ROLE_NAME_MIN_LENGTH} & ${ROLE_NAME_MAX_LENGTH} characters.`}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Permission Description'}
          fieldError={permissionObjError?.description}
          fieldPlaceholder={'Enter permission description'}
          fieldValue={permissionObj?.description}
          handleFieldChange={(e) => handleFieldUpdate(e, 'description')}
          isManadatory={true}
          errorText={`* Permission description is required and should be between ${ROLE_DESCRIPTION_MIN_LENGTH} & ${ROLE_DESCRIPTION_MAX_LENGTH} characters.`}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Permission Type'}
          fieldError={permissionObjError?.type}
          fieldPlaceholder={'Enter permission type'}
          fieldValue={permissionObj?.type}
          handleFieldChange={(e) => handleFieldUpdate(e, 'type')}
          isManadatory={true}
          errorText={`* Permission type is required and should be between ${ROLE_NAME_MIN_LENGTH} & ${ROLE_NAME_MAX_LENGTH} characters.`}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Permission Access'}
          fieldError={permissionObjError?.access}
          fieldPlaceholder={'Enter permission access'}
          fieldValue={permissionObj?.access}
          handleFieldChange={(e) => handleFieldUpdate(e, 'access')}
          isManadatory={true}
          errorText={`* Permission access is required and should be between ${ROLE_NAME_MIN_LENGTH} & ${ROLE_NAME_MAX_LENGTH} characters.`}
        />
      </ContentSection>
    </DisplayDrawer>
  );
};

AddPermissionsDrawer.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  isEdit: PropTypes.bool,
  handleFieldUpdate: PropTypes.func,
  handleApplyClick: PropTypes.func,
  clearFields: PropTypes.func,
  postUserPermissionStatus: PropTypes.string,
  permissionObj: PropTypes.object,
  permissionObjError: PropTypes.object,
  putUserPermissionStatus: PropTypes.string,
};

export default AddPermissionsDrawer;
