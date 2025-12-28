import React, { useState } from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const Overlay = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  font-family: ${(props) => props?.$inputContainerClasses?.fontFamily}
  height: ${(props) => props?.$inputContainerClasses?.height};
  width: ${(props) => props?.$inputContainerClasses?.width || '100%'};
`;

const StyledLabel = styled.label`
  position: absolute;
  left: ${(props) =>
    props?.$isEmailPresent
      ? props?.$labelFocusedClasses?.left
      : props?.$labelClasses?.left};
  color: ${(props) =>
    props?.$isFocused
      ? props?.$labelFocusedClasses?.color
      : props?.$labelClasses?.color};
  font-weight: ${(props) =>
    props?.$isEmailPresent
      ? props?.$labelFocusedClasses?.fontWeight
      : props?.$labelClasses?.fontWeight};
  font-size: ${(props) =>
    props?.$isEmailPresent
      ? props?.$labelFocusedClasses?.fontSize
      : props?.$labelClasses?.fontSize};
  line-height: ${(props) =>
    props?.$isEmailPresent
      ? props?.$labelFocusedClasses?.lineHeight
      : props?.$labelClasses?.lineHeight};
  top: ${(props) =>
    props?.$isEmailPresent
      ? props?.$labelFocusedClasses?.top
      : props?.$labelClasses?.top};
  padding: ${(props) =>
    props?.$isEmailPresent ? props?.$labelFocusedClasses?.padding : ''};
  background: ${(props) => (props?.$isEmailPresent ? ' #fff' : '')};
  transition: all 0.2s ease;
  pointer-events: none;
`;

const StyledInput = styled.input`
  border-radius: ${(props) => props?.$inputClasses?.borderRadius};
  padding: ${(props) => props?.$inputClasses?.padding};
  height: ${(props) => props?.$inputClasses?.height};
  border: ${(props) => props?.$inputClasses?.border};
  width: 100%;
  font-size: ${(props) => props?.$inputClasses?.fontSize};
  line-height: ${(props) => props?.$inputClasses?.lineHeight};
  font-weight: ${(props) => props?.$inputClasses?.fontWeight};
  color: ${(props) => props?.$inputClasses?.color}
  resize: none;

  &::-webkit-inner-spin-button,
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  &::placeholder {
    color: rgba(30, 51, 63, 0.5);
    font-weight: 400;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    border: ${(props) => props?.$inputClasses?.borderFocus};
  }

  &_error {
    border: 2px solid #ff6868;
  }

  &_disabled {
    background-color: #f6f7f7;
    color: rgba(30, 51, 63, 0.5);
  }
`;

const StyledLeftIcon = styled.img`
  position: absolute;
  top: ${(props) => props?.$leftIconClass?.top};
  left: ${(props) => props?.$leftIconClass?.left};
  width: ${(props) => props?.$leftIconClass?.width};
  width: ${(props) => props?.$leftIconClass?.height};
`;

const StyledRightIcon = styled(StyledLeftIcon)`
  cursor: pointer;
  right: ${(props) => props?.$rightIconClass?.right};
`;

const TextInput = ({
  ariaLabel = '',
  type,
  name,
  placeholder,
  value,
  setValue,
  labelClasses,
  labelFocusedClasses,
  inputContainerClasses,
  inputClasses,
  leftIconClass,
  leftIcon,
  leftIconFocused,
  showRightIcon,
  rightIconClass,
  rightIcon,
  rightIconActive,
  handleRightIconClick,
  onFocus = () => {},
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [secondaryIconActive, setSecondaryIconActive] = useState(false);

  const focusHandler = (e) => {
    setIsFocused(true);
    onFocus(e);
  };

  const blurHandler = () => {
    setIsFocused(false);
  };

  const handleSecondaryIconClick = () => {
    setSecondaryIconActive(!secondaryIconActive);
    handleRightIconClick();
  };

  return (
    <Overlay $inputContainerClasses={inputContainerClasses}>
      <StyledInput
        aria-label={ariaLabel}
        type={type}
        name={name}
        $inputClasses={inputClasses}
        onFocus={(e) => focusHandler(e)}
        onBlur={blurHandler}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <StyledLabel
        $labelClasses={labelClasses}
        $labelFocusedClasses={labelFocusedClasses}
        $isFocused={isFocused}
        $isEmailPresent={isFocused || value.length > 0}
      >
        {placeholder}
      </StyledLabel>
      <StyledLeftIcon
        $leftIconClass={leftIconClass}
        src={isFocused ? leftIconFocused : leftIcon}
        alt={'left-icon'}
      />
      {showRightIcon ? (
        <StyledRightIcon
          $rightIconClass={rightIconClass}
          src={secondaryIconActive ? rightIconActive : rightIcon}
          alt={'right-icon'}
          onClick={handleSecondaryIconClick}
        />
      ) : null}
    </Overlay>
  );
};
TextInput.propTypes = {
  ariaLabel: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  setValue: PropTypes.func.isRequired,
  labelClasses: PropTypes.object,
  labelFocusedClasses: PropTypes.object,
  inputContainerClasses: PropTypes.object,
  inputClasses: PropTypes.object,
  leftIconClass: PropTypes.object,
  leftIcon: PropTypes.string,
  leftIconFocused: PropTypes.string,
  showRightIcon: PropTypes.bool,
  rightIconClass: PropTypes.object,
  rightIcon: PropTypes.string,
  rightIconActive: PropTypes.string,
  handleRightIconClick: PropTypes.func,
  onFocus: PropTypes.func,
};

export default TextInput;
