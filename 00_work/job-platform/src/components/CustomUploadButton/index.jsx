import { useRef } from "react";
import uploadIcon from "@/assets/icons/staff/upload.svg";
import { CircularProgress } from "@mui/material";
import Svg from "@/components/Svg";

const CustomUploadButton = ({
  type = "button",
  title,
  onClick,
  showLeftIcon = false,
  showRightIcon = false,
  color = "#000000",
  bgColor = "#E5E7EB", // default Tailwind gray-200
  border = "none",
  isPermitted = true,
  fontSize = "16px",
  fontWeight = "400",
  icon = uploadIcon,
  disabled = false,
  width = "14px",
  height = "14px",
  iconViewBox = "0 0 34 34",
  gap = "16px",
  isInput = false,
  acceptType,
  handleInputChange,
  isLoading = false,
  loadingColor = "#ffffff",
  opacity = 1,
  buttonWidth = "auto",
  padding = "10px 16px",
  disabledBgColor = "#CDD4DF",
}) => {
  const hiddenFileInput = useRef(null);
  const handleInputBtnClick = () => {
    hiddenFileInput.current.click();
  };

  const handleClick = () => {
    if (!isInput) {
      onClick && onClick();
    } else {
      handleInputBtnClick();
    }
  };

  if (!isPermitted) return null;

  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={handleClick}
      className="flex items-center justify-center rounded-[10px]"
      style={{
        background: disabled || isLoading ? disabledBgColor : bgColor,
        padding: padding,
        gap: gap,
        border: border,
        opacity: opacity,
        width: buttonWidth,
        cursor: disabled || isLoading ? "not-allowed" : "pointer",
      }}
    >
      {isLoading ? (
        <CircularProgress sx={{ color: loadingColor }} size={24} />
      ) : (
        <>
          {showLeftIcon && (
            <Svg
              width={width}
              height={height}
              viewBox={iconViewBox}
              icon={icon}
            />
          )}
          <p
            style={{
              color,
              fontSize,
              fontWeight,
              fontFamily: "Poppins",
              margin: 0,
            }}
          >
            {title}
          </p>
          {showRightIcon && (
            <Svg
              width={width}
              height={height}
              viewBox={iconViewBox}
              icon={icon}
            />
          )}
          <input
            type="file"
            onChange={(e) => handleInputChange(e)}
            ref={hiddenFileInput}
            accept={acceptType}
            className="hidden"
          />
        </>
      )}
    </button>
  );
};

export default CustomUploadButton;
