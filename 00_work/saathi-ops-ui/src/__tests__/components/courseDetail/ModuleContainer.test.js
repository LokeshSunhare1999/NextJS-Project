import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ModuleContainer from '../../../components/courseDetail/ModuleContainer';
import '@testing-library/jest-dom';

// Mock usePermission hook
const mockHasPermission = jest.fn().mockImplementation(() => true);
jest.mock('../../../hooks/usePermission', () => ({
    __esModule: true,
    default: () => ({
        hasPermission: mockHasPermission
    })
}));

// Mock props
const mockCourseData = {
    modules: [
        {
            _id: '1',
            moduleTitle: 'Module 1',
            description: 'This is module 1',
            noOfVideos: 1,
            noOfAssessments: 1,
            noOfThumbnails: 1,
            subModules: [
                {
                    _id: '1-1',
                    subModuleTitle: 'Submodule 1',
                    description: 'This is submodule 1',
                    imageUrl: 'image-url',
                    videoUrl: 'video-url',
                    duration: 120,
                    assessment: {
                        assessmentTitle: 'Assessment 1',
                    },
                },
            ],
        },
    ],
};

const mockProps = {
    onClickFn: jest.fn(),
    onClickFnSub: jest.fn(),
    courseData: mockCourseData,
    setOpenSubModuleDrawer: jest.fn(),
    setOpenAssessmentDrawer: jest.fn(),
    setCourseSubModuleId: jest.fn(),
    setCourseModuleId: jest.fn(),
    setModuleObj: jest.fn(),
    setSubModuleObj: jest.fn(),
    setSubModuleData: jest.fn(),
    setAssessmentObj: jest.fn(),
    setOpenViewAssessmentDrawer: jest.fn(),
    setIsEditAssessment: jest.fn(),
    setIsViewSubmodule: jest.fn(),
    deleteCourseAssessmentMutation: jest.fn(),
    handleCsvUpload: jest.fn(),
};

describe('ModuleContainer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    it('renders without crashing', () => {
        render(<ModuleContainer {...mockProps} />);
        expect(screen.getByTestId('module-wrapper')).toBeInTheDocument();
    });

    it('renders the correct number of modules', () => {
        render(<ModuleContainer {...mockProps} />);
        expect(screen.getAllByText(/Module 1/).length).toBe(1);
    });

    it('toggles module open/close state on click', () => {
        render(<ModuleContainer {...mockProps} />);
        const moduleTitle = screen.getByText('Module 1');
        fireEvent.click(moduleTitle);
        expect(screen.getByText('This is module 1')).toBeInTheDocument(); // Description should appear
    });

    it('renders submodules when a module is open', () => {
        render(<ModuleContainer {...mockProps} />);
        const moduleTitle = screen.getByText('Module 1');
        fireEvent.click(moduleTitle);
        expect(screen.getByText('Submodule 1')).toBeInTheDocument();
    });

    it('renders assessment when available in a submodule', () => {
        render(<ModuleContainer {...mockProps} />);
        const moduleTitle = screen.getByText('Module 1');
        fireEvent.click(moduleTitle);
        expect(screen.getByText('Assessment 1')).toBeInTheDocument();
    });

    it('triggers CSV upload when no modules are present', async () => {
        const noDataProps = { ...mockProps, courseData: { modules: [] } };
        render(<ModuleContainer {...noDataProps} />);

        const fileInput = screen.getByTestId("file-input");

        // Create a mock file
        const file = new File(["dummy content"], "test.csv", { type: "text/csv" });

        // Simulate file selection
        fireEvent.change(fileInput, { target: { files: [file] } });

        expect(mockProps.handleCsvUpload).toHaveBeenCalledWith(file);
    });

    it('shows action buttons when three dots are clicked', () => {
        render(<ModuleContainer {...mockProps} />);
        const moduleTitle = screen.getByText('Module 1');
        fireEvent.click(moduleTitle);
        const threeDotsIcon = screen.getAllByAltText('three_dots')[0];
        fireEvent.click(threeDotsIcon);
        expect(screen.getByText('View')).toBeInTheDocument();
        expect(screen.getByText('Edit')).toBeInTheDocument();
    });
});