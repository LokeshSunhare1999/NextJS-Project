import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TestQuestionsBlock from '../../../components/tests/TestQuestionsBlock';

// Mock the useFileUpload hook globally
jest.mock('../../../hooks/useFileUpload', () => {
    return jest.fn(() => ({
        fileData: {},
        setFileData: jest.fn(),
        handleInputChange: jest.fn(),
        abortUpload: jest.fn(),
        status: 'idle',
        isError: false,
        error: null,
        data: null,
        resetFileData: jest.fn(),
    }));
});

describe('TestQuestionsBlock Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockQuestion = {
        _id: 'question1',
        questionText: 'What is React?',
        questionAudio: '',
        options: [
            { _id: 'opt1', optionText: 'A library', isCorrect: true },
            { _id: 'opt2', optionText: 'A framework', isCorrect: false },
            { _id: 'opt3', optionText: 'Both', isCorrect: false }
        ]
    };

    const mockProps = {
        question: mockQuestion,
        quesIdx: 0,
        assessmentId: 'assessment1',
        quesArray: [mockQuestion],
        setQuesArray: jest.fn()
    };

    it('renders question details correctly', () => {
        render(<TestQuestionsBlock {...mockProps} />);

        expect(screen.getByText('What is React?')).toBeInTheDocument();

        expect(screen.getByText('Question 1.')).toBeInTheDocument();

        expect(screen.getByText('1. A library')).toBeInTheDocument();
        expect(screen.getByText('2. A framework')).toBeInTheDocument();
        expect(screen.getByText('3. Both')).toBeInTheDocument();
    });

    it('displays correct option color based on isCorrect', () => {
        render(<TestQuestionsBlock {...mockProps} />);

        const correctOption = screen.getByText('1. A library');
        expect(correctOption).toHaveStyle({ color: '#4BAE4F' });

        const otherOptions = screen.getByText('2. A framework');
        expect(otherOptions).toHaveStyle({ color: '#000' });
    });

    it('renders audio upload component', () => {
        render(<TestQuestionsBlock {...mockProps} />);

        expect(screen.getByText('Upload Question Audio')).toBeInTheDocument();
    });

    it('renders with minimal props', () => {
        const minimalProps = {
            question: {
                questionText: 'Minimal Question',
                options: []
            },
            quesIdx: 0,
            assessmentId: ''
        };

        render(<TestQuestionsBlock {...minimalProps} />);

        expect(screen.getByText('Minimal Question')).toBeInTheDocument();
        expect(screen.getByText('Question 1.')).toBeInTheDocument();
    });
});