import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import MultiSelect from '../../components/MultiSelect';

const optionsList = ['Option 1', 'Option 2', 'Option 3'];
const selectedOptions = ['Option 1'];
const handleChange = jest.fn();

describe('MultiSelect Component', () => {

    it('renders MultiSelect component', () => {
        render(
            <MultiSelect
                optionsList={optionsList}
                selectedOptions={selectedOptions}
                handleChange={handleChange}
            />
        );
        // MUI select element is rendered as a role = combobox
        expect(screen.getByRole('combobox')).toBeInTheDocument();
    });

    it('renders all options', () => {
        render(
            <MultiSelect
                optionsList={optionsList}
                selectedOptions={selectedOptions}
                handleChange={handleChange}
            />
        );

        const select = screen.getByRole('combobox');
        fireEvent.mouseDown(select);

        optionsList.forEach((option) => {
            expect(screen.getAllByText(option).length).toBeGreaterThan(0);
        });
    });

    it('calls handleChange when an option is selected', () => {
        render(
            <MultiSelect
                optionsList={optionsList}
                selectedOptions={selectedOptions}
                handleChange={handleChange}
            />
        );
        // open dropdown
        const select = screen.getByRole('combobox');
        fireEvent.mouseDown(select);

        // select an option
        const option = screen.getByText('Option 2');
        fireEvent.click(option);

        // check that handleChange was called while selecting an option
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('displays selected options correctly', () => {
        render(
            <MultiSelect
                optionsList={optionsList}
                selectedOptions={selectedOptions}
                handleChange={handleChange}
            />
        );
        const selectBox = screen.getByRole('combobox');
        expect(within(selectBox).getByText('Option 1')).toBeInTheDocument();
    });
});