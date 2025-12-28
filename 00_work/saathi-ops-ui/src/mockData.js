export const rolesHeader = [
  {
    key: 'name',
    value: 'Role Name',
    sortable: false,
    filter: false,
    type: 'TEXT',
  },
  {
    key: 'description',
    value: 'Description',
    sortable: false,
    filter: false,
    type: 'TEXT',
  },
  {
    key: 'permissions',
    value: 'Permissions',
    sortable: false,
    filter: false,
    type: 'COMMA_SEPARATED_TEXT',
  },
];

export const userHeaderArray = [
  {
    key: 'name',
    value: 'User Name',
    sortable: false,
    filter: false,
    type: 'TEXT',
  },
  {
    key: 'loggedInUserContact.email',
    value: 'User Email',
    sortable: false,
    filter: false,
    type: 'TEXT',
  },
  {
    key: 'loggedInUserContact.phoneNo',
    value: 'User Phone',
    sortable: false,
    filter: false,
    type: 'TEXT',
  },
  {
    key: 'userRoles',
    value: 'User Roles',
    sortable: false,
    filter: false,
    type: 'COMMA_SEPARATED_TEXT',
  },
];

export const permissionsArray = [
  {
    key: 'name',
    value: 'Permission Name',
    sortable: false,
    filter: false,
    type: 'TEXT',
  },
  {
    key: 'description',
    value: 'Permission Description',
    sortable: false,
    filter: false,
    type: 'TEXT',
  },
  {
    key: 'type',
    value: 'Permission Type',
    sortable: false,
    filter: false,
    type: 'TEXT',
  },
  {
    key: 'access',
    value: 'Permission Access',
    sortable: false,
    filter: false,
    type: 'TEXT',
  },
];

export const employerHeaders = [
  {
    filter: true,
    key: 'companyName',
    sortable: false,
    type: 'TEXT',
    value: 'Company Name',
  },
  {
    filter: true,
    key: 'type',
    sortable: true,
    type: 'TEXT',
    value: 'Type',
  },
  {
    filter: true,
    key: 'size',
    sortable: true,
    type: 'NUMBER',
    value: 'Company Size',
  },
  {
    filter: true,
    key: 'emailId',
    sortable: true,
    type: 'TEXT',
    value: 'Email ID',
  },
  {
    filter: true,
    key: 'verification',
    sortable: true,
    type: 'DOCUMENT_VERIFICATION_TAG',
    value: 'Verification Status',
  },
  {
    filter: true,
    key: 'activation',
    sortable: true,
    type: 'DOCUMENT_VERIFICATION_TAG',
    value: 'Activation',
  },
];

