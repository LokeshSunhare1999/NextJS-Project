import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EmployerReferralTab from '../../../components/employers/EmployerReferralTab';
import usePermission from '../../../hooks/usePermission';
import useEmployerReferrerDetails from '../../../hooks/employer/useEmployerReferrerDetails';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../../constants/permissions';

// Mock the hooks
jest.mock('../../../hooks/usePermission');
jest.mock('../../../hooks/employer/useEmployerReferrerDetails');

// Mock the lazy-loaded components
jest.mock('../../../components/DisplayTable', () => ({
    __esModule: true,
    default: ({ rows, headers, showActionsPanel, arrBtn, actionIndex, setActionIndex, setActionOpen }) => (
        <div data-testid="display-table">
            <div>Mock Display Table</div>
            {rows && rows.length > 0 && (
                <button
                    data-testid="action-button"
                    onClick={() => {
                        setActionIndex(0);
                        setActionOpen(true);
                    }}
                >
                    Action
                </button>
            )}
            {showActionsPanel && actionIndex !== '' && (
                <div data-testid="actions-panel">
                    {arrBtn.map((btn, index) => (
                        <button
                            key={index}
                            onClick={btn.onClick}
                            data-testid={`btn-${index}`}
                        >
                            {btn.text}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}));

jest.mock('../../../components/employers/ViewEmployerReferralHistoryDrawer', () => ({
    __esModule: true,
    default: ({ open, toggleDrawer }) => (
        open ? <div data-testid="history-drawer">History Drawer</div> : null
    )
}));

jest.mock('../../../components/employers/ViewEmployerReferralEarningDrawer', () => ({
    __esModule: true,
    default: ({ open, toggleDrawer }) => (
        open ? <div data-testid="earning-drawer">Earning Drawer</div> : null
    )
}));

jest.mock('../../../components/employers/ViewCandidateReferralEarningDrawer', () => ({
    __esModule: true,
    default: ({ open, toggleDrawer }) => (
        open ? <div data-testid="candidate-earning-drawer">Candidate Earning Drawer</div> : null
    )
}));

jest.mock('../../../components/atom/tableComponents/Pagination', () => ({
    __esModule: true,
    default: ({ setCurrentPage, currentPage, totalItems, itemsPerPage, setItemsPerPage }) => (
        <div data-testid="pagination">
            <button
                onClick={() => setCurrentPage(currentPage + 1)}
                data-testid="next-page"
            >
                Next Page
            </button>
            <button
                onClick={() => setItemsPerPage(20)}
                data-testid="items-per-page"
            >
                Show 20
            </button>
        </div>
    )
}));

jest.mock('../../../components/common/LinkCopyWrap', () => ({
    __esModule: true,
    default: ({ link }) => <div data-testid="link-copy-wrap">{link}</div>
}));

jest.mock('../../../components/SearchFilter', () => ({
    __esModule: true,
    default: ({ searchArr, onKeyPress }) => (
        <div data-testid="search-filter">
            <input
                data-testid="search-input"
                placeholder={searchArr[0].placeHolder}
                onChange={(e) => searchArr[0].setInput(e.target.value)}
                onKeyPress={onKeyPress}
            />
        </div>
    )
}));

jest.mock('../../../components/CustomCTA', () => ({
    __esModule: true,
    default: ({ onClick, title }) => (
        <button data-testid="search-button" onClick={onClick}>{title}</button>
    )
}));

describe('EmployerReferralTab', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockUserId = 'user123';
    const mockReferralLink = 'https://example.com/ref/123';

    beforeEach(() => {
        jest.clearAllMocks();

        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockImplementation((permission) => {
                if (permission === EMPLOYER_MODULE_PERMISSIONS?.VIEW_CANDIDATE_REFERRAL_DETAILS) {
                    return true;
                }
                return false;
            })
        });

        useEmployerReferrerDetails.mockReturnValue({
            employeeUserIdArray: ['emp1', 'emp2'],
            employerReferrerRows: [
                ['1', 'John Doe', '1234567890', 'Active', '2023-01-01'],
                ['2', 'Jane Smith', '0987654321', 'Active', '2023-01-02']
            ],
            employerReferrerTableHeaders: ['ID', 'Name', 'Phone', 'Status', 'Date'],
            employerReferrerType: ['text', 'text', 'text', 'text', 'text'],
            errorCode: null,
            isEmployerReferralHistoryError: false,
            employerAmountEarned: 5000,
            totalCount: 2,
            availableBalance: 3000
        });
    });

    it('renders the component with referral data', async () => {
           render(<EmployerReferralTab userId={mockUserId} referralLink={mockReferralLink} />);

        // Array of elements and their expected text or test IDs
        const elementsToCheck = [
            { type: 'text', value: 'Available Balance' },
            { type: 'text', value: 'Total Amount Earned' },
            { type: 'text', value: 'Referral Link' },
            { type: 'text', value: '₹ 3000' },
            { type: 'text', value: '₹ 5000' },
            { type: 'testId', value: 'link-copy-wrap', expectedContent: mockReferralLink },
            { type: 'testId', value: 'search-filter' },
            { type: 'testId', value: 'search-button' },
            { type: 'testId', value: 'display-table' },
            { type: 'testId', value: 'pagination' },
            { type: 'text', value: 'Total: 2' },
        ];

        await waitFor(() => {
            elementsToCheck.forEach((element) => {
                if (element.type === 'text') {
                    expect(screen.getByText(element.value)).toBeInTheDocument();
                } else if (element.type === 'testId') {
                    const renderedElement = screen.getByTestId(element.value);
                    expect(renderedElement).toBeInTheDocument();
                    if (element.expectedContent) {
                        expect(renderedElement).toHaveTextContent(element.expectedContent);
                    }
                }
            });
        });
    });

    it('renders without referral link when not provided', () => {
        render(<EmployerReferralTab userId={mockUserId} referralLink={null} />);

        expect(screen.queryByText('Referral Link')).not.toBeInTheDocument();
    });

    it('opens withdrawal history drawer on click', async () => {
        render(<EmployerReferralTab userId={mockUserId} referralLink={mockReferralLink} />);

        fireEvent.click(screen.getByText('View Withdrawal History'));

        await waitFor(() => {
            expect(screen.getByTestId('history-drawer')).toBeInTheDocument();
        });
    });

    it('opens referral earning drawer on click', async () => {
        render(<EmployerReferralTab userId={mockUserId} referralLink={mockReferralLink} />);

        fireEvent.click(screen.getByText('View Referral Earning'));

        await waitFor(() => {
            expect(screen.getByTestId('earning-drawer')).toBeInTheDocument();
        });
    });

    it('handles search functionality', async () => {
        render(<EmployerReferralTab userId={mockUserId} referralLink={mockReferralLink} />);

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: '1234567890' } });

        fireEvent.click(screen.getByTestId('search-button'));

        expect(useEmployerReferrerDetails).toHaveBeenCalledWith(
            mockUserId,
            expect.objectContaining({
                activeSearchKey: '1234567890',
            })
        );
    });

    it('handles Enter key press for search', async () => {
        render(<EmployerReferralTab userId={mockUserId} referralLink={mockReferralLink} />);

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: '1234567890' } });

        fireEvent.keyPress(searchInput, { key: 'Enter', code: 'Enter', charCode: 13 });

        expect(useEmployerReferrerDetails).toHaveBeenCalledWith(
            mockUserId,
            expect.objectContaining({
                activeSearchKey: '1234567890',
            })
        );
    });

    it('handles pagination changes', async () => {
        render(<EmployerReferralTab userId={mockUserId} referralLink={mockReferralLink} />);

        await waitFor(() => {
            expect(screen.getByTestId('pagination')).toBeInTheDocument();
        });

        const itemsPerPageButton = screen.getByTestId('items-per-page');
        fireEvent.click(itemsPerPageButton);

        expect(useEmployerReferrerDetails).toHaveBeenCalledWith(
            mockUserId,
            expect.objectContaining({
                currentPage: 1,
                itemsPerPage: 20,
                activeSearchKey: '',
            }),
        );
    });

    it('opens candidate earning drawer when view details is clicked', async () => {
        render(<EmployerReferralTab userId={mockUserId} referralLink={mockReferralLink} />);

        fireEvent.click(screen.getByTestId('action-button'));

        await waitFor(() => {
            expect(screen.getByTestId('actions-panel')).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('btn-0'));

        await waitFor(() => {
            expect(screen.getByTestId('candidate-earning-drawer')).toBeInTheDocument();
        });
    });

    it('displays error message when API returns 404', () => {
        useEmployerReferrerDetails.mockReturnValue({
            employeeUserIdArray: [],
            employerReferrerRows: [],
            employerReferrerTableHeaders: [],
            employerReferrerType: [],
            errorCode: 404,
            isEmployerReferralHistoryError: true,
            employerAmountEarned: 0,
            totalCount: 0,
            availableBalance: 0
        });

        render(<EmployerReferralTab userId={mockUserId} referralLink={mockReferralLink} />);

        expect(screen.getByText('No staff has purchased training.')).toBeInTheDocument();
    });

    it('displays generic error message for other errors', () => {
        useEmployerReferrerDetails.mockReturnValue({
            employeeUserIdArray: [],
            employerReferrerRows: [],
            employerReferrerTableHeaders: [],
            employerReferrerType: [],
            errorCode: 500,
            isEmployerReferralHistoryError: true,
            employerAmountEarned: 0,
            totalCount: 0,
            availableBalance: 0
        });

        render(<EmployerReferralTab userId={mockUserId} referralLink={mockReferralLink} />);

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });
});