import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import '@testing-library/jest-dom';
import EmployerDetails from '../../../components/employers/EmployerDetails';
import { useGetEmployerDetails } from '../../../apis/queryHooks';
import DirectAndRecEmployerTab from '../../../components/employers/DirectAndRecEmployerTab';
import usePermission from '../../../hooks/usePermission';
import { EMPLOYER_MODULE_PERMISSIONS } from '../../../constants/permissions';

// Mock the required modules
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
  useParams: jest.fn(),
  useSearchParams: jest.fn(() => [
    new URLSearchParams('tab=jobs'), // Mock initial search params
    jest.fn(), // Mock setSearchParams function
  ]),
}));

jest.mock('notistack', () => ({
  useSnackbar: jest.fn(),
}));

jest.mock('../../../apis/queryHooks', () => ({
  useGetEmployerDetails: jest.fn(),
  usePutUpdateEmployerStatus: jest.fn(() => ({ 
    data: [], 
    isLoading: false, 
    isFetching: false, 
    refetch: jest.fn() 
  })),
  useDownloadEmployerJobs: jest.fn(() => ({ 
    data: [], 
    isLoading: false, 
    isFetching: false, 
    refetch: jest.fn() 
  })),
}));

jest.mock('../../../components/employers/DirectAndRecEmployerTab', () => jest.fn(() => <div>DirectAndRecEmployerTab</div>));
jest.mock('../../../components/employers/EmployerDetailsTabs', () => jest.fn(() => <div>EmployerDetailsTab</div>));
jest.mock('../../../hooks/usePermission', () => jest.fn());
jest.mock('../../../components/customerDetails/CustomerPageHeader', () => jest.fn(() => <div>CustomerPageHeader</div>));

const mockedNavigate = jest.fn();
const mockedEnqueueSnackbar = jest.fn();
const mockedHasPermission = jest.fn();
const mockRefetch = jest.fn();

describe('EmployerDetails Component', () => {
  jest.spyOn(console, 'error').mockImplementation(() => { });
  beforeEach(() => {
    jest.clearAllMocks();

    require('react-router-dom').useNavigate.mockReturnValue(mockedNavigate);
    require('react-router-dom').useLocation.mockReturnValue({ pathname: '/employers/123' });
    require('react-router-dom').useParams.mockReturnValue({ id: '123' });

    useSnackbar.mockReturnValue({
      enqueueSnackbar: mockedEnqueueSnackbar,
    });

    usePermission.mockReturnValue({
      hasPermission: mockedHasPermission,
    });

    useGetEmployerDetails.mockReturnValue({
      data: {
        companyRegisteredName: 'Test Company',
        uniqueAgencyId: 'EMP123',
        employersAgencyType: 'DIRECT_EMPLOYER',
        verificationStatus: 'VERIFIED',
        activationStatus: 'ACTIVATED',
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });
  });

  it('renders correctly with employer data', async () => {
    render(
      <MemoryRouter initialEntries={['/employers/123']}>
        <Routes>
          <Route path="/employers/:id" element={<EmployerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('DirectAndRecEmployerTab')).toBeInTheDocument();
    });

    expect(useGetEmployerDetails).toHaveBeenCalledWith('123');
  });

  it('shows error snackbar when employer data fetch fails', async () => {
    useGetEmployerDetails.mockReturnValue({
      data: null,
      isLoading: false,
      isFetching: false,
      isError: true,
      error: new Error('Failed to fetch'),
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter initialEntries={['/employers/123']}>
        <Routes>
          <Route path="/employers/:id" element={<EmployerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(mockedEnqueueSnackbar).toHaveBeenCalledWith(
        'Error while fetching employer details',
        { variant: 'error' }
      );
    });
  });

  it('navigates back when left arrow is clicked', async () => {
    render(
      <MemoryRouter initialEntries={['/employers/123']}>
        <Routes>
          <Route path="/employers/:id" element={<EmployerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    const leftArrow = screen.getByAltText('leftArrowBlack');
    fireEvent.click(leftArrow);

    expect(mockedNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders DirectAndRecEmployerTab for DIRECT_EMPLOYER type', async () => {
    useGetEmployerDetails.mockReturnValue({
      data: {
        companyRegisteredName: 'Test Company',
        uniqueAgencyId: 'EMP123',
        employersAgencyType: 'DIRECT_EMPLOYER',
        verificationStatus: 'VERIFIED',
        activationStatus: 'ACTIVATED',
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter initialEntries={['/employers/123']}>
        <Routes>
          <Route path="/employers/:id" element={<EmployerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('DirectAndRecEmployerTab')).toBeInTheDocument();
    });
  });

  it('renders EmployerDetailsTab for other employer types', async () => {
    useGetEmployerDetails.mockReturnValue({
      data: {
        companyRegisteredName: 'Test Company',
        uniqueAgencyId: 'EMP123',
        employersAgencyType: 'OTHER_TYPE', // Different from DIRECT_EMPLOYER or RECRUITMENT_AGENCY
        verificationStatus: 'VERIFIED',
        activationStatus: 'ACTIVATED',
      },
      isLoading: false,
      isFetching: false,
      isError: false,
      error: null,
      refetch: mockRefetch,
    });

    render(
      <MemoryRouter initialEntries={['/employers/123']}>
        <Routes>
          <Route path="/employers/:id" element={<EmployerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('EmployerDetailsTab')).toBeInTheDocument();
    });
  });

  it('changes tab when job tab is in URL parameters', async () => {
    render(
      <MemoryRouter initialEntries={['/employers/123?tab=jobs']}>
        <Routes>
          <Route path="/employers/:id" element={<EmployerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(DirectAndRecEmployerTab).toHaveBeenCalledWith(
        expect.objectContaining({ selectedTab: 1 }),
        expect.anything()
      );
    });
  });

  it('navigates to add job page when Add New Job button is clicked', async () => {
    mockedHasPermission.mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/employers/123?tab=jobs']}>
        <Routes>
          <Route path="/employers/:id" element={<EmployerDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      const newJobButton = screen.getByText('New Job');
      fireEvent.click(newJobButton);
    });

    expect(mockedHasPermission).toHaveBeenCalledWith(EMPLOYER_MODULE_PERMISSIONS?.UPDATE_PROFILE_DETAILS);
    expect(mockedNavigate).toHaveBeenCalledWith(
      expect.stringContaining('/employers/123/add-job'),
      expect.objectContaining({
        state: { employerName: 'Test Company' },
      })
    );
  });
});