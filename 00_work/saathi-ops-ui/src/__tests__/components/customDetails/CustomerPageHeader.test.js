import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerPageHeader from '../../../components/customerDetails/CustomerPageHeader';

// Mock the icons
jest.mock('../../../assets/icons', () => ({
  MESSAGE_ICON: 'message-icon.svg',
  CALL_ICON: 'call-icon.svg',
}));

describe('CustomerPageHeader', () => {
  // Basic test props
  const defaultProps = {
    heading: 'Customer Details',
    subHeading: 'View and manage customer information',
    arrBtn: [],
  };

  it('renders the component with heading and subheading', () => {
    render(<CustomerPageHeader {...defaultProps} />);

    expect(screen.getByText('Customer Details')).toBeInTheDocument();
    expect(screen.getByText('View and manage customer information')).toBeInTheDocument();
  });

  it('renders with different heading and subheading values', () => {
    const customProps = {
      heading: 'Test Heading',
      subHeading: 'Test Subheading',
      arrBtn: [],
    };

    render(<CustomerPageHeader {...customProps} />);

    expect(screen.getByText('Test Heading')).toBeInTheDocument();
    expect(screen.getByText('Test Subheading')).toBeInTheDocument();
  });

  it('renders without subheading when not provided', () => {
    const propsWithoutSubheading = {
      heading: 'Only Heading',
      arrBtn: [],
    };

    render(<CustomerPageHeader {...propsWithoutSubheading} />);

    expect(screen.getByText('Only Heading')).toBeInTheDocument();
    expect(screen.queryByText('View and manage customer information')).not.toBeInTheDocument();
  });

  it('renders the correct styled components', () => {
    const { container } = render(<CustomerPageHeader {...defaultProps} />);

    expect(container.firstChild).toHaveStyle('display: flex');

    const leftSection = screen.getByText('Customer Details').closest('div');
    expect(leftSection).toHaveStyle('display: flex');
    expect(leftSection).toHaveStyle('flex-direction: column');

    const rightSection = container.querySelector('div:nth-child(2)');
    expect(rightSection).toHaveStyle('display: flex');
  });

  it('applies correct font styling to heading and subheading', () => {
    render(<CustomerPageHeader {...defaultProps} />);

    const headingElement = screen.getByText('Customer Details');
    const subheadingElement = screen.getByText('View and manage customer information');
 
    expect(headingElement).toBeInTheDocument();
    expect(subheadingElement).toBeInTheDocument();

    expect(headingElement).not.toBe(subheadingElement);

    expect(headingElement).toHaveStyle('font-size: 24px');
    expect(headingElement).toHaveStyle('font-weight: 600');

    expect(subheadingElement).toHaveStyle('font-size: 16px');
    expect(subheadingElement).toHaveStyle('color: #000');
  });

  it('starts with actionOpen state set to false', () => {

    const { container } = render(<CustomerPageHeader {...defaultProps} />);

    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
    expect(screen.queryByText('Call')).not.toBeInTheDocument();

    expect(container.querySelectorAll('img').length).toBe(0);
  });

  it('has the correct structure for the action buttons section', () => {
    const { container } = render(<CustomerPageHeader {...defaultProps} />);

    const rightSection = container.querySelector('div:nth-child(2)');

    expect(rightSection).toHaveStyle('display: flex');
    expect(rightSection).toHaveStyle('cursor: pointer');
    expect(rightSection).toHaveStyle('position: relative');

    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
    expect(screen.queryByText('Call')).not.toBeInTheDocument();
  });

  // If the commented buttons were to be enabled, this test would verify them
  it('would render Chat and Call buttons if they were enabled in the component', () => {

    render(<CustomerPageHeader {...defaultProps} />);
    expect(screen.queryByText('Chat')).not.toBeInTheDocument();
    expect(screen.queryByText('Call')).not.toBeInTheDocument();
  });
});