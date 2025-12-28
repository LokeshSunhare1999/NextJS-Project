import CustomCTA from "@/components/CustomCTA";
import VideoPlayer from "@/components/VideoPlayer";
import React from "react";
import Star from "@/assets/icons/common/ratingStar.svg";
import RecommendedChip from "@/assets/icons/jobs/recommendedChip.svg";
import TextPill from "@/components/TextPill";
import Svg from "@/components/Svg";
import { INTERVIEW_TOTAL_SCORE, PROFILE_TOTAL_SCORE } from "@/constants";

const ApplicationVideoDrawer = ({
  customerJobId,
  videoLink = "",
  name = "",
  interviewScore = "",
  profileScore = "",
  location = "",
  handleApplicationStatusChange,
  handleMovetoNewStage,
  changeStatusReject,
  changeStatusShortlist,
  shortlistBtnText = "Shortlist",
  showCta = true,
  certificates = [],
  rating = "",
  isRecommended = false,
  disabledShortlistBtn = false,
  currentIndex = 0,
  tab,
  handleRejectNowClick,
}) => {
  const interviewObtainedScore =
    typeof interviewScore === "string"
      ? Number(interviewScore.split("/")[0])
      : 0;

  const profileObtainedScore =
    typeof profileScore === "string" ? Number(profileScore.split("/")[0]) : 0;

  return (
    <div className="flex flex-col justify-between h-full">
      <div className="bg-white rounded-[10px] p-3">
        <div className="flex-col">
          <div className="flex-col pb-2 border-b border-[#F0F0F0]">
            <p className="font-normal text-[12px] text-[#606C85]">
              Candidate Name
            </p>
            <p className="font-medium text-[16px] leading-[17px] mt-1">
              {name || "-----"}
            </p>
          </div>
          <div className="flex-col pb-2 border-b border-[#F0F0F0] mt-3">
            <p className="font-normal text-[12px] text-[#606C85]">
              Candidate Location
            </p>
            <p className="font-medium text-[16px] leading-[17px] mt-1">
              {location || "-----"}
            </p>
          </div>
          {certificates?.length > 0 ? (
            <div className="flex-col pb-2 border-b border-[#F0F0F0] mt-3">
              <p className="font-normal text-[12px] text-[#606C85]">
                Saathi Certificate
              </p>
              <p className="font-medium text-[16px] leading-[17px] mt-1">
                {certificates?.length} Certificates
              </p>
              <div className="flex flex-wrap gap-1 mt-1">
                {certificates?.map((certificate, index) => (
                  <TextPill
                    text={certificate?.name}
                    key={certificate?.name}
                    rewardId={certificate?._id}
                  />
                ))}
              </div>
            </div>
          ) : null}

          <div className="flex-col pb-2 border-b border-[#F0F0F0] mt-3">
            <p className="font-normal text-[12px] text-[#606C85] flex gap-1 items-center">
              Saathi Rating{" "}
              <Svg width="16" height="16" viewBox="0 0 16 16" icon={<Star />} />
            </p>
            <p className="font-medium text-[16px] leading-[17px] mt-1">
              {rating || 0}/5
            </p>
          </div>
        </div>
        <div className="h-fit p-4 bg-[#EDF1F6] justify-center flex-col items-center flex rounded-[10px] my-3">
          <VideoPlayer videoLink={videoLink} />
          <div className="flex-col justify-center items-center flex mt-2">
            <div className="flex gap-5 m-2">
              {interviewScore ? (
                <>
                  <div className="flex-col">
                    <div className="text-[20px] leading-[28px] text-center">
                      <span className="text-[#139117]">
                        {interviewObtainedScore || 0}
                      </span>
                      <span className="text-[#999898]">
                        /{INTERVIEW_TOTAL_SCORE}
                      </span>
                    </div>
                    <p className="text-[16px] font-medium leading-[17px]">
                      Interview Score
                    </p>
                  </div>
                  <span className="border border-[#C5D1DF]"></span>
                </>
              ) : null}

              <div className="flex-col">
                <div className="text-[20px] leading-[28px] text-center">
                  <span className="text-[#139117]">
                    {profileObtainedScore || 0}
                  </span>
                  <span className="text-[#999898]">/{PROFILE_TOTAL_SCORE}</span>
                </div>
                <p className="text-[16px] font-medium leading-[17px]">
                  Profile Score
                </p>
              </div>
            </div>

            {isRecommended ? (
              <div className="mt-3">
                <Svg
                  width="134"
                  height="26"
                  viewBox="0 0 134 26"
                  icon={<RecommendedChip />}
                />
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {showCta ? (
        <div className="mt-10 w-full flex flex-col gap-5">
          <CustomCTA
            title="Reject"
            backgroundColor="#ffffff"
            borderColor="#DEDEDE"
            borderRadius="8px"
            textColor="#FF3232"
            width="100%"
            height="29px"
            hoverBgColor="#FF3232"
            hoverTextColor="#ffffff"
            hoverBorderColor="#FF3232"
            onClickFn={() => {
              tab === 0
                ? handleRejectNowClick()
                : handleApplicationStatusChange(
                    customerJobId,
                    changeStatusReject
                  );
            }}
          />
          <CustomCTA
            title={shortlistBtnText}
            backgroundColor="#139117"
            borderColor="#32B237"
            borderRadius="8px"
            textColor="#FFFFFF"
            width="100%"
            height="29px"
            hoverBgColor="#32B237"
            hoverTextColor="#ffffff"
            hoverBorderColor="#32B237"
            onClickFn={() => {
              handleMovetoNewStage(currentIndex, customerJobId);
            }}
            disabled={disabledShortlistBtn}
          />
        </div>
      ) : null}
    </div>
  );
};

export default ApplicationVideoDrawer;
