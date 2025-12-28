import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import CustomCTA from '../CustomCTA';
import { zIndexValues } from '../../style';
import useFileUpload from '../../hooks/useFileUpload';
import {
  COURSE_MODULE,
  FILE_TYPES,
  MAX_IMAGE_API_TIMER,
  MAX_VIDEO_API_TIMER,
  VIDEO_UPLOAD_STATUS,
} from '../../constants';
import { truncateFileName, generateUploadFilePath } from '../../utils/helper';
import FileUpload from '../courses/FileUpload';
import PropTypes from 'prop-types';
import DrawerInput from '../common/DrawerInput';
import { useSnackbar } from 'notistack';

const StyledDrawer = styled(Drawer)`
  z-index: ${zIndexValues.EDIT_MODULE_DRAWER} !important;
`;

const DrawerWrapper = styled.div`
  width: 836px;
  height: 100%;
  background: #f4f6fa;
  padding-top: 3.5rem;
  font-family: Poppins;
`;

const HeaderContainer = styled.section`
  height: auto;
  padding: 10px 0;
  width: 100%;
  border-bottom: 1px solid #cdd4df;
`;

const HeaderBox = styled.div`
  width: calc(100% - 40px);
  height: 100%;
  margin-left: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const Header = styled.p`
  font-size: 24px;
  line-height: 36px;
  font-weight: 600;
  color: #000000;
`;

const HeaderClose = styled.img`
  width: 22px;
  height: auto;
  cursor: pointer;
`;

const ContentContainer = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 0 20px;
`;

const ContentSection = styled.div`
  margin-bottom: 12px;
`;

const UploadContainer = styled(ContentSection)`
  display: flex;
  flex-direction: row;
  gap: 16px;
`;

const FieldHeader = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #000;
`;

const TitleInput = styled.input`
  width: calc(100% - 40px);
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
`;

const Description = styled.textarea`
  width: calc(100% - 40px);
  height: auto;
  margin-top: 10px;
  border-radius: 8px;
  color: #000000bf !important;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
`;

const FooterContainer = styled.div`
  width: 100%;
  margin-top: 40px;
  padding-bottom: 20px;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const CheckboxInput = styled.input`
  margin-right: 8px;
`;

