import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import GlobalPop from '../../components/GlobalPop';

const mockSetOpenDeletePop = jest.fn();
const mockHandleDelete = jest.fn();

describe('GlobalPop', () => {

  const props = {
    setOpenDeletePop: mockSetOpenDeletePop,
    title: 'Test Title',
    heading: 'Test Heading',
    subHeading: 'Test SubHeading',
    handleDelete: mockHandleDelete,
  };

  beforeEach(() => {
    render(<GlobalPop {...props} />);
    jest.clearAllMocks(); // Clear mock calls between tests
  });

  it('renders GlobalPop component', () => {
    const globalPopElement = screen.getByText('Test Title');
    expect(globalPopElement).toBeInTheDocument();
  });

  it('displays the title prop correctly', () => {
    const titleElement = screen.getByText('Test Title');
    expect(titleElement).toBeInTheDocument();
  });

  it('displays the heading prop correctly', () => {
    const headingElement = screen.getByText('Test Heading');
    expect(headingElement).toBeInTheDocument();
  });

  it('displays the subHeading prop correctly', () => {
    const subHeadingElement = screen.getByText('Test SubHeading');
    expect(subHeadingElement).toBeInTheDocument();
  });

  it('calls handleClickAway when close button is clicked', () => {
    const closeButton = screen.getByAltText('plus');
    fireEvent.click(closeButton);
    expect(mockSetOpenDeletePop).toHaveBeenCalledWith(false);
  });

  it('calls handleDelete when delete button is clicked', () => {
    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);
    expect(mockHandleDelete).toHaveBeenCalled();
  });
});