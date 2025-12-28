"use client";
import React, { useState } from "react";
import VideoPlayer from "../VideoPlayer";
import ShakaVideoPlayer from "../ShakaPlayer";
import DisplayDrawer from "../Drawer";
export default function DetailsContainer(props) {
  const { title, detailsData, showTitle = false, showGrid = false } = props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [currentVideo, setCurrentVideo] = useState(null);
  const [isMpd, setIsMpd] = useState(false);

  const capitalizeKey = (key) => {
    return key
      .replace(/([A-Z])/g, " $1")
      .replace(/([A-Z]) ([A-Z])/g, "$1$2")
      .replace(/([A-Za-z])(\d)/g, "$1 $2")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  const openVideoPlayer = (e, videoLink, isMpd) => {
    e.stopPropagation();
    setCurrentVideo(videoLink);
    setIsMpd(isMpd);
    setIsDrawerOpen(true);
  };

  const handleContentConfig = (item, type) => {
    if (
      item === null ||
      item === undefined ||
      item === "" ||
      item?.length === 0
    )
      return "-----";

    switch (type) {
      case "jobRole":
        return item;
      case "video": {
        if (item === "-----") return "-----";
        const fileExtension = item.slice(item.lastIndexOf("."));
        return (
          <div
            className="underline text-[#3f7dff] cursor-pointer"
            onClick={(e) => openVideoPlayer(e, item, true)}
          >
            {" "}
            job_video
            {fileExtension}
          </div>
        );
      }
      default:
        return item;
    }
  };

  return (
    <>
      <div className="flex w-full flex-col items-start rounded-[10px] bg-white p-0.5">
        {showTitle ? (
          <div className="flex justify-between w-[calc(100%-40px)] rounded-t-[9px] bg-[#f4f6fa] px-5 py-2"></div>
        ) : null}
        <div
          className={`grid w-[calc(100%-40px)] gap-y-3 px-5 py-[10px] grid-cols-2
          }`}
        >
          {Object.keys(detailsData)?.map((item, index) => {
            return (
              <div className="flex justify-start items-start" key={index}>
                <p className="text-black text-[14px] font-normal leading-normal w-[300px]">
                  {capitalizeKey(item)}
                </p>
                <div
                  className={`text-[#000] text-[14px]  leading-normal max-w-full w-full break-words`}
                >
                  {handleContentConfig(detailsData[item], item)}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      <DisplayDrawer
        open={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title="Job Video"
      >
        {currentVideo &&
          (isMpd ? (
            <ShakaVideoPlayer videoLink={currentVideo} />
          ) : (
            <VideoPlayer />
          ))}
      </DisplayDrawer>
    </>
  );
}
