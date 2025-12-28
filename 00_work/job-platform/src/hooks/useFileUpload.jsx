import { useState, useEffect, useRef } from 'react';
import { usePostUploadToS3 } from '../apis/queryHooks';
import { FILE_TYPES } from '../constants';
import { bytesToMegabytes, checkVideoDuration } from '@/utils/helpers';

// Custom hook
const useFileUpload = (
  filePath,
  type,
  maxFileSize,
  bucket = null,
  maxVideoduration = 7200,
) => {
  const [fileData, setFileData] = useState({
    fileName: '',
    uploaded: false,
    showProgress: false,
  });
  const [fileSizeError, setFileSizeError] = useState(false);
  const [fileDurationError, setFileDurationError] = useState(false);

  const abortControllerRef = useRef(null);

  const { mutate, status, isError, error, data } = usePostUploadToS3(
    filePath,
    type,
    bucket,
  );

  const handleInputChange = async (e, type) => {
    const fileUploaded = e.target.files[0];
    if (bytesToMegabytes(fileUploaded.size) > maxFileSize) {
      setFileSizeError(true);
      return;
    }

    if (type === FILE_TYPES.VIDEO) {
      const isValidDuration = await checkVideoDuration(
        fileUploaded,
        maxVideoduration,
      );
      if (!isValidDuration) {
        setFileDurationError(true);
        return;
      }
    }
    const formData = new FormData();
    formData.append('file', fileUploaded);

    setFileData({
      fileName: fileUploaded.name,
      uploaded: false,
      showProgress: true,
    });

    abortControllerRef.current = new AbortController();
    setFileDurationError(false);
    setFileSizeError(false);

    mutate({ payload: formData, signal: abortControllerRef.current.signal });
  };

  useEffect(() => {
    if (status === 'success') {
      setFileData((prevFileData) => ({
        ...prevFileData,
        uploaded: true,
      }));
      setFileDurationError(false);
      setFileSizeError(false);
    }
  }, [status]);

  const resetFileData = () => {
    setFileData({
      fileName: '',
      uploaded: false,
      showProgress: false,
    });
  };

  const abortUpload = () => {
    if (abortControllerRef.current) {
      resetFileData();
      abortControllerRef.current.abort();
    }
  };

  return {
    fileData,
    setFileData,
    handleInputChange,
    abortUpload,
    isError,
    error,
    status,
    data,
    resetFileData,
    fileSizeError,
    setFileSizeError,
    fileDurationError,
    setFileDurationError,
  };
};

export default useFileUpload;