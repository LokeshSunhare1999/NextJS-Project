import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddUsersDrawer from '../../../components/users/AddUsersDrawer';

// Mock props for testing
const mockProps = {
    open: true,
    toggleDrawer: jest.fn(),
    isEdit: false,
    userObj: {
        name: '',
        email: '',
        phone: '',
        userType: '',
    },
    userObjError: {},
    handleFieldUpdate: jest.fn(),
    userTypeCategoryOpen: false,
    rolesCheckbox: [
        { id: 1, label: 'Admin', value: "Admin", checked: false },
        { id: 2, label: 'Manager', value: "Manager", checked: false },
    ],
    postAddUserStatus: 'idle',
    putUserStatus: 'idle',
    setUserTypeCategoryOpen: jest.fn(),
    handleUserTypeCategorySelect: jest.fn(),
    clearFields: jest.fn(),
    handleRolesCheckbox: jest.fn(),
    handleApplyClick: jest.fn(),
};

describe('AddUsersDrawer Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const renderComponent = (props = {}) => {
        return render(<AddUsersDrawer {...mockProps} {...props} />);
    };

    it('renders drawer with correct title for add user', () => {
        renderComponent();
        expect(screen.getByText('Add User')).toBeInTheDocument();
    });

    it('renders drawer with correct title for edit user', () => {
        renderComponent({ isEdit: true });
        expect(screen.getByText('Edit User')).toBeInTheDocument();
    });

    it('renders input fields for new user', () => {
        renderComponent();
        const expectedFields = ['User Name', 'User Email', 'User Phone', 'User Type'];
        expectedFields.forEach((field) => {
            expect(screen.getByText(field)).toBeInTheDocument();
        });
    });

    it('does not render email, phone, and user type fields in edit mode', () => {
        renderComponent({ isEdit: true });
        const nonNameFields = [ 'User Email', 'User Phone', 'User Type'];
        nonNameFields.forEach((field) => {
            expect(screen.queryByText(field)).not.toBeInTheDocument();
        });
    });

    it('handles user name input', () => {
        renderComponent();
        const nameInput = screen.getByPlaceholderText('Enter user name');
        fireEvent.change(nameInput, { target: { value: 'John Doe' } });
        expect(mockProps.handleFieldUpdate).toHaveBeenCalledWith(
            expect.anything(),
            'name'
        );
    });

    it('renders roles checkbox', () => {
        renderComponent();
        expect(screen.getByText('Add Roles')).toBeInTheDocument();
        expect(screen.getByText('Admin')).toBeInTheDocument();
        expect(screen.getByText('Manager')).toBeInTheDocument();
    });

    it('save button triggers handleApplyClick', () => {
        renderComponent();
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
        expect(mockProps.handleApplyClick).toHaveBeenCalled();
    });

    it('handles email input', () => {
        renderComponent();
        const emailInput = screen.getByPlaceholderText('Enter user email');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(mockProps.handleFieldUpdate).toHaveBeenCalledWith(
            expect.anything(),
            'email'
        );
    });

    it('handles phone input', () => {
        renderComponent();
        const phoneInput = screen.getByPlaceholderText('Enter user phone');
        fireEvent.change(phoneInput, { target: { value: '1234567890' } });
        expect(mockProps.handleFieldUpdate).toHaveBeenCalledWith(
            expect.anything(),
            'phone'
        );
    });

    it('close drawer calls toggleDrawer and clearFields', () => {
        renderComponent();
        // This assumes there's a method to close the drawer, which might need to be adjusted
        const closeButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(closeButton);
        expect(mockProps.toggleDrawer).toHaveBeenCalled();
        expect(mockProps.clearFields).toHaveBeenCalled();
    });

    it('displays loading state on save button when submitting', () => {
        renderComponent({
            postAddUserStatus: 'pending',
            putUserStatus: 'idle'
        });

        const saveButton = screen.getByRole('button', { name: '' });

        expect(saveButton).toBeDisabled();

        const progressIndicator = screen.getByRole('progressbar', {
            hidden: true
        });
        expect(progressIndicator).toBeInTheDocument();
    });

    it('displays error messages for invalid inputs', () => {
        const errorProps = {
            ...mockProps,
            userObjError: {
                name: true,
                email: true,
                phone: true,
                userType: true
            }
        };
        renderComponent(errorProps);

        expect(screen.getByText(/User name is required/i)).toBeInTheDocument();
        expect(screen.getByText(/User email is required/i)).toBeInTheDocument();
        expect(screen.getByText(/User phone is required/i)).toBeInTheDocument();
        expect(screen.getByText(/User Type is required/i)).toBeInTheDocument();
    });
});