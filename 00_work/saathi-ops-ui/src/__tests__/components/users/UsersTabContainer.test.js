import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import UsersTabContainer from '../../../components/users/UsersTabContainer';
import { USERS_MODULE } from '../../../constants/users';

// Mock lazy-loaded components
jest.mock('../../../components/users/UsersList', () => () => <div>UsersList Mock</div>);
jest.mock('../../../components/users/RolesList', () => () => <div>RolesList Mock</div>);
jest.mock('../../../components/users/PermissionsList', () => () => <div>PermissionsList Mock</div>);

describe('UsersTabContainer Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    it('renders without crashing', () => {
        render(<UsersTabContainer />);
        expect(screen.getByRole('tablist')).toBeInTheDocument();
    });

    it('renders all tab headers correctly', () => {
        render(<UsersTabContainer />);
        USERS_MODULE.USER_TAB_HEADERS.forEach((header) => {
            expect(screen.getByText(header)).toBeInTheDocument();
        });
    });

    it('renders the first tab content by default', () => {
        render(<UsersTabContainer />);
        expect(screen.getByText('UsersList Mock')).toBeInTheDocument();
    });

    it('updates tab indicator color when selected', () => {
        render(<UsersTabContainer />);
        const rolesTab = screen.getByText(USERS_MODULE.USER_TAB_HEADERS[1]);
        fireEvent.click(rolesTab);
        expect(rolesTab).toHaveStyle('color: #141482');
    });
});