import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import JobPostRequirementDetailsForm from '../../../components/employers/JobPostRequirementDetailsForm';
import '@testing-library/jest-dom';

// Mock the components that are imported
jest.mock('../../../components/common/DrawerInput', () => ({ fieldType, children, ...props }) => {
    if (fieldType === 'children') {
        return <div data-testid="drawer-input-children">{children}</div>;
    }
    return (
        <div data-testid="drawer-input">
            <input
                data-testid={`input-${props.fieldPlaceholder}`}
                placeholder={props.fieldPlaceholder}
                value={props.fieldValue}
                onChange={props.handleFieldChange}
                disabled={props.isDisabled}
            />
            {props.fieldError && <span>{props.errorText}</span>}
        </div>
    );
});

jest.mock('../../../components/common/MultiSelectPill', () => ({ title, options, selectedOptions, setSelectedOptions, isDisabled }) => (
    <div data-testid="multi-select-pill">
        <span data-testid="multi-select-title">{title}</span>
        {options.map(option => {
            // Handle both string options and object options
            const optionValue = typeof option === 'object' ? option.value : option;
            const optionKey = typeof option === 'object' ? option.key : option;

            return (
                <button
                    key={optionKey}
                    data-testid={`gender-option-${optionValue}`}
                    disabled={isDisabled}
                    onClick={() => {
                        if (selectedOptions.includes(optionValue)) {
                            setSelectedOptions(selectedOptions.filter(item => item !== optionValue));
                        } else {
                            setSelectedOptions([...selectedOptions, optionValue]);
                        }
                    }}
                >
                    {optionValue}
                </button>
            );
        })}
    </div>
));

jest.mock('../../../components/common/SelectableInputPill', () => ({
    header,
    placeholder,
    selectedPills,
    currentValue,
    onChange,
    onAdd,
    onRemove,
    error
}) => (
    <div data-testid="selectable-input-pill">
        <span data-testid="input-pill-header">{header}</span>
        <input
            data-testid="requirement-input"
            placeholder={placeholder}
            value={currentValue}
            onChange={(e) => onChange(e.target.value)}
        />
        <button data-testid="add-requirement-btn" onClick={onAdd}>Add</button>
        {error && <span data-testid="requirement-error">{error}</span>}
        <div>
            {selectedPills.map((pill, index) => (
                <div key={index} data-testid={`requirement-pill-${index}`}>
                    {pill}
                    <button
                        data-testid={`remove-requirement-${index}`}
                        onClick={() => onRemove(index)}
                    >
                        Remove
                    </button>
                </div>
            ))}
        </div>
    </div>
));

describe('JobPostRequirementDetailsForm', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockJobDetails = {
        requirements: ['Valid ID required', 'Experience in sales'],
        minSalary: '20000',
        maxSalary: '30000',
        isWeeklyPayoutAvailable: false,
        status: 'DRAFT'
    };

    const mockErrors = {};

    const mockSetJobDetails = jest.fn();
    const mockSetSelectedGenders = jest.fn();
    const mockSetErrors = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders form elements correctly', () => {
        render(
            <JobPostRequirementDetailsForm
                jobDetails={mockJobDetails}
                setJobDetails={mockSetJobDetails}
                selectedGenders={[]}
                setSelectedGenders={mockSetSelectedGenders}
                errors={mockErrors}
                setErrors={mockSetErrors}
            />
        );

        expect(screen.getByTestId('multi-select-pill')).toBeInTheDocument();
        expect(screen.getByTestId('multi-select-title')).toHaveTextContent('Gender Preference?');
        expect(screen.getByText('Age Preference?')).toBeInTheDocument();
        expect(screen.getByText('Salary Range')).toBeInTheDocument();
        expect(screen.getByText('Weekly Payout Available')).toBeInTheDocument();
        expect(screen.getByTestId('input-pill-header')).toHaveTextContent('Requirements');
    });

    it('handles gender selection', () => {
        render(
            <JobPostRequirementDetailsForm
                jobDetails={mockJobDetails}
                setJobDetails={mockSetJobDetails}
                selectedGenders={[]}
                setSelectedGenders={mockSetSelectedGenders}
                errors={mockErrors}
                setErrors={mockSetErrors}
            />
        );

        fireEvent.click(screen.getByTestId('gender-option-Male'));
        expect(mockSetSelectedGenders).toHaveBeenCalledWith(['Male']);
    });

    it('shows age input fields when "Yes" is selected for age preference', () => {
        render(
            <JobPostRequirementDetailsForm
                jobDetails={mockJobDetails}
                setJobDetails={mockSetJobDetails}
                selectedGenders={[]}
                setSelectedGenders={mockSetSelectedGenders}
                errors={mockErrors}
                setErrors={mockSetErrors}
            />
        );

        expect(screen.queryByPlaceholderText('Minimum Year')).not.toBeInTheDocument();

        const yesButton = screen.getByText('Yes');
        fireEvent.click(yesButton);

        expect(screen.getByPlaceholderText('Minimum Year')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Maximum Year')).toBeInTheDocument();

        expect(mockSetJobDetails).toHaveBeenCalled();

        const updateFunction = mockSetJobDetails.mock.calls[0][0];
        const result = updateFunction(mockJobDetails);
        expect(result).toEqual(expect.objectContaining({
            isAgePreferenceRequired: true
        }));
    });

    it('handles age input changes', () => {
        const jobDetailsWithAge = {
            ...mockJobDetails,
            minAge: '20',
            maxAge: '40',
            isAgePreferenceRequired: true
        };

        render(
            <JobPostRequirementDetailsForm
                jobDetails={jobDetailsWithAge}
                setJobDetails={mockSetJobDetails}
                selectedGenders={[]}
                setSelectedGenders={mockSetSelectedGenders}
                errors={mockErrors}
                setErrors={mockSetErrors}
            />
        );

        const minAgeInput = screen.getByPlaceholderText('Minimum Year');
        fireEvent.change(minAgeInput, { target: { value: '25' } });

        const updateFunction = mockSetJobDetails.mock.calls[0][0];
        const result = updateFunction(mockJobDetails);
        expect(result).toEqual(expect.objectContaining({
            minAge: '25'
        }));
    });

    it('handles salary range inputs', () => {
        render(
            <JobPostRequirementDetailsForm
                jobDetails={mockJobDetails}
                setJobDetails={mockSetJobDetails}
                selectedGenders={[]}
                setSelectedGenders={mockSetSelectedGenders}
                errors={mockErrors}
                setErrors={mockSetErrors}
            />
        );

        const minSalaryInput = screen.getByTestId('input-Minimum');
        fireEvent.change(minSalaryInput, { target: { value: '25000' } });

        const minSalaryUpdater = mockSetJobDetails.mock.calls[0][0];

        const updatedMinSalaryState = minSalaryUpdater(mockJobDetails);

        expect(updatedMinSalaryState).toMatchObject({
            minSalary: '25000'
        });

        const maxSalaryInput = screen.getByTestId('input-Maximum');
        fireEvent.change(maxSalaryInput, { target: { value: '30000' } });
        const maxSalaryUpdater = mockSetJobDetails.mock.calls[0][0];

        const updatedMaxSalaryState = maxSalaryUpdater(mockJobDetails);

        expect(updatedMaxSalaryState).toMatchObject({
            maxSalary: '30000'
        });
    });

    it('toggles weekly payout checkbox', () => {
        render(
            <JobPostRequirementDetailsForm
                jobDetails={mockJobDetails}
                setJobDetails={mockSetJobDetails}
                selectedGenders={[]}
                setSelectedGenders={mockSetSelectedGenders}
                errors={mockErrors}
                setErrors={mockSetErrors}
            />
        );

        const checkbox = screen.getByText('Weekly Payout Available').previousSibling;
        fireEvent.click(checkbox);
        expect(mockSetJobDetails).toHaveBeenCalled();
        const updateFunction = mockSetJobDetails.mock.calls[0][0];
        const updatedState = updateFunction(mockJobDetails);

        expect(updatedState).toMatchObject({
            isWeeklyPayoutAvailable: false
        });
    });

    it('handles requirement additions', () => {
        render(
            <JobPostRequirementDetailsForm
                jobDetails={mockJobDetails}
                setJobDetails={mockSetJobDetails}
                selectedGenders={[]}
                setSelectedGenders={mockSetSelectedGenders}
                errors={mockErrors}
                setErrors={mockSetErrors}
            />
        );

        const requirementInput = screen.getByTestId('requirement-input');
        fireEvent.change(requirementInput, { target: { value: 'Must have driving license' } });

        const addButton = screen.getByTestId('add-requirement-btn');
        fireEvent.click(addButton);

        expect(mockSetJobDetails).toHaveBeenCalledWith(expect.objectContaining({
            requirements: [...mockJobDetails.requirements, 'Must have driving license']
        }));
    });

    it('handles requirement removal', () => {
        render(
            <JobPostRequirementDetailsForm
                jobDetails={mockJobDetails}
                setJobDetails={mockSetJobDetails}
                selectedGenders={[]}
                setSelectedGenders={mockSetSelectedGenders}
                errors={mockErrors}
                setErrors={mockSetErrors}
            />
        );

        const removeButton = screen.getByTestId('remove-requirement-0');
        fireEvent.click(removeButton);

        expect(mockSetJobDetails).toHaveBeenCalledWith(expect.objectContaining({
            requirements: [mockJobDetails.requirements[1]]
        }));
    });
});