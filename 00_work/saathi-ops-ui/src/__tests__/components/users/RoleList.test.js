import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import '@testing-library/jest-dom';
import RolesList from '../../../components/users/RolesList';
import useRolesList from '../../../hooks/users/useRolesList';
import usePermission from '../../../hooks/usePermission';

// Mock all lazy-loaded components
jest.mock('../../../components/DisplayTable', () => {
    return {
        __esModule: true,
        default: ({ rows, headers, showActionsPanel, arrBtn, ...props }) => (
            <div data-testid="display-table">
                {rows.map((row, rowIndex) => (
                    <div key={rowIndex} data-testid={`table-row-${rowIndex}`}>
                        {row.map((cell, cellIndex) => (
                            <span key={cellIndex}>{cell}</span>
                        ))}
                    </div>
                ))}
                {showActionsPanel && arrBtn.map((btn, index) => (
                    <button
                        key={index}
                        onClick={btn.onClick}
                        data-testid={`action-btn-${btn.text.toLowerCase()}`}
                    >
                        {btn.text}
                    </button>
                ))}
            </div>
        )
    };
});

jest.mock('../../../components/users/AddRolesDrawer', () => {
    return {
        __esModule: true,
        default: ({ open, ...props }) => (
            open ? <div data-testid="add-roles-drawer">Add Roles Drawer</div> : null
        )
    };
});

jest.mock('../../../components/GlobalPop', () => {
    return {
        __esModule: true,
        default: ({ open, ...props }) => (
            open ? <div data-testid="global-pop">Global Popup</div> : null
        )
    };
});

// Mock other dependencies
jest.mock('../../../hooks/users/useRolesList');
jest.mock('../../../hooks/usePermission');
jest.mock('../../../components/CustomCTA', () => ({ onClick, title, ...props }) => (
    <button onClick={onClick} data-testid="custom-cta">{title}</button>
));

describe('RolesList Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockUseRolesList = {
        allRolesData: [
            { id: 1, name: 'Admin', permissions: ['read', 'write'] },
            { id: 2, name: 'User', permissions: ['read'] }
        ],
        openAddRoles: false,
        isEdit: false,
        rolesHeaders: ['Name', 'Permissions'],
        rolesHeaderTypes: ['text', 'text'],
        rolesRows: [
            ['Admin', 'read, write'],
            ['User', 'read']
        ],
        actionIndex: 0,
        actionOpen: false,
        permissionsCheckbox: {},
        postUserRoleStatus: null,
        roleObj: {},
        roleObjError: {},
        putUserRoleStatus: null,
        openDeletePop: false,
        deleteUserRoleStatus: null,
        showActionsPanel: true,
        setShowActionsPanel: jest.fn(),
        setOpenDeletePop: jest.fn(),
        handleDeleteRole: jest.fn(),
        refetchRolesData: jest.fn(),
        handlePermissionsCheckbox: jest.fn(),
        handleApplyClick: jest.fn(),
        clearFields: jest.fn(),
        setActionOpen: jest.fn(),
        handleEditRole: jest.fn(),
        handleFieldUpdate: jest.fn(),
        setActionIndex: jest.fn(),
        setIsEdit: jest.fn(),
        setOpenAddRoles: jest.fn(),
    };

    const mockUsePermission = {
        hasPermission: jest.fn().mockReturnValue(true)
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useRolesList.mockReturnValue(mockUseRolesList);
        usePermission.mockReturnValue(mockUsePermission);
    });

    it('renders correctly RolesList', () => {
        render(
            <SnackbarProvider>
                <RolesList />
            </SnackbarProvider>
        );

        // Wait for async components to render
        return waitFor(() => {
            const displayTable = screen.getByTestId('display-table');
            expect(displayTable).toBeInTheDocument();

            // Verify table rows are rendered
            const tableRows = screen.getAllByTestId(/table-row-\d/);
            expect(tableRows.length).toBe(2);
        });
    });

    it('opens add roles drawer when Add Role button is clicked', () => {
        render(
            <SnackbarProvider>
                <RolesList />
            </SnackbarProvider>
        );

        const addRoleButton = screen.getByTestId('custom-cta');
        fireEvent.click(addRoleButton);

        expect(mockUseRolesList.setOpenAddRoles).toHaveBeenCalledWith(true);
        expect(mockUseRolesList.setIsEdit).toHaveBeenCalledWith(false);
    });

    it('shows actions panel with edit and delete buttons', async () => {
        render(
            <SnackbarProvider>
                <RolesList />
            </SnackbarProvider>
        );

        await waitFor(() => {
            const editButton = screen.getByTestId('action-btn-edit');
            const deleteButton = screen.getByTestId('action-btn-delete');

            expect(editButton).toBeInTheDocument();
            expect(deleteButton).toBeInTheDocument();
        });
    });

    it('opens delete popup when delete button is clicked', async () => {
        render(
            <SnackbarProvider>
                <RolesList />
            </SnackbarProvider>
        );

        await waitFor(() => {
            const deleteButton = screen.getByTestId('action-btn-delete');
            fireEvent.click(deleteButton);

            expect(mockUseRolesList.setOpenDeletePop).toHaveBeenCalledWith(true);
        });
    });

    it('handles successful role addition', async () => {
        const mockWithSuccessStatus = {
            ...mockUseRolesList,
            postUserRoleStatus: 'success'
        };
        useRolesList.mockReturnValue(mockWithSuccessStatus);

        render(
            <SnackbarProvider>
                <RolesList />
            </SnackbarProvider>
        );

        await waitFor(() => {
            expect(mockWithSuccessStatus.clearFields).toHaveBeenCalled();
            expect(mockWithSuccessStatus.setOpenAddRoles).toHaveBeenCalledWith(false);
            expect(mockWithSuccessStatus.refetchRolesData).toHaveBeenCalled();
        });
    });

    it('opens add roles drawer when add role is successful', async () => {
        const mockWithSuccessStatus = {
            ...mockUseRolesList,
            postUserRoleStatus: 'success'
        };
        useRolesList.mockReturnValue(mockWithSuccessStatus);

        render(
            <SnackbarProvider>
                <RolesList />
            </SnackbarProvider>
        );

        await waitFor(() => {
            const drawer = screen.queryByTestId('add-roles-drawer');
            expect(drawer).not.toBeInTheDocument();
        });
    });
});