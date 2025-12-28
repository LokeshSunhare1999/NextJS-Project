import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import Pagination from '../../../../components/atom/tableComponents/Pagination';
import '@testing-library/jest-dom';

jest.mock('antd', () => ({
  Pagination: jest.fn(({ itemRender, onChange, current, total, pageSize }) => (
    <div data-testid="pagination">
      {itemRender(1, 'prev', <button disabled={current === 1}>Prev</button>)}
      {itemRender(2, 'next', <button disabled={current * pageSize >= total}>Next</button>)}
      <button onClick={() => onChange(2)}>Change Page</button>
    </div>
  )),
}));

jest.mock('../../../../constants', () => ({
  COURSE_MODULE: {
    PAGE_SIZE_OPTIUONS: [10, 20, 30],
  },
}));

jest.mock('@mui/material', () => ({
  // ClickAwayListener: jest.fn(({ children }) => children),
  ClickAwayListener: jest.fn(({ onClickAway, children }) => (
    <div data-testid="click-away-listener" onClick={onClickAway}>
      {children}
    </div>
  )),
  Box: jest.fn(({ children }) => <div>{children}</div>),
}));

describe('Pagination Component', () => {
  const mockOnShowSizeChange = jest.fn();
  const mockSetCurrentPage = jest.fn();
  const mockSetOpenDropdown = jest.fn();
  const mockHandleDropdown = jest.fn();
  const mockNavigate = jest.fn();

  const defaultProps = {
    onShowSizeChange: mockOnShowSizeChange,
    currentPage: 1,
    setCurrentPage: mockSetCurrentPage,
    totalItems: 100,
    itemsPerPage: 10,
    arrowBg: '#fff',
    isFlexColumn: false,
    isBottom: false,
    openDropdown: false,
    setOpenDropdown: mockSetOpenDropdown,
    handleDropdown: mockHandleDropdown,
    isBackground: true,
    searchParams: new URLSearchParams(),
    navigate: mockNavigate,
    pageType: 'courses',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Pagination component correctly', () => {
    render(<Pagination {...defaultProps} />);
    expect(screen.getByText('1-10 of 100')).toBeInTheDocument();
    expect(screen.getByTestId('pagination')).toBeInTheDocument();
  });

  it('calls handlePaginate when the page is changed', () => {
    render(<Pagination {...defaultProps} />);
    fireEvent.click(screen.getByText('Change Page'));
    expect(mockSetCurrentPage).toHaveBeenCalledWith(2);
    expect(mockNavigate).toHaveBeenCalledWith('/courses?currentPage=2', {
      replace: true,
    });
  });

  it('calls onShowSizeChange when items per page is changed', async () => {
    render(<Pagination {...defaultProps} openDropdown={true} />);
    fireEvent.click(screen.getByText('20')); // Select new items per page
    expect(mockOnShowSizeChange).toHaveBeenCalledWith(20);
  });

  it('renders the correct range of items', () => {
    render(<Pagination {...defaultProps} currentPage={2} />);
    expect(screen.getByText('11-20 of 100')).toBeInTheDocument();
  });

  it('toggles dropdown visibility when clicked', () => {
    render(<Pagination {...defaultProps} />);
    fireEvent.click(screen.getByText('10')); // Open dropdown
    expect(mockHandleDropdown).toHaveBeenCalled();
  });

  it('disables the previous button on the first page', () => {
    render(<Pagination {...defaultProps} currentPage={1} />);

    const prevButtonIcon = screen.getByAltText('prev');
    const styles = window.getComputedStyle(prevButtonIcon);

    expect(styles.cursor).toBe('not-allowed');
  });

  it('disables the next button on the last page', () => {
    render(<Pagination {...defaultProps} currentPage={10} />);

    const nextButtonIcon = screen.getByAltText('next');
    const styles = window.getComputedStyle(nextButtonIcon);

    expect(styles.cursor).toBe('not-allowed');
  });

  it('closes the dropdown when clicking outside', () => {
    render(<Pagination {...defaultProps} openDropdown={true} />);

    fireEvent.click(screen.getByTestId('click-away-listener'));

    // Check if the mockSetOpenDropdown was called with false
    expect(mockSetOpenDropdown).toHaveBeenCalledWith(false);
  });
});