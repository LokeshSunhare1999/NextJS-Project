import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentFileUpload from '../../../components/verification/DocumentFileUpload';
import { FILE_TYPES } from '../../../constants';
import ICONS from '../../../assets/icons';

jest.mock('../../../constants', () => ({
  FILE_TYPES: {
    IMAGE: 'image',
    AUDIO: 'audio',
    VIDEO: 'video'
  },
  MAX_FILENAME_LENGTH: 20
}));

jest.mock('../../../assets/icons', () => ({
  THUMBNAIL_WHITE: 'thumbnail-white-icon',
  SPEAKER_WHITE: 'speaker-white-icon',
  VIDEO_CAMERA_WHITE: 'video-camera-white-icon',
  CROSS_BUTTON_WHITE: 'cross-button-white-icon',
  DELETE_ICON: 'delete-icon',
  CROSS_ICON: 'cross-icon'
}));

describe('DocumentFileUpload Component', () => {
  const mockProps = {
    fileData: {
      fileName: 'test-file.pdf',
      showProgress: true,
      uploaded: false
    },
    fileType: FILE_TYPES.IMAGE,
    acceptType: '.pdf,.png,.jpg',
    handleInputChange: jest.fn(),
    handleInputDelete: jest.fn(),
    abortUpload: jest.fn(),
    maxApiTimer: 100
  };

  it('renders placeholder when showEmptyProgress is true', () => {
    render(<DocumentFileUpload {...mockProps} showEmptyProgress={true} />);
    
    expect(screen.getByText(/Please Upload the document/i)).toBeInTheDocument();
  });

  it('renders upload progress for non-uploaded file', () => {
    render(<DocumentFileUpload {...mockProps} />);
    
    expect(screen.getByText('test-file.pdf')).toBeInTheDocument();
    expect(screen.getByAltText('delete-icon')).toHaveAttribute('src', ICONS.CROSS_ICON);
  });

  it('renders uploaded state with delete option', () => {
    const uploadedProps = {
      ...mockProps,
      fileData: {
        ...mockProps.fileData,
        uploaded: true
      }
    };

    render(<DocumentFileUpload {...uploadedProps} />);
    
    expect(screen.getByText('test-file.pdf')).toBeInTheDocument();
    expect(screen.getByAltText('delete-icon')).toHaveAttribute('src', ICONS.DELETE_ICON);
  });

  it('calls handleInputDelete when delete icon is clicked for uploaded file', () => {
    const uploadedProps = {
      ...mockProps,
      fileData: {
        ...mockProps.fileData,
        uploaded: true
      }
    };

    render(<DocumentFileUpload {...uploadedProps} />);
    
    const deleteIcon = screen.getByAltText('delete-icon');
    fireEvent.click(deleteIcon);

    expect(uploadedProps.handleInputDelete).toHaveBeenCalledWith(FILE_TYPES.IMAGE);
  });

  it('calls abortUpload when cross icon is clicked for non-uploaded file', () => {
    render(<DocumentFileUpload {...mockProps} />);
    
    const crossIcon = screen.getByAltText('delete-icon');
    fireEvent.click(crossIcon);

    expect(mockProps.abortUpload).toHaveBeenCalled();
  });

  it('renders processing state', () => {
    render(<DocumentFileUpload {...mockProps} isProcessing={true} />);
    
    expect(screen.getByText('Video Processing')).toBeInTheDocument();
  });

  it('renders uploaded data with secondary icon', () => {
    const uploadDataProps = {
      ...mockProps,
      fileData: {
        fileName: '',
        showProgress: false,
        uploaded: false
      },
      uploadData: 'test-upload.jpg',
      tempDelete: false
    };

    render(<DocumentFileUpload {...uploadDataProps} />);
    
    expect(screen.getByAltText('thumbnail')).toHaveAttribute('src', ICONS.THUMBNAIL_WHITE);
    expect(screen.getByText(/test-upload.jpg/i)).toBeInTheDocument();
  });

  it('component accepts correct prop types', () => {
    const propTypes = DocumentFileUpload.propTypes;
    
    expect(propTypes).toBeDefined();
    expect(propTypes.fileData).toBeDefined();
    expect(propTypes.fileType).toBeDefined();
    expect(propTypes.acceptType).toBeDefined();
  });
});