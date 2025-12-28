import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomerReferalTab from '../../../components/customerDetails/CustomerReferalTab';
import useCustomerReferrerDetails from '../../../hooks/customer/useCustomerReferrerDetails';
import useCustomerReferralFilter from '../../../hooks/customer/useCustomerReferralFilter';

import { useNavigate, useSearchParams } from 'react-router-dom';

// Mock the hooks
jest.mock('../../../hooks/customer/useCustomerReferrerDetails');
jest.mock('../../../hooks/customer/useCustomerReferralFilter');
jest.mock('react-router-dom');

// Mock the lazy-loaded components
jest.mock('react', () => {
  const originalReact = jest.requireActual('react');
  return {
    ...originalReact,
    lazy: (importFn) => {
      const Component = (props) => {
        // Convert boolean props to proper attribute values
        const attributes = {};
        Object.entries(props).forEach(([key, value]) => {
          if (typeof value === 'boolean') {
            if (value) {
              attributes[key] = true;
            }
            // Skip false boolean values
          } else {
            attributes[key] = value;
          }
        });
        return (
          <div
            data-testid={props.tableId || 'lazy-component'}
            {...attributes}
          />
        );
      };
      return Component;
    },
    Suspense: ({ children }) => children,
  };
});

// Mock the non-lazy-loaded components
jest.mock(
  '../../../components/CustomCTA',
  () =>
    ({ onClick, title, showIcon }) => (
      <button data-testid={`cta-${title || 'icon-only'}`} onClick={onClick}>
        {title} {showIcon ? 'Icon' : ''}
      </button>
    ),
);

jest.mock(
  '../../../components/SearchFilter',
  () =>
    ({ searchArr, onKeyPress }) => (
      <div data-testid="search-filter">
        <input
          data-testid="search-input"
          placeholder={searchArr[0].placeHolder}
          onChange={(e) => searchArr[0].setInput(e.target.value)}
          onKeyPress={onKeyPress}
        />
      </div>
    ),
);

jest.mock('../../../components/common/BoxLoader', () => ({ size }) => (
  <div data-testid="box-loader" data-size={size}>
    Loading...
  </div>
));

// Constants for tests
const RUPEE_SYMBOL = '₹';
jest.mock('../../../constants/details', () => ({
  RUPEE_SYMBOL: '₹',
}));

jest.mock('../../../constants', () => ({
  DEVICE_TYPES: {
    MOBILE: 'mobile',
    DESKTOP: 'desktop',
  },
}));

jest.mock('../../../assets/icons', () => ({
  SEARCH_ICON: 'search-icon.svg',
  FILTER: 'filter-icon.svg',
}));

