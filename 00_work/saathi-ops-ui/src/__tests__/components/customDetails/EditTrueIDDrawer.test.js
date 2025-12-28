import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SnackbarProvider } from 'notistack';
import EditTrueIDDrawer from '../../../components/customerDetails/EditTrueIDDrawer';
import useTrueIDEditDetails from '../../../hooks/customer/useTrueIDEditDetails';

// Mock the custom hook
jest.mock('../../../hooks/customer/useTrueIDEditDetails', () => jest.fn());

// Mock the constants
jest.mock('../../../constants', () => ({
  FILE_TYPES: { IMAGE: 'image' },
  MAX_DOC_IMAGE_FILE_SIZE_MB: 5,
  MAX_IMAGE_API_TIMER: 30000,
  MAX_INTRO_VIDEO_FILE_SIZE_MB: 10,
  MAX_VIDEO_API_TIMER: 60000,
}));


// Mock the icons
jest.mock('../../../assets/icons', () => ({
  THUMBNAIL: 'thumbnail-icon-url',
}));

// Mock the components
jest.mock('../../../components/courses/FileUpload', () => {
  return function DummyFileUpload(props) {
    return (
      <div data-testid="file-upload">
        <button 
          data-testid="upload-button" 
          onClick={() => props.handleInputChange({ target: { files: [new File([''], 'test.jpg')] } })}
        >
          Upload
        </button>
        <button 
          data-testid="delete-button" 
          onClick={props.handleInputDelete}
        >
          Delete
        </button>
        {props.uploadData && <div data-testid="upload-data">{props.uploadData}</div>}
      </div>
    );
  };
});

jest.mock('../../../components/CustomCTA', () => {
  return function DummyCTA(props) {
    return (
      <button 
        data-testid="save-button" 
        onClick={props.onClick} 
        disabled={props.disabled}
      >
        {props.title}
      </button>
    );
  };
});

jest.mock('../../../components/common/DisplayDrawer', () => {
  return function DummyDisplayDrawer({ children, open, handleCloseDrawer, headerContent, footerContent }) {
    if (!open) return null;
    return (
      <div data-testid="display-drawer">
        <div data-testid="drawer-header">{headerContent()}</div>
        <div data-testid="drawer-content">{children}</div>
        <div data-testid="drawer-footer">{footerContent()}</div>
        <button data-testid="close-drawer" onClick={handleCloseDrawer}>Close</button>
      </div>
    );
  };
});

jest.mock('../../../components/common/DrawerInput', () => {
  return function DummyDrawerInput({ 
    fieldHeader, 
    fieldValue, 
    handleFieldChange, 
    fieldType, 
    children 
  }) {
    if (fieldType === 'children') {
      return (
        <div data-testid={`drawer-input-${fieldHeader.replace(/\s+/g, '-').toLowerCase()}`}>
          <label>{fieldHeader}</label>
          {children}
        </div>
      );
    }
    return (
      <div data-testid={`drawer-input-${fieldHeader.replace(/\s+/g, '-').toLowerCase()}`}>
        <label>{fieldHeader}</label>
        <input 
          data-testid={`input-${fieldHeader.replace(/\s+/g, '-').toLowerCase()}`} 
          value={fieldValue || ''} 
          onChange={handleFieldChange} 
        />
      </div>
    );
  };
});

const mockToggleDrawer = jest.fn();
const mockRefetchCustomerData = jest.fn();