export const employers = [
  {
    id: 1,
    companyName: 'ABC Private Ltd.',
    type: 'Pvt Ltd.',
    size: 10,
    emailId: 'aman.sharma@abc.in',
    verification: 'REJECTED',
    activation: 'ACTIVATED',
    GSTIN: {
      documentNo: '27AAECA1234F1ZV',
      updatedAt: '2023-01-12',
      verificationStatus: 'VERIFIED',
    },
    LLPIN: {
      documentNo: 'AAB-1234',
      updatedAt: '2022-11-10',
      verificationStatus: 'PENDING',
    },
    PAN: {
      documentNo: 'AAECA1234F',
      updatedAt: '2022-12-15',
      verificationStatus: 'VERIFIED',
    },
    CIN: {
      documentNo: 'U12345MH2010PTC123456',
      updatedAt: '2022-12-20',
      verificationStatus: 'VERIFIED',
    },
  },
  {
    id: 2,
    companyName: 'XYZ Technologies',
    type: 'LLC',
    size: 50,
    emailId: 'john.doe@xyztech.com',
    verification: 'VERIFIED',
    activation: 'ACTIVATED',
    GSTIN: {
      documentNo: '29ABCDE1234F1Z9',
      updatedAt: '2023-02-10',
      verificationStatus: 'VERIFIED',
    },
    LLPIN: {
      documentNo: 'AAB-5678',
      updatedAt: '2022-12-11',
      verificationStatus: 'VERIFIED',
    },
    PAN: {
      documentNo: 'ABCDE1234F',
      updatedAt: '2023-01-05',
      verificationStatus: 'VERIFIED',
    },
    CIN: {
      documentNo: 'U67890KA2005PTC123456',
      updatedAt: '2023-01-18',
      verificationStatus: 'PENDING',
    },
  },
  {
    id: 3,
    companyName: 'Global Corp.',
    type: 'LLP',
    size: 200,
    emailId: 'info@globalcorp.com',
    verification: 'PENDING',
    activation: 'PENDING',
    GSTIN: {
      documentNo: '22ABCDE6789F1Z6',
      updatedAt: '2023-03-01',
      verificationStatus: 'PENDING',
    },
    LLPIN: {
      documentNo: 'AAA-9876',
      updatedAt: '2023-01-20',
      verificationStatus: 'PENDING',
    },
    PAN: {
      documentNo: 'ABCDE6789F',
      updatedAt: '2023-02-15',
      verificationStatus: 'PENDING',
    },
    CIN: {
      documentNo: 'L98765UP2012PTC789123',
      updatedAt: '2023-02-20',
      verificationStatus: 'PENDING',
    },
  },
  {
    id: 4,
    companyName: 'Innovative Solutions',
    type: 'Proprietorship',
    size: 15,
    emailId: 'contact@innovative.com',
    verification: 'VERIFIED',
    activation: 'ACTIVATED',
    GSTIN: {
      documentNo: '24ABCDE1234G1Z5',
      updatedAt: '2023-04-12',
      verificationStatus: 'VERIFIED',
    },
    LLPIN: {
      documentNo: null,
      updatedAt: null,
      verificationStatus: 'NOT_REQUIRED',
    },
    PAN: {
      documentNo: 'ABCDE1234G',
      updatedAt: '2023-03-15',
      verificationStatus: 'VERIFIED',
    },
    CIN: {
      documentNo: null,
      updatedAt: null,
      verificationStatus: 'NOT_REQUIRED',
    },
  },
  {
    id: 5,
    companyName: 'Tech Masters',
    type: 'LLP',
    size: 30,
    emailId: 'support@techmasters.io',
    verification: 'REJECTED',
    activation: 'PENDING',
    GSTIN: {
      documentNo: '27ABCDE5678H1Z3',
      updatedAt: '2023-01-25',
      verificationStatus: 'REJECTED',
    },
    LLPIN: {
      documentNo: 'BBB-5432',
      updatedAt: '2023-02-11',
      verificationStatus: 'VERIFIED',
    },
    PAN: {
      documentNo: 'ABCDE5678H',
      updatedAt: '2023-02-12',
      verificationStatus: 'REJECTED',
    },
    CIN: {
      documentNo: 'U54321MH2008PTC456789',
      updatedAt: '2023-01-20',
      verificationStatus: 'REJECTED',
    },
  },
  {
    id: 6,
    companyName: 'Blue Sky Ventures',
    type: 'Partnership',
    size: 5,
    emailId: 'admin@bluesky.com',
    verification: 'VERIFIED',
    activation: 'ACTIVATED',
    GSTIN: {
      documentNo: '33ABCDE1234F1Z4',
      updatedAt: '2023-03-05',
      verificationStatus: 'VERIFIED',
    },
    LLPIN: {
      documentNo: null,
      updatedAt: null,
      verificationStatus: 'NOT_REQUIRED',
    },
    PAN: {
      documentNo: 'ABCDE1234F',
      updatedAt: '2023-02-20',
      verificationStatus: 'VERIFIED',
    },
    CIN: {
      documentNo: null,
      updatedAt: null,
      verificationStatus: 'NOT_REQUIRED',
    },
  },
  {
    id: 7,
    companyName: 'QuickFix IT Solutions',
    type: 'Pvt Ltd.',
    size: 25,
    emailId: 'support@quickfixit.com',
    verification: 'VERIFIED',
    activation: 'ACTIVATED',
    GSTIN: {
      documentNo: '27ABCDE8901F1Z6',
      updatedAt: '2023-03-10',
      verificationStatus: 'VERIFIED',
    },
    LLPIN: {
      documentNo: null,
      updatedAt: null,
      verificationStatus: 'NOT_REQUIRED',
    },
    PAN: {
      documentNo: 'ABCDE8901F',
      updatedAt: '2023-02-25',
      verificationStatus: 'VERIFIED',
    },
    CIN: {
      documentNo: 'U98765MH2005PTC987654',
      updatedAt: '2023-02-20',
      verificationStatus: 'VERIFIED',
    },
  },
  {
    id: 8,
    companyName: 'Elite Marketing Group',
    type: 'LLP',
    size: 100,
    emailId: 'info@elitemarketing.com',
    verification: 'PENDING',
    activation: 'PENDING',
    GSTIN: {
      documentNo: '29ABCDE2345G1Z3',
      updatedAt: '2023-01-30',
      verificationStatus: 'PENDING',
    },
    LLPIN: {
      documentNo: 'AAB-9876',
      updatedAt: '2023-02-01',
      verificationStatus: 'PENDING',
    },
    PAN: {
      documentNo: 'ABCDE2345G',
      updatedAt: '2023-01-20',
      verificationStatus: 'PENDING',
    },
    CIN: {
      documentNo: 'U87654KA2015PTC234567',
      updatedAt: '2023-01-25',
      verificationStatus: 'PENDING',
    },
  },
  {
    id: 9,
    companyName: 'Future Innovators',
    type: 'LLP',
    size: 75,
    emailId: 'contact@futureinnovators.io',
    verification: 'VERIFIED',
    activation: 'ACTIVATED',
    GSTIN: {
      documentNo: '27ABCDE3456F1Z7',
      updatedAt: '2023-02-20',
      verificationStatus: 'VERIFIED',
    },
    LLPIN: {
      documentNo: 'AAB-3456',
      updatedAt: '2023-03-10',
      verificationStatus: 'VERIFIED',
    },
    PAN: {
      documentNo: 'ABCDE3456F',
      updatedAt: '2023-03-01',
      verificationStatus: 'VERIFIED',
    },
    CIN: {
      documentNo: 'U34567MH2012PTC123789',
      updatedAt: '2023-02-15',
      verificationStatus: 'VERIFIED',
    },
  },
  {
    id: 10,
    companyName: 'Bright Ideas Pvt. Ltd.',
    type: 'Pvt Ltd.',
    size: 20,
    emailId: 'hr@brightideas.com',
    verification: 'REJECTED',
    activation: 'PENDING',
    GSTIN: {
      documentNo: '27ABCDE4567G1Z8',
      updatedAt: '2023-01-15',
      verificationStatus: 'REJECTED',
    },
    LLPIN: {
      documentNo: null,
      updatedAt: null,
      verificationStatus: 'NOT_REQUIRED',
    },
    PAN: {
      documentNo: 'ABCDE4567G',
      updatedAt: '2023-01-10',
      verificationStatus: 'REJECTED',
    },
    CIN: {
      documentNo: 'U45678MH2014PTC987654',
      updatedAt: '2023-01-05',
      verificationStatus: 'REJECTED',
    },
  },
];

