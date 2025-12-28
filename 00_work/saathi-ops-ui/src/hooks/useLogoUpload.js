import { useState, useRef } from 'react';
import { usePostUploadToS3 } from '../apis/queryHooks';
import { bytesToMegabytes } from '../utils/helper';
import ICONS from '../assets/icons';

const useLogoUpload = (filePath, type, maxFileSizeInMB, bucket = null) => {
  const [logo, setLogo] = useState(null); // Stores the logo URL after upload
  const [isUploading, setIsUploading] = useState(false); // Tracks upload progress
  const [error, setError] = useState(null); // Error message

  const { mutate, status, isError, data } = usePostUploadToS3(
    filePath,
    type,
    bucket,
  );

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size
    if (bytesToMegabytes(file.size) > maxFileSizeInMB) {
      setError(
        `File size exceeds the maximum allowed size of ${maxFileSizeInMB}MB.`,
      );
      return;
    }

    setError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    // Mutate function to upload file
    mutate(
      { payload: formData },
      {
        onSuccess: (response) => {
          setIsUploading(false);
          setLogo(response?.fileLink);
        },
        onError: (uploadError) => {
          setIsUploading(false);
          setError(uploadError?.message || 'Failed to upload logo.');
        },
      },
    );
  };

  return {
    logo,
    isUploading,
    error,
    handleFileChange,
    data,
    status,
    isError,
  };
};

export default useLogoUpload;
