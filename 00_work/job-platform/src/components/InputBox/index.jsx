"use client";
import { ConfigProvider, Input } from "antd";
import styles from "./InputBox.module.css";
import { useState } from "react";
const InputBox = ({
  isFloat = false,
  value,
  onChange = () => {},
  onFocus = () => {},
  filled = "none",
  type = "text",
  icon,
  label = "Name",
  prefix,
  suffix,
  placeholder = "Enter  your input here..",
  fillColor = "#F7F7F7",
  activeBorderColor = "#d9d9d9",
  hoverBorderColor = "#d9d9d9",
  inputBg = "#f7f7f7",
  disabled = false,
  status = "",
  onKeyDown = () => {},
  classes = "",
  rightIconActive,
  rightIcon,
  handleRightIconClick,
}) => {
  const [focus, setFocus] = useState(false);
  const [secondaryIconActive, setSecondaryIconActive] = useState(false);

  const isOccupied = focus || (value && value.length !== 0);

  const labelClass = isOccupied
    ? `${styles.label} ${styles.asLabel}`
    : `${styles.label} ${styles.asPlaceholder}`;

  const handleSecondaryIconClick = () => {
    setSecondaryIconActive(!secondaryIconActive);
    handleRightIconClick();
  };

  return (
    <div className="relative flex w-full items-stretch">
      {filled === "left" ? (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-bl-md rounded-tl-md"
          style={{ background: fillColor }}
        >
          {icon}
        </div>
      ) : null}
      <div
        className={`${styles.floatLabel} flex w-full`}
        onBlur={() => setFocus(false)}
        onFocus={() => setFocus(true)}
      >
        <ConfigProvider
          theme={{
            token: {
              Input: {
                activeBorderColor: activeBorderColor,
                hoverBorderColor: hoverBorderColor,
                colorBgContainer: inputBg, // Sets input background
              },
            },
          }}
        >
          <Input
            value={value}
            type={type}
            onChange={(e) => onChange(e.target.value)}
            onFocus={(e) => onFocus(e)}
            onKeyDown={onKeyDown}
            status={status}
            className={`${classes} ${
              filled === "left"
                ? "!rounded-bl-none !rounded-tl-none"
                : filled === "right"
                ? !"!rounded-tr-none rounded-br-none"
                : ""
            }`}
            suffix={suffix}
            prefix={prefix}
            placeholder={isFloat ? "" : placeholder}
            disabled={disabled}
          />
          {isFloat ? (
            <label className={labelClass}>
              {isOccupied ? label : placeholder}
            </label>
          ) : null}
        </ConfigProvider>
      </div>

      {rightIcon && (
        <div
          className="absolute right-[10px] top-[6px] z-10 cursor-pointer"
          onClick={(e) => handleSecondaryIconClick(e)}
        >
          {secondaryIconActive ? rightIconActive : rightIcon}
        </div>
      )}
      {filled === "right" ? (
        <div
          className="flex h-10 w-10 items-center justify-center rounded-br-md rounded-tr-md"
          style={{ background: fillColor }}
        >
          {icon}
        </div>
      ) : null}
    </div>
  );
};
export default InputBox;
