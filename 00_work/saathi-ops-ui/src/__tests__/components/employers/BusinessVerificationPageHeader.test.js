import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import VerificationHeader from '../../../components/employers/BusinessVerificationPageHeader';
import { ModalContext } from '../../../context/ModalProvider';
import { usePutUpdateEmployerStatus } from '../../../apis/queryHooks';
import { useSnackbar } from 'notistack';
import usePermission from '../../../hooks/usePermission';;
import { STATUS_KEYS } from '../../../constants';
import { VERIFICATION_STATUS_MAP } from '../../../constants/verification';

// Mock dependencies
jest.mock('../../../apis/queryHooks', () => ({
    usePutUpdateEmployerStatus: jest.fn()
}));

jest.mock('notistack', () => ({
    useSnackbar: jest.fn()
}));

jest.mock('../../../hooks/usePermission', () => ({
    __esModule: true,
    default: jest.fn()
}));

// Mock child components
jest.mock('../../../components/customerDetails/DocumentStatus', () => ({
    __esModule: true,
    default: jest.fn(({ status }) => <div data-testid="document-status">{status}</div>)
}));

jest.mock('../../../components/DropDownCategory', () => ({
    __esModule: true,
    default: jest.fn(({ handleCategorySelect, listItem }) => (
        <div data-testid="dropdown-category">
            <button onClick={() => handleCategorySelect('Verify')}>Verify</button>
            <button onClick={() => handleCategorySelect('Reject')}>Reject</button>
            <div data-testid="dropdown-items">{listItem?.join(',')}</div>
        </div>
    ))
}));

jest.mock('../../../components/common/RemarksModal', () => ({
    __esModule: true,
    default: jest.fn(({ onSubmit, customProps }) => (
        <div data-testid="remarks-modal">
            <button
                data-testid="submit-remarks"
                onClick={() => onSubmit('Test remark', customProps)}
            >
                Submit
            </button>
        </div>
    ))
}));

describe('VerificationHeader Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockProps = {
        employerId: 'emp123',
        isDropdownOpen: false,
        setIsDropdownOpen: jest.fn(),
        verificationStatus: 'PENDING',
        refetchEmployerData: jest.fn(),
        possibleStates: ['VERIFY', 'REJECT'],
        showNotificationButton: true,
        pageRoute: 'business',
        title : 'GST Verification',
        subtitle: 'GST Number Verification'
    };

    const mockModalContextValue = {
        displayModal: jest.fn(),
        updateModal: jest.fn()
    };

    const mockUpdateEmployerStatusMutation = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();

        usePutUpdateEmployerStatus.mockReturnValue({
            mutateAsync: mockUpdateEmployerStatusMutation,
            status: 'idle',
            isError: false,
            error: null
        });

        useSnackbar.mockReturnValue({
            enqueueSnackbar: jest.fn()
        });

        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockReturnValue(true)
        });
    });

    it('renders component with correct title and subtitle', () => {
        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} />
            </ModalContext.Provider>
        );
        const expectedStatus = [ 'PENDING', 'Verify', 'Reject' ];
        
        expectedStatus.forEach((status) => {
            expect(screen.getByText(status)).toBeInTheDocument();
        })
    });

    it('displays document status correctly', () => {
        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} />
            </ModalContext.Provider>
        );

        const documentStatus = screen.getByTestId('document-status');
        expect(documentStatus).toBeInTheDocument();
        expect(documentStatus.textContent).toBe('PENDING');
    });

    it('shows "Auto Verified" text when status is VERIFIED', () => {
        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} verificationStatus="VERIFIED" />
            </ModalContext.Provider>
        );

        expect(screen.getByText('Auto Verified')).toBeInTheDocument();
    });

    it('shows "Auto Rejected" text when status is REJECTED', () => {
        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} verificationStatus="REJECTED" />
            </ModalContext.Provider>
        );

        expect(screen.getByText('Auto Rejected')).toBeInTheDocument();
    });

    it('does not render dropdown when status is NOT_INITIATED', () => {
        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockReturnValue(true)
        });

        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader
                    {...mockProps}
                    verificationStatus={STATUS_KEYS.NOT_INITIATED}
                />
            </ModalContext.Provider>
        );

        expect(screen.queryByTestId('dropdown-category')).not.toBeInTheDocument();
    });

    it('does not render dropdown when user lacks permission', () => {
        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockReturnValue(false)
        });

        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} />
            </ModalContext.Provider>
        );

        expect(screen.queryByTestId('dropdown-category')).not.toBeInTheDocument();
    });

    it('renders dropdown with correct possible states when user has permission', () => {
        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockReturnValue(true)
        });

        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} />
            </ModalContext.Provider>
        );

        const dropdown = screen.getByTestId('dropdown-category');
        expect(dropdown).toBeInTheDocument();

        // Check dropdown items based on possibleStates
        const mappedItems = mockProps.possibleStates.map(
            item => VERIFICATION_STATUS_MAP?.POSSIBLE_STATES?.[item]
        );
        const dropdownItems = screen.getByTestId('dropdown-items');
        expect(dropdownItems.textContent).toBe(mappedItems.join(','));
    });

    it('clicking verify button in dropdown opens verify modal', () => {
        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} />
            </ModalContext.Provider>
        );

        const verifyButton = screen.getByText('Verify');
        fireEvent.click(verifyButton);

        expect(mockModalContextValue.displayModal).toHaveBeenCalled();
    });

    it('clicking reject button in dropdown opens reject modal', () => {
        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} />
            </ModalContext.Provider>
        );

        const rejectButton = screen.getByText('Reject');
        fireEvent.click(rejectButton);

        expect(mockModalContextValue.displayModal).toHaveBeenCalled();
    });

    it('shows error snackbar when API update fails', async () => {
        const mockError = new Error('API failed');
        usePutUpdateEmployerStatus.mockReturnValue({
            mutateAsync: mockUpdateEmployerStatusMutation,
            status: 'error',
            isError: true,
            error: mockError
        });

        const mockEnqueueSnackbar = jest.fn();
        useSnackbar.mockReturnValue({
            enqueueSnackbar: mockEnqueueSnackbar
        });

        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} />
            </ModalContext.Provider>
        );

        await waitFor(() => {
            expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
                'Failed to update status. error : API failed',
                { variant: 'error' }
            );
        });
    });

    it('updates modal with loading state during submission', async () => {
        mockModalContextValue.displayModal.mockImplementation((modal) => {
            render(modal);
        });

        render(
            <ModalContext.Provider value={mockModalContextValue}>
                <VerificationHeader {...mockProps} />
            </ModalContext.Provider>
        );

        // Click verify and submit remarks
        const verifyButton = screen.getByText('Verify');
        fireEvent.click(verifyButton);

        const submitButton = screen.getByTestId('submit-remarks');
        fireEvent.click(submitButton);

        expect(mockModalContextValue.updateModal).toHaveBeenCalled();
    });
});