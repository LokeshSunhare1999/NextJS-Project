"use client";
import React, { useState } from "react";
import Link from "next/link";
import ContactModal from "@/components/layout/ContactModal";
import TermsModal from "@/components/layout/TermsModal";
import PrivacyPolicyModal from "@/components/layout/PrivacyPolicyModal";
import VideoSlider from "./VideoSlider";
import VideoActionCard from "@/app/business/VideoActionCard";
import { DOMAIN_LINK, VIDEO_DATA_BUSINESS } from "@/constants";
import Image from "next/image";

const gradientText =
  "bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] bg-clip-text text-transparent";
const gradientBg = "bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01]";

const BusinessSubPage = () => {
  const [isContactOpen, setContactOpen] = useState(false);
  const [isTermsOpen, setTermsOpen] = useState(false);
  const [isPrivacyOpen, setPrivacyOpen] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [showCarousel, setShowCarousel] = useState<string | null>(null);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);

  const handleVideoClick = (videoId: string) => {
    const video = document.getElementById(videoId) as HTMLVideoElement;
    if (video) {
      if (playingVideo === videoId) {
        video.pause();
        video.muted = true;
        setPlayingVideo(null);
      } else {
        if (playingVideo) {
          const currentVideo = document.getElementById(
            playingVideo
          ) as HTMLVideoElement;
          if (currentVideo) {
            currentVideo.pause();
            currentVideo.muted = true;
          }
        }
        video.preload = "auto";
        video.play();
        video.muted = false;
        setPlayingVideo(videoId);
      }
    }
  };

  const handleShowMore = (section: string) => {
    setShowCarousel(section);
    setCurrentVideoIndex(0);

    // Add smooth scroll to video slider container
    const videoSliderContainer = document.getElementById(
      "video-slider-container"
    );
    if (videoSliderContainer) {
      videoSliderContainer.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const handleCarouselVideoClick = (videoId: string) => {
    const video = document.getElementById(videoId) as HTMLVideoElement;
    if (video) {
      if (playingVideo === videoId) {
        video.pause();
        video.muted = true;
        setPlayingVideo(null);
      } else {
        if (playingVideo) {
          const currentVideo = document.getElementById(
            playingVideo
          ) as HTMLVideoElement;
          if (currentVideo) {
            currentVideo.pause();
            currentVideo.muted = true;
          }
        }
        video.preload = "auto";
        video.play();
        video.muted = false;
        setPlayingVideo(videoId);
      }
    }
  };

  const nextVideo = () => {
    if (showCarousel) {
      const videos =
        VIDEO_DATA_BUSINESS[showCarousel as keyof typeof VIDEO_DATA_BUSINESS];
      setCurrentVideoIndex((prev) => (prev + 1) % videos.length);
    }
  };

  const prevVideo = () => {
    if (showCarousel) {
      const videos =
        VIDEO_DATA_BUSINESS[showCarousel as keyof typeof VIDEO_DATA_BUSINESS];
      setCurrentVideoIndex(
        (prev) => (prev - 1 + videos.length) % videos.length
      );
    }
  };

  return (
    <div className="min-h-screen w-full bg-white text-white flex flex-col lg:flex-row font-poppins">
      {/* Left: Offer & Info - Fixed */}
      <div className="lg:w-[30%] w-full flex flex-col justify-between items-start px-6 lg:px-12 py-8 lg:py-10 bg-gradient-to-r from-[#24008C] to-[#4C00AD] lg:fixed lg:h-screen relative overflow-hidden">
        {/* Decorative mask overlay */}
        <Image
          src="/maskline.webp"
          alt="decorative lines"
          fill
          className="pointer-events-none select-none object-cover z-0"
          sizes="100vw"
          priority={false}
        />
        <div className="w-full flex flex-col items-start gap-8 sm:gap-6 relative z-10">
          {/* Heading */}
          <div className="pt-5 pb-7 w-full flex items-center justify-start">
            <Image
              src="/reelslogo.webp"
              alt="JobReels Logo"
              width={160}
              height={48}
              className="h-8 lg:h-12 w-auto"
            />
          </div>
          {/* Tagline */}
          <div>
            <Image
              src="/assets/businessaistrip.webp"
              alt="Business ai"
              width={800}
              height={200}
              className="w-full h-auto"
            />
          </div>
          {/* Annual Package */}
          <div className="flex flex-row items-center gap-4 justify-center">
            <div className="flex flex-col">
              <Image
                src="/assets/reduction.webp"
                alt="Reduction"
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col ml-1">
              <Image
                src="/assets/separator.svg"
                alt="Reduction"
                width={800}
                height={400}
                className="w-full h-auto"
              />
            </div>
            <div className="flex flex-col gap-1">
               <span className="text-xl sm:text-[1.3rem] font-semibold text-white uppercase leading-9">
                Time-to-Hire
              </span>
               <span className="text-xl sm:text-[1.3rem] font-semibold text-white uppercase leading-9 tracking-[-0.02em]">
                Cost-to-Hire
              </span>
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <Image
                src="/assets/arrow.svg"
                alt="Job Posts"
                width={8}
                height={8}
              />
              <span className="text-sm font-medium text-white/80 leading-5 tracking-normal">Instantly Hire Skill Certified and Identity Verified Candidates </span>
            </div>
            <div className="flex items-baseline gap-2 mt-2">
              <Image
                src="/assets/arrow.svg"
                alt="Job Posts"
                width={8}
                height={8}
              />
              <span className="text-sm font-medium text-white/80 leading-5 tracking-normal">Discover hyperlocal, relevant and pre-interviewed candidates</span>
            </div>
          </div>
          {/* Business Offer Image */}
          <div className="relative w-full max-w-auto rounded-xl overflow-hidden text-white">
            <Image
              src="/assets/businessOfferBg.webp"
              alt="Business Offer"
              width={800}
              height={128}
              className="w-full min-h-[100px]"
            />
            <div className="absolute top-2 left-5 flex flex-col justify-between">
              <div className="flex items-center gap-1">
                <h1 className="font-semibold text-[20px] leading-[32px] tracking-[-0.0625em] mr-0.5">Sign up and Get</h1>
                <Image
                  src="/assets/stars.svg"
                  alt="Star"
                  width={12}
                  height={12}
                />
              </div>

              <div className="flex items-center gap-2 mt-1">
                <Image
                  src="/assets/jobPosts.svg"
                  alt="Job Posts"
                  width={20}
                  height={20}
                />
                <span className="font-medium text-sm leading-[24px] tracking-normal text-right text-white/80">Unlimited Job Posts</span>
              </div>

              <div className="flex items-center gap-2 mt-1 ml-0.5">
                <Image
                  src="/assets/aiPosts.svg"
                  alt="AI Interviews"
                  width={16}
                  height={16}
                />
                <span className="ml-0.5 font-medium text-sm leading-[24px] tracking-normal text-right text-white/80">Finalize 50 Candidates for Free</span>
              </div>
            </div>
          </div>

          {/* Pay Now Button */}
          <button
            onClick={() => (window.location.href = "https://hire.saathi.in")}
            className={`mt-2 mb-2 w-full relative overflow-hidden text-black font-bold py-3 rounded text-lg lg:text-xl shadow-lg transition hover:scale-105`}
          >
            <span className="relative z-10">Sign up Now</span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] animate-gradient-rotate"></div>
          </button>
          <style jsx>{`
            @keyframes gradient-rotate {
              0% {
                background-position: 0% 50%;
              }
              50% {
                background-position: 100% 50%;
              }
              100% {
                background-position: 0% 50%;
              }
            }
            .animate-gradient-rotate {
              background-size: 200% 200%;
              animation: gradient-rotate 3s ease infinite;
            }
          `}</style>
        </div>
        {/* Bottom Logo and T&C */}
        <div className="hidden md:flex w-full flex-col items-start mt-8">
          <span className="text-gray-400 text-xs">
            ©Saathi 2025. All rights reserved.
          </span>
        </div>
      </div>

      {/* Right: Features & Visuals - Scrollable */}
      <div className="lg:w-[70%] w-full flex flex-col justify-between bg-gradient-to-r from-[#FFFFFF] to-[#EDDDFF] px-4 lg:px-12 py-10 lg:py-15 relative lg:ml-[30%]">
        <div className="flex flex-col items-center text-center w-full">
          <h1 className="text-2xl lg:text-4xl font-bold text-center font-poppins pt-10 bg-gradient-to-r from-[#24008C] to-[#24008C] bg-clip-text text-transparent">
            Now Hire : Faster - Better - Easier
          </h1>
        </div>

        {/* Video Slider - Only show when jobreels is selected */}
        <div id="video-slider-container">
          {showCarousel === "jobreels" && (
            <div className="lg:block w-full mb-8">
              <h2 className="text-2xl font-bold pb-4 text-center">
                <span className="text-[#24008C]">Job</span>
                <span className="text-[#4C00AD]">Reels</span>
              </h2>
              <VideoSlider
                videos={VIDEO_DATA_BUSINESS.jobreels.map((video) => ({
                  videoUrl: video.src,
                  extraText: video.title,
                  thumbnail: video.thumbnail,
                }))}
              />
            </div>
          )}
          {showCarousel === "jobposts" && (
            <div className="hidden lg:block w-full mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center">
                <span className="text-[#24008C]">Job</span>
                <span className="text-[#4C00AD]">Posts</span>
              </h2>
              <VideoSlider
                videos={VIDEO_DATA_BUSINESS.jobposts.map((video) => ({
                  videoUrl: video.src,
                  extraText: video.title,
                  thumbnail: video.thumbnail,
                }))}
              />
            </div>
          )}
          {showCarousel === "ai" && (
            <div className="hidden lg:block w-full mb-8">
              <h2 className="text-2xl font-bold mb-4 text-center">
                <span className="text-[#24008C]">AI</span>
                <span className="text-[#4C00AD]">Recruiter</span>
              </h2>
              <VideoSlider
                videos={VIDEO_DATA_BUSINESS.ai.map((video) => ({
                  videoUrl: video.src,
                  extraText: video.title,
                  thumbnail: video.thumbnail,
                }))}
              />
            </div>
          )}
        </div>
        {/* Phone Mockups */}
        <div className="w-full flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-12 py-4 lg:py-0 lg:flex-1 mt-4 lg:mt-0">
          {/* Mobile View - Video Sliders */}
          <div className="lg:hidden w-full flex flex-col gap-8">
            <div className="w-full">
              <h2 className="text-2xl font-bold pb-4 text-center">
                <span className="text-[#24008C]">Job</span>
                <span className="text-[#4C00AD]">Reels</span>
              </h2>
              <VideoSlider
                videos={VIDEO_DATA_BUSINESS.jobreels.map((video) => ({
                  videoUrl: video.src,
                  extraText: video.title,
                  thumbnail: video.thumbnail,
                }))}
              />
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold pb-4 text-center">
                <span className="text-[#24008C]">Job</span>
                <span className="text-[#4C00AD]">Posts</span>
              </h2>
              <VideoSlider
                videos={VIDEO_DATA_BUSINESS.jobposts.map((video) => ({
                  videoUrl: video.src,
                  extraText: video.title,
                  thumbnail: video.thumbnail,
                }))}
              />
            </div>
            <div className="w-full">
              <h2 className="text-2xl font-bold pb-4 text-center">
                <span className="text-[#24008C]">AI</span>
                <span className="text-[#4C00AD]">Recruiter</span>
              </h2>
              <VideoSlider
                videos={VIDEO_DATA_BUSINESS.ai.map((video) => ({
                  videoUrl: video.src,
                  extraText: video.title,
                  thumbnail: video.thumbnail,
                }))}
              />
            </div>
          </div>

          {/* Desktop View - VideoActionCards */}
          <div className="hidden lg:flex w-full flex-row justify-center items-center gap-8 lg:gap-12">
            {showCarousel !== "jobreels" && (
              <VideoActionCard
                title={
                  <>
                    <span className="text-[#24008C]">Job</span>
                    <span className="text-[#4C00AD]">Reels</span>
                  </>
                }
                gradientText={gradientText}
                videoId="jobreel-video"
                videoSrc={`${DOMAIN_LINK}MISC_VIDEOS/jobreels/jobreel-1.mp4`}
                thumbnailSrc="/videos/thumbnails/jobreels/jobreel-1.webp"
                isPlaying={playingVideo === "jobreel-video"}
                onVideoClick={handleVideoClick}
                onShowMore={handleShowMore}
                section="jobreels"
                gradientBg={gradientBg}
              />
            )}
            {showCarousel !== "jobposts" && (
              <VideoActionCard
                title={
                  <>
                    <span className="text-[#24008C]">Job</span>
                    <span className="text-[#4C00AD]">Posts</span>
                  </>
                }
                gradientText={gradientText}
                videoId="jobpost-video"
                videoSrc={`${DOMAIN_LINK}MISC_VIDEOS/jobposts/jobpost-1.mp4`}
                thumbnailSrc="/videos/thumbnails/jobposts/jobpost-1.webp"
                isPlaying={playingVideo === "jobpost-video"}
                onVideoClick={handleVideoClick}
                onShowMore={handleShowMore}
                section="jobposts"
                gradientBg={gradientBg}
              />
            )}
            {showCarousel !== "ai" && (
              <VideoActionCard
                title={
                  <>
                    <span className="text-[#24008C]">AI</span>
                    <span className="text-[#4C00AD]">Recruiter</span>
                  </>
                }
                gradientText={gradientText}
                videoId="ai-video"
                videoSrc={`${DOMAIN_LINK}MISC_VIDEOS/ai/ai-1.mp4`}
                thumbnailSrc="/videos/thumbnails/ai/ai-1.webp"
                isPlaying={playingVideo === "ai-video"}
                onVideoClick={handleVideoClick}
                onShowMore={handleShowMore}
                section="ai"
                gradientBg={gradientBg}
              />
            )}
          </div>
        </div>
        {/* Footer Links */}
        <div className="flex space-x-4 text-gray-400 text-xs lg:text-sm w-full justify-center items-center">
          <Link href="/" className="hover:text-yellow-400">
            Home
          </Link>
          <button
            onClick={() => setContactOpen(true)}
            className="hover:text-yellow-400 bg-transparent border-none cursor-pointer p-0 m-0"
          >
            Contact Us
          </button>
          <button
            onClick={() => setTermsOpen(true)}
            className="hover:text-yellow-400 bg-transparent border-none cursor-pointer p-0 m-0"
          >
            Terms
          </button>
          <button
            onClick={() => setPrivacyOpen(true)}
            className="hover:text-yellow-400 bg-transparent border-none cursor-pointer p-0 m-0"
          >
            Privacy Policy
          </button>
        </div>
        <div className="flex md:hidden w-full flex-col mt-2 justify-center items-center">
          <span className="text-gray-400 text-xs">
            ©Saathi 2025. All rights reserved.
          </span>
        </div>
      </div>
      {/* Modals */}
      {isContactOpen && <ContactModal onClose={() => setContactOpen(false)} />}
      {isTermsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-60">
          <div className="relative bg-white rounded-2xl max-w-5xl w-full p-8 text-left overflow-y-auto max-h-[80vh] text-black">
            <button
              onClick={() => setTermsOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <TermsModal onClose={() => setTermsOpen(false)} />
          </div>
        </div>
      )}
      {isPrivacyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
          <div className="relative bg-white rounded-2xl shadow-xl max-w-5xl w-full p-8 text-left overflow-y-auto max-h-[80vh] text-black">
            <button
              onClick={() => setPrivacyOpen(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
              aria-label="Close"
            >
              &times;
            </button>
            <PrivacyPolicyModal onClose={() => setPrivacyOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSubPage;
