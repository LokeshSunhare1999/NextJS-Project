import React from 'react';
import styled from 'styled-components';
import DropDownCategory from '../DropDownCategory';
import DropDownDays from '../DropDownDays';
import PropTypes from 'prop-types';
import Checkbox from './Checkbox';
import Radiobutton from './RadioButton';
import CustomTooltip from './CustomTooltip';
import ICONS from '../../assets/icons';

const StyledHeader = styled.p`
  font-family: Poppins;
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

const PriceInput = styled.input`
  width: calc(100% - 48px);
  height: 20px;
  border-radius: 0px 8px 8px 0px;
  color: #000000bf;
  border: none;
  outline: none;
  font-size: 16px;
  line-height: 24px;
  font-weight: 500;
  padding: 12px 20px;
  font-family: Poppins;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
`;

const StyledSpan = styled.span`
  color: ${(props) => props?.$color};
  font-size: ${(props) => props?.$fontSize};
  line-height: ${(props) => props?.$lineHeight};
  font-weight: ${(props) => props?.$fontWeight};
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
`;

const StyledInput = styled.input`
  position: ${(props) => (props.$position ? props.$position : 'relative')};
  z-index: ${(props) => (props.$zIndex ? props.$zIndex : 'auto')};
  left: ${(props) => (props.$left ? props.$left : '0')};
  top: ${(props) => (props.$top ? props.$top : '0')};
  width: ${(props) => (props.$width ? props.$width : 'calc(100% - 40px)')};
  height: 20px;
  margin-top: 10px;
  border-radius: 8px;
  color: #000000bf;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
  border: ${(props) => (props?.$isError ? '1px solid red' : '')};
  text-align: ${(props) => (props.$textAlign ? props.$textAlign : 'left')};
`;

const StyledInputArea = styled.textarea`
  position: ${(props) => (props.$position ? props.$position : 'relative')};
  z-index: ${(props) => (props.$zIndex ? props.$zIndex : 'auto')};
  left: ${(props) => (props.$left ? props.$left : '0')};
  top: ${(props) => (props.$top ? props.$top : '0')};
  width: ${(props) => (props.$width ? props.$width : 'calc(100% - 40px)')};
  height: 88px;
  margin-top: 10px;
  border-radius: 8px;
  color: #000000bf;
  border: none;
  outline: none;
  font-size: 14px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
  border: ${(props) => (props?.$isError ? '1px solid red' : '')};
  text-align: ${(props) => (props.$textAlign ? props.$textAlign : 'left')};
`;

const ErrorBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;
const InfoTagBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  align-items: center;
`;

const P = styled.p`
  color: ${(props) => props.$color};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const PriceField = styled.div`
  width: 100%;
  height: 44px;
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  border: ${(props) => (props.$isError ? '1px solid red' : '')};
`;

const PriceIconContainer = styled.div`
  width: 48px;
  height: 44px;
  background: #677995;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 8px 0px 0px 8px;
`;

const StyledDiv = styled.div`
  position: relative;
  height: ${(props) => props.$height ?? 'auto'};
  width: ${(props) => props.$width ?? '100%'};
  margin: ${(props) => props.$margin ?? null};
  padding: ${(props) => props.$padding ?? null};
  border: ${(props) => props.$border ?? null};
  border-radius: ${(props) => props.$borderRadius ?? null};
  background: ${(props) => props.$background ?? null};
  display: ${(props) => props.$display ?? 'flex'};
  flex-direction: ${(props) => props.$flexDirection ?? 'column'};
  align-items: ${(props) => props.$alignItems ?? 'center'};
  justify-content: ${(props) => props.$justifyContent ?? 'center'};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize ?? '14px'};
  font-weight: ${(props) => props.$fontWeight ?? '400'};
  color: ${(props) => props.$color ?? '#000'};
  line-height: ${(props) => props.$lineHeight ?? '21px'};
  gap: ${(props) => props.$gap ?? null};
  flex-wrap: ${(props) => props.$flexWrap ?? null};
`;
const Img = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;
const RadiobuttonWrapper = styled.div`
  padding: 7px 14px;
  border: 1px solid #f1f1f1;
  border-radius: 8px;
  cursor: pointer;
  width: max-content;
