import { useEffect, useState } from 'react';

export const useParseApplicantDetails = (applicantDetails) => {
  const [statusMap, setStatusMap] = useState({});

  useEffect(() => {
    Object.keys(applicantDetails?.applicationStatus || {}).map((key) => {
      const data = applicantDetails?.applicationStatus[key];
      setStatusMap((prevState) => ({
        ...prevState,
        [key]: {
          ...data,
          nextPossibleStates: data?.nextPossibleStates || [],
        },
      }));
    });
  }, [applicantDetails]);

  const applicantBioData = {
    name: applicantDetails?.customerDetails?.name || '-----',
    'Job ID': applicantDetails?.job?.uniqueJobId || '-----',
    phoneNumber:
      applicantDetails?.customerDetails?.primaryContact?.dialCode +
      applicantDetails?.customerDetails?.primaryContact?.phoneNo,
    employer: applicantDetails?.job?.employerName || '-----',
    jobTitle: applicantDetails?.job?.title || '-----',
    interviewScore: applicantDetails?.interviewDetails?.totalScore || 0,
    biodataVideoLink:
      applicantDetails?.biodataDetails?.customerBioDataVideo || '-----',
    interviewVideoLink:
      applicantDetails?.interviewDetails?.interviewLink || '-----',
  };

  const jobStatus = applicantDetails?.status || '-----';
  return { applicantBioData, jobStatus, statusMap };
};
