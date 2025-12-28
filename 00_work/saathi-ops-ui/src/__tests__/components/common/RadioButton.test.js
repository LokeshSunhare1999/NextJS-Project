import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import RadioButton from '../../../components/common/RadioButton';

describe('RadioButton Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });

    it('renders the radio button with label', () => {
        render(<RadioButton label="Option 1" />);
        expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('renders as checked when the checked prop is true', () => {
        render(<RadioButton label="Option 2" checked={true} />);
        const selector = screen.getByTestId('radioButton');
        expect(selector.firstChild).toBeInTheDocument(); // Checking if the inner circle exists
    });

    it('calls onChange handler when clicked', () => {
        const handleChange = jest.fn();
        render(<RadioButton label="Option 3" onChange={handleChange} />);
        const displayBox = screen.getByTestId('radioButton');

        fireEvent.click(displayBox);
        expect(handleChange).toHaveBeenCalledTimes(1);
    });

    it('renders as unchecked by default', () => {
        render(<RadioButton label="Option 4" />);
        const displayBox = screen.getByTestId('radioButton');
        expect(displayBox.firstChild).toBeNull(); // checking inner circle is not rendered
    });
});