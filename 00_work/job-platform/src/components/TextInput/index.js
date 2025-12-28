'use client';

import { NUMBER } from '@/constants/index';
import { REGEX } from '@/constants/regex';
import { useState } from 'react';

const TextInput = ({
  ariaLabel = '',
  type = 'text',
  name,
  placeholder,
  value,
  setValue,
  label,
  labelClasses = '',
  inputContainerClasses = '',
  inputClasses = '',
  leftIcon,
  rightIcon,
  rightIconActive,
  inputType,
  handleRightIconClick = () => {},
  onFocus = () => {},
  disabled = false,
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

  const handleChange = (e) => {
    const inputValue = e.target.value;
    // if (inputType === NUMBER) {
    //   if (inputValue === '' || REGEX.number.test(inputValue)) setValue(inputValue);
    // } else setValue(inputValue);
    setValue(inputValue);
  };

  return (
    <div className="flex flex-col gap-[10px]">
      <label className={`${labelClasses}`}>{label}</label>
      <div className={`relative flex items-center ${inputContainerClasses}`}>
        {/* Left Icon */}
        {leftIcon && (
          <div alt="left-icon" className="top-4.5 absolute left-4">
            {leftIcon}
          </div>
        )}

        {/* Input */}
        <input
          aria-label={ariaLabel}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onFocus={focusHandler}
          onBlur={blurHandler}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-md focus:outline-none ${inputClasses}`}
        />

        {/* Label (Placeholder) */}
        {/* <label className={`absolute left-4 top-[-12px] bg-white ${labelClasses}`}>{label}</label> */}

        {/* Right Icon */}
        {rightIcon && (
          <div
            className="top-4.5 absolute right-4 cursor-pointer"
            onClick={handleSecondaryIconClick}
          >
            {secondaryIconActive ? rightIconActive : rightIcon}
          </div>
        )}
      </div>
    </div>
  );
};

export default TextInput;
