import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectEmpAgencyDrawer from '../../../components/employers/SelectEmpAgencyDrawer';
import { MemoryRouter } from 'react-router-dom';

// Mock the react-router-dom's useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate,
}));

describe('SelectEmpAgencyDrawer', () => {
    const defaultProps = {
        open: true,
        toggleDrawer: jest.fn(),
        handleSelectEmpAgency: jest.fn(),
        clearFields: jest.fn(),
        createAccObj: {},
        createAccErr: {},
        setCreateAccErr: jest.fn(),
        setCreateAccObj: jest.fn(),
        employersAgencyType: [
            { key: 'EMPLOYER', value: 'Employer', icon: 'employer-icon', checked: false },
            { key: 'STAFFING_AGENCY', value: 'Staffing Agency', icon: 'staffing-agency-icon', checked: false },
            { key: 'FACILITY_MANAGEMENT', value: 'Facility Management', icon: 'facility-management-icon', checked: false }
        ],
        setEmployersAgencyType: jest.fn(),
        employerDetails: {},
        setOpenCreateAccDrawer: jest.fn()
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the component with correct title', () => {
        render(
            <MemoryRouter>
                <SelectEmpAgencyDrawer {...defaultProps} />
            </MemoryRouter>
        );

        expect(screen.getByText('New Account')).toBeInTheDocument();
    });

    it('renders all agency type options', () => {
        render(
            <MemoryRouter>
                <SelectEmpAgencyDrawer {...defaultProps} />
            </MemoryRouter>
        );
        const expectedAgencyTypes = ['Employer', 'Staffing Agency', 'Facility Management'];
        expectedAgencyTypes.forEach((type) => {
            expect(screen.getByText(type)).toBeInTheDocument();
        });
    });

    it('calls setEmployersAgencyType when an agency is selected', () => {
        render(
            <MemoryRouter>
                <SelectEmpAgencyDrawer {...defaultProps} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Employer'));

        expect(defaultProps.setEmployersAgencyType).toHaveBeenCalled();
    });

    it('navigates to the correct route when EMPLOYER type is selected', () => {
        render(
            <MemoryRouter>
                <SelectEmpAgencyDrawer {...defaultProps} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Employer'));

        expect(mockedNavigate).toHaveBeenCalledWith('/employers/add-employer?agencyType=EMPLOYER');
    });

    it('opens create account drawer when STAFFING_AGENCY is selected', () => {
        render(
            <MemoryRouter>
                <SelectEmpAgencyDrawer {...defaultProps} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Staffing Agency'));

        expect(defaultProps.setOpenCreateAccDrawer).toHaveBeenCalledWith(true);
    });

    it('opens create account drawer when FACILITY_MANAGEMENT is selected', () => {
        render(
            <MemoryRouter>
                <SelectEmpAgencyDrawer {...defaultProps} />
            </MemoryRouter>
        );

        fireEvent.click(screen.getByText('Facility Management'));

        expect(defaultProps.setOpenCreateAccDrawer).toHaveBeenCalledWith(true);
    });
});