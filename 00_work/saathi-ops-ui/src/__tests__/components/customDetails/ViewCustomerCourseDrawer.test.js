import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewCustomerCourseDrawer from '../../../components/customerDetails/ViewCustomerCourseDrawer';
import useCustomerCourseProgress from '../../../hooks/customer/useCustomerCourseProgress';

// Mock dependencies
jest.mock('../../../hooks/customer/useCustomerCourseProgress');
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

describe('ViewCustomerCourseDrawer', () => {
  const mockToggleDrawer = jest.fn();
  const mockCourseObj = {
    trainingTitle: 'React Basics',
    trainingProgressStatus: 'Completed',
  };

  const mockHookReturn = {
    progressHeaderKeys: ['module', 'status'],
    progressHeaders: ['Module', 'Status'],
    progressHeaderTypes: ['text', 'text'],
    progressRows: [
      { id: '1', data: ['Introduction to React', 'Completed'] },
      { id: '2', data: ['React Hooks', 'In Progress'] },
    ],
    certificateLink: ['cert1.pdf'],
    trophyLink: ['trophy1.png'],
    rewardObj: [
      { count: 1, title: 'Trophy', icon: 'trophy-icon' },
      { count: 1, title: 'Certificate', icon: 'certificate-icon' },
    ],
    handleCertificateClick: jest.fn(),
    handleTrophyClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCustomerCourseProgress.mockReturnValue(mockHookReturn);
  });

  it('renders the drawer when open is true', () => {
    render(
      <ViewCustomerCourseDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByText('Course Progress')).toBeInTheDocument();
    expect(screen.getByText('React Basics')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('does not render the drawer when open is false', () => {
    render(
      <ViewCustomerCourseDrawer
        open={false}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.queryByText('Course Progress')).not.toBeInTheDocument();
  });

  it('renders the course title and progress status', () => {
    render(
      <ViewCustomerCourseDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByText('React Basics')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('renders the rewards section correctly', () => {
    render(
      <ViewCustomerCourseDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByText('1 Trophy')).toBeInTheDocument();
    expect(screen.getByText('1 Certificate')).toBeInTheDocument();
    expect(screen.getByTestId('custom-cta-trophy')).toBeInTheDocument();
    expect(screen.getByTestId('custom-cta-certificate')).toBeInTheDocument();
  });

  it('renders the course details table', () => {
    render(
      <ViewCustomerCourseDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByTestId('display-table')).toBeInTheDocument();
  });

  it('handles close drawer button click', () => {
    render(
      <ViewCustomerCourseDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    fireEvent.click(screen.getByAltText('close-drawer'));
    expect(mockToggleDrawer).toHaveBeenCalledWith(false);
  });

  it('handles trophy and certificate button clicks', () => {
    render(
      <ViewCustomerCourseDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    fireEvent.click(screen.getByTestId('custom-cta-trophy'));
    fireEvent.click(screen.getByTestId('custom-cta-certificate'));
    expect(mockHookReturn.handleTrophyClick).toHaveBeenCalled();
    expect(mockHookReturn.handleCertificateClick).toHaveBeenCalled();
  });

  it('disables buttons when no links are available', () => {
    useCustomerCourseProgress.mockReturnValueOnce({
      ...mockHookReturn,
      certificateLink: [],
      trophyLink: [],
    });

    render(
      <ViewCustomerCourseDrawer
        open={true}
        toggleDrawer={mockToggleDrawer}
        courseObj={mockCourseObj}
      />
    );
    expect(screen.getByTestId('custom-cta-trophy')).toBeDisabled();
    expect(screen.getByTestId('custom-cta-certificate')).toBeDisabled();
  });
});