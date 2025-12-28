import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddPermissionsDrawer from '../../../components/users/AddPermissionsDrawer';
import {
    ROLE_NAME_MIN_LENGTH,
    ROLE_NAME_MAX_LENGTH,
    ROLE_DESCRIPTION_MIN_LENGTH,
    ROLE_DESCRIPTION_MAX_LENGTH,
} from '../../../constants/users';

jest.mock('../../../components/CustomCTA', () => {
    return function MockCustomCTA(props) {
        const { title, postUserPermissionStatus, ...rest } = props;
        return (
            <button
                {...rest}
                disabled={postUserPermissionStatus === 'pending'}
                data-testid="save-button"
            >
                {title}
            </button>
        );
    };
});

describe('AddPermissionsDrawer Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockProps = {
        open: true,
        toggleDrawer: jest.fn(),
        isEdit: false,
        handleFieldUpdate: jest.fn(),
        handleApplyClick: jest.fn(),
        clearFields: jest.fn(),
        postUserPermissionStatus: 'idle',
        putUserPermissionStatus: 'idle',
        permissionObj: {
            name: '',
            description: '',
            type: '',
            access: '',
        },
        permissionObjError: {},
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the drawer with correct title', () => {
        render(<AddPermissionsDrawer {...mockProps} />);
        expect(screen.getByText('Add Permission')).toBeInTheDocument();
    });

    it('renders with edit title when isEdit is true', () => {
        render(<AddPermissionsDrawer {...mockProps} isEdit={true} />);
        expect(screen.getByText('Edit Permission')).toBeInTheDocument();
    });

    it('renders all required input fields', () => {
        render(<AddPermissionsDrawer {...mockProps} />);
        const expectedLabels = ['Permission Name', 'Permission Description', 'Permission Type', 'Permission Access'];
        expectedLabels.forEach((label) => expect(screen.getByText(label)).toBeInTheDocument());
    });

    it('handles permission name input change', () => {
        render(<AddPermissionsDrawer {...mockProps} />);
        const input = screen.getByText('Permission Name').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'Admin Access' } });
        expect(mockProps.handleFieldUpdate).toHaveBeenCalledWith(
            expect.any(Object),
            'name'
        );
    });

    it('handles permission description input change', () => {
        render(<AddPermissionsDrawer {...mockProps} />);
        const input = screen.getByText('Permission Description').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'Full admin privileges' } });
        expect(mockProps.handleFieldUpdate).toHaveBeenCalledWith(
            expect.any(Object),
            'description'
        );
    });

    it('handles permission type input change', () => {
        render(<AddPermissionsDrawer {...mockProps} />);
        const input = screen.getByText('Permission Type').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'admin' } });
        expect(mockProps.handleFieldUpdate).toHaveBeenCalledWith(
            expect.any(Object),
            'type'
        );
    });

    it('handles permission access input change', () => {
        render(<AddPermissionsDrawer {...mockProps} />);
        const input = screen.getByText('Permission Access').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'read-write' } });
        expect(mockProps.handleFieldUpdate).toHaveBeenCalledWith(
            expect.any(Object),
            'access'
        );
    });

    it('calls handleApplyClick when save button is clicked', () => {
        render(<AddPermissionsDrawer {...mockProps} />);
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
        expect(mockProps.handleApplyClick).toHaveBeenCalled();
    });

    it('closes drawer when close button is clicked', () => {
        render(<AddPermissionsDrawer {...mockProps} />);
        const closeButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(closeButton);
        expect(mockProps.toggleDrawer).toHaveBeenCalled();
        expect(mockProps.clearFields).toHaveBeenCalled();
    });

    it('shows error messages when fields are invalid', () => {
        const propsWithErrors = {
            ...mockProps,
            permissionObjError: {
                name: true,
                description: true,
                type: true,
                access: true,
            },
        };

        render(<AddPermissionsDrawer {...propsWithErrors} />);

        expect(
            screen.getByText(
                `* Permission name is required and should be between ${ROLE_NAME_MIN_LENGTH} & ${ROLE_NAME_MAX_LENGTH} characters.`
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                `* Permission description is required and should be between ${ROLE_DESCRIPTION_MIN_LENGTH} & ${ROLE_DESCRIPTION_MAX_LENGTH} characters.`
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                `* Permission type is required and should be between ${ROLE_NAME_MIN_LENGTH} & ${ROLE_NAME_MAX_LENGTH} characters.`
            )
        ).toBeInTheDocument();

        expect(
            screen.getByText(
                `* Permission access is required and should be between ${ROLE_NAME_MIN_LENGTH} & ${ROLE_NAME_MAX_LENGTH} characters.`
            )
        ).toBeInTheDocument();
    });

    it('displays current values in input fields', () => {
        const propsWithValues = {
            ...mockProps,
            permissionObj: {
                name: 'Existing Permission',
                description: 'Existing description',
                type: 'existing-type',
                access: 'read-only',
            },
        };

        render(<AddPermissionsDrawer {...propsWithValues} />);

        const nameInput = screen.getByPlaceholderText('Enter permission name');
        const descriptionInput = screen.getByPlaceholderText('Enter permission description');
        const typeInput = screen.getByPlaceholderText('Enter permission type');
        const accessInput = screen.getByPlaceholderText('Enter permission access');

        expect(nameInput).toHaveValue('Existing Permission');
        expect(descriptionInput).toHaveValue('Existing description');
        expect(typeInput).toHaveValue('existing-type');
        expect(accessInput).toHaveValue('read-only');
    });
});