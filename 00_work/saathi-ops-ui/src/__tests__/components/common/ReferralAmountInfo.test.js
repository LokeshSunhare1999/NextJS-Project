import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ReferralAmountInfo from '../../../components/common/ReferralAmountInfo';
import { RUPEE_SYMBOL } from '../../../constants/details';

jest.mock('../../../components/common/CustomTooltip', () => ({ children, title }) => (
  <div data-testid="custom-tooltip">{title}{children}</div>
));

describe('ReferralAmountInfo Component', () => {
  it('renders referral amount with rupee symbol', () => {
    render(<ReferralAmountInfo item={500} showTooltip={false} />);
    expect(screen.getByText(`${RUPEE_SYMBOL} 500`)).toBeInTheDocument();
  });

  it('renders tooltip icon when showTooltip is true', () => {
    render(<ReferralAmountInfo item={1000} tooltipIcon="/path/to/icon.png" showTooltip={true} />);
    const tooltipIcon = screen.getByAltText('Tooltip');
    expect(tooltipIcon).toBeInTheDocument();
    expect(tooltipIcon).toHaveAttribute('src', '/path/to/icon.png');
  });

  it('does not render tooltip icon when showTooltip is false', () => {
    render(<ReferralAmountInfo item={1000} showTooltip={false} />);
    expect(screen.queryByAltText('Tooltip')).not.toBeInTheDocument();
  });

  it('renders status remarks inside tooltip', () => {
    const remarks = ['First remark', 'Second remark', 'Third remark'];
    render(
      <ReferralAmountInfo
        item={1500}
        tooltipIcon="/path/to/icon.png"
        showTooltip={true}
        statusRemark={remarks}
      />
    );

    remarks.forEach((remark) => {
      expect(screen.getByText(remark)).toBeInTheDocument();
    });
  });

  it('does not render tooltip content when statusRemark is empty', () => {
    render(
      <ReferralAmountInfo
        item={2000}
        tooltipIcon="/path/to/icon.png"
        showTooltip={true}
        statusRemark={[]}
      />
    );
    expect(screen.getByAltText('Tooltip')).toBeEmptyDOMElement();
  });
});
