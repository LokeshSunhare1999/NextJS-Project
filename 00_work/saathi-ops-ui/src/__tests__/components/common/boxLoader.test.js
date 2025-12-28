import React from 'react';
import { render, screen } from '@testing-library/react';
import BoxLoader from '../../../components/common/BoxLoader';
import '@testing-library/jest-dom';

describe('BoxLoader Component', () => {
  test('renders the correct number of Skeleton loaders based on size prop', () => {
    const size = 3;

    // Render the component with a specific size
    render(<BoxLoader size={size} />);

    // Check if the correct number of Skeleton elements are rendered
    const skeletonElements = screen.getAllByTestId('skeleton-loader');
    expect(skeletonElements).toHaveLength(size);
  });

  test('defaults to 5 Skeleton loaders when no size prop is provided', () => {
    // Render the component without the `size` prop
    render(<BoxLoader />);

    // Default size should be 5, so check for 5 Skeleton loaders
    const skeletonElements = screen.getAllByTestId('skeleton-loader');
    expect(skeletonElements).toHaveLength(5);
  });

  test('should render the Skeleton component with animation', () => {
    // Render with default size (5)
    render(<BoxLoader />);

    // Check if Skeleton component contains the animation
    const skeletonElements = screen.getAllByTestId('skeleton-loader');
    skeletonElements.forEach((element) => {
      expect(element).toHaveClass('MuiSkeleton-wave');
    });
  });
});
