import { Spin } from "antd";
import ErrorField from "./ErrorField";
import { LoadingOutlined } from "@ant-design/icons";
import InputBox from "@/components/InputBox";
import Info from "@/assets/icons/common/info.svg";
import Svg from "@/components/Svg";
import CustomTooltip from "@/components/CustomTooltip";
const FieldInput = ({
  label = "Label",
  isRequired = false,
  value,
  handleChange,
  placeholder,
  handleFocus,
  disabled,
  isError,
  errorText,
  isLoading,
  labelClasses,
  type = "text",
  inputBg,
  isInfo,
  infoText,
  filled = "none",
  filledColor = "#3b2b8c",
  ...props
}) => {
  const { className = "", inputProps } = props;
  return (
    <div className={`flex flex-col gap-[10px] ${className}`}>
      {label !== "" ? (
        <div className={`flex gap-1 ${!label ? "h-5" : ""}`}>
          <div className={`text-sm ${labelClasses || ""}`}>{label}</div>
          {isRequired ? (
            <span className="text-sm text-[#FF3B3B]">*</span>
          ) : null}

          {isInfo ? (
            <CustomTooltip title={infoText} placement="top">
              <Info />
            </CustomTooltip>
          ) : null}
        </div>
      ) : null}
      <div className="w-full">
        <div className="flex items-center gap-4">
          <InputBox
            value={value}
            onChange={handleChange}
            onFocus={handleFocus}
            filled={filled}
            icon={inputProps?.icon}
            fillColor={filledColor}
            inputBg={inputBg}
            placeholder={placeholder}
            suffix={inputProps?.suffix}
            prefix={inputProps?.prefix}
            status={isError ? "error" : ""}
            disabled={disabled}
            classes={`${inputProps?.classes} h-10`}
            type={type}
            rightIcon={inputProps?.rightIcon}
            rightIconActive={inputProps?.rightIconActive}
            handleRightIconClick={inputProps?.handleRightIconClick}
          />
          {isLoading ? (
            <Spin
              indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
            />
          ) : null}
        </div>
        {isError ? <ErrorField errorText={errorText} /> : null}
      </div>
    </div>
  );
};

export default FieldInput;
