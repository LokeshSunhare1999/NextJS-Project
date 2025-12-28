import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import DownloadInvoiceDropdown from '../../../components/payouts/DownloadInvoiceDropdown';

// Mock PDFViewer component
jest.mock('../../../components/PDFViewer', () => {
    return function MockPDFViewer({ pdfUrl }) {
        return <div data-testid="mock-pdf-viewer">{pdfUrl}</div>;
    };
});

jest.mock('../../../assets/icons', () => ({
    ARROW_UP: '/mock-arrow-up.svg',
    ARROW_DOWN: '/mock-arrow-down.svg'
}));

describe('Header Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockInvoiceUrl = 'https://example.com/invoice.pdf';

    it('renders View Invoice text by default', () => {
        render(<DownloadInvoiceDropdown invoiceUrl={mockInvoiceUrl} />);

        const viewInvoiceText = screen.getByText('View Invoice');
        expect(viewInvoiceText).toBeInTheDocument();
    });

    it('displays down arrow icon by default', () => {
        render(<DownloadInvoiceDropdown invoiceUrl={mockInvoiceUrl} />);

        const arrowIcon = screen.getByAltText('arrowDown');
        expect(arrowIcon).toHaveAttribute('src', '/mock-arrow-down.svg');
    });

    it('toggles PDF viewer when clicking on header', () => {
        render(<DownloadInvoiceDropdown invoiceUrl={mockInvoiceUrl} />);

        const header = screen.getByText('View Invoice').closest('div');

        expect(screen.queryByTestId('mock-pdf-viewer')).toBeNull();

        fireEvent.click(header);
        expect(screen.getByTestId('mock-pdf-viewer')).toBeInTheDocument();

        fireEvent.click(header);
        expect(screen.queryByTestId('mock-pdf-viewer')).toBeNull();
    });

    it('changes arrow icon when toggling PDF viewer', () => {
        render(<DownloadInvoiceDropdown invoiceUrl={mockInvoiceUrl} />);

        const header = screen.getByText('View Invoice').closest('div');
        const arrowIcon = screen.getByAltText('arrowDown');

        expect(arrowIcon).toHaveAttribute('src', '/mock-arrow-down.svg');

        fireEvent.click(header);
        expect(arrowIcon).toHaveAttribute('src', '/mock-arrow-up.svg');

        fireEvent.click(header);
        expect(arrowIcon).toHaveAttribute('src', '/mock-arrow-down.svg');
    });

    it('passes correct invoice URL to PDFViewer', () => {
        render(<DownloadInvoiceDropdown invoiceUrl={mockInvoiceUrl} />);

        const header = screen.getByText('View Invoice').closest('div');

        fireEvent.click(header);

        const pdfViewer = screen.getByTestId('mock-pdf-viewer');
        expect(pdfViewer).toHaveTextContent(mockInvoiceUrl);
    });
});