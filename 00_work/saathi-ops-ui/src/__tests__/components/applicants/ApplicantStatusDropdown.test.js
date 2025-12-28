import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicantStatusDropdown from '../../../components/applicants/ApplicantStatusDropdown';

jest.mock('../../../components/DropDownMenu', () => ({
  __esModule: true,
  default: ({ listItem, handleCategorySelect }) => (
    <div>
      {listItem.map((item) => (
        <div key={item} onClick={() => handleCategorySelect(item)}>
          {item}
        </div>
      ))}
    </div>
  ),
}));

describe('ApplicantStatusDropdown Component', () => {
  const mockHandleStatusSelect = jest.fn();
  const mockSetStatusOpen = jest.fn();
  const listItem = ['Pending', 'Approved', 'Rejected'];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with default props', () => {
    render(
      <ApplicantStatusDropdown
        status="Pending"
        handleStatusSelect={mockHandleStatusSelect}
        statusOpen={false}
        setStatusOpen={mockSetStatusOpen}
        listItem={listItem}
      />
    );
    expect(screen.getByText('Pending')).toBeInTheDocument();
  });

  it('opens dropdown on click', () => {
    render(
      <ApplicantStatusDropdown
        status="Pending"
        handleStatusSelect={mockHandleStatusSelect}
        statusOpen={false}
        setStatusOpen={mockSetStatusOpen}
        listItem={listItem}
      />
    );
    fireEvent.click(screen.getByText('Pending'));
    expect(mockSetStatusOpen).toHaveBeenCalledWith(true);
  });

  it('handles search when isSearchable is true', () => {
    render(
      <ApplicantStatusDropdown
        status=""
        handleStatusSelect={mockHandleStatusSelect}
        statusOpen={true}
        setStatusOpen={mockSetStatusOpen}
        listItem={listItem}
        isSearchable={true}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(''), { target: { value: 'App' } });
    expect(screen.getByText('Approved')).toBeInTheDocument();
  });

  it('disables dropdown when disabled prop is true', () => {
    render(
      <ApplicantStatusDropdown
        status="Pending"
        handleStatusSelect={mockHandleStatusSelect}
        statusOpen={false}
        setStatusOpen={mockSetStatusOpen}
        listItem={listItem}
        disabled={true}
      />
    );
    fireEvent.click(screen.getByText('Pending'));
    expect(mockSetStatusOpen).not.toHaveBeenCalled();
  });

  it('displays error message when isError is true', () => {
    render(
      <ApplicantStatusDropdown
        status="Pending"
        handleStatusSelect={mockHandleStatusSelect}
        statusOpen={false}
        setStatusOpen={mockSetStatusOpen}
        listItem={listItem}
        isError={true}
        errorMessage="This is an error"
      />
    );
    expect(screen.getByText('This is an error')).toBeInTheDocument();
  });

  it('calls handleStatusSelect when an item is selected', () => {
    render(
      <ApplicantStatusDropdown
        status="Pending"
        handleStatusSelect={mockHandleStatusSelect}
        statusOpen={true}
        setStatusOpen={mockSetStatusOpen}
        listItem={listItem}
      />
    );
    fireEvent.click(screen.getByText('Approved'));
    expect(mockHandleStatusSelect).toHaveBeenCalledWith('Approved');
  });
});
