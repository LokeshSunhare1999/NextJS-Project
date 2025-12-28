import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddTestDrawer from '../../../components/tests/AddTestDrawer';
import { TEST_MODULE, BENEFIT_STRUCTURE } from '../../../constants/tests';

// Mock dependencies
jest.mock('../../../hooks/useFileUpload', () => () => ({
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

jest.mock('../../../utils/helper', () => ({
    generateUploadFilePath: jest.fn(),
    convertCamelCaseToTitleCase: jest.fn((str) => str),
}));

describe('AddTestDrawer Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockProps = {
        open: true,
        toggleDrawer: jest.fn(),
        handleAddTest: jest.fn(),
        testObj: {
            testName: '',
            testDescription: '',
            testPricing: {
                actualPrice: 0,
                displayPrice: 0,
            },
            salaryBenefits: '',
            salaryRange: '',
            certificateBenefits: {
                salaryBenefit: '',
                trainingCertificate: '',
                trainingReward: '',
            },
            medalBenefits: {
                salaryBenefit: '',
                trainingCertificate: '',
                trainingReward: '',
            },
            imageUrl: '',
            verticalImageUrl: '',
            testNameImageUrl: '',
            testIntroVideo: '',
        },
        setTestObj: jest.fn(),
        isEdit: false,
        clearFields: jest.fn(),
        testObjError: {},
        setTestObjError: jest.fn(),
        testDetailsData: {},
        testStatus: 'idle',
        categoryCheckboxes: [
            { value: 'category1', label: 'Category 1', checked: false },
            { value: 'category2', label: 'Category 2', checked: false },
        ],
        setCategoryCheckboxes: jest.fn(),
        skillsCheckboxes: [
            { value: 'skill1', label: 'Skill 1', checked: false },
            { value: 'skill2', label: 'Skill 2', checked: false },
        ],
        setSkillsCheckboxes: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders the drawer with correct title', () => {
        render(<AddTestDrawer {...mockProps} />);
        expect(screen.getByText('Add Test')).toBeInTheDocument();
    });

    it('renders with edit title when isEdit is true', () => {
        render(<AddTestDrawer {...mockProps} isEdit={true} />);
        expect(screen.getByText('Edit Test')).toBeInTheDocument();
    });

    it('renders all required input fields', () => {
        render(<AddTestDrawer {...mockProps} />);

        const expectedLabels = ['Test Name', 'Test Description', 'Test Category', 'Test Skills', 'Actual Price', 'Display Price', 'Salary Range']

        expectedLabels.forEach(label => expect(screen.getByText(label)).toBeInTheDocument());
    });

    it('handles test name input change', () => {
        render(<AddTestDrawer {...mockProps} />);
        const input = screen.getByText('Test Name').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'New Test' } });
        expect(mockProps.setTestObj).toHaveBeenCalled();
    });

    it('handles test description input change', () => {
        render(<AddTestDrawer {...mockProps} />);
        const input = screen.getByText('Test Description').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'Test description' } });
        expect(mockProps.setTestObj).toHaveBeenCalled();
    });

    it('handles actual price input change with valid numbers', () => {
        render(<AddTestDrawer {...mockProps} />);
        const input = screen.getByText('Actual Price').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: '100' } });
        expect(mockProps.setTestObj).toHaveBeenCalledWith(
            expect.objectContaining({
                testPricing: expect.objectContaining({
                    actualPrice: 100,
                }),
            })
        );
    });

    it('does not allow non-numeric input for actual price', () => {
        render(<AddTestDrawer {...mockProps} />);
        const input = screen.getByText('Actual Price').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'abc' } });
        expect(mockProps.setTestObj).not.toHaveBeenCalledWith(
            expect.objectContaining({
                testPricing: expect.objectContaining({
                    actualPrice: 'abc',
                }),
            })
        );
    });

    it('handles display price input change with valid numbers', () => {
        render(<AddTestDrawer {...mockProps} />);
        const input = screen.getByText('Display Price').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: '150' } });
        expect(mockProps.setTestObj).toHaveBeenCalledWith(
            expect.objectContaining({
                testPricing: expect.objectContaining({
                    displayPrice: 150,
                }),
            })
        );
    });

    it('handles salary range input change', () => {
        render(<AddTestDrawer {...mockProps} />);
        const input = screen.getByText('Salary Range').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: '50,000 - 60,000' } });
        expect(mockProps.setTestObj).toHaveBeenCalled();
    });

    it('renders reward structure buttons', () => {
        render(<AddTestDrawer {...mockProps} />);
        TEST_MODULE.REWARD_STRUCTURE.forEach((item) => {
            expect(screen.getByText(item)).toBeInTheDocument();
        });
    });

    it('shows benefit fields when reward button is clicked', () => {
        render(<AddTestDrawer {...mockProps} />);
        const certificateButton = screen.getByText('certificateBenefits');
        fireEvent.click(certificateButton);

        Object.keys(BENEFIT_STRUCTURE).forEach((subItem) => {
            expect(screen.getByText(`certificateBenefits - ${subItem}`)).toBeInTheDocument();
        });
    });

    it('handles benefit field input changes', () => {
        render(<AddTestDrawer {...mockProps} />);
        const certificateButton = screen.getByText('certificateBenefits').parentElement.querySelector('input');
        fireEvent.click(certificateButton);

        const input = screen.getByText('certificateBenefits - salaryBenefit').parentElement.querySelector('input');
        fireEvent.change(input, { target: { value: 'Salary benefit text' } });

        expect(mockProps.setTestObj).toHaveBeenCalled();
    });

    it('renders file upload sections in edit mode', () => {
        render(<AddTestDrawer {...mockProps} isEdit={true} />);
        
        const expectedLabels = ['Intro Video', 'Video Thumbnail', 'Vertical Thumbnail', 'Test Name Image'];

        expectedLabels.forEach(label => expect(screen.getByText(label)).toBeInTheDocument());
    });

    it('does not render file upload sections in add mode', () => {
        render(<AddTestDrawer {...mockProps} isEdit={false} />);
        expect(screen.queryByText('Intro Video')).not.toBeInTheDocument();
        expect(screen.queryByText('Video Thumbnail')).not.toBeInTheDocument();
    });

    it('calls handleAddTest when save button is clicked', () => {
        render(<AddTestDrawer {...mockProps} />);
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
        expect(mockProps.handleAddTest).toHaveBeenCalled();
    });

    it('handles skills checkbox changes', () => {
        render(<AddTestDrawer {...mockProps} />);
        const checkbox = screen.getByText(/Skill1/i).parentElement.querySelector('input');
        fireEvent.click(checkbox);
        expect(mockProps.setSkillsCheckboxes).toHaveBeenCalled();
    });

    it('closes drawer when close button is clicked', () => {
        render(<AddTestDrawer {...mockProps} />);
        const closeButton = screen.getByRole('button', { name: /cancel/i });
        fireEvent.click(closeButton);
        expect(mockProps.toggleDrawer).toHaveBeenCalledWith(false);
    });

    it('shows error messages when fields are invalid', () => {
        const propsWithErrors = {
            ...mockProps,
            testObjError: {
                testName: true,
                actualPrice: true,
                displayPrice: true,
                salaryRange: true,
            },
        };

        render(<AddTestDrawer {...propsWithErrors} />);

        expect(screen.getByText(`* Test name is required and should be less than ${TEST_MODULE?.TITLE_MAX_LENGTH} characters.`)).toBeInTheDocument();
        expect(screen.getByText(`* Test price must be in the range of ${TEST_MODULE?.DEFAULT_MIN} and ${TEST_MODULE?.ACTUAL_PRICE_MAX}.`)).toBeInTheDocument();
        expect(screen.getByText(`* Display price must be in the range of ${TEST_MODULE?.DEFAULT_MIN} and ${TEST_MODULE?.DISPLAY_PRICE_MAX}.`)).toBeInTheDocument();
        expect(screen.getByText(`* Salary Range is required and should be less than ${TEST_MODULE?.DESCRIPTION_MAX_LENGTH} characters.`)).toBeInTheDocument();
    });
});