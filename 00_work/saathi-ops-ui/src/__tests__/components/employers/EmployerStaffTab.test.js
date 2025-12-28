import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import EmployerStaffTab from '../../../components/employers/EmployerStaffTab';
import { useGetAllStaff } from '../../../apis/queryHooks';
import usePermission from '../../../hooks/usePermission';
import useStaffFilter from '../../../hooks/employer/useStaffFilters';

// Mock the dependencies
jest.mock('../../../hooks/usePermission', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../../../hooks/employer/useStaffFilters', () => ({
    __esModule: true,
    default: jest.fn(),
}));

jest.mock('../../../apis/queryHooks', () => ({
    useGetAllStaff: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: jest.fn(),
    useSearchParams: jest.fn(),
    useNavigate: jest.fn(),
}));

jest.mock('notistack', () => ({
    enqueueSnackbar: jest.fn(),
}));

// Mock components that are lazy loaded
jest.mock('../../../components/common/FilterDrawer', () => ({
    __esModule: true,
    default: jest.fn(({ open, toggleDrawer }) =>
        open ? <div data-testid="filter-drawer">Filter Drawer</div> : null
    ),
}));

jest.mock('../../../components/DisplayTable', () => ({
    __esModule: true,
    default: jest.fn(({ headers, rows }) => (
        <div data-testid="display-table">
            <div data-testid="table-headers">{JSON.stringify(headers)}</div>
            <div data-testid="table-rows">{JSON.stringify(rows)}</div>
        </div>
    )),
}));

jest.mock('../../../components/SearchFilter', () => ({
    __esModule: true,
    default: jest.fn(({ searchArr }) => (
        <div data-testid="search-filter">
            <input
                data-testid="search-input"
                placeholder={searchArr[0].placeHolder}
                onChange={e => searchArr[0].setInput(e.target.value)}
                value={searchArr[0].enteredInput}
            />
        </div>
    )),
}));

jest.mock('../../../components/atom/tableComponents/Pagination', () => ({
    __esModule: true,
    default: jest.fn(() => <div data-testid="pagination">Pagination</div>),
}));

jest.mock('../../../components/CustomCTA', () => ({
    __esModule: true,
    default: jest.fn(({ title, onClick }) => (
        <button data-testid={`button-${title}`} onClick={onClick}>
            {title}
        </button>
    )),
}));

describe('EmployerStaffTab Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockStaffingAgencyId = 'agency123';
    const mockNavigate = jest.fn();
    const mockSearchParams = new URLSearchParams();
    const mockSetSearchParams = jest.fn();
    const mockHasPermission = jest.fn().mockReturnValue(true);

    const mockStaffFilterHook = {
        staffCheckboxes: [
            { id: 'verified', label: 'Verified', checked: false },
            { id: 'unverified', label: 'Unverified', checked: false }
        ],
        handleStaffCheckboxChange: jest.fn(),
        handleApplyClick: jest.fn(),
        clearFilters: jest.fn(),
    };

    const mockStaffData = {
        headers: [
            { key: 'id', value: 'ID', type: 'string' },
            { key: 'name', value: 'Name', type: 'string' }
        ],
        customers: [
            { _id: 'user1', id: '001', name: 'John Doe' },
            { _id: 'user2', id: '002', name: 'Jane Smith' }
        ],
        totalCustomers: 2
    };

    beforeEach(() => {
        jest.clearAllMocks();

        useParams.mockReturnValue({ id: mockStaffingAgencyId });
        useSearchParams.mockReturnValue([mockSearchParams, mockSetSearchParams]);
        useNavigate.mockReturnValue(mockNavigate);

        usePermission.mockReturnValue({ hasPermission: mockHasPermission });
        useStaffFilter.mockReturnValue(mockStaffFilterHook);

        useGetAllStaff.mockReturnValue({
            data: mockStaffData,
            isLoading: false,
            isFetching: false,
            isError: false,
            error: null
        });
    });

    it('renders the component successfully', async () => {
        render(
            <MemoryRouter>
                <EmployerStaffTab />
            </MemoryRouter>
        );

        const testIdsToCheck = ['search-filter', 'button-Search', 'button-Filter (0)', 'display-table', 'pagination'];

        await waitFor(() => {
            testIdsToCheck.forEach((testId) => {
                expect(screen.getByTestId(testId)).toBeInTheDocument();
            });
        });
    });

    it('handles search functionality correctly', async () => {
        render(
            <MemoryRouter>
                <EmployerStaffTab />
            </MemoryRouter>
        );

        const searchInput = screen.getByTestId('search-input');
        fireEvent.change(searchInput, { target: { value: '12345' } });

        const searchButton = screen.getByTestId('button-Search');
        fireEvent.click(searchButton);

        expect(mockNavigate).toHaveBeenCalledWith(
            `/employers/${mockStaffingAgencyId}?searchId=12345&currentPage=1`,
            { replace: true }
        );
    });

    it('opens filter drawer when filter button is clicked', async () => {
        render(
            <MemoryRouter>
                <EmployerStaffTab />
            </MemoryRouter>
        );

        const filterButton = screen.getByTestId('button-Filter (0)');
        fireEvent.click(filterButton);

        await waitFor(() => {
            expect(screen.getByTestId('filter-drawer')).toBeInTheDocument();
        });
    });

    it('displays error message when API fails', async () => {
        useGetAllStaff.mockReturnValue({
            data: null,
            isLoading: false,
            isFetching: false,
            isError: true,
            error: {
                response: {
                    data: {
                        error: {
                            message: 'API Error'
                        }
                    }
                }
            }
        });

        render(
            <MemoryRouter>
                <EmployerStaffTab />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(enqueueSnackbar).toHaveBeenCalledWith('API Error', { variant: 'error' });
        });
    });

    it('navigates to customer details when row is clicked', async () => {
        render(
            <MemoryRouter>
                <EmployerStaffTab />
            </MemoryRouter>
        );

        const { onClickFn } = require('../../../components/DisplayTable').default.mock.calls[0][0];
        onClickFn(0);

        expect(mockNavigate).toHaveBeenCalledWith('/customers/user1');
    });

    it('loads staff data from URL search params on initial render', async () => {
        const mockParamsWithSearch = new URLSearchParams();
        mockParamsWithSearch.set('searchId', '12345');
        mockParamsWithSearch.set('currentPage', '2');
        mockParamsWithSearch.set('itemsPerPage', '20');

        useSearchParams.mockReturnValue([mockParamsWithSearch, mockSetSearchParams]);

        render(
            <MemoryRouter>
                <EmployerStaffTab />
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(useGetAllStaff).toHaveBeenCalledWith(expect.objectContaining({
                staffingAgencyId: mockStaffingAgencyId,
                searchId: '12345',
                currentPage: 2,
                itemsPerPage: 20
            }));
        });
    });

    it('shows loading state when fetching data', async () => {
        useGetAllStaff.mockReturnValue({
            data: null,
            isLoading: true,
            isFetching: true,
            isError: false,
            error: null
        });

        render(
            <MemoryRouter>
                <EmployerStaffTab />
            </MemoryRouter>
        );

        expect(screen.queryByTestId('display-table')).not.toBeInTheDocument();
    });
});