import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PayoutRequestDetailsTabs from '../../../components/payouts/PayoutRequestDetailsTabs';

// Mock dependencies
jest.mock('../../../hooks/usePermission', () => ({
    __esModule: true,
    default: () => ({
        hasPermission: jest.fn((permission) => true)
    })
}));

jest.mock('../../../constants/employer', () => ({
    PAYOUT_REQUEST_TAB_HEADERS: ['Amount Breakup', 'Referral Breakup']
}));

// Mock lazy-loaded components
jest.mock('../../../components/payouts/AmountBreakup', () => {
    return function MockAmountBreakup({ amountBreakupData }) {
        return <div data-testid="amount-breakup">{JSON.stringify(amountBreakupData)}</div>;
    };
});

jest.mock('../../../components/payouts/ReferralBreakup', () => {
    return function MockReferralBreakup({ referralBreakupData }) {
        return <div data-testid="referral-breakup">{JSON.stringify(referralBreakupData)}</div>;
    };
});

// Mock BoxLoader
jest.mock('../../../components/common/BoxLoader', () => {
    return function MockBoxLoader() {
        return <div data-testid="box-loader">Loading...</div>;
    };
});


describe('PayoutRequestDetailsTabs Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockAmountBreakupData = { total: 1000 };
    const mockReferralBreakupData = { referrals: 5 };

    const renderComponent = (initialRoute = '/payout/123') => {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <Routes>
                    <Route
                        path="/payout/:id"
                        element={
                            <PayoutRequestDetailsTabs
                                amountBreakupData={mockAmountBreakupData}
                                referralBreakupData={mockReferralBreakupData}
                            />
                        }
                    />
                </Routes>
            </MemoryRouter>
        );
    };

    it('renders all tabs when permissions are granted', () => {
        renderComponent();

        const tabs = screen.getAllByRole('tab');
        expect(tabs).toHaveLength(2);
        expect(tabs[0]).toHaveTextContent('Amount Breakup');
        expect(tabs[1]).toHaveTextContent('Referral Breakup');
    });
    it('defaults to first tab on initial render', () => {
        renderComponent();

        const amountBreakupTab = screen.getByRole('tab', { name: /Amount Breakup/i });
        expect(amountBreakupTab).toHaveAttribute('aria-selected', 'true');
    });

    it('switches tabs correctly', () => {
        renderComponent();

        const referralBreakupTab = screen.getByRole('tab', { name: /Referral Breakup/i });
        fireEvent.click(referralBreakupTab);

        const referralBreakupContent = screen.getByText('Referral Breakup');
        expect(referralBreakupContent).toBeInTheDocument();
    });

    it('passes correct data to tab components', () => {
        renderComponent();

        const amountBreakupContent = screen.getByTestId('amount-breakup');
        expect(amountBreakupContent).toHaveTextContent(JSON.stringify(mockAmountBreakupData));

        const referralBreakupTab = screen.getByRole('tab', { name: /Referral Breakup/i });
        fireEvent.click(referralBreakupTab);

        const referralBreakupContent = screen.getByTestId('referral-breakup');
        expect(referralBreakupContent).toHaveTextContent(JSON.stringify(mockReferralBreakupData));
    });
});