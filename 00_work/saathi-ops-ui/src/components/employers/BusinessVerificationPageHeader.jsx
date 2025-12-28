import React, { useContext, useEffect, useState } from 'react';
import DocumentStatus from '../customerDetails/DocumentStatus';
import DropDownCategory from '../DropDownCategory';

import styled from 'styled-components';
import { ModalContext } from '../../context/ModalProvider';
import RemarksModal from '../common/RemarksModal';
import { usePutUpdateEmployerStatus } from '../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import {
  VERIFICATION_PAGE_INFO,
  VERIFICATION_STATUS_MAP,
  VERIFICATION_TEXTS,
} from '../../constants/verification';
import { STATUS_KEYS } from '../../constants';
import { CUSTOMER_DETAILS_PERMISSIONS } from '../../constants/permissions';
import usePermission from '../../hooks/usePermission';
import {
  BUSINESS_VERIFICATION_TEXTS,
  EMPLOYER_BUSINESS_VERIFICATION_WORKFLOW,
} from '../../constants/employer';

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
const CopyBtn = styled.div`
  border: 1px solid #141482;
  padding: 10px 16px;
  border-radius: 10px;
  background-color: #ffffff;
`;

const Img = styled.img`
  width: ${(props) => props?.$width};
  height: ${(props) => props?.$height};
  cursor: pointer;
`;

const VerificationHeader = ({
  employerId,
  isDropdownOpen,
  setIsDropdownOpen,
  verificationStatus,
  refetchEmployerData,
  possibleStates,
  showNotificationButton,
  pageRoute,
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const [modalTypeInfo, setModalTypeInfo] = useState({});
  const { displayModal, updateModal } = useContext(ModalContext);
  const dropdownList = possibleStates?.map(
    (item) => VERIFICATION_STATUS_MAP?.POSSIBLE_STATES?.[item],
  );
  const { hasPermission } = usePermission();
  const {
    mutateAsync: updateEmployerStatusMutation,
    status: updateEmployerStatusStatus,
    isError: isUpdateEmployerStatusErr,
    error: updateEmployerStatusErr,
  } = usePutUpdateEmployerStatus(employerId);

  useEffect(() => {
    if (isUpdateEmployerStatusErr)
      enqueueSnackbar(
        `Failed to update status. error : ${updateEmployerStatusErr?.message}`,
        {
          variant: 'error',
        },
      );
    updateModal(
      <RemarksModal
        isLoading={false}
        onSubmit={handleUpdateStatus}
        customProps={modalTypeInfo?.status}
        text={
          modalTypeInfo?.status === 'OPS_REJECTED'
            ? 'Confirm Action : Reject'
            : 'Confirm Action : Verify'
        }
        primaryCtaBgColor={
          modalTypeInfo?.status === 'OPS_REJECTED' ? '#ED2F2F' : '#32B237'
        }
        primaryCtaText={
          modalTypeInfo?.status === 'OPS_REJECTED' ? 'Reject' : 'Verify'
        }
      />,
    );
  }, [isUpdateEmployerStatusErr]);

  const handleUpdateStatus = async (message, customProps = {}) => {
    const statusKey = VERIFICATION_PAGE_INFO[pageRoute]?.STATUS_KEY;
    setModalTypeInfo((prevState) => {
      return { status: customProps?.status || prevState?.status };
    });
    const modalStatus = modalTypeInfo?.status || customProps?.status;

    updateModal(
      <RemarksModal
        isLoading
        onSubmit={handleUpdateStatus}
        customProps={modalStatus}
        text={
          modalStatus === 'REJECTED'
            ? 'Confirm Action : Reject'
            : 'Confirm Action : Verify'
        }
        primaryCtaBgColor={modalStatus === 'REJECTED' ? '#ED2F2F' : '#32B237'}
        primaryCtaText={modalStatus === 'REJECTED' ? 'Reject' : 'Verify'}
      />,
    );

    await updateEmployerStatusMutation({
      [`${EMPLOYER_BUSINESS_VERIFICATION_WORKFLOW[pageRoute]?.TYPE}`]: {
        verificationStatus: customProps.status,
      },
      remarks: {
        message,
        remarkType:
          EMPLOYER_BUSINESS_VERIFICATION_WORKFLOW[pageRoute]?.WORKFLOW,
      },
    });
    refetchEmployerData();
  };

  const handleStatusClick = (option) => {
    const selectedOption = option.toLowerCase();

    switch (selectedOption) {
      case 'verify':
        displayModal(
          <RemarksModal
            text="Confirm Action : Verify"
            onSubmit={handleUpdateStatus}
            customProps={{ status: 'OPS_VERIFIED' }}
            primaryCtaText="Verify"
            primaryCtaBgColor="#32B237"
          />,
        );
        break;
      case 'reject':
        displayModal(
          <RemarksModal
            text="Confirm Action : Reject"
            onSubmit={handleUpdateStatus}
            customProps={{ status: 'OPS_REJECTED' }}
            primaryCtaText="Reject"
            primaryCtaBgColor="#ED2F2F"
          />,
        );
        break;
    }
  };

  const pageInfo = BUSINESS_VERIFICATION_TEXTS[pageRoute];
  return (
    <Wrapper>
      <Left>
        <P $fontSize={'24px'} $fontWeight={'600'} $lineHeight={'normal'}>
          {pageInfo?.TITLE}
        </P>
      </Left>
      <FlexContainer $justifyContent="space-between">
        <FlexContainer>
          <P $fontSize={'16px'} $fontWeight={'600'} $lineHeight={'normal'}>
            {pageInfo?.SUB_TITLE}
          </P>
          <FlexContainer $width="auto" $flexDirection="column" $gap="0px">
            <DocumentStatus status={verificationStatus} />
            {verificationStatus === 'VERIFIED' ||
            verificationStatus === 'REJECTED' ? (
              <P $fontSize={'8px'} $fontWeight={'400'} $lineHeight={'normal'}>
                {verificationStatus === 'VERIFIED'
                  ? 'Auto Verified'
                  : 'Auto Rejected'}
              </P>
            ) : null}
          </FlexContainer>
          {verificationStatus !== STATUS_KEYS?.NOT_INITIATED &&
          hasPermission(
            CUSTOMER_DETAILS_PERMISSIONS?.EDIT_VERIFICATION_DETAILS,
          ) ? (
            <DropDownCategory
              isBoxShadow
              border="1px solid #677995"
              top="42px"
              category={'Choose Status'}
              handleCategorySelect={handleStatusClick}
              categoryOpen={isDropdownOpen}
              setCategoryOPen={setIsDropdownOpen}
              listItem={dropdownList}
            />
          ) : null}
        </FlexContainer>
      </FlexContainer>
    </Wrapper>
  );
};

export default VerificationHeader;
