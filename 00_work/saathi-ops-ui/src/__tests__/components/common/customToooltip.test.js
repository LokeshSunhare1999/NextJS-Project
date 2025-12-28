import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import CustomTooltip from '../../../components/common/CustomTooltip';

describe('CustomTooltip Component', () => {
  test('renders tooltip text correctly on hover', async () => {
    render(
      <CustomTooltip title="Tooltip text" arrow>
        <button>Hover over me</button>
      </CustomTooltip>,
    );

    const button = screen.getByText('Hover over me');
    expect(button).toBeInTheDocument();
    fireEvent.mouseEnter(button);

    const tooltip = await screen.findByText('Tooltip text');
    expect(tooltip).toBeInTheDocument();
  });

  test('renders with correct background color when bgColor prop is provided', async () => {
    render(
      <CustomTooltip title="Tooltip text" arrow bgColor="#ff5733">
        <button>Hover over me</button>
      </CustomTooltip>,
    );
    const button = screen.getByText('Hover over me');
    expect(button).toBeInTheDocument();
    fireEvent.mouseEnter(button);

    const tooltip = await screen.findByText('Tooltip text');
    expect(tooltip).toBeInTheDocument();

    expect(tooltip).toHaveStyle('background-color: #ff5733');
  });

  test('renders with default background color when bgColor prop is not provided', async () => {
    render(
      <CustomTooltip title="Tooltip text" arrow>
        <button>Hover over me</button>
      </CustomTooltip>,
    );

    const button = screen.getByText('Hover over me');
    fireEvent.mouseEnter(button);

    const tooltip = await screen.findByText('Tooltip text');
    expect(tooltip).toHaveStyle('background-color: #000');
  });

  test('tooltip becomes visible on hover', async () => {
    render(
      <CustomTooltip title="Tooltip text" arrow>
        <button>Hover over me</button>
      </CustomTooltip>,
    );
    const button = screen.getByText('Hover over me');
    expect(screen.queryByText('Tooltip text')).not.toBeInTheDocument();
    fireEvent.mouseEnter(button);
    const tooltip = await screen.findByText('Tooltip text');
    expect(tooltip).toBeInTheDocument();
  });
});
