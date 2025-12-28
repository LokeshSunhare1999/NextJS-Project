import React, { useRef, useEffect } from 'react';
import styled from 'styled-components';
import 'shaka-player/dist/controls.css';

const StyledVideo = styled.video`
  border-radius: 12px;
  width: 100%;
  height: ${(props) => (props.aspectRatio ? '500px' : '100%')};
  aspect-ratio: ${(props) => props.aspectRatio || '16/9'};
`;
const ShakaVideoPlayer = ({ poster, autoPlay = true, videoLink }) => {
  const videoComponentRef = useRef();
  const videoContainerRef = useRef();

  const initializePlayer = async (player) => {
    const shaka = await import('shaka-player/dist/shaka-player.ui.js');
    const video = videoComponentRef?.current;
    const videoContainer = videoContainerRef?.current;

    player = new shaka.Player(video);

    player.configure({
      abr: {
        defaultBandwidthEstimate: 300000,
      },
    });

    const ui = new shaka.ui.Overlay(player, videoContainer, video);

    try {
      await player.load(videoLink);
      // console.log('The video has now been loaded!');
    } catch (error) {
      console.error('Error loading video:', error);
    }

    return player;
  };

  useEffect(() => {
    let player;
    initializePlayer(player).then((p) => {
      player = p;
    });

    return () => {
      if (player) {
        player.destroy();
      }
    };
  }, []);

  return (
    <div ref={videoContainerRef}>
      <StyledVideo
        preload="metadata"
        className="w-full rounded-xl"
        ref={videoComponentRef}
        poster={poster}
        autoPlay={autoPlay}
        muted
      />
    </div>
  );
};

export default ShakaVideoPlayer;
