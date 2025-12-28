import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import IdContainer from '../../../../components/atom/tableComponents/IdContainer';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

jest.mock('notistack', () => ({
    useSnackbar: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
    useNavigate: jest.fn(),
}));

describe('IdContainer', () => {
    const enqueueSnackbar = jest.fn();
    const navigate = jest.fn();
    jest.spyOn(console, 'error').mockImplementation(() => { });
    beforeEach(() => {
        Object.defineProperty(navigator, 'clipboard', {
            value: {
                writeText: jest.fn().mockResolvedValue(undefined),
            },
            writable: true,
        });
        useSnackbar.mockReturnValue({ enqueueSnackbar });
        useNavigate.mockReturnValue(navigate);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    const defaultProps = {
        item: '1234567890',
        rowsIndex: 0,
        header: 'Order ID',
        isUnderLine: true,
        setUserType: jest.fn(),
        tableData: [{ userType: 'CUSTOMER' }],
        customProps: { paymentType: 'credit' },
    };

    it('renders the formatted ID correctly', () => {
        render(<IdContainer {...defaultProps} />);
        expect(screen.getByText('XXXX567890')).toBeInTheDocument();
    });

    it('calls handleIdClick and navigates correctly when ID is clicked', () => {
        render(<IdContainer {...defaultProps} />);
        fireEvent.click(screen.getByText('XXXX567890'));
        expect(navigate).toHaveBeenCalledWith(`/orders/1234567890?userType=CUSTOMER`);
    });

    it('calls handleCopyClick and shows success snackbar when copy icon is clicked', async () => {
        render(<IdContainer {...defaultProps} />);
        const copyIcon = screen.getByRole('img', { name: 'copy' });

        fireEvent.click(copyIcon);

        await waitFor(() => {
            expect(enqueueSnackbar).toHaveBeenCalledWith('Copied to clipboard', { variant: 'success' });
        });
    });

    it('renders "-----" when item is empty or null', () => {
        const props = { ...defaultProps, item: '' };
        render(<IdContainer {...props} />);
        expect(screen.getByText('-----')).toBeInTheDocument();
    });

    it('renders the ID as is when it is shorter than 6 characters', () => {
        const props = { ...defaultProps, item: '123' };
        render(<IdContainer {...props} />);
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('does not underline the text for specific headers', () => {
        const props = { ...defaultProps, header: 'Request ID', isUnderLine: true };
        render(<IdContainer {...props} />);
        const textElement = screen.getByText('XXXX567890');
        expect(textElement).not.toHaveStyle('text-decoration-line: underline');
    });
});