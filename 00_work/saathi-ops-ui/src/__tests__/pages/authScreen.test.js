import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SnackbarProvider, useSnackbar } from 'notistack';
import { UserContext } from '../../context/UserContext';
import { usePostIdentity, usePostVerifyPassword } from '../../apis/queryHooks';
import { parseCookies, setCookie, destroyCookie } from 'nookies';
import { useNavigate } from 'react-router-dom';
import AuthScreen from '../../pages/authScreen';
import { USER_TYPE } from '../../constants';

// Mock the custom hooks
jest.mock('../../apis/queryHooks', () => ({
  usePostIdentity: jest.fn(),
  usePostVerifyPassword: jest.fn(),
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

jest.mock('uuid', () => ({
  v4: jest.fn().mockReturnValue('1234-5678-9012'),
}));

jest.mock('nookies', () => ({
  setCookie: jest.fn(),
  destroyCookie: jest.fn(),
  parseCookies: jest.fn().mockReturnValue({}),
}));

describe('AuthScreen Component', () => {
  let mockPostIdentity;
  let mockPostVerifyPassword;
  let setUserMock;
  let mockEnqueueSnackbar;
  let mockNavigate;

  beforeEach(() => {
    mockPostIdentity = jest.fn().mockReturnValue({
      mutateAsync: jest.fn(),
      status: 'idle',
    });
    usePostIdentity.mockReturnValue(mockPostIdentity);

    mockPostVerifyPassword = jest.fn().mockReturnValue({
      mutateAsync: jest.fn(),
      status: 'idle',
    });
    usePostVerifyPassword.mockReturnValue(mockPostVerifyPassword);

    setUserMock = jest.fn();

    mockEnqueueSnackbar = jest.fn();
    useSnackbar.mockReturnValue({ enqueueSnackbar: mockEnqueueSnackbar });

    mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render the AuthScreen component', async () => {
    await waitFor(() => {
      render(
        <SnackbarProvider>
          <UserContext.Provider value={{ setUser: setUserMock }}>
            {' '}
            <AuthScreen token={'access-token'} setToken={jest.fn()} />
          </UserContext.Provider>
        </SnackbarProvider>,
      );
    });

    expect(screen.getByText('Sign In')).toBeInTheDocument();
    expect(
      screen.getByText('Please enter details to continue to your account.'),
    ).toBeInTheDocument();
    expect(await screen.findByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
  });

  it('should handle email input', async () => {
    render(
      <SnackbarProvider>
        <UserContext.Provider value={{ setUser: setUserMock }}>
          <AuthScreen token={'access-token'} setToken={jest.fn()} />
        </UserContext.Provider>
      </SnackbarProvider>,
    );

    const emailInput = await screen.findByLabelText('Email');
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });

    expect(emailInput.value).toBe('test@example.com');
  });

  it('should handle password input', async () => {
    render(
      <SnackbarProvider>
        <UserContext.Provider value={{ setUser: setUserMock }}>
          <AuthScreen token={'access-token'} setToken={jest.fn()} />
        </UserContext.Provider>
      </SnackbarProvider>,
    );

    const emailInput = await screen.findByLabelText('Password');
    fireEvent.change(emailInput, { target: { value: 'password123' } });

    expect(emailInput.value).toBe('password123');
  });

  it('should submit the form and handle successful login', async () => {
    const mockMutatePostIdentity = jest.fn().mockResolvedValue({
      guestToken: 'guest-token',
    });

    usePostIdentity.mockReturnValue({
      mutateAsync: mockMutatePostIdentity,
      status: 'success',
      data: {
        guestToken: 'guest-token',
      },
    });

    const mockMutateVerifyPassword = jest.fn().mockResolvedValue({
      identity: { accessToken: 'access-token' },
      loggedInUserContact: { name: 'User' },
    });

    usePostVerifyPassword.mockReturnValue({
      mutateAsync: mockMutateVerifyPassword,
      status: 'success',
      data: {
        identity: { accessToken: 'access-token' },
        loggedInUserContact: { name: 'User' },
      },
    });

    render(
      <SnackbarProvider>
        <UserContext.Provider value={{ setUser: setUserMock }}>
          <AuthScreen token={'access-token'} setToken={jest.fn()} />
        </UserContext.Provider>
      </SnackbarProvider>,
    );

    const emailInput = await screen.findByLabelText('Email');
    const passwordInput = await screen.findByLabelText('Password');
    const submitButton = screen.getByText('Sign in');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateVerifyPassword).toHaveBeenCalledWith({
        payload: {
          userContact: {
            phoneOrEmail: 'test@example.com',
            dialCode: '+91',
          },
          password: 'password123',
          userType: USER_TYPE,
        },
        token: 'guest-token',
      });
    });

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });

    expect(setUserMock).toHaveBeenCalledWith({
      identity: { accessToken: 'access-token' },
      loggedInUserContact: { name: 'User' },
    });
    expect(setCookie).toHaveBeenCalledWith(
      null,
      'userId',
      undefined,
      expect.any(Object),
    );
    expect(setCookie).toHaveBeenCalledWith(
      null,
      'accessToken',
      'access-token',
      expect.any(Object),
    );
    expect(destroyCookie).toHaveBeenCalledWith(null, 'guestToken');
  });

  it('should fail the login', async () => {
    const mockMutatePostIdentity = jest.fn().mockResolvedValue({
      guestToken: 'guest-token',
    });

    usePostIdentity.mockReturnValue({
      mutateAsync: mockMutatePostIdentity,
      status: 'success',
      data: {
        guestToken: 'guest-token',
      },
    });

    const mockMutateVerifyPassword = jest.fn().mockResolvedValue({
      identity: { accessToken: 'access-token' },
      loggedInUserContact: { name: 'User' },
    });

    usePostVerifyPassword.mockReturnValue({
      mutateAsync: mockMutateVerifyPassword,
      status: 'error',
    });

    render(
      <SnackbarProvider>
        <UserContext.Provider value={{ setUser: setUserMock }}>
          <AuthScreen token={'access-token'} setToken={jest.fn()} />
        </UserContext.Provider>
      </SnackbarProvider>,
    );

    const emailInput = await screen.findByLabelText('Email');
    const passwordInput = await screen.findByLabelText('Password');
    const submitButton = screen.getByText('Sign in');

    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockMutateVerifyPassword).toHaveBeenCalledWith({
        payload: {
          userContact: {
            phoneOrEmail: 'test@example.com',
            dialCode: '+91',
          },
          password: 'password123',
          userType: USER_TYPE,
        },
        token: 'guest-token',
      });
    });

    await waitFor(() => {
      expect(mockEnqueueSnackbar).toHaveBeenCalledWith(
        'Invalid Email or Password',
        { variant: 'error' },
      );
    });
  });
});
