import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateAccDrawer from '../../../components/employers/CreateAccDrawer';
import { COMPANY_SIZE_MAX_LIMIT, EMPLOYER_DEFAULT_MIN } from '../../../constants/employer';


describe('CreateAccDrawer Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockCreateAccObj = {
        companyName: '',
        companySize: '',
        employersAgencyType: '',
    };

    const mockCreateAccErr = {
        companyName: false,
        companySize: false,
    };

    let mockToggleDrawer;
    let mockHandleCreateAccount;
    let mockClearFields;
    let mockSetCreateAccErr;
    let mockSetCreateAccObj;
    let mockSetIsCalculateEarningsVisible;
    let mockSetEmployersAgencyType;

    beforeEach(() => {

        mockToggleDrawer = jest.fn();
        mockHandleCreateAccount = jest.fn();
        mockClearFields = jest.fn();
        mockSetCreateAccErr = jest.fn();
        mockSetCreateAccObj = jest.fn();
        mockSetIsCalculateEarningsVisible = jest.fn();
        mockSetEmployersAgencyType = jest.fn();

        render(
            <CreateAccDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                handleCreateAccount={mockHandleCreateAccount}
                clearFields={mockClearFields}
                createAccObj={mockCreateAccObj}
                createAccErr={mockCreateAccErr}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                employersAgencyType={[]}
                setEmployersAgencyType={mockSetEmployersAgencyType}
            />
        );
    });

    it('renders without crashing', () => {
        expect(screen.getByText('New Account')).toBeInTheDocument();
    });

    it('renders all input fields correctly', () => {
        expect(screen.getByPlaceholderText('Enter Company Name')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Enter Company Size')).toBeInTheDocument();
    });

    it('updates state on input change', () => {
        const companyNameInput = screen.getByPlaceholderText('Enter Company Name');
        fireEvent.change(companyNameInput, { target: { value: 'Test Company' } });

        expect(mockSetCreateAccObj).toHaveBeenCalledWith({
            ...mockCreateAccObj,
            companyName: 'Test Company',
        });

        const companySizeInput = screen.getByPlaceholderText('Enter Company Size');
        fireEvent.change(companySizeInput, { target: { value: '100' } });

        expect(mockSetCreateAccObj).toHaveBeenCalledWith({
            ...mockCreateAccObj,
            companySize: '100',
        });
    });

    it('displays error messages for invalid input', () => {
        const mockErrorsWithMessage = {
            companyName: true,
            companySize: true,
        };

        render(
            <CreateAccDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                handleCreateAccount={mockHandleCreateAccount}
                clearFields={mockClearFields}
                createAccObj={mockCreateAccObj}
                createAccErr={mockErrorsWithMessage}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                employersAgencyType={[]}
                setEmployersAgencyType={mockSetEmployersAgencyType}
            />
        );

        expect(screen.getByText('* Enter Company Name')).toBeInTheDocument();
        expect(
            screen.getByText(`* Company Size must be in the range of ${EMPLOYER_DEFAULT_MIN} to ${COMPANY_SIZE_MAX_LIMIT}.`)
        ).toBeInTheDocument();
    });

    it('disables the "Calculate Earnings" button when required fields are empty', () => {
        const validCreateAccObj = {
            companyName: '',
            companySize: '',
            employersAgencyType: '',
        };

        render(
            <CreateAccDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                handleCreateAccount={mockHandleCreateAccount}
                clearFields={mockClearFields}
                createAccObj={validCreateAccObj}
                createAccErr={mockCreateAccErr}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                employersAgencyType={[]}
                setEmployersAgencyType={mockSetEmployersAgencyType}
            />
        );
        const calculateEarningsButton = screen.getByRole('button', { name: /Calculate Earnings/i });

        const styles = window.getComputedStyle(calculateEarningsButton);
        expect(styles.cursor).toBe('not-allowed');
    });

    it('enables the "Calculate Earnings" button when required fields are valid', () => {
        const validCreateAccObj = {
            companyName: 'Test Company',
            companySize: '100',
            employersAgencyType: 'Agency',
        };

        render(
            <CreateAccDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                handleCreateAccount={mockHandleCreateAccount}
                clearFields={mockClearFields}
                createAccObj={validCreateAccObj}
                createAccErr={mockCreateAccErr}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                employersAgencyType={[]}
                setEmployersAgencyType={mockSetEmployersAgencyType}
            />
        );
        const calculateEarningsButton = screen.getByRole('button', { name: /Calculate Earnings/i });

        const styles = window.getComputedStyle(calculateEarningsButton);
        expect(styles.cursor).not.toBe('not-allowed');
    });

    it('calls handleCreateAccount when "Calculate Earnings" is clicked with valid input', () => {
        const validCreateAccObj = {
            companyName: 'Test Company',
            companySize: '100',
            employersAgencyType: 'Agency',
        };

        render(
            <CreateAccDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                handleCreateAccount={mockHandleCreateAccount}
                clearFields={mockClearFields}
                createAccObj={validCreateAccObj}
                createAccErr={mockCreateAccErr}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                employersAgencyType={[]}
                setEmployersAgencyType={mockSetEmployersAgencyType}
            />
        );

        const calculateEarningsButton = screen.getByRole('button', { name: /Calculate Earnings/i });
        fireEvent.click(calculateEarningsButton);

        expect(mockHandleCreateAccount).toHaveBeenCalled();
    });

    it('closes the drawer and clears fields when handleCloseDrawer is called', () => {
        const closeButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(closeButton);

        expect(mockToggleDrawer).toHaveBeenCalledWith(false);
        expect(mockClearFields).toHaveBeenCalled();
    });
});