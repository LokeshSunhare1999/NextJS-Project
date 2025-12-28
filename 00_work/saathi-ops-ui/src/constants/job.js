export const STATUS_CHECKBOXES = [
  { key: 'PUBLISHED', value: 'Published', checked: false },
  { key: 'PAUSED', value: 'Paused', checked: false },
  { key: 'EXPIRED', value: 'Expired', checked: false },
  { key: 'IN_REVIEW', value: 'In-Review', checked: false },
  { key: 'REJECTED', value: 'Rejected', checked: false },
  { key: 'DRAFT', value: 'Draft', checked: false },
];

export const CATEGORY_CHECKBOXES = [
  { key: 'STAFFING_AGENCY', value: 'Staffing', checked: false },
  { key: 'FACILITY_MANAGEMENT', value: 'Facility', checked: false },
  { key: 'RECRUITMENT_AGENCY', value: 'Recruitment Agency', checked: false },
  { key: 'DIRECT_EMPLOYER', value: 'Direct Employer', checked: false },
];

export const EMPLOYER_TYPES = [
  { key: 'RECRUITMENT_AGENCY', value: 'Recruitment Agency', checked: false },
  { key: 'DIRECT_EMPLOYER', value: 'Direct Employer', checked: false },
];

export const POSTEDBY_CHECKBOXES = [
  { key: 'AGENCY', value: 'Agency User', checked: false },
  { key: 'ADMIN', value: 'Saathi Admin', checked: false },
];

export const PAGE_SOURCE = {
  EMPLOYER_JOBS: 'employerJobs',
  ALL_JOBS: 'allJobs',
};
export const MIN_AGE = 14;

export const PROMPT_SAMPLE_CSV =
  'https://stage-temp-bucket.s3.ap-south-1.amazonaws.com/JOB_PROMPT_67d1471063493f36e31d11a8_DOCUMENT/Script_Sheet.xlsx';

export const INTERVIEW_SAMPLE_CSV =
  'https://stage-temp-bucket.s3.ap-south-1.amazonaws.com/JOB_QUESTION_67d1471063493f36e31d11a8_DOCUMENT/Interview_Questions.xlsx';
