import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Checkbox from '../../../components/common/Checkbox';

describe('Checkbox Component', () => {
  const mockHandleChange = jest.fn();

  test('renders checkbox with label', () => {
    const mockHandleChange = jest.fn();
    render(<Checkbox label="Accept Terms" onChange={mockHandleChange} />);

    expect(screen.getByText('Accept Terms')).toBeInTheDocument();
  });

  test('renders unchecked checkbox by default', () => {
    render(<Checkbox label="Subscribe" onChange={mockHandleChange} />);
    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).not.toBeChecked();
  });

  test('calls onChange when clicked', () => {
    render(<Checkbox label="Subscribe" onChange={mockHandleChange} />);
    const checkbox = screen.getByTestId('custom-checkbox');
    fireEvent.click(checkbox);
    expect(mockHandleChange).toHaveBeenCalledTimes(1);
  });

  test('renders checked state when prop is true', () => {
    render(
      <Checkbox label="Subscribe" onChange={mockHandleChange} checked={true} />,
    );
    expect(screen.getByRole('img', { name: /check/i })).toBeInTheDocument();
    const checkbox = screen.getByTestId('custom-checkbox');
    expect(checkbox).toBeChecked();
  });
});
