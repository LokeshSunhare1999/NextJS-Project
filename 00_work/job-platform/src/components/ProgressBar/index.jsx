import { useState, useEffect } from "react";
import { MAX_IMAGE_API_TIMER } from "@/constants";

const ProgressBar = ({ isUploadComplete, apiTimer = MAX_IMAGE_API_TIMER }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let animationFrame;
    const start = Date.now();

    const updateProgress = () => {
      if (isUploadComplete) {
        setProgress(100);
        cancelAnimationFrame(animationFrame);
        return;
      }

      const elapsed = Date.now() - start;
      const maxDuration = apiTimer;

      // Exponential easing function
      const easing = 1 - Math.exp((-5 * elapsed) / maxDuration);

      // Cap progress at 95% until upload is complete
      const newProgress = Math.min(95, easing * 100);
      setProgress(newProgress);

      animationFrame = requestAnimationFrame(updateProgress);
    };

    animationFrame = requestAnimationFrame(updateProgress);

    return () => cancelAnimationFrame(animationFrame);
  }, [isUploadComplete]);

  return (
    <div
      className="w-[86px] h-1 rounded-[10px] bg-[#e0e0e0] opacity-100 relative"
      data-testid="progress-bar"
    >
      <div
        className="h-full rounded-[10px] bg-[#141482]"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};



export default ProgressBar;
