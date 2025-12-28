import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Layout from '../../components/Layout';
import { BrowserRouter as Router } from 'react-router-dom';
import useDeviceType from '../../hooks/useDeviceType';
import { DEVICE_TYPES } from '../../constants';

jest.mock('../../hooks/useDeviceType');
jest.mock('../../components/Header', () => () => <div>Header</div>);
jest.mock('../../components/Sidebar', () => () => <div>Sidebar</div>);

describe('Layout', () => {
    const renderLayout = () => {
        render(
            <Router>
                <Layout />
            </Router>
        );
    };

    it('renders Layout component with Header and Sidebar on desktop', () => {
        useDeviceType.mockReturnValue(DEVICE_TYPES.DESKTOP);
        renderLayout();
        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.getByText('Sidebar')).toBeInTheDocument();
    });

    it('renders Layout component with Header and without Sidebar on mobile', () => {
        useDeviceType.mockReturnValue(DEVICE_TYPES.MOBILE);
        renderLayout();
        expect(screen.getByText('Header')).toBeInTheDocument();
        expect(screen.queryByText('Sidebar')).not.toBeInTheDocument();
    });

    it('renders Outlet component', () => {
        useDeviceType.mockReturnValue(DEVICE_TYPES.DESKTOP);
        renderLayout();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });
});