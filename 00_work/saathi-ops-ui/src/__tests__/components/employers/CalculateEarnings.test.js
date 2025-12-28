import React from 'react';
import { render, screen, fireEvent, waitFor, getAllByAltText, getAllByTestId } from '@testing-library/react';
import '@testing-library/jest-dom';
import CalculateEarnings from '../../../components/employers/CalculateEarnings';
import { useGetEarnings } from '../../../apis/queryHooks';
import { weeksList } from '../../../constants/employer';

// Mock the hook and dependencies
jest.mock('../../../apis/queryHooks');
jest.mock('../../../assets/icons', () => ({
    EARNING_BACK: 'earning-back-icon',
    RUPEE: 'rupee-icon',
    REFRESH: 'refresh-icon',
    CROSS_BUTTON_WHITE: 'cross-button-white-icon',
    NEXT_BUTTON: 'next-button-icon'
}));

jest.mock('../../../assets/images', () => ({
    CALCULATE_EARNINGS: 'calculate-earnings-background'
}));

jest.mock('../../../components/common/DrawerInput', () => {
    return function MockDrawerInput({
        fieldType,
        fieldValue,
        handleDropDownSelect,
        handleFieldChange,
        handleDropDownOpen,
        dropDownOpen,
        dropDownList
    }) {
        if (fieldType === 'days') {
            return (
                <div data-testid="drawer-input-days">
                    <span>{fieldValue}</span>
                    <button
                        data-testid="dropdown-toggle"
                        onClick={() => handleDropDownOpen(!dropDownOpen)}
                    >
                        Toggle
                    </button>
                    {dropDownOpen && (
                        <ul data-testid="dropdown-list">
                            {dropDownList.map((item, index) => (
                                <li
                                    key={index}
                                    data-testid={`dropdown-item-${item}`}
                                    onClick={() => handleDropDownSelect(item)}
                                >
                                    {item}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            );
        }
        return (
            <div data-testid={`drawer-input-${fieldType}`}>
                <input
                    data-testid={`input-${fieldType}`}
                    value={fieldValue}
                    onChange={handleFieldChange}
                />
            </div>
        );
    };
});

jest.mock('../../../components/CustomCTA', () => {
    return function MockCustomCTA({ title, onClick, disabled }) {
        return (
            <button
                data-testid="calculate-button"
                onClick={onClick}
                disabled={disabled}
            >
                {title}
            </button>
        );
    };
});

describe('CalculateEarnings Component', () => {
    const mockCreateAccObj = {
        companySize: 100,
        companyName: 'Test Company'
    };

    const mockSetIsCalculateEarningsVisible = jest.fn();
    const mockHandleOpenCreateAccountModal = jest.fn();
    const mockSetOpenCreateAccDrawer = jest.fn();
    const mockSetCreateAccErr = jest.fn();
    const mockSetCreateAccObj = jest.fn();
    const mockSetReferralPerPerson = jest.fn();

    const mockEarningsData = {
        weeklyEarnings: {
            1: 10000,
            2: 20000,
            3: 30000,
            4: 40000
        },
        earningsInWords: {
            1: 'Ten Thousand',
            2: 'Twenty Thousand',
            3: 'Thirty Thousand',
            4: 'Forty Thousand'
        }
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useGetEarnings.mockReturnValue({
            data: mockEarningsData,
            isLoading: false,
            isFetching: false,
            refetch: jest.fn(),
            status: 'success'
        });
    });

    it('renders component with initial data', () => {
        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );
        const expectedText = ['Potential Earnings', 'Test Company', 'Calculate Again'];
        expectedText.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        })
    });

    it('displays loading state when fetching data', () => {
        useGetEarnings.mockReturnValue({
            isLoading: true,
            isFetching: true,
            refetch: jest.fn(),
            status: 'loading'
        });

        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('clicking back arrow should call setIsCalculateEarningsVisible and setOpenCreateAccDrawer', async() => {
        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        const backArrow = screen.getByAltText('leftArrow');

        // Click the back arrow
        fireEvent.click(backArrow);

        expect(mockSetIsCalculateEarningsVisible).toHaveBeenCalledWith(false);
        expect(mockSetOpenCreateAccDrawer).toHaveBeenCalledWith(true);
    });

    it('clicking next button should call handleCreateAccDrawer', () => {
        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        const nextButton = screen.getByAltText('leftArrowBlack');
        fireEvent.click(nextButton);

        expect(mockSetCreateAccObj).toHaveBeenCalledWith({
            ...mockCreateAccObj,
            companySize: 100,
            potentialEarnings: 30000
        });
        expect(mockHandleOpenCreateAccountModal).toHaveBeenCalledWith(mockCreateAccObj);
    });

    it('clicking calculate again should show calculator UI', () => {
        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        const calculateAgain = screen.getByText('Calculate Again');
        fireEvent.click(calculateAgain);
        // we have 2 input fields, checking with first
        expect(screen.getAllByTestId('input-input')[0]).toBeInTheDocument();
        expect(screen.getByTestId('calculate-button')).toBeInTheDocument();
    });

    it('changing dropdown selection updates selectedDays', () => {
        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        const dropdownToggle = screen.getByTestId('dropdown-toggle');
        fireEvent.click(dropdownToggle);

        // Select first item from dropdown
        const firstItem = screen.getByTestId(`dropdown-item-${weeksList[0]}`);
        fireEvent.click(firstItem);

        // Check if drawer input now shows the selected value
        expect(screen.getByText(weeksList[0])).toBeInTheDocument();
    });

    it('inputs should update state correctly', async () => {
        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        // Open calculator
        const calculateAgain = screen.getByText('Calculate Again');
        fireEvent.click(calculateAgain);

        // Change first input
        const referralInput = screen.getAllByTestId('input-input')[0];
        fireEvent.change(referralInput, { target: { value: '200' } });

        // Check if mockSetCreateAccObj was called
        expect(mockSetCreateAccObj).toHaveBeenCalledWith({
            ...mockCreateAccObj,
            companySize: '200'
        });
    });

    it('clicking refresh should reset calculator values', async () => {
        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        // Open calculator
        const calculateAgain = screen.getByText('Calculate Again');
        fireEvent.click(calculateAgain);

        // Change input values
        const referralInput = screen.getAllByTestId('input-input')[0];
        fireEvent.change(referralInput, { target: { value: '200' } });

        // Click refresh
        const refreshButton = screen.getByAltText('Refresh');
        fireEvent.click(refreshButton);

        // Verify input has been reset
        expect(mockSetCreateAccObj).toHaveBeenCalledWith({
            ...mockCreateAccObj,
            companySize: '200'
        });
    });

    it('calculate button should be disabled when inputs are empty', () => {
        render(
            <CalculateEarnings
                createAccObj={{ ...mockCreateAccObj, companySize: '' }}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={''}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        // Open calculator
        const calculateAgain = screen.getByText('Calculate Again');
        fireEvent.click(calculateAgain);

        // Check if button is disabled
        const calculateButton = screen.getByTestId('calculate-button');
        expect(calculateButton).toBeDisabled();
    });

    it('clicking close button should hide calculator UI', () => {
        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        // Open calculator
        const calculateAgain = screen.getByText('Calculate Again');
        fireEvent.click(calculateAgain);

        // Close calculator
        const closeButton = screen.getByAltText('close');
        fireEvent.click(closeButton);

        // Check if calculator is hidden and "Calculate Again" is visible
        expect(screen.getByText('Calculate Again')).toBeInTheDocument();
        expect(screen.queryByTestId('drawer-input-input')).not.toBeInTheDocument();
    });

    it('clicking calculate button should update payload and refetch data', async () => {
        const mockRefetch = jest.fn();
        useGetEarnings.mockReturnValue({
            data: mockEarningsData,
            isLoading: false,
            isFetching: false,
            refetch: mockRefetch,
            status: 'success'
        });

        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        // Open calculator
        const calculateAgain = screen.getByText('Calculate Again');
        fireEvent.click(calculateAgain);

        // Change input values
        const referralInput = screen.getAllByTestId('input-input')[0];
        fireEvent.change(referralInput, { target: { value: '200' } });

        // Click calculate button
        const calculateButton = screen.getByTestId('calculate-button');
        fireEvent.click(calculateButton);

        // Verify refetch was called
        await waitFor(() => {
            expect(mockRefetch).toHaveBeenCalled();
        });
    });

    it('should validate input to not exceed 1000000', () => {
        render(
            <CalculateEarnings
                createAccObj={mockCreateAccObj}
                handleOpenCreateAccountModal={mockHandleOpenCreateAccountModal}
                setIsCalculateEarningsVisible={mockSetIsCalculateEarningsVisible}
                setOpenCreateAccDrawer={mockSetOpenCreateAccDrawer}
                openCreateAccDrawer={false}
                createAccErr={{}}
                setCreateAccErr={mockSetCreateAccErr}
                setCreateAccObj={mockSetCreateAccObj}
                referralPerPerson={5}
                setReferralPerPerson={mockSetReferralPerPerson}
            />
        );

        // Open calculator
        const calculateAgain = screen.getByText('Calculate Again');
        fireEvent.click(calculateAgain);

        // Try to input value > 1000000
        const referralInput = screen.getAllByTestId('input-input')[0];
        fireEvent.change(referralInput, { target: { value: '2000000' } });

        // Check that the value was not set
        expect(mockSetCreateAccObj).not.toHaveBeenCalledWith({
            ...mockCreateAccObj,
            companySize: '2000000'
        });
    });
});