import React, { useContext, useState } from 'react';
import CustomCTA from '../CustomCTA';
import styled from 'styled-components';
import { ModalContext } from '../../context/ModalProvider';

const DeleteModalContainer = styled.div``;
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
  padding: ${(props) => (props.$padding ? props.$padding : '0px')};
`;
const ModalHeading = styled.div`
  border-radius: 10px 10px 0px 0px;
  background: #f4f6fa;
  padding: 10px;
`;

const DeleteModal = ({
  text = 'Remarks Heading',
  isLoading,
  onCancel,
  onSubmit,
  primaryCtaColor = '#fff',
  customProps,
}) => {
  const { closeModal } = useContext(ModalContext);

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
    closeModal();
  };

  const handleSubmit = async () => {
    if (typeof onSubmit === 'function') {
      await onSubmit();
      closeModal();
    }
  };

  return (
    <DeleteModalContainer>
      <ModalHeading $alignItems="center">
        <P $fontSize={'18px'} $fontWeight={'600'} $lineHeight={'normal'}>
          {text}
        </P>
      </ModalHeading>
      <FlexContainer
        $flexDirection="column"
        $alignItems="center"
        $marginTop="16px"
      >
        <P $fontSize={'16px'} $fontWeight={'600'} $lineHeight={'normal'}>
          Do you really want to delete it?
        </P>
        <P $fontSize={'12px'} $fontWeight={'400'} $lineHeight={'normal'}>
          It can't be undone.
        </P>
      </FlexContainer>

      <FlexContainer
        $marginTop="20px"
        $justifyContent="center"
        $padding="0px 0px 10px 0px"
      >
        <CustomCTA
          color="#586275"
          bgColor="#fff"
          border="1px solid #CDD4DF"
          title="Cancel"
          onClick={handleCancel}
        />
        <CustomCTA
          color={primaryCtaColor}
          bgColor="#ED2F2F"
          border="1px solid #ED2F2F"
          title="Delete"
          isLoading={isLoading}
          onClick={handleSubmit}
        />
      </FlexContainer>
    </DeleteModalContainer>
  );
};

export default DeleteModal;
