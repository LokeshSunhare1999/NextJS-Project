import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';
import SidebarSubmenu from '../../../components/common/SidebarSubmenu';
import * as usePermissionHook from '../../../hooks/usePermission';

// Mock usePermission hook
jest.mock('../../../hooks/usePermission', () => ({
    __esModule: true,
    default: () => ({
        hasPermission: jest.fn(),
    }),
}));

describe('SidebarSubmenu Component', () => {
    const mockHasPermission = jest.fn();

    const item = {
        icon: 'main-icon.png',
        alt: 'Main Icon',
        text: 'Main Menu',
        subItems: [
            {
                to: '/dashboard',
                text: 'Dashboard',
                icon: 'dashboard-icon.png',
                activeIcon: 'dashboard-active-icon.png',
                alt: 'Dashboard Icon',
                permission: 'view_dashboard',
            },
            {
                to: '/settings',
                text: 'Settings',
                icon: 'settings-icon.png',
                activeIcon: 'settings-active-icon.png',
                alt: 'Settings Icon',
                permission: 'view_settings',
            },
        ],
    };

    beforeEach(() => {
        jest.spyOn(console, 'error').mockImplementation(() => { });
        jest.spyOn(usePermissionHook, 'default').mockReturnValue({
            hasPermission: mockHasPermission,
        });
        // mock the permission for all tests before run it
        mockHasPermission.mockImplementation((permission) => permission === 'view_dashboard');
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('renders the main menu with icon and label', () => {
        render(
            <MemoryRouter>
                <SidebarSubmenu item={item} />
            </MemoryRouter>
        );

        expect(screen.getByText('Main Menu')).toBeInTheDocument();
        expect(screen.getByAltText('Main Icon')).toBeInTheDocument();
    });

    it('toggles the submenu open and closed on click', async () => {

        render(
            <MemoryRouter>
                <SidebarSubmenu item={item} />
            </MemoryRouter>
        );

        const mainMenu = screen.getByText('Main Menu').parentElement;
        // Initially, submenu items should not be visible
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
        // Click to open submenu
        fireEvent.click(mainMenu);
        expect(screen.queryByText('Dashboard')).toBeInTheDocument();
        // Click again to close submenu
        fireEvent.click(mainMenu);
        // Ensure the submenu item disappears
        expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    });

    it('renders only permitted submenu items', () => {

        render(
            <MemoryRouter>
                <SidebarSubmenu item={item} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Main Menu').parentElement);

        // Dashboard should render because permission is true
        expect(screen.getByText('Dashboard')).toBeInTheDocument();

        expect(screen.queryByText('Settings')).not.toBeInTheDocument();
    });

    it('applies active class to the active submenu item', () => {

        render(
            <MemoryRouter initialEntries={['/dashboard']}>
                <SidebarSubmenu item={item} />
            </MemoryRouter>
        );

        // Open submenu
        fireEvent.click(screen.getByText('Main Menu').parentElement);

        // Select the Dashboard submenu item using text
        const dashboardItem = screen.getByText('Dashboard').closest('a');

        // Check if the active class is applied
        expect(dashboardItem).toHaveClass('active');
    });
});
