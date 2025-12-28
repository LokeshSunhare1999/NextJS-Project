"use client";
import { useDropzone } from "react-dropzone";
import UploadIcon from "@/assets/icons/jobs/uploadIcon.svg";
import UploadCard from "@/components/UploadCard";
import { UPLOAD_TYPES } from "@/constants/index";
import Image from "next/image";
import { CloseOutlined, FilePdfOutlined } from "@ant-design/icons";
import DocumentStatusPill from "@/components/DocumentStatusPill";
import Svg from "@/components/Svg";

const DropUpload = ({
  isPreview = false,
  isClose,
  closePreview,
  fileExtension,
  fileUrl = "",
  uploadData,
  setUploadData,
  uploadType = "document",
  height = "320px",
  width = "645px",
  classes = "",
  uploadCardClasses = "",
  onDropFn,
  isError = false,
  errorText = "",
  customProps,
}) => {
  const onDrop = async (acceptedFiles) => {
    setUploadData(acceptedFiles);
    onDropFn(acceptedFiles?.[0]);
  };
  const uploadMimeTypes = {
    image: {
      "image/jpeg": [".jpeg", ".jpg"],
      "image/png": [".png"],
      "application/pdf": [".pdf"],
    },
    document: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    spreadsheet: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
      "text/csv": [".csv"],
    },
  };

  const acceptedMimeTypes = uploadMimeTypes[uploadType];

  const { getRootProps, getInputProps } = useDropzone({
    accept: acceptedMimeTypes,
    onDrop,
  });

  const getElementBasedOnFileExtension = (extension) => {
    const filename = decodeURIComponent(fileUrl?.split("/")?.pop());

    switch (extension) {
      case "pdf":
        return (
          <div className="mt-2 flex items-center gap-2">
            <div className="relative shrink-0">
              {isClose ? (
                <div
                  className="absolute right-[-10px] top-[-10px] z-10 h-[20px] w-[20px] cursor-pointer rounded-full bg-[#E1E1E1] p-1"
                  onClick={() => {
                    closePreview();
                    setUploadData([]);
                  }}
                >
                  <CloseOutlined className="absolute h-[12px] w-[12px]" />
                </div>
              ) : null}
            </div>
          </div>
        );
      case "jpg":
      case "jpeg":
      case "png":
        return (
          <div className="relative w-40">
            <Image src={fileUrl} width={160} height={100} />
            {isClose ? (
              <div
                className="absolute right-[-10px] top-[-10px] h-[20px] w-[20px] cursor-pointer rounded-full bg-[#E1E1E1] p-1"
                onClick={() => {
                  closePreview();
                  setUploadData([]);
                }}
              >
                <CloseOutlined className="absolute h-[12px] w-[12px]" />
              </div>
            ) : null}
          </div>
        );
      default:
        return (
          <div className="flex items-center gap-2">
            <a
              target="_blank"
              href={fileUrl}
              className="cursor-pointer text-[#3b2b8c]"
            >
              {filename}
            </a>
            <div
              className="h-[20px] w-[20px] cursor-pointer rounded-full bg-[#E1E1E1] p-1"
              onClick={() => {
                closePreview();
                setUploadData([]);
              }}
            >
              <CloseOutlined className="absolute h-[12px] w-[12px]" />
            </div>
          </div>
        );
    }
  };

  const previewElement = isPreview
    ? getElementBasedOnFileExtension(fileExtension)
    : false;
  return (
    <>
      {isPreview ? (
        <div className="flex w-full justify-between rounded-xl border border-[#d9d9d9] bg-white p-2 py-4">
          {previewElement}
          {customProps?.verificationStatus ? (
            <DocumentStatusPill item={customProps?.verificationStatus} />
          ) : null}
        </div>
      ) : (
        <div className="flex w-full flex-col">
          {uploadData && uploadData?.length !== 0 ? (
            <section
              style={{
                height: height,
                width: width,
              }}
              className={`flex w-full items-center justify-center rounded-xl border-2 border-dashed border-[#bbc7d3] bg-white ${classes}`}
            >
              <UploadCard
                isUploadComplete={customProps?.uploadStatus === "success"}
                classes={uploadCardClasses}
                setUploadData={setUploadData}
                fileName={uploadData?.[0]?.name}
              />
            </section>
          ) : (
            <section
              {...getRootProps({
                className: `dropzone bg-white w-full flex items-center justify-center rounded-xl border-2 border-dashed border-[#bbc7d3] cursor-pointer ${classes}`,
              })}
              style={{
                height: height,
                width: width,
              }}
            >
              <div className="flex flex-col items-center">
                <input {...getInputProps()} />
                <Svg
                  icon={<UploadIcon />}
                  className="mb-[10px]"
                  width="31"
                  height="30"
                  viewBox="0 0 31 30"
                  fill="none"
                />
                <p className="font-semibold text-[#111]">
                  Drop your file here or{" "}
                  <span className="text mb-1 text-[#141482] ">
                    Browse
                  </span>
                </p>
                <p className="font-normal text-sm text-[#818F9D]">
                  {" "}
                  Supports : {UPLOAD_TYPES[uploadType]} (Max size 10MB)
                </p>
              </div>
            </section>
          )}
          {isError ? (
            <span className="mt-1 text-xs text-[#FF3B3B]">{errorText}</span>
          ) : null}
        </div>
      )}
    </>
  );
};

export default DropUpload;
