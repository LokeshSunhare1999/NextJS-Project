import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { MAX_IMAGE_API_TIMER } from '../../constants';
import PropTypes from 'prop-types';

const ProgressContainer = styled.div`
  width: 86px;
  height: 4px;
  border-radius: 10px;
  background-color: #e0e0e0; /* Background color for the empty part */
  opacity: 1;
  position: relative;
`;

const ProgressBarDiv = styled.div`
  height: 100%;
  border-radius: 10px;
  background-color: #141482; /* Color for the filled part */
  width: ${(props) => props?.$width};
  //   transition: width 0.5s ease;
`;

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
    <ProgressContainer data-testid="progress-bar">
      <ProgressBarDiv $width={`${progress}%`} />
    </ProgressContainer>
  );
};
ProgressBar.propTypes = {
  isUploadComplete: PropTypes.bool.isRequired,
  apiTimer: PropTypes.number,
};
export default ProgressBar;
