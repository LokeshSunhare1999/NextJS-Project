import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SnackbarProvider } from 'notistack';
import LinkCopyWrap from '../../../components/common/LinkCopyWrap';

Object.assign(navigator, {
    clipboard: {
        writeText: jest.fn().mockResolvedValue(),
    },
});

describe('LinkCopyWrap Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const link = 'https://example.com/very/long/link/that/needs/to/be/trimmed';
    const shortLink = 'https://short.com';

    const renderComponent = (link) =>
        render(
            <SnackbarProvider>
                <LinkCopyWrap link={link} />
            </SnackbarProvider>
        );

    it('renders the component with the provided link', () => {
        renderComponent(shortLink);

        const linkText = screen.getByText(shortLink);
        expect(linkText).toBeInTheDocument();

        const copyButton = screen.getByText(/copy/i);
        expect(copyButton).toBeInTheDocument();
    });

    it('trims the link if it exceeds 36 characters', () => {
        renderComponent(link);

        const trimmedText = `${link.slice(0, 33)}...`;
        const displayedLink = screen.getByText(trimmedText);
        expect(displayedLink).toBeInTheDocument();
    });

    it('copies the link to clipboard when button is clicked', async () => {
        renderComponent(link);

        const  copyButton = screen.getByText(/copy/i);
        fireEvent.click(copyButton);

        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(link);
    });
});
