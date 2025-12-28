import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptionsBlock from '../../../components/courses/OptionsBlock';
import * as useFileUploadHook from '../../../hooks/useFileUpload';
import { COURSE_MODULE, FILE_TYPES } from '../../../constants';


// Mock dependencies
jest.mock('../../../hooks/useFileUpload', () => ({
  __esModule: true,
  default: jest.fn()
}));

jest.mock('../../../constants', () => ({
  COURSE_MODULE: {
    OPTION_TYPES: {
      TEXT_IMAGE: 'text_image'
    }
  },
  FILE_TYPES: {
    AUDIO: 'audio',
    IMAGE: 'image'
  },
  MAX_IMAGE_API_TIMER: 30
}));

describe('OptionsBlock Component', () => {
  const mockProps = {
    idx: 0,
    optionsArray: [
      {
        option: 'Test Option',
        imageLink: '',
        audioLink: '',
        isCorrect: false
      }
    ],
    setOptionsArray: jest.fn(),
    itemValue: {
      option: 'Test Option',
      imageLink: '',
      audioLink: '',
      isCorrect: false
    },
    handleQuesArrayUpdate: jest.fn(),
    quesText: 'Test Question',
    quesType: 'multiple_choice',
    optionsType: COURSE_MODULE.OPTION_TYPES.TEXT_IMAGE,
    courseData: {
      _id: 'test-course-id'
    }
  };

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();

    // Mock useFileUpload hook
    useFileUploadHook.default.mockReturnValue({
      fileData: { showProgress: false },
      setFileData: jest.fn(),
    handleInputChange: jest.fn((event, fileType) => {
        // Simulate the file upload and update the audioLink
        const fileLink = 'test-audio-link';
        const updatedOptions = mockProps.optionsArray.map((option, index) => {
          if (index === mockProps.idx) {
            return {
              ...option,
              audioLink: fileLink
            };
          }
          return option;
        });
  
        mockProps.setOptionsArray(updatedOptions);
        mockProps.handleQuesArrayUpdate({
          ...mockProps,
          options: updatedOptions
        });
      }),
      abortUpload: jest.fn(),
      status: 'success',
      data: { fileLink: 'test-audio-link' }
    });
  });

  it('renders option input correctly', () => {
    render(<OptionsBlock {...mockProps} />);

    // Check option input
    const optionInput = screen.getByPlaceholderText('Option 1');
    expect(optionInput).toBeInTheDocument();
    expect(optionInput.value).toBe('Test Option');
  });

  it('handles option value change', () => {
    render(<OptionsBlock {...mockProps} />);

    const optionInput = screen.getByPlaceholderText('Option 1');
    fireEvent.change(optionInput, { target: { value: 'New Option' } });

    expect(mockProps.handleQuesArrayUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({ option: 'New Option' })
        ])
      })
    );
  });

  it('handles option deletion', () => {
    render(<OptionsBlock {...mockProps} />);

    const deleteIcon = screen.getAllByAltText('delete-option')[0];
    fireEvent.click(deleteIcon);

    expect(mockProps.setOptionsArray).toHaveBeenCalled();
    expect(mockProps.handleQuesArrayUpdate).toHaveBeenCalled();
  });

  it('handles clear option', () => {
    render(<OptionsBlock {...mockProps} />);

    const clearIcon = screen.getAllByAltText('delete-option')[1];
    fireEvent.click(clearIcon);

    const optionInput = screen.getByPlaceholderText('Option 1');
    expect(optionInput.value).toBe('');
  });

  it('handles correct answer checkbox', () => {
    render(<OptionsBlock {...mockProps} />);

    const correctCheckbox = screen.getByRole('checkbox');
    fireEvent.click(correctCheckbox);

    expect(mockProps.handleQuesArrayUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({ isCorrect: true })
        ])
      })
    );
  });

  it('renders file upload components for text-image option type', () => {
    render(<OptionsBlock {...mockProps} />);

    // Check for file upload components
    const uploadButtons = screen.getAllByText('Upload');
    expect(uploadButtons.length).toBe(2);
  });

  it('handles image upload', () => {
    const mockFileUploadHook = {
      fileData: { showProgress: true },
      setFileData: jest.fn(),
      handleInputChange: jest.fn(),
      abortUpload: jest.fn(),
      status: 'success',
      data: { fileLink: 'test-image-link' }
    };

    useFileUploadHook.default.mockReturnValueOnce(mockFileUploadHook);

    render(<OptionsBlock {...mockProps} />);

    // Simulate image upload
    const imageUploadButton = screen.getAllByText('Upload')[1];
    fireEvent.click(imageUploadButton);

    expect(mockProps.handleQuesArrayUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({ imageLink: 'test-image-link' })
        ])
      })
    );
  });

  it('handles audio upload', () => {
    const mockFileUploadHook = {
      fileData: { showProgress: true },
      setFileData: jest.fn(),
      handleInputChange: jest.fn(),
      abortUpload: jest.fn(),
      status: 'success',
      data: { fileLink: 'test-audio-link' }
    };

    useFileUploadHook.default.mockReturnValueOnce(mockFileUploadHook);

    render(<OptionsBlock {...mockProps} />);

    // Simulate audio upload
    const audioUploadButton = screen.getAllByText('Upload')[0];
    fireEvent.click(audioUploadButton);

    expect(mockProps.handleQuesArrayUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({ audioLink: 'test-audio-link' })
        ])
      })
    );
  });
});