import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import PermissionsList from '../../../components/users/PermissionsList';
import { SnackbarProvider } from 'notistack';
import usePermissionsList from '../../../hooks/users/usePermissionsList';
import usePermission from '../../../hooks/usePermission';

jest.mock('../../../hooks/users/usePermissionsList');
jest.mock('../../../hooks/usePermission');

jest.mock('../../../components/DisplayTable', () => {
    return function MockDisplayTable(props) {
        return (
            <div
                data-testid="display-table"
                data-rows={JSON.stringify(props.rows)}
                data-headers={JSON.stringify(props.headers)}
            >
                Mocked Display Table
            </div>
        );
    };
});

jest.mock('../../../components/GlobalPop', () => {
    return function MockGlobalPop(props) {
        return (
            <div data-testid="global-pop">
                <button onClick={props.onClose}>Delete</button>
                <button onClick={props.onConfirm}>Confirm</button>
                Mocked Global Pop-Up
            </div>
        );
    };
});

const mockUsePermissionsList = {
    allPermissionsData: [{ id: 1, name: 'Test Permission' }],
    openAddPermission: false,
    isEdit: false,
    permissionHeaders: ['ID', 'Name'],
    permissionHeaderTypes: ['text', 'text'],
    permissionRows: [{ id: 1, name: 'Test Permission' }],
    permissionObj: {},
    permissionObjError: {},
    postUserPermissionStatus: '',
    actionIndex: 0,
    actionOpen: false,
    deleteUserPermissionStatus: '',
    putUserPermissionStatus: '',
    openDeletePop: false,
    permissionSearch: '',
    isFetchingAllPermissions: false,
    showActionsPanel: true,
    setShowActionsPanel: jest.fn(),
    setPermissionSearch: jest.fn(),
    handleSearchByPermissionName: jest.fn(),
    handleEnterButton: jest.fn(),
    setOpenDeletePop: jest.fn(),
    handleDeletePermission: jest.fn(),
    setOpenAddPermission: jest.fn(),
    setIsEdit: jest.fn(),
    handleFieldUpdate: jest.fn(),
    handleApplyClick: jest.fn(),
    clearFields: jest.fn(),
    refetchPermissionsData: jest.fn(),
    setActionIndex: jest.fn(),
    setActionOpen: jest.fn(),
    handleEditPermission: jest.fn(),
};

const mockUsePermission = {
    hasPermission: jest.fn(() => true),
};

describe('PermissionsList Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    beforeEach(() => {
        usePermissionsList.mockReturnValue(mockUsePermissionsList);
        usePermission.mockReturnValue(mockUsePermission);
    });

    it('renders the PermissionsList component correctly', () => {
        render(
            <MemoryRouter>
                <SnackbarProvider>
                    <PermissionsList />
                </SnackbarProvider>
            </MemoryRouter>
        );

        expect(screen.getByText('Add Permission')).toBeInTheDocument();
    });

    it('triggers add permission drawer when Add Permission button is clicked', () => {
        render(
            <MemoryRouter>
                <SnackbarProvider>
                    <PermissionsList />
                </SnackbarProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Add Permission'));
        expect(mockUsePermissionsList.setOpenAddPermission).toHaveBeenCalledWith(true);
    });

    it('triggers search when Search button is clicked', () => {
        render(
            <MemoryRouter>
                <SnackbarProvider>
                    <PermissionsList />
                </SnackbarProvider>
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Search'));
        expect(mockUsePermissionsList.handleSearchByPermissionName).toHaveBeenCalled();
    });
    
    // need to implement this test case

    // it('shows the delete confirmation popup when delete is clicked', async () => {
    //     render(
    //         <MemoryRouter>
    //             <SnackbarProvider>
    //                 <PermissionsList openDeletePop={true} />
    //             </SnackbarProvider>
    //         </MemoryRouter>
    //     );

    //     const deleteButton = await screen.findByText('Delete');
    //     fireEvent.click(deleteButton);

    //     await waitFor(() => {
    //         expect(screen.getByText('Are you sure you want to delete this role?')).toBeInTheDocument();
    //     });
    // });
});