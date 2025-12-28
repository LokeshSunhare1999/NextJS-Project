import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import CustomCTA from '../CustomCTA';
import { zIndexValues } from '../../style';
import useFileUpload from '../../hooks/useFileUpload';
import {
  FILE_TYPES,
  MAX_VIDEO_API_TIMER,
  MAX_IMAGE_API_TIMER,
  VIDEO_UPLOAD_STATUS,
} from '../../constants';
import FileUpload from '../courses/FileUpload';
import {
  generateUploadFilePath,
  shortenStringAfterMediaType,
} from '../../utils/helper';
import PropTypes from 'prop-types';
import { useSnackbar } from 'notistack';

const StyledDrawer = styled(Drawer)`
  z-index: ${zIndexValues.EDIT_SUB_MODULE_DRAWER} !important;
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
  gap: ${(props) => props.$gap || '16px'};
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

const FieldValue = styled.div`
  width: calc(100% - 40px);
  margin-top: 10px;
  color: #000000bf;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
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

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
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

const EditSubModuleDrawer = ({
  open,
  toggleDrawer,
  courseId,
  courseSubModuleId,
  subModuleObj,
  setSubModuleObj,
  handleCourseEditSubModule,
  editSubmoduleStatus,
  isViewSubmodule,
  courseData,
  subModuleData,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [openAssessmentDrawer, setOpenAssessmentDrawer] = useState(false);
  const [tempImageDelete, setTempImageDelete] = useState(false);
  const [tempVideoDelete, setTempVideoDelete] = useState(false);

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
      setTempImageDelete(false);
      setSubModuleObj({
        ...subModuleObj,
        imageUrl: imageUploadData?.fileLink,
      });
    }
  }, [imageUploadStatus]);

  useEffect(() => {
    if (videoUploadStatus === 'success') {
      setTempVideoDelete(false);
      setSubModuleObj({
        ...subModuleObj,
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

  useEffect(() => {
    if (tempImageDelete) {
      setSubModuleObj({
        ...subModuleObj,
        imageUrl: '',
      });
    }
  }, [tempImageDelete]);

  useEffect(() => {
    if (tempVideoDelete) {
      setSubModuleObj({
        ...subModuleObj,
        videoUrl: '',
      });
    }
  }, [tempVideoDelete]);

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

  const toggleAssessmentDrawer = (newOpen) => () => {
    setOpenAssessmentDrawer(newOpen);
  };

  const handleAssessmentDrawer = (newOpen) => {
    setOpenAssessmentDrawer(newOpen);                         
  };

  const handleTitleChange = (event) => {
    setSubModuleObj({ ...subModuleObj, subModuleTitle: event.target.value });
  };
  const handleDescriptionChange = (event) => {
    setSubModuleObj({
      ...subModuleObj,
      description: event.target.value,
    });
  };

  const handleSaveClick = () => {
    handleCourseEditSubModule();
    resetImageFileData();
    resetVideoFileData();
  };

  const handleCloseClick = () => {
    toggleDrawer(false);
    resetImageFileData();
    resetVideoFileData();
  };

  const handleVideoDisplayText = () => {
    if (subModuleObj?.videoStatus === VIDEO_UPLOAD_STATUS?.IN_PROGRESS) {
      return 'Video is being processed';
    } else if (subModuleObj?.videoUrl?.length > 0) {
      return `Video Uploaded: ${shortenStringAfterMediaType(subModuleObj?.videoUrl)}`;
    } else {
      return 'Video Not Uploaded';
    }
  };

  const handleDisplayIcon = () => {
    if (subModuleObj?.videoStatus === VIDEO_UPLOAD_STATUS?.IN_PROGRESS) {
      return ICONS?.YELLOW_INFO;
    } else if (subModuleObj?.videoUrl?.length > 0) {
      return ICONS?.GREEN_TICK;
    } else {
      return ICONS?.RED_CROSS;
    }
  };

  return (
    <StyledDrawer anchor="right" open={open} onClose={handleCloseClick}>
      <DrawerWrapper>
        <HeaderContainer>
          <HeaderBox>
            <Header>
              {isViewSubmodule
                ? subModuleObj?.subModuleTitle
                : 'Edit Sub Module'}
            </Header>

            <HeaderClose src={ICONS.CROSS_ICON} onClick={handleCloseClick} />
          </HeaderBox>
        </HeaderContainer>
        <ContentContainer>
          {!isViewSubmodule ? (
            <ContentSection>
              <FieldHeader>Sub Module Name</FieldHeader>
              <TitleInput
                placeholder="Add sub-module name"
                type="text"
                value={subModuleObj?.subModuleTitle}
                onChange={(e) => handleTitleChange(e)}
              />
            </ContentSection>
          ) : null}

          <ContentSection>
            <FieldHeader>Description</FieldHeader>
            {!isViewSubmodule ? (
              <Description
                placeholder="Add sub-module description"
                type="text"
                value={subModuleObj?.description}
                onChange={(e) => handleDescriptionChange(e)}
              />
            ) : (
              <FieldValue>{subModuleObj?.description || '-----'}</FieldValue>
            )}
          </ContentSection>
          {!isViewSubmodule ? (
            <>
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
                  uploadData={subModuleData?.videoUrl}
                  tempDelete={tempVideoDelete}
                  setTempDelete={setTempVideoDelete}
                  isProcessing={
                    subModuleData?.videoStatus ===
                    VIDEO_UPLOAD_STATUS?.IN_PROGRESS
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
                  uploadData={subModuleData?.imageUrl}
                  tempDelete={tempImageDelete}
                  setTempDelete={setTempImageDelete}
                />
              </UploadContainer>
              <FooterContainer>
                <CustomCTA
                  onClick={handleCloseClick}
                  title={'Cancel'}
                  color={'#586275'}
                  bgColor={'#FFF'}
                  border={'1px solid #CDD4DF'}
                />
                <CustomCTA
                  onClick={handleSaveClick}
                  title={'Save'}
                  color={'#FFF'}
                  bgColor={'#141482'}
                  isLoading={
                    videoUploadStatus === 'pending' ||
                    imageUploadStatus === 'pending' ||
                    editSubmoduleStatus === 'pending'
                  }
                  border={'1px solid #CDD4DF'}
                />
              </FooterContainer>
            </>
          ) : (
            <>
              <UploadContainer $gap={'10px'}>
                <StyledImg src={handleDisplayIcon()} width={'21px'} />
                <P
                  $color={'#000000bf'}
                  $fontSize={'14px'}
                  $lineHeight={'21px'}
                  $fontWeight={'400'}
                >
                  <a
                    onClick={() =>
                      navigator.clipboard.writeText(subModuleObj?.videoUrl)
                    }
                  >
                    {handleVideoDisplayText()}
                  </a>
                </P>
              </UploadContainer>
              <UploadContainer $gap={'10px'}>
                <StyledImg
                  src={
                    subModuleObj?.imageUrl?.length > 0
                      ? ICONS?.GREEN_TICK
                      : ICONS?.RED_CROSS
                  }
                  width={'21px'}
                />
                <P
                  $color={'#000000bf'}
                  $fontSize={'14px'}
                  $lineHeight={'21px'}
                  $fontWeight={'400'}
                >
                  {subModuleObj?.imageUrl?.length > 0
                    ? `Sub-Module Video Thumbnail Uploaded:`
                    : `Sub-Module Video Thumbnail Not Uploaded`}
                </P>
              </UploadContainer>
              {subModuleObj?.imageUrl?.length > 0 ? (
                <StyledImg
                  src={subModuleObj?.imageUrl}
                  width={'500px'}
                  height={'auto'}
                />
              ) : null}
            </>
          )}
        </ContentContainer>
      </DrawerWrapper>
    </StyledDrawer>
  );
};
EditSubModuleDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
  courseSubModuleId: PropTypes.string.isRequired,
  subModuleObj: PropTypes.object.isRequired,
  setSubModuleObj: PropTypes.func.isRequired,
  handleCourseEditSubModule: PropTypes.func.isRequired,
  isViewSubmodule: PropTypes.bool,
  courseData: PropTypes.object,
  subModuleData: PropTypes.object,
};
export default EditSubModuleDrawer;
