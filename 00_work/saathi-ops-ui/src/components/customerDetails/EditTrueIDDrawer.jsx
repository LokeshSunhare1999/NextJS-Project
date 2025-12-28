import React, { useEffect } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';
import {
  FILE_TYPES,
  MAX_DOC_IMAGE_FILE_SIZE_MB,
  MAX_IMAGE_API_TIMER,
  MAX_INTRO_VIDEO_FILE_SIZE_MB,
  MAX_VIDEO_API_TIMER,
} from '../../constants';
import {
  ADDRESS_MAX_LENGTH,
  ADDRESS_MIN_LENGTH,
  CITY_MAX_LENGTH,
  CITY_MIN_LENGTH,
  MAX_EXPERIENCE,
  MIN_EXPERIENCE,
  PIN_LENGTH,
  STATES_LIST,
} from '../../constants/details';
import FileUpload from '../courses/FileUpload';
import CustomCTA from '../CustomCTA';
import { useSnackbar } from 'notistack';
import useCustomerEditDetails from '../../hooks/customer/useCustomerEditDetails';
import DisplayDrawer from '../common/DisplayDrawer';
import DrawerInput from '../common/DrawerInput';
import useTrueIDEditDetails from '../../hooks/customer/useTrueIDEditDetails';

const ContentSection = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 16px 20px;
`;

const ContentGrid = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 16px 20px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(50% - 8px);
`;

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

const StyledInput = styled.input`
  position: ${(props) => (props.$position ? props.$position : 'relative')};
  z-index: ${(props) => (props.$zIndex ? props.$zIndex : 'auto')};
  left: ${(props) => (props.$left ? props.$left : '0')};
  top: ${(props) => (props.$top ? props.$top : '0')};
  width: ${(props) => (props.$width ? props.$width : 'calc(100% - 40px)')};
  height: 20px;
  margin-top: 10px;
  border-radius: 8px;
  color: #000000bf;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
  border: ${(props) => (props?.$isError ? '1px solid red' : '')};
  text-align: ${(props) => (props.$textAlign ? props.$textAlign : 'left')};
`;

const StyledButton = styled.button`
  position: ${(props) => (props?.$position ? props?.$position : 'relative')};
  top: ${(props) => (props?.$top ? props?.$top : null)};
  left: ${(props) => (props?.$left ? props?.$left : null)};
  right: ${(props) => (props?.$right ? props?.$right : null)};
  z-index: ${(props) => (props?.$zIndex ? props?.$zIndex : '3')};
  width: ${(props) => (props.$width ? props.$width : '20px')};
  font-size: 24px;
  line-height: 24px;
  color: #8c8c8c;
  background: transparent;
  border: none;
  cursor: pointer;
`;

const StyledDiv = styled.div`
  position: relative;
  height: ${(props) => (props.$height ? props.$height : '50px')};
  width: ${(props) => (props.$width ? props.$width : '100%')};
  margin: ${(props) => (props.$margin ? props.$margin : null)};
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const EditTrueIDDrawer = ({
  open,
  toggleDrawer,
  customerId,
  detailsData,
  refetchCustomerData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    editTrueIDObj,
    editTrueIDError,
    tempLivePhotoDelete,
    trueIDDetailsStatus,
    livePhotoFileData,
    livePhotoUploadStatus,
    livePhotoFileSizeError,
    clearFields,
    handleInputDelete,
    handleFieldUpdate,
    handleSaveClick,
    setTempLivePhotoDelete,
    handleLivePhotoInputChange,
    abortLivePhotoUpload,
    resetLivePhotoFileData,
    setLivePhotoFileSizeError,
  } = useTrueIDEditDetails(detailsData, customerId, open);

  useEffect(() => {
    if (trueIDDetailsStatus === 'success') {
      resetLivePhotoFileData();
      clearFields();
      toggleDrawer(false);
      refetchCustomerData();
      enqueueSnackbar(`True ID details have been successfully updated.`, {
        variant: 'success',
      });
    } else if (trueIDDetailsStatus === 'error') {
      enqueueSnackbar(`Failed to update TrueID details`, {
        variant: 'error',
      });
    }
  }, [trueIDDetailsStatus]);

  useEffect(() => {
    if (livePhotoFileSizeError) {
      enqueueSnackbar(
        `File size should be less than ${MAX_DOC_IMAGE_FILE_SIZE_MB}MB.`,
        {
          variant: 'error',
        },
      );
      setLivePhotoFileSizeError(false);
    }
  }, [livePhotoFileSizeError]);

  const handleCloseDrawer = () => {
    toggleDrawer(false);
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
        Edit TrueID Details
      </StyledHeader>
    );
  };

  const footerContent = () => {
    return (
      <CustomCTA
        onClick={handleSaveClick}
        title={'Save'}
        isLoading={
          trueIDDetailsStatus === 'pending' ||
          livePhotoUploadStatus === 'pending'
        }
        disabled={editTrueIDObj?.livePhotoUrl?.length === 0}
        color={'#FFF'}
        bgColor={'#141482'}
        border={'1px solid #CDD4DF'}
      />
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
      <ContentGrid>
        <GridItem>
          <DrawerInput
            fieldType={'input'}
            fieldHeader={'Rating'}
            isManadatory={true}
            fieldValue={editTrueIDObj?.rating}
            fieldPlaceholder={'Enter customer’s rating'}
            fieldError={editTrueIDError?.rating}
            handleFieldChange={(e) => handleFieldUpdate(e, 'rating')}
            errorText={`* Rating should be between 0 and 5.`}
          />
        </GridItem>
        <GridItem>
          <DrawerInput
            fieldType={'children'}
            fieldHeader={'Live Photo Link'}
            headerMargin={'8px 0 10px 0'}
            isManadatory={true}
          >
            <StyledDiv $width={'48%'}>
              <FileUpload
                fileData={livePhotoFileData}
                fileType={FILE_TYPES?.IMAGE}
                iconUrl={ICONS?.THUMBNAIL}
                uploadTitle={'Upload image'}
                acceptType={'image/*'}
                handleInputChange={(e) =>
                  handleLivePhotoInputChange(e, FILE_TYPES?.IMAGE)
                }
                handleInputDelete={handleInputDelete}
                abortUpload={abortLivePhotoUpload}
                maxApiTimer={MAX_IMAGE_API_TIMER}
                uploadData={editTrueIDObj?.livePhotoUrl}
                tempDelete={tempLivePhotoDelete}
                setTempDelete={setTempLivePhotoDelete}
              />
            </StyledDiv>
          </DrawerInput>
        </GridItem>
      </ContentGrid>
    </DisplayDrawer>
  );
};

EditTrueIDDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  customerId: PropTypes.string,
  detailsData: PropTypes.object,
  refetchCustomerData: PropTypes.func,
};

export default EditTrueIDDrawer;
