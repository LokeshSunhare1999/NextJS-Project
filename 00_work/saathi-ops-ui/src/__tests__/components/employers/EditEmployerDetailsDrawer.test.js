import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditEmployerDetailsDrawer from '../../../components/employers/EditEmployerDetailsDrawer';
import { COMPANY_SIZE_MAX_LIMIT, EMPLOYER_DEFAULT_MIN } from '../../../constants/employer';
import { QUERY_KEYS } from '../../../apis/queryKeys';

// Mock dependencies
jest.mock('../../../components/common/DisplayDrawer', () => ({ 
  open, 
  handleCloseDrawer, 
  zIndex, 
  headerContent, 
  footerContent, 
  children 
}) => (
  <div data-testid="display-drawer" aria-hidden={!open}>
    <div data-testid="header">{headerContent()}</div>
    <div data-testid="content">{children}</div>
    <div data-testid="footer">{footerContent()}</div>
    <button data-testid="close-button" onClick={handleCloseDrawer}>Close</button>
  </div>
));

jest.mock('../../../components/common/DrawerInput', () => ({ 
  fieldType, 
  fieldHeader, 
  fieldError, 
  fieldPlaceholder, 
  fieldValue, 
  handleFieldChange, 
  isManadatory, 
  errorText,
  handleDropDownSelect,
  dropDownOpen,
  handleDropDownOpen,
  dropDownList 
}) => {
  if (fieldType === 'dropdown') {
    return (
      <div data-testid="drawer-dropdown">
        <label>{fieldHeader} {isManadatory && '*'}</label>
        <div 
          data-testid="dropdown-field" 
          onClick={() => handleDropDownOpen(!dropDownOpen)}
        >
          {fieldValue}
        </div>
        {dropDownOpen && (
          <ul data-testid="dropdown-list">
            {dropDownList?.map((item, index) => (
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
        {fieldError && <span data-testid="error-text">{errorText}</span>}
      </div>
    );
  }
  
  return (
    <div data-testid={`drawer-input-${fieldHeader.toLowerCase().replace(/\s/g, '-')}`}>
      <label>{fieldHeader} {isManadatory && '*'}</label>
      <input 
        type={fieldType} 
        placeholder={fieldPlaceholder} 
        value={fieldValue} 
        onChange={handleFieldChange}
        data-testid={`input-${fieldHeader.toLowerCase().replace(/\s/g, '-')}`}
      />
      {fieldError && <span data-testid="error-text">{errorText}</span>}
    </div>
  );
});

jest.mock('../../../components/CustomCTA', () => ({ 
  onClick, 
  title, 
  color, 
  bgColor, 
  border, 
  disabled 
}) => (
  <button 
    onClick={onClick} 
    disabled={disabled} 
    data-testid="save-button"
    style={{ color, backgroundColor: bgColor, border }}
  >
    {title}
  </button>
));

// Mock the queryClient and notistack
jest.mock('@tanstack/react-query', () => ({
  useQueryClient: jest.fn(),
}));

jest.mock('notistack', () => ({
  useSnackbar: jest.fn(),
}));

// Mock API functions
jest.mock('../../../apis/queryFunctions', () => ({
  handleGetEarnings: jest.fn(),
}));

describe('EditEmployerDetailsDrawer Component', () => {
  const mockToggleDrawer = jest.fn();
  const mockHandleUpdateEmployerDetails = jest.fn();
  const mockSetEditAccObj = jest.fn();
  const mockSetEditAccErr = jest.fn();
  const mockEnqueueSnackbar = jest.fn();
  const mockFetchQuery = jest.fn();

  const mockEmployeeBasicDetail = {
    companyName: 'Test Company',
    companySize: '100',
    companyType: 'Private Limited',
    brandName: 'Test Brand'
  };

  const defaultProps = {
    open: true,
    toggleDrawer: mockToggleDrawer,
    handleUpdateEmployerDetails: mockHandleUpdateEmployerDetails,
    employeeBasicDetail: mockEmployeeBasicDetail,
    updateEmployerStatusStatus: 'idle',
    editAccObj: {
      companyName: 'Test Company',
      companySize: '100',
      companyType: 'Private Limited',
      brandName: 'Test Brand'
    },
    setEditAccObj: mockSetEditAccObj,
    editAccErr: {},
    setEditAccErr: mockSetEditAccErr
  };

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Setup mocks
    require('@tanstack/react-query').useQueryClient.mockReturnValue({
      fetchQuery: mockFetchQuery
    });
    
    require('notistack').useSnackbar.mockReturnValue({
      enqueueSnackbar: mockEnqueueSnackbar
    });
    
    // Setup successful API response
    mockFetchQuery.mockResolvedValue({
      weeklyEarnings: [null, null, null, 500] // Index 3 contains the value we need
    });
  });

  it('renders the component when open', () => {
    render(<EditEmployerDetailsDrawer {...defaultProps} />);
    
    expect(screen.getByTestId('display-drawer')).toBeInTheDocument();
    expect(screen.getByTestId('header')).toHaveTextContent('Edit Employer Details');
    expect(screen.getByTestId('drawer-input-company-name')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-input-company-size')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-input-brand-name')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-dropdown')).toBeInTheDocument();
    expect(screen.getByTestId('save-button')).toBeInTheDocument();
  });

  it('initializes form data from employeeBasicDetail when drawer opens', () => {
    render(<EditEmployerDetailsDrawer {...defaultProps} />);
    
    expect(mockSetEditAccObj).toHaveBeenCalledWith({
      companyName: 'Test Company',
      companySize: '100',
      companyType: 'Private Limited',
      brandName: 'Test Brand'
    });
  });

  it('handles empty brandName correctly when it is "-----"', () => {
    const props = {
      ...defaultProps,
      employeeBasicDetail: {
        ...mockEmployeeBasicDetail,
        brandName: '-----'
      }
    };
    
    render(<EditEmployerDetailsDrawer {...props} />);
    
    expect(mockSetEditAccObj).toHaveBeenCalledWith({
      companyName: 'Test Company',
      companySize: '100',
      companyType: 'Private Limited',
      brandName: ''
    });
  });

  it('updates companyName field correctly', () => {
    render(<EditEmployerDetailsDrawer {...defaultProps} />);
    
    const input = screen.getByTestId('input-company-name');
    fireEvent.change(input, { target: { value: 'New Company Name' } });
    
    expect(mockSetEditAccObj).toHaveBeenCalledWith({
      ...defaultProps.editAccObj,
      companyName: 'New Company Name'
    });
  });

  it('updates companySize field correctly', () => {
    render(<EditEmployerDetailsDrawer {...defaultProps} />);
    
    const input = screen.getByTestId('input-company-size');
    fireEvent.change(input, { target: { value: '200' } });
    
    expect(mockSetEditAccObj).toHaveBeenCalledWith({
      ...defaultProps.editAccObj,
      companySize: '200'
    });
  });

  it('updates brandName field correctly', () => {
    render(<EditEmployerDetailsDrawer {...defaultProps} />);
    
    const input = screen.getByTestId('input-brand-name');
    fireEvent.change(input, { target: { value: 'New Brand Name' } });
    
    expect(mockSetEditAccObj).toHaveBeenCalledWith({
      ...defaultProps.editAccObj,
      brandName: 'New Brand Name'
    });
  });

  it('validates form fields and shows errors for empty companyName', async () => {
    const props = {
      ...defaultProps,
      editAccObj: {
        ...defaultProps.editAccObj,
        companyName: ''
      }
    };
    
    render(<EditEmployerDetailsDrawer {...props} />);
    
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockSetEditAccErr).toHaveBeenCalledWith(expect.objectContaining({
        companyName: true
      }));
    });
    
    expect(mockFetchQuery).not.toHaveBeenCalled();
  });

  it('validates form fields and shows errors for invalid companySize', async () => {
    const props = {
      ...defaultProps,
      editAccObj: {
        ...defaultProps.editAccObj,
        companySize: 'abc' // Non-numeric
      }
    };
    
    render(<EditEmployerDetailsDrawer {...props} />);
    
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockSetEditAccErr).toHaveBeenCalledWith(expect.objectContaining({
        companySize: true
      }));
    });
    
    expect(mockFetchQuery).not.toHaveBeenCalled();
  });

  it('validates form fields and shows errors for out-of-range companySize', async () => {
    const props = {
      ...defaultProps,
      editAccObj: {
        ...defaultProps.editAccObj,
        companySize: (COMPANY_SIZE_MAX_LIMIT + 1).toString() // Exceeds maximum
      }
    };
    
    render(<EditEmployerDetailsDrawer {...props} />);
    
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockSetEditAccErr).toHaveBeenCalledWith(expect.objectContaining({
        companySize: true
      }));
    });
    
    expect(mockFetchQuery).not.toHaveBeenCalled();
  });

  it('fetches earnings data and calls update function when form is valid', async () => {
    const props = {
      ...defaultProps,
      editAccObj: {
        companyName: 'Valid Company',
        companySize: '150', // Valid size
        companyType: 'Private Limited',
        brandName: 'Valid Brand'
      }
    };
    
    render(<EditEmployerDetailsDrawer {...props} />);
    
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockFetchQuery).toHaveBeenCalledWith({
        queryKey: [QUERY_KEYS.GET_EARNINGS],
        queryFn: expect.any(Function)
      });
    });
    
    expect(mockHandleUpdateEmployerDetails).toHaveBeenCalledWith(500);
  });

  it('handles API errors gracefully', async () => {
    // Setup API to throw an error
    mockFetchQuery.mockRejectedValue(new Error('API error'));
    
    const props = {
      ...defaultProps,
      editAccObj: {
        companyName: 'Valid Company',
        companySize: '150', // Valid size
        companyType: 'Private Limited',
        brandName: 'Valid Brand'
      }
    };
    
    render(<EditEmployerDetailsDrawer {...props} />);
    
    const saveButton = screen.getByTestId('save-button');
    fireEvent.click(saveButton);
    
    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Error in fetching potential earnings',
        expect.objectContaining({ variant: 'error' })
      );
    });
    
    expect(mockHandleUpdateEmployerDetails).not.toHaveBeenCalled();
  });

  it('disables save button when update is in progress', () => {
    const props = {
      ...defaultProps,
      updateEmployerStatusStatus: 'pending'
    };
    
    render(<EditEmployerDetailsDrawer {...props} />);
    
    const saveButton = screen.getByTestId('save-button');
    expect(saveButton).toBeDisabled();
  });

  it('closes drawer and resets error state when close button is clicked', () => {
    render(<EditEmployerDetailsDrawer {...defaultProps} />);
    
    const closeButton = screen.getByTestId('close-button');
    fireEvent.click(closeButton);
    
    expect(mockToggleDrawer).toHaveBeenCalledWith(false);
    expect(mockSetEditAccErr).toHaveBeenCalled();
  });
});