import React, { Suspense, useEffect, useState } from 'react';
import styled from 'styled-components';
import styleComponents from '../style/pageStyle';
import {
  useNavigate,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import ICONS from '../assets/icons';
import JobPostBasicDetailsForm from '../components/employers/JobPostBasicDetailsForm';
import CustomerPageHeader from '../components/customerDetails/CustomerPageHeader';
import JobPostRequirementDetailsForm from '../components/employers/JobPostRequirementDetailsForm';
import JobPostInfoSection from '../components/employers/JobPostInfoSection';
import CustomCTA from '../components/CustomCTA';
import useJobPostForm from '../hooks/employer/useJobPostForm';
import {
  useGetJobById,
  usePostAddJob,
  usePutAddJob,
  useGetTrueIdStaticData,
} from '../apis/queryHooks';
import { useSnackbar } from 'notistack';
import ConfirmationPop from '../components/ConfirmationPop';
const { Top } = styleComponents();

const Wrapper = styled.div`
  margin: 61px 0 0 265px;
  min-height: calc(100vh - 3.5rem);
  background-color: #f4f6fa;
  padding: 16px 40px;
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

const WrapperCTA = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  flex-direction: row;
  justify-content: end;
  align-items: center;
`;
const PostNewJob = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { employerId, jobId: jobIdFromParams } = useParams();
  const [searchParams] = useSearchParams();
  const agencyType = searchParams.get('agencyType');
  const [jobId, setJobId] = useState();
  const isEditJobPage = location.pathname.includes('edit-job');
  const isEditMode = Boolean(jobId);
  const { employerName } = location?.state || {};
  const { enqueueSnackbar } = useSnackbar();
  const { data: jobData } = useGetJobById(jobId);
  const { data: trueIdStaticData } = useGetTrueIdStaticData();

  const educationQualificationList =
    trueIdStaticData?.metaData?.educationOptions;

  const { mutateAsync: addAddJobMutation, status: addJobStatus } =
    usePostAddJob();
  const { mutateAsync: editJobMutation, status: editJobStatus } =
    usePutAddJob();
  const [openCancelPop, setOpenCancelPop] = useState(false);
  const {
    jobDetails,
    setJobDetails,
    errors,
    setErrors,
    selectedPill,
    setSelectedPill,
    selectedGenders,
    setSelectedGenders,
    validateForm,
    getFormattedPayload,
    jobCategories,
  } = useJobPostForm(
    isEditMode,
    jobData,
    agencyType,
    educationQualificationList,
  );

  if (
    (jobData?.status === 'PUBLISHED' || jobData?.status === 'EXPIRED') &&
    isEditJobPage
  ) {
    navigate(`/job/${jobId}`);
  }

  useEffect(() => {
    if (isEditJobPage) {
      setJobId(jobIdFromParams);
      return;
    }
    setJobId(sessionStorage?.getItem('jobId'));
  }, []);

  const handleLeftArrow = () => {
    navigate(-1);
  };

  const handleClickNext = async () => {
    if (validateForm()) {
      const payload = getFormattedPayload(employerId, jobId);

      try {
        if (isEditMode) {
          await editJobMutation(payload);
          sessionStorage?.setItem('jobId', jobId);
          navigate(`/job-video-upload/${jobId}`);
        } else {
          const response = await addAddJobMutation(payload);
          sessionStorage?.setItem('jobId', response._id);
          navigate(`/job-video-upload/${response._id}`);
        }
      } catch (error) {
        enqueueSnackbar('Error saving job', { variant: 'error' });
      }
    }
  };

  const handleCancel = () => {
    setOpenCancelPop(true);
  };

  return (
    <Wrapper>
      <Top>
        <Header>
          <WhiteBox onClick={handleLeftArrow}>
            <Img
              src={ICONS.LEFT_ARROW_BLACK}
              alt="leftArrowBlack"
              width="24px"
              height="24px"
            />
          </WhiteBox>
        </Header>
        <HeaderWrap>
          <CustomerPageHeader
            heading={isEditJobPage ? 'Edit Job' : 'Post a New Job'}
          />
        </HeaderWrap>
        <JobPostBasicDetailsForm
          employerName={
            employerName || jobData?.employer?.companyRegisteredName
          }
          title="Job details"
          jobCategories={jobCategories}
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
          selectedPill={selectedPill}
          setSelectedPill={setSelectedPill}
          agencyType={agencyType}
          jobId={jobId}
          errors={errors}
          setErrors={setErrors}
        />
        <JobPostInfoSection
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
          errors={errors}
          setErrors={setErrors}
          educationQualificationList={educationQualificationList}
        />
        <JobPostRequirementDetailsForm
          jobDetails={jobDetails}
          setJobDetails={setJobDetails}
          selectedGenders={selectedGenders}
          setSelectedGenders={setSelectedGenders}
          errors={errors}
          setErrors={setErrors}
        />
      </Top>

      <WrapperCTA>
        {isEditJobPage ? (
          <CustomCTA
            onClick={handleCancel}
            title="Cancel"
            color="#586275"
            bgColor="#fff"
            border="1px solid #CDD4DF"
          />
        ) : null}
        <CustomCTA
          onClick={handleClickNext}
          disabled={addJobStatus === 'pending' || editJobStatus === 'pending'}
          title={isEditJobPage ? 'Update' : 'Next'}
          color="#fff"
          bgColor="#141482"
          border="1px solid #141482"
        />
      </WrapperCTA>
      {openCancelPop ? (
        <Suspense fallback={<div></div>}>
          <ConfirmationPop
            setOpenConfirmationPop={setOpenCancelPop}
            title={'Update Job'}
            heading={'Discard changes? All unsaved data will be lost.'}
            handleSubmit={() => navigate(`/job/${jobId}`)}
          />
        </Suspense>
      ) : (
        ''
      )}
    </Wrapper>
  );
};

export default PostNewJob;
