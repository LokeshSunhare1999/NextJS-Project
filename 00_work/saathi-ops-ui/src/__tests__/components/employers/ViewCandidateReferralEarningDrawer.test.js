import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewCandidateReferralEarningDrawer from '../../../components/employers/ViewCandidateReferralEarningDrawer';

// Mock the imported components and hooks
jest.mock('../../../hooks/employer/useEmployerCandidateReferralHistory', () => ({
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

describe('ViewCandidateReferralEarningDrawer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockToggleDrawer = jest.fn();
    const defaultProps = {
        open: true,
        toggleDrawer: mockToggleDrawer,
        candidateId: 'candidate123',
        candidateName: 'John Doe',
        userId: 'user456'
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render the drawer with candidate name when open is true', () => {
        const useEmployerCandidateReferralHistoryMock = require('../../../hooks/employer/useEmployerCandidateReferralHistory').default;
        useEmployerCandidateReferralHistoryMock.mockReturnValue({
            employerCandidateReferralHistoryRows: [],
            errorCode: null,
            isEmployerCandidateReferralHistoryError: false
        });

        render(<ViewCandidateReferralEarningDrawer {...defaultProps} />);

        expect(screen.getByText('Referral Earning')).toBeInTheDocument();
        expect(screen.getByText(`By ${defaultProps.candidateName}`)).toBeInTheDocument();
    });

    it('should close the drawer when close icon is clicked', () => {
        const useEmployerCandidateReferralHistoryMock = require('../../../hooks/employer/useEmployerCandidateReferralHistory').default;
        useEmployerCandidateReferralHistoryMock.mockReturnValue({
            employerCandidateReferralHistoryRows: [],
            errorCode: null,
            isEmployerCandidateReferralHistoryError: false
        });

        render(<ViewCandidateReferralEarningDrawer {...defaultProps} />);

        const closeIcon = screen.getByAltText('close-drawer');
        fireEvent.click(closeIcon);

        expect(mockToggleDrawer).toHaveBeenCalledWith(false);
    });

    it('should display the table when data is available', async () => {
        const mockReferralHistoryRows = [{ id: 1, name: 'Test Referral' }];
        const useEmployerCandidateReferralHistoryMock = require('../../../hooks/employer/useEmployerCandidateReferralHistory').default;
        useEmployerCandidateReferralHistoryMock.mockReturnValue({
            employerCandidateReferralHistoryRows: mockReferralHistoryRows,
            errorCode: null,
            isEmployerCandidateReferralHistoryError: false
        });

        render(<ViewCandidateReferralEarningDrawer {...defaultProps} />);

        await waitFor(() => {
            expect(screen.getByTestId('display-table')).toBeInTheDocument();
        });
    });

    it('should display "no referral earning" message when error code is 404', () => {
        const useEmployerCandidateReferralHistoryMock = require('../../../hooks/employer/useEmployerCandidateReferralHistory').default;
        useEmployerCandidateReferralHistoryMock.mockReturnValue({
            employerCandidateReferralHistoryRows: [],
            errorCode: 404,
            isEmployerCandidateReferralHistoryError: true
        });

        render(<ViewCandidateReferralEarningDrawer {...defaultProps} />);

        expect(screen.getByText('There is no referral earning')).toBeInTheDocument();
    });

    it('should display "something went wrong" message when there is an error other than 404', () => {
        const useEmployerCandidateReferralHistoryMock = require('../../../hooks/employer/useEmployerCandidateReferralHistory').default;
        useEmployerCandidateReferralHistoryMock.mockReturnValue({
            employerCandidateReferralHistoryRows: [],
            errorCode: 500,
            isEmployerCandidateReferralHistoryError: true
        });

        render(<ViewCandidateReferralEarningDrawer {...defaultProps} />);

        expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('should call useEmployerCandidateReferralHistory with correct parameters', () => {
        const useEmployerCandidateReferralHistoryMock = require('../../../hooks/employer/useEmployerCandidateReferralHistory').default;
        useEmployerCandidateReferralHistoryMock.mockReturnValue({
            employerCandidateReferralHistoryRows: [],
            errorCode: null,
            isEmployerCandidateReferralHistoryError: false
        });

        render(<ViewCandidateReferralEarningDrawer {...defaultProps} />);

        expect(useEmployerCandidateReferralHistoryMock).toHaveBeenCalledWith(
            defaultProps.userId,
            defaultProps.candidateId,
            false
        );
    });

    it('should handle case when candidateId is not provided', () => {
        const useEmployerCandidateReferralHistoryMock = require('../../../hooks/employer/useEmployerCandidateReferralHistory').default;
        useEmployerCandidateReferralHistoryMock.mockReturnValue({
            employerCandidateReferralHistoryRows: [],
            errorCode: null,
            isEmployerCandidateReferralHistoryError: false
        });

        const propsWithoutCandidateId = { ...defaultProps, candidateId: undefined };
        render(<ViewCandidateReferralEarningDrawer {...propsWithoutCandidateId} />);

        expect(useEmployerCandidateReferralHistoryMock).toHaveBeenCalledWith(
            defaultProps.userId,
            undefined,
            false
        );
    });
});