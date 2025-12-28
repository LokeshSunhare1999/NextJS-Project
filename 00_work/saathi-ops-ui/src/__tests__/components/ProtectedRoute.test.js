import React from 'react';
import { render } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from '../../components/ProtectedRoute';
import '@testing-library/jest-dom';

describe('ProtectedRoute', () => {
  test('renders children when authenticated', () => {
    const { getByText } = render(
      <MemoryRouter>
        <ProtectedRoute isAuthenticated={true}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(getByText('Protected Content')).toBeInTheDocument();
  });

  test('redirects to login when not authenticated', () => {
    const { queryByText } = render(
      <MemoryRouter>
        <ProtectedRoute isAuthenticated={false}>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );
    expect(queryByText('Protected Content')).not.toBeInTheDocument();
  });
});