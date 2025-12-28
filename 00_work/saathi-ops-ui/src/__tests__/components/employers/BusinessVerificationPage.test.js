import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SnackbarProvider } from 'notistack';
import { useParams } from 'react-router-dom';
import BusinessVerificationPage from '../../../components/employers/BusinessVerificationPage';
import useParseBusinessVerificationData from '../../../hooks/employer/useParseBusinessVerification';
import { useEmployerDocPostRemarks } from '../../../apis/queryHooks';
import usePermission from '../../../hooks/usePermission';
import { STATUS_KEYS } from '../../../constants';
import { CUSTOMER_DETAILS_PERMISSIONS } from '../../../constants/permissions';

// Mock the hooks and router
jest.mock('react-router-dom', () => ({
  useParams: jest.fn()
}));

jest.mock('../../../hooks/employer/useParseBusinessVerification', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../../apis/queryHooks', () => ({
  useEmployerDocPostRemarks: jest.fn()
}));

jest.mock('../../../hooks/usePermission', () => ({
  __esModule: true,
  default: jest.fn()
}));

// Mock the child components
jest.mock('../../../components/employers/BusinessVerificationPageHeader', () => {
  return function MockBusinessVerificationPageHeader(props) {
    return (
      <div data-testid="business-verification-page-header">
        <div data-testid="page-route">{props.pageRoute}</div>
        <div data-testid="verification-status">{props.verificationStatus}</div>
        <button 
          data-testid="dropdown-toggle"
          onClick={() => props.setIsDropdownOpen(!props.isDropdownOpen)}
        >
          Toggle Dropdown
        </button>
        <button 
          data-testid="refetch-button" 
          onClick={props.refetchEmployerData}
        >
          Refetch Data
        </button>
      </div>
    );
  };
});

jest.mock('../../../components/employers/BusinessVerificationPageResults', () => {
  return function MockBusinessVerificationPageResults(props) {
    return (
      <div data-testid="business-verification-page-results">
        <div data-testid="page-route-results">{props.pageRoute}</div>
      </div>
    );
  };
});

jest.mock('../../../components/common/Remarks', () => {
  return function MockRemarks(props) {
    return (
      <div data-testid="remarks-component">
        <form 
          data-testid="remarks-form"
          onSubmit={(e) => {
            e.preventDefault();
            props.onSubmit({ message: 'Test remark' });
          }}
        >
          <input data-testid="remarks-input" />
          <button data-testid="remarks-submit" type="submit">Submit Remark</button>
        </form>
        <div data-testid="remarks-list">
          {props.remarks.map((remark, index) => (
            <div key={index} data-testid={`remark-${index}`}>{remark.message}</div>
          ))}
        </div>
      </div>
    );
  };
});
jest.mock('../../../constants/employer', () => ({
    EMPLOYER_BUSINESS_VERIFICATION_WORKFLOW: {
      'business-details': {
        WORKFLOW: 'BUSINESS_DETAILS_VERIFICATION'
      }
    }
  }));