describe('CustomerReferalTab', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  // Test props
  const props = {
    userId: 'user123',
    deviceType: 'desktop',
    customerId: 'customer456',
  };

  // Mock hook return values
  const mockReferrerDetails = [
    {
      id: 1,
      name: 'John Doe',
      phone: '1234567890',
      level: 'Level 1',
      milestone: 'Milestone 1',
      organicReferralAmount: 100,
      bonusReferralAmount: 50,
    },
    {
      id: 2,
      name: 'Jane Smith',
      phone: '0987654321',
      level: 'Level 2',
      milestone: 'Milestone 2',
      organicReferralAmount: 200,
      bonusReferralAmount: 0,
    },
  ];

  const mockReferrerDetailsHook = {
    customerReferrerDetails: mockReferrerDetails,
    customerReferrerRows: [
      ['John Doe', '1234567890', 'Level 1'],
      ['Jane Smith', '0987654321', 'Level 2'],
    ],
    customerReferrerTableHeaders: ['Name', 'Phone', 'Level'],
    customerReferrerType: ['string', 'string', 'string'],
    errorCode: null,
    isCustomerReferralHistoryError: false,
    searchByRefereeNameOrPhone: jest.fn(),
    customerAmountEarned: '1000',
    customerWithdrawalAmount: '500',
    customerLinkedWalletEarning: '300',
    customerTotalWalletAmount: '800',
    customerAvailableBonusAmount: '200',
    customerTotalAmountWithdrawn: '200',
    setCustomerReferrerRows: jest.fn(),
    createData: (item) => [item.name, item.phone, item.level],
  };

  const mockFilterHook = {
    referralLevelCheckboxes: [
      { id: 'level1', label: 'Level 1', checked: false },
      { id: 'level2', label: 'Level 2', checked: false },
    ],
    handleReferralLeveCheckboxChange: jest.fn(),
    clearFilters: jest.fn(),
    handleApplyClick: jest.fn(),
    milestoneCheckboxes: [
      { id: 'milestone1', label: 'Milestone 1', checked: false },
      { id: 'milestone2', label: 'Milestone 2', checked: false },
    ],
    handleMilestoneCheckboxes: jest.fn(),
    filteredData: null,
  };

  // Setup mocks
  beforeEach(() => {
    jest.clearAllMocks();

    useCustomerReferrerDetails.mockReturnValue(mockReferrerDetailsHook);
    useCustomerReferralFilter.mockReturnValue(mockFilterHook);

    useSearchParams.mockReturnValue([new URLSearchParams(), jest.fn()]);
    useNavigate.mockReturnValue(jest.fn());
  });

  it('renders component correctly with data', () => {
    render(<CustomerReferalTab {...props} />);

    const walletTestCases = [
      { text: 'Total Amount Earned', value: `${RUPEE_SYMBOL} 1000` },
      {
        text: 'Total Amount Withdrawn',
        value: `${RUPEE_SYMBOL} 200`,
        index: 0,
      },
      {
        text: 'Available Bonus Amount',
        value: `${RUPEE_SYMBOL} 200`,
        index: 1,
      },
      { text: 'Wallet Balance', value: `${RUPEE_SYMBOL} 500` },
      { text: 'Linked Wallet Earnings', value: `${RUPEE_SYMBOL} 300` },
      { text: 'Total Balance to Withdraw', value: `${RUPEE_SYMBOL} 800` },
    ];

    walletTestCases.forEach(({ text, value, index }) => {
      if (index !== undefined) {
        expect(screen.getAllByText(value)[index]).toBeInTheDocument();
      } else {
        expect(screen.getByText(value)).toBeInTheDocument();
      }
      expect(screen.getByText(text)).toBeInTheDocument();
    });

    expect(screen.getByText('View Withdrawn History')).toBeInTheDocument();
    expect(screen.getByText('Referee List')).toBeInTheDocument();

    const expectedTestIds = [
      'search-filter',
      'search-input',
      'cta-Search',
      'cta-Filter (0)',
      'customerReferrerTable',
    ];
    expectedTestIds.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });

    expectedTestIds.forEach((testId) => {
      expect(screen.getByTestId(testId)).toBeInTheDocument();
    });
  });

  it('renders error message when customer is not eligible for referrals', () => {
    const errorProps = {
      ...mockReferrerDetailsHook,
      isCustomerReferralHistoryError: true,
      errorCode: 404,
    };

    useCustomerReferrerDetails.mockReturnValue(errorProps);

    render(<CustomerReferalTab {...props} />);

    expect(
      screen.getByText(
        /The customer hasn’t bought membership, so he isn’t eligible for referrals./i,
      ),
    ).toBeInTheDocument();
  });

  it('renders generic error message for other errors', () => {
    const errorProps = {
      ...mockReferrerDetailsHook,
      isCustomerReferralHistoryError: true,
      errorCode: 500,
    };

    useCustomerReferrerDetails.mockReturnValue(errorProps);

    render(<CustomerReferalTab {...props} />);

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  it('search functionality works correctly', () => {
    render(<CustomerReferalTab {...props} />);

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'John' },
    });

    fireEvent.click(screen.getByTestId('cta-Search'));

    expect(
      mockReferrerDetailsHook.searchByRefereeNameOrPhone,
    ).toHaveBeenCalledWith('John');
  });

  it('search also works with Enter key', () => {
    render(<CustomerReferalTab {...props} />);

    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'Jane' },
    });

    fireEvent.keyPress(screen.getByTestId('search-input'), {
      key: 'Enter',
      code: 13,
      charCode: 13,
    });

    expect(
      mockReferrerDetailsHook.searchByRefereeNameOrPhone,
    ).toHaveBeenCalledWith('Jane');
  });

  it('filter drawer opens when filter button is clicked', () => {
    render(<CustomerReferalTab {...props} />);

    fireEvent.click(screen.getByTestId('cta-Filter (0)'));

    expect(screen.getAllByTestId('lazy-component')[0]).toBeInTheDocument();
  });

  it('renders mobile version correctly', () => {
    const mobileProps = {
      ...props,
      deviceType: 'mobile',
    };

    render(<CustomerReferalTab {...mobileProps} />);

    expect(
      screen.queryByText('View Withdrawn History'),
    ).not.toBeInTheDocument();

    expect(screen.getByText('Icon')).toBeInTheDocument();
  });

  it('updates rows when filteredData changes', async () => {
    const filteredProps = {
      ...mockFilterHook,
      filteredData: [
        {
          name: 'Filtered User',
          phone: '5555555555',
          level: 'Level 3',
        },
      ],
    };

    useCustomerReferralFilter.mockReturnValue(filteredProps);

    render(<CustomerReferalTab {...props} />);

    await waitFor(() => {
      expect(
        mockReferrerDetailsHook.setCustomerReferrerRows,
      ).toHaveBeenCalledWith([['Filtered User', '5555555555', 'Level 3']]);
    });
  });
});
