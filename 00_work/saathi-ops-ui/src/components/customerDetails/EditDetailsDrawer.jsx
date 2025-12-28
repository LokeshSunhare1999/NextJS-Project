import React, { useEffect } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';
import {
  FILE_TYPES,
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

const EditDetailsDrawer = ({
  open,
  toggleDrawer,
  customerId,
  detailsData,
  refetchCustomerData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const {
    editDrawerObj,
    editDrawerError,
    stateCategoryOpen,
    educationCategoryOpen,
    countryCategoryOpen,
    tempVideoDelete,
    customerDetailsStatus,
    videoFileData,
    videoUploadStatus,
    videoFileSizeError,
    educationOptionsKeys,
    clearFields,
    handleStateCategorySelect,
    handleEducationCategorySelect,
    handleCountryCategorySelect,
    handleInputDelete,
    handleFieldUpdate,
    handleExpBtnClick,
    handleSaveClick,
    convertEducationLevel,
    setTempVideoDelete,
    handleVideoInputChange,
    abortVideoUpload,
    resetVideoFileData,
    setVideoFileSizeError,
    setStateCategoryOpen,
    setCountryCategoryOpen,
    setEducationCategoryOpen,
  } = useCustomerEditDetails(detailsData, customerId, open);

  useEffect(() => {
    if (customerDetailsStatus === 'success') {
      resetVideoFileData();
      clearFields();
      toggleDrawer(false);
      refetchCustomerData();
      enqueueSnackbar(`Customer's details have been successfully updated.`, {
        variant: 'success',
      });
    } else if (customerDetailsStatus === 'error') {
      enqueueSnackbar(`Failed to update customer's details`, {
        variant: 'error',
      });
    }
  }, [customerDetailsStatus]);

  useEffect(() => {
    if (videoFileSizeError) {
      enqueueSnackbar(
        `File size should be less than ${MAX_INTRO_VIDEO_FILE_SIZE_MB}MB.`,
        {
          variant: 'error',
        },
      );
      setVideoFileSizeError(false);
    }
  }, [videoFileSizeError]);

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
        Edit Details
      </StyledHeader>
    );
  };

  const footerContent = () => {
    return (
      <CustomCTA
        onClick={handleSaveClick}
        title={'Save'}
        isLoading={
          customerDetailsStatus === 'pending' || videoUploadStatus === 'pending'
        }
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
      <ContentSection>
        <StyledHeader
          $fontSize={'18px'}
          $lineHeight={'27px'}
          $fontWeight={'600'}
          $color={'#000'}
        >
          Current Address:
        </StyledHeader>
        <DrawerInput
          fieldType={'input'}
          fieldHeader="Address"
          fieldValue={editDrawerObj?.address}
          fieldPlaceholder={"Enter customer's address"}
          fieldError={editDrawerError?.address}
          handleFieldChange={(e) => handleFieldUpdate(e, 'address')}
          errorText={`* Customer address should be between than ${ADDRESS_MIN_LENGTH} & ${ADDRESS_MAX_LENGTH} characters.`}
        />
      </ContentSection>
      <ContentGrid>
        <GridItem>
          <DrawerInput
            fieldType={'input'}
            fieldHeader={'City'}
            fieldValue={editDrawerObj?.city}
            fieldPlaceholder={"Enter customer's city name"}
            fieldError={editDrawerError?.city}
            handleFieldChange={(e) => handleFieldUpdate(e, 'city')}
            errorText={`* City should be between than ${CITY_MIN_LENGTH} & ${CITY_MAX_LENGTH} characters.`}
          />
        </GridItem>
        <GridItem>
          <DrawerInput
            fieldType={'dropdown'}
            fieldHeader={'State'}
            fieldValue={editDrawerObj?.state || `Select customer’s state`}
            fieldError={editDrawerError?.state}
            handleDropDownSelect={handleStateCategorySelect}
            dropDownList={STATES_LIST}
            errorText={'* State is required.'}
            dropDownOpen={stateCategoryOpen}
            handleDropDownOpen={setStateCategoryOpen}
            isDropDownScrollable={true}
          />
        </GridItem>
      </ContentGrid>
      <ContentGrid>
        <GridItem>
          <DrawerInput
            fieldType={'dropdown'}
            fieldHeader={'Country'}
            fieldValue={editDrawerObj?.country || `Select customer's Country`}
            fieldError={editDrawerError?.country}
            handleDropDownSelect={handleCountryCategorySelect}
            dropDownList={['India']}
            errorText={'* Country is required.'}
            dropDownOpen={countryCategoryOpen}
            handleDropDownOpen={setCountryCategoryOpen}
            isDropDownScrollable={true}
            isDropDownDisabled={true}
          />
        </GridItem>
        <GridItem>
          <DrawerInput
            fieldType={'input'}
            fieldHeader={'ZIP/PIN'}
            fieldValue={editDrawerObj?.pin}
            fieldPlaceholder={'Enter customer’s ZIP/PIN'}
            fieldError={editDrawerError?.pin}
            handleFieldChange={(e) => handleFieldUpdate(e, 'pin')}
            errorText={`* ZIP/PIN should be a ${PIN_LENGTH} digit number.`}
          />
        </GridItem>
      </ContentGrid>
      <ContentSection>
        <DrawerInput
          fieldType={'children'}
          fieldHeader={'Total Experience (in years)'}
        >
          <StyledDiv $width={'265px'} $margin={'0 0 10px 0'}>
            <StyledInput
              $isError={editDrawerError?.experience}
              value={editDrawerObj?.experience}
              onChange={(e) => handleFieldUpdate(e, 'experience')}
              $width={'227px'}
              $textAlign={'center'}
              $position={'absolute'}
              $zIndex={'2'}
              $left={'0'}
            ></StyledInput>
            <StyledButton
              $position={'absolute'}
              $left={'20px'}
              $width={'15px'}
              $top={'40%'}
              onClick={() => handleExpBtnClick('decrement')}
            >
              -
            </StyledButton>
            <StyledButton
              $position={'absolute'}
              $right={'20px'}
              $width={'15px'}
              $top={'40%'}
              onClick={() => handleExpBtnClick('increment')}
            >
              +
            </StyledButton>
          </StyledDiv>
          {editDrawerError?.experience ? (
            <ErrorBox>
              <P
                $color={'red'}
                $fontSize={'14px'}
                $fontWeight={'300'}
                $lineHeight={'normal'}
              >
                {`* Experience should be in the range ${MIN_EXPERIENCE} - ${detailsData?.trueId?.aadhaar?.age - 14 || MAX_EXPERIENCE} years.`}
              </P>
            </ErrorBox>
          ) : null}
        </DrawerInput>
      </ContentSection>
      <ContentSection>
        <DrawerInput
          fieldType={'children'}
          fieldHeader={'Intro Video Link'}
          headerMargin={'8px 0 10px 0'}
        >
          <StyledDiv $width={'23%'}>
            <FileUpload
              fileData={videoFileData}
              fileType={FILE_TYPES?.VIDEO}
              iconUrl={ICONS?.VIDEO_CAMERA_BLUE}
              uploadTitle={'Upload MP4'}
              acceptType={'video/mp4'}
              handleInputChange={(e) =>
                handleVideoInputChange(e, FILE_TYPES?.VIDEO)
              }
              handleInputDelete={handleInputDelete}
              abortUpload={abortVideoUpload}
              maxApiTimer={MAX_VIDEO_API_TIMER}
              uploadData={editDrawerObj?.introVideoLink}
              tempDelete={tempVideoDelete}
              setTempDelete={setTempVideoDelete}
            />
          </StyledDiv>
        </DrawerInput>
      </ContentSection>
      <ContentSection>
        <DrawerInput
          fieldType="dropdown"
          fieldHeader="Highest Education"
          fieldValue={
            editDrawerObj?.education || ` Select customer’s highest education `
          }
          fieldError={editDrawerError?.education}
          handleDropDownSelect={handleEducationCategorySelect}
          dropDownList={educationOptionsKeys}
          dropDownConvertFn={convertEducationLevel}
          errorText={'* Highest education is required.'}
          dropDownOpen={educationCategoryOpen}
          handleDropDownOpen={setEducationCategoryOpen}
          isDropDownScrollable={true}
        />
      </ContentSection>
    </DisplayDrawer>
  );
};

EditDetailsDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  customerId: PropTypes.string,
  detailsData: PropTypes.object,
  refetchCustomerData: PropTypes.func,
};

export default EditDetailsDrawer;
