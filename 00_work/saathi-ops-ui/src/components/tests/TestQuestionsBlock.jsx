import React, { useEffect, useState } from 'react';
import useFileUpload from '../../hooks/useFileUpload';
import FileUpload from '../courses/FileUpload';
import ICONS from '../../assets/icons';
import { generateUploadFilePath } from '../../utils/helper';
import detailsPageStyle from '../../style/detailsPageStyle';
import { FILE_TYPES, MAX_VIDEO_API_TIMER } from '../../constants';
import PropTypes from 'prop-types';

const { StyledSpan, ContentSection, UploadContainer, OptionGrid } =
  detailsPageStyle();

const TestQuestionsBlock = ({
  question,
  quesIdx,
  assessmentId,
  quesArray,
  setQuesArray,
}) => {
  const [tempAudioDelete, setTempAudioDelete] = useState(false);
  const [quesAudio, setQuesAudio] = useState('');
  const {
    fileData: audioFileData,
    setFileData: setAudioFileData,
    handleInputChange: handleAudioInputChange,
    abortUpload: abortAudioUpload,
    status: audioUploadStatus,
    isError: isAudioUploadError,
    error: audioUploadError,
    data: audioUploadData,
    resetFileData: resetAudioFileData,
  } = useFileUpload(
    generateUploadFilePath('TEST', assessmentId, FILE_TYPES?.AUDIO),
    FILE_TYPES?.AUDIO?.toUpperCase(),
  );

  useEffect(() => {
    setQuesAudio(question?.questionAudio);
  }, [question]);

  useEffect(() => {
    if (audioUploadStatus === 'success') {
      setQuesAudio(audioUploadData?.fileLink);
      setQuesArray((prevQuesArray) => {
        return prevQuesArray.map((ques, idx) => {
          if (idx === quesIdx) {
            return {
              ...ques,
              questionAudio: audioUploadData?.fileLink,
            };
          }
          return ques;
        });
      });
    }
  }, [audioUploadStatus]);

  useEffect(() => {
    if (tempAudioDelete) {
      setQuesAudio('');
      setQuesArray((prevQuesArray) => {
        return prevQuesArray.map((ques, idx) => {
          if (idx === quesIdx) {
            return {
              ...ques,
              questionAudio: '',
            };
          }
          return ques;
        });
      });
    }
  }, [tempAudioDelete]);

  const handleInputDelete = (type) => {
    if (type === FILE_TYPES?.AUDIO) {
      setAudioFileData((prevAudioFileData) => ({
        ...prevAudioFileData,
        showProgress: false,
      }));
    }
  };
  return (
    <React.Fragment>
      <ContentSection>
        <StyledSpan
          $fontSize={'18px'}
          $lineHeight={'27px'}
          $fontWeight={'400'}
          $color={'#000'}
        >
          Question {quesIdx + 1}.
        </StyledSpan>
        <br />
        <StyledSpan
          $fontSize={'14px'}
          $lineHeight={'21px'}
          $fontWeight={'400'}
          $color={'#000'}
        >
          {question?.questionText}
        </StyledSpan>
      </ContentSection>
      <UploadContainer>
        <FileUpload
          fileData={audioFileData}
          fileType={FILE_TYPES?.AUDIO}
          iconUrl={ICONS?.SPEAKER_BLUE}
          uploadTitle={'Upload Question Audio'}
          acceptType={'audio/*'}
          handleInputChange={(e) =>
            handleAudioInputChange(e, FILE_TYPES?.AUDIO)
          }
          handleInputDelete={handleInputDelete}
          abortUpload={abortAudioUpload}
          maxApiTimer={MAX_VIDEO_API_TIMER}
          uploadData={question?.questionAudio}
          tempDelete={tempAudioDelete}
          setTempDelete={setTempAudioDelete}
          showEmptyProgress={quesAudio?.length === 0}
        />
      </UploadContainer>
      <ContentSection>
        <StyledSpan
          $fontSize={'18px'}
          $lineHeight={'27px'}
          $fontWeight={'400'}
          $color={'#000'}
        >
          Options
        </StyledSpan>
        <OptionGrid>
          {question?.options.map((option, optionIdx) => {
            return (
              <StyledSpan
                key={option?._id}
                $fontSize={'14px'}
                $lineHeight={'21px'}
                $fontWeight={'400'}
                $color={option?.isCorrect ? '#4BAE4F' : '#000'}
              >
                {optionIdx + 1}. {option?.optionText}
              </StyledSpan>
            );
          })}
        </OptionGrid>
      </ContentSection>
    </React.Fragment>
  );
};

TestQuestionsBlock.propTypes = {
  question: PropTypes.object,
  quesIdx: PropTypes.number,
  assessmentId: PropTypes.string,
};

export default TestQuestionsBlock;
