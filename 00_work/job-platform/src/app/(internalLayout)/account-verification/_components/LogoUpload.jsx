"use client";
import React, { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import PropTypes from "prop-types";
import useLogoUpload from "@/hooks/useLogoUpload";
import { FILE_TYPES, LOGO_TEXT } from "@/constants";
import { generateUploadFilePath } from "@/utils/helpers";
import UploadLogo from "@/assets/icons/common/uploadLogo.svg";
import CustomCTA from "@/components/CustomCTA";
import Svg from "@/components/Svg";

const LogoUpload = ({
  initialIcon,
  successIcon,
  loadingIcon,
  uploadTitle = "Upload Logo",
  fileType = "image/png, image/jpeg, image/jpg",
  maxFileSizeInMB = 5,
  setImage,
  imageUrl = "",
  onUploadFn,
  employerId,
}) => {
  const { logo, isUploading, error, handleFileChange, status, isError, data } =
    useLogoUpload(
      generateUploadFilePath("LOGO", employerId, FILE_TYPES?.IMAGE),
      FILE_TYPES?.IMAGE?.toUpperCase(),
      maxFileSizeInMB
    );

  const [currentLogo, setCurrentLogo] = useState(initialIcon || "");
  const [logoText, setLogoText] = useState(
    initialIcon ? LOGO_TEXT.SUCCESS : ""
  );

  useEffect(() => {
    if (initialIcon) {
      setCurrentLogo(initialIcon);
      setLogoText(LOGO_TEXT.SUCCESS);
    }
  }, [initialIcon]);

  useEffect(() => {
    if (status === "success" && logo) {
      setCurrentLogo(logo);
      setLogoText(LOGO_TEXT.SUCCESS);
      setImage(logo);
      if (typeof onUploadFn === "function") onUploadFn(logo);
    } else if (status === "pending") {
      setCurrentLogo(loadingIcon);
      setLogoText(LOGO_TEXT.PENDING);
    }

    if (isError || error) {
      enqueueSnackbar(error || "Failed to upload logo", {
        variant: "error",
      });
    }
  }, [status, logo, isError, error, loadingIcon]);

  const triggerFileInput = () => {
    document.getElementById("logo-upload").click();
  };

  return (
    <div className="flex flex-col justify-start">
      <div
        className={`flex flex-col justify-start gap-1 ${
          currentLogo ? "mt-[-5px]" : ""
        }`}
      >
        <div
          className={`flex items-center justify-start overflow-hidden ${
            currentLogo === ""
              ? "w-[180px] h-[60px] "
              : "ml-2 w-[60px] h-[60px] rounded-full"
          }`}
        >
          <label htmlFor="logo-upload" className="cursor-pointer">
            {!isUploading && currentLogo ? (
              <img
                src={currentLogo}
                alt={"Uploaded Logo"}
                className="w-full h-full object-cover cursor-pointer"
              />
            ) : (
              <div onClick={triggerFileInput}>
                <CustomCTA
                  title={
                    !isUploading ? (
                      <div className="flex flex-col items-center justify-center w-full h-full">
                        <Svg
                          width="16"
                          height="18"
                          viewBox="0 0 14 16"
                          className=""
                          icon={<UploadLogo />}
                        />
                        <span className="leading-none text-center">Upload</span>
                        <span className="leading-none text-center mt-1">
                          Logo
                        </span>
                      </div>
                    ) : null
                  }
                  width="61px"
                  height="60px"
                  fontSize="11px"
                  borderRadius="50%"
                  fontWeight="400"
                  border={"2px dashed rgba(20, 20, 130, 0.5)"}
                  backgroundColor="#fff"
                  textColor="#141482"
                  hoverBgColor="#fff"
                  hoverTextColor="#141482"
                  loading={isUploading}
                />
              </div>
            )}
          </label>
          <input
            id="logo-upload"
            type="file"
            accept={fileType}
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <label htmlFor="logo-upload" className="cursor-pointer">
          <p
            className={`font-normal text-xs text-[#141482] ${
              logoText === LOGO_TEXT.SUCCESS ? "underline" : "no-underline"
            }`}
          >
            {logoText}
          </p>
        </label>
      </div>
    </div>
  );
};

LogoUpload.propTypes = {
  initialIcon: PropTypes.string.isRequired,
  successIcon: PropTypes.string,
  loadingIcon: PropTypes.string.isRequired,
  uploadTitle: PropTypes.string,
  fileType: PropTypes.string,
  maxFileNameLength: PropTypes.number,
  setImage: PropTypes.func.isRequired,
  imageUrl: PropTypes.string,
  onUploadFn: PropTypes.func,
};

export default LogoUpload;
