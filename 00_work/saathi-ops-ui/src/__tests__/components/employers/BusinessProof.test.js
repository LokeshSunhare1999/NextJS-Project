import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import BusinessProof from '../../../components/employers/BusinessProof';
import { MAX_LENGTHS } from '../../../constants';
import '@testing-library/jest-dom';
import { DOMAIN_MAX_LENGTH } from '../../../constants/employer';

jest.mock('../../../components/common/DrawerInput', () => {
    return function MockDrawerInput(props) {
        return (
            <div data-testid="drawer-input">
                <div data-testid={`field-header-${props.fieldHeader?.replace(/\s+/g, '-').toLowerCase()}`}>
                    {props.fieldHeader}
                </div>
                {props.fieldType === 'input' && (
                    <input
                        data-testid={`input-${props.fieldHeader?.replace(/\s+/g, '-').toLowerCase()}`}
                        value={props.fieldValue || ''}
                        onChange={props.handleFieldChange}
                        onBlur={props.onBlurInput}
                        placeholder={props.fieldPlaceholder}
                    />
                )}
                {props.fieldType === 'dropdown' && (
                    <div data-testid={`dropdown-${props.fieldHeader?.replace(/\s+/g, '-').toLowerCase()}`}>
                        <div data-testid="dropdown-value">{props.fieldValue}</div>
                        <button
                            data-testid="dropdown-toggle"
                            onClick={() => props.handleDropDownOpen(!props.dropDownOpen)}
                        >
                            Toggle
                        </button>
                        {props.dropDownOpen && (
                            <div data-testid="dropdown-options">
                                {props.dropDownList?.map((option) => (
                                    <div
                                        key={option}
                                        data-testid={`option-${option}`}
                                        onClick={() => props.handleDropDownSelect(option)}
                                    >
                                        {option}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {props.fieldError && <div data-testid="error-message">{props.errorText}</div>}
                {props.infoTag && <div data-testid="info-tag">{props.infoTag}</div>}
            </div>
        );
    };
});

jest.mock('../../../components/employers/BusinessDocumentUpload', () => {
    return function MockBusinessDocumentUpload(props) {
        return (
            <div data-testid={`document-upload-${props.fieldKey}`}>
                <button
                    data-testid={`upload-button-${props.fieldKey}`}
                    onClick={() => props.setData(prev => ({
                        ...prev,
                        [`${props.fieldUrlKey}`]: `http://example.com/${props.fieldKey}.pdf`
                    }))}
                >
                    {props.uploadTitle}
                </button>
            </div>
        );
    };
});

jest.mock('@mui/material', () => ({
    CircularProgress: () => <div data-testid="circular-progress">Loading...</div>
}));

describe('BusinessProof Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });
    const mockData = {
        registrationType: 'Company',
        companyWebsiteURL: 'https://example.com',
        GSTIN: '',
        PAN: '',
        CIN: '',
        LLPIN: ''
    };

    const mockErrors = {};
    const mockInfo = {};

    const mockGlobalData = {
        metaData: {
            COMPANY_TYPE_FIELD_CONFIG: {
                Company: [
                    { fieldKey: 'CIN', fieldHeader: 'CIN', fieldPlaceholder: 'Enter CIN' },
                    { fieldKey: 'GSTIN', fieldHeader: 'GSTIN', fieldPlaceholder: 'Enter GSTIN' }
                ],
                Partnership: [
                    { fieldKey: 'PAN', fieldHeader: 'PAN', fieldPlaceholder: 'Enter PAN' },
                    { fieldKey: 'GSTIN', fieldHeader: 'GSTIN', fieldPlaceholder: 'Enter GSTIN' }
                ],
                LLP: [
                    { fieldKey: 'LLPIN', fieldHeader: 'LLPIN', fieldPlaceholder: 'Enter LLPIN' },
                    { fieldKey: 'GSTIN', fieldHeader: 'GSTIN', fieldPlaceholder: 'Enter GSTIN' }
                ]
            }
        }
    };

    const mockSetData = jest.fn();
    const mockSetErrors = jest.fn();
    const mockSetInfo = jest.fn();
    const mockHandleBlur = jest.fn();
    const mockSetDocumentNumber = jest.fn();
    const mockSetDocumentType = jest.fn();

    const defaultProps = {
        data: mockData,
        setData: mockSetData,
        errors: mockErrors,
        setErrors: mockSetErrors,
        info: mockInfo,
        setInfo: mockSetInfo,
        globalData: mockGlobalData,
        handleBlur: mockHandleBlur,
        checkDomainData: null,
        isCheckDomainDataLoading: false,
        checkDomainDataError: null,
        domain: 'example.com',
        documentNumber: '',
        setDocumentNumber: mockSetDocumentNumber,
        documentType: '',
        setDocumentType: mockSetDocumentType,
        companyData: null,
        isCompanyDataLoading: false
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders correctly with default props', () => {
        render(<BusinessProof {...defaultProps} />);

        expect(screen.getByText('Business Proof')).toBeInTheDocument();
        expect(screen.getByTestId('field-header-registration-type')).toBeInTheDocument();
        expect(screen.getByTestId("field-header-company-website's-url")).toBeInTheDocument();
    });

    it('handles registration type change', async () => {
        render(<BusinessProof {...defaultProps} />);

        fireEvent.click(screen.getByTestId('dropdown-toggle'));

        fireEvent.click(screen.getByTestId('option-Partnership'));

        expect(mockSetData).toHaveBeenCalled();
        const setDataCalls = mockSetData.mock.calls;

        const registrationTypeCall = setDataCalls.find(call =>
            typeof call[0] === 'function' && 
            call[0]({...mockData}).registrationType === 'Partnership'
        );

        expect(registrationTypeCall).toBeTruthy();

        const resetFieldsCall = setDataCalls.find(call => typeof call[0] === 'function');
        expect(resetFieldsCall).toBeTruthy();
    });

    it('handles input change for company website URL', () => {
        render(<BusinessProof {...defaultProps} />);

        const websiteInput = screen.getByTestId("input-company-website's-url");
        fireEvent.change(websiteInput, { target: { value: 'https://newexample.com' } });

        const websiteCall = mockSetData.mock.calls.find(call =>
            typeof call[0] === 'function' &&
            Object.keys(call[0](mockData)).includes('companyWebsiteURL')
        );

        expect(websiteCall).toBeTruthy();

        const updatedData = websiteCall[0](mockData);
        expect(updatedData.companyWebsiteURL).toBe('https://newexample.com');
    });

    it('validates and formats CIN input', () => {
        render(<BusinessProof {...defaultProps} />);

        const cinInput = screen.getByTestId('input-cin');

        fireEvent.change(cinInput, { target: { value: 'CIN123!@#456' } });

        const cinCall = mockSetData.mock.calls.find(call =>
            typeof call[0] === 'function' &&
            Object.keys(call[0](mockData)).includes('CIN')
        );

        expect(cinCall).toBeTruthy();

        // Verify the value is cleaned up correctly (only alphanumeric)
        const updatedData = cinCall[0](mockData);
        expect(updatedData.CIN).toBe('CIN123456');
    });

    it('validates and formats LLPIN input', () => {
        const llpProps = {
            ...defaultProps,
            data: { ...mockData, registrationType: 'LLP' }
        };

        render(<BusinessProof {...llpProps} />);

        const llpinInput = screen.getByTestId('input-llpin');

        fireEvent.change(llpinInput, { target: { value: 'ABC1234' } });

        const llpinCall = mockSetData.mock.calls.find(call =>
            typeof call[0] === 'function' &&
            Object.keys(call[0](llpProps.data)).includes('LLPIN')
        );

        expect(llpinCall).toBeTruthy();

        const updatedData = llpinCall[0](llpProps.data);
        expect(updatedData.LLPIN).toBe('ABC-1234');
    });

    it('validates website URL length', async () => {
        const longDomain = 'a'.repeat(DOMAIN_MAX_LENGTH + 10);
        const props = {
            ...defaultProps,
            domain: longDomain
        };

        render(<BusinessProof {...props} />);

        await waitFor(() => {
            expect(mockSetErrors).toHaveBeenCalled();
        });

        const errorCall = mockSetErrors.mock.calls.find(call =>
            typeof call[0] === 'function' &&
            call[0]({}).companyWebsiteURL?.includes(DOMAIN_MAX_LENGTH.toString())
        );

        expect(errorCall).toBeTruthy();
    });

    it('sets document type and number when GSTIN has full length', async () => {
        const fullGSTINLength = MAX_LENGTHS.GSTIN;
        const fullGSTIN = 'G'.padEnd(fullGSTINLength, '1');

        const props = {
            ...defaultProps,
            data: { ...mockData, GSTIN: fullGSTIN }
        };

        render(<BusinessProof {...props} />);

        await waitFor(() => {
            expect(mockSetDocumentType).toHaveBeenCalledWith('GSTIN');
            expect(mockSetDocumentNumber).toHaveBeenCalledWith(fullGSTIN);
        });
    });

    it('sets document type and number when PAN has full length', async () => {
        const fullPANLength = MAX_LENGTHS.PAN;
        const fullPAN = 'P'.padEnd(fullPANLength, '1');

        const props = {
            ...defaultProps,
            data: { ...mockData, PAN: fullPAN }
        };

        render(<BusinessProof {...props} />);

        await waitFor(() => {
            expect(mockSetDocumentType).toHaveBeenCalledWith('PAN');
            expect(mockSetDocumentNumber).toHaveBeenCalledWith(fullPAN);
        });
    });

    it('shows loading indicator when checking company data', async () => {
        const props = {
            ...defaultProps,
            isCompanyDataLoading: true,
            documentType: 'GSTIN'
        };

        render(<BusinessProof {...props} />);

        await waitFor(() => {
            expect(mockSetInfo).toHaveBeenCalled();
        });

        const infoCall = mockSetInfo.mock.calls.find(call =>
            typeof call[0] === 'function' &&
            call[0]({}).GSTIN !== null
        );

        expect(infoCall).toBeTruthy();
    });

    it('handles document upload', () => {
        render(<BusinessProof {...defaultProps} />);

        const gstinUploadButton = screen.getByTestId('upload-button-GSTIN');

        fireEvent.click(gstinUploadButton);

        expect(mockSetData).toHaveBeenCalled();

        const uploadCall = mockSetData.mock.calls.find(call =>
            typeof call[0] === 'function' &&
            Object.keys(call[0](mockData)).includes('GSTINUrl')
        );

        expect(uploadCall).toBeTruthy();
        expect(uploadCall[0](mockData).GSTINUrl).toBe('http://example.com/GSTIN.pdf');
    });

    it('handles invalid website URL from API response', async () => {
        const props = {
            ...defaultProps,
            domain: 'example.com',
            checkDomainData: { isValid: 'false' },
            isCheckDomainDataLoading: false
        };

        render(<BusinessProof {...props} />);

        await waitFor(() => {
            expect(mockSetErrors).toHaveBeenCalled();
        });

        const errorCall = mockSetErrors.mock.calls.find(call =>
            typeof call[0] === 'function' &&
            call[0]({}).companyWebsiteURL?.includes('Invalid website')
        );

        expect(errorCall).toBeTruthy();
    });
});