import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AgreementDrawer from '../../../components/employers/AgreementDrawer';

jest.mock('../../../style/usersTabStyle', () => () => ({
    StyledHeader: jest.fn(({ children }) => <div data-testid="styled-header">{children}</div>)
}));

jest.mock('../../../components/common/DisplayDrawer', () => ({
    __esModule: true,
    default: jest.fn(({ open, handleCloseDrawer, headerContent, children }) => (
        <div data-testid="display-drawer" data-open={open}>
            <div data-testid="header-content">{headerContent()}</div>
            <div data-testid="drawer-content">{children}</div>
            <button data-testid="close-button" onClick={handleCloseDrawer}>
                Close
            </button>
        </div>
    ))
}));

jest.mock('../../../components/CustomCTA', () => ({
    __esModule: true,
    default: jest.fn(({ onClick, title }) => (
        <button data-testid="custom-cta" onClick={onClick}>
            {title}
        </button>
    ))
}));

jest.mock('../../../components/PDFViewer', () => ({
    __esModule: true,
    default: jest.fn(({ pdfUrl }) => (
        <div data-testid="pdf-viewer" data-url={pdfUrl}>
            PDF Viewer Component
        </div>
    ))
}));

jest.mock('../../../assets/icons', () => ({
    DOWNLOAD: 'download-icon-url'
}));

const mockOpen = jest.fn();
window.open = mockOpen;

describe('AgreementDrawer Component', () => {
    const defaultProps = {
        open: true,
        handleCloseDrawer: jest.fn(),
        url: 'https://example.com/agreement.pdf'
    };

    beforeEach(() => { 
        jest.clearAllMocks();
    });

    it('renders correctly when open', () => {
        render(<AgreementDrawer {...defaultProps} />);

        const displayDrawer = screen.getByTestId('display-drawer');
        expect(displayDrawer).toBeInTheDocument();
        expect(displayDrawer).toHaveAttribute('data-open', 'true');

        const headerContent = screen.getByTestId('header-content');
        expect(headerContent).toBeInTheDocument();
        expect(headerContent).toHaveTextContent('Agreement');

        const downloadButton = screen.getByTestId('custom-cta');
        expect(downloadButton).toBeInTheDocument();
        expect(downloadButton).toHaveTextContent('Download');

        const pdfViewer = screen.getByTestId('pdf-viewer');
        expect(pdfViewer).toBeInTheDocument();
        expect(pdfViewer).toHaveAttribute('data-url', defaultProps.url);

        expect(screen.getByText('Agreement Preview')).toBeInTheDocument();
    });

    it('renders correctly when closed', () => {
        render(<AgreementDrawer {...defaultProps} open={false} />);

        const displayDrawer = screen.getByTestId('display-drawer');
        expect(displayDrawer).toHaveAttribute('data-open', 'false');
    });

    it('calls handleCloseDrawer when close button is clicked', () => {
        render(<AgreementDrawer {...defaultProps} />);

        const closeButton = screen.getByTestId('close-button');
        fireEvent.click(closeButton);

        expect(defaultProps.handleCloseDrawer).toHaveBeenCalledTimes(1);
    });

    it('opens PDF in new tab when download button is clicked', () => {
        render(<AgreementDrawer {...defaultProps} />);

        const downloadButton = screen.getByTestId('custom-cta');
        fireEvent.click(downloadButton);

        expect(mockOpen).toHaveBeenCalledTimes(1);
        expect(mockOpen).toHaveBeenCalledWith(defaultProps.url, '_blank');
    });

    it('passes correct props to DisplayDrawer', () => {
        render(<AgreementDrawer {...defaultProps} />);

        const displayDrawer = screen.getByTestId('display-drawer');

        expect(displayDrawer).toHaveAttribute('data-open', 'true');
    });

    it('handles empty URL gracefully', () => {
        render(<AgreementDrawer {...defaultProps} url="" />);

        const pdfViewer = screen.getByTestId('pdf-viewer');
        expect(pdfViewer).toHaveAttribute('data-url', '');

        const downloadButton = screen.getByTestId('custom-cta');
        fireEvent.click(downloadButton);

        expect(mockOpen).toHaveBeenCalledWith('', '_blank');
    });
});