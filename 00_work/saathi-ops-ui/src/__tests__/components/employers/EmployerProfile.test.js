import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import '@testing-library/jest-dom';
import EmployerProfile from '../../../components/employers/EmployerProfile';
import useEmployerDetails from '../../../hooks/employer/useEmployerDetails';
import { usePostUploadToS3, usePutUpdateEmployerStatus, useUploadAndDeleteAgreement } from '../../../apis/queryHooks';
import usePermission from '../../../hooks/usePermission';

// Mock the hooks
jest.mock('../../../hooks/employer/useEmployerDetails');
jest.mock('../../../apis/queryHooks');
jest.mock('../../../hooks/usePermission');
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: 'test-employer-id' }),
}));

// Mock the DetailsContainer component that's causing the error
jest.mock('../../../components/atom/tableComponents/DetailsContainer', () => ({
    __esModule: true,
    default: ({ title, detailsData, showEdit, handleEditClick }) => (
        <div data-testid="details-container">
            <h3>{title}</h3>
            <div>
                {detailsData.map(([key, value], index) => (
                    <div key={index}>
                        <span>{key}: </span>
                        <span>{value}</span>
                    </div>
                ))}
            </div>
            {showEdit && <button onClick={handleEditClick}>Edit</button>}
        </div>
    ),
}));

// Mock the lazy-loaded component
jest.mock('../../../components/GlobalPop', () => ({
    __esModule: true,
    default: ({ setOpenDeletePop, title, heading, handleDelete }) => (
        <div data-testid="global-pop">
            <div>{title}</div>
            <div>{heading}</div>
            <button onClick={handleDelete}>Confirm Delete</button>
            <button onClick={() => setOpenDeletePop(false)}>Cancel</button>
        </div>
    ),
}));

