import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import OptionsBlock from './OptionsBlock';
import DropDownCategory from '../DropDownCategory';
import useFileUpload from '../../hooks/useFileUpload';
import {
  generateUploadFilePath,
  upperSnakeToKebabCase,
} from '../../utils/helper';
import {
  COURSE_MODULE,
  FILE_TYPES,
  MAX_IMAGE_API_TIMER,
  MAX_VIDEO_API_TIMER,
} from '../../constants';
import FileUpload from './FileUpload';
import PropTypes from 'prop-types';

const ContentSection = styled.div`
  margin-bottom: 12px;
`;

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: 10px;
`;

const FieldHeader = styled.p`
  font-size: 16px;
  line-height: 24px;
  font-weight: 400;
  color: #000;
  margin-bottom: 10px;
`;

const StyledImg = styled.img`
  width: ${(props) => props?.width};
  height: ${(props) => props?.height};
  cursor: pointer;
`;

const QuestionContainer = styled.div`
  width: calc(100% - 40px);
  height: auto;
  border-radius: 8px;
  padding: 16px 20px 20px 20px;
  background: #fff;
`;

const QuestionInput = styled.input`
  width: calc(100% - 40px);
  height: 20px;
  border-radius: 8px;
  background: #f4f6fa;
  font-family: Poppins;
  font-size: 14px;
  font-weight: 400;
  line-height: 21px;
  text-align: left;
  color: #000000bf;
  border: none;
  outline: none;
  padding: 12px 20px;
  margin-bottom: 10px;
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-top: 20px;
`;

const LinkText = styled.div`
  font-family: Poppins;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #141482;
  text-decoration: underline;
  cursor: pointer;
`;

const AnswerContainer = styled.div`
  margin: 20px 0 10px 0;
`;

const OptionGrid = styled.div`
  width: auto;
  display: grid;
  grid-template-columns: auto auto;
  gap: 10px;
`;

const OptionContainer = styled.div`
  width: auto;
  display: flex;
  flex-direction: column;
`;

const AnswerInputContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  position: relative;
`;

const AnswerInput = styled(QuestionInput)`
  width: 264px;
  padding-right: 30px;
`;

const AnswerFooter = styled.div`
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const AddOptionCTA = styled.button`
  width: auto;
  height: 30px;
  border-radius: 6px;
  padding: 6px 8px;
  display: flex;
  align-items: center;
  gap: 12px;
  background: #f3f4f6;
  border: none;
  outline: none;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #586276;
  cursor: pointer;
`;

const QuesUploadInput = styled(QuestionInput)`
  margin-top: 5px;
`;

const AnsUploadInput = styled(AnswerInput)`
  margin: 5px 0 0 15px;
`;

const AnswerInputIcon = styled(StyledImg)`
  position: absolute;
  left: 305px;
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