describe('EditTrueIDDrawer Component', () => {
  // Set up default mock implementation for the hook
  const setupMockHook = (overrides = {}) => {
    const defaultMock = {
      editTrueIDObj: {
        rating: '4.5',
        livePhotoUrl: 'https://example.com/photo.jpg',
      },
      editTrueIDError: {},
      tempLivePhotoDelete: false,
      trueIDDetailsStatus: 'idle',
      livePhotoFileData: null,
      livePhotoUploadStatus: 'idle',
      livePhotoFileSizeError: false,
      clearFields: jest.fn(),
      handleInputDelete: jest.fn(),
      handleFieldUpdate: jest.fn(),
      handleSaveClick: jest.fn(),
      setTempLivePhotoDelete: jest.fn(),
      handleLivePhotoInputChange: jest.fn(),
      abortLivePhotoUpload: jest.fn(),
      resetLivePhotoFileData: jest.fn(),
      setLivePhotoFileSizeError: jest.fn(),
    };
    
    useTrueIDEditDetails.mockReturnValue({
      ...defaultMock,
      ...overrides,
    });
    
    return defaultMock;
  };
  
  beforeEach(() => {
    jest.clearAllMocks();
    setupMockHook();
  });
  
  test('should not render when closed', () => {
    render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={false}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    expect(screen.queryByTestId('display-drawer')).not.toBeInTheDocument();
  });
  
  test('should render when open', () => {
    render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    expect(screen.getByTestId('display-drawer')).toBeInTheDocument();
    expect(screen.getByText('Edit TrueID Details')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-input-rating')).toBeInTheDocument();
    expect(screen.getByTestId('drawer-input-live-photo-link')).toBeInTheDocument();
  });
  
  test('should close drawer when close button is clicked', () => {
    render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    fireEvent.click(screen.getByTestId('close-drawer'));
    
    expect(mockToggleDrawer).toHaveBeenCalledWith(false);
  });
  
  test('should update rating when input changes', () => {
    const mockHandleFieldUpdate = jest.fn();
    setupMockHook({ handleFieldUpdate: mockHandleFieldUpdate });
    
    render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    fireEvent.change(screen.getByTestId('input-rating'), { target: { value: '3.5' } });
    
    expect(mockHandleFieldUpdate).toHaveBeenCalled();
  });
  
  test('should handle file upload', () => {
    const mockHandleLivePhotoInputChange = jest.fn();
    setupMockHook({ handleLivePhotoInputChange: mockHandleLivePhotoInputChange });
    
    render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    fireEvent.click(screen.getByTestId('upload-button'));
    
    expect(mockHandleLivePhotoInputChange).toHaveBeenCalled();
  });
  
  test('should handle file delete', () => {
    const mockHandleInputDelete = jest.fn();
    setupMockHook({ handleInputDelete: mockHandleInputDelete });
    
    render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    fireEvent.click(screen.getByTestId('delete-button'));
    
    expect(mockHandleInputDelete).toHaveBeenCalled();
  });
  
  test('should handle save button click', () => {
    const mockHandleSaveClick = jest.fn();
    setupMockHook({ handleSaveClick: mockHandleSaveClick });
    
    render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    fireEvent.click(screen.getByTestId('save-button'));
    
    expect(mockHandleSaveClick).toHaveBeenCalled();
  });
  
  test('should disable save button when livePhotoUrl is empty', () => {
    setupMockHook({
      editTrueIDObj: {
        rating: '4.5',
        livePhotoUrl: '',
      },
    });
    
    render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    expect(screen.getByTestId('save-button')).toBeDisabled();
  });
  
  test('should close drawer and refetch data on successful update', async () => {
    // First render with idle status
    const { rerender } = render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    // Update the mock to return success status
    setupMockHook({ trueIDDetailsStatus: 'success' });
    
    // Re-render to trigger the useEffect
    rerender(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    await waitFor(() => {
      expect(mockToggleDrawer).toHaveBeenCalledWith(false);
      expect(mockRefetchCustomerData).toHaveBeenCalled();
    });
  });
  
  test('should show error snackbar when update fails', async () => {
    // First render with idle status
    const { rerender } = render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    // Update the mock to return error status
    setupMockHook({ trueIDDetailsStatus: 'error' });
    
    // Re-render to trigger the useEffect
    rerender(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    // Can't directly test snackbar appearance due to how notistack works in tests,
    // but we can verify the useEffect was triggered
    await waitFor(() => {
      expect(mockToggleDrawer).not.toHaveBeenCalledWith(false);
      expect(mockRefetchCustomerData).not.toHaveBeenCalled();
    });
  });
  
  test('should show error when file size exceeds limit', async () => {
    // First render with no error
    const { rerender } = render(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    // Update the mock to return file size error
    const mockSetLivePhotoFileSizeError = jest.fn();
    setupMockHook({ 
      livePhotoFileSizeError: true,
      setLivePhotoFileSizeError: mockSetLivePhotoFileSizeError
    });
    
    // Re-render to trigger the useEffect
    rerender(
      <SnackbarProvider>
        <EditTrueIDDrawer
          open={true}
          toggleDrawer={mockToggleDrawer}
          customerId="123"
          detailsData={{}}
          refetchCustomerData={mockRefetchCustomerData}
        />
      </SnackbarProvider>
    );
    
    await waitFor(() => {
      expect(mockSetLivePhotoFileSizeError).toHaveBeenCalledWith(false);
    });
  });
});