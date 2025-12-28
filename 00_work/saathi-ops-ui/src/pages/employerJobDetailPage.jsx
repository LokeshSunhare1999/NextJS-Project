import React, { Suspense, useState } from 'react';
import DetailsContainer from '../components/atom/tableComponents/DetailsContainer';
import styled from 'styled-components';
import usePermission from '../hooks/usePermission';
import {
  EMPLOYER_MODULE_PERMISSIONS
} from '../constants/permissions';
import styleComponents from '../style/pageStyle';
import ICONS from '../assets/icons';
import CustomerPageHeader from '../components/customerDetails/CustomerPageHeader';
import useJobDetails from '../hooks/employer/useJobDetails';
import JobStatusPageHeader from '../components/employers/JobStatusPageHeader';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useGetJobById, usePutAddJob } from '../apis/queryHooks';
import { agencyType, agencyTypeStyles } from '../constants/employer';
import LogoUpload from '../components/employers/LogoUpload';
import { enqueueSnackbar } from 'notistack';

const { Top } = styleComponents();

const Wrapper = styled.div`
  font-family: 'Poppins';
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
const SubHeading = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin: ${(props) => (props.$margin ? props.$margin : '10px 0px')};
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

const P = styled.p`
  color: ${(props) => (props.$color ? props.$color : '#000')};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;
const CountBox = styled.div`
  padding: 4px 12px;
  border-radius: 25px;
  background-color: #0048ad;
  color: #ffffff;
  font-size: 12px;
  font-family: Poppins, sans-serif;
  cursor: default;
  outline: none;
  transition: all 0.3s ease;
  cursor: pointer;
`;
const FlexWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 8px; /* Reduce the gap between elements */
  flex-wrap: nowrap; /* Prevent wrapping */
`;
const StatusPill = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px 12px;
  border-radius: 12px;
  background-color: ${({ bgColor }) => bgColor || '#f0f0f0'};
  color: ${({ textColor }) => textColor || '#333'};
  font-size: 12px;
  font-weight: 400;
  text-align: center;
  white-space: nowrap;
  user-select: none;
  border: 1px solid ${({ borderColor }) => borderColor || '#dcdcdc'};
  font-family: Poppins;
`;
const CountBoxWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  border-radius: 8px;
  cursor: pointer;
`;
const HeaderWrap = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const EmployerJobDetailPage = () => {
  const { hasPermission } = usePermission();
  const navigate = useNavigate();
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [logoUrl, setLogoUrl] = useState('');

  const { data: jobDetails, refetch: refetchJobDetails } = useGetJobById(jobId);
  const { mutateAsync: editJobMutation, status: editJobStatus } =
    usePutAddJob();

  const { jobBasicDetail } = useJobDetails({
    jobDetails,
  });

  const handleLeftArrow = () => {
    navigate(-1);
  };

  const handleNavigateEditJob = (index) => {
    if (!hasPermission(EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS)) return;

    navigate(
      `/employers/${jobDetails?.employer?._id}/job/${jobId}/edit-job?agencyType=${jobDetails?.employer?.employersAgencyType}`,
    );
  };

  const handleUploadLogo = async (logoUrl) => {
    try {
      await editJobMutation({ jobEmployerLogo: logoUrl, jobId });
    } catch (error) {
      enqueueSnackbar('Error saving job', { variant: 'error' });
    }
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
          <FlexWrapper>
            <CustomerPageHeader
              heading={jobDetails?.employer?.companyRegisteredName ?? '-----'}
              subHeading={`Company ID: ${jobDetails?.employer?.uniqueAgencyId ?? '-----'}`}
            />
            <StatusPill
              bgColor={
                agencyTypeStyles[jobDetails?.employer?.employersAgencyType]
                  ?.bgColor || '#f0f0f0'
              }
              textColor={
                agencyTypeStyles[jobDetails?.employer?.employersAgencyType]
                  ?.textColor || '#333'
              }
              borderColor={
                agencyTypeStyles[jobDetails?.employer?.employersAgencyType]
                  ?.bgColor || '#dcdcdc'
              }
            >
              {agencyType[jobDetails?.employer?.employersAgencyType]}
            </StatusPill>
          </FlexWrapper>
          {jobDetails?.employer.employersAgencyType === 'RECRUITMENT_AGENCY' ? (
            <LogoUpload
              initialIcon={jobDetails?.jobEmployerLogo}
              loadingIcon={ICONS.UPLOADING_LOGO}
              setImage={setLogoUrl}
              imageUrl={logoUrl}
              maxFileSizeInMB={5}
              onUploadFn={(logoUrl) => handleUploadLogo(logoUrl)}
            />
          ) : null}
        </HeaderWrap>
        <Suspense fallback={<div></div>}>
          <SubHeading $margin={'20px 0px 10px 0px'}>
            <JobStatusPageHeader
              jobId={jobId}
              isDropdownOpen={isDropdownOpen}
              setIsDropdownOpen={setIsDropdownOpen}
              jobTitle={jobDetails?.title}
              verificationStatus={jobDetails?.status}
              possibleStates={jobDetails?.nextPossibleStates || []}
              refetchJobDetails={refetchJobDetails}
              employerDetails={jobDetails?.employer}
              jobDetails={jobDetails}
            />
            <CountBoxWrapper
              onClick={() => navigate(`/jobs/${jobId}/applications/`)}
            >
              <P $fontSize={'14px'} $lineHeight={'21px'} $fontWeight={'500'}>
                Applications
              </P>
              <CountBox>
                <P
                  $color={'#FFFFFF'}
                  $fontSize={'14px'}
                  $lineHeight={'21px'}
                  $fontWeight={'400'}
                >
                  {jobDetails?.noOfApplications}
                </P>
              </CountBox>
            </CountBoxWrapper>
          </SubHeading>
        </Suspense>
        <DetailsContainer
          title={''}
          detailsData={jobBasicDetail}
          showEdit={
            hasPermission(
              EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS,
            ) &&
            jobDetails?.status !== 'EXPIRED' &&
            jobDetails?.status !== 'PUBLISHED'
          }
          handleEditClick={handleNavigateEditJob}
        />
      </Top>
    </Wrapper>
  );
};

export default EmployerJobDetailPage;
