import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import CustomCTA from '../CustomCTA';
import { zIndexValues } from '../../style';
import {
  BENEFIT_STRUCTURE,
  COURSE_MODULE,
  FILE_TYPES,
  MAX_IMAGE_API_TIMER,
  MAX_VIDEO_API_TIMER,
  VIDEO_UPLOAD_STATUS,
} from '../../constants';
import {
  textLengthCheck,
  inputRangeCheck,
  generateUploadFilePath,
  convertCamelCaseToTitleCase,
} from '../../utils/helper';
import useFileUpload from '../../hooks/useFileUpload';
import FileUpload from './FileUpload';
import PropTypes from 'prop-types';
import DisplayDrawer from '../common/DisplayDrawer';
import DrawerInput from '../common/DrawerInput';

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

const ContentSection = styled.div`
  width: calc(100% - 40px);
  margin: 20px 0 16px 20px;
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

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const AddCourseDrawer = ({
  open,
  toggleDrawer,
  handleAddCourse,
  courseObj,
  setCourseObj,
  isEdit = false,
  clearFields = () => {},
  courseObjError,
  setCourseObjError,
  courseData = {},
  courseCategoryList = [],
  editCourseStatus,
}) => {
  const [categoryOpen, setCategoryOPen] = useState(false);
  const [showBenefits, setShowBenefits] = useState({
    certificateBenefits: false,
    trophyBenefits: false,
    badgeBenefits: false,
    trainingBenefits: false,
  });
  const [currentBenefitSection, setCurrentBenefitSection] = useState('');
  const [tempImageDelete, setTempImageDelete] = useState(false);
  const [tempVerticalImageDelete, setTempVerticalImageDelete] = useState(false);
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
    fileData: verticalImageFileData,
    setFileData: setVerticalImageFileData,
    handleInputChange: handleVerticalImageInputChange,
    abortUpload: abortVerticalImageUpload,
    status: verticalImageUploadStatus,
    isError: isVerticalImageUploadError,
    error: verticalImageUploadError,
    data: verticalImageUploadData,
    resetFileData: resetVerticalImageFileData,
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
      setCourseObj({
        ...courseObj,
        imageUrl: imageUploadData?.fileLink,
      });
    }
  }, [imageUploadStatus]);

  useEffect(() => {
    if (verticalImageUploadStatus === 'success') {
      setTempVerticalImageDelete(false);
      setCourseObj({
        ...courseObj,
        verticalImageUrl: verticalImageUploadData?.fileLink,
      });
    }
  }, [verticalImageUploadStatus]);

  useEffect(() => {
    if (videoUploadStatus === 'success') {
      setTempVideoDelete(false);
      setCourseObj({
        ...courseObj,
        courseIntroVideo: videoUploadData?.fileLink,
      });
    }
  }, [videoUploadStatus]);

  useEffect(() => {
    if (tempImageDelete) {
      setCourseObj({
        ...courseObj,
        imageUrl: '',
      });
    }
  }, [tempImageDelete]);

  useEffect(() => {
    if (tempVerticalImageDelete) {
      setCourseObj({
        ...courseObj,
        verticalImageUrl: '',
      });
    }
  }, [tempVerticalImageDelete]);

  useEffect(() => {
    if (tempVideoDelete) {
      setCourseObj({
        ...courseObj,
        courseIntroVideo: '',
      });
    }
  }, [tempVideoDelete]);

  const updateCourseObj = (field, subField, value) => {
    setCourseObj((prevCourseObj) => ({
      ...prevCourseObj,
      [field]: {
        ...prevCourseObj[field],
        [subField]: value,
      },
    }));
  };

  const handleFieldUpdate = (event, fieldName, subFieldName) => {
    switch (fieldName) {
      case 'courseTitle':
        setCourseObj({ ...courseObj, courseTitle: event.target.value });
        setCourseObjError({
          ...courseObjError,
          courseTitle: textLengthCheck(
            event.target.value,
            COURSE_MODULE?.TITLE_MAX_LENGTH,
          ),
        });
        break;

      case 'courseDescription':
        setCourseObj({ ...courseObj, courseDescription: event.target.value });
        setCourseObjError({
          ...courseObjError,
          courseDescription: textLengthCheck(
            event.target.value,
            COURSE_MODULE?.DESCRIPTION_MAX_LENGTH,
          ),
        });
        break;

      case 'salaryBenefit':
        setCourseObj({ ...courseObj, salaryBenefit: event.target.value });
        setCourseObjError({
          ...courseObjError,
          salaryBenefit: textLengthCheck(
            event.target.value,
            COURSE_MODULE?.DESCRIPTION_MAX_LENGTH,
          ),
        });
        break;

      case 'certificateBenefits':
      case 'trophyBenefits':
      case 'badgeBenefits':
      case 'trainingBenefits':
        switch (subFieldName) {
          case 'salaryBenefit':
          case 'trainingCertificate':
          case 'trainingReward':
            updateCourseObj(fieldName, subFieldName, event.target.value);
            break;
          default:
            console.error(`Unknown subFieldName: ${subFieldName}`);
        }
        break;
    }
  };

  const handlePriceChange = (e) => {
    const re = /^[0-9\b]+$/;
    const val = e.target.value;
    if (val === '' || re.test(val)) {
      setCourseObj({
        ...courseObj,
        price: {
          ...courseObj?.price,
          coursePrice: val === '' ? 0 : parseInt(val),
        },
      });
      setCourseObjError({
        ...courseObjError,
        coursePrice: inputRangeCheck(
          parseInt(val),
          COURSE_MODULE?.COURSE_PRICE_MAX,
        ),
      });
    }
  };

  const handleDisplayPriceChange = (e) => {
    const re = /^[0-9\b]+$/;
    const val = e.target.value;
    if (val === '' || re.test(val)) {
      setCourseObj({
        ...courseObj,
        price: {
          ...courseObj?.price,
          displayPrice: val === '' ? 0 : parseInt(val),
        },
      });
      setCourseObjError({
        ...courseObjError,
        displayPrice: inputRangeCheck(
          parseInt(val),
          COURSE_MODULE?.DISPLAY_PRICE_MAX,
        ),
      });
    }
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
    setCurrentBenefitSection('');
    clearFields();
  };

  const handleCategorySelect = (cat) => {
    setCourseObj({ ...courseObj, courseCategory: cat });
    setCourseObjError({
      ...courseObjError,
      courseCategory: textLengthCheck(cat),
    });
    setCategoryOPen(!categoryOpen);
  };

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

  const handleVerticalImageInputDelete = () => {
    setVerticalImageFileData((prevVerticalImageFileData) => ({
      ...prevVerticalImageFileData,
      showProgress: false,
    }));
  };

  const handleSaveClick = () => {
    handleAddCourse();
    resetImageFileData();
    resetVideoFileData();
    resetVerticalImageFileData();
  };

  const updateBenefitsState = (key) => {
    setCurrentBenefitSection(key);
    setShowBenefits({
      certificateBenefits: key === 'certificateBenefits',
      trophyBenefits: key === 'trophyBenefits',
      badgeBenefits: key === 'badgeBenefits',
      trainingBenefits: key === 'trainingBenefits',
    });
  };

  const benefitArray = [
    'salaryBenefit',
    'trainingCertificate',
    'trainingReward',
  ];

  const headerContent = () => {
    return (
      <StyledHeader
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        {isEdit ? 'Edit' : 'Add'} Course
      </StyledHeader>
    );
  };

  const footerContent = () => {
    return (
      <CustomCTA
        onClick={handleSaveClick}
        title={'Save'}
        isLoading={
          editCourseStatus === 'pending' ||
          imageUploadStatus === 'pending' ||
          videoUploadStatus === 'pending' ||
          verticalImageUploadStatus === 'pending'
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
      zIndex={zIndexValues.ADD_COURSE_DRAWER}
      headerContent={headerContent}
      footerContent={footerContent}
    >
      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Title'}
          fieldError={courseObjError?.courseTitle}
          fieldPlaceholder={'Add course title'}
          fieldValue={courseObj?.courseTitle}
          handleFieldChange={(e) => handleFieldUpdate(e, 'courseTitle')}
          isManadatory={true}
          errorText={`* Course title is required and should be less than ${COURSE_MODULE?.TITLE_MAX_LENGTH} characters.`}
        />
      </ContentSection>
      <ContentSection>
        <DrawerInput
          isManadatory={true}
          fieldType={'dropdown'}
          fieldHeader={'Category'}
          fieldError={courseObjError?.courseCategory}
          errorText={'* Course category is required.'}
          fieldValue={courseObj?.courseCategory || 'Select Course Category'}
          handleDropDownSelect={handleCategorySelect}
          dropDownOpen={categoryOpen}
          handleDropDownOpen={setCategoryOPen}
          dropDownList={courseCategoryList}
        />
      </ContentSection>
      <ContentSection>
        <DrawerInput
          fieldType={'price'}
          fieldHeader={'Course Price'}
          fieldError={courseObjError?.coursePrice}
          fieldValue={courseObj?.price?.coursePrice}
          fieldIcon={ICONS.RUPEE_ICON}
          handleFieldChange={handlePriceChange}
          errorText={`* Course price must be in the range of ${COURSE_MODULE?.DEFAULT_MIN} and ${COURSE_MODULE?.COURSE_PRICE_MAX}.`}
          isManadatory={true}
        />
      </ContentSection>
      <ContentSection>
        <DrawerInput
          fieldType={'price'}
          fieldHeader={'Display Price'}
          fieldError={courseObjError?.displayPrice}
          fieldValue={courseObj?.price?.displayPrice}
          fieldIcon={ICONS.RUPEE_ICON}
          handleFieldChange={handleDisplayPriceChange}
          errorText={`* Display price must be in the range of ${COURSE_MODULE?.DEFAULT_MIN} and ${COURSE_MODULE?.COURSE_PRICE_MAX}.`}
          isManadatory={true}
        />
      </ContentSection>
      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Description'}
          fieldError={courseObjError?.courseDescription}
          fieldPlaceholder={'Add course description'}
          fieldValue={courseObj?.courseDescription}
          handleFieldChange={(e) => handleFieldUpdate(e, 'courseDescription')}
          isManadatory={true}
          errorText={`* Description is required and should be less than ${COURSE_MODULE?.DESCRIPTION_MAX_LENGTH} characters.`}
        />
      </ContentSection>
      <ContentSection>
        <DrawerInput
          fieldType="input"
          fieldHeader="Salary Benefit"
          fieldError={courseObjError?.salaryBenefit}
          fieldPlaceholder="Add salary benefit"
          fieldValue={courseObj?.salaryBenefit}
          handleFieldChange={(e) => handleFieldUpdate(e, 'salaryBenefit')}
          isManadatory={true}
          errorText={`* Salary Benefit is required and should be less than ${COURSE_MODULE?.DESCRIPTION_MAX_LENGTH} characters.`}
        />
      </ContentSection>
      <UploadContainer>
        {COURSE_MODULE?.REWARD_STRUCTURE?.map((item) => {
          return (
            <CustomCTA
              key={item}
              onClick={() => updateBenefitsState(item)}
              title={convertCamelCaseToTitleCase(item)}
              showIcon={true}
              color={'#FFF'}
              bgColor={'#141482'}
              border={'1px solid #CDD4DF'}
              fontSize="12px"
              lineHeight="18px"
            />
          );
        })}
      </UploadContainer>
      {COURSE_MODULE?.REWARD_STRUCTURE.map((item) => {
        if (!showBenefits?.[item]) return null;
        return (
          <React.Fragment key={item}>
            {Object.keys(BENEFIT_STRUCTURE).map((subItem) => {
              return (
                <ContentSection key={subItem}>
                  <DrawerInput
                    fieldType="input"
                    fieldHeader={`${convertCamelCaseToTitleCase(item)} - ${convertCamelCaseToTitleCase(subItem)}`}
                    fieldPlaceholder={`Add ${convertCamelCaseToTitleCase(subItem)}`}
                    fieldValue={courseObj?.[item]?.[subItem]}
                    handleFieldChange={(e) =>
                      handleFieldUpdate(e, item, subItem)
                    }
                  />
                </ContentSection>
              );
            })}
          </React.Fragment>
        );
      })}

      {isEdit ? (
        <UploadContainer>
          <FileUpload
            fileData={videoFileData}
            fileType={FILE_TYPES?.VIDEO}
            iconUrl={ICONS?.VIDEO_CAMERA_BLUE}
            uploadTitle={'Upload Intro Video'}
            acceptType={'video/*'}
            handleInputChange={(e) =>
              handleVideoInputChange(e, FILE_TYPES?.VIDEO)
            }
            handleInputDelete={handleInputDelete}
            abortUpload={abortVideoUpload}
            maxApiTimer={MAX_VIDEO_API_TIMER}
            uploadData={courseData?.courseIntroVideo}
            tempDelete={tempVideoDelete}
            setTempDelete={setTempVideoDelete}
            isProcessing={
              courseData?.videoStatus === VIDEO_UPLOAD_STATUS?.IN_PROGRESS
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
            uploadData={courseData?.imageUrl}
            tempDelete={tempImageDelete}
            setTempDelete={setTempImageDelete}
          />
          <FileUpload
            fileData={verticalImageFileData}
            fileType={FILE_TYPES?.IMAGE}
            iconUrl={ICONS?.THUMBNAIL}
            uploadTitle={'Upload Vertical Thumbnail'}
            acceptType={'image/*'}
            handleInputChange={(e) => {
              handleVerticalImageInputChange(e, FILE_TYPES?.IMAGE);
            }}
            handleInputDelete={handleVerticalImageInputDelete}
            abortUpload={abortVerticalImageUpload}
            maxApiTimer={MAX_IMAGE_API_TIMER}
            uploadData={courseData?.verticalImageUrl}
            tempDelete={tempVerticalImageDelete}
            setTempDelete={setTempVerticalImageDelete}
          />
        </UploadContainer>
      ) : null}
    </DisplayDrawer>
  );
};
AddCourseDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  handleAddCourse: PropTypes.func.isRequired,
  courseObj: PropTypes.object.isRequired,
  setCourseObj: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  clearFields: PropTypes.func,
  courseObjError: PropTypes.object.isRequired,
  setCourseObjError: PropTypes.func.isRequired,
  courseData: PropTypes.object,
};

export default AddCourseDrawer;
