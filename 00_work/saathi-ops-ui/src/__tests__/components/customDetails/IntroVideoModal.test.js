import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import IntroVideoModal from '../../../components/customerDetails/IntroVideoModal';

jest.mock('../../../components/common/VideoPlayer', () => () => <div data-testid="video-player">VideoPlayer</div>);
jest.mock('../../../components/common/ShakaVideoPlayer', () => () => <div data-testid="shaka-video-player">ShakaVideoPlayer</div>);

describe('IntroVideoModal Component', () => {
  it('renders the modal with default title', () => {
    render(<IntroVideoModal videoLink="test.mp4" aspectRatio="16:9" />);
    expect(screen.getByText('Intro Video')).toBeInTheDocument();
  });

  it('renders the modal with a custom title', () => {
    render(<IntroVideoModal modalTitle="Custom Title" videoLink="test.mp4" aspectRatio="16:9" />);
    expect(screen.getByText('Custom Title')).toBeInTheDocument();
  });

  it('renders VideoPlayer when isMpd is false', () => {
    render(<IntroVideoModal videoLink="test.mp4" aspectRatio="16:9" isMpd={false} />);
    expect(screen.getByTestId('video-player')).toBeInTheDocument();
  });

  it('renders ShakaVideoPlayer when isMpd is true', () => {
    render(<IntroVideoModal videoLink="test.mpd" aspectRatio="16:9" isMpd={true} />);
    expect(screen.getByTestId('shaka-video-player')).toBeInTheDocument();
  });
});
