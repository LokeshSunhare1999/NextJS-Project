import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropDown from '../../components/DropDown';

describe('DropDown Component', () => {
  const mockHandleCategoryChange = jest.fn();
  const menuItems = ['Item 1', 'Item 2', 'Item 3'];
  const category = '';

  test('renders DropDown component', () => {
    render(
      <DropDown
        category={category}
        handleCategoryChange={mockHandleCategoryChange}
        menuItems={menuItems}
      />
    );
    expect(screen.getByText('Select Category')).toBeInTheDocument();
  });

  test('displays placeholder text', () => {
    render(
      <DropDown
        category={category}
        handleCategoryChange={mockHandleCategoryChange}
        menuItems={menuItems}
        placeHolder="Select Category"
      />
    );
    expect(screen.getByText('Select Category')).toBeInTheDocument();
  });

  test('displays menu items', () => {
    render(
      <DropDown
        category={category}
        handleCategoryChange={mockHandleCategoryChange}
        menuItems={menuItems}
      />
    );
    fireEvent.mouseDown(screen.getByText('Select Category'));
    menuItems.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  test('calls handleCategoryChange function when an item is selected', () => {
    render(
      <DropDown
        category={category}
        handleCategoryChange={mockHandleCategoryChange}
        menuItems={menuItems}
      />
    );
    fireEvent.mouseDown(screen.getByText('Select Category'));
    fireEvent.click(screen.getByText('Item 1'));
    expect(mockHandleCategoryChange).toHaveBeenCalled();
  });
});