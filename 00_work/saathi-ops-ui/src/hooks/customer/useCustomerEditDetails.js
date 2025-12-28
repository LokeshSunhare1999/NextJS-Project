import { useState, useEffect } from 'react';
import {
  DETAILS_DRAWER_STRUCTURE,
  DETAILS_ERROR_STRUCTURE,
  MAX_EXPERIENCE,
  MIN_EXPERIENCE,
  PIN_LENGTH,
  ADDRESS_MAX_LENGTH,
  ADDRESS_MIN_LENGTH,
  CITY_MAX_LENGTH,
  CITY_MIN_LENGTH,
} from '../../constants/details';
import { usePutCustomerDetails } from '../../apis/queryHooks';
import useFileUpload from '../useFileUpload';
import {
  generateUploadFilePath,
  textLengthCheck,
  inputRangeCheck,
} from '../../utils/helper';
import { FILE_TYPES, MAX_INTRO_VIDEO_FILE_SIZE_MB } from '../../constants';

const useCustomerEditDetails = (detailsData, customerId, open) => {
  const [editDrawerObj, setEditDrawerObj] = useState({
    ...DETAILS_DRAWER_STRUCTURE,
  });
  const [editDrawerError, setEditDrawerError] = useState({
    ...DETAILS_ERROR_STRUCTURE,
  });
  const [stateCategoryOpen, setStateCategoryOpen] = useState(false);
  const [educationCategoryOpen, setEducationCategoryOpen] = useState(false);
  const [countryCategoryOpen, setCountryCategoryOpen] = useState(false);
  const [tempVideoDelete, setTempVideoDelete] = useState(false);

  const educationOptionsValues = detailsData?.educationOptions?.map(
    (item) => item.value,
  );
  const educationOptionsKeys = detailsData?.educationOptions?.map(
    (item) => item.key,
  );

  const {
    mutate: customerDetailsMutate,
    status: customerDetailsStatus,
    data: customerDetailsData,
    error: customerDetailsError,
    isError: isCustomerDetailsError,
  } = usePutCustomerDetails();

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
    fileSizeError: videoFileSizeError,
    setFileSizeError: setVideoFileSizeError,
  } = useFileUpload(
    generateUploadFilePath('CUSTOMER', customerId, FILE_TYPES?.VIDEO),
    FILE_TYPES?.CUSTOMER_VIDEO?.toUpperCase(),
    MAX_INTRO_VIDEO_FILE_SIZE_MB,
  );

  useEffect(() => {
    setEditDrawerObj({
      ...editDrawerObj,
      address: detailsData?.currentAddress?.address || '',
      city: detailsData?.currentAddress?.city || '',
      state: detailsData?.currentAddress?.state || '',
      country: detailsData?.currentAddress?.country || 'India',
      pin: detailsData?.currentAddress?.pincode || '',
      education: detailsData?.highestEducation?.degree || '',
      experience: detailsData?.noOfYearOfExperience || 0,
      introVideoLink: detailsData?.introVideoLink || '',
    });
  }, [detailsData, open]);

  useEffect(() => {
    if (tempVideoDelete) {
      setEditDrawerObj({
        ...editDrawerObj,
        introVideoLink: '',
      });
    }
  }, [tempVideoDelete]);

  useEffect(() => {
    if (videoUploadStatus === 'success') {
      setTempVideoDelete(false);
      setEditDrawerObj({
        ...editDrawerObj,
        introVideoLink: videoUploadData?.fileLink,
      });
    }
  }, [videoUploadStatus]);

  const clearFields = () => {
    setEditDrawerError({
      ...DETAILS_ERROR_STRUCTURE,
    });
  };

  const handleStateCategorySelect = (category) => {
    setEditDrawerObj({
      ...editDrawerObj,
      state: category,
    });
    setStateCategoryOpen(false);
  };

  const handleEducationCategorySelect = (category) => {
    setEditDrawerObj({
      ...editDrawerObj,
      education: category,
    });
    setEducationCategoryOpen(false);
  };

  const handleCountryCategorySelect = (category) => {
    setEditDrawerObj({
      ...editDrawerObj,
      country: category,
    });
    setCountryCategoryOpen(false);
  };

  const handleInputDelete = (type) => {
    if (type === FILE_TYPES?.VIDEO) {
      setVideoFileData((prevVideoFileData) => ({
        ...prevVideoFileData,
        showProgress: false,
      }));
    }
  };

  const handleFieldUpdate = (e, field) => {
    switch (field) {
      case 'address':
        setEditDrawerObj({
          ...editDrawerObj,
          address: e.target.value,
        });
        break;
      case 'city':
        setEditDrawerObj({
          ...editDrawerObj,
          city: e.target.value,
        });
        break;
      case 'experience':
        const exp = e.target.value;
        if (/^\d*\.?\d{0,1}$/.test(exp)) {
          setEditDrawerObj({
            ...editDrawerObj,
            experience: exp,
          });
        }
        setEditDrawerError({
          ...editDrawerError,
          experience: inputRangeCheck(exp, MAX_EXPERIENCE, MIN_EXPERIENCE),
        });
        break;
      case 'pin':
        const pincode = e.target.value;
        if (/^\d*$/.test(pincode) && pincode.length <= PIN_LENGTH) {
          setEditDrawerObj({
            ...editDrawerObj,
            pin: pincode,
          });
        }

        break;
    }
  };

  const handleExpBtnClick = (type) => {
    const exp =
      type === 'increment'
        ? ((parseFloat(editDrawerObj?.experience) || 0) + 0.1).toFixed(1)
        : ((parseFloat(editDrawerObj?.experience) || 0) - 0.1).toFixed(1);
    setEditDrawerObj({
      ...editDrawerObj,
      experience: exp,
    });
    setEditDrawerError({
      ...editDrawerError,
      experience: inputRangeCheck(exp, MAX_EXPERIENCE, MIN_EXPERIENCE),
    });
  };

  const handleSaveClick = () => {
    const errorFields = {
      address:
        Boolean(editDrawerObj?.address) &&
        textLengthCheck(
          editDrawerObj?.address,
          ADDRESS_MAX_LENGTH,
          ADDRESS_MIN_LENGTH,
        ),
      city:
        Boolean(editDrawerObj?.city) &&
        textLengthCheck(editDrawerObj?.city, CITY_MAX_LENGTH, CITY_MIN_LENGTH),
      state: false,
      pin:
        Boolean(editDrawerObj?.pin) &&
        textLengthCheck(editDrawerObj?.pin, PIN_LENGTH, PIN_LENGTH - 1),
      experience: inputRangeCheck(
        editDrawerObj?.experience,
        detailsData?.trueId?.aadhaar?.age - 14 || MAX_EXPERIENCE,
        MIN_EXPERIENCE,
      ),
      education:
        Boolean(editDrawerObj?.education) && textLengthCheck(editDrawerObj?.education),
    };
    if (
      JSON.stringify(errorFields) === JSON.stringify(DETAILS_ERROR_STRUCTURE)
    ) {
      const payload = {
        currentAddress: {
          address: editDrawerObj?.address,
          city: editDrawerObj?.city,
          state: editDrawerObj?.state,
          country: editDrawerObj?.country,
          pincode: editDrawerObj?.pin,
        },
        highestEducation: {
          degree: editDrawerObj?.education,
        },
        noOfYearOfExperience: parseFloat(editDrawerObj?.experience),
        introVideoLink: editDrawerObj?.introVideoLink,
        _id: customerId,
      };
      customerDetailsMutate(payload);
    } else {
      setEditDrawerError({
        ...editDrawerError,
        ...errorFields,
      });
    }
  };

  const convertEducationLevel = (value) => {
    const index = educationOptionsKeys.indexOf(value);
    if (index !== -1) {
      return educationOptionsValues[index];
    } else {
      return null;
    }
  };

  return {
    editDrawerObj,
    editDrawerError,
    stateCategoryOpen,
    educationCategoryOpen,
    countryCategoryOpen,
    tempVideoDelete,
    customerDetailsStatus,
    customerDetailsData,
    customerDetailsError,
    isCustomerDetailsError,
    videoFileData,
    videoUploadStatus,
    isVideoUploadError,
    videoUploadError,
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
  };
};

export default useCustomerEditDetails;
