import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import { SnackbarProvider } from 'notistack';
import VerificationPage from '../../../components/verification/VerificationDetails';
import * as useParseVerificationDataModule from '../../../hooks/useParseVerificationData';
import * as apiQueryHooks from '../../../apis/queryHooks';
import { VERIFICATION_PAGE_INFO } from '../../../constants/verification';

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useParams: () => ({ id: 'customer-123' }),
    useNavigate: () => jest.fn(),
}));

const mockEnqueueSnackbar = jest.fn();
jest.mock('notistack', () => {
  const originalModule = jest.requireActual('notistack');
  
  return {
    ...originalModule,
    useSnackbar: () => ({
      enqueueSnackbar: mockEnqueueSnackbar,
    }),
  };
});

jest.mock('../../../components/verification/VerificationResults', () => {
    return {
        __esModule: true,
        default: jest.fn(() => <div data-testid="verification-results">Verification Results</div>),
    };
});

jest.mock('../../../components/verification/VerificationHeader', () => {
    return {
        __esModule: true,
        default: jest.fn(({ setIsDropdownOpen }) => (
            <div data-testid="verification-header">
                <button data-testid="dropdown-button" onClick={() => setIsDropdownOpen(prev => !prev)}>Toggle Dropdown</button>
            </div>
        )),
    };
});

jest.mock('../../../components/common/Remarks', () => {
    return {
        __esModule: true,
        default: jest.fn(({ onSubmit }) => (
            <div data-testid="remarks">
                <input data-testid="remarks-input" />
                <button data-testid="submit-remarks" onClick={() => onSubmit({ message: 'Test remark' })}>Submit</button>
            </div>
        )),
    };
});

describe('VerificationPage Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockSetShowVerificationPage = jest.fn();
    const mockSetPageRoute = jest.fn();
    const mockRefetchCustomerData = jest.fn();
    const mockPostRemarks = jest.fn().mockResolvedValue({ success: true });

    const defaultProps = {
        customerData: {
            id: 'customer-123',
            name: 'Test Customer',
            verificationStatus: 'PENDING',
        },
        isCustomerDataFetching: false,
        customerDataError: null,
        isCustomerDataError: false,
        refetchCustomerData: mockRefetchCustomerData,
        setShowVerificationPage: mockSetShowVerificationPage,
        pageRoute: 'address',
        setPageRoute: mockSetPageRoute,
    };

    beforeEach(() => {
        jest.clearAllMocks();

        jest.spyOn(useParseVerificationDataModule, 'default').mockReturnValue({
            pageData: {
                verificationStatus: 'PENDING',
                possibleStates: ['VERIFIED', 'REJECTED'],
                showNotificationButton: true,
            },
            remarks: [
                { id: '1', message: 'Previous remark', createdAt: '2023-01-01T00:00:00Z' },
            ],
        });

        jest.spyOn(apiQueryHooks, 'usePostRemarks').mockReturnValue({
            mutateAsync: mockPostRemarks,
            status: 'idle',
            isError: false,
            error: null,
        });
    });

    it('renders loading state when data is fetching', () => {
        render(
            <SnackbarProvider>
                <MemoryRouter>
                    <VerificationPage
                        {...defaultProps}
                        isCustomerDataFetching={true}
                    />
                </MemoryRouter>
            </SnackbarProvider>
        );

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
        expect(screen.queryByTestId('verification-results')).not.toBeInTheDocument();
    });

    it('renders verification page content when data is loaded', () => {
        render(
            <SnackbarProvider>
                <MemoryRouter>
                    <VerificationPage {...defaultProps} />
                </MemoryRouter>
            </SnackbarProvider>
        );

        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(screen.getByTestId('verification-header')).toBeInTheDocument();
        expect(screen.getByTestId('verification-results')).toBeInTheDocument();
        expect(screen.getByTestId('remarks')).toBeInTheDocument();
    });

    it('displays error snackbar when customerDataError exists', () => {
        render(
            <SnackbarProvider>
                <MemoryRouter>
                    <VerificationPage
                        {...defaultProps}
                        customerDataError={{ message: 'Error fetching data' }}
                    />
                </MemoryRouter>
            </SnackbarProvider>
        );

        expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
            'Failed to fetch details. error : Error fetching data',
            { variant: 'error' }
        );
    });

    it('navigates back when back arrow is clicked', () => {
        render(
            <SnackbarProvider>
                <MemoryRouter>
                    <VerificationPage {...defaultProps} />
                </MemoryRouter>
            </SnackbarProvider>
        );

        const backButton = screen.getByAltText('leftArrowBlack').closest('div');
        fireEvent.click(backButton);

        expect(mockSetShowVerificationPage).toHaveBeenCalledWith(false);
        expect(mockSetPageRoute).toHaveBeenCalledWith('');
    });

    it('toggles dropdown when dropdown button is clicked', () => {
        render(
            <SnackbarProvider>
                <MemoryRouter>
                    <VerificationPage {...defaultProps} />
                </MemoryRouter>
            </SnackbarProvider>
        );

        const dropdownButton = screen.getByTestId('dropdown-button');
        fireEvent.click(dropdownButton);

    });

    it('submits remarks and refetches data', async () => {
        render(
            <SnackbarProvider>
                <MemoryRouter>
                    <VerificationPage {...defaultProps} />
                </MemoryRouter>
            </SnackbarProvider>
        );

        const submitButton = screen.getByTestId('submit-remarks');
        fireEvent.click(submitButton);

        await waitFor(() => {
            expect(mockPostRemarks).toHaveBeenCalledWith({
                customerId: 'customer-123',
                remarks: {
                    message: 'Test remark',
                    remarkType: VERIFICATION_PAGE_INFO[defaultProps.pageRoute]?.WORKFLOW,
                },
            });
            expect(mockRefetchCustomerData).toHaveBeenCalled();
        });
    });

    it('handles remark submission error state', async () => {
        jest.spyOn(apiQueryHooks, 'usePostRemarks').mockReturnValue({
            mutateAsync: jest.fn().mockRejectedValue(new Error('Failed to post remark')),
            status: 'error',
            isError: true,
            error: { message: 'Failed to post remark' },
        });

        render(
            <SnackbarProvider>
                <MemoryRouter>
                    <VerificationPage {...defaultProps} />
                </MemoryRouter>
            </SnackbarProvider>
        );

        const remarksComponent = screen.getByTestId('remarks');
        expect(remarksComponent).toBeInTheDocument();
    });
});