const QuestionsBlock = ({
  quesIdx,
  quesItem,
  quesArray,
  setQuesArray,
  courseData,
  assessmentCategory,
  subModuleList,
  globalData,
}) => {
  const optionsObj = {
    option: '',
    imageLink: '',
    audioLink: '',
    isCorrect: false,
  };
  const [optionsArray, setOptionsArray] = useState([optionsObj]);
  const [showQuesImgUpload, setShowQuesImgUpload] = useState(false);
  const [showQuesAudioUpload, setShowQuesAudioUpload] = useState(false);
  const [quesText, setQuesText] = useState('');
  const [quesImg, setQuesImg] = useState('');
  const [quesAudio, setQuesAudio] = useState('');
  const [quesType, setQuesType] = useState('');
  const [psychometricTrait, setPsychometricTrait] = useState('');
  const [psychCategoryOpen, setPsychCategoryOpen] = useState(false);
  const [optionsType, setOptionsType] = useState(
    COURSE_MODULE?.OPTION_TYPES?.TEXT,
  );
  const [optionsCategoryOpen, setOptionsCategoryOpen] = useState(false);
  const [quesSubModuleId, setQuesSubModuleId] = useState('');
  const [quesSubModuleCategoryOpen, setQuesSubModuleCategoryOpen] =
    useState(false);
  const [categoryOpen, setCategoryOPen] = useState(false);
  const [tempImageDelete, setTempImageDelete] = useState(false);
  const [tempAudioDelete, setTempAudioDelete] = useState(false);

  const {
    fileData: imageFileData,
    setFileData: setImageFileData,
    handleInputChange: handleImageInputChange,
    abortUpload: abortImageUpload,
    status: imageUploadStatus,
    isError: isImageUploadError,
    error: imageUploadError,
    data: imageUploadData,
    resetFileData: resetQuesImageFileData,
  } = useFileUpload(
    generateUploadFilePath('COURSE', courseData?._id, FILE_TYPES?.IMAGE),
    FILE_TYPES?.IMAGE?.toUpperCase(),
  );

  const {
    fileData: audioFileData,
    setFileData: setAudioFileData,
    handleInputChange: handleAudioInputChange,
    abortUpload: abortAudioUpload,
    status: audioUploadStatus,
    isError: isAudioUploadError,
    error: audioUploadError,
    data: audioUploadData,
    resetFileData: resetQuesAudioFileData,
  } = useFileUpload(
    generateUploadFilePath('COURSE', courseData?._id, FILE_TYPES?.AUDIO),
    FILE_TYPES?.AUDIO?.toUpperCase(),
  );

  const convertToObj = (item) => {
    const displayObj = subModuleList?.reduce((acc, item) => {
      acc[item?._id] = item?.subModuleTitle;
      return acc;
    }, {});
    return displayObj[item];
  };

  const handleInputDelete = (type) => {
    if (type === FILE_TYPES?.AUDIO) {
      setAudioFileData((prevAudioData) => ({
        ...prevAudioData,
        showProgress: false,
      }));
    } else if (type === FILE_TYPES?.IMAGE) {
      setImageFileData((prevImageFileData) => ({
        ...prevImageFileData,
        showProgress: false,
      }));
    }
  };

  //Updated all the field values accordingly when some item is deleted
  useEffect(() => {
    setQuesType(quesItem.questionType);
    setPsychometricTrait(quesItem.psychometricTrait);
    setQuesText(quesItem.questionText);
    setQuesImg(quesItem.questionImage);
    setQuesAudio(quesItem.questionAudio);
    setOptionsType(quesItem.optionsType);
    setQuesSubModuleId(quesItem.questionSubModuleId);
    setOptionsArray(quesItem.options);
  }, [quesItem]);

  useEffect(() => {
    if (imageUploadStatus === 'success') {
      setQuesImg(imageUploadData?.fileLink);
      handleQuesArrayUpdate({
        questionText: quesText,
        questionType: quesType,
        psychometricTrait: psychometricTrait,
        questionAudio: quesAudio,
        questionImage: imageUploadData?.fileLink,
        optionsType: optionsType,
        questionSubModuleId: quesSubModuleId,
        options: optionsArray,
      });
    }
  }, [imageUploadStatus]);

  useEffect(() => {
    if (audioUploadStatus === 'success') {
      setQuesAudio(audioUploadData?.fileLink);
      handleQuesArrayUpdate({
        questionText: quesText,
        questionType: quesType,
        psychometricTrait: psychometricTrait,
        questionAudio: audioUploadData?.fileLink,
        questionImage: quesImg,
        optionsType: optionsType,
        questionSubModuleId: quesSubModuleId,
        options: optionsArray,
      });
    }
  }, [audioUploadStatus]);

  useEffect(() => {
    if (tempImageDelete) {
      setQuesImg('');
      handleQuesArrayUpdate({
        questionText: quesText,
        questionType: quesType,
        psychometricTrait: psychometricTrait,
        questionAudio: quesAudio,
        questionImage: '',
        optionsType: optionsType,
        questionSubModuleId: quesSubModuleId,
        options: optionsArray,
      });
    }
  }, [tempImageDelete]);

  useEffect(() => {
    if (tempAudioDelete) {
      setQuesAudio('');
      handleQuesArrayUpdate({
        questionText: quesText,
        questionType: quesType,
        psychometricTrait: psychometricTrait,
        questionAudio: '',
        questionImage: quesImg,
        optionsType: optionsType,
        questionSubModuleId: quesSubModuleId,
        options: optionsArray,
      });
    }
  }, [tempAudioDelete]);

  const handleQuesImgUpload = () => {
    setShowQuesImgUpload(!showQuesImgUpload);
    setShowQuesAudioUpload(false);
  };

  const handleQuesAudioUpload = () => {
    setShowQuesImgUpload(false);
    setShowQuesAudioUpload(!showQuesAudioUpload);
  };

  const handleQuesArrayUpdate = (quesObj) => {
    const tempQuesArray = quesArray.map((item, idx) => {
      if (idx === quesIdx) {
        if (item?._id) {
          return {
            ...quesObj,
            _id: item?._id,
          };
        }
        return quesObj;
      } else return item;
    });

    setQuesArray(tempQuesArray);
  };

  const handleQuesUpdate = (e, type) => {
    switch (type) {
      case 'text':
        setQuesText(e.target.value);
        handleQuesArrayUpdate({
          questionText: e.target.value,
          questionType: quesType,
          psychometricTrait: psychometricTrait,
          questionAudio: quesAudio,
          questionImage: quesImg,
          optionsType: optionsType,
          questionSubModuleId: quesSubModuleId,
          options: optionsArray,
        });
        break;

      case 'type':
        setQuesType(e);
        handleQuesArrayUpdate({
          questionText: quesText,
          questionType: e,
          psychometricTrait: psychometricTrait,
          questionAudio: quesAudio,
          questionImage: quesImg,
          optionsType: optionsType,
          questionSubModuleId: quesSubModuleId,
          options: optionsArray,
        });
        setCategoryOPen(!categoryOpen);
        break;

      case 'optionsType':
        setOptionsType(e);
        handleQuesArrayUpdate({
          questionText: quesText,
          questionType: quesType,
          psychometricTrait: psychometricTrait,
          questionAudio: quesAudio,
          questionImage: quesImg,
          optionsType: e,
          questionSubModuleId: quesSubModuleId,
          options: optionsArray,
        });
        setOptionsCategoryOpen(!optionsCategoryOpen);
        break;

      case 'submodule':
        setQuesSubModuleId(e);
        handleQuesArrayUpdate({
          questionText: quesText,
          questionType: quesType,
          psychometricTrait: psychometricTrait,
          questionAudio: quesAudio,
          questionImage: quesImg,
          optionsType: optionsType,
          questionSubModuleId: e,
          options: optionsArray,
        });
        setQuesSubModuleCategoryOpen(!quesSubModuleCategoryOpen);
        break;

      case 'psych':
        setPsychometricTrait(e);
        handleQuesArrayUpdate({
          questionText: quesText,
          questionType: quesType,
          psychometricTrait: e,
          questionAudio: quesAudio,
          questionImage: quesImg,
          optionsType: optionsType,
          questionSubModuleId: quesSubModuleId,
          options: optionsArray,
        });
        setPsychCategoryOpen(!psychCategoryOpen);
        break;
    }
  };

  const handleDeleteQues = () => {
    setQuesArray(quesArray.filter((item, index) => quesIdx !== index));
  };

  return (
    <ContentSection>
      <HeaderContainer>
        <FieldHeader>Questions Section {quesIdx + 1}.</FieldHeader>
        <DropDownCategory
          isBoxShadow={true}
          top={'54px'}
          category={optionsType || 'Select Options Type'}
          courseTitle={optionsType}
          handleCategorySelect={(cat) => handleQuesUpdate(cat, 'optionsType')}
          categoryOpen={optionsCategoryOpen}
          setCategoryOPen={setOptionsCategoryOpen}
          listItem={Object.values(COURSE_MODULE?.OPTION_TYPES)}
          displayConvertFn={upperSnakeToKebabCase}
        />
      </HeaderContainer>
      <QuestionContainer>
        <QuestionInput
          placeholder="Question"
          value={quesText}
          onChange={(e) => handleQuesUpdate(e, 'text')}
        />
        <DropDownCategory
          isBoxShadow={true}
          top={'54px'}
          marginTop={'10px'}
          border={'1px solid #F4F6FA'}
          category={quesType || 'Select Question Type'}
          courseTitle={quesType}
          handleCategorySelect={(cat) => handleQuesUpdate(cat, 'type')}
          categoryOpen={categoryOpen}
          setCategoryOPen={setCategoryOPen}
          listItem={COURSE_MODULE?.QUESTION_TYPES}
        />
        {quesType === 'PSYCHOMETRIC' ? (
          <DropDownCategory
            isBoxShadow={true}
            top={'54px'}
            marginTop={'10px'}
            border={'1px solid #F4F6FA'}
            category={psychometricTrait || 'Select Psychometric Trait'}
            courseTitle={psychometricTrait}
            handleCategorySelect={(cat) => handleQuesUpdate(cat, 'psych')}
            categoryOpen={psychCategoryOpen}
            setCategoryOPen={setPsychCategoryOpen}
            listItem={globalData?.['PSYCHOMETRIC_TRAIT']}
          />
        ) : null}
        {assessmentCategory !== 'COURSE_SUB_MODULE_LEVEL' ? (
          <DropDownCategory
            isBoxShadow={true}
            top={'60px'}
            marginTop={'10px'}
            border={'1px solid #F4F6FA'}
            category={quesSubModuleId}
            courseTitle={quesSubModuleId}
            handleCategorySelect={(cat) => handleQuesUpdate(cat, 'submodule')}
            categoryOpen={quesSubModuleCategoryOpen}
            setCategoryOPen={setQuesSubModuleCategoryOpen}
            listItem={subModuleList?.map((item) => item?._id)}
            displayConvertFn={convertToObj}
            isSearchable={false}
            placeholder="Select Question Submodule"
          />
        ) : null}

        {showQuesImgUpload ? (
          <QuesUploadInput
            placeholder="Add image link"
            value={quesImg}
            onChange={(e) => handleQuesUpdate(e, 'img')}
          />
        ) : null}
        {showQuesAudioUpload ? (
          <QuesUploadInput
            placeholder="Add audio link"
            value={quesAudio}
            onChange={(e) => handleQuesUpdate(e, 'audio')}
          />
        ) : null}

        <LinkContainer>
          <FileUpload
            fileData={audioFileData}
            fileType={FILE_TYPES?.AUDIO}
            iconUrl={ICONS?.SPEAKER_BLUE}
            uploadTitle={'Upload'}
            acceptType={'audio/*'}
            handleInputChange={(e) =>
              handleAudioInputChange(e, FILE_TYPES?.AUDIO)
            }
            handleInputDelete={handleInputDelete}
            abortUpload={abortAudioUpload}
            maxApiTimer={MAX_IMAGE_API_TIMER}
            uploadData={quesItem?.questionAudio}
            maxFileNameLength={10}
            tempDelete={tempAudioDelete}
            setTempDelete={setTempAudioDelete}
            showEmptyProgress={quesAudio?.length === 0}
          />
          <FileUpload
            fileData={imageFileData}
            fileType={FILE_TYPES?.IMAGE}
            iconUrl={ICONS?.THUMBNAIL}
            uploadTitle={'Upload'}
            acceptType={'image/*'}
            handleInputChange={(e) => {
              handleImageInputChange(e, FILE_TYPES?.IMAGE);
            }}
            handleInputDelete={handleInputDelete}
            abortUpload={abortImageUpload}
            maxApiTimer={MAX_IMAGE_API_TIMER}
            uploadData={quesItem?.questionImage}
            maxFileNameLength={10}
            tempDelete={tempImageDelete}
            setTempDelete={setTempImageDelete}
            showEmptyProgress={quesImg?.length === 0}
          />
        </LinkContainer>
        <AnswerContainer>
          <FieldHeader>Answer</FieldHeader>
          <OptionGrid>
            {optionsArray.map((item, idx) => {
              return (
                <OptionsBlock
                  key={idx}
                  idx={idx}
                  itemValue={item}
                  optionsArray={optionsArray}
                  setOptionsArray={setOptionsArray}
                  handleQuesArrayUpdate={handleQuesArrayUpdate}
                  quesText={quesText}
                  quesImg={quesImg}
                  quesAudio={quesAudio}
                  quesType={quesType}
                  psychometricTrait={psychometricTrait}
                  optionsType={optionsType}
                  quesSubModuleId={quesSubModuleId}
                  courseData={courseData}
                />
              );
            })}
          </OptionGrid>
          <AnswerFooter>
            <AddOptionCTA
              onClick={() => setOptionsArray([...optionsArray, optionsObj])}
            >
              <StyledImg
                src={ICONS.DARK_PLUS}
                width={'12px'}
                height={'auto'}
                alt={'add-option'}
              />
              Add Option
            </AddOptionCTA>
            <StyledImg
              src={ICONS.DELETE_ICON}
              width={'14px'}
              height={'auto'}
              alt={'delete-answer'}
              onClick={handleDeleteQues}
            />
          </AnswerFooter>
        </AnswerContainer>
      </QuestionContainer>
    </ContentSection>
  );
};
QuestionsBlock.propTypes = {
  quesIdx: PropTypes.number.isRequired,
  quesItem: PropTypes.object.isRequired,
  quesArray: PropTypes.array.isRequired,
  setQuesArray: PropTypes.func.isRequired,
  courseData: PropTypes.object,
};

export default QuestionsBlock;