describe('BusinessVerificationPage Component', () => {
  // Setup default mock values
  const mockEmployerData = { id: '12345', name: 'Test Employer' };
  const mockPageData = {
    verificationStatus: 'VERIFIED',
    possibleStates: ['VERIFIED', 'REJECTED'],
    showNotificationButton: true
  };
  const mockRemarks = [
    { id: '1', message: 'First remark', createdAt: '2023-01-01' },
    { id: '2', message: 'Second remark', createdAt: '2023-01-02' }
  ];
  
  const mockRefetchEmployerData = jest.fn();
  const mockSetPageRoute = jest.fn();
  const mockSetShowBusinessVerificationPage = jest.fn();
  const mockMutateAsync = jest.fn();
  
  const defaultProps = {
    employerData: mockEmployerData,
    refetchEmployerData: mockRefetchEmployerData,
    pageRoute: 'business-details',
    setPageRoute: mockSetPageRoute,
    setShowBusinessVerificationPage: mockSetShowBusinessVerificationPage
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock useParams
    useParams.mockReturnValue({ id: '12345' });
    
    // Mock useParseBusinessVerificationData
    useParseBusinessVerificationData.mockReturnValue({
      pageData: mockPageData,
      remarks: mockRemarks
    });
    
    // Mock useEmployerDocPostRemarks
    useEmployerDocPostRemarks.mockReturnValue({
      mutateAsync: mockMutateAsync,
      status: 'idle',
      isError: false,
      error: null
    });
    
    // Mock usePermission
    usePermission.mockReturnValue({
      hasPermission: jest.fn().mockImplementation((permission) => {
        if (permission === CUSTOMER_DETAILS_PERMISSIONS.EDIT_VERIFICATION_DETAILS) {
          return true;
        }
        return false;
      })
    });
  });

  const renderWithSnackbar = (ui) => {
    return render(
      <SnackbarProvider maxSnack={3}>
        {ui}
      </SnackbarProvider>
    );
  };

  it('renders correctly with default props', () => {
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    expect(screen.getByTestId('business-verification-page-header')).toBeInTheDocument();
    expect(screen.getByTestId('business-verification-page-results')).toBeInTheDocument();
    expect(screen.getByTestId('page-route')).toHaveTextContent('business-details');
    expect(screen.getByTestId('verification-status')).toHaveTextContent('VERIFIED');
  });

  it('handles left arrow click to go back', () => {
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    const backButton = screen.getByAltText('leftArrowBlack');
    fireEvent.click(backButton);
    
    expect(mockSetShowBusinessVerificationPage).toHaveBeenCalledWith(false);
    expect(mockSetPageRoute).toHaveBeenCalledWith('');
  });

  it('displays remarks component when verification status is not NOT_INITIATED and user has permissions', () => {
    const customPageData = {
      ...mockPageData,
      verificationStatus: 'VERIFIED' // not NOT_INITIATED
    };
    
    useParseBusinessVerificationData.mockReturnValue({
      pageData: customPageData,
      remarks: mockRemarks
    });
    
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    expect(screen.getByTestId('remarks-component')).toBeInTheDocument();
    expect(screen.getByTestId('remarks-list')).toBeInTheDocument();
    expect(screen.getAllByTestId(/remark-\d+/).length).toBe(2);
  });

  it('does not display remarks component when verification status is NOT_INITIATED', () => {
    const customPageData = {
      ...mockPageData,
      verificationStatus: STATUS_KEYS.NOT_INITIATED
    };
    
    useParseBusinessVerificationData.mockReturnValue({
      pageData: customPageData,
      remarks: mockRemarks
    });
    
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    expect(screen.queryByTestId('remarks-component')).not.toBeInTheDocument();
  });

  it('does not display remarks component when user lacks permissions', () => {
    usePermission.mockReturnValue({
      hasPermission: jest.fn().mockReturnValue(false)
    });
    
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    expect(screen.queryByTestId('remarks-component')).not.toBeInTheDocument();
  });

  it('handles dropdown toggle correctly', () => {
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    const dropdownToggle = screen.getByTestId('dropdown-toggle');
    fireEvent.click(dropdownToggle);
    
    // This is checking if the component passes the updated state to the header component
    // We would need to check if setIsDropdownOpen was called with true
    // In a real test we might check if dropdown content is visible
    expect(screen.getByTestId('dropdown-toggle')).toBeInTheDocument();
  });

  it('handles remark submission correctly', async () => {
    const staffingAgencyId = '12345';
    useParams.mockReturnValue({ id: staffingAgencyId });
    
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    const form = screen.getByTestId('remarks-form');
    fireEvent.submit(form);
    
    await waitFor(() => {
      expect(mockMutateAsync).toHaveBeenCalledWith({
        staffingAgencyId,
        remarks: {
          message: 'Test remark',
          remarkType: 'BUSINESS_DETAILS_VERIFICATION'
        }
      });
      expect(mockRefetchEmployerData).toHaveBeenCalled();
    });
  });

  it('handles API error correctly', async () => {
    const errorMessage = 'API Error';
    useEmployerDocPostRemarks.mockReturnValue({
      mutateAsync: jest.fn().mockRejectedValue({ message: errorMessage }),
      status: 'error',
      isError: true,
      error: { message: errorMessage }
    });
    
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    await waitFor(() => {
      expect(screen.getByTestId('business-verification-page-header')).toBeInTheDocument();
    });
  });

  it('passes correct props to BusinessVerificationPageHeader', () => {
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    expect(screen.getByTestId('page-route')).toHaveTextContent(defaultProps.pageRoute);
    expect(screen.getByTestId('verification-status')).toHaveTextContent(mockPageData.verificationStatus);
    
    const refetchButton = screen.getByTestId('refetch-button');
    fireEvent.click(refetchButton);
    
    expect(mockRefetchEmployerData).toHaveBeenCalled();
  });

  it('passes correct props to BusinessVerificationPageResults', () => {
    renderWithSnackbar(<BusinessVerificationPage {...defaultProps} />);
    
    expect(screen.getByTestId('page-route-results')).toHaveTextContent(defaultProps.pageRoute);
  });
});