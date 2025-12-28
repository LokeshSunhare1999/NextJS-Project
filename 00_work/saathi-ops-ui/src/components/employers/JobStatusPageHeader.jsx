import React, { Suspense, useEffect, useState } from 'react';
import DocumentStatus from '../customerDetails/DocumentStatus';
import DropDownCategory from '../DropDownCategory';
import styled from 'styled-components';
import { usePutAddJob } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import usePermission from '../../hooks/usePermission';
import ConfirmationPop from '../ConfirmationPop';
import { findKeyByValue } from '../../utils/helper';
import { JOB_STATUS_MAP } from '../../constants/employer';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../constants/permissions';

const Wrapper = styled.div``;
const FlexContainer = styled.div`
  width: ${(props) => (props.$width ? props.$width : '100%')};
  display: flex;
  gap: ${(props) => (props.$gap ? props.$gap : '8px')};
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  align-items: ${(props) => (props.$alignItems ? props.$alignItems : 'center')};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin: 20px 0px;
`;

const JobStatusPageHeader = ({
  jobId,
  isDropdownOpen,
  setIsDropdownOpen,
  verificationStatus,
  refetchJobDetails,
  possibleStates,
  jobTitle,
  employerDetails,
  jobDetails,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  const [openConfirmationPop, setOpenConfirmationPop] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

  const dropdownList = possibleStates?.map((item) => JOB_STATUS_MAP?.[item]);

  const { hasPermission } = usePermission();
  const {
    mutateAsync: editJobMutation,
    status: editJobStatus,
    isError: isEditJobErr,
    error: editJobErr,
  } = usePutAddJob();

  useEffect(() => {
    if (isEditJobErr)
      enqueueSnackbar(
        `Failed to update status. error : ${editJobErr?.message}`,
        {
          variant: 'error',
        },
      );
  }, [isEditJobErr]);

  const handleUpdateStatus = async (status) => {
    setOpenConfirmationPop(false);
    await editJobMutation({
      jobId: jobId,
      status,
    });
    refetchJobDetails();
  };

  const handleStatusClick = (option) => {
    setSelectedOption(option);
    setOpenConfirmationPop(true);
  };

  return (
    <Wrapper>
      <FlexContainer $justifyContent="space-between">
        <FlexContainer>
          <P $fontSize={'16px'} $fontWeight={'600'} $lineHeight={'normal'}>
            {jobTitle}
          </P>
          <FlexContainer $width="auto" $flexDirection="column" $gap="0px">
            <DocumentStatus status={verificationStatus} />
          </FlexContainer>
          <DropDownCategory
            isBoxShadow
            border="1px solid #677995"
            top="42px"
            disabled={dropdownList?.length === 0 || !jobDetails?.jobThumbnail || !hasPermission(EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS)}
            category={'Change Status'}
            handleCategorySelect={handleStatusClick}
            categoryOpen={isDropdownOpen}
            setCategoryOPen={setIsDropdownOpen}
            listItem={dropdownList}
          />
        </FlexContainer>
      </FlexContainer>
      {openConfirmationPop ? (
        <Suspense fallback={<div></div>}>
          <ConfirmationPop
            setOpenConfirmationPop={setOpenConfirmationPop}
            title={''}
            heading={'Do you want to change the status?'}
            handleSubmit={() =>
              handleUpdateStatus(findKeyByValue(JOB_STATUS_MAP, selectedOption))
            }
          />
        </Suspense>
      ) : (
        ''
      )}
    </Wrapper>
  );
};

export default JobStatusPageHeader;
