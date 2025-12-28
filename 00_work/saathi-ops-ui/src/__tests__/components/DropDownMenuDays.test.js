import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DropDownMenuDays from '../../components/DropDownMenuDays';

describe('DropDownMenuDays', () => {
  const handleCategorySelect = jest.fn();
  const setCategoryOPen = jest.fn();
  const listItem = ['Item 1', 'Item 2', 'Item 3'];

  const renderComponent = (categoryOpen) => {
    render(
      <DropDownMenuDays
        isBoxShadow={true}
        top="10px"
        border="1px solid #000"
        isScrollable={true}
        handleCategorySelect={handleCategorySelect}
        categoryOpen={categoryOpen}
        setCategoryOPen={setCategoryOPen}
        listItem={listItem}
        displayConvertFn={(item) => item}
      />
    );
  };

  it('renders DropDownMenuDays component', () => {
    renderComponent(true);
    listItem.forEach((item) => {
      expect(screen.getByText(item)).toBeInTheDocument();
    });
  });

  it('calls handleCategorySelect when an item is clicked', () => {
    renderComponent(true);
    fireEvent.click(screen.getByText('Item 1'));
    expect(handleCategorySelect).toHaveBeenCalledWith('Item 1');
  });

});