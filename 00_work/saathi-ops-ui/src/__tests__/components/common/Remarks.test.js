import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Remarks from '../../../components/common/Remarks';
import { ModalContext } from '../../../context/ModalProvider';
import { SnackbarProvider } from 'notistack';
import usePermission from '../../../hooks/usePermission';

jest.mock('../../../hooks/usePermission', () => jest.fn());

const mockDisplayModal = jest.fn();
const mockUpdateModal = jest.fn();
const mockCloseModal = jest.fn();

describe('Remarks Component', () => {
    const renderComponent = (props) =>
        render(
            <SnackbarProvider>
                <ModalContext.Provider
                    value={{ displayModal: mockDisplayModal, updateModal: mockUpdateModal, closeModal: mockCloseModal }}
                >
                    <Remarks {...props} />
                </ModalContext.Provider>
            </SnackbarProvider>
        );

    beforeEach(() => {
        jest.clearAllMocks();
        usePermission.mockReturnValue({ hasPermission: () => true });
    });

    it('renders without remarks', () => {
        renderComponent({ remarks: [] });
        expect(screen.getByText('No remarks added')).toBeInTheDocument();
    });

    it('displays remarks correctly', () => {
        const remarks = [
            {
                _id: '1',
                agentEmail: 'test@example.com',
                updatedAt: '2024-02-24T10:00:00Z',
                remarkStatus: 'approved',
                message: 'This is a test remark.',
            },
        ];
        renderComponent({ remarks });
        expect(screen.getByText('test@example.com')).toBeInTheDocument();
        expect(screen.getByText('This is a test remark.')).toBeInTheDocument();
    });

    it('opens modal when Add Remarks button is clicked', () => {
        renderComponent({ remarks: [], ctaTitle: 'Add Remarks' });
        const addButton = screen.getByText('Add Remarks');
        fireEvent.click(addButton);
        expect(mockDisplayModal).toHaveBeenCalled();
    });

    it('shows success snackbar on successful submission', async () => {
        const onSubmitMock = jest.fn();
        renderComponent({ onSubmit: onSubmitMock, successMsg: 'Remark added successfully!' });
        fireEvent.click(screen.getByText('Add Remarks'));
        expect(mockDisplayModal).toHaveBeenCalled();
    });

    it('does not show Add Remarks button without permission', () => {
        usePermission.mockReturnValue({ hasPermission: () => false });
        renderComponent({ remarks: [], permission: 'restricted' });
        expect(screen.queryByText('Add Remarks')).not.toBeInTheDocument();
    });
});
