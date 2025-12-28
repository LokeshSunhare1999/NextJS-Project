import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import LocationInput from '../../../components/common/LocationInput';
import '@testing-library/jest-dom';

describe('LocationInput Component', () => {
    const mockOnLocationSelect = jest.fn();
    const mockOnLocationRemove = jest.fn();

    const defaultProps = {
        locationData: {},
        onLocationSelect: mockOnLocationSelect,
        onLocationRemove: mockOnLocationRemove,
        isMandatory: true,
        error: '',
        isDisabled: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component without crashing', () => {
        render(<LocationInput {...defaultProps} />);
        expect(screen.getByText('Job Location')).toBeInTheDocument();
    });

    it('displays the mandatory asterisk when isMandatory is true', () => {
        render(<LocationInput {...defaultProps} />);
        expect(screen.getByText('*')).toBeInTheDocument();
    });

    it('does not display the mandatory asterisk when isMandatory is false', () => {
        render(<LocationInput {...defaultProps} isMandatory={false} />);
        expect(screen.queryByText('*')).not.toBeInTheDocument();
    });

    it('displays the error message when error is provided', () => {
        render(<LocationInput {...defaultProps} error="Location is required" />);
        expect(screen.getByText('Location is required')).toBeInTheDocument();
    });

    it('disables the input when isDisabled is true', () => {
        render(<LocationInput {...defaultProps} isDisabled={true} />);
        const inputElement = screen.getByPlaceholderText('Search Places ...');
        expect(inputElement).toBeDisabled();
    });

    it('calls onLocationRemove when the close icon is clicked', () => {
        const locationData = {
            address_components: [
                { types: ['locality'], long_name: 'New York' },
            ],
            formatted_address: 'New York, NY, USA',
            geometry: {
                location: {
                    lat: () => 40.7128,
                    lng: () => -74.006,
                },
            },
        };
        render(<LocationInput {...defaultProps} locationData={locationData} />);
        const closeIcon = screen.getByAltText('close');
        fireEvent.click(closeIcon);
        expect(mockOnLocationRemove).toHaveBeenCalled();
    });

    it('displays the selected location in a pill', () => {
        const locationData = {
            address_components: [
                { types: ['locality'], long_name: 'New York' },
            ],
            formatted_address: 'New York, NY, USA',
            geometry: {
                location: {
                    lat: () => 40.7128,
                    lng: () => -74.006,
                },
            },
        };
        render(<LocationInput {...defaultProps} locationData={locationData} />);
        expect(screen.getByText('New York')).toBeInTheDocument();
    });
});