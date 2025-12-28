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

const AddRolesDrawer = ({
  open,
  toggleDrawer,
  isEdit = false,
  handleFieldUpdate,
  permissionsCheckbox,
  handlePermissionsCheckbox,
  handleApplyClick,
  clearFields,
  postUserRoleStatus,
  roleObj,
  roleObjError,
  putUserRoleStatus,
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
        {isEdit ? 'Edit Role' : 'Add Role'}
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
            postUserRoleStatus === 'pending' || putUserRoleStatus === 'pending'
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
          fieldHeader={'Role Name'}
          fieldError={roleObjError?.name}
          fieldPlaceholder={'Enter role name'}
          fieldValue={roleObj?.name}
          handleFieldChange={(e) => handleFieldUpdate(e, 'name')}
          isManadatory={true}
          errorText={`* Role name is required and should be between ${ROLE_NAME_MIN_LENGTH} & ${ROLE_NAME_MAX_LENGTH} characters.`}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Role Description'}
          fieldError={roleObjError?.description}
          fieldPlaceholder={'Enter role description'}
          fieldValue={roleObj?.description}
          handleFieldChange={(e) => handleFieldUpdate(e, 'description')}
          isManadatory={true}
          errorText={`* Role description is required and should be between ${ROLE_DESCRIPTION_MIN_LENGTH} & ${ROLE_DESCRIPTION_MAX_LENGTH} characters.`}
        />
      </ContentSection>
      <ContentSection>
        <DrawerInput
          fieldType="filter"
          fieldHeader="Add Permissions"
          filterHeader="Permission List"
          headerWeight="400"
          filterClassname={filterClassname}
          checkboxes={permissionsCheckbox}
          handleCheckboxChange={handlePermissionsCheckbox}
        />
      </ContentSection>
    </DisplayDrawer>
  );
};

AddRolesDrawer.propTypes = {
  open: PropTypes.bool,
  toggleDrawer: PropTypes.func,
  isEdit: PropTypes.bool,
  handleFieldUpdate: PropTypes.func,
  permissionsCheckbox: PropTypes.array,
  handlePermissionsCheckbox: PropTypes.func,
  handleApplyClick: PropTypes.func,
  clearFields: PropTypes.func,
  postUserRoleStatus: PropTypes.string,
  roleObj: PropTypes.object,
  roleObjError: PropTypes.object,
  putUserRoleStatus: PropTypes.string,
};

export default AddRolesDrawer;
