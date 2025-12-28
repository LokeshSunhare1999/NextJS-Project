import ProgressBar from "@/components/ProgressBar";
import { extractStringAfterMediaType, truncateFileName } from "@/utils/helpers";
import ThumbnailWhite from "@/assets/icons/common/thumbnailIcon.svg";
import Document from "@/assets/icons/common/document.svg";
import WhiteCross from "@/assets/icons/common/whiteCross.svg";
import DeleteIcon from "@/assets/icons/common/deleteIcon.svg";
import CrossIcon from "@/assets/icons/common/crossIcon.svg";
import { MAX_FILENAME_LENGTH } from "@/constants";

import Svg from "@/components/Svg";
import CustomUploadButton from "../CustomUploadButton";

const FileUpload = ({
  fileData,
  fileType,
  iconUrl,
  uploadTitle,
  acceptType,
  handleInputChange,
  handleInputDelete,
  abortUpload,
  maxApiTimer,
  uploadData,
  maxFileNameLength = MAX_FILENAME_LENGTH,
  tempDelete = false,
  setTempDelete = () => {},
  isProcessing = false,
  showEmptyProgress = false,
  disabled = false,
  showLeftIcon,
  showRightIcon,
  iconViewBox,
  disabledBgColor,
}) => {
  const SECONDARY_ICON = {
    IMAGE: ThumbnailWhite,
    DOCUMENT: Document,
  };

  const handleInputCTAClick = (e) => {
    setTempDelete(false);
    handleInputChange(e);
  };

  const renderPlaceholder = () => {
    return (
      <CustomUploadButton
        showRightIcon={showRightIcon}
        showLeftIcon={showLeftIcon}
        title={uploadTitle}
        color={disabled ? "#ABABAB" : "#141482"}
        bgColor={"#ffffff"}
        border={
          disabled ? "1px solid #ABABAB" : "1px solid rgba(20, 20, 130, 1)"
        }
        fontSize={"14px"}
        width={"25"}
        height={"25"}
        padding={"6px 16px"}
        iconViewBox={iconViewBox}
        gap={"10px"}
        icon={iconUrl}
        isInput={true}
        acceptType={acceptType}
        handleInputChange={(e) => handleInputCTAClick(e)}
        disabled={disabled}
        disabledBgColor={disabledBgColor}
      />
    );
  };

  if (showEmptyProgress) {
    return <> {renderPlaceholder()}</>;
  } else if (
    uploadData?.length > 0 &&
    fileData?.fileName?.length === 0 &&
    !tempDelete
  ) {
    return (
      <div className="flex flex-col gap-2 relative">
        <div className="flex flex-row items-center gap-2 bg-[#141A82] p-2 rounded-md text-white text-sm w-fit">
          <Svg
            width="14px"
            height="14px"
            viewBox="0 0 16 16"
            icon={SECONDARY_ICON?.[fileType?.toUpperCase()]}
          />
          {truncateFileName(
            extractStringAfterMediaType(uploadData),
            maxFileNameLength
          )}
          <div className="w-px h-4 bg-[#6161AF]"></div>
          <Svg
            width="14px"
            height="14px"
            viewBox="0 0 16 16"
            className={"cursor-pointer"}
            icon={<WhiteCross />}
            onClick={() => setTempDelete(true)}
          />
        </div>
      </div>
    );
  } else if (isProcessing) {
    return (
      <CustomUploadButton
        title={`Video Processing`}
        showIcon={false}
        color={"#7f7f7f"}
        bgColor={"#ffffff"}
        border={"1px solid #7f7f7f"}
        fontSize={"14px"}
        width={"25"}
        height={"25"}
        iconViewBox="1 2 30 30"
        gap={"10px"}
        disabled={true}
      />
    );
  }
  return (
    <>
      {!fileData?.showProgress ? (
        renderPlaceholder()
      ) : (
        <div className="flex flex-col gap-2 relative">
          <div className="flex flex-row gap-2 items-center">
            <p className="text-[#141482] text-xs font-normal leading-[18px]">
              {truncateFileName(fileData?.fileName)}
            </p>
            {fileData?.uploaded ? (
              <Svg
                width="14px"
                height="14px"
                className={"cursor-pointer"}
                viewBox="0 0 16 16"
                icon={<DeleteIcon />}
                onClick={() => handleInputDelete(fileType)}
              />
            ) : (
              <Svg
                width="14px"
                height="14px"
                viewBox="0 0 16 16"
                className={"cursor-pointer"}
                icon={<CrossIcon />}
                onClick={() => abortUpload()}
              />
            )}
          </div>
          <ProgressBar
            isUploadComplete={fileData?.uploaded}
            apiTimer={maxApiTimer}
          />
        </div>
      )}
    </>
  );
};

export default FileUpload;
