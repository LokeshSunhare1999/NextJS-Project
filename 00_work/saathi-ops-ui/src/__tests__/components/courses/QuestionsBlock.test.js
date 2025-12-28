import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionsBlock from '../../../components/courses/QuestionsBlock';
import { COURSE_MODULE } from '../../../constants';

// Mock the necessary dependencies
jest.mock('../../../hooks/useFileUpload', () => ({
    __esModule: true,
    default: () => ({
        fileData: {},
        setFileData: jest.fn(),
        handleInputChange: jest.fn(),
        abortUpload: jest.fn(),
        status: 'idle',
        isError: false,
        error: null,
        data: null,
        resetFileData: jest.fn(),
    }),
}));

jest.mock('../../../components/DropDownCategory', () => ({
    __esModule: true,
    default: ({ category, handleCategorySelect, listItem }) => (
        <div data-testid="dropdown-category">
            {listItem.map((item, idx) => (
                <div key={idx} onClick={() => handleCategorySelect(item)}>
                    {item}
                </div>
            ))}
        </div>
    ),
}));

jest.mock('../../../components/courses/FileUpload', () => ({
    __esModule: true,
    default: ({ uploadTitle }) => <div data-testid="file-upload">{uploadTitle}</div>,
}));

jest.mock('../../../components/courses/OptionsBlock', () => ({
    __esModule: true,
    default: () => <div data-testid="options-block">OptionsBlock</div>,
}));

describe('QuestionsBlock Component', () => {
    const mockProps = {
        quesIdx: 0,
        quesItem: {
            questionType: 'MULTIPLE_CHOICE',
            psychometricTrait: '',
            questionText: '',
            questionImage: '',
            questionAudio: '',
            optionsType: COURSE_MODULE.OPTION_TYPES.TEXT,
            questionSubModuleId: '',
            options: [],
        },
        quesArray: [],
        setQuesArray: jest.fn(),
        courseData: { _id: 'course123' },
        assessmentCategory: 'COURSE_LEVEL',
        subModuleList: [],
        globalData: { PSYCHOMETRIC_TRAIT: ['Trait1', 'Trait2'] },
    };

    it('renders without crashing', () => {
        render(<QuestionsBlock {...mockProps} />);
        expect(screen.getByText('Questions Section 1.')).toBeInTheDocument();
    });

    it('renders the question input field', () => {
        render(<QuestionsBlock {...mockProps} />);
        const questionInput = screen.getByPlaceholderText('Question');
        expect(questionInput).toBeInTheDocument();
    });

    it('updates the question text on input change', () => {
        render(<QuestionsBlock {...mockProps} />);
        const questionInput = screen.getByPlaceholderText('Question');
        fireEvent.change(questionInput, { target: { value: 'New Question' } });
        expect(questionInput.value).toBe('New Question');
    });

    it('renders the file upload components', () => {
        render(<QuestionsBlock {...mockProps} />);
        const fileUploads = screen.getAllByTestId('file-upload');
        expect(fileUploads.length).toBe(2);
    });

    it('renders the options block for each option', () => {
        const optionsArray = [{ option: 'Option 1', isCorrect: false }];
        render(
            <QuestionsBlock
                {...mockProps}
                quesItem={{ ...mockProps.quesItem, options: optionsArray }}
            />,
        );
        const optionsBlocks = screen.getAllByTestId('options-block');
        expect(optionsBlocks.length).toBe(optionsArray.length);
    });

    it('adds a new option when the add option button is clicked', () => {
        render(<QuestionsBlock {...mockProps} />);
        const addOptionButton = screen.getByText('Add Option');
        fireEvent.click(addOptionButton);
        expect(mockProps.setQuesArray).toHaveBeenCalled();
    });

    it('deletes the question when the delete icon is clicked', () => {
        render(<QuestionsBlock {...mockProps} />);
        const deleteIcon = screen.getByAltText('delete-answer');
        fireEvent.click(deleteIcon);
        expect(mockProps.setQuesArray).toHaveBeenCalled();
    });
});