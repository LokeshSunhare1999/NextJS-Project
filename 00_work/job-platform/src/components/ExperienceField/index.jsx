import ErrorField from "@/app/(internalLayout)/_components/ErrorField";
import React from "react";

const ExperienceField = ({
  value = "",
  handleChange,
  placeholder,
  isError,
  errorText,
  disabled,
  inputBg = "#FFF",
}) => {
  const parseValue = (val) => {
    if (val === undefined || val === null || val === "") {
      return 0;
    }
    const num = parseInt(val);
    return isNaN(num) ? 0 : num;
  };

  const increment = () => {
    if (disabled) return;
    const currentValue = parseValue(value);
    handleChange((currentValue + 1).toString());
  };

  const decrement = () => {
    if (disabled) return;
    const currentValue = parseValue(value);
    if (currentValue > 0) {
      handleChange((currentValue - 1).toString());
    }
  };

  const displayValue =
    value === undefined || value === null ? "" : value.toString();

  return (
    <div className="w-full">
      <div
        className={`flex items-center justify-between border ${
          isError ? "border-red-500" : "border-[#BAC8D3]"
        } rounded-lg bg-${inputBg} h-10`}
      >
        <button
          type="button"
          onClick={decrement}
          disabled={disabled}
          className={`flex items-center justify-center text-sm font-medium min-w-[28px] h-8 ${
            disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 cursor-pointer"
          } rounded-md ml-1`}
        >
          -
        </button>
        <input
          type="text"
          value={displayValue}
          onChange={(e) => handleChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full text-sm bg-transparent border-none focus:outline-none text-center ${
            disabled ? "text-gray-400 cursor-not-allowed" : "text-gray-800"
          } px-1`}
        />
        <button
          type="button"
          onClick={increment}
          disabled={disabled}
          className={`flex items-center justify-center text-sm font-medium min-w-[28px] h-8 ${
            disabled
              ? "text-gray-300 cursor-not-allowed"
              : "text-gray-600 cursor-pointer"
          } rounded-md mr-1`}
        >
          +
        </button>
      </div>
      {isError ? <ErrorField errorText={errorText} /> : null}
    </div>
  );
};

export default ExperienceField;
