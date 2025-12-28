import React from 'react';
import styled from 'styled-components';

const StyledVideo = styled.video`
  border-radius: 12px;
  width: 100%;
  height: ${(props) => (props.aspectRatio ? '500px' : '100%')};
  aspect-ratio: ${(props) => props.aspectRatio || '16/9'};
`;
const VideoPlayer = ({ videoLink, aspectRatio }) => {
  return <StyledVideo src={videoLink} aspectRatio={aspectRatio} controls />;
};

export default VideoPlayer;
