import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const P = styled.p`
  color: #000;
  font-family: Poppins;
  margin: 8px 0px 0px 0px;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const PillWrapper = styled.div`
  display: flex;
  gap: 10px;
  margin: ${(props) => (props.$margin ? props.$margin : '10px 0px;')};
`;

const Pill = styled.button`
  padding: 5px 10px;
  border-radius: 25px;
  border: ${(props) =>
    props.isSelected
      ? '1px solid #004ff3'
      : props?.$isDisabled
        ? '1px solid #e9e9e9'
        : ' 1px solid #E9E9E9'};
  background-color: #fff;
  color: ${(props) =>
    props.isSelected ? '#004ff3' : props?.$isDisabled ? '#abb0ba' : ' #586276'};
  font-size: 14px;
  font-family: Poppins, sans-serif;
  cursor: ${(props) => (props?.$isDisabled ? 'not-allowed' : 'pointer')};
  outline: none;
  transition: all 0.3s ease;
`;

const Span = styled.span`
  color: ${(props) => (props.$color ? 'red' : '#000')};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const MultiSelectPill = ({
  title,
  options,
  selectedOptions,
  setSelectedOptions,
  isMultiselect,
  isMandatory,
  isDisabled,
}) => {
  const handleSelect = (option) => {
    if (isDisabled) return;
    setSelectedOptions((prev) => {
      if (isMultiselect) {
        const updatedOptions = prev?.includes(option)
          ? prev.filter((o) => o !== option)
          : [...prev, option];
        return updatedOptions;
      } else {
        return prev?.includes(option) ? [] : [option];
      }
    });
  };

  return (
    <>
      <P $fontSize={'16px'} $fontWeight={'400'} $lineHeight={'24px'}>
        {title} {isMandatory ? <Span style={{ color: 'red' }}>*</Span> : ''}
      </P>
      <PillWrapper>
        {options?.map((option) => (
          <Pill
            $isDisabled={isDisabled}
            key={option?.key}
            isSelected={selectedOptions?.includes(option?.key)}
            onClick={() => handleSelect(option?.key)}
          >
            {option?.value}
          </Pill>
        ))}
      </PillWrapper>
    </>
  );
};

MultiSelectPill.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  selectedOptions: PropTypes.arrayOf(PropTypes.string).isRequired,
  setSelectedOptions: PropTypes.func.isRequired,
};

export default MultiSelectPill;
