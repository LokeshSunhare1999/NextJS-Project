import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { UserContext } from '../../context/UserContext';
import { usePutResetPassword } from '../../apis/queryHooks';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { useNavigate } from 'react-router-dom';
import ResetPassword from '../../pages/resetPassword';

// Mock the custom hooks
jest.mock('../../apis/queryHooks', () => ({
  usePutResetPassword: jest.fn(),
}));

// Mock nookies functions
jest.mock('nookies', () => ({
  setCookie: jest.fn(),
  parseCookies: jest.fn(),
  destroyCookie: jest.fn(),
}));

// Mock the useNavigate function
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
}));

// Mock useSnackbar
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: jest.fn(),
}));

describe('ResetPassword Component', () => {
  let mockPostResetPassword;
  let setUserMock;
  let mockEnqueueSnackbar;
  let mockNavigate;

  beforeEach(() => {
    mockPostResetPassword = jest.fn().mockReturnValue({
      mutateAsync: jest.fn(),
      status: 'idle',
    });
    usePutResetPassword.mockReturnValue(mockPostResetPassword);

    setUserMock = jest.fn();

    mockEnqueueSnackbar = jest.fn();
    useSnackbar.mockReturnValue({ enqueueSnackbar: mockEnqueueSnackbar });

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    parseCookies.mockReturnValue({
      userId: '12345',
    });
  });

  it('calls reset password API on valid input', async () => {
    const mockMutate = jest.fn().mockResolvedValue({
      identity: { accessToken: 'access-token' },
      loggedInUserContact: { name: 'John Doe' },
      _id: 'user-id',
    });

    usePutResetPassword.mockReturnValue({
      mutateAsync: mockMutate,
      status: 'success',
      data: {
        identity: { accessToken: 'access-token' },
        loggedInUserContact: { name: 'John Doe' },
        _id: 'user-id',
      },
    });

    render(
      <SnackbarProvider>
        <UserContext.Provider value={{ setUser: setUserMock }}>
          <ResetPassword token="reset-token" setToken={jest.fn()} />
        </UserContext.Provider>
      </SnackbarProvider>,
    );

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        newPassword: 'password123',
        userId: '12345',
      });
    });

    await waitFor(() => {
      expect(setUserMock).toHaveBeenCalledWith({
        identity: { accessToken: 'access-token' },
        loggedInUserContact: { name: 'John Doe' },
        _id: 'user-id',
      });
      expect(setCookie).toHaveBeenCalledWith(null, 'userId', 'user-id', {
        maxAge: expect.any(Number),
        path: '/',
      });
      expect(setCookie).toHaveBeenCalledWith(
        null,
        'accessToken',
        'access-token',
        {
          maxAge: expect.any(Number),
          path: '/',
        },
      );
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('fails reset password API', async () => {
    const mockMutate = jest.fn().mockResolvedValue({
      identity: { accessToken: 'access-token' },
      loggedInUserContact: { name: 'John Doe' },
      _id: 'user-id',
    });
    usePutResetPassword.mockReturnValue({
      mutateAsync: mockMutate,
      status: 'error',
    });

    render(
      <SnackbarProvider>
        <UserContext.Provider value={{ setUser: setUserMock }}>
          <ResetPassword token="reset-token" setToken={jest.fn()} />
        </UserContext.Provider>
      </SnackbarProvider>,
    );

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'password123' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        newPassword: 'password123',
        userId: '12345',
      });
    });

    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Reset password failed!',
        { variant: 'error' },
      );
    });
  });

  it('shows error snackbar on password length less than 8 characters', async () => {
    render(
      <SnackbarProvider>
        <UserContext.Provider value={{ setUser: setUserMock }}>
          <ResetPassword token="reset-token" setToken={jest.fn()} />
        </UserContext.Provider>
      </SnackbarProvider>,
    );

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'pass' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'pass' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Password should be atleast 8 characters long',
        { variant: 'error' },
      );
    });
  });

  it('shows error snackbar on mismatched passwords', async () => {
    render(
      <SnackbarProvider>
        <UserContext.Provider value={{ setUser: setUserMock }}>
          <ResetPassword token="reset-token" setToken={jest.fn()} />
        </UserContext.Provider>
      </SnackbarProvider>,
    );

    fireEvent.change(screen.getByLabelText('New Password'), {
      target: { value: 'password123' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'differentPassword' },
    });

    fireEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Passwords do not match!',
        {
          variant: 'error',
        },
      );
    });
  });
});
