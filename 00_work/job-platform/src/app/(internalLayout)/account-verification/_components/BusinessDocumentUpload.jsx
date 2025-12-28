import React, { useEffect, useState } from "react";
import { enqueueSnackbar } from "notistack";
import { FILE_TYPES, MAX_IMAGE_API_TIMER } from "@/constants";

import { generateUploadFilePath } from "@/utils/helpers";
import UploadIcon from "@/assets/icons/common/uploadIcon.svg";
import UploadGrey from "@/assets/icons/common/uploadGrey.svg";
import useFileUpload from "@/hooks/useFileUpload";
import FileUpload from "@/components/FileUpload";

const BusinessDocumentUpload = ({
  fieldKey,
  fieldUrlKey,
  uploadTitle = "Upload Document",
  acceptType = "image/png, image/jpeg, image/jpg, application/pdf",
  data,
  setData,
  disabled = false,
  employerId,
}) => {
  const [tempDelete, setTempDelete] = useState(false);

  const {
    fileData,
    setFileData,
    handleInputChange,
    abortUpload,
    status: uploadStatus,
    isError,
    error,
    data: uploadData,
    resetFileData,
  } = useFileUpload(
    generateUploadFilePath(`${fieldKey}_DOC`, employerId, FILE_TYPES.IMAGE),
    FILE_TYPES.IMAGE.toUpperCase()
  );

  useEffect(() => {
    if (uploadStatus === "success") {
      setTempDelete(false);
      setData((prev) => ({ ...prev, [fieldUrlKey]: uploadData?.fileLink }));
    } else if (uploadStatus === "error") {
      enqueueSnackbar("Failed to upload document.", {
        variant: "error",
      });
    }
  }, [uploadStatus, uploadData]);

  useEffect(() => {
    if (tempDelete) {
      setData((prev) => ({ ...prev, [fieldUrlKey]: "" }));
    }
  }, [tempDelete]);

  const handleDelete = () => {
    setTempDelete(true);
    resetFileData();
  };

  return (
    <FileUpload
      fileData={fileData}
      fileType={FILE_TYPES.IMAGE}
      iconUrl={disabled ? <UploadGrey /> : <UploadIcon />}
      showRightIcon={true}
      iconViewBox="0 0 24 18"
      uploadTitle={uploadTitle}
      uploadData={data?.[fieldUrlKey]}
      acceptType={acceptType}
      handleInputChange={(e) => handleInputChange(e, FILE_TYPES.IMAGE)}
      handleInputDelete={handleDelete}
      abortUpload={abortUpload}
      maxApiTimer={MAX_IMAGE_API_TIMER}
      tempDelete={tempDelete}
      setTempDelete={setTempDelete}
      disabled={disabled}
      disabledBgColor={"#FFFFFF"}
    />
  );
};

export default BusinessDocumentUpload;
