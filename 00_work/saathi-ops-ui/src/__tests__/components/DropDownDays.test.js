import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DropDownDays from '../../components/DropDownDays';
import '@testing-library/jest-dom';

describe('DropDownDays Component', () => {
    const mockHandleCategorySelect = jest.fn();
    const mockSetCategoryOpen = jest.fn();
    const mockList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

    it('renders without crashing', () => {
        render(
            <DropDownDays
                category="Monday"
                handleCategorySelect={mockHandleCategorySelect}
                categoryOpen={false}
                setCategoryOPen={mockSetCategoryOpen}
                listItem={mockList}
            />
        );

        expect(screen.getByText(/Monday/)).toBeInTheDocument();
    });

    it('displays category name properly', () => {
        render(
            <DropDownDays
                category="Tuesday"
                handleCategorySelect={mockHandleCategorySelect}
                categoryOpen={false}
                setCategoryOPen={mockSetCategoryOpen}
                listItem={mockList}
            />
        );

        expect(screen.getByText(/Tuesday/)).toBeInTheDocument();
    });

    it('handles input change when searchable', () => {
        render(
            <DropDownDays
                category=""
                handleCategorySelect={mockHandleCategorySelect}
                categoryOpen={false}
                setCategoryOPen={mockSetCategoryOpen}
                listItem={mockList}
                isSearchable={true}
            />
        );

        const input = screen.getByPlaceholderText('');
        fireEvent.change(input, { target: { value: 'Wed' } });

        expect(input.value).toBe('Wed');
    });

    it('handles arrow up and down clicks', () => {
        render(
            <DropDownDays
                category="Tuesday"
                handleCategorySelect={mockHandleCategorySelect}
                categoryOpen={false}
                setCategoryOPen={mockSetCategoryOpen}
                listItem={mockList}
            />
        );

        const upArrow = screen.getByAltText('arrowUp');
        const downArrow = screen.getByAltText('arrowDown');

        fireEvent.click(downArrow);
        expect(mockHandleCategorySelect).toHaveBeenCalled();

        fireEvent.click(upArrow);
        expect(mockHandleCategorySelect).toHaveBeenCalled();
    });

    it('displays error message when isError is true', () => {
        render(
            <DropDownDays
                category="Monday"
                handleCategorySelect={mockHandleCategorySelect}
                categoryOpen={false}
                setCategoryOPen={mockSetCategoryOpen}
                listItem={mockList}
                isError={true}
                errorMessage="This is an error"
            />
        );

        expect(screen.getByText('This is an error')).toBeInTheDocument();
    });
});
