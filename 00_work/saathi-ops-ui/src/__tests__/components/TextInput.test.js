import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import TextInput from '../../components/TextInput';

const mockSetValue = jest.fn();
const mockHandleRightIconClick = jest.fn();

const defaultProps = {
    ariaLabel: 'input-field',
    type: 'text',
    name: 'test-input',
    placeholder: 'Enter text',
    value: '',
    setValue: mockSetValue,
    labelClasses: {},
    labelFocusedClasses: {},
    inputContainerClasses: {},
    inputClasses: {},
    leftIconClass: {},
    leftIcon: 'left-icon.png',
    leftIconFocused: 'left-icon-focused.png',
    showRightIcon: true,
    rightIconClass: {},
    rightIcon: 'right-icon.png',
    rightIconActive: 'right-icon-active.png',
    handleRightIconClick: mockHandleRightIconClick,
    onFocus: jest.fn(),
};

describe('TextInput Component', () => {
    it('renders input correctly', () => {
        render(<TextInput {...defaultProps} />);
        expect(screen.getByLabelText(/input-field/i)).toBeInTheDocument();
    });

    it('calls setValue when typing in input', () => {
        render(<TextInput {...defaultProps} />);
        const input = screen.getByRole('textbox');
        fireEvent.change(input, { target: { value: 'Hello' } });
        expect(mockSetValue).toHaveBeenCalledWith('Hello');
    });

    it('displays left icon', () => {
        render(<TextInput {...defaultProps} />);
        expect(screen.getByAltText('left-icon')).toBeInTheDocument();
    });

    it('toggles right icon on click', () => {
        render(<TextInput {...defaultProps} />);
        const rightIcon = screen.getByAltText('right-icon');
        fireEvent.click(rightIcon);
        expect(mockHandleRightIconClick).toHaveBeenCalled();
    });
});
