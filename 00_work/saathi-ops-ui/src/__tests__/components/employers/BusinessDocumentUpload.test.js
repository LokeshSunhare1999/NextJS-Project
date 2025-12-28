import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { enqueueSnackbar } from 'notistack';
import '@testing-library/jest-dom';
import { FILE_TYPES } from '../../../constants';
import BusinessDocumentUpload from '../../../components/employers/BusinessDocumentUpload';
import useFileUpload from '../../../hooks/useFileUpload';
import { generateUploadFilePath } from '../../../utils/helper';

jest.mock('notistack', () => ({
    enqueueSnackbar: jest.fn(),
}));

jest.mock('../../../hooks/useFileUpload', () => jest.fn());

jest.mock('../../../utils/helper', () => ({
    generateAlphaNumericString: jest.fn(() => 'mock-id'),
    generateUploadFilePath: jest.fn(() => 'mock-path'),
}));

jest.mock('../../../components/courses/FileUpload', () => {
    return function MockFileUpload(props) {
        return (
            <div data-testid="file-upload">
                <button
                    data-testid="upload-button"
                    onClick={() => props.handleInputChange({ target: { files: [new File(['test'], 'test.jpg', { type: 'image/jpeg' })] } })}
                >
                    Upload
                </button>
                <button
                    data-testid="delete-button"
                    onClick={props.handleInputDelete}
                >
                    Delete
                </button>
                <div data-testid="upload-title">{props.uploadTitle}</div>
                <div data-testid="file-type">{props.fileType}</div>
                <div data-testid="accept-type">{props.acceptType}</div>
                {props.uploadData && <div data-testid="upload-data">{props.uploadData}</div>}
            </div>
        );
    };
});

describe('BusinessDocumentUpload Component', () => {
    const defaultProps = {
        fieldKey: 'test',
        fieldUrlKey: 'testUrl',
        uploadTitle: 'Test Upload',
        acceptType: 'image/png',
        data: {},
        setData: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
        useFileUpload.mockReturnValue({
            fileData: null,
            setFileData: jest.fn(),
            handleInputChange: jest.fn(),
            abortUpload: jest.fn(),
            status: 'idle',
            isError: false,
            error: null,
            data: null,
            resetFileData: jest.fn(),
        });
    });

    test('renders with default props', () => {
        render(<BusinessDocumentUpload {...defaultProps} />);

        expect(screen.getByTestId('file-upload')).toBeInTheDocument();
        expect(screen.getByTestId('upload-title')).toHaveTextContent('Test Upload');
        expect(screen.getByTestId('file-type')).toHaveTextContent(FILE_TYPES.IMAGE);
        expect(screen.getByTestId('accept-type')).toHaveTextContent('image/png');
    });

    test('renders with default upload title when not provided', () => {
        const props = {
            ...defaultProps,
            uploadTitle: undefined,
        };

        render(<BusinessDocumentUpload {...props} />);

        expect(screen.getByTestId('upload-title')).toHaveTextContent('Upload Document');
    });

    test('renders with default accept type when not provided', () => {
        const props = {
            ...defaultProps,
            acceptType: undefined,
        };

        render(<BusinessDocumentUpload {...props} />);

        expect(screen.getByTestId('accept-type')).toHaveTextContent('image/png, image/jpeg, image/jpg, application/pdf');
    });

    test('initializes with correct parameters', () => {
        render(<BusinessDocumentUpload {...defaultProps} />);

        expect(generateUploadFilePath).toHaveBeenCalledWith('test_DOC', 'mock-id', FILE_TYPES.IMAGE);
        expect(useFileUpload).toHaveBeenCalledWith('mock-path', FILE_TYPES.IMAGE.toUpperCase());
    });

    test('updates data when upload is successful', async () => {
        useFileUpload.mockReturnValue({
            fileData: { name: 'test.jpg' },
            setFileData: jest.fn(),
            handleInputChange: jest.fn(),
            abortUpload: jest.fn(),
            status: 'success',
            isError: false,
            error: null,
            data: { fileLink: 'http://example.com/test.jpg' },
            resetFileData: jest.fn(),
        });

        render(<BusinessDocumentUpload {...defaultProps} />);

        await waitFor(() => {
            expect(defaultProps.setData).toHaveBeenCalledWith(expect.any(Function));
        });

        const setDataCallback = defaultProps.setData.mock.calls[0][0];
        const result = setDataCallback({ prevData: 'value' });

        expect(result).toEqual({ prevData: 'value', testUrl: 'http://example.com/test.jpg' });
    });

    test('shows error snackbar when upload fails', async () => {
        useFileUpload.mockReturnValue({
            fileData: { name: 'test.jpg' },
            setFileData: jest.fn(),
            handleInputChange: jest.fn(),
            abortUpload: jest.fn(),
            status: 'error',
            isError: true,
            error: 'Upload failed',
            data: null,
            resetFileData: jest.fn(),
        });

        render(<BusinessDocumentUpload {...defaultProps} />);

        await waitFor(() => {
            expect(enqueueSnackbar).toHaveBeenCalledWith('Failed to upload document.', {
                variant: 'error',
            });
        });
    });

    test('handles file deletion', async () => {
        const mockResetFileData = jest.fn();
        useFileUpload.mockReturnValue({
            fileData: { name: 'test.jpg' },
            setFileData: jest.fn(),
            handleInputChange: jest.fn(),
            abortUpload: jest.fn(),
            status: 'idle',
            isError: false,
            error: null,
            data: null,
            resetFileData: mockResetFileData,
        });

        render(<BusinessDocumentUpload {...defaultProps} />);

        fireEvent.click(screen.getByTestId('delete-button'));

        expect(mockResetFileData).toHaveBeenCalled();

        await waitFor(() => {
            expect(defaultProps.setData).toHaveBeenCalledWith(expect.any(Function));
        });

        const setDataCallback = defaultProps.setData.mock.calls[0][0];
        const result = setDataCallback({ prevData: 'value' });

        expect(result).toEqual({ prevData: 'value', testUrl: '' });
    });

    test('handles file upload', () => {
        const mockHandleInputChange = jest.fn();
        useFileUpload.mockReturnValue({
            fileData: null,
            setFileData: jest.fn(),
            handleInputChange: mockHandleInputChange,
            abortUpload: jest.fn(),
            status: 'idle',
            isError: false,
            error: null,
            data: null,
            resetFileData: jest.fn(),
        });

        render(<BusinessDocumentUpload {...defaultProps} />);

        fireEvent.click(screen.getByTestId('upload-button'));

        expect(mockHandleInputChange).toHaveBeenCalledWith(
            expect.objectContaining({
                target: expect.objectContaining({
                    files: expect.arrayContaining([
                        expect.objectContaining({
                            name: 'test.jpg',
                        }),
                    ]),
                }),
            }),
            FILE_TYPES.IMAGE
        );
    });

    test('renders with existing upload data', () => {
        const propsWithData = {
            ...defaultProps,
            data: { testUrl: 'http://example.com/existing.jpg' },
        };

        render(<BusinessDocumentUpload {...propsWithData} />);

        expect(screen.getByTestId('upload-data')).toHaveTextContent('http://example.com/existing.jpg');
    });
});