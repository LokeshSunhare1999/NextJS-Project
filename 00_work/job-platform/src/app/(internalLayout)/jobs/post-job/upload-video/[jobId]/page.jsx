"use client";

import Svg from "@/components/Svg";
import VideoIcon from "@/assets/icons/jobs/videoIcon.svg";
import ArrowBlueIcon from "@/assets/icons/jobs/arrowBlue.svg";
import useFileUpload from "@/hooks/useFileUpload";
import { generateUploadFilePath } from "@/utils/helpers";
import { FILE_TYPES, MAX_IMAGE_API_TIMER } from "@/constants";
import { useParams, useRouter } from "next/navigation";
import FileUpload from "@/components/FileUpload";
import { useContext, useEffect, useState } from "react";
import { useSnackbar } from "notistack";
import { useGetJobById, usePutAddJob } from "@/apis/queryHooks";
import CustomCTA from "@/components/CustomCTA";
import { ModalContext } from "@/providers/ModalProvider";
import IntroVideoModal from "@/components/VideoModal";

const UploadJobVideo = () => {
  const params = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const router = useRouter();
  const { displayModal } = useContext(ModalContext);
  const { jobId } = params;
  const [tempDelete, setTempDelete] = useState(false);
  const [videoUrl, setVideoUrl] = useState("");

  const { data: jobData } = useGetJobById(jobId);
  const { mutateAsync: editJobMutation, status: editJobStatus } =
    usePutAddJob();
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
    generateUploadFilePath(`JOB_VIDEO`, jobId, FILE_TYPES.VIDEO),
    FILE_TYPES.VIDEO.toUpperCase()
  );

  useEffect(() => {
    if (jobData?.video) {
      setVideoUrl(jobData?.video);
    }
  }, [jobData]);

  useEffect(() => {
    if (uploadStatus === "success") {
      setTempDelete(false);
      setVideoUrl(uploadData?.fileLink);
    } else if (uploadStatus === "error") {
      enqueueSnackbar("Failed to upload video.", {
        variant: "error",
      });
    }
  }, [uploadStatus, uploadData]);

  useEffect(() => {
    if (tempDelete) {
      setVideoUrl("");
    }
  }, [tempDelete]);

  const handleDelete = () => {
    setTempDelete(true);
    resetFileData();
  };

  const handlePostJobClick = async () => {
    if (!videoUrl) {
      enqueueSnackbar("Please upload a video", { variant: "error" });
      return;
    }
    const payload = {
      jobId,
      video: videoUrl,
    };

    try {
      await editJobMutation(payload);
      /** /jobs is the only entrypoint for this page, hence it will be available (cached) */
      router.push(`/jobs`);
    } catch (error) {
      enqueueSnackbar("Error saving job", { variant: "error" });
    }
  };

  const handleVideoClick = (videoUrl) => {
    if (videoUrl) {
      displayModal(
        <IntroVideoModal modalTitle="Job Video" videoLink={videoUrl} />
      );
    }
  };

  return (
    <div className="ml-[260px] mt-[78px] px-5 py-5 font-poppins text-[#000]">
      <h1 className="text-lg font-semibold mb-5">Post your first job</h1>
      <div className="bg-white rounded-md flex items-center justify-center">
        <div className="flex flex-col items-center justify-center p-10">
          <div className="bg-[#4A35A3] rounded-full w-[70px] h-[70px] flex items-center justify-center mb-3">
            <Svg
              width="30"
              height="31"
              viewBox="0 0 30 31"
              fill="none"
              icon={<VideoIcon />}
            />
          </div>
          <p className="text-2xl font-normal">Upload a Video</p>
          <p className="text-[#4d4d4d] font-normal mb-3">
            Supported Format : (mp4, mov)
          </p>
          <FileUpload
            fileData={fileData}
            fileType={FILE_TYPES.VIDEO}
            iconUrl={<ArrowBlueIcon />}
            showRightIcon={true}
            iconViewBox="1 2 30 30"
            uploadTitle={"Upload Video"}
            uploadData={videoUrl}
            acceptType={["video/mp4, video/quicktime"]}
            handleInputChange={(e) => handleInputChange(e, FILE_TYPES.VIDEO)}
            handleInputDelete={handleDelete}
            abortUpload={abortUpload}
            maxApiTimer={MAX_IMAGE_API_TIMER}
            tempDelete={tempDelete}
            setTempDelete={setTempDelete}
            // disabled={disabled}
          />
          {videoUrl ? (
            <span
              className="underline cursor-pointer text-[#3678F7] mt-3"
              onClick={() => handleVideoClick(videoUrl)}
            >
              View
            </span>
          ) : null}

          <span className="underline text-sm text-[#3678F7] mt-3">
            Download sample Video
          </span>
        </div>
      </div>
      <div className="flex mt-5 justify-end">
        <CustomCTA
          title="Update Job"
          onClickFn={() => handlePostJobClick()}
          loading={editJobStatus === "pending"}
          disabled={editJobStatus === "pending"}
          fontSize="16px"
          fontWeight="400"
          className="mt-5 w-full"
        />
      </div>
    </div>
  );
};

export default UploadJobVideo;
