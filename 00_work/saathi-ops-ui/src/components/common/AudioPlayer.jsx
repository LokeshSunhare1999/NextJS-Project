// src/AudioPlayer.js
import React, { useState } from 'react';
import styled from 'styled-components';
import ICONS from '../../assets/icons';
import { zIndexValues } from '../../style';
import PropTypes from 'prop-types';

const AudioPlayerWrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: ${zIndexValues?.AUDIO_PLAYER};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #000;
  opacity: 1;
  width: 100%;
  //   min-height: 100vh;
  height: 100%;
`;

const StyledImg = styled.img`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  cursor: pointer;
  position: absolute;
  z-index: 101;
  top: 80px;
  right: 20px;
`;

const StyledAudio = styled.audio`
  width: 50%;
  background: #fff;
  border-radius: 30px;
`;

const AudioPlayer = ({ src, closeAudioPlayer }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.createRef();

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <AudioPlayerWrapper>
      <StyledImg
        src={ICONS?.CROSS_ICON}
        width="20px"
        height="20px"
        alt={'close'}
        onClick={closeAudioPlayer}
      />
      <StyledAudio
        ref={audioRef}
        src={src}
        controls
        data-testid="audio-element"
      />
    </AudioPlayerWrapper>
  );
};

AudioPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  closeAudioPlayer: PropTypes.func.isRequired,
};

export default AudioPlayer;
