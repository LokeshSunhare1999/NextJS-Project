import React, { act } from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ProgressBar from '../../../components/common/ProgressBar';

describe('ProgressBar Component', () => {
    jest.useFakeTimers();
    jest.spyOn(console, 'error').mockImplementation(() => { });

    it('renders the progress bar with initial progress', () => {
        render(<ProgressBar isUploadComplete={false} />);
        const progressBar = screen.getByTestId('progress-bar');
        expect(progressBar).toBeInTheDocument();
        expect(progressBar.firstChild).toHaveStyle('width: 0%');
    });

    it('updates progress when upload is not complete', () => {
        jest.useFakeTimers();
        render(<ProgressBar isUploadComplete={false} />);
        const progressBar = screen.getByTestId('progress-bar');

        // Fast-forward time to check progress
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(progressBar.firstChild).not.toHaveStyle('width: 0%');

        // getting the width of the progress bar in float value
        const widthStyle = window.getComputedStyle(progressBar.firstChild).width;
        const widthPercentage = parseFloat(widthStyle);
        expect(widthPercentage).toBeCloseTo(39, 0); // 39% progress
    });

    it('sets progress to 100% when upload is complete', () => {
        render(<ProgressBar isUploadComplete={true} />);
        const progressBar = screen.getByTestId('progress-bar');
        // Fast-forward time to check progress
        act(() => {
            jest.advanceTimersByTime(1000);
        });
        expect(progressBar.firstChild).toHaveStyle('width: 100%');
    });

    it('uses the provided apiTimer for progress calculation', () => {
        jest.useFakeTimers();
        const customApiTimer = 5000; // 5 seconds
        render(<ProgressBar isUploadComplete={false} apiTimer={customApiTimer} />);
        const progressBar = screen.getByTestId('progress-bar');

        // Fast-forward time to check progress
        act(() => {
            jest.advanceTimersByTime(10000);
        });
        expect(progressBar.firstChild).not.toHaveStyle('width: 0%');
        expect(progressBar.firstChild).toHaveStyle('width: 95%'); // Progress should cap at 95%
    });
});