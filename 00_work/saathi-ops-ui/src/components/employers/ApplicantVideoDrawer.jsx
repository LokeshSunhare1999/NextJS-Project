import styled from 'styled-components';
import DisplayDrawer from '../common/DisplayDrawer';
import { zIndexValues } from '../../style';
import IntroVideoModal from '../customerDetails/IntroVideoModal';
import CustomCTA from '../CustomCTA';
import { usePutApplicantStatus } from '../../apis/queryHooks';
import { enqueueSnackbar } from 'notistack';
import RemarksModal from '../common/RemarksModal';
import { ModalContext } from '../../context/ModalProvider';
import { useContext, useState } from 'react';
import Remarks from '../common/Remarks';
import { VERIFICATION_STATUS_MAP } from '../../constants/verification';
import { formatDate } from '../../utils/helper';
import DocumentStatus from '../customerDetails/DocumentStatus';
import { APPLICANT_STATUS_CURRENT_STATES } from '../../constants/jobs';
import RemarkCard from '../common/RemarkCard';

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

const ContentGrid = styled.div`
  display: flex;
  flex-direction: column;
`;

const GridItem = styled.div`
  display: flex;
`;

const StyledRow = styled.div`
  display: flex;
  width: 100%;
  //   margin: 20px 10px;
  padding: 20px 40px;
  gap: 40px;
  justify-content: center;
  & > * {
    flex: 1; /* Each button takes equal width */
  }
`;

const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  color: #6c757d;
  font-size: 18px;
  font-weight: 500;
  margin: 20px 5px;
`;

const RemarksDiv = styled.div`
  margin: 20px;
  padding: 10px;
  background: #ffffff;
  border-radius: 10px;
`;

const RemarksContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 10px;
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  color: ${(props) => (props.color ? props.color : '#000000')};
  margin: ${(props) => (props.$margin ? props.$margin : '0px')};
`;

const FlexContainer = styled.div`
  font-family: Poppins;
  width: 100%;
  display: flex;
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: 8px;
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  padding: 5px 0px;
`;

const ApplicantVideoDrawer = ({
  open,
  toggleDrawer,
  headerTitle,
  videoLink,
  applicationStatus,
  applicantId,
  type,
  refetchApplicantData,
  remarks,
  showRemarksSection,
}) => {
  const { mutateAsync: updateStatus } = usePutApplicantStatus(applicantId);
  const [showRemarks, setShowRemarks] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState(false);

  const handleUpdateStatus = async (message, customProps = {}) => {
    updateStatus({
      status: customProps?.status,
      remarks: {
        message,
      },
    }).then((res) => {
      refetchApplicantData();
      enqueueSnackbar('Status successfully changed', { variant: 'success' });
    });
    toggleDrawer();
  };

  const handleStatusClick = (status) => {
    setShowRemarks(true);
    setSelectedStatus(status);
  };
  const showAcceptBtn =
    applicationStatus !== 'INTERVIEW_REJECTED' &&
    applicationStatus !== 'SCREENING_REJECTED';
  const showRejectBtn =
    applicationStatus !== 'SHORTLISTED' && applicationStatus !== 'HIRED';
  const headerContent = () => {
    return (
      <StyledHeader
        $fontSize="24px"
        $lineHeight="45px"
        $fontWeight="600"
        $color="#000"
      >
        {headerTitle}
      </StyledHeader>
    );
  };

  const handleCloseDrawer = () => {
    toggleDrawer();
  };

  return (
    <DisplayDrawer
      open={open}
      handleCloseDrawer={handleCloseDrawer}
      width="500px"
      showCancelCta={false}
      headerContent={headerContent}
      zIndex={zIndexValues.VIEW_APPLICANT_VIDEO_DRAWER}
    >
      <ContentGrid>
        {videoLink ? (
          <>
            <GridItem>
              <IntroVideoModal modalTitle=" " videoLink={videoLink} />
            </GridItem>
            {showRemarksSection ? (
              <>
                <GridItem>
                  <StyledRow>
                    {showRejectBtn && (
                      <CustomCTA
                        title="Rejected"
                        color="#ED2F2F"
                        bgColor="#FFF"
                        border="1px solid #ED2F2F"
                        buttonWidth="180px"
                        disabled={
                          applicationStatus === 'SCREENING_REJECTED' ||
                          applicationStatus === 'INTERVIEW_REJECTED'
                        }
                        disabledBgColor="#FFE5E5"
                        onClick={() =>
                          handleStatusClick(
                            type === 'INTERVIEW_VIDEO'
                              ? 'INTERVIEW_REJECTED'
                              : 'SCREENING_REJECTED',
                          )
                        }
                      />
                    )}

                    {showAcceptBtn && (
                      <CustomCTA
                        title={
                          type === 'INTERVIEW_VIDEO'
                            ? 'Finalised'
                            : 'Shortlisted'
                        }
                        color="#FFF"
                        bgColor="#32B237"
                        border="1px solid #CDD4DF"
                        buttonWidth="180px"
                        disabled={
                          applicationStatus === 'SHORTLISTED' ||
                          applicationStatus === 'HIRED'
                        }
                        disabledBgColor="#A0D2A2"
                        onClick={() =>
                          handleStatusClick(
                            type === 'INTERVIEW_VIDEO'
                              ? 'HIRED'
                              : 'SHORTLISTED',
                          )
                        }
                      />
                    )}
                  </StyledRow>
                </GridItem>

                {showRemarks ? (
                  <RemarksDiv>
                    <RemarksModal
                      showHeading={false}
                      showSubheading={true}
                      subheading="Add Remarks"
                      showText={false}
                      showCancelCta={false}
                      primaryCtaText="Save Comment"
                      showCloseIcon={true}
                      isLoading={false}
                      onSubmit={handleUpdateStatus}
                      customProps={{ status: selectedStatus }}
                    />
                  </RemarksDiv>
                ) : (
                  <RemarksContainer>
                    <P $fontWeight={'500'}>Employer Comments</P>
                    <FlexContainer $flexDirection="column">
                      {remarks?.length > 0 ? (
                        remarks?.map((remark) => (
                          <RemarkCard
                            key={remark?._id}
                            remark={remark}
                            statusMap={APPLICANT_STATUS_CURRENT_STATES}
                            showDate={false}
                          />
                        ))
                      ) : (
                        <P
                          $fontSize={'14px'}
                          $fontWeight={'400'}
                          $lineHeight={'normal'}
                        >
                          {'No Remarks Added'}
                        </P>
                      )}
                    </FlexContainer>
                  </RemarksContainer>
                )}
              </>
            ) : null}
          </>
        ) : (
          <Wrapper>Video not available </Wrapper>
        )}
      </ContentGrid>
    </DisplayDrawer>
  );
};

export default ApplicantVideoDrawer;
