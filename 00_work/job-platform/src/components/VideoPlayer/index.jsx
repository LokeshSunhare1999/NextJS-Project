import React from "react";

const VideoPlayer = ({ videoLink, aspectRatio, heightClass = "" }) => {
  return <video className={`${heightClass}`} src={videoLink} controls />;
};

export default VideoPlayer;
