import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import LogoUpload from '../../../components/employers/LogoUpload';
import useLogoUpload from '../../../hooks/useLogoUpload';
import { enqueueSnackbar } from 'notistack';
import { LOGO_TEXT } from '../../../constants/employer';
import { generateUploadFilePath } from '../../../utils/helper';

// Mock the imports
jest.mock('notistack', () => ({
    enqueueSnackbar: jest.fn()
}));

jest.mock('../../../hooks/useLogoUpload');

jest.mock('../../../utils/helper', () => ({
    generateAlphaNumericString: jest.fn(() => 'TEST123'),
    generateUploadFilePath: jest.fn(() => 'uploads/logo/TEST123.jpg')
}));

describe('LogoUpload Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockProps = {
        initialIcon: 'initial-icon.svg',
        successIcon: 'success-icon.svg',
        loadingIcon: 'loading-icon.svg',
        uploadTitle: 'Upload Test Logo',
        fileType: 'image/png, image/jpeg',
        maxFileSizeInMB: 3,
        setImage: jest.fn(),
        imageUrl: ''
    };

    beforeEach(() => {
        jest.clearAllMocks();

        // Default mock implementation for the hook
        useLogoUpload.mockReturnValue({
            logo: null,
            isUploading: false,
            error: null,
            handleFileChange: jest.fn(),
            status: 'idle',
            isError: false,
            data: null
        });
    });

    it('renders with initial state', () => {
        render(<LogoUpload {...mockProps} />);

        const logoImg = screen.getByAltText('Logo');
        expect(logoImg).toBeInTheDocument();
        expect(logoImg.src).toContain('initial-icon.svg');

        const logoText = screen.getByText(LOGO_TEXT.SUCCESS);
        expect(logoText).toBeInTheDocument();
        expect(logoText).toHaveStyle('text-decoration: underline');
    });

    it('calls handleFileChange when file is selected', () => {
        const mockHandleFileChange = jest.fn();
        useLogoUpload.mockReturnValue({
            logo: null,
            isUploading: false,
            error: null,
            handleFileChange: mockHandleFileChange,
            status: 'idle',
            isError: false,
            data: null
        });

        render(<LogoUpload {...mockProps} />);

        const fileInput = document.getElementById('logo-upload');
        const file = new File(['dummy content'], 'test.png', { type: 'image/png' });

        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(mockHandleFileChange).toHaveBeenCalledTimes(1);
    });

    it('shows loading state during upload', () => {
        useLogoUpload.mockReturnValue({
            logo: null,
            isUploading: true,
            error: null,
            handleFileChange: jest.fn(),
            status: 'pending',
            isError: false,
            data: null
        });

        render(<LogoUpload {...mockProps} />);

        const logoImg = screen.getByAltText('Logo');
        expect(logoImg.src).toContain('loading-icon.svg');

        const logoText = screen.getByText(LOGO_TEXT.PENDING);
        expect(logoText).toBeInTheDocument();
    });

    it('shows success state after successful upload', () => {
        const uploadedLogoUrl = 'https://example.com/uploaded-logo.png';

        useLogoUpload.mockReturnValue({
            logo: uploadedLogoUrl,
            isUploading: false,
            error: null,
            handleFileChange: jest.fn(),
            status: 'success',
            isError: false,
            data: { url: uploadedLogoUrl }
        });

        render(<LogoUpload {...mockProps} />);

        const logoImg = screen.getByAltText('Logo');
        expect(logoImg.src).toContain(uploadedLogoUrl);

        const logoText = screen.getByText(LOGO_TEXT.SUCCESS);
        expect(logoText).toBeInTheDocument();
        expect(logoText).toHaveStyle('text-decoration: underline');

        expect(mockProps.setImage).toHaveBeenCalledWith(uploadedLogoUrl);
    });

    it('shows error notification on upload failure', async () => {
        const errorMessage = 'Upload failed due to network error';

        useLogoUpload.mockReturnValue({
            logo: null,
            isUploading: false,
            error: errorMessage,
            handleFileChange: jest.fn(),
            status: 'error',
            isError: true,
            data: null
        });

        render(<LogoUpload {...mockProps} />);

        await waitFor(() => {
            expect(enqueueSnackbar).toHaveBeenCalledWith(errorMessage, {
                variant: 'error'
            });
        });

        // Should revert to initial state on error
        const logoImg = screen.getByAltText('Logo');
        expect(logoImg.src).toContain('initial-icon.svg');
    });

    it('generates proper upload path using utility functions', () => {
        render(<LogoUpload {...mockProps} />);

        expect(generateUploadFilePath).toHaveBeenCalledWith(
            'LOGO',
            'TEST123',
            expect.any(String)
        );
    });

    it('uses default props when not provided', () => {
        const minimalProps = {
            initialIcon: 'initial-icon.svg',
            loadingIcon: 'loading-icon.svg',
            setImage: jest.fn()
        };

        render(<LogoUpload {...minimalProps} />);

        const fileInput = document.getElementById('logo-upload');
        expect(fileInput.accept).toBe('image/png, image/jpeg, image/jpg');
    });

    it('passes maxFileSizeInMB to useLogoUpload hook', () => {
        render(<LogoUpload {...mockProps} />);

        expect(useLogoUpload).toHaveBeenCalledWith(
            expect.any(String),
            expect.any(String),
            mockProps.maxFileSizeInMB
        );
    });
});