export const employerDetails = {
  companyName: 'ABC Private Ltd.',
  accountId: 'abc-private-ltd',
};

export const staffDetails = {
  headers: [
    {
      key: '_id',
      value: 'Candidate ID',
      sortable: false,
      filter: false,
      type: 'ID',
    },
    {
      key: 'phone',
      value: 'Phone No',
      sortable: false,
      filter: false,
      type: 'TEXT',
    },
    {
      key: 'status',
      value: 'Status',
      sortable: false,
      filter: false,
      type: 'TEXT',
    },
  ],
  candidates: [
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231231',
      status: 'Active',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231232',
      status: 'Inactive',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231233',
      status: 'Active',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231234',
      status: 'Inactive',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231235',
      status: 'Active',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231236',
      status: 'Inactive',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231237',
      status: 'Active',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231238',
      status: 'Inactive',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231239',
      status: 'Active',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      phone: '1231231230',
      status: 'Inactive',
    },
  ],
};
export const businessVerification = [
  ['GSTIN', '987HGDSNU98KUGIJ', '20 May 2023', 'VERIFIED'],
  ['CIN', '987HGDSNU98KUGIJ', '20 May 2023', 'VERIFIED'],
  ['PAN', '987HGDSNU98KUGIJ', '20 May 2023', 'VERIFIED'],
  ['CLPIN ', '987HGDSNU98KUGIJ', '20 May 2023', 'REJECTED'],
];

export const bankDetails = [
  ['Amit Sharma', 'ICICI Bank', '123456789022', 'REJECTED'],
];
export const agreement = [['Yes', '09 March, 2024']];

