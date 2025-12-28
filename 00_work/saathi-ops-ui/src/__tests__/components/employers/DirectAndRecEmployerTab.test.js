import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import DirectAndRecEmployerTab from '../../../components/employers/DirectAndRecEmployerTab';
import { DIRECT_REC_AGENCY_TAB_HEADERS } from '../../../constants/employer';
import usePermission from '../../../hooks/usePermission';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../../constants/permissions';

// Mock the required dependencies
jest.mock('../../../hooks/usePermission');
jest.mock('../../../components/employers/DEandRAProfile', () => () => <div data-testid="profile-component">Profile Component</div>);
jest.mock('../../../components/employers/EmployerJobsTab', () => () => <div data-testid="jobs-component">Jobs Component</div>);
jest.mock('@mui/material/Tabs', () => ({ children, value, onChange }) => (
    <div data-testid="tabs" onClick={(e) => onChange(e, value === 0 ? 1 : 0)}>
        {children}
    </div>
));
jest.mock('@mui/material/Tab', () => ({ label }) => <div data-testid={`tab-${label}`}>{label}</div>);

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
    useLocation: () => ({ pathname: '/employers/123', search: '?tab=profile' }),
    useParams: () => ({ id: '123' }),
    useSearchParams: () => [new URLSearchParams('?tab=profile')],
}));

describe('DirectAndRecEmployerTab', () => {
    const defaultProps = {
        currentIndex: { _id: '123' },
        setPageRoute: jest.fn(),
        setShowBusinessVerificationPage: jest.fn(),
        employerDataLoading: false,
        employerDataFetching: false,
        employerDataError: null,
        refetchEmployerData: jest.fn(),
        selectedTab: 0,
        setSelectedTab: jest.fn(),
        openFilterDrawer: false,
        setOpenFilterDrawer: jest.fn(),
        totalFiltersCount: 0,
        setTotalFiltersCount: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        usePermission.mockReturnValue({
            hasPermission: (permission) => {
                return permission === EMPLOYER_MODULE_PERMISSIONS.VIEW_PROFILE_DETALILS;
            },
        });
    });

    it('renders the component without crashing', () => {
        render(
            <MemoryRouter>
                <DirectAndRecEmployerTab {...defaultProps} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('tabs')).toBeInTheDocument();

        DIRECT_REC_AGENCY_TAB_HEADERS.forEach((header) => {
            expect(screen.getByTestId(`tab-${header}`)).toBeInTheDocument();
        });
    });

    it('shows profile component when profile tab is selected', () => {
        render(
            <MemoryRouter>
                <DirectAndRecEmployerTab {...defaultProps} selectedTab={0} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('profile-component')).toBeInTheDocument();
    });

    it('shows jobs component when jobs tab is selected', () => {
        render(
            <MemoryRouter>
                <DirectAndRecEmployerTab {...defaultProps} selectedTab={1} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('jobs-component')).toBeInTheDocument();
    });

    it('navigates to jobs tab when clicked', () => {
        render(
            <MemoryRouter>
                <DirectAndRecEmployerTab {...defaultProps} selectedTab={0} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByTestId('tabs'));

        expect(mockNavigate).toHaveBeenCalledWith('/employers/123?tab=jobs');
        expect(defaultProps.setSelectedTab).toHaveBeenCalledWith(1);
    });

    it('navigates to profile tab when jobs tab is active and tabs are clicked', () => {
        render(
            <MemoryRouter>
                <DirectAndRecEmployerTab {...defaultProps} selectedTab={1} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByTestId('tabs'));

        expect(mockNavigate).toHaveBeenCalledWith('/employers/123?tab=profile');
        expect(defaultProps.setSelectedTab).toHaveBeenCalledWith(0);
    });

    it('filters out tabs based on permissions', () => {
        usePermission.mockReturnValue({
            hasPermission: () => false,
        });

        render(
            <MemoryRouter>
                <DirectAndRecEmployerTab {...defaultProps} selectedTab={0} />
            </MemoryRouter>
        );

        expect(screen.queryByTestId('profile-component')).not.toBeInTheDocument();

        expect(screen.getByTestId('jobs-component')).toBeInTheDocument();
    });

    it('handles filter keys when navigating to jobs tab', () => {
        const propsWithFilterKeys = {
            ...defaultProps,
            selectedTab: 0,
            filterKeys: '&status=active',
        };

        render(
            <MemoryRouter>
                <DirectAndRecEmployerTab {...propsWithFilterKeys} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByTestId('tabs'));

        expect(mockNavigate).toHaveBeenCalledWith('/employers/123?tab=jobs&status=active');
        expect(defaultProps.setSelectedTab).toHaveBeenCalledWith(1);
    });

    it('passes the correct props to child components', () => {
        const { container, rerender } = render(
            <MemoryRouter>
                <DirectAndRecEmployerTab {...defaultProps} selectedTab={0} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('profile-component')).toBeInTheDocument();

        rerender(
            <MemoryRouter>
                <DirectAndRecEmployerTab {...defaultProps} selectedTab={1} />
            </MemoryRouter>
        );

        expect(screen.getByTestId('jobs-component')).toBeInTheDocument();
    });
});