import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import InlineIconText from '../../../components/common/InlineIconText';

describe('InlineIconText Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const icon = 'https://example.com/icon.png';
    const altText = 'Test Icon';
    const text = 'Sample Text';
    const iconSize = 30;

    it('renders the component with icon and text', () => {
        render(<InlineIconText icon={icon} altText={altText} text={text} iconSize={iconSize} />);

        const image = screen.getByAltText(altText);
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', icon);
        expect(image).toHaveAttribute('alt', altText);

        const textElement = screen.getByText(text);
        expect(textElement).toBeInTheDocument();
    });

    it('applies correct icon size', () => {
        render(<InlineIconText icon={icon} altText={altText} text={text} iconSize={iconSize} />);

        const image = screen.getByAltText(altText);
        expect(image).toHaveStyle(`width: ${iconSize}px`);
        expect(image).toHaveStyle(`height: ${iconSize}px`);
    });

    it('uses default props when not provided', () => {
        render(<InlineIconText icon={icon} text={text} />);

        const image = screen.getByAltText('icon');
        expect(image).toBeInTheDocument();
        expect(image).toHaveStyle('width: 20px');
        expect(image).toHaveStyle('height: 20px');
    });
});
