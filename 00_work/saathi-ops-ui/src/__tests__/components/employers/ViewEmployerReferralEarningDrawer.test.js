import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewEmployerReferralEarningDrawer from '../../../components/employers/ViewEmployerReferralEarningDrawer';

// Mock the imported components and hooks
jest.mock('../../../hooks/employer/useEmployerReferralHistory', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('../../../components/DisplayTable', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(({ emptyDataMessage }) => (
        <div data-testid="display-table">{emptyDataMessage}</div>
    ))
}));

jest.mock('../../../components/common/BoxLoader', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => <div data-testid="box-loader">Loading...</div>)
}));

// Mock constants
jest.mock('../../../constants/employer', () => ({
    REFERRAL_HEADERS: ['Header1', 'Header2'],
    REFERRAL_HEADERS_TYPE: ['type1', 'type2']
}));

// Mock icons
jest.mock('../../../assets/icons', () => ({
    CROSS_ICON: 'cross-icon-path'
}));

describe('ViewEmployerReferralEarningDrawer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockToggleDrawer = jest.fn();
    const defaultProps = {
        open: true,
        toggleDrawer: mockToggleDrawer,
        userId: 'user456'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the drawer with correct headers when open is true', () => {
        const useEmployerReferralHistoryMock = require('../../../hooks/employer/useEmployerReferralHistory').default;
        useEmployerReferralHistoryMock.mockReturnValue({
            employerReferralHistoryRows: [],
            errorCode: null,
            isEmployerReferralHistoryError: false
        });

        render(<ViewEmployerReferralEarningDrawer {...defaultProps} />);

        expect(screen.getByText('Total Amount Earned')).toBeInTheDocument();
        expect(screen.getByText('Referral Earning')).toBeInTheDocument();
    });

    it('should close the drawer when close icon is clicked', () => {
        const useEmployerReferralHistoryMock = require('../../../hooks/employer/useEmployerReferralHistory').default;
        useEmployerReferralHistoryMock.mockReturnValue({
            employerReferralHistoryRows: [],
            errorCode: null,
            isEmployerReferralHistoryError: false
        });

        render(<ViewEmployerReferralEarningDrawer {...defaultProps} />);

        const closeIcon = screen.getByAltText('close-drawer');
        fireEvent.click(closeIcon);

        expect(mockToggleDrawer).toHaveBeenCalledWith(false);
    });

    it('should display the table when data is available', async () => {
        const mockReferralHistoryRows = [{ id: 1, name: 'Test Referral' }];
        const useEmployerReferralHistoryMock = require('../../../hooks/employer/useEmployerReferralHistory').default;
        useEmployerReferralHistoryMock.mockReturnValue({
            employerReferralHistoryRows: mockReferralHistoryRows,
            errorCode: null,
            isEmployerReferralHistoryError: false
        });

        render(<ViewEmployerReferralEarningDrawer {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByTestId('display-table')).toBeInTheDocument();
        });
    });

    it('should display "no referral earning" message when error code is 404', () => {
        const useEmployerReferralHistoryMock = require('../../../hooks/employer/useEmployerReferralHistory').default;
        useEmployerReferralHistoryMock.mockReturnValue({
            employerReferralHistoryRows: [],
            errorCode: 404,
            isEmployerReferralHistoryError: true
        });

        render(<ViewEmployerReferralEarningDrawer {...defaultProps} />);

        expect(screen.getByText('There is no referral earning.')).toBeInTheDocument();
    });

    it('should display "something went wrong" message when there is an error other than 404', () => {
        const useEmployerReferralHistoryMock = require('../../../hooks/employer/useEmployerReferralHistory').default;
        useEmployerReferralHistoryMock.mockReturnValue({
            employerReferralHistoryRows: [],
            errorCode: 500,
            isEmployerReferralHistoryError: true
        });

        render(<ViewEmployerReferralEarningDrawer {...defaultProps} />);

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should call useEmployerReferralHistory with correct parameters', () => {
        const useEmployerReferralHistoryMock = require('../../../hooks/employer/useEmployerReferralHistory').default;
        useEmployerReferralHistoryMock.mockReturnValue({
            employerReferralHistoryRows: [],
            errorCode: null,
            isEmployerReferralHistoryError: false
        });

        render(<ViewEmployerReferralEarningDrawer {...defaultProps} />);

        expect(useEmployerReferralHistoryMock).toHaveBeenCalledWith(
            defaultProps.userId,
            false
        );
    });

    it('should handle case when userId is not provided', () => {
        const useEmployerReferralHistoryMock = require('../../../hooks/employer/useEmployerReferralHistory').default;
        useEmployerReferralHistoryMock.mockReturnValue({
            employerReferralHistoryRows: [],
            errorCode: null,
            isEmployerReferralHistoryError: false
        });

        const propsWithoutUserId = { ...defaultProps, userId: undefined };
        render(<ViewEmployerReferralEarningDrawer {...propsWithoutUserId} />);

        expect(useEmployerReferralHistoryMock).toHaveBeenCalledWith(
            undefined,
            false
        );
    });
});