import React from 'react';
import { render, screen } from '@testing-library/react';
import InfoBlock from '../../../components/common/InfoBlock';
import { RUPEE_SYMBOL } from '../../../constants/details';
import '@testing-library/jest-dom';

describe('InfoBlock Component', () => {
    const mockItem = 1000;
    const mockTooltipIcon = 'path/to/tooltip-icon.png';
    const mockStatusRemark = {
        grossAmount: 1000,
        processingCharge: 2,
        processingAmount: 20,
        tdsCharge: 10,
        tdsAmount: 100,
        netAmount: 880,
    };

    it('renders the item amount with rupee symbol', () => {
        render(
            <InfoBlock
                item={mockItem}
                tooltipIcon={mockTooltipIcon}
                showTooltip={false}
            />
        );

        expect(screen.getByText(`${RUPEE_SYMBOL} ${mockItem}`)).toBeInTheDocument();
    });

    it('does not render the tooltip when showTooltip is false', () => {
        render(
            <InfoBlock
                item={mockItem}
                tooltipIcon={mockTooltipIcon}
                showTooltip={false}
            />
        );

        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('renders the tooltip when showTooltip is true', () => {
        render(
            <InfoBlock
                item={mockItem}
                tooltipIcon={mockTooltipIcon}
                showTooltip={true}
                statusRemark={mockStatusRemark}
            />
        );

        expect(screen.getByRole('img', { name: /tooltip/i })).toBeInTheDocument();
    });

});