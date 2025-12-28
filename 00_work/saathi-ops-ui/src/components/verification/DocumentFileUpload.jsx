import React, { useState } from 'react';
import styled from 'styled-components';
import CustomCTA from '../CustomCTA';
import ProgressBar from '../common/ProgressBar';
import {
  truncateFileName,
  extractStringAfterMediaType,
} from '../../utils/helper';
import ICONS from '../../assets/icons';
import { FILE_TYPES, MAX_FILENAME_LENGTH } from '../../constants';
import PropTypes from 'prop-types';
const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  position: relative;
`;

const ProgressText = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

const Placeholder = styled.div`
  width: 100px;
  height: 100px;
  background: #fff;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  width: ${(props) => props?.$width || 'auto'};
`;

const UploadedDiv = styled.div`
  background: #141a82;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 8px;
  width: auto;
  border-radius: 6px;
  font-size: 14px;
  line-height: 24px;
  color: #ffffff;
`;

const Separator = styled.div`
  width: 1px;
  height: 16px;
  background: #6161af;
`;

const DocumentFileUpload = ({
  fileData,
  fileType,
  iconUrl,
  uploadTitle,
  acceptType,
  handleInputChange,
  handleInputDelete,
  abortUpload,
  maxApiTimer,
  uploadData,
  maxFileNameLength = MAX_FILENAME_LENGTH,
  tempDelete = false,
  setTempDelete = () => {},
  isProcessing = false,
  showEmptyProgress = false,
}) => {
  const SECONDARY_ICON = {
    IMAGE: ICONS?.THUMBNAIL_WHITE,
    AUDIO: ICONS?.SPEAKER_WHITE,
    VIDEO: ICONS?.VIDEO_CAMERA_WHITE,
  };

  const handleInputCTAClick = (e) => {
    setTempDelete(false);
    handleInputChange(e);
  };

  const renderPlaceholder = () => {
    return (
      <P $color="#DD4141" $fontSize="10px" $width={'251px'}>
        * Please Upload the document in PNG, PDF, JPEG, and JPG format and size
        should be less then 10 MB.{' '}
      </P>
    );
  };

  if (showEmptyProgress) {
    return <> {renderPlaceholder()}</>;
  } else if (
    uploadData?.length > 0 &&
    fileData?.fileName?.length === 0 &&
    !tempDelete
  ) {
    return (
      <ProgressContainer>
        <UploadedDiv>
          <StyledImg
            src={SECONDARY_ICON?.[fileType?.toUpperCase()]}
            alt="thumbnail"
            width="14px"
            height="14px"
          />
          {truncateFileName(
            extractStringAfterMediaType(uploadData),
            maxFileNameLength,
          )}
          <Separator />
          <StyledImg
            src={ICONS?.CROSS_BUTTON_WHITE}
            alt="close"
            width="14px"
            height="14px"
            onClick={() => setTempDelete(true)}
          />
        </UploadedDiv>
      </ProgressContainer>
    );
  } else if (isProcessing) {
    return (
      <CustomCTA
        title={`Video Processing`}
        showIcon={false}
        color={'#7f7f7f'}
        bgColor={'#ffffff'}
        border={'1px solid #7f7f7f'}
        fontSize={'14px'}
        width={'16px'}
        height={'16px'}
        gap={'10px'}
        disabled={true}
      />
    );
  }
  return (
    <>
      {!fileData?.showProgress ? (
        renderPlaceholder()
      ) : (
        <ProgressContainer>
          <ProgressText>
            <P
              $color={'#141482'}
              $fontSize={'12px'}
              $fontWeight={'400'}
              $lineHeight={'18px'}
            >
              {truncateFileName(fileData?.fileName)}
            </P>
            {fileData?.uploaded ? (
              <StyledImg
                src={ICONS?.DELETE_ICON}
                alt="delete-icon"
                width="14px"
                height="14px"
                onClick={() => handleInputDelete(fileType)}
              />
            ) : (
              <StyledImg
                src={ICONS?.CROSS_ICON}
                alt="delete-icon"
                width="14px"
                height="14px"
                onClick={() => abortUpload()}
              />
            )}
          </ProgressText>
          <ProgressBar
            isUploadComplete={fileData?.uploaded}
            apiTimer={maxApiTimer}
          />
        </ProgressContainer>
      )}
    </>
  );
};

DocumentFileUpload.propTypes = {
  fileData: PropTypes.shape({
    fileName: PropTypes.string,
    showProgress: PropTypes.bool,
    uploaded: PropTypes.bool,
  }).isRequired,
  fileType: PropTypes.oneOf(Object.values(FILE_TYPES)),
  iconUrl: PropTypes.string,
  uploadTitle: PropTypes.string,
  acceptType: PropTypes.string.isRequired,
  handleInputChange: PropTypes.func.isRequired,
  handleInputDelete: PropTypes.func.isRequired,
  abortUpload: PropTypes.func.isRequired,
  maxApiTimer: PropTypes.number,
  uploadData: PropTypes.string,
  maxFileNameLength: PropTypes.number,
  tempDelete: PropTypes.bool,
  setTempDelete: PropTypes.func,
};

export default DocumentFileUpload;
