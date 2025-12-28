export const BENEFIT_STRUCTURE = {
  salaryBenefit: '',
  trainingCertificate: '',
  trainingReward: '',
};

export const CERTIFICATE_BENEFIT_STRUCTURE = {
  salaryBenefit:
    'Possibility of a job with salary ranging between ₹35,000 to ₹45,000',
  trainingCertificate: 'Improved Saathi rating and get your Saathi biodata',
  trainingReward: 'Share seamlessly with friends and family ',
};

export const MEDAL_BENEFIT_STRUCTURE = {
  salaryBenefit:
    'The Saathi Badge will appear on your True ID for employers to see.',
  trainingCertificate:
    'Winning the Saathi Badge will make it easier to get a job',
  trainingReward: 'Share seamlessly with friends and family ',
};

export const TEST_MODULE = {
  REWARD_STRUCTURE: ['medalBenefits', 'certificateBenefits'],

  TEST_OBJ_STRUCTURE: {
    testName: '',
    testDescription: '',
    testCategory: [],
    testSkills: [],
    testPricing: {
      displayPrice: 0,
      actualPrice: 0,
    },
    // salaryBenefits: '',
    salaryRange: '',
    testIntroVideo: '',
    imageUrl: '',
    certificateBenefits: BENEFIT_STRUCTURE,
    medalBenefits: BENEFIT_STRUCTURE,
  },

  TEST_OBJ_ERROR_STRUCTURE: {
    testName: false,
    // testDescription: false,
    testCategory: false,
    testSkills: false,
    actualPrice: false,
    displayPrice: false,
    // salaryBenefits: false,
    salaryRange: false,
  },

  PAGE_SIZE_OPTIUONS: [10, 20, 30, 40],

  TITLE_MAX_LENGTH: 500,
  DESCRIPTION_MAX_LENGTH: 2000,
  ACTUAL_PRICE_MAX: 10000,
  DISPLAY_PRICE_MAX: 10000,

  DEFAULT_MAX: 500,
  DEFAULT_MIN: 0,

  PASSING_PERCENT: 0,
  DEFAULT_TIME_DIFF: 13,
};
