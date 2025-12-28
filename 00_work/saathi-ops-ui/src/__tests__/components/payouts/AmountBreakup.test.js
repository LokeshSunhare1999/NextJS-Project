import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AmountBreakup from '../../../components/payouts/AmountBreakup';

describe('AmountBreakup', () => {
  // Mock data for testing
  const mockAmountBreakupData = [
    {
      label: 'Subtotal',
      value: '$100.00',
      fontWeight: 400,
      color: '#666666'
    },
    {
      label: 'Tax',
      value: '$10.00',
      fontWeight: 400,
      color: '#666666'
    },
    {
      label: 'Total',
      value: '$110.00',
      fontWeight: 600,
      color: '#000000'
    }
  ];

  it('should render the "no amount breakup" message when data is empty', () => {
    render(<AmountBreakup amountBreakupData={[]} />);
    expect(screen.getByText('There is no amount breakup')).toBeInTheDocument();
  });

  it('should render the "no amount breakup" message when data is null', () => {
    render(<AmountBreakup amountBreakupData={null} />);
    expect(screen.getByText('There is no amount breakup')).toBeInTheDocument();
  });

  it('should render the "no amount breakup" message when data is undefined', () => {
    render(<AmountBreakup />);
    expect(screen.getByText('There is no amount breakup')).toBeInTheDocument();
  });

  it('should render all items with correct labels and values', () => {
    render(<AmountBreakup amountBreakupData={mockAmountBreakupData} />);
    const expectedLabels = ['Subtotal', 'Tax', 'Total'];
    const expectedValues = ['$100.00', '$10.00', '$110.00'];

    expectedLabels.forEach((label, index) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(expectedValues[index])).toBeInTheDocument();
    });
  });


  it('should handle null items in the array', () => {
    const dataWithNullItem = [
      mockAmountBreakupData[0],
      null,
      mockAmountBreakupData[2]
    ];

    render(<AmountBreakup amountBreakupData={dataWithNullItem} />);

    const expectedLabels = ['Subtotal', 'Total'];
    const expectedValues = ['$100.00', '$110.00'];

    expectedLabels.forEach((label, index) => {
      expect(screen.getByText(label)).toBeInTheDocument();
      expect(screen.getByText(expectedValues[index])).toBeInTheDocument();
    });

    expect(screen.queryByText('Tax')).not.toBeInTheDocument();
  });

  it('should apply custom styles based on props', () => {
    const { container } = render(<AmountBreakup amountBreakupData={mockAmountBreakupData} />);

    const totalLabel = screen.getByText('Total');
    const totalLabelStyles = window.getComputedStyle(totalLabel);
    const totalValue = screen.getByText('$110.00');
    const totalValueStyles = window.getComputedStyle(totalValue);

    expect(totalLabelStyles.fontWeight).toBe('600')
    expect(totalLabelStyles.color).toBe("rgb(0, 0, 0)")

    expect(totalValueStyles.fontWeight).toBe('600')
    expect(totalValueStyles.color).toBe("rgb(0, 0, 0)");
  });

  it('should apply default styles when style props are not provided', () => {
    const dataWithoutStyles = [
      {
        label: 'Subtotal',
        value: '$100.00'
        // No fontWeight or color specified
      }
    ];

    render(<AmountBreakup amountBreakupData={dataWithoutStyles} />);

    const subtotalLabel = screen.getByText('Subtotal');
    const subtotalLabelStyles = window.getComputedStyle(subtotalLabel);

    expect(subtotalLabelStyles.fontWeight).toBe('400')
    expect(subtotalLabelStyles.color).toBe("rgb(102, 102, 102)");
  });
});