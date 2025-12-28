import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FilterDrawer from '../../../components/common/FilterDrawer';

const mockToggleDrawer = jest.fn();
const mockHandleApplyClick = jest.fn();
const mockClearFilters = jest.fn();
const mockHandleCheckboxChange = jest.fn();

const filterCheckboxesMock = [
    {
        fieldType: 'filter',
        fieldHeader: 'Category',
        showFieldHeader: true,
        filterHeader: 'Select Category',
        headerWeight: '500',
        checkboxes: [
            { label: 'Gym', checked: false },
            { label: 'Yoga', checked: true },
        ],
        handleCheckboxChange: mockHandleCheckboxChange,
    },
];

describe('FilterDrawer Component', () => {
    it('renders FilterDrawer correctly when open', () => {
        render(
            <FilterDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                totalFiltersCount={2}
                handleApplyClick={mockHandleApplyClick}
                clearFilters={mockClearFilters}
                filterCheckboxes={filterCheckboxesMock}
            />
        );

        expect(screen.getByText('Filter')).toBeInTheDocument();
        expect(screen.getByText('Apply')).toBeInTheDocument();
        expect(screen.getByText('Clear Filters')).toBeInTheDocument();
        expect(screen.getByText('Select Category')).toBeInTheDocument();
    });

    it('calls handleApplyClick when Apply button is clicked', () => {
        render(
            <FilterDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                totalFiltersCount={2}
                handleApplyClick={mockHandleApplyClick}
                clearFilters={mockClearFilters}
                filterCheckboxes={filterCheckboxesMock}
            />
        );

        fireEvent.click(screen.getByText('Apply'));
        expect(mockHandleApplyClick).toHaveBeenCalled();
    });

    it('calls clearFilters when Clear Filters button is clicked', () => {
        render(
            <FilterDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                totalFiltersCount={2}
                handleApplyClick={mockHandleApplyClick}
                clearFilters={mockClearFilters}
                filterCheckboxes={filterCheckboxesMock}
            />
        );

        fireEvent.click(screen.getByText('Clear Filters'));
        expect(mockClearFilters).toHaveBeenCalled();
    });

    it('disables Clear Filters button when totalFiltersCount is 0', () => {
        render(
            <FilterDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                totalFiltersCount={0}
                handleApplyClick={mockHandleApplyClick}
                clearFilters={mockClearFilters}
                filterCheckboxes={filterCheckboxesMock}
            />
        );
        const clearFiltersButton = screen.getByRole('button', { name: /clear filters/i });
        expect(clearFiltersButton).toBeDisabled();
    });
});
