import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import BusinessVerificationPageResults from '../../../components/employers/BusinessVerificationPageResults';

// Mock the imported components
jest.mock('../../../components/common/ImageContainer', () => {
  return function MockImageContainer({ images, detailsData }) {
    return <div data-testid="image-container" data-images={JSON.stringify(images)} data-details={JSON.stringify(detailsData)} />;
  };
});

jest.mock('../../../components/atom/tableComponents/DetailsContainer', () => {
  return function MockDetailsContainer({ customProps, showTitle, detailsData }) {
    return (
      <div 
        data-testid="details-container" 
        data-custom-props={JSON.stringify(customProps)} 
        data-show-title={showTitle.toString()} 
        data-details={JSON.stringify(detailsData)} 
      />
    );
  };
});

describe('BusinessVerificationPageResults', () => {
  const mockBusinessData = {
    imgUrls: ['image1.jpg', 'image2.jpg'],
    businessName: 'Test Business',
    address: '123 Test St',
    city: 'Test City',
    possibleStates: ['CA', 'NY'],
    showNotificationButton: true,
    verificationStatus: 'VERIFIED',
    registrationId: 'ABC123',
    phone: '555-123-4567'
  };

 it('renders component with title', () => {
    render(<BusinessVerificationPageResults businessVerificationData={mockBusinessData} pageRoute="test-route" />);
    
    expect(screen.getByText('Hyperverge Verification Results')).toBeInTheDocument();
  });

 it('passes correct image data to ImageContainer', () => {
    render(<BusinessVerificationPageResults businessVerificationData={mockBusinessData} pageRoute="test-route" />);
    
    const imageContainer = screen.getByTestId('image-container');
    const passedImages = JSON.parse(imageContainer.dataset.images);
    
    expect(passedImages).toEqual(['image1.jpg', 'image2.jpg']);
  });

 it('passes filtered detailsData to DetailsContainer', () => {
    render(<BusinessVerificationPageResults businessVerificationData={mockBusinessData} pageRoute="test-route" />);
    
    const detailsContainer = screen.getByTestId('details-container');
    const passedDetails = JSON.parse(detailsContainer.dataset.details);
    
    // Ensure removed keys are not present
    expect(passedDetails.imgUrls).toBeUndefined();
    expect(passedDetails.possibleStates).toBeUndefined();
    expect(passedDetails.showNotificationButton).toBeUndefined();
    expect(passedDetails.verificationStatus).toBeUndefined();
    
    // Ensure other data is present
    expect(passedDetails.businessName).toEqual('Test Business');
    expect(passedDetails.address).toEqual('123 Test St');
    expect(passedDetails.city).toEqual('Test City');
    expect(passedDetails.registrationId).toEqual('ABC123');
    expect(passedDetails.phone).toEqual('555-123-4567');
  });

 it('correctly sets DetailsContainer props', () => {
    render(<BusinessVerificationPageResults businessVerificationData={mockBusinessData} pageRoute="test-route" />);
    
    const detailsContainer = screen.getByTestId('details-container');
    const customProps = JSON.parse(detailsContainer.dataset.customProps);
    const showTitle = detailsContainer.dataset.showTitle === 'true';
    
    expect(customProps).toEqual({ textWidth: '240px' });
    expect(showTitle).toBe(false);
  });

 it('handles empty imgUrls properly', () => {
    const dataWithoutImages = {
      businessName: 'Test Business',
      address: '123 Test St',
      city: 'Test City',
      possibleStates: ['CA', 'NY'],
      showNotificationButton: true,
      verificationStatus: 'VERIFIED'
    };
    
    render(<BusinessVerificationPageResults businessVerificationData={dataWithoutImages} pageRoute="test-route" />);
    
    const imageContainer = screen.getByTestId('image-container');
    const passedImages = JSON.parse(imageContainer.dataset.images);
    
    expect(passedImages).toEqual([]);
  });

 it('handles case where only keys to be deleted exist', () => {
    const minimalData = {
      imgUrls: [],
      possibleStates: [],
      showNotificationButton: false,
      verificationStatus: 'PENDING'
    };
    
    render(<BusinessVerificationPageResults businessVerificationData={minimalData} pageRoute="test-route" />);
    
    const detailsContainer = screen.getByTestId('details-container');
    const passedDetails = JSON.parse(detailsContainer.dataset.details);
    
    expect(Object.keys(passedDetails).length).toBe(0);
  });
});