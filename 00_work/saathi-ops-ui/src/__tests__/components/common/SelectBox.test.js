import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectBox from '../../../components/common/SelectBox';

describe('SelectBox Component', () => {
  const mockOnClick = jest.fn();
  const mockProps = {
    label: 'Test Label',
    icon: 'test-icon.png',
    selected: false,
    onClick: mockOnClick,
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the component with label and icon', () => {
    render(<SelectBox {...mockProps} />);
    
    expect(screen.getByText('Test Label')).toBeInTheDocument();

    const icon = screen.getByAltText('select-image');
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute('src', 'test-icon.png');
  });

  it('calls onClick handler when clicked', () => {
    render(<SelectBox {...mockProps} />);
    
    const box = screen.getByText('Test Label').parentElement;
    fireEvent.click(box);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies selected styles when selected prop is true', () => {
    render(<SelectBox {...mockProps} selected={true} />);
    
    const label = screen.getByText('Test Label');
    
    // Check if the label color is applied correctly when selected
    expect(label).toHaveStyle('color: #141482');
  });

  it('does not apply selected styles when selected prop is false', () => {
    render(<SelectBox {...mockProps} selected={false} />);
    
    const label = screen.getByText('Test Label');
    
    // Check if the label has the default color
    expect(label).toHaveStyle('color: #3B3B3B');
  });
});
