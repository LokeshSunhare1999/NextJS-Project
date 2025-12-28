import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewReferralHistoryDrawer from '../../../components/customerDetails/ViewReferralHistoryDrawer';
import useCustomerReferralHistory from '../../../hooks/customer/useCustomerReferralHistory';

// Mock dependencies
jest.mock('../../../hooks/customer/useCustomerReferralHistory');
jest.mock('../../../components/common/BoxLoader', () => {
    return function MockBoxLoader() {
        return <div data-testid="box-loader">Loading...</div>;
    };
});

jest.mock('../../../components/DisplayTable', () => {
    return function MockDisplayTable(props) {
        return <div data-testid="display-table">DisplayTable</div>;
    };
});

describe('ViewReferralHistoryDrawer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockToggleDrawer = jest.fn();
    const mockUserId = 'user123';

    const mockHookReturn = {
        customerReferralHistoryRows: [
            { id: '1', data: ['Referral 1', 'Completed'] },
            { id: '2', data: ['Referral 2', 'Pending'] },
        ],
        customerReferralHistoryTableHeaders: ['Referral', 'Status'],
        customerReferralHistoryType: ['text', 'text'],
        errorCode: null,
        isCustomerReferralHistoryError: false,
        createTooltipArray: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useCustomerReferralHistory.mockReturnValue(mockHookReturn);
    });

    it('renders the drawer when open is true', () => {
        render(
            <ViewReferralHistoryDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                userId={mockUserId}
            />
        );
        expect(screen.getByText('Withdrawn History')).toBeInTheDocument();
    });

    it('does not render the drawer when open is false', () => {
        render(
            <ViewReferralHistoryDrawer
                open={false}
                toggleDrawer={mockToggleDrawer}
                userId={mockUserId}
            />
        );
        expect(screen.queryByText('Withdrawn History')).not.toBeInTheDocument();
    });

    it('renders the close button', () => {
        render(
            <ViewReferralHistoryDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                userId={mockUserId}
            />
        );
        expect(screen.getByAltText('close-drawer')).toBeInTheDocument();
    });

    it('renders the DisplayTable when data is available', () => {
        render(
            <ViewReferralHistoryDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                userId={mockUserId}
            />
        );
        expect(screen.getByTestId('display-table')).toBeInTheDocument();
    });

    it('renders a loader when data is loading', () => {
        useCustomerReferralHistory.mockReturnValueOnce({
            ...mockHookReturn,
            customerReferralHistoryTableHeaders: [],
        });

        render(
            <ViewReferralHistoryDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                userId={mockUserId}
            />
        );
        expect(screen.getByTestId('box-loader')).toBeInTheDocument();
    });

    it('renders an error message when there is an error', () => {
        useCustomerReferralHistory.mockReturnValueOnce({
            ...mockHookReturn,
            isCustomerReferralHistoryError: true,
            errorCode: 500,
        });

        render(
            <ViewReferralHistoryDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                userId={mockUserId}
            />
        );
        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('renders "No withdrawn history" message when there is no data', () => {
        useCustomerReferralHistory.mockReturnValueOnce({
            ...mockHookReturn,
            isCustomerReferralHistoryError: true,
            errorCode: 404,
        });

        render(
            <ViewReferralHistoryDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                userId={mockUserId}
            />
        );
        expect(screen.getByText('There is no withdrawn history.')).toBeInTheDocument();
    });

    it('handles close drawer button click', () => {
        render(
            <ViewReferralHistoryDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                userId={mockUserId}
            />
        );
        fireEvent.click(screen.getByAltText('close-drawer'));
        expect(mockToggleDrawer).toHaveBeenCalledWith(false);
    });
});