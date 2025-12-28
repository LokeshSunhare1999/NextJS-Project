import { useState, useEffect } from 'react';
import {
  TRUE_ID_DRAWER_STRUCTURE,
  TRUE_ID_ERROR_STRUCTURE,
} from '../../constants/details';
import { usePutTrueIDDetails } from '../../apis/queryHooks';
import useFileUpload from '../useFileUpload';
import {
  generateAlphaNumericString,
  generateUploadFilePath,
  inputRangeCheck,
} from '../../utils/helper';
import { FILE_TYPES, MAX_DOC_IMAGE_FILE_SIZE_MB } from '../../constants';

const useTrueIDEditDetails = (detailsData, customerId, open) => {
  const [editTrueIDObj, setEditTrueIDObj] = useState({
    ...TRUE_ID_DRAWER_STRUCTURE,
  });
  const [editTrueIDError, setEditTrueIDError] = useState({
    ...TRUE_ID_ERROR_STRUCTURE,
  });
  const [tempLivePhotoDelete, setTempLivePhotoDelete] = useState(false);

  const {
    mutate: trueIDDetailsMutate,
    status: trueIDDetailsStatus,
    data: trueIDDetailsData,
    error: trueIDDetailsError,
    isError: isTrueIDDetailsError,
  } = usePutTrueIDDetails();

  const {
    fileData: livePhotoFileData,
    setFileData: setLivePhotoFileData,
    handleInputChange: handleLivePhotoInputChange,
    abortUpload: abortLivePhotoUpload,
    status: livePhotoUploadStatus,
    isError: isLivePhotoUploadError,
    error: livePhotoUploadError,
    data: livePhotoUploadData,
    resetFileData: resetLivePhotoFileData,
    fileSizeError: livePhotoFileSizeError,
    setFileSizeError: setLivePhotoFileSizeError,
  } = useFileUpload(
    generateUploadFilePath('trueId', customerId, generateAlphaNumericString(6)),
    FILE_TYPES?.IMAGE?.toUpperCase(),
    MAX_DOC_IMAGE_FILE_SIZE_MB,
  );

  useEffect(() => {
    setEditTrueIDObj({
      ...editTrueIDObj,
      rating: detailsData?.trueId?.rating || 0,
      livePhotoUrl: detailsData?.trueId?.liveness?.photoUrl || '',
    });
  }, [detailsData, open]);

  useEffect(() => {
    if (tempLivePhotoDelete) {
      setEditTrueIDObj({
        ...editTrueIDObj,
        livePhotoUrl: '',
      });
    }
  }, [tempLivePhotoDelete]);

  useEffect(() => {
    if (livePhotoUploadStatus === 'success') {
      setTempLivePhotoDelete(false);
      setEditTrueIDObj({
        ...editTrueIDObj,
        livePhotoUrl: livePhotoUploadData?.fileLink,
      });
    }
  }, [livePhotoUploadStatus]);

  const clearFields = () => {
    setEditTrueIDError({
      ...TRUE_ID_ERROR_STRUCTURE,
    });
  };

  const handleInputDelete = (type) => {
    if (type === FILE_TYPES?.IMAGE) {
      setLivePhotoFileData((prevLivePhotoData) => ({
        ...prevLivePhotoData,
        showProgress: false,
      }));
    }
  };

  const handleFieldUpdate = (e, field) => {
    switch (field) {
      case 'rating':
        setEditTrueIDObj({
          ...editTrueIDObj,
          rating: e.target.value,
        });
        break;
    }
  };

  const handleSaveClick = () => {
    const errorFields = {
      rating: inputRangeCheck(editTrueIDObj?.rating, 5, 0),
      livePhotoUrl: editTrueIDObj?.livePhotoUrl?.length === 0,
    };
    if (
      JSON.stringify(errorFields) === JSON.stringify(TRUE_ID_ERROR_STRUCTURE)
    ) {
      const payload = {
        rating: parseFloat(editTrueIDObj?.rating),
        customerId: customerId,
        liveness: {
          photoUrl: editTrueIDObj?.livePhotoUrl,
        },
      };
      trueIDDetailsMutate(payload);
    } else {
      setEditTrueIDError({
        ...editTrueIDError,
        ...errorFields,
      });
    }
  };

  return {
    editTrueIDObj,
    editTrueIDError,
    tempLivePhotoDelete,
    trueIDDetailsStatus,
    trueIDDetailsData,
    trueIDDetailsError,
    isTrueIDDetailsError,
    livePhotoFileData,
    livePhotoUploadStatus,
    isLivePhotoUploadError,
    livePhotoUploadError,
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
  };
};

export default useTrueIDEditDetails;
