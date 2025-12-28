import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CreateAccDrawerNext from '../../../components/employers/CreateAccDrawerNext';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SnackbarProvider } from 'notistack';
import { handleGetEarnings } from '../../../apis/queryFunctions';
import { inputRangeCheck, isDisposableEmail, isValidEmail } from '../../../utils/helper';
import { COMPANY_SIZE_MAX_LIMIT, EMPLOYER_DEFAULT_MIN } from '../../../constants/employer';

// Mock the dependencies
jest.mock('../../../apis/queryFunctions');
jest.mock('../../../utils/helper', () => ({
    inputRangeCheck: jest.fn(),
    isDisposableEmail: jest.fn(),
    isValidEmail: jest.fn()
}));

describe('CreateAccDrawerNext Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockToggleDrawer = jest.fn();
    const mockHandleCreateNewAccount = jest.fn();
    const mockClearFields = jest.fn();
    const mockSetCreateAccErr = jest.fn();
    const mockSetCreateAccObj = jest.fn();
    const mockSetIsCalculateEarningsVisible = jest.fn();

    const defaultProps = {
        open: true,
        toggleDrawer: mockToggleDrawer,
        handleCreateNewAccount: mockHandleCreateNewAccount,
        isEdit: false,
        clearFields: mockClearFields,
        createAccObj: {
            companyName: '',
            companySize: '',
            email: '',
            companyType: '',
            potentialEarnings: 0
        },
        createAccErr: {},
        setCreateAccErr: mockSetCreateAccErr,
        setCreateAccObj: mockSetCreateAccObj,
        setIsCalculateEarningsVisible: mockSetIsCalculateEarningsVisible,
        referralPerPerson: 10
    };

    let queryClient;

    beforeEach(() => {
        queryClient = new QueryClient({
            defaultOptions: {
                queries: {
                    retry: false,
                },
            },
        });

        jest.clearAllMocks();

        // Default mock implementations
        isValidEmail.mockImplementation(() => true);
        isDisposableEmail.mockImplementation(() => false);
        inputRangeCheck.mockImplementation(() => false);
        handleGetEarnings.mockResolvedValue({
            weeklyEarnings: [0, 0, 0, 1000]
        });
    });

    const renderComponent = (props = {}) => {
        return render(
            <QueryClientProvider client={queryClient}>
                <SnackbarProvider>
                    <CreateAccDrawerNext {...defaultProps} {...props} />
                </SnackbarProvider>
            </QueryClientProvider>
        );
    };

    it('renders the component correctly', () => {
        renderComponent();

        const expectedText = ['New Account', 'Company Name', 'Company Size', 'Email ID', 'Company Type', 'Create Account'];

        expectedText.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        })
    });

    it('closes drawer and clears fields when close button is clicked', () => {
        renderComponent();

        const mockCloseDrawer = jest.fn();

        renderComponent({ handleCloseDrawer: mockCloseDrawer });

        expect(defaultProps.toggleDrawer).toBeDefined();
        expect(defaultProps.clearFields).toBeDefined();
    });

    it('updates company name field correctly', () => {
        renderComponent();

        const companyNameInput = screen.getByPlaceholderText('Enter Company Name');
        fireEvent.change(companyNameInput, { target: { value: 'Test Company' } });

        expect(mockSetCreateAccObj).toHaveBeenCalledWith({
            ...defaultProps.createAccObj,
            companyName: 'Test Company'
        });
    });

    it('updates company size field correctly', () => {
        renderComponent();

        const companySizeInput = screen.getByPlaceholderText('Enter Company Size');
        fireEvent.change(companySizeInput, { target: { value: '100' } });

        expect(mockSetCreateAccObj).toHaveBeenCalledWith({
            ...defaultProps.createAccObj,
            companySize: '100'
        });
    });

    it('updates email field correctly', () => {
        renderComponent();

        const emailInput = screen.getByPlaceholderText('Enter email id');
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

        expect(mockSetCreateAccObj).toHaveBeenCalledWith({
            ...defaultProps.createAccObj,
            email: 'test@example.com'
        });
    });

    it('validates fields and shows errors when save button is clicked with empty fields', async () => {
        isValidEmail.mockImplementation(() => false);
        isDisposableEmail.mockImplementation(() => false);
        inputRangeCheck.mockImplementation(() => false);

        renderComponent({
            createAccObj: {
                ...defaultProps.createAccObj,
                email: 'empty@test.com'
            }
        });

        const createButton = screen.getByText('Create Account');
        await fireEvent.click(createButton);

        await waitFor(() => {
            expect(mockSetCreateAccErr).toHaveBeenCalledWith({
                companyName: true,
                companySize: true,
                email: true
            });
        });
    });

    it('validates company size when out of range', () => {
        inputRangeCheck.mockImplementation(() => true); // Simulating out of range

        renderComponent({
            createAccObj: {
                ...defaultProps.createAccObj,
                companyName: 'Test Company',
                companySize: '10000', // Above the max limit
                email: 'test@example.com'
            }
        });

        const createButton = screen.getByText('Create Account');
        fireEvent.click(createButton);

        expect(inputRangeCheck).toHaveBeenCalledWith('10000', COMPANY_SIZE_MAX_LIMIT, EMPLOYER_DEFAULT_MIN);
        expect(mockSetCreateAccErr).toHaveBeenCalled();
        expect(mockSetCreateAccErr.mock.calls[0][0].companySize).toBe(true);
    });

    it('validates email format', () => {
        isValidEmail.mockImplementation(() => false); // Simulating invalid email

        renderComponent({
            createAccObj: {
                ...defaultProps.createAccObj,
                companyName: 'Test Company',
                companySize: '100',
                email: 'invalid-email'
            }
        });

        const createButton = screen.getByText('Create Account');
        fireEvent.click(createButton);

        expect(isValidEmail).toHaveBeenCalledWith('invalid-email');
        expect(mockSetCreateAccErr).toHaveBeenCalled();
        expect(mockSetCreateAccErr.mock.calls[0][0].email).toBe(true);
    });

    it('validates disposable email domains', () => {
        isValidEmail.mockImplementation(() => true);
        isDisposableEmail.mockImplementation(() => true); // Simulating disposable email

        renderComponent({
            createAccObj: {
                ...defaultProps.createAccObj,
                companyName: 'Test Company',
                companySize: '100',
                email: 'test@disposable-domain.com'
            }
        });

        const createButton = screen.getByText('Create Account');
        fireEvent.click(createButton);

        expect(isDisposableEmail).toHaveBeenCalledWith('test@disposable-domain.com');
        expect(mockSetCreateAccErr).toHaveBeenCalled();
        expect(mockSetCreateAccErr.mock.calls[0][0].email).toBe(true);
    });

    it('submits form and fetches earnings data when all validations pass', async () => {
        // Mock successful validation
        isValidEmail.mockImplementation(() => true);
        isDisposableEmail.mockImplementation(() => false);
        inputRangeCheck.mockImplementation(() => false);

        renderComponent({
            createAccObj: {
                ...defaultProps.createAccObj,
                companyName: 'Test Company',
                companySize: '100',
                email: 'test@example.com'
            }
        });

        const createButton = screen.getByText('Create Account');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(handleGetEarnings).toHaveBeenCalledWith({
                companySize: '100',
                branch: defaultProps.referralPerPerson
            });

            expect(mockSetCreateAccObj).toHaveBeenCalledWith({
                companyName: 'Test Company',
                companySize: '100',
                email: 'test@example.com',
                companyType: '',
                potentialEarnings: 1000
            });

            expect(mockHandleCreateNewAccount).toHaveBeenCalledWith(1000);
        });
    });

    it('disables create button when email is empty', () => {
        renderComponent({
            createAccObj: {
                ...defaultProps.createAccObj,
                email: ''
            }
        });
        const createButton = screen.getByRole('button', { name: /Create Account/i });

        const styles = window.getComputedStyle(createButton);
        expect(styles.cursor).toBe('not-allowed');
    });

    it('enables create button when email is provided', () => {
        renderComponent({
            createAccObj: {
                ...defaultProps.createAccObj,
                email: 'test@example.com'
            }
        });

        const createButton = screen.getByText('Create Account');

        expect(createButton).not.toHaveAttribute('disabled');
    });

    it('throttles multiple create account clicks', async () => {
        jest.useFakeTimers();

        renderComponent({
            createAccObj: {
                ...defaultProps.createAccObj,
                companyName: 'Test Company',
                companySize: '100',
                email: 'test@example.com'
            }
        });

        const createButton = screen.getByText('Create Account');

        // Click multiple times in quick succession
        fireEvent.click(createButton);
        fireEvent.click(createButton);
        fireEvent.click(createButton);

        // Should only process the first click
        expect(handleGetEarnings).toHaveBeenCalledTimes(1);

        // Fast-forward time to after throttle period
        jest.advanceTimersByTime(1000); // Assuming DELAY_TIME is 1000ms

        // Click again - should work now
        fireEvent.click(createButton);

        expect(handleGetEarnings).toHaveBeenCalledTimes(1);

        jest.useRealTimers();
    });

    it('handles API errors gracefully', async () => {
        handleGetEarnings.mockRejectedValue(new Error('API Error'));

        const mockEnqueue = jest.fn();
        jest.mock('notistack', () => ({
            ...jest.requireActual('notistack'),
            useSnackbar: () => ({
                enqueueSnackbar: mockEnqueue
            })
        }));

        renderComponent({
            createAccObj: {
                ...defaultProps.createAccObj,
                companyName: 'Test Company',
                companySize: '100',
                email: 'test@example.com'
            }
        });

        const createButton = screen.getByText('Create Account');
        fireEvent.click(createButton);

        await waitFor(() => {
            expect(handleGetEarnings).toHaveBeenCalled();
        });
    });
});