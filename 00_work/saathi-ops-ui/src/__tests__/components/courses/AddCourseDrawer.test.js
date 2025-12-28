import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddCourseDrawer from '../../../components/courses/AddCourseDrawer';
import '@testing-library/jest-dom';
import * as useFileUploadHook from '../../../hooks/useFileUpload';

jest.mock('../../../hooks/useFileUpload', () => ({
    __esModule: true,
    default: jest.fn()
}));

jest.mock('../../../constants', () => ({
    FILE_TYPES: {
        IMAGE: 'image',
        VIDEO: 'video'
    },
    COURSE_MODULE: {
        TITLE_MAX_LENGTH: 100,
        DESCRIPTION_MAX_LENGTH: 500,
        COURSE_PRICE_MAX: 10000,
        DEFAULT_MIN: 0,
        REWARD_STRUCTURE: ['certificateBenefits', 'trophyBenefits']
    }
}));

describe('AddCourseDrawer Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockProps = {
        open: true,
        toggleDrawer: jest.fn(),
        handleAddCourse: jest.fn(),
        courseObj: {
            courseTitle: '',
            courseCategory: '',
            price: {
                coursePrice: 0,
                displayPrice: 0
            },
            courseDescription: '',
            salaryBenefit: ''
        },
        setCourseObj: jest.fn(),
        isEdit: false,
        clearFields: jest.fn(),
        courseObjError: {},
        setCourseObjError: jest.fn(),
        courseData: {},
        courseCategoryList: ['Category 1', 'Category 2'],
        editCourseStatus: 'idle'
    };

    // Mock useFileUpload hook
    beforeEach(() => {
        useFileUploadHook.default.mockReturnValue({
            fileData: { showProgress: false },
            setFileData: jest.fn(),
            handleInputChange: jest.fn(),
            abortUpload: jest.fn(),
            status: 'idle',
            resetFileData: jest.fn()
        });
    });

    it('renders basic form elements', () => {
        render(<AddCourseDrawer {...mockProps} />);

        const expectedTexts = ['Title', 'Category', 'Course Price', 'Display Price', 'Description', 'Salary Benefit'];
        // Check for main input fields
        expectedTexts.forEach((text)=> {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
    });

    it('handles course title input', () => {
        render(<AddCourseDrawer {...mockProps} />);

        const titleInput = screen.getByPlaceholderText('Add course title');
        fireEvent.change(titleInput, { target: { value: 'Test Course' } });

        expect(mockProps.setCourseObj).toHaveBeenCalledWith(
            expect.objectContaining({
                courseTitle: 'Test Course'
            })
        );
    });

    it('handles category selection', () => {
        render(<AddCourseDrawer {...mockProps} />);

        const categoryDropdown = screen.getByText('Select Course Category');
        fireEvent.click(categoryDropdown);

        const category = screen.getByText('Category 1');
        fireEvent.click(category);

        expect(mockProps.setCourseObj).toHaveBeenCalledWith(
            expect.objectContaining({
                courseCategory: 'Category 1'
            })
        );
    });

    it('handles course price input', () => {
        render(<AddCourseDrawer {...mockProps} />);

        const priceInputs = screen.getAllByRole('textbox');
        const coursePrice = priceInputs[1]; // index based on your component's structure

        fireEvent.change(coursePrice, { target: { value: '1000' } });

        expect(mockProps.setCourseObj).toHaveBeenCalledWith(
            expect.objectContaining({
                price: expect.objectContaining({
                    coursePrice: 1000
                })
            })
        );
    });

    it('handles save button in edit mode', () => {
        const editProps = {
            ...mockProps,
            isEdit: true
        };

        render(<AddCourseDrawer {...editProps} />);

        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);

        expect(mockProps.handleAddCourse).toHaveBeenCalled();
    });

    it('handles drawer close', () => {
        render(<AddCourseDrawer {...mockProps} />);

        const closeButton = screen.getByRole('button', { name: /Cancel/i });
        fireEvent.click(closeButton);

        expect(mockProps.toggleDrawer).toHaveBeenCalledWith(false);
    });

    it('renders file upload components in edit mode', async () => {

        render(<AddCourseDrawer {...mockProps} isEdit={true} />);

        expect(screen.getByText('Upload Video Thumbnail')).toBeInTheDocument();
        expect(screen.getByText('Upload Vertical Thumbnail')).toBeInTheDocument();
    });
});