import React from 'react';
import { render, screen } from '@testing-library/react';
import RattingReview from '../../../components/courseDetail/RatingReview';
import '@testing-library/jest-dom';

// Mock moment-timezone to control the date formatting
jest.mock('moment-timezone', () => ({
    tz: jest.fn().mockReturnValue({
        format: jest.fn().mockReturnValue('01-Jan-2025, 12:00 pm'),
    }),
}));

describe('RattingReview Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const courseData = {
        avgRating: '4.5',
        totalRatings: 100,
        courseDurationString: '2 hours',
        updatedAt: '2023-01-01T12:00:00Z',
    };

    it('renders the component with correct rating, total ratings, and last updated date', () => {
        render(<RattingReview courseData={courseData} />);

        // Check if the average rating is displayed
        expect(screen.getByText('4.5')).toBeInTheDocument();

        // Check if the total ratings are displayed
        expect(screen.getByText('(100 ratings)')).toBeInTheDocument();

        // Check if the last updated date is displayed
        expect(screen.getByText('Last Updated - 01-Jan-2025, 12:00 pm')).toBeInTheDocument();
    });

    it('renders the course duration if courseDurationString is provided', () => {
        render(<RattingReview courseData={courseData} />);

        // Check if the course duration is displayed
        expect(screen.getByText('2 hours')).toBeInTheDocument();
    });

    it('does not render the course duration if courseDurationString is not provided', () => {
        const courseDataWithoutDuration = { ...courseData, courseDurationString: '' };
        render(<RattingReview courseData={courseDataWithoutDuration} />);

        // Check that the course duration is not displayed
        expect(screen.queryByText('2 hours')).not.toBeInTheDocument();
    });

    it('renders the Rating component with the correct value and precision', () => {
        render(<RattingReview courseData={courseData} />);

        // Check if the Rating component is rendered with the correct value
        const ratingElement = screen.getByLabelText('4.5 Stars'); // Use aria-label to find the Rating component
        expect(ratingElement).toBeInTheDocument();
    });

    it('renders the correct icon for the course duration', () => {
        render(<RattingReview courseData={courseData} />);

        // Check if the clock icon is rendered
        const clockIcon = screen.getByRole('img', { name: /clock/i });
        expect(clockIcon).toBeInTheDocument();
    });

});