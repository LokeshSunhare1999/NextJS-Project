import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { FaPlay } from "react-icons/fa";
import { ImSpinner8 } from "react-icons/im";
import Image from "next/image";

interface Video {
    videoUrl: string;
    extraText?: string;
    thumbnail: string;
}

interface VideoCardProps {
  video: Video;
  paused: boolean;
  isActive: boolean;
  thumbnail: string;
  onPrev: () => void;
  onNext: () => void;
  shouldPreload?: boolean;
}

const VideoCard = ({ video, paused, isActive, thumbnail, onPrev, onNext, shouldPreload = false }: VideoCardProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Preload video if it's the next or previous one
  useEffect(() => {
    if (shouldPreload && videoRef.current) {
      videoRef.current.load();
    }
  }, [shouldPreload]);

  useEffect(() => {
    if (!cardRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (videoRef.current) {
            if (!entry.isIntersecting) {
              videoRef.current.pause();
              videoRef.current.muted = true;
              setIsPlaying(false);
            } else if (isActive && !paused) {
              videoRef.current.muted = false;
              videoRef.current.play().catch(() => {
                setIsPlaying(false);
                videoRef.current!.muted = true;
              });
              setIsPlaying(true);
            }
          }
        });
      },
      {
        threshold: 0.5,
      }
    );

    observer.observe(cardRef.current);

    return () => {
      observer.disconnect();
    };
  }, [isActive, paused]);

  useEffect(() => {
    if (videoRef.current) {
      if (paused) {
        videoRef.current.pause();
        videoRef.current.muted = true;
        setIsPlaying(false);
      } else if (isActive) {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
          videoRef.current!.muted = true;
        });
        setIsPlaying(true);
      }
    }
  }, [paused, isActive]);

  const handleVideoClick = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        videoRef.current.muted = true;
        setIsPlaying(false);
      } else {
        videoRef.current.muted = false;
        videoRef.current.play().catch(() => {
          setIsPlaying(false);
          videoRef.current!.muted = true;
        });
        setIsPlaying(true);
      }
    }
  };

  const handleVideoLoad = () => {
    setIsLoaded(true);
  };

  const handleWaiting = () => {
    setIsBuffering(true);
  };

  const handlePlaying = () => {
    setIsBuffering(false);
  };

  return (
    <div 
      ref={cardRef}
      className="relative w-[220px] lg:w-[240px] aspect-[9/16] rounded-xl overflow-hidden cursor-pointer"
      onClick={handleVideoClick}
    >
      {isActive ? (
        <>
          <video 
            ref={videoRef}
            src={video.videoUrl}
            className={cn(
              "w-full h-full object-contain",
              !isLoaded && "opacity-0"
            )}
            loop
            playsInline
            muted={!isPlaying}
            preload={shouldPreload ? "auto" : "none"}
            poster={thumbnail}
            controlsList="nodownload"
            onLoadedData={handleVideoLoad}
            onWaiting={handleWaiting}
            onPlaying={handlePlaying}
          />
          {(!isLoaded || isBuffering) && (
            <div className="absolute inset-0 flex items-center justify-center bg-opacity-50">
              <ImSpinner8 className="text-white text-4xl animate-spin" />
            </div>
          )}
          {!isLoaded && (
            <div className="absolute inset-0 w-full h-full">
              <Image 
                src={thumbnail}
                alt="Loading..."
                fill
                className="object-contain"
                priority
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.backgroundColor = '#333';
                  target.style.display = 'block';
                }}
              />
            </div>
          )}
        </>
      ) : (
        <div className="relative w-full h-full">
          <Image 
            src={thumbnail}
            alt={video.extraText || 'Video thumbnail'}
            fill
            className="object-contain"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.backgroundColor = '#333';
              target.style.display = 'block';
            }}
          />
        </div>
      )}
      {!isPlaying && isActive && !isBuffering && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-[#FFC01D] flex items-center justify-center">
            <FaPlay className="text-black text-2xl ml-1" />
          </div>
        </div>
      )}
      {video.extraText && isActive && (
        <div className="absolute bottom-0 left-0 right-0 bg-opacity-50 text-white p-2 text-sm">
          {video.extraText}
        </div>
      )}
    </div>
  );
};

