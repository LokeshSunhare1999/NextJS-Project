import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerPaymentDetailsTab from '../../../components/customerDetails/CustomerPaymentDetailsTab';
import useCustomerPayments from '../../../hooks/customer/useCustomerPayments';

// Mock the dependencies
jest.mock('../../../hooks/customer/useCustomerPayments');
jest.mock('../../../components/common/BoxLoader', () => ({ size }) => <div data-testid="box-loader" data-size={size}>Loading...</div>);

jest.mock('../../../components/DisplayTable', () => {
  return function MockDisplayTable({ tableId, rows, headers, headersType, tableWidth, customProps }) {
    return (
      <div data-testid="display-table" data-tableid={tableId}>
        <div data-testid="rows">{JSON.stringify(rows)}</div>
        <div data-testid="headers">{JSON.stringify(headers)}</div>
        <div data-testid="headers-type">{JSON.stringify(headersType)}</div>
        <div data-testid="table-width">{tableWidth}</div>
        <div data-testid="custom-props">{JSON.stringify(customProps)}</div>
      </div>
    );
  };
});
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    lazy: jest.fn((importFn) => {
      const MockDisplayTable = jest.requireMock('../../../components/DisplayTable');
      return MockDisplayTable;
    }),
    Suspense: ({ children, fallback }) => children,
  };
});

describe('CustomerPaymentDetailsTab', () => {
  jest.spyOn(console, 'error').mockImplementation(() => { });
  const mockUserId = 'user123';

  const setupMockData = (withData = true) => {
    if (withData) {
      useCustomerPayments.mockReturnValue({
        customerPayments: [{ id: 1, amount: 100 }, { id: 2, amount: 200 }],
        customerPaymentHeaders: [
          { name: 'ID', type: 'number' },
          { name: 'Amount', type: 'currency' }
        ],
        customerPaymentTableHeaders: ['ID', 'Amount'],
        customerPaymentKeys: ['id', 'amount'],
        customerPaymentRows: [
          [1, 100],
          [2, 200]
        ]
      });
    } else {
      useCustomerPayments.mockReturnValue({
        customerPaymentHeaders: [],
        customerPaymentTableHeaders: [],
        customerPaymentKeys: [],
        customerPaymentRows: []
      });
    }
  };

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the loader when no data is available', () => {
    setupMockData(false);
    render(<CustomerPaymentDetailsTab userId={mockUserId} />);

    const loader = screen.getByTestId('box-loader');
    expect(loader).toBeInTheDocument();
    expect(loader).toHaveAttribute('data-size', '5');
  });

  it('renders the DisplayTable when data is available', async () => {
    setupMockData(true);
    render(<CustomerPaymentDetailsTab userId={mockUserId} />);

    await waitFor(() => {
      const table = screen.getByTestId('display-table');
      expect(table).toBeInTheDocument();
      expect(table).toHaveAttribute('data-tableid', 'customerPaymentDetails');

      const testCases = [
        { testId: 'rows', expectedValue: '[[1,100],[2,200]]' },
        { testId: 'headers', expectedValue: '["ID","Amount"]' },
        { testId: 'headers-type', expectedValue: '["number","currency"]' },
        { testId: 'table-width', expectedValue: '100%' },
        { testId: 'custom-props', expectedValue: '{"paymentType":"incoming"}' },
      ];

      testCases.forEach(({ testId, expectedValue }) => {
        const element = screen.getByTestId(testId);
        expect(element).toHaveTextContent(expectedValue);
      });
    });
  });

  it('calls useCustomerPayments with the correct userId', () => {
    setupMockData(true);
    render(<CustomerPaymentDetailsTab userId={mockUserId} />);

    expect(useCustomerPayments).toHaveBeenCalledWith(mockUserId);
  });
});
