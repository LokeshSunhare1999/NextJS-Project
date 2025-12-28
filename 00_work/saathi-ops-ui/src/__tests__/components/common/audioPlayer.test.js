import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AudioPlayer from '../../../components/common/AudioPlayer';

describe('AudioPlayer Component', () => {
  const mockCloseAudioPlayer = jest.fn();
  const mockAudioSrc = 'test-audio.mp3';

  beforeEach(() => {
    render(
      <AudioPlayer
        src={mockAudioSrc}
        closeAudioPlayer={mockCloseAudioPlayer}
      />,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders audio player correctly', () => {
    const audioElement = screen.getByTestId('audio-element');
    expect(audioElement).toBeInTheDocument();

    expect(screen.getByRole('img', { name: /close/i })).toBeInTheDocument();
  });

  test('calls closeAudioPlayer on clicking close button', () => {
    const closeButton = screen.getByRole('img', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(mockCloseAudioPlayer).toHaveBeenCalledTimes(1);
  });
});
