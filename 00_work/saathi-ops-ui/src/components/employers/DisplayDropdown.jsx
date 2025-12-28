import { Select } from 'antd';
import React from 'react';

const DisplayDropdown = ({
  disabled,
  handleChangeFn,
  options,
  placeholder,
  placeholderColor,
  defaultValue,
  height = 40,
  value,
  showSearch = true,
  mode,
}) => {
  const filterOption = (inputValue, option) =>
    option.label.toLowerCase().includes(inputValue.toLowerCase());
  return (
    <Select
      mode={mode}
      disabled={disabled}
      showSearch={showSearch}
      filterOption={filterOption}
      style={{ width: '100%', height }}
      defaultValue={defaultValue}
      onChange={(value) => handleChangeFn(value)}
      value={value}
      options={options}
      placeholder={
        <span
          style={{
            color: placeholderColor, // Apply the custom placeholder color
          }}
        >
          {placeholder}
        </span>
      }
    />
  );
};

export default DisplayDropdown;
