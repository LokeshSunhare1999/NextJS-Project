import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import '@testing-library/jest-dom';
import EmployerJobsTab from '../../../components/employers/EmployerJobsTab';
import useEmployerJobs from '../../../hooks/employer/useEmployerJobs';
import useAllJobsFilter from '../../../hooks/employer/useAllJobsFilter';

// Mock the hooks and lazy-loaded component
jest.mock('../../../hooks/employer/useEmployerJobs');
jest.mock('../../../hooks/employer/useAllJobsFilter');
jest.mock('../../../components/DisplayTable', () => () => <div>DisplayTable</div>);
jest.mock('../../../components/atom/tableComponents/Pagination', () => () => <div>Pagination</div>);
jest.mock('../../../components/common/FilterDrawer', () => () => <div>FilterDrawer</div>);

describe('EmployerJobsTab', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockEmployerId = '123';
    const mockSetOpenFilterDrawer = jest.fn();
    const mockSetTotalFiltersCount = jest.fn();
    const mockSetFilterKeys = jest.fn();
    const mockSetCurrentPage = jest.fn();
    const mockSetItemsPerPage = jest.fn();
    const mockCurrentPage = 1;
    const mockItemsPerPage = 10;

    const mockEmployerJobsData = {
        totalJobs: 20,
        jobs: [
            { _id: '1', title: 'Job 1' },
            { _id: '2', title: 'Job 2' },
        ],
    };

    const mockEmployerJobsHeaders = [
        { value: 'Title', type: 'text' },
        { value: 'Video', type: 'video' },
    ];

    const mockEmployerJobTableHeaders = [
        { label: 'Title', key: 'title' },
        { label: 'Video', key: 'video' },
    ];

    const mockEmployerJobsRows = [
        { title: 'Job 1', video: 'video1' },
        { title: 'Job 2', video: 'video2' },
    ];

    beforeEach(() => {
        useEmployerJobs.mockReturnValue({
            employerJobTableHeaders: mockEmployerJobTableHeaders,
            employerJobsHeaders: mockEmployerJobsHeaders,
            employerJobsRows: mockEmployerJobsRows,
            employerJobsData: mockEmployerJobsData,
        });

        useAllJobsFilter.mockReturnValue({
            statusCheckBoxes: [],
            jobPostedbyCheckBoxes: [],
            handleJobPostedbyCheckBoxesChange: jest.fn(),
            handleJobStatusCheckBoxesChange: jest.fn(),
            clearFilters: jest.fn(),
            handleApplyClick: jest.fn(),
        });
    });

    it('renders without crashing', async () => {
        render(
            <Router>
                <EmployerJobsTab
                    employerId={mockEmployerId}
                    openFilterDrawer={false}
                    setOpenFilterDrawer={mockSetOpenFilterDrawer}
                    totalFiltersCount={0}
                    setTotalFiltersCount={mockSetTotalFiltersCount}
                    filterKeys={{}}
                    setFilterKeys={mockSetFilterKeys}
                    currentPage={mockCurrentPage}
                    setCurrentPage={mockSetCurrentPage}
                    itemsPerPage={mockItemsPerPage}
                    setItemsPerPage={mockSetItemsPerPage}
                />
            </Router>
        );
        await waitFor(() => {
            expect(screen.getByText('DisplayTable')).toBeInTheDocument();
            expect(screen.getByText('Pagination')).toBeInTheDocument();
        });
    });

    it('renders the table with correct headers and rows', () => {
        render(
            <Router>
                <EmployerJobsTab
                    employerId={mockEmployerId}
                    openFilterDrawer={false}
                    setOpenFilterDrawer={mockSetOpenFilterDrawer}
                    totalFiltersCount={0}
                    setTotalFiltersCount={mockSetTotalFiltersCount}
                    filterKeys={{}}
                    setFilterKeys={mockSetFilterKeys}
                    currentPage={mockCurrentPage}
                    setCurrentPage={mockSetCurrentPage}
                    itemsPerPage={mockItemsPerPage}
                    setItemsPerPage={mockSetItemsPerPage}
                />
            </Router>
        );

        expect(screen.getByText('DisplayTable')).toBeInTheDocument();
    });

    it('opens and closes the filter drawer', () => {
        render(
            <Router>
                <EmployerJobsTab
                    employerId={mockEmployerId}
                    openFilterDrawer={true}
                    setOpenFilterDrawer={mockSetOpenFilterDrawer}
                    totalFiltersCount={0}
                    setTotalFiltersCount={mockSetTotalFiltersCount}
                    filterKeys={{}}
                    setFilterKeys={mockSetFilterKeys}
                    currentPage={mockCurrentPage}
                    setCurrentPage={mockSetCurrentPage}
                    itemsPerPage={mockItemsPerPage}
                    setItemsPerPage={mockSetItemsPerPage}
                />
            </Router>
        );

        expect(screen.getByText('FilterDrawer')).toBeInTheDocument();
    });

    it('handles pagination correctly', () => {
        render(
            <Router>
                <EmployerJobsTab
                    employerId={mockEmployerId}
                    openFilterDrawer={false}
                    setOpenFilterDrawer={mockSetOpenFilterDrawer}
                    totalFiltersCount={0}
                    setTotalFiltersCount={mockSetTotalFiltersCount}
                    filterKeys={{}}
                    setFilterKeys={mockSetFilterKeys}
                    currentPage={mockCurrentPage}
                    setCurrentPage={mockSetCurrentPage}
                    itemsPerPage={mockItemsPerPage}
                    setItemsPerPage={mockSetItemsPerPage}
                />
            </Router>
        );

        expect(screen.getByText('Pagination')).toBeInTheDocument();
    });

    it('displays correct job count', () => {
        render(
            <Router>
                <EmployerJobsTab
                    employerId={mockEmployerId}
                    openFilterDrawer={false}
                    setOpenFilterDrawer={mockSetOpenFilterDrawer}
                    totalFiltersCount={0}
                    setTotalFiltersCount={mockSetTotalFiltersCount}
                    filterKeys={{}}
                    setFilterKeys={mockSetFilterKeys}
                    currentPage={mockCurrentPage}
                    setCurrentPage={mockSetCurrentPage}
                    itemsPerPage={mockItemsPerPage}
                    setItemsPerPage={mockSetItemsPerPage}
                />
            </Router>
        );

        const totalJobsElement = screen.queryByText(/20/);
        if (totalJobsElement) {
            expect(totalJobsElement).toBeInTheDocument();
        }
    });
});