import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewCustomerTestDrawer from '../../../components/customerDetails/ViewCustomerTestDrawer';
import useCustomerTestProgress from '../../../hooks/customer/useCustomerTestProgress';

// Mock dependencies
jest.mock('../../../hooks/customer/useCustomerTestProgress');
jest.mock('../../../components/DisplayTable', () => {
  return function MockDisplayTable(props) {
    return <div data-testid="display-table">DisplayTable</div>;
  };
});
jest.mock('../../../components/CustomCTA', () => {
  return function MockCustomCTA(props) {
    return (
      <button
        data-testid={`custom-cta-${props.title.toLowerCase()}`}
        onClick={props.onClick}
        disabled={props.disabled}
      >
        {props.title}
      </button>
    );
  };
});

describe('ViewCustomerTestDrawer', () => {
  const mockToggleDrawer = jest.fn();
  const mockCourseObj = {
    trainingTitle: 'React Basics Test',
    trainingProgressStatus: 'Completed',
    correctAnswers: 8,
    totalQuestions: 10,
    resultStatus: 'PASSED',
  };

  const mockHookReturn = {
    progressHeaderKeys: ['question', 'status'],
    progressHeaders: ['Question', 'Status'],
    progressHeaderTypes: ['text', 'text'],
    progressRows: [
      { id: '1', data: ['What is React?', 'Correct'] },
      { id: '2', data: ['What is JSX?', 'Incorrect'] },
    ],
    certificateLink: ['cert1.pdf'],
    medalLink: ['medal1.png'],
    rewardObj: [
      { count: 1, title: 'Medal', icon: 'medal-icon' },
      { count: 1, title: 'Certificate', icon: 'certificate-icon' },
    ],
    handleCertificateClick: jest.fn(),
    handleMedalClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCustomerTestProgress.mockReturnValue(mockHookReturn);
  });

  it('renders the drawer when open is true', () => {
    render(
      <ViewCustomerTestDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByText('Test Progress')).toBeInTheDocument();
    expect(screen.getByText('React Basics Test')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('does not render the drawer when open is false', () => {
    render(
      <ViewCustomerTestDrawer
        open={false}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.queryByText('Test Progress')).not.toBeInTheDocument();
  });

  it('renders the test title and progress status', () => {
    render(
      <ViewCustomerTestDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByText('React Basics Test')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders the correct answers section', () => {
    render(
      <ViewCustomerTestDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByText('Correct Answers :')).toBeInTheDocument();
    expect(screen.getByText('8/10')).toBeInTheDocument();
    expect(screen.getByText('PASSED')).toBeInTheDocument();
  });

  it('renders the rewards section correctly', () => {
    render(
      <ViewCustomerTestDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByText('1 Medal')).toBeInTheDocument();
    expect(screen.getByText('1 Certificate')).toBeInTheDocument();
    expect(screen.getByTestId('custom-cta-medal')).toBeInTheDocument();
    expect(screen.getByTestId('custom-cta-certificate')).toBeInTheDocument();
  });

  it('renders the test details table', () => {
    render(
      <ViewCustomerTestDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByTestId('display-table')).toBeInTheDocument();
  });

  it('handles close drawer button click', () => {
    render(
      <ViewCustomerTestDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    fireEvent.click(screen.getByAltText('close-drawer'));
    expect(mockToggleDrawer).toHaveBeenCalledWith(false);
  });

  it('handles medal and certificate button clicks', () => {
    render(
      <ViewCustomerTestDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    fireEvent.click(screen.getByTestId('custom-cta-medal'));
    fireEvent.click(screen.getByTestId('custom-cta-certificate'));
    expect(mockHookReturn.handleMedalClick).toHaveBeenCalled();
    expect(mockHookReturn.handleCertificateClick).toHaveBeenCalled();
  });

  it('disables buttons when no links are available', () => {
    useCustomerTestProgress.mockReturnValueOnce({
      ...mockHookReturn,
      certificateLink: [],
      medalLink: [],
    });

    render(
      <ViewCustomerTestDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByTestId('custom-cta-medal')).toBeDisabled();
    expect(screen.getByTestId('custom-cta-certificate')).toBeDisabled();
  });
});