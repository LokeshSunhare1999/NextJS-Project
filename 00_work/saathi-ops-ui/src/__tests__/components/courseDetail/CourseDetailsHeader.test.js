import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useLocation } from 'react-router-dom';
import CourseDetailsHeader from '../../../components/courseDetail/CourseDetailsHeader';

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
  useLocation: jest.fn(),
}));

describe('CourseDetailsHeader Component', () => {
  const mockCourseData = {
    modulesLength: 5,
    subModulesLength: 10,
    assessmentsLength: 3,
    totalPendingVideos: 2,
    totalThumbnails: 8,
  };

  const mockTestDetailsData = {
    totalAssessments: 4,
    totalQuestions: 20,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = (pathname, courseData = mockCourseData, testData = mockTestDetailsData) => {
    useLocation.mockReturnValue({ pathname });
    render(<CourseDetailsHeader courseData={courseData} testDetailsData={testData} />);
  };

  it('renders course details correctly', () => {
    renderComponent('/courses/123');
    const expectedTexts = [
      'Course Details',
      '5 Modules',
      '10 Sub Modules',
      '3 Assessments',
      '8 Videos',
      '8 Thumbnails',
    ];
    expectedTexts.forEach((text) => {
      expect(screen.getByText(text)).toBeInTheDocument();
    })

  });

  it('renders test details correctly', () => {
    renderComponent('/tests/123');

    expect(screen.getByText('Test Details')).toBeInTheDocument();
    expect(screen.getByText('4 Assessments')).toBeInTheDocument();
    expect(screen.getByText('20 Questions')).toBeInTheDocument();
  });

  it('handles singular and plural forms correctly', () => {
    const singularData = {
      modulesLength: 1,
      subModulesLength: 1,
      assessmentsLength: 1,
      totalPendingVideos: 0,
      totalThumbnails: 1,
    };

    renderComponent('/courses/123', singularData);

    expect(screen.getByText('1 Module')).toBeInTheDocument();
    expect(screen.getByText('1 Sub Module')).toBeInTheDocument();
    expect(screen.getByText('1 Assessment')).toBeInTheDocument();
    expect(screen.getByText('1 Thumbnail')).toBeInTheDocument();
    expect(screen.getByText('1 Video')).toBeInTheDocument();
  });

  it('handles missing or null data gracefully', () => {
    renderComponent('/courses/123', null, null);

    ['Modules', 'Sub Modules', 'Assessments', 'Videos', 'Thumbnails'].forEach((item) => {
      expect(screen.getByText(`0 ${item}`)).toBeInTheDocument();
    });
  });

  it('renders correctly with partial data', () => {
    const partialData = { modulesLength: 3, assessmentsLength: 2 };
    renderComponent('/courses/123', partialData);

    expect(screen.getByText('3 Modules')).toBeInTheDocument();
    expect(screen.getByText('0 Sub Modules')).toBeInTheDocument();
    expect(screen.getByText('2 Assessments')).toBeInTheDocument();
    expect(screen.getByText('0 Videos')).toBeInTheDocument();
    expect(screen.getByText('0 Thumbnails')).toBeInTheDocument();
  });
});
