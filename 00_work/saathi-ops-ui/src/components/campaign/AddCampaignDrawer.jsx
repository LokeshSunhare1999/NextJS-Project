import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { zIndexValues } from '../../style';
import CustomCTA from '../CustomCTA';
import DisplayDrawer from '../common/DisplayDrawer';
import DrawerInput from '../common/DrawerInput';
import { usePostCampaign } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import { isEmpty } from '../../utils/helper';

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

const AddCampaignDrawer = ({ open, setOpen, refetchAllCampaigns, editData = null }) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    mutateAsync: postAddCampaignMutate,
    status: postAddCampaignStatus,
    error: postAddCampaignError,
  } = usePostCampaign();

  const [fieldCampaignDetails, setFieldCampaignDetails] = useState({
    jobId: '',
    campaignId: '',
  });
  const [fieldCampaignDetailsError, setFieldCampaignDetailsError] = useState({
    jobId: '',
    campaignId: '',
  });

  useEffect(() => {
    if (!isEmpty(editData) && open) {
      setFieldCampaignDetails({
        jobId: editData.jobId || null,
        campaignId: editData.campaignId || null,
      });
    } else if (!isEmpty(editData)) {
      clearFieldsAndErrors();
    }
  }, [editData, open]);

  const handleFieldUpdate = (e, field) => {
    const value = e.target.value;

    setFieldCampaignDetails((prevState) => ({
      ...prevState,
      [field]: value,
    }));

    setFieldCampaignDetailsError((prevState) => ({
      ...prevState,
      [field]: '',
    }));
  };

  const handleValidateFieldAgentDetails = () => {
    const newErrors = {
      jobId: !fieldCampaignDetails?.jobId?.toString()?.trim(),
      campaignId: !fieldCampaignDetails?.campaignId?.toString()?.trim(),
    };

    setFieldCampaignDetailsError(newErrors);

    const hasErrors = Object.values(newErrors).some((error) => error);
    return hasErrors;
  };

  const clearFieldsAndErrors = () => {
    setFieldCampaignDetails({
      jobId: '',
      campaignId: '',
    });

    setFieldCampaignDetailsError({
      jobId: '',
      campaignId: '',
    });
  };
  const handleCreateFieldAgent = () => {
    if (handleValidateFieldAgentDetails()) return;

    const payload = {
      jobId: fieldCampaignDetails?.jobId,
      campaignId: fieldCampaignDetails?.campaignId,
    };

    if (!isEmpty(editData) && editData?._id) {
      payload._id = editData._id;
    }

    const successMessage = !isEmpty(editData) ? 'Campaign Updated Successfully' : 'Campaign Created Successfully';

    postAddCampaignMutate(payload)
      .then(() => {
        enqueueSnackbar(successMessage, {
          variant: 'success',
        });
        clearFieldsAndErrors();
        refetchAllCampaigns();
        setOpen(false);
      })
      .catch((error) => {
        enqueueSnackbar(
          !isEmpty(editData) ? 'Failed to update campaign' : 'Failed to create campaign',
          { variant: 'error' }
        );
      })
  };

  const handleCloseDrawer = () => {
    setOpen(false);
    if (!isEmpty(editData)) {
      clearFieldsAndErrors();
    }
  };

  const headerContent = () => {
    return (
      <StyledHeader
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        {!isEmpty(editData) ? 'Edit Campaign' : 'Add Campaign'}
      </StyledHeader>
    );
  };

  const footerContent = () => {
    return (
      <>
        <CustomCTA
          onClick={handleCreateFieldAgent}
          title={!isEmpty(editData) ? 'Update' : 'Add'}
          color={'#FFF'}
          bgColor={'#141482'}
          disabled={fieldCampaignDetails?.jobId?.toString()?.trim() === '' || fieldCampaignDetails?.campaignId?.toString()?.trim() === ''}
          isLoading={postAddCampaignStatus === 'pending'}
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
          fieldHeader={'Job ID'}
          fieldError={fieldCampaignDetailsError?.jobId}
          fieldPlaceholder={'Enter Job ID'}
          fieldValue={fieldCampaignDetails?.jobId}
          handleFieldChange={(e) => handleFieldUpdate(e, 'jobId')}
          isManadatory={true}
          errorText={`* Please enter Job ID`}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Campaign ID'}
          fieldError={fieldCampaignDetailsError?.campaignId}
          fieldPlaceholder={'Enter Campaign ID'}
          fieldValue={fieldCampaignDetails?.campaignId}
          handleFieldChange={(e) => handleFieldUpdate(e, 'campaignId')}
          isManadatory={true}
          errorText={`* Please enter Campaign ID`}
        />
      </ContentSection>
    </DisplayDrawer>
  );
};

export default AddCampaignDrawer;
