import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import CustomCTA from '../CustomCTA';
import { zIndexValues } from '../../style';
import {
  COURSE_MODULE,
  FILE_TYPES,
  MAX_IMAGE_API_TIMER,
  MAX_VIDEO_API_TIMER,
  VIDEO_UPLOAD_STATUS,
} from '../../constants';
import {
  generateUploadFilePath,
  convertCamelCaseToTitleCase,
} from '../../utils/helper';
import useFileUpload from '../../hooks/useFileUpload';
import FileUpload from '../courses/FileUpload';
import PropTypes from 'prop-types';
import DisplayDrawer from '../common/DisplayDrawer';
import DrawerInput from '../common/DrawerInput';
import { TEST_MODULE, BENEFIT_STRUCTURE } from '../../constants/tests';

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

const filterClassname = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '5px',
};

const AddTestDrawer = ({
  open,
  toggleDrawer,
  handleAddTest,
  testObj,
  setTestObj,
  isEdit = false,
  clearFields = () => {},
  testObjError,
  setTestObjError,
  testDetailsData = {},
  testStatus,
  categoryCheckboxes,
  setCategoryCheckboxes,
  skillsCheckboxes,
  setSkillsCheckboxes,
}) => {
  const [categoryOpen, setCategoryOPen] = useState(false);
  const [showBenefits, setShowBenefits] = useState({
    certificateBenefits: false,
    medalBenefits: false,
  });
  const [currentBenefitSection, setCurrentBenefitSection] = useState('');
  const [tempImageDelete, setTempImageDelete] = useState(false);
  const [tempVerticalImageDelete, setTempVerticalImageDelete] = useState(false);
  const [tempTestNameImageDelete, setTempTestNameImageDelete] = useState(false);
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
    generateUploadFilePath('TEST', testDetailsData?._id, FILE_TYPES?.IMAGE),
    FILE_TYPES?.IMAGE?.toUpperCase(),
  );

  const {
    fileData: verticalImageFileData,
    setFileData: setVerticalImageFileData,
    handleInputChange: handleVerticalImageInputChange,
    abortUpload: abortVerticalImageUpload,
    status: verticalImageFileUploadStatus,
    isError: isVerticalImageUploadError,
    error: verticalImageUploadError,
    data: verticalImageUploadData,
    resetFileData: resetVerticalImageFileData,
  } = useFileUpload(
    generateUploadFilePath('TEST', testDetailsData?._id, FILE_TYPES?.IMAGE),
    FILE_TYPES?.IMAGE?.toUpperCase(),
  );

  const {
    fileData: testNameImageFileData,
    setFileData: setTestNameImageFileData,
    handleInputChange: handleTestNameImageInputChange,
    abortUpload: abortTestNameImageUpload,
    status: testNameImageUploadStatus,
    isError: isTestNameImageUploadError,
    error: testNameImageUploadError,
    data: testNameImageUploadData,
    resetFileData: resetTestNameImageFileData,
  } = useFileUpload(
    generateUploadFilePath('TEST', testDetailsData?._id, FILE_TYPES?.IMAGE),
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
    generateUploadFilePath('TEST', testDetailsData?._id, FILE_TYPES?.VIDEO),
    FILE_TYPES?.VIDEO?.toUpperCase(),
  );

  useEffect(() => {
    if (imageUploadStatus === 'success') {
      setTempImageDelete(false);
      setTestObj({
        ...testObj,
        imageUrl: imageUploadData?.fileLink,
      });
    }
  }, [imageUploadStatus]);

  useEffect(() => {
    if (verticalImageFileUploadStatus === 'success') {
      setTempVerticalImageDelete(false);
      setTestObj({
        ...testObj,
        verticalImageUrl: verticalImageUploadData?.fileLink,
      });
    }
  }, [verticalImageFileUploadStatus]);

  useEffect(() => {
    if (testNameImageUploadStatus === 'success') {
      setTempTestNameImageDelete(false);
      setTestObj({
        ...testObj,
        testNameImageUrl: testNameImageUploadData?.fileLink,
      });
    }
  }, [testNameImageUploadStatus]);

  useEffect(() => {
    if (videoUploadStatus === 'success') {
      setTempVideoDelete(false);
      setTestObj({
        ...testObj,
        testIntroVideo: videoUploadData?.fileLink,
      });
    }
  }, [videoUploadStatus]);

  useEffect(() => {
    if (tempImageDelete) {
      setTestObj({
        ...testObj,
        imageUrl: '',
      });
    }
  }, [tempImageDelete]);

  useEffect(() => {
    if (tempVerticalImageDelete) {
      setTestObj({
        ...testObj,
        verticalImageUrl: '',
      });
    }
  }, [tempVerticalImageDelete]);

  useEffect(() => {
    if (tempTestNameImageDelete) {
      setTestObj({
        ...testObj,
        testNameImageUrl: '',
      });
    }
  }, [tempTestNameImageDelete]);

  useEffect(() => {
    if (tempVideoDelete) {
      setTestObj({
        ...testObj,
        testIntroVideo: '',
      });
    }
  }, [tempVideoDelete]);

  const updateTestObj = (field, subField, value) => {
    setTestObj((prevTestObj) => ({
      ...prevTestObj,
      [field]: {
        ...prevTestObj[field],
        [subField]: value,
      },
    }));
  };
  const handleFieldUpdate = (event, fieldName, subFieldName) => {
    switch (fieldName) {
      case 'testName':
        setTestObj({ ...testObj, testName: event.target.value });
        break;

      case 'testDescription':
        setTestObj({ ...testObj, testDescription: event.target.value });
        break;

      case 'salaryBenefits':
        setTestObj({ ...testObj, salaryBenefits: event.target.value });
        break;

      case 'salaryRange':
        setTestObj({ ...testObj, salaryRange: event.target.value });
        break;

      //   case 'certificateBenefits':
      case 'medalBenefits':
      case 'certificateBenefits':
        switch (subFieldName) {
          case 'salaryBenefit':
          case 'trainingCertificate':
          case 'trainingReward':
            updateTestObj(fieldName, subFieldName, event.target.value);
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
      setTestObj({
        ...testObj,
        testPricing: {
          ...testObj?.testPricing,
          actualPrice: val === '' ? 0 : parseInt(val),
        },
      });
    }
  };

  const handleDisplayPriceChange = (e) => {
    const re = /^[0-9\b]+$/;
    const val = e.target.value;
    if (val === '' || re.test(val)) {
      setTestObj({
        ...testObj,
        testPricing: {
          ...testObj?.testPricing,
          displayPrice: val === '' ? 0 : parseInt(val),
        },
      });
    }
  };

  const handleCloseDrawer = () => {
    toggleDrawer(false);
    setCurrentBenefitSection('');
    clearFields();
  };

  const handleTestCategoryCheckboxChange = (value) => {
    setCategoryCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const handleTestSkillsCheckboxChange = (value) => {
    setSkillsCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
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

  const handleTestNameImageInputDelete = () => {
    setTestNameImageFileData((prevTestNameImageFileData) => ({
      ...prevTestNameImageFileData,
      showProgress: false,
    }));
  };

  const handleSaveClick = () => {
    handleAddTest();
    resetImageFileData();
    resetVideoFileData();
    resetVerticalImageFileData();
    resetTestNameImageFileData();
  };

  const updateBenefitsState = (key) => {
    setCurrentBenefitSection(key);
    setShowBenefits({
      certificateBenefits: key === 'certificateBenefits',
      medalBenefits: key === 'medalBenefits',
    });
  };

  const headerContent = () => {
    return (
      <StyledHeader
        $fontSize={'24px'}
        $lineHeight={'36px'}
        $fontWeight={'600'}
        $color={'#000'}
      >
        {isEdit ? 'Edit' : 'Add'} Test
      </StyledHeader>
    );
  };

  const footerContent = () => {
    return (
      <CustomCTA
        onClick={handleSaveClick}
        title={'Save'}
        isLoading={
          testStatus === 'pending' ||
          imageUploadStatus === 'pending' ||
          videoUploadStatus === 'pending' ||
          verticalImageFileUploadStatus === 'pending' ||
          testNameImageUploadStatus === 'pending'
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
          fieldHeader={'Test Name'}
          fieldError={testObjError?.testName}
          fieldPlaceholder={'Add test name'}
          fieldValue={testObj?.testName}
          handleFieldChange={(e) => handleFieldUpdate(e, 'testName')}
          isManadatory={true}
          errorText={`* Test name is required and should be less than ${TEST_MODULE?.TITLE_MAX_LENGTH} characters.`}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType={'input'}
          fieldHeader={'Test Description'}
          // fieldError={testObjError?.testDescription}
          fieldPlaceholder={'Add test description'}
          fieldValue={testObj?.testDescription}
          handleFieldChange={(e) => handleFieldUpdate(e, 'testDescription')}
          isManadatory={false}
          // errorText={`* Test description is required and should be less than ${TEST_MODULE?.DESCRIPTION_MAX_LENGTH} characters.`}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType="filter"
          fieldHeader="Test Category"
          filterHeader="Categories"
          headerWeight="400"
          checkboxes={categoryCheckboxes}
          handleCheckboxChange={handleTestCategoryCheckboxChange}
          filterClassname={filterClassname}
          fieldError={testObjError?.testCategory}
          errorText={`* Test category is required.`}
          isManadatory={true}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType="filter"
          fieldHeader="Test Skills"
          filterHeader="Skills"
          headerWeight="400"
          checkboxes={skillsCheckboxes}
          handleCheckboxChange={handleTestSkillsCheckboxChange}
          filterClassname={filterClassname}
          fieldError={testObjError?.testSkills}
          errorText={`* Test skill is required.`}
          isManadatory={true}
        />
      </ContentSection>

      <ContentSection>
        <DrawerInput
          fieldType={'price'}
          fieldHeader={'Actual Price'}
          fieldError={testObjError?.actualPrice}
          fieldValue={testObj?.testPricing?.actualPrice}
          fieldIcon={ICONS.RUPEE_ICON}
          handleFieldChange={handlePriceChange}
          errorText={`* Test price must be in the range of ${TEST_MODULE?.DEFAULT_MIN} and ${TEST_MODULE?.ACTUAL_PRICE_MAX}.`}
          isManadatory={true}
        />
      </ContentSection>
      <ContentSection>
        <DrawerInput
          fieldType={'price'}
          fieldHeader={'Display Price'}
          fieldError={testObjError?.displayPrice}
          fieldValue={testObj?.testPricing?.displayPrice}
          fieldIcon={ICONS.RUPEE_ICON}
          handleFieldChange={handleDisplayPriceChange}
          errorText={`* Display price must be in the range of ${TEST_MODULE?.DEFAULT_MIN} and ${TEST_MODULE?.DISPLAY_PRICE_MAX}.`}
          isManadatory={true}
        />
      </ContentSection>

      {/* <ContentSection>
        <DrawerInput
          fieldType="input"
          fieldHeader="Salary Benefit"
          fieldError={testObjError?.salaryBenefits}
          fieldPlaceholder="Add salary benefit"
          fieldValue={testObj?.salaryBenefits}
          handleFieldChange={(e) => handleFieldUpdate(e, 'salaryBenefits')}
          isManadatory={true}
          errorText={`* Salary Benefit is required and should be less than ${TEST_MODULE?.DESCRIPTION_MAX_LENGTH} characters.`}
        />
      </ContentSection> */}

      <ContentSection>
        <DrawerInput
          fieldType="input"
          fieldHeader="Salary Range"
          fieldError={testObjError?.salaryRange}
          fieldPlaceholder="Add salary range"
          fieldValue={testObj?.salaryRange}
          handleFieldChange={(e) => handleFieldUpdate(e, 'salaryRange')}
          isManadatory={true}
          errorText={`* Salary Range is required and should be less than ${TEST_MODULE?.DESCRIPTION_MAX_LENGTH} characters.`}
        />
      </ContentSection>
      <UploadContainer>
        {TEST_MODULE?.REWARD_STRUCTURE?.map((item) => {
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
      {TEST_MODULE?.REWARD_STRUCTURE.map((item) => {
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
                    fieldValue={testObj?.[item]?.[subItem]}
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
            uploadTitle={'Intro Video'}
            acceptType={'video/*'}
            handleInputChange={(e) =>
              handleVideoInputChange(e, FILE_TYPES?.VIDEO)
            }
            handleInputDelete={handleInputDelete}
            abortUpload={abortVideoUpload}
            maxApiTimer={MAX_VIDEO_API_TIMER}
            uploadData={testDetailsData?.testIntroVideo}
            tempDelete={tempVideoDelete}
            setTempDelete={setTempVideoDelete}
            isProcessing={
              testDetailsData?.videoStatus === VIDEO_UPLOAD_STATUS?.IN_PROGRESS
            }
          />
          <FileUpload
            fileData={imageFileData}
            fileType={FILE_TYPES?.IMAGE}
            iconUrl={ICONS?.THUMBNAIL}
            uploadTitle={'Video Thumbnail'}
            acceptType={'image/*'}
            handleInputChange={(e) => {
              handleImageInputChange(e, FILE_TYPES?.IMAGE);
            }}
            handleInputDelete={handleInputDelete}
            abortUpload={abortImageUpload}
            maxApiTimer={MAX_IMAGE_API_TIMER}
            uploadData={testDetailsData?.imageUrl}
            tempDelete={tempImageDelete}
            setTempDelete={setTempImageDelete}
          />

          <FileUpload
            fileData={verticalImageFileData}
            fileType={FILE_TYPES?.IMAGE}
            iconUrl={ICONS?.THUMBNAIL}
            uploadTitle={'Vertical Thumbnail'}
            acceptType={'image/*'}
            handleInputChange={(e) => {
              handleVerticalImageInputChange(e, FILE_TYPES?.IMAGE);
            }}
            handleInputDelete={handleVerticalImageInputDelete}
            abortUpload={abortVerticalImageUpload}
            maxApiTimer={MAX_IMAGE_API_TIMER}
            uploadData={testDetailsData?.verticalImageUrl}
            tempDelete={tempVerticalImageDelete}
            setTempDelete={setTempVerticalImageDelete}
          />

          <FileUpload
            fileData={testNameImageFileData}
            fileType={FILE_TYPES?.IMAGE}
            iconUrl={ICONS?.THUMBNAIL}
            uploadTitle={'Test Name Image'}
            acceptType={'image/*'}
            handleInputChange={(e) => {
              handleTestNameImageInputChange(e, FILE_TYPES?.IMAGE);
            }}
            handleInputDelete={handleTestNameImageInputDelete}
            abortUpload={abortTestNameImageUpload}
            maxApiTimer={MAX_IMAGE_API_TIMER}
            uploadData={testDetailsData?.testNameImageUrl}
            tempDelete={tempTestNameImageDelete}
            setTempDelete={setTempTestNameImageDelete}
          />
        </UploadContainer>
      ) : null}
    </DisplayDrawer>
  );
};
AddTestDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  handleAddTest: PropTypes.func.isRequired,
  testObj: PropTypes.object.isRequired,
  setTestObj: PropTypes.func.isRequired,
  isEdit: PropTypes.bool,
  clearFields: PropTypes.func,
  testObjError: PropTypes.object.isRequired,
  setTestObjError: PropTypes.func.isRequired,
  testDetailsData: PropTypes.object,
};

export default AddTestDrawer;
