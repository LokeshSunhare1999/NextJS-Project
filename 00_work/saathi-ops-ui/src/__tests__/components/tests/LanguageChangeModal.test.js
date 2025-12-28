import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import LanguageChangeModal from '../../../components/tests/LanguageChangeModal';

describe('LanguageChangeModal Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    // Mock props for testing
    const mockProps = {
        testLang: '',
        setTestLang: jest.fn(),
        langDropdownOpen: false,
        setLangDropdownOpen: jest.fn(),
        open: true,
        setOpen: jest.fn(),
        handleCsvUpload: jest.fn(),
        selectedCsvFile: null,
        setSelectedCsvFile: jest.fn(),
        handleLangSubmit: jest.fn()
    };

    // Basic rendering test
    it('renders the modal with correct initial state', () => {
        render(<LanguageChangeModal {...mockProps} />);

        expect(screen.getByText('Upload questions')).toBeInTheDocument();

        expect(screen.getAllByText('Select Language')[0]).toBeInTheDocument();

        expect(screen.getAllByText('Upload CSV')[0]).toBeInTheDocument();
    });

    it('allows selecting a language', () => {
        const props = {
            ...mockProps,
            langDropdownOpen: true
        };

        render(<LanguageChangeModal {...props} />);

        const languageOption = screen.getByText('Hindi');
        fireEvent.click(languageOption);

        expect(mockProps.setTestLang).toHaveBeenCalledWith('Hindi');
        expect(mockProps.setLangDropdownOpen).toHaveBeenCalledWith(false);
    });

    it('allows deleting uploaded CSV file', () => {
        const propsWithFile = {
            ...mockProps,
            selectedCsvFile: { name: 'test.csv' }
        };

        render(<LanguageChangeModal {...propsWithFile} />);

        expect(screen.getByText('test.csv')).toBeInTheDocument();

        const deleteIcon = screen.getByAltText('delete-icon');
        fireEvent.click(deleteIcon);

        expect(mockProps.setSelectedCsvFile).toHaveBeenCalledWith(null);
    });

    it('disables submit button when conditions are not met', () => {
        render(<LanguageChangeModal {...mockProps} />);

        const submitButton = screen.getByRole("button", { name:'Submit'});

        const styles = window.getComputedStyle(submitButton);
        expect(styles.cursor).toBe('not-allowed');
    });

    it('enables submit button when language and CSV are selected', () => {
        const propsWithSelections = {
            ...mockProps,
            testLang: 'English',
            selectedCsvFile: { name: 'test.csv' }
        };

        render(<LanguageChangeModal {...propsWithSelections} />);

        const submitButton = screen.getByText('Submit');

        fireEvent.click(submitButton);

        expect(mockProps.handleLangSubmit).toHaveBeenCalled();
    });

    it('displays correct language dropdown options', () => {
        const props = {
            ...mockProps,
            langDropdownOpen: true
        };

        render(<LanguageChangeModal {...props} />);

        const expectedLanguages = ['Hindi', 'English', 'Marathi'];
        expectedLanguages.forEach(lang => {
            expect(screen.getByText(lang)).toBeInTheDocument();
        });
    });
});