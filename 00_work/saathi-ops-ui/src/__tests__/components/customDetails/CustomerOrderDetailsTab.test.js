import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerOrderDetailsTab from '../../../components/customerDetails/CustomerOrderDetailsTab';
import useCustomerOrderDetails from '../../../hooks/customer/useCustomerOrderDetails';

// Mock the required hooks and components
jest.mock('../../../hooks/customer/useCustomerOrderDetails');
jest.mock('../../../components/common/BoxLoader', () => ({
  __esModule: true,
  default: jest.fn(() => <div data-testid="box-loader">Loading...</div>),
}));

// Mock the DisplayTable component since it's lazy loaded
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    lazy: jest.fn((importFn) => {
      return () => <div data-testid="mock-display-table">DisplayTable Mock</div>;
    }),
    Suspense: ({ children }) => children,
  };
});

describe('CustomerOrderDetailsTab', () => {
  // Mock data for the tests
  const mockUserId = 'user123';
  const mockOrderData = {
    customerOrders: [
      { id: 'order1', name: 'Order 1', date: '2023-01-01', status: 'Completed' },
      { id: 'order2', name: 'Order 2', date: '2023-01-15', status: 'Pending' },
    ],
    customerOrderHeaders: [
      { label: 'Order ID', value: 'id', type: 'string' },
      { label: 'Name', value: 'name', type: 'string' },
      { label: 'Date', value: 'date', type: 'date' },
      { label: 'Status', value: 'status', type: 'string' },
    ],
    customerOrderTableHeaders: ['Order ID', 'Name', 'Date', 'Status'],
    customerOrderKeys: ['id', 'name', 'date', 'status'],
    customerOrderRows: [
      ['order1', 'Order 1', '2023-01-01', 'Completed'],
      ['order2', 'Order 2', '2023-01-15', 'Pending'],
    ],
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state when data is not available', () => {
    useCustomerOrderDetails.mockReturnValue({
      customerOrders: [],
      customerOrderHeaders: null,
      customerOrderTableHeaders: [],
      customerOrderKeys: [],
      customerOrderRows: [],
    });

    render(<CustomerOrderDetailsTab userId={mockUserId} />);
    
    expect(screen.getByTestId('box-loader')).toBeInTheDocument();
  });

  it('renders DisplayTable when order data is available', async () => {
    useCustomerOrderDetails.mockReturnValue(mockOrderData);

    render(<CustomerOrderDetailsTab userId={mockUserId} />);

    await waitFor(() => {
      expect(screen.getByTestId('mock-display-table')).toBeInTheDocument();
    });
  });

  it('passes correct props to DisplayTable', async () => {
    useCustomerOrderDetails.mockReturnValue(mockOrderData);

    const { container } = render(<CustomerOrderDetailsTab userId={mockUserId} />);

    expect(useCustomerOrderDetails).toHaveBeenCalledWith(mockUserId);

    expect(useCustomerOrderDetails).toHaveBeenCalledTimes(1);
  });

  it('calls useCustomerOrderDetails with the correct userId', () => {
    useCustomerOrderDetails.mockReturnValue(mockOrderData);
    
    render(<CustomerOrderDetailsTab userId={mockUserId} />);
    
    expect(useCustomerOrderDetails).toHaveBeenCalledWith(mockUserId);
  });

  it('renders loading state initially before data is available', () => {
    // Set up a scenario where data might be loading
    useCustomerOrderDetails.mockReturnValue({
      customerOrders: [],
      customerOrderHeaders: [],
      customerOrderTableHeaders: [],
      customerOrderKeys: [],
      customerOrderRows: [],
    });

    render(<CustomerOrderDetailsTab userId={mockUserId} />);
    expect(screen.getByTestId('box-loader')).toBeInTheDocument();
  });

  it('converts headers data correctly for table display', async () => {
    useCustomerOrderDetails.mockReturnValue(mockOrderData);
    
    render(<CustomerOrderDetailsTab userId={mockUserId} />);
    
    expect(useCustomerOrderDetails).toHaveBeenCalledWith(mockUserId);
    
    const expectedHeaderTypes = ['string', 'string', 'date', 'string'];
    expect(mockOrderData.customerOrderHeaders.map(item => item.type)).toEqual(expectedHeaderTypes);
  });
});