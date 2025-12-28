import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditSubModuleDrawer from '../../../components/courseDetail/EditSubModuleDrawer';
import useFileUpload from '../../../hooks/useFileUpload';
import { VIDEO_UPLOAD_STATUS } from '../../../constants';

// Mock the icons 
jest.mock('../../../assets/icons', () => ({
    CROSS_ICON: 'mock-cross-icon.svg',
    VIDEO_CAMERA_BLUE: 'mock-video-icon.svg',
    THUMBNAIL: 'mock-thumbnail-icon.svg',
    GREEN_TICK: 'mock-green-tick.svg',
    RED_CROSS: 'mock-red-cross.svg',
    YELLOW_INFO: 'mock-yellow-info.svg'
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
    return ({ fileType, handleInputChange, handleInputDelete, uploadTitle, tempDelete, setTempDelete }) => (
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
            <button
                data-testid={`${fileType}-toggle-delete`}
                onClick={() => setTempDelete(!tempDelete)}
            >
                Toggle Delete
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
    generateUploadFilePath: jest.fn(() => 'mock/upload/path'),
    shortenStringAfterMediaType: jest.fn(url => 'shortened_filename')
}));

// Mock the zIndexValues
jest.mock('../../../style', () => ({
    zIndexValues: {
        EDIT_MODULE_DRAWER: 1000
    }
}));

describe('EditSubModuleDrawer Component', () => {
    const mockProps = {
        open: true,
        toggleDrawer: jest.fn(),
        courseId: 'course123',
        courseSubModuleId: 'submodule123',
        subModuleObj: {
            subModuleTitle: 'Test SubModule',
            description: 'Test SubModule Description',
            videoUrl: 'https://example.com/video.mp4',
            imageUrl: 'https://example.com/image.jpg',
            videoStatus: 'COMPLETE',
        },
        setSubModuleObj: jest.fn(),
        handleCourseEditSubModule: jest.fn(),
        editSubmoduleStatus: 'idle',
        isViewSubmodule: false,
        courseData: {
            _id: 'course123',
            courseTitle: 'Test Course',
        },
        subModuleData: {
            videoUrl: 'https://example.com/video.mp4',
            imageUrl: 'https://example.com/image.jpg',
            videoStatus: 'COMPLETE',
        },
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

    it('renders correctly in edit mode', () => {
        render(<EditSubModuleDrawer {...mockProps} />);

        const elementsToCheck = [
            { type: 'text', value: 'Edit Sub Module' },
            { type: 'placeholder', value: 'Add sub-module name', expected: 'Test SubModule' },
            { type: 'placeholder', value: 'Add sub-module description', expected: 'Test SubModule Description' },
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

    it('renders correctly in view mode', () => {
        const viewProps = { ...mockProps, isViewSubmodule: true };
        render(<EditSubModuleDrawer {...viewProps} />);

        // In view mode, we should see the submodule title as header
        expect(screen.getByText('Test SubModule')).toBeInTheDocument();
        // Shouldn't have the input field
        expect(screen.queryByPlaceholderText('Add sub-module name')).not.toBeInTheDocument();
        // Should display description but not as an editable field
        expect(screen.getByText('Description')).toBeInTheDocument();
        // No save/cancel buttons in view mode
        expect(screen.queryByTestId('cta-cancel')).not.toBeInTheDocument();
        expect(screen.queryByTestId('cta-save')).not.toBeInTheDocument();
    });

    it('updates subModuleTitle when input changes', () => {
        render(<EditSubModuleDrawer {...mockProps} />);

        const titleInput = screen.getByPlaceholderText('Add sub-module name');
        fireEvent.change(titleInput, { target: { value: 'Updated SubModule Title' } });

        expect(mockProps.setSubModuleObj).toHaveBeenCalledWith({
            ...mockProps.subModuleObj,
            subModuleTitle: 'Updated SubModule Title',
        });
    });

    it('updates description when textarea changes', () => {
        render(<EditSubModuleDrawer {...mockProps} />);

        const descriptionInput = screen.getByPlaceholderText('Add sub-module description');
        fireEvent.change(descriptionInput, { target: { value: 'Updated description text' } });

        expect(mockProps.setSubModuleObj).toHaveBeenCalledWith({
            ...mockProps.subModuleObj,
            description: 'Updated description text',
        });
    });

    it('calls handleCourseEditSubModule when Save button is clicked', () => {
        render(<EditSubModuleDrawer {...mockProps} />);

        const saveButton = screen.getByTestId('cta-save');
        fireEvent.click(saveButton);

        expect(mockProps.handleCourseEditSubModule).toHaveBeenCalled();
        expect(mockImageFileUpload.resetFileData).toHaveBeenCalled();
        expect(mockVideoFileUpload.resetFileData).toHaveBeenCalled();
    });

    it('calls toggleDrawer and resets file data when Cancel button is clicked', () => {
        render(<EditSubModuleDrawer {...mockProps} />);

        const cancelButton = screen.getByTestId('cta-cancel');
        fireEvent.click(cancelButton);

        expect(mockProps.toggleDrawer).toHaveBeenCalledWith(false);
        expect(mockImageFileUpload.resetFileData).toHaveBeenCalled();
        expect(mockVideoFileUpload.resetFileData).toHaveBeenCalled();
    });

    it('calls toggleDrawer and resets file data when close icon is clicked', () => {
        render(<EditSubModuleDrawer {...mockProps} />);

        const closeIcon = screen.getByRole('img');
        fireEvent.click(closeIcon);

        expect(mockProps.toggleDrawer).toHaveBeenCalledWith(false);
        expect(mockImageFileUpload.resetFileData).toHaveBeenCalled();
        expect(mockVideoFileUpload.resetFileData).toHaveBeenCalled();
    });

    it('updates subModuleObj when image upload succeeds', async () => {
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

        render(<EditSubModuleDrawer {...mockProps} />);

        await waitFor(() => {
            expect(mockProps.setSubModuleObj).toHaveBeenCalledWith({
                ...mockProps.subModuleObj,
                imageUrl: 'https://example.com/new-image.jpg',
            });
        });
    });

    it('updates subModuleObj when video upload succeeds', async () => {
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

        render(<EditSubModuleDrawer {...mockProps} />);

        await waitFor(() => {
            expect(mockProps.setSubModuleObj).toHaveBeenCalledWith({
                ...mockProps.subModuleObj,
                videoUrl: 'https://example.com/new-video.mp4',
            });
        });
    });

    it('clears imageUrl when tempImageDelete is true', async () => {
        render(<EditSubModuleDrawer {...mockProps} />);

        const imageToggleDelete = screen.getByTestId('image-toggle-delete');
        fireEvent.click(imageToggleDelete);

        await waitFor(() => {
            expect(mockProps.setSubModuleObj).toHaveBeenCalledWith({
                ...mockProps.subModuleObj,
                imageUrl: '',
            });
        });
    });

    it('clears videoUrl when tempVideoDelete is true', async () => {
        render(<EditSubModuleDrawer {...mockProps} />);

        const videoToggleDelete = screen.getByTestId('video-toggle-delete');
        fireEvent.click(videoToggleDelete);

        await waitFor(() => {
            expect(mockProps.setSubModuleObj).toHaveBeenCalledWith({
                ...mockProps.subModuleObj,
                videoUrl: '',
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

        render(<EditSubModuleDrawer {...mockProps} />);

        const saveButton = screen.getByTestId('cta-save');
        expect(saveButton).toBeDisabled();
    });

    it('disables Save button when editSubmoduleStatus is pending', () => {
        const updatedProps = {
            ...mockProps,
            editSubmoduleStatus: 'pending',
        };

        render(<EditSubModuleDrawer {...updatedProps} />);

        const saveButton = screen.getByTestId('cta-save');
        expect(saveButton).toBeDisabled();
    });

    it('handles file deletion correctly', () => {
        render(<EditSubModuleDrawer {...mockProps} />);

        const videoDeleteButton = screen.getByTestId('video-delete');
        fireEvent.click(videoDeleteButton);

        expect(mockVideoFileUpload.setFileData).toHaveBeenCalled();

        const imageDeleteButton = screen.getByTestId('image-delete');
        fireEvent.click(imageDeleteButton);

        expect(mockImageFileUpload.setFileData).toHaveBeenCalled();
    });

    it('shows correct video processing status text', () => {
        const processingProps = {
            ...mockProps,
            isViewSubmodule: true,
            subModuleObj: {
                ...mockProps.subModuleObj,
                videoStatus: VIDEO_UPLOAD_STATUS.IN_PROGRESS
            }
        };

        render(<EditSubModuleDrawer {...processingProps} />);

        expect(screen.getByText('Video is being processed')).toBeInTheDocument();
    });

    it('shows correct video uploaded status text', () => {
        const viewProps = {
            ...mockProps,
            isViewSubmodule: true
        };

        render(<EditSubModuleDrawer {...viewProps} />);

        expect(screen.getByText('Video Uploaded: shortened_filename')).toBeInTheDocument();
    });

    it('shows correct video not uploaded status text', () => {
        const noVideoProps = {
            ...mockProps,
            isViewSubmodule: true,
            subModuleObj: {
                ...mockProps.subModuleObj,
                videoUrl: ''
            }
        };

        render(<EditSubModuleDrawer {...noVideoProps} />);

        expect(screen.getByText('Video Not Uploaded')).toBeInTheDocument();
    });
});