`;

const DrawerInput = ({
  fieldType,
  fieldHeader = '',
  fieldError,
  infoTag,
  infoTagText = '',
  fieldPlaceholder,
  fieldValue,
  handleFieldChange,
  errorText,
  isDropDownScrollable,
  handleDropDownSelect,
  dropDownOpen,
  handleDropDownOpen,
  dropDownList,
  dropDownConvertFn,
  fieldIcon,
  filterHeader,
  checkboxes,
  handleCheckboxChange,
  filterClassname,
  showFieldHeader = true,
  isManadatory = false,
  isDropDownDisabled = false,
  isInputDisabled = false,
  headerMargin = '8px 0 0 0',
  headerWeight = '400',
  headerWidth = '100%',
  children,
  color,
  customProps = {},
  isDropDownSearchable = false,
  isDisabled = false,
  onBlurInput = () => {},
  showTooltip = false,
  fieldHeaderSize = '16px',
  dropdownPlaceholder = '',
}) => {
  const priceInputRender = () => {
    return (
      <>
        <PriceField $isError={fieldError}>
          <PriceIconContainer>
            <StyledImg
              src={fieldIcon}
              alt="rupee-icon"
              $width={'16px'}
              height={'auto'}
            />
          </PriceIconContainer>
          <PriceInput
            value={fieldValue}
            onChange={handleFieldChange}
          ></PriceInput>
        </PriceField>
        {fieldError && (
          <ErrorBox>
            <P
              $color={'red'}
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
            >
              {errorText}
            </P>
          </ErrorBox>
        )}
      </>
    );
  };

  const inputRender = () => {
    return (
      <>
        <StyledInput
          $isError={fieldError}
          $isInfo={infoTag}
          placeholder={fieldPlaceholder}
          value={fieldValue}
          onChange={handleFieldChange}
          disabled={isDisabled}
          onBlur={onBlurInput}
        ></StyledInput>
        {infoTag ? (
          <InfoTagBox>
            <P
              $color={'green'}
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
            >
              {infoTagText}
            </P>
          </InfoTagBox>
        ) : null}
        {fieldError ? (
          <ErrorBox>
            <P
              $color={'red'}
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
            >
              {errorText}
            </P>
          </ErrorBox>
        ) : null}
      </>
    );
  };

  const inputAreaRender = () => {
    return (
      <>
        <StyledInputArea
          $isError={fieldError}
          placeholder={fieldPlaceholder}
          value={fieldValue}
          onChange={handleFieldChange}
        ></StyledInputArea>
        {fieldError ? (
          <ErrorBox>
            <P
              $color={'red'}
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
            >
              {errorText}
            </P>
          </ErrorBox>
        ) : null}
      </>
    );
  };

  const dropDownRender = () => {
    return (
      <DropDownCategory
        isScrollable={isDropDownScrollable}
        isBoxShadow={true}
        top={'54px'}
        marginTop={'10px'}
        border={'none'}
        category={fieldValue}
        handleCategorySelect={handleDropDownSelect}
        categoryOpen={dropDownOpen}
        setCategoryOPen={handleDropDownOpen}
        listItem={dropDownList}
        displayConvertFn={dropDownConvertFn}
        errorMessage={errorText}
        isError={fieldError}
        disabled={isDropDownDisabled}
        isSearchable={isDropDownSearchable}
        placeholder={dropdownPlaceholder}
      />
    );
  };

  const daysDropDownRender = () => {
    return (
      <DropDownDays
        isScrollable={isDropDownScrollable}
        isBoxShadow={true}
        top={'54px'}
        marginTop={'10px'}
        border={'none'}
        category={fieldValue}
        handleCategorySelect={handleDropDownSelect}
        categoryOpen={dropDownOpen}
        setCategoryOPen={handleDropDownOpen}
        listItem={dropDownList}
        displayConvertFn={dropDownConvertFn}
        errorMessage={errorText}
        isError={fieldError}
        disabled={isDropDownDisabled}
      />
    );
  };

  const filterFieldRender = () => {
    return (
      <>
        <StyledDiv
          $width={'calc(100% - 32px)'}
          $border={fieldError ? '1px solid red' : '1px solid #CDD4DF'}
          $borderRadius={'8px'}
          $background={'#FFF'}
          $margin={'12px 0 0 0'}
          $padding={'8px 16px'}
        >
          <StyledDiv
            $fontWeight={500}
            $color={'#606C85'}
            $margin={'0 0 4px 0'}
            $alignItems={'flex-start'}
          >
            {filterHeader}
          </StyledDiv>
          <StyledDiv
            $height={'1px'}
            $width={'calc(100% + 32px)'}
            $margin={'0 -16px 0 -16px'}
            $background={'#CDD4DF'}
          />
          <StyledDiv
            $height={'auto'}
            $fontWeight={500}
            $color={'#606C85'}
            $margin={'8px 0'}
            $flexDirection={filterClassname?.flexDirection || 'row'}
            $justifyContent={
              checkboxes.length === 2
                ? 'start'
                : filterClassname?.justifyContent || 'start'
            }
            $alignItems={filterClassname?.alignItems || 'center'}
            $gap={filterClassname?.gap || '50px'}
          >
            {checkboxes?.map((checkbox, idx) => {
              return (
                <Checkbox
                  key={`${checkbox.value}-${idx}`}
                  label={checkbox.value}
                  checked={checkbox.checked}
                  onChange={() => {
                    handleCheckboxChange(checkbox.value);
                  }}
                />
              );
            })}
          </StyledDiv>
        </StyledDiv>
        {fieldError ? (
          <ErrorBox>
            <P
              $color={'red'}
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
            >
              {errorText}
            </P>
          </ErrorBox>
        ) : null}
      </>
    );
  };
  const optionRender = () => {
    return (
      <>
        <StyledDiv
          $width={'calc(100% - 32px)'}
          $borderRadius={'8px'}
          $margin={'12px 0 0 0'}
        >
          <StyledDiv
            $height={'auto'}
            $fontWeight={500}
            $color={'#606C85'}
            $margin={'16px 0px'}
            $flexDirection={filterClassname?.flexDirection || 'row'}
            $justifyContent={'start'}
            $alignItems={filterClassname?.alignItems || 'center'}
            $gap={'15px'}
            $flexWrap={'wrap'}
          >
            {checkboxes?.map((checkbox, idx) => {
              return (
                <RadiobuttonWrapper
                  key={`${checkbox.value}-${idx}`}
                  onClick={() => handleCheckboxChange(checkbox.value)}
                >
                  <Radiobutton
                    label={checkbox.value}
                    checked={checkbox.checked}
                    onChange={() => {
                      handleCheckboxChange(checkbox.value);
                    }}
                  />
                </RadiobuttonWrapper>
              );
            })}
            {fieldError ? (
              <ErrorBox>
                <P
                  $color={'red'}
                  $fontSize={'14px'}
                  $fontWeight={'300'}
                  $lineHeight={'normal'}
                >
                  {errorText}
                </P>
              </ErrorBox>
            ) : null}
          </StyledDiv>
        </StyledDiv>
      </>
    );
  };

  const renderField = () => {
    switch (fieldType) {
      case 'input':
        return inputRender();
      case 'inputArea':
        return inputAreaRender();
      case 'dropdown':
        return dropDownRender();
      case 'days':
        return daysDropDownRender();
      case 'price':
        return priceInputRender();
      case 'filter':
        return filterFieldRender();
      case 'option':
        return optionRender();
      case 'children':
        return children;
    }
  };

  return (
    <>
      {showFieldHeader ? (
        <StyledHeader
          $fontSize={fieldHeaderSize}
          $lineHeight={'24px'}
          $fontWeight={headerWeight}
          $color={color || '#000'}
          $margin={headerMargin}
          $justifyContent={'flex-start'}
          $gap={'5px'}
          $width={headerWidth}
        >
          {fieldHeader}{' '}
          {showTooltip ? (
            <CustomTooltip placement="right-end" title={infoTagText}>
              <Img
                src={ICONS.INFO_WHITE}
                alt="Tooltip"
                $width="16px"
                $height="16px"
              />
            </CustomTooltip>
          ) : null}
          {isManadatory ? (
            <StyledSpan
              $fontSize={'16px'}
              $lineHeight={'24px'}
              $fontWeight={'400'}
              $color={'#ED2F2F'}
            >
              *
            </StyledSpan>
          ) : null}
        </StyledHeader>
      ) : null}
      {renderField()}
    </>
  );
};

DrawerInput.propTypes = {
  fieldType: PropTypes.string.isRequired,
  fieldHeader: PropTypes.string,
  fieldError: PropTypes.bool,
  fieldPlaceholder: PropTypes.string,
  fieldValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  handleFieldChange: PropTypes.func,
  errorText: PropTypes.string,
  isDropDownScrollable: PropTypes.bool,
  handleDropDownSelect: PropTypes.func,
  dropDownOpen: PropTypes.bool,
  handleDropDownOpen: PropTypes.func,
  dropDownList: PropTypes.array,
  dropDownConvertFn: PropTypes.func,
  isManadatory: PropTypes.bool,
  isDropDownDisabled: PropTypes.bool,
  headerMargin: PropTypes.string,
  children: PropTypes.node,
};

export default DrawerInput;
