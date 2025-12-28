import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Drawer from '@mui/material/Drawer';
import ICONS from '../../assets/icons';
import QuestionsBlock from './QuestionsBlock';
import CustomCTA from '../CustomCTA';
import { zIndexValues } from '../../style';
import {
  usePostAddAssessment,
  usePutCourseAssessment,
  useGetTestCategories,
} from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import DropDownCategory from '../DropDownCategory';
import DrawerInput from '../common/DrawerInput';
import {
  textLengthCheck,
  generateUploadFilePath,
  upperSnakeToKebabCase,
} from '../../utils/helper';
import {
  COURSE_MODULE,
  FILE_TYPES,
  MAX_IMAGE_API_TIMER,
  MAX_VIDEO_API_TIMER,
  VIDEO_UPLOAD_STATUS,
} from '../../constants';
import useFileUpload from '../../hooks/useFileUpload';
import FileUpload from './FileUpload';
import PropTypes from 'prop-types';

const StyledDrawer = styled(Drawer)`
  z-index: ${zIndexValues?.ADD_ASSESSMENT_DRAWER} !important;
`;
const DrawerWrapper = styled.div`
  width: 836px;
  min-height: 100%;
  height: auto;
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
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
  border: ${(props) => (props?.$isError ? '1px solid red' : '')};
`;

const Description = styled.textarea`
  width: calc(100% - 40px);
  height: auto;
  margin-top: 10px;
  border-radius: 8px;
  color: #000000bf !important;
  border: ${(props) => (props?.$isError ? '1px solid red' : 'none')};
  outline: none;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
`;

const AddQuestionButton = styled.button`
  width: 122px;
  height: 30px;
  display: flex;
  gap: 12px;
  justify-content: center;
  align-items: center;
  border: none;
  border-radius: 6px;
  background: #677995;
  cursor: pointer;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #fff;
`;

const StyledImg = styled.img`
  width: ${(props) => props?.width};
  height: ${(props) => props?.height};
  cursor: pointer;
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

const P = styled.p`
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => props?.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const filterClassname = {
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '5px',
};