// Mock DisplayTable component
jest.mock('../../../components/DisplayTable', () => ({
    __esModule: true,
    default: ({ tableId, rows, headers, actionOpen, setActionOpen, arrBtn, onClickFn }) => (
        <table data-testid={tableId}>
            <thead>
                <tr>
                    {headers.map((header, index) => (
                        <th key={index}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, rowIndex) => (
                    <tr key={rowIndex} onClick={() => onClickFn && onClickFn(row)}>
                        {row.map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
            <button
                data-testid={`${tableId}-actions-button`}
                onClick={() => setActionOpen(!actionOpen)}
            >
                Actions
            </button>
            {actionOpen && (
                <div className="actions-menu">
                    {arrBtn.map((btn, index) => (
                        btn.isVisible && (
                            <button
                                key={index}
                                onClick={btn.onClick}
                                type={btn.type === 'input' ? 'button' : undefined}
                            >
                                {btn.text}
                                {btn.type === 'input' && (
                                    <input
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={(e) => btn.handleFileUpload && btn.handleFileUpload(e.target.files[0])}
                                        aria-label={btn.text}
                                    />
                                )}
                            </button>
                        )
                    ))}
                </div>
            )}
        </table>
    ),
}));

// Mock the drawer components
jest.mock('../../../components/employers/AgreementDrawer', () => ({
    __esModule: true,
    default: ({ open, handleCloseDrawer }) => (
        open ? (
            <div role="dialog" data-testid="agreement-drawer">
                <button onClick={handleCloseDrawer}>Close</button>
            </div>
        ) : null
    ),
}));

jest.mock('../../../components/employers/EditEmployerDetailsDrawer', () => ({
    __esModule: true,
    default: ({
        open,
        toggleDrawer,
        handleUpdateEmployerDetails,
        editAccObj,
        setEditAccObj
    }) => (
        open ? (
            <div role="dialog" data-testid="edit-details-drawer">
                <h2>Edit Employer Details</h2>
                <label>
                    Company Name
                    <input
                        value={editAccObj.companyName}
                        onChange={(e) => setEditAccObj({ ...editAccObj, companyName: e.target.value })}
                        aria-label="Company Name"
                    />
                </label>
                <label>
                    Brand Name
                    <input
                        value={editAccObj.brandName}
                        onChange={(e) => setEditAccObj({ ...editAccObj, brandName: e.target.value })}
                        aria-label="Brand Name"
                    />
                </label>
                <label>
                    Company Size
                    <input
                        value={editAccObj.companySize}
                        onChange={(e) => setEditAccObj({ ...editAccObj, companySize: e.target.value })}
                        aria-label="Company Size"
                    />
                </label>
                <label>
                    Company Type
                    <input
                        value={editAccObj.companyType}
                        onChange={(e) => setEditAccObj({ ...editAccObj, companyType: e.target.value })}
                        aria-label="Company Type"
                    />
                </label>
                <button onClick={() => handleUpdateEmployerDetails()}>Save</button>
                <button onClick={() => toggleDrawer(false)}>Cancel</button>
            </div>
        ) : null
    ),
}));

describe('EmployerProfile', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockRefetchEmployerData = jest.fn();
    const mockSetShowBusinessVerificationPage = jest.fn();
    const mockSetPageRoute = jest.fn();

    const mockEmployerData = {
        _id: 'test-employer-id',
        brandName: 'Test Brand',
        companyRegisteredName: 'Test Company',
        companySize: '10-50',
        companyType: 'Private Limited',
    };

    const mockEmployerDetails = {
        employeeBasicDetail: [
            ['Company Name', 'Test Company'],
            ['Brand Name', 'Test Brand'],
            ['Company Size', '10-50'],
            ['Company Type', 'Private Limited'],
        ],
        handleRowClick: jest.fn(),
        businessVerificationRows: [
            ['Business Verification', 'VERIFIED', 'document-url'],
        ],
        bankDetails: [
            ['Account Number', '1234567890'],
            ['Account Holder Name', 'Test Company'],
            ['IFSC Code', 'TEST0001'],
        ],
        agreementDetails: [
            ['Agreement', 'VERIFIED'],
        ],
        agreementUrl: 'https://example.com/agreement.pdf',
    };

    const setupMocks = (hasPermissionValue = true) => {
        useEmployerDetails.mockReturnValue(mockEmployerDetails);

        usePermission.mockReturnValue({
            hasPermission: jest.fn().mockReturnValue(hasPermissionValue),
        });

        usePostUploadToS3.mockReturnValue({
            mutateAsync: jest.fn().mockResolvedValue({ fileLink: 'https://example.com/new-agreement.pdf' }),
            status: 'idle',
            isError: false,
            error: null,
            data: null,
        });

        useUploadAndDeleteAgreement.mockReturnValue({
            mutateAsync: jest.fn().mockResolvedValue({}),
            status: 'idle',
            isError: false,
            error: null,
        });

        usePutUpdateEmployerStatus.mockReturnValue({
            mutateAsync: jest.fn().mockResolvedValue({}),
            status: 'idle',
            isError: false,
            error: null,
        });
    };

    beforeEach(() => {
        setupMocks();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const renderComponent = () => {
        return render(
            <SnackbarProvider>
                <MemoryRouter initialEntries={['/employers/test-employer-id']}>
                    <Routes>
                        <Route
                            path="/employers/:id"
                            element={
                                <EmployerProfile
                                    currentIndex={mockEmployerData}
                                    setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                                    setPageRoute={mockSetPageRoute}
                                    refetchEmployerData={mockRefetchEmployerData}
                                />
                            }
                        />
                    </Routes>
                </MemoryRouter>
            </SnackbarProvider>
        );
    };

    it('should render all the sections correctly', () => {
        renderComponent();

        expect(screen.getAllByText(/Agreement/i)[0]).toBeInTheDocument();

        const expectedText = ['Basic Details', 'Business Details', 'Bank Details'];
        expectedText.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });

        const expectedIds = ['businessVerification', 'bankDetails', 'agreement'];
        expectedIds.forEach((id) => {
            expect(screen.getByTestId(id)).toBeInTheDocument();
        });
    });

    it('should handle business verification row click', () => {
        renderComponent();

        const businessVerificationTable = screen.getByTestId('businessVerification');
        const rows = businessVerificationTable.querySelectorAll('tr');
        if (rows.length > 1) {
            fireEvent.click(rows[1]); // First row after header
            expect(mockEmployerDetails.handleRowClick).toHaveBeenCalled();
        }
    });

    it('should open the agreement drawer when "View Agreement" is clicked', async () => {
        renderComponent();

        const agreementActionsButton = screen.getByTestId('agreement-actions-button');
        fireEvent.click(agreementActionsButton);

        const actionsMenu = screen.getByText('View Agreement');
        fireEvent.click(actionsMenu);

        await waitFor(() => {
            expect(screen.getByTestId('agreement-drawer')).toBeInTheDocument();
        });
    });

    it('should open the delete confirmation popup when "Delete" is clicked', async () => {
        renderComponent();

        const agreementActionsButton = screen.getByTestId('agreement-actions-button');
        fireEvent.click(agreementActionsButton);

        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            expect(screen.getByTestId('global-pop')).toBeInTheDocument();
            expect(screen.getByText('Delete Agreement')).toBeInTheDocument();
            expect(screen.getByText('Do you really want to delete it?')).toBeInTheDocument();
        });
    });

    it('should delete the agreement when confirm delete is clicked', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({});
        useUploadAndDeleteAgreement.mockReturnValue({
            mutateAsync: mockMutateAsync,
            status: 'idle',
            isError: false,
            error: null,
        });

        renderComponent();

        const agreementActionsButton = screen.getByTestId('agreement-actions-button');
        fireEvent.click(agreementActionsButton);

        const deleteButton = screen.getByText('Delete');
        fireEvent.click(deleteButton);

        await waitFor(() => {
            const confirmDeleteButton = screen.getByText('Confirm Delete');
            fireEvent.click(confirmDeleteButton);
        });

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalledWith({
                id: 'test-employer-id',
                agreementDetails: {
                    url: '',
                },
            });
            expect(mockRefetchEmployerData).toHaveBeenCalled();
        });
    });

    it('should open the edit details drawer when the edit button is clicked', () => {
        renderComponent();

        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        expect(screen.getByTestId('edit-details-drawer')).toBeInTheDocument();
    });

    it('should update employer details when the form is submitted', async () => {
        const mockMutateAsync = jest.fn().mockResolvedValue({});
        usePutUpdateEmployerStatus.mockReturnValue({
            mutateAsync: mockMutateAsync,
            status: 'idle',
            isError: false,
            error: null,
        });

        renderComponent();

        const editButton = screen.getByText('Edit');
        fireEvent.click(editButton);

        const formUpdates = {
            'Company Name': 'Updated Company',
            'Brand Name': 'Updated Brand',
            'Company Size': '51-200',
            'Company Type': 'Public Limited'
        };

        Object.entries(formUpdates).forEach(([label, value]) => {
            const input = screen.getByLabelText(label);
            fireEvent.change(input, { target: { value } });
        });

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(mockMutateAsync).toHaveBeenCalled();
            expect(mockRefetchEmployerData).toHaveBeenCalled();
        });
    });

    it('should not show edit buttons when user lacks permission', () => {
        setupMocks(false);
        renderComponent();

        expect(screen.queryByText('Edit')).not.toBeInTheDocument();
    });
});