import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SearchFilter from '../../components/SearchFilter';

describe('SearchFilter Component', () => {
  const mockSetInput = jest.fn();
  const mockSetCategory = jest.fn();
  const searchArr = [
    { id: 1, placeHolder: 'Search...', enteredInput: '', setInput: mockSetInput, width: '200px' },
  ];
  const listItem = ['Category 1', 'Category 2'];

  test('renders SearchFilter component', () => {
    render(<SearchFilter searchArr={searchArr} listItem={listItem} />);
    expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
  });

  test('renders input fields correctly', () => {
    render(<SearchFilter searchArr={searchArr} listItem={listItem} />);
    const input = screen.getByPlaceholderText('Search...');
    expect(input).toHaveValue('');
  });

  test('calls setInput function on input change', () => {
    render(<SearchFilter searchArr={searchArr} listItem={listItem} />);
    const input = screen.getByPlaceholderText('Search...');
    fireEvent.change(input, { target: { value: 'test' } });
    expect(mockSetInput).toHaveBeenCalledWith('test');
  });

  test('renders dropdown when isFilter is true', () => {
    render(<SearchFilter searchArr={searchArr} listItem={listItem} isFilter={true} category="Category 1" setCategory={mockSetCategory} />);
    expect(screen.getByText('Category 1')).toBeInTheDocument();
  });

  test('calls setCategory function on category select', () => {
    render(<SearchFilter searchArr={searchArr} listItem={listItem} isFilter={true} category="Category 1" setCategory={mockSetCategory} />);
    fireEvent.click(screen.getByText('Category 1'));
    fireEvent.click(screen.getByText('Category 2'));
    expect(mockSetCategory).toHaveBeenCalledWith('Category 2');
  });
});