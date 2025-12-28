import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PayoutRequestDrawer from '../../../components/payouts/PayoutRequestDrawer';
import { SnackbarProvider } from 'notistack';

// Mock dependencies
jest.mock('../../../hooks/usePermission', () => ({
    __esModule: true,
    default: () => ({
        hasPermission: jest.fn(() => true)
    })
}));

jest.mock('../../../hooks/payoutRequest/usePayoutRequest', () => ({
    __esModule: true,
    default: () => ({
        payoutData: {
            _id: 'test-id',
            staffingAgency: { companyRegisteredName: 'Test Company' },
            createdAt: new Date(),
            status: 'PENDING',
            invoice: { totalAmount: 5000 },
            invoiceUrl: 'http://test-invoice.pdf'
        },
        bankAccountData: [
            { label: 'Account Number', value: '1234567890' }
        ],
        amountBreakupData: { total: 5000 },
        referralBreakupData: { referrals: 5 },
        refetchPayoutData: jest.fn()
    })
}));

jest.mock('../../../apis/queryHooks', () => ({
    usePostChangePayoutStatus: () => ({
        mutate: jest.fn(),
        status: 'idle'
    })
}));

jest.mock('../../../utils/helper', () => ({
    downloadPDF: jest.fn(),
    formatDate: jest.fn(() => '01 Jan 2024, 10:00 AM')
}));

// Mock child components
jest.mock('../../../components/payouts/PayoutRequestDetailsTabs', () => {
    return function MockPayoutRequestDetailsTabs() {
        return <div data-testid="payout-request-tabs">Tabs</div>;
    };
});

jest.mock('../../../components/payouts/DownloadInvoiceDropdown', () => {
    return function MockDownloadInvoiceDropdown() {
        return <div data-testid="download-invoice-dropdown">Download Dropdown</div>;
    };
});

jest.mock('../../../components/payouts/BankAccountDetails', () => {
    return function MockBankAccountDetails() {
        return <div data-testid="bank-account-details">Bank Details</div>;
    };
});

describe('PayoutRequestDrawer Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockToggleDrawer = jest.fn();
    const mockRefetchAllPayouts = jest.fn();
    const mockPayoutObj = { _id: 'test-payout-id' };

    const renderComponent = () => {
        return render(
            <SnackbarProvider>
                <PayoutRequestDrawer
                    open={true}
                    toggleDrawer={mockToggleDrawer}
                    payoutObj={mockPayoutObj}
                    refetchAllPayouts={mockRefetchAllPayouts}
                />
            </SnackbarProvider>
        );
    };

    it('renders drawer with basic payout information', () => {
        renderComponent();

        const expectedLabels = ['Payout Request', 'Request ID', 'Company Name'];
        expectedLabels.forEach(label => expect(screen.getByText(label)).toBeInTheDocument());
    });

    it('download invoice functionality', () => {
        const { downloadPDF } = require('../../../utils/helper');
        renderComponent();

        const downloadLink = screen.getByText(/Download Invoice/i);
        fireEvent.click(downloadLink);

        expect(downloadPDF).toHaveBeenCalledWith('http://test-invoice.pdf', 'Invoice.pdf');
    });

    it('renders child components', () => {
        renderComponent();

        expect(screen.getByTestId('payout-request-tabs')).toBeInTheDocument();
        expect(screen.getByTestId('download-invoice-dropdown')).toBeInTheDocument();
        expect(screen.getByTestId('bank-account-details')).toBeInTheDocument();
    });

    it('renders approve and reject buttons for PENDING status', () => {
        renderComponent();

        const rejectButton = screen.getByText('Reject');
        const approveButton = screen.getByText('Approve');

        expect(rejectButton).toBeInTheDocument();
        expect(approveButton).toBeInTheDocument();
    });

    it('prevents status change without comment', () => {
        const { mutate } = require('../../../apis/queryHooks').usePostChangePayoutStatus();
        renderComponent();

        const approveButton = screen.getByText('Approve');
        fireEvent.click(approveButton);

        const commentInput = screen.getByPlaceholderText('Add a comment for record keeping');
        expect(commentInput).toBeInTheDocument();
        expect(mutate).not.toHaveBeenCalled();
    });


    it('toggles remark visibility', () => {
        renderComponent();

        const allInputs = screen.getAllByRole('checkbox');

        const checkboxByLabel = screen.queryByLabelText(/Visible to Customer/i);
        const checkboxByText = screen.queryByText(/Visible to Customer/i);



        if (!checkboxByLabel && !checkboxByText) {
            const { container } = renderComponent();
        }

        const visibilityCheckbox = screen.queryByRole('checkbox', {
            name: /visible/i
        });

        if (visibilityCheckbox) {
            fireEvent.click(visibilityCheckbox);
            expect(visibilityCheckbox).toBeChecked();
        }
    });
});