const EditModuleDrawer = ({
  open,
  toggleDrawer,
  moduleObj,
  setModuleObj,
  handleCourseEditModule,
  clearFields = () => {},
  courseData,
  editCourseModuleStatus,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [tempImageDelete, setTempImageDelete] = useState(false);
  const [tempVideoDelete, setTempVideoDelete] = useState(false);
  const [certificateCategoryOpen, setCertificateCategoryOpen] = useState(false);
  const [certificateTypeError, setCertificateTypeError] = useState(false);

  const {
    fileData: imageFileData,
    setFileData: setImageFileData,
    handleInputChange: handleImageInputChange,
    abortUpload: abortImageUpload,
    status: imageUploadStatus,
    isError: isImageUploadError,
    error: imageUploadError,
    data: imageUploadData,
    resetFileData: resetImageFileData,
  } = useFileUpload(
    generateUploadFilePath('COURSE', courseData?._id, FILE_TYPES?.IMAGE),
    FILE_TYPES?.IMAGE?.toUpperCase(),
  );

  const {
    fileData: videoFileData,
    setFileData: setVideoFileData,
    handleInputChange: handleVideoInputChange,
    abortUpload: abortVideoUpload,
    status: videoUploadStatus,
    isError: isVideoUploadError,
    error: videoUploadError,
    data: videoUploadData,
    resetFileData: resetVideoFileData,
  } = useFileUpload(
    generateUploadFilePath('COURSE', courseData?._id, FILE_TYPES?.VIDEO),
    FILE_TYPES?.VIDEO?.toUpperCase(),
  );

  useEffect(() => {
    if (imageUploadStatus === 'success') {
      setModuleObj({
        ...moduleObj,
        imageUrl: imageUploadData?.fileLink,
      });
    }
  }, [imageUploadStatus]);

  useEffect(() => {
    if (videoUploadStatus === 'success') {
      setModuleObj({
        ...moduleObj,
        videoUrl: videoUploadData?.fileLink,
      });
    }
  }, [videoUploadStatus]);

  useEffect(() => {
    if (imageUploadError) {
      enqueueSnackbar(
        `Upload Error: ${imageUploadError?.message || 'Failed to upload image.'}`,
        {
          variant: 'error',
        },
      );
      setImageFileData((prevImageFileData) => ({
        ...prevImageFileData,
        showProgress: false,
      }));
    }
  }, [imageUploadError]);

  useEffect(() => {
    if (videoUploadError) {
      enqueueSnackbar(
        `Upload Error: ${videoUploadError?.message || 'Failed to upload video.'}`,
        {
          variant: 'error',
        },
      );
      setVideoFileData((prevVideoFileData) => ({
        ...prevVideoFileData,
        showProgress: false,
      }));
    }
  }, [videoUploadError]);

  const handleInputDelete = (type) => {
    if (type === FILE_TYPES?.VIDEO) {
      setVideoFileData((prevVideoFileData) => ({
        ...prevVideoFileData,
        showProgress: false,
      }));
    } else if (type === FILE_TYPES?.IMAGE) {
      setImageFileData((prevImageFileData) => ({
        ...prevImageFileData,
        showProgress: false,
      }));
    }
  };

  const handleModuleChange = (event) => {
    setModuleObj({ ...moduleObj, moduleTitle: event.target.value });
  };
  const handleDescriptionChange = (event) => {
    setModuleObj({ ...moduleObj, description: event.target.value });
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
    clearFields();
    resetImageFileData();
    resetVideoFileData();
  };

  const handleSaveClick = () => {
    if (moduleObj?.hasCertificate && !moduleObj?.certificateType) {
      setCertificateTypeError(true);
      return;
    }
    handleCourseEditModule();
    resetImageFileData();
    resetVideoFileData();
  };

  const handleCertificateTypeSelect = (cat) => {
    setModuleObj({
      ...moduleObj,
      certificateType: COURSE_MODULE?.CERTIFICATE_TYPES?.find(
        (item) => item.value === cat,
      )?.key,
    });
    setCertificateTypeError(false);
    setCertificateCategoryOpen(!certificateCategoryOpen);
  };

  const handleHasCertificateChange = (e) => {
    setModuleObj((prev) => {
      return {
        ...prev,
        hasCertificate: e.target.checked,
        certificateType: e.target.checked
          ? null
          : COURSE_MODULE?.DEFAULT_CERTIFICATE_TYPE,
      };
    });
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={handleCloseDrawer}>
      <DrawerWrapper>
        <HeaderContainer>
          <HeaderBox>
            <Header>Edit Module</Header>
            <HeaderClose src={ICONS.CROSS_ICON} onClick={handleCloseDrawer} />
          </HeaderBox>
        </HeaderContainer>
        <ContentContainer>
          <ContentSection>
            <FieldHeader>Module Name</FieldHeader>
            <TitleInput
              placeholder="Add module name"
              type="text"
              value={moduleObj?.moduleTitle}
              onChange={(e) => handleModuleChange(e)}
            />
          </ContentSection>

          <ContentSection>
            <FieldHeader>Description</FieldHeader>
            <Description
              placeholder="Add module description"
              type="text"
              value={moduleObj?.description}
              onChange={(e) => handleDescriptionChange(e)}
            />
          </ContentSection>
          <UploadContainer>
            <FileUpload
              fileData={videoFileData}
              fileType={FILE_TYPES?.VIDEO}
              iconUrl={ICONS?.VIDEO_CAMERA_BLUE}
              uploadTitle={'Upload Video'}
              acceptType={'video/*'}
              handleInputChange={(e) =>
                handleVideoInputChange(e, FILE_TYPES?.VIDEO)
              }
              handleInputDelete={handleInputDelete}
              abortUpload={abortVideoUpload}
              maxApiTimer={MAX_VIDEO_API_TIMER}
              uploadData={moduleObj?.videoUrl}
              tempDelete={tempVideoDelete}
              setTempDelete={setTempVideoDelete}
              isProcessing={
                moduleObj?.videoStatus === VIDEO_UPLOAD_STATUS?.IN_PROGRESS
              }
            />
            <FileUpload
              fileData={imageFileData}
              fileType={FILE_TYPES?.IMAGE}
              iconUrl={ICONS?.THUMBNAIL}
              uploadTitle={'Upload Video Thumbnail'}
              acceptType={'image/*'}
              handleInputChange={(e) => {
                handleImageInputChange(e, FILE_TYPES?.IMAGE);
              }}
              handleInputDelete={handleInputDelete}
              abortUpload={abortImageUpload}
              maxApiTimer={MAX_IMAGE_API_TIMER}
              uploadData={moduleObj?.imageUrl}
              tempDelete={tempImageDelete}
              setTempDelete={setTempImageDelete}
            />
          </UploadContainer>

          <ContentSection>
            <CheckboxInput
              type="checkbox"
              checked={moduleObj?.hasCertificate}
              onChange={(e) => handleHasCertificateChange(e)}
            />
            <label>Has Certificate</label>
          </ContentSection>

          {moduleObj?.hasCertificate ? (
            <ContentSection>
              {' '}
              <DrawerInput
                isManadatory={moduleObj?.hasCertificate}
                fieldType={'dropdown'}
                fieldHeader={'Certificate Type'}
                fieldError={certificateTypeError}
                errorText={'* Certificate Type is required.'}
                fieldValue={
                  COURSE_MODULE?.CERTIFICATE_TYPES?.find(
                    (item) => item.key === moduleObj?.certificateType,
                  )?.value || 'Select Certificate Type'
                }
                handleDropDownSelect={handleCertificateTypeSelect}
                dropDownOpen={certificateCategoryOpen}
                handleDropDownOpen={setCertificateCategoryOpen}
                dropDownList={COURSE_MODULE?.CERTIFICATE_TYPES?.map(
                  (item) => item?.value,
                )}
              />
            </ContentSection>
          ) : null}

          <FooterContainer>
            <CustomCTA
              onClick={handleCloseDrawer}
              title={'Cancel'}
              color={'#586275'}
              bgColor={'#FFF'}
              border={'1px solid #CDD4DF'}
            />
            <CustomCTA
              onClick={handleSaveClick}
              title={'Save'}
              isLoading={
                editCourseModuleStatus === 'pending' ||
                imageUploadStatus === 'pending' ||
                videoUploadStatus === 'pending'
              }
              color={'#FFF'}
              bgColor={'#141482'}
              border={'1px solid #CDD4DF'}
            />
          </FooterContainer>
        </ContentContainer>
      </DrawerWrapper>
    </StyledDrawer>
  );
};
EditModuleDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  moduleObj: PropTypes.shape({
    moduleTitle: PropTypes.string,
    description: PropTypes.string,
    videoUrl: PropTypes.string,
    imageUrl: PropTypes.string,
  }).isRequired,
  setModuleObj: PropTypes.func.isRequired,
  handleCourseEditModule: PropTypes.func.isRequired,
  clearFields: PropTypes.func,
  courseData: PropTypes.shape({
    courseTitle: PropTypes.string,
    _id: PropTypes.string,
  }),
};

export default EditModuleDrawer;
