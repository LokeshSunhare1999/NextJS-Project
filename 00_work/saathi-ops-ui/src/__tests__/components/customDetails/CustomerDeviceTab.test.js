import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import '@testing-library/jest-dom';
import CustomerDeviceTab from '../../../components/customerDetails/CustomerDeviceTab';
import useCustomerDeviceInfo from '../../../hooks/customer/useCustomerDeviceInfo';
import usePermission from '../../../hooks/usePermission';
import { usePutCustomerUnblockStatus } from '../../../apis/queryHooks';

// Mock the required hooks and modules
jest.mock('../../../hooks/customer/useCustomerDeviceInfo');
jest.mock('../../../hooks/usePermission');
jest.mock('../../../apis/queryHooks');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

// Mock the lazy-loaded component
jest.mock('react', () => ({
  ...jest.requireActual('react'),
  lazy: jest.fn().mockImplementation(() => () => <div data-testid="mock-display-table" />),
  Suspense: ({ children }) => children,
}));

describe('CustomerDeviceTab', () => {
  const mockUserId = 'user123';
  const mockDevices = [
    { macAddress: 'mac1', deviceName: 'Device 1' },
    { macAddress: 'mac2', deviceName: 'Device 2' },
  ];
  
  const mockCustomerDeviceInfo = {
    customerDevices: mockDevices,
    customerDeviceHeaders: ['Device Name', 'MAC Address'],
    customerDeviceHeadersType: ['string', 'string'],
    customerDeviceTableHeaders: ['deviceName', 'macAddress'],
    customerDeviceRows: [
      { deviceName: 'Device 1', macAddress: 'mac1' },
      { deviceName: 'Device 2', macAddress: 'mac2' },
    ],
    isCustomerBlocked: false,
    customerPhoneNo: '1234567890',
    customerDeviceRefetch: jest.fn(),
  };

  const mockUnblockMutate = jest.fn().mockResolvedValue({});

  beforeEach(() => {
    useCustomerDeviceInfo.mockReturnValue(mockCustomerDeviceInfo);
    usePermission.mockReturnValue({ hasPermission: jest.fn().mockReturnValue(true) });
    usePutCustomerUnblockStatus.mockReturnValue({
      mutateAsync: mockUnblockMutate,
      status: 'idle',
      error: null,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderComponent = () => {
    return render(
      <SnackbarProvider>
        <MemoryRouter>
          <CustomerDeviceTab userId={mockUserId} />
        </MemoryRouter>
      </SnackbarProvider>
    );
  };

  it('renders component with correct device count', () => {
    renderComponent();
    expect(screen.getByText('Logged In Devices: 2')).toBeInTheDocument();
  });

  it('renders unblock button', () => {
    renderComponent();
    expect(screen.getByText('Unblock Number')).toBeInTheDocument();
  });

  it('unblock button should be disabled when customer is not blocked', () => {
    renderComponent();
    const unblockButton = screen.getByText('Unblock Number');
    expect(unblockButton.closest('button')).toHaveAttribute('disabled');
  });

  it('unblock button should be enabled when customer is blocked', () => {
    useCustomerDeviceInfo.mockReturnValue({
      ...mockCustomerDeviceInfo,
      isCustomerBlocked: true,
    });
    
    renderComponent();
    const unblockButton = screen.getByText('Unblock Number');
    expect(unblockButton.closest('button')).not.toHaveAttribute('disabled');
  });

  it('calls updateCustomerUnblock with correct data when unblock button is clicked', async () => {
    useCustomerDeviceInfo.mockReturnValue({
      ...mockCustomerDeviceInfo,
      isCustomerBlocked: true,
    });
    
    renderComponent();
    const unblockButton = screen.getByText('Unblock Number');
    fireEvent.click(unblockButton);
    
    expect(mockUnblockMutate).toHaveBeenCalledWith({
      phoneNo: '1234567890',
      isUserBlocked: false,
    });
    
    await waitFor(() => {
      expect(mockCustomerDeviceInfo.customerDeviceRefetch).toHaveBeenCalled();
    });
  });

  it('renders pagination component', () => {
    renderComponent();
    // to check the pagination component is rendered check its elements
    expect(screen.getByRole('button', { name: /prev/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument();
  });

  it('renders empty state with BoxLoader when no device headers', () => {
    useCustomerDeviceInfo.mockReturnValue({
      ...mockCustomerDeviceInfo,
      customerDeviceHeaders: [],
    });
    
    renderComponent();
    // Since BoxLoader doesn't have a specific test marker in the component,
    // we're checking if DisplayTable is not rendered
    expect(screen.queryByTestId('mock-display-table')).not.toBeInTheDocument();
  });

  it('shows error snackbar when update fails', async () => {
    useCustomerDeviceInfo.mockReturnValue({
      ...mockCustomerDeviceInfo,
      isCustomerBlocked: true,
    });
    
    usePutCustomerUnblockStatus.mockReturnValue({
      mutateAsync: mockUnblockMutate,
      status: 'error',
      error: new Error('Update failed'),
    });
    
    renderComponent();
    
    await waitFor(() => {
      // we checking for the snackbar content
      expect(screen.queryByText('Failed to unblock customer mobile number')).toBeInTheDocument();
    });
  });
});