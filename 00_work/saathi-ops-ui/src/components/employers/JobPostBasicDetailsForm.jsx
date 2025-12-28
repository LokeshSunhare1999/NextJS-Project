import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import DrawerInput from '../common/DrawerInput';
import { DatePicker } from 'antd';
import ICONS from '../../assets/icons';
import dayjs from 'dayjs';

import { jobTypes } from '../../constants/employer';
import MultiSelectPill from '../common/MultiSelectPill';
import FileUpload from '../courses/FileUpload';
import { FILE_TYPES, MAX_IMAGE_API_TIMER } from '../../constants';
import useFileUpload from '../../hooks/useFileUpload';
import { generateUploadFilePath } from '../../utils/helper';

const Wrapper = styled.div`
  background-color: #ffffff;
  margin: 20px 0px;
  padding: 16px;
  border-radius: 10px;
`;

const Left = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
`;

const P = styled.p`
  color: #000;
  font-family: Poppins;
  margin: 8px 0px 0px 0px;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const Span = styled.span`
  color: ${(props) => (props.$color ? 'red' : '#000')};
  font-family: Poppins;
  font-size: ${(props) => props.$fontSize};
  font-style: normal;
  font-weight: ${(props) => props.$fontWeight};
  line-height: ${(props) => props.$lineHeight};
`;

const ContentGrid = styled.div`
  // width: calc(100% - 40px);
  margin: 10px 0px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  gap: 16px;
`;

const GridItem = styled.div`
  display: flex;
  flex-direction: column;
  width: calc(50% - 8px);
  width: ${(props) => (props.$width ? props.$width : 'calc(50% - 8px)')};
`;

const StyledDatePicker = styled(DatePicker)`
  padding: 10px 15px;
  margin: 10px 0px 0px 0px;
  border-radius: 8px;
  border: ${(props) =>
    props.$isError ? '1px solid red' : '1px solid #cdd4df'};
  background: #fff;
  cursor: pointer;
  opacity: ${(props) => props?.$opacity || '1'};
  input::placeholder {
    color: ${(props) => props.$placeholderColor || '#bfbfbf'};
    font-size: ${(props) => props.$placeholderFontSize || '14px'};
  }

  .ant-picker-input input::placeholder {
    color: ${(props) => props.$placeholderColor || '#bfbfbf'} !important;
  }
`;

const Img = styled.img`
  width: ${(props) => props.$width};
  height: ${(props) => props.$height};
  cursor: pointer;
`;

