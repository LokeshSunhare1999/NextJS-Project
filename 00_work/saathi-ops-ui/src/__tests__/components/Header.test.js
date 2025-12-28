import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../../components/Header';
import { UserContext } from '../../context/UserContext';
import ICONS from '../../assets/icons';
import { BrowserRouter as Router, useNavigate } from 'react-router-dom';
import { destroyCookie } from 'nookies';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),
}));

jest.mock('nookies', () => ({
    destroyCookie: jest.fn(),
}));


describe('Header', () => {
    const mockNavigate = jest.fn();
    const mockDestroyCookie = destroyCookie;
    jest.spyOn(console, 'error').mockImplementation(() => { });
    useNavigate.mockReturnValue(mockNavigate);

    const user = {
        loggedInUserContact: {
            email: 'test@example.com',
        },
    };

    const renderHeader = (deviceType) => {
        render(
            <Router>
                <UserContext.Provider value={{ user }}>
                    <Header deviceType={deviceType} />
                </UserContext.Provider>
            </Router>
        );
    };

    it('renders Header component', () => {
        renderHeader('DESKTOP');
        const headerElement = screen.getByAltText('Saathi_Logo');
        expect(headerElement).toBeInTheDocument();
    });

    it('displays the logo correctly', () => {
        renderHeader('DESKTOP');
        const logoElement = screen.getByAltText('Saathi_Logo');
        expect(logoElement).toHaveAttribute('src', ICONS.SAATHI_LOGO_NEW);
    });

    it('displays the user email correctly', () => {
        renderHeader('DESKTOP');
        const emailElement = screen.getByText('test@example.com');
        expect(emailElement).toBeInTheDocument();
    });

    it('toggles action menu when profile is clicked', () => {
      
        renderHeader('DESKTOP');
        const profileElement = screen.getByAltText('user');
        expect(profileElement).toBeInTheDocument();
        fireEvent.click(profileElement);
        
        const actionButtonElement = screen.getByText('Reset Password');
        expect(actionButtonElement).toBeInTheDocument();

        const logoutButton = screen.getByText('Log Out');
        expect(logoutButton).toBeInTheDocument();
    });

    it('calls triggerLogout when logout button is clicked', () => {
        renderHeader('DESKTOP');
        const profileElement = screen.getByAltText('user');
        fireEvent.click(profileElement);
        const logoutButton = screen.getByText('Log Out');
        fireEvent.click(logoutButton);
        expect(mockDestroyCookie).toHaveBeenCalledWith(null, 'accessToken');
        expect(mockDestroyCookie).toHaveBeenCalledWith(null, 'refreshToken');
        expect(mockDestroyCookie).toHaveBeenCalledWith(null, 'userId');
        expect(mockNavigate).toHaveBeenCalledWith('/login');
    });

    it('calls handleResetPassword when reset password button is clicked', () => {
        renderHeader('DESKTOP');
        const profileElement = screen.getByAltText('user');
        fireEvent.click(profileElement);
        const resetPasswordButton = screen.getByText('Reset Password');
        fireEvent.click(resetPasswordButton);
        expect(mockNavigate).toHaveBeenCalledWith('/reset-password');
    });
});