export default function VideoSlider( {videos}: {videos: Video[]}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(1024); // Default to desktop width
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [velocity, setVelocity] = useState(0);
  const [lastX, setLastX] = useState(0);
  const [lastTime, setLastTime] = useState(0);
  const [direction, setDirection] = useState<'next' | 'prev'>('next');
   
  useEffect(() => {
    // Set initial window width
    setWindowWidth(window.innerWidth);
    
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

   

  if (videos.length === 0) return <div>Loading...</div>;

  const handleNext = () => {
    setDirection('next');
    setCurrentIndex((prev) => (prev + 1) % videos.length);
  };

  const handlePrev = () => {
    setDirection('prev');
    setCurrentIndex((prev) => (prev - 1 + videos.length) % videos.length);
  };

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(currentX);
    setLastX(currentX);
    setLastTime(Date.now());
    setVelocity(0);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const currentTime = Date.now();
    const deltaTime = currentTime - lastTime;
    const deltaX = currentX - lastX;
    
    if (deltaTime > 0) {
      setVelocity(deltaX / deltaTime);
    }
    
    setDragOffset(currentX - startX);
    setLastX(currentX);
    setLastTime(currentTime);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    setIsDragging(false);
    
    const threshold = 100;
    const velocityThreshold = 0.5;
    
    if (Math.abs(dragOffset) > threshold || Math.abs(velocity) > velocityThreshold) {
      if (dragOffset > 0 || velocity > 0) {
        handlePrev();
            } else {
        handleNext();
      }
    }
    
    setDragOffset(0);
    setVelocity(0);
  };

  const getCardWidth = (index: number) => {
    if (windowWidth < 768) {
      // Center card
      if (index === currentIndex) return windowWidth * 0.7;
      // Side cards
      return windowWidth * 0.4;
    }
    // Desktop
    if (windowWidth < 1024) return 240;
    return 280;
  };

  const getVisibleIndices = () => {
    const indices = [];
    if (windowWidth < 768) {
      // Show only 3 cards for mobile: -1, 0, 1
      for (let i = -1; i <= 1; i++) {
        const index = (currentIndex + i + videos.length) % videos.length;
        indices.push(index);
      }
    } else {
      // Show 5 cards for desktop: -2, -1, 0, 1, 2
      for (let i = -1; i <= 2; i++) {
        const index = (currentIndex + i + videos.length) % videos.length;
        indices.push(index);
      }
    }
    return indices;
  };

  const getPosition = (index: number, cardWidth: number) => {
    const relativeIndex = (index - currentIndex + videos.length) % videos.length;
    const adjustedIndex = relativeIndex > 2 ? relativeIndex - videos.length : relativeIndex;
    const isMobile = windowWidth < 768;
    let spacing = isMobile ? 8 : 15;
    let centerWidth = isMobile ? windowWidth * 0.85 : cardWidth;
    let sideWidth = isMobile ? windowWidth * 0.4 : cardWidth;

    if (isMobile) {
      // For mobile, calculate total width of all three cards and center them
      const totalWidth = sideWidth + centerWidth + sideWidth + 2 * spacing;
      const startX = (windowWidth - totalWidth) / 2;
      if (adjustedIndex === 0) {
       
        // Center card
        return `${startX + sideWidth + spacing}px`;
      } else if (adjustedIndex === -1) {
        // Left card
        return `${startX}px`;
      } else if (adjustedIndex === 1) {
        
      
        // Right card
        return `${startX + sideWidth + centerWidth/2 - sideWidth/2}px`;
      }
      // Fallback
      return `0px`;
    } else {
      // Desktop: original logic
      const baseOffset = adjustedIndex * (cardWidth + spacing);
      const dragAdjustment = isDragging ? dragOffset : 0;
      return `${baseOffset + dragAdjustment}px`;
    }
  };

  const getCardStyle = (index: number) => {
    const relativeIndex = (index - currentIndex + videos.length) % videos.length;
    const adjustedIndex = relativeIndex > 2 ? relativeIndex - videos.length : relativeIndex;
    const isCenter = adjustedIndex === 0;
    const distance = Math.abs(adjustedIndex);
    let scale = 1;
    let opacity = 1;
    let zIndex = 1;
    let width = getCardWidth(index);

    if (!isCenter) {
      // Side cards: blur for only mobile
      
      if (windowWidth < 768) {
        scale = 0.85;
        opacity = 0.7;
        zIndex = 1;
        return {
          width: `${width}px`,
          transform: `translateX(${getPosition(index, width)}) scale(${scale})`,
          opacity,
          zIndex,
          filter: 'blur(8px)',
        };
      } else {
        if (distance === 1) {
          scale = 0.9;
          opacity = 0.9;
        } else if (distance === 2) {
          scale = 0.8;
          opacity = 0.7;
        }
        zIndex = 1;
        return {
          width: `${width}px`,
          transform: `translateX(${getPosition(index, width)}) scale(${scale})`,
          opacity,
          zIndex,
        };
      }
    } else {
      // Center card: no blur
      scale = 1;
      opacity = 1;
      zIndex = 10;
      return {
        width: `${width}px`,
        transform: `translateX(${getPosition(index, width)}) scale(${scale})`,
        opacity,
        zIndex,
      };
    }
  };

    return (
        <div
          className="relative w-full h-[65vh] md:h-[60vh] bg-transparent overflow-hidden"
          onMouseDown={handleDragStart}
          onMouseMove={handleDragMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleDragStart}
          onTouchMove={handleDragMove}
          onTouchEnd={handleDragEnd}
        >
          {/* Navigation Buttons */}
          <div className="absolute inset-0 flex items-center justify-between px-5 pointer-events-none">
            <button
                onClick={handlePrev}
                className="z-50 bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] text-black border-none rounded-full w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity md:block hidden pointer-events-auto"
            >
                {"<"}
            </button>

            <button
                onClick={handleNext}
                className="z-50 bg-gradient-to-r from-[#FFC01D] via-[#FFD955] to-[#FF9A01] text-black border-none rounded-full w-10 h-10 cursor-pointer hover:opacity-80 transition-opacity md:block hidden pointer-events-auto"
            >
                {">"}
            </button>
          </div>

          <div className="absolute inset-0 flex justify-center items-center">
            <div className="relative h-full flex justify-center items-center">
              {getVisibleIndices().map((index) => (
                <div
                  key={index}
                  style={{ 
                    position: 'absolute',
                    ...getCardStyle(index),
                    transition: isDragging ? 'none' : `all 1s cubic-bezier(${direction === 'next' ? '0.4, 0, 0.2, 1' : '0.4, 0, 0.2, 1'})`,
                    cursor: 'grab',
                  }}
                  className="h-full"
                >
                  <VideoCard
                    video={videos[index]}
                    paused={index !== currentIndex}
                    isActive={index === currentIndex}
                    onPrev={handlePrev}
                    onNext={handleNext}
                    thumbnail={videos[index].thumbnail}
                    shouldPreload={Math.abs(index - currentIndex) <= 1}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
    );
} 