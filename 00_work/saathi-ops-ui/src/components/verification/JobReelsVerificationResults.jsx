import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import VideoPlayer from '../common/VideoPlayer';
import JobReelRatings from './JobReelRatings';
import CustomCTA from '../CustomCTA';
import { useNavigate } from 'react-router-dom';
import JobReelChecks from './JobReelChecks';
import { CATEGORY_KNOWLEDGE_MAP, RATING_CHECKS } from '../../constants';
import { usePutUpdateCustomerProfile } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import { axiosFetch } from '../../utils/helper';
import { JOB_REEL_PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';

const Wrapper = styled.div`
  background-color: #ffffff;
  width: 100%;
  font-family: Poppins;
  padding: 8px 20px;
  margin: 20px;
  border-radius: 10px;
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
  align-items: flex-start;
  height: 80vh;
`;

const FormContainer = styled.div`
  flex: 1;
  min-width: 0;
  margin-right: 20px;
  height: 100%;
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  border-bottom: 1px solid #f1f1f1;
  border-radius: 10px;
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  padding: ${(props) => props.$padding};
`;
const VideoModal = styled.div`
  width: 30%;
  flex-shrink: 0;
  max-height: calc(100vh - 200px);
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;
const BorderLine = styled.div`
  border-bottom: 1px solid #f1f1f1;
`;
const StyledSpan = styled.span`
  color: ${(props) => props?.$color};
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
  margin-left: 4px;
`;

const FooterContainer = styled.div`
  padding: 0px 20px 20px 0;
  height: 40px;
  display: flex;
  justify-content: flex-end;
  gap: 20px;
`;

const initialReelChecks = {
  name: '',
  gender: null,
  age: null,
  location: {},
  preferredLocation: {},
  yoe: 0,
  expType: [],
  expTypeOther: '',
  skillCategory: [],
  skillCategoryOther: '',
  preferredJobType: [],
  preferredJobTypeOther: '',
  categoryKnowledge: null,
  minSalary: 0,
  maxSalary: 0,
  availability: '',
  openToRelocation: false,
  workFromHomePreference: false,
  customRejectedMessage: null,
};
const yesNoGroup = [
  { key: 'yes', value: 'Yes', checked: false },
  { key: 'no', value: 'No', checked: false },
];
const availabilityGroup = [
  { key: 'NOT_ANSWERED', value: 'Not Answered', checked: false },
  { key: 'IMMEDIATE', value: 'Immediately', checked: false },
  { key: 'WITH_IN_A_WEEK', value: 'Within a week', checked: false },
  { key: 'WITH_IN_A_MONTH', value: 'Within a month', checked: false },
  { key: 'MORE_THAN_A_MONTH', value: 'More than a month', checked: false },
];
const genderGroup = [
  { key: 'MALE', value: 'Male', checked: false },
  { key: 'FEMALE', value: 'Female', checked: false },
];
const preferredLocationGroup = [
  { key: 'openToRelocation', value: 'Open to Relocation', checked: false },
  { key: 'workFromHomePreference', value: 'Work From Home', checked: false },
];

const JobReelsVerificationResults = ({
  customerProfileData,
  setShowJobReelPage,
  customerId,
  jobReelKey,
  autoSuggestedJobreelData,
}) => {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { hasPermission } = usePermission();
  const videoLink = customerProfileData?.customerBioDataVideo;

  const [errors, setErrors] = useState({});
  const [selectedRatings, setSelectedRatings] = useState({});
  const [reelChecks, setReelChecks] = useState(initialReelChecks);
  const [mergedVideoLink, setMergedVideoLink] = useState({});
  const [checkboxGroups, setCheckboxGroups] = useState(
    Object.fromEntries(
      [
        'nudity',
        'vulgarity',
        'noVideo',
        'noAudio',
        'improperPosture',
        'customRejected',
        'customRejectedMessage',
        'name',
        'gender',
        'age',
        'location',
        'preferredLocation',
        'yoe',
        'expType',
        'skillCategory',
        'preferredJobType',
        'categoryKnowledge',
        'salary',
        'preferredLocationOptions',
        'openToRelocation',
        'workFromHomePreference',
      ]
        .map((key) => [key, [...yesNoGroup]])
        .concat([['availability', [...availabilityGroup]]])
        .concat([['gender', [...genderGroup]]])
        .concat([['preferredLocationOptions', [...preferredLocationGroup]]]),
    ),
  );
  const nudityYes = checkboxGroups.nudity?.some(
    (opt) => opt.key === 'yes' && opt.checked,
  );
  const badLangYes = checkboxGroups.vulgarity?.some(
    (opt) => opt.key === 'yes' && opt.checked,
  );
  const noVideoYes = checkboxGroups.noVideo?.some(
    (opt) => opt.key === 'yes' && opt.checked,
  );
  const noAudioYes = checkboxGroups.noAudio?.some(
    (opt) => opt.key === 'yes' && opt.checked,
  );
  const improperPostureYes = checkboxGroups.improperPosture?.some(
    (opt) => opt.key === 'yes' && opt.checked,
  );
  const customRejectedYes = checkboxGroups.customRejected?.some(
    (opt) => opt.key === 'yes' && opt.checked,
  );
  const nameYes = checkboxGroups.name?.some(
    (opt) => opt.key === 'yes' && opt.checked,
  );
  const shouldHideRest =
    nudityYes ||
    badLangYes ||
    noAudioYes ||
    improperPostureYes ||
    customRejectedYes;

  const {
    mutateAsync: updateCustomerMutation,
    status: updateCustomerStatus,
    isError: isUpdateCustomerProfileErr,
    error: updateCustomerProfileErr,
  } = usePutUpdateCustomerProfile();
  useEffect(() => {
    if (updateCustomerStatus === 'success') {
      enqueueSnackbar('Customer profile updated successfully!', {
        variant: 'success',
      });

      handleCloseClick();
    } else if (updateCustomerStatus === 'error') {
      enqueueSnackbar(`Failed to update profile.`, {
        variant: 'error',
      });
    }
  }, [updateCustomerStatus]);

  useEffect(() => {
    if (videoLink && hasPermission(JOB_REEL_PERMISSIONS?.VIEW_MERGE_REEL)) {
      const convertedUrl = videoLink.replace(
        'hodor-job-reel',
        'hodor-merge-job-reel',
      );
      axiosFetch('get', convertedUrl, null, {}, {}, null, false).then((res) => {
        setMergedVideoLink({
          videoLink: convertedUrl,
          status: res?.status,
        });
      });
    }
  }, [videoLink]);
  const handleCloseClick = () => {
    setShowJobReelPage(false);
    navigate(-1);
  };

  const generatePayload = () => {
    const key = jobReelKey
      ? 'updatedCustomerBioDataVideoVerificationMetaData'
      : 'customerBioDataVideoVerificationMetaData';

    const filteredExpType = (reelChecks.expType || []).filter(
      (item) => item.toLowerCase() !== 'others',
    );

    const filteredSkillCategory = (reelChecks.skillCategory || []).filter(
      (item) => item.toLowerCase() !== 'others',
    );

    const filteredPreferredJobType = (reelChecks.preferredJobType || []).filter(
      (item) => item.toLowerCase() !== 'others',
    );

    const payload = {
      customerId,
      [key]: {
        nudity:
          checkboxGroups.nudity.find((item) => item.checked)?.value === 'Yes',
        badLanguage:
          checkboxGroups.vulgarity.find((item) => item.checked)?.value ===
          'Yes',
        isVideoNotPresent:
          checkboxGroups.noVideo.find((item) => item.checked)?.value === 'Yes',
        isAudioNotPresent:
          checkboxGroups.noAudio.find((item) => item.checked)?.value === 'Yes',
        improperPosture:
          checkboxGroups.improperPosture.find((item) => item.checked)?.value ===
          'Yes',
        customRejected:
          checkboxGroups.customRejected.find((item) => item.checked)?.value ===
          'Yes',
        customRejectedMessage: reelChecks.customRejectedMessage,
        name: reelChecks.name || '',
        gender: reelChecks.gender || '',
        age: reelChecks.age,
        userLocation: reelChecks.location || {},
        preferredJobLocation: reelChecks.preferredLocation || {},
        noOfYearExperience: reelChecks.yoe || 0,
        experienceFields: filteredExpType,
        otherExperienceFields: reelChecks.expTypeOther || '',
        skills: filteredSkillCategory,
        otherSkills: reelChecks.skillCategoryOther || '',
        categoryKnowledge: reelChecks.categoryKnowledge || 0,
        salaryExpectation: {
          minSalary: reelChecks.minSalary || 0,
          maxSalary: reelChecks.maxSalary || 0,
        },
        videoVisibility: selectedRatings.videoVisibility || 0,
        audioClarity: selectedRatings.audioClarity || 0,
        speakingFluency: selectedRatings.speakingFluency || 0,
        attire: selectedRatings.attire || 0,
        cameraStability: selectedRatings.cameraStability || 0,
        preferredJobTypes: filteredPreferredJobType,
        otherPreferredJobTypes: reelChecks.preferredJobTypeOther || '',
        availability: reelChecks.availability || '',
        openToRelocation: reelChecks.openToRelocation,
        workFromHomePreference: reelChecks.workFromHomePreference,
      },
    };

    return payload;
  };

  const validateForm = () => {
    const newErrors = {};
    const age = reelChecks.age && Number(reelChecks.age);

    Object.keys(checkboxGroups).forEach((groupKey) => {
      const group = checkboxGroups[groupKey];
      const isChecked = group.some((item) => item.checked);
      if (
        !isChecked &&
        (groupKey === 'nudity' ||
          groupKey === 'vulgarity' ||
          groupKey === 'noAudio' ||
          groupKey === 'improperPosture' ||
          groupKey === 'customRejected' ||
          ((groupKey === 'gender' || groupKey === 'name') && !shouldHideRest))
      ) {
        newErrors[groupKey] = '* Please select an option';
      }
    });

    if (isNaN(age) || age === 0 || age > 100) {
      newErrors.age = 'Invalid age. Please enter a value between 1 and 100.';
    }

    if (customRejectedYes && !reelChecks?.customRejectedMessage) {
      newErrors.customRejected = 'Please provide a reason for rejection';
    }

    if (nameYes && reelChecks.name === '') {
      newErrors.name = 'Enter Name';
    }

    const min = Number(reelChecks.minSalary);
    const max = Number(reelChecks.maxSalary);
    if (min > max) {
      newErrors.salary = 'Minimum salary should less than maximum salary';
    }
    if (!shouldHideRest) {
      RATING_CHECKS.forEach(({ key }) => {
        if (selectedRatings[key] === undefined) {
          newErrors[key] = '* Please select a rating';
        }
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      const payload = generatePayload();
      updateCustomerMutation(payload);
    } else {
      enqueueSnackbar('Please fill all the required fields.', {
        variant: 'error',
      });
    }
  };

  return (
    <>
      <Wrapper>
        {videoLink ? (
          <>
            <ContentContainer>
              <VideoModal>
                {<VideoPlayer videoLink={videoLink} aspectRatio={9 / 16} />}
                <BorderLine />

                {mergedVideoLink?.status === 200 &&
                hasPermission(JOB_REEL_PERMISSIONS?.VIEW_MERGE_REEL) ? (
                  <>
                    <P>Merged Reel(for reference)</P>
                    <VideoPlayer
                      videoLink={mergedVideoLink?.videoLink}
                      aspectRatio={9 / 16}
                    />
                  </>
                ) : null}
              </VideoModal>

              {customerProfileData?.customerBioDataVideoVerificationStatus ===
              'PENDING' ? (
                <FormContainer>
                  <P $fontSize={'16px'} $fontWeight={'600'}>
                    Reel Checks
                    {/* <StyledSpan
                      $fontSize={'16px'}
                      $lineHeight={'24px'}
                      $fontWeight={'400'}
                      $color={'#ED2F2F'}
                    >
                      *
                    </StyledSpan> */}
                  </P>
                  <JobReelChecks
                    reelChecks={reelChecks}
                    setReelChecks={setReelChecks}
                    checkboxGroups={checkboxGroups}
                    setCheckboxGroups={setCheckboxGroups}
                    errors={errors}
                    setErrors={setErrors}
                    shouldHideRest={shouldHideRest}
                    autoSuggestedJobreelData={autoSuggestedJobreelData}
                  />
                  {!shouldHideRest ? (
                    <JobReelRatings
                      selectedRatings={selectedRatings}
                      setSelectedRatings={setSelectedRatings}
                      errors={errors}
                    />
                  ) : null}
                </FormContainer>
              ) : null}
            </ContentContainer>
            {customerProfileData?.customerBioDataVideoVerificationStatus ===
              'PENDING' && (
              <FooterContainer>
                <CustomCTA
                  onClick={handleCloseClick}
                  title={'Cancel'}
                  color={'#586275'}
                  bgColor={'#FFF'}
                  border={'1px solid #CDD4DF'}
                />
                <CustomCTA
                  onClick={handleSubmit}
                  title={'Submit'}
                  color={'#FFF'}
                  bgColor={'#141482'}
                  // isLoading={
                  //   videoUploadStatus === 'pending'
                  // }
                  isLoading={updateCustomerStatus === 'pending'}
                  disabled={updateCustomerStatus === 'pending'}
                  border={'1px solid #CDD4DF'}
                />
              </FooterContainer>
            )}
          </>
        ) : (
          <P $padding={'10px'}>No Reel Available</P>
        )}
      </Wrapper>
    </>
  );
};
export default JobReelsVerificationResults;
