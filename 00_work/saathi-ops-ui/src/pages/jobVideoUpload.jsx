import { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import styleComponents from '../style/pageStyle';
import { useNavigate, useParams } from 'react-router-dom';
import ICONS from '../assets/icons';
import FileUpload from '../components/courses/FileUpload';
import {
  FILE_TYPES,
  MAX_DOC_IMAGE_FILE_SIZE_MB,
  MAX_VIDEO_API_TIMER,
} from '../constants';

import useFileUpload from '../hooks/useFileUpload';
import { generateUploadFilePath } from '../utils/helper';
import CustomCTA from '../components/CustomCTA';
import { ModalContext } from '../context/ModalProvider';
import IntroVideoModal from '../components/customerDetails/IntroVideoModal';
import { useGetJobById, usePutAddJob } from '../apis/queryHooks';
import { useSnackbar } from 'notistack';
import {
  MAX_JOB_VIDEO_FILE_DURATION_SEC,
  MAX_JOB_VIDEO_FILE_SIZE_MB,
  MAX_JOB_DOC_FILE_SIZE_MB,
} from '../constants/employer';
import { PROMPT_SAMPLE_CSV, INTERVIEW_SAMPLE_CSV } from '../constants/job';

const { Top } = styleComponents();

const Wrapper = styled.div`
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: 16px 40px;
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  margin-top: ${(props) => props.$marginTop || '0px'};
`;

const Header = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const HeaderWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const WhiteBox = styled.div`
  display: inline-flex;
  padding: 10px;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  background: #fff;
  cursor: pointer;
`;

const Img = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const StyledDiv = styled.div`
  margin-top: ${(props) => props.$marginTop || '20px'};
`;
const DocDiv = styled.div`
  display: flex;
  flex-direction: column;
`;

const StyledLink = styled.div`
  text-decoration: underline;
  color: #141482;
  font-family: Poppins;
  font-size: 14px;
  cursor: pointer;
`;

const StyledSpan = styled.span`
  font-size: 12px;
  font-weight: 400;
  color: ${(props) => props.$color || '#000'};
  font-family: Poppins;
  margin-top: 20px;
  display: block;
`;

const JobVideoUpload = () => {
  const navigate = useNavigate();
  const { jobId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { displayModal } = useContext(ModalContext);
  const [tempVideoDelete, setTempVideoDelete] = useState(false);
  const [tempQuestionDelete, setTempQuestionDelete] = useState(false);
  const [tempPromptDelete, setTempPromptDelete] = useState(false);
  const [jobVideoUrl, setJobVideoUrl] = useState('');
  const [questionDocUrl, setQuestionDocUrl] = useState('');
  const [promptDocUrl, setPromptDocUrl] = useState('');

  const { mutateAsync: addJobMutation, status: addJobStatus } = usePutAddJob();

  const { data: jobData } = useGetJobById(jobId);

  const {
    fileData: videoFileData,
    setFileData: setVideoFileData,
    handleInputChange: handleVideoInputChange,
    abortUpload: abortVideoUpload,
    fileSizeError: videoFileSizeError,
    fileDurationError: videoFileDurationError,
    data: videoUploadData,
    resetFileData: resetVideoFileData,
    status: videoUploadStatus,
  } = useFileUpload(
    generateUploadFilePath('JOB', `${jobId}`, FILE_TYPES?.VIDEO),
    FILE_TYPES?.VIDEO?.toUpperCase(),
    MAX_JOB_VIDEO_FILE_SIZE_MB,
    null,
    MAX_JOB_VIDEO_FILE_DURATION_SEC,
  );
  const {
    fileData: questionFileData,
    setFileData: setQuestionFileData,
    handleInputChange: handleQuestionInputChange,
    abortUpload: abortQuestionUpload,
    fileSizeError: questionFileSizeError,
    data: questionUploadData,
    resetFileData: resetQuestionFileData,
    status: questionUploadStatus,
  } = useFileUpload(
    generateUploadFilePath('JOB_QUESTION', `${jobId}`, FILE_TYPES?.DOCUMENT),
    FILE_TYPES?.DOCUMENT?.toUpperCase(),
    MAX_JOB_DOC_FILE_SIZE_MB,
  );
  const {
    fileData: promptFileData,
    setFileData: setPromptFileData,
    handleInputChange: handlePromptInputChange,
    abortUpload: abortPromptUpload,
    fileSizeError: promptFileSizeError,
    data: propmtUploadData,
    resetFileData: resetPromptFileData,
    status: promptUploadStatus,
  } = useFileUpload(
    generateUploadFilePath('JOB_PROMPT', `${jobId}`, FILE_TYPES?.DOCUMENT),
    FILE_TYPES?.DOCUMENT?.toUpperCase(),
    MAX_JOB_DOC_FILE_SIZE_MB,
  );

  useEffect(() => {
    if (
      jobData?.video ||
      jobData?.interviewPromptUrl ||
      jobData?.interviewQuestionUrl
    ) {
      setJobVideoUrl(jobData?.video);
      setPromptDocUrl(jobData?.interviewPromptUrl);
      setQuestionDocUrl(jobData?.interviewQuestionUrl);
    } else {
      setJobVideoUrl('');
      setPromptDocUrl('');
      setQuestionDocUrl('');
    }
  }, [jobData]);

  useEffect(() => {
    if (tempVideoDelete) {
      setJobVideoUrl('');
    }
    if (tempPromptDelete) {
      setPromptDocUrl('');
    }
    if (tempQuestionDelete) {
      setQuestionDocUrl('');
    }
  }, [tempVideoDelete, tempPromptDelete, tempQuestionDelete]);

  useEffect(() => {
    if (videoUploadStatus === 'success') {
      setTempVideoDelete(false);
    }
    if (questionUploadStatus === 'success') {
      setTempQuestionDelete(false);
    }
    if (promptUploadStatus === 'success') {
      setTempPromptDelete(false);
    }
  }, [videoUploadStatus, questionUploadStatus, promptUploadStatus]);

  const handleInputDelete = (type) => {
    if (type === FILE_TYPES?.VIDEO) {
      resetVideoFileData();
    }
  };

  const handleDocumentDelete = (type) => {
    if (type === 'question') {
      resetQuestionFileData();
    } else if (type === 'prompt') {
      resetPromptFileData();
    }
  };

  const openVideoPlayer = (e, videoLink) => {
    e.stopPropagation();
    displayModal(
      <IntroVideoModal
        modalTitle="Job Video"
        aspectRatio="9/16"
        videoLink={videoLink}
      />,
      {
        modalWidth: '300px',
      },
    );
  };

  const handleCreateJobClick = () => {
    const data = {
      jobId: jobId,
      video: videoUploadData?.fileLink,
      interviewQuestionUrl: questionUploadData?.fileLink,
      interviewPromptUrl: propmtUploadData?.fileLink,
    };
    addJobMutation(data)
      .then((res) => {
        navigate(`/job/${jobId}`);
      })
      .catch((err) => {
        enqueueSnackbar('Error saving job', { variant: 'error' });
      });
  };
  const handleLeftArrow = () => {
    navigate(-1);
  };

  const handleCreateJobEnable = () => {
    return (
      (!videoFileData?.fileName && !jobVideoUrl) ||
      videoUploadStatus === 'pending'
      // (!questionFileData?.fileName && !questionDocUrl) ||
      // questionUploadStatus === 'pending' ||
      // (!promptFileData?.fileName && !promptDocUrl) ||
      // promptUploadStatus === 'pending'
    );
  };

  const handleShowButtonTitle = () => {
    return jobData?.video ||
      jobData?.interviewPromptUrl ||
      jobData?.interviewQuestionUrl
      ? 'Update Job'
      : 'Create Job';
  };

  return (
    <Wrapper>
      <Top>
        <Header>
          <WhiteBox onClick={() => handleLeftArrow()}>
            <Img
              src={ICONS.LEFT_ARROW_BLACK}
              alt="leftArrowBlack"
              width={'24px'}
              height={'24px'}
            />
          </WhiteBox>
        </Header>
        <HeaderWrap>
          <P
            $fontSize={'24px'}
            $fontWeight={'600'}
            $lineHeight={'normal'}
            $marginTop="20px"
          >
            Upload Job Documents - {jobData?.title}
          </P>
        </HeaderWrap>
      </Top>
      <P
        $fontSize={'16px'}
        $fontWeight={'600'}
        $lineHeight={'normal'}
        $marginTop="20px"
      >
        Upload Video
      </P>
      <StyledDiv $marginTop="30px">
        <FileUpload
          fileData={videoFileData}
          fileType={FILE_TYPES?.VIDEO}
          iconUrl={ICONS?.VIDEO_CAMERA_BLUE}
          uploadTitle={'Upload Video'}
          acceptType={'video/mp4, video/quicktime'}
          handleInputChange={(e) =>
            handleVideoInputChange(e, FILE_TYPES?.VIDEO)
          }
          uploadData={jobVideoUrl}
          handleInputDelete={handleInputDelete}
          abortUpload={abortVideoUpload}
          maxApiTimer={MAX_VIDEO_API_TIMER}
          tempDelete={tempVideoDelete}
          setTempDelete={setTempVideoDelete}
        />
        {(videoFileData?.fileName && videoUploadStatus === 'success') ||
        jobVideoUrl ? (
          <StyledDiv $marginTop="20px">
            <StyledLink
              onClick={(e) =>
                openVideoPlayer(e, videoUploadData?.fileLink || jobVideoUrl)
              }
            >
              View Video
            </StyledLink>
          </StyledDiv>
        ) : (
          <StyledSpan>
            Supported Format : MP4/MOV (Max size {MAX_JOB_VIDEO_FILE_SIZE_MB}MB)
          </StyledSpan>
        )}
      </StyledDiv>

      {videoFileSizeError ? (
        <StyledSpan $color="red">
          File size should be less than {MAX_JOB_VIDEO_FILE_SIZE_MB}MB
        </StyledSpan>
      ) : null}
      {videoFileDurationError ? (
        <StyledSpan $color="red">
          File duration should be less than {MAX_JOB_VIDEO_FILE_DURATION_SEC}{' '}
          Seconds
        </StyledSpan>
      ) : null}

      {/* <P
        $fontSize={'16px'}
        $fontWeight={'600'}
        $lineHeight={'normal'}
        $marginTop="20px"
      >
        Interview Question Sheet
      </P>
      <DocDiv>
        <StyledDiv $marginTop="30px">
          <FileUpload
            fileData={questionFileData}
            fileType={FILE_TYPES?.DOCUMENT}
            iconUrl={ICONS?.UPLOADFILE}
            uploadTitle={'Upload Document'}
            acceptType={'text/csv, .xls, .xlsx'}
            handleInputChange={(e) =>
              handleQuestionInputChange(e, FILE_TYPES?.DOCUMENT)
            }
            uploadData={questionDocUrl}
            handleInputDelete={() => handleDocumentDelete('question')}
            abortUpload={abortQuestionUpload}
            maxApiTimer={MAX_DOC_IMAGE_FILE_SIZE_MB}
            tempDelete={tempQuestionDelete}
            setTempDelete={setTempQuestionDelete}
          />
        </StyledDiv>
        {(questionFileData?.fileName && questionUploadStatus === 'success') ||
        questionDocUrl ? (
          <StyledDiv>
            <StyledLink
              onClick={() => window?.open(questionUploadData?.fileLink)}
            >
              View Interview Question Sheet
            </StyledLink>
          </StyledDiv>
        ) : (
          <StyledDiv $marginTop="0px">
            <StyledSpan>
              Supported Format : XLS/CSV (Max size {MAX_JOB_DOC_FILE_SIZE_MB}MB)
            </StyledSpan>

            <StyledLink onClick={() => window?.open(INTERVIEW_SAMPLE_CSV)}>
              View sample
            </StyledLink>
          </StyledDiv>
        )}
        {questionFileSizeError ? (
          <StyledSpan $color="red">
            File size should be less than {MAX_JOB_DOC_FILE_SIZE_MB}MB
          </StyledSpan>
        ) : null}
      </DocDiv>

      <P
        $fontSize={'16px'}
        $fontWeight={'600'}
        $lineHeight={'normal'}
        $marginTop="20px"
      >
        Prompt/Script Sheet{' '}
      </P>
      <DocDiv>
        <StyledDiv $marginTop="30px">
          <FileUpload
            fileData={promptFileData}
            fileType={FILE_TYPES?.DOCUMENT}
            iconUrl={ICONS?.UPLOADFILE}
            uploadTitle={'Upload Document'}
            acceptType={'text/csv,.xls, .xlsx'}
            handleInputChange={(e) =>
              handlePromptInputChange(e, FILE_TYPES?.DOCUMENT)
            }
            uploadData={promptDocUrl}
            handleInputDelete={() => handleDocumentDelete('prompt')}
            abortUpload={abortPromptUpload}
            maxApiTimer={MAX_DOC_IMAGE_FILE_SIZE_MB}
            tempDelete={tempPromptDelete}
            setTempDelete={setTempPromptDelete}
          />
        </StyledDiv>
        {(promptFileData?.fileName && promptUploadStatus === 'success') ||
        promptDocUrl ? (
          <StyledDiv $marginTop="10px">
            <StyledLink
              onClick={() => window?.open(propmtUploadData?.fileLink)}
            >
              View Prompt/Script Sheet
            </StyledLink>
          </StyledDiv>
        ) : (
          <StyledDiv $marginTop="0px">
            <StyledSpan>
              Supported Format : XLS/CSV (Max size {MAX_JOB_DOC_FILE_SIZE_MB}{' '}
              MB)
            </StyledSpan>
            <StyledLink onClick={() => window?.open(PROMPT_SAMPLE_CSV)}>
              View sample
            </StyledLink>
          </StyledDiv>
        )}
        {promptFileSizeError ? (
          <StyledSpan $color="red">
            File size should be less than {MAX_JOB_DOC_FILE_SIZE_MB}MB
          </StyledSpan>
        ) : null}
      </DocDiv> */}

      <StyledDiv>
        <CustomCTA
          onClick={() => handleCreateJobClick()}
          disabled={handleCreateJobEnable()}
          title={handleShowButtonTitle()}
          showSecondary={true}
          color="#ffffff"
          bgColor={'#141482'}
          border={'1px solid #CDD4DF'}
        />
      </StyledDiv>
    </Wrapper>
  );
};

export default JobVideoUpload;
