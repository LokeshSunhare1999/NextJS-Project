import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ApplicantDetailsPageHeader from '../../../components/applicants/ApplicantDetailsPageHeader';

jest.mock('../../../components/customerDetails/DocumentStatus', () => jest.fn(() => <div>Document Status Component</div>));

describe('ApplicantDetailsPageHeader Component', () => {
  it('renders heading and subheading correctly', () => {
    render(
      <ApplicantDetailsPageHeader
        heading="Applicant Details"
        subHeading="Subheading Info"
        status="PENDING"
      />
    );

    expect(screen.getByText('Applicant Details')).toBeInTheDocument();
    expect(screen.getByText('Subheading Info')).toBeInTheDocument();
  });

  it('renders subHeadingComponent if provided', () => {
    render(
      <ApplicantDetailsPageHeader
        heading="Applicant Details"
        subHeading="Subheading Info"
        status="PENDING"
        subHeadingComponent={<div>Custom Subheading Component</div>}
      />
    );

    expect(screen.getByText('Custom Subheading Component')).toBeInTheDocument();
  });

  it('renders DocumentStatus component when status is ONBOARDED', () => {
    render(
      <ApplicantDetailsPageHeader
        heading="Applicant Details"
        subHeading="Subheading Info"
        status="ONBOARDED"
      />
    );

    expect(screen.getByText('Document Status Component')).toBeInTheDocument();
  });

  it('does not render DocumentStatus component when status is not ONBOARDED', () => {
    render(
      <ApplicantDetailsPageHeader
        heading="Applicant Details"
        subHeading="Subheading Info"
        status="PENDING"
      />
    );

    expect(screen.queryByText('Document Status Component')).toBeNull();
  });
});
