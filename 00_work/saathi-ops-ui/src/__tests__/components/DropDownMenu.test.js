import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DropDownMenu from '../../components/DropDownMenu';
import '@testing-library/jest-dom';

const mockHandleCategorySelect = jest.fn();
const mockSetCategoryOpen = jest.fn();

const mockList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday'];

describe('DropDownMenu Component', () => {
    const categoryOpen = true;
    it('renders dropdown items correctly', () => {
        render(
            <DropDownMenu
                isBoxShadow={true}
                top={'50px'}
                border={'1px solid #ccc'}
                isScrollable={false}
                handleCategorySelect={mockHandleCategorySelect}
                categoryOpen={true}
                setCategoryOPen={mockSetCategoryOpen}
                listItem={mockList}
            />
        );

        mockList.forEach((item) => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });
    });

    it('calls handleCategorySelect when an item is clicked', () => {
        render(
            <DropDownMenu
                isBoxShadow={true}
                top={'50px'}
                border={'1px solid #ccc'}
                isScrollable={false}
                handleCategorySelect={mockHandleCategorySelect}
                categoryOpen={true}
                setCategoryOPen={mockSetCategoryOpen}
                listItem={mockList}
            />
        );

        const firstItem = screen.getByText('Monday');
        fireEvent.click(firstItem);
        expect(mockHandleCategorySelect).toHaveBeenCalledWith('Monday');
    });

    it('applies scrollable class when isScrollable is true', () => {
        render(
            <DropDownMenu
                isBoxShadow={true}
                top={'50px'}
                border={'1px solid #ccc'}
                isScrollable={true}
                handleCategorySelect={mockHandleCategorySelect}
                categoryOpen={true}
                setCategoryOPen={mockSetCategoryOpen}
                listItem={mockList}
            />
        );
        const dropdownElement = screen.getByTestId('dropdown-menu');
        expect(dropdownElement).toHaveStyle('overflow-y: scroll');
    });
});
