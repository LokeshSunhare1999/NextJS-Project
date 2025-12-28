import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import DateFilter from '../../components/DateFilter';
import moment from 'moment';

const mockSetFromDate = jest.fn();
const mockSetToDate = jest.fn();

describe('DateFilter Component', () => {
  beforeEach(() => {
    mockSetFromDate.mockClear();
    mockSetToDate.mockClear();
  });

  const renderComponent = (props) =>
    render(
      <DateFilter
        fromDate={props.fromDate}
        setFromDate={mockSetFromDate}
        toDate={props.toDate}
        setToDate={mockSetToDate}
      />
    );

  it('renders DateFilter component', () => {
    renderComponent({ fromDate: null, toDate: null });

    expect(screen.getByPlaceholderText('From Date')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('To Date')).toBeInTheDocument();
  });

  // need to implement this test
  
  // it('handles "From Date" change', () => {
  //   renderComponent({ fromDate: null, toDate: null });

  //   const fromDateInput = screen.getByPlaceholderText('From Date');
  //   fireEvent.mouseDown(fromDateInput);
  //   fireEvent.change(fromDateInput, { target: { value: moment().format('YYYY-MM-DD') } });

  //   expect(mockSetFromDate).not.toHaveBeenCalled();
  // });

  // it('handles "To Date" change', () => {
  //   renderComponent({ fromDate: null, toDate: null });

  //   const toDateInput = screen.getByPlaceholderText('To Date');
  //   fireEvent.mouseDown(toDateInput);
  //   fireEvent.change(toDateInput, { target: { value: moment().format('YYYY-MM-DD') } });

  //   expect(mockSetToDate).not.toHaveBeenCalled();
  // });
});