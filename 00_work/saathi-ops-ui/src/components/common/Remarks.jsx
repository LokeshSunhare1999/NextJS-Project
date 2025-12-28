import React, { useContext, useEffect } from 'react';
import styled from 'styled-components';
import CustomCTA from '../CustomCTA';

import { ModalContext } from '../../context/ModalProvider';
import RemarksModal from './RemarksModal';

import { useSnackbar } from 'notistack';
import usePermission from '../../hooks/usePermission';
import RemarkCard from './RemarkCard';

const Wrapper = styled.div`
  margin-top: 20px;
  margin-bottom: 40px;
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  color: ${(props) => (props.color ? props.color : '#000000')};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
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

const Remarks = ({
  remarks,
  postRemarksError,
  onSubmit,
  isError = false,
  modalHeading = 'Add Remarks',
  modalText = 'Remarks',
  modalPlaceholder = 'Enter your remarks here. ',
  showText = true,
  showHeading = true,
  showCloseIcon = true,
  title = 'Remarks',
  ctaTitle = 'Add Remarks',
  emptyPlaceholder = 'No remarks added',
  permission,
  successMsg = 'You successfully added a remark',
  errorMsg = 'Failed to post remarks.',
  statusMap,
}) => {
  const { displayModal, updateModal, closeModal } = useContext(ModalContext);
  const { hasPermission } = usePermission();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (isError)
      enqueueSnackbar(`${errorMsg} error : ${postRemarksError?.message}`, {
        variant: 'error',
      });
    updateModal(
      <RemarksModal
        isLoading={false}
        onSubmit={onSubmit}
        heading={modalHeading}
        text={modalText}
        showText={showText}
        showHeading={showHeading}
        placeholder={modalPlaceholder}
        showCloseIcon={showCloseIcon}
      />,
    );
  }, [isError]);

  const handleSubmit = async (message, customProps = {}) => {
    if (typeof onSubmit === 'function') {
      updateModal(
        <RemarksModal
          isLoading
          onSubmit={handleSubmit}
          heading={modalHeading}
          text={modalText}
          showText={showText}
          showHeading={showHeading}
          placeholder={modalPlaceholder}
          showCloseIcon={showCloseIcon}
        />,
      );
      onSubmit({ message });
      enqueueSnackbar(successMsg, {
        variant: 'success',
      });
    }
  };

  return (
    <Wrapper>
      <FlexContainer $justifyContent="space-between" $alignItems="center">
        <P $fontSize={'16px'} $fontWeight={'600'} $lineHeight={'normal'}>
          {title}
        </P>
        <CustomCTA
          onClick={() => {
            displayModal(
              <RemarksModal
                onSubmit={handleSubmit}
                heading={modalHeading}
                text={modalText}
                showText={showText}
                showHeading={showHeading}
                showCloseIcon={showCloseIcon}
                placeholder={modalPlaceholder}
              />,
              { showCloseIcon },
            );
          }}
          showIcon
          title={ctaTitle}
          showSecondary={true}
          color="#ffffff"
          bgColor="#677995"
          border="1px solid #CDD4DF"
          isPermitted={permission && hasPermission(permission)}
        />
      </FlexContainer>
      <FlexContainer $flexDirection="column">
        {remarks?.length > 0 ? (
          remarks?.map((remark) => (
            <RemarkCard
              key={remark?._id}
              remark={remark}
              statusMap={statusMap}
            />
          ))
        ) : (
          <P $fontSize={'14px'} $fontWeight={'400'} $lineHeight={'normal'}>
            {emptyPlaceholder}
          </P>
        )}
      </FlexContainer>
    </Wrapper>
  );
};

export default Remarks;
