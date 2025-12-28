import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import EditAssessmentsDrawer from '../../../components/tests/EditAssessmentsDrawer';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock data for testing
const mockAssessmentObj = {
    _id: 'test-assessment-id',
    assessmentName: 'Sample Assessment',
    assessmentDescription: 'This is a test assessment',
    questions: [
        {
            _id: 'question1',
            questionText: 'What is front office work?',
            options: ['Answer A', 'Answer B', 'Both']
        },
        {
            _id: 'question2',
            questionText: 'What is delivery job?',
            options: ['Answer A', 'Answer B', 'Both']
        }
    ]
};

const createTestQueryClient = () =>
    new QueryClient({
        defaultOptions: {
            queries: {
                retry: false, // Disable retries for testing
            },
        },
    });

// Custom render function that includes QueryClientProvider
const renderWithQueryClient = (ui, options) => {
    const testQueryClient = createTestQueryClient();

    const Wrapper = ({ children }) => (
        <QueryClientProvider client={testQueryClient}>
            {children}
        </QueryClientProvider>
    );

    return render(ui, { wrapper: Wrapper, ...options });
};

describe('EditAssessmentsDrawer Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    // Mocked props
    const mockProps = {
        open: true,
        toggleDrawer: jest.fn(),
        assessmentObj: mockAssessmentObj,
        handleUpdateAssessment: jest.fn(),
        updateAssessmentStatus: 'idle'
    };

    it('renders the drawer with assessment details', () => {
        renderWithQueryClient(
            <EditAssessmentsDrawer {...mockProps} />
        );

        expect(screen.getByText('Sample Assessment')).toBeInTheDocument();

        expect(screen.getByText('This is a test assessment')).toBeInTheDocument();

        expect(screen.getByText('Edit Assessment')).toBeInTheDocument();
    });

    it('renders all questions from the assessment', () => {
        renderWithQueryClient(
            <EditAssessmentsDrawer {...mockProps} />
        );

        expect(screen.getByText('What is front office work?')).toBeInTheDocument();
        expect(screen.getByText('What is delivery job?')).toBeInTheDocument();
    });

    it('calls handleUpdateAssessment when save button is clicked', () => {
        renderWithQueryClient(
            <EditAssessmentsDrawer {...mockProps} />
        );

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        expect(mockProps.handleUpdateAssessment).toHaveBeenCalledWith({
            ...mockAssessmentObj,
            questions: mockAssessmentObj.questions
        });
    });

    it('calls toggleDrawer when close action is triggered', () => {
        renderWithQueryClient(
            <EditAssessmentsDrawer {...mockProps} />
        );

        const closeButton = screen.getByText(/Cancel/i);
        fireEvent.click(closeButton);

        expect(mockProps.toggleDrawer).toHaveBeenCalledWith(false);
    });

    it('handles empty questions array', () => {
        const emptyQuestionsProps = {
            ...mockProps,
            assessmentObj: {
                ...mockAssessmentObj,
                questions: []
            }
        };

        render(<EditAssessmentsDrawer {...emptyQuestionsProps} />);

        expect(screen.getByText('Sample Assessment')).toBeInTheDocument();
    });

    it('updates questions when assessmentObj changes', () => {

        const updatedAssessmentObj = {
            ...mockAssessmentObj,
            questions: [
                ...mockAssessmentObj.questions,
                {
                    _id: 'question3',
                    questionText: 'New Question',
                    options: ['Option 1', 'Option 2']
                }
            ]
        };
        renderWithQueryClient(
            <EditAssessmentsDrawer {...mockProps} assessmentObj={updatedAssessmentObj} />
        );

        expect(screen.getByText('New Question')).toBeInTheDocument();
    });
});