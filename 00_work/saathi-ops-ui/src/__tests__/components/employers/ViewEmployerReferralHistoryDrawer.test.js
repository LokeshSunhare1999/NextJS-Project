import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewEmployerReferralHistoryDrawer from '../../../components/employers/ViewEmployerReferralHistoryDrawer';

// Mock the imported components and hooks
jest.mock('../../../apis/queryHooks', () => ({
    useGetReferralHistory: jest.fn()
}));

jest.mock('../../../components/DisplayTable', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(({ emptyDataMessage, headers, rows }) => (
        <div data-testid="display-table">
            <div data-testid="table-headers">{headers?.join(', ')}</div>
            <div data-testid="table-rows">{`${rows?.length} rows`}</div>
            <div data-testid="empty-message">{emptyDataMessage}</div>
        </div>
    ))
}));

jest.mock('../../../components/common/BoxLoader', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(({ size }) => (
        <div data-testid="box-loader">Loading... (size: {size})</div>
    ))
}));

// Mock icons
jest.mock('../../../assets/icons', () => ({
    CROSS_ICON: 'cross-icon-path'
}));

describe('ViewEmployerReferralHistoryDrawer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockToggleDrawer = jest.fn();
    const defaultProps = {
        open: true,
        toggleDrawer: mockToggleDrawer,
        userId: 'user456'
    };
    const mockHeaders = [
        { key: 'id', value: 'ID', type: 'text' },
        { key: 'details.amount', value: 'Amount', type: 'currency' }
    ];
    const mockHistory = [
        { id: '1', details: { amount: 100 } },
        { id: '2', details: { amount: 200 } }
    ];
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the drawer with correct header when open is true', () => {
        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: {
                txnHistoryHeaders: [],
                txnHistory: []
            },
            isError: false,
            error: null
        });

        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        expect(screen.getByText('Withdraw History')).toBeInTheDocument();
    });

    it('should close the drawer when close icon is clicked', () => {
        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: {
                txnHistoryHeaders: [],
                txnHistory: []
            },
            isError: false,
            error: null
        });

        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        const closeIcon = screen.getByAltText('close-drawer');
        fireEvent.click(closeIcon);

        expect(mockToggleDrawer).toHaveBeenCalledWith(false);
    });

    it('should call useGetReferralHistory with correct parameters', () => {
        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: {
                txnHistoryHeaders: [],
                txnHistory: []
            },
            isError: false,
            error: null
        });

        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        expect(useGetReferralHistoryMock).toHaveBeenCalledWith(
            defaultProps.userId,
            'STAFFING_AGENCY'
        );
    });

    it('should display the table when data is available with headers', async () => {
        const mockHeaders = [
            { key: 'id', value: 'ID', type: 'text' },
            { key: 'amount', value: 'Amount', type: 'currency' }
        ];
        const mockHistory = [
            { id: '1', amount: 100 },
            { id: '2', amount: 200 }
        ];

        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: {
                txnHistoryHeaders: mockHeaders,
                txnHistory: mockHistory
            },
            isError: false,
            error: null
        });

        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByTestId('display-table')).toBeInTheDocument();
        });
        expect(screen.getByTestId('table-headers')).toHaveTextContent('ID, Amount');
        expect(screen.getByTestId('table-rows')).toHaveTextContent('2 rows');
    });

    it('should handle nested object keys in createData function', () => {


        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: {
                txnHistoryHeaders: mockHeaders,
                txnHistory: mockHistory
            },
            isError: false,
            error: null
        });

        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        expect(screen.getByTestId('display-table')).toBeInTheDocument();
    });

    it('should display loader when headers are available but empty', () => {
        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: {
                txnHistoryHeaders: [],
                txnHistory: []
            },
            isError: false,
            error: null
        });

        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        expect(screen.getByTestId('box-loader')).toBeInTheDocument();
    });

    it('should display "no withdrawal history" message when error code is 404', () => {
        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: null,
            isError: true,
            error: {
                response: {
                    status: 404
                }
            }
        });

        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        expect(screen.getByText('There is no withdrawal history.')).toBeInTheDocument();
    });

    it('should display "something went wrong" message when there is an error other than 404', () => {
        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: null,
            isError: true,
            error: {
                response: {
                    status: 500
                }
            }
        });

        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should handle missing data or undefined values in data transformation', () => {
        const mockHeaders = [
            { key: 'id', value: 'ID', type: 'text' },
            { key: 'nonexistent.field', value: 'Missing', type: 'text' }
        ];
        const mockHistory = [
            { id: '1' }, 
        ];

        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: {
                txnHistoryHeaders: mockHeaders,
                txnHistory: mockHistory
            },
            isError: false,
            error: null
        });

        // This should not throw errors
        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        expect(screen.getByTestId('display-table')).toBeInTheDocument();
    });

    it('should handle case when data is null', () => {
        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: null,
            isError: false,
            error: null
        });

        // This should not throw errors
        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        expect(screen.getByTestId('box-loader')).toBeInTheDocument();
    });

    it('should render loading state with Suspense fallback when DisplayTable is loading', () => {
        const useGetReferralHistoryMock = require('../../../apis/queryHooks').useGetReferralHistory;
        useGetReferralHistoryMock.mockReturnValue({
            data: {
                txnHistoryHeaders: [{ key: 'id', value: 'ID', type: 'text' }],
                txnHistory: [{ id: '1' }]
            },
            isError: false,
            error: null
        });

        const DisplayTable = require('../../../components/DisplayTable').default;
        DisplayTable.mockImplementation(() => {
            throw new Promise(() => { }); // Never resolving promise
        });

        render(<ViewEmployerReferralHistoryDrawer {...defaultProps} />);

        expect(screen.getByTestId('box-loader')).toBeInTheDocument();
    });
});