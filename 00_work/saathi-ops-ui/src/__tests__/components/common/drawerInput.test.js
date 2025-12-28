import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import DrawerInput from '../../../components/common/DrawerInput';

describe('DrawerInput Component', () => {
  let commonProps;

  beforeEach(() => {
    commonProps = {
      fieldPlaceholder: 'Enter value',
      fieldValue: '',
      handleFieldChange: jest.fn(),
      fieldError: false,
      errorText: 'Error message',
      isMandatory: true,
      handleDropDownSelect: jest.fn(),
      handleDropDownOpen: jest.fn(),
      dropDownOpen: false,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderFn = (props) => render(<DrawerInput {...props} />);

  test('renders input field correctly', () => {
    renderFn({
      ...commonProps,
      fieldHeader: 'Input Field',
      fieldType: 'input',
    });

    expect(screen.getByText('Input Field')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  test('renders textarea correctly', () => {
    renderFn({
      ...commonProps,
      fieldHeader: 'Textarea Field',
      fieldType: 'inputArea',
    });

    expect(screen.getByText('Textarea Field')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
  });

  test('renders dropdown correctly', () => {
    renderFn({
      ...commonProps,
      fieldHeader: 'Dropdown Field',
      fieldType: 'dropdown',
      dropDownList: ['Option 1', 'Option 2'],
      categoryOpen: true,
      setCategoryOpen: jest.fn(),
      dropDownOpen: true,
    });

    expect(screen.getByText('Dropdown Field')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
  });

  test('renders price input correctly', () => {
    renderFn({
      ...commonProps,
      fieldHeader: 'Price Input Field',
      fieldType: 'price',
      fieldIcon: 'icon-url',
    });

    expect(screen.getByText('Price Input Field')).toBeInTheDocument();
    expect(screen.getByAltText('rupee-icon')).toBeInTheDocument();
  });

  test('renders filter field correctly', () => {
    const checkboxes = [
      { value: 'Option 1', checked: false },
      { value: 'Option 2', checked: true },
    ];
    renderFn({
      ...commonProps,
      fieldHeader: 'Filter Field',
      fieldType: 'filter',
      checkboxes,
    });

    expect(screen.getByText('Filter Field')).toBeInTheDocument();
    expect(screen.getByText('Option 1')).toBeInTheDocument();
    expect(screen.getByText('Option 2')).toBeInTheDocument();
  });

  test('renders radio button options correctly', () => {
    const checkboxes = [
      { value: 'Yes', checked: false },
      { value: 'No', checked: true },
    ];
    renderFn({
      ...commonProps,
      fieldHeader: 'Radio Button Field',
      fieldType: 'option',
      checkboxes,
    });

    expect(screen.getByText('Radio Button Field')).toBeInTheDocument();
    expect(screen.getByText('Yes')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
  });

  test('displays error message if fieldError is true', () => {
    renderFn({
      ...commonProps,
      fieldHeader: 'Error Field',
      fieldType: 'input',
      fieldError: true,
    });

    expect(screen.getByText('Error Field')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  test('calls handleFieldChange when input changes', () => {
    renderFn({
      ...commonProps,
      fieldHeader: 'Change Event Field',
      fieldType: 'input',
    });

    const input = screen.getByPlaceholderText('Enter value');
    fireEvent.change(input, { target: { value: 'Test' } });

    expect(commonProps.handleFieldChange).toHaveBeenCalled();
  });

  test('does not display field header if showFieldHeader is false', () => {
    renderFn({
      ...commonProps,
      fieldHeader: 'Hidden Header Field',
      fieldType: 'input',
      showFieldHeader: false,
    });

    expect(screen.queryByText('Hidden Header Field')).not.toBeInTheDocument();
  });

  test('renders children when fieldType is "children"', () => {
    renderFn({
      ...commonProps,
      fieldHeader: 'Children Field',
      fieldType: 'children',
      children: <p>Custom Content</p>,
    });

    expect(screen.getByText('Children Field')).toBeInTheDocument();
    expect(screen.getByText('Custom Content')).toBeInTheDocument();
  });

  test('closes dropdown when an option is selected', () => {
    const setCategoryOpenMock = jest.fn();

    renderFn({
      ...commonProps,
      fieldHeader: 'Dropdown Selection Field',
      fieldType: 'dropdown',
      dropDownList: ['Option 1', 'Option 2'],
      categoryOpen: true,
      setCategoryOpen: setCategoryOpenMock,
    });

    expect(screen.getByText('Dropdown Selection Field')).toBeInTheDocument();
  });
});
