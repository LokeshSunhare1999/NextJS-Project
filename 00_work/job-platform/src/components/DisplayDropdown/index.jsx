import React from "react";
import { ConfigProvider, Select } from "antd";

const DisplayDropdown = ({
  disabled,
  handleChangeFn,
  options,
  placeholder,
  defaultValue,
  height = 40,
  value,
  showSearch = false,
  inputBg = "#F7F7F7",
  filterOption = () => {},
}) => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Select: {
            colorBgContainer: inputBg,
            colorText: "#585858",
            borderRadius: 8,
            controlHeight: 40,
            fontSize: 14,
            fontWeight: 400,
            optionSelectedColor: "#141482",
            optionActiveBg: "#E6F0FF",
            controlOutlineWidth: 0,
          },
        },
      }}
    >
      <Select
        // className="bg-[#F7F7F7] text-[#585858] font-normal rounded-lg px-5 py-2 text-sm w-full shadow-tiny"
        disabled={disabled}
        showSearch={showSearch}
        filterOption={filterOption}
        style={{ width: "100%", height }}
        defaultValue={defaultValue}
        onChange={(value) => handleChangeFn(value)}
        value={value}
        options={options}
        placeholder={placeholder}
      />
    </ConfigProvider>
  );
};

export default DisplayDropdown;
