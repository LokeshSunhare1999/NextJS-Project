import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReferralBreakup from '../../../components/payouts/ReferralBreakup';

// Mock all external dependencies
jest.mock('../../../utils/helper', () => ({
    formatDate: jest.fn(() => '2024-01-01'),
    getValueSuffix: jest.fn(() => '')
}));

jest.mock('../../../constants/employer', () => ({
    REFERRAL_HEADERS: [
        { key: 'referralId', label: 'Referral ID' },
        { key: 'candidateName', label: 'Candidate Name' }
    ],
    REFERRAL_HEADERS_TYPE: {
        referralId: 'text',
        candidateName: 'text'
    }
}));

// Mock entire DisplayTable to simplify testing
jest.mock('../../../components/DisplayTable', () => {
    return function MockDisplayTable(props) {
        return (
            <div
                data-testid="display-table"
                data-rows={JSON.stringify(props.rows)}
                data-headers={JSON.stringify(props.headers)}
            >
                Mocked Display Table
            </div>
        );
    };
});
jest.mock('../../../components/common/BoxLoader', () => {
    return function MockBoxLoader() {
        return <div data-testid="box-loader">Loading...</div>;
    };
});

describe('ReferralBreakup Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    it('renders box-loader when empty referral data', () => {
        render(<ReferralBreakup referralBreakupData={[]} />);

        const displayTable = screen.getByTestId('box-loader');
        expect(displayTable).toBeInTheDocument();
    });

    it('renders with referral data', () => {
        const mockReferralData = [
            {
                referralId: 'REF001',
                candidateName: 'John Doe',
                status: 'Verified',
                amount: 5000
            }
        ];

        render(<ReferralBreakup referralBreakupData={mockReferralData} />);

        const displayTable = screen.getByTestId('display-table');
        expect(displayTable).toBeInTheDocument();

        const tableRows = JSON.parse(displayTable.getAttribute('data-rows'));
        expect(tableRows).toEqual(mockReferralData);
    });

    it('applies different styles based on data presence', () => {
        const { rerender, container } = render(<ReferralBreakup referralBreakupData={[]} />);

        const wrapper = container.firstChild;
        expect(wrapper).toHaveStyle('padding: 16px');
        expect(wrapper).toHaveStyle('border-radius: 8px');

        rerender(<ReferralBreakup referralBreakupData={[{ referralId: 'TEST' }]} />);
        const dataWrapper = container.firstChild;
        expect(dataWrapper).toHaveStyle('padding: 0px');
        expect(dataWrapper).toHaveStyle('border-radius: 16px');
    });
});