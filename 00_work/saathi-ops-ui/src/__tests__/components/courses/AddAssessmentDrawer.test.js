import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddAssessmentDrawer from '../../../components/courses/AddAssessmentDrawer';
import { useSnackbar } from 'notistack';
import { COURSE_MODULE } from '../../../constants';

jest.mock('notistack', () => ({
    useSnackbar: jest.fn(),
}));

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

jest.mock('../../../apis/queryHooks', () => ({
    usePostAddAssessment: () => ({
        mutate: jest.fn(),
        status: 'idle',
        isError: false,
        error: null,
    }),
    usePutCourseAssessment: () => ({
        mutate: jest.fn(),
        status: 'idle',
        isError: false,
        error: null,
    }),
    useGetTestCategories: () => ({
        data: [],
    }),
}));

describe('AddAssessmentDrawer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockEnqueueSnackbar = jest.fn();
    const mockCloseSnackbar = jest.fn();

    beforeEach(() => {
        useSnackbar.mockImplementation(() => ({
            enqueueSnackbar: mockEnqueueSnackbar,
            closeSnackbar: mockCloseSnackbar,
        }));
    });

    const defaultProps = {
        open: true,
        toggleDrawer: jest.fn(),
        courseId: 'course123',
        courseSubModuleId: 'subModule123',
        handlePostAssessmenttSuccess: jest.fn(),
        isEditAssessment: false,
        setIsEditAssessment: jest.fn(),
        assessmentObj: {},
        courseData: {},
        globalData: {
            COURSE_SKILLS: ['Skill1', 'Skill2'],
            ASSESSMENT_CATEGORIES: ['CATEGORY_1', 'CATEGORY_2'],
        },
    };

    it('renders the drawer when open is true', () => {
        render(<AddAssessmentDrawer {...defaultProps} />);
        expect(screen.getByText(/Add Assessment/i)).toBeInTheDocument();
    });

    it('updates the title input field', () => {
        render(<AddAssessmentDrawer {...defaultProps} />);
        const titleInput = screen.getByPlaceholderText(/Add assessment title/i);
        fireEvent.change(titleInput, { target: { value: 'New Title' } });
        expect(titleInput.value).toBe('New Title');
    });

    it('updates the description input field', () => {
        render(<AddAssessmentDrawer {...defaultProps} />);
        const descriptionInput = screen.getByPlaceholderText(/Add assessment description/i);
        fireEvent.change(descriptionInput, { target: { value: 'New Description' } });
        expect(descriptionInput.value).toBe('New Description');
    });

    it('updates the passing percent input field', () => {
        render(<AddAssessmentDrawer {...defaultProps} />);
        const passingPercentInput = screen.getByPlaceholderText(/Add assessment passing percent/i);
        fireEvent.change(passingPercentInput, { target: { value: '80' } });
        expect(passingPercentInput.value).toBe('80');
    });

    it('calls the handleCloseDrawer function when the Cancel button is clicked', () => {
        render(<AddAssessmentDrawer {...defaultProps} />);
        const cancelButton = screen.getByText(/Cancel/i);
        fireEvent.click(cancelButton);
        expect(defaultProps.toggleDrawer).toHaveBeenCalledWith(false);
    });

    it('displays error messages when required fields are empty', async () => {
        render(<AddAssessmentDrawer {...defaultProps} />);
        const saveButton = screen.getByText(/Save/i);
        fireEvent.click(saveButton);

        await waitFor(() => {
            expect(screen.getByText('* Assessment category is required.')).toBeInTheDocument();
            expect(screen.getByText(`* Assessment description is required and should be less than ${COURSE_MODULE?.DESCRIPTION_MAX_LENGTH} characters.`)).toBeInTheDocument();
        });
    });
});