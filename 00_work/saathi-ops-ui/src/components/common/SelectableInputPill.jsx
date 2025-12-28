import React from 'react';
import CustomCTA from '../CustomCTA';
import styled from 'styled-components';
import ICONS from '../../assets/icons';

const StyledPill = styled.div`
  color: #004ff3;
  border: 1px solid #004ff3;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: fit-content;
  padding: 5px 10px;
  gap: 4px;
`;

const Span = styled.span`
  color: ${(props) => (props.$color ? 'red' : '#000')};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
  margin-top: 10px;
`;

const Text = styled.span`
  color: #004ff3;
  font-family: Poppins, sans-serif;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  line-height: ${(props) => props.$lineHeight};
`;

const FlexContainer = styled.div`
  font-family: Poppins;
  width: ${(props) => (props.$width ? props.$width : '100%')};
  display: flex;
  flex-wrap: ${(props) => (props.$flexWrap ? props.$flexWrap : 'wrap')};
  flex-direction: ${(props) =>
    props.$flexDirection ? props.$flexDirection : 'row'};
  gap: ${(props) => (props.$gap ? props.$gap : '8px')};
  align-items: ${(props) =>
    props.$alignItems ? props.$alignItems : 'flex-start'};
  justify-content: ${(props) =>
    props.$justifyContent ? props.$justifyContent : 'flex-start'};
  margin-top: ${(props) => (props.$marginTop ? props.$marginTop : '0px')};
`;

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
  width: 100%;
  height: 20px;
  border-radius: 8px;
  color: #000000bf;
  border: none;
  outline: none;
  font-size: 14px;
  margin-top: 10px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
  border: ${(props) => (props?.$isError ? '1px solid red' : '')};
  text-align: ${(props) => (props.$textAlign ? props.$textAlign : 'left')};
`;

const StyledTextarea = styled.textarea`
  position: ${(props) => (props.$position ? props.$position : 'relative')};
  z-index: ${(props) => (props.$zIndex ? props.$zIndex : 'auto')};
  left: ${(props) => (props.$left ? props.$left : '0')};
  top: ${(props) => (props.$top ? props.$top : '0')};
  width: 100%;
  height: 20px;
  border-radius: 8px;
  color: #000000bf;
  border: none;
  outline: none;
  font-size: 14px;
  margin-top: 10px;
  line-height: 21px;
  font-weight: 400;
  padding: 12px 20px;
  font-family: Poppins;
  box-shadow: 0px 0px 1px 0px rgba(0, 0, 0, 0.25);
  border: ${(props) => (props?.$isError ? '1px solid red' : '')};
  text-align: ${(props) => (props.$textAlign ? props.$textAlign : 'left')};
`;

const SelectableInputPill = ({
  currentValue,
  onChange,
  key,
  header,
  placeholder,
  isMandatory,
  onAdd,
  selectedPills,
  onRemove,
  inputContainerWidth,
  error,
  isInput = true,
}) => {
  return (
    <FlexContainer $gap="0px">
      <StyledHeader
        $fontSize={'16px'}
        $lineHeight={'24px'}
        $color={'#000'}
        $justifyContent={'flex-start'}
        $gap={'5px'}
      >
        {header}
      </StyledHeader>
      <FlexContainer
        $flexWrap="nowrap"
        $alignItems="end"
        $width={inputContainerWidth}
      >
        {isInput ? (
          <StyledInput
            placeholder={placeholder}
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
          />
        ) : (
          <StyledTextarea
            placeholder={placeholder}
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
          />
        )}
        <CustomCTA
          onClick={onAdd}
          title={'Save'}
          color={'#fff'}
          bgColor={'#141482'}
          border={'1px solid ##141482'}
        />
      </FlexContainer>
      <FlexContainer $marginTop="12px">
        {selectedPills?.map((pill, index) => (
          <StyledPill key={`${pill}-${index}`}>
            <Text $fontSize={'14px'} $lineHeight={'normal'}>
              {pill}
            </Text>
            <StyledImg
              onClick={() => onRemove(index)}
              src={ICONS?.CROSS_ICON_BLUE}
              width="14px"
              height="14px"
              alt={'close'}
            />
          </StyledPill>
        ))}
      </FlexContainer>
      {error ? (
        <Span
          $fontSize={'14px'}
          $fontWeight={'300'}
          $lineHeight={'normal'}
          $color={'red'}
        >
          {error}
        </Span>
      ) : (
        ''
      )}
    </FlexContainer>
  );
};

export default SelectableInputPill;