const JobPostBasicDetailsForm = ({
  employerName,
  title,
  jobDetails,
  setJobDetails,
  selectedPill,
  setSelectedPill,
  errors,
  jobCategories,
  agencyType,
  jobId,
}) => {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [tempImageDelete, setTempImageDelete] = useState(false);

  const {
    fileData: imageFileData,
    setFileData: setImageFileData,
    handleInputChange: handleImageInputChange,
    abortUpload: abortImageUpload,
    status: imageUploadStatus,
    isError: isImageUploadError,
    error: imageUploadError,
    data: imageUploadData,
    resetFileData: resetImageFileData,
  } = useFileUpload(
    generateUploadFilePath('BRAND_LOGO', jobId, FILE_TYPES?.IMAGE),
    FILE_TYPES?.IMAGE?.toUpperCase(),
  );

  useEffect(() => {
    if (imageUploadStatus === 'success') {
      setTempImageDelete(false);
      setJobDetails({
        ...jobDetails,
        jobEmployerLogo: imageUploadData?.fileLink,
      });
    }
  }, [imageUploadStatus]);

  const handleFieldUpdate = (field, value) => {
    if (field === 'noOfOpenings') {
      if (!/^\d*$/.test(value)) {
        return;
      }
    }
    setJobDetails((prev) => ({ ...prev, [field]: value }));
    setCategoryOpen(false);
  };

  const jobCategoryList =
    jobCategories?.map((category) => category?.value) || [];

  const handleJobCategorySelect = (value) => {
    const categoryEnum = jobCategories.find(
      (category) => category.value === value,
    )?.key;
    handleFieldUpdate('category', categoryEnum);
    setCategoryOpen(false);
  };

  const getJobCategoryValue = (key) => {
    const category = jobCategories.find((category) => category.key === key);
    return category?.value;
  };

  const handleInputDelete = () => {
    setImageFileData((prevImageFileData) => ({
      ...prevImageFileData,
      showProgress: false,
    }));
  };

  return (
    <Wrapper>
      <Left>
        <P $fontSize={'18px'} $fontWeight={'600'} $lineHeight={'27px'}>
          {title}
        </P>
        <P $fontSize={'16px'} $fontWeight={'400'} $lineHeight={'24px'}>
          Posting for{' '}
          <Span $fontSize={'16px'} $fontWeight={'600'} $lineHeight={'24px'}>
            {' '}
            {employerName ? employerName : '-----'}
          </Span>
        </P>
      </Left>
      {agencyType === 'RECRUITMENT_AGENCY' ? (
        <ContentGrid>
          <GridItem>
            <DrawerInput
              isManadatory={false}
              fieldType={'input'}
              fieldHeader={'Hiring For'}
              fieldPlaceholder={'Add the brand name you are hiring for'}
              fieldError={errors?.jobEmployerName}
              errorText={errors?.jobEmployerName}
              fieldValue={jobDetails?.jobEmployerName || ''}
              handleFieldChange={(e) =>
                handleFieldUpdate('jobEmployerName', e.target.value)
              }
            />
          </GridItem>
          <GridItem>
            <GridItem $width="200px">
              <DrawerInput
                fieldType={'children'}
                fieldHeader={'Upload Logo'}
                headerMargin={'8px 0 10px 0'}
              >
                <FileUpload
                  fileData={imageFileData}
                  fileType={FILE_TYPES?.IMAGE}
                  iconUrl={ICONS?.THUMBNAIL}
                  uploadTitle={'Upload Logo'}
                  acceptType={'image/*'}
                  handleInputChange={(e) => {
                    handleImageInputChange(e, FILE_TYPES?.IMAGE);
                  }}
                  handleInputDelete={handleInputDelete}
                  abortUpload={abortImageUpload}
                  maxApiTimer={MAX_IMAGE_API_TIMER}
                  uploadData={jobDetails?.brandLogo}
                  tempDelete={tempImageDelete}
                  setTempDelete={setTempImageDelete}
                />
              </DrawerInput>
            </GridItem>
          </GridItem>
        </ContentGrid>
      ) : null}
      <ContentGrid>
        <GridItem>
          <DrawerInput
            isManadatory={true}
            fieldType={'input'}
            fieldHeader={'Job Title'}
            fieldPlaceholder={'Enter Job Title'}
            fieldError={errors?.jobRole}
            errorText={errors?.jobRole}
            fieldValue={jobDetails?.jobRole || ''}
            handleFieldChange={(e) =>
              handleFieldUpdate('jobRole', e.target.value)
            }
          />
        </GridItem>
        <GridItem>
          <DrawerInput
            isManadatory={true}
            fieldType={'dropdown'}
            fieldHeader={'Category'}
            fieldError={errors?.category}
            errorText={errors?.category}
            fieldValue={
              getJobCategoryValue(jobDetails?.category) || 'Select Category'
            }
            handleDropDownSelect={(value) => handleJobCategorySelect(value)}
            dropDownOpen={categoryOpen}
            handleDropDownOpen={setCategoryOpen}
            dropDownList={jobCategoryList}
          />
        </GridItem>
      </ContentGrid>
      <ContentGrid>
        <GridItem>
          <DrawerInput
            fieldType={'input'}
            fieldHeader={'Number of openings'}
            fieldError={errors?.noOfOpenings}
            errorText={errors?.noOfOpenings}
            fieldPlaceholder={'Enter number of openings'}
            fieldValue={jobDetails?.noOfOpenings || ''}
            handleFieldChange={(e) =>
              handleFieldUpdate('noOfOpenings', e.target.value)
            }
            isManadatory={false}
          />
        </GridItem>
        <GridItem>
          <P $fontSize={'16px'} $fontWeight={'400'} $lineHeight={'24px'}>
            Job Expiry Date <Span style={{ color: 'red' }}>*</Span>
          </P>
          <StyledDatePicker
            value={
              jobDetails?.jobExpiryDate
                ? dayjs(jobDetails?.jobExpiryDate)
                : null
            }
            onChange={(date, dateString) => {
              if (date) {
                handleFieldUpdate('jobExpiryDate', date.format('D MMM YYYY'));
              }
            }}
            placeholder="Enter expiry date"
            $placeholderColor="#606C8599"
            $placeholderFontSize="14px"
            $isError={errors?.jobExpiryDate}
            format="D MMM YYYY"
            disabledDate={(current) => {
              return current && current < dayjs().startOf('day');
            }}
            suffixIcon={
              <Img
                src={ICONS.CALENDAR_ICON}
                $width={'16px'}
                $height={'16px'}
                alt="from-date"
              />
            }
          />
          {errors.jobExpiryDate ? (
            <Span
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
              $color={'red'}
            >
              {errors.jobExpiryDate}
            </Span>
          ) : null}
        </GridItem>
        <GridItem>
          <DrawerInput
            fieldType={'input'}
            fieldHeader={'Work Hours'}
            fieldError={errors?.workHours}
            errorText={errors?.workHours}
            fieldPlaceholder={'Enter work hours (9 AM - 6 PM)'}
            fieldValue={jobDetails?.workHours || ''}
            handleFieldChange={(e) =>
              handleFieldUpdate('workHours', e.target.value)
            }
            isManadatory={false}
          />
        </GridItem>
      </ContentGrid>
      <ContentGrid>
        <GridItem $width={'100%'}>
          <MultiSelectPill
            title="Type of Job"
            options={jobTypes}
            selectedOptions={selectedPill}
            setSelectedOptions={setSelectedPill}
            isMultiselect={false}
            isMandatory={true}
          />
          {errors.typeOfJob ? (
            <Span
              $fontSize={'14px'}
              $fontWeight={'300'}
              $lineHeight={'normal'}
              $color={'red'}
            >
              {errors.typeOfJob}
            </Span>
          ) : (
            ''
          )}
        </GridItem>
      </ContentGrid>
    </Wrapper>
  );
};

export default JobPostBasicDetailsForm;
