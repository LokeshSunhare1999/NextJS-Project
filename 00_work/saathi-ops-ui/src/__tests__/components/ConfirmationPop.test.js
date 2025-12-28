import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmationPop from '../../components/ConfirmationPop';
import ICONS from '../../assets/icons';

const mockSetOpenConfirmationPop = jest.fn();
const mockHandleSubmit = jest.fn();

describe('ConfirmationPop Component', () => {
  beforeEach(() => {
    mockSetOpenConfirmationPop.mockClear();
    mockHandleSubmit.mockClear();
  });

  const renderComponent = () =>
    render(
      <ConfirmationPop
        setOpenConfirmationPop={mockSetOpenConfirmationPop}
        title="Delete Confirmation"
        heading="Are you sure?"
        subHeading="This action cannot be undone."
        handleSubmit={mockHandleSubmit}
      />
    );

  it('renders ConfirmationPop component', () => {
    renderComponent();

    expect(screen.getByText('Delete Confirmation')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('handles clicking the "No" button', () => {
    renderComponent();

    fireEvent.click(screen.getByText('No'));
    expect(mockSetOpenConfirmationPop).toHaveBeenCalledWith(false);
  });

  it('handles clicking the close icon', () => {
    renderComponent();

    const closeIcon = screen.getByAltText('icon');
    fireEvent.click(closeIcon);
    expect(mockSetOpenConfirmationPop).toHaveBeenCalledWith(false);
  });

  it('handles clicking the "Yes" button', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Yes'));
    expect(mockHandleSubmit).toHaveBeenCalled();
  });

  it('handles clicking away to close the pop-up', () => {
    const { container } = renderComponent();

    fireEvent.mouseDown(container);
    expect(mockSetOpenConfirmationPop).not.toHaveBeenCalled();
  });
});