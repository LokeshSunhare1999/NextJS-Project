import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import DocumentStatus from '../../../components/customerDetails/DocumentStatus';

const VERIFICATION_FILTER_SECTIONS = {
    section1: 'Verification Status Section 1',
    section2: 'Verification Status Section 2',
    section3: 'Verification Status Section 3',
};

jest.mock('../../../constants/verification', () => ({
    VERIFICATION_FILTER_SECTIONS: VERIFICATION_FILTER_SECTIONS,
}));

describe('DocumentStatus Component', () => {
    jest.spyOn(console, 'error').mockImplementation(() => { });

    it('renders the correct status title, background color, and text color', () => {
        const status = 'success';
        render(<DocumentStatus status={status} />);

        const statusTag = screen.getByText('Success');
        expect(statusTag).toBeInTheDocument();
        expect(statusTag).toHaveStyle('background-color: #32B237');
        expect(statusTag).toHaveStyle('color: #FFF');
    });

    it('renders default status for undefined/null/----- status', () => {
        const statuses = [undefined, null, '-----'];
        statuses.forEach((status) => {
            render(<DocumentStatus status={status} />);
            const statusTag = screen.getAllByText('-----')[0];
            expect(statusTag).toBeInTheDocument();
            expect(statusTag).toHaveStyle('background-color: #FFF');
            expect(statusTag).toHaveStyle('color: #000');
        });
    });

    it('renders tooltip when showTooltip is true and statusRemark is provided', () => {
        const statusRemark = { verified: ['section1', 'section2'], rejected: ['section3'], };
        const tooltipIcon = 'tooltip-icon.png';
        render(
            <DocumentStatus
                status="verified"
                showTooltip={true}
                tooltipIcon={tooltipIcon}
                statusRemark={statusRemark}
            />,
        );

        const tooltipIconElement = screen.getByAltText('Tooltip');
        expect(tooltipIconElement).toBeInTheDocument();
        expect(tooltipIconElement).toHaveAttribute('src', 'tooltip-icon.png');
    });

    it('renders unknown status with default styles', () => {
        const status = 'unknown_status';
        render(<DocumentStatus status={status} />);

        const statusTag = screen.getByText(status);
        expect(statusTag).toBeInTheDocument();
        expect(statusTag).toHaveStyle('background-color: #FFD75D');
        expect(statusTag).toHaveStyle('color: #000');
    });

    it('renders status for undefined/null/----- status', () => {
        const status = '-----';
        render(<DocumentStatus status={status} />);

        const statusTag = screen.getByText('-----');
    });
});