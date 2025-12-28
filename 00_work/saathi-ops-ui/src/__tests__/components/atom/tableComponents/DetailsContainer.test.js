import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DetailsContainer from '../../../../components/atom/tableComponents/DetailsContainer';
import { ModalContext } from '../../../../context/ModalProvider';
import { formatDate } from '../../../../utils/helper';
import { RUPEE_SYMBOL } from '../../../../constants/details';
import { MemoryRouter } from 'react-router-dom';

// Mock the ModalContext
const mockDisplayModal = jest.fn();
const modalContextValue = {
    displayModal: mockDisplayModal,
};

// Mock the useLocation hook
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useLocation: () => ({
        pathname: '/customer/123',
    }),
}));

// Mock the formatDate function
jest.mock('../../../../utils/helper', () => ({
    formatDate: jest.fn((date, format) => `formatted: ${date} - ${format}`),
}));

// Mock moment-timezone
jest.mock('moment-timezone', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        isValid: jest.fn(() => true),
    })),
}));

describe('DetailsContainer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockDetailsData = {
        customerID: '12345',
        paymentDateTime: '2023-10-01T12:00:00Z',
        employerRating: 4.5,
        totalAmount: 1000,
        introVideo: 'http://example.com/video.mp4',
        emailId: 'test@example.com',
        activationStatus: 'ACTIVATED',
    };

    const renderComponent = (props = {}) => {
        return render(
            <MemoryRouter>
                <ModalContext.Provider value={modalContextValue}>
                    <DetailsContainer
                        title="Customer Details"
                        detailsData={mockDetailsData}
                        {...props}
                    />
                </ModalContext.Provider>
            </MemoryRouter>
        );
    };

    it('renders the title correctly', () => {
        renderComponent();
        expect(screen.getByText('Customer Details')).toBeInTheDocument();
    });

    it('renders the details correctly', () => {
        renderComponent();
  
        const expectedDetails = [
          { label: 'Customer ID', value: '12345' },
          { label: 'Payment Date/Time', value: 'formatted: 2023-10-01T12:00:00Z - DD-MMM-YYYY, h:mm a' },
          { label: 'Employer Rating', value: '4.5' },
          { label: 'Total Amount', value: `${RUPEE_SYMBOL} 1000` },
          { label: 'Intro Video', value: 'customer_intro_video.mp4' },
          { label: 'Email Id', value: 'test@example.com' }
        ];
      
        expectedDetails.forEach(({ label, value }) => {
          expect(screen.getByText(label)).toBeInTheDocument();
          expect(screen.getByText(value)).toBeInTheDocument();
        });
    });

    it('renders the edit icon when showEdit is true', () => {
        renderComponent({ showEdit: true });
        const editIcon = screen.getByRole('img', { name: /edit/i });
        expect(editIcon).toBeInTheDocument();
        expect(editIcon).toHaveAttribute('src', 'pencil.svg');
    });

    it('calls handleEditClick when the edit icon is clicked', () => {
        const handleEditClick = jest.fn();
        renderComponent({ showEdit: true, handleEditClick });
        const editIcon = screen.getByRole('img', { name: /edit/i });
        fireEvent.click(editIcon);
        expect(handleEditClick).toHaveBeenCalled();
    });

    it('opens the video player when the intro video link is clicked', () => {
        renderComponent();
        const videoLink = screen.getByText('customer_intro_video.mp4');
        fireEvent.click(videoLink);
        expect(mockDisplayModal).toHaveBeenCalledWith(
            expect.any(Object),
            { modalWidth: '660px' }
        );
    });

    it('renders the verified icon for activated email', () => {
        renderComponent();
        const emailElement = screen.getByText('test@example.com');
        const verifiedIcon = screen.getByRole('img', { name: '' });
        expect(emailElement).toBeInTheDocument();
        expect(verifiedIcon).toBeInTheDocument();
        expect(verifiedIcon).toHaveAttribute('src', 'verified.svg');
    });

    it('renders the correct format for dates', () => {
        renderComponent();
        expect(formatDate).toHaveBeenCalledWith(mockDetailsData.paymentDateTime, 'DD-MMM-YYYY, h:mm a');
    });

    it('renders the correct format for ratings', () => {
        renderComponent();
        const ratingElement = screen.getByText('4.5');
        expect(ratingElement).toBeInTheDocument();
        expect(screen.getByRole('img', { name: /4.5 stars/i })).toBeInTheDocument();
    });

    it('renders the correct format for amounts', () => {
        renderComponent();
        const amountElement = screen.getByText(`${RUPEE_SYMBOL} 1000`);
        expect(amountElement).toBeInTheDocument();
    });

    it('renders the correct format for video links', () => {
        renderComponent();
        const videoLink = screen.getByText('customer_intro_video.mp4');
        expect(videoLink).toBeInTheDocument();
    });
});