"use client";

import { useState, useRef, useEffect } from "react";
import Image from 'next/image';

interface VideoItem {
  id: string;
  title: string;
  thumbnailUrl: string;
  videoUrl: string;
  youtubeUrl: string;
}

interface VideoTickerProps {
  videos: VideoItem[];
  title: string;
}

export default function VideoTickerComponent({ videos, title }: VideoTickerProps) {
  const [isHovering, setIsHovering] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);
  const videoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);

    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Helper function to get unique video ref key
  const getVideoRefKey = (id: string, isDuplicate: boolean) => {
    return `${id}-${isDuplicate ? 'duplicate' : 'original'}`;
  };

  const handleCardHover = (id: string, isHovering: boolean, isDuplicate: boolean = false) => {
    if (isMobile) return; // Don't handle hover on mobile

    setIsHovering(isHovering ? id : null);

    // Play or pause video based on hover state
    const videoRefKey = getVideoRefKey(id, isDuplicate);
    const videoElement = videoRefs.current[videoRefKey];
    if (videoElement) {
      if (isHovering) {
        videoElement.currentTime = 0;
        videoElement.muted = false;
        const playPromise = videoElement.play();
        if (playPromise !== undefined) {
          playPromise.catch(error => {
            console.log("Video play failed:", error);
            // If autoplay fails, try playing muted
            videoElement.muted = true;
            videoElement.play().catch(e => console.log("Muted video play failed:", e));
          });
        }
      } else {
        videoElement.pause();
        videoElement.currentTime = 0;
        videoElement.muted = true;
      }
    }
  };

  const handleCardClick = (id: string, isDuplicate: boolean = false) => {
    // Find the video and open modal
    const video = videos.find(v => v.id === id);
    if (video) {
      setSelectedVideo(video);
    }
  };

  return (
    <div className="w-full overflow-hidden  md:py-10">
      <h2 className="text-lg md:text-[28px] font-bold text-gray-500 mb-6">{title}</h2>

      {/* Video Modal */}
      {selectedVideo && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="bg-black rounded-lg overflow-hidden w-full max-w-4xl relative"
          >
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="aspect-video relative">
              <video
                src={selectedVideo.videoUrl}
                className="w-full h-full object-cover"
                controls
                autoPlay
                playsInline
              />
            </div>
            <div className="p-4 bg-gradient-to-t from-black to-transparent">
              <h3 className="text-white text-xl md:text-xl font-bold">{selectedVideo.title}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="relative overflow-hidden">
        <div
          ref={tickerRef}
          className="flex animate-ticker"
          style={{
            willChange: 'transform',
            width: 'fit-content'
          }}
        >
          {/* Original items */}
          {videos.map((video) => (
            <div
              key={`original-${video.id}`}
              className={`relative flex-shrink-0 mx-2 transition-all duration-300 ${isHovering === video.id
                  ? 'w-[364px] md:w-[468px] h-[208px] md:h-[260px] md:z-10 md:scale-105'
                  : 'w-[280px] md:w-[360px] h-[160px] md:h-[200px]'
                }`}
              onMouseEnter={() => !isMobile && handleCardHover(video.id, true, false)}
              onMouseLeave={() => !isMobile && handleCardHover(video.id, false, false)}
              onClick={() => handleCardClick(video.id, false)}
            >
              <div className="w-full h-full relative rounded-lg overflow-hidden">
                {/* YouTube iframe (shown on hover) */}
                {isHovering === video.id && video.youtubeUrl && (
                  <iframe
                    src={`${video.youtubeUrl.includes('embed') ? video.youtubeUrl : video.youtubeUrl.replace('watch?v=', 'embed/')}?autoplay=1&controls=0&loop=1&playlist=${video.youtubeUrl.includes('embed') ? video.youtubeUrl.split('/').pop()?.split('?')[0] : video.youtubeUrl.split('v=')[1]}`}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {/* Video element (hidden until hover/click) */}
                {!video.youtubeUrl && (
                  <video
                    ref={el => {
                      if (el) videoRefs.current[getVideoRefKey(video.id, false)] = el;
                    }}
                    src={video.videoUrl}
                    className={`absolute inset-0 w-full h-full object-cover ${isHovering === video.id ? 'opacity-100 z-10' : 'opacity-0'
                      }`}
                    playsInline
                    loop
                    muted
                    preload="auto"
                  />
                )}

                {/* Thumbnail image (shown when not hovering/active) */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${isHovering === video.id ? 'opacity-0' : 'opacity-100'
                  }`}>
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    fill
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 468px"
                    className="object-cover"
                    // priority
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement;
                      target.style.backgroundColor = '#333';
                      target.style.display = 'block';
                    }}
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-white font-semibold truncate">{video.title}</h3>
                </div>

                {/* Play indicator for mobile */}
                {isMobile && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Duplicate items for seamless loop */}
          {videos.map((video) => (
            <div
              key={`duplicate-${video.id}`}
              className={`relative flex-shrink-0 mx-2 transition-all duration-300 ${isHovering === video.id
                  ? 'w-[364px] md:w-[468px] h-[208px] md:h-[260px] md:z-10 md:scale-105'
                  : 'w-[280px] md:w-[360px] h-[160px] md:h-[200px]'
                }`}
              onMouseEnter={() => !isMobile && handleCardHover(video.id, true, true)}
              onMouseLeave={() => !isMobile && handleCardHover(video.id, false, true)}
              onClick={() => handleCardClick(video.id, true)}
            >
              <div className="w-full h-full relative rounded-lg overflow-hidden">
                {/* YouTube iframe (shown on hover) */}
                {isHovering === video.id && video.youtubeUrl && (
                  <iframe
                    src={`${video.youtubeUrl.includes('embed') ? video.youtubeUrl : video.youtubeUrl.replace('watch?v=', 'embed/')}?autoplay=1&controls=0&loop=1&playlist=${video.youtubeUrl.includes('embed') ? video.youtubeUrl.split('/').pop()?.split('?')[0] : video.youtubeUrl.split('v=')[1]}`}
                    className="absolute inset-0 w-full h-full object-cover z-10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}

                {/* Video element (hidden until hover/click) */}
                {!video.youtubeUrl && (
                  <video
                    ref={el => {
                      if (el) videoRefs.current[getVideoRefKey(video.id, true)] = el;
                    }}
                    src={video.videoUrl}
                    className={`absolute inset-0 w-full h-full object-cover ${isHovering === video.id ? 'opacity-100 z-10' : 'opacity-0'
                      }`}
                    playsInline
                    loop
                    muted={false}
                    preload="auto"
                  />
                )}

                {/* Thumbnail image (shown when not hovering/active) */}
                <div className={`absolute inset-0 transition-opacity duration-300 ${isHovering === video.id ? 'opacity-0' : 'opacity-100'
                  }`}>
                  <Image
                    src={video.thumbnailUrl}
                    alt={video.title}
                    width={360} // fallback width
                    height={200}
                    loading="lazy"
                    sizes="(max-width: 768px) 280px, (max-width: 1024px) 360px, 468px"
                    className="object-cover w-full h-full"
                    onError={(e) => {
                      // Fallback for missing images
                      const target = e.target as HTMLImageElement;
                      target.style.backgroundColor = '#333';
                      target.style.display = 'block';
                    }}
                  />
                </div>

                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                {/* Content overlay */}
                <div className="absolute bottom-0 left-0 p-4 w-full">
                  <h3 className="text-white font-bold truncate">{video.title}</h3>
                </div>

                {/* Play indicator for mobile */}
                {isMobile && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                        <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes ticker {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-ticker {
          animation: ticker 30s linear infinite;
        }

        .animate-ticker:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
} 