"use client";

import { FILE_TYPES } from "@/constants";
import { useRef, useState } from "react";
import { useSnackbar } from "notistack";
import DropUpload from "@/components/DropUpload";
import { usePostUploadToS3 } from "@/apis/queryHooks";

export default function UploadJD({
  jobDescriptionUrl,
  setJobDescriptionUrl,
  error,
}) {
  const { enqueueSnackbar } = useSnackbar();
  const [tempDelete, setTempDelete] = useState(false);
  const [fileUrl, setFileUrl] = useState("");
  const abortControllerRef = useRef(null);

  const { mutateAsync: uploadToS3, status: uploadFileStatus } =
    usePostUploadToS3(`JD_TEST`, FILE_TYPES?.DOCUMENT?.toUpperCase());

  const handleUploadJD = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    abortControllerRef.current = new AbortController();

    uploadToS3({
      payload: formData,
      signal: abortControllerRef.current.signal,
    })
      .then((response) => {
        setJobDescriptionUrl(response?.fileLink);
      })
      .catch((err) => {
        setFileUrl("");
        enqueueSnackbar(`Error: ${err?.response?.data?.error?.message}`, {
          variant: "error",
        });
      });
  };
  return (
    <DropUpload
      isPreview={false}
      fileUrl={fileUrl}
      closePreview={() => {}}
      uploadData={fileUrl}
      setUploadData={setFileUrl}
      onDropFn={handleUploadJD}
      classes="!bg-[#F4F6FA]"
      uploadCardClasses="!bg-[#F4F6FA]"
      height="130px"
      width="100%"
      isError={error}
      errorText={"JD is required"}
      customProps={{
        uploadStatus: uploadFileStatus,
      }}
    />
  );
}
