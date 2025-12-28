import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import DropDownCategory from '../../components/DropDownCategory';
import ICONS from '../../assets/icons';
import '@testing-library/jest-dom';

const defaultProps = {
    isBoxShadow: true,
    top: '10px',
    marginTop: '10px',
    isScrollable: true,
    border: '1px solid #ccc',
    category: 'Category 1',
    handleCategorySelect: jest.fn(),
    categoryOpen: false,
    setCategoryOPen: jest.fn(),
    listItem: ['Category 1', 'Category 2', 'Category 3'],
    errorMessage: 'This field is required',
    isError: false,
    displayConvertFn: (item) => item,
    isSearchable: false,
    placeholder: 'Select a category',
    disabled: false,
};

describe('DropDownCategory Component', () => {

    it('renders without crashing', () => {
        render(<DropDownCategory {...defaultProps} />);
        expect(screen.getByText('Category 1')).toBeInTheDocument();
    });

    it('does not open the dropdown when disabled', () => {
        render(<DropDownCategory {...defaultProps} disabled={true} />);
        const categoryBox = screen.getByText('Category 1').parentElement;
        fireEvent.click(categoryBox);
        expect(defaultProps.setCategoryOPen).not.toHaveBeenCalled();
    });

    it('displays the correct category', () => {
        render(<DropDownCategory {...defaultProps} category="Category 2" />);
        expect(screen.getByText('Category 2')).toBeInTheDocument();
    });

    it('opens the dropdown when clicked', () => {
        render(<DropDownCategory {...defaultProps} />);
        const categoryBox = screen.getByText('Category 1').parentElement;
        fireEvent.click(categoryBox);
        expect(defaultProps.setCategoryOPen).toHaveBeenCalledWith(true);
    });

    it('displays the error message when isError is true', () => {
        render(<DropDownCategory {...defaultProps} isError={true} />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });

    it('calls handleCategorySelect when an item is selected', () => {
        render(<DropDownCategory {...defaultProps} categoryOpen={true} />);
        const menuItem = screen.getByText('Category 2');
        fireEvent.click(menuItem);
        expect(defaultProps.handleCategorySelect).toHaveBeenCalledWith('Category 2');
    });

    it('displays the correct arrow icon based on categoryOpen', () => {
        const { rerender } = render(<DropDownCategory {...defaultProps} />);
        expect(screen.getByAltText('arrowDown')).toHaveAttribute('src', ICONS.ARROW_DOWN);

        rerender(<DropDownCategory {...defaultProps} categoryOpen={true} />);
        expect(screen.getByAltText('arrowDown')).toHaveAttribute('src', ICONS.ARROW_UP);
    });

    it('displays a search input when isSearchable is true', () => {
        render(<DropDownCategory {...defaultProps} isSearchable={true} categoryOpen={true} placeholder='Search...' />);
        expect(screen.getByPlaceholderText('Search...')).toBeInTheDocument();
    });

    it('applies displayConvertFn correctly', () => {
        const customConvertFn = (item) => `Custom - ${item}`;
        render(<DropDownCategory {...defaultProps} displayConvertFn={customConvertFn} />);
        expect(screen.getByText('Custom - Category 1')).toBeInTheDocument();
    });
});