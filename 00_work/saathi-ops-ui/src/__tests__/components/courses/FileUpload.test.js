import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import FileUpload from '../../../components/courses/FileUpload';
import { FILE_TYPES } from '../../../constants';

jest.mock('../../../constants', () => ({
    FILE_TYPES: {
        IMAGE: 'image',
        AUDIO: 'audio',
        VIDEO: 'video',
        DOCUMENT: 'document'
    },
    MAX_FILENAME_LENGTH: 20
}));

jest.mock('../../../utils/helper', () => ({
    truncateFileName: jest.fn((name) => name),
    extractStringAfterMediaType: jest.fn((data) => data)
}));

jest.mock('../../../components/CustomCTA', () => {
    return jest.fn(({ handleInputChange, ...props }) => {
        return (
            <button
                onClick={(e) => handleInputChange && handleInputChange(e)}
                data-testid="custom-cta"
            >
                {props.title}
            </button>
        );
    });
});

describe('FileUpload Component', () => {
    const mockProps = {
        fileData: {
            fileName: '',
            showProgress: false,
            uploaded: false
        },
        fileType: FILE_TYPES.IMAGE,
        iconUrl: 'mock-icon-url',
        uploadTitle: 'Upload Image',
        acceptType: 'image/*',
        handleInputChange: jest.fn(),
        handleInputDelete: jest.fn(),
        abortUpload: jest.fn(),
        maxApiTimer: 10,
        uploadData: '',
    };

    it('renders placeholder when no file is uploaded', () => {
        render(<FileUpload {...mockProps} />);

        const uploadButton = screen.getByText('Upload Image');
        expect(uploadButton).toBeInTheDocument();
    });

    it('renders empty progress when showEmptyProgress is true', () => {
        render(<FileUpload {...mockProps} showEmptyProgress={true} />);

        const uploadButton = screen.getByText('Upload Image');
        expect(uploadButton).toBeInTheDocument();
    });

    it('renders uploaded file state', () => {
        const uploadedProps = {
            ...mockProps,
            uploadData: 'test-file.jpg',
            fileData: {
                fileName: '',
                showProgress: false,
                uploaded: false
            }
        };

        render(<FileUpload {...uploadedProps} />);

        const uploadedFileName = screen.getByText('test-file.jpg');
        expect(uploadedFileName).toBeInTheDocument();
    });

    it('renders progress state when file is being uploaded', () => {
        const uploadingProps = {
            ...mockProps,
            fileData: {
                fileName: 'test-file.jpg',
                showProgress: true,
                uploaded: false
            }
        };

        render(<FileUpload {...uploadingProps} />);

        const fileName = screen.getByText('test-file.jpg');
        expect(fileName).toBeInTheDocument();
    });

    it('renders processing state', () => {
        render(<FileUpload {...mockProps} isProcessing={true} />);

        const processingText = screen.getByText('Video Processing');
        expect(processingText).toBeInTheDocument();
    });

    it('calls handleInputChange when upload button is clicked', () => {
        render(<FileUpload {...mockProps} />);

        const uploadButton = screen.getByTestId('custom-cta');

        fireEvent.click(uploadButton);

        expect(mockProps.handleInputChange).toHaveBeenCalled();
    });

    it('calls abortUpload when cancel icon is clicked during upload', () => {
        const uploadingProps = {
            ...mockProps,
            fileData: {
                fileName: 'test-file.jpg',
                showProgress: true,
                uploaded: false
            }
        };

        render(<FileUpload {...uploadingProps} />);

        const cancelIcon = screen.getByAltText('delete-icon');
        fireEvent.click(cancelIcon);

        expect(mockProps.abortUpload).toHaveBeenCalled();
    });

    it('calls handleInputDelete when delete icon is clicked for uploaded file', () => {
        const uploadedProps = {
            ...mockProps,
            fileData: {
                fileName: 'test-file.jpg',
                showProgress: true,
                uploaded: true
            }
        };

        render(<FileUpload {...uploadedProps} />);

        const deleteIcon = screen.getByAltText('delete-icon');
        fireEvent.click(deleteIcon);

        expect(mockProps.handleInputDelete).toHaveBeenCalledWith(FILE_TYPES.IMAGE);
    });

    it('shows uploaded file state after temporary delete', () => {
        const uploadedProps = {
            ...mockProps,
            uploadData: 'test-file.jpg',
            fileData: {
                fileName: '',
                showProgress: false,
                uploaded: false
            },
            tempDelete: true
        };

        render(<FileUpload {...uploadedProps} />);

        const uploadButton = screen.getByText('Upload Image');
        expect(uploadButton).toBeInTheDocument();
    });
});