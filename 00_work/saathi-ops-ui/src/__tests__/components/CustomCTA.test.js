import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomCTA from '../../components/CustomCTA';
import ICONS from '../../assets/icons';

const mockOnClick = jest.fn();
const mockHandleInputChange = jest.fn();

describe('CustomCTA Component', () => {
  beforeEach(() => {
    mockOnClick.mockClear();
    mockHandleInputChange.mockClear();
  });

  const renderComponent = (props) =>
    render(
      <CustomCTA
        title="Click Me"
        onClick={mockOnClick}
        handleInputChange={mockHandleInputChange}
        {...props}
      />
    );

  it('renders CustomCTA component', () => {
    renderComponent();

    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('handles button click', () => {
    renderComponent();

    fireEvent.click(screen.getByText('Click Me'));
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('handles file input change', () => {
    renderComponent({ isInput: true });

    const fileInput = screen.getByDisplayValue('');
    fireEvent.change(fileInput, { target: { files: ['file.txt'] } });
    expect(mockHandleInputChange).toHaveBeenCalled();
  });

  it('renders with icon', () => {
    renderComponent({ showIcon: true, url: ICONS.PLUS });

    expect(screen.getByAltText('icon')).toBeInTheDocument();
  });

  it('renders with loading state', () => {
    renderComponent({ isLoading: true });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('renders with disabled state', () => {
    renderComponent({ disabled: true });

    const button = screen.getByText('Click Me').closest('button');
    expect(button).toBeDisabled();
  });

  it('does not render if not permitted', () => {
    renderComponent({ isPermitted: false });

    expect(screen.queryByText('Click Me')).not.toBeInTheDocument();
  });
});