import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ImageContainer from '../../../components/common/ImageContainer';

jest.mock('../../../components/PDFViewer', () => jest.fn(() => <div data-testid="pdf-viewer">PDF Preview</div>));

describe('ImageContainer Component', () => {
    const mockImages = [
        { image: 'https://example.com/sample.jpg', title: 'Sample Image' },
        { image: 'https://example.com/sample.pdf', title: 'Sample PDF' },
    ];

    it('renders without crashing', () => {
        render(<ImageContainer images={mockImages} />);
        expect(screen.getByText('Sample Image')).toBeInTheDocument();
        expect(screen.getByText('Sample PDF')).toBeInTheDocument();
    });

    it('renders image correctly', () => {
        render(<ImageContainer images={mockImages} />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('renders PDF correctly', () => {
        render(<ImageContainer images={mockImages} />);
        expect(screen.getByTestId('pdf-viewer')).toBeInTheDocument();
    });

    it('renders nothing when images array is empty', () => {
        const { container } = render(<ImageContainer images={[]} />);
        expect(container.firstChild).toBeNull();
    });

});
