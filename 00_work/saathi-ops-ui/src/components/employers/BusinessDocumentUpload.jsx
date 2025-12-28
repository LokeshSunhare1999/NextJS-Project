import React, { useEffect, useState } from 'react';
import { FILE_TYPES, MAX_IMAGE_API_TIMER } from '../../constants';
import FileUpload from '../courses/FileUpload';
import useFileUpload from '../../hooks/useFileUpload';
import {
  generateAlphaNumericString,
  generateUploadFilePath,
} from '../../utils/helper';
import ICONS from '../../assets/icons';
import { enqueueSnackbar } from 'notistack';

const ID = generateAlphaNumericString();

const BusinessDocumentUpload = ({
  fieldKey,
  fieldUrlKey,
  uploadTitle = 'Upload Document',
  acceptType = 'image/png, image/jpeg, image/jpg, application/pdf',
  data,
  setData,
}) => {
  const [tempDelete, setTempDelete] = useState(false);

  const {
    fileData,
    setFileData,
    handleInputChange,
    abortUpload,
    status: uploadStatus,
    isError,
    error,
    data: uploadData,
    resetFileData,
  } = useFileUpload(
    generateUploadFilePath(`${fieldKey}_DOC`, ID, FILE_TYPES.IMAGE),
    FILE_TYPES.IMAGE.toUpperCase(),
  );

  useEffect(() => {
    if (uploadStatus === 'success') {
      setTempDelete(false);
      setData((prev) => ({ ...prev, [fieldUrlKey]: uploadData?.fileLink }));
    } else if (uploadStatus === 'error') {
      enqueueSnackbar('Failed to upload document.', {
        variant: 'error',
      });
    }
  }, [uploadStatus, uploadData]);

  useEffect(() => {
    if (tempDelete) {
      setData((prev) => ({ ...prev, [fieldUrlKey]: '' }));
    }
  }, [tempDelete]);

  const handleDelete = () => {
    setTempDelete(true);
    resetFileData();
  };

  return (
    <FileUpload
      fileData={fileData}
      fileType={FILE_TYPES.IMAGE}
      iconUrl={ICONS.UPLOAD}
      uploadTitle={uploadTitle}
      uploadData={data?.[fieldUrlKey]}
      acceptType={acceptType}
      handleInputChange={(e) => handleInputChange(e, FILE_TYPES.IMAGE)}
      handleInputDelete={handleDelete}
      abortUpload={abortUpload}
      maxApiTimer={MAX_IMAGE_API_TIMER}
      tempDelete={tempDelete}
      setTempDelete={setTempDelete}
    />
  );
};

export default BusinessDocumentUpload;