const AddAssessmentDrawer = ({
  open,
  toggleDrawer,
  courseId,
  courseSubModuleId,
  handlePostAssessmenttSuccess,
  isEditAssessment,
  setIsEditAssessment,
  assessmentObj,
  courseData,
  globalData,
}) => {
  const quesObj = {
    questionText: '',
    questionType: '',
    psychometricTrait: '',
    questionAudio: '',
    questionImage: '',
    optionsType: COURSE_MODULE?.OPTION_TYPES?.TEXT,
    questionSubModuleId: '',
    options: [],
  };
  const [title, setTitle] = useState('Test');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [skillsCheckboxes, setSkillsCheckboxes] = useState([]);
  const [passingPercent, setPassingPercent] = useState(
    COURSE_MODULE?.PASSING_PERCENT,
  );
  const [quesArray, setQuesArray] = useState([]);
  const [imageUploadedUrl, setImageUploadedUrl] = useState('');
  const [videoUploadedUrl, setVideoUploadedUrl] = useState('');
  const [videoUploadedStatus, setVideoUploadedStatus] = useState('');
  const { enqueueSnackbar } = useSnackbar();
  const [categoryOpen, setCategoryOPen] = useState(false);
  const [assessmentObjError, setAssessmentObjError] = useState({
    ...COURSE_MODULE?.ASSESSMENT_OBJ_ERROR_STRUCTURE,
  });
  const [tempImageDelete, setTempImageDelete] = useState(false);
  const [tempVideoDelete, setTempVideoDelete] = useState(false);

  const { data: testCategoriesData } = useGetTestCategories();
  const selectedLanguage = sessionStorage.getItem('selectedLanguage') || 'en';

  const {
    mutate: addAssessmentMutation,
    status: addAssessmentStatus,
    isError: isPostAssessErr,
    error: postAssessErr,
  } = usePostAddAssessment(selectedLanguage);

  const {
    mutate: editAssessmentMutation,
    status: editAssessmentStatus,
    isError: isEditAssessErr,
    error: editAssessErr,
  } = usePutCourseAssessment(assessmentObj?._id, selectedLanguage);

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
    const updatedSkillsCheckboxes = [];
    globalData?.['COURSE_SKILLS']?.map((item) =>
      updatedSkillsCheckboxes.push({
        key: item,
        value: item,
        checked: false,
      }),
    );
    if (isEditAssessment && globalData) {
      updatedSkillsCheckboxes?.map((item) => {
        if (assessmentObj?.skills?.includes(item.key)) {
          item.checked = true;
        }
      });
    }
    setSkillsCheckboxes(updatedSkillsCheckboxes);
  }, [globalData, isEditAssessment]);

  useEffect(() => {
    if (isEditAssessment) {
      setTitle(assessmentObj?.assessmentTitle);
      setDescription(assessmentObj?.assessmentDescription);
      setPassingPercent(assessmentObj?.passingPercent);
      setCategory(assessmentObj?.assessmentType);
      setQuesArray(assessmentObj?.questions);
      setImageUploadedUrl(assessmentObj?.imageUrl);
      setVideoUploadedUrl(assessmentObj?.videoUrl);
      setVideoUploadedStatus(assessmentObj?.videoStatus || '');
    }
  }, [isEditAssessment]);

  useEffect(() => {
    if (addAssessmentStatus === 'success') {
      handlePostAssessmenttSuccess();
      handleCloseDrawer();
      enqueueSnackbar('Assessment added successfully!', {
        variant: 'success',
      });
    } else if (addAssessmentStatus === 'error') {
      enqueueSnackbar(
        `Error in Assessment add. ${postAssessErr?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [addAssessmentStatus]);

  useEffect(() => {
    if (editAssessmentStatus === 'success') {
      handlePostAssessmenttSuccess();
      handleCloseDrawer();
      enqueueSnackbar('Assessment updated successfully!', {
        variant: 'success',
      });
    } else if (editAssessmentStatus === 'error') {
      enqueueSnackbar(
        `Error in Assessment update. ${editAssessErr?.response?.data?.error?.message}`,
        {
          variant: 'error',
        },
      );
    }
  }, [editAssessmentStatus]);

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

  const handleCategoryChange = (cat) => {
    setCategory(cat);
    setCategoryOPen(!categoryOpen);
    setAssessmentObjError({
      ...assessmentObjError,
      assessmentType: textLengthCheck(cat),
    });
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setAssessmentObjError({
      ...assessmentObjError,
      assessmentTitle: textLengthCheck(
        e.target.value,
        COURSE_MODULE?.TITLE_MAX_LENGTH,
      ),
    });
  };

  const handlePassingPercentChange = (e) => {
    const re = /^[0-9\b]+$/;
    const val = e.target.value;
    if (val === '' || re.test(val)) {
      setPassingPercent(val === '' ? 0 : parseInt(val));
    }
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
    setAssessmentObjError({
      ...assessmentObjError,
      assessmentDescription: textLengthCheck(
        e.target.value,
        COURSE_MODULE?.DESCRIPTION_MAX_LENGTH,
      ),
    });
  };

  const handleSkillsCheckboxChange = (value) => {
    setSkillsCheckboxes((prevCheckboxes) => {
      return prevCheckboxes.map((checkbox) => {
        return checkbox.value === value
          ? { ...checkbox, checked: !checkbox.checked }
          : checkbox;
      });
    });
  };

  const handleSaveClick = () => {
    const skillArr = skillsCheckboxes?.filter((item) => {
      return item.checked;
    });
    const errorFields = {
      assessmentTitle: textLengthCheck(title, COURSE_MODULE?.TITLE_MAX_LENGTH),
      assessmentType: textLengthCheck(category),
      assessmentDescription: textLengthCheck(
        description,
        COURSE_MODULE?.DESCRIPTION_MAX_LENGTH,
      ),
    };
    if (
      JSON.stringify(errorFields) ===
      JSON.stringify(COURSE_MODULE?.ASSESSMENT_OBJ_ERROR_STRUCTURE)
    ) {
      if (isEditAssessment) {
        editAssessmentMutation({
          assessmentTitle: title,
          assessmentDescription: description,
          assessmentType: category,
          passingPercent: passingPercent,
          skills: skillArr?.map((item) => item.key),
          courseId: courseId,
          courseSubModuleId: assessmentObj?.courseSubModuleId,
          imageUrl: !tempImageDelete ? imageUploadData?.fileLink : '',
          videoUrl: !tempVideoDelete ? videoUploadData?.fileLink : '',
          questions: quesArray.map((item, idx) => {
            const newQuesObj = {
              questionText: item?.questionText,
              questionImage: item?.questionImage,
              questionAudio: item?.questionAudio,
              questionType: item?.questionType,
              psychometricTrait: item?.psychometricTrait,
              optionsType: item?.optionsType,
              questionSubModuleId: item?.questionSubModuleId,
              options: item?.options,
            };
            if (item?._id) newQuesObj._id = item?._id;
            return newQuesObj;
          }),
        });
      } else {
        addAssessmentMutation({
          assessmentTitle: title,
          assessmentDescription: description,
          assessmentType: category,
          passingPercent: passingPercent,
          skills: skillArr?.map((item) => item.key),
          courseId: courseId,
          courseSubModuleId: courseSubModuleId,
          questions: quesArray,
          imageUrl: imageUploadData?.fileLink,
          videoUrl: videoUploadData?.fileLink,
        });
      }
    } else {
      setAssessmentObjError({
        ...assessmentObjError,
        ...errorFields,
      });
    }
    resetImageFileData();
    resetVideoFileData();
  };

  const handleCloseDrawer = () => {
    const updatedSkillsCheckboxes = [];
    globalData?.['COURSE_SKILLS']?.map((item) =>
      updatedSkillsCheckboxes.push({
        key: item,
        value: item,
        checked: false,
      }),
    );
    setSkillsCheckboxes(updatedSkillsCheckboxes);
    resetImageFileData();
    resetVideoFileData();
    setIsEditAssessment(false);
    setTitle('');
    setDescription('');
    setCategory('');
    setImageUploadedUrl('');
    setVideoUploadedUrl('');
    setVideoUploadedStatus('');
    setQuesArray([]);
    toggleDrawer(false);
    setAssessmentObjError({ ...COURSE_MODULE?.ASSESSMENT_OBJ_ERROR_STRUCTURE });
  };

  return (
    <StyledDrawer
      PaperProps={{
        sx: {
          backgroundColor: '#f4f6fa',
        },
      }}
      anchor="right"
      open={open}
      onClose={handleCloseDrawer}
    >
      <DrawerWrapper>
        <HeaderContainer>
          <HeaderBox>
            <Header>{isEditAssessment ? 'Edit' : 'Add'} Assessment</Header>
            <StyledImg
              src={ICONS.CROSS_ICON}
              width={'22px'}
              height={'auto'}
              alt={'close-drawer'}
              onClick={handleCloseDrawer}
            />
          </HeaderBox>
        </HeaderContainer>
        <ContentContainer>
          <ContentSection>
            <FieldHeader>Assessment Title</FieldHeader>
            <TitleInput
              $isError={assessmentObjError?.assessmentTitle}
              placeholder="Add assessment title"
              value={title}
              onChange={(e) => handleTitleChange(e)}
            ></TitleInput>
            {assessmentObjError?.assessmentTitle && (
              <ErrorBox>
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {`* Assessment title is required and should be less than ${COURSE_MODULE?.TITLE_MAX_LENGTH} characters.`}
                </P>
              </ErrorBox>
            )}
          </ContentSection>
          <ContentSection>
            <FieldHeader>Assessment Category</FieldHeader>
            <DropDownCategory
              isBoxShadow={true}
              top={'54px'}
              marginTop={'10px'}
              border={'none'}
              category={category || 'Select category'}
              courseTitle={title}
              handleCategorySelect={handleCategoryChange}
              categoryOpen={categoryOpen}
              setCategoryOPen={setCategoryOPen}
              listItem={COURSE_MODULE?.ASSESSMENT_CATEGORIES}
              isError={assessmentObjError?.assessmentType}
              errorMessage={'* Assessment category is required.'}
              displayConvertFn={upperSnakeToKebabCase}
            />
          </ContentSection>
          <ContentSection>
            <FieldHeader>Description</FieldHeader>
            <Description
              placeholder="Add assessment description"
              value={description}
              onChange={(e) => handleDescriptionChange(e)}
              $isError={assessmentObjError?.assessmentDescription}
            ></Description>
            {assessmentObjError?.assessmentDescription && (
              <ErrorBox>
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {`* Assessment description is required and should be less than ${COURSE_MODULE?.DESCRIPTION_MAX_LENGTH} characters.`}
                </P>
              </ErrorBox>
            )}
          </ContentSection>

          <ContentSection>
            <FieldHeader>Assessment Passing Percent</FieldHeader>
            <TitleInput
              placeholder="Add assessment passing percent"
              value={passingPercent}
              onChange={(e) => handlePassingPercentChange(e)}
            ></TitleInput>
          </ContentSection>
          <ContentSection>
            <DrawerInput
              fieldType="filter"
              fieldHeader="Assessment Skills"
              filterHeader="Skills"
              headerWeight="400"
              checkboxes={skillsCheckboxes}
              handleCheckboxChange={handleSkillsCheckboxChange}
              filterClassname={filterClassname}
              // fieldError={testObjError?.testSkills}
              // errorText={`* Test skill is required.`}
              // isManadatory={true}
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
              uploadData={videoUploadedUrl}
              tempDelete={tempVideoDelete}
              setTempDelete={setTempVideoDelete}
              isProcessing={
                videoUploadedStatus === VIDEO_UPLOAD_STATUS?.IN_PROGRESS
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
              uploadData={imageUploadedUrl}
              tempDelete={tempImageDelete}
              setTempDelete={setTempImageDelete}
            />
          </UploadContainer>
          {quesArray.map((item, idx) => {
            return (
              <QuestionsBlock
                key={idx}
                quesIdx={idx}
                quesItem={item}
                quesArray={quesArray}
                setQuesArray={setQuesArray}
                courseData={courseData}
                assessmentCategory={category}
                subModuleList={courseData?.modules?.flatMap(
                  (module) => module?.subModules,
                )}
                globalData={globalData}
              />
            );
          })}
          <AddQuestionButton
            onClick={() => setQuesArray([...quesArray, quesObj])}
          >
            <StyledImg
              src={ICONS.PLUS}
              width={'12px'}
              height={'auto'}
              alt="plus-icon"
            />
            Add Question
          </AddQuestionButton>
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
                addAssessmentStatus === 'pending' ||
                editAssessmentStatus === 'pending' ||
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
AddAssessmentDrawer.propTypes = {
  open: PropTypes.bool.isRequired,
  toggleDrawer: PropTypes.func.isRequired,
  courseId: PropTypes.string.isRequired,
  courseSubModuleId: PropTypes.string.isRequired,
  handlePostAssessmenttSuccess: PropTypes.func.isRequired,
  isEditAssessment: PropTypes.bool.isRequired,
  setIsEditAssessment: PropTypes.func.isRequired,
  assessmentObj: PropTypes.object.isRequired,
  courseData: PropTypes.object,
};

export default AddAssessmentDrawer;
