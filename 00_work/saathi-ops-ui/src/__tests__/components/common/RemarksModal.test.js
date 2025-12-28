import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RemarksModal from '../../../components/common/RemarksModal';
import { ModalContext } from '../../../context/ModalProvider';

const mockCloseModal = jest.fn();
const mockOnSubmit = jest.fn();
const mockOnCancel = jest.fn();

describe('RemarksModal Component', () => {
  const renderComponent = (props = {}) => {
    return render(
      <ModalContext.Provider value={{ closeModal: mockCloseModal }}>
        <RemarksModal
          onSubmit={mockOnSubmit}
          onCancel={mockOnCancel}
          placeholder="Enter remarks"
          {...props}
        />
      </ModalContext.Provider>,
    );
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    renderComponent();
    expect(screen.getByText('Add Remarks')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter remarks')).toBeInTheDocument();
    expect(screen.getByText('Submit')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('handles input change', () => {
    renderComponent();
    const textarea = screen.getByPlaceholderText('Enter remarks');
    fireEvent.change(textarea, { target: { value: 'Test remark input' } });
    expect(textarea.value).toBe('Test remark input');
  });

  it('shows validation error for short remarks', () => {
    renderComponent();
    const submitButton = screen.getByText('Submit');
    fireEvent.click(submitButton);
    expect(
      screen.getByText('Remarks cannot be empty or contain only spaces.'),
    ).toBeInTheDocument();
  });

  it('calls onSubmit with valid input and closes modal', async () => {
    const validRemark = 'This is a valid remark input with enough characters.';
    renderComponent(<RemarksModal onSubmit={mockOnSubmit} />);

    const textarea = screen.getByPlaceholderText('Enter remarks');
    const submitButton = screen.getByText('Submit');

    fireEvent.change(textarea, { target: { value: validRemark } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(validRemark, undefined);
      expect(mockCloseModal).toHaveBeenCalled();
    });
  });

  it('calls onCancel and closes modal', () => {
    renderComponent();
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);
    expect(mockOnCancel).toHaveBeenCalled();
    expect(mockCloseModal).toHaveBeenCalled();
  });

  it('displays loading state on submit button', async () => {
    renderComponent({ isLoading: true });
    const submitButton = screen.getAllByRole('button')[1];

    await waitFor(() => {
      expect(submitButton).toHaveAttribute('disabled');
    });
  });
});
