import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditModuleDrawer from '../../../components/courseDetail/EditModuleDrawer';
import useFileUpload from '../../../hooks/useFileUpload';

// Mock the icons
jest.mock('../../../assets/icons', () => ({
    CROSS_ICON: 'mock-cross-icon.svg',
    VIDEO_CAMERA_BLUE: 'mock-video-icon.svg',
    THUMBNAIL: 'mock-thumbnail-icon.svg',
}));

jest.mock('../../../components/CustomCTA', () => {
    return ({ title, onClick, isLoading }) => (
        <button
            data-testid={`cta-${title.toLowerCase()}`}
            onClick={onClick}
            disabled={isLoading}
        >
            {title}
        </button>
    );
});

jest.mock('../../../components/courses/FileUpload', () => {
    return ({ fileType, handleInputChange, handleInputDelete, uploadTitle }) => (
        <div data-testid={`file-upload-${fileType}`}>
            <span>{uploadTitle}</span>
            <input
                type="file"
                data-testid={`${fileType}-input`}
                onChange={handleInputChange}
            />
            <button
                data-testid={`${fileType}-delete`}
                onClick={() => handleInputDelete(fileType)}
            >
                Delete
            </button>
        </div>
    );
});

// Mock the useFileUpload hook
jest.mock('../../../hooks/useFileUpload', () => {
    return jest.fn();
});

// Mock helper functions
jest.mock('../../../utils/helper', () => ({
    truncateFileName: jest.fn(filename => filename),
    generateUploadFilePath: jest.fn(() => 'mock/upload/path'),
}));

