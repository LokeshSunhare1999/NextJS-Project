import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Description from '../../../components/courseDetail/Description';

jest.mock('../../../assets/icons', () => ({
    VIDEO_CAMERA_BLACK: 'mock-video-camera-icon.svg',
}));

describe('Description Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const shortDescription = 'This is a short description.';
    const longDescription = 'This is a very long description that should exceed the 200 character limit. '.repeat(5);
    const mockIntroVideo = 'https://example.com/intro-video.mp4';

    it('renders nothing when no description or intro video is provided', () => {
        const { container } = render(<Description />);
        expect(container.firstChild).toBeNull();
    });

    it('renders short description without Read More button', () => {
        render(<Description desc={shortDescription} />);

        expect(screen.getByText(shortDescription)).toBeInTheDocument();
        expect(screen.queryByText('Read More')).not.toBeInTheDocument();
        expect(screen.queryByText('Read Less')).not.toBeInTheDocument();
    });

    it('renders long description with Read More button and truncates text', () => {
        render(<Description desc={longDescription} />);

        expect(screen.getByText(/^This is a very long description.*\.\.\.$/)).toBeInTheDocument();

        expect(screen.getByText('Read More')).toBeInTheDocument();
    });

    it('expands text when Read More is clicked', () => {
        const { container } = render(<Description desc={longDescription} />);
        // Find all elements that could contain "Read More" text
        const spans = container.querySelectorAll('span');
        let readMoreSpan;

        spans.forEach(span => {
            if (span.textContent.includes('Read More')) {
                readMoreSpan = span;
            }
        });

        // Ensure we found the Read More span
        expect(readMoreSpan).toBeTruthy();

        fireEvent.click(readMoreSpan);

        // Now check if the text has expanded
        expect(container.textContent).toContain(longDescription);

        // Find the Read Less text
        const paragraphs = container.querySelectorAll('p');
        let containsReadLess = false;

        paragraphs.forEach(p => {
            if (p.textContent.includes('Read Less')) {
                containsReadLess = true;
            }
        });

        expect(containsReadLess).toBe(true);
    });

    it('collapses text when Read Less is clicked', () => {
        render(<Description desc={longDescription} />);

        fireEvent.click(screen.getByText('Read More'));

        fireEvent.click(screen.getByText('Read Less'));

        expect(screen.getByText(/^This is a very long description.*\.\.\.$/)).toBeInTheDocument();

        expect(screen.getByText('Read More')).toBeInTheDocument();
    });

    it('renders intro video section when courseIntroVideo is provided', () => {
        render(<Description courseIntroVideo={mockIntroVideo} />);

        expect(screen.getByText('Intro Video')).toBeInTheDocument();

        const videoIcon = screen.getByAltText('videoCameraBlack');
        expect(videoIcon).toBeInTheDocument();
        expect(videoIcon.getAttribute('src')).toBe('mock-video-camera-icon.svg');
    });

    it('renders both description and intro video when both are provided', () => {
        render(<Description desc={shortDescription} courseIntroVideo={mockIntroVideo} />);

        expect(screen.getByText(shortDescription)).toBeInTheDocument();

        expect(screen.getByText('Intro Video')).toBeInTheDocument();
    });
});