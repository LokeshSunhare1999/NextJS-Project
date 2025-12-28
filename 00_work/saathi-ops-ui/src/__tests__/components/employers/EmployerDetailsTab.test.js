import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EmployerDetailsTab from '../../../components/employers/EmployerDetailsTabs';
import '@testing-library/jest-dom';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import usePermission from '../../../hooks/usePermission';
import { EMPLOYER_TAB_HEADERS } from '../../../constants/employer';

// // Mock the imported components and hooks
jest.mock('../../../hooks/usePermission');
jest.mock('../../../components/employers/EmployerProfile', () => () => <div data-testid="employer-profile">Profile Content</div>);
jest.mock('../../../components/employers/EmployerReferralTab', () => () => <div data-testid="employer-referral">Referral Content</div>);
jest.mock('../../../components/employers/EmployerStaffTab', () => () => <div data-testid="employer-staff">Staff Content</div>);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useParams: () => ({ id: '123' }),
    useSearchParams: () => [new URLSearchParams('tab=profile'), jest.fn()]
}));

describe('EmployerDetailsTab Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const defaultProps = {
        currentIndex: { user: 'user123', referralLink: 'http://example.com/ref' },
        setPageRoute: jest.fn(),
        setShowBusinessVerificationPage: jest.fn(),
        employerDataLoading: false,
        employerDataFetching: false,
        employerDataError: null,
        refetchEmployerData: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render profile tab by default when user has all permissions', async () => {
        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockImplementation(permission => true)
        });

        render(
            <MemoryRouter initialEntries={['/employers/123?tab=profile']}>
                <Routes>
                    <Route path="/employers/:id" element={<EmployerDetailsTab {...defaultProps} />} />
                </Routes>
            </MemoryRouter>
        );

        EMPLOYER_TAB_HEADERS.forEach(header => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });

        await waitFor(() => {
            expect(screen.getByTestId('employer-profile')).toBeInTheDocument();
        });
    });

    it('should navigate to correct tab when clicked', async () => {
        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockImplementation(permission => true)
        });

        render(
            <MemoryRouter initialEntries={['/employers/123?tab=profile']}>
                <Routes>
                    <Route path="/employers/:id" element={<EmployerDetailsTab {...defaultProps} />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText(EMPLOYER_TAB_HEADERS[1]));

        expect(mockNavigate).toHaveBeenCalledWith('/employers/123?tab=referral');
    });

    it('should show referral tab content when tab is selected', async () => {
        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockImplementation(permission => true)
        });

        jest.spyOn(require('react-router-dom'), 'useSearchParams').mockImplementation(() => [
            new URLSearchParams('tab=referral'),
            jest.fn()
        ]);

        render(
            <MemoryRouter initialEntries={['/employers/123?tab=referral']}>
                <Routes>
                    <Route path="/employers/:id" element={<EmployerDetailsTab {...defaultProps} />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('employer-referral')).toBeInTheDocument();
        });
    });

    it('should show staff tab content when tab is selected', async () => {
        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockImplementation(permission => true)
        });

        jest.spyOn(require('react-router-dom'), 'useSearchParams').mockImplementation(() => [
            new URLSearchParams('tab=staff'),
            jest.fn()
        ]);

        render(
            <MemoryRouter initialEntries={['/employers/123?tab=staff']}>
                <Routes>
                    <Route path="/employers/:id" element={<EmployerDetailsTab {...defaultProps} />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('employer-staff')).toBeInTheDocument();
        });
    });

    it('should default to profile tab if invalid tab is provided', async () => {
        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockImplementation(permission => true)
        });

        jest.spyOn(require('react-router-dom'), 'useSearchParams').mockImplementation(() => [
            new URLSearchParams('tab=invalid'),
            jest.fn()
        ]);

        render(
            <MemoryRouter initialEntries={['/employers/123?tab=invalid']}>
                <Routes>
                    <Route path="/employers/:id" element={<EmployerDetailsTab {...defaultProps} />} />
                </Routes>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByTestId('employer-profile')).toBeInTheDocument();
        });
    });
});
