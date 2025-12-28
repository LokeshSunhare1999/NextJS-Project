import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import '@testing-library/jest-dom';
import CustomerDetailsTabs from '../../../components/customerDetails/CustomerDetailsTabs';
import * as usePermissionModule from '../../../hooks/usePermission';
import { DEVICE_TYPES } from '../../../constants';
import {
  CUSTOMER_DETAILS_PERMISSIONS,
  CUSTOMER_PERMISSIONS,
} from '../../../constants/permissions';

// Mock the lazy-loaded components
jest.mock('../../../components/customerDetails/CustomerInfoTab', () => () => (
  <div data-testid="customer-info-tab">Customer Info Tab</div>
));
jest.mock(
  '../../../components/customerDetails/CustomerPaymentDetailsTab',
  () => () => (
    <div data-testid="customer-payment-details-tab">Payment Details Tab</div>
  ),
);
jest.mock(
  '../../../components/customerDetails/CustomerCoursesDetailsTab',
  () => () => (
    <div data-testid="customer-courses-details-tab">Courses Details Tab</div>
  ),
);
jest.mock(
  '../../../components/customerDetails/CustomerOrderDetailsTab',
  () => () => (
    <div data-testid="customer-order-details-tab">Order Details Tab</div>
  ),
);
jest.mock(
  '../../../components/customerDetails/CustomerReferalTab',
  () => () => <div data-testid="customer-referal-tab">Referal Tab</div>,
);
jest.mock('../../../components/customerDetails/CustomerDeviceTab', () => () => (
  <div data-testid="customer-device-tab">Device Tab</div>
));
jest.mock(
  '../../../components/customerDetails/CustomerApplicationsTab',
  () => () => (
    <div data-testid="customer-applications-tab">Applications Tab</div>
  ),
);
jest.mock('../../../components/common/BoxLoader', () => () => (
  <div data-testid="skeleton-loader">Loading...</div>
));

// Mock constants
jest.mock('../../../constants', () => ({
  CUSTOMER_MODULE: {
    CUSTOMER_TAB_HEADERS: [
      'TrueID',
      'Applications',
      'Payment',
      'Orders',
      'Courses',
      'Referral',
      'Devices',
    ],
  },
  DEVICE_TYPES: {
    DESKTOP: 'desktop',
    MOBILE: 'mobile',
  },
  CUSTOMERS_TAB_MAP: {
    trueid: 0,
    applications: 1,
    payment: 2,
    orders: 3,
    courses: 4,
    referral: 5,
    devices: 6,
  },
}));

// Mock the usePermission hook
jest.mock('../../../hooks/usePermission', () => ({
  __esModule: true,
  default: jest.fn(),
}));

