"use client";
import { Button, ConfigProvider } from "antd";
import React, { useState } from "react";

const CustomCTA = ({
  title = "Button",
  border = "1px solid",
  backgroundColor = "#3B2B8C",
  borderColor = "#3B2B8C",
  backgroundImg = "",
  textColor = "#fff",
  hoverBgColor = "#3B2B8C",
  hoverTextColor = "#fff",
  hoverBorderColor = "#3B2B8C",
  disabledBgColor = "#E8E8E8",
  disabledTextColor = "#BDBDBD",
  disabledBorderColor = "#E8E8E8",
  leftIcon = null,
  rightIcon = null,
  hoverLeftIcon = null,
  hoverRightIcon = null,
  width,
  height = "41px",
  borderRadius = "6px",
  fontSize = "14px",
  lineHeight = "21px",
  fontWeight = "500",
  disabled = false,
  loading = false,
  onClickFn = () => {},
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const handleButtonClick = (e) => {
    if (typeof onClickFn === "function") {
      onClickFn(e);
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Button: {
            defaultBg: backgroundColor,
            defaultBorderColor: borderColor,
            defaultColor: textColor,
            defaultActiveBg: backgroundColor,
            defaultActiveColor: textColor,
            defaultActiveBorderColor: borderColor,
            defaultHoverBg: hoverBgColor,
            defaultHoverColor: hoverTextColor,
            defaultHoverBorderColor: hoverBorderColor,
            colorBgContainerDisabled: disabledBgColor,
            colorTextDisabled: disabledTextColor,
            borderColorDisabled: disabledBorderColor,
          },
        },
      }}
    >
      <Button
        disabled={disabled}
        loading={loading}
        onClick={handleButtonClick}
        type="default"
        style={{
          width: width || "fit-content",
          height: height,
          border: border,
          borderRadius: borderRadius,
          display: "flex",
          alignItems: "center",
          gap: "6px",
          boxShadow: "none",
          ...(backgroundImg ? { backgroundImage: backgroundImg } : {}),
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Icon */}
        {isHovered ? (
          <span>{hoverLeftIcon ? hoverLeftIcon : leftIcon} </span>
        ) : (
          <span>{leftIcon} </span>
        )}

        {/* Button Text */}
        <span
          style={{
            fontSize: fontSize,
            fontWeight: fontWeight,
            lineHeight: lineHeight,
          }}
        >
          {title}
        </span>

        {/* Right Icon */}
        {isHovered ? (
          <span>{hoverRightIcon ? hoverRightIcon : rightIcon} </span>
        ) : (
          <span>{rightIcon} </span>
        )}
      </Button>
    </ConfigProvider>
  );
};

export default CustomCTA;
