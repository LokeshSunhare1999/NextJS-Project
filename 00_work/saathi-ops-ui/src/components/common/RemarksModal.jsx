import React, { useContext, useState } from 'react';
import CustomCTA from '../CustomCTA';
import styled, { createGlobalStyle } from 'styled-components';
import { ModalContext } from '../../context/ModalProvider';
import { REMARK_ERR_STRUCT } from '../../constants/work-experience';
import { textLengthCheck } from '../../utils/helper';
import { REMARKS_MAX_LIMIT, REMARKS_MIN_LIMIT } from '../../constants';

const RemarksModalContainer = styled.div`
  padding: 10px;
`;
const P = styled.p`
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  color: ${(props) => (props.$color ? props.$color : '#000000')};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
  margin-bottom: ${(props) =>
    props.$marginBottom ? props.$marginBottom : '0px'};
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
`;

const StyledSpan = styled.span`
  color: ${(props) => props?.$color};
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const TextArea = styled.textarea`
  border: 1px solid #cdd4df;
  border-radius: 10px;
  width: 100%;
  height: ${(props) => props?.$height};
  resize: none;
  box-sizing: border-box;
  font-family: Poppins;
  color: #606c85;
  padding: 8px;
`;

const RemarksModal = ({
  text = 'Remarks',
  heading = 'Add Remarks',
  subheading = '',
  placeholder,
  isLoading,
  onCancel,
  onSubmit,
  primaryCtaText = 'Submit',
  primaryCtaBgColor = '#141482',
  primaryCtaColor = '#fff',
  customProps,
  showText = true,
  showHeading = true,
  showSubheading = false,
  showCancelCta = true,
  showPrimaryCta = true,
}) => {
  const { closeModal } = useContext(ModalContext);
  const [value, setValue] = useState('');
  const [fieldErr, setFieldErr] = useState(REMARK_ERR_STRUCT);
  const handleCancel = () => {
    if (typeof onCancel === 'function') onCancel();
    closeModal();
  };

  const isValidationError = () => {
    const trimmedValue = value?.trim();
    const errorFields = {
      remarks:
        !trimmedValue ||
        textLengthCheck(
          value || '',
          REMARKS_MAX_LIMIT + 1,
          REMARKS_MIN_LIMIT - 1,
        ) ||
        false,
    };
    setFieldErr({ ...errorFields });

    return JSON.stringify(errorFields) !== JSON.stringify(REMARK_ERR_STRUCT);
  };

  const handleSubmit = async () => {
    if (isValidationError()) return;

    if (typeof onSubmit === 'function') {
      await onSubmit(value, customProps);
      closeModal();
    }
  };
  return (
    <RemarksModalContainer>
      {showHeading ? (
        <P
          $fontSize={'16px'}
          $fontWeight={customProps?.heading?.$fontWeight || '400'}
          $lineHeight={'normal'}
          $marginBottom={customProps?.heading?.$marginBottom || '20px'}
        >
          {heading}{' '}
          <StyledSpan
            $fontSize={'16px'}
            $lineHeight={'24px'}
            $fontWeight={'400'}
            $color={'#ED2F2F'}
          >
            *
          </StyledSpan>
        </P>
      ) : null}
      {showSubheading ? (
        <P
          $fontSize={customProps?.subheading?.$fontSize || '16px'}
          $fontWeight={'400'}
          $lineHeight={'normal'}
          $marginBottom={customProps?.subheading?.marginBottom || '20px'}
        >
          {subheading}{' '}
        </P>
      ) : null}
      {showText ? (
        <P $fontSize={'14px'} $fontWeight={'400'} $lineHeight={'normal'}>
          {text}
        </P>
      ) : null}

      <TextArea
        placeholder={placeholder}
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        $height={customProps?.textArea?.$height}
      />
      {fieldErr?.remarks && (
        <ErrorBox>
          <P
            $color={'red'}
            $fontSize={'14px'}
            $fontWeight={'300'}
            $lineHeight={'normal'}
          >
            {!value?.trim()
              ? 'Remarks cannot be empty or contain only spaces.'
              : 'Please limit the texts between 15 and 1000 characters.'}
          </P>
        </ErrorBox>
      )}
      <FlexContainer $marginTop="10px" $justifyContent="flex-end">
        {showCancelCta ? (
          <CustomCTA
            color="#586275"
            bgColor="#fff"
            border="1px solid #CDD4DF"
            title="Cancel"
            onClick={handleCancel}
          />
        ) : null}
        {showPrimaryCta ? (
          <CustomCTA
            color={primaryCtaColor}
            bgColor={primaryCtaBgColor}
            border="1px solid #CDD4DF"
            title={primaryCtaText}
            isLoading={isLoading}
            onClick={handleSubmit}
          />
        ) : null}
      </FlexContainer>
    </RemarksModalContainer>
  );
};

export default RemarksModal;
