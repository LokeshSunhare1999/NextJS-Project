import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddAgentDrawer from '../../../components/merchantSupport/AddAgentDrawer';
import { usePostAddUser } from '../../../apis/queryHooks';
import { isValidPhoneNumber } from '../../../utils/helper';

// Mock the dependencies
jest.mock('../../../apis/queryHooks', () => ({
    usePostAddUser: jest.fn()
}));

jest.mock('../../../utils/helper', () => ({
    isValidPhoneNumber: jest.fn()
}));

jest.mock('notistack', () => ({
    useSnackbar: jest.fn().mockReturnValue({
        enqueueSnackbar: jest.fn()
    })
}));

// Mock the child components
jest.mock('../../../components/common/DisplayDrawer', () => ({
    __esModule: true,
    default: jest.fn(({ children, headerContent, footerContent, open, handleCloseDrawer }) => (
        open ? (
            <div data-testid="display-drawer">
                <div data-testid="header-content">{headerContent()}</div>
                {children}
                <div data-testid="footer-content">{footerContent()}</div>
                <button data-testid="close-drawer-button" onClick={handleCloseDrawer}>Close</button>
            </div>
        ) : null
    ))
}));

jest.mock('../../../components/CustomCTA', () => ({
    __esModule: true,
    default: jest.fn(({ onClick, title, isLoading }) => (
        <button data-testid="custom-cta" onClick={onClick} disabled={isLoading}>
            {title}
            {isLoading && <span data-testid="loading-indicator">Loading...</span>}
        </button>
    ))
}));

jest.mock('../../../components/common/DrawerInput', () => ({
    __esModule: true,
    default: jest.fn(({
        fieldHeader,
        fieldValue,
        fieldError,
        handleFieldChange,
        fieldPlaceholder,
        errorText
    }) => (
        <div data-testid={`input-${fieldHeader.toLowerCase().replace(/\s/g, '-')}`}>
            <label>{fieldHeader}</label>
            <input
                value={fieldValue}
                onChange={handleFieldChange}
                placeholder={fieldPlaceholder}
                data-testid={`${fieldHeader.toLowerCase().replace(/\s/g, '-')}-input`}
            />
            {fieldError && <span data-testid={`${fieldHeader.toLowerCase().replace(/\s/g, '-')}-error`}>{errorText}</span>}
        </div>
    ))
}));

describe('AddAgentDrawer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockSetOpen = jest.fn();
    const mockRefetchAllFieldAgents = jest.fn();
    const mockPostAddUserMutate = jest.fn();
    const mockEnqueueSnackbar = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        usePostAddUser.mockReturnValue({
            mutateAsync: mockPostAddUserMutate,
            status: 'idle',
            error: null
        });

        isValidPhoneNumber.mockReturnValue(true);

        require('notistack').useSnackbar.mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });
    });

    const defaultProps = {
        open: true,
        setOpen: mockSetOpen,
        refetchAllFieldAgents: mockRefetchAllFieldAgents
    };

    it('should render correctly when open is true', () => {
        render(<AddAgentDrawer {...defaultProps} />);

        expect(screen.getByTestId('display-drawer')).toBeInTheDocument();
        expect(screen.getByTestId('header-content')).toHaveTextContent('Add Agent');
        expect(screen.getByTestId('input-name')).toBeInTheDocument();
        expect(screen.getByTestId('input-phone-number')).toBeInTheDocument();
        expect(screen.getByTestId('custom-cta')).toHaveTextContent('Create');
    });

    it('should not render when open is false', () => {
        render(<AddAgentDrawer {...defaultProps} open={false} />);

        expect(screen.queryByTestId('display-drawer')).not.toBeInTheDocument();
    });

    it('should close the drawer when close button is clicked', () => {
        render(<AddAgentDrawer {...defaultProps} />);

        fireEvent.click(screen.getByTestId('close-drawer-button'));

        expect(mockSetOpen).toHaveBeenCalledWith(false);
    });

    it('should update field values when inputs change', () => {
        render(<AddAgentDrawer {...defaultProps} />);

        const nameInput = screen.getByTestId('name-input');
        const phoneInput = screen.getByTestId('phone-number-input');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '9876543210' } });

        expect(nameInput.value).toBe('John Doe');
        expect(phoneInput.value).toBe('9876543210');
    });

    it('should show error for empty name field on form submission', () => {
        render(<AddAgentDrawer {...defaultProps} />);

        const phoneInput = screen.getByTestId('phone-number-input');
        fireEvent.change(phoneInput, { target: { value: '9876543210' } });

        fireEvent.click(screen.getByTestId('custom-cta'));

        expect(screen.getByTestId('name-error')).toBeInTheDocument();

        expect(mockPostAddUserMutate).not.toHaveBeenCalled();
    });

    it('should show error for invalid phone number on form submission', () => {
        isValidPhoneNumber.mockReturnValue(false);

        render(<AddAgentDrawer {...defaultProps} />);

        const nameInput = screen.getByTestId('name-input');
        const phoneInput = screen.getByTestId('phone-number-input');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: 'invalid' } });

        fireEvent.click(screen.getByTestId('custom-cta'));

        expect(screen.getByTestId('phone-number-error')).toBeInTheDocument();

        expect(mockPostAddUserMutate).not.toHaveBeenCalled();
    });

    it('should call API with correct data when form is valid', async () => {
        mockPostAddUserMutate.mockResolvedValue({});

        render(<AddAgentDrawer {...defaultProps} />);

        const nameInput = screen.getByTestId('name-input');
        const phoneInput = screen.getByTestId('phone-number-input');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '9876543210' } });

        fireEvent.click(screen.getByTestId('custom-cta'));

        expect(mockPostAddUserMutate).toHaveBeenCalledWith({
            userContact: {
                phoneNo: '9876543210',
                dialCode: '+91',
            },
            name: 'John Doe',
            sourceType: 'OPS',
            userReferrence: 'FIELD_AGENT',
            userType: 'CUSTOMER',
        });
    });

    it('should show loading state during API call', () => {
        usePostAddUser.mockReturnValue({
            mutateAsync: mockPostAddUserMutate,
            status: 'pending',
            error: null
        });

        render(<AddAgentDrawer {...defaultProps} />);

        expect(screen.getByTestId('loading-indicator')).toBeInTheDocument();
    });

    it('should show success message, close drawer and refetch data on successful API call', async () => {
        mockPostAddUserMutate.mockResolvedValue({});

        render(<AddAgentDrawer {...defaultProps} />);

        const nameInput = screen.getByTestId('name-input');
        const phoneInput = screen.getByTestId('phone-number-input');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '9876543210' } });

        fireEvent.click(screen.getByTestId('custom-cta'));

        await waitFor(() => {
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
                'Field Agent Created Successfully',
                { variant: 'success' }
            );

            expect(mockSetOpen).toHaveBeenCalledWith(false);

            expect(mockRefetchAllFieldAgents).toHaveBeenCalled();

            // Check if form was reset
            expect(nameInput.value).toBe('');
            expect(phoneInput.value).toBe('');
        });
    });

    it('should clear fields and errors after API call even if it fails', async () => {
        // mockPostAddUserMutate.mockRejectedValue(new Error('API error'));

        render(<AddAgentDrawer {...defaultProps} />);

        const nameInput = screen.getByTestId('name-input');
        const phoneInput = screen.getByTestId('phone-number-input');

        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        fireEvent.change(phoneInput, { target: { value: '9876543210' } });

        fireEvent.click(screen.getByTestId('custom-cta'));

        await waitFor(() => {
            expect(nameInput.value).toBe('');
            expect(phoneInput.value).toBe('');
        });
    });
});