import React, { act } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CompanyAddress from '../../../components/employers/CompanyAddress';

describe('CompanyAddress Component', () => {
    const mockData = {
        address1: '',
        address2: '',
        pincode: '',
        city: '',
        state: '',
    };

    const mockErrors = {
        address1: null,
        address2: null,
        pincode: null,
        city: null,
        state: null,
    };

    let mockSetData;
    let mockSetErrors;
    let mockSetPincode;
    jest.spyOn(console, 'error').mockImplementation(() => { });
    beforeEach(() => {
        mockSetData = jest.fn();
        mockSetErrors = jest.fn();
        mockSetPincode = jest.fn();
        render(
            <CompanyAddress
                data={mockData}
                setData={mockSetData}
                errors={mockErrors}
                setErrors={mockSetErrors}
                setPincode={mockSetPincode}
            />
        );
    });

    it('renders without crashing', () => {
        expect(screen.getByText('Company Address')).toBeInTheDocument();
    });

    it('renders all input fields correctly', () => {
        const addressValues = ['Enter address 1', 'Enter address 2', 'Enter pin code', 'Enter city', 'Enter state'];

        addressValues.forEach((value) => {
            expect(screen.getByPlaceholderText(value)).toBeInTheDocument();
        })
    });

    it('validates pincode input', () => {
        const pincodeInput = screen.getByPlaceholderText('Enter pin code');
        fireEvent.change(pincodeInput, { target: { value: '123456' } });
      
        expect(mockSetData).toHaveBeenCalledWith(expect.any(Function));
      
        const updaterFunction = mockSetData.mock.calls[0][0];
        const updatedState = updaterFunction(mockData);
      
        // Verify the updated state
        expect(updatedState).toEqual({
          ...mockData,
          pincode: '123456',
        });
    });

    it('updates state on input change', () => {
        const address1Input = screen.getByPlaceholderText('Enter address 1');
        fireEvent.change(address1Input, { target: { value: '123 Main St' } });

        expect(mockSetData).toHaveBeenCalledWith(expect.any(Function));

        // Simulate the callback function to verify the updated state
        const updaterFunction = mockSetData.mock.calls[0][0]; // Get the first argument (the callback function)
        const updatedState = updaterFunction(mockData); // Pass the previous state to the callback

        // Verify the updated state
        expect(updatedState).toEqual({
            ...mockData,
            address1: '123 Main St',
        });
    });

    it('displays error messages for invalid input', () => {
        const mockErrorsWithMessage = {
            ...mockErrors,
            pincode: 'Invalid pincode',
        };

        render(
            <CompanyAddress
                data={mockData}
                setData={mockSetData}
                errors={mockErrorsWithMessage}
                setErrors={mockSetErrors}
                setPincode={mockSetPincode}
            />
        );

        expect(screen.getByText('Invalid pincode')).toBeInTheDocument();
    });

    it('disables city and state fields', () => {
        const cityInput = screen.getByPlaceholderText('Enter city');
        const stateInput = screen.getByPlaceholderText('Enter state');

        expect(cityInput).toBeDisabled();
        expect(stateInput).toBeDisabled();
    });
});