export const referralDetails = {
  headers: [
    {
      key: '_id',
      value: 'Candidate ID',
      sortable: false,
      filter: false,
      type: 'ID',
    },
    {
      key: 'name',
      value: 'Candidate Name',
      sortable: false,
      filter: false,
      type: 'TEXT',
    },
    {
      key: 'phone',
      value: 'Phone No',
      sortable: false,
      filter: false,
      type: 'TEXT',
    },
    {
      key: 'earning',
      value: 'Earning',
      sortable: false,
      filter: false,
      type: 'AMOUNT',
    },
  ],
  candidates: [
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      name: 'John Doe',
      phone: '1231231231',
      earning: 100,
    },
  ],
};

export const referralWithdrawDetails = {
  headers: [
    {
      key: '_id',
      value: 'Txn. ID',
      sortable: false,
      filter: false,
      type: 'ID',
    },
    {
      key: 'date',
      value: 'Txn Date & Time',
      sortable: false,
      filter: false,
      type: 'DATE_TIME',
    },
    {
      key: 'amount',
      value: 'Amount',
      sortable: false,
      filter: false,
      type: 'AMOUNT',
    },
    {
      key: 'status',
      value: 'Status',
      sortable: false,
      filter: false,
      type: 'ORDER_STATUS',
    },
  ],
  transactions: [
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'TRANSFERRED',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'PENDING',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'REJECTED',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'PENDING',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'PENDING',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'PENDING',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'PENDING',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'PENDING',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'PENDING',
    },
    {
      _id: '66f145c325f8308bd6f108f4',
      date: '2024-09-26T08:52:15.760Z',
      amount: 5000,
      status: 'PENDING',
    },
  ],
};

export const referralAmountDetails = [
  {
    level: '1',
    amount: 100,
    count: 30,
  },
  {
    level: '2',
    amount: 50,
    count: 30,
  },
  {
    level: '3',
    amount: 5,
    count: 30,
  },
  {
    level: '4',
    amount: 5,
    count: 30,
  },
  {
    level: '5',
    amount: 5,
    count: 30,
  },
  {
    level: '6',
    amount: 5,
    count: 30,
  },
  {
    level: '7',
    amount: 5,
    count: 30,
  },
  {
    level: '8',
    amount: 5,
    count: 30,
  },
  {
    level: '9',
    amount: 5,
    count: 30,
  },
  {
    level: '10',
    amount: 5,
    count: 30,
  },
  {
    level: '11',
    amount: 5,
    count: 30,
  },
  {
    level: '12',
    amount: 5,
    count: 30,
  },
];

export const payoutRequests = {
  headers: [
    {
      key: 'id',
      value: 'Request ID',
      sortable: false,
      filter: false,
      type: 'ID',
    },
    {
      key: 'companyName',
      value: 'Company Name',
      sortable: false,
      filter: false,
      type: 'TEXT',
    },
    {
      key: 'date',
      value: 'Request Date',
      sortable: false,
      filter: false,
      type: 'DATE_TIME',
    },
    {
      key: 'status',
      value: 'Status',
      sortable: false,
      filter: false,
      type: 'ORDER_STATUS',
    },
  ],
  payouts: [
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'PENDING',
    },
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'APPROVED',
    },
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'DENIED',
    },
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'PENDING',
    },
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'PENDING',
    },
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'PENDING',
    },
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'PENDING',
    },
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'PENDING',
    },
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'PENDING',
    },
    {
      id: '66f145c325f8308bd6f108f4',
      companyName: 'ABC Private Ltd.',
      date: '2024-09-26T08:52:15.760Z',
      status: 'PENDING',
    },
  ],
  totalPayouts: 100,
};

export const jobReelData = {
  firstJobReelDetails: {
    customerBioDataVideo:
      'https://customer-biodata.s3.ap-south-1.amazonaws.com/68186391df5771a9dbdaa265_314968e5-31be-4765-a23d-010eab76897b.mp4',
    customerBioDataVideoVerificationStatus: 'VERIFIED',
    updatedAt: '2025-05-05T07:12:16.619Z',
    createdAt: '2025-05-05T07:11:42.035Z',
  },
  secondJobReelDetails: {
    customerBioDataVideo:
      'https://customer-biodata.s3.ap-south-1.amazonaws.com/68186391df5771a9dbdaa265_a2d3c606-017e-4972-9931-71f56e169a4f.mp4',
    customerBioDataVideoVerificationStatus: 'VERIFIED',
    createdAt: '2025-05-05T07:13:31.850Z',
  },
};
