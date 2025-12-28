import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import JobPostInfoSection from '../../../components/employers/JobPostInfoSection';
import {
  MAX_CHAR_LIMIT,
  MIN_QUALIFICATION_LIST,
} from '../../../constants/employer';
import '@testing-library/jest-dom';

// Mock components
jest.mock(
  '../../../components/common/DrawerInput',
  () =>
    ({
      fieldType,
      fieldHeader,
      fieldPlaceholder,
      fieldValue,
      handleFieldChange,
      children,
      showFieldHeader,
      handleDropDownSelect,
      dropDownList,
      dropDownOpen,
      handleDropDownOpen,
      isDropDownScrollable,
      isDropDownDisabled,
    }) => {
      if (fieldType === 'children') {
        return <div data-testid="drawer-input-children">{children}</div>;
      }
      if (fieldType === 'dropdown') {
        return (
          <div data-testid="dropdown-mock">
            <div data-testid="dropdown-header">{fieldHeader}</div>
            <div
              data-testid="dropdown-value"
              onClick={() => handleDropDownOpen(!dropDownOpen)}
            >
              {fieldValue}
            </div>
            {dropDownOpen && (
              <ul data-testid="dropdown-list">
                {dropDownList.map((item, index) => (
                  <li
                    key={index}
                    data-testid={`dropdown-item-${item}`}
                    onClick={() => handleDropDownSelect(item)}
                  >
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        );
      }
      return (
        <div data-testid={`input-${fieldType}`}>
          <div data-testid="input-header">{fieldHeader}</div>
          <input
            data-testid={`input-field-${fieldHeader?.toLowerCase().replace(/\s/g, '-')}`}
            placeholder={fieldPlaceholder}
            value={fieldValue || ''}
            onChange={handleFieldChange}
          />
        </div>
      );
    },
);

jest.mock(
  '../../../components/common/LocationInput',
  () =>
    ({
      onLocationSelect,
      onLocationRemove,
      locationData,
      error,
      isDisabled,
    }) => (
      <div data-testid="location-input-mock">
        {locationData?.city ? (
          <div>
            <span data-testid="location-display">
              {locationData.city}, {locationData.state}
            </span>
            <button
              data-testid="remove-location-btn"
              onClick={onLocationRemove}
              disabled={isDisabled}
            >
              Remove
            </button>
          </div>
        ) : (
          <button
            data-testid="add-location-btn"
            onClick={() =>
              onLocationSelect({ city: 'Test City', state: 'Test State' })
            }
            disabled={isDisabled}
          >
            Add Location
          </button>
        )}
        {error && <div data-testid="location-error">{error}</div>}
      </div>
    ),
);

jest.mock(
  '../../../components/common/SelectableInputPill',
  () =>
    ({
      header,
      placeholder,
      selectedPills,
      currentValue,
      inputContainerWidth,
      error,
      onChange,
      onAdd,
      onRemove,
    }) => (
      <div data-testid="selectable-input-pill-mock">
        <div data-testid="pill-header">{header}</div>
        <input
          data-testid="benefit-input"
          placeholder={placeholder}
          value={currentValue || ''}
          onChange={(e) => onChange(e.target.value)}
        />
        <button data-testid="add-benefit-btn" onClick={onAdd}>
          Add
        </button>
        <div data-testid="benefits-list">
          {selectedPills.map((pill, index) => (
            <div key={index} data-testid={`benefit-pill-${index}`}>
              {pill}
              <button
                data-testid={`remove-benefit-${index}`}
                onClick={() => onRemove(index)}
              >
                x
              </button>
            </div>
          ))}
        </div>
        {error && <div data-testid="benefit-error">{error}</div>}
      </div>
    ),
);

// Mock data
const mockJobDetails = {
  description: 'Test job description',
  benefits: ['Health Insurance', 'Flexible Hours'],
  location: {},
  minQualification: '12th Pass',
  minExp: '2',
  maxExp: '5',
  noMandatoryExperience: false,
  status: 'DRAFT',
};

const mockErrors = {
  description: '',
  benefits: '',
  location: '',
  minExp: '',
};

describe('JobPostInfoSection', () => {
  let setJobDetailsMock;
  let setErrorsMock;

  beforeEach(() => {
    setJobDetailsMock = jest.fn();
    setErrorsMock = jest.fn();
  });

  it('renders all form fields correctly', () => {
    render(
      <JobPostInfoSection
        jobDetails={mockJobDetails}
        setJobDetails={setJobDetailsMock}
        errors={mockErrors}
        setErrors={setErrorsMock}
      />,
    );

    expect(screen.getByTestId('input-field-description')).toBeInTheDocument();
    expect(screen.getByTestId('pill-header')).toHaveTextContent('Benefits');
    expect(screen.getByTestId('location-input-mock')).toBeInTheDocument();
    expect(screen.getByTestId('dropdown-header')).toHaveTextContent(
      'Min. Qualification',
    );
    expect(screen.getByPlaceholderText('Minimum Year')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Maximum Year')).toBeInTheDocument();
    expect(screen.getByText('No Mandatory exp')).toBeInTheDocument();
  });

  it('allows updating job description', () => {
    render(
      <JobPostInfoSection
        jobDetails={mockJobDetails}
        setJobDetails={setJobDetailsMock}
        errors={mockErrors}
        setErrors={setErrorsMock}
      />,
    );

    const descriptionInput = screen.getByTestId('input-field-description');
    fireEvent.change(descriptionInput, {
      target: { value: 'Updated job description' },
    });

    expect(setJobDetailsMock).toHaveBeenCalledWith({
      ...mockJobDetails,
      description: 'Updated job description',
    });
  });

  it('allows adding benefits', () => {
    render(
      <JobPostInfoSection
        jobDetails={mockJobDetails}
        setJobDetails={setJobDetailsMock}
        errors={mockErrors}
        setErrors={setErrorsMock}
      />,
    );

    const benefitInput = screen.getByTestId('benefit-input');
    const addBenefitBtn = screen.getByTestId('add-benefit-btn');

    fireEvent.change(benefitInput, { target: { value: 'Remote Work' } });
    fireEvent.click(addBenefitBtn);

    expect(setJobDetailsMock).toHaveBeenCalledWith({
      ...mockJobDetails,
      benefits: [...mockJobDetails.benefits, 'Remote Work'],
    });

    setJobDetailsMock.mockClear();

    fireEvent.change(benefitInput, { target: { value: 'Gym,Free Lunch' } });
    fireEvent.click(addBenefitBtn);

    expect(setJobDetailsMock).toHaveBeenCalledWith({
      ...mockJobDetails,
      benefits: [...mockJobDetails.benefits, 'Gym', 'Free Lunch'],
    });
  });

  it('validates benefit length', () => {
    render(
      <JobPostInfoSection
        jobDetails={mockJobDetails}
        setJobDetails={setJobDetailsMock}
        errors={mockErrors}
        setErrors={setErrorsMock}
      />,
    );

    const benefitInput = screen.getByTestId('benefit-input');
    const addBenefitBtn = screen.getByTestId('add-benefit-btn');

    fireEvent.change(benefitInput, {
      target: {
        value:
          'In the modern digital era, software development has transcended beyond simple code creation and now encompasses intricate ecosystems of tools, collaboration, and scalable infrastructure. Developers today are not merely coders—they are system architects, product thinkers, and problem solvers. With the rise of cloud computing, microservices, and serverless architectures, the definition of scalability has evolved. We no longer simply write applications—we deploy experiences across globally distributed systems designed to handle millions of requests per second.Consider a frontend developer working on a large-scale web platform. Their task isn’t just to make the UI look appealing; it’s to ensure the experience is responsive, accessible, performant, and adaptable to dozens of screen sizes and network conditions. This complexity is mirrored on the backend, where APIs must be secure, fault-tolerant, and fast. Every decision—down to a color choice or database index—can have ripple effects on user experience or system performance.Furthermore, developers must now understand CI/CD pipelines, containerization (e.g., Docker), infrastructure-as-code (e.g., Terraform), testing frameworks, monitoring tools, and much more. Staying current requires continuous learning, experimentation, and cross-functional collaboration. Documentation, once seen as optional, is now a key part of long-term team success. It’s not just about what code does, but why it was written that way.As we look ahead, artificial intelligence is becoming a co-pilot in the development process. Tools like GitHub Copilot and ChatGPT assist with code completion, bug detection, and even architecture suggestions. This doesn’t mean the human developer is obsolete—instead, it highlights a shift toward more creative and strategic engineering roles, where machines handle the repetitive tasks and humans focus on innovation, ethics, and user empathy.In conclusion, software development is no longer about building features in isolation. It’s about crafting experiences within ecosystems, with deep awareness of users, systems, and evolving technologies. The most successful developers of tomorrow will be those who embrace this complexity, communicate clearly, and learn relentlessly.',
      },
    });
    fireEvent.click(addBenefitBtn);

    expect(setErrorsMock).toHaveBeenCalled();

    const errorUpdateFn = setErrorsMock.mock.calls[0][0];

    const updatedErrors = errorUpdateFn(mockErrors);

    expect(updatedErrors).toEqual({
      ...mockErrors,
      benefits: `Benefits should not exceed ${MAX_CHAR_LIMIT} characters`,
    });

    expect(setJobDetailsMock).not.toHaveBeenCalled();
  });

  it('allows removing benefits', () => {
    render(
      <JobPostInfoSection
        jobDetails={mockJobDetails}
        setJobDetails={setJobDetailsMock}
        errors={mockErrors}
        setErrors={setErrorsMock}
      />,
    );

    const removeBtn = screen.getByTestId('remove-benefit-0');
    fireEvent.click(removeBtn);

    expect(setJobDetailsMock).toHaveBeenCalledWith({
      ...mockJobDetails,
      benefits: ['Flexible Hours'],
    });
  });

  // it('allows setting and removing location', () => {
  //     render(
  //         <JobPostInfoSection
  //             jobDetails={mockJobDetails}
  //             setJobDetails={setJobDetailsMock}
  //             errors={mockErrors}
  //             setErrors={setErrorsMock}
  //         />
  //     );

  //     // Add location
  //     const addLocationBtn = screen.getByTestId('add-location-btn');
  //     fireEvent.click(addLocationBtn);

  //     expect(setJobDetailsMock).toHaveBeenCalledWith({
  //         ...mockJobDetails,
  //         location: { city: 'Test City', state: 'Test State' }
  //     });
  //     expect(setErrorsMock).toHaveBeenCalledWith({
  //         ...mockErrors,
  //         location: ''
  //     });

  //     // Reset mocks
  //     setJobDetailsMock.mockClear();
  //     setErrorsMock.mockClear();

  //     // Render with location data to test removal
  //     const updatedJobDetails = {
  //         ...mockJobDetails,
  //         location: { city: 'Test City', state: 'Test State' }
  //     };

  //     const { rerender } = render(
  //         <JobPostInfoSection
  //             jobDetails={updatedJobDetails}
  //             setJobDetails={setJobDetailsMock}
  //             errors={mockErrors}
  //             setErrors={setErrorsMock}
  //         />
  //     );

  //     rerender(
  //         <JobPostInfoSection
  //             jobDetails={updatedJobDetails}
  //             setJobDetails={setJobDetailsMock}
  //             errors={mockErrors}
  //             setErrors={setErrorsMock}
  //         />
  //     );

  //     // Remove location
  //     const removeLocationBtn = screen.getByTestId('remove-location-btn');
  //     fireEvent.click(removeLocationBtn);

  //     expect(setJobDetailsMock).toHaveBeenCalledWith({
  //         ...updatedJobDetails,
  //         location: { city: 'Test City', state: 'Test State' }
  //     });
  // });

  it('allows selecting minimum qualification', async () => {
    const educationQualificationList = [
      { key: '12TH_PASS', value: '12th Pass' },
      { key: 'GRADUATE', value: 'Graduate' },
    ];

    render(
      <JobPostInfoSection
        jobDetails={mockJobDetails}
        setJobDetails={setJobDetailsMock}
        errors={mockErrors}
        setErrors={setErrorsMock}
        educationQualificationList={educationQualificationList}
      />,
    );

    const dropdownToggle = screen.getByTestId('dropdown-value');
    fireEvent.click(dropdownToggle);

    const qualificationOptions =
      await screen.findAllByTestId(/^dropdown-item-/);
    const targetOption = qualificationOptions.find(
      (option) => option.textContent === '12th Pass',
    );

    fireEvent.click(targetOption);

    expect(setJobDetailsMock).toHaveBeenCalledWith({
      ...mockJobDetails,
      minQualification: '12TH_PASS',
    });
  });

  it('no mandatory experience checkbox works correctly', () => {
    render(
      <JobPostInfoSection
        jobDetails={mockJobDetails}
        setJobDetails={setJobDetailsMock}
        errors={mockErrors}
        setErrors={setErrorsMock}
      />,
    );

    const noExpCheckbox = screen.getByRole('checkbox');

    fireEvent.click(noExpCheckbox);

    expect(setJobDetailsMock).toHaveBeenCalledWith({
      ...mockJobDetails,
      noMandatoryExperience: true,
      minExp: '',
      maxExp: '',
    });
    expect(setErrorsMock).toHaveBeenCalledWith({
      ...mockErrors,
      minExp: '',
    });
  });

  it('disables fields when job status is not DRAFT', () => {
    const publishedJobDetails = {
      ...mockJobDetails,
      status: 'PUBLISHED',
      noMandatoryExperience: true,
    };

    render(
      <JobPostInfoSection
        jobDetails={publishedJobDetails}
        setJobDetails={setJobDetailsMock}
        errors={mockErrors}
        setErrors={setErrorsMock}
      />,
    );

    expect(screen.getByPlaceholderText('Minimum Year')).toBeDisabled();
    expect(screen.getByPlaceholderText('Maximum Year')).toBeDisabled();
  });

  it('does not update fields when disabled', () => {
    const publishedJobDetails = {
      ...mockJobDetails,
      status: 'PUBLISHED',
      noMandatoryExperience: true,
    };

    render(
      <JobPostInfoSection
        jobDetails={publishedJobDetails}
        setJobDetails={setJobDetailsMock}
        errors={mockErrors}
        setErrors={setErrorsMock}
      />,
    );

    const plusButtons = screen.getAllByText('+');
    fireEvent.click(plusButtons[0]);

    expect(setJobDetailsMock).not.toHaveBeenCalled();
  });
});
