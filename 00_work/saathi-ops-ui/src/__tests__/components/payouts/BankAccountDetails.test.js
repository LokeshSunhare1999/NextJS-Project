import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BankAccountDetails from '../../../components/payouts/BankAccountDetails';

const mockBankAccountData = [
  { label: 'Account Number', value: '1234567890' },
  { label: 'Bank Name', value: 'Example Bank' },
  { label: 'Account Type', value: 'Checking' }
];

describe('BankAccountDetails Component', () => {
  it('renders all bank account details', () => {
    render(<BankAccountDetails bankAccountData={mockBankAccountData} />);
    
    mockBankAccountData.forEach(item => {
      const labelElement = screen.getByText(item.label);
      const valueElement = screen.getByText(item.value);
      
      expect(labelElement).toBeInTheDocument();
      expect(valueElement).toBeInTheDocument();
    });
  });

  it('renders nothing when no bank account data is provided', () => {
    render(<BankAccountDetails bankAccountData={[]} />);
    
    const wrapper = screen.getByTestId('bank-account-wrapper');
    expect(wrapper.children.length).toBe(0);
  });

  it('renders separators between items except for the last', () => {
    render(<BankAccountDetails bankAccountData={mockBankAccountData} />);
    
    const separators = screen.getAllByTestId('account-separator');
    expect(separators).toHaveLength(mockBankAccountData.length - 1);
  });

  it('applies correct styling to labels and values', () => {
    render(<BankAccountDetails bankAccountData={mockBankAccountData} />);
    
    const firstLabel = screen.getByText(mockBankAccountData[0].label);
    const firstValue = screen.getByText(mockBankAccountData[0].value);
    
    expect(firstLabel).toHaveStyle('color: #000000');
    expect(firstLabel).toHaveStyle('font-weight: 400');
    expect(firstValue).toHaveStyle('color: #5D5D5D');
  });

  it('renders labels and values with special characters and long text', () => {
    const specialData = [
      { label: 'Special Account #', value: 'Long Bank Name with Special Ch@r@cters 123' }
    ];
    
    render(<BankAccountDetails bankAccountData={specialData} />);
    
    expect(screen.getByText('Special Account #')).toBeInTheDocument();
    expect(screen.getByText('Long Bank Name with Special Ch@r@cters 123')).toBeInTheDocument();
  });
});
