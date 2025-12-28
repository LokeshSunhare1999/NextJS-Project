import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Modal from '../../components/Modal';

const mockSetIsOpen = jest.fn();

describe('Modal', () => {

    const renderModal = (isOpen, children = 'Modal Content') => {
        render(
            <Modal isOpen={isOpen} setIsOpen={mockSetIsOpen}>
                {children}
            </Modal>
        );
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders Modal component when isOpen is true', () => {
        renderModal(true);
        expect(screen.getByText('Modal Content')).toBeInTheDocument();
    });

    it('does not render Modal component when isOpen is false', () => {
        renderModal(false);
        expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
    });

    it('calls setIsOpen with false when clicking outside the modal', () => {
        renderModal(true);
        const overlayElement = screen.getByText('Modal Content').parentElement;
        fireEvent.click(overlayElement);
        expect(mockSetIsOpen).toHaveBeenCalledWith(false);
    });

    it('does not call setIsOpen when clicking inside the modal', () => {
        renderModal(true);
        const containerElement = screen.getByText('Modal Content');
        fireEvent.click(containerElement);
        expect(mockSetIsOpen).not.toHaveBeenCalled();
    });

    it('renders children correctly', () => {
        renderModal(true, <div>Custom Content</div>);
        expect(screen.getByText('Custom Content')).toBeInTheDocument();
    });
});