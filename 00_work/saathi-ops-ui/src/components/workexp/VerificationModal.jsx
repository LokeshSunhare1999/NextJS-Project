import React, { useContext, useState } from 'react';
import CustomCTA from '../CustomCTA';
import styled from 'styled-components';
import { ModalContext } from '../../context/ModalProvider';
import {
  RATING_LIST,
  WORK_EXP_VERIFICATION_ERR_STRUCT,
} from '../../constants/work-experience';
import DropDownCategory from '../DropDownCategory';
import ICONS from '../../assets/icons';
import { textLengthCheck } from '../../utils/helper';
import { REMARKS_MAX_LIMIT, REMARKS_MIN_LIMIT } from '../../constants';

const VerificationModalContainer = styled.div`
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
`;

const StyledSpan = styled.span`
  color: ${(props) => props?.$color};
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
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

const Img = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  border: 1px solid #cdd4df;
  background: #f4f6fa;
  border-radius: 10px;
  width: 100%;
  resize: none;
  box-sizing: border-box;
  font-family: Poppins;
  color: #606c85;
  padding: 8px;
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const VerificationModal = ({
  text = 'Remarks Heading',
  isLoading,
  onCancel,
  onSubmit,
  primaryCtaText = 'Update',
  primaryCtaBgColor = '#141482',
  primaryCtaColor = '#fff',
  customProps,
}) => {
  const { closeModal } = useContext(ModalContext);
  const [opsRemarks, setOpsRemarks] = useState('');
  const [empRemarks, setEmpRemarks] = useState('');
  const [rating, setRating] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [ratingDropdownOpen, setRatingDropdownOpen] = useState(false);
  const [activeStatus, setActiveStatus] = useState('');
  const [fieldErr, setFieldErr] = useState({
    ...WORK_EXP_VERIFICATION_ERR_STRUCT,
  });
  const currentStatus = customProps?.currentStatus;

  const getPossibleStates = (status) => {
    switch (status) {
      case 'PENDING':
        return ['Verified', 'Rejected'];
      case 'REJECTED':
        return ['Verified'];
      case 'VERIFIED':
        return ['Rejected'];
      default:
        return ['Verified', 'Rejected'];
    }
  };

  const dropdownList = getPossibleStates(currentStatus);

  const handleCancel = () => {
    if (typeof onCancel === 'function') {
      onCancel();
    }
    closeModal();
  };

  const isValidationError = () => {
    const errorFields = {
      status: activeStatus === '',
      rating: activeStatus.toLowerCase() === 'verified' ? rating === '' : false,
      empRemarks:
        activeStatus.toLowerCase() === 'verified'
          ? textLengthCheck(
              empRemarks || '',
              REMARKS_MAX_LIMIT + 1,
              REMARKS_MIN_LIMIT - 1,
            )
          : false,
      opsRemarks:
        textLengthCheck(
          opsRemarks || '',
          REMARKS_MAX_LIMIT + 1,
          REMARKS_MIN_LIMIT - 1,
        ) || false,
    };
    setFieldErr({ ...errorFields });
    return (
      JSON.stringify(errorFields) !==
      JSON.stringify(WORK_EXP_VERIFICATION_ERR_STRUCT)
    );
  };

  const handleSubmit = async () => {
    if (isValidationError()) return;
    if (typeof onSubmit === 'function') {
      const newVerificationStatus =
        activeStatus === 'Verified' ? 'VERIFIED' : 'REJECTED';
      await onSubmit(
        {
          empRemarks,
          rating,
          opsRemarks,
          verificationStatus: newVerificationStatus,
        },
        customProps,
      );
      closeModal();
    }
  };

  const handleRatingUpdate = (empRating) => {
    setRating(empRating);
    setRatingDropdownOpen(!ratingDropdownOpen);
  };

  const handleStatusClick = (option) => {
    const selectedOption = option.toLowerCase();

    switch (selectedOption) {
      case 'verified':
        setActiveStatus('Verified');
        break;
      case 'rejected':
        setActiveStatus('Rejected');
        break;
    }
    setIsDropdownOpen(false);
  };

  return (
    <VerificationModalContainer>
      <FlexContainer $alignItems="center" $justifyContent="flex-start">
        <P $fontSize={'18px'} $fontWeight={'600'} $lineHeight={'normal'}>
          {text}
        </P>
        <DropDownCategory
          isBoxShadow
          border="1px solid #677995"
          top="42px"
          category={activeStatus || 'Select Status'}
          handleCategorySelect={handleStatusClick}
          categoryOpen={isDropdownOpen}
          setCategoryOPen={setIsDropdownOpen}
          listItem={dropdownList}
        />
      </FlexContainer>

      {fieldErr?.status && (
        <ErrorBox>
          <P
            $color={'red'}
            $fontSize={'14px'}
            $fontWeight={'300'}
            $lineHeight={'normal'}
          >
            {`Please select a status`}
          </P>
        </ErrorBox>
      )}

      <FlexContainer $flexDirection="column" $marginTop="16px">
        <P $fontSize={'14px'} $fontWeight={'400'} $lineHeight={'normal'}>
          Enter your comment for status change{' '}
          <StyledSpan
            $fontSize={'16px'}
            $lineHeight={'24px'}
            $fontWeight={'400'}
            $color={'#ED2F2F'}
          >
            *
          </StyledSpan>
        </P>
        <TextArea
          placeholder="Enter your comment here"
          value={opsRemarks}
          onChange={(e) => setOpsRemarks(e.target.value)}
        />
        {fieldErr?.opsRemarks && (
          <ErrorBox>
            <P
              $color={'red'}
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
            >
              {`Please limit the texts between 15 and 1000 characters. `}
            </P>
          </ErrorBox>
        )}
      </FlexContainer>
      {activeStatus?.toLowerCase() === 'verified' ? (
        <>
          <FlexContainer $flexDirection="column" $marginTop="16px">
            <P $fontSize={'14px'} $fontWeight={'400'} $lineHeight={'normal'}>
              <FlexContainer
                $flexDirection="row"
                $marginTop="16px"
                $alignItems="center"
              >
                Employer’s Rating (out of 5{' '}
                <Img src={ICONS.STAR} alt="star" width="16px" height="16px" />){' '}
                <StyledSpan
                  $fontSize={'16px'}
                  $lineHeight={'24px'}
                  $fontWeight={'400'}
                  $color={'#ED2F2F'}
                >
                  *
                </StyledSpan>
              </FlexContainer>
            </P>
            <FlexContainer
              $flexDirection="row"
              $marginTop="16px"
              $alignItems="center"
            >
              <DropDownCategory
                isBoxShadow
                // isScrollable
                border="1px solid #677995"
                top="42px"
                category={rating || 'Select rating'}
                handleCategorySelect={handleRatingUpdate}
                categoryOpen={ratingDropdownOpen}
                setCategoryOPen={setRatingDropdownOpen}
                listItem={RATING_LIST}
              />{' '}
              <Img src={ICONS.STAR} alt="star" width="16px" height="16px" />
            </FlexContainer>
            {fieldErr?.rating && (
              <ErrorBox>
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {`Please select a rating. `}
                </P>
              </ErrorBox>
            )}
          </FlexContainer>
          <FlexContainer $flexDirection="column" $marginTop="16px">
            <P $fontSize={'14px'} $fontWeight={'400'} $lineHeight={'normal'}>
              Remarks from the previous employer{' '}
              <StyledSpan
                $fontSize={'16px'}
                $lineHeight={'24px'}
                $fontWeight={'400'}
                $color={'#ED2F2F'}
              >
                *
              </StyledSpan>
            </P>
            <TextArea
              placeholder="Enter remarks from the previous employer"
              value={empRemarks}
              onChange={(e) => setEmpRemarks(e.target.value)}
            />
            {fieldErr?.empRemarks && (
              <ErrorBox>
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {`Please limit the texts between 15 and 1000 characters. `}
                </P>
              </ErrorBox>
            )}
          </FlexContainer>
        </>
      ) : null}
      <FlexContainer $marginTop="20px" $justifyContent="flex-end">
        <CustomCTA
          color="#586275"
          bgColor="#fff"
          border="1px solid #CDD4DF"
          title="Cancel"
          onClick={handleCancel}
        />
        <CustomCTA
          color={primaryCtaColor}
          bgColor={primaryCtaBgColor}
          border="1px solid #CDD4DF"
          title={primaryCtaText}
          isLoading={isLoading}
          onClick={handleSubmit}
        />
      </FlexContainer>
    </VerificationModalContainer>
  );
};

export default VerificationModal;
