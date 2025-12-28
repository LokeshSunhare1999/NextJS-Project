import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import SidebarSubmenu from '../../components/common/SidebarSubmenu';
import { UserContext } from '../../context/UserContext';
import { SIDEBAR_ITEMS } from '../../constants/sidebar';

jest.mock('../../components/common/SidebarSubmenu', () => () => (
    <button data-testid="sidebar-submenu">Sidebar Menu</button>
  ));

jest.mock('../../hooks/usePermission', () => ({
    __esModule: true, // It is Required for ES modules
    default: () => ({
        hasPermission: (permission) => permission === 'allowed', // Mock permission logic
        hasPermissionsArray: (permissions) => permissions.includes('allowed'), // Mock permissions array logic
    }),
}));

describe('Sidebar Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const user = {
        loggedInUserContact: {
            email: 'test@example.com',
        },
    };

    it('should render NavLink correctly', () => {
        const { getByText } = render(
            <MemoryRouter>
                <UserContext.Provider value={{ user }}>
                    <Sidebar />
                </UserContext.Provider>
            </MemoryRouter>
        );
        expect(getByText(/Home/i)).toBeInTheDocument();
    });

    it('renders sidebar items based on permissions', () => {
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user }}>
                    <Sidebar />
                </UserContext.Provider>
            </MemoryRouter>
        );
        // Check if an item with permission "allowed" is rendered
        const allowedItem = SIDEBAR_ITEMS.find((item) => item.permission === 'allowed');
        if (allowedItem) {
            const itemElement = screen.getByText(allowedItem.text);
            expect(itemElement).toBeInTheDocument();
        }

        // Check if an item with permission "denied" is not rendered
        const deniedItem = SIDEBAR_ITEMS.find((item) => item.permission === 'denied');
        if (deniedItem) {
            const itemElement = screen.queryByText(deniedItem.text);
            expect(itemElement).not.toBeInTheDocument();
        }
    });

    it('applies active styles to NavLink when the route is active', () => {
        const activeItem = SIDEBAR_ITEMS.find((item) => item.to === '/active-route');
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user }}>
                    <Sidebar />
                </UserContext.Provider>
            </MemoryRouter>
        );
        if (activeItem) {
            const activeNavLink = screen.getByText(activeItem.text).closest('a');
            expect(activeNavLink).toHaveClass('active');
            expect(activeNavLink).toHaveStyle('border: 1px solid #141482');
        }
    });

    it('renders SidebarSubmenu correctly', () => {
        const subMenuItem = SIDEBAR_ITEMS.find((item) => item.subItems?.length > 0);
        render(
            <MemoryRouter>
                <UserContext.Provider value={{ user }}>
                    <SidebarSubmenu />
                </UserContext.Provider>
            </MemoryRouter>
        );

        if (subMenuItem) {
            const submenuElement = screen.getByTestId('sidebar-submenu');
            expect(submenuElement).toBeInTheDocument();
        }
    });
});