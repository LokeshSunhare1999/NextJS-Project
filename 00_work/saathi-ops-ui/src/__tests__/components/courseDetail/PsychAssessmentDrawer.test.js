import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PsychAssessmentDrawer from '../../../components/courseDetail/PsychAssessmentDrawer';
import { SnackbarProvider, useSnackbar } from 'notistack';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { usePostEditPsychWeightage } from '../../../apis/queryHooks';

// Mock the usePostEditPsychWeightage hook
jest.mock('../../../apis/queryHooks', () => ({
    usePostEditPsychWeightage: jest.fn(),
}));

// Mock the useSnackbar hook
jest.mock('notistack', () => ({
    ...jest.requireActual('notistack'), // Keep other notistack exports
    useSnackbar: jest.fn(),
}));

const queryClient = new QueryClient();

const Wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>
        <SnackbarProvider>{children}</SnackbarProvider>
    </QueryClientProvider>
);

const mockCourseData = {
    _id: '123',
    psychometricTraitWeightage: [
        { trait: 'Trait 1', weightage: 20 },
        { trait: 'Trait 2', weightage: 30 },
        { trait: 'Trait 3', weightage: 50 },
    ],
};

describe('PsychAssessmentDrawer', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const toggleDrawer = jest.fn();
    const editPsychWeightageMutation = jest.fn();
    const enqueueSnackbar = jest.fn();

    beforeEach(() => {
        usePostEditPsychWeightage.mockReturnValue({
            mutate: editPsychWeightageMutation,
            status: 'idle',
            isError: false,
            error: null,
        });
        useSnackbar.mockReturnValue({ enqueueSnackbar });
        toggleDrawer.mockClear();
        editPsychWeightageMutation.mockClear();
        enqueueSnackbar.mockClear();
    });

    it('renders the drawer with correct content', () => {
        render(
            <Wrapper>
                <PsychAssessmentDrawer open={true} toggleDrawer={toggleDrawer} courseData={mockCourseData} />
            </Wrapper>
        );
        const expectedTexts = ['Psychometric Assessment', 'Trait 1 %', 'Trait 2 %', 'Trait 3 %', 'Cancel', 'Save',];
        
        expectedTexts.forEach((text) => {
            expect(screen.getByText(text)).toBeInTheDocument();
        });
        expect(screen.getAllByPlaceholderText('Enter Weight'));
    });

    it('calls editPsychWeightageMutation with correct data on save click when total is 100', () => {
        editPsychWeightageMutation.mockReturnValue({});

        render(
            <Wrapper>
                <PsychAssessmentDrawer open={true} toggleDrawer={toggleDrawer} courseData={mockCourseData} />
            </Wrapper>
        );

        fireEvent.click(screen.getByText('Save'));
        expect(editPsychWeightageMutation).toHaveBeenCalledWith({
            courseId: '123',
            psychometricTraitWeightage: [
                { trait: 'Trait 1', weightage: 20 },
                { trait: 'Trait 2', weightage: 30 },
                { trait: 'Trait 3', weightage: 50 },
            ],
        });
    });

    it('closes the drawer when close icon is clicked', () => {
        render(
            <Wrapper>
                <PsychAssessmentDrawer open={true} toggleDrawer={toggleDrawer} courseData={mockCourseData} />
            </Wrapper>
        );

        fireEvent.click(screen.getByRole('img'));
        expect(toggleDrawer).toHaveBeenCalledWith(false);
    });

    it('closes the drawer when cancel button is clicked', () => {
        render(
            <Wrapper>
                <PsychAssessmentDrawer open={true} toggleDrawer={toggleDrawer} courseData={mockCourseData} />
            </Wrapper>
        );

        fireEvent.click(screen.getByText('Cancel'));
        expect(toggleDrawer).toHaveBeenCalledWith(false);
    });

    it('updates weightage on input change', () => {
        render(
            <Wrapper>
                <PsychAssessmentDrawer open={true} toggleDrawer={toggleDrawer} courseData={mockCourseData} />
            </Wrapper>
        );

        fireEvent.change(screen.getAllByPlaceholderText('Enter Weight')[0], { target: { value: '25' } });
        expect(screen.getAllByPlaceholderText('Enter Weight')[0]).toHaveValue('25');
    });

    it('shows error if total weightage is not 100', () => {
        render(
            <Wrapper>
                <PsychAssessmentDrawer open={true} toggleDrawer={toggleDrawer} courseData={mockCourseData} />
            </Wrapper>
        );

        fireEvent.change(screen.getAllByPlaceholderText('Enter Weight')[0], { target: { value: '30' } });
        fireEvent.click(screen.getByText('Save'));
        expect(screen.getByText('* Total should add up to 100.')).toBeInTheDocument();
    });



    it('shows success snackbar on successful mutation', async () => {
        usePostEditPsychWeightage.mockReturnValue({
            mutate: editPsychWeightageMutation,
            status: 'success',
            isError: false,
            error: null,
        });

        render(
            <Wrapper>
                <PsychAssessmentDrawer open={true} toggleDrawer={toggleDrawer} courseData={mockCourseData} />
            </Wrapper>
        );

        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(enqueueSnackbar).toHaveBeenCalledWith('Psychometric Weightage Updated !', {
                variant: 'success',
            });
        });
    });

    it('shows error snackbar on failed mutation', async () => {
        usePostEditPsychWeightage.mockReturnValue({
            mutate: editPsychWeightageMutation,
            status: 'error',
            isError: true,
            error: { response: { data: { error: { message: 'Test error' } } } },
        });

        render(
            <Wrapper>
                <PsychAssessmentDrawer open={true} toggleDrawer={toggleDrawer} courseData={mockCourseData} />
            </Wrapper>
        );

        fireEvent.click(screen.getByText('Save'));

        await waitFor(() => {
            expect(enqueueSnackbar).toHaveBeenCalledWith('Failed to edit psychometric weights.Test error', {
                variant: 'error',
            });
        });
    });
});