import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Search from '../../components/Search';

jest.mock('@mui/material/TextField', () => (props) => (
  <input
    data-testid="text-field"
    placeholder={props.label}
    type="text"
  />
));

jest.mock('../../components/CustomCTA', () => (props) => (
  <button data-testid="custom-cta">{props.title}</button>
));

describe('Search Component', () => {
  const placeholderText = 'Search for items';
  jest.spyOn(console, 'error').mockImplementation(() => { });

  it('renders without crashing', () => {
    render(<Search placeholder={placeholderText} />);

    const searchContainer = screen.getByRole('textbox');
    expect(searchContainer).toBeInTheDocument();
  });

  it('displays the correct placeholder text in the TextField', () => {
    render(<Search placeholder={placeholderText} />);
    const textField = screen.getByTestId('text-field');
    expect(textField).toHaveAttribute('placeholder', placeholderText);
  });

  it('renders the CustomCTA component with the correct title', () => {
    render(<Search placeholder={placeholderText} />);
    const customCTA = screen.getByTestId('custom-cta');
    expect(customCTA).toBeInTheDocument();
    expect(customCTA).toHaveTextContent('Search');
  });
});