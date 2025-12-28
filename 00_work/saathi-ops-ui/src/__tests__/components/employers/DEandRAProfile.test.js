import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DEandRAProfile from '../../../components/employers/DEandRAProfile';
import useEmployerDetails from '../../../hooks/employer/useEmployerDetails';
import usePermission from '../../../hooks/usePermission';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../../constants/permissions';

// Mock the required dependencies
jest.mock('../../../hooks/employer/useEmployerDetails');
jest.mock('../../../hooks/usePermission');
jest.mock('react-router-dom', () => ({
    useNavigate: () => mockNavigate,
}));

// Mock the child components
jest.mock('../../../components/atom/tableComponents/DetailsContainer', () => ({ title, detailsData, showEdit, handleEditClick }) => (
    <div data-testid="details-container">
        <h2>{title}</h2>
        <div data-testid="details-data">{JSON.stringify(detailsData)}</div>
        {showEdit && <button data-testid="edit-button" onClick={handleEditClick}>Edit</button>}
    </div>
));

jest.mock('../../../components/DisplayTable', () => ({
    tableId,
    rows,
    headers,
    headersType,
    showActionsPanel,
    onClickFn,
    arrBtn,
    actionIndex,
    setActionIndex,
    actionOpen,
    setActionOpen,
    tooltipIcon,
    highlightRow,
    arrBtnRight,
}) => (
    <div data-testid="display-table">
        <table>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header.id}>{header.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map((row, index) => (
                    <tr key={index} data-testid="table-row" onClick={() => onClickFn(row)}>
                        {Object.values(row).map((cell, cellIndex) => (
                            <td key={cellIndex}>{cell}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
        {showActionsPanel && <div data-testid="actions-panel">Actions Available</div>}
    </div>
));

const mockNavigate = jest.fn();

describe('DEandRAProfile Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockCurrentIndex = { _id: '123' };
    const mockSetShowBusinessVerificationPage = jest.fn();
    const mockSetPageRoute = jest.fn();
    const mockRefetchEmployerData = jest.fn();

    const mockEmployeeBasicDetail = {
        companyName: 'Test Company',
        companyType: 'Private Limited',
        companyWebsiteUrl: 'www.testcompany.com',
        phoneNo: '1234567890',
        recruiterName: 'Mr John Doe',
        firstName: 'John',
        lastName: 'Doe',
        nameTitle: 'Mr',
        brandName: 'TestBrand',
        emailId: 'john.doe@example.com',
        communicationPhoneNo: '0987654321',
        companySize: '10-50',
        businessCategory: 'IT',
        createdOn: '2023-01-01',
        address: '123 Test Street'
    };

    const mockBusinessVerificationRows = [
        { id: '1', documentType: 'Certificate', status: 'Verified', fileName: 'cert.pdf' },
        { id: '2', documentType: 'License', status: 'Pending', fileName: 'license.pdf' }
    ];

    beforeEach(() => {
        jest.clearAllMocks();

        useEmployerDetails.mockReturnValue({
            employeeBasicDetail: mockEmployeeBasicDetail,
            handleRowClick: jest.fn(),
            businessVerificationRows: mockBusinessVerificationRows
        });

        usePermission.mockReturnValue({
            hasPermission: (permission) => {
                return permission === EMPLOYER_MODULE_PERMISSIONS.UPDATE_PROFILE_DETAILS;
            }
        });
    });

    it('renders the component without crashing', () => {
        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        expect(screen.getByTestId('details-container')).toBeInTheDocument();
        expect(screen.getByTestId('display-table')).toBeInTheDocument();
    });

    it('displays the correct basic details', () => {
        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        const detailsData = screen.getByTestId('details-data');
        expect(detailsData).toHaveTextContent('Test Company');
        expect(detailsData).toHaveTextContent('Private Limited');
        expect(detailsData).toHaveTextContent('www.testcompany.com');
        expect(detailsData).toHaveTextContent('john.doe@example.com');
    });

    it('shows the edit button when user has permission', () => {
        usePermission.mockReturnValue({
            hasPermission: () => true
        });

        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        expect(screen.getByTestId('edit-button')).toBeInTheDocument();
    });

    it('hides the edit button when user lacks permission', () => {
        usePermission.mockReturnValue({
            hasPermission: () => false
        });

        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        expect(screen.queryByTestId('edit-button')).not.toBeInTheDocument();
    });

    it('navigates to edit page when edit button is clicked', () => {
        usePermission.mockReturnValue({
            hasPermission: () => true
        });

        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        fireEvent.click(screen.getByTestId('edit-button'));
        expect(mockNavigate).toHaveBeenCalledWith('/employers/add-employer?id=123');
    });

    it('displays business verification data in the table', () => {
        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        const rows = screen.getAllByTestId('table-row');
        expect(rows).toHaveLength(2);
    });

    it('shows actions panel when user has permission', () => {
        usePermission.mockReturnValue({
            hasPermission: () => true
        });

        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        expect(screen.getByTestId('actions-panel')).toBeInTheDocument();
    });

    it('handles fullName construction with all name parts', () => {
        const customEmployeeDetail = {
            ...mockEmployeeBasicDetail,
            firstName: 'John',
            lastName: 'Doe',
            nameTitle: 'Mr'
        };

        useEmployerDetails.mockReturnValue({
            employeeBasicDetail: customEmployeeDetail,
            handleRowClick: jest.fn(),
            businessVerificationRows: mockBusinessVerificationRows
        });

        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        const detailsData = screen.getByTestId('details-data');
        expect(detailsData).toHaveTextContent('"recruiterName":"John Doe"');
        // expect(detailsData).toHaveTextContent('Mr John Doe');
    });

    it('handles fullName construction with missing name parts', () => {
        const customEmployeeDetail = {
            ...mockEmployeeBasicDetail,
            firstName: '-----',
            lastName: 'Doe',
            nameTitle: 'Mr'
        };

        useEmployerDetails.mockReturnValue({
            employeeBasicDetail: customEmployeeDetail,
            handleRowClick: jest.fn(),
            businessVerificationRows: mockBusinessVerificationRows
        });

        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        const detailsData = screen.getByTestId('details-data');
        expect(detailsData).toHaveTextContent('"recruiterName":"Doe"');
        expect(detailsData).not.toHaveTextContent('"recruiterName":"----- Doe"');
    });

    it('handles row click in the business verification table', () => {
        const mockHandleRowClick = jest.fn();
        useEmployerDetails.mockReturnValue({
            employeeBasicDetail: mockEmployeeBasicDetail,
            handleRowClick: mockHandleRowClick,
            businessVerificationRows: mockBusinessVerificationRows
        });

        render(
            <DEandRAProfile
                currentIndex={mockCurrentIndex}
                setShowBusinessVerificationPage={mockSetShowBusinessVerificationPage}
                setPageRoute={mockSetPageRoute}
                refetchEmployerData={mockRefetchEmployerData}
            />
        );

        const rows = screen.getAllByTestId('table-row');
        fireEvent.click(rows[0]);
        expect(mockHandleRowClick).toHaveBeenCalledWith(mockBusinessVerificationRows[0]);
    });
});