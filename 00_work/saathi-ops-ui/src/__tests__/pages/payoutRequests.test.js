import React, { Suspense } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import PayoutRequests from '../../pages/payoutRequests';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import { useGetAllPayouts } from '../../apis/queryHooks';
import usePermission from '../../hooks/usePermission';

// Mock the hooks and components
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useSearchParams: jest.fn(() => [{ get: jest.fn() }, jest.fn()]),
}));

jest.mock('../../apis/queryHooks', () => ({
  useGetAllPayouts: jest.fn(),
}));

jest.mock('../../hooks/usePermission', () => ({
  __esModule: true,
  default: jest.fn(),
  usePermission: jest.fn(),
}));

jest.mock('../../components/DisplayTable', () => () => <div data-testid="mocked-display-table" />);

jest.mock('../../components/atom/tableComponents/Pagination', () => () => <div data-testid="mocked-pagination" />);

jest.mock('../../components/common/FilterDrawer', () => () => <div data-testid="mocked-filter-drawer" />);

jest.mock('../../components/payouts/PayoutRequestDrawer', () => () => <div data-testid="mocked-payout-request-drawer" />);

describe('PayoutRequests Component', () => {
  const mockNavigate = jest.fn();
  const mockUsePermission = jest.fn();
  const mockUseGetAllPayouts = jest.fn();

  beforeEach(() => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    useNavigate.mockReturnValue(mockNavigate);
    usePermission.mockReturnValue({ hasPermission: mockUsePermission });
    const mockPayoutData = {
      data: {
        headers: [
          { key: 'id', value: 'ID', type: 'number' },
          { key: 'amount', value: 'Amount', type: 'number' },
          { key: 'status', value: 'Status', type: 'string' },
        ],
        data: [
          { id: 1, amount: 100, status: 'Pending' },
          { id: 2, amount: 200, status: 'Approved' },
        ],
        count: 2,
      },
    };

    useGetAllPayouts.mockReturnValue(mockPayoutData, {
      refetch: mockUseGetAllPayouts,
    });
  });

  it('renders without crashing', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <PayoutRequests />
      </Suspense>
    );
    expect(screen.getByText('Payout Requests')).toBeInTheDocument();
  });

  it('opens filter drawer when filter button is clicked', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <PayoutRequests />
      </Suspense>
    );

    fireEvent.click(screen.getByText(/filter/i));
    await waitFor(() => {
      expect(screen.getByTestId('mocked-filter-drawer')).toBeInTheDocument();
    });
  });

  it('renders DisplayTable correctly', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <PayoutRequests />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mocked-display-table')).toBeInTheDocument();
    });
  });

  it('handles pagination correctly', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <PayoutRequests />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mocked-pagination')).toBeInTheDocument();
    });
  });
  
  it('handles payout request drawer correctly', async () => {
    render(
      <Suspense fallback={<div>Loading...</div>}>
        <PayoutRequests />
      </Suspense>
    );

    await waitFor(() => {
      expect(screen.getByTestId('mocked-payout-request-drawer')).toBeInTheDocument();
    });
  });
});