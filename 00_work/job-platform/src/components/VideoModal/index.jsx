import React from "react";
import ShakaVideoPlayer from "../ShakaPlayer";
import VideoPlayer from "../VideoPlayer";

const IntroVideoModal = ({
  videoLink,
  modalTitle = "Intro Video",
  aspectRatio,
  isMpd = false,
}) => {
  return (
    <div className="p-5">
      <p className="text-black text-2xl font-semibold leading-normal mb-5 font-[Poppins]">
        {modalTitle}
      </p>
      <div className="w-full flex items-center justify-center font-[Poppins]">
        {isMpd ? (
          <ShakaVideoPlayer aspectRatio={aspectRatio} videoLink={videoLink} />
        ) : (
          <VideoPlayer aspectRatio={aspectRatio} videoLink={videoLink} />
        )}
      </div>
    </div>
  );
};

export default IntroVideoModal;
