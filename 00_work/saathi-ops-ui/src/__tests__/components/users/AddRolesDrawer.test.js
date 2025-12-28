import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddRolesDrawer from '../../../components/users/AddRolesDrawer';

import {
    ROLE_NAME_MIN_LENGTH,
    ROLE_NAME_MAX_LENGTH,
    ROLE_DESCRIPTION_MIN_LENGTH,
    ROLE_DESCRIPTION_MAX_LENGTH,
} from '../../../constants/users';

describe('AddRolesDrawer Component', () => {
    const mockProps = {
        open: true,
        toggleDrawer: jest.fn(),
        isEdit: false,
        handleFieldUpdate: jest.fn(),
        permissionsCheckbox: [
            { value: 'permission1', label: 'Permission 1', checked: false },
            { value: 'permission2', label: 'Permission 2', checked: false },
        ],
        handlePermissionsCheckbox: jest.fn(),
        handleApplyClick: jest.fn(),
        clearFields: jest.fn(),
        postUserRoleStatus: 'idle',
        putUserRoleStatus: 'idle',
        roleObj: {
            name: '',
            description: '',
        },
        roleObjError: {},
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the drawer with correct title', () => {
        render(<AddRolesDrawer {...mockProps} />);
        expect(screen.getByText('Add Role')).toBeInTheDocument();
    });

    it('renders with edit title when isEdit is true', () => {
        render(<AddRolesDrawer {...mockProps} isEdit={true} />);
        expect(screen.getByText('Edit Role')).toBeInTheDocument();
    });

    it('renders all required input fields', () => {
        render(<AddRolesDrawer {...mockProps} />);

        expect(screen.getByText('Role Name')).toBeInTheDocument();
        expect(screen.getByText('Role Description')).toBeInTheDocument();
        expect(screen.getByText('Add Permissions')).toBeInTheDocument();
    });

    it('renders permission checkboxes', () => {
        render(<AddRolesDrawer {...mockProps} />);
        expect(screen.getByText(/Permission1/i)).toBeInTheDocument();
        expect(screen.getByText(/Permission2/i)).toBeInTheDocument();
    });

    it('handles role name input change', () => {
        render(<AddRolesDrawer {...mockProps} />);
        const input = screen.getByText('Role Name').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'Admin' } });
        expect(mockProps.handleFieldUpdate).toHaveBeenCalledWith(
            expect.any(Object),
            'name'
        );
    });

    it('handles role description input change', () => {
        render(<AddRolesDrawer {...mockProps} />);
        const input = screen.getByText('Role Description').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'Administrator role' } });
        expect(mockProps.handleFieldUpdate).toHaveBeenCalledWith(
            expect.any(Object),
            'description'
        );
    });

    it('calls handleApplyClick when save button is clicked', () => {
        render(<AddRolesDrawer {...mockProps} />);
        const saveButton = screen.getByText(/Save/);
        fireEvent.click(saveButton);
        expect(mockProps.handleApplyClick).toHaveBeenCalled();
    });

    it('closes drawer when close button is clicked', () => {
        render(<AddRolesDrawer {...mockProps} />);
        const closeButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(closeButton);
        expect(mockProps.toggleDrawer).toHaveBeenCalled();
        expect(mockProps.clearFields).toHaveBeenCalled();
    });

    it('shows error messages when fields are invalid', () => {
        const propsWithErrors = {
            ...mockProps,
            roleObjError: {
                name: true,
                description: true,
            },
        };

        render(<AddRolesDrawer {...propsWithErrors} />);

        expect(
            screen.getByText(
                `* Role name is required and should be between ${ROLE_NAME_MIN_LENGTH} & ${ROLE_NAME_MAX_LENGTH} characters.`
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                `* Role description is required and should be between ${ROLE_DESCRIPTION_MIN_LENGTH} & ${ROLE_DESCRIPTION_MAX_LENGTH} characters.`
            )
        ).toBeInTheDocument();
    });

    it('displays current values in input fields', () => {
        const propsWithValues = {
            ...mockProps,
            roleObj: {
                name: 'Existing Role',
                description: 'Existing role description',
            },
        };

        render(<AddRolesDrawer {...propsWithValues} />);

        const nameInput = screen.getByPlaceholderText('Enter role name');
        const descriptionInput = screen.getByPlaceholderText('Enter role description');

        expect(nameInput).toHaveValue('Existing Role');
        expect(descriptionInput).toHaveValue('Existing role description');
    });

    it('shows checked permissions when provided', () => {
        const propsWithCheckedPermissions = {
            ...mockProps,
            permissionsCheckbox: [
                { value: 'permission1', label: 'Permission 1', checked: true },
                { value: 'permission2', label: 'Permission 2', checked: false },
            ],
        };

        render(<AddRolesDrawer {...propsWithCheckedPermissions} />);
        const permission1 = screen.getByText(/Permission1/i).parentElement.querySelector('input');
        const permission2 = screen.getByText(/Permission2/i).parentElement.querySelector('input');
        expect(permission1.checked).toBe(true);
        expect(permission2.checked).toBe(false);
    });
});