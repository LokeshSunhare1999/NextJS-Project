import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectableInputPill from '../../../components/common/SelectableInputPill';

// Mock the CustomCTA and ICONS
jest.mock('../../../assets/icons', () => ({
    CROSS_ICON_BLUE: 'cross_icon_blue.png',
}));

jest.mock('../../../components/CustomCTA', () => ({
    __esModule: true,
    default: ({ onClick, title }) => (
        <button onClick={onClick}>{title}</button>
    ),
}));

describe('SelectableInputPill Component', () => {
    let props;

    beforeEach(() => {
        props = {
            currentValue: '',
            onChange: jest.fn(),
            header: 'Test Header',
            placeholder: 'Enter value',
            isMandatory: false,
            onAdd: jest.fn(),
            selectedPills: [],
            onRemove: jest.fn(),
            inputContainerWidth: '100%',
            error: '',
        };
    });

    it('renders the component with initial props', () => {
        render(<SelectableInputPill {...props} />);
        expect(screen.getByText('Test Header')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter value')).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    it('handles input change', () => {
        render(<SelectableInputPill {...props} />);
        const input = screen.getByPlaceholderText('Enter value');
        fireEvent.change(input, { target: { value: 'New Pill' } });
        expect(props.onChange).toHaveBeenCalledWith('New Pill');
    });

    it('calls onAdd function when Save button is clicked', () => {
        render(<SelectableInputPill {...props} />);
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
        expect(props.onAdd).toHaveBeenCalled();
    });

    it('renders selected pills and allows removal', () => {
        props.selectedPills = ['Pill 1', 'Pill 2'];
        render(<SelectableInputPill {...props} />);

        expect(screen.getByText('Pill 1')).toBeInTheDocument();
        expect(screen.getByText('Pill 2')).toBeInTheDocument();

        const removeIcons = screen.getAllByRole('img');
        fireEvent.click(removeIcons[0]); // Click the first pill's remove icon
        expect(props.onRemove).toHaveBeenCalledWith(0);
    });

    it('displays an error message when error prop is present', () => {
        props.error = 'This field is required';
        render(<SelectableInputPill {...props} />);
        expect(screen.getByText('This field is required')).toBeInTheDocument();
    });
});