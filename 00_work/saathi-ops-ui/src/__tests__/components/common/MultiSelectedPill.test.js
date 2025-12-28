import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiSelectPill from '../../../components/common/MultiSelectPill';

describe('MultiSelectPill Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const defaultProps = {
        title: 'Select Options',
        options: [
            { key: 'option1', value: 'Option 1' },
            { key: 'option2', value: 'Option 2' },
            { key: 'option3', value: 'Option 3' },
        ],
        selectedOptions: [],
        setSelectedOptions: jest.fn(),
        isMultiselect: true,
        isMandatory: false,
        isDisabled: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with title and options', () => {
        render(<MultiSelectPill {...defaultProps} />);
        expect(screen.getByText('Select Options')).toBeInTheDocument();
        expect(screen.getByText('Option 1')).toBeInTheDocument();
        expect(screen.getByText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('displays a mandatory asterisk when required', () => {
        render(<MultiSelectPill {...defaultProps} isMandatory={true} />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('handles multi-select selection and deselection', () => {
        const setSelectedOptions = jest.fn();
        render(<MultiSelectPill {...defaultProps} setSelectedOptions={setSelectedOptions} />);

        const option1 = screen.getByText('Option 1');
        const option2 = screen.getByText('Option 2');

        fireEvent.click(option1);
        expect(setSelectedOptions).toHaveBeenCalled();

        fireEvent.click(option2);
        expect(setSelectedOptions).toHaveBeenCalled();

        fireEvent.click(option1);
        expect(setSelectedOptions).toHaveBeenCalled();
    });

    it('handles single-select mode', () => {
        const setSelectedOptions = jest.fn();
        render(
            <MultiSelectPill
                {...defaultProps}
                setSelectedOptions={setSelectedOptions}
                isMultiselect={false}
            />
        );

        const option1 = screen.getByText('Option 1');
        const option2 = screen.getByText('Option 2');

        fireEvent.click(option1);
        expect(setSelectedOptions).toHaveBeenCalled();
        
        let updateFn = setSelectedOptions.mock.calls[0][0]
        let updatedState = updateFn([]);
        expect(updatedState).toEqual(['option1']);

        fireEvent.click(option2);
        expect(setSelectedOptions).toHaveBeenCalledTimes(2);

        updateFn = setSelectedOptions.mock.calls[1][0];
        updatedState = updateFn(['option1']);
        expect(updatedState).toEqual(['option2']);
    });

    it('does not allow selection when disabled', () => {
        const setSelectedOptions = jest.fn();
        render(
            <MultiSelectPill
                {...defaultProps}
                setSelectedOptions={setSelectedOptions}
                isDisabled={true}
            />
        );

        const option1 = screen.getByText('Option 1');

        fireEvent.click(option1);
        expect(setSelectedOptions).not.toHaveBeenCalled();
    });
});
