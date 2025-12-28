import React, { useContext, useState } from 'react';
import ApplicantStatusDropdown from './ApplicantStatusDropdown';
import styled from 'styled-components';
import { usePutApplicantStatus } from '../../apis/queryHooks';
import RemarksModal from '../common/RemarksModal';
import { ModalContext } from '../../context/ModalProvider';
import { useSnackbar } from 'notistack';
import { findKeyByValue } from '../../utils/helper';
import { useParams } from 'react-router-dom';
import { APPLICANT_STATUS_CURRENT_STATES } from '../../constants/jobs';

const Wrapper = styled.div`
  background-color: white;
  padding: 10px;
  border-radius: 10px;
  margin-top: 20px;
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
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;
const P = styled.p`
  white-space: nowrap;
  color: ${(props) => props?.$color};
  font-family: Poppins;
  font-size: ${(props) => (props?.$fontSize ? props.$fontSize : '14px')};
  font-style: normal;
  font-weight: ${(props) => props?.$fontWeight};
  line-height: ${(props) => props?.$lineHeight};
`;

const UpdateStatusBar = ({
  statusDetails,
  refetchApplicantData,
  employerDetails,
}) => {
  const { displayModal } = useContext(ModalContext);
  const { enqueueSnackbar } = useSnackbar();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { applicantId } = useParams();
  const { mutateAsync: updateStatus } = usePutApplicantStatus(applicantId);

  const dropdownList = statusDetails?.nextPossibleStates?.map(
    (item) => APPLICANT_STATUS_CURRENT_STATES?.[item],
  );
  const handleStatusSelect = (status) => {
    handleStatusClick(status);
    setIsDropdownOpen(false);
  };

  const handleUpdateStatus = async (message, customProps = {}) => {
    updateStatus({
      status: customProps?.status,
      remarks: {
        message,
      },
    })
      .then((res) => {
        refetchApplicantData();
        enqueueSnackbar('Status successfully changed', { variant: 'success' });
      })
      .catch((error) => {
        if (error?.response?.data?.error?.message) {
          enqueueSnackbar(error.response.data.error.message, {
            variant: 'error',
          });
        } else {
          enqueueSnackbar('Something went wrong', {
            variant: 'error',
          });
        }
      });
  };

  const handleStatusClick = (status) => {
    displayModal(
      <RemarksModal
        showCloseIcon
        isLoading={false}
        onSubmit={handleUpdateStatus}
        customProps={{ status }}
        heading="Add Comment"
        text="Comment"
        placeholder="Enter your comment here"
      />,
    );
  };

  return (
    <Wrapper>
      <FlexContainer $justifyContent="space-between" $alignItems="center">
        <P
          $color="#000000"
          $fontSize="16px"
          $fontWeight={'400'}
          $lineHeight={'normal'}
        >
          {statusDetails?.title}
        </P>
        <ApplicantStatusDropdown
          isBoxShadow
          border="1px solid #677995"
          top="42px"
          status={APPLICANT_STATUS_CURRENT_STATES?.[statusDetails?.status]}
          handleStatusSelect={(status) =>
            handleStatusSelect(
              findKeyByValue(APPLICANT_STATUS_CURRENT_STATES, status),
            )
          }
          statusOpen={isDropdownOpen}
          setStatusOpen={setIsDropdownOpen}
          listItem={dropdownList}
          disabled={
            statusDetails?.nextPossibleStates?.length === 0 ||
            employerDetails?.verificationStatus !== 'VERIFIED' ||
            employerDetails?.activationStatus !== 'ACTIVATED'
          }
        />
      </FlexContainer>
    </Wrapper>
  );
};

export default UpdateStatusBar;
