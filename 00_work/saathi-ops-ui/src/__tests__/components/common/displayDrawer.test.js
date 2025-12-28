import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import DisplayDrawer from '../../../components/common/DisplayDrawer';

describe('DisplayDrawer Component', () => {
  const mockHandleClose = jest.fn();
  const mockHeaderContent = jest.fn(() => <h1>Header</h1>);
  const mockFooterContent = jest.fn(() => <p>Footer</p>);
  const mockExtraFooterContent = jest.fn(() => <p>Extra Footer</p>);

  const renderDrawer = (props = {}) => {
    return render(
      <DisplayDrawer
        open={true}
        handleCloseDrawer={mockHandleClose}
        headerContent={mockHeaderContent}
        footerContent={mockFooterContent}
        extraFooterContent={mockExtraFooterContent}
        {...props}
      />,
    );
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders DisplayDrawer component', () => {
    renderDrawer();

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
    expect(screen.getByText('Extra Footer')).toBeInTheDocument();
  });

  it('calls handleCloseDrawer when close button is clicked', () => {
    renderDrawer();

    fireEvent.click(screen.getByAltText('close-drawer'));

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('renders the drawer when open is true', () => {
    renderDrawer();
    expect(screen.getByRole('presentation')).toBeInTheDocument();
  });

  it('does not render the drawer when open is false', () => {
    renderDrawer({ open: false });
    expect(screen.queryByRole('presentation')).not.toBeInTheDocument();
  });

  it('does not render footer when showFooter is false', () => {
    renderDrawer({ showFooter: false });
    expect(screen.queryByText('Footer')).not.toBeInTheDocument();
  });

  it('does not render the cancel button when showCancelCta is false', () => {
    renderDrawer({ showCancelCta: false });
    expect(screen.queryByText('Cancel')).not.toBeInTheDocument();
  });

  it('renders the children content correctly', () => {
    renderDrawer({ children: 'Test Drawer Content' });
    expect(screen.getByText('Test Drawer Content')).toBeInTheDocument();
  });

  it('renders extraFooterContent when provided', () => {
    renderDrawer();
    expect(screen.getByText('Extra Footer')).toBeInTheDocument();
  });

  it('applies correct z-index value', () => {
    renderDrawer({ zIndex: 1500 });
    const drawerElement = screen.getByRole('presentation');
    expect(drawerElement).toHaveStyle('z-index: 1500');
  });

  it('calls handleCloseDrawer when cancel button is clicked', () => {
    renderDrawer({ showCancelCta: true });
    fireEvent.click(screen.getByText('Cancel'));
    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });
});
