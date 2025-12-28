import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UpdateStatusBar from '../../../components/applicants/UpdateStatusBar';
import { ModalContext } from '../../../context/ModalProvider';
import '@testing-library/jest-dom';
import { BrowserRouter as Router } from 'react-router-dom';

jest.mock('../../../apis/queryHooks', () => ({
    usePutApplicantStatus: jest.fn(() => ({ mutateAsync: jest.fn() })),
}));

jest.mock('../../../components/applicants/ApplicantStatusDropdown', () => ({
    nextPossibleStates = ['approved', 'rejected'],
    handleStatusSelect,
}) => (
    <div>
        <p>ApplicantStatusDropdown</p>
        {nextPossibleStates.map((status) => (
            <button key={status} onClick={() => handleStatusSelect(status)}>
                {status}
            </button>
        ))}
    </div>
));

describe('UpdateStatusBar Component', () => {
    const mockDisplayModal = jest.fn();
    const mockRefetchApplicantData = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    const setup = (props) => {
        render(
            <Router>
                <ModalContext.Provider value={{ displayModal: mockDisplayModal }}>
                    <UpdateStatusBar {...props} />
                </ModalContext.Provider>
            </Router>
        );
    };

    it('renders correctly with given status details', () => {
        setup({
            statusDetails: {
                title: 'Pending Review',
                status: 'pending',
                nextPossibleStates: ['approved', 'rejected'],
            },
            refetchApplicantData: mockRefetchApplicantData,
        });

        expect(screen.getByText('Pending Review')).toBeInTheDocument();
    });

    it('opens the dropdown when clicked and shows status options', () => {
        setup({
            title: 'Pending Review',
            status: 'pending',
            nextPossibleStates: ['approved', 'rejected'],
        });
        fireEvent.click(screen.getByText('ApplicantStatusDropdown'));

        expect(screen.getByText('approved')).toBeInTheDocument();
        expect(screen.getByText('rejected')).toBeInTheDocument();
    });

    it('calls displayModal when a status is selected', async () => {
        setup({
            statusDetails: {
                title: 'Pending Review',
                status: 'pending',
                nextPossibleStates: ['approved'],
            },
            refetchApplicantData: mockRefetchApplicantData,
        });

        fireEvent.click(screen.getByText('approved'));

        await waitFor(() => {
            expect(mockDisplayModal).toHaveBeenCalled();
        });
    });
});
