import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BasicDetails from '../../../components/employers/BasicDetails';

jest.mock('../../../constants/details', () => ({
  SALUTATIONS: ['Mr.', 'Mrs.', 'Ms.', 'Dr.'],
}));

jest.mock('../../../constants/regex', () => ({
  REPLACE_PATTERNS: {
    ALPHABETS: /[^a-zA-Z ]/g,
    ALPHABETS_NO_SPACE: /[^a-zA-Z]/g,
    ALPHANUMERIC_WITH_PUNCTUATION: /[^a-zA-Z0-9 .,&'-]/g,
    NUMERIC: /[^0-9]/g,
  },
}));

jest.mock('../../../components/common/DrawerInput', () => {
  return jest.fn(
    ({
      fieldType,
      fieldHeader,
      fieldValue,
      handleFieldChange,
      fieldPlaceholder,
      isManadatory,
      fieldError,
      errorText,
      isDisabled,
      dropDownList,
      dropDownOpen,
      handleDropDownOpen,
      handleDropDownSelect,
    }) => {
      if (fieldType === 'dropdown') {
        return (
          <div data-testid={`drawer-input-${fieldHeader}`}>
            <label>
              {fieldHeader}
              {isManadatory && '*'}
            </label>
            <select
              value={fieldValue}
              data-testid={`dropdown-${fieldHeader}`}
              onChange={(e) => handleDropDownSelect(e.target.value)}
              onClick={() => handleDropDownOpen(!dropDownOpen)}
            >
              {dropDownList &&
                dropDownList.map((item, index) => (
                  <option key={index} value={item}>
                    {item}
                  </option>
                ))}
            </select>
            {dropDownOpen && <div data-testid="dropdown-open">Open</div>}
          </div>
        );
      }
      return (
        <div data-testid={`drawer-input-${fieldHeader}`}>
          <label>
            {fieldHeader}
            {isManadatory && '*'}
          </label>
          <input
            type="text"
            value={fieldValue || ''}
            onChange={handleFieldChange}
            placeholder={fieldPlaceholder}
            disabled={isDisabled}
            data-testid={`input-${fieldHeader}`}
          />
          {fieldError && (
            <span data-testid={`error-${fieldHeader}`}>{errorText}</span>
          )}
        </div>
      );
    },
  );
});

describe('BasicDetails Component', () => {
  const mockData = {
    companyName: 'Test Company',
    workPhone: '0011223344',
    brandName: 'Test Brand',
    companySize: '50',
    title: 'Mrs.',
    firstName: 'John',
    lastName: 'Doe',
  };

  const mockErrors = {
    companyName: '',
    workPhone: '',
    brandName: '',
    companySize: '',
    firstName: '',
    lastName: '',
  };

  const mockSetData = jest.fn();

  const renderComponent = (props = {}) => {
    const defaultProps = {
      data: mockData,
      setData: mockSetData,
      errors: mockErrors,
      isEditMode: false,
      ...props,
    };
    return render(<BasicDetails {...defaultProps} />);
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all input fields correctly', () => {
    renderComponent();

    expect(screen.getByText('Basic Details')).toBeInTheDocument();

    const expectedFields = [
      { testId: 'drawer-input-Company Legal Name', inputValue: 'Test Company' },
      { testId: 'drawer-input-Work Phone', inputValue: '0011223344' },
      { testId: 'drawer-input-Brand Name', inputValue: 'Test Brand' },
      { testId: 'drawer-input-Company Size', inputValue: '50' },
      { testId: 'drawer-input-Title', skipValueCheck: true }, // Skip value check for dropdown
      { testId: 'drawer-input-First Name', inputValue: 'John' },
      { testId: 'drawer-input-Last Name', inputValue: 'Doe' },
    ];

    expectedFields.forEach((field) => {
      expect(screen.getByTestId(field.testId)).toBeInTheDocument();

      if (!field.skipValueCheck) {
        const inputTestId = `input-${field.testId.replace('drawer-input-', '')}`;
        expect(screen.getByTestId(inputTestId)).toHaveValue(field.inputValue);
      }
    });

    expect(screen.getByTestId('dropdown-Title')).toHaveValue('Mrs.');
  });

  it('handles input changes correctly', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('input-Company Legal Name'), {
      target: { value: 'New Company Name' },
    });

    expect(mockSetData).toHaveBeenCalled();

    const updaterFunction = mockSetData.mock.calls[0][0];

    const updatedData = updaterFunction(mockData);

    expect(updatedData).toEqual({
      ...mockData,
      companyName: 'New Company Name',
    });

    mockSetData.mockClear();

    fireEvent.change(screen.getByTestId('input-Work Phone'), {
      target: { value: '1122334455' },
    });

    const phoneUpdaterFunction = mockSetData.mock.calls[0][0];

    const phoneUpdatedData = phoneUpdaterFunction(mockData);

    expect(phoneUpdatedData).toEqual({
      ...mockData,
      workPhone: '1122334455',
    });
  });

  it('applies input validation correctly', () => {
    renderComponent();

    fireEvent.change(screen.getByTestId('input-First Name'), {
      target: { value: 'John123' },
    });

    const firstNameUpdater = mockSetData.mock.calls[0][0];
    const firstNameResult = firstNameUpdater(mockData);

    expect(firstNameResult).toEqual({
      ...mockData,
      firstName: 'John',
    });

    mockSetData.mockClear();

    fireEvent.change(screen.getByTestId('input-Last Name'), {
      target: { value: 'Doe123' },
    });

    const lastNameUpdater = mockSetData.mock.calls[0][0];
    const lastNameResult = lastNameUpdater(mockData);

    expect(lastNameResult).toEqual({
      ...mockData,
      lastName: 'Doe',
    });

    mockSetData.mockClear();

    fireEvent.change(screen.getByTestId('input-Brand Name'), {
      target: { value: 'Brand Name & Co.#$' },
    });

    const brandNameUpdater = mockSetData.mock.calls[0][0];
    const brandNameResult = brandNameUpdater(mockData);

    expect(brandNameResult).toEqual({
      ...mockData,
      brandName: 'Brand Name & Co.',
    });

    mockSetData.mockClear();

    fireEvent.change(screen.getByTestId('input-Company Size'), {
      target: { value: '100abc' },
    });

    const companySizeUpdater = mockSetData.mock.calls[0][0];
    const companySizeResult = companySizeUpdater(mockData);

    expect(companySizeResult).toEqual({
      ...mockData,
      companySize: '100',
    });
  });

  it('displays error messages correctly', () => {
    const customErrors = {
      ...mockErrors,
      companyName: 'Company name is required',
      workPhone: 'Invalid phone no',
    };

    renderComponent({ errors: customErrors });

    expect(screen.getByTestId('error-Company Legal Name')).toHaveTextContent(
      'Company name is required',
    );
    expect(screen.getByTestId('error-Work Phone')).toHaveTextContent(
      'Invalid phone no',
    );
  });

  it('handles title dropdown selection correctly', () => {
    renderComponent();

    fireEvent.click(screen.getByTestId('dropdown-Title'));

    fireEvent.change(screen.getByTestId('dropdown-Title'), {
      target: { value: 'Dr.' },
    });

    // Get the updater function for the title change
    const titleUpdater = mockSetData.mock.calls[0][0];

    const titleResult = titleUpdater(mockData);

    expect(titleResult).toEqual({
      ...mockData,
      title: 'Dr.',
    });
  });

  it('disables work phone input in edit mode', () => {
    renderComponent({ isEditMode: true });

    expect(screen.getByTestId('input-Work Phone')).toBeDisabled();
  });

  it('initializes with default title when not provided', () => {
    renderComponent({ data: { ...mockData, title: undefined } });

    expect(screen.getByTestId('dropdown-Title')).toHaveValue('Mr.');
  });

  it('updates title when data.title changes', () => {
    const { rerender } = renderComponent();

    const newData = { ...mockData, title: 'Dr.' };
    rerender(
      <BasicDetails
        data={newData}
        setData={mockSetData}
        errors={mockErrors}
        isEditMode={false}
      />,
    );

    expect(screen.getByTestId('dropdown-Title')).toHaveValue('Dr.');
  });
});