describe('EditModuleDrawer Component', () => {
    const mockProps = {
        open: true,
        toggleDrawer: jest.fn(),
        moduleObj: {
            moduleTitle: 'Test Module',
            description: 'Test Description',
            videoUrl: 'https://example.com/video.mp4',
            imageUrl: 'https://example.com/image.jpg',
            videoStatus: 'COMPLETE',
        },
        setModuleObj: jest.fn(),
        handleCourseEditModule: jest.fn(),
        clearFields: jest.fn(),
        courseData: {
            _id: 'course123',
            courseTitle: 'Test Course',
        },
        editCourseModuleStatus: 'idle',
    };

    const mockImageFileUpload = {
        fileData: {
            file: null,
            showProgress: false,
            progress: 0,
        },
        setFileData: jest.fn(),
        handleInputChange: jest.fn(),
        abortUpload: jest.fn(),
        status: 'idle',
        isError: false,
        error: null,
        data: null,
        resetFileData: jest.fn(),
    };

    const mockVideoFileUpload = {
        fileData: {
            file: null,
            showProgress: false,
            progress: 0,
        },
        setFileData: jest.fn(),
        handleInputChange: jest.fn(),
        abortUpload: jest.fn(),
        status: 'idle',
        isError: false,
        error: null,
        data: null,
        resetFileData: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useFileUpload.mockImplementation((path, type) => {
            if (type === 'IMAGE') return mockImageFileUpload;
            if (type === 'VIDEO') return mockVideoFileUpload;
            return {};
        });
    });

    it('renders correctly when open', () => {
        render(<EditModuleDrawer {...mockProps} />);

        const elementsToCheck = [
            { type: 'text', value: 'Edit Module' },
            { type: 'placeholder', value: 'Add module name', expected: 'Test Module' },
            { type: 'placeholder', value: 'Add module description', expected: 'Test Description' },
            { type: 'testId', value: 'file-upload-video' },
            { type: 'testId', value: 'file-upload-image' },
            { type: 'testId', value: 'cta-cancel' },
            { type: 'testId', value: 'cta-save' }
        ];
    
        elementsToCheck.forEach(({ type, value, expected }) => {
            if (type === 'text') {
                expect(screen.getByText(value)).toBeInTheDocument();
            } else if (type === 'placeholder') {
                expect(screen.getByPlaceholderText(value)).toHaveValue(expected);
            } else if (type === 'testId') {
                expect(screen.getByTestId(value)).toBeInTheDocument();
            }
        });
    });

    it('updates moduleTitle when input changes', () => {
        render(<EditModuleDrawer {...mockProps} />);

        const titleInput = screen.getByPlaceholderText('Add module name');
        fireEvent.change(titleInput, { target: { value: 'Updated Module Title' } });

        expect(mockProps.setModuleObj).toHaveBeenCalledWith({
            ...mockProps.moduleObj,
            moduleTitle: 'Updated Module Title',
        });
    });

    it('updates description when textarea changes', () => {
        render(<EditModuleDrawer {...mockProps} />);

        const descriptionInput = screen.getByPlaceholderText('Add module description');
        fireEvent.change(descriptionInput, { target: { value: 'Updated description text' } });

        expect(mockProps.setModuleObj).toHaveBeenCalledWith({
            ...mockProps.moduleObj,
            description: 'Updated description text',
        });
    });

    it('calls handleCourseEditModule when Save button is clicked', () => {
        render(<EditModuleDrawer {...mockProps} />);

        const saveButton = screen.getByTestId('cta-save');
        fireEvent.click(saveButton);

        expect(mockProps.handleCourseEditModule).toHaveBeenCalled();
        expect(mockImageFileUpload.resetFileData).toHaveBeenCalled();
        expect(mockVideoFileUpload.resetFileData).toHaveBeenCalled();
    });

    it('calls toggleDrawer, clearFields, and resetFileData when Cancel button is clicked', () => {
        render(<EditModuleDrawer {...mockProps} />);

        const cancelButton = screen.getByTestId('cta-cancel');
        fireEvent.click(cancelButton);

        expect(mockProps.toggleDrawer).toHaveBeenCalledWith(false);
        expect(mockProps.clearFields).toHaveBeenCalled();
        expect(mockImageFileUpload.resetFileData).toHaveBeenCalled();
        expect(mockVideoFileUpload.resetFileData).toHaveBeenCalled();
    });

    it('calls toggleDrawer, clearFields, and resetFileData when close icon is clicked', () => {
        render(<EditModuleDrawer {...mockProps} />);

        // Since we mocked the icon as an img, we can select by alt text or role
        const closeIcon = screen.getByRole('img');
        fireEvent.click(closeIcon);

        expect(mockProps.toggleDrawer).toHaveBeenCalledWith(false);
        expect(mockProps.clearFields).toHaveBeenCalled();
        expect(mockImageFileUpload.resetFileData).toHaveBeenCalled();
        expect(mockVideoFileUpload.resetFileData).toHaveBeenCalled();
    });

    it('updates moduleObj with imageUrl when image upload succeeds', async () => {
        const successfulImageUpload = {
            ...mockImageFileUpload,
            status: 'success',
            data: { fileLink: 'https://example.com/new-image.jpg' },
        };

        useFileUpload.mockImplementation((path, type) => {
            if (type === 'IMAGE') return successfulImageUpload;
            if (type === 'VIDEO') return mockVideoFileUpload;
            return {};
        });

        render(<EditModuleDrawer {...mockProps} />);

        await waitFor(() => {
            expect(mockProps.setModuleObj).toHaveBeenCalledWith({
                ...mockProps.moduleObj,
                imageUrl: 'https://example.com/new-image.jpg',
            });
        });
    });

    it('updates moduleObj with videoUrl when video upload succeeds', async () => {
        const successfulVideoUpload = {
            ...mockVideoFileUpload,
            status: 'success',
            data: { fileLink: 'https://example.com/new-video.mp4' },
        };

        useFileUpload.mockImplementation((path, type) => {
            if (type === 'IMAGE') return mockImageFileUpload;
            if (type === 'VIDEO') return successfulVideoUpload;
            return {};
        });

        render(<EditModuleDrawer {...mockProps} />);

        await waitFor(() => {
            expect(mockProps.setModuleObj).toHaveBeenCalledWith({
                ...mockProps.moduleObj,
                videoUrl: 'https://example.com/new-video.mp4',
            });
        });
    });

    it('disables Save button when uploads are pending', () => {
        const pendingUpload = {
            ...mockImageFileUpload,
            status: 'pending',
        };

        useFileUpload.mockImplementation((path, type) => {
            if (type === 'IMAGE') return pendingUpload;
            if (type === 'VIDEO') return mockVideoFileUpload;
            return {};
        });

        render(<EditModuleDrawer {...mockProps} />);

        const saveButton = screen.getByTestId('cta-save');
        expect(saveButton).toBeDisabled();
    });

    it('handles file deletion correctly', () => {
        render(<EditModuleDrawer {...mockProps} />);

        const videoDeleteButton = screen.getByTestId('video-delete');
        fireEvent.click(videoDeleteButton);

        expect(mockVideoFileUpload.setFileData).toHaveBeenCalled();

        const imageDeleteButton = screen.getByTestId('image-delete');
        fireEvent.click(imageDeleteButton);

        expect(mockImageFileUpload.setFileData).toHaveBeenCalled();
    });

    it('disables Save button when editCourseModuleStatus is pending', () => {
        const updatedProps = {
            ...mockProps,
            editCourseModuleStatus: 'pending',
        };

        render(<EditModuleDrawer {...updatedProps} />);

        const saveButton = screen.getByTestId('cta-save');
        expect(saveButton).toBeDisabled();
    });
});