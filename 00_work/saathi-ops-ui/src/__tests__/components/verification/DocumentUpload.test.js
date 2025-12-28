import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { SnackbarProvider } from 'notistack';
import '@testing-library/jest-dom';
import DocumentUpload from '../../../components/verification/DocumentUpload';

// Mock dependencies
jest.mock('../../../components/Modal', () => ({ children, isOpen, setIsOpen }) => (
    <div data-testid="mock-modal">
        {isOpen && children}
    </div>
));

jest.mock('../../../hooks/useFileUpload', () => mockUseFileUpload);

const mockUseFileUpload = jest.fn(() => ({
    handleInputChange: jest.fn(),
    fileData: { fileName: '', showProgress: false, uploaded: false },
    resetFileData: jest.fn(),
    setFileData: jest.fn(),
    abortUpload: jest.fn(),
    data: null,
    status: 'idle',
    fileSizeError: false,
    setFileSizeError: jest.fn()
  }));

jest.mock('../../../hooks/useFileUpload', () => () => ({
    handleInputChange: jest.fn(),
    fileData: { fileName: '', showProgress: false, uploaded: false },
    resetFileData: jest.fn(),
    setFileData: jest.fn(),
    abortUpload: jest.fn(),
    data: null,
    status: 'idle',
    fileSizeError: false,
    setFileSizeError: jest.fn()
}));

jest.mock('../../../apis/queryHooks', () => ({
    usePostUploadToS3: jest.fn(),
    usePutPanDetails: () => ({
        mutateAsync: jest.fn(),
        status: 'idle',
        isError: false,
        error: null
    })
}));

jest.mock('../../../assets/icons', () => ({
    UPLOADFILE: 'upload-icon'
}));

jest.mock('../../../constants', () => ({
    FILE_TYPES: { IMAGE: 'image' },
    MAX_DOC_IMAGE_FILE_SIZE_MB: 10,
    MAX_IMAGE_API_TIMER: 100
}));

describe('DocumentUpload Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockProps = {
        open: true,
        isOpen: jest.fn(),
        customerId: '123',
        panUrl: '',
        setPanUrl: jest.fn(),
        refetchCustomerData: jest.fn()
    };
   
    const renderComponent = (props = {}) => {
        return render(
            <SnackbarProvider>
                <DocumentUpload {...mockProps} {...props} />
            </SnackbarProvider>
        );
    };

    it('renders modal with correct heading', () => {
        renderComponent();

        expect(screen.getByText('Upload PAN CARD')).toBeInTheDocument();
    });

    it('renders upload section when no PAN URL exists', () => {
        renderComponent();

        const uploaderText = screen.getByText('PAN Card');
        expect(uploaderText).toBeInTheDocument();
    });

    it('renders image when PAN URL exists', () => {
        const panUrl = 'https://example.com/pan.jpg';
        renderComponent({ panUrl });

        const panImage = screen.getByAltText('thumbnail');
        expect(panImage).toBeInTheDocument();
    });

    it('handles cancel button click', () => {
        renderComponent();

        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);

        expect(mockProps.isOpen).toHaveBeenCalledWith(false);
    });

    it('upload button is disabled when no PAN URL', () => {
        renderComponent();

        const uploadButton = screen.getByRole('button', { name: /upload/i });
        const uploadButtonStyle = window.getComputedStyle(uploadButton);
        expect(uploadButtonStyle.cursor).toBe('not-allowed');
    });

    it('upload button is enabled when PAN URL exists', () => {
        const panUrl = 'https://example.com/pan.jpg';
        renderComponent({ panUrl });

        const uploadButton = screen.getByText('Upload');
        expect(uploadButton).toBeEnabled();
    });
});