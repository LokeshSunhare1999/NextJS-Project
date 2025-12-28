import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import '@testing-library/jest-dom';
import EditDetailsDrawer from '../../../components/customerDetails/EditDetailsDrawer';
import useCustomerEditDetails from '../../../hooks/customer/useCustomerEditDetails';

jest.mock('styled-components', () => {
  const styledMock = {
    div: jest.fn().mockImplementation((...args) => (props) => (
      <div data-testid="styled-div" {...props} />
    )),
    input: jest.fn().mockImplementation((...args) => (props) => (
      <input data-testid="styled-input" {...props} />
    )),
    button: jest.fn().mockImplementation((...args) => (props) => (
      <button data-testid="styled-button" {...props} />
    )),
    p: jest.fn().mockImplementation((...args) => (props) => (
      <p data-testid="styled-p" {...props} />
    )),
  };

  styledMock.default = jest.fn().mockImplementation((Component) =>
    jest.fn().mockImplementation((props) => <Component {...props} />)
  );

  return styledMock;
});


// Mock the useSnackbar hook
jest.mock('notistack', () => ({
  ...jest.requireActual('notistack'),
  useSnackbar: () => ({
    enqueueSnackbar: jest.fn(),
  }),
}));

// Mock the custom hook
jest.mock('../../../hooks/customer/useCustomerEditDetails');

// Mock constants
jest.mock('../../../constants', () => ({
  FILE_TYPES: { VIDEO: 'video' },
  MAX_INTRO_VIDEO_FILE_SIZE_MB: 10,
  MAX_VIDEO_API_TIMER: 60000,
}));

jest.mock('../../../constants/details', () => ({
  ADDRESS_MAX_LENGTH: 100,
  ADDRESS_MIN_LENGTH: 5,
  CITY_MAX_LENGTH: 50,
  CITY_MIN_LENGTH: 3,
  MAX_EXPERIENCE: 50,
  MIN_EXPERIENCE: 0,
  PIN_LENGTH: 6,
  STATES_LIST: ['Maharashtra', 'Karnataka', 'Delhi'],
}));

// Mock other components that might cause issues
jest.mock('../../../components/courses/FileUpload', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ children }) => (
    <div data-testid="file-upload-mock">{children}</div>
  )),
}));

jest.mock('../../../components/CustomCTA', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({ title, onClick, isLoading }) => (
    <button
      data-testid="custom-cta"
      data-loading={isLoading}
      onClick={onClick}
    >
      {title}
    </button>
  )),
}));

jest.mock('../../../components/common/DisplayDrawer', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({
    children,
    open,
    handleCloseDrawer,
    headerContent,
    footerContent
  }) => (
    open ? (
      <div data-testid="display-drawer-mock">
        <div data-testid="header">{headerContent && headerContent()}</div>
        <div data-testid="content">{children}</div>
        <div data-testid="footer">{footerContent && footerContent()}</div>
        <button data-testid="close-drawer" onClick={handleCloseDrawer}>
          Close
        </button>
      </div>
    ) : null
  )),
}));

jest.mock('../../../components/common/DrawerInput', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation(({
    children,
    fieldType,
    fieldHeader,
    fieldValue,
    fieldError,
    handleFieldChange,
    handleDropDownSelect,
    dropDownOpen,
    handleDropDownOpen,
    dropDownList
  }) => (
    <div data-testid={`drawer-input-${fieldType}`}>
      <label>{fieldHeader}</label>
      {fieldType === 'input' && (
        <input
          value={fieldValue || ''}
          onChange={handleFieldChange}
          data-error={fieldError}
        />
      )}
      {fieldType === 'dropdown' && (
        <div data-testid="dropdown" data-open={dropDownOpen}>
          <div onClick={() => handleDropDownOpen && handleDropDownOpen(!dropDownOpen)}>
            {fieldValue}
          </div>
          {dropDownOpen && dropDownList && (
            <ul>
              {dropDownList.map(item => (
                <li
                  key={item}
                  onClick={() => handleDropDownSelect(item)}
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {fieldType === 'children' && children}
    </div>
  )),
}));

// Mock the ICONS
jest.mock('../../../assets/icons', () => ({
  VIDEO_CAMERA_BLUE: 'video-camera-icon-url',
}));

describe('EditDetailsDrawer', () => {
  jest.spyOn(console, 'error').mockImplementation(() => { });
  const mockProps = {
    open: true,
    toggleDrawer: jest.fn(),
    customerId: 'cust123',
    detailsData: {
      trueId: {
        aadhaar: {
          age: 30,
        },
      },
      address: 'Old Address',
      city: 'Old City',
      state: 'Karnataka',
      country: 'India',
      pin: '123456',
      experience: 5,
      education: 'Graduation',
      introVideoLink: 'http://example.com/video.mp4',
    },
    refetchCustomerData: jest.fn(),
  };

  const mockHookImplementation = {
    editDrawerObj: {
      address: 'New Address',
      city: 'New City',
      state: 'Maharashtra',
      country: 'India',
      pin: '560001',
      experience: 8,
      education: 'Post Graduation',
      introVideoLink: 'http://updated.com/video.mp4',
    },
    editDrawerError: {},
    stateCategoryOpen: false,
    educationCategoryOpen: false,
    countryCategoryOpen: false,
    tempVideoDelete: false,
    customerDetailsStatus: 'idle',
    videoFileData: null,
    videoUploadStatus: 'idle',
    videoFileSizeError: false,
    educationOptionsKeys: ['Graduation', 'Post Graduation', 'PhD'],
    clearFields: jest.fn(),
    handleStateCategorySelect: jest.fn(),
    handleEducationCategorySelect: jest.fn(),
    handleCountryCategorySelect: jest.fn(),
    handleInputDelete: jest.fn(),
    handleFieldUpdate: jest.fn(),
    handleExpBtnClick: jest.fn(),
    handleSaveClick: jest.fn(),
    convertEducationLevel: jest.fn(),
    setTempVideoDelete: jest.fn(),
    handleVideoInputChange: jest.fn(),
    abortVideoUpload: jest.fn(),
    resetVideoFileData: jest.fn(),
    setVideoFileSizeError: jest.fn(),
    setStateCategoryOpen: jest.fn(),
    setCountryCategoryOpen: jest.fn(),
    setEducationCategoryOpen: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useCustomerEditDetails.mockReturnValue(mockHookImplementation);
  });

  it('renders correctly when open', () => {
    render(
      <SnackbarProvider>
        <EditDetailsDrawer {...mockProps} />
      </SnackbarProvider>
    );

    expect(screen.getByTestId('display-drawer-mock')).toBeInTheDocument();
    expect(screen.getByText('Edit Details')).toBeInTheDocument();
  });

  it('calls toggleDrawer with false when close button is clicked', () => {
    render(
      <SnackbarProvider>
        <EditDetailsDrawer {...mockProps} />
      </SnackbarProvider>
    );

    const closeButton = screen.getByTestId('close-drawer');
    fireEvent.click(closeButton);

    expect(mockProps.toggleDrawer).toHaveBeenCalledWith(false);
    expect(mockHookImplementation.clearFields).toHaveBeenCalled();
  });

  it('calls handleSaveClick when Save button is clicked', () => {
    render(
      <SnackbarProvider>
        <EditDetailsDrawer {...mockProps} />
      </SnackbarProvider>
    );

    const saveButton = screen.getByText('Save');
    fireEvent.click(saveButton);

    expect(mockHookImplementation.handleSaveClick).toHaveBeenCalledTimes(1);
  });

  it('calls handleExpBtnClick when increment/decrement buttons are clicked', () => {
    render(
      <SnackbarProvider>
        <EditDetailsDrawer {...mockProps} />
      </SnackbarProvider>
    );

    const plusButtons = screen.getAllByText('+');
    const minusButtons = screen.getAllByText('-');

    fireEvent.click(plusButtons[0]);
    expect(mockHookImplementation.handleExpBtnClick).toHaveBeenCalledWith('increment');

    fireEvent.click(minusButtons[0]);
    expect(mockHookImplementation.handleExpBtnClick).toHaveBeenCalledWith('decrement');
  });

  it('shows success flow when customerDetailsStatus is success', async () => {
    const successHookImpl = {
      ...mockHookImplementation,
      customerDetailsStatus: 'success',
    };
    useCustomerEditDetails.mockReturnValue(successHookImpl);

    render(
      <SnackbarProvider>
        <EditDetailsDrawer {...mockProps} />
      </SnackbarProvider>
    );

    await waitFor(() => {
      expect(successHookImpl.resetVideoFileData).toHaveBeenCalled();
      expect(successHookImpl.clearFields).toHaveBeenCalled();
      expect(mockProps.toggleDrawer).toHaveBeenCalledWith(false);
      expect(mockProps.refetchCustomerData).toHaveBeenCalled();
    });
  });

  it('shows error flow when customerDetailsStatus is error', async () => {
    const errorHookImpl = {
      ...mockHookImplementation,
      customerDetailsStatus: 'error',
    };
    useCustomerEditDetails.mockReturnValue(errorHookImpl);

    render(
      <SnackbarProvider>
        <EditDetailsDrawer {...mockProps} />
      </SnackbarProvider>
    );

    await waitFor(() => {
      expect(errorHookImpl.resetVideoFileData).not.toHaveBeenCalled();
      expect(errorHookImpl.clearFields).not.toHaveBeenCalled();
      expect(mockProps.toggleDrawer).not.toHaveBeenCalled();
      expect(mockProps.refetchCustomerData).not.toHaveBeenCalled();
    });
  });

  it('resets videoFileSizeError when it is true', async () => {
    const videoErrorHookImpl = {
      ...mockHookImplementation,
      videoFileSizeError: true,
    };
    useCustomerEditDetails.mockReturnValue(videoErrorHookImpl);

    render(
      <SnackbarProvider>
        <EditDetailsDrawer {...mockProps} />
      </SnackbarProvider>
    );

    await waitFor(() => {
      expect(videoErrorHookImpl.setVideoFileSizeError).toHaveBeenCalledWith(false);
    });
  });

  it('shows loading state when updating', () => {
    const pendingHookImpl = {
      ...mockHookImplementation,
      customerDetailsStatus: 'pending',
    };
    useCustomerEditDetails.mockReturnValue(pendingHookImpl);

    render(
      <SnackbarProvider>
        <EditDetailsDrawer {...mockProps} />
      </SnackbarProvider>
    );

    const saveButton = screen.getByTestId('custom-cta');
    expect(saveButton.getAttribute('data-loading')).toBe('true');
  });

  it('handles dropdown state selection', () => {
    const dropdownHookImpl = {
      ...mockHookImplementation,
      stateCategoryOpen: true,
    };
    useCustomerEditDetails.mockReturnValue(dropdownHookImpl);

    render(
      <SnackbarProvider>
        <EditDetailsDrawer {...mockProps} />
      </SnackbarProvider>
    );

    const dropdowns = screen.getAllByTestId('dropdown');

    const stateDropdown = dropdowns[0];

    expect(stateDropdown.getAttribute('data-open')).toBe('true');

    const stateItems = stateDropdown.querySelectorAll('li');
    fireEvent.click(stateItems[0]);

    expect(mockHookImplementation.handleStateCategorySelect).toHaveBeenCalledWith('Maharashtra');
  });
});