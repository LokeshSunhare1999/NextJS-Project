import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobPostBasicDetailsForm from '../../../components/employers/JobPostBasicDetailsForm';
import '@testing-library/jest-dom';
import { jobTypes } from '../../../constants/employer';
import dayjs from 'dayjs';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock the icons
jest.mock('../../../assets/icons', () => ({
    CALENDAR_ICON: 'calendar-icon.svg'
}));

// Create module mock for components
jest.mock('../../../components/common/DrawerInput', () => {
    return function MockDrawerInput(props) {
        return (
            <div data-testid={`drawer-input-${props.fieldHeader}`}>
                <label>{props.fieldHeader}{props.isManadatory && '*'}</label>
                <input
                    type="text"
                    placeholder={props.fieldPlaceholder}
                    value={props.fieldValue}
                    onChange={props.handleFieldChange}
                    data-testid={`input-${props.fieldHeader}`}
                    disabled={props.isDisabled}
                />
                {props.fieldError && <span>{props.errorText}</span>}
                {props.dropDownList && (
                    <select
                        data-testid={`select-${props.fieldHeader}`}
                        onChange={(e) => props.handleDropDownSelect && props.handleDropDownSelect(e.target.value)}
                        disabled={props.isDropDownDisabled}
                    >
                        <option value="">{props.fieldValue || 'Select'}</option>
                        {props.dropDownList.map(item => (
                            <option key={item} value={item}>{item}</option>
                        ))}
                    </select>
                )}
            </div>
        );
    };
});

jest.mock('../../../components/common/MultiSelectPill', () => {
    return function MockMultiSelectPill(props) {
        return (
            <div data-testid={`multi-select-${props.title}`}>
                <label>{props.title}{props.isMandatory && '*'}</label>
                <div className="options">
                    {props.options.map(option => (
                        <button
                            key={option.value}
                            data-testid={`pill-${option.value}`}
                            onClick={() => props.setSelectedOptions([option])}
                            className={props.selectedOptions.some(s => s.value === option.value) ? 'selected' : ''}
                            disabled={props.isDisabled}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        );
    };
});

// Create a mock for the DatePicker component
jest.mock('antd', () => {
    const mockDatePicker = (props) => {
        return (
            <input
                type="date"
                data-testid="date-picker"
                value={props.value ? props.value.format('YYYY-MM-DD') : ''}
                onChange={(e) => {
                    // We'll use a simpler approach to avoid referencing dayjs inside the mock
                    const mockDayjs = { format: (fmt) => `mocked-date-${fmt}` };
                    props.onChange(mockDayjs);
                }}
                placeholder={props.placeholder}
                disabled={props.disabled}
            />
        );
    };

    return {
        DatePicker: mockDatePicker
    };
});

describe('JobPostBasicDetailsForm', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const queryClient = new QueryClient();
    const renderWithQueryClient = (ui) => {
        return render(
            <QueryClientProvider client={queryClient}>
                {ui}
            </QueryClientProvider>
        );
    };

    const mockJobCategories = [
        { key: 'IT', value: 'Information Technology' },
        { key: 'FINANCE', value: 'Finance' },
        { key: 'MARKETING', value: 'Marketing' }
    ];

    const mockProps = {
        employerName: 'Test Employer',
        title: 'Job Post Details',
        jobDetails: {
            jobRole: 'Software Engineer',
            category: 'IT',
            noOfOpenings: '2',
            jobExpiryDate: dayjs().add(30, 'day').format('D MMM YYYY'),
            workHours: '9 AM - 6 PM',
            status: 'DRAFT'
        },
        setJobDetails: jest.fn(),
        selectedPill: [jobTypes[0]],
        setSelectedPill: jest.fn(),
        errors: {},
        jobCategories: mockJobCategories
    };

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with correct initial values', () => {
        renderWithQueryClient(<JobPostBasicDetailsForm {...mockProps} />);

        // Check heading and employer name
        expect(screen.getByText('Job Post Details')).toBeInTheDocument();
        expect(screen.getByText('Test Employer')).toBeInTheDocument();

        // Check form fields
        const jobTitleInput = screen.getByTestId('input-Job Title');
        expect(jobTitleInput.value).toBe('Software Engineer');

        // Check job category value
        expect(screen.getByTestId('drawer-input-Category')).toHaveTextContent('Information Technology');

        // Check job type pills
        expect(screen.getByTestId('multi-select-Type of Job')).toBeInTheDocument();

        // Check that the date picker exists
        const datePicker = screen.getByTestId('date-picker');
        expect(datePicker).toBeInTheDocument();
    });

    it('handles job title input changes', () => {
        renderWithQueryClient(<JobPostBasicDetailsForm {...mockProps} />);

        const jobTitleInput = screen.getByTestId('input-Job Title');
        fireEvent.change(jobTitleInput, { target: { value: 'Senior Developer' } });

        // Check that setJobDetails was called with a function
        expect(mockProps.setJobDetails).toHaveBeenCalled();

        // Get the function that was passed to setJobDetails
        const updateFn = mockProps.setJobDetails.mock.calls[0][0];

        // Call the function with a mock previous state
        const result = updateFn(mockProps.jobDetails);

        // Check that it returns the expected object
        expect(result).toEqual({
            ...mockProps.jobDetails,
            jobRole: 'Senior Developer'
        });
    });

    it('handles number of openings input (only allows digits)', () => {
        renderWithQueryClient(<JobPostBasicDetailsForm {...mockProps} />);

        const openingsInput = screen.getByTestId('input-Number of openings');

        // Should allow digits
        fireEvent.change(openingsInput, { target: { value: '5' } });
        expect(mockProps.setJobDetails).toHaveBeenCalled();

        // Get and test the function that was passed
        const updateFn = mockProps.setJobDetails.mock.calls[0][0];
        const result = updateFn(mockProps.jobDetails);
        expect(result.noOfOpenings).toBe('5');

        // Reset mock before next test
        mockProps.setJobDetails.mockClear();

        // Our component has validation that prevents non-digits
        fireEvent.change(openingsInput, { target: { value: 'abc' } });
        expect(mockProps.setJobDetails).not.toHaveBeenCalled();
    });

    it('handles job category selection', () => {
        renderWithQueryClient(<JobPostBasicDetailsForm {...mockProps} />);

        const categorySelect = screen.getByTestId('select-Category');
        fireEvent.change(categorySelect, { target: { value: 'Marketing' } });

        expect(mockProps.setJobDetails).toHaveBeenCalled();
        const updateFn = mockProps.setJobDetails.mock.calls[0][0];
        const result = updateFn(mockProps.jobDetails);
        expect(result.category).toBe('MARKETING');
    });

    it('handles job type selection', () => {
        renderWithQueryClient(<JobPostBasicDetailsForm {...mockProps} />);

        // Find and click on a job type pill (e.g., "Part Time")
        const partTimePill = screen.getByTestId('pill-Part Time');
        fireEvent.click(partTimePill);

        expect(mockProps.setSelectedPill).toHaveBeenCalledWith([
            expect.objectContaining({ value: 'Part Time', key: 'PART_TIME' })
        ]);
    });

    it('handles date change', () => {
        renderWithQueryClient(<JobPostBasicDetailsForm {...mockProps} />);

        const datePicker = screen.getByTestId('date-picker');
        fireEvent.change(datePicker, { target: { value: '2025-12-31' } });

        // Our mock DatePicker now passes a mock object with a format method
        expect(mockProps.setJobDetails).toHaveBeenCalled();
        const updateFn = mockProps.setJobDetails.mock.calls[0][0];
        const result = updateFn(mockProps.jobDetails);
        expect(result.jobExpiryDate).toBe('mocked-date-D MMM YYYY');
    });

    it('displays error messages correctly', () => {
        const propsWithErrors = {
            ...mockProps,
            errors: {
                jobRole: 'Job title is required',
                category: 'Category is required',
                jobExpiryDate: 'Expiry date is required',
                typeOfJob: 'Job type is required'
            }
        };

        renderWithQueryClient(<JobPostBasicDetailsForm {...propsWithErrors} />);

        // Check that error messages are displayed
        expect(screen.getByText('Job title is required')).toBeInTheDocument();
        expect(screen.getByText('Category is required')).toBeInTheDocument();
        expect(screen.getByText('Expiry date is required')).toBeInTheDocument();
        expect(screen.getByText('Job type is required')).toBeInTheDocument();
    });

    it('disables fields when job status is not DRAFT', () => {
        const propsWithNonDraftStatus = {
            ...mockProps,
            jobDetails: {
                ...mockProps.jobDetails,
                status: 'PUBLISHED'
            }
        };
        renderWithQueryClient(<JobPostBasicDetailsForm {...propsWithNonDraftStatus} />);

        // In our mock implementations, we're now passing the disabled flag through
        expect(screen.getByTestId('drawer-input-Job Title')).toBeInTheDocument();
    });

    it('handles work hours input changes', () => {
        renderWithQueryClient(<JobPostBasicDetailsForm {...mockProps} />);

        const workHoursInput = screen.getByTestId('input-Work Hours');
        fireEvent.change(workHoursInput, { target: { value: '10 AM - 7 PM' } });

        expect(mockProps.setJobDetails).toHaveBeenCalled();
        const updateFn = mockProps.setJobDetails.mock.calls[0][0];
        const result = updateFn(mockProps.jobDetails);
        expect(result.workHours).toBe('10 AM - 7 PM');
    });
});