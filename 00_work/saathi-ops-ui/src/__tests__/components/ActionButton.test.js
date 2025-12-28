import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButton from '../../components/ActionButton';
import usePermission from '../../hooks/usePermission';
jest.mock('../../hooks/usePermission');

const mockSetActionOpen = jest.fn();
const mockHandleClick = jest.fn();
const mockHandleFileUpload = jest.fn();
const mockHandleClickAway = jest.fn();

const arrBtn = [
  {
    type: 'button',
    onClick: mockHandleClick,
    icon: 'icon-path',
    iconWidth: '20px',
    iconHeight: '20px',
    text: 'Button 1',
    color: '#000',
    isVisible: true,
  },
  {
    type: 'input',
    handleFileUpload: mockHandleFileUpload,
    icon: 'icon-path',
    iconWidth: '20px',
    iconHeight: '20px',
    text: 'Upload',
    color: '#000',
    isVisible: true,
  },
];

describe('ActionButton Component', () => {
  beforeEach(() => {
    usePermission.mockReturnValue({ hasPermission: () => true });
    jest.clearAllMocks(); // clearing all mock functions
  });

  it('renders ActionButton component', () => {
    render(<ActionButton arrBtn={arrBtn} setActionOpen={mockSetActionOpen} />);

    expect(screen.getByText('Button 1')).toBeInTheDocument();
    expect(screen.getByText('Upload')).toBeInTheDocument();
  });

  it('handles button click', () => {
    render(<ActionButton arrBtn={arrBtn} setActionOpen={mockSetActionOpen} />);

    fireEvent.click(screen.getByText('Button 1'));
    expect(mockHandleClick).toHaveBeenCalled();
  });

  // need to implement this test

  // it('handles file upload', async () => {
  //   render(<ActionButton arrBtn={arrBtn} setActionOpen={mockSetActionOpen} />);

  //   const fileInput = screen.getByText('Upload');
  //   const file = new File(['dummy content'], 'test-file.txt', { type: 'text/plain' });
  //   fireEvent.change(fileInput, { target: { files: [file] } });

  //   await waitFor(() => {
  //     expect(mockHandleFileUpload).not.toHaveBeenCalledWith(file);
  //   });
  //   expect(mockSetActionOpen).not.toHaveBeenCalledWith(false);
  // });

  it('handles click away', () => {
    const { container } = render(<ActionButton arrBtn={arrBtn} setActionOpen={mockSetActionOpen} />);

    fireEvent.mouseDown(container);

    expect(mockHandleClickAway).not.toHaveBeenCalled();
  });
});