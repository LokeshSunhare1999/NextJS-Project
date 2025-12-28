import React, { useState } from 'react';
import styled from 'styled-components';
import { zIndexValues } from '../../style';
import CustomCTA from '../CustomCTA';
import DisplayDrawer from '../common/DisplayDrawer';
import DrawerInput from '../common/DrawerInput';
import { usePostAddUser } from '../../apis/queryHooks';
import { isValidPhoneNumber } from '../../utils/helper';
import { useSnackbar } from 'notistack';

const StyledHeader = styled.p`
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  color: ${(props) => props?.$color};
  margin: ${(props) => props?.$margin};
  width: ${(props) => (props?.$width ? props?.$width : '100%')};
  display: flex;
  align-items: center;
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'space-between'};
  gap: ${(props) => (props.$gap ? props.$gap : '10px')};
  opacity: ${(props) => (props.$opacity ? props.$opacity : '1')};
`;

const ContentSection = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 16px 20px;
`;

const AddAgentDrawer = ({ open, setOpen, refetchAllFieldAgents }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    mutateAsync: postAddUserMutate,
    status: postAddUserStatus,
    error: postAddUserError,
  } = usePostAddUser();

  const [fieldAgentDetails, setFieldAgentDetails] = useState({
    name: '',
    phoneNumber: '',
  });
  const [fieldAgentDetailsError, setFieldAgentDetailsError] = useState({
    name: '',
    phoneNumber: '',
  });

  const handleFieldUpdate = (e, field) => {
    const value = e.target.value;

    setFieldAgentDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    setFieldAgentDetailsError((prevState) => ({
      ...prevState,
      [field]: '',
    }));
  };

  const handleValidateFieldAgentDetails = () => {
    const newErrors = {
      name: !fieldAgentDetails?.name?.trim(),
      phoneNumber:
        !fieldAgentDetails?.phoneNumber ||
        !isValidPhoneNumber(fieldAgentDetails?.phoneNumber),
    };

    setFieldAgentDetailsError(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    return hasErrors;
  };

  const clearFieldsAndErrors = () => {
    setFieldAgentDetails({
      name: '',
      phoneNumber: '',
    });

    setFieldAgentDetailsError({
      name: '',
      phoneNumber: '',
    });
  };
  const handleCreateFieldAgent = () => {
    if (handleValidateFieldAgentDetails()) return;

    postAddUserMutate({
      userContact: {
        phoneNo: fieldAgentDetails?.phoneNumber,
        dialCode: '+91',
      },
      name: fieldAgentDetails?.name,
      sourceType: 'OPS',
      userReferrence: 'FIELD_AGENT',
      userType: 'CUSTOMER',
    })
      .then(() => {
        enqueueSnackbar('Field Agent Created Successfully', {
          variant: 'success',
        });
        clearFieldsAndErrors();
        refetchAllFieldAgents();
        setOpen(false);
      })
      .finally(() => {
        clearFieldsAndErrors();
      });
  };

  const handleCloseDrawer = () => {
    setOpen(false);
  };

  const headerContent = () => {
    return (
      <StyledHeader
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        Add Agent
      </StyledHeader>
    );
  };

  const footerContent = () => {
    return (
      <>
        <CustomCTA
          onClick={handleCreateFieldAgent}
          title={'Create'}
          color={'#FFF'}
          bgColor={'#141482'}
          isLoading={postAddUserStatus === 'pending'}
          border={'1px solid #CDD4DF'}
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
      zIndex={zIndexValues?.EDIT_DETAILS_DRAWER}
    >
      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Name'}
          fieldError={fieldAgentDetailsError?.name}
          fieldPlaceholder={'Enter Name'}
          fieldValue={fieldAgentDetails?.name}
          handleFieldChange={(e) => handleFieldUpdate(e, 'name')}
          isManadatory={true}
          errorText={`* Name is required`}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Phone Number'}
          fieldError={fieldAgentDetailsError?.phoneNumber}
          fieldPlaceholder={'Enter phone number'}
          fieldValue={fieldAgentDetails?.phoneNumber}
          handleFieldChange={(e) => handleFieldUpdate(e, 'phoneNumber')}
          isManadatory={true}
          errorText={`* Please enter a valid phone number`}
        />
      </ContentSection>
    </DisplayDrawer>
  );
};

export default AddAgentDrawer;
