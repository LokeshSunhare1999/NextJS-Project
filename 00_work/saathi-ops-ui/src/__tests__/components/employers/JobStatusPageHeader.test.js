import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobStatusPageHeader from '../../../components/employers/JobStatusPageHeader';
import { usePutAddJob } from '../../../apis/queryHooks';
import usePermission from '../../../hooks/usePermission';
import { JOB_STATUS_MAP } from '../../../constants/employer';

// Mock the imported components and hooks
jest.mock('../../../apis/queryHooks', () => ({
  usePutAddJob: jest.fn(),
}));

jest.mock('../../../hooks/usePermission', () => ({
  __esModule: true,
  default: jest.fn(),
}));

jest.mock('notistack', () => ({
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}));

jest.mock('../../../components/customerDetails/DocumentStatus', () => ({
  __esModule: true,
  default: (props) => <div data-testid="document-status">{props.status}</div>,
}));

jest.mock('../../../components/DropDownCategory', () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="dropdown-category">
      <button
        data-testid="dropdown-trigger"
        onClick={() => props.setCategoryOPen(!props.categoryOpen)}
        disabled={props.disabled}
      >
        {props.category}
      </button>
      {props.categoryOpen && (
        <ul data-testid="dropdown-list">
          {props.listItem?.map((item) => (
            <li
              key={item}
              data-testid={`dropdown-item-${item}`}
              onClick={() => props.handleCategorySelect(item)}
            >
              {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  ),
}));

jest.mock('../../../components/ConfirmationPop', () => ({
  __esModule: true,
  default: (props) => (
    <div data-testid="confirmation-popup">
      <h2>{props.heading}</h2>
      <button data-testid="confirm-button" onClick={props.handleSubmit}>
        Confirm
      </button>
      <button
        data-testid="cancel-button"
        onClick={() => props.setOpenConfirmationPop(false)}
      >
        Cancel
      </button>
    </div>
  ),
}));

jest.mock('../../../utils/helper', () => ({
  findKeyByValue: jest.fn((obj, value) => {
    // Simple implementation for test purposes
    return Object.keys(obj).find((key) => obj[key] === value);
  }),
}));

describe('JobStatusPageHeader', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const mockProps = {
    jobId: '12345',
    isDropdownOpen: false,
    setIsDropdownOpen: jest.fn(),
    verificationStatus: 'VERIFIED',
    refetchJobDetails: jest.fn(),
    possibleStates: ['DRAFT', 'PUBLISHED'],
    jobTitle: 'Software Engineer',
    jobDetails: {
      jobThumbnail: 'https://example.com/thumbnail.jpg',
    },
    employerDetails: {
      verificationStatus: 'VERIFIED',
      activationStatus: 'ACTIVATED',
    },
  };

  const mockMutateAsync = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    usePutAddJob.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'idle',
      isError: false,
      error: null,
    });

    usePermission.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(true),
    });
  });

  it('renders correctly with props', () => {
    render(<JobStatusPageHeader {...mockProps} />);

    expect(screen.getByText('Software Engineer')).toBeInTheDocument();
    expect(screen.getByTestId('document-status')).toHaveTextContent('VERIFIED');
    expect(screen.getByTestId('dropdown-trigger')).toHaveTextContent(
      'Change Status',
    );
  });

  it('disables dropdown when no possible states are provided', () => {
    render(<JobStatusPageHeader {...mockProps} possibleStates={[]} />);

    expect(screen.getByTestId('dropdown-trigger')).toBeDisabled();
  });

  it('opens dropdown on click', () => {
    render(<JobStatusPageHeader {...mockProps} />);

    fireEvent.click(screen.getByTestId('dropdown-trigger'));
    expect(mockProps.setIsDropdownOpen).toHaveBeenCalledWith(true);
  });

  it('shows confirmation popup when a status is selected', () => {
    render(<JobStatusPageHeader {...mockProps} isDropdownOpen={true} />);

    fireEvent.click(
      screen.getByTestId(`dropdown-item-${JOB_STATUS_MAP.PUBLISHED}`),
    );

    expect(screen.getByTestId('confirmation-popup')).toBeInTheDocument();
    expect(
      screen.getByText('Do you want to change the status?'),
    ).toBeInTheDocument();
  });

  it('calls editJobMutation with correct parameters on confirm', async () => {
    render(<JobStatusPageHeader {...mockProps} isDropdownOpen={true} />);

    fireEvent.click(
      screen.getByTestId(`dropdown-item-${JOB_STATUS_MAP.PUBLISHED}`),
    );

    fireEvent.click(screen.getByTestId('confirm-button'));

    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        jobId: '12345',
        status: 'PUBLISHED',
      });
    });

    expect(mockProps.refetchJobDetails).toHaveBeenCalled();
  });

  it('closes confirmation popup on cancel', () => {
    render(<JobStatusPageHeader {...mockProps} isDropdownOpen={true} />);

    fireEvent.click(
      screen.getByTestId(`dropdown-item-${JOB_STATUS_MAP.PUBLISHED}`),
    );

    expect(screen.getByTestId('confirmation-popup')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('cancel-button'));

    expect(screen.queryByTestId('confirmation-popup')).not.toBeInTheDocument();
  });

  it('shows error snackbar when edit job mutation fails', async () => {
    const errorMessage = 'Failed to update job';
    const enqueueSnackbarMock = jest.fn();

    jest.spyOn(require('notistack'), 'useSnackbar').mockReturnValue({
      enqueueSnackbar: enqueueSnackbarMock,
    });

    usePutAddJob.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'error',
      isError: true,
      error: { message: errorMessage },
    });

    render(<JobStatusPageHeader {...mockProps} />);

    await waitFor(() => {
      expect(enqueueSnackbarMock).toHaveBeenCalledWith(
        `Failed to update status. error : ${errorMessage}`,
        { variant: 'error' },
      );
    });
  });
});
