import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PageHeader from '../../../components/courseDetail/PageHeader';
import ICONS from '../../../assets/icons';

// Mock the ActionButton component
jest.mock('../../../components/ActionButton', () => {
  return function MockActionButton({ arrBtn, setActionOpen }) {
    return (
      <div data-testid="action-button">
        {arrBtn.map((btn, index) => (
          <button
            key={index}
            onClick={() => {
              btn.onClick();
              setActionOpen(false);
            }}
          >
            {btn.title}
          </button>
        ))}
      </div>
    );
  };
});

describe('PageHeader Component', () => {
  const defaultProps = {
    heading: 'Test Heading',
    subHeading: 'Test Subheading',
    arrBtn: [
      { title: 'Edit', onClick: jest.fn() },
      { title: 'Delete', onClick: jest.fn() }
    ]
  };

  it('renders heading and subheading correctly', () => {
    render(<PageHeader {...defaultProps} />);
    
    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
  });

  it('renders three dots icon when showActionsPanel is true', () => {
    render(<PageHeader {...defaultProps} showActionsPanel={true} />);
    
    const threeDots = screen.getByAltText('three-dots');
    expect(threeDots).toBeInTheDocument();
    expect(threeDots.src).toContain(ICONS.THREE_DOTS);
  });

  it('does not render three dots icon when showActionsPanel is false', () => {
    render(<PageHeader {...defaultProps} showActionsPanel={false} />);
    
    expect(screen.queryByAltText('three-dots')).not.toBeInTheDocument();
  });

  it('shows action button when three dots icon is clicked', () => {
    render(<PageHeader {...defaultProps} />);
    
    // Action button should not be visible initially
    expect(screen.queryByTestId('action-button')).not.toBeInTheDocument();
    
    // Click on three dots icon
    fireEvent.click(screen.getByAltText('three-dots'));
    
    // Action button should now be visible
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
  });

  it('toggles action button visibility when three dots icon is clicked multiple times', () => {
    render(<PageHeader {...defaultProps} />);
    
    const threeDots = screen.getByAltText('three-dots');
    
    // Initial state - action button not visible
    expect(screen.queryByTestId('action-button')).not.toBeInTheDocument();
    
    // First click - show action button
    fireEvent.click(threeDots);
    expect(screen.getByTestId('action-button')).toBeInTheDocument();
    
    // Second click - hide action button
    fireEvent.click(threeDots);
    expect(screen.queryByTestId('action-button')).not.toBeInTheDocument();
  });

  it('passes arrBtn to ActionButton component', () => {
    render(<PageHeader {...defaultProps} />);
    
    // Click three dots to show action button
    fireEvent.click(screen.getByAltText('three-dots'));
    
    // Check that both buttons from arrBtn are rendered in the ActionButton
    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Delete')).toBeInTheDocument();
  });

  it('buttons in ActionButton call the correct callbacks', () => {
    const mockEditFn = jest.fn();
    const mockDeleteFn = jest.fn();
    
    const props = {
      ...defaultProps,
      arrBtn: [
        { title: 'Edit', onClick: mockEditFn },
        { title: 'Delete', onClick: mockDeleteFn }
      ]
    };
    
    render(<PageHeader {...props} />);
    
    // Click three dots to show action button
    fireEvent.click(screen.getByAltText('three-dots'));
    
    // Click Edit button
    fireEvent.click(screen.getByText('Edit'));
    expect(mockEditFn).toHaveBeenCalledTimes(1);
    
    // ActionButton should close after clicking a button (due to our mock implementation)
    // Click three dots again to reopen
    fireEvent.click(screen.getByAltText('three-dots'));
    
    // Click Delete button
    fireEvent.click(screen.getByText('Delete'));
    expect(mockDeleteFn).toHaveBeenCalledTimes(1);
  });

  it('renders without error when arrBtn is not provided', () => {
    const { heading, subHeading } = defaultProps;
    const renderComponent = () => render(
      <PageHeader heading={heading} subHeading={subHeading} />
    );
    
    expect(renderComponent).not.toThrow();
  });

  it('applies correct styles to heading and subheading', () => {
    render(<PageHeader {...defaultProps} />);
    
    const headingElement = screen.getByText('Test Heading');
    const subHeadingElement = screen.getByText('Test Subheading');
    
    // Check styling through computed styles
    expect(window.getComputedStyle(headingElement).fontSize).toBe('28px');
    expect(window.getComputedStyle(headingElement).fontWeight).toBe('600');
    expect(window.getComputedStyle(headingElement).lineHeight).toBe('35px');
    
    expect(window.getComputedStyle(subHeadingElement).fontSize).toBe('18px');
    expect(window.getComputedStyle(subHeadingElement).fontWeight).toBe('400');
    expect(window.getComputedStyle(subHeadingElement).lineHeight).toBe('normal');
  });
});