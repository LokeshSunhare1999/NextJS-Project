import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import useFileUpload from '../../hooks/useFileUpload';
import { generateUploadFilePath } from '../../utils/helper';
import {
  COURSE_MODULE,
  FILE_TYPES,
  MAX_IMAGE_API_TIMER,
} from '../../constants';
import FileUpload from './FileUpload';
import PropTypes from 'prop-types';

const LinkContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  margin: 10px 0 0 15px;
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

const StyledImg = styled.img`
  width: ${(props) => props?.width};
  height: ${(props) => props?.height};
  cursor: pointer;
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
`;

const AnswerInput = styled(QuestionInput)`
  width: 244px;
  padding-right: 50px;
`;

const AnsUploadInput = styled(AnswerInput)`
  margin: 5px 0 0 15px;
`;

const AnswerDeleteIcon = styled(StyledImg)`
  position: absolute;
  left: 305px;
`;

const AnswerClearIcon = styled(StyledImg)`
  position: absolute;
  left: 285px;
`;

const CorrectAnsDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  font-family: Poppins;
  font-size: 12px;
  font-weight: 400;
  line-height: 18px;
  text-align: left;
  color: #606c85;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const ProgressContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const OptionsBlock = ({
  idx,
  optionsArray,
  setOptionsArray,
  itemValue,
  handleQuesArrayUpdate,
  quesText,
  quesImg,
  quesAudio,
  quesType,
  psychometricTrait,
  optionsType,
  quesSubModuleId,
  courseData,
}) => {
  const [showAnsImgUpload, setShowAnsImgUpload] = useState(false);
  const [optionValue, setOptionValue] = useState(itemValue.option);
  const [imageLink, setImageLink] = useState(itemValue.imageLink);
  const [audioLink, setAudioLink] = useState(itemValue.audioLink);
  const [isCorrect, setIsCorrect] = useState(itemValue.isCorrect);
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
    resetFileData: resetOptionImageFileData,
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
    resetFileData: resetOptionAudioFileData,
  } = useFileUpload(
    generateUploadFilePath('COURSE', courseData?._id, FILE_TYPES?.AUDIO),
    FILE_TYPES?.AUDIO?.toUpperCase(),
  );

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

  useEffect(() => {
    if (imageUploadStatus === 'success') {
      setImageLink(imageUploadData?.fileLink);
      handleOptionsArrayUpdate({
        option: optionValue,
        imageLink: imageUploadData?.fileLink,
        audioLink: audioLink,
        isCorrect: isCorrect,
      });
    }
  }, [imageUploadStatus]);

  useEffect(() => {
    if (audioUploadStatus === 'success') {
      setAudioLink(audioUploadData?.fileLink);
      handleOptionsArrayUpdate({
        option: optionValue,
        imageLink: imageLink,
        audioLink: audioUploadData?.fileLink,
        isCorrect: isCorrect,
      });
    }
  }, [audioUploadStatus]);

  useEffect(() => {
    setOptionValue(itemValue.option);
    setImageLink(itemValue.imageLink);
    setAudioLink(itemValue.audioLink);
    setIsCorrect(itemValue.isCorrect);
  }, [itemValue]);

  useEffect(() => {
    if (tempImageDelete) {
      setImageLink('');
      handleOptionsArrayUpdate({
        option: optionValue,
        imageLink: '',
        audioLink: audioLink,
        isCorrect: isCorrect,
      });
    }
  }, [tempImageDelete]);

  useEffect(() => {
    if (tempAudioDelete) {
      setAudioLink('');
      handleOptionsArrayUpdate({
        option: optionValue,
        imageLink: imageLink,
        audioLink: '',
        isCorrect: isCorrect,
      });
    }
  }, [tempAudioDelete]);

  const handleOptionsArrayUpdate = (optionObjArg) => {
    const tempOptionsArray = optionsArray.map((item, index) => {
      if (idx === index) return optionObjArg;
      else return item;
    });
    setOptionsArray(tempOptionsArray);
    handleQuesArrayUpdate({
      questionText: quesText,
      questionType: quesType,
      psychometricTrait: psychometricTrait,
      questionAudio: quesAudio,
      questionImage: quesImg,
      optionsType: optionsType,
      questionSubModuleId: quesSubModuleId,
      options: tempOptionsArray,
    });
  };

  const handleDeleteOption = () => {
    setOptionsArray(optionsArray.filter((item, index) => idx !== index));
    handleQuesArrayUpdate({
      questionText: quesText,
      questionType: quesType,
      psychometricTrait: psychometricTrait,
      questionAudio: quesAudio,
      questionImage: quesImg,
      optionsType: optionsType,
      questionSubModuleId: quesSubModuleId,
      options: optionsArray.filter((item, index) => idx !== index),
    });
  };

  const handleOptionUpdate = (e, type) => {
    switch (type) {
      case 'optionValue':
        setOptionValue(e.target.value);
        handleOptionsArrayUpdate({
          option: e.target.value,
          imageLink: imageLink,
          audioLink: audioLink,
          isCorrect: isCorrect,
        });
        break;

      case 'isCorrect':
        setIsCorrect(!isCorrect);
        handleOptionsArrayUpdate({
          option: optionValue,
          imageLink: imageLink,
          audioLink: audioLink,
          isCorrect: !isCorrect,
        });
        break;
    }
  };

  const handleClearOption = () => {
    setOptionValue('');
  };

  return (
    <OptionContainer>
      <AnswerInputContainer>
        {idx + 1}.{' '}
        <AnswerInput
          placeholder={`Option ${idx + 1}`}
          value={optionValue}
          onChange={(e) => handleOptionUpdate(e, 'optionValue')}
        />
        <AnswerDeleteIcon
          src={ICONS.DELETE_ICON}
          width="14px"
          height="14px"
          alt="delete-option"
          onClick={handleDeleteOption}
        />
        <AnswerClearIcon
          src={ICONS.CROSS_ICON}
          width="14px"
          height="14px"
          alt="delete-option"
          onClick={handleClearOption}
        />
      </AnswerInputContainer>
      <LinkContainer>
        {optionsType === COURSE_MODULE?.OPTION_TYPES?.TEXT_IMAGE ? (
          <>
            <FileUpload
              fileData={audioFileData}
              fileType={FILE_TYPES?.AUDIO}
              iconUrl={ICONS?.SPEAKER_BLUE}
              uploadTitle={'Upload'}
              acceptType={'audio/*'}
              handleInputChange={(e) => {
                handleAudioInputChange(e, FILE_TYPES?.AUDIO);
              }}
              handleInputDelete={handleInputDelete}
              abortUpload={abortAudioUpload}
              maxApiTimer={MAX_IMAGE_API_TIMER}
              uploadData={itemValue?.audioLink}
              maxFileNameLength={10}
              tempDelete={tempAudioDelete}
              setTempDelete={setTempAudioDelete}
              showEmptyProgress={audioLink?.length === 0}
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
              uploadData={itemValue?.imageLink}
              maxFileNameLength={10}
              tempDelete={tempImageDelete}
              setTempDelete={setTempImageDelete}
              showEmptyProgress={imageLink?.length === 0}
            />
          </>
        ) : null}
        <CorrectAnsDiv>
          Is Correct?
          <input
            type="checkbox"
            checked={isCorrect}
            onChange={(e) => handleOptionUpdate(e, 'isCorrect')}
          />
        </CorrectAnsDiv>
      </LinkContainer>
    </OptionContainer>
  );
};

OptionsBlock.propTypes = {
  idx: PropTypes.number.isRequired,
  optionsArray: PropTypes.arrayOf(
    PropTypes.shape({
      option: PropTypes.string,
      imageLink: PropTypes.string,
      audioLink: PropTypes.string,
      isCorrect: PropTypes.bool,
    }),
  ).isRequired,
  setOptionsArray: PropTypes.func.isRequired,
  itemValue: PropTypes.shape({
    option: PropTypes.string,
    imageLink: PropTypes.string,
    audioLink: PropTypes.string,
    isCorrect: PropTypes.bool,
  }).isRequired,
  handleQuesArrayUpdate: PropTypes.func.isRequired,
  quesText: PropTypes.string.isRequired,
  quesImg: PropTypes.string,
  quesAudio: PropTypes.string,
  quesType: PropTypes.string.isRequired,
  optionsType: PropTypes.string,
  courseData: PropTypes.shape({
    courseTitle: PropTypes.string,
    _id: PropTypes.string,
  }),
};

export default OptionsBlock;