describe('CustomerDetailsTabs', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});
  const mockUserData = {
    _id: 'customer123',
    userId: 'user123',
    name: 'John Doe',
  };

  const mockNavigate = jest.fn();

  beforeEach(() => {
    mockNavigate.mockClear();

    // Mock useNavigate and useParams
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: () => mockNavigate,
      useParams: () => ({ id: 'customer123' }),
      useSearchParams: () => [
        new URLSearchParams({ tab: 'trueid' }),
        jest.fn(),
      ],
    }));

    // Mock all permissions to be true by default
    jest.spyOn(usePermissionModule, 'default').mockImplementation(() => ({
      hasPermission: (permission) => true,
    }));
  });

  const renderWithRouter = (
    ui,
    { route = '/customers/customer123?tab=trueid' } = {},
  ) => {
    window.history.pushState({}, 'Test page', route);
    return render(
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route path="/customers/:id" element={ui} />
        </Routes>
      </MemoryRouter>,
    );
  };

  it('shows suspense loader while tab content is loading', async () => {
    const neverResolve = new Promise(() => {});
    // Mock React.lazy to return a component that always suspends
    React.lazy = jest.fn().mockImplementation(() => {
      const SuspendingComponent = () => {
        throw neverResolve;
      };
      return SuspendingComponent;
    });

    renderWithRouter(
      <CustomerDetailsTabs
        userData={mockUserData}
        userDataLoading={false}
        isUserDataError={false}
        setPageRoute={jest.fn()}
        setWorkExpIndex={jest.fn()}
        setShowVerificationPage={jest.fn()}
        setShowWorkExperiencePage={jest.fn()}
        refetchCustomerData={jest.fn()}
        deviceType={DEVICE_TYPES.DESKTOP}
      />,
    );

    // The Suspense fallback should be rendered, which contains the skeleton-loader
    expect(screen.getByTestId('skeleton-loader')).toBeInTheDocument();
  });

  it('renders desktop view with all tabs when all permissions are granted', async () => {
    renderWithRouter(
      <CustomerDetailsTabs
        userData={mockUserData}
        userDataLoading={false}
        isUserDataError={false}
        setPageRoute={jest.fn()}
        setWorkExpIndex={jest.fn()}
        setShowVerificationPage={jest.fn()}
        setShowWorkExperiencePage={jest.fn()}
        refetchCustomerData={jest.fn()}
        deviceType={DEVICE_TYPES.DESKTOP}
      />,
    );

    const expectedTabs = [
      'TrueID',
      'Applications',
      'Payment',
      'Orders',
      'Courses',
      'Referral',
      'Devices',
    ];
    // Check if all tabs are rendered
    expectedTabs.forEach((tab) => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });

    // Check if default tab content is loaded
    await waitFor(() => {
      expect(screen.getByTestId('customer-info-tab')).toBeInTheDocument();
    });
  });

  it('renders mobile view without tabs', async () => {
    renderWithRouter(
      <CustomerDetailsTabs
        userData={mockUserData}
        userDataLoading={false}
        isUserDataError={false}
        setPageRoute={jest.fn()}
        setWorkExpIndex={jest.fn()}
        setShowVerificationPage={jest.fn()}
        setShowWorkExperiencePage={jest.fn()}
        refetchCustomerData={jest.fn()}
        deviceType={DEVICE_TYPES.MOBILE}
      />,
    );

    // No tabs should be visible on mobile
    expect(screen.queryByText('TrueID')).not.toBeInTheDocument();

    // Should default to Referral tab on mobile (index 4)
    await waitFor(() => {
      expect(screen.getByTestId('customer-referal-tab')).toBeInTheDocument();
    });
  });

  it('filters tabs based on permissions', async () => {
    // Mock specific permissions
    jest.spyOn(usePermissionModule, 'default').mockImplementation(() => ({
      hasPermission: (permission) => {
        // Only allow TrueID and Orders tabs
        return (
          permission === CUSTOMER_DETAILS_PERMISSIONS.VIEW_BASIC_DETAILS ||
          permission === CUSTOMER_PERMISSIONS.VIEW_ORDER_DETAILS
        );
      },
    }));

    renderWithRouter(
      <CustomerDetailsTabs
        userData={mockUserData}
        userDataLoading={false}
        isUserDataError={false}
        setPageRoute={jest.fn()}
        setWorkExpIndex={jest.fn()}
        setShowVerificationPage={jest.fn()}
        setShowWorkExperiencePage={jest.fn()}
        refetchCustomerData={jest.fn()}
        deviceType={DEVICE_TYPES.DESKTOP}
      />,
    );

    // Expected visible tabs
    const visibleTabs = ['TrueID', 'Orders', 'Applications'];
    visibleTabs.forEach((tab) => {
      expect(screen.getByText(tab)).toBeInTheDocument();
    });

    // Expected hidden tabs
    const hiddenTabs = ['Payment', 'Courses', 'Referral', 'Devices'];
    hiddenTabs.forEach((tab) => {
      expect(screen.queryByText(tab)).not.toBeInTheDocument();
    });
  });

  it('shows correct tab based on URL search params', async () => {
    window.history.pushState(
      {},
      'Test page',
      '/customers/customer123?tab=orders',
    );
    render(
      <MemoryRouter initialEntries={['/customers/customer123?tab=orders']}>
        <Routes>
          <Route
            path="/customers/:id"
            element={
              <CustomerDetailsTabs
                userData={mockUserData}
                userDataLoading={false}
                isUserDataError={false}
                setPageRoute={jest.fn()}
                setWorkExpIndex={jest.fn()}
                setShowVerificationPage={jest.fn()}
                setShowWorkExperiencePage={jest.fn()}
                refetchCustomerData={jest.fn()}
                deviceType={DEVICE_TYPES.DESKTOP}
              />
            }
          />
        </Routes>
      </MemoryRouter>,
    );

    // The Orders tab should be active and its content should be visible
    await waitFor(() => {
      expect(
        screen.getByTestId('customer-order-details-tab'),
      ).toBeInTheDocument();
    });
  });

  it('shows nothing when there is a user data error', () => {
    renderWithRouter(
      <CustomerDetailsTabs
        userData={mockUserData}
        userDataLoading={false}
        isUserDataError={true}
        setPageRoute={jest.fn()}
        setWorkExpIndex={jest.fn()}
        setShowVerificationPage={jest.fn()}
        setShowWorkExperiencePage={jest.fn()}
        refetchCustomerData={jest.fn()}
        deviceType={DEVICE_TYPES.DESKTOP}
      />,
    );
    const expectedTabs = ['TrueID', 'Payment', 'Orders'];
    expectedTabs.forEach((tab) => {
      expect(screen.queryByText(tab)).not.toBeInTheDocument();
    });
  });

  it('passes correct props to tab components', async () => {
    const mockSetPageRoute = jest.fn();
    const mockSetWorkExpIndex = jest.fn();
    const mockSetShowVerificationPage = jest.fn();
    const mockSetShowWorkExperiencePage = jest.fn();
    const mockRefetchCustomerData = jest.fn();

    // Mock the CustomerInfoTab to verify props
    jest.mock('../../../components/customerDetails/CustomerInfoTab', () => {
      return jest.fn((props) => {
        expect(props.userInfo).toBe(mockUserData);
        expect(props.setPageRoute).toBe(mockSetPageRoute);
        expect(props.setWorkExpIndex).toBe(mockSetWorkExpIndex);
        expect(props.setShowVerificationPage).toBe(mockSetShowVerificationPage);
        expect(props.setShowWorkExperiencePage).toBe(
          mockSetShowWorkExperiencePage,
        );
        expect(props.refetchCustomerData).toBe(mockRefetchCustomerData);
        return <div data-testid="customer-info-tab">Customer Info Tab</div>;
      });
    });

    renderWithRouter(
      <CustomerDetailsTabs
        userData={mockUserData}
        userDataLoading={false}
        isUserDataError={false}
        setPageRoute={mockSetPageRoute}
        setWorkExpIndex={mockSetWorkExpIndex}
        setShowVerificationPage={mockSetShowVerificationPage}
        setShowWorkExperiencePage={mockSetShowWorkExperiencePage}
        refetchCustomerData={mockRefetchCustomerData}
        deviceType={DEVICE_TYPES.DESKTOP}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('customer-info-tab')).toBeInTheDocument();
    });
  });
});
