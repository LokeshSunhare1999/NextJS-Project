import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ViewAssessmentDrawer from '../../../components/courses/ViewAssessmentDrawer';

describe('ViewAssessmentDrawer Component', () => {
    const mockToggleDrawer = jest.fn();
    const mockAssessmentObj = {
        assessmentTitle: 'Test Assessment',
        assessmentType: 'TEST_TYPE',
        assessmentDescription: 'This is a test assessment',
        passingPercent: 80,
        questions: [
            {
                questionText: 'What is the capital of France?',
                questionAudio: 'audio1.mp3',
                questionImage: 'image1.png',
                questionType: 'MULTIPLE_CHOICE',
                options: [
                    {
                        option: 'Paris',
                        imageLink: 'paris.png',
                        audioLink: 'paris_audio.mp3',
                        isCorrect: true,
                    },
                    {
                        option: 'London',
                        imageLink: 'london.png',
                        audioLink: 'london_audio.mp3',
                        isCorrect: false,
                    },
                ],
            },
        ],
    };

    const mockCourseData = {
        modules: [
            {
                subModules: [
                    {
                        _id: 'subModule1',
                        subModuleTitle: 'Sub Module 1',
                    },
                ],
            },
        ],
    };

    it('renders the drawer when open is true', () => {
        render(
            <ViewAssessmentDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                assessmentObj={mockAssessmentObj}
                courseData={mockCourseData}
            />,
        );
        const expectedTexts = [
            'Sub Module Assessment',
            'Test Assessment',
            'This is a test assessment',
        ]
        expectedTexts.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('does not render the drawer when open is false', () => {
        render(
            <ViewAssessmentDrawer
                open={false}
                toggleDrawer={mockToggleDrawer}
                assessmentObj={mockAssessmentObj}
                courseData={mockCourseData}
            />,
        );

        expect(screen.queryByText('Sub Module Assessment')).not.toBeInTheDocument();
    });

    it('calls toggleDrawer when close icon is clicked', () => {
        render(
            <ViewAssessmentDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                assessmentObj={mockAssessmentObj}
                courseData={mockCourseData}
            />,
        );

        const closeIcon = screen.getByAltText('close-drawer');
        fireEvent.click(closeIcon);
        expect(mockToggleDrawer).toHaveBeenCalledWith(false);
    });

    it('displays the correct question text and options', () => {
        render(
            <ViewAssessmentDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                assessmentObj={mockAssessmentObj}
                courseData={mockCourseData}
            />,
        );

        expect(screen.getByText(/Question 1./i)).toBeInTheDocument();
        expect(screen.getByText(/What is the capital of France?/i)).toBeInTheDocument();
        expect(screen.getByText(/Paris/i)).toBeInTheDocument();
        expect(screen.getByText(/London/i)).toBeInTheDocument();
    });

    it('displays the audio player when an audio icon is clicked', () => {
        render(
            <ViewAssessmentDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                assessmentObj={mockAssessmentObj}
                courseData={mockCourseData}
            />,
        );

        const audioIcon = screen.getAllByAltText('speaker')[0];
        fireEvent.click(audioIcon);
    });

    it('displays the correct image for the question', () => {
        render(
            <ViewAssessmentDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                assessmentObj={mockAssessmentObj}
                courseData={mockCourseData}
            />,
        );

        const questionImage = screen.getByAltText('ques-img');
        expect(questionImage).toHaveAttribute('src', 'image1.png');
    });

    it('displays the correct image for the answer options', () => {
        render(
            <ViewAssessmentDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                assessmentObj={mockAssessmentObj}
                courseData={mockCourseData}
            />,
        );

        const parisImage = screen.getByAltText('ans-1');
        const londonImage = screen.getByAltText('ans-2');
        expect(parisImage).toHaveAttribute('src', 'paris.png');
        expect(londonImage).toHaveAttribute('src', 'london.png');
    });

    it('displays the correct border for the correct answer', () => {
        render(
            <ViewAssessmentDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                assessmentObj={mockAssessmentObj}
                courseData={mockCourseData}
            />,
        );

        const correctAnswerImage = screen.getByAltText('ans-1');
        expect(correctAnswerImage).toHaveStyle('border: 2px solid #4BAE4F');
    });

    it('displays the correct passing percentage', () => {
        render(
            <ViewAssessmentDrawer
                open={true}
                toggleDrawer={mockToggleDrawer}
                assessmentObj={mockAssessmentObj}
                courseData={mockCourseData}
            />,
        );

        expect(screen.getByText('Passing Percent: 80')).toBeInTheDocument